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

  // 3. Ensure dev.db
  const dbNeedsInit =
    !fs.existsSync(DEV_DB_FILE) || fs.statSync(DEV_DB_FILE).size < 1000;

  if (dbNeedsInit) {
    if (fs.existsSync(TEMPLATE_DB_FILE) && fs.statSync(TEMPLATE_DB_FILE).size > 1000) {
      fs.copyFileSync(TEMPLATE_DB_FILE, DEV_DB_FILE);
      console.log(`  ✓ Restored fresh dev.db from pre-built database template (${fs.statSync(DEV_DB_FILE).size} bytes)`);
    } else {
      console.log("  ℹ Template not found, creating new dev.db file...");
      fs.writeFileSync(DEV_DB_FILE, "", "utf8");
    }
  }

  // 4. Validate and apply essential schema migrations to dev.db
  try {
    const db = createClient({ url: `file:${DEV_DB_FILE}` });

    // Ensure critical tables exist
    await db.executeMultiple(`
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
