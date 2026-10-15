import bcrypt from "bcryptjs";
import { query } from "../src/server/db.ts";

async function setup() {
  console.log("=== Setting up Exactly 7 Required Mock Accounts ===");

  const adminPassHash = await bcrypt.hash("Admin@123", 10);
  const vendorPassHash = await bcrypt.hash("Vendor@Riderzpro2026", 10);
  const customerPassHash = await bcrypt.hash("Customer@Riderzpro2026", 10);

  // 1. Super Admin: admin@riderzpro.com
  await query("DELETE FROM admins WHERE email = 'admin@riderzpro.com'");
  await query(
    `INSERT INTO admins (id, email, password_hash, full_name, role, is_active)
     VALUES ('adm_super_01', 'admin@riderzpro.com', $1, 'Super Administrator', 'SUPER_ADMIN', 1)`,
    [adminPassHash]
  );
  console.log("✓ Super Admin (admin@riderzpro.com) ready.");

  // 2. Unified Admin: admin.operations@riderzpro.com
  await query("DELETE FROM admins WHERE email = 'admin.operations@riderzpro.com'");
  await query(
    `INSERT INTO admins (id, email, password_hash, full_name, role, is_active)
     VALUES ('adm_unified_01', 'admin.operations@riderzpro.com', $1, 'Unified Operations Administrator', 'ADMIN', 1)`,
    [adminPassHash]
  );
  console.log("✓ Unified Admin (admin.operations@riderzpro.com) ready.");

  // Deactivate any other admin accounts
  await query(
    `UPDATE admins SET is_active = 0 
     WHERE email NOT IN ('admin@riderzpro.com', 'admin.operations@riderzpro.com')`
  );
  console.log("✓ Deactivated legacy admin accounts in admins table.");

  // 3. Vendor 1: vendor1@riderzpro.com (VoltHub EV Components)
  await query(
    `INSERT INTO sellers (id, email, password_hash, owner_name, store_name, status, account_status, is_active, phone, business_address, city, state, pincode)
     VALUES ('sel_volthub_01', 'vendor1@riderzpro.com', $1, 'Rajesh Kumar', 'VoltHub EV Components', 'APPROVED', 'ACTIVE', 1, '+91 98765 43210', 'Plot 12, Peenya Industrial Area, Phase 1', 'Bengaluru', 'Karnataka', '560058')
     ON CONFLICT(email) DO UPDATE SET password_hash = $1, status = 'APPROVED', account_status = 'ACTIVE', is_active = 1`,
    [vendorPassHash]
  );
  console.log("✓ Vendor 1 (vendor1@riderzpro.com) ready.");

  // 4. Vendor 2: vendor2@riderzpro.com (Apex EV Spares & Batteries)
  await query(
    `INSERT INTO sellers (id, email, password_hash, owner_name, store_name, status, account_status, is_active, phone, business_address, city, state, pincode)
     VALUES ('sel_apex_02', 'vendor2@riderzpro.com', $1, 'Ananya Rao', 'Apex EV Spares & Batteries', 'APPROVED', 'ACTIVE', 1, '+91 98765 43211', 'Plot 45, HITEC City Main Rd', 'Hyderabad', 'Telangana', '500081')
     ON CONFLICT(email) DO UPDATE SET password_hash = $1, status = 'APPROVED', account_status = 'ACTIVE', is_active = 1`,
    [vendorPassHash]
  );
  console.log("✓ Vendor 2 (vendor2@riderzpro.com) ready.");

  // Deactivate any other vendor accounts if present
  await query(
    `UPDATE sellers SET is_active = 0 
     WHERE email NOT IN ('vendor1@riderzpro.com', 'vendor2@riderzpro.com')`
  );

  // 5. Customer 1: customer1@riderzpro.com (Aarav Sharma)
  await query(
    `INSERT INTO customers (id, email, password_hash, full_name, phone, is_active)
     VALUES ('cst_aarav_01', 'customer1@riderzpro.com', $1, 'Aarav Sharma', '9876543210', 1)
     ON CONFLICT(email) DO UPDATE SET password_hash = $1, is_active = 1`,
    [customerPassHash]
  );
  console.log("✓ Customer 1 (customer1@riderzpro.com) ready.");

  // 6. Customer 2: customer2@riderzpro.com (Priya Patel)
  await query(
    `INSERT INTO customers (id, email, password_hash, full_name, phone, is_active)
     VALUES ('cst_priya_02', 'customer2@riderzpro.com', $1, 'Priya Patel', '9876543211', 1)
     ON CONFLICT(email) DO UPDATE SET password_hash = $1, is_active = 1`,
    [customerPassHash]
  );
  console.log("✓ Customer 2 (customer2@riderzpro.com) ready.");

  // 7. Customer 3: customer3@riderzpro.com (Vikram Malhotra)
  await query(
    `INSERT INTO customers (id, email, password_hash, full_name, phone, is_active)
     VALUES ('cst_vikram_03', 'customer3@riderzpro.com', $1, 'Vikram Malhotra', '9876543212', 1)
     ON CONFLICT(email) DO UPDATE SET password_hash = $1, is_active = 1`,
    [customerPassHash]
  );
  console.log("✓ Customer 3 (customer3@riderzpro.com) ready.");

  // Ensure Customer 3 has a default address
  await query(
    `INSERT INTO customer_addresses (id, customer_id, label, recipient_name, phone, street_address, city, state, pincode, is_default)
     VALUES ('addr_cst_vikram_03', 'cst_vikram_03', 'Home', 'Vikram Malhotra', '9876543212', 'Villa 14, Palm Meadows, Whitefield', 'Bengaluru', 'Karnataka', '560066', 1)
     ON CONFLICT(id) DO NOTHING`
  );

  // Deactivate any other customer accounts if present
  await query(
    `UPDATE customers SET is_active = 0 
     WHERE email NOT IN ('customer1@riderzpro.com', 'customer2@riderzpro.com', 'customer3@riderzpro.com')`
  );

  // Sync users table so all 7 accounts are active, and all other mock/legacy accounts are deactivated
  const requiredEmails = [
    "admin@riderzpro.com",
    "admin.operations@riderzpro.com",
    "vendor1@riderzpro.com",
    "vendor2@riderzpro.com",
    "customer1@riderzpro.com",
    "customer2@riderzpro.com",
    "customer3@riderzpro.com",
  ];

  await query(
    `UPDATE users SET is_active = 0 
     WHERE email NOT IN (${requiredEmails.map((_, i) => `$${i + 1}`).join(", ")})`,
    requiredEmails
  );

  // Upsert the 7 active accounts into users table for backwards-compatibility
  await query(
    `INSERT INTO users (id, email, password_hash, full_name, role, is_active)
     VALUES ('usr_adm_super_01', 'admin@riderzpro.com', $1, 'Super Administrator', 'SUPER_ADMIN', 1)
     ON CONFLICT(email) DO UPDATE SET password_hash = $1, role = 'SUPER_ADMIN', is_active = 1`,
    [adminPassHash]
  );
  await query(
    `INSERT INTO users (id, email, password_hash, full_name, role, is_active)
     VALUES ('usr_adm_unified_01', 'admin.operations@riderzpro.com', $1, 'Unified Operations Administrator', 'ADMIN', 1)
     ON CONFLICT(email) DO UPDATE SET password_hash = $1, role = 'ADMIN', is_active = 1`,
    [adminPassHash]
  );
  await query(
    `INSERT INTO users (id, email, password_hash, full_name, role, is_active)
     VALUES ('usr_sel_volthub_01', 'vendor1@riderzpro.com', $1, 'Rajesh Kumar', 'seller', 1)
     ON CONFLICT(email) DO UPDATE SET password_hash = $1, role = 'seller', is_active = 1`,
    [vendorPassHash]
  );
  await query(
    `INSERT INTO users (id, email, password_hash, full_name, role, is_active)
     VALUES ('usr_sel_apex_02', 'vendor2@riderzpro.com', $1, 'Ananya Rao', 'seller', 1)
     ON CONFLICT(email) DO UPDATE SET password_hash = $1, role = 'seller', is_active = 1`,
    [vendorPassHash]
  );
  await query(
    `INSERT INTO users (id, email, password_hash, full_name, role, is_active)
     VALUES ('usr_cst_aarav_01', 'customer1@riderzpro.com', $1, 'Aarav Sharma', 'customer', 1)
     ON CONFLICT(email) DO UPDATE SET password_hash = $1, role = 'customer', is_active = 1`,
    [customerPassHash]
  );
  await query(
    `INSERT INTO users (id, email, password_hash, full_name, role, is_active)
     VALUES ('usr_cst_priya_02', 'customer2@riderzpro.com', $1, 'Priya Patel', 'customer', 1)
     ON CONFLICT(email) DO UPDATE SET password_hash = $1, role = 'customer', is_active = 1`,
    [customerPassHash]
  );
  await query(
    `INSERT INTO users (id, email, password_hash, full_name, role, is_active)
     VALUES ('usr_cst_vikram_03', 'customer3@riderzpro.com', $1, 'Vikram Malhotra', 'customer', 1)
     ON CONFLICT(email) DO UPDATE SET password_hash = $1, role = 'customer', is_active = 1`,
    [customerPassHash]
  );

  console.log("=== Active Accounts Setup Complete ===");
  process.exit(0);
}

setup().catch((e) => {
  console.error("Setup error:", e);
  process.exit(1);
});
