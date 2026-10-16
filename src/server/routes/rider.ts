import type { IncomingMessage, ServerResponse } from "node:http";
import { pool, isPostgresAvailable } from "../db";
import { parseBody, sendJson } from "./http";
import { requireRole, AuthError, type SessionUser } from "./session";

const FASTAPI_URL = process.env["FASTAPI_LOGISTICS_URL"] || "http://127.0.0.1:8000";

const statusMap = {
  PICKED_UP: "picked_up",
  IN_TRANSIT: "in_transit",
  DELIVERED: "delivered",
} as const;

type RiderStatus = keyof typeof statusMap;

// Legal status transitions mapping
const LEGAL_TRANSITIONS: Record<string, string[]> = {
  ready_for_pickup: ["rider_assigned", "picked_up"],
  rider_assigned: ["picked_up"],
  picked_up: ["in_transit"],
  in_transit: ["delivered"],
  delivered: [],
  cancelled: [],
};

// In-memory rate limiting map for rider GPS updates (1 update per second per rider)
const riderLocationRateLimitMap = new Map<string, number>();

export async function handleRoute(
  req: IncomingMessage,
  res: ServerResponse,
  cleanUrl: string,
  method: string | undefined,
): Promise<boolean> {
  // Only handle /api/rider/* routes
  if (!cleanUrl.startsWith("/api/rider/")) {
    return false;
  }

  // TASK B: Require role 'rider' on all rider endpoints and derive identity ONLY from session
  let sessionUser: SessionUser;
  try {
    sessionUser = await requireRole(req, "rider", res);
  } catch (err) {
    if (err instanceof AuthError) {
      return true;
    }
    throw err;
  }

  const riderId = sessionUser.id;

  // ====================================================================
  // 1. Rider Location GPS Stream
  // ====================================================================
  if (cleanUrl === "/api/rider/location" && method === "POST") {
    let body: any = {};
    try {
      body = await parseBody(req);
    } catch {
      return sendJson(res, 400, { success: false, error: "Invalid JSON body." });
    }

    // Security check: Ignore client-supplied rider_id. If someone attempts to submit location for another rider, reject 403
    if (body.rider_id && body.rider_id !== riderId) {
      return sendJson(res, 403, {
        success: false,
        error: "Forbidden: Cannot submit location for another rider.",
      });
    }

    // Coordinate validation: latitude (-90 to 90) and longitude (-180 to 180) as valid numbers
    const rawLat = body.lat ?? body.latitude;
    const rawLng = body.lng ?? body.longitude;
    if (rawLat === undefined || rawLat === null || rawLng === undefined || rawLng === null) {
      return sendJson(res, 400, {
        success: false,
        error: "Latitude and longitude are required.",
      });
    }

    const lat = Number(rawLat);
    const lng = Number(rawLng);
    if (typeof lat !== "number" || isNaN(lat) || lat < -90 || lat > 90) {
      return sendJson(res, 400, {
        success: false,
        error: "Latitude must be a valid number between -90 and 90.",
      });
    }
    if (typeof lng !== "number" || isNaN(lng) || lng < -180 || lng > 180) {
      return sendJson(res, 400, {
        success: false,
        error: "Longitude must be a valid number between -180 and 180.",
      });
    }

    // Rate limiting: 1 update per second per rider
    const now = Date.now();
    const lastUpdate = riderLocationRateLimitMap.get(riderId);
    if (lastUpdate && now - lastUpdate < 1000) {
      return sendJson(res, 429, {
        success: false,
        error: "Rate limit exceeded. Maximum 1 location update per second.",
      });
    }
    riderLocationRateLimitMap.set(riderId, now);

    const inputDeliveryId = body.delivery_id || body.deliveryId || "";
    let activeDeliveryId = inputDeliveryId;

    // Delivery verification: check if delivery belongs to this session rider and is active
    if (isPostgresAvailable) {
      try {
        if (inputDeliveryId) {
          const dRes = await pool.query(
            `SELECT id, rider_id, status FROM deliveries WHERE (id = $1 OR order_id = $1) LIMIT 1`,
            [inputDeliveryId],
          );
          const del = dRes.rows[0];
          if (del) {
            // Must belong to this session rider
            if (del.rider_id && del.rider_id !== riderId) {
              return sendJson(res, 403, {
                success: false,
                error: "Forbidden: Delivery belongs to another rider.",
              });
            }
            // Must be an active delivery
            if (del.status === "delivered" || del.status === "cancelled") {
              return sendJson(res, 400, {
                success: false,
                error: "Delivery is already completed or cancelled.",
              });
            }
            activeDeliveryId = del.id;
          }
        } else {
          // If no delivery specified, find active delivery assigned to this rider
          const dRes = await pool.query(
            `SELECT id FROM deliveries 
             WHERE rider_id = $1 AND status IN ('ready_for_pickup', 'rider_assigned', 'picked_up', 'in_transit')
             ORDER BY updated_at DESC LIMIT 1`,
            [riderId],
          );
          if (dRes.rows[0]) {
            activeDeliveryId = dRes.rows[0].id;
          }
        }
      } catch (err: any) {
        console.warn("[Rider Location] Delivery verification query error:", err.message);
      }
    }

    const heading = body.heading != null ? Number(body.heading) : 0;
    const speed = body.speed != null ? Number(body.speed) : 0;
    const accuracy = body.accuracy != null ? Number(body.accuracy) : 10;
    const timestamp = body.timestamp ? new Date(body.timestamp).toISOString() : new Date().toISOString();

    // Forward to FastAPI Logistics backend
    let fastapiAccepted = false;
    try {
      const fastApiPayload = {
        latitude: lat,
        longitude: lng,
        heading_degrees: heading,
        speed_kmh: speed,
        accuracy_meters: accuracy,
        delivery_id: activeDeliveryId,
        timestamp,
      };

      const fastRes = await fetch(`${FASTAPI_URL}/api/riders/${encodeURIComponent(riderId)}/location`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": riderId,
          "X-User-Role": "rider",
        },
        body: JSON.stringify(fastApiPayload),
      });

      if (fastRes.ok) {
        fastapiAccepted = true;
      } else {
        const errText = await fastRes.text().catch(() => "");
        console.warn("[Rider Location] FastAPI responded non-ok:", fastRes.status, errText);
      }
    } catch (err: any) {
      console.warn("[Rider Location] FastAPI forward error:", err.message);
    }

    // Update only the session rider's active delivery in PostgreSQL
    if (isPostgresAvailable && activeDeliveryId) {
      try {
        await pool.query(
          `UPDATE deliveries
              SET rider_current_lat = $1,
                  rider_current_lng = $2,
                  updated_at = now()
            WHERE id = $3 AND (rider_id = $4 OR rider_id IS NULL)`,
          [lat, lng, activeDeliveryId, riderId],
        );
      } catch (err: any) {
        console.warn("[Rider Location] PostgreSQL update error:", err.message);
      }
    }

    return sendJson(res, 200, {
      success: true,
      rider_id: riderId,
      delivery_id: activeDeliveryId,
      lat,
      lng,
      fastapi_synced: fastapiAccepted,
    });
  }

  // ====================================================================
  // 2. GET /api/rider/deliveries
  // ====================================================================
  if (cleanUrl === "/api/rider/deliveries" && method === "GET") {
    // 1. Try FastAPI Logistics backend first
    try {
      const fastRes = await fetch(`${FASTAPI_URL}/api/deliveries?limit=50`);
      if (fastRes.ok) {
        const data = await fastRes.json();
        const items = data.items || [];
        // Filter strictly for this rider or unassigned available pickups
        const forRider = items.filter(
          (d: any) =>
            d.assigned_rider_id === riderId ||
            d.assigned_rider?.id === riderId ||
            (!d.assigned_rider_id && d.status === "ready_for_pickup"),
        );
        const mapped = forRider.map((d: any) => ({
          id: d.id,
          order_id: d.order_id,
          order_number: d.order_id || d.id,
          status: d.status,
          pickup_address: d.pickup_address,
          dropoff_address: d.dropoff_address,
          assigned_at: d.created_at,
          picked_up_at: d.created_at,
          delivered_at: null,
          total_amount: 1499,
          order_status: d.status,
        }));
        return sendJson(res, 200, { success: true, data: mapped });
      }
    } catch (err: any) {
      console.warn("[Rider Deliveries] FastAPI fetch error:", err.message);
    }

    // 2. Fallback to PostgreSQL if available
    if (isPostgresAvailable) {
      try {
        const result = await pool.query(
          `SELECT d.id, d.order_id, d.status, d.pickup_address, d.dropoff_address,
                  d.assigned_at, d.picked_up_at, d.delivered_at,
                  o.order_number, o.total_amount, COALESCE(o.status, o.order_status) AS order_status
             FROM deliveries d
             JOIN orders o ON o.id = d.order_id
            WHERE d.rider_id = $1 OR (d.rider_id IS NULL AND d.status = 'ready_for_pickup')
            ORDER BY d.assigned_at DESC NULLS LAST, d.updated_at DESC`,
          [riderId],
        );
        return sendJson(res, 200, { success: true, data: result.rows });
      } catch (err: any) {
        console.warn("[Rider Deliveries] PostgreSQL error:", err.message);
      }
    }

    return sendJson(res, 200, {
      success: true,
      data: [],
    });
  }

  // ====================================================================
  // 3. PATCH /api/rider/deliveries/:id
  // ====================================================================
  const match = cleanUrl.match(/^\/api\/rider\/deliveries\/([^/]+)$/);
  if (match && method === "PATCH") {
    let body: { status?: string };
    try {
      body = await parseBody(req);
    } catch {
      return sendJson(res, 400, { success: false, error: "Request body must be valid JSON." });
    }

    const nextStatus = body.status?.toUpperCase() as RiderStatus | undefined;
    if (!nextStatus || !Object.hasOwn(statusMap, nextStatus)) {
      return sendJson(res, 400, {
        success: false,
        error: "Status must be PICKED_UP, IN_TRANSIT, or DELIVERED.",
      });
    }

    let deliveryId: string;
    try {
      deliveryId = decodeURIComponent(match[1]);
    } catch {
      return sendJson(res, 400, { success: false, error: "Invalid delivery reference." });
    }

    const nextDbStatus = statusMap[nextStatus];

    // Verification in database: delivery exists, belongs to rider (or unassigned), and transition is legal
    if (isPostgresAvailable) {
      try {
        const dRes = await pool.query(`SELECT id, rider_id, status FROM deliveries WHERE id = $1`, [deliveryId]);
        const delivery = dRes.rows[0];
        if (!delivery) {
          return sendJson(res, 404, { success: false, error: "Delivery not found." });
        }

        // Must belong to this rider (or if ready_for_pickup, can be accepted by this rider)
        if (delivery.rider_id && delivery.rider_id !== riderId) {
          return sendJson(res, 403, {
            success: false,
            error: "Forbidden: Delivery belongs to another rider.",
          });
        }

        // Legal status transition verification
        const currentDbStatus = (delivery.status || "").toLowerCase();
        const allowedNext = LEGAL_TRANSITIONS[currentDbStatus] || [];
        if (!allowedNext.includes(nextDbStatus)) {
          return sendJson(res, 400, {
            success: false,
            error: `Illegal status transition from '${currentDbStatus}' to '${nextDbStatus}'.`,
          });
        }

        // Apply transition atomically in PostgreSQL
        const client = await pool.connect();
        try {
          await client.query("BEGIN");
          await client.query(
            `UPDATE deliveries
                SET status = $1,
                    rider_id = $2,
                    assigned_at = COALESCE(assigned_at, now()),
                    picked_up_at = CASE WHEN $1 = 'picked_up' THEN now() ELSE picked_up_at END,
                    delivered_at = CASE WHEN $1 = 'delivered' THEN now() ELSE delivered_at END,
                    updated_at = now()
              WHERE id = $3`,
            [nextDbStatus, riderId, deliveryId],
          );
          await client.query(
            `UPDATE orders
                SET status = $1, updated_at = now()
              WHERE id = (SELECT order_id FROM deliveries WHERE id = $2)`,
            [nextDbStatus, deliveryId],
          );
          await client.query("COMMIT");
        } catch (e) {
          await client.query("ROLLBACK").catch(() => undefined);
          throw e;
        } finally {
          client.release();
        }
      } catch (err: any) {
        console.warn("[Rider Status] PostgreSQL error:", err.message);
        return sendJson(res, 500, { success: false, error: err.message });
      }
    }

    // Forward state transition to FastAPI Logistics backend
    try {
      const fastRes = await fetch(`${FASTAPI_URL}/api/deliveries/${encodeURIComponent(deliveryId)}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": riderId,
          "X-User-Role": "rider",
        },
        body: JSON.stringify({
          status: nextDbStatus,
          reason: `Rider advanced status to ${nextStatus}`,
          actor_id: riderId,
          actor_role: "rider",
        }),
      });
      if (!fastRes.ok) {
        console.warn("[Rider Status] FastAPI update non-200:", fastRes.status);
      }
    } catch (err: any) {
      console.warn("[Rider Status] FastAPI error:", err.message);
    }

    return sendJson(res, 200, {
      success: true,
      data: { id: deliveryId, status: nextStatus },
    });
  }

  return sendJson(res, 405, {
    success: false,
    error: "Use GET /api/rider/deliveries, POST /api/rider/location, or PATCH /api/rider/deliveries/:id.",
  });
}

