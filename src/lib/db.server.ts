import { env } from "cloudflare:workers";
import { Pool } from "pg";

type DatabaseBindings = {
  DATABASE_URL?: string;
  HYPERDRIVE?: { connectionString: string };
};

let pool: Pool | undefined;

export function getDatabasePool() {
  const bindings = env as DatabaseBindings;
  const connectionString = bindings.HYPERDRIVE?.connectionString ?? bindings.DATABASE_URL ?? process.env["DATABASE_URL"];
  if (!connectionString) {
    throw new Error("PostgreSQL is not configured. Set DATABASE_URL locally or bind Cloudflare Hyperdrive as HYPERDRIVE.");
  }
  pool ??= new Pool({ connectionString, max: 5, idleTimeoutMillis: 10_000, connectionTimeoutMillis: 5_000 });
  return pool;
}
