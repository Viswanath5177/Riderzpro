import fs from "fs";

let content = fs.readFileSync("src/server/dbMiddleware.ts", "utf-8");

// 1. Fix GET /api/wishlist query to use LEFT JOIN products p ON wi.product_id = p.id (without requiring p.is_active = 1 strictly)
content = content.replace(
  `FROM wishlist_items wi\r\n                 JOIN products p ON wi.product_id = p.id\r\n                 WHERE wi.wishlist_id = $1 AND p.is_active = 1`,
  `FROM wishlist_items wi\r\n                 LEFT JOIN products p ON wi.product_id = p.id\r\n                 WHERE wi.wishlist_id = $1`
);
content = content.replace(
  `FROM wishlist_items wi\n                 JOIN products p ON wi.product_id = p.id\n                 WHERE wi.wishlist_id = $1 AND p.is_active = 1`,
  `FROM wishlist_items wi\n                 LEFT JOIN products p ON wi.product_id = p.id\n                 WHERE wi.wishlist_id = $1`
);

// 2. Fix POST /api/wishlist: do not reject with 404 if not in db products table, and resolve customerId by body.email or body.customer_id
const oldPost = `            if (method === "POST") {
              const body = await parseBody(req);
              const productId = body.productId || body.product_id;
              const action = body.action || "add"; // "add" | "remove"

              if (!productId) {
                return sendJson(res, 400, { success: false, error: "Product ID required" });
              }

              // Verify product exists in catalog
              const prodCheck = await query("SELECT id FROM products WHERE id = $1 LIMIT 1", [productId]);
              if (!prodCheck.rows[0]) {
                return sendJson(res, 404, { success: false, error: "Product not found in catalog" });
              }

              if (!customerId) {
                return sendJson(res, 200, { success: true, guest: true, message: "Guest session - local storage used" });
              }`;

const newPost = `            if (method === "POST") {
              const body = await parseBody(req);
              const productId = body.productId || body.product_id;
              const action = body.action || "add"; // "add" | "remove"

              if (!productId) {
                return sendJson(res, 400, { success: false, error: "Product ID required" });
              }

              if (!customerId && (body.email || body.customer_id)) {
                const identifier = String(body.email || body.customer_id).toLowerCase().trim();
                const custRow = await query(
                  "SELECT id FROM customers WHERE LOWER(email) = LOWER($1) OR id = $1 OR user_id = $1 LIMIT 1",
                  [identifier]
                );
                if (custRow.rows[0]) {
                  customerId = custRow.rows[0].id;
                } else if (identifier.includes("@")) {
                  const newCustId = "cst_" + crypto.randomBytes(8).toString("hex");
                  await query(
                    "INSERT INTO customers (id, email, full_name, is_active) VALUES ($1, $2, $3, 1)",
                    [newCustId, identifier, identifier.split("@")[0]]
                  ).catch(() => {});
                  customerId = newCustId;
                }
              }

              if (!customerId) {
                return sendJson(res, 200, { success: true, guest: true, message: "Guest session - local storage used" });
              }`;

content = content.replace(oldPost.replace(/\n/g, "\r\n"), newPost.replace(/\n/g, "\r\n"));
content = content.replace(oldPost, newPost);

// 3. Fix DELETE /api/wishlist: also check body.email or body.customer_id
const oldDelete = `            if (method === "DELETE") {
              const body = await parseBody(req).catch(() => ({}));
              const productId = body.productId || body.product_id || queryParams.get("product_id");
              if (!productId) {
                return sendJson(res, 400, { success: false, error: "Product ID required" });
              }
              if (customerId) {`;

const newDelete = `            if (method === "DELETE") {
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
              if (customerId) {`;

content = content.replace(oldDelete.replace(/\n/g, "\r\n"), newDelete.replace(/\n/g, "\r\n"));
content = content.replace(oldDelete, newDelete);

fs.writeFileSync("src/server/dbMiddleware.ts", content);
console.log("Successfully updated dbMiddleware.ts wishlist endpoint!");
