import type { IncomingMessage, ServerResponse } from "http";
import { initializeDatabaseSchema, isPostgresAvailable, query } from "./db";
import { ProductModel, CategoryModel, GarageModel } from "./models";
import {
  sendVendorApprovedEmail,
  sendVendorRejectedEmail,
  sendVendorMoreInfoEmail,
  sendProductApprovalEmail,
} from "../lib/email.server";
import { handleAuthRoute } from "./authRoutes";

async function parseBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
}

function sendJson(res: ServerResponse, status: number, data: any) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
}

let isDbInitialized = false;

export function pgApiMiddleware() {
  return {
    name: "riderzpro-pg-api",
    async configureServer(server: any) {
      // Ensure database schema is ready on server initialization
      if (!isDbInitialized) {
        try {
          await initializeDatabaseSchema();
          isDbInitialized = true;
          if (isPostgresAvailable) {
            console.log("[PostgreSQL] Database schema verified and initialized successfully.");
          }
        } catch (err: any) {
          console.error("[PostgreSQL] Error during schema initialization:", err.message);
        }
      }

      server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
        const url = req.url || "";
        const method = req.method?.toUpperCase();
        const [cleanUrl, queryString = ""] = url.split("?");
        const queryParams = new URLSearchParams(queryString);

        // ====================================================================
        // 0. AUTHENTICATION API: /api/auth/*
        // ====================================================================
        if (cleanUrl.startsWith("/api/auth")) {
          const handled = await handleAuthRoute(req, res, cleanUrl, method || "GET");
          if (handled) return;
        }

        // ====================================================================
        // 1. PRODUCTS API: /api/products
        // ====================================================================
        if (cleanUrl.startsWith("/api/products")) {
          const parts = cleanUrl.split("/").filter(Boolean); // ['api', 'products', optionalId]
          const productId = parts.length > 2 ? parts[2] : null;

          try {
            // GET /api/products/:id or GET /api/products
            if (method === "GET") {
              if (productId) {
                const item = await ProductModel.findById(productId);
                if (!item) {
                  return sendJson(res, 404, { success: false, error: "Product not found" });
                }
                return sendJson(res, 200, { success: true, data: item });
              }

              const fitVehicle = queryParams.get("fit_vehicle") || undefined;
              const category = queryParams.get("category") || undefined;
              const sellerId = queryParams.get("seller_id") || undefined;
              const search = queryParams.get("q") || queryParams.get("search") || undefined;
              const all = queryParams.get("all") === "true";
              const status = queryParams.get("status") || undefined;

              // Storefront protection: unless explicitly requesting all, specific status, or seller catalog, show only approved products
              const effectiveStatus = status || (all || sellerId ? undefined : "approved");

              const products = await ProductModel.findAll({
                fit_vehicle: fitVehicle,
                category: category,
                seller_id: sellerId,
                search: search,
                verification_status: effectiveStatus as any,
                is_active: all ? undefined : true,
              });

              return sendJson(res, 200, { success: true, data: products, total: products.length });
            }

            // POST /api/products (Publish product)
            if (method === "POST") {
              const body = await parseBody(req);
              const created = await ProductModel.create(body);
              return sendJson(res, 201, {
                success: true,
                message: "Product saved to PostgreSQL database successfully",
                data: created,
              });
            }

            // PUT /api/products/:id (Update product)
            if (method === "PUT") {
              const body = await parseBody(req);
              const targetId = productId || body.id;
              if (!targetId) {
                return sendJson(res, 400, { success: false, error: "Product ID required for update" });
              }

              const updated = await ProductModel.update(targetId, body);
              if (!updated) {
                return sendJson(res, 404, { success: false, error: "Product not found in database" });
              }

              return sendJson(res, 200, {
                success: true,
                message: "Product updated in PostgreSQL database successfully",
                data: updated,
              });
            }

            // DELETE /api/products/:id or DELETE /api/products (batch/all)
            if (method === "DELETE") {
              if (productId) {
                const ok = await ProductModel.delete(productId);
                return sendJson(res, 200, { success: ok, message: "Product deleted", id: productId });
              }

              const body = await parseBody(req).catch(() => ({}));
              let ids: string[] = [];
              if (Array.isArray(body?.ids)) {
                ids = body.ids;
              } else if (queryParams.get("ids")) {
                ids = queryParams.get("ids")!.split(",").filter(Boolean);
              } else if (body?.all === true || queryParams.get("all") === "true") {
                const deletedCount = await ProductModel.deleteAll();
                return sendJson(res, 200, { success: true, message: `All ${deletedCount} products deleted`, deletedCount });
              }

              if (ids.length > 0) {
                const deletedCount = await ProductModel.deleteMany(ids);
                return sendJson(res, 200, { success: true, message: `${deletedCount} product(s) deleted`, deletedCount, ids });
              }

              return sendJson(res, 400, { success: false, error: "No product IDs specified for deletion" });
            }

            // POST /api/products/batch-delete alternative
            if (method === "POST" && cleanUrl === "/api/products/batch-delete") {
              const body = await parseBody(req).catch(() => ({}));
              if (body?.all === true) {
                const deletedCount = await ProductModel.deleteAll();
                return sendJson(res, 200, { success: true, message: `All ${deletedCount} products deleted`, deletedCount });
              }
              const ids = Array.isArray(body?.ids) ? body.ids : [];
              if (ids.length > 0) {
                const deletedCount = await ProductModel.deleteMany(ids);
                return sendJson(res, 200, { success: true, message: `${deletedCount} product(s) deleted`, deletedCount, ids });
              }
              return sendJson(res, 400, { success: false, error: "No product IDs specified for batch deletion" });
            }

            return sendJson(res, 405, { success: false, error: `Method ${method} not allowed` });
          } catch (error: any) {
            console.error("[PostgreSQL Products API Error]:", error);
            return sendJson(res, 500, { success: false, error: error?.message || String(error), stack: error?.stack });
          }
        }

        // ====================================================================
        // 2. CUSTOMER GARAGE API: /api/garage
        // ====================================================================
        if (cleanUrl.startsWith("/api/garage")) {
          const parts = cleanUrl.split("/").filter(Boolean);
          const garageId = parts.length > 2 ? parts[2] : null;
          const subAction = parts.length > 3 ? parts[3] : null;

          try {
            // GET /api/garage
            if (method === "GET") {
              const customerId = queryParams.get("customer_id") || "usr_customer_demo";
              const rows = await GarageModel.findByCustomer(customerId);
              return sendJson(res, 200, { success: true, data: rows });
            }

            // POST /api/garage
            if (method === "POST") {
              const body = await parseBody(req);
              if (!body.vehicle_id || !body.make || !body.model) {
                return sendJson(res, 400, { success: false, error: "Vehicle details (vehicle_id, make, model) required." });
              }
              const created = await GarageModel.addVehicle(body);
              return sendJson(res, 201, {
                success: true,
                message: "Vehicle added to Customer Garage successfully in PostgreSQL",
                data: created,
              });
            }

            // PUT /api/garage/:id/active
            if (method === "PUT" && garageId && subAction === "active") {
              const customerId = queryParams.get("customer_id") || "usr_customer_demo";
              const updated = await GarageModel.setActive(garageId, customerId);
              return sendJson(res, 200, { success: true, data: updated });
            }

            // DELETE /api/garage/:id
            if (method === "DELETE" && garageId) {
              const ok = await GarageModel.removeVehicle(garageId);
              return sendJson(res, 200, { success: ok, message: "Vehicle removed from garage" });
            }

            return sendJson(res, 405, { success: false, error: `Method ${method} not allowed` });
          } catch (error: any) {
            console.error("[PostgreSQL Garage API Error]:", error);
            return sendJson(res, 500, { success: false, error: error.message });
          }
        }

        // ====================================================================
        // 3. CATEGORIES API: /api/categories
        // ====================================================================
        if (cleanUrl === "/api/categories") {
          try {
            const categories = await CategoryModel.findAll();
            return sendJson(res, 200, { success: true, data: categories });
          } catch (error: any) {
            return sendJson(res, 500, { success: false, error: error.message });
          }
        }

        // ====================================================================
        // 3.5 PUBLIC SELLERS API: /api/sellers (Returns only approved vendors)
        // ====================================================================
        if (cleanUrl === "/api/sellers" && method === "GET") {
          try {
            const sellersRes = await query(`
              SELECT id, email, phone, store_name, owner_name, business_type, business_address, 
                     city, state, pincode, country, gstin, status, created_at 
              FROM sellers 
              WHERE status = 'APPROVED' AND is_active = true
              ORDER BY created_at DESC
            `);

            const mapped = sellersRes.rows.map((s: any) => ({
              id: s.id,
              name: s.store_name,
              area: s.city || "Bengaluru",
              lat: 12.9784,
              lng: 77.6408,
              rating: 5.0,
              reviewCount: 0,
              prepMins: 15,
              isVerified: true,
              verificationBadge: "Verified Marketplace Seller",
              description: `${s.business_type || "Proprietorship"} — Authorized electric vehicle and spare parts dealer.`,
              deliveryCoverage: `${s.city || "Bengaluru"} and nearby areas`,
              businessHours: "Mon - Sat: 9:00 AM - 8:00 PM",
              phone: s.phone,
              email: s.email,
              address: s.business_address || s.city,
              gstin: s.gstin,
            }));

            return sendJson(res, 200, { success: true, data: mapped });
          } catch (error: any) {
            console.error("[PostgreSQL Public Sellers Error]:", error);
            return sendJson(res, 500, { success: false, error: error.message });
          }
        }

        // ====================================================================
        // 4. ADMIN SELLERS & KYC REVIEW API: /api/admin/sellers
        // ====================================================================
        if (cleanUrl.startsWith("/api/admin/sellers")) {
          const parts = cleanUrl.split("/").filter(Boolean); // ['api', 'admin', 'sellers', sellerId?, subAction?]
          const sellerId = parts.length > 3 ? parts[3] : null;
          const subAction = parts.length > 4 ? parts[4] : null;

          try {
            // GET /api/admin/sellers
            if (method === "GET") {
              const sellersRes = await query(`
                SELECT id, email, phone, store_name, owner_name, business_type, business_address, 
                       city, state, pincode, country, gstin, status, approved_by, approved_at, 
                       rejection_reason, created_at 
                FROM sellers 
                ORDER BY created_at DESC
              `);
              const docsRes = await query("SELECT id, seller_id, doc_type, doc_number, file_path, is_verified FROM seller_documents");
              const bankRes = await query("SELECT id, seller_id, account_holder_name, bank_name, account_number, ifsc_code, is_verified FROM seller_bank_accounts");

              const docsMap = new Map<string, any[]>();
              for (const doc of docsRes.rows) {
                if (!docsMap.has(doc.seller_id)) docsMap.set(doc.seller_id, []);
                docsMap.get(doc.seller_id)!.push(doc);
              }

              const bankMap = new Map<string, any>();
              for (const b of bankRes.rows) {
                bankMap.set(b.seller_id, b);
              }

              const results = sellersRes.rows.map((s: any) => ({
                ...s,
                documents: docsMap.get(s.id) || [],
                bankAccount: bankMap.get(s.id) || null,
              }));

              return sendJson(res, 200, { success: true, data: results });
            }

            // POST /api/admin/sellers/:id/review
            if (method === "POST" && sellerId && (subAction === "review" || parts.length === 4)) {
              const body = await parseBody(req);
              const action = body.action as "APPROVED" | "REJECTED" | "MORE_INFORMATION_REQUIRED";
              const reason = body.reason || "";
              const adminId = body.adminId || "adm_product_01";

              const sRes = await query("SELECT email, owner_name, store_name, phone, password_hash FROM sellers WHERE id = $1", [sellerId]);
              const seller = sRes.rows[0];
              if (!seller) {
                return sendJson(res, 404, { success: false, error: "Seller application not found" });
              }

              await query(
                `UPDATE sellers 
                 SET status = $1, approved_by = $2, approved_at = CASE WHEN $1 = 'APPROVED' THEN now() ELSE NULL END, rejection_reason = $3, updated_at = now()
                 WHERE id = $4`,
                [action, adminId, reason || null, sellerId]
              );

              // When approved, mirror into users table so the vendor can log in via /api/auth/signin
              if (action === "APPROVED") {
                await query(
                  `INSERT INTO users (id, email, phone, password_hash, full_name, role, is_active)
                   VALUES ($1, $2, $3, $4, $5, 'seller', true)
                   ON CONFLICT (email) DO UPDATE SET role = 'seller', is_active = true`,
                  ['usr_' + sellerId.slice(4), seller.email, seller.phone, seller.password_hash, seller.owner_name]
                ).catch((err) => console.warn("[Seller User Mirror Warning]:", err?.message));
              }

              await query(
                `INSERT INTO audit_logs (actor_id, actor_role, action, target_type, target_id, details)
                 VALUES ($1, 'admin', $2, 'seller', $3, $4)`,
                [adminId, `VENDOR_${action}`, sellerId, JSON.stringify({ reason })]
              );

              const host = req.headers.host || "localhost:8080";
              const loginUrl = `http://${host}/login`;

              // Dispatch transactional emails via Resend API
              if (action === "APPROVED") {
                await sendVendorApprovedEmail(seller.email, seller.owner_name, seller.store_name, loginUrl).catch(() => {});
              } else if (action === "REJECTED") {
                await sendVendorRejectedEmail(seller.email, seller.owner_name, seller.store_name, reason || "Application does not meet marketplace compliance standards.").catch(() => {});
              } else if (action === "MORE_INFORMATION_REQUIRED") {
                await sendVendorMoreInfoEmail(seller.email, seller.owner_name, seller.store_name, reason || "Please provide clearer copies of your business documentation.").catch(() => {});
              }

              return sendJson(res, 200, { success: true, status: action, message: `Seller KYC updated to ${action}` });
            }

            return sendJson(res, 405, { success: false, error: `Method ${method} not allowed` });
          } catch (error: any) {
            console.error("[PostgreSQL Admin Sellers API Error]:", error);
            return sendJson(res, 500, { success: false, error: error.message });
          }
        }

        // ====================================================================
        // 5. ADMIN PRODUCT REVIEW API: /api/admin/products/:id/review
        // ====================================================================
        if (cleanUrl.startsWith("/api/admin/products") && cleanUrl.includes("/review")) {
          const parts = cleanUrl.split("/").filter(Boolean); // ['api', 'admin', 'products', productId, 'review']
          const productId = parts[3];

          try {
            if (method === "POST" && productId) {
              const body = await parseBody(req);
              const action = body.action as "APPROVED" | "REJECTED";
              const reason = body.reason || "";
              const adminId = body.adminId || "adm_product_01";

              const prodRes = await query("SELECT name, seller_id FROM products WHERE id = $1", [productId]);
              const product = prodRes.rows[0];
              if (!product) {
                return sendJson(res, 404, { success: false, error: "Product not found" });
              }

              const newStatus = action === "APPROVED" ? "approved" : "rejected";
              await query(
                `UPDATE products 
                 SET verification_status = $1, verified_by = $2, verified_at = now(), rejection_reason = $3, updated_at = now()
                 WHERE id = $4`,
                [newStatus, adminId, reason || null, productId]
              );

              await query(
                `INSERT INTO product_approval_history (product_id, admin_id, action, reason)
                 VALUES ($1, $2, $3, $4)`,
                [productId, adminId, action, reason || null]
              );

              const sRes = await query("SELECT email FROM sellers WHERE id = $1", [product.seller_id]);
              if (sRes.rows[0]?.email) {
                await sendProductApprovalEmail(sRes.rows[0].email, product.name, action === "APPROVED", reason).catch(() => {});
              }

              return sendJson(res, 200, { success: true, status: newStatus, message: `Product status updated to ${newStatus}` });
            }

            return sendJson(res, 405, { success: false, error: `Method ${method} not allowed` });
          } catch (error: any) {
            console.error("[PostgreSQL Admin Product Review Error]:", error);
            return sendJson(res, 500, { success: false, error: error.message });
          }
        }

        // ====================================================================
        // 6. CUSTOMER CART PERSISTENCE API: /api/cart
        // ====================================================================
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
        // 7. CUSTOMER WISHLIST PERSISTENCE API: /api/wishlist
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
        // 8. ORDERS API: /api/orders
        // ====================================================================
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

        next();
      });
    },
  };
}
