import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const env = process.env;
const rawUrl = env["DATABASE_URL"];
const isSqlite = (rawUrl || "").startsWith("file:");
// Only configure PostgreSQL connection string if explicitly requested and not SQLite
const hasExplicitPg = Boolean(!isSqlite && (rawUrl?.startsWith("postgres") || env["PGPASSWORD"]));
const connectionString =
  (!isSqlite && rawUrl ? rawUrl : null) ||
  (hasExplicitPg
    ? `postgresql://${env["PGUSER"] || "postgres"}:${encodeURIComponent(env["PGPASSWORD"] || "")}@${env["PGHOST"] || "localhost"}:${env["PGPORT"] || "5432"}/${env["PGDATABASE"] || "riderzpro"}`
    : null);

export let isPostgresAvailable = false;

export const pool = new pg.Pool(
  connectionString
    ? { connectionString, max: 15, idleTimeoutMillis: 30000 }
    : { connectionString: "postgresql://localhost:5432/none", max: 1 }
);

// Prevent unhandled error events from crashing the process
pool.on("error", () => {});

export async function query<T extends pg.QueryResultRow = any>(text: string, params?: any[]): Promise<pg.QueryResult<T>> {
  if (!isPostgresAvailable || !connectionString) {
    return { rows: [] as T[], rowCount: 0, command: "", oid: 0, fields: [] };
  }
  return pool.query<T>(text, params);
}

/**
 * Initializes and ensures all required database tables exist with proper schema and indexes.
 */
export async function initializeDatabaseSchema() {
  if (isSqlite || !connectionString) {
    isPostgresAvailable = false;
    console.log("[Database] Running with local SQLite/in-memory marketplace fallback (DATABASE_URL=file:...).");
    return;
  }

  let client: any;
  try {
    client = await pool.connect();
    isPostgresAvailable = true;
  } catch (err: any) {
    isPostgresAvailable = false;
    console.warn("[PostgreSQL] Local PostgreSQL not reached. Running with local SQLite/in-memory marketplace fallback.", err.message);
    return;
  }
  try {
    // 1. Categories Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(128) NOT NULL,
        slug VARCHAR(128) NOT NULL UNIQUE,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Users Table
    await client.query(`
      DO $$ BEGIN
        CREATE TYPE user_role AS ENUM ('customer', 'seller', 'rider', 'admin');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(64) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(32),
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(128) NOT NULL,
        role user_role NOT NULL DEFAULT 'customer',
        address TEXT,
        city VARCHAR(64),
        store_name VARCHAR(128),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Products Table
    await client.query(`
      DO $$ BEGIN
        CREATE TYPE product_status AS ENUM ('pending_approval', 'approved', 'rejected');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(64) PRIMARY KEY,
        seller_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
        category_id VARCHAR(64) REFERENCES categories(id) ON DELETE SET NULL,
        name VARCHAR(255) NOT NULL,
        brand VARCHAR(128) DEFAULT 'Riderzpro Certified',
        sku VARCHAR(128),
        description TEXT NOT NULL DEFAULT '',
        price NUMERIC(12, 2) NOT NULL,
        mrp NUMERIC(12, 2),
        discount_percent INT DEFAULT 0,
        stock INT NOT NULL DEFAULT 0,
        moq INT DEFAULT 1,
        supplier VARCHAR(255),
        variant_model VARCHAR(255),
        material VARCHAR(255),
        fitment_size VARCHAR(255),
        fitment_type VARCHAR(64) DEFAULT 'universal',
        compatible_vehicles JSONB DEFAULT '["universal"]'::jsonb,
        color_options JSONB DEFAULT '[]'::jsonb,
        key_features TEXT,
        warranty VARCHAR(128),
        weight_kg NUMERIC(8, 2) DEFAULT 2.0,
        image_url TEXT,
        verification_status product_status NOT NULL DEFAULT 'approved',
        verified_by VARCHAR(64),
        verified_at TIMESTAMPTZ,
        rejection_reason TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
      CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
      CREATE INDEX IF NOT EXISTS idx_products_compatible_vehicles ON products USING gin(compatible_vehicles);

      -- Ensure extended catalogue columns exist
      ALTER TABLE categories ADD COLUMN IF NOT EXISTS department VARCHAR(128);
      ALTER TABLE products ADD COLUMN IF NOT EXISTS vehicle_type VARCHAR(64);
      ALTER TABLE products ADD COLUMN IF NOT EXISTS department VARCHAR(128);
      ALTER TABLE products ADD COLUMN IF NOT EXISTS price_type VARCHAR(64);
      ALTER TABLE products ADD COLUMN IF NOT EXISTS availability VARCHAR(64);
      ALTER TABLE products ADD COLUMN IF NOT EXISTS installation_price NUMERIC(12, 2);
      ALTER TABLE products ADD COLUMN IF NOT EXISTS installation_time VARCHAR(64);
      ALTER TABLE products ADD COLUMN IF NOT EXISTS delivery_time VARCHAR(64);
      ALTER TABLE products ADD COLUMN IF NOT EXISTS rating NUMERIC(3, 2);
      ALTER TABLE products ADD COLUMN IF NOT EXISTS reviews_count INT DEFAULT 0;
      ALTER TABLE products ADD COLUMN IF NOT EXISTS is_bestseller BOOLEAN DEFAULT FALSE;
      ALTER TABLE products ADD COLUMN IF NOT EXISTS image_2 TEXT;
      ALTER TABLE products ADD COLUMN IF NOT EXISTS additional_specs TEXT;
      ALTER TABLE products ADD COLUMN IF NOT EXISTS missing_details TEXT;
      ALTER TABLE products ADD COLUMN IF NOT EXISTS listing_status VARCHAR(64);
      ALTER TABLE products ALTER COLUMN price DROP NOT NULL;
      ALTER TABLE products ALTER COLUMN price SET DEFAULT 0.00;
    `);

    // 4. Customer Garage Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS email_verification_attempts (
        id VARCHAR(64) PRIMARY KEY DEFAULT ('otp_' || substr(md5(random()::text || clock_timestamp()::text), 1, 16)),
        email VARCHAR(255) NOT NULL,
        purpose VARCHAR(32) NOT NULL,
        code_hash VARCHAR(128) NOT NULL,
        expires_at TIMESTAMPTZ NOT NULL,
        consumed_at TIMESTAMPTZ,
        verified BOOLEAN DEFAULT FALSE,
        attempts INT DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
      ALTER TABLE email_verification_attempts ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT FALSE;
      ALTER TABLE email_verification_attempts ADD COLUMN IF NOT EXISTS consumed_at TIMESTAMPTZ;

      CREATE TABLE IF NOT EXISTS customer_garage (
        id VARCHAR(64) PRIMARY KEY,
        customer_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        vehicle_id VARCHAR(64) NOT NULL,
        make VARCHAR(128) NOT NULL,
        model VARCHAR(128) NOT NULL,
        year INT NOT NULL DEFAULT 2024,
        vin VARCHAR(32),
        vehicle_type VARCHAR(32) DEFAULT 'bike',
        voltage INT DEFAULT 60,
        battery_kwh NUMERIC(5, 2),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_customer_garage_customer ON customer_garage(customer_id);
      CREATE INDEX IF NOT EXISTS idx_customer_garage_active ON customer_garage(customer_id, is_active);
    `);

    // 5. Orders Table
    await client.query(`
      DO $$ BEGIN
        CREATE TYPE order_status_enum AS ENUM (
          'pending', 'accepted', 'ready_for_pickup', 'rider_assigned', 'picked_up', 'in_transit', 'delivered', 'cancelled'
        );
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(64) PRIMARY KEY,
        order_number VARCHAR(32) UNIQUE NOT NULL,
        customer_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        seller_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        status order_status_enum NOT NULL DEFAULT 'pending',
        total_amount NUMERIC(12, 2) NOT NULL,
        delivery_address TEXT NOT NULL,
        delivery_lat DOUBLE PRECISION,
        delivery_lng DOUBLE PRECISION,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
      CREATE INDEX IF NOT EXISTS idx_orders_seller_status ON orders(seller_id, status);

      -- Payment and Invoicing columns per Sathwik's Billing specification
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status VARCHAR(64) DEFAULT 'PENDING';
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method VARCHAR(64);
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS razorpay_order_id VARCHAR(128);
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS razorpay_payment_id VARCHAR(128);
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS razorpay_signature VARCHAR(256);
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS invoice_number VARCHAR(64);
    `);

    // 6. Order Items Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id VARCHAR(64) PRIMARY KEY,
        order_id VARCHAR(64) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        product_id VARCHAR(64) NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
        quantity INT NOT NULL DEFAULT 1,
        unit_price NUMERIC(12, 2) NOT NULL,
        subtotal NUMERIC(12, 2) NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
    `);

    // 7. Deliveries Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS deliveries (
        id VARCHAR(64) PRIMARY KEY,
        order_id VARCHAR(64) UNIQUE NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        rider_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
        status order_status_enum NOT NULL DEFAULT 'ready_for_pickup',
        pickup_address TEXT NOT NULL,
        dropoff_address TEXT NOT NULL,
        rider_current_lat DOUBLE PRECISION,
        rider_current_lng DOUBLE PRECISION,
        assigned_at TIMESTAMPTZ,
        picked_up_at TIMESTAMPTZ,
        delivered_at TIMESTAMPTZ,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_deliveries_rider ON deliveries(rider_id, status);
    `);

    // 8. Support Tickets Table
    await client.query(`
      DO $$ BEGIN
        CREATE TYPE ticket_status_enum AS ENUM ('open', 'in_progress', 'resolved', 'closed');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      CREATE TABLE IF NOT EXISTS support_tickets (
        id VARCHAR(64) PRIMARY KEY,
        ticket_number VARCHAR(32) UNIQUE NOT NULL,
        user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        order_id VARCHAR(64) REFERENCES orders(id) ON DELETE SET NULL,
        subject VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        status ticket_status_enum NOT NULL DEFAULT 'open',
        assigned_to VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
        admin_response TEXT,
        resolved_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
    `);

    // Ensure default system seller exists so foreign key references work seamlessly
    await client.query(`
      INSERT INTO users (id, email, phone, password_hash, full_name, role, store_name, is_active)
      VALUES 

        ('usr_customer_demo', 'customer@riderzpro.com', '+91 98450 99887', 'hash', 'Arjun Sharma', 'customer', NULL, TRUE)
      ON CONFLICT (id) DO NOTHING;
    `);

    // Ensure default categories exist
    const defaultCategories = [
      { id: "cat_accessories", name: "Vehicle Accessories & Mounts", slug: "vehicle-accessories" },
      { id: "cat_chargers", name: "Smart Chargers & Converters", slug: "smart-chargers" },
      { id: "cat_batteries", name: "EV Batteries (Lithium & LFP)", slug: "ev-batteries" },
      { id: "cat_bms", name: "Battery Management Systems (BMS)", slug: "bms" },
      { id: "cat_motors", name: "EV BLDC Motors & Drivetrain", slug: "motors" },
      { id: "cat_controllers", name: "Motor Controllers & Throttle", slug: "controllers" },
      { id: "cat_brakes", name: "Braking & Safety Parts", slug: "brakes" },
      { id: "cat_parts", name: "Spare Parts & OEM Components", slug: "spare-parts" },
      { id: "cat_vehicles", name: "Electric Scooters & Bikes", slug: "electric-bikes" },
    ];

    for (const c of defaultCategories) {
      await client.query(
        `INSERT INTO categories (id, name, slug) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING;`,
        [c.id, c.name, c.slug]
      );
    }
  } finally {
    client.release();
  }
}
