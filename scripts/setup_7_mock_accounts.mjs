import bcrypt from "bcryptjs";
import { query } from "../src/server/db.ts";

async function setup() {
  console.log("=== Setting up Exactly 7 Required Mock Accounts ===");

  const commonPassHash = await bcrypt.hash("riderzpro@123", 10);
  const adminPassHash = commonPassHash;
  const vendorPassHash = commonPassHash;
  const customerPassHash = commonPassHash;

  // 1. Super Admin: admin@riderzpro.com
  await query("DELETE FROM admins WHERE email = 'admin@riderzpro.com'");
  await query(
    `INSERT INTO admins (id, email, password_hash, full_name, role, is_active)
     VALUES ('adm_super_01', 'admin@riderzpro.com', $1, 'Super Administrator', 'SUPER_ADMIN', true)`,
    [adminPassHash]
  );
  console.log("✓ Super Admin (admin@riderzpro.com) ready.");

  // 2. Unified Admin: admin.operations@riderzpro.com
  await query("DELETE FROM admins WHERE email = 'admin.operations@riderzpro.com'");
  await query(
    `INSERT INTO admins (id, email, password_hash, full_name, role, is_active)
     VALUES ('adm_unified_01', 'admin.operations@riderzpro.com', $1, 'Unified Operations Administrator', 'ADMIN', true)`,
    [adminPassHash]
  );
  console.log("✓ Unified Admin (admin.operations@riderzpro.com) ready.");

  // Deactivate any other admin accounts
  await query(
    `UPDATE admins SET is_active = false 
     WHERE email NOT IN ('admin@riderzpro.com', 'admin.operations@riderzpro.com')`
  );
  console.log("✓ Deactivated legacy admin accounts in admins table.");

  // 3. Vendor 1: vendor1@riderzpro.com (Bengaluru EV Spares Hub)
  await query(
    `INSERT INTO sellers (id, email, password_hash, owner_name, store_name, status, account_status, is_active, phone, business_address, city, state, pincode)
     VALUES ('sel_volthub_01', 'vendor1@riderzpro.com', $1, 'Rajesh Kumar', 'Bengaluru EV Spares Hub', 'APPROVED', 'ACTIVE', true, '+91 98765 43210', 'Plot 12, Peenya Industrial Area, Phase 1', 'Bengaluru', 'Karnataka', '560058')
     ON CONFLICT(email) DO UPDATE SET password_hash = $1, store_name = 'Bengaluru EV Spares Hub', status = 'APPROVED', account_status = 'ACTIVE', is_active = true`,
    [vendorPassHash]
  );
  console.log("✓ Vendor 1 (vendor1@riderzpro.com) ready.");

  // 4. Vendor 2: vendor2@riderzpro.com (Apex Power Solutions)
  await query(
    `INSERT INTO sellers (id, email, password_hash, owner_name, store_name, status, account_status, is_active, phone, business_address, city, state, pincode)
     VALUES ('sel_apex_02', 'vendor2@riderzpro.com', $1, 'Ananya Rao', 'Apex Power Solutions', 'APPROVED', 'ACTIVE', true, '+91 98765 43211', 'Plot 45, HITEC City Main Rd', 'Hyderabad', 'Telangana', '500081')
     ON CONFLICT(email) DO UPDATE SET password_hash = $1, store_name = 'Apex Power Solutions', status = 'APPROVED', account_status = 'ACTIVE', is_active = true`,
    [vendorPassHash]
  );
  console.log("✓ Vendor 2 (vendor2@riderzpro.com) ready.");

  // Deactivate any other vendor accounts if present
  await query(
    `UPDATE sellers SET is_active = false 
     WHERE email NOT IN ('vendor1@riderzpro.com', 'vendor2@riderzpro.com')`
  );

  // 5. Customer 1: customer1@riderzpro.com (Aarav Sharma)
  await query(
    `INSERT INTO customers (id, email, password_hash, full_name, phone, is_active)
     VALUES ('cst_aarav_01', 'customer1@riderzpro.com', $1, 'Aarav Sharma', '+91 98765 43210', true)
     ON CONFLICT(email) DO UPDATE SET password_hash = $1, full_name = 'Aarav Sharma', phone = '+91 98765 43210', is_active = true`,
    [customerPassHash]
  );
  console.log("✓ Customer 1 (customer1@riderzpro.com) ready.");

  // 6. Customer 2: customer2@riderzpro.com (Priya Patel)
  await query(
    `INSERT INTO customers (id, email, password_hash, full_name, phone, is_active)
     VALUES ('cst_priya_02', 'customer2@riderzpro.com', $1, 'Priya Patel', '+91 98123 45678', true)
     ON CONFLICT(email) DO UPDATE SET password_hash = $1, full_name = 'Priya Patel', phone = '+91 98123 45678', is_active = true`,
    [customerPassHash]
  );
  console.log("✓ Customer 2 (customer2@riderzpro.com) ready.");

  // 7. Customer 3: customer3@riderzpro.com (Rohit Verma)
  await query(
    `INSERT INTO customers (id, email, password_hash, full_name, phone, is_active)
     VALUES ('cst_vikram_03', 'customer3@riderzpro.com', $1, 'Rohit Verma', '+91 98989 89898', true)
     ON CONFLICT(email) DO UPDATE SET password_hash = $1, full_name = 'Rohit Verma', phone = '+91 98989 89898', is_active = true`,
    [customerPassHash]
  );
  console.log("✓ Customer 3 (customer3@riderzpro.com) ready.");

  // Ensure Customer 3 has a default address
  await query(
    `INSERT INTO customer_addresses (id, customer_id, label, recipient_name, phone, street_address, city, state, pincode, is_default)
     VALUES ('addr_cst_vikram_03', 'cst_vikram_03', 'Home', 'Rohit Verma', '+91 98989 89898', 'Villa 14, Palm Meadows, Whitefield', 'Bengaluru', 'Karnataka', '560066', true)
     ON CONFLICT(id) DO NOTHING`
  );

  // Deactivate any other customer accounts if present
  await query(
    `UPDATE customers SET is_active = false 
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
    `UPDATE users SET is_active = false 
     WHERE email NOT IN (${requiredEmails.map((_, i) => `$${i + 1}`).join(", ")})`,
    requiredEmails
  );

  // Upsert the 7 active accounts into users table for backwards-compatibility
  await query(
    `INSERT INTO users (id, email, password_hash, full_name, role, is_active)
     VALUES ('usr_adm_super_01', 'admin@riderzpro.com', $1, 'Super Administrator', 'SUPER_ADMIN', true)
     ON CONFLICT(email) DO UPDATE SET password_hash = $1, role = 'SUPER_ADMIN', is_active = true`,
    [adminPassHash]
  );
  await query(
    `INSERT INTO users (id, email, password_hash, full_name, role, is_active)
     VALUES ('usr_adm_unified_01', 'admin.operations@riderzpro.com', $1, 'Unified Operations Administrator', 'ADMIN', true)
     ON CONFLICT(email) DO UPDATE SET password_hash = $1, role = 'ADMIN', is_active = true`,
    [adminPassHash]
  );
  await query(
    `INSERT INTO users (id, email, password_hash, full_name, role, is_active)
     VALUES ('usr_sel_volthub_01', 'vendor1@riderzpro.com', $1, 'Rajesh Kumar', 'seller', true)
     ON CONFLICT(email) DO UPDATE SET password_hash = $1, role = 'seller', is_active = true`,
    [vendorPassHash]
  );
  await query(
    `INSERT INTO users (id, email, password_hash, full_name, role, is_active)
     VALUES ('usr_sel_apex_02', 'vendor2@riderzpro.com', $1, 'Ananya Rao', 'seller', true)
     ON CONFLICT(email) DO UPDATE SET password_hash = $1, role = 'seller', is_active = true`,
    [vendorPassHash]
  );
  await query(
    `INSERT INTO users (id, email, password_hash, full_name, role, is_active)
     VALUES ('usr_cst_aarav_01', 'customer1@riderzpro.com', $1, 'Aarav Sharma', 'customer', true)
     ON CONFLICT(email) DO UPDATE SET password_hash = $1, role = 'customer', is_active = true`,
    [customerPassHash]
  );
  await query(
    `INSERT INTO users (id, email, password_hash, full_name, role, is_active)
     VALUES ('usr_cst_priya_02', 'customer2@riderzpro.com', $1, 'Priya Patel', 'customer', true)
     ON CONFLICT(email) DO UPDATE SET password_hash = $1, role = 'customer', is_active = true`,
    [customerPassHash]
  );
  await query(
    `INSERT INTO users (id, email, password_hash, full_name, role, is_active)
     VALUES ('usr_cst_vikram_03', 'customer3@riderzpro.com', $1, 'Rohit Verma', 'customer', true)
     ON CONFLICT(email) DO UPDATE SET password_hash = $1, role = 'customer', full_name = 'Rohit Verma', is_active = true`,
    [customerPassHash]
  );

  console.log("=== Active Accounts Setup Complete ===");
  process.exit(0);
}

setup().catch((e) => {
  console.error("Setup error:", e);
  process.exit(1);
});
