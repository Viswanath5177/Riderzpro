import { createClient } from '@libsql/client';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const dbPath = path.resolve(__dirname, '../dev.db');
  const client = createClient({ url: `file:${dbPath}` });
  const tables = await client.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
  console.log('=== TABLES IN dev.db ===');
  for (const row of tables.rows) {
    try {
      const countRes = await client.execute(`SELECT COUNT(*) as c FROM "${row.name}"`);
      console.log(`${row.name}: ${countRes.rows[0].c}`);
    } catch (e) {
      console.log(`${row.name}: error (${e.message})`);
    }
  }
}

main().catch(console.error);
