import { createClient } from "@libsql/client";
import fs from "node:fs";

const db = createClient({ url: "file:dev.db" });

async function run() {
  console.log("=== STEP 1: SAFETY CHECKS & VERIFICATION ===");
  if (!fs.existsSync("dev.db.bak")) {
    throw new Error("Backup file dev.db.bak not found! Aborting for safety.");
  }
  console.log("Verified backup dev.db.bak exists.");

  // Count preserved records before cleanup
  const customersBefore = (await db.execute("SELECT count(*) as count FROM customers")).rows[0].count;
  const sellersBefore = (await db.execute("SELECT count(*) as count FROM sellers")).rows[0].count;
  const adminsBefore = (await db.execute("SELECT count(*) as count FROM admins")).rows[0].count;
  const usersBefore = (await db.execute("SELECT count(*) as count FROM users")).rows[0].count;
  const productsBefore = (await db.execute("SELECT count(*) as count FROM products")).rows[0].count;

  console.log(`Current state before cleanup:
  - Products: ${productsBefore}
  - Customers: ${customersBefore}
  - Sellers/Vendors: ${sellersBefore}
  - Admins: ${adminsBefore}
  - Users: ${usersBefore}`);

  console.log("\n=== STEP 2: CREATING/UPDATING COUPON & SHOPPING TABLES ===");
  // Create coupons table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS coupons (
      id TEXT PRIMARY KEY,
      vendor_id TEXT NOT NULL,
      code TEXT NOT NULL UNIQUE,
      description TEXT,
      discount_type TEXT NOT NULL DEFAULT 'percentage',
      discount_value REAL NOT NULL,
      minimum_order_value REAL DEFAULT 0,
      maximum_discount REAL,
      starts_at TEXT,
      expires_at TEXT,
      usage_limit INTEGER,
      per_customer_limit INTEGER,
      status TEXT NOT NULL DEFAULT 'active',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log("Table 'coupons' verified/created.");

  // Create coupon_products table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS coupon_products (
      coupon_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      PRIMARY KEY (coupon_id, product_id)
    )
  `);
  console.log("Table 'coupon_products' verified/created.");

  // Create coupon_redemptions table for tracking per-customer / total usage
  await db.execute(`
    CREATE TABLE IF NOT EXISTS coupon_redemptions (
      id TEXT PRIMARY KEY,
      coupon_id TEXT NOT NULL,
      customer_id TEXT NOT NULL,
      order_id TEXT,
      discount_amount REAL NOT NULL,
      redeemed_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log("Table 'coupon_redemptions' verified/created.");

  console.log("\n=== STEP 3: CLEANING TEST PRODUCTS & DEPENDENT RECORDS ===");
  await db.execute("DELETE FROM cart_items");
  console.log("Cleared cart_items.");

  await db.execute("DELETE FROM wishlist_items");
  console.log("Cleared wishlist_items.");

  await db.execute("DELETE FROM saved_items");
  console.log("Cleared saved_items.");

  await db.execute("DELETE FROM coupon_products");
  console.log("Cleared coupon_products.");

  await db.execute("DELETE FROM product_approval_history");
  console.log("Cleared product_approval_history.");

  await db.execute("DELETE FROM product_specifications");
  console.log("Cleared product_specifications.");

  await db.execute("DELETE FROM product_vehicle_compatibility");
  console.log("Cleared product_vehicle_compatibility.");

  // Delete all test products
  await db.execute("DELETE FROM products");
  console.log("Cleared test products from products table.");

  // Ensure carts and wishlists have unique non-null IDs
  const carts = (await db.execute("SELECT customer_id FROM carts WHERE id IS NULL")).rows;
  for (const c of carts) {
    const newId = "crt_" + Math.random().toString(36).substring(2, 10);
    await db.execute({
      sql: "UPDATE carts SET id = ? WHERE customer_id = ? AND id IS NULL",
      args: [newId, c.customer_id],
    });
  }

  const wishlists = (await db.execute("SELECT customer_id FROM wishlists WHERE id IS NULL")).rows;
  for (const w of wishlists) {
    const newId = "wsh_" + Math.random().toString(36).substring(2, 10);
    await db.execute({
      sql: "UPDATE wishlists SET id = ? WHERE customer_id = ? AND id IS NULL",
      args: [newId, w.customer_id],
    });
  }

  console.log("\n=== STEP 4: POST-CLEANUP VERIFICATION ===");
  const productsAfter = (await db.execute("SELECT count(*) as count FROM products")).rows[0].count;
  const customersAfter = (await db.execute("SELECT count(*) as count FROM customers")).rows[0].count;
  const sellersAfter = (await db.execute("SELECT count(*) as count FROM sellers")).rows[0].count;
  const adminsAfter = (await db.execute("SELECT count(*) as count FROM admins")).rows[0].count;
  const usersAfter = (await db.execute("SELECT count(*) as count FROM users")).rows[0].count;

  console.log(`Current state after cleanup:
  - Products: ${productsAfter} (EXPECTED 0)
  - Customers: ${customersAfter} (PRESERVED: ${customersAfter === customersBefore})
  - Sellers/Vendors: ${sellersAfter} (PRESERVED: ${sellersAfter === sellersBefore})
  - Admins: ${adminsAfter} (PRESERVED: ${adminsAfter === adminsBefore})
  - Users: ${usersAfter} (PRESERVED: ${usersAfter === usersBefore})`);

  if (productsAfter !== 0) {
    throw new Error(`Expected 0 products after cleanup, got ${productsAfter}`);
  }

  console.log("\n=== CLEANUP AND MIGRATION COMPLETED SUCCESSFULLY! ===");
}

run().catch((err) => {
  console.error("Cleanup error:", err);
  process.exit(1);
});
