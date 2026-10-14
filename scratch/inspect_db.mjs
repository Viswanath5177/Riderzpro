import { createClient } from "@libsql/client";

const db = createClient({ url: "file:dev.db" });

async function inspect() {
  const tables = await db.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
  console.log("=== TABLES IN dev.db ===");
  console.log(tables.rows.map(t => t.name));

  for (const table of ["products", "product_images", "inventory", "sellers", "customers", "carts", "cart_items", "wishlists", "wishlist_items", "coupons", "coupon_products", "orders", "order_items"]) {
    try {
      const info = await db.execute(`PRAGMA table_info(${table})`);
      if (info.rows.length > 0) {
        console.log(`\n--- ${table} Columns ---`);
        console.log(info.rows.map(c => `${c.name} (${c.type})`).join(", "));
        const count = await db.execute(`SELECT count(*) as count FROM ${table}`);
        console.log(`Count: ${count.rows[0].count}`);
      } else {
        console.log(`\n--- ${table} DOES NOT EXIST ---`);
      }
    } catch (e) {
      console.log(`Error checking ${table}:`, e.message);
    }
  }
}

inspect().catch(console.error);
