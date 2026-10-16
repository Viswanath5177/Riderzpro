import { createClient } from '@libsql/client';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const dbPath = path.resolve(__dirname, '../dev.db');
  const client = createClient({ url: `file:${dbPath}` });

  const relevant = ['orders', 'order_items', 'sellers', 'products', 'customers', 'users', 'audit_logs', 'deliveries'];
  for (const t of relevant) {
    const res = await client.execute(`SELECT sql FROM sqlite_master WHERE name='${t}'`);
    console.log(`\n=== TABLE: ${t} ===`);
    console.log(res.rows[0]?.sql);
  }

  // Check if there are any records in orders
  const orders = await client.execute("SELECT * FROM orders LIMIT 5");
  console.log('\n=== SAMPLE ORDERS ===');
  console.log(orders.rows);

  // Check if there are any records in sellers
  const sellers = await client.execute("SELECT * FROM sellers LIMIT 5");
  console.log('\n=== SAMPLE SELLERS ===');
  console.log(sellers.rows);

  // Check if there are any records in products
  const prods = await client.execute("SELECT id, name, seller_id, price, verification_status, is_active FROM products LIMIT 5");
  console.log('\n=== SAMPLE PRODUCTS ===');
  console.log(prods.rows);
}

main().catch(console.error);
