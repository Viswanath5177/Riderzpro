import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import pg from "pg";

const { Pool } = pg;
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl || databaseUrl.startsWith("file:")) {
  throw new Error("Set DATABASE_URL to the PostgreSQL connection string before applying production migrations.");
}

const migrations = ["001_auth.sql", "002_rider_applications.sql", "003_rider_registration.sql", "004_rider_operations.sql"];
const pool = new Pool({ connectionString: databaseUrl, max: 1, application_name: "riderzpro-migrations" });

try {
  const client = await pool.connect();
  try {
    await client.query("select pg_advisory_lock(hashtext('riderzpro-schema-migrations'))");
    const ledger = await client.query("select to_regclass('public.schema_migrations') as name");

    if (!ledger.rows[0]?.name) {
      const existing = await client.query("select to_regclass('public.app_users') as name");
      if (existing.rows[0]?.name) {
        throw new Error("The database already contains app_users but has no schema_migrations ledger. Stop and reconcile its baseline manually; this runner will not guess which migrations were applied.");
      }
      await client.query(`create table public.schema_migrations (
        name text primary key,
        checksum char(64) not null,
        applied_at timestamptz not null default now()
      )`);
    }

    const applied = await client.query("select name, checksum from public.schema_migrations");
    const appliedByName = new Map(applied.rows.map((row) => [row.name, row.checksum.trim()]));
    for (const name of migrations) {
      const source = await readFile(new URL(`../database/migrations/${name}`, import.meta.url), "utf8");
      const checksum = createHash("sha256").update(source).digest("hex");
      if (appliedByName.has(name)) {
        if (appliedByName.get(name) !== checksum) throw new Error(`Migration ${name} has changed since it was applied. Add a new migration instead of editing applied history.`);
        console.log(`Already applied ${name}.`);
        continue;
      }

      // The SQL files are also usable manually and include transaction statements.
      // Strip those wrappers so each migration and its ledger row commit atomically here.
      const sql = source.replace(/^\s*begin\s*;\s*/im, "").replace(/\s*commit\s*;\s*$/i, "");
      await client.query("begin");
      try {
        await client.query(sql);
        await client.query("insert into public.schema_migrations (name, checksum) values ($1, $2)", [name, checksum]);
        await client.query("commit");
        console.log(`Applied ${name}.`);
      } catch (error) {
        await client.query("rollback");
        throw error;
      }
    }
  } finally {
    await client.query("select pg_advisory_unlock(hashtext('riderzpro-schema-migrations'))").catch(() => undefined);
    client.release();
  }
} finally {
  await pool.end();
}
