import pg from "pg";
import dotenv from "dotenv";
import { createClient, type Client } from "@libsql/client";
import path from "node:path";
import fs from "node:fs";

dotenv.config();

const env = process.env;
const rawUrl = env["DATABASE_URL"] || "postgresql://postgres:Vsvg%40db1@localhost:5432/riderzpro";
const isSqliteConfigured = (rawUrl || "").startsWith("file:") || env["USE_SQLITE"] === "true";
export const isPostgresAvailable = !isSqliteConfigured;

const devDbPath = rawUrl.startsWith("file:")
  ? path.resolve(process.cwd(), rawUrl.slice(5))
  : path.resolve(process.cwd(), "dev.db");

// LibSQL SQLite client (only active when SQLite is explicitly configured)
let sqliteClient: Client | null = null;
if (isSqliteConfigured) {
  try {
    sqliteClient = createClient({ url: `file:${devDbPath}` });
    sqliteClient.execute("PRAGMA journal_mode=WAL;").catch(() => {});
    sqliteClient.execute("PRAGMA busy_timeout=5000;").catch(() => {});
    sqliteClient.execute("ALTER TABLE orders ADD COLUMN refund_amount NUMERIC DEFAULT 0;").catch(() => {});
    sqliteClient.execute("ALTER TABLE orders ADD COLUMN payment_status TEXT DEFAULT 'paid';").catch(() => {});
    sqliteClient.execute("ALTER TABLE orders ADD COLUMN payment_method TEXT DEFAULT 'UPI / Card';").catch(() => {});
    sqliteClient.execute("ALTER TABLE customers ADD COLUMN user_id TEXT;").catch(() => {});
    sqliteClient.execute("ALTER TABLE order_items ADD COLUMN seller_id TEXT;").catch(() => {});
    console.log(`[Database] SQLite dev.db initialized: ${devDbPath}`);
  } catch (err: any) {
    console.warn("[Database] Failed to initialize SQLite dev.db:", err?.message);
  }
}

// PostgreSQL primary pool
let pgPool: pg.Pool | null = null;
if (!isSqliteConfigured) {
  const connectionString =
    (rawUrl && !rawUrl.startsWith("file:") ? rawUrl : null) ||
    `postgresql://${env["PGUSER"] || "postgres"}:${encodeURIComponent(env["PGPASSWORD"] || "Vsvg@db1")}@${env["PGHOST"] || "localhost"}:${env["PGPORT"] || "5432"}/${env["PGDATABASE"] || "riderzpro"}`;
  
  pgPool = new pg.Pool({
    connectionString,
    max: 15,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });
  console.log(`[Database] Connected to PostgreSQL: ${connectionString.replace(/:[^:@]+@/, ":****@")}`);
}

// ----------------------------------------------------------------------------
// SQL Query Normalization & Translation (PostgreSQL)
// ----------------------------------------------------------------------------

export function translateToPostgres(text: string): string {
  return text
    // Replace SQLite datetime('now', '-X units') with PostgreSQL INTERVAL
    .replace(/datetime\('now',\s*'([+-]?)(\d+)\s*(minutes?|seconds?|hours?|days?)'\)/gi, (_m, sign, amount, unit) => {
      const s = sign === "-" ? "-" : "+";
      return `(CURRENT_TIMESTAMP ${s} INTERVAL '${amount} ${unit.toLowerCase()}')`;
    })
    // Replace SQLite datetime('now') with CURRENT_TIMESTAMP
    .replace(/datetime\('now'\)/gi, "CURRENT_TIMESTAMP")
    // Replace SQLite date('now', ...) and date('now')
    .replace(/date\('now',\s*'([+-]?)(\d+)\s*(days?|months?|years?)'\)/gi, (_m, sign, amount, unit) => {
      const s = sign === "-" ? "-" : "+";
      return `(CURRENT_DATE ${s} INTERVAL '${amount} ${unit.toLowerCase()}')`;
    })
    .replace(/date\('now'\)/gi, "CURRENT_DATE")
    // Replace boolean comparison integer syntax (is_active = 1 -> is_active = true)
    .replace(/\b(is_active|is_verified|is_read|is_bestseller|is_default)\s*=\s*1\b/gi, "$1 = true")
    .replace(/\b(is_active|is_verified|is_read|is_bestseller|is_default)\s*=\s*0\b/gi, "$1 = false")
    .replace(/\b(is_active|is_verified|is_read|is_bestseller|is_default)\s*!=\s*0\b/gi, "$1 = true")
    .replace(/\b(is_active|is_verified|is_read|is_bestseller|is_default)\s*!=\s*1\b/gi, "$1 = false");
}

// ----------------------------------------------------------------------------
// SQL Query Normalization & Translation (SQLite compatibility)
// ----------------------------------------------------------------------------

export function translateToSqlite(text: string, params: any[] = []): { sql: string; args: any[] } {
  let sql = text
    .replace(/(?:now\(\)|CURRENT_TIMESTAMP|CURRENT_DATE)\s*([+-])\s*interval\s+'(\d+)\s+(seconds?|minutes?|hours?|days?)'/gi,
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
  // 1. If SQLite is explicitly configured or PostgreSQL pool is unavailable
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

  // 2. Primary PostgreSQL execution
  const pgSql = translateToPostgres(text);
  return await pgPool.query<T>(pgSql, params);
}

// ----------------------------------------------------------------------------
// Compatible Pool Object
// ----------------------------------------------------------------------------

export const pool = {
  async query<T extends pg.QueryResultRow = any>(text: string, params?: any[]): Promise<pg.QueryResult<T>> {
    return query<T>(text, params);
  },
  async connect() {
    if (pgPool) {
      const client = await pgPool.connect();
      return {
        query: <T extends pg.QueryResultRow = any>(text: string, params?: any[]) => {
          const pgSql = translateToPostgres(text);
          return client.query<T>(pgSql, params);
        },
        release: () => client.release(),
      };
    }
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
      // Notifications
      await client.query(`
        CREATE TABLE IF NOT EXISTS notifications (
          id VARCHAR(64) PRIMARY KEY,
          user_id VARCHAR(64) NOT NULL,
          user_role VARCHAR(64) NOT NULL,
          type VARCHAR(64) NOT NULL,
          title VARCHAR(255) NOT NULL,
          message TEXT NOT NULL,
          entity_id VARCHAR(64),
          target_route VARCHAR(255),
          is_read BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          read_at TIMESTAMPTZ
        );
      `);
      // Coupons
      await client.query(`
        CREATE TABLE IF NOT EXISTS coupons (
          id VARCHAR(64) PRIMARY KEY,
          seller_id VARCHAR(64),
          code VARCHAR(64) NOT NULL UNIQUE,
          description TEXT,
          discount_type VARCHAR(32) NOT NULL,
          discount_value NUMERIC NOT NULL,
          min_order_value NUMERIC DEFAULT 0,
          max_discount_amount NUMERIC,
          usage_limit INTEGER,
          used_count INTEGER DEFAULT 0,
          is_active BOOLEAN DEFAULT TRUE,
          starts_at TIMESTAMPTZ,
          expires_at TIMESTAMPTZ,
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );
      `);
      // Coupon Products
      await client.query(`
        CREATE TABLE IF NOT EXISTS coupon_products (
          id VARCHAR(64) PRIMARY KEY,
          coupon_id VARCHAR(64) NOT NULL,
          product_id VARCHAR(64) NOT NULL,
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );
      `);
      // Vendor Change Requests
      await client.query(`
        CREATE TABLE IF NOT EXISTS vendor_change_requests (
          id VARCHAR(64) PRIMARY KEY,
          seller_id VARCHAR(64) NOT NULL,
          requested_by VARCHAR(64) NOT NULL,
          field_name VARCHAR(64) NOT NULL,
          field_label VARCHAR(128) NOT NULL,
          old_value TEXT,
          new_value TEXT NOT NULL,
          reason TEXT NOT NULL,
          supporting_doc_url TEXT,
          status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
          admin_notes TEXT,
          reviewed_by VARCHAR(64),
          reviewed_at TIMESTAMPTZ,
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );
      `);
      // Admin Invitations
      await client.query(`
        CREATE TABLE IF NOT EXISTS admin_invitations (
          id VARCHAR(64) PRIMARY KEY,
          email VARCHAR(255) NOT NULL UNIQUE,
          role VARCHAR(64) NOT NULL,
          invite_token VARCHAR(255) NOT NULL UNIQUE,
          invited_by VARCHAR(64) NOT NULL,
          permissions TEXT DEFAULT '["all"]',
          expires_at TIMESTAMPTZ NOT NULL,
          accepted_at TIMESTAMPTZ,
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );
      `);
      // Product Reviews
      await client.query(`
        CREATE TABLE IF NOT EXISTS product_reviews (
          id VARCHAR(64) PRIMARY KEY,
          product_id VARCHAR(64) NOT NULL,
          user_id VARCHAR(64),
          user_name VARCHAR(128) NOT NULL,
          user_city VARCHAR(128) DEFAULT 'Bengaluru',
          rating NUMERIC(2,1) NOT NULL CHECK (rating >= 1 AND rating <= 5),
          title VARCHAR(255) NOT NULL,
          comment TEXT NOT NULL,
          fitment_vehicle VARCHAR(128),
          is_verified_purchase BOOLEAN DEFAULT TRUE,
          helpful_count INTEGER DEFAULT 0,
          status VARCHAR(32) DEFAULT 'published',
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );
      `);
      // Product Offers (Multi-Vendor Marketplace)
      await client.query(`
        CREATE TABLE IF NOT EXISTS product_offers (
          id VARCHAR(64) PRIMARY KEY,
          product_id VARCHAR(64) NOT NULL,
          vendor_id VARCHAR(64) NOT NULL,
          price NUMERIC NOT NULL,
          mrp NUMERIC,
          stock INTEGER DEFAULT 0,
          status VARCHAR(32) DEFAULT 'active',
          warranty_terms VARCHAR(255),
          shipping_charge NUMERIC DEFAULT 0,
          delivery_days VARCHAR(64) DEFAULT '2-3 business days',
          dispatch_hours INTEGER DEFAULT 24,
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );
      `);
      // Ensure Sellers & Products have rating/gst columns
      await client.query(`
        ALTER TABLE sellers ADD COLUMN IF NOT EXISTS rating NUMERIC(3,2) DEFAULT 0.00;
        ALTER TABLE sellers ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;
        ALTER TABLE products ADD COLUMN IF NOT EXISTS gst_percent NUMERIC(4,2) DEFAULT 18.00;
        ALTER TABLE products ADD COLUMN IF NOT EXISTS rating NUMERIC(3,2) DEFAULT 0.00;
        ALTER TABLE products ADD COLUMN IF NOT EXISTS reviews_count INTEGER DEFAULT 0;
      `).catch(() => {});
      client.release();
      console.log("[Database] PostgreSQL schema verified and ready.");
    } catch (err: any) {
      console.error("[PostgreSQL] Error during schema initialization:", err?.message);
      throw err;
    }
  }
}
