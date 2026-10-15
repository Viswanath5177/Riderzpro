import { ProductModel, CategoryModel } from "../models";
import demoProductsRaw from "../../../database/demo_products.json";

import type { IncomingMessage, ServerResponse } from "node:http";
import { parseBody, sendJson } from "./http";

const demoProducts: any[] = (demoProductsRaw as any[]) || [];

function storefrontProduct(record: any) {
  const sellerName = record.store_name || record.seller_name || "Qbit Pro";
  const sellerCity = record.seller_city || "Sector 63, Noida";
  const shipsFrom = record.ships_from || "Noida";
  const gstRate = record.gst_rate ?? record.gstRate ?? 18;
  const hsnCode = record.hsn_code ?? record.hsnCode ?? null;
  const categoryName = record.category_name || record.category || null;

  return {
    ...record,
    category: categoryName,
    category_name: categoryName,
    seller_name: sellerName,
    store_name: record.store_name || sellerName,
    seller_city: sellerCity,
    ships_from: shipsFrom,
    gst_rate: gstRate,
    hsn_code: hsnCode,
  };
}

export async function handleRoute(req: IncomingMessage, res: ServerResponse, cleanUrl: string, method: string | undefined, queryParams: URLSearchParams): Promise<boolean> {
          if (cleanUrl.startsWith("/api/products")) {
            const parts = cleanUrl.split("/").filter(Boolean); // ['api', 'products', optionalId]
            const productId = parts.length > 2 ? parts[2] : null;

            try {
              // GET /api/products/:id or GET /api/products
              if (method === "GET") {
                if (productId) {
                  let item = await ProductModel.findById(productId);
                  if (!item) {
                    item = demoProducts.find((p) => p.id === productId) || null;
                  }
                  if (!item) {
                    return sendJson(res, 404, { success: false, error: "Product not found" });
                  }
                  return sendJson(res, 200, { success: true, data: storefrontProduct(item) });
                }

                const fitVehicle = queryParams.get("fit_vehicle") || undefined;
                const category = queryParams.get("category") || undefined;
                const sellerId = queryParams.get("seller_id") || queryParams.get("seller") || undefined;
                const search = queryParams.get("q") || queryParams.get("search") || undefined;
                const all = queryParams.get("all") === "true";
                const status = queryParams.get("status") || undefined;

                // Storefront protection: unless explicitly requesting all, specific status, or seller catalog, show only approved products
                const effectiveStatus = status || (all || sellerId ? undefined : "approved");

                let products = await ProductModel.findAll({
                  fit_vehicle: fitVehicle,
                  category: category,
                  seller_id: sellerId,
                  search: search,
                  verification_status: effectiveStatus as any,
                  is_active: all ? undefined : true,
                });

                if (products.length === 0) {
                  products = demoProducts.filter((p) => {
                    if (sellerId && p.seller_id !== sellerId) return false;
                    if (category && category !== "All") {
                      const c = category.toLowerCase().trim();
                      const matchCat =
                        (p.category && p.category.toLowerCase().includes(c)) ||
                        (p.category_id && p.category_id.toLowerCase() === c) ||
                        (p.category_name && p.category_name.toLowerCase().includes(c)) ||
                        (p.department && p.department.toLowerCase().includes(c)) ||
                        (c === "ev spares" && (p.department?.toLowerCase() === "ev spares" || p.category?.toLowerCase().includes("ev") || p.category?.toLowerCase().includes("batter") || p.category?.toLowerCase().includes("charg") || p.category?.toLowerCase().includes("brake") || p.category?.toLowerCase().includes("bms"))) ||
                        (c === "ev batteries" && (p.category?.toLowerCase().includes("batter") || p.name?.toLowerCase().includes("battery"))) ||
                        (c === "chargers" && (p.category?.toLowerCase().includes("charg") || p.name?.toLowerCase().includes("charger") || p.name?.toLowerCase().includes("dock"))) ||
                        (c === "riding gear & helmets" && (p.category?.toLowerCase().includes("helmet") || p.category?.toLowerCase().includes("riding") || p.department?.toLowerCase() === "riding gear")) ||
                        (c === "brakes & spares" && (["brakes & suspension", "bms & electronics", "motors & transmission", "tyre care & utilities"].includes(p.category?.toLowerCase()) || p.name?.toLowerCase().includes("brake") || p.name?.toLowerCase().includes("rotor") || p.name?.toLowerCase().includes("belt") || p.name?.toLowerCase().includes("bms"))) ||
                        (c === "car accessories" && (p.vehicle_type === "car" || p.vehicle_type === "both" || p.category_name?.toLowerCase().includes("car") || p.category?.toLowerCase().includes("car") || ["multimedia", "interior", "exterior", "utilities", "comfort", "car care"].includes(p.department?.toLowerCase()))) ||
                        (c === "bike accessories" && (p.vehicle_type === "bike" || p.vehicle_type === "both" || p.category_name?.toLowerCase().includes("bike") || ["riding gear", "ev spares"].includes(p.department?.toLowerCase())));
                      if (!matchCat) return false;
                    }
                    if (search) {
                      const s = search.toLowerCase();
                      const inSearch =
                        (p.name && p.name.toLowerCase().includes(s)) ||
                        (p.brand && p.brand.toLowerCase().includes(s)) ||
                        (p.description && p.description.toLowerCase().includes(s)) ||
                        (p.sku && p.sku.toLowerCase().includes(s));
                      if (!inSearch) return false;
                    }
                    if (fitVehicle && fitVehicle !== "all") {
                      const f = fitVehicle.toLowerCase();
                      const matchFit =
                        p.fitment_type === "universal" ||
                        (Array.isArray(p.compatible_vehicles) &&
                          (p.compatible_vehicles.includes("universal") || p.compatible_vehicles.includes(f)));
                      if (!matchFit) return false;
                    }
                    return true;
                  });
                }

                return sendJson(res, 200, { success: true, data: products.map(storefrontProduct), total: products.length });
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
          if (cleanUrl === "/api/categories") {
            try {
              const categories = await CategoryModel.findAll();
              return sendJson(res, 200, { success: true, data: categories });
            } catch (error: any) {
              return sendJson(res, 500, { success: false, error: error.message });
            }
          }

          // ====================================================================
  return false;
}
