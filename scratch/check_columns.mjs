import { createClient } from "@libsql/client";

const client = createClient({ url: "file:dev.db" });

async function main() {
  for (const table of ["customer_garage", "service_bookings", "products", "orders", "customer_profiles"]) {
    console.log(`\n=== TABLE: ${table} ===`);
    const info = await client.execute(`PRAGMA table_info(${table})`);
    console.log(info.rows.map(r => `${r.name} (${r.type})`));
  }
}

main().catch(console.error);
