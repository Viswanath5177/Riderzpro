import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const env = process.env;

const candidates = [
  env.DATABASE_URL_PG,
  `postgresql://${env.PGUSER || "postgres"}:${encodeURIComponent(env.PGPASSWORD || "Vsvg@db1")}@${env.PGHOST || "localhost"}:${env.PGPORT || "5432"}/${env.PGDATABASE || "riderzpro"}`,
  `postgresql://postgres:${encodeURIComponent("Vsvg@db1")}@localhost:5432/postgres`,
  `postgresql://postgres:postgres@localhost:5432/riderzpro`,
  `postgresql://postgres:admin@localhost:5432/riderzpro`,
  `postgresql://postgres:root@localhost:5432/riderzpro`,
];

async function testCandidate(connStr) {
  if (!connStr) return null;
  const pool = new pg.Pool({ connectionString: connStr, connectionTimeoutMillis: 3000 });
  try {
    const res = await pool.query("SELECT current_user, current_database(), version()");
    console.log("✓ Connected successfully with:", connStr.replace(/:[^:@]+@/, ":****@"));
    console.log("  Info:", res.rows[0]);
    await pool.end();
    return connStr;
  } catch (e) {
    console.log("✗ Failed with", connStr.replace(/:[^:@]+@/, ":****@"), "->", e.message);
    await pool.end();
    return null;
  }
}

async function run() {
  console.log("Testing PostgreSQL connection candidates...");
  for (const c of candidates) {
    const success = await testCandidate(c);
    if (success) {
      console.log("\nFound working PostgreSQL connection:", success.replace(/:[^:@]+@/, ":****@"));
      return;
    }
  }
  console.log("\nCould not connect to any PostgreSQL instance.");
}

run();
