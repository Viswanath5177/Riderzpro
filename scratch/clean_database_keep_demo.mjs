import { createClient } from "@libsql/client";

const client = createClient({ url: "file:dev.db" });

async function clean() {
  console.log("Cleaning database tables while preserving demo accounts...");

  // Tables to completely empty
  const emptyTables = [
    "products",
    "orders",
    "order_items",
    "deliveries",
    "support_tickets",
    "vendor_notifications",
    "notifications",
    "carts",
    "cart_items",
    "wishlists",
    "wishlist_items",
    "saved_items",
    "product_approval_history",
    "audit_logs",
    "email_delivery_logs",
    "email_verification_attempts",
    "auth_sessions",
    "service_bookings",
    "product_specifications",
    "product_vehicle_compatibility",
    "riderzpro_catalogue_import",
    "vendor_change_requests",
    "coupons",
    "coupon_products",
    "coupon_redemptions",
    "customer_garage",
    "customer_addresses",
    "customer_profiles",
    "admin_invitations",
    "seller_documents",
    "seller_bank_accounts"
  ];

  for (const tbl of emptyTables) {
    try {
      await client.execute(`DELETE FROM "${tbl}"`);
      console.log(`✓ Cleared table: ${tbl}`);
    } catch (e) {
      console.log(`- Note for table ${tbl}: ${e.message}`);
    }
  }

  // Ensure demo customer aakash exists in users & customers
  const demoEmails = [
    "admin@riderzpro.com",
    "admin.operations@riderzpro.com",
    "product.admin@riderzpro.com",
    "seller.admin@riderzpro.com",
    "support.admin@riderzpro.com",
    "vendor1@riderzpro.com",
    "vendor2@riderzpro.com",
    "customer1@riderzpro.com",
    "customer2@riderzpro.com",
    "customer3@riderzpro.com",
    "aakash@riderzpro.com"
  ];

  // Remove non-demo customers
  try {
    const placeholders = demoEmails.map(() => "?").join(",");
    await client.execute({
      sql: `DELETE FROM customers WHERE email NOT IN (${placeholders})`,
      args: demoEmails
    });
    console.log("✓ Cleaned customers table (kept demo customers)");
  } catch (e) {
    console.log("Error cleaning customers:", e.message);
  }

  // Remove non-demo users
  try {
    const placeholders = demoEmails.map(() => "?").join(",");
    await client.execute({
      sql: `DELETE FROM users WHERE email NOT IN (${placeholders}) AND email NOT LIKE '%@productadmin%' AND email NOT LIKE '%@selleradmin%'`,
      args: demoEmails
    });
    console.log("✓ Cleaned users table (kept demo accounts)");
  } catch (e) {
    console.log("Error cleaning users:", e.message);
  }

  // Check remaining counts
  console.log("\n=== POST-CLEANUP TABLE COUNTS ===");
  const allTables = await client.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';");
  for (const row of allTables.rows) {
    try {
      const res = await client.execute(`SELECT COUNT(*) as c FROM "${row.name}"`);
      console.log(`  ${row.name}: ${res.rows[0].c}`);
    } catch {}
  }
}

clean();
