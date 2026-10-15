import { createClient } from "@libsql/client";
const c = createClient({ url: "file:dev.db" });
try {
  const r1 = await c.execute("SELECT datetime('now', '+7 days') as dt");
  console.log("datetime worked:", r1.rows[0]);
} catch (e) {
  console.error("datetime failed:", e.message);
}

try {
  const r2 = await c.execute("SELECT now() + interval '7 days' as dt");
  console.log("interval worked:", r2.rows[0]);
} catch (e) {
  console.error("interval failed:", e.message);
}
