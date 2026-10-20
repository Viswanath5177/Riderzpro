import pg from "pg";
import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";

dotenv.config();

const caPath = process.env.DB_SSL_CA || "./global-bundle.pem";
const resolvedCaPath = path.resolve(process.cwd(), caPath);

if (!fs.existsSync(resolvedCaPath)) {
  console.error(`[ERROR] CA bundle not found at: ${resolvedCaPath}`);
  process.exit(1);
}

const ca = fs.readFileSync(resolvedCaPath, "utf8");
const host = process.env.DB_HOST || "riderzpro-test.ctskmk8ym0xj.eu-north-1.rds.amazonaws.com";
const port = parseInt(process.env.DB_PORT || "5432", 10);
const user = process.env.DB_USER || "postgres";
const password = process.env.DB_PASSWORD || process.env.PGPASSWORD;

console.log("=================================================");
console.log("   AWS RDS POSTGRESQL CONNECTIVITY & TLS TEST");
console.log("=================================================");
console.log(`Endpoint: ${host}:${port}`);
console.log(`User:     ${user}`);
console.log(`TLS CA:   ${resolvedCaPath} (verified)`);

async function testConnection() {
  // 1. Connect to 'postgres' maintenance DB first to verify database existence
  const client = new pg.Client({
    host,
    port,
    database: "postgres",
    user,
    password,
    ssl: {
      rejectUnauthorized: true,
      ca,
      servername: host,
    },
    connectionTimeoutMillis: 10000,
  });

  try {
    await client.connect();
    console.log("\n[PASS] Successfully connected to AWS RDS with verified TLS (rejectUnauthorized: true)");

    const identityRes = await client.query(`
      SELECT
        current_database() AS database_name,
        current_user AS database_user,
        NOW() AS server_time,
        version() AS pg_version
    `);
    console.log("[PASS] Server Identity:", identityRes.rows[0]);

    const sslRes = await client.query(`
      SELECT ssl, version, cipher, bits 
      FROM pg_stat_ssl 
      WHERE pid = pg_backend_pid()
    `);
    console.log("[PASS] Encryption Status:", sslRes.rows[0]);

    // Check if 'riderzpro' database exists
    const dbRes = await client.query(
      "SELECT datname FROM pg_database WHERE datname = $1",
      ["riderzpro"]
    );

    const exists = dbRes.rows.length > 0;
    console.log(`[INFO] Database 'riderzpro' exists on RDS: ${exists}`);

    if (!exists) {
      console.log("[INFO] Creating database 'riderzpro' on AWS RDS...");
      await client.query("CREATE DATABASE riderzpro");
      console.log("[PASS] Database 'riderzpro' created successfully!");
    }

    await client.end();

    // 2. Now connect directly to 'riderzpro' database
    const appClient = new pg.Client({
      host,
      port,
      database: "riderzpro",
      user,
      password,
      ssl: {
        rejectUnauthorized: true,
        ca,
        servername: host,
      },
      connectionTimeoutMillis: 10000,
    });

    await appClient.connect();
    console.log("\n[PASS] Successfully connected directly to target database 'riderzpro'!");

    const tablesRes = await appClient.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    console.log(`[INFO] Tables in RDS riderzpro (${tablesRes.rows.length}):`, tablesRes.rows.map(r => r.table_name));

    await appClient.end();
    console.log("\n=================================================");
    console.log("   AWS RDS CONNECTIVITY VERIFIED SUCCESSFULLY");
    console.log("=================================================");
  } catch (err) {
    console.error("\n[FAIL] AWS RDS Connection Error:", err.message);
    if (client) await client.end().catch(() => {});
    process.exit(1);
  }
}

testConnection();
