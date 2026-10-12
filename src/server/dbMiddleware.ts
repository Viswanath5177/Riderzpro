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
        
        // Match /api/products
        if (url.startsWith("/api/products")) {
          const method = req.method?.toUpperCase();
          const cleanUrl = url.split("?")[0];
          const parts = cleanUrl.split("/").filter(Boolean); // ['api', 'products', optionalId]
          const productId = parts.length > 2 ? parts[2] : null;

          try {
            // GET /api/products
            if (method === "GET") {
              const result = await pool.query(`
                SELECT 
                  p.*, 
                  c.name as category_name, 
                  u.full_name as seller_name, 
                  u.store_name
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.id
                LEFT JOIN users u ON p.seller_id = u.id
                ORDER BY p.created_at DESC
              `);
              return sendJson(res, 200, { success: true, data: result.rows });
            }

            // POST /api/products (Add product)
            if (method === "POST") {
              const body = await parseBody(req);
              const {
                id,
                seller_id = "usr_seller_01",
                category_id = "cat_accessories",
                name,
                description = "",
                price = 0,
                stock = 0,
                image_url = "",
                verification_status = "pending_approval",
              } = body;

              const prodId = id || `prod_${Math.random().toString(36).substring(2, 10)}`;

              // Ensure seller_id exists (fallback to usr_seller_01)
              const insertResult = await pool.query(
                `INSERT INTO products (
                  id, seller_id, category_id, name, description, 
                  price, stock, image_url, verification_status, is_active
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, TRUE)
                ON CONFLICT (id) DO UPDATE SET
                  name = EXCLUDED.name,
                  description = EXCLUDED.description,
                  price = EXCLUDED.price,
                  stock = EXCLUDED.stock,
                  image_url = EXCLUDED.image_url,
                  updated_at = CURRENT_TIMESTAMP
                RETURNING *`,
                [
                  prodId,
                  seller_id,
                  category_id,
                  name,
                  description,
                  Number(price),
                  Number(stock),
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
                description = "",
                price,
                stock,
                image_url,
                category_id = "cat_accessories",
              } = body;

              const updateResult = await pool.query(
                `UPDATE products SET
                  name = COALESCE($1, name),
                  description = COALESCE($2, description),
                  price = COALESCE($3, price),
                  stock = COALESCE($4, stock),
                  image_url = COALESCE($5, image_url),
                  category_id = COALESCE($6, category_id),
                  verification_status = 'pending_approval',
                  updated_at = CURRENT_TIMESTAMP
                WHERE id = $7
                RETURNING *`,
                [
                  name,
                  description,
                  price !== undefined ? Number(price) : null,
                  stock !== undefined ? Number(stock) : null,
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
              const deleteResult = await pool.query("DELETE FROM products WHERE id = $1 RETURNING id", [productId]);
              return sendJson(res, 200, { success: true, message: "Product deleted", id: productId });
            }

            return sendJson(res, 405, { success: false, error: `Method ${method} not allowed` });
          } catch (error: any) {
            console.error("[PostgreSQL API Error]:", error);
            return sendJson(res, 500, { success: false, error: error.message });
          }
        }

        next();
      });
    },
  };
}
