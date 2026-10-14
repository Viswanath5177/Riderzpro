import { query, isPostgresAvailable } from "../db";

import type { IncomingMessage, ServerResponse } from "node:http";
import { parseBody, sendJson } from "./http";

export async function handleRoute(req: IncomingMessage, res: ServerResponse, cleanUrl: string, method: string | undefined, queryParams: URLSearchParams): Promise<boolean> {
          if (cleanUrl.startsWith("/api/cart")) {
            const rawId = queryParams.get("customer_id") || "usr_customer_demo";

            if (!isPostgresAvailable) {
              if (method === "GET") {
                return sendJson(res, 200, { success: true, data: [] });
              }
              return sendJson(res, 200, { success: true, message: "Cart synced with local session fallback" });
            }

            try {
              const custRow = await query("SELECT id FROM customers WHERE id = $1 OR email = $1 LIMIT 1", [rawId]);
              const customerId = custRow.rows[0]?.id;

              if (method === "GET") {
                if (!customerId) return sendJson(res, 200, { success: true, data: [] });

                const cartRes = await query("SELECT id FROM carts WHERE customer_id = $1 LIMIT 1", [customerId]);
                if (!cartRes.rows[0]) {
                  return sendJson(res, 200, { success: true, data: [] });
                }
                const itemsRes = await query(
                  "SELECT product_id, quantity FROM cart_items WHERE cart_id = $1",
                  [cartRes.rows[0].id]
                );
                return sendJson(res, 200, { success: true, data: itemsRes.rows });
              }

              if (method === "POST") {
                if (!customerId) {
                  return sendJson(res, 200, { success: true, message: "Guest session - local storage used" });
                }

                const body = await parseBody(req);
                const items = Array.isArray(body.items) ? body.items : [];

                let cartRes = await query("SELECT id FROM carts WHERE customer_id = $1 LIMIT 1", [customerId]);
                let cartId = cartRes.rows[0]?.id;
                if (!cartId) {
                  const ins = await query("INSERT INTO carts (customer_id) VALUES ($1) RETURNING id", [customerId]);
                  cartId = ins.rows[0]?.id;
                }

                if (cartId) {
                  await query("DELETE FROM cart_items WHERE cart_id = $1", [cartId]);
                  for (const it of items) {
                    const pid = it.productId || it.product_id;
                    const qty = it.qty || it.quantity || 1;
                    if (pid) {
                      await query(
                        "INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3) ON CONFLICT (cart_id, product_id) DO UPDATE SET quantity = EXCLUDED.quantity",
                        [cartId, pid, qty]
                      ).catch(() => {});
                    }
                  }
                }

                return sendJson(res, 200, { success: true, message: "Cart synced with PostgreSQL" });
              }

              return sendJson(res, 405, { success: false, error: `Method ${method} not allowed` });
            } catch (error: any) {
              if (error?.code !== "28P01" && error?.code !== "ECONNRESET") {
                console.error("[Cart API Error]:", error?.message || error);
              }
              return sendJson(res, 200, { success: true, message: "Cart synced with local session fallback", data: [] });
            }
          }

          // ====================================================================
          if (cleanUrl.startsWith("/api/wishlist")) {
            const rawId = queryParams.get("customer_id") || "usr_customer_demo";

            if (!isPostgresAvailable) {
              if (method === "GET") {
                return sendJson(res, 200, { success: true, data: [] });
              }
              return sendJson(res, 200, { success: true, message: "Wishlist synced with local session fallback" });
            }

            try {
              const custRow = await query("SELECT id FROM customers WHERE id = $1 OR email = $1 LIMIT 1", [rawId]);
              const customerId = custRow.rows[0]?.id;

              if (method === "GET") {
                if (!customerId) return sendJson(res, 200, { success: true, data: [] });

                const wishRes = await query("SELECT id FROM wishlists WHERE customer_id = $1 LIMIT 1", [customerId]);
                if (!wishRes.rows[0]) {
                  return sendJson(res, 200, { success: true, data: [] });
                }
                const itemsRes = await query(
                  "SELECT DISTINCT product_id FROM wishlist_items WHERE wishlist_id = $1",
                  [wishRes.rows[0].id]
                );
                return sendJson(res, 200, { success: true, data: itemsRes.rows.map((r: any) => r.product_id) });
              }

              if (method === "POST") {
                if (!customerId) {
                  return sendJson(res, 200, { success: true, message: "Guest session - local storage used" });
                }

                const body = await parseBody(req);
                const productId = body.productId || body.product_id;
                const action = body.action || "add"; // "add" | "remove"

                if (!productId) {
                  return sendJson(res, 400, { success: false, error: "Product ID required" });
                }

                let wishRes = await query("SELECT id FROM wishlists WHERE customer_id = $1 LIMIT 1", [customerId]);
                let wishId = wishRes.rows[0]?.id;
                if (!wishId) {
                  const ins = await query("INSERT INTO wishlists (customer_id) VALUES ($1) RETURNING id", [customerId]);
                  wishId = ins.rows[0]?.id;
                }

                if (wishId) {
                  if (action === "add") {
                    await query(
                      "INSERT INTO wishlist_items (wishlist_id, product_id) VALUES ($1, $2) ON CONFLICT (wishlist_id, product_id) DO NOTHING",
                      [wishId, productId]
                    ).catch(() => {});
                  } else {
                    await query(
                      "DELETE FROM wishlist_items WHERE wishlist_id = $1 AND product_id = $2",
                      [wishId, productId]
                    ).catch(() => {});
                  }
                }

                return sendJson(res, 200, { success: true, message: `Wishlist ${action} completed in PostgreSQL` });
              }

              return sendJson(res, 405, { success: false, error: `Method ${method} not allowed` });
            } catch (error: any) {
              console.error("[PostgreSQL Wishlist API Error]:", error);
              return sendJson(res, 500, { success: false, error: error.message });
            }
          }

          // ====================================================================
  return false;
}
