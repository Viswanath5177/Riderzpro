import { createClient } from "@libsql/client";

const client = createClient({ url: "file:dev.db" });

async function run() {
  const tables = await client.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';");
  console.log("Tables in dev.db:");
  for (const row of tables.rows) {
    try {
      const count = await client.execute(`SELECT COUNT(*) as c FROM "${row.name}"`);
      console.log(`  ${row.name}: ${count.rows[0].c}`);
    } catch (e) {
      console.log(`  ${row.name}: (error: ${e.message})`);
    }
  }

  try {
    const users = await client.execute("SELECT id, email, role, full_name, phone FROM users");
    console.log("\nUsers in users table:");
    console.table(users.rows);
  } catch (e) {
    console.log("Error querying users:", e.message);
  }

  try {
    const sellers = await client.execute("SELECT * FROM sellers");
    console.log("\nSellers table:");
    console.table(sellers.rows);
  } catch (e) {
    console.log("Error querying sellers:", e.message);
  }
}

run();
