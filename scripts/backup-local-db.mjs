import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import dotenv from "dotenv";

dotenv.config();

const backupsDir = path.resolve(process.cwd(), "backups");
if (!fs.existsSync(backupsDir)) {
  fs.mkdirSync(backupsDir, { recursive: true });
}

const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const backupFile = path.resolve(backupsDir, `riderzpro_local_backup_${timestamp}.sql`);

console.log("=================================================");
console.log("      RIDERZPRO LOCAL DATABASE BACKUP");
console.log("=================================================");
console.log(`Target file: ${backupFile}`);

const pgDumpPath = "C:\\Program Files\\PostgreSQL\\18\\bin\\pg_dump.exe";

const env = {
  ...process.env,
  PGPASSWORD: process.env.PGPASSWORD || "Vsvg@db1",
  PGHOST: process.env.PGHOST || "localhost",
  PGPORT: process.env.PGPORT || "5432",
  PGUSER: process.env.PGUSER || "postgres",
  PGDATABASE: process.env.PGDATABASE || "riderzpro",
};

const res = spawnSync(
  pgDumpPath,
  [
    "-h",
    env.PGHOST,
    "-p",
    env.PGPORT,
    "-U",
    env.PGUSER,
    "-d",
    env.PGDATABASE,
    "--no-owner",
    "--no-privileges",
    "-f",
    backupFile,
  ],
  { env }
);

if (res.error) {
  console.error("[FAIL] Error running pg_dump:", res.error);
  process.exit(1);
}

if (res.status !== 0) {
  console.error("[FAIL] pg_dump failed with exit code:", res.status);
  console.error(res.stderr?.toString());
  process.exit(1);
}

const stats = fs.statSync(backupFile);
console.log(`[PASS] Local backup created successfully!`);
console.log(`Backup Size: ${stats.size} bytes`);
console.log(`Backup Path: ${backupFile}`);
console.log("=================================================");
