import pg from "pg";
import dotenv from "dotenv";
import { createClient, type Client } from "@libsql/client";
import path from "node:path";
import fs from "node:fs";

dotenv.config();

const env = process.env;
const rawUrl = env["DATABASE_URL"] || "file:./dev.db";
const isSqliteConfigured = (rawUrl || "").startsWith("file:") || env["USE_SQLITE"] === "true";

const devDbPath = rawUrl.startsWith("file:")
  ? path.resolve(process.cwd(), rawUrl.slice(5))
  : path.resolve(process.cwd(), "dev.db");

// LibSQL SQLite client for local dev.db
let sqliteClient: Client | null = null;
if (isSqliteConfigured || fs.existsSync(devDbPath)) {
  try {
    sqliteClient = createClient({ url: `file:${devDbPath}` });
    sqliteClient.execute("PRAGMA journal_mode=WAL;").catch(() => {});
    sqliteClient.execute("PRAGMA busy_timeout=5000;").catch(() => {});
    console.log(`[Database] SQLite dev.db initialized: ${devDbPath}`);
  } catch (err: any) {
    console.warn("[Database] Failed to initialize SQLite dev.db:", err?.message);
  }
}

// PostgreSQL fallback / alternate pool
let pgPool: pg.Pool | null = null;
if (!isSqliteConfigured) {
  const connectionString =
    rawUrl ||
    `postgresql://${env["PGUSER"] || "postgres"}:${encodeURIComponent(env["PGPASSWORD"] || "Vsvg@db1")}@${env["PGHOST"] || "localhost"}:${env["PGPORT"] || "5432"}/${env["PGDATABASE"] || "riderzpro"}`;
  pgPool = new pg.Pool({
    connectionString,
    max: 15,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 3000,
  });
}

// ----------------------------------------------------------------------------
// SQL Query Normalization & Translation (PostgreSQL -> SQLite)
// ----------------------------------------------------------------------------

export function translateToSqlite(text: string, params: any[] = []): { sql: string; args: any[] } {
  let sql = text
    .replace(/now\(\)\s*([+-])\s*interval\s+'(\d+)\s+(seconds?|minutes?|hours?|days?)'/gi,
      (_match, sign: string, amount: string, unit: string) => `datetime('now', '${sign}${amount} ${unit.toLowerCase()}')`)
    .replace(/now\(\)/gi, "CURRENT_TIMESTAMP")
    .replace(/clock_timestamp\(\)/gi, "CURRENT_TIMESTAMP")
    .replace(/\s+for update\b/gi, "")
    .replace(/::[a-zA-Z_0-9]+/g, "")
    .replace(/\bILIKE\b/g, "LIKE")
    .replace(/RIGHT\s*\(\s*REGEXP_REPLACE\s*\([^)]+\)\s*,\s*10\s*\)\s*=\s*\$(\d+)/gi,
      (_m, idx) => `(phone LIKE '%' || $${idx})`)
    .replace(/p\.compatible_vehicles\s*@>\s*\$(\d+)/gi,
      (_m, idx) => `(p.compatible_vehicles LIKE '%' || $${idx} || '%' OR p.fitment_type = 'universal')`);

  const args: any[] = [];

  // Match = ANY($N)
  sql = sql.replace(/=\s*ANY\s*\(\s*\$(\d+)\s*\)/gi, (_m, idxStr) => {
    const rawVal = params[Number(idxStr) - 1];
    if (Array.isArray(rawVal) && rawVal.length > 0) {
      for (const item of rawVal) args.push(item);
      return `IN (${rawVal.map(() => "?").join(", ")})`;
    }
    args.push("__NO_MATCH__");
    return `IN (?)`;
  });

  // Match remaining $N
  sql = sql.replace(/\$(\d+)/g, (_match, idxStr) => {
    let val = params[Number(idxStr) - 1];
    if (typeof val === "string" && val.startsWith('["') && val.endsWith('"]') && !val.includes(",")) {
      try {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed) && parsed.length === 1) val = parsed[0];
      } catch {}
    }
    args.push(val);
    return "?";
  });

  return { sql, args };
}

const booleanColumns = new Set([
  "is_active", "is_verified", "is_read", "is_bestseller", "is_default", "verified"
]);
const jsonColumns = new Set([
  "compatible_vehicles", "color_options", "details"
]);

function normalizeRow(row: any): any {
  if (!row || typeof row !== "object") return row;
  const out: any = Array.isArray(row) ? [] : {};
  for (const [k, v] of Object.entries(row)) {
    if (booleanColumns.has(k)) {
      out[k] = v === 1 || v === true || v === "1" || v === "true";
    } else if (jsonColumns.has(k) && typeof v === "string") {
      try {
        out[k] = JSON.parse(v);
      } catch {
        out[k] = v;
      }
    } else {
      out[k] = v;
    }
  }
  return out;
}

// ----------------------------------------------------------------------------
// Unified Query Handler
// ----------------------------------------------------------------------------

export async function query<T extends pg.QueryResultRow = any>(text: string, params: any[] = []): Promise<pg.QueryResult<T>> {
  // 1. If SQLite is configured or dev.db is ready
  if (isSqliteConfigured || !pgPool) {
    if (!sqliteClient) {
      sqliteClient = createClient({ url: `file:${devDbPath}` });
    }
    const { sql, args } = translateToSqlite(text, params);
    const result = await sqliteClient.execute({ sql, args });
    const normalizedRows = (result.rows || []).map(normalizeRow);

    return {
      rows: normalizedRows as T[],
      rowCount: result.rowsAffected ?? normalizedRows.length,
      command: "SELECT",
      oid: 0,
      fields: [],
    } as pg.QueryResult<T>;
  }

  // 2. Try PostgreSQL with automatic SQLite fallback
  try {
    return await pgPool.query<T>(text, params);
  } catch (err: any) {
    if (sqliteClient || fs.existsSync(devDbPath)) {
      if (!sqliteClient) sqliteClient = createClient({ url: `file:${devDbPath}` });
      const { sql, args } = translateToSqlite(text, params);
      const result = await sqliteClient.execute({ sql, args });
      const normalizedRows = (result.rows || []).map(normalizeRow);

      return {
        rows: normalizedRows as T[],
        rowCount: result.rowsAffected ?? normalizedRows.length,
        command: "SELECT",
        oid: 0,
        fields: [],
      } as pg.QueryResult<T>;
    }
    throw err;
  }
}

// ----------------------------------------------------------------------------
// Compatible Pool Object
// ----------------------------------------------------------------------------

export const pool = {
  async query<T extends pg.QueryResultRow = any>(text: string, params?: any[]): Promise<pg.QueryResult<T>> {
    return query<T>(text, params);
  },
  async connect() {
    return {
      query: <T extends pg.QueryResultRow = any>(text: string, params?: any[]) => query<T>(text, params),
      release: () => {},
    };
  },
  async end() {
    if (sqliteClient) {
      sqliteClient.close();
      sqliteClient = null;
    }
    if (pgPool) {
      await pgPool.end();
      pgPool = null;
    }
  },
};

// ----------------------------------------------------------------------------
// Schema Initialization
// ----------------------------------------------------------------------------

export async function initializeDatabaseSchema() {
  if (isSqliteConfigured || (sqliteClient && !pgPool)) {
    console.log(`[Database] Operating directly on local SQLite dev.db (${devDbPath}). Schema ready.`);
    return;
  }

  if (pgPool) {
    let client: any;
    try {
      client = await pgPool.connect();
      console.log("[Database] Connected to PostgreSQL. Initializing schema...");
      // Categories
      await client.query(`
        CREATE TABLE IF NOT EXISTS categories (
          id VARCHAR(64) PRIMARY KEY,
          name VARCHAR(128) NOT NULL,
          slug VARCHAR(128) NOT NULL UNIQUE,
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );
      `);
      client.release();
    } catch (err: any) {
      console.warn("[PostgreSQL] Local PostgreSQL not reached. Running with local SQLite dev.db fallback:", err?.message);
    }
  }
}
