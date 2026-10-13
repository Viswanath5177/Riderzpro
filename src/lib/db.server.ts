// Safe environment resolution for both Node.js and Worker environments
const env: DatabaseBindings = (globalThis as any)?.__env__ ?? (globalThis as any)?.env ?? {};
import type { Client, Transaction } from "@libsql/client";
import { Pool, type PoolClient } from "pg";

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

function sqliteSql(sql: string, values: unknown[] = []) {
  const normalized = sql
    .replace(/now\(\)\s*([+-])\s*interval\s+'(\d+)\s+(seconds?|minutes?|hours?|days?)'/gi,
      (_match, sign: string, amount: string, unit: string) => `datetime('now', '${sign}${amount} ${unit.toLowerCase()}')`)
    .replace(/now\(\)/gi, "CURRENT_TIMESTAMP")
    .replace(/::text/gi, "")
    .replace(/\s+for update\b/gi, "");
  const args: unknown[] = [];
  const portableSql = normalized.replace(/\$(\d+)/g, (_match, index: string) => {
    args.push(values[Number(index) - 1]);
    return "?";
  });
  return { sql: portableSql, args };
}

function libsqlQueryable(client: Client | Transaction): Queryable {
  return {
    async query<T>(sql: string, values: unknown[] = []) {
      const statement = sqliteSql(sql, values);
      const result = await client.execute({ sql: statement.sql, args: statement.args as never[] });
      return { rows: result.rows as unknown as T[], rowCount: result.rowsAffected };
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

function createPostgresDatabase(connectionString: string): Database {
  const pool = new Pool({ connectionString, max: 5, idleTimeoutMillis: 10_000, connectionTimeoutMillis: 5_000 });
  return {
    dialect: "postgres",
    async query<T>(sql: string, values: unknown[] = []) {
      const result = await pool.query(sql, values);
      return { rows: result.rows as T[], rowCount: result.rowCount ?? 0 };
    },
    async connect() {
      const client: PoolClient = await pool.connect();
      return {
        async query<T>(sql: string, values: unknown[] = []) {
          const result = await client.query(sql, values);
          return { rows: result.rows as T[], rowCount: result.rowCount ?? 0 };
        },
        release: () => client.release(),
      };
    },
  };
}

export function getDatabase(): Database {
  if (database) return database;
  const envUrl = process.env["DATABASE_URL"];
  const connectionString =
    (envUrl && !envUrl.startsWith("file:") ? envUrl : null) ||
    `postgresql://${process.env["PGUSER"] || "postgres"}:${encodeURIComponent(process.env["PGPASSWORD"] || "Vsvg@db1")}@${process.env["PGHOST"] || "localhost"}:${process.env["PGPORT"] || "5432"}/${process.env["PGDATABASE"] || "riderzpro"}`;

  database = createPostgresDatabase(connectionString);
  return database;
}
