import pg from "pg";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import dotenv from "dotenv";

dotenv.config();

const psqlPath = "C:\\Program Files\\PostgreSQL\\18\\bin\\psql.exe";

// Configuration
const host = process.env.DB_HOST || "riderzpro-test.ctskmk8ym0xj.eu-north-1.rds.amazonaws.com";
const port = parseInt(process.env.DB_PORT || "5432", 10);
const user = process.env.DB_USER || "postgres";
const password = process.env.DB_PASSWORD || process.env.PGPASSWORD;
const dbName = process.env.DB_NAME || "riderzpro";

const caPath = process.env.DB_SSL_CA || "./global-bundle.pem";
const resolvedCaPath = path.resolve(process.cwd(), caPath);

if (!fs.existsSync(resolvedCaPath)) {
  console.error(`[ERROR] CA bundle not found at: ${resolvedCaPath}`);
  process.exit(1);
}

if (!password) {
  console.error("[ERROR] DB_PASSWORD is empty. Please set DB_PASSWORD in .env before running migration.");
  process.exit(1);
}

const ca = fs.readFileSync(resolvedCaPath, "utf8");

// Local DB configuration
const localHost = process.env.PGHOST || "localhost";
const localPort = parseInt(process.env.PGPORT || "5432", 10);
const localUser = process.env.PGUSER || "postgres";
const localPassword = process.env.PGPASSWORD || "Vsvg@db1";
const localDb = process.env.PGDATABASE || "riderzpro";

console.log("=================================================");
console.log("      AWS RDS POSTGRESQL MIGRATION RUNNER");
console.log("=================================================");
console.log(`Source (Local): ${localUser}@${localHost}:${localPort}/${localDb}`);
console.log(`Target (RDS):   ${user}@${host}:${port}/${dbName}`);
console.log(`TLS CA Bundle:  ${resolvedCaPath} (verified)`);
console.log("=================================================");

async function getTableStats(client) {
  const tablesRes = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
    ORDER BY table_name;
  `);

  const stats = {};
  for (const row of tablesRes.rows) {
    const tableName = row.table_name;
    try {
      const countRes = await client.query(`SELECT COUNT(*) AS cnt FROM "${tableName}"`);
      stats[tableName] = parseInt(countRes.rows[0].cnt, 10);
    } catch (e) {
      stats[tableName] = -1;
    }
  }
  return stats;
}

async function run() {
  // 1. Check local DB connection and gather baseline
  const localClient = new pg.Client({
    host: localHost,
    port: localPort,
    user: localUser,
    password: localPassword,
    database: localDb,
    connectionTimeoutMillis: 5000,
  });

  try {
    await localClient.connect();
    console.log("\n[PASS] Connected to source local PostgreSQL database.");
  } catch (err) {
    console.error("[FAIL] Could not connect to local database:", err.message);
    process.exit(1);
  }

  const localStats = await getTableStats(localClient);
  const localTableCount = Object.keys(localStats).length;
  console.log(`[INFO] Source local database has ${localTableCount} tables.`);

  // 2. Check RDS connection and target DB
  const rdsClient = new pg.Client({
    host,
    port,
    user,
    password,
    database: "postgres", // Connect to maintenance DB first
    ssl: {
      rejectUnauthorized: true,
      ca,
      servername: host,
    },
    connectionTimeoutMillis: 10000,
  });

  try {
    await rdsClient.connect();
    console.log("[PASS] Connected to RDS maintenance database with verified TLS.");
  } catch (err) {
    console.error("[FAIL] Could not connect to RDS:", err.message);
    await localClient.end();
    process.exit(1);
  }

  // Ensure target DB exists
  const checkDb = await rdsClient.query("SELECT 1 FROM pg_database WHERE datname = $1", [dbName]);
  if (checkDb.rows.length === 0) {
    console.log(`[INFO] Database '${dbName}' does not exist on RDS. Creating it...`);
    await rdsClient.query(`CREATE DATABASE "${dbName}"`);
    console.log(`[PASS] Database '${dbName}' created.`);
  } else {
    console.log(`[INFO] Database '${dbName}' already exists on RDS.`);
  }
  await rdsClient.end();

  // Connect directly to target DB
  const targetClient = new pg.Client({
    host,
    port,
    user,
    password,
    database: dbName,
    ssl: {
      rejectUnauthorized: true,
      ca,
      servername: host,
    },
    connectionTimeoutMillis: 10000,
  });

  await targetClient.connect();
  console.log(`[PASS] Connected directly to RDS target database '${dbName}'.`);

  const initialTargetStats = await getTableStats(targetClient);
  const initialTargetTableCount = Object.keys(initialTargetStats).length;
  console.log(`[INFO] Target RDS database currently has ${initialTargetTableCount} tables.`);

  // Find latest backup file
  const backupsDir = path.resolve(process.cwd(), "backups");
  if (!fs.existsSync(backupsDir)) {
    console.error("[FAIL] Backups directory not found!");
    process.exit(1);
  }

  const backupFiles = fs.readdirSync(backupsDir)
    .filter(f => f.endsWith(".sql"))
    .map(f => path.join(backupsDir, f))
    .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);

  if (backupFiles.length === 0) {
    console.error("[FAIL] No backup files found in backups/ directory!");
    process.exit(1);
  }

  const latestBackup = backupFiles[0];
  console.log(`[INFO] Using latest local backup for restore: ${latestBackup}`);

  // Restore via psql
  console.log("\n[INFO] Starting safe restore to AWS RDS...");
  const psqlEnv = {
    ...process.env,
    PGHOST: host,
    PGPORT: String(port),
    PGUSER: user,
    PGPASSWORD: password,
    PGDATABASE: dbName,
    PGSSLMODE: "verify-full",
    PGSSLROOTCERT: resolvedCaPath,
  };

  const psqlRes = spawnSync(
    psqlPath,
    ["-v", "ON_ERROR_STOP=0", "-f", latestBackup],
    { env: psqlEnv, stdio: ["pipe", "pipe", "pipe"] }
  );

  console.log(`[INFO] psql finished with exit code: ${psqlRes.status}`);
  if (psqlRes.status !== 0) {
    console.warn("[WARN] psql stderr output during restore (non-fatal errors may include IF EXISTS notices):");
    const errText = psqlRes.stderr?.toString() || "";
    const lines = errText.split("\n").filter(l => l.includes("ERROR") || l.includes("FATAL"));
    console.warn(lines.slice(0, 10).join("\n"));
  }

  // 3. Post-migration validation: Compare table row counts
  console.log("\n=================================================");
  console.log("       POST-MIGRATION VALIDATION REPORT");
  console.log("=================================================");
  const postTargetStats = await getTableStats(targetClient);

  let allMatched = true;
  const comparison = [];

  for (const table of Object.keys(localStats).sort()) {
    const localCount = localStats[table] ?? 0;
    const rdsCount = postTargetStats[table] ?? 0;
    const match = localCount === rdsCount;
    if (!match) allMatched = false;
    comparison.push({
      table,
      localRows: localCount,
      rdsRows: rdsCount,
      status: match ? "MATCH" : "MISMATCH",
    });
  }

  console.table(comparison);

  if (allMatched) {
    console.log("\n[SUCCESS] All tables and row counts match 100% between Local and AWS RDS!");
  } else {
    console.warn("\n[WARNING] Some tables have row count differences. Review table above.");
  }

  await localClient.end();
  await targetClient.end();
  console.log("=================================================");
}

run().catch((err) => {
  console.error("[FATAL] Migration error:", err.message);
  process.exit(1);
});
