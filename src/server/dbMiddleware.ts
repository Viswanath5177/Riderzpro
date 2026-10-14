import type { IncomingMessage, ServerResponse } from "http";
import crypto from "node:crypto";
import { initializeDatabaseSchema, query } from "./db";
import { ProductModel, CategoryModel, GarageModel } from "./models";
import {
  sendVendorApprovedEmail,
  sendVendorRejectedEmail,
  sendVendorMoreInfoEmail,
  sendProductApprovalEmail,
} from "../lib/email.server";
import { handleAuthRoute } from "./authRoutes";
import { createNotification, notifyAdminRole } from "./notifications";

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
          console.log("[PostgreSQL] Database schema verified and initialized successfully.");
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
        // 0. AUTHENTICATION & NOTIFICATIONS API
        // ====================================================================
        if (
          cleanUrl.startsWith("/api/auth") ||
          cleanUrl.startsWith("/api/notifications") ||
          cleanUrl.startsWith("/api/admin/invite") ||
          cleanUrl.startsWith("/api/admin/change-requests") ||
          cleanUrl.startsWith("/api/vendor/change-request") ||
          cleanUrl.startsWith("/api/customer/addresses")
        ) {
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

              // Freeze enforcement: block product submission if vendor account is frozen
              if (body.seller_id) {
                const sCheck = await query("SELECT account_status, freeze_reason, store_name FROM sellers WHERE id = $1", [body.seller_id]);
                if (sCheck.rows[0]?.account_status === "FROZEN") {
                  return sendJson(res, 403, {
                    success: false,
                    error: `Vendor account is FROZEN by administration. Product submissions and selling operations are blocked. Reason: ${sCheck.rows[0].freeze_reason || "Compliance review"}. Designated assistance: riderzpro@selleradmin.com`,
                  });
                }
              }

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
        // 3.8 VENDOR DASHBOARD & STATS API: /api/vendor/dashboard
        // ====================================================================
        if (cleanUrl === "/api/vendor/dashboard" && method === "GET") {
          try {
            let sellerId: string | null = null;
            let sellerEmail: string | null = null;

            const cookieHeader = req.headers.cookie || "";
            const tokenMatch = cookieHeader.match(/(?:auth_session|riderzpro_session)=([^;]+)/);
            if (tokenMatch) {
              const token = tokenMatch[1].trim();
              const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
              const sessRes = await query(
                "SELECT user_id, user_role FROM auth_sessions WHERE token_hash = $1 AND revoked_at IS NULL AND expires_at > now() LIMIT 1",
                [tokenHash]
              );
              if (sessRes.rows[0]) {
                const uid = sessRes.rows[0].user_id;
                const sCheck = await query(
                  "SELECT id, email FROM sellers WHERE id = $1 OR email = (SELECT email FROM users WHERE id = $1 LIMIT 1) LIMIT 1",
                  [uid]
                );
                if (sCheck.rows[0]) {
                  sellerId = sCheck.rows[0].id;
                  sellerEmail = sCheck.rows[0].email;
                }
              }
            }

            // Fallback: If not authenticated or previewing, resolve latest registered seller
            let sellerRow: any = null;
            if (sellerId) {
              const res = await query("SELECT * FROM sellers WHERE id = $1 LIMIT 1", [sellerId]);
              sellerRow = res.rows[0];
            }
            if (!sellerRow) {
              const res = await query("SELECT * FROM sellers ORDER BY created_at DESC LIMIT 1");
              sellerRow = res.rows[0];
              if (sellerRow) {
                sellerId = sellerRow.id;
                sellerEmail = sellerRow.email;
              }
            }

            if (!sellerRow) {
              return sendJson(res, 200, {
                success: true,
                data: {
                  vendor: null,
                  metrics: {
                    totalGrossSales: 0,
                    activeListings: 0,
                    pendingOrders: 0,
                    inPreparation: 0,
                    outForDelivery: 0,
                    deliveredOrders: 0,
                    unitsInStock: 0,
                    rating: 0,
                    reviewCount: 0,
                  },
                  orders: [],
                  shipments: [],
                  reviews: [],
                  settlements: [],
                },
              });
            }

            // Bank details & KYC documents for this seller
            const bankRes = await query(
              "SELECT account_holder_name, bank_name, account_number, ifsc_code, is_verified FROM seller_bank_accounts WHERE seller_id = $1 LIMIT 1",
              [sellerId]
            );
            const bankAccount = bankRes.rows[0]
              ? {
                  accountHolderName: bankRes.rows[0].account_holder_name,
                  bankName: bankRes.rows[0].bank_name,
                  accountNumber: bankRes.rows[0].account_number,
                  ifscCode: bankRes.rows[0].ifsc_code,
                  isVerified: bankRes.rows[0].is_verified,
                }
              : null;

            const docsRes = await query(
              "SELECT doc_type, doc_number, file_path, is_verified FROM seller_documents WHERE seller_id = $1",
              [sellerId]
            );

            // Real products from DB for this vendor
            const prodRes = await query(
              `SELECT p.id, p.name, p.sku, p.price, p.mrp, p.stock, c.name AS category_name, p.verification_status, p.created_at 
               FROM products p 
               LEFT JOIN categories c ON p.category_id = c.id 
               WHERE p.seller_id = $1`,
              [sellerId]
            );
            const vendorProducts = prodRes.rows;
            const activeListings = vendorProducts.filter((p: any) => p.verification_status === "approved").length;
            const unitsInStock = vendorProducts.reduce((sum: number, p: any) => sum + (Number(p.stock) || 0), 0);

            // Real orders from DB for this vendor
            const ordersRes = await query(
              `SELECT o.id, o.order_number, o.status, o.total_amount, o.delivery_address, o.created_at,
                      u.full_name AS customer_name, u.phone AS customer_phone
               FROM orders o
               LEFT JOIN users u ON o.customer_id = u.id
               WHERE o.seller_id = $1 OR o.seller_id IN (SELECT id FROM users WHERE email = $2)
               ORDER BY o.created_at DESC`,
              [sellerId, sellerEmail]
            );
            const vendorOrders = ordersRes.rows;
            const totalGrossSales = vendorOrders
              .filter((o: any) => o.status !== "cancelled")
              .reduce((sum: number, o: any) => sum + (Number(o.total_amount) || 0), 0);

            const pendingOrders = vendorOrders.filter((o: any) => o.status === "pending").length;
            const inPreparation = vendorOrders.filter((o: any) => o.status === "processing").length;
            const outForDelivery = vendorOrders.filter((o: any) => o.status === "shipped").length;
            const deliveredOrders = vendorOrders.filter((o: any) => o.status === "delivered").length;

            return sendJson(res, 200, {
              success: true,
              data: {
                vendor: {
                  id: sellerRow.id,
                  storeName: sellerRow.store_name,
                  ownerName: sellerRow.owner_name,
                  email: sellerRow.email,
                  phone: sellerRow.phone,
                  businessType: sellerRow.business_type,
                  city: sellerRow.city,
                  state: sellerRow.state,
                  pincode: sellerRow.pincode,
                  address: sellerRow.business_address,
                  gstin: sellerRow.gstin,
                  status: sellerRow.status,
                  accountStatus: sellerRow.account_status || "ACTIVE",
                  freezeReason: sellerRow.freeze_reason || null,
                  frozenAt: sellerRow.frozen_at || null,
                  created_at: sellerRow.created_at,
                  bankAccount,
                  documents: docsRes.rows,
                },
                metrics: {
                  totalGrossSales,
                  activeListings,
                  pendingOrders,
                  inPreparation,
                  outForDelivery,
                  deliveredOrders,
                  unitsInStock,
                  rating: 0,
                  reviewCount: 0,
                },
                orders: vendorOrders,
                shipments: [],
                reviews: [],
                settlements: [],
              },
            });
          } catch (err: any) {
            console.error("[Vendor Dashboard API Error]:", err);
            return sendJson(res, 500, { success: false, error: err.message });
          }
        }

        // ====================================================================
        // 3.9 VENDOR PROFILE UPDATE API: /api/vendor/profile
        // ====================================================================
        if (cleanUrl === "/api/vendor/profile" && (method === "PUT" || method === "POST")) {
          try {
            const body = await parseBody(req);
            let sellerId = body.sellerId || body.id;

            // If sellerId not supplied, deduce from session
            if (!sellerId) {
              const cookieHeader = req.headers.cookie || "";
              const tokenMatch = cookieHeader.match(/(?:auth_session|riderzpro_session)=([^;]+)/);
              if (tokenMatch) {
                const token = tokenMatch[1].trim();
                const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
                const sessRes = await query(
                  "SELECT user_id FROM auth_sessions WHERE token_hash = $1 AND revoked_at IS NULL AND expires_at > now() LIMIT 1",
                  [tokenHash]
                );
                if (sessRes.rows[0]) {
                  const uid = sessRes.rows[0].user_id;
                  const sCheck = await query(
                    "SELECT id FROM sellers WHERE id = $1 OR email = (SELECT email FROM users WHERE id = $1 LIMIT 1) LIMIT 1",
                    [uid]
                  );
                  if (sCheck.rows[0]) sellerId = sCheck.rows[0].id;
                }
              }
            }

            // Fallback to latest seller if still not found
            if (!sellerId) {
              const sFallback = await query("SELECT id FROM sellers ORDER BY created_at DESC LIMIT 1");
              if (sFallback.rows[0]) sellerId = sFallback.rows[0].id;
            }

            if (!sellerId) {
              return sendJson(res, 404, { success: false, error: "Seller profile not found in database" });
            }

            // Update sellers table
            await query(
              `UPDATE sellers
               SET store_name = COALESCE($1, store_name),
                   owner_name = COALESCE($2, owner_name),
                   phone = COALESCE($3, phone),
                   business_address = COALESCE($4, business_address),
                   city = COALESCE($5, city),
                   state = COALESCE($6, state),
                   pincode = COALESCE($7, pincode),
                   gstin = COALESCE($8, gstin),
                   updated_at = now()
               WHERE id = $9`,
              [
                body.storeName || null,
                body.ownerName || null,
                body.phone || null,
                body.address || body.streetAddress || null,
                body.city || null,
                body.state || null,
                body.pincode || null,
                body.gstin || null,
                sellerId,
              ]
            );

            // Update or insert bank details
            if (body.accountNumber || body.bankName || body.accountHolderName || body.ifscCode) {
              const bCheck = await query("SELECT id FROM seller_bank_accounts WHERE seller_id = $1 LIMIT 1", [sellerId]);
              if (bCheck.rows[0]) {
                await query(
                  `UPDATE seller_bank_accounts
                   SET account_holder_name = COALESCE($1, account_holder_name),
                       bank_name = COALESCE($2, bank_name),
                       account_number = COALESCE($3, account_number),
                       ifsc_code = COALESCE($4, ifsc_code)
                   WHERE seller_id = $5`,
                  [
                    body.accountHolderName || null,
                    body.bankName || null,
                    body.accountNumber || null,
                    body.ifscCode ? body.ifscCode.toUpperCase() : null,
                    sellerId,
                  ]
                );
              } else {
                await query(
                  `INSERT INTO seller_bank_accounts (seller_id, account_holder_name, bank_name, account_number, ifsc_code)
                   VALUES ($1, $2, $3, $4, $5)`,
                  [
                    sellerId,
                    body.accountHolderName || body.ownerName || "Seller",
                    body.bankName || "Bank",
                    body.accountNumber || "0000000000",
                    (body.ifscCode || "BANK0001234").toUpperCase(),
                  ]
                );
              }
            }

            const updatedSellerRes = await query("SELECT * FROM sellers WHERE id = $1", [sellerId]);
            const updatedBankRes = await query("SELECT * FROM seller_bank_accounts WHERE seller_id = $1", [sellerId]);
            const sRow = updatedSellerRes.rows[0];
            const bRow = updatedBankRes.rows[0] || null;

            return sendJson(res, 200, {
              success: true,
              message: "Store profile and bank settlement details updated successfully in PostgreSQL",
              vendor: {
                id: sRow.id,
                storeName: sRow.store_name,
                ownerName: sRow.owner_name,
                email: sRow.email,
                phone: sRow.phone,
                city: sRow.city,
                state: sRow.state,
                pincode: sRow.pincode,
                address: sRow.business_address,
                gstin: sRow.gstin,
                status: sRow.status,
                bankAccount: bRow
                  ? {
                      accountHolderName: bRow.account_holder_name,
                      bankName: bRow.bank_name,
                      accountNumber: bRow.account_number,
                      ifscCode: bRow.ifsc_code,
                    }
                  : null,
              },
            });
          } catch (err: any) {
            console.error("[Vendor Profile Update Error]:", err);
            return sendJson(res, 500, { success: false, error: err.message });
          }
        }

        // ====================================================================
        // 3.9 VENDOR NOTIFICATIONS API: /api/vendor/notifications
        // ====================================================================
        if (cleanUrl.startsWith("/api/vendor/notifications")) {
          try {
            const sellerId = queryParams.get("seller_id") || "sel_2571cac9469b8dce";
            if (method === "GET") {
              const notifsRes = await query(
                `SELECT * FROM vendor_notifications 
                 WHERE seller_id = $1 
                    OR seller_id IN (SELECT id FROM sellers WHERE email = (SELECT email FROM users WHERE id = $1 LIMIT 1))
                    OR seller_id IN (SELECT id FROM users WHERE email = (SELECT email FROM sellers WHERE id = $1 LIMIT 1))
                 ORDER BY created_at DESC 
                 LIMIT 30`,
                [sellerId]
              );
              const unreadCount = notifsRes.rows.filter((n: any) => !n.is_read).length;
              return sendJson(res, 200, { success: true, data: notifsRes.rows, unreadCount });
            }

            if (method === "PUT") {
              const parts = cleanUrl.split("/").filter(Boolean);
              const notifId = parts[3];
              if (notifId === "all") {
                await query(
                  `UPDATE vendor_notifications SET is_read = TRUE 
                   WHERE seller_id = $1 
                      OR seller_id IN (SELECT id FROM sellers WHERE email = (SELECT email FROM users WHERE id = $1 LIMIT 1))`,
                  [sellerId]
                );
              } else if (notifId) {
                await query(`UPDATE vendor_notifications SET is_read = TRUE WHERE id = $1`, [notifId]);
              }
              return sendJson(res, 200, { success: true, message: "Notifications updated" });
            }
          } catch (err: any) {
            console.error("[Vendor Notifications Error]:", err);
            return sendJson(res, 500, { success: false, error: err.message });
          }
        }

        // ====================================================================
        // 3.10 ADMIN NOTIFICATIONS API: /api/admin/notifications
        // ====================================================================
        if (cleanUrl === "/api/admin/notifications" && method === "GET") {
          try {
            const sellersRes = await query(`
              SELECT id, store_name, owner_name, city, state, status, created_at
              FROM sellers
              ORDER BY created_at DESC
              LIMIT 15
            `);

            const notifications = sellersRes.rows.map((s: any) => ({
              id: `notif_seller_${s.id}`,
              title: `New Seller Registration: ${s.store_name}`,
              body: `${s.owner_name} registered store from ${s.city || "Unspecified"}, ${s.state || ""}. Status: ${s.status === "PENDING_REVIEW" ? "Awaiting KYC Approval" : s.status}.`,
              channel: "Seller Queue",
              targetAudience: "Admin Reviewers",
              sentAt: s.created_at,
              reachCount: 1,
              openRate: "100%",
              type: "seller_registration",
              sellerId: s.id,
              isPending: s.status === "PENDING_REVIEW",
            }));

            const pendingCount = notifications.filter((n: any) => n.isPending).length;

            return sendJson(res, 200, {
              success: true,
              data: notifications,
              unreadCount: pendingCount,
            });
          } catch (err: any) {
            console.error("[Admin Notifications Error]:", err);
            return sendJson(res, 500, { success: false, error: err.message });
          }
        }

        // ====================================================================
        // 4. ADMIN SELLERS & KYC REVIEW & ANALYTICS API: /api/admin/sellers
        // ====================================================================
        if (cleanUrl.startsWith("/api/admin/sellers") || cleanUrl === "/api/admin/analytics/sellers") {
          const parts = cleanUrl.split("/").filter(Boolean); // ['api', 'admin', 'sellers', sellerId?, subAction?]
          const sellerId = parts.length > 3 ? parts[3] : null;
          const subAction = parts.length > 4 ? parts[4] : null;

          try {
            // GET /api/admin/sellers/analytics or /api/admin/analytics/sellers
            if (method === "GET" && (cleanUrl === "/api/admin/sellers/analytics" || cleanUrl === "/api/admin/analytics/sellers" || sellerId === "analytics")) {
              const analyticsRes = await query(`
                SELECT 
                  s.id,
                  s.store_name,
                  s.owner_name,
                  s.email,
                  s.phone,
                  s.city,
                  s.state,
                  s.status,
                  s.created_at,
                  COUNT(o.id)::int AS total_orders,
                  COALESCE(SUM(o.total_amount), 0)::float AS total_revenue,
                  COALESCE(SUM(CASE WHEN o.created_at >= now() - interval '7 days' THEN o.total_amount ELSE 0 END), 0)::float AS weekly_revenue,
                  COUNT(CASE WHEN o.created_at >= now() - interval '7 days' THEN o.id ELSE NULL END)::int AS weekly_orders
                FROM sellers s
                LEFT JOIN orders o ON (s.id = o.seller_id OR o.seller_id IN (SELECT id FROM users WHERE email = s.email))
                GROUP BY s.id, s.store_name, s.owner_name, s.email, s.phone, s.city, s.state, s.status, s.created_at
                ORDER BY weekly_revenue DESC, total_revenue DESC, s.created_at DESC
              `);

              const sellersData = analyticsRes.rows;
              const totalSellers = sellersData.length;
              const approvedSellers = sellersData.filter((s: any) => s.status === "APPROVED").length;
              const pendingSellers = sellersData.filter((s: any) => s.status === "PENDING_REVIEW").length;
              const weeklyTotalRevenue = sellersData.reduce((acc: number, s: any) => acc + (Number(s.weekly_revenue) || 0), 0);
              const allTimeTotalRevenue = sellersData.reduce((acc: number, s: any) => acc + (Number(s.total_revenue) || 0), 0);
              const totalWeeklyOrders = sellersData.reduce((acc: number, s: any) => acc + (Number(s.weekly_orders) || 0), 0);

              // Top weekly seller is #1 ranked
              const weeklyTopSeller = sellersData[0] || null;

              return sendJson(res, 200, {
                success: true,
                data: {
                  sellers: sellersData,
                  weeklyTopSeller,
                  metrics: {
                    totalSellers,
                    approvedSellers,
                    pendingSellers,
                    weeklyTotalRevenue,
                    allTimeTotalRevenue,
                    totalWeeklyOrders,
                  },
                },
              });
            }

            // GET /api/admin/sellers
            if (method === "GET") {
              const sellersRes = await query(`
                SELECT s.id, s.email, s.phone, s.store_name, s.owner_name, s.business_type, s.business_address, 
                       s.city, s.state, s.pincode, s.country, s.gstin, s.status, 
                       COALESCE(s.account_status, 'ACTIVE') AS account_status, 
                       s.freeze_reason, s.frozen_by, s.frozen_at,
                       s.approved_by, s.approved_at, 
                       s.rejection_reason, s.created_at,
                       COUNT(DISTINCT p.id)::int AS published_products_count,
                       COUNT(DISTINCT o.id)::int AS sales_count,
                       COALESCE(SUM(o.total_amount), 0)::numeric AS total_revenue
                FROM sellers s
                LEFT JOIN products p ON (p.seller_id = s.id OR p.seller_id IN (SELECT id FROM users WHERE email = s.email))
                LEFT JOIN orders o ON (s.id = o.seller_id OR o.seller_id IN (SELECT id FROM users WHERE email = s.email))
                GROUP BY s.id
                ORDER BY s.created_at DESC
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
            if (method === "POST" && sellerId && sellerId !== "analytics" && (subAction === "review" || parts.length === 4)) {
              const body = await parseBody(req);
              const action = body.action as "APPROVED" | "REJECTED" | "MORE_INFORMATION_REQUIRED";
              const reason = body.reason || "";
              const adminId = body.adminId;

              const sRes = await query("SELECT email, owner_name, store_name, phone, password_hash FROM sellers WHERE id = $1", [sellerId]);
              const seller = sRes.rows[0];
              if (!seller) {
                return sendJson(res, 404, { success: false, error: "Seller application not found" });
              }

              const isApproved = action === "APPROVED";

              // Verify adminId exists in admins table or resolve to an active admin
              let verifiedAdminId: string | null = null;
              if (adminId) {
                const aCheck = await query("SELECT id FROM admins WHERE id = $1", [adminId]);
                if (aCheck.rows[0]) verifiedAdminId = aCheck.rows[0].id;
              }
              if (!verifiedAdminId) {
                const fallbackAdmin = await query("SELECT id FROM admins LIMIT 1");
                verifiedAdminId = fallbackAdmin.rows[0]?.id || null;
              }

              const approvedAt = isApproved ? new Date() : null;

              // Use explicit cast $1::seller_status_enum and separate parameter for approved_at to eliminate type deduction mismatch (42P08)
              await query(
                `UPDATE sellers 
                 SET status = $1::seller_status_enum, 
                     approved_by = $2, 
                     approved_at = $3, 
                     rejection_reason = $4, 
                     updated_at = now()
                 WHERE id = $5`,
                [action, verifiedAdminId, approvedAt, reason || null, sellerId]
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
                [verifiedAdminId || "admin", `VENDOR_${action}`, sellerId, JSON.stringify({ reason })]
              );

              const host = req.headers.host || "localhost:8080";
              const loginUrl = `http://${host}/login`;

              // Dispatch in-dashboard notification to vendor
              if (action === "APPROVED") {
                await createNotification({
                  userId: sellerId,
                  userRole: "seller",
                  type: "store_approved",
                  title: "Store Approved & Verified!",
                  message: `Congratulations! Your vendor store '${seller.store_name}' has been approved. Your verified business details are now locked.`,
                  targetRoute: "/dashboard/vendor?tab=store",
                });
              } else if (action === "REJECTED") {
                await createNotification({
                  userId: sellerId,
                  userRole: "seller",
                  type: "store_rejected",
                  title: "Store Application Declined",
                  message: `Your store application for '${seller.store_name}' was not approved. Reason: ${reason || "Application does not meet marketplace compliance standards."}`,
                  targetRoute: "/dashboard/vendor?tab=store",
                });
              }

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

            // POST /api/admin/sellers/:id/freeze (Freeze Vendor Account)
            if (method === "POST" && sellerId && subAction === "freeze") {
              const body = await parseBody(req);
              const reason = (body.reason || "").trim();
              const adminId = body.adminId || "adm_seller_01";

              if (!reason) {
                return sendJson(res, 400, {
                  success: false,
                  error: "A valid compliance reason is required to freeze a vendor account.",
                });
              }

              const sRes = await query("SELECT id, email, store_name, owner_name FROM sellers WHERE id = $1", [sellerId]);
              const seller = sRes.rows[0];
              if (!seller) {
                return sendJson(res, 404, { success: false, error: "Seller not found" });
              }

              await query(
                `UPDATE sellers 
                 SET account_status = 'FROZEN', 
                     freeze_reason = $1, 
                     frozen_by = $2, 
                     frozen_at = datetime('now'), 
                     updated_at = now() 
                 WHERE id = $3`,
                [reason, adminId, sellerId]
              );

              // Deactivate corresponding user account so active sessions are blocked
              await query("UPDATE users SET is_active = false WHERE email = $1", [seller.email]).catch(() => {});

              // Create compliance audit log
              await query(
                `INSERT INTO audit_logs (id, actor_id, actor_role, action, target_type, target_id, details)
                 VALUES ($1, $2, 'admin', 'VENDOR_ACCOUNT_FROZEN', 'seller', $3, $4)`,
                [`audit_${Date.now()}`, adminId, sellerId, JSON.stringify({ reason })]
              ).catch(() => {});

              // Dispatch notification to vendor with designated assistance
              await createNotification({
                userId: sellerId,
                userRole: "seller",
                type: "account_frozen",
                title: "Vendor Account Suspended (Frozen)",
                message: `Your vendor account has been frozen by administration. Reason: ${reason}. Selling operations and product submissions are paused. Designated assistance: riderzpro@selleradmin.com`,
                targetRoute: "/dashboard/vendor",
              });

              return sendJson(res, 200, {
                success: true,
                message: `Vendor '${seller.store_name}' account frozen successfully.`,
                account_status: "FROZEN",
              });
            }

            // POST /api/admin/sellers/:id/unfreeze (Unfreeze Vendor Account)
            if (method === "POST" && sellerId && subAction === "unfreeze") {
              const body = await parseBody(req);
              const adminId = body.adminId || "adm_seller_01";

              const sRes = await query("SELECT id, email, store_name, owner_name FROM sellers WHERE id = $1", [sellerId]);
              const seller = sRes.rows[0];
              if (!seller) {
                return sendJson(res, 404, { success: false, error: "Seller not found" });
              }

              await query(
                `UPDATE sellers 
                 SET account_status = 'ACTIVE', 
                     freeze_reason = NULL, 
                     frozen_by = NULL, 
                     frozen_at = NULL, 
                     updated_at = now() 
                 WHERE id = $1`,
                [sellerId]
              );

              // Reactivate corresponding user account
              await query("UPDATE users SET is_active = true WHERE email = $1", [seller.email]).catch(() => {});

              // Create compliance audit log
              await query(
                `INSERT INTO audit_logs (id, actor_id, actor_role, action, target_type, target_id, details)
                 VALUES ($1, $2, 'admin', 'VENDOR_ACCOUNT_UNFROZEN', 'seller', $3, $4)`,
                [`audit_${Date.now()}`, adminId, sellerId, JSON.stringify({ unfreezer: adminId })]
              ).catch(() => {});

              // Dispatch notification to vendor
              await createNotification({
                userId: sellerId,
                userRole: "seller",
                type: "account_unfrozen",
                title: "Vendor Account Restored (Active)",
                message: "Your vendor account has been restored to ACTIVE status. Full selling and product submission capabilities are resumed.",
                targetRoute: "/dashboard/vendor",
              });

              return sendJson(res, 200, {
                success: true,
                message: `Vendor '${seller.store_name}' account restored to ACTIVE status.`,
                account_status: "ACTIVE",
              });
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

              const newStatus = action === "APPROVED" ? "approved" : action === ("PENDING_APPROVAL" as any) ? "pending_approval" : "rejected";
              const isActive = action === "APPROVED";

              // Resolve verifiedByUserId for products.verified_by (references users.id)
              let verifiedByUserId: string | null = null;
              if (adminId) {
                const uCheck = await query("SELECT id FROM users WHERE id = $1 LIMIT 1", [adminId]);
                if (uCheck.rows.length > 0) {
                  verifiedByUserId = uCheck.rows[0].id;
                } else {
                  const uEmailCheck = await query("SELECT id FROM users WHERE email = (SELECT email FROM admins WHERE id = $1 LIMIT 1) LIMIT 1", [adminId]);
                  if (uEmailCheck.rows.length > 0) {
                    verifiedByUserId = uEmailCheck.rows[0].id;
                  } else {
                    const fallbackUser = await query("SELECT id FROM users WHERE role = 'admin' LIMIT 1");
                    if (fallbackUser.rows.length > 0) {
                      verifiedByUserId = fallbackUser.rows[0].id;
                    }
                  }
                }
              }

              // Resolve verifiedByAdminId for product_approval_history.admin_id (references admins.id)
              let verifiedByAdminId: string | null = null;
              if (adminId) {
                const aCheck = await query("SELECT id FROM admins WHERE id = $1 LIMIT 1", [adminId]);
                if (aCheck.rows.length > 0) {
                  verifiedByAdminId = aCheck.rows[0].id;
                } else {
                  const aEmailCheck = await query("SELECT id FROM admins WHERE email = (SELECT email FROM users WHERE id = $1 LIMIT 1) LIMIT 1", [adminId]);
                  if (aEmailCheck.rows.length > 0) {
                    verifiedByAdminId = aEmailCheck.rows[0].id;
                  } else {
                    const fallbackAdmin = await query("SELECT id FROM admins WHERE role = 'PRODUCT_ADMIN' LIMIT 1");
                    if (fallbackAdmin.rows.length > 0) {
                      verifiedByAdminId = fallbackAdmin.rows[0].id;
                    }
                  }
                }
              }

              await query(
                `UPDATE products 
                 SET verification_status = $1, 
                     is_active = $2,
                     verified_by = $3, 
                     verified_at = now(), 
                     rejection_reason = $4, 
                     updated_at = now()
                 WHERE id = $5`,
                [newStatus, isActive, verifiedByUserId, action === "REJECTED" ? (reason || null) : null, productId]
              );

              if (verifiedByAdminId) {
                await query(
                  `INSERT INTO product_approval_history (product_id, admin_id, action, reason)
                   VALUES ($1, $2, $3, $4)`,
                  [productId, verifiedByAdminId, action, reason || null]
                ).catch((err) => console.warn("[Approval History Insert Warning]:", err?.message));
              }

              // Resolve seller record for email and in-dashboard notification
              const sRes = await query(
                `SELECT s.id, s.email, s.store_name, s.owner_name 
                 FROM sellers s 
                 WHERE s.id = $1 OR s.email = (SELECT email FROM users WHERE id = $1 LIMIT 1) 
                 LIMIT 1`,
                [product.seller_id]
              );
              const sellerRow = sRes.rows[0];
              const sellerEmail = sellerRow?.email;
              const targetSellerId = sellerRow?.id || product.seller_id;

              // Insert in-dashboard notification for seller
              await query(
                `INSERT INTO vendor_notifications (id, seller_id, title, message, type, product_id, is_read)
                 VALUES ($1, $2, $3, $4, $5, $6, FALSE)`,
                [
                  `vnotif_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
                  targetSellerId,
                  action === "APPROVED"
                    ? `Product Approved: ${product.name}`
                    : `Product Declined: ${product.name}`,
                  action === "APPROVED"
                    ? `Great news! Your product "${product.name}" has been approved by the Product Administrator and is now live on the RiderzPro customer storefront.`
                    : `Your product submission "${product.name}" was declined. Reason: ${reason || "Does not meet catalog compliance guidelines."}`,
                  action === "APPROVED" ? "product_approved" : "product_rejected",
                  productId,
                ]
              ).catch((err) => console.warn("[Vendor Notif Insertion Warning]:", err?.message));

              // Also write to centralized notifications table
              await createNotification({
                userId: targetSellerId,
                userRole: "seller",
                type: action === "APPROVED" ? "product_approved" : "product_rejected",
                title: action === "APPROVED" ? `Product Approved: ${product.name}` : `Product Declined: ${product.name}`,
                message: action === "APPROVED"
                  ? `Great news! Your product "${product.name}" has been approved and published to the customer storefront.`
                  : `Your product submission "${product.name}" was declined. Reason: ${reason || "Does not meet catalog compliance guidelines."}`,
                entityId: productId,
                targetRoute: "/dashboard/vendor?tab=products",
              });

              // Dispatch transactional email via Gmail SMTP / Resend
              if (sellerEmail) {
                await sendProductApprovalEmail(sellerEmail, product.name, action === "APPROVED", reason).catch((err) => {
                  console.warn("[Product Approval Email Warning]:", err?.message);
                });
              }

              return sendJson(res, 200, {
                success: true,
                status: newStatus,
                isActive,
                message: action === "APPROVED"
                  ? `Product approved and published to customer storefront. Seller notified via email and dashboard.`
                  : `Product declined. Rejection email sent to seller and notification posted to seller dashboard.`,
              });
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
            console.error("[PostgreSQL Cart API Error]:", error);
            return sendJson(res, 500, { success: false, error: error.message });
          }
        }

        // ====================================================================
        // 7. CUSTOMER WISHLIST PERSISTENCE API: /api/wishlist
        // ====================================================================
        if (cleanUrl.startsWith("/api/wishlist")) {
          const rawId = queryParams.get("customer_id") || "usr_customer_demo";

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

              // In-app notifications
              if (custId && custId !== "cst_guest") {
                await createNotification({
                  userId: custId,
                  userRole: "customer",
                  type: "order_placed",
                  title: "Order Placed Successfully",
                  message: `Order #${orderNum} has been placed for ₹${Number(totalAmount).toLocaleString()}. We are processing your delivery.`,
                  entityId: orderId,
                  targetRoute: "/orders",
                });
              }

              if (sellerId) {
                await createNotification({
                  userId: sellerId,
                  userRole: "seller",
                  type: "new_order_received",
                  title: "New Order Received",
                  message: `New order #${orderNum} received for ₹${Number(totalAmount).toLocaleString()}. Please prepare items for dispatch.`,
                  entityId: orderId,
                  targetRoute: "/dashboard/vendor?tab=orders",
                });
              }

              await notifyAdminRole("SELLER_ADMIN", {
                type: "marketplace_order",
                title: "New Marketplace Order",
                message: `Order #${orderNum} placed for ₹${Number(totalAmount).toLocaleString()}.`,
                entityId: orderId,
                targetRoute: "/admin/orders",
              });

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
