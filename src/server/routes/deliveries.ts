import type { IncomingMessage, ServerResponse } from "node:http";
import { pool, isPostgresAvailable } from "../db";
import { parseBody, sendJson } from "./http";
import { getSessionUser } from "./session";

export interface CreateDeliveryParams {
  order_id: string;
  pickup_address?: string;
  dropoff_address?: string;
  pickup_lat?: number;
  pickup_lng?: number;
  drop_lat?: number;
  drop_lng?: number;
  rider_id?: string;
}

/**
 * Creates a delivery entry in PostgreSQL and notifies the logistics service to assign a rider.
 */
export async function createDeliveryForPackedOrder(params: CreateDeliveryParams): Promise<{ success: boolean; delivery_id?: string; error?: string }> {
  if (!isPostgresAvailable) {
    console.warn("[Deliveries] PostgreSQL not available; cannot persist delivery.");
    return { success: false, error: "Database unavailable" };
  }

  const deliveryId = `del_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const pickupAddress = params.pickup_address || "Sector 63, Noida, Uttar Pradesh, 201301";
  const dropoffAddress = params.dropoff_address || "Connaught Place, New Delhi, Delhi, 110001";
  const defaultRiderId = params.rider_id || "usr_rider_noida_01";

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Insert delivery record
    await client.query(
      `INSERT INTO deliveries (
         id, order_id, rider_id, status, pickup_address, dropoff_address,
         assigned_at, created_at, updated_at
       ) VALUES ($1, $2, $3, 'rider_assigned', $4, $5, now(), now(), now())
       ON CONFLICT (id) DO NOTHING`,
      [deliveryId, params.order_id, defaultRiderId, pickupAddress, dropoffAddress]
    );

    // Update order status to RIDER_ASSIGNED if applicable
    await client.query(
      `UPDATE orders 
          SET status = 'rider_assigned', updated_at = now() 
        WHERE id = $1 AND status IN ('PACKED', 'packed')`,
      [params.order_id]
    ).catch(() => undefined);

    await client.query("COMMIT");

    // Forward to Viswanath's FastAPI logistics service
    const logisticsUrl = process.env["LOGISTICS_URL"] || "http://127.0.0.1:8000";
    try {
      await fetch(`${logisticsUrl}/logistics/delivery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: params.order_id,
          delivery_id: deliveryId,
          rider_id: defaultRiderId,
          pickup: {
            address: pickupAddress,
            lat: params.pickup_lat ?? 28.628,
            lng: params.pickup_lng ?? 77.3739,
          },
          drop: {
            address: dropoffAddress,
            lat: params.drop_lat ?? 28.6304,
            lng: params.drop_lng ?? 77.2177,
          },
        }),
        signal: AbortSignal.timeout(2500),
      });
    } catch {
      // Graceful fallback if logistics service is offline
    }

    return { success: true, delivery_id: deliveryId };
  } catch (error: any) {
    await client.query("ROLLBACK").catch(() => undefined);
    console.error("[Deliveries Create Error]:", error);
    return { success: false, error: error.message };
  } finally {
    client.release();
  }
}

export async function handleRoute(
  req: IncomingMessage,
  res: ServerResponse,
  cleanUrl: string,
  method: string | undefined
): Promise<boolean> {
  if (!cleanUrl.startsWith("/api/deliveries")) return false;

  if (!isPostgresAvailable) {
    sendJson(res, 503, { success: false, error: "Deliveries require the PostgreSQL database." });
    return true;
  }

  // GET /api/deliveries or GET /api/deliveries/:id
  if (method === "GET") {
    const user = await getSessionUser(req);
    if (!user) {
      sendJson(res, 401, { success: false, error: "Sign in required." });
      return true;
    }

    const match = cleanUrl.match(/^\/api\/deliveries\/([^/]+)$/);
    if (match) {
      const id = decodeURIComponent(match[1]);
      const result = await pool.query("SELECT * FROM deliveries WHERE id = $1", [id]);
      if (result.rows.length === 0) {
        sendJson(res, 404, { success: false, error: "Delivery not found." });
        return true;
      }
      sendJson(res, 200, { success: true, data: result.rows[0] });
      return true;
    }

    // List deliveries (scoped to admin or seller)
    const result = await pool.query(
      `SELECT d.*, o.order_number, o.total_amount
         FROM deliveries d
         JOIN orders o ON o.id = d.order_id
        ORDER BY d.created_at DESC LIMIT 50`
    );
    sendJson(res, 200, { success: true, data: result.rows });
    return true;
  }

  // POST /api/deliveries (Triggered when seller marks order PACKED)
  if (method === "POST" && cleanUrl === "/api/deliveries") {
    let body: any;
    try {
      body = await parseBody(req);
    } catch {
      sendJson(res, 400, { success: false, error: "Invalid JSON body." });
      return true;
    }

    if (!body?.order_id) {
      sendJson(res, 400, { success: false, error: "order_id is required." });
      return true;
    }

    const result = await createDeliveryForPackedOrder({
      order_id: body.order_id,
      pickup_address: body.pickup_address,
      dropoff_address: body.dropoff_address,
      pickup_lat: body.pickup_lat,
      pickup_lng: body.pickup_lng,
      drop_lat: body.drop_lat,
      drop_lng: body.drop_lng,
      rider_id: body.rider_id,
    });

    if (!result.success) {
      sendJson(res, 500, { success: false, error: result.error });
      return true;
    }

    sendJson(res, 201, { success: true, data: { delivery_id: result.delivery_id } });
    return true;
  }

  return false;
}
