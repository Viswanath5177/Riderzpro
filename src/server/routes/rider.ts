import type { IncomingMessage, ServerResponse } from "node:http";
import { pool, isPostgresAvailable } from "../db";
import { parseBody, sendJson } from "./http";
import { getSessionUser } from "./session";

const FASTAPI_URL = process.env["FASTAPI_LOGISTICS_URL"] || "http://127.0.0.1:8000";

const statusMap = {
  PICKED_UP: "picked_up",
  IN_TRANSIT: "in_transit",
  DELIVERED: "delivered",
} as const;

type RiderStatus = keyof typeof statusMap;

export async function handleRoute(
  req: IncomingMessage,
  res: ServerResponse,
  cleanUrl: string,
  method: string | undefined,
): Promise<boolean> {
  // 1. Rider Location GPS Stream
  if (cleanUrl === "/api/rider/location" && method === "POST") {
    let body: any = {};
    try {
      body = await parseBody(req);
    } catch {
      return sendJson(res, 400, { success: false, error: "Invalid JSON body." });
    }

    const sessionUser = await getSessionUser(req);
    const riderId = sessionUser?.id || body.rider_id || "";
    const deliveryId = body.delivery_id || body.deliveryId || "";
    const lat = Number(body.lat ?? body.latitude ?? 16.5062);
    const lng = Number(body.lng ?? body.longitude ?? 80.6480);
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
        delivery_id: deliveryId,
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

    // Also update PostgreSQL if available
    if (isPostgresAvailable) {
      try {
        await pool.query(
          `UPDATE deliveries
              SET rider_current_lat = $1,
                  rider_current_lng = $2,
                  updated_at = now()
            WHERE (id = $3 OR order_id = $3)`,
          [lat, lng, deliveryId],
        );
      } catch (err: any) {
        console.warn("[Rider Location] PostgreSQL update error:", err.message);
      }
    }

    return sendJson(res, 200, {
      success: true,
      rider_id: riderId,
      delivery_id: deliveryId,
      lat,
      lng,
      fastapi_synced: fastapiAccepted,
    });
  }

  // 2. Rider Deliveries Routes
  if (!cleanUrl.startsWith("/api/rider/deliveries")) return false;

  const sessionUser = await getSessionUser(req);
  const riderId = sessionUser?.id || "rider_sathesh";
  if (cleanUrl === "/api/rider/deliveries" && method === "GET") {
    // 1. Try FastAPI Logistics backend first
    try {
      const fastRes = await fetch(`${FASTAPI_URL}/api/deliveries?limit=50`);
      if (fastRes.ok) {
        const data = await fastRes.json();
        const items = data.items || [];
        // Filter for this rider or all active if none assigned specifically
        const forRider = items.filter(
          (d: any) =>
            d.assigned_rider_id === riderId ||
            d.assigned_rider?.id === riderId ||
            d.status === "ready_for_pickup" ||
            d.status === "in_transit" ||
            d.status === "picked_up"
        );
        const mapped = (forRider.length > 0 ? forRider : items).map((d: any) => ({
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
                  o.order_number, o.total_amount, o.status AS order_status
             FROM deliveries d
             JOIN orders o ON o.id = d.order_id
            WHERE d.rider_id = $1 OR d.status = 'ready_for_pickup'
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

  // PATCH /api/rider/deliveries/:id
  const match = cleanUrl.match(/^\/api\/rider\/deliveries\/([^/]+)$/);
  if (!match || method !== "PATCH") {
    return sendJson(res, 405, { success: false, error: "Use GET /api/rider/deliveries or PATCH /api/rider/deliveries/:id." });
  }

  let body: { status?: string };
  try {
    body = await parseBody(req);
  } catch {
    return sendJson(res, 400, { success: false, error: "Request body must be valid JSON." });
  }

  const nextStatus = body.status?.toUpperCase() as RiderStatus | undefined;
  if (!nextStatus || !Object.hasOwn(statusMap, nextStatus)) {
    return sendJson(res, 400, { success: false, error: "Status must be PICKED_UP, IN_TRANSIT, or DELIVERED." });
  }

  let deliveryId: string;
  try {
    deliveryId = decodeURIComponent(match[1]);
  } catch {
    return sendJson(res, 400, { success: false, error: "Invalid delivery reference." });
  }

  const nextDbStatus = statusMap[nextStatus];

  // 1. Forward state transition to FastAPI Logistics backend
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

  // 2. Synchronize PostgreSQL if available
  if (isPostgresAvailable) {
    try {
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        await client.query(
          `UPDATE deliveries
              SET status = $1,
                  picked_up_at = CASE WHEN $1 = 'picked_up' THEN now() ELSE picked_up_at END,
                  delivered_at = CASE WHEN $1 = 'delivered' THEN now() ELSE delivered_at END,
                  updated_at = now()
            WHERE id = $2`,
          [nextDbStatus, deliveryId],
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
      } finally {
        client.release();
      }
    } catch (err: any) {
      console.warn("[Rider Status] PostgreSQL sync error:", err.message);
    }
  }

  return sendJson(res, 200, {
    success: true,
    data: { id: deliveryId, status: nextStatus },
  });
}
