import { createClient } from "@libsql/client";

async function main() {
  const db = createClient({ url: "file:database/dev.db.template" });
  const tables = await db.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
  for (const r of tables.rows) {
    try {
      const cnt = await db.execute(`SELECT count(*) as c FROM "${r.name}"`);
      if (cnt.rows[0].c > 0) {
        console.log(`${r.name}: ${cnt.rows[0].c}`);
      }
    } catch (e) {
      // ignore
    }
  }
}

main();
