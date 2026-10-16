import { createClient } from "@libsql/client";

const client = createClient({ url: "file:dev.db" });

async function main() {
  const tables = await client.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
  console.log("Tables in dev.db:", tables.rows.map(r => r.name));

  const prodCount = await client.execute("SELECT COUNT(*) as count FROM products");
  console.log("Products count:", prodCount.rows[0].count);

  const catCounts = await client.execute("SELECT category_name, COUNT(*) as count FROM products GROUP BY category_name");
  console.log("Categories in products:", catCounts.rows);

  const orderCount = await client.execute("SELECT COUNT(*) as count FROM orders");
  console.log("Orders count:", orderCount.rows[0].count);
}

main().catch(console.error);
