// Safe environment resolution for both Node.js and Worker environments
import type { Client, Transaction } from "@libsql/client";
import { Pool, type PoolClient } from "pg";
import path from "node:path";
import fs from "node:fs";

type DatabaseBindings = {
  DATABASE_URL?: string;
  HYPERDRIVE?: { connectionString: string };
};

export type QueryResult<T> = { rows: T[]; rowCount: number };
export interface Queryable {
  query<T = Record<string, unknown>>(sql: string, values?: unknown[]): Promise<QueryResult<T>>;
}
export interface Database extends Queryable {
  connect(): Promise<Queryable & { release(): void; commit?(): Promise<void>; rollback?(): Promise<void> }>;
  dialect: "postgres" | "sqlite";
}

let database: Database | undefined;

function sqliteSql(sql: string, values: unknown[] = []): { sql: string; args: unknown[] } {
  let normalized = sql
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

  const args: unknown[] = [];

  // Handle = ANY($N)
  normalized = normalized.replace(/=\s*ANY\s*\(\s*\$(\d+)\s*\)/gi, (_m, idxStr) => {
    const rawVal = values[Number(idxStr) - 1];
    if (Array.isArray(rawVal) && rawVal.length > 0) {
      for (const item of rawVal) args.push(item);
      return `IN (${rawVal.map(() => "?").join(", ")})`;
    }
    args.push("__NO_MATCH__");
    return `IN (?)`;
  });

  // Handle remaining $N
  normalized = normalized.replace(/\$(\d+)/g, (_match, idxStr) => {
    let val = values[Number(idxStr) - 1];
    if (typeof val === "string" && val.startsWith('["') && val.endsWith('"]') && !val.includes(",")) {
      try {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed) && parsed.length === 1) val = parsed[0];
      } catch {}
    }
    args.push(val);
    return "?";
  });

  return { sql: normalized, args };
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

function libsqlQueryable(client: Client | Transaction): Queryable {
  return {
    async query<T>(sql: string, values: unknown[] = []) {
      const statement = sqliteSql(sql, values);
      const result = await client.execute({ sql: statement.sql, args: statement.args as never[] });
      const normalizedRows = (result.rows || []).map(normalizeRow);
      return { rows: normalizedRows as unknown as T[], rowCount: result.rowsAffected ?? normalizedRows.length };
    },
  };
}

function createSqliteDatabase(url: string): Database {
  let clientPromise: Promise<Client> | undefined;
  const getClient = () => clientPromise ??= import("@libsql/client").then(({ createClient }) => createClient({ url }));
  return {
    dialect: "sqlite",
    async query<T>(sql: string, values: unknown[] = []) {
      return libsqlQueryable(await getClient()).query<T>(sql, values);
    },
    async connect() {
      const transaction = await (await getClient()).transaction("write");
      const tx = libsqlQueryable(transaction);
      let active = true;
      return {
        dialect: "sqlite",
        query: tx.query,
        release() {
          if (active) void transaction.close();
          active = false;
        },
        async commit() {
          if (!active) return;
          try {
            await transaction.commit();
          } finally {
            await transaction.close();
            active = false;
          }
        },
        async rollback() {
          if (!active) return;
          try {
            await transaction.rollback();
          } finally {
            await transaction.close();
            active = false;
          }
        },
      };
    },
  };
}

function translateToPostgres(text: string): string {
  return text
    .replace(/datetime\('now',\s*'([+-]?)(\d+)\s*(minutes?|seconds?|hours?|days?)'\)/gi, (_m, sign, amount, unit) => {
      const s = sign === "-" ? "-" : "+";
      return `(CURRENT_TIMESTAMP ${s} INTERVAL '${amount} ${unit.toLowerCase()}')`;
    })
    .replace(/datetime\('now'\)/gi, "CURRENT_TIMESTAMP")
    .replace(/\b(is_active|is_verified|is_read|is_bestseller|is_default)\s*=\s*1\b/gi, "$1 = true")
    .replace(/\b(is_active|is_verified|is_read|is_bestseller|is_default)\s*=\s*0\b/gi, "$1 = false")
    .replace(/\b(is_active|is_verified|is_read|is_bestseller|is_default)\s*!=\s*0\b/gi, "$1 = true")
    .replace(/\b(is_active|is_verified|is_read|is_bestseller|is_default)\s*!=\s*1\b/gi, "$1 = false");
}

function createPostgresDatabase(connectionString: string): Database {
  const pool = new Pool({ connectionString, max: 15, idleTimeoutMillis: 10_000, connectionTimeoutMillis: 5_000 });
  return {
    dialect: "postgres",
    async query<T>(sql: string, values: unknown[] = []) {
      const result = await pool.query(translateToPostgres(sql), values);
      return { rows: result.rows as T[], rowCount: result.rowCount ?? 0 };
    },
    async connect() {
      const client: PoolClient = await pool.connect();
      return {
        async query<T>(sql: string, values: unknown[] = []) {
          const result = await client.query(translateToPostgres(sql), values);
          return { rows: result.rows as T[], rowCount: result.rowCount ?? 0 };
        },
        release: () => client.release(),
      };
    },
  };
}

export function getDatabase(): Database {
  if (database) return database;
  const envUrl = process.env["DATABASE_URL"] || "postgresql://postgres:Vsvg%40db1@localhost:5432/riderzpro";
  const devDbPath = envUrl.startsWith("file:")
    ? path.resolve(process.cwd(), envUrl.slice(5))
    : path.resolve(process.cwd(), "dev.db");

  const isSqlite = (envUrl.startsWith("file:") || process.env["USE_SQLITE"] === "true") && !envUrl.startsWith("postgres");

  if (isSqlite) {
    database = createSqliteDatabase(`file:${devDbPath}`);
    return database;
  }

  const connectionString =
    (envUrl && !envUrl.startsWith("file:") ? envUrl : null) ||
    `postgresql://${process.env["PGUSER"] || "postgres"}:${encodeURIComponent(process.env["PGPASSWORD"] || "Vsvg@db1")}@${process.env["PGHOST"] || "localhost"}:${process.env["PGPORT"] || "5432"}/${process.env["PGDATABASE"] || "riderzpro"}`;

  try {
    database = createPostgresDatabase(connectionString);
  } catch {
    database = createSqliteDatabase(`file:${devDbPath}`);
  }
  return database;
}
