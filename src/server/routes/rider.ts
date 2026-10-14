import type { IncomingMessage, ServerResponse } from "node:http";
import { pool, isPostgresAvailable } from "../db";
import { parseBody, sendJson } from "./http";
import { getSessionUser } from "./session";

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
  if (!cleanUrl.startsWith("/api/rider/deliveries")) return false;
  if (!isPostgresAvailable) {
    sendJson(res, 503, { success: false, error: "Rider deliveries require the PostgreSQL database." });
    return true;
  }

  const user = await getSessionUser(req);
  if (!user) {
    sendJson(res, 401, { success: false, error: "Sign in to access rider deliveries." });
    return true;
  }
  if (user.role !== "rider") {
    sendJson(res, 403, { success: false, error: "Rider access is required." });
    return true;
  }

  if (cleanUrl === "/api/rider/deliveries" && method === "GET") {
    const result = await pool.query(
      `SELECT d.id, d.order_id, d.status, d.pickup_address, d.dropoff_address,
              d.assigned_at, d.picked_up_at, d.delivered_at,
              o.order_number, o.total_amount, o.status AS order_status
         FROM deliveries d
         JOIN orders o ON o.id = d.order_id
        WHERE d.rider_id = $1
        ORDER BY d.assigned_at DESC NULLS LAST, d.updated_at DESC`,
      [user.id],
    );
    sendJson(res, 200, { success: true, data: result.rows });
    return true;
  }

  const match = cleanUrl.match(/^\/api\/rider\/deliveries\/([^/]+)$/);
  if (!match || method !== "PATCH") {
    sendJson(res, 405, { success: false, error: "Use GET /api/rider/deliveries or PATCH /api/rider/deliveries/:id." });
    return true;
  }

  let body: { status?: string };
  try {
    body = await parseBody(req);
  } catch {
    sendJson(res, 400, { success: false, error: "Request body must be valid JSON." });
    return true;
  }

  const nextStatus = body.status?.toUpperCase() as RiderStatus | undefined;
  if (!nextStatus || !Object.hasOwn(statusMap, nextStatus)) {
    sendJson(res, 400, { success: false, error: "Status must be PICKED_UP, IN_TRANSIT, or DELIVERED." });
    return true;
  }

  let deliveryId: string;
  try {
    deliveryId = decodeURIComponent(match[1]);
  } catch {
    sendJson(res, 400, { success: false, error: "Invalid delivery reference." });
    return true;
  }
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const currentResult = await client.query<{ id: string; order_id: string; status: string }>(
      "SELECT id, order_id, status FROM deliveries WHERE id = $1 AND rider_id = $2 FOR UPDATE",
      [deliveryId, user.id],
    );
    const current = currentResult.rows[0];
    if (!current) {
      await client.query("ROLLBACK");
      sendJson(res, 404, { success: false, error: "Assigned delivery not found." });
      return true;
    }

    const allowed: Record<RiderStatus, string[]> = {
      PICKED_UP: ["ready_for_pickup", "rider_assigned"],
      IN_TRANSIT: ["picked_up"],
      DELIVERED: ["in_transit"],
    };
    if (!allowed[nextStatus].includes(current.status)) {
      await client.query("ROLLBACK");
      sendJson(res, 409, { success: false, error: `Cannot move a ${current.status} delivery to ${nextStatus}.` });
      return true;
    }

    const nextDbStatus = statusMap[nextStatus];
    await client.query(
      `UPDATE deliveries
          SET status = $1,
              picked_up_at = CASE WHEN $1 = 'picked_up' THEN now() ELSE picked_up_at END,
              delivered_at = CASE WHEN $1 = 'delivered' THEN now() ELSE delivered_at END,
              updated_at = now()
        WHERE id = $2 AND rider_id = $3`,
      [nextDbStatus, deliveryId, user.id],
    );
    await client.query("UPDATE orders SET status = $1, updated_at = now() WHERE id = $2", [nextDbStatus, current.order_id]);
    await client.query("COMMIT");
    sendJson(res, 200, { success: true, data: { id: deliveryId, order_id: current.order_id, status: nextStatus } });
    return true;
  } catch (error) {
    await client.query("ROLLBACK").catch(() => undefined);
    console.error("[Rider Delivery API Error]", error);
    sendJson(res, 500, { success: false, error: "Could not update this delivery." });
    return true;
  } finally {
    client.release();
  }
}
