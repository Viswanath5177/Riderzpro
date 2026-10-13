import { readFile } from "node:fs/promises";
import { createClient } from "@libsql/client";

const url = process.env.DATABASE_URL ?? "file:./database/riderzpro-dev.db";
if (!url.startsWith("file:")) {
  throw new Error("The local migration requires DATABASE_URL to be a SQLite file URL (file:...)");
}

const client = createClient({ url });
try {
  const sql = await readFile(new URL("../database/migrations/sqlite/001_auth.sql", import.meta.url), "utf8");
  await client.executeMultiple(sql);
  console.log("Applied local SQLite auth migration.");
} finally {
  client.close();
}
