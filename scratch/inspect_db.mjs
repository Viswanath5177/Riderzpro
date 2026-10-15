import Database from 'better-sqlite3';

const db = new Database('./dev.db');

const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").all();
console.log("=== ALL TABLES ===");
for (const t of tables) {
  const count = db.prepare(`SELECT COUNT(*) as c FROM "${t.name}"`).get();
  const cols = db.prepare(`PRAGMA table_info("${t.name}")`).all().map(c => `${c.name}(${c.type})`);
  console.log(`\n${t.name} (${count.c} rows):`);
  console.log(`  Columns: ${cols.join(", ")}`);
}

// Check admin-related tables
console.log("\n\n=== ADMIN ACCOUNTS ===");
try {
  const admins = db.prepare("SELECT * FROM admins").all();
  console.log("admins table:", JSON.stringify(admins, null, 2));
} catch(e) { console.log("No admins table:", e.message); }

try {
  const admins = db.prepare("SELECT * FROM admin_users").all();
  console.log("admin_users table:", JSON.stringify(admins, null, 2));
} catch(e) { console.log("No admin_users table:", e.message); }

// Check vendor table
console.log("\n\n=== VENDORS ===");
try {
  const vendors = db.prepare("SELECT id, business_name, email, status, created_at FROM vendors LIMIT 5").all();
  console.log("vendors:", JSON.stringify(vendors, null, 2));
} catch(e) { console.log("No vendors table:", e.message); }

// Check customers table 
console.log("\n\n=== CUSTOMERS ===");
try {
  const custs = db.prepare("SELECT id, email, name, created_at FROM customers LIMIT 5").all();
  console.log("customers:", JSON.stringify(custs, null, 2));
} catch(e) { console.log("No customers table:", e.message); }

// Check orders table
console.log("\n\n=== ORDERS ===");
try {
  const orders = db.prepare("SELECT * FROM orders LIMIT 3").all();
  console.log("orders:", JSON.stringify(orders, null, 2));
} catch(e) { console.log("No orders table:", e.message); }

// Check products
console.log("\n\n=== PRODUCTS ===");
try {
  const prods = db.prepare("SELECT id, name, vendor_id, price, status, approval_status FROM products LIMIT 5").all();
  console.log("products:", JSON.stringify(prods, null, 2));
} catch(e) { console.log("No products table:", e.message); }

db.close();
