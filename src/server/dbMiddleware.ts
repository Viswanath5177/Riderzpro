import type { IncomingMessage, ServerResponse } from "http";
import crypto from "node:crypto";
import { initializeDatabaseSchema, query, isPostgresAvailable } from "./db";
import { ProductModel, CategoryModel, GarageModel, ServiceBookingModel } from "./models";
import {
  sendVendorApprovedEmail,
  sendVendorRejectedEmail,
  sendVendorMoreInfoEmail,
  sendProductApprovalEmail,
  sendCustomerOrderPlacedEmail,
  sendVendorNewOrderEmail,
} from "../lib/email.server";
import { handleAuthRoute, getAuthenticatedUser, type AuthenticatedUser } from "./authRoutes";
import { handleSuperAdminRoute, getVerifiedAdmin } from "./superAdminRoutes";
import { createNotification, notifyAdminRole } from "./notifications";
import { handleRoute as riderRoute } from "./routes/rider";
import { handleRoute as deliveriesRoute } from "./routes/deliveries";
import { handleRoute as paymentsRoute } from "./routes/payments";
import { handleRoute as assistantRoute } from "./routes/assistant";

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

function verifyCsrf(req: IncomingMessage): boolean {
  const method = req.method?.toUpperCase();
  if (method === "GET" || method === "HEAD" || method === "OPTIONS") return true;

  const cookies = parseCookies(req);
  if (!cookies["auth_session"]) return true;

  const origin = req.headers.origin as string | undefined;
  const referer = req.headers.referer as string | undefined;
  const host = req.headers.host;

  if (origin) {
    try {
      const originHost = new URL(origin).host;
      return originHost === host;
    } catch {
      return false;
    }
  }

  if (referer) {
    try {
      const refererHost = new URL(referer).host;
      return refererHost === host;
    } catch {
      return false;
    }
  }

  return true;
}

function isAdminRole(role?: string): boolean {
  if (!role) return false;
  const r = role.toLowerCase();
  return r === "admin" || r === "super_admin" || r === "superadmin";
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
        // Permanently decommissioned admin login endpoints -> redirect to /vendor/login
        // ====================================================================
        if (cleanUrl === "/admin/login" || cleanUrl === "/super-admin/login") {
          const dest = queryString ? `/vendor/login?${queryString}` : "/vendor/login";
          res.writeHead(302, { Location: dest });
          res.end();
          return;
        }

        // ====================================================================
        // CSRF Verification for Cookie-Authenticated Mutating Requests
        // ====================================================================
        if (cleanUrl.startsWith("/api/") && !verifyCsrf(req)) {
          return sendJson(res, 403, { success: false, error: "CSRF verification failed: untrusted request origin." });
        }

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
        // 0.05 SUPER ADMIN PLATFORM API: /api/superadmin/*
        // ====================================================================
        if (cleanUrl.startsWith("/api/superadmin")) {
          const handled = await handleSuperAdminRoute(req, res, cleanUrl, method || "GET", queryParams);
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
        // 0.2 PLACES SEARCH API: /api/location/places
        // ====================================================================
        if (cleanUrl === "/api/location/places" && method === "GET") {
          const q = (queryParams.get("q") || "").trim();
          if (!q || q.length < 2) {
            return sendJson(res, 200, { success: true, places: [] });
          }

          const googleApiKey = process.env["GOOGLE_MAPS_API_KEY"] || process.env["VITE_GOOGLE_MAPS_API_KEY"] || "";

          // 1. If Google Maps API Key is provided, query Google Places Autocomplete
          if (googleApiKey) {
            try {
              const gRes = await fetch(
                `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(q)}&key=${googleApiKey}&components=country:in`,
                { signal: AbortSignal.timeout(4000) }
              );
              if (gRes.ok) {
                const gData: any = await gRes.json();
                if (gData.status === "OK" && Array.isArray(gData.predictions) && gData.predictions.length > 0) {
                  const places = gData.predictions.map((p: any) => {
                    const terms = (p.terms || []).map((t: any) => t.value);
                    const name = p.structured_formatting?.main_text || terms[0] || q;
                    const secondary = p.structured_formatting?.secondary_text || terms.slice(1).join(", ");
                    const city = terms.length > 2 ? terms[terms.length - 3] : (terms[1] || "India");
                    const state = terms.length > 1 ? terms[terms.length - 2] : "";

                    return {
                      id: p.place_id || `gplace-${Date.now()}`,
                      name,
                      description: p.description || `${name}, ${secondary}`,
                      city: city || name,
                      state: state || "",
                      pincode: "",
                      source: "google",
                    };
                  });

                  return sendJson(res, 200, { success: true, places, source: "google" });
                }
              }
            } catch (err: any) {
              console.warn("[Google Places API Warning]:", err?.message);
            }
          }

          // 2. High-speed OpenStreetMap Photon Places Geocoder
          try {
            const userLat = queryParams.get("lat") || "16.5062"; // Default near Vijayawada/AP or India
            const userLng = queryParams.get("lng") || "80.6480";
            const photonRes = await fetch(
              `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&lat=${userLat}&lon=${userLng}&limit=10`,
              {
                headers: { "User-Agent": "RiderzPro/1.0 (contact@riderzpro.com)" },
                signal: AbortSignal.timeout(4000),
              }
            );
            if (photonRes.ok) {
              const pData: any = await photonRes.json();
              if (Array.isArray(pData.features) && pData.features.length > 0) {
                const places = pData.features.map((f: any, idx: number) => {
                  const props = f.properties || {};
                  const name = props.name || props.street || props.city || q;
                  const parts = [props.street, props.city || props.county, props.state, props.postcode, props.country].filter(Boolean);
                  const city = props.city || props.county || props.state || "India";
                  const state = props.state || "";
                  const pincode = props.postcode || "";
                  const description = parts.length > 0 ? `${name}, ${parts.join(", ")}` : name;

                  return {
                    id: `place-${props.osm_id || idx}`,
                    name,
                    description,
                    city,
                    state,
                    pincode,
                    lat: f.geometry?.coordinates?.[1] || 12.9716,
                    lng: f.geometry?.coordinates?.[0] || 77.5946,
                    source: "osm_photon",
                  };
                });

                // Prioritize Indian localities
                places.sort((a: any, b: any) => {
                  const aIn = (a.description || "").toLowerCase().includes("india") ? 1 : 0;
                  const bIn = (b.description || "").toLowerCase().includes("india") ? 1 : 0;
                  return bIn - aIn;
                });

                return sendJson(res, 200, { success: true, places, source: "photon" });
              }
            }
          } catch (err: any) {
            console.warn("[Photon Places Geocoder Warning]:", err?.message);
          }

          // 3. OpenStreetMap Nominatim Fallback
          try {
            const nomRes = await fetch(
              `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(q)}&countrycodes=in&limit=8&addressdetails=1`,
              {
                headers: { "User-Agent": "RiderzPro/1.0 (contact@riderzpro.com)" },
                signal: AbortSignal.timeout(4000),
              }
            );
            if (nomRes.ok) {
              const nData: any = await nomRes.json();
              if (Array.isArray(nData) && nData.length > 0) {
                const places = nData.map((item: any, idx: number) => {
                  const addr = item.address || {};
                  const name = item.name || addr.road || addr.suburb || addr.city || q;
                  const city = addr.city || addr.town || addr.village || addr.county || "India";
                  const state = addr.state || "";
                  const pincode = addr.postcode || "";

                  return {
                    id: `nom-${item.place_id || idx}`,
                    name,
                    description: item.display_name || name,
                    city,
                    state,
                    pincode,
                    lat: parseFloat(item.lat),
                    lng: parseFloat(item.lon),
                    source: "nominatim",
                  };
                });

                return sendJson(res, 200, { success: true, places, source: "nominatim" });
              }
            }
          } catch {}

          return sendJson(res, 200, { success: true, places: [] });
        }


        // ====================================================================
        // 1. PRODUCTS API: /api/products
        // ====================================================================
        if (cleanUrl.startsWith("/api/products")) {
          const parts = cleanUrl.split("/").filter(Boolean); // ['api', 'products', optionalId]
          const productId = parts.length > 2 ? parts[2] : null;

          try {
            // Sub-routes for products: /api/products/:id/reviews...
            if (parts.length >= 4 && parts[3] === "reviews") {
              const pId = parts[2];
              // POST /api/products/:id/reviews/:reviewId/helpful
              if (parts.length >= 6 && parts[5] === "helpful" && method === "POST") {
                const rId = parts[4];
                await query(
                  `UPDATE product_reviews SET helpful_count = COALESCE(helpful_count, 0) + 1 WHERE id = $1`,
                  [rId]
                );
                return sendJson(res, 200, { success: true, message: "Marked as helpful" });
              }

              // POST /api/products/:id/reviews
              if (method === "POST") {
                const body = await parseBody(req);
                const rating = Number(body.rating);
                const title = (body.title || "").trim();
                const comment = (body.comment || "").trim();
                const userName = (body.userName || body.user_name || "Verified Customer").trim();
                const userCity = (body.userCity || body.user_city || "Bengaluru").trim();
                const fitmentVehicle = (body.fitmentVehicle || body.fitment_vehicle || "").trim();

                if (!rating || rating < 1 || rating > 5 || !title || !comment) {
                  return sendJson(res, 400, {
                    success: false,
                    error: "Rating (1-5), review title, and detailed comments are required.",
                  });
                }

                const reviewId = `rev_${crypto.randomBytes(8).toString("hex")}`;
                await query(
                  `INSERT INTO product_reviews (
                    id, product_id, user_id, user_name, user_city, rating, title, comment, fitment_vehicle, is_verified_purchase, status
                  ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true, 'published')`,
                  [
                    reviewId,
                    pId,
                    body.userId || `usr_${crypto.randomBytes(6).toString("hex")}`,
                    userName,
                    userCity,
                    rating,
                    title,
                    comment,
                    fitmentVehicle || null,
                  ]
                );

                // Recalculate average rating & count on products table
                const statsRes = await query(
                  `SELECT AVG(rating) as avg_rating, COUNT(*) as count FROM product_reviews WHERE product_id = $1 AND status = 'published'`,
                  [pId]
                );
                const newAvg = Math.round(Number(statsRes.rows[0]?.avg_rating || rating) * 10) / 10;
                const newCount = Number(statsRes.rows[0]?.count || 1);
                await query(
                  `UPDATE products SET rating = $1, reviews_count = $2 WHERE id = $3`,
                  [newAvg, newCount, pId]
                );

                return sendJson(res, 201, {
                  success: true,
                  message: "Product review published successfully",
                  review: {
                    id: reviewId,
                    productId: pId,
                    userName,
                    userCity,
                    rating,
                    title,
                    comment,
                    fitmentVehicle,
                    isVerifiedPurchase: true,
                    helpfulCount: 0,
                    date: new Date().toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" }),
                  },
                  stats: {
                    average_rating: newAvg,
                    review_count: newCount,
                  },
                });
              }

              // GET /api/products/:id/reviews
              if (method === "GET") {
                const reviewsRes = await query(
                  `SELECT id, product_id, user_id, user_name, user_city, rating, title, comment, fitment_vehicle, is_verified_purchase, helpful_count, status, created_at
                   FROM product_reviews
                   WHERE product_id = $1 AND status = 'published'
                   ORDER BY created_at DESC`,
                  [pId]
                );
                const reviews = reviewsRes.rows.map((r: any) => ({
                  id: r.id,
                  productId: r.product_id,
                  userId: r.user_id,
                  userName: r.user_name,
                  userCity: r.user_city,
                  rating: Number(r.rating),
                  title: r.title,
                  comment: r.comment,
                  fitmentVehicle: r.fitment_vehicle,
                  isVerifiedPurchase: Boolean(r.is_verified_purchase),
                  helpfulCount: Number(r.helpful_count) || 0,
                  date: new Date(r.created_at).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" }),
                  createdAt: r.created_at,
                }));
                const total = reviews.length;
                const avg = total > 0
                  ? Math.round((reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / total) * 10) / 10
                  : 0;
                return sendJson(res, 200, {
                  success: true,
                  reviews,
                  total,
                  average_rating: avg,
                });
              }
            }

            // GET /api/products/:id or GET /api/products
            if (method === "GET") {
              if (productId && productId !== "bulk-import" && productId !== "batch-delete") {
                const item = await ProductModel.findById(productId);
                if (!item) {
                  return sendJson(res, 404, { success: false, error: "Product not found" });
                }

                // 1. Primary Seller Information
                let sellerData: any = null;
                if (item.seller_id) {
                  const sRes = await query(
                    `SELECT id, store_name, owner_name, email, phone, city, state, pincode, business_address, rating, review_count, status
                     FROM sellers WHERE id = $1 LIMIT 1`,
                    [item.seller_id]
                  );
                  sellerData = sRes.rows[0] || null;
                }

                // 2. Multi-Vendor Offers
                const offersRes = await query(
                  `SELECT 
                     po.id,
                     po.product_id,
                     po.vendor_id,
                     po.price,
                     po.mrp,
                     po.stock,
                     po.status,
                     po.warranty_terms,
                     po.shipping_charge,
                     po.delivery_days,
                     po.dispatch_hours,
                     s.store_name,
                     s.owner_name,
                     s.city as seller_city,
                     s.rating as seller_rating,
                     s.review_count as seller_review_count
                   FROM product_offers po
                   JOIN sellers s ON po.vendor_id = s.id
                   WHERE po.product_id = $1 AND po.status = 'active'
                   ORDER BY po.price ASC`,
                  [productId]
                );

                let offers = offersRes.rows.map((row: any) => ({
                  id: row.id,
                  vendorId: row.vendor_id,
                  sellerName: row.store_name || row.owner_name,
                  storeName: row.store_name,
                  ownerName: row.owner_name,
                  city: row.seller_city || "Bengaluru",
                  rating: Number(row.seller_rating) || 0,
                  reviewCount: Number(row.seller_review_count) || 0,
                  price: Number(row.price),
                  mrp: row.mrp ? Number(row.mrp) : (item.mrp ? Number(item.mrp) : Math.round(Number(row.price) * 1.15)),
                  stock: Number(row.stock),
                  warrantyTerms: row.warranty_terms || item.warranty || "12 Months Manufacturer",
                  shippingCharge: Number(row.shipping_charge) || 0,
                  deliveryDays: row.delivery_days || "2-3 business days",
                  dispatchHours: Number(row.dispatch_hours) || 24,
                }));

                const hasPrimary = offers.some((o: any) => o.vendorId === item.seller_id);
                if (!hasPrimary && item.seller_id) {
                  offers.unshift({
                    id: `off_primary_${item.id}`,
                    vendorId: item.seller_id,
                    sellerName: sellerData?.store_name || item.store_name || "Authorized Dealer",
                    storeName: sellerData?.store_name || item.store_name || "Authorized Dealer",
                    ownerName: sellerData?.owner_name || item.seller_name || "Authorized Dealer",
                    city: sellerData?.city || "Bengaluru",
                    rating: Number(sellerData?.rating) || 0,
                    reviewCount: Number(sellerData?.review_count) || 0,
                    price: Number(item.price),
                    mrp: item.mrp ? Number(item.mrp) : Math.round(Number(item.price) * 1.15),
                    stock: Number(item.stock),
                    warrantyTerms: item.warranty || "12 Months Manufacturer",
                    shippingCharge: 0,
                    deliveryDays: item.delivery_time || "2-3 business days",
                    dispatchHours: 24,
                  });
                }

                // 3. Customer Reviews & Computed Statistics
                const reviewsRes = await query(
                  `SELECT id, product_id, user_id, user_name, user_city, rating, title, comment, fitment_vehicle, is_verified_purchase, helpful_count, status, created_at
                   FROM product_reviews
                   WHERE product_id = $1 AND status = 'published'
                   ORDER BY created_at DESC`,
                  [productId]
                );
                const reviews = reviewsRes.rows.map((r: any) => ({
                  id: r.id,
                  productId: r.product_id,
                  userId: r.user_id,
                  userName: r.user_name,
                  userCity: r.user_city,
                  rating: Number(r.rating),
                  title: r.title,
                  comment: r.comment,
                  fitmentVehicle: r.fitment_vehicle,
                  isVerifiedPurchase: Boolean(r.is_verified_purchase),
                  helpfulCount: Number(r.helpful_count) || 0,
                  date: new Date(r.created_at).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" }),
                  createdAt: r.created_at,
                }));

                const totalReviews = reviews.length;
                const avgRating = totalReviews > 0
                  ? Math.round((reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / totalReviews) * 10) / 10
                  : 0;

                const distribution: Record<number, { count: number; percentage: number }> = {
                  5: { count: 0, percentage: 0 },
                  4: { count: 0, percentage: 0 },
                  3: { count: 0, percentage: 0 },
                  2: { count: 0, percentage: 0 },
                  1: { count: 0, percentage: 0 },
                };
                for (const rev of reviews) {
                  const rounded = Math.min(5, Math.max(1, Math.round(rev.rating)));
                  if (distribution[rounded]) distribution[rounded].count++;
                }
                if (totalReviews > 0) {
                  for (let i = 1; i <= 5; i++) {
                    distribution[i].percentage = Math.round((distribution[i].count / totalReviews) * 100);
                  }
                }

                // 4. Similar Products
                const similarRes = await query(
                  `SELECT p.*, c.name as category_name, s.store_name
                   FROM products p
                   LEFT JOIN categories c ON p.category_id = c.id
                   LEFT JOIN sellers s ON p.seller_id = s.id
                   WHERE (p.category_id = $1 OR p.department = $2)
                     AND p.id != $3
                     AND (p.verification_status::text ILIKE 'approved')
                     AND (p.is_active = true OR p.is_active IS NULL)
                   ORDER BY p.created_at DESC
                   LIMIT 4`,
                  [item.category_id, item.department || "", productId]
                );
                const similarProducts = similarRes.rows.map((row: any) => ({
                  ...row,
                  price: Number(row.price),
                  mrp: row.mrp !== null ? Number(row.mrp) : null,
                  stock: Number(row.stock),
                  weight_kg: Number(row.weight_kg),
                }));

                return sendJson(res, 200, {
                  success: true,
                  data: {
                    ...item,
                    seller: sellerData,
                    offers,
                    reviews,
                    stats: {
                      average_rating: avgRating,
                      review_count: totalReviews,
                      rating_distribution: distribution,
                    },
                    similar_products: similarProducts,
                  },
                });
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
                const name = (item.name || item.title || item.product_name || item.productName || "").trim();
                const price = Number(item.price ?? item.selling_price ?? item.sellingPrice ?? item.mrp);
                const stock = item.stock !== undefined
                  ? parseInt(String(item.stock), 10)
                  : item.quantity !== undefined
                  ? parseInt(String(item.quantity), 10)
                  : 0;
                const category = (item.category || item.department || "Accessories").trim();
                const brand = (item.brand || item.make || "Vendor Certified").trim();
                let sku = (item.sku || item.sku_code || item.partNumber || "").trim();
                const description = (item.description || item.desc || "").trim();

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
                }
                const existingSku = await query("SELECT id FROM products WHERE LOWER(sku) = LOWER($1) LIMIT 1", [sku]);
                if (existingSku.rows.length > 0 || seenSkus.has(sku.toLowerCase())) {
                  sku = `${sku}-${Math.floor(100 + Math.random() * 900)}`;
                }
                seenSkus.add(sku.toLowerCase());

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

                // Create vendor offer record so this product binds to the vendor
                await query(`
                  INSERT INTO product_offers (
                    id, product_id, vendor_id, price, stock, status, warranty_terms, dispatch_hours
                  ) VALUES ($1, $2, $3, $4, $5, 'active', $6, 24)
                  ON CONFLICT (id) DO NOTHING
                `, [
                  `off_${crypto.randomBytes(6).toString("hex")}`,
                  productId,
                  sellerId,
                  price,
                  stock,
                  item.warranty || "1 Year Manufacturer",
                ]).catch(() => {});

                // Log into approval history for admin review
                await query(`
                  INSERT INTO product_approval_history (id, product_id, admin_id, action, reason)
                  VALUES ($1, $2, 'SYSTEM', 'pending_approval', 'Bulk imported by vendor, queued for admin verification')
                `, [`pah_${crypto.randomBytes(6).toString("hex")}`, productId]).catch(() => {});

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

            // POST /api/products/batch-delete
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
          const authUser = await getAuthenticatedUser(req);
          if (!authUser) {
            return sendJson(res, 401, { success: false, error: "Authentication required to access garage." });
          }

          let customerId = authUser.id;
          const paramCust = queryParams.get("customer_id");
          if (authUser.role === "customer") {
            if (paramCust && paramCust !== authUser.id) {
              return sendJson(res, 403, { success: false, error: "Access denied. Cannot access another customer's garage." });
            }
          } else if (isAdminRole(authUser?.role)) {
            customerId = paramCust || authUser.id;
          } else {
            return sendJson(res, 403, { success: false, error: "Forbidden." });
          }

          const parts = cleanUrl.split("/").filter(Boolean);
          const garageId = parts.length > 2 ? parts[2] : null;
          const subAction = parts.length > 3 ? parts[3] : null;

          try {
            // GET /api/garage
            if (method === "GET") {
              const rows = await GarageModel.findByCustomer(customerId);
              return sendJson(res, 200, { success: true, data: rows });
            }

            // POST /api/garage
            if (method === "POST") {
              const body = await parseBody(req);
              if (!body.vehicle_id || !body.make || !body.model) {
                return sendJson(res, 400, { success: false, error: "Vehicle details (vehicle_id, make, model) required." });
              }
              body.customer_id = customerId;
              const created = await GarageModel.addVehicle(body);
              return sendJson(res, 201, {
                success: true,
                message: "Vehicle added to Customer Garage successfully in PostgreSQL",
                data: created,
              });
            }

            // PUT /api/garage/:id/active
            if (method === "PUT" && garageId && subAction === "active") {
              const updated = await GarageModel.setActive(garageId, customerId);
              return sendJson(res, 200, { success: true, data: updated });
            }

            // DELETE /api/garage/:id
            if (method === "DELETE" && garageId) {
              const checkRow = await query("SELECT customer_id FROM customer_garage WHERE id = $1 LIMIT 1", [garageId]);
              if (checkRow.rows[0] && checkRow.rows[0].customer_id !== customerId && authUser.role !== "admin" && authUser.role !== "superadmin") {
                return sendJson(res, 403, { success: false, error: "Cannot delete vehicle belonging to another customer." });
              }
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
          const authUser = await getAuthenticatedUser(req);
          if (!authUser) {
            return sendJson(res, 401, { success: false, error: "Authentication required to access service bookings." });
          }

          let customerId = authUser.id;
          const paramCust = queryParams.get("customer_id");
          if (authUser.role === "customer") {
            if (paramCust && paramCust !== authUser.id) {
              return sendJson(res, 403, { success: false, error: "Access denied. Cannot access another customer's bookings." });
            }
          } else if (isAdminRole(authUser?.role)) {
            customerId = paramCust || authUser.id;
          } else {
            return sendJson(res, 403, { success: false, error: "Forbidden." });
          }

          const parts = cleanUrl.split("/").filter(Boolean);
          const bookingId = parts.length > 2 ? parts[2] : null;
          const subAction = parts.length > 3 ? parts[3] : null;

          try {
            // GET /api/service-bookings
            if (method === "GET") {
              const rows = await ServiceBookingModel.findByCustomer(customerId);
              return sendJson(res, 200, { success: true, data: rows });
            }

            // POST /api/service-bookings
            if (method === "POST") {
              const body = await parseBody(req);
              if (!body.service_type) {
                return sendJson(res, 400, { success: false, error: "service_type is required." });
              }
              body.customer_id = customerId;
              const created = await ServiceBookingModel.addBooking(body);
              return sendJson(res, 201, {
                success: true,
                message: "Technician appointment booked successfully in database",
                data: created,
              });
            }

            // PUT /api/service-bookings/:id/cancel
            if (method === "PUT" && bookingId && subAction === "cancel") {
              const checkRow = await query("SELECT customer_id FROM service_bookings WHERE id = $1 LIMIT 1", [bookingId]);
              if (checkRow.rows[0] && checkRow.rows[0].customer_id !== customerId && authUser.role !== "admin" && authUser.role !== "superadmin") {
                return sendJson(res, 403, { success: false, error: "Cannot cancel booking belonging to another customer." });
              }
              const updated = await ServiceBookingModel.cancelBooking(bookingId, customerId);
              return sendJson(res, 200, { success: true, data: updated });
            }

            // DELETE /api/service-bookings/:id
            if (method === "DELETE" && bookingId) {
              const checkRow = await query("SELECT customer_id FROM service_bookings WHERE id = $1 LIMIT 1", [bookingId]);
              if (checkRow.rows[0] && checkRow.rows[0].customer_id !== customerId && authUser.role !== "admin" && authUser.role !== "superadmin") {
                return sendJson(res, 403, { success: false, error: "Cannot delete booking belonging to another customer." });
              }
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
            const authUser = await getAuthenticatedUser(req);
            if (!authUser) {
              return sendJson(res, 401, {
                success: false,
                error: "Vendor authorization required. Please sign in to your vendor partner account.",
              });
            }

            let sellerId: string;
            const requestedSellerId = queryParams.get("seller_id");

            if (authUser.role === "seller") {
              if (requestedSellerId && requestedSellerId !== authUser.id) {
                return sendJson(res, 403, {
                  success: false,
                  error: "Access denied. You can only view your own vendor dashboard.",
                });
              }
              sellerId = authUser.id;
              if (authUser.is_active === false) {
                return sendJson(res, 403, {
                  success: false,
                  error: "Vendor account is disabled or inactive.",
                });
              }
            } else if (isAdminRole(authUser?.role)) {
              sellerId = requestedSellerId || "sel_volthub_01";
            } else {
              return sendJson(res, 403, {
                success: false,
                error: "Access denied. Vendor or admin role required.",
              });
            }

            const resSeller = await query(
              "SELECT * FROM sellers WHERE id = $1 LIMIT 1",
              [sellerId]
            );
            const sellerRow = resSeller.rows[0];
            if (!sellerRow) {
              return sendJson(res, 404, {
                success: false,
                error: "Seller record not found.",
              });
            }
            const sellerEmail = sellerRow.email;

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

            // Real orders from DB containing items sold by this vendor
            const ordersRes = await query(
              `SELECT o.id, o.order_number, o.status, o.total_amount, o.delivery_address, o.created_at,
                      o.recipient_name, o.recipient_phone, o.delivery_instructions,
                      o.payment_status, o.payment_method,
                      COALESCE(o.recipient_name, c.full_name, u.full_name, 'Customer') AS customer_name,
                      COALESCE(o.recipient_phone, c.phone, u.phone, '+91 98765 43210') AS customer_phone,
                      oi.id AS item_id, oi.product_id, oi.quantity, oi.unit_price, oi.subtotal,
                      p.name AS product_name
               FROM orders o
               LEFT JOIN customers c ON o.customer_id = c.id
               LEFT JOIN users u ON (o.customer_id = u.id OR c.email = u.email)
               JOIN order_items oi ON oi.order_id = o.id
               LEFT JOIN products p ON oi.product_id = p.id
               WHERE (o.seller_id = $1 OR p.seller_id = $1 OR oi.seller_id = $1)
               ORDER BY o.created_at DESC`,
              [sellerId]
            );
            const vendorOrders = ordersRes.rows;
            const totalGrossSales = vendorOrders
              .filter((o: any) => o.status !== "cancelled" && o.payment_status === "paid")
              .reduce((sum: number, o: any) => sum + (Number(o.subtotal || o.total_amount) || 0), 0);

            const pendingOrders = vendorOrders.filter((o: any) => o.status === "pending").length;
            const inPreparation = vendorOrders.filter((o: any) => o.status === "processing").length;
            const outForDelivery = vendorOrders.filter((o: any) => o.status === "shipped").length;
            const deliveredOrders = vendorOrders.filter((o: any) => o.status === "delivered" || o.status === "completed").length;

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
            const authUser = await getAuthenticatedUser(req);
            if (!authUser) {
              return sendJson(res, 401, { success: false, error: "Vendor authentication required." });
            }

            const body = await parseBody(req);
            let sellerId: string;

            if (authUser.role === "seller") {
              if (body.sellerId && body.sellerId !== authUser.id) {
                return sendJson(res, 403, { success: false, error: "Access denied. Cannot update another vendor's profile." });
              }
              sellerId = authUser.id;
              if (authUser.is_active === false || authUser.user?.is_frozen) {
                return sendJson(res, 403, { success: false, error: "Your account is frozen or inactive. Profile cannot be modified." });
              }
            } else if (isAdminRole(authUser?.role)) {
              sellerId = body.sellerId || body.id;
              if (!sellerId) {
                return sendJson(res, 400, { success: false, error: "sellerId required for admin profile update." });
              }
            } else {
              return sendJson(res, 403, { success: false, error: "Forbidden." });
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
            const authUser = await getAuthenticatedUser(req);
            if (!authUser) {
              return sendJson(res, 401, { success: false, error: "Authentication required to view notifications." });
            }

            let sellerId: string;
            const paramSeller = queryParams.get("seller_id");
            if (authUser.role === "seller") {
              if (paramSeller && paramSeller !== authUser.id) {
                return sendJson(res, 403, { success: false, error: "Access denied. Cannot view another vendor's notifications." });
              }
              sellerId = authUser.id;
            } else if (isAdminRole(authUser?.role)) {
              sellerId = paramSeller || authUser.id;
            } else {
              return sendJson(res, 403, { success: false, error: "Forbidden." });
            }

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
          const verifiedAdmin = await getVerifiedAdmin(req).catch(() => null);
          if (!verifiedAdmin) {
            return sendJson(res, 401, { success: false, error: "Administrative authorization required." });
          }

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
        // 3.12 UNIFIED ADMIN MARKETPLACE METRICS & REVENUE API: /api/admin/metrics
        // ====================================================================
        if (cleanUrl === "/api/admin/metrics" && method === "GET") {
          const verifiedAdmin = await getVerifiedAdmin(req);
          if (!verifiedAdmin) {
            return sendJson(res, 401, { success: false, error: "Administrative authorization required." });
          }

          try {
            const customersRes = await query("SELECT COUNT(*) as count FROM customers WHERE is_active = 1");
            const totalCustomers = Number(customersRes.rows[0]?.count || 0);

            const sellersRes = await query(`
              SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'APPROVED' AND is_active = 1 THEN 1 ELSE 0 END) as active,
                SUM(CASE WHEN status = 'PENDING_REVIEW' THEN 1 ELSE 0 END) as pending
              FROM sellers
            `);
            const totalSellers = Number(sellersRes.rows[0]?.total || 0);
            const activeSellers = Number(sellersRes.rows[0]?.active || 0);
            const pendingSellers = Number(sellersRes.rows[0]?.pending || 0);

            const productsRes = await query(`
              SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN verification_status = 'approved' OR is_active = 1 THEN 1 ELSE 0 END) as active,
                SUM(CASE WHEN verification_status = 'pending_approval' THEN 1 ELSE 0 END) as pending
              FROM products
            `);
            const totalProducts = Number(productsRes.rows[0]?.total || 0);
            const activeProducts = Number(productsRes.rows[0]?.active || 0);
            const pendingProducts = Number(productsRes.rows[0]?.pending || 0);

            const ordersStatsRes = await query(`
              SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status IN ('pending', 'processing') THEN 1 ELSE 0 END) as pending_processing,
                SUM(CASE WHEN status = 'completed' OR status = 'delivered' THEN 1 ELSE 0 END) as completed,
                SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled,
                SUM(CASE WHEN status = 'refunded' OR refund_amount > 0 THEN 1 ELSE 0 END) as refunded,
                SUM(CASE WHEN payment_status = 'paid' AND status != 'cancelled' THEN total_amount ELSE 0 END) as gross_sales,
                SUM(COALESCE(refund_amount, 0)) as total_refunds
              FROM orders
            `);
            const ord = ordersStatsRes.rows[0] || {};
            const totalOrders = Number(ord.total || 0);
            const pendingProcessingOrders = Number(ord.pending_processing || 0);
            const completedOrders = Number(ord.completed || 0);
            const cancelledOrders = Number(ord.cancelled || 0);
            const refundedOrders = Number(ord.refunded || 0);
            const grossSales = Number(ord.gross_sales || 0);
            const totalRefunds = Number(ord.total_refunds || 0);
            const netRevenue = Math.max(0, grossSales - totalRefunds);

            const recentOrdersRes = await query(`
              SELECT o.id, o.order_number, o.customer_id, o.seller_id, o.total_amount, 
                     o.status, o.payment_status, o.payment_method, o.created_at,
                     COALESCE(c.full_name, 'Customer') as customer_name,
                     s.store_name
              FROM orders o
              LEFT JOIN customers c ON o.customer_id = c.id
              LEFT JOIN sellers s ON o.seller_id = s.id
              ORDER BY o.created_at DESC
              LIMIT 10
            `);

            const vendorPerformanceRes = await query(`
              SELECT s.id as seller_id, s.store_name, s.owner_name,
                     COUNT(DISTINCT o.id) as order_count,
                     COALESCE(SUM(o.total_amount), 0) as total_sales
              FROM sellers s
              LEFT JOIN orders o ON s.id = o.seller_id AND o.status != 'cancelled'
              GROUP BY s.id, s.store_name, s.owner_name
              ORDER BY total_sales DESC
            `);

            return sendJson(res, 200, {
              success: true,
              data: {
                totalCustomers,
                totalSellers,
                activeSellers,
                pendingSellers,
                totalProducts,
                activeProducts,
                pendingProducts,
                totalOrders,
                pendingProcessingOrders,
                completedOrders,
                cancelledOrders,
                refundedOrders,
                grossSales,
                totalRefunds,
                netRevenue,
                recentOrders: recentOrdersRes.rows,
                vendorPerformance: vendorPerformanceRes.rows,
              },
            });
          } catch (err: any) {
            console.error("[Admin Metrics Error]:", err);
            return sendJson(res, 500, { success: false, error: err.message });
          }
        }

        // ====================================================================
        // 3.13 ADMIN CUSTOMERS LIST API: /api/admin/customers
        // ====================================================================
        if (cleanUrl === "/api/admin/customers" && method === "GET") {
          const verifiedAdmin = await getVerifiedAdmin(req);
          if (!verifiedAdmin) {
            return sendJson(res, 401, { success: false, error: "Administrative authorization required." });
          }

          try {
            const customersRes = await query(`
              SELECT c.id, c.email, c.full_name, c.phone, c.is_active, c.created_at,
                     COUNT(o.id) as orders_count,
                     COALESCE(SUM(CASE WHEN o.payment_status = 'paid' THEN o.total_amount ELSE 0 END), 0) as total_spent
              FROM customers c
              LEFT JOIN orders o ON c.id = o.customer_id
              WHERE c.is_active = 1
              GROUP BY c.id, c.email, c.full_name, c.phone, c.is_active, c.created_at
              ORDER BY c.created_at DESC
            `);
            return sendJson(res, 200, { success: true, data: customersRes.rows });
          } catch (err: any) {
            console.error("[Admin Customers Error]:", err);
            return sendJson(res, 500, { success: false, error: err.message });
          }
        }

        // ====================================================================
        // PUBLIC SELLER PROFILE API: /api/sellers/:id
        // ====================================================================
        if (cleanUrl.startsWith("/api/sellers/") && method === "GET") {
          const sellerId = cleanUrl.split("/").filter(Boolean)[2];
          if (sellerId) {
            try {
              const sRes = await query(
                `SELECT id, store_name, owner_name, email, phone, city, state, pincode, business_address, rating, review_count, status, created_at
                 FROM sellers WHERE id = $1 AND (is_active = true OR is_active IS NULL) LIMIT 1`,
                [sellerId]
              );
              if (!sRes.rows[0]) {
                return sendJson(res, 404, { success: false, error: "Seller not found" });
              }
              return sendJson(res, 200, { success: true, seller: sRes.rows[0] });
            } catch (err: any) {
              return sendJson(res, 500, { success: false, error: err.message });
            }
          }
        }

        // ====================================================================
        // 4. ADMIN SELLERS & KYC REVIEW & ANALYTICS API: /api/admin/sellers
        // ====================================================================
        if (cleanUrl.startsWith("/api/admin/sellers") || cleanUrl === "/api/admin/analytics/sellers") {
          const verifiedAdmin = await getVerifiedAdmin(req).catch(() => null);
          if (!verifiedAdmin) {
            return sendJson(res, 401, { success: false, error: "Administrative authorization required." });
          }

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
                  COUNT(o.id) AS total_orders,
                  COALESCE(SUM(o.total_amount), 0) AS total_revenue,
                  COALESCE(SUM(CASE WHEN o.created_at >= (CURRENT_TIMESTAMP - INTERVAL '7 days') THEN o.total_amount ELSE 0 END), 0) AS weekly_revenue,
                  COUNT(CASE WHEN o.created_at >= (CURRENT_TIMESTAMP - INTERVAL '7 days') THEN o.id ELSE NULL END) AS weekly_orders
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
                       COALESCE((SELECT COUNT(*) FROM products p WHERE p.seller_id = s.id AND p.is_active = 1), 0) AS published_products_count,
                       COALESCE((SELECT COUNT(DISTINCT o.id) FROM orders o WHERE o.seller_id = s.id), 0) AS sales_count,
                       COALESCE((SELECT SUM(o.total_amount) FROM orders o WHERE o.seller_id = s.id), 0) AS total_revenue
                FROM sellers s
                WHERE s.is_active = 1
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

            // DELETE /api/admin/sellers/:id (Remove/delete seller profile)
            if (method === "DELETE" && sellerId && sellerId !== "analytics") {
              await query("DELETE FROM seller_documents WHERE seller_id = $1", [sellerId]);
              await query("DELETE FROM seller_bank_accounts WHERE seller_id = $1", [sellerId]);
              await query("DELETE FROM sellers WHERE id = $1", [sellerId]);
              return sendJson(res, 200, {
                success: true,
                message: `Seller profile ${sellerId} removed successfully.`,
              });
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
                const aCheck = await query("SELECT id FROM admins WHERE id = $1", [adminId]).catch(() => ({ rows: [] }));
                if (aCheck.rows[0]) verifiedAdminId = aCheck.rows[0].id;
              }
              if (!verifiedAdminId) {
                const fallbackAdmin = await query("SELECT id FROM admins LIMIT 1").catch(() => ({ rows: [] }));
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
              const adminId = body.adminId || verifiedAdmin?.id || "adm_unified_01";

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
                     frozen_at = CURRENT_TIMESTAMP, 
                     updated_at = now() 
                 WHERE id = $3`,
                [reason, adminId, sellerId]
              );

              // Deactivate corresponding user account so active sessions are blocked
              await query("UPDATE users SET is_active = false WHERE email = $1", [seller.email]).catch(() => {});
              await query("UPDATE auth_sessions SET revoked_at = CURRENT_TIMESTAMP WHERE user_id = $1 OR user_id IN (SELECT id FROM users WHERE email = $2)", [sellerId, seller.email]).catch(() => {});

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
                message: `Your vendor account has been frozen by administration. Reason: ${reason}. Selling operations and product submissions are paused. Designated assistance: admin.operations@riderzpro.com`,
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
              const adminId = body.adminId || verifiedAdmin?.id || "adm_unified_01";

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
        // 5. ADMIN PRODUCT REVIEW API: /api/admin/products/:id/review & /api/admin/products/bulk-review
        // ====================================================================
        if (cleanUrl === "/api/admin/products/bulk-review" && method === "POST") {
          const verifiedAdmin = await getVerifiedAdmin(req).catch(() => null);
          const body = await parseBody(req);
          const ids: string[] = Array.isArray(body.ids) ? body.ids : [];
          const action = (body.action || "APPROVED") as "APPROVED" | "REJECTED";
          const reason = body.reason || "";
          const adminId = verifiedAdmin?.id || body.adminId || "adm_df0c152a38e104fd";

          if (ids.length === 0) {
            return sendJson(res, 400, { success: false, error: "No product IDs specified for bulk review." });
          }

          const newStatus = action === "APPROVED" ? "approved" : "rejected";
          const isActive = action === "APPROVED";

          let count = 0;
          for (const pid of ids) {
            await query(
              `UPDATE products 
               SET verification_status = $1, 
                   is_active = $2,
                   verified_by = $3, 
                   verified_at = CURRENT_TIMESTAMP, 
                   rejection_reason = $4, 
                   updated_at = CURRENT_TIMESTAMP
               WHERE id = $5`,
              [newStatus, isActive, adminId, action === "REJECTED" ? (reason || null) : null, pid]
            );

            await query(
              `INSERT INTO product_approval_history (id, product_id, admin_id, action, reason)
               VALUES ($1, $2, $3, $4, $5)`,
              [`pah_${crypto.randomBytes(6).toString("hex")}`, pid, adminId, action, reason || null]
            ).catch(() => {});
            count++;
          }

          return sendJson(res, 200, {
            success: true,
            count,
            message: `Successfully updated ${count} product(s) to ${newStatus}.`,
          });
        }

        if (cleanUrl.startsWith("/api/admin/products") && cleanUrl.includes("/review")) {
          const verifiedAdmin = await getVerifiedAdmin(req).catch(() => null);

          const parts = cleanUrl.split("/").filter(Boolean); // ['api', 'admin', 'products', productId, 'review']
          const productId = parts[3];

          try {
            if (method === "POST" && productId) {
              const body = await parseBody(req);
              const action = body.action as "APPROVED" | "REJECTED";
              const reason = body.reason || body.remarks || "";
              const adminId = body.adminId || body.reviewed_by || verifiedAdmin?.id || "adm_df0c152a38e104fd";

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
                const aCheck = await query("SELECT id FROM admins WHERE id = $1 LIMIT 1", [adminId]).catch(() => ({ rows: [] }));
                if (aCheck.rows.length > 0) {
                  verifiedByAdminId = aCheck.rows[0].id;
                } else {
                  const aEmailCheck = await query("SELECT id FROM admins WHERE email = (SELECT email FROM users WHERE id = $1 LIMIT 1) LIMIT 1", [adminId]).catch(() => ({ rows: [] }));
                  if (aEmailCheck.rows.length > 0) {
                    verifiedByAdminId = aEmailCheck.rows[0].id;
                  } else {
                    const fallbackAdmin = await query("SELECT id FROM admins WHERE (role = 'ADMIN' OR role = 'SUPER_ADMIN') AND is_active = 1 LIMIT 1").catch(() => ({ rows: [] }));
                    if (fallbackAdmin.rows.length > 0) {
                      verifiedByAdminId = fallbackAdmin.rows[0].id;
                    } else {
                      const anyAdmin = await query("SELECT id FROM admins LIMIT 1").catch(() => ({ rows: [] }));
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
        if (cleanUrl.startsWith("/api/cart")) {
          const authUser = await getAuthenticatedUser(req);
          const paramId = queryParams.get("customer_id") || queryParams.get("customerId");
          let body: any = null;
          if (method === "POST" || method === "PUT" || method === "DELETE") {
            body = await parseBody(req).catch(() => ({}));
          }

          let customerId: string | null = null;
          if (authUser) {
            if (authUser.role === "customer") {
              if (paramId && paramId !== authUser.id) {
                return sendJson(res, 403, { success: false, error: "Access denied. Cannot access another customer's cart." });
              }
              if (body && (body.customerId || body.customer_id) && (body.customerId || body.customer_id) !== authUser.id) {
                return sendJson(res, 403, { success: false, error: "Access denied. Cannot modify another customer's cart." });
              }
              customerId = authUser.id;
            } else if (isAdminRole(authUser?.role)) {
              customerId = paramId || (body?.customerId || body?.customer_id) || null;
            } else {
              return sendJson(res, 403, { success: false, error: "Forbidden." });
            }
          } else {
            // Unauthenticated
            if (paramId || (body && (body.customerId || body.customer_id))) {
              return sendJson(res, 401, { success: false, error: "Authentication required to access customer cart." });
            }
            if (method === "GET") {
              return sendJson(res, 200, { success: true, data: [], items: [], count: 0 });
            }
            return sendJson(res, 200, { success: true, message: "Guest session - local storage used", items: [] });
          }

          try {
            if (method === "GET") {
              if (!customerId) {
                return sendJson(res, 200, { success: true, data: [], items: [], count: 0 });
              }

              const cartRes = await query("SELECT id FROM carts WHERE customer_id = $1 LIMIT 1", [customerId]);
              if (!cartRes.rows[0]) {
                return sendJson(res, 200, { success: true, data: [], items: [], count: 0 });
              }
              const cartId = cartRes.rows[0].id;

              // Clean up any orphaned cart items where product was deleted or unapproved
              await query(
                `DELETE FROM cart_items 
                 WHERE cart_id = $1 
                   AND product_id NOT IN (
                     SELECT id FROM products 
                     WHERE (is_active = 1 OR is_active IS NULL) 
                       AND (verification_status = 'approved' OR verification_status = 'APPROVED')
                   )`,
                [cartId]
              ).catch(() => {});

              const itemsRes = await query(
                `SELECT ci.product_id, ci.quantity, p.name, p.price, p.stock, p.image_url, p.is_active, p.verification_status, p.seller_id
                 FROM cart_items ci
                 INNER JOIN products p ON ci.product_id = p.id
                 WHERE ci.cart_id = $1 
                   AND (p.is_active = 1 OR p.is_active IS NULL) 
                   AND (p.verification_status = 'approved' OR verification_status = 'APPROVED')`,
                [cartId]
              );
              const totalCount = itemsRes.rows.reduce((sum: number, it: any) => sum + (Number(it.quantity) || 0), 0);
              return sendJson(res, 200, { success: true, data: itemsRes.rows, items: itemsRes.rows, count: totalCount });
            }

            if (method === "POST") {
              if (!customerId) {
                return sendJson(res, 200, { success: true, message: "Guest session - local storage used", items: [] });
              }

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
                    // Verify product exists and is approved
                    const pCheck = await query(
                      "SELECT id FROM products WHERE id = $1 AND (is_active = 1 OR is_active IS NULL) AND (verification_status = 'approved' OR verification_status = 'APPROVED') LIMIT 1",
                      [pid]
                    );
                    if (pCheck.rows.length > 0) {
                      const itemId = `ci_${crypto.randomBytes(8).toString("hex")}`;
                      await query(
                        "INSERT INTO cart_items (id, cart_id, product_id, quantity) VALUES ($1, $2, $3, $4)",
                        [itemId, cartId, pid, qty]
                      ).catch(() => {});
                    }
                  }
                }
              } else if (body.product_id || body.productId) {
                // Single item add / increment
                const pid = body.product_id || body.productId;
                const addQty = Math.max(1, Number(body.quantity || body.qty) || 1);
                const pCheck = await query(
                  "SELECT id FROM products WHERE id = $1 AND (is_active = 1 OR is_active IS NULL) AND (verification_status = 'approved' OR verification_status = 'APPROVED') LIMIT 1",
                  [pid]
                );
                if (pCheck.rows.length === 0) {
                  return sendJson(res, 400, { success: false, error: "Product not available or no longer active" });
                }

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
              const pid = body?.product_id || body?.productId || queryParams.get("product_id");
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
          const paramCust = queryParams.get("customer_id");
          const paramEmail = (queryParams.get("email") || "").trim().toLowerCase();
          let body: any = null;
          if (method === "POST" || method === "PUT" || method === "DELETE") {
            body = await parseBody(req).catch(() => ({}));
          }

          let customerId: string | null = null;
          if (authUser) {
            if (authUser.role === "customer") {
              if (paramCust && paramCust !== authUser.id) {
                return sendJson(res, 403, { success: false, error: "Access denied. Cannot access another customer's wishlist." });
              }
              if (paramEmail && (!authUser.email || paramEmail !== authUser.email.toLowerCase())) {
                return sendJson(res, 403, { success: false, error: "Access denied. Cannot access another customer's wishlist." });
              }
              if (body && (body.customer_id || body.customerId) && (body.customer_id || body.customerId) !== authUser.id) {
                return sendJson(res, 403, { success: false, error: "Access denied. Cannot modify another customer's wishlist." });
              }
              customerId = authUser.id;
            } else if (isAdminRole(authUser?.role)) {
              customerId = paramCust || (body?.customer_id || body?.customerId) || null;
            } else {
              return sendJson(res, 403, { success: false, error: "Forbidden." });
            }
          } else {
            // Unauthenticated
            if (paramCust || paramEmail || (body && (body.customer_id || body.customerId || body.email))) {
              return sendJson(res, 401, { success: false, error: "Authentication required to access customer wishlist." });
            }
            if (method === "GET") {
              return sendJson(res, 200, { success: true, data: [], items: [], count: 0 });
            }
            return sendJson(res, 200, { success: true, guest: true, message: "Guest session - local storage used" });
          }

          try {
            if (method === "GET") {
              if (!customerId) {
                return sendJson(res, 200, { success: true, data: [], items: [], count: 0 });
              }

              const wishRes = await query("SELECT id FROM wishlists WHERE customer_id = $1 LIMIT 1", [customerId]);
              if (!wishRes.rows[0]) {
                return sendJson(res, 200, { success: true, data: [], items: [], count: 0 });
              }

              const itemsRes = await query(
                `SELECT 
                   wi.id as item_id, 
                   wi.product_id,
                   wi.created_at as saved_at,
                   p.id, 
                   p.name, 
                   p.price, 
                   p.mrp, 
                   p.discount_percent, 
                   p.image_url, 
                   p.stock, 
                   p.is_active, 
                   p.brand, 
                   p.category_id as category, 
                   p.description, 
                   p.seller_id,
                   p.warranty,
                   p.compatible_vehicles,
                   p.fitment_type
                 FROM wishlist_items wi
                 LEFT JOIN products p ON wi.product_id = p.id
                 WHERE wi.wishlist_id = $1
                 ORDER BY wi.created_at DESC`,
                [wishRes.rows[0].id]
              );

              const uniqueIds = Array.from(new Set(itemsRes.rows.map((r: any) => r.product_id || r.id)));
              return sendJson(res, 200, {
                success: true,
                data: uniqueIds,
                items: itemsRes.rows,
                count: uniqueIds.length,
              });
            }

            if (method === "POST") {
              const body = await parseBody(req);
              const productId = body.productId || body.product_id;
              const action = body.action || "add"; // "add" | "remove"

              if (!productId) {
                return sendJson(res, 400, { success: false, error: "Product ID required" });
              }

              if (!customerId) {
                return sendJson(res, 200, { success: true, guest: true, message: "Guest session - local storage used" });
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
              if (!productId) {
                return sendJson(res, 400, { success: false, error: "Product ID required" });
              }
              if (!customerId && (body.email || body.customer_id)) {
                const identifier = String(body.email || body.customer_id).toLowerCase().trim();
                const custRow = await query(
                  "SELECT id FROM customers WHERE LOWER(email) = LOWER($1) OR id = $1 OR user_id = $1 LIMIT 1",
                  [identifier]
                );
                if (custRow.rows[0]) customerId = custRow.rows[0].id;
              }
              if (customerId) {
                const wishRes = await query("SELECT id FROM wishlists WHERE customer_id = $1 LIMIT 1", [customerId]);
                const wishId = wishRes.rows[0]?.id;
                if (wishId) {
                  await query("DELETE FROM wishlist_items WHERE wishlist_id = $1 AND product_id = $2", [wishId, productId]);
                }
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
                    product_ids: pRes.rows.map((p: any) => p.product_id),
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

              const postSellerId =
                authUser && (authUser.role === "seller" || authUser.role === "vendor")
                  ? authUser.id
                  : (body.seller_id || body.sellerId || body.vendor_id || queryParams.get("seller_id") || sellerId);

              // Validate vendor ownership of selected products
              if (selectedProducts.length > 0 && postSellerId) {
                for (const pid of selectedProducts) {
                  const pCheck = await query("SELECT seller_id FROM products WHERE id = $1", [pid]);
                  if (!pCheck.rows[0] || (pCheck.rows[0].seller_id && pCheck.rows[0].seller_id !== postSellerId)) {
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
                [cId, postSellerId, code, description, discountType, discountValue, minOrder, maxDiscount, startsAt, expiresAt, usageLimit, perCustomerLimit]
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

        // Coupon Validation & Applicable Coupons: /api/coupons, /api/coupons/applicable & /api/coupons/validate
        if (cleanUrl === "/api/coupons" && method === "GET") {
          const rows = await query(
            `SELECT id, code, description, discount_type, discount_value, minimum_order_value, maximum_discount, starts_at, expires_at
             FROM coupons
             WHERE status = 'active'
             ORDER BY created_at DESC`
          );
          return sendJson(res, 200, { success: true, coupons: rows.rows });
        }

        if (cleanUrl === "/api/coupons/applicable") {
          const productId = queryParams.get("product_id");
          if (!productId) return sendJson(res, 200, { success: true, coupons: [] });

          const rows = await query(
            `SELECT c.id, c.vendor_id, c.code, c.description, c.discount_type, c.discount_value, 
                    c.minimum_order_value, c.maximum_discount, c.starts_at, c.expires_at,
                    c.usage_limit, c.per_customer_limit, 
                    COALESCE(s.store_name, (SELECT store_name FROM sellers WHERE id = c.vendor_id OR email = (SELECT email FROM users WHERE id = c.vendor_id LIMIT 1) LIMIT 1), 'Verified Marketplace Vendor') AS store_name,
                    COALESCE(s.store_name, (SELECT store_name FROM sellers WHERE id = c.vendor_id OR email = (SELECT email FROM users WHERE id = c.vendor_id LIMIT 1) LIMIT 1), 'Verified Marketplace Vendor') AS seller_name
             FROM coupons c
             JOIN coupon_products cp ON c.id = cp.coupon_id
             LEFT JOIN sellers s ON c.vendor_id = s.id
             WHERE cp.product_id = $1 
               AND c.status = 'active'
               AND (c.expires_at IS NULL OR date(c.expires_at) >= date('now'))
               AND (c.starts_at IS NULL OR date(c.starts_at) <= date('now'))
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
        // 8. ORDERS & ORDER ITEMS API: /api/orders
        // ====================================================================
        if (cleanUrl.startsWith("/api/orders")) {
          try {
            const parts = cleanUrl.split("/").filter(Boolean); // ['api', 'orders', orderId?, action?]
            const urlOrderId = parts.length > 2 && parts[2] !== "status" ? parts[2] : null;
            const subAction = parts.length > 3 ? parts[3] : parts.length > 2 && parts[2] === "status" ? "status" : null;

            // POST /api/orders/:id/status (Update order status)
            if (method === "POST" && urlOrderId && (subAction === "status" || cleanUrl.includes("/status"))) {
              const authUser = await getAuthenticatedUser(req);
              if (!authUser) {
                return sendJson(res, 401, { success: false, error: "Authentication required to update order status." });
              }

              const body = await parseBody(req);
              let newStatus = (body.status || "").toLowerCase().trim();
              if (!newStatus) {
                return sendJson(res, 400, { success: false, error: "New order status is required." });
              }
              if (newStatus === "new") newStatus = "pending";
              if (newStatus === "preparing") newStatus = "processing";

              const existingRes = await query("SELECT id, order_number, status, total_amount, customer_id, seller_id FROM orders WHERE id = $1 OR order_number = $1", [urlOrderId]);
              const order = existingRes.rows[0];
              if (!order) {
                return sendJson(res, 404, { success: false, error: "Order not found." });
              }

              // Role permissions check
              if (authUser.role === "customer") {
                if (order.customer_id !== authUser.id) {
                  return sendJson(res, 403, { success: false, error: "Access denied. You cannot modify an order belonging to another customer." });
                }
                if (newStatus !== "cancelled") {
                  return sendJson(res, 403, { success: false, error: "Customers can only cancel orders." });
                }
              } else if (authUser.role === "seller") {
                // Verify order has items for this seller
                const itemCheck = await query(
                  `SELECT id FROM order_items WHERE order_id = $1 AND (seller_id = $2 OR product_id IN (SELECT id FROM products WHERE seller_id = $2)) LIMIT 1`,
                  [order.id, authUser.id]
                );
                if (itemCheck.rows.length === 0 && order.seller_id !== authUser.id) {
                  return sendJson(res, 403, { success: false, error: "Access denied. Order does not belong to your store." });
                }
              } else if (authUser.role !== "admin" && authUser.role !== "superadmin") {
                return sendJson(res, 403, { success: false, error: "Forbidden." });
              }

              await query(
                "UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
                [newStatus, order.id]
              );

              // If cancelled, restore stock
              if (newStatus === "cancelled" && order.status !== "cancelled") {
                const itemsRes = await query("SELECT product_id, quantity FROM order_items WHERE order_id = $1", [order.id]);
                for (const item of itemsRes.rows) {
                  await query("UPDATE products SET stock = stock + $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2", [item.quantity, item.product_id]);
                }
              }

              return sendJson(res, 200, {
                success: true,
                message: `Order #${order.order_number || order.id} status updated to ${newStatus}.`,
                status: newStatus,
              });
            }

            // POST /api/orders/:id/refund (Admin order refund)
            if (method === "POST" && urlOrderId && (subAction === "refund" || cleanUrl.includes("/refund"))) {
              const verifiedAdmin = await getVerifiedAdmin(req);
              if (!verifiedAdmin) {
                return sendJson(res, 401, { success: false, error: "Administrative authorization required." });
              }

              const existingRes = await query("SELECT id, order_number, status, total_amount, payment_status FROM orders WHERE id = $1 OR order_number = $1", [urlOrderId]);
              const order = existingRes.rows[0];
              if (!order) {
                return sendJson(res, 404, { success: false, error: "Order not found." });
              }

              await query(
                `UPDATE orders 
                 SET status = 'refunded', 
                     payment_status = 'refunded', 
                     refund_amount = total_amount, 
                     updated_at = CURRENT_TIMESTAMP 
                 WHERE id = $1`,
                [order.id]
              );

              // Restore product stock upon refund if not already cancelled/refunded
              if (order.status !== "cancelled" && order.status !== "refunded") {
                const itemsRes = await query("SELECT product_id, quantity FROM order_items WHERE order_id = $1", [order.id]);
                for (const it of itemsRes.rows) {
                  await query("UPDATE products SET stock = stock + $1 WHERE id = $2", [Number(it.quantity) || 1, it.product_id]);
                }
              }

              return sendJson(res, 200, {
                success: true,
                message: `Order #${order.order_number || order.id} refunded successfully.`,
                status: "refunded",
                payment_status: "refunded",
              });
            }

            // GET /api/orders (List orders with items)
            if (method === "GET") {
              const authUser = await getAuthenticatedUser(req);
              if (!authUser) {
                return sendJson(res, 401, { success: false, error: "Authentication required to view orders." });
              }

              const paramCust = queryParams.get("customer_id");
              const paramSeller = queryParams.get("seller_id");

              let customerId: string | null = null;
              let sellerId: string | null = null;

              if (authUser.role === "customer") {
                if (paramCust && paramCust !== authUser.id) {
                  return sendJson(res, 403, { success: false, error: "Access denied. Cannot view another customer's orders." });
                }
                if (paramSeller) {
                  return sendJson(res, 403, { success: false, error: "Access denied. Customers cannot view vendor order queues." });
                }
                customerId = authUser.id;
              } else if (authUser.role === "seller") {
                if (paramSeller && paramSeller !== authUser.id) {
                  return sendJson(res, 403, { success: false, error: "Access denied. Cannot view another vendor's orders." });
                }
                if (paramCust) {
                  return sendJson(res, 403, { success: false, error: "Access denied. Vendors cannot query customer order lists directly." });
                }
                sellerId = authUser.id;
              } else if (isAdminRole(authUser?.role)) {
                customerId = paramCust || null;
                sellerId = paramSeller || null;
              } else {
                return sendJson(res, 403, { success: false, error: "Forbidden." });
              }

              let sql = `
                SELECT o.id, o.order_number, o.customer_id, o.seller_id, o.status, o.total_amount, 
                       o.delivery_address, o.recipient_name, o.recipient_phone, o.delivery_instructions,
                       o.payment_status, o.payment_method, o.refund_amount, 
                       o.created_at, o.updated_at,
                       s.store_name, s.owner_name as seller_name,
                       COALESCE(o.recipient_name, c.full_name, u.full_name, 'Customer') as customer_name,
                       COALESCE(o.recipient_phone, c.phone, u.phone, '') as customer_phone,
                       COALESCE(c.email, u.email, '') as customer_email
                FROM orders o
                LEFT JOIN sellers s ON o.seller_id = s.id
                LEFT JOIN customers c ON o.customer_id = c.id
                LEFT JOIN users u ON (o.customer_id = u.id OR c.email = u.email)
              `;
              const params: any[] = [];
              if (customerId) {
                params.push(customerId);
                sql += ` WHERE (o.customer_id = $${params.length} 
                          OR o.customer_id IN (SELECT id FROM customers WHERE email = $${params.length} OR user_id = $${params.length})
                          OR o.customer_id IN (SELECT id FROM users WHERE email = $${params.length} OR id = $${params.length}))`;
              } else if (sellerId) {
                params.push(sellerId);
                sql += ` WHERE (o.seller_id = $${params.length} 
                          OR o.id IN (SELECT oi.order_id FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE p.seller_id = $${params.length} OR oi.seller_id = $${params.length}))`;
              }
              sql += " ORDER BY o.created_at DESC";

              const ordersRes = await query(sql, params);
              const ordersList = ordersRes.rows;

              // Attach order_items for each order
              for (const ord of ordersList) {
                let itemSql = `
                  SELECT oi.id, oi.order_id, oi.product_id, oi.quantity, oi.unit_price, oi.subtotal,
                         COALESCE(p.name, 'EV Spare Part') as product_name,
                         s.store_name
                  FROM order_items oi
                  LEFT JOIN products p ON oi.product_id = p.id
                  LEFT JOIN sellers s ON (p.seller_id = s.id OR oi.seller_id = s.id)
                  WHERE oi.order_id = $1
                `;
                const itemParams: any[] = [ord.id];
                if (sellerId) {
                  itemParams.push(sellerId);
                  itemSql += ` AND (p.seller_id = $2 OR oi.seller_id = $2 OR p.seller_id IS NULL)`;
                }
                const itemsRes = await query(itemSql, itemParams);
                ord.items = itemsRes.rows;
              }

              return sendJson(res, 200, { success: true, data: ordersList });
            }

            // POST /api/orders (Customer checkout & database placement)
            if (method === "POST") {
              const body = await parseBody(req);
              const cryptoMod = await import("node:crypto");
              const orderNum = `RZ-${Math.floor(100000 + Math.random() * 900000)}`;
              const orderId = `ord_${cryptoMod.randomBytes(8).toString("hex")}`;

              // 1. Resolve raw items
              let requestedItems: Array<{ productId: string; qty: number }> = [];
              if (Array.isArray(body.items) && body.items.length > 0) {
                requestedItems = body.items.map((it: any) => ({
                  productId: it.productId || it.product_id || it.id,
                  qty: Math.max(1, Number(it.quantity || it.qty || 1)),
                }));
              } else if (Array.isArray(body.groups) && body.groups.length > 0) {
                for (const g of body.groups) {
                  if (Array.isArray(g.items)) {
                    for (const it of g.items) {
                      requestedItems.push({
                        productId: it.productId || it.product_id || it.id,
                        qty: Math.max(1, Number(it.quantity || it.qty || 1)),
                      });
                    }
                  }
                }
              }

              // Fallback: If no items in body, check customer's persistent cart in DB
              const rawCustId = body.customer_id;
              if (requestedItems.length === 0 && rawCustId) {
                const dbCartRes = await query(
                  `SELECT ci.product_id, ci.quantity 
                   FROM cart_items ci
                   JOIN carts c ON ci.cart_id = c.id
                   WHERE c.customer_id = $1 OR c.customer_id IN (SELECT id FROM customers WHERE email = $1)`,
                  [rawCustId]
                );
                if (dbCartRes.rows.length > 0) {
                  requestedItems = dbCartRes.rows.map((r: any) => ({
                    productId: r.product_id,
                    qty: Number(r.quantity) || 1,
                  }));
                }
              }

              if (requestedItems.length === 0) {
                return sendJson(res, 400, {
                  success: false,
                  error: "Your shopping cart is empty. Please add items to place an order.",
                });
              }

              // 2. Validate products, inventory stock, and calculate authoritative prices
              let computedTotal = 0;
              const validatedItems: Array<{
                productId: string;
                name: string;
                price: number;
                qty: number;
                subtotal: number;
                sellerId: string;
              }> = [];

              for (const it of requestedItems) {
                const pRes = await query(
                  "SELECT id, name, price, stock, seller_id, is_active FROM products WHERE id = $1 LIMIT 1",
                  [it.productId]
                );
                const prod = pRes.rows[0];
                if (!prod) {
                  return sendJson(res, 400, {
                    success: false,
                    error: `Product with ID '${it.productId}' is no longer available.`,
                  });
                }
                if (!prod.is_active) {
                  return sendJson(res, 400, {
                    success: false,
                    error: `Product '${prod.name}' is currently unavailable.`,
                  });
                }
                const currentStock = Number(prod.stock) || 0;
                if (currentStock < it.qty) {
                  return sendJson(res, 400, {
                    success: false,
                    error: `Product '${prod.name}' is out of stock (Available: ${currentStock}, Requested: ${it.qty}).`,
                  });
                }

                const price = Number(prod.price) || 0;
                const subtotal = price * it.qty;
                computedTotal += subtotal;

                validatedItems.push({
                  productId: prod.id,
                  name: prod.name,
                  price,
                  qty: it.qty,
                  subtotal,
                  sellerId: prod.seller_id,
                });
              }

              // 3. Resolve customer details
              const authUser = await getAuthenticatedUser(req);
              let customerRow: any = null;
              let customerId: string;
              if (authUser && authUser.role === "customer") {
                customerId = authUser.id;
                customerRow = authUser.user;
              } else if (authUser && (isAdminRole(authUser?.role))) {
                customerId = rawCustId || authUser.id;
                if (rawCustId) {
                  const cRes = await query("SELECT id, email, full_name, phone FROM customers WHERE id = $1 LIMIT 1", [rawCustId]);
                  customerRow = cRes.rows[0];
                }
              } else {
                // Guest order: reject spoofing registered customer IDs
                if (rawCustId) {
                  const checkCust = await query("SELECT id FROM customers WHERE id = $1 LIMIT 1", [rawCustId]);
                  if (checkCust.rows.length > 0) {
                    return sendJson(res, 401, { success: false, error: "Please sign in to place an order under your registered account." });
                  }
                }
                customerId = rawCustId || `cst_guest_${cryptoMod.randomBytes(6).toString("hex")}`;
              }

              const customerEmail = customerRow?.email || body.email || "customer@riderzpro.com";
              const customerName = customerRow?.full_name || customerRow?.recipient_name || body.customer_name || body.shipping_address?.name || "Valued Customer";
              const customerPhone = customerRow?.phone || body.shipping_address?.phone || "+91 98765 43210";
              const primarySellerId = validatedItems[0]?.sellerId || body.seller_id || "sel_volthub_01";

              // 4. Resolve delivery address & recipient details
              let deliveryAddressStr = "Doorstep Delivery Address";
              let recipientName = customerName;
              let recipientPhone = customerPhone;
              let deliveryInstructions = "";

              if (body.shipping_address) {
                if (typeof body.shipping_address === "string") {
                  deliveryAddressStr = body.shipping_address;
                } else {
                  const addr = body.shipping_address;
                  if (addr.name || addr.recipient_name) recipientName = addr.name || addr.recipient_name;
                  if (addr.phone) recipientPhone = addr.phone;
                  if (addr.deliveryInstructions || addr.delivery_instructions) {
                    deliveryInstructions = addr.deliveryInstructions || addr.delivery_instructions;
                  }
                  deliveryAddressStr = [
                    addr.house_flat || addr.houseFlat || addr.street || addr.street_address,
                    addr.city,
                    addr.state,
                    addr.pincode,
                  ]
                    .filter(Boolean)
                    .join(", ");
                }
              }

              const paymentMethod = body.payment_method || "UPI";

              // 5. Insert order record (status 'pending' for vendor fulfillment)
              await query(
                `INSERT INTO orders (id, order_number, customer_id, seller_id, status, total_amount, delivery_address, recipient_name, recipient_phone, delivery_instructions, payment_status, payment_method, created_at, updated_at)
                 VALUES ($1, $2, $3, $4, 'pending', $5, $6, $7, $8, $9, 'paid', $10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
                [orderId, orderNum, customerId, primarySellerId, computedTotal, deliveryAddressStr, recipientName, recipientPhone, deliveryInstructions, paymentMethod]
              );

              // 6. Insert order items & update inventory stock
              for (const it of validatedItems) {
                const itemId = `item_${cryptoMod.randomBytes(6).toString("hex")}`;
                await query(
                  `INSERT INTO order_items (id, order_id, product_id, quantity, unit_price, subtotal, seller_id)
                   VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                  [itemId, orderId, it.productId, it.qty, it.price, it.subtotal, it.sellerId]
                );

                // Deduct stock safely in products table
                await query(
                  `UPDATE products 
                   SET stock = GREATEST(0, stock - $1), 
                       updated_at = CURRENT_TIMESTAMP 
                   WHERE id = $2`,
                  [it.qty, it.productId]
                );
              }

              // 7. Clear database cart for this customer
              if (customerId && customerId !== "cst_guest") {
                await query(
                  "DELETE FROM cart_items WHERE cart_id IN (SELECT id FROM carts WHERE customer_id = $1)",
                  [customerId]
                ).catch(() => {});
              }

              // 8. Send Email to Customer
              sendCustomerOrderPlacedEmail({
                to: customerEmail,
                customerName,
                orderNumber: orderNum,
                totalAmount: computedTotal,
                items: validatedItems.map((it) => ({
                  name: it.name,
                  quantity: it.qty,
                  price: it.price,
                })),
                shippingAddress: deliveryAddressStr,
                paymentMethod,
              }).catch((e) => console.warn("[Customer Email Error]:", e?.message));

              // 9. Send Email to each Vendor with their items
              const vendorGroups = new Map<string, typeof validatedItems>();
              for (const it of validatedItems) {
                const arr = vendorGroups.get(it.sellerId) || [];
                arr.push(it);
                vendorGroups.set(it.sellerId, arr);
              }

              for (const [sId, sItems] of vendorGroups.entries()) {
                const sRowRes = await query("SELECT email, store_name FROM sellers WHERE id = $1 LIMIT 1", [sId]);
                const sRow = sRowRes.rows[0];
                if (sRow) {
                  const sSubtotal = sItems.reduce((acc, x) => acc + x.subtotal, 0);
                  sendVendorNewOrderEmail({
                    to: sRow.email,
                    storeName: sRow.store_name,
                    orderNumber: orderNum,
                    customerName,
                    items: sItems.map((it) => ({
                      name: it.name,
                      quantity: it.qty,
                      price: it.price,
                    })),
                    vendorSubtotal: sSubtotal,
                    deliveryAddress: deliveryAddressStr,
                  }).catch((e) => console.warn("[Vendor Email Error]:", e?.message));
                }

                // In-app notification for vendor
                createNotification({
                  userId: sId,
                  userRole: "seller",
                  type: "new_order_received",
                  title: "New Order Received",
                  message: `New order #${orderNum} received for your items. Please prepare for pickup.`,
                  entityId: orderId,
                  targetRoute: "/dashboard/vendor?tab=orders",
                }).catch(() => {});
              }

              // In-app notification for customer
              if (customerId && customerId !== "cst_guest") {
                createNotification({
                  userId: customerId,
                  userRole: "customer",
                  type: "order_placed",
                  title: "Order Placed Successfully",
                  message: `Order #${orderNum} has been placed for ₹${Number(computedTotal).toLocaleString()}. Track live in your dashboard.`,
                  entityId: orderId,
                  targetRoute: "/orders",
                }).catch(() => {});
              }

              // In-app notification for admin
              notifyAdminRole("ADMIN", {
                type: "marketplace_order",
                title: "New Marketplace Order",
                message: `Order #${orderNum} placed for ₹${Number(computedTotal).toLocaleString()}.`,
                entityId: orderId,
                targetRoute: "/admin/orders",
              }).catch(() => {});

              return sendJson(res, 201, {
                success: true,
                message: "Order placed successfully",
                data: {
                  id: orderId,
                  order_number: orderNum,
                  total_amount: computedTotal,
                  status: "pending",
                  payment_status: "paid",
                  delivery_address: deliveryAddressStr,
                  recipient_name: recipientName,
                  recipient_phone: recipientPhone,
                  delivery_instructions: deliveryInstructions,
                  payment_method: paymentMethod,
                  items: validatedItems,
                },
              });
            }

            return sendJson(res, 405, { success: false, error: `Method ${method} not allowed` });
          } catch (error: any) {
            console.error("[PostgreSQL Orders API Error]:", error);
            return sendJson(res, 500, { success: false, error: error.message });
          }
        }

        if (await paymentsRoute(req, res, cleanUrl, method, queryParams)) return;
        if (await assistantRoute(req, res, cleanUrl, method, queryParams)) return;
        if (await riderRoute(req, res, cleanUrl, method)) return;
        if (await deliveriesRoute(req, res, cleanUrl, method)) return;
        next();
      });
    },
  };
}
