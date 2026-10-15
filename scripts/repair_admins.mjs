import { createClient } from "@libsql/client";
import bcrypt from "bcryptjs";

const db = createClient({ url: "file:./dev.db" });

async function run() {
  console.log("Checking schema...");
  const schemaRes = await db.execute("SELECT sql FROM sqlite_master WHERE type='table' AND name='admins'");
  console.log("Admins schema:", schemaRes.rows[0]?.sql);

  // Backup dev.db first or rebuild table
  // Let's copy distinct rows
  const adminRows = await db.execute("SELECT DISTINCT id, email, password_hash, full_name, role, is_active FROM admins");
  console.log("Distinct admin rows:", adminRows.rows);

  // Recreate admins table cleanly
  await db.execute("DROP TABLE IF EXISTS admins_clean");
  await db.execute(`
    CREATE TABLE admins_clean (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      full_name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'ADMIN',
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const seen = new Set();
  for (const row of adminRows.rows) {
    if (!seen.has(row.email)) {
      seen.add(row.email);
      await db.execute({
        sql: `INSERT INTO admins_clean (id, email, password_hash, full_name, role, is_active) VALUES ($1, $2, $3, $4, $5, $6)`,
        args: [row.id, row.email, row.password_hash, row.full_name, row.role, row.is_active]
      });
    }
  }

  await db.execute("DROP TABLE admins");
  await db.execute("ALTER TABLE admins_clean RENAME TO admins");

  console.log("Running REINDEX and PRAGMA integrity_check...");
  await db.execute("REINDEX");
  const check = await db.execute("PRAGMA integrity_check");
  console.log("Integrity check result:", check.rows);

  db.close();
}

run().catch(console.error);
