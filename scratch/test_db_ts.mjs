import { query, pool, initializeDatabaseSchema } from "../src/server/db.ts";

async function testDbModule() {
  console.log("Testing src/server/db.ts with PostgreSQL...");

  await initializeDatabaseSchema();

  const selRes = await query("SELECT id, store_name, status, is_active FROM sellers WHERE is_active = 1");
  console.log("✓ Active sellers queried via db.ts:", selRes.rows);

  const prodRes = await query("SELECT COUNT(*) as count FROM products");
  console.log("✓ Products count via db.ts:", prodRes.rows[0].count);

  const orderRes = await query("SELECT COUNT(*) as count FROM orders");
  console.log("✓ Orders count via db.ts:", orderRes.rows[0].count);

  const adminRes = await query("SELECT id, email, role, is_active FROM admins WHERE is_active = 1");
  console.log("✓ Active admins queried via db.ts:", adminRes.rows);

  await pool.end();
  console.log("✓ All db.ts tests passed successfully!");
}

testDbModule().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});
