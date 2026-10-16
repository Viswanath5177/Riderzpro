import { createClient } from '@libsql/client';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const dbPath = path.resolve(__dirname, '../dev.db');
  const client = createClient({ url: `file:${dbPath}` });

  console.log('=== ADMINS ===');
  const admins = await client.execute("SELECT * FROM admins");
  console.log(admins.rows);

  console.log('=== USERS (roles and emails) ===');
  const users = await client.execute("SELECT id, email, role, phone, is_active FROM users");
  console.log(users.rows);

  console.log('=== SELLERS ===');
  const sellers = await client.execute("SELECT id, email, store_name, status, account_status, is_active FROM sellers");
  console.log(sellers.rows);

  console.log('=== ADMIN SCHEMA ===');
  const adminSchema = await client.execute("SELECT sql FROM sqlite_master WHERE name='admins'");
  console.log(adminSchema.rows[0]?.sql);

  console.log('=== USERS SCHEMA ===');
  const userSchema = await client.execute("SELECT sql FROM sqlite_master WHERE name='users'");
  console.log(userSchema.rows[0]?.sql);

  console.log('=== ORDERS SCHEMA ===');
  const ordersSchema = await client.execute("SELECT sql FROM sqlite_master WHERE name='orders'");
  console.log(ordersSchema.rows[0]?.sql);

  console.log('=== ORDER ITEMS SCHEMA ===');
  const orderItemsSchema = await client.execute("SELECT sql FROM sqlite_master WHERE name='order_items'");
  console.log(orderItemsSchema.rows[0]?.sql);
}

main().catch(console.error);
