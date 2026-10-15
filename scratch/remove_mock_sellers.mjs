import { createClient } from "@libsql/client";

async function main() {
  const db = createClient({ url: "file:dev.db" });

  await db.execute("DELETE FROM seller_documents WHERE seller_id IN ('sel_volthub_01', 'sel_apex_02')");
  await db.execute("DELETE FROM seller_bank_accounts WHERE seller_id IN ('sel_volthub_01', 'sel_apex_02')");
  await db.execute("DELETE FROM sellers WHERE id IN ('sel_volthub_01', 'sel_apex_02')");

  const res = await db.execute("SELECT id, store_name, email FROM sellers");
  console.log("Remaining sellers in dev.db:", res.rows);
}

main().catch(console.error);
