import pg from "pg";

const pool = new pg.Pool({
  connectionString: "postgresql://postgres:Vsvg%40db1@localhost:5432/riderzpro"
});

const queriesToTest = [
  // Products
  { name: "Products list", sql: "SELECT * FROM products LIMIT 5" },
  { name: "Products with join", sql: `
    SELECT p.*, s.store_name, s.owner_name, c.name as category_name 
    FROM products p 
    LEFT JOIN sellers s ON p.seller_id = s.id 
    LEFT JOIN categories c ON p.category_id = c.id 
    LIMIT 5
  `},
  // Categories
  { name: "Categories list", sql: "SELECT * FROM categories LIMIT 5" },
  // Sellers
  { name: "Sellers list", sql: "SELECT * FROM sellers LIMIT 5" },
  { name: "Seller by email", sql: "SELECT * FROM sellers WHERE email = $1", params: ["vendor1@riderzpro.com"] },
  // Admins
  { name: "Admins list", sql: "SELECT * FROM admins LIMIT 5" },
  { name: "Admin by email", sql: "SELECT * FROM admins WHERE email = $1", params: ["admin@riderzpro.com"] },
  // Customers
  { name: "Customers list", sql: "SELECT * FROM customers LIMIT 5" },
  // Users
  { name: "Users list", sql: "SELECT * FROM users LIMIT 5" },
  // Orders & Order Items
  { name: "Orders list", sql: "SELECT * FROM orders LIMIT 5" },
  { name: "Order items list", sql: "SELECT * FROM order_items LIMIT 5" },
  // Wishlists
  { name: "Wishlists list", sql: "SELECT * FROM wishlists LIMIT 5" },
  { name: "Wishlist items list", sql: "SELECT * FROM wishlist_items LIMIT 5" },
  // Carts
  { name: "Carts list", sql: "SELECT * FROM carts LIMIT 5" },
  { name: "Cart items list", sql: "SELECT * FROM cart_items LIMIT 5" },
  // Notifications
  { name: "Vendor notifications", sql: "SELECT * FROM vendor_notifications LIMIT 5" },
  // Audit logs
  { name: "Audit logs", sql: "SELECT * FROM audit_logs LIMIT 5" },
  // Auth sessions
  { name: "Auth sessions", sql: "SELECT * FROM auth_sessions LIMIT 5" },
  // Vendor change requests
  { name: "Vendor change requests", sql: "SELECT * FROM vendor_change_requests LIMIT 5" },
  // Admin invitations
  { name: "Admin invitations", sql: "SELECT * FROM admin_invitations LIMIT 5" },
];

async function runTests() {
  console.log("Testing PostgreSQL queries for schema compatibility...\n");
  let passed = 0;
  let failed = 0;

  for (const q of queriesToTest) {
    try {
      const res = await pool.query(q.sql, q.params || []);
      console.log(`✓ ${q.name}: OK (${res.rowCount} rows returned)`);
      passed++;
    } catch (err) {
      console.error(`✗ ${q.name} FAILED:`, err.message);
      failed++;
    }
  }

  console.log(`\nResults: ${passed} passed, ${failed} failed.`);
  await pool.end();
}

runTests().catch(console.error);
