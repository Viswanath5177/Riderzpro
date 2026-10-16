import fs from "node:fs";
import path from "node:path";
import { createClient } from "@libsql/client";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const devDbPath = path.resolve(process.cwd(), "dev.db");
const sqliteUrl = `file:${devDbPath}`;

console.log("=================================================");
console.log("  Riderzpro - SQLite dev.db Creation & Migration");
console.log("  Target file:", devDbPath);
console.log("=================================================");

// Remove existing dev.db to create a clean fresh database
if (fs.existsSync(devDbPath)) {
  try {
    fs.unlinkSync(devDbPath);
    console.log("Removed previous dev.db file for fresh rebuild.");
  } catch (e) {
    console.warn("Could not remove existing dev.db:", e.message);
  }
}

const sqlite = createClient({ url: sqliteUrl });

const SCHEMA_SQL = `
-- 1. USERS
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'customer',
  address TEXT,
  city TEXT DEFAULT 'Bengaluru',
  store_name TEXT,
  store_lat REAL,
  store_lng REAL,
  vehicle_number TEXT,
  vehicle_type TEXT DEFAULT 'Electric Scooter',
  duty_status TEXT DEFAULT 'available',
  current_lat REAL,
  current_lng REAL,
  last_location_updated_at TEXT,
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 2. CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  department TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- 3. PRODUCTS
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  seller_id TEXT,
  category_id TEXT,
  name TEXT NOT NULL,
  brand TEXT DEFAULT 'Riderzpro Certified',
  sku TEXT,
  description TEXT DEFAULT '',
  price REAL DEFAULT 0.00,
  mrp REAL,
  discount_percent INTEGER DEFAULT 0,
  stock INTEGER DEFAULT 0,
  moq INTEGER DEFAULT 1,
  supplier TEXT,
  variant_model TEXT,
  material TEXT,
  fitment_size TEXT,
  fitment_type TEXT DEFAULT 'universal',
  compatible_vehicles TEXT DEFAULT '["universal"]',
  color_options TEXT DEFAULT '[]',
  key_features TEXT,
  warranty TEXT,
  weight_kg REAL DEFAULT 2.0,
  image_url TEXT,
  verification_status TEXT DEFAULT 'approved',
  verified_by TEXT,
  verified_at TEXT,
  rejection_reason TEXT,
  is_active INTEGER DEFAULT 1,
  vehicle_type TEXT,
  department TEXT,
  price_type TEXT,
  availability TEXT,
  installation_price REAL,
  installation_time TEXT,
  delivery_time TEXT,
  rating REAL,
  reviews_count INTEGER DEFAULT 0,
  is_bestseller INTEGER DEFAULT 0,
  image_2 TEXT,
  additional_specs TEXT,
  missing_details TEXT,
  listing_status TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_seller ON products(seller_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_verification ON products(verification_status, is_active);

-- 4. CUSTOMERS
CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);

-- 5. CUSTOMER PROFILES
CREATE TABLE IF NOT EXISTS customer_profiles (
  id TEXT PRIMARY KEY,
  customer_id TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  loyalty_points INTEGER DEFAULT 100,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 6. CUSTOMER ADDRESSES
CREATE TABLE IF NOT EXISTS customer_addresses (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  label TEXT DEFAULT 'Home',
  recipient_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  street_address TEXT NOT NULL,
  landmark TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  is_default INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 7. CUSTOMER GARAGE
CREATE TABLE IF NOT EXISTS customer_garage (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  vehicle_id TEXT NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER DEFAULT 2024,
  vin TEXT,
  vehicle_type TEXT DEFAULT 'bike',
  voltage INTEGER DEFAULT 60,
  battery_kwh REAL,
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_customer_garage_customer ON customer_garage(customer_id);

-- 8. ADMINS
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
CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);

-- 9. SELLERS
CREATE TABLE IF NOT EXISTS sellers (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  store_name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  business_type TEXT DEFAULT 'Proprietorship',
  business_address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  country TEXT DEFAULT 'India',
  gstin TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING_REVIEW',
  account_status TEXT DEFAULT 'ACTIVE',
  freeze_reason TEXT,
  frozen_by TEXT,
  frozen_at TEXT,
  approved_by TEXT,
  approved_at TEXT,
  rejection_reason TEXT,
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_sellers_email ON sellers(email);
CREATE INDEX IF NOT EXISTS idx_sellers_status ON sellers(status);

-- 10. SELLER DOCUMENTS
CREATE TABLE IF NOT EXISTS seller_documents (
  id TEXT PRIMARY KEY,
  seller_id TEXT NOT NULL,
  doc_type TEXT NOT NULL,
  doc_number TEXT,
  file_path TEXT NOT NULL,
  mime_type TEXT,
  is_verified INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 11. SELLER BANK ACCOUNTS
CREATE TABLE IF NOT EXISTS seller_bank_accounts (
  id TEXT PRIMARY KEY,
  seller_id TEXT UNIQUE NOT NULL,
  account_holder_name TEXT NOT NULL,
  bank_name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  ifsc_code TEXT NOT NULL,
  is_verified INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 12. ORDERS
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  customer_id TEXT NOT NULL,
  seller_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  total_amount REAL NOT NULL,
  delivery_address TEXT NOT NULL,
  delivery_lat REAL,
  delivery_lng REAL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_seller ON orders(seller_id);

-- 13. ORDER ITEMS
CREATE TABLE IF NOT EXISTS order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price REAL NOT NULL,
  subtotal REAL NOT NULL
);

-- 14. DELIVERIES
CREATE TABLE IF NOT EXISTS deliveries (
  id TEXT PRIMARY KEY,
  order_id TEXT UNIQUE NOT NULL,
  rider_id TEXT,
  status TEXT NOT NULL DEFAULT 'ready_for_pickup',
  pickup_address TEXT NOT NULL,
  dropoff_address TEXT NOT NULL,
  rider_current_lat REAL,
  rider_current_lng REAL,
  assigned_at TEXT,
  picked_up_at TEXT,
  delivered_at TEXT,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 15. SUPPORT TICKETS
CREATE TABLE IF NOT EXISTS support_tickets (
  id TEXT PRIMARY KEY,
  ticket_number TEXT UNIQUE NOT NULL,
  user_id TEXT NOT NULL,
  order_id TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  assigned_to TEXT,
  admin_response TEXT,
  resolved_at TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 16. VENDOR NOTIFICATIONS
CREATE TABLE IF NOT EXISTS vendor_notifications (
  id TEXT PRIMARY KEY,
  seller_id TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  product_id TEXT,
  is_read INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_vendor_notifications_seller ON vendor_notifications(seller_id);

-- 17. AUTH SESSIONS
CREATE TABLE IF NOT EXISTS auth_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  user_role TEXT NOT NULL,
  token_hash TEXT UNIQUE NOT NULL,
  expires_at TEXT NOT NULL,
  revoked_at TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_token ON auth_sessions(token_hash);

-- 18. EMAIL VERIFICATION ATTEMPTS
CREATE TABLE IF NOT EXISTS email_verification_attempts (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  purpose TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  consumed_at TEXT,
  attempts INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  verified INTEGER DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_email_verification_email ON email_verification_attempts(email);

-- 19. CARTS & ITEMS
CREATE TABLE IF NOT EXISTS carts (
  id TEXT PRIMARY KEY,
  customer_id TEXT UNIQUE NOT NULL,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cart_items (
  id TEXT PRIMARY KEY,
  cart_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(cart_id, product_id)
);

-- 20. WISHLISTS & ITEMS
CREATE TABLE IF NOT EXISTS wishlists (
  id TEXT PRIMARY KEY,
  customer_id TEXT UNIQUE NOT NULL,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS wishlist_items (
  id TEXT PRIMARY KEY,
  wishlist_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(wishlist_id, product_id)
);

-- 21. SAVED ITEMS
CREATE TABLE IF NOT EXISTS saved_items (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(customer_id, product_id)
);

-- 22. PRODUCT APPROVAL HISTORY
CREATE TABLE IF NOT EXISTS product_approval_history (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  admin_id TEXT,
  action TEXT NOT NULL,
  reason TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 23. AUDIT LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  actor_id TEXT NOT NULL,
  actor_role TEXT NOT NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  details TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 24. EMAIL DELIVERY LOGS
CREATE TABLE IF NOT EXISTS email_delivery_logs (
  id TEXT PRIMARY KEY,
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  template_name TEXT NOT NULL,
  status TEXT NOT NULL,
  error_message TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 25. SERVICE BOOKINGS
CREATE TABLE IF NOT EXISTS service_bookings (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  vehicle_id TEXT,
  service_type TEXT NOT NULL,
  scheduled_date TEXT,
  scheduled_slot TEXT,
  address TEXT,
  notes TEXT,
  status TEXT DEFAULT 'pending',
  total_amount REAL DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 26. PRODUCT SPECIFICATIONS
CREATE TABLE IF NOT EXISTS product_specifications (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  spec_key TEXT NOT NULL,
  spec_value TEXT NOT NULL
);

-- 27. PRODUCT VEHICLE COMPATIBILITY
CREATE TABLE IF NOT EXISTS product_vehicle_compatibility (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  vehicle_make TEXT NOT NULL,
  vehicle_model TEXT NOT NULL,
  model_year TEXT,
  variant TEXT,
  fitment_type TEXT,
  vin TEXT,
  notes TEXT
);

-- 28. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  user_role TEXT NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  entity_id TEXT,
  target_route TEXT,
  is_read INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  read_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_role ON notifications(user_role, is_read);

-- 29. VENDOR CHANGE REQUESTS (Freeze & Update Policy)
CREATE TABLE IF NOT EXISTS vendor_change_requests (
  id TEXT PRIMARY KEY,
  seller_id TEXT NOT NULL,
  requested_by TEXT NOT NULL,
  field_name TEXT NOT NULL,
  field_label TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT NOT NULL,
  reason TEXT NOT NULL,
  supporting_doc_url TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING',
  admin_notes TEXT,
  reviewed_by TEXT,
  reviewed_at TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_vcr_seller ON vendor_change_requests(seller_id);
CREATE INDEX IF NOT EXISTS idx_vcr_status ON vendor_change_requests(status);

-- 30. ADMIN INVITATIONS (Authorized Admin Workflow)
CREATE TABLE IF NOT EXISTS admin_invitations (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL,
  invite_token TEXT NOT NULL UNIQUE,
  invited_by TEXT NOT NULL,
  permissions TEXT DEFAULT '["all"]',
  expires_at TEXT NOT NULL,
  accepted_at TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_admin_invitations_token ON admin_invitations(invite_token);

-- 28. RIDERZPRO CATALOGUE IMPORT (Merged spreadsheet catalogue)
CREATE TABLE IF NOT EXISTS riderzpro_catalogue_import (
  "Product ID" TEXT PRIMARY KEY,
  "Product" TEXT,
  "Brand" TEXT,
  "Vehicle type" TEXT,
  "Department" TEXT,
  "Category" TEXT,
  "Model / SKU" TEXT,
  "Selling price (INR)" TEXT,
  "MRP (INR)" TEXT,
  "Price type" TEXT,
  "Availability" TEXT,
  "Stock (units)" TEXT,
  "Fitment" TEXT,
  "Options" TEXT,
  "Installation price (INR)" TEXT,
  "Installation time" TEXT,
  "Warranty" TEXT,
  "Delivery" TEXT,
  "Rating" TEXT,
  "Reviews" TEXT,
  "Bestseller" TEXT,
  "Description" TEXT,
  "Features" TEXT,
  "Listing status" TEXT,
  "Image status" TEXT,
  "Image 1" TEXT,
  "Image 2" TEXT,
  "Missing details" TEXT,
  "Additional specifications" TEXT,
  "Merged catalogue details" TEXT,
  "Data quality note" TEXT,
  "Source IDs" TEXT,
  "Primary image reference" TEXT,
  "Other images" TEXT
);
`;

async function main() {
  console.log("Applying complete SQLite schema to dev.db...");
  await sqlite.executeMultiple(SCHEMA_SQL);
  console.log("SQLite schema created successfully!");

  // Now, connect to PostgreSQL to copy all existing data into SQLite
  let pgClient;
  const pgUrl = process.env.DATABASE_URL?.startsWith("postgres")
    ? process.env.DATABASE_URL
    : "postgresql://postgres:Vsvg%40db1@localhost:5432/riderzpro";

  try {
    pgClient = new pg.Client({ connectionString: pgUrl });
    await pgClient.connect();
    console.log("Connected to PostgreSQL for live data migration.");
  } catch (err) {
    console.warn("Could not connect to PostgreSQL:", err.message);
    console.log("Will check if essential seed records are needed...");
  }

  const tablesToMigrate = [
    "categories",
    "users",
    "admins",
    "sellers",
    "seller_documents",
    "seller_bank_accounts",
    "customers",
    "customer_profiles",
    "customer_addresses",
    "customer_garage",
    "products",
    "orders",
    "order_items",
    "deliveries",
    "support_tickets",
    "vendor_notifications",
    "auth_sessions",
    "email_verification_attempts",
    "carts",
    "cart_items",
    "wishlists",
    "wishlist_items",
    "saved_items",
    "product_approval_history",
    "audit_logs",
    "email_delivery_logs",
    "service_bookings",
    "product_specifications",
    "product_vehicle_compatibility",
    "riderzpro_catalogue_import",
  ];

  if (pgClient) {
    for (const table of tablesToMigrate) {
      try {
        const pgRes = await pgClient.query(`SELECT * FROM "${table}"`);
        const rows = pgRes.rows;
        if (!rows || rows.length === 0) {
          console.log(`  - ${table}: 0 rows`);
          continue;
        }

        // Get columns from first row
        const cols = Object.keys(rows[0]);
        const quotedCols = cols.map((c) => `"${c}"`).join(", ");
        const placeholders = cols.map(() => "?").join(", ");
        const insertSql = `INSERT OR REPLACE INTO "${table}" (${quotedCols}) VALUES (${placeholders})`;

        let insertedCount = 0;
        for (const row of rows) {
          const values = cols.map((col) => {
            let val = row[col];
            if (val === null || val === undefined) return null;
            if (typeof val === "boolean") return val ? 1 : 0;
            if (val instanceof Date) return val.toISOString();
            if (typeof val === "object") return JSON.stringify(val);
            return val;
          });

          await sqlite.execute({ sql: insertSql, args: values });
          insertedCount++;
        }
        console.log(`  ✓ ${table}: Migrated ${insertedCount} rows from PostgreSQL.`);
      } catch (tableErr) {
        console.warn(`  ! Warning migrating ${table}:`, tableErr.message);
      }
    }
    await pgClient.end();
  }

  // Verify counts in dev.db
  console.log("\nVerifying dev.db records:");
  for (const table of tablesToMigrate) {
    try {
      const res = await sqlite.execute(`SELECT count(*) as count FROM "${table}"`);
      const count = res.rows[0]?.count ?? 0;
      console.log(`  • ${table.padEnd(30)} : ${count} rows`);
    } catch {
      // ignore
    }
  }

  sqlite.close();
  console.log("\n=================================================");
  console.log("  Successfully created and populated dev.db!");
  console.log("  dev.db is ready to serve the application locally.");
  console.log("=================================================");
}

main().catch((err) => {
  console.error("Fatal error creating dev.db:", err);
  process.exit(1);
});
