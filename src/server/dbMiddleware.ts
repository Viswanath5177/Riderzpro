import type { IncomingMessage, ServerResponse } from "http";
import pg from "pg";

const pool = new pg.Pool({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "Vsvg@db1",
  database: "riderzpro",
  max: 10,
});

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

export function pgApiMiddleware() {
  return {
    name: "riderzpro-pg-api",
    configureServer(server: any) {
      server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
        const url = req.url || "";
        const method = req.method?.toUpperCase();
        const [cleanUrl, queryString = ""] = url.split("?");
        const queryParams = new URLSearchParams(queryString);

        // ====================================================================
        // 1. PRODUCTS API: /api/products
        // ====================================================================
        if (cleanUrl.startsWith("/api/products")) {
          const parts = cleanUrl.split("/").filter(Boolean); // ['api', 'products', optionalId]
          const productId = parts.length > 2 ? parts[2] : null;

          try {
            // GET /api/products (supports ?fit_vehicle=ola-s1pro, ?category=..., ?seller_id=...)
            if (method === "GET") {
              const fitVehicle = queryParams.get("fit_vehicle");
              const category = queryParams.get("category");
              const sellerId = queryParams.get("seller_id");

              let sql = `
                SELECT 
                  p.*, 
                  c.name as category_name, 
                  u.full_name as seller_name, 
                  u.store_name
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.id
                LEFT JOIN users u ON p.seller_id = u.id
                WHERE p.is_active = TRUE
              `;
              const params: any[] = [];

              if (fitVehicle) {
                params.push(JSON.stringify([fitVehicle]));
                params.push(`%${fitVehicle}%`);
                sql += ` AND (
                  p.fitment_type = 'universal'
                  OR p.compatible_vehicles @> $${params.length - 1}::jsonb
                  OR p.description ILIKE $${params.length}
                )`;
              }

              if (category && category !== "All") {
                params.push(category);
                sql += ` AND (c.name ILIKE $${params.length} OR p.category_id = $${params.length})`;
              }

              if (sellerId) {
                params.push(sellerId);
                sql += ` AND p.seller_id = $${params.length}`;
              }

              sql += ` ORDER BY p.created_at DESC`;

              const result = await pool.query(sql, params);
              return sendJson(res, 200, { success: true, data: result.rows });
            }

            // POST /api/products (Add product by Vendor with all spreadsheet details)
            if (method === "POST") {
              const body = await parseBody(req);
              const {
                id,
                seller_id = "usr_seller_01",
                category_id = "cat_accessories",
                name,
                brand = "Riderz Armor",
                sku = "RZP-SC-001",
                description = "",
                price = 0,
                mrp,
                discount_percent = 0,
                stock = 0,
                moq = 1,
                supplier = "[Supplier]",
                variant_model = "",
                material = "PU leatherette",
                fitment_size = "Model specific",
                fitment_type = "specific",
                compatible_vehicles = ["ola-s1pro", "ather-450x", "tata-nexon-ev"],
                color_options = ["Black", "Beige"],
                key_features = "",
                warranty = "1 Year Replacement",
                weight_kg = 4.5,
                image_url = "",
                verification_status = "approved", // approved or pending_approval
              } = body;

              const prodId = id || `prod_${Math.random().toString(36).substring(2, 10)}`;

              const insertResult = await pool.query(
                `INSERT INTO products (
                  id, seller_id, category_id, name, brand, sku, description,
                  price, mrp, discount_percent, stock, moq, supplier,
                  variant_model, material, fitment_size, fitment_type,
                  compatible_vehicles, color_options, key_features, warranty,
                  weight_kg, image_url, verification_status, is_active
                ) VALUES (
                  $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13,
                  $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, TRUE
                )
                ON CONFLICT (id) DO UPDATE SET
                  name = EXCLUDED.name,
                  brand = EXCLUDED.brand,
                  sku = EXCLUDED.sku,
                  description = EXCLUDED.description,
                  price = EXCLUDED.price,
                  mrp = EXCLUDED.mrp,
                  discount_percent = EXCLUDED.discount_percent,
                  stock = EXCLUDED.stock,
                  moq = EXCLUDED.moq,
                  supplier = EXCLUDED.supplier,
                  variant_model = EXCLUDED.variant_model,
                  material = EXCLUDED.material,
                  fitment_size = EXCLUDED.fitment_size,
                  fitment_type = EXCLUDED.fitment_type,
                  compatible_vehicles = EXCLUDED.compatible_vehicles,
                  color_options = EXCLUDED.color_options,
                  key_features = EXCLUDED.key_features,
                  warranty = EXCLUDED.warranty,
                  weight_kg = EXCLUDED.weight_kg,
                  image_url = EXCLUDED.image_url,
                  verification_status = EXCLUDED.verification_status,
                  updated_at = CURRENT_TIMESTAMP
                RETURNING *`,
                [
                  prodId,
                  seller_id,
                  category_id,
                  name,
                  brand,
                  sku,
                  description,
                  Number(price),
                  mrp !== undefined ? Number(mrp) : Math.round(Number(price) * 1.3),
                  Number(discount_percent),
                  Number(stock),
                  Number(moq),
                  supplier,
                  variant_model,
                  material,
                  fitment_size,
                  fitment_type,
                  JSON.stringify(Array.isArray(compatible_vehicles) ? compatible_vehicles : [compatible_vehicles]),
                  JSON.stringify(Array.isArray(color_options) ? color_options : [color_options]),
                  key_features,
                  warranty,
                  Number(weight_kg),
                  image_url,
                  verification_status,
                ]
              );

              return sendJson(res, 201, {
                success: true,
                message: "Product saved to PostgreSQL database successfully",
                data: insertResult.rows[0],
              });
            }

            // PUT /api/products/:id (Edit product)
            if (method === "PUT") {
              const body = await parseBody(req);
              const targetId = productId || body.id;

              if (!targetId) {
                return sendJson(res, 400, { success: false, error: "Product ID required for update" });
              }

              const {
                name,
                brand,
                sku,
                description,
                price,
                mrp,
                discount_percent,
                stock,
                moq,
                supplier,
                variant_model,
                material,
                fitment_size,
                fitment_type,
                compatible_vehicles,
                color_options,
                key_features,
                warranty,
                weight_kg,
                image_url,
                category_id,
              } = body;

              const updateResult = await pool.query(
                `UPDATE products SET
                  name = COALESCE($1, name),
                  brand = COALESCE($2, brand),
                  sku = COALESCE($3, sku),
                  description = COALESCE($4, description),
                  price = COALESCE($5, price),
                  mrp = COALESCE($6, mrp),
                  discount_percent = COALESCE($7, discount_percent),
                  stock = COALESCE($8, stock),
                  moq = COALESCE($9, moq),
                  supplier = COALESCE($10, supplier),
                  variant_model = COALESCE($11, variant_model),
                  material = COALESCE($12, material),
                  fitment_size = COALESCE($13, fitment_size),
                  fitment_type = COALESCE($14, fitment_type),
                  compatible_vehicles = COALESCE($15, compatible_vehicles),
                  color_options = COALESCE($16, color_options),
                  key_features = COALESCE($17, key_features),
                  warranty = COALESCE($18, warranty),
                  weight_kg = COALESCE($19, weight_kg),
                  image_url = COALESCE($20, image_url),
                  category_id = COALESCE($21, category_id),
                  updated_at = CURRENT_TIMESTAMP
                WHERE id = $22
                RETURNING *`,
                [
                  name,
                  brand,
                  sku,
                  description,
                  price !== undefined ? Number(price) : null,
                  mrp !== undefined ? Number(mrp) : null,
                  discount_percent !== undefined ? Number(discount_percent) : null,
                  stock !== undefined ? Number(stock) : null,
                  moq !== undefined ? Number(moq) : null,
                  supplier,
                  variant_model,
                  material,
                  fitment_size,
                  fitment_type,
                  compatible_vehicles ? JSON.stringify(compatible_vehicles) : null,
                  color_options ? JSON.stringify(color_options) : null,
                  key_features,
                  warranty,
                  weight_kg !== undefined ? Number(weight_kg) : null,
                  image_url,
                  category_id,
                  targetId,
                ]
              );

              if (!updateResult.rows.length) {
                return sendJson(res, 404, { success: false, error: "Product not found in database" });
              }

              return sendJson(res, 200, {
                success: true,
                message: "Product updated in PostgreSQL database successfully",
                data: updateResult.rows[0],
              });
            }

            // DELETE /api/products/:id
            if (method === "DELETE" && productId) {
              await pool.query("DELETE FROM products WHERE id = $1", [productId]);
              return sendJson(res, 200, { success: true, message: "Product deleted", id: productId });
            }

            return sendJson(res, 405, { success: false, error: `Method ${method} not allowed` });
          } catch (error: any) {
            console.error("[PostgreSQL Products API Error]:", error);
            return sendJson(res, 500, { success: false, error: error.message });
          }
        }

        // ====================================================================
        // 2. CUSTOMER GARAGE API: /api/garage
        // ====================================================================
        if (cleanUrl.startsWith("/api/garage")) {
          const parts = cleanUrl.split("/").filter(Boolean); // ['api', 'garage', optionalId, optionalAction]
          const garageId = parts.length > 2 ? parts[2] : null;
          const subAction = parts.length > 3 ? parts[3] : null;

          try {
            // GET /api/garage (Customer garage vehicles)
            if (method === "GET") {
              const customerId = queryParams.get("customer_id") || "usr_customer_demo";
              const result = await pool.query(
                `SELECT * FROM customer_garage WHERE customer_id = $1 ORDER BY is_active DESC, created_at ASC`,
                [customerId]
              );
              return sendJson(res, 200, { success: true, data: result.rows });
            }

            // POST /api/garage (Add vehicle to customer garage)
            if (method === "POST") {
              const body = await parseBody(req);
              const {
                customer_id = "usr_customer_demo",
                vehicle_id,
                make,
                model,
                year = 2024,
                vin = "",
                vehicle_type = "bike",
                voltage = 60,
                battery_kwh,
              } = body;

              if (!vehicle_id || !make || !model) {
                return sendJson(res, 400, { success: false, error: "Vehicle details (vehicle_id, make, model) required." });
              }

              // Set others inactive if this is the first or explicitly active
              const count = await pool.query(`SELECT count(*) FROM customer_garage WHERE customer_id = $1`, [customer_id]);
              const isActive = parseInt(count.rows[0].count) === 0;

              const insertResult = await pool.query(
                `INSERT INTO customer_garage (
                  customer_id, vehicle_id, make, model, year, vin, vehicle_type, voltage, battery_kwh, is_active
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                RETURNING *`,
                [
                  customer_id,
                  vehicle_id,
                  make,
                  model,
                  Number(year),
                  vin,
                  vehicle_type,
                  Number(voltage),
                  battery_kwh ? Number(battery_kwh) : null,
                  isActive,
                ]
              );

              return sendJson(res, 201, {
                success: true,
                message: "Vehicle added to Customer Garage successfully in PostgreSQL",
                data: insertResult.rows[0],
              });
            }

            // PUT /api/garage/:id/active (Set vehicle as active)
            if (method === "PUT" && garageId && subAction === "active") {
              const customerId = queryParams.get("customer_id") || "usr_customer_demo";
              await pool.query(`UPDATE customer_garage SET is_active = FALSE WHERE customer_id = $1`, [customerId]);
              const updated = await pool.query(
                `UPDATE customer_garage SET is_active = TRUE, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
                [garageId]
              );
              return sendJson(res, 200, { success: true, data: updated.rows[0] });
            }

            // DELETE /api/garage/:id (Remove vehicle from garage)
            if (method === "DELETE" && garageId) {
              await pool.query(`DELETE FROM customer_garage WHERE id = $1`, [garageId]);
              return sendJson(res, 200, { success: true, message: "Vehicle removed from garage" });
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
            const categories = await pool.query(`SELECT * FROM categories ORDER BY name ASC`);
            return sendJson(res, 200, { success: true, data: categories.rows });
          } catch (error: any) {
            return sendJson(res, 500, { success: false, error: error.message });
          }
        }

        next();
      });
    },
  };
}
