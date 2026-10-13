import { readFile } from "node:fs/promises";
import { createClient } from "@libsql/client";

const url = process.env.DATABASE_URL ?? "file:./database/riderzpro-dev.db";
if (!url.startsWith("file:")) {
  throw new Error("The local migration requires DATABASE_URL to be a SQLite file URL (file:...)");
}

const client = createClient({ url });
try {
  for (const migration of ["001_auth.sql", "002_rider_applications.sql"]) {
    const sql = await readFile(new URL(`../database/migrations/sqlite/${migration}`, import.meta.url), "utf8");
    await client.executeMultiple(sql);
    console.log(`Applied local SQLite migration ${migration}.`);
  }
  const applicationColumns = await client.execute("PRAGMA table_info(rider_applications)");
  if (!applicationColumns.rows.some((column) => column.name === "service_state")) {
    await client.execute("ALTER TABLE rider_applications ADD COLUMN service_state TEXT NOT NULL DEFAULT ''");
    console.log("Added rider application service_state column.");
  }
  const registrationMigration = await readFile(new URL("../database/migrations/sqlite/003_rider_registration.sql", import.meta.url), "utf8");
  await client.executeMultiple(registrationMigration);
  const consentColumns = await client.execute("PRAGMA table_info(rider_application_consents)");
  if (!consentColumns.rows.some((column) => column.name === "eligibility_confirmed")) {
    await client.execute("ALTER TABLE rider_application_consents ADD COLUMN eligibility_confirmed INTEGER NOT NULL DEFAULT 1 CHECK (eligibility_confirmed = 1)");
    console.log("Added rider eligibility consent column.");
  }
  console.log("Applied local SQLite migration 003_rider_registration.sql.");
  const operationsMigration = await readFile(new URL("../database/migrations/sqlite/004_rider_operations.sql", import.meta.url), "utf8");
  await client.executeMultiple(operationsMigration);
  console.log("Applied local SQLite migration 004_rider_operations.sql.");
} finally {
  client.close();
}
