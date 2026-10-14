import type { IncomingMessage, ServerResponse } from "http";
import crypto from "node:crypto";
import { initializeDatabaseSchema, query } from "./db";
import { ProductModel, CategoryModel, GarageModel, ServiceBookingModel } from "./models";
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

function parseCookies(req: IncomingMessage): Record<string, string> {
  const list: Record<string, string> = {};
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return list;
  cookieHeader.split(";").forEach((cookie) => {
    const parts = cookie.split("=");
    const name = parts[0]?.trim();
    if (!name) return;
    const value = parts.slice(1).join("=").trim();
    list[name] = decodeURIComponent(value);
  });
  return list;
}

function sha256(val: string): string {
  return crypto.createHash("sha256").update(val).digest("hex");
}

async function getAuthenticatedUser(req: IncomingMessage): Promise<{ id: string; role: string; email?: string } | null> {
  const cookies = parseCookies(req);
  const token = cookies["auth_session"];
  if (!token) return null;
  const tokenHash = sha256(token);
  const s = await query(
    "SELECT user_id, user_role FROM auth_sessions WHERE token_hash = $1 AND expires_at > now() LIMIT 1",
    [tokenHash]
  );
  if (!s.rows[0]) return null;
  return { id: s.rows[0].user_id, role: s.rows[0].user_role };
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
          cleanUrl.startsWith("/api/customer")
        ) {
          const handled = await handleAuthRoute(req, res, cleanUrl, method || "GET");
          if (handled) return;
        }

        // ====================================================================
        // 0.1 REVERSE GEOCODING API: /api/location/reverse-geocode
        // ====================================================================
        if (cleanUrl === "/api/location/reverse-geocode" && method === "GET") {
          const lat = parseFloat(queryParams.get("lat") || "");
          const lng = parseFloat(queryParams.get("lng") || "");
          if (isNaN(lat) || isNaN(lng)) {
            return sendJson(res, 400, { success: false, error: "Invalid coordinates" });
          }

          // 1. Try OpenStreetMap Nominatim with proper User-Agent
          try {
            const nomRes = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
              {
                headers: { "User-Agent": "RiderzPro/1.0 (contact@riderzpro.com)" },
                signal: AbortSignal.timeout(4000),
              }
            );
            if (nomRes.ok) {
              const d: any = await nomRes.json();
              const addr = d.address || {};
              const locality =
                addr.suburb ||
                addr.neighbourhood ||
                addr.residential ||
                addr.road ||
                addr.subdistrict ||
                d.name ||
                "";
              const city =
                addr.city ||
                addr.town ||
                addr.village ||
                addr.city_district ||
                addr.county ||
                addr.state_district ||
                "";
              const state = addr.state || "";
              const pincode = addr.postcode || "";

              if (locality || city) {
                return sendJson(res, 200, {
                  success: true,
                  name: locality || city,
                  city: city || locality || state || "India",
                  state,
                  pincode,
                });
              }
            }
          } catch {}

          // 2. Fallback to BigDataCloud
          try {
            const bdcRes = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`,
              { signal: AbortSignal.timeout(4000) }
            );
            if (bdcRes.ok) {
              const d: any = await bdcRes.json();
              const locality = d.locality || d.city;
              const city = d.city || d.principalSubdivision || "India";
              return sendJson(res, 200, {
                success: true,
                name: locality || city,
                city,
                state: d.principalSubdivision || "",
                pincode: d.postcode || "",
              });
            }
          } catch {}

          return sendJson(res, 200, {
            success: false,
            error: "Could not reverse geocode coordinates",
          });
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

            // POST /api/products/bulk-import (JSON bulk import)
            if (cleanUrl === "/api/products/bulk-import" && method === "POST") {
              const body = await parseBody(req);
              const authUser = await getAuthenticatedUser(req);
              let sellerId = body.seller_id;
              if (authUser && (authUser.role === "seller" || authUser.role === "vendor")) {
                sellerId = authUser.id;
              } else if (!sellerId && authUser) {
                sellerId = authUser.id;
              }

              if (!sellerId) {
                const sRow = await query("SELECT id FROM sellers WHERE status = 'APPROVED' AND account_status != 'FROZEN' LIMIT 1");
                sellerId = sRow.rows[0]?.id || "usr_seller_01";
              }

              // Freeze enforcement
              if (sellerId) {
                const sCheck = await query("SELECT account_status, freeze_reason FROM sellers WHERE id = $1", [sellerId]);
                if (sCheck.rows[0]?.account_status === "FROZEN") {
                  return sendJson(res, 403, {
                    success: false,
                    error: `Vendor account is FROZEN by administration. Bulk import blocked. Reason: ${sCheck.rows[0].freeze_reason || "Compliance review"}.`,
                  });
                }
              }

              const rawList = Array.isArray(body.products) ? body.products : [];
              if (rawList.length === 0) {
                return sendJson(res, 400, { success: false, error: "No products array provided in JSON file." });
              }
              if (rawList.length > 100) {
                return sendJson(res, 400, { success: false, error: "Maximum limit is 100 products per import batch." });
              }

              const importedProducts: any[] = [];
              const failedItems: any[] = [];
              const seenSkus = new Set<string>();

              for (let i = 0; i < rawList.length; i++) {
                const item = rawList[i];
                const index = i + 1;
                const name = (item.name || "").trim();
                const price = Number(item.price);
                const stock = item.stock !== undefined ? parseInt(String(item.stock), 10) : 0;
                const category = (item.category || item.department || "Accessories").trim();
                const brand = (item.brand || "Vendor Certified").trim();
                let sku = (item.sku || "").trim();
                const description = (item.description || "").trim();

                if (!name) {
                  failedItems.push({ index, name: `Item #${index}`, error: "Product name is required and cannot be empty." });
                  continue;
                }
                if (isNaN(price) || price <= 0) {
                  failedItems.push({ index, name, error: "Price must be a valid positive number." });
                  continue;
                }
                if (isNaN(stock) || stock < 0) {
                  failedItems.push({ index, name, error: "Stock quantity must be a non-negative integer." });
                  continue;
                }

                if (!sku) {
                  sku = `SKU-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
                } else if (seenSkus.has(sku.toLowerCase())) {
                  failedItems.push({ index, name, error: `Duplicate SKU '${sku}' found in this import batch.` });
                  continue;
                }
                seenSkus.add(sku.toLowerCase());

                const existingSku = await query("SELECT id FROM products WHERE LOWER(sku) = LOWER($1) LIMIT 1", [sku]);
                if (existingSku.rows.length > 0) {
                  failedItems.push({ index, name, error: `SKU '${sku}' already exists in database.` });
                  continue;
                }

                let primaryImage = "/src/assets/parts.jpg";
                let imageArray: string[] = [];

                if (Array.isArray(item.images) && item.images.length > 0) {
                  imageArray = item.images.map((img: any) => typeof img === "string" ? img : img?.url).filter(Boolean);
                  if (imageArray[0]) primaryImage = imageArray[0];
                } else if (typeof item.image_url === "string" && item.image_url) {
                  primaryImage = item.image_url;
                  imageArray = [primaryImage];
                } else if (typeof item.image === "string" && item.image) {
                  primaryImage = item.image;
                  imageArray = [primaryImage];
                }

                let specsText = "";
                if (item.specifications && typeof item.specifications === "object") {
                  specsText = Object.entries(item.specifications)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(" | ");
                }

                const productId = `prod_${crypto.randomBytes(6).toString("hex")}`;
                const mrp = Number(item.mrp) || Math.round(price * 1.15);
                const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

                const prodRecord = await ProductModel.create({
                  id: productId,
                  seller_id: sellerId,
                  name,
                  brand,
                  sku,
                  description: specsText ? `${description}\n\nSpecifications: ${specsText}` : description,
                  price,
                  mrp,
                  discount_percent: discount,
                  stock,
                  image_url: JSON.stringify(imageArray.length > 0 ? imageArray : [primaryImage]),
                  verification_status: "pending_approval",
                  is_active: false,
                  department: category,
                  variant_model: item.variant_model || item.model || "",
                  fitment_type: item.fitment_type || "universal",
                  compatible_vehicles: Array.isArray(item.compatible_vehicles) ? item.compatible_vehicles : ["universal"],
                  warranty: item.warranty || "1 Year Manufacturer",
                });

                importedProducts.push(prodRecord);
              }

              return sendJson(res, 200, {
                success: true,
                importedCount: importedProducts.length,
                failedCount: failedItems.length,
                errors: failedItems,
                importedProducts,
                message: `Bulk import completed: ${importedProducts.length} imported (awaiting admin certification), ${failedItems.length} failed.`,
              });
            }

            // POST /api/products (Publish product)
            if (method === "POST") {
              const body = await parseBody(req);
              const authUser = await getAuthenticatedUser(req);
              let sellerId = body.seller_id;
              if (authUser && (authUser.role === "seller" || authUser.role === "vendor")) {
                sellerId = authUser.id;
                body.seller_id = sellerId;
              }

              // Freeze enforcement: block product submission if vendor account is frozen
              if (sellerId) {
                const sCheck = await query("SELECT account_status, freeze_reason, store_name FROM sellers WHERE id = $1", [sellerId]);
                if (sCheck.rows[0]?.account_status === "FROZEN") {
                  return sendJson(res, 403, {
                    success: false,
                    error: `Vendor account is FROZEN by administration. Product submissions and selling operations are blocked. Reason: ${sCheck.rows[0].freeze_reason || "Compliance review"}. Designated assistance: riderzpro@selleradmin.com`,
                  });
                }
              }

              // All new vendor products start in pending_approval
              if (!body.verification_status || body.verification_status === "approved") {
                if (!authUser || authUser.role !== "admin") {
                  body.verification_status = "pending_approval";
                  body.is_active = false;
                }
              }

              const created = await ProductModel.create(body);
              return sendJson(res, 201, {
                success: true,
                message: "Product created and submitted for Product Admin approval",
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
        // 2.5 SERVICE BOOKINGS API: /api/service-bookings
        // ====================================================================
        if (cleanUrl.startsWith("/api/service-bookings")) {
          const parts = cleanUrl.split("/").filter(Boolean);
          const bookingId = parts.length > 2 ? parts[2] : null;
          const subAction = parts.length > 3 ? parts[3] : null;

          try {
            // GET /api/service-bookings
            if (method === "GET") {
              const customerId = queryParams.get("customer_id") || "usr_customer_demo";
              const rows = await ServiceBookingModel.findByCustomer(customerId);
              return sendJson(res, 200, { success: true, data: rows });
            }

            // POST /api/service-bookings
            if (method === "POST") {
              const body = await parseBody(req);
              if (!body.service_type) {
                return sendJson(res, 400, { success: false, error: "service_type is required." });
              }
              const created = await ServiceBookingModel.addBooking(body);
              return sendJson(res, 201, {
                success: true,
                message: "Technician appointment booked successfully in database",
                data: created,
              });
            }

            // PUT /api/service-bookings/:id/cancel
            if (method === "PUT" && bookingId && subAction === "cancel") {
              const customerId = queryParams.get("customer_id") || undefined;
              const updated = await ServiceBookingModel.cancelBooking(bookingId, customerId);
              return sendJson(res, 200, { success: true, data: updated });
            }

            // DELETE /api/service-bookings/:id
            if (method === "DELETE" && bookingId) {
              const ok = await ServiceBookingModel.deleteBooking(bookingId);
              return sendJson(res, 200, { success: ok, message: "Booking removed" });
            }

            return sendJson(res, 405, { success: false, error: `Method ${method} not allowed` });
          } catch (error: any) {
            console.error("[Service Bookings API Error]:", error);
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
              const reason = body.reason || body.remarks || "";
              const adminId = body.adminId || body.reviewed_by || "adm_product_01";

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
                    const fallbackAdmin = await query("SELECT id FROM admins WHERE role = 'PRODUCT_ADMIN' OR role = 'SELLER_ADMIN' LIMIT 1");
                    if (fallbackAdmin.rows.length > 0) {
                      verifiedByAdminId = fallbackAdmin.rows[0].id;
                    } else {
                      const anyAdmin = await query("SELECT id FROM admins LIMIT 1");
                      if (anyAdmin.rows.length > 0) verifiedByAdminId = anyAdmin.rows[0].id;
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

              const pahId = `pah_${Math.random().toString(36).substring(2, 10)}`;
              const actualAdminId = verifiedByAdminId || "adm_df0c152a38e104fd";
              await query(
                `INSERT INTO product_approval_history (id, product_id, admin_id, action, reason)
                 VALUES ($1, $2, $3, $4, $5)`,
                [pahId, productId, actualAdminId, action, reason || null]
              ).catch((err) => console.warn("[Approval History Insert Warning]:", err?.message));

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
        // ====================================================================
        // ====================================================================
        // 6. CUSTOMER CART PERSISTENCE API: /api/cart
        // ====================================================================
        if (cleanUrl.startsWith("/api/cart")) {
          const authUser = await getAuthenticatedUser(req);
          const rawId = queryParams.get("customer_id") || authUser?.id || authUser?.email || "usr_customer_demo";

          try {
            const custRow = await query("SELECT id FROM customers WHERE id = $1 OR email = $1 LIMIT 1", [rawId]);
            const customerId = custRow.rows[0]?.id || rawId;

            if (method === "GET") {
              if (!customerId || customerId === "usr_customer_demo") {
                return sendJson(res, 200, { success: true, data: [], items: [] });
              }

              const cartRes = await query("SELECT id FROM carts WHERE customer_id = $1 LIMIT 1", [customerId]);
              if (!cartRes.rows[0]) {
                return sendJson(res, 200, { success: true, data: [], items: [] });
              }
              const itemsRes = await query(
                `SELECT ci.product_id, ci.quantity, p.name, p.price, p.stock, p.image_url, p.is_active, p.verification_status
                 FROM cart_items ci
                 LEFT JOIN products p ON ci.product_id = p.id
                 WHERE ci.cart_id = $1`,
                [cartRes.rows[0].id]
              );
              return sendJson(res, 200, { success: true, data: itemsRes.rows, items: itemsRes.rows });
            }

            if (method === "POST") {
              if (!customerId || customerId === "usr_customer_demo") {
                return sendJson(res, 200, { success: true, message: "Guest session - local storage used", items: [] });
              }

              const body = await parseBody(req);
              let cartRes = await query("SELECT id FROM carts WHERE customer_id = $1 LIMIT 1", [customerId]);
              let cartId = cartRes.rows[0]?.id;
              if (!cartId) {
                cartId = `crt_${crypto.randomBytes(8).toString("hex")}`;
                await query("INSERT INTO carts (id, customer_id) VALUES ($1, $2)", [cartId, customerId]);
              }

              if (Array.isArray(body.items)) {
                // Batch sync from client store
                await query("DELETE FROM cart_items WHERE cart_id = $1", [cartId]);
                for (const it of body.items) {
                  const pid = it.productId || it.product_id;
                  const qty = Math.max(1, Number(it.qty || it.quantity) || 1);
                  if (pid) {
                    const itemId = `ci_${crypto.randomBytes(8).toString("hex")}`;
                    await query(
                      "INSERT INTO cart_items (id, cart_id, product_id, quantity) VALUES ($1, $2, $3, $4)",
                      [itemId, cartId, pid, qty]
                    ).catch(() => {});
                  }
                }
              } else if (body.product_id || body.productId) {
                // Single item add / increment
                const pid = body.product_id || body.productId;
                const addQty = Math.max(1, Number(body.quantity || body.qty) || 1);
                const existing = await query(
                  "SELECT id, quantity FROM cart_items WHERE cart_id = $1 AND product_id = $2 LIMIT 1",
                  [cartId, pid]
                );
                if (existing.rows[0]) {
                  const newQty = Number(existing.rows[0].quantity) + addQty;
                  await query("UPDATE cart_items SET quantity = $1 WHERE id = $2", [newQty, existing.rows[0].id]);
                } else {
                  const itemId = `ci_${crypto.randomBytes(8).toString("hex")}`;
                  await query(
                    "INSERT INTO cart_items (id, cart_id, product_id, quantity) VALUES ($1, $2, $3, $4)",
                    [itemId, cartId, pid, addQty]
                  );
                }
              }

              return sendJson(res, 200, { success: true, message: "Cart synced with database" });
            }

            if (method === "PUT") {
              const body = await parseBody(req);
              const pid = body.product_id || body.productId;
              const newQty = Number(body.quantity || body.qty);
              let cartRes = await query("SELECT id FROM carts WHERE customer_id = $1 LIMIT 1", [customerId]);
              const cartId = cartRes.rows[0]?.id;
              if (cartId && pid) {
                if (newQty <= 0) {
                  await query("DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2", [cartId, pid]);
                } else {
                  await query("UPDATE cart_items SET quantity = $1 WHERE cart_id = $2 AND product_id = $3", [newQty, cartId, pid]);
                }
              }
              return sendJson(res, 200, { success: true, message: "Cart item updated" });
            }

            if (method === "DELETE") {
              const body = await parseBody(req).catch(() => ({}));
              const pid = body.product_id || body.productId || queryParams.get("product_id");
              let cartRes = await query("SELECT id FROM carts WHERE customer_id = $1 LIMIT 1", [customerId]);
              const cartId = cartRes.rows[0]?.id;
              if (cartId) {
                if (pid) {
                  await query("DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2", [cartId, pid]);
                } else {
                  await query("DELETE FROM cart_items WHERE cart_id = $1", [cartId]);
                }
              }
              return sendJson(res, 200, { success: true, message: "Item removed from cart" });
            }

            return sendJson(res, 405, { success: false, error: `Method ${method} not allowed` });
          } catch (error: any) {
            console.error("[Cart API Error]:", error);
            return sendJson(res, 500, { success: false, error: error.message });
          }
        }

        // ====================================================================
        // 7. CUSTOMER WISHLIST PERSISTENCE API: /api/wishlist
        // ====================================================================
        if (cleanUrl.startsWith("/api/wishlist")) {
          const authUser = await getAuthenticatedUser(req);
          const rawId = queryParams.get("customer_id") || authUser?.id || authUser?.email || "usr_customer_demo";

          try {
            const custRow = await query("SELECT id FROM customers WHERE id = $1 OR email = $1 LIMIT 1", [rawId]);
            const customerId = custRow.rows[0]?.id || rawId;

            if (method === "GET") {
              if (!customerId || customerId === "usr_customer_demo") {
                return sendJson(res, 200, { success: true, data: [], items: [] });
              }

              const wishRes = await query("SELECT id FROM wishlists WHERE customer_id = $1 LIMIT 1", [customerId]);
              if (!wishRes.rows[0]) {
                return sendJson(res, 200, { success: true, data: [], items: [] });
              }
              const itemsRes = await query(
                `SELECT wi.product_id, p.name, p.price, p.image_url, p.stock, p.is_active
                 FROM wishlist_items wi
                 LEFT JOIN products p ON wi.product_id = p.id
                 WHERE wi.wishlist_id = $1`,
                [wishRes.rows[0].id]
              );
              return sendJson(res, 200, {
                success: true,
                data: itemsRes.rows.map((r: any) => r.product_id),
                items: itemsRes.rows,
              });
            }

            if (method === "POST") {
              if (!customerId || customerId === "usr_customer_demo") {
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
                wishId = `wsh_${crypto.randomBytes(8).toString("hex")}`;
                await query("INSERT INTO wishlists (id, customer_id) VALUES ($1, $2)", [wishId, customerId]);
              }

              if (wishId) {
                if (action === "add") {
                  const check = await query(
                    "SELECT id FROM wishlist_items WHERE wishlist_id = $1 AND product_id = $2 LIMIT 1",
                    [wishId, productId]
                  );
                  if (!check.rows[0]) {
                    const itemId = `wi_${crypto.randomBytes(8).toString("hex")}`;
                    await query(
                      "INSERT INTO wishlist_items (id, wishlist_id, product_id) VALUES ($1, $2, $3)",
                      [itemId, wishId, productId]
                    ).catch(() => {});
                  }
                } else {
                  await query(
                    "DELETE FROM wishlist_items WHERE wishlist_id = $1 AND product_id = $2",
                    [wishId, productId]
                  ).catch(() => {});
                }
              }

              return sendJson(res, 200, { success: true, message: `Wishlist ${action} completed` });
            }

            if (method === "DELETE") {
              const body = await parseBody(req).catch(() => ({}));
              const productId = body.productId || body.product_id || queryParams.get("product_id");
              const wishRes = await query("SELECT id FROM wishlists WHERE customer_id = $1 LIMIT 1", [customerId]);
              const wishId = wishRes.rows[0]?.id;
              if (wishId && productId) {
                await query("DELETE FROM wishlist_items WHERE wishlist_id = $1 AND product_id = $2", [wishId, productId]);
              }
              return sendJson(res, 200, { success: true, message: "Product removed from wishlist" });
            }

            return sendJson(res, 405, { success: false, error: `Method ${method} not allowed` });
          } catch (error: any) {
            console.error("[Wishlist API Error]:", error);
            return sendJson(res, 500, { success: false, error: error.message });
          }
        }

        // ====================================================================
        // 8. VENDOR & STOREFRONT COUPONS API
        // ====================================================================
        if (cleanUrl.startsWith("/api/vendor/coupons")) {
          const parts = cleanUrl.split("/").filter(Boolean); // ['api', 'vendor', 'coupons', optionalId]
          const couponId = parts.length > 3 ? parts[3] : null;

          try {
            const authUser = await getAuthenticatedUser(req);
            const querySellerId = queryParams.get("seller_id") || queryParams.get("vendor_id");
            let sellerId = querySellerId;
            if (authUser && (authUser.role === "seller" || authUser.role === "vendor")) {
              sellerId = authUser.id;
            }
            if (!sellerId) {
              const defSeller = await query("SELECT id FROM sellers WHERE status = 'APPROVED' LIMIT 1");
              sellerId = defSeller.rows[0]?.id || "usr_seller_01";
            }

            // GET /api/vendor/coupons
            if (method === "GET") {
              const sql = sellerId
                ? "SELECT * FROM coupons WHERE vendor_id = $1 ORDER BY created_at DESC"
                : "SELECT * FROM coupons ORDER BY created_at DESC";
              const params = sellerId ? [sellerId] : [];
              const cRes = await query(sql, params);

              const coupons = await Promise.all(
                cRes.rows.map(async (c: any) => {
                  const pRes = await query("SELECT product_id FROM coupon_products WHERE coupon_id = $1", [c.id]);
                  return {
                    ...c,
                    productIds: pRes.rows.map((p: any) => p.product_id),
                  };
                })
              );

              return sendJson(res, 200, { success: true, coupons });
            }

            // POST /api/vendor/coupons
            if (method === "POST") {
              const body = await parseBody(req);
              const code = (body.code || "").trim().toUpperCase();
              const description = (body.description || "").trim();
              const discountType = body.discount_type || body.discountType || "percentage";
              const discountValue = Number(body.discount_value || body.discountValue) || 0;
              const minOrder = Number(body.minimum_order_value || body.minimumOrderValue) || 0;
              const maxDiscount = body.maximum_discount || body.maximumDiscount ? Number(body.maximum_discount || body.maximumDiscount) : null;
              const startsAt = body.starts_at || body.startsAt || new Date().toISOString().split("T")[0];
              const expiresAt = body.expires_at || body.expiresAt || null;
              const usageLimit = body.usage_limit ? Number(body.usage_limit) : null;
              const perCustomerLimit = body.per_customer_limit ? Number(body.per_customer_limit) : 1;
              const selectedProducts: string[] = Array.isArray(body.product_ids || body.productIds) ? (body.product_ids || body.productIds) : [];

              if (!code || code.length < 3) {
                return sendJson(res, 400, { success: false, error: "Coupon code must be at least 3 characters." });
              }
              if (discountValue <= 0) {
                return sendJson(res, 400, { success: false, error: "Discount value must be greater than zero." });
              }

              // Check code uniqueness
              const codeCheck = await query("SELECT id FROM coupons WHERE LOWER(code) = LOWER($1) LIMIT 1", [code]);
              if (codeCheck.rows.length > 0) {
                return sendJson(res, 409, { success: false, error: `Coupon code '${code}' already exists.` });
              }

              // Validate vendor ownership of selected products
              if (selectedProducts.length > 0 && sellerId) {
                for (const pid of selectedProducts) {
                  const pCheck = await query("SELECT seller_id FROM products WHERE id = $1", [pid]);
                  if (pCheck.rows[0] && pCheck.rows[0].seller_id && pCheck.rows[0].seller_id !== sellerId) {
                    return sendJson(res, 403, {
                      success: false,
                      error: `Unauthorized: Product '${pid}' does not belong to your store. You can only attach coupons to your own products.`,
                    });
                  }
                }
              }

              const cId = `cpn_${crypto.randomBytes(8).toString("hex")}`;
              await query(
                `INSERT INTO coupons (id, vendor_id, code, description, discount_type, discount_value, minimum_order_value, maximum_discount, starts_at, expires_at, usage_limit, per_customer_limit, status)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'active')`,
                [cId, sellerId, code, description, discountType, discountValue, minOrder, maxDiscount, startsAt, expiresAt, usageLimit, perCustomerLimit]
              );

              for (const pid of selectedProducts) {
                await query("INSERT INTO coupon_products (coupon_id, product_id) VALUES ($1, $2)", [cId, pid]).catch(() => {});
              }

              return sendJson(res, 201, {
                success: true,
                message: "Coupon created successfully and linked to selected products",
                coupon: {
                  id: cId,
                  code,
                  description,
                  discount_type: discountType,
                  discount_value: discountValue,
                  productIds: selectedProducts,
                },
              });
            }

            // PUT /api/vendor/coupons/:id
            if (method === "PUT" && couponId) {
              const body = await parseBody(req);
              const status = body.status;
              const selectedProducts = body.product_ids || body.productIds;

              if (status) {
                await query("UPDATE coupons SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2", [status, couponId]);
              }

              if (Array.isArray(selectedProducts)) {
                await query("DELETE FROM coupon_products WHERE coupon_id = $1", [couponId]);
                for (const pid of selectedProducts) {
                  await query("INSERT INTO coupon_products (coupon_id, product_id) VALUES ($1, $2)", [couponId, pid]).catch(() => {});
                }
              }

              return sendJson(res, 200, { success: true, message: "Coupon updated successfully" });
            }

            // DELETE /api/vendor/coupons/:id
            if (method === "DELETE" && couponId) {
              await query("DELETE FROM coupon_products WHERE coupon_id = $1", [couponId]);
              await query("DELETE FROM coupons WHERE id = $1", [couponId]);
              return sendJson(res, 200, { success: true, message: "Coupon deleted successfully" });
            }

            return sendJson(res, 405, { success: false, error: `Method ${method} not allowed` });
          } catch (err: any) {
            console.error("[Vendor Coupons API Error]:", err);
            return sendJson(res, 500, { success: false, error: err.message });
          }
        }

        // Coupon Validation & Applicable Coupons: /api/coupons/applicable & /api/coupons/validate
        if (cleanUrl === "/api/coupons/applicable") {
          const productId = queryParams.get("product_id");
          if (!productId) return sendJson(res, 200, { success: true, coupons: [] });

          const rows = await query(
            `SELECT c.id, c.code, c.description, c.discount_type, c.discount_value, c.minimum_order_value, c.maximum_discount, c.expires_at
             FROM coupons c
             JOIN coupon_products cp ON c.id = cp.coupon_id
             WHERE cp.product_id = $1 AND c.status = 'active'
             ORDER BY c.discount_value DESC`,
            [productId]
          );
          return sendJson(res, 200, { success: true, coupons: rows.rows });
        }

        if (cleanUrl === "/api/coupons/validate" && method === "POST") {
          try {
            const body = await parseBody(req);
            const rawCode = (body.code || "").trim().toUpperCase();
            const items = Array.isArray(body.cart_items) ? body.cart_items : (Array.isArray(body.items) ? body.items : []);

            if (!rawCode) {
              return sendJson(res, 400, { success: false, valid: false, error: "Please enter a coupon code." });
            }

            const cRes = await query("SELECT * FROM coupons WHERE UPPER(code) = $1 LIMIT 1", [rawCode]);
            const coupon = cRes.rows[0];
            if (!coupon) {
              return sendJson(res, 200, { success: false, valid: false, error: `Coupon code '${rawCode}' is not valid.` });
            }

            if (coupon.status !== "active") {
              return sendJson(res, 200, { success: false, valid: false, error: "This coupon is currently inactive." });
            }

            if (coupon.expires_at) {
              const expiry = new Date(coupon.expires_at);
              if (Date.now() > expiry.getTime() + 86400000) {
                return sendJson(res, 200, { success: false, valid: false, error: "This coupon has expired." });
              }
            }

            if (coupon.starts_at) {
              const start = new Date(coupon.starts_at);
              if (Date.now() < start.getTime()) {
                return sendJson(res, 200, { success: false, valid: false, error: "This coupon promotion has not started yet." });
              }
            }

            const cpRes = await query("SELECT product_id FROM coupon_products WHERE coupon_id = $1", [coupon.id]);
            const eligiblePids = new Set(cpRes.rows.map((r: any) => r.product_id));

            let eligibleItems = items;
            if (eligiblePids.size > 0) {
              eligibleItems = items.filter((it: any) => eligiblePids.has(it.productId || it.product_id));
              if (eligibleItems.length === 0) {
                return sendJson(res, 200, {
                  success: false,
                  valid: false,
                  error: `Coupon '${coupon.code}' is only valid on selected products, none of which are in your cart.`,
                });
              }
            }

            const eligibleSubtotal = eligibleItems.reduce((acc: number, it: any) => {
              const p = Number(it.price) || 0;
              const q = Number(it.quantity ?? it.qty ?? 1);
              return acc + p * q;
            }, 0);

            const effectiveTotal = body.order_total !== undefined ? Number(body.order_total) : eligibleSubtotal;

            if (coupon.minimum_order_value && effectiveTotal < Number(coupon.minimum_order_value)) {
              return sendJson(res, 200, {
                success: false,
                valid: false,
                error: `Minimum order value of ₹${coupon.minimum_order_value} required for this coupon (order total: ₹${effectiveTotal}).`,
              });
            }

            let discount = 0;
            if (coupon.discount_type === "percentage") {
              discount = Math.round(eligibleSubtotal * (Number(coupon.discount_value) / 100));
            } else {
              discount = Math.min(Number(coupon.discount_value), eligibleSubtotal);
            }

            if (coupon.maximum_discount && discount > Number(coupon.maximum_discount)) {
              discount = Number(coupon.maximum_discount);
            }

            return sendJson(res, 200, {
              success: true,
              valid: true,
              discount,
              discount_amount: discount,
              coupon: {
                id: coupon.id,
                code: coupon.code,
                description: coupon.description,
                discountType: coupon.discount_type,
                discountValue: coupon.discount_value,
                eligibleProductIds: Array.from(eligiblePids),
              },
              message: `Coupon '${coupon.code}' applied! ₹${discount} saved.`,
            });
          } catch (err: any) {
            console.error("[Coupon Validate Error]:", err);
            return sendJson(res, 500, { success: false, error: err.message });
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
              const totalAmount = Number(body.total_amount || body.total || 0);
              if (isNaN(totalAmount) || totalAmount <= 0) {
                return sendJson(res, 400, {
                  success: false,
                  error: "Order total amount must be greater than ₹0. Please add valid items to your cart.",
                });
              }
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
