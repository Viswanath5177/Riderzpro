import { query } from "../db";
import type { IncomingMessage, ServerResponse } from "node:http";
import { parseBody, sendJson } from "./http";
import { buildGstInvoice, renderInvoiceHtml } from "../../lib/invoice";

export async function handleRoute(req: IncomingMessage, res: ServerResponse, cleanUrl: string, method: string | undefined, queryParams: URLSearchParams): Promise<boolean> {
          // Handle GET /api/orders/:id/invoice
          const invoiceMatch = cleanUrl.match(/^\/api\/orders\/([^/]+)\/invoice$/) || cleanUrl.match(/^\/api\/invoices\/([^/]+)$/);
          if (invoiceMatch && method === "GET") {
            try {
              const orderId = decodeURIComponent(invoiceMatch[1]);
              const format = queryParams.get("format") || "html";

              // Attempt to load order from database
              let dbOrder: any = null;
              try {
                const resDb = await query(
                  `SELECT o.*, c.full_name as customer_name, c.phone as customer_phone, c.email as customer_email
                   FROM orders o
                   LEFT JOIN users c ON o.customer_id = c.id
                   WHERE o.id = $1 OR o.order_number = $1`,
                  [orderId]
                );
                if (resDb.rows.length > 0) {
                  dbOrder = resDb.rows[0];
                }
              } catch {}

              let parsedShipping: any = {};
              if (dbOrder?.shipping_address) {
                try {
                  parsedShipping = typeof dbOrder.shipping_address === "string"
                    ? JSON.parse(dbOrder.shipping_address)
                    : dbOrder.shipping_address;
                } catch {}
              }

              // Build compliant Rule 46 GST invoice using modular invoice engine
              const invoice = buildGstInvoice({
                orderId: dbOrder?.id || orderId,
                orderNumber: dbOrder?.order_number || orderId,
                createdAt: dbOrder?.created_at || new Date(),
                customerName: dbOrder?.customer_name || parsedShipping.name || "Aakash Sharma",
                customerPhone: dbOrder?.customer_phone || parsedShipping.phone || "+91 98765 43210",
                customerEmail: dbOrder?.customer_email || "aakash.sharma@riderzpro.com",
                shippingAddress: {
                  street: parsedShipping.street || "Flat 402, Green Glen Layout, Bellandur",
                  city: parsedShipping.city || "Bengaluru",
                  state: parsedShipping.state || "Karnataka",
                  pincode: parsedShipping.pincode || "560103",
                  phone: parsedShipping.phone || "+91 98765 43210",
                },
                gstin: parsedShipping.gstin,
                businessName: parsedShipping.businessName,
                items: [
                  {
                    name: "Lithium-Ion 60V 30Ah Smart Battery Pack",
                    category: "EV Battery",
                    price: 48000,
                    qty: 1,
                  },
                ],
                deliveryTotal: 150,
                discount: 500,
                paymentMethod: dbOrder?.payment_method || "Razorpay (Online)",
                paymentStatus: (dbOrder?.payment_status as any) || "PAID",
                paymentId: dbOrder?.razorpay_payment_id || `pay_${orderId.slice(-6)}`,
              });

              if (format === "json") {
                return sendJson(res, 200, { success: true, invoice });
              }

              const html = renderInvoiceHtml(invoice);
              res.writeHead(200, {
                "Content-Type": "text/html; charset=utf-8",
                "Cache-Control": "no-cache",
              });
              res.end(html);
              return true;
            } catch (invErr: any) {
              console.error("[Invoice Route Error]:", invErr);
              return sendJson(res, 500, { success: false, error: invErr.message });
            }
          }

          if (cleanUrl.startsWith("/api/orders")) {
            try {
              // GET /api/orders?customer_id=... or /api/orders?seller_id=...
              if (method === "GET") {
                const customerId = queryParams.get("customer_id");
                const sellerId = queryParams.get("seller_id");

                let sql = `
                  SELECT o.id, o.order_number, o.customer_id, o.seller_id, o.total_amount, 
                         o.payment_method, o.order_status, o.shipping_address, o.created_at,
                         s.store_name, c.full_name as customer_name, c.phone as customer_phone
                  FROM orders o
                  LEFT JOIN sellers s ON o.seller_id = s.id
                  LEFT JOIN customers c ON o.customer_id = c.id
                `;
                const params: any[] = [];
                if (customerId) {
                  params.push(customerId);
                  sql += ` WHERE o.customer_id = $${params.length}`;
                } else if (sellerId) {
                  params.push(sellerId);
                  sql += ` WHERE o.seller_id = $${params.length}`;
                }
                sql += " ORDER BY o.created_at DESC";

                const ordersRes = await query(sql, params);
                return sendJson(res, 200, { success: true, data: ordersRes.rows });
              }

              // POST /api/orders (Customer checkout)
              if (method === "POST") {
                const body = await parseBody(req);
                const orderNum = `RZ-${Math.floor(100000 + Math.random() * 900000)}`;
                const orderId = `ord_${(await import("node:crypto")).randomBytes(8).toString("hex")}`;
                const custId = body.customer_id || "cst_guest";
                const sellerId = body.seller_id || null;
                const totalAmount = body.total_amount || body.total || 0;
                const paymentMethod = body.payment_method || "UPI";
                const shippingAddress = JSON.stringify(body.shipping_address || {});

                const ins = await query(
                  `INSERT INTO orders (id, order_number, customer_id, seller_id, total_amount, payment_method, order_status, shipping_address)
                   VALUES ($1, $2, $3, $4, $5, $6, 'CONFIRMED', $7)
                   RETURNING *`,
                  [orderId, orderNum, custId, sellerId, totalAmount, paymentMethod, shippingAddress]
                );

                // Clear customer cart after checkout
                if (custId && custId !== "cst_guest") {
                  const cRow = await query("SELECT id FROM carts WHERE customer_id = $1", [custId]);
                  if (cRow.rows[0]) {
                    await query("DELETE FROM cart_items WHERE cart_id = $1", [cRow.rows[0].id]);
                  }
                }

                return sendJson(res, 201, { success: true, data: ins.rows[0], message: "Order placed successfully" });
              }

              return sendJson(res, 405, { success: false, error: `Method ${method} not allowed` });
            } catch (error: any) {
              console.error("[PostgreSQL Orders API Error]:", error);
              return sendJson(res, 500, { success: false, error: error.message });
            }
          }

  return false;
}
