import fs from "node:fs";
import path from "node:path";
import { createClient } from "@libsql/client";

const ROOT_DIR = process.cwd();
const ENV_FILE = path.resolve(ROOT_DIR, ".env");
const DEV_VARS_FILE = path.resolve(ROOT_DIR, ".dev.vars");
const DEV_DB_FILE = path.resolve(ROOT_DIR, "dev.db");
const TEMPLATE_DB_FILE = path.resolve(ROOT_DIR, "database", "dev.db.template");

const DEFAULT_ENV_CONTENT = `# SQLite Local Database (dev.db) - Operates without needing local PostgreSQL
DATABASE_URL=file:./dev.db

# Application Environment & OTP Configuration
APP_ENV=development
OTP_HASH_SECRET=7cd8990ebd204589e4747557dd11a73ea9881dd510466ebe83662b4d98846eb0
EMAIL_OTP_EXPIRY_MINUTES=5
EMAIL_OTP_RESEND_COOLDOWN_SECONDS=60
EMAIL_OTP_MAX_ATTEMPTS=5

# Resend API Configuration
RESEND_API_KEY=your_resend_api_key_here
RESEND_FROM=support@riderzpro.com

# Twilio SMS Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_FROM=

# Google Maps / Places API Configuration (Optional)
GOOGLE_MAPS_API_KEY=
`;

const DEFAULT_DEV_VARS_CONTENT = `# SQLite Local Database (dev.db)
DATABASE_URL=file:./dev.db

# OTP & Auth Configuration
EMAIL_OTP_EXPIRY_MINUTES=5
EMAIL_OTP_RESEND_COOLDOWN_SECONDS=60
EMAIL_OTP_MAX_ATTEMPTS=5
OTP_HASH_SECRET=7cd8990ebd204589e4747557dd11a73ea9881dd510466ebe83662b4d98846eb0
APP_ENV=development

# Resend API Configuration
RESEND_API_KEY=your_resend_api_key_here
RESEND_FROM=support@riderzpro.com

# Twilio SMS Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_FROM=

# Google Maps / Places API Configuration (Optional)
GOOGLE_MAPS_API_KEY=
`;

export async function ensureEnvironmentAndDatabase() {
  console.log("--------------------------------------------------");
  console.log("  Riderzpro - Automated Environment & DB Setup");
  console.log("--------------------------------------------------");

  // 1. Ensure .env
  if (!fs.existsSync(ENV_FILE) || fs.readFileSync(ENV_FILE, "utf8").trim().length === 0) {
    fs.writeFileSync(ENV_FILE, DEFAULT_ENV_CONTENT, "utf8");
    console.log("  ✓ Automatically generated .env file");
  } else {
    console.log("  ✓ .env file present");
  }

  // 2. Ensure .dev.vars
  if (!fs.existsSync(DEV_VARS_FILE) || fs.readFileSync(DEV_VARS_FILE, "utf8").trim().length === 0) {
    fs.writeFileSync(DEV_VARS_FILE, DEFAULT_DEV_VARS_CONTENT, "utf8");
    console.log("  ✓ Automatically generated .dev.vars file");
  } else {
    console.log("  ✓ .dev.vars file present");
  }

  // 3. Ensure dev.db exists and contains all required tables
  let dbNeedsInit = false;
  if (!fs.existsSync(DEV_DB_FILE) || fs.statSync(DEV_DB_FILE).size < 50000) {
    dbNeedsInit = true;
  } else {
    try {
      const checkClient = createClient({ url: `file:${DEV_DB_FILE}` });
      const checkRes = await checkClient.execute(
        "SELECT name FROM sqlite_master WHERE type='table' AND name IN ('admins', 'users', 'sellers', 'products', 'categories', 'customers', 'orders', 'coupons')"
      );
      const readyCoreTables = checkRes.rows.length;
      if (readyCoreTables < 8) {
        console.log(`  ! dev.db is missing essential tables (${readyCoreTables}/8 found). Re-initializing from template...`);
        dbNeedsInit = true;
      }
      checkClient.close();
    } catch {
      dbNeedsInit = true;
    }
  }

  if (dbNeedsInit) {
    if (fs.existsSync(TEMPLATE_DB_FILE) && fs.statSync(TEMPLATE_DB_FILE).size > 50000) {
      fs.copyFileSync(TEMPLATE_DB_FILE, DEV_DB_FILE);
      console.log(`  ✓ Restored fresh dev.db from pre-built database template (${fs.statSync(DEV_DB_FILE).size} bytes)`);
    } else {
      console.log("  ℹ Template not found or empty, creating new dev.db file...");
      if (!fs.existsSync(DEV_DB_FILE)) {
        fs.writeFileSync(DEV_DB_FILE, "", "utf8");
      }
    }
  }

  // 4. Validate and apply essential schema migrations to dev.db
  try {
    const db = createClient({ url: `file:${DEV_DB_FILE}` });

    // Ensure critical tables exist
    await db.executeMultiple(`
      CREATE TABLE IF NOT EXISTS admins (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        full_name TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'PRODUCT_ADMIN',
        is_active INTEGER DEFAULT 1,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS customer_addresses (
        id TEXT PRIMARY KEY,
        customer_id TEXT NOT NULL,
        label TEXT DEFAULT 'Home',
        recipient_name TEXT,
        phone TEXT,
        street_address TEXT NOT NULL,
        house_flat TEXT,
        city TEXT NOT NULL DEFAULT 'Bengaluru',
        state TEXT NOT NULL DEFAULT 'Karnataka',
        pincode TEXT NOT NULL,
        is_default INTEGER DEFAULT 0,
        latitude REAL,
        longitude REAL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS wishlists (
        id TEXT PRIMARY KEY,
        customer_id TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS wishlist_items (
        id TEXT PRIMARY KEY,
        wishlist_id TEXT NOT NULL,
        product_id TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS coupons (
        id TEXT PRIMARY KEY,
        seller_id TEXT,
        code TEXT NOT NULL UNIQUE,
        description TEXT,
        discount_type TEXT NOT NULL,
        discount_value REAL NOT NULL,
        min_order_value REAL DEFAULT 0,
        max_discount_amount REAL,
        usage_limit INTEGER,
        used_count INTEGER DEFAULT 0,
        is_active INTEGER DEFAULT 1,
        starts_at TEXT,
        expires_at TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS coupon_products (
        id TEXT PRIMARY KEY,
        coupon_id TEXT NOT NULL,
        product_id TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Verify baseline admins exist and legacy admins are deprovisioned
    const defaultPasswordHash = "$2b$10$7GBZIbwbT7vsSBew6grMseneCN.CLcHRlyJdAL1RJ2kvDpm3SU.nG"; // riderzpro@123
    const adminHash = defaultPasswordHash;
    const vendorHash = defaultPasswordHash;
    const customerHash = defaultPasswordHash;

    await db.execute({
      sql: `INSERT INTO admins (id, email, password_hash, full_name, role, is_active) VALUES
      ('adm_super_01', 'admin@riderzpro.com', ?, 'Super Administrator', 'SUPER_ADMIN', 1)
      ON CONFLICT(email) DO UPDATE SET role = 'SUPER_ADMIN', is_active = 1, password_hash = ?`,
      args: [adminHash, adminHash],
    });
    await db.execute({
      sql: `INSERT INTO admins (id, email, password_hash, full_name, role, is_active) VALUES
      ('adm_unified_01', 'admin.operations@riderzpro.com', ?, 'Unified Operations Administrator', 'ADMIN', 1)
      ON CONFLICT(email) DO UPDATE SET role = 'ADMIN', is_active = 1, password_hash = ?`,
      args: [adminHash, adminHash],
    });

    // 2 Vendors
    await db.execute({
      sql: `INSERT INTO sellers (id, email, password_hash, owner_name, store_name, phone, business_address, city, state, pincode, status, account_status, is_active)
      VALUES ('sel_volthub_01', 'vendor1@riderzpro.com', ?, 'Rajesh Kumar', 'Bengaluru EV Spares Hub', '+91 98765 43210', 'Plot 42, Electronic City Phase 1', 'Bengaluru', 'Karnataka', '560100', 'APPROVED', 'ACTIVE', 1)
      ON CONFLICT(email) DO UPDATE SET is_active = 1, status = 'APPROVED', account_status = 'ACTIVE', store_name = 'Bengaluru EV Spares Hub', password_hash = ?`,
      args: [vendorHash, vendorHash],
    });
    await db.execute({
      sql: `INSERT INTO sellers (id, email, password_hash, owner_name, store_name, phone, business_address, city, state, pincode, status, account_status, is_active)
      VALUES ('sel_apex_02', 'vendor2@riderzpro.com', ?, 'Ananya Rao', 'Apex Power Solutions', '+91 98765 43211', '12 Industrial Area, Whitefield', 'Bengaluru', 'Karnataka', '560066', 'APPROVED', 'ACTIVE', 1)
      ON CONFLICT(email) DO UPDATE SET is_active = 1, status = 'APPROVED', account_status = 'ACTIVE', store_name = 'Apex Power Solutions', password_hash = ?`,
      args: [vendorHash, vendorHash],
    });

    // 3 Customers
    await db.execute({
      sql: `INSERT INTO customers (id, email, password_hash, full_name, phone, is_active)
      VALUES ('cst_aarav_01', 'customer1@riderzpro.com', ?, 'Aarav Sharma', '+91 98765 43210', 1)
      ON CONFLICT(email) DO UPDATE SET is_active = 1, full_name = 'Aarav Sharma', password_hash = ?`,
      args: [customerHash, customerHash],
    });
    await db.execute({
      sql: `INSERT INTO customers (id, email, password_hash, full_name, phone, is_active)
      VALUES ('cst_priya_02', 'customer2@riderzpro.com', ?, 'Priya Patel', '+91 98123 45678', 1)
      ON CONFLICT(email) DO UPDATE SET is_active = 1, full_name = 'Priya Patel', password_hash = ?`,
      args: [customerHash, customerHash],
    });
    await db.execute({
      sql: `INSERT INTO customers (id, email, password_hash, full_name, phone, is_active)
      VALUES ('cst_vikram_03', 'customer3@riderzpro.com', ?, 'Rohit Verma', '+91 98989 89898', 1)
      ON CONFLICT(email) DO UPDATE SET is_active = 1, full_name = 'Rohit Verma', password_hash = ?`,
      args: [customerHash, customerHash],
    });

    // Deprovision legacy admins & other mock accounts
    await db.execute(`
      UPDATE admins SET is_active = 0 WHERE email NOT IN ('admin@riderzpro.com', 'admin.operations@riderzpro.com')
    `);
    await db.execute(`
      UPDATE sellers SET is_active = 0 WHERE email NOT IN ('vendor1@riderzpro.com', 'vendor2@riderzpro.com')
    `);
    await db.execute(`
      UPDATE customers SET is_active = 0 WHERE email NOT IN ('customer1@riderzpro.com', 'customer2@riderzpro.com', 'customer3@riderzpro.com')
    `);
    await db.execute(`
      UPDATE users SET is_active = 0 WHERE email NOT IN (
        'admin@riderzpro.com', 'admin.operations@riderzpro.com',
        'vendor1@riderzpro.com', 'vendor2@riderzpro.com',
        'customer1@riderzpro.com', 'customer2@riderzpro.com', 'customer3@riderzpro.com'
      )
    `);
    await db.execute(`
      UPDATE auth_sessions SET revoked_at = datetime('now') WHERE revoked_at IS NULL AND (
        user_id IN (SELECT id FROM admins WHERE is_active = 0) OR
        user_id IN (SELECT id FROM sellers WHERE is_active = 0) OR
        user_id IN (SELECT id FROM customers WHERE is_active = 0) OR
        user_id IN (SELECT id FROM users WHERE is_active = 0)
      )
    `);
    console.log("  ✓ Verified active 7 development accounts & deprovisioned all other mock accounts");

    const tableCheck = await db.execute(
      "SELECT count(*) as count FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
    );
    const tableCount = tableCheck.rows[0]?.count ?? 0;
    console.log(`  ✓ dev.db verified (${tableCount} tables ready)`);
    db.close();
  } catch (err) {
    console.warn("  ! Note during dev.db validation:", err.message);
  }

  console.log("--------------------------------------------------\n");
}

// Run immediately if executed directly via node scripts/ensure-env-and-db.mjs
if (process.argv[1] && process.argv[1].endsWith("ensure-env-and-db.mjs")) {
  ensureEnvironmentAndDatabase().catch((err) => {
    console.error("Setup error:", err);
    process.exit(1);
  });
}
