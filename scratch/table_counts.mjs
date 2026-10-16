import { createClient } from "@libsql/client";

const client = createClient({ url: "file:dev.db" });

async function run() {
  const tables = await client.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';");
  for (const row of tables.rows) {
    try {
      const count = await client.execute(`SELECT COUNT(*) as c FROM "${row.name}"`);
      console.log(`${row.name}: ${count.rows[0].c}`);
    } catch (e) {
      console.log(`${row.name}: (error: ${e.message})`);
    }
  }
}

run();
