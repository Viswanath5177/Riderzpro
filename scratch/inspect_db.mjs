import { createClient } from "@libsql/client";

const db = createClient({ url: "file:dev.db" });

async function check() {
  const tables = ['coupons', 'coupon_products', 'customer_addresses', 'carts', 'cart_items', 'products', 'sellers', 'customers', 'orders'];
  for (const t of tables) {
    try {
      const res = await db.execute(`PRAGMA table_info(${t})`);
      console.log(`=== ${t} ===`);
      res.rows.forEach(r => console.log(`  ${r.name}: ${r.type}`));
    } catch (e) {
      console.log(`Error on ${t}: ${e.message}`);
    }
  }
}

check();
