import { createClient } from "@libsql/client";

const client = createClient({ url: "file:dev.db" });

async function fixDb() {
  try {
    await client.execute("ALTER TABLE customers ADD COLUMN user_id TEXT;");
    console.log("✓ Added user_id to customers table");
  } catch (e) {
    console.log("customers.user_id note:", e.message);
  }

  try {
    await client.execute("ALTER TABLE order_items ADD COLUMN seller_id TEXT;");
    console.log("✓ Added seller_id to order_items table");
  } catch (e) {
    console.log("order_items.seller_id note:", e.message);
  }

  // Sync user_id from users to customers
  try {
    const res = await client.execute(`
      UPDATE customers 
      SET user_id = (SELECT u.id FROM users u WHERE LOWER(u.email) = LOWER(customers.email) LIMIT 1)
      WHERE user_id IS NULL;
    `);
    console.log("✓ Synced user_id from users to customers:", res.rowsAffected);
  } catch (e) {
    console.log("Sync user_id error:", e.message);
  }

  const custs = await client.execute("SELECT id, email, user_id FROM customers");
  console.log("Customers now:", custs.rows);
}

fixDb();
