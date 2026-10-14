import { ProductModel, CategoryModel } from "../models";

import type { IncomingMessage, ServerResponse } from "node:http";
import { parseBody, sendJson } from "./http";

export async function handleRoute(req: IncomingMessage, res: ServerResponse, cleanUrl: string, method: string | undefined, queryParams: URLSearchParams): Promise<boolean> {
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
