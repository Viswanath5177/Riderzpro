import pg from "pg";
import { createClient } from "@libsql/client";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "node:path";
import fs from "node:fs";

dotenv.config();

const pgUrl = process.env.DATABASE_URL || "postgresql://postgres:Vsvg%40db1@localhost:5432/riderzpro";

console.log("=================================================");
console.log("   RIDERZPRO DATABASE PURGE & DEFAULT SEED RESET  ");
console.log("=================================================");

async function resetPostgres() {
  console.log("\n[1/2] Connecting to PostgreSQL...");
  const client = new pg.Client({ connectionString: pgUrl });
  await client.connect();
  console.log("✓ Connected to PostgreSQL.");

  // 1. Truncate all non-credential data tables with CASCADE
  const tablesToTruncate = [
    "order_items",
    "orders",
    "deliveries",
    "cart_items",
    "carts",
    "wishlist_items",
    "wishlists",
    "saved_items",
    "product_reviews",
    "product_approval_history",
    "product_offers",
    "product_specifications",
    "product_vehicle_compatibility",
    "riderzpro_catalogue_import",
    "products",
    "service_bookings",
    "support_tickets",
    "customer_garage",
    "customer_addresses",
    "customer_profiles",
    "notifications",
    "vendor_notifications",
    "vendor_change_requests",
    "audit_logs",
    "auth_sessions",
    "admin_invitations",
    "email_delivery_logs",
    "email_verification_attempts",
    "coupon_products",
    "coupons",
  ];

  for (const table of tablesToTruncate) {
    try {
      await client.query(`TRUNCATE TABLE ${table} CASCADE`);
      console.log(`  ✓ Cleared table: ${table}`);
    } catch (err) {
      // Table might not exist or already empty
      try {
        await client.query(`DELETE FROM ${table}`);
        console.log(`  ✓ Deleted rows from: ${table}`);
      } catch (e) {
        console.warn(`  ! Note on ${table}: ${e.message}`);
      }
    }
  }

  // 2. Clear seller documents and bank accounts
  try {
    await client.query("DELETE FROM seller_documents");
    await client.query("DELETE FROM seller_bank_accounts");
    console.log("  ✓ Cleared legacy seller documents and bank accounts.");
  } catch (e) {
    console.warn("  ! Note on seller docs/banks:", e.message);
  }

  // 3. Reset User and Account Tables strictly to the 7 Default Credentials
  const passwordHash = await bcrypt.hash("riderzpro@123", 10);

  // Clear all users except the 7 defaults
  const testEmails = [
    "admin@riderzpro.com",
    "admin.operations@riderzpro.com",
    "vendor1@riderzpro.com",
    "vendor2@riderzpro.com",
    "customer1@riderzpro.com",
    "customer2@riderzpro.com",
    "customer3@riderzpro.com",
  ];

  await client.query("DELETE FROM admins WHERE email NOT IN ($1, $2)", [
    "admin@riderzpro.com",
    "admin.operations@riderzpro.com",
  ]);
  await client.query("DELETE FROM sellers WHERE email NOT IN ($1, $2)", [
    "vendor1@riderzpro.com",
    "vendor2@riderzpro.com",
  ]);
  await client.query("DELETE FROM customers WHERE email NOT IN ($1, $2, $3)", [
    "customer1@riderzpro.com",
    "customer2@riderzpro.com",
    "customer3@riderzpro.com",
  ]);
  await client.query(
    `DELETE FROM users WHERE email NOT IN (${testEmails.map((_, i) => `$${i + 1}`).join(", ")})`,
    testEmails
  );
  console.log("  ✓ Removed all non-default users, admins, sellers, and customers.");

  // Upsert the 2 Admins
  await client.query(
    `INSERT INTO admins (id, email, password_hash, full_name, role, is_active)
     VALUES ('adm_super_01', 'admin@riderzpro.com', $1, 'Super Administrator', 'SUPER_ADMIN', true)
     ON CONFLICT (email) DO UPDATE SET password_hash = $1, full_name = 'Super Administrator', role = 'SUPER_ADMIN', is_active = true`,
    [passwordHash]
  );
  await client.query(
    `INSERT INTO admins (id, email, password_hash, full_name, role, is_active)
     VALUES ('adm_unified_01', 'admin.operations@riderzpro.com', $1, 'Unified Operations Administrator', 'ADMIN', true)
     ON CONFLICT (email) DO UPDATE SET password_hash = $1, full_name = 'Unified Operations Administrator', role = 'ADMIN', is_active = true`,
    [passwordHash]
  );
  console.log("  ✓ Upserted 2 Admins with active status.");

  // Upsert the 2 Vendors
  await client.query(
    `INSERT INTO sellers (id, email, password_hash, owner_name, store_name, status, account_status, is_active, phone, business_address, city, state, pincode)
     VALUES ('sel_volthub_01', 'vendor1@riderzpro.com', $1, 'Rajesh Kumar', 'Bengaluru EV Spares Hub', 'APPROVED', 'ACTIVE', true, '+91 98765 43210', 'Plot 12, Peenya Industrial Area, Phase 1', 'Bengaluru', 'Karnataka', '560058')
     ON CONFLICT (email) DO UPDATE SET password_hash = $1, store_name = 'Bengaluru EV Spares Hub', status = 'APPROVED', account_status = 'ACTIVE', is_active = true`,
    [passwordHash]
  );
  await client.query(
    `INSERT INTO sellers (id, email, password_hash, owner_name, store_name, status, account_status, is_active, phone, business_address, city, state, pincode)
     VALUES ('sel_apex_02', 'vendor2@riderzpro.com', $1, 'Ananya Rao', 'Apex Power Solutions', 'APPROVED', 'ACTIVE', true, '+91 98765 43211', 'Plot 45, HITEC City Main Rd', 'Hyderabad', 'Telangana', '500081')
     ON CONFLICT (email) DO UPDATE SET password_hash = $1, store_name = 'Apex Power Solutions', status = 'APPROVED', account_status = 'ACTIVE', is_active = true`,
    [passwordHash]
  );
  console.log("  ✓ Upserted 2 Vendors with APPROVED status.");

  // Insert verified bank account and document for the 2 sellers
  await client.query(`
    INSERT INTO seller_bank_accounts (id, seller_id, account_holder_name, bank_name, account_number, ifsc_code, is_verified)
    VALUES 
      ('bnk_sel_volthub_01', 'sel_volthub_01', 'Bengaluru EV Spares Hub Ltd', 'HDFC Bank', '50200012345678', 'HDFC0000128', true),
      ('bnk_sel_apex_02', 'sel_apex_02', 'Apex Power Solutions Pvt Ltd', 'ICICI Bank', '000405001234', 'ICIC0000004', true)
    ON CONFLICT (id) DO NOTHING
  `);
  await client.query(`
    INSERT INTO seller_documents (id, seller_id, doc_type, doc_number, file_path, is_verified)
    VALUES 
      ('doc_sel_volthub_01', 'sel_volthub_01', 'GSTIN', '29AABCR1234F1Z5', '/docs/volthub_gstin.pdf', true),
      ('doc_sel_apex_02', 'sel_apex_02', 'GSTIN', '36AABCA9876E1ZM', '/docs/apex_gstin.pdf', true)
    ON CONFLICT (id) DO NOTHING
  `);
  console.log("  ✓ Created verified bank and KYC documents for 2 Vendors.");

  // Upsert the 3 Customers
  await client.query(
    `INSERT INTO customers (id, email, password_hash, full_name, phone, is_active)
     VALUES ('cst_aarav_01', 'customer1@riderzpro.com', $1, 'Aarav Sharma', '+91 98765 43210', true)
     ON CONFLICT (email) DO UPDATE SET password_hash = $1, full_name = 'Aarav Sharma', is_active = true`,
    [passwordHash]
  );
  await client.query(
    `INSERT INTO customers (id, email, password_hash, full_name, phone, is_active)
     VALUES ('cst_priya_02', 'customer2@riderzpro.com', $1, 'Priya Patel', '+91 98123 45678', true)
     ON CONFLICT (email) DO UPDATE SET password_hash = $1, full_name = 'Priya Patel', is_active = true`,
    [passwordHash]
  );
  await client.query(
    `INSERT INTO customers (id, email, password_hash, full_name, phone, is_active)
     VALUES ('cst_vikram_03', 'customer3@riderzpro.com', $1, 'Rohit Verma', '+91 98989 89898', true)
     ON CONFLICT (email) DO UPDATE SET password_hash = $1, full_name = 'Rohit Verma', is_active = true`,
    [passwordHash]
  );
  console.log("  ✓ Upserted 3 Customers with active status.");

  // Sync users table for auth compatibility
  const usersToInsert = [
    ['usr_adm_super_01', 'admin@riderzpro.com', passwordHash, 'Super Administrator', 'SUPER_ADMIN'],
    ['usr_adm_unified_01', 'admin.operations@riderzpro.com', passwordHash, 'Unified Operations Administrator', 'ADMIN'],
    ['usr_sel_volthub_01', 'vendor1@riderzpro.com', passwordHash, 'Rajesh Kumar', 'seller'],
    ['usr_sel_apex_02', 'vendor2@riderzpro.com', passwordHash, 'Ananya Rao', 'seller'],
    ['usr_cst_aarav_01', 'customer1@riderzpro.com', passwordHash, 'Aarav Sharma', 'customer'],
    ['usr_cst_priya_02', 'customer2@riderzpro.com', passwordHash, 'Priya Patel', 'customer'],
    ['usr_cst_vikram_03', 'customer3@riderzpro.com', passwordHash, 'Rohit Verma', 'customer'],
  ];

  for (const u of usersToInsert) {
    await client.query(
      `INSERT INTO users (id, email, password_hash, full_name, role, is_active)
       VALUES ($1, $2, $3, $4, $5, true)
       ON CONFLICT (email) DO UPDATE SET password_hash = $3, full_name = $4, role = $5, is_active = true`,
      u
    );
  }
  console.log("  ✓ Synced 7 accounts into users table.");

  await client.end();
  console.log("✓ PostgreSQL Database Purge and Reset complete.");
}

async function resetSqlite() {
  const dbPath = path.resolve(process.cwd(), "dev.db");
  if (!fs.existsSync(dbPath)) return;

  console.log("\n[2/2] Resetting SQLite dev.db fallback...");
  const client = createClient({ url: `file:${dbPath}` });

  const tablesToClear = [
    "order_items", "orders", "deliveries", "cart_items", "carts",
    "wishlist_items", "wishlists", "saved_items", "product_reviews",
    "product_approval_history", "product_offers", "product_specifications",
    "product_vehicle_compatibility", "riderzpro_catalogue_import", "products",
    "service_bookings", "support_tickets", "customer_garage", "customer_addresses",
    "customer_profiles", "notifications", "vendor_notifications", "vendor_change_requests",
    "audit_logs", "auth_sessions", "admin_invitations", "email_delivery_logs",
    "email_verification_attempts", "coupon_products", "coupons"
  ];

  for (const t of tablesToClear) {
    try {
      await client.execute(`DELETE FROM ${t}`);
    } catch {}
  }

  const passwordHash = await bcrypt.hash("riderzpro@123", 10);
  try {
    await client.execute({
      sql: "DELETE FROM admins WHERE email NOT IN ('admin@riderzpro.com', 'admin.operations@riderzpro.com')",
      args: []
    });
    await client.execute({
      sql: "DELETE FROM sellers WHERE email NOT IN ('vendor1@riderzpro.com', 'vendor2@riderzpro.com')",
      args: []
    });
    await client.execute({
      sql: "DELETE FROM customers WHERE email NOT IN ('customer1@riderzpro.com', 'customer2@riderzpro.com', 'customer3@riderzpro.com')",
      args: []
    });
    await client.execute({
      sql: "DELETE FROM users WHERE email NOT IN ('admin@riderzpro.com', 'admin.operations@riderzpro.com', 'vendor1@riderzpro.com', 'vendor2@riderzpro.com', 'customer1@riderzpro.com', 'customer2@riderzpro.com', 'customer3@riderzpro.com')",
      args: []
    });

    // Update passwords
    await client.execute({ sql: "UPDATE admins SET password_hash = ?, is_active = 1", args: [passwordHash] });
    await client.execute({ sql: "UPDATE sellers SET password_hash = ?, is_active = 1, status = 'APPROVED'", args: [passwordHash] });
    await client.execute({ sql: "UPDATE customers SET password_hash = ?, is_active = 1", args: [passwordHash] });
    await client.execute({ sql: "UPDATE users SET password_hash = ?, is_active = 1", args: [passwordHash] });
    console.log("  ✓ dev.db tables purged and 7 accounts synchronized.");
  } catch (err) {
    console.warn("  ! Note on SQLite reset:", err.message);
  }
}

async function run() {
  await resetPostgres();
  await resetSqlite();
  console.log("\n=================================================");
  console.log("   DATABASE PURGE COMPLETED SUCCESSFULLY         ");
  console.log("=================================================");
  process.exit(0);
}

run().catch((err) => {
  console.error("Fatal reset error:", err);
  process.exit(1);
});
