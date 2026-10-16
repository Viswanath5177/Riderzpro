import pg from "pg";

const pool = new pg.Pool({
  connectionString: "postgresql://postgres:Vsvg%40db1@localhost:5432/riderzpro"
});

async function patchPgSchema() {
  console.log("Ensuring all tables exist in PostgreSQL...");

  // 1. notifications table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS notifications (
      id VARCHAR(64) PRIMARY KEY,
      user_id VARCHAR(64) NOT NULL,
      user_role VARCHAR(64) NOT NULL,
      type VARCHAR(64) NOT NULL,
      title VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      entity_id VARCHAR(64),
      target_route VARCHAR(255),
      is_read BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      read_at TIMESTAMPTZ
    );
  `);
  console.log("✓ notifications table verified in PG");

  // 2. coupons table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS coupons (
      id VARCHAR(64) PRIMARY KEY,
      seller_id VARCHAR(64),
      code VARCHAR(64) NOT NULL UNIQUE,
      description TEXT,
      discount_type VARCHAR(32) NOT NULL,
      discount_value NUMERIC NOT NULL,
      min_order_value NUMERIC DEFAULT 0,
      max_discount_amount NUMERIC,
      usage_limit INTEGER,
      used_count INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT TRUE,
      starts_at TIMESTAMPTZ,
      expires_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log("✓ coupons table verified in PG");

  // 3. coupon_products table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS coupon_products (
      id VARCHAR(64) PRIMARY KEY,
      coupon_id VARCHAR(64) NOT NULL,
      product_id VARCHAR(64) NOT NULL,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log("✓ coupon_products table verified in PG");

  // 4. Ensure customer_addresses columns exist
  await pool.query(`
    ALTER TABLE customer_addresses ADD COLUMN IF NOT EXISTS latitude NUMERIC;
    ALTER TABLE customer_addresses ADD COLUMN IF NOT EXISTS longitude NUMERIC;
    ALTER TABLE customer_addresses ADD COLUMN IF NOT EXISTS house_flat VARCHAR(255);
  `).catch(console.warn);
  console.log("✓ customer_addresses extra columns verified in PG");

  // 5. Ensure product_status_enum supports uppercase labels
  await pool.query(`
    ALTER TYPE product_status_enum ADD VALUE IF NOT EXISTS 'APPROVED';
    ALTER TYPE product_status_enum ADD VALUE IF NOT EXISTS 'PENDING_APPROVAL';
    ALTER TYPE product_status_enum ADD VALUE IF NOT EXISTS 'REJECTED';
  `).catch(console.warn);
  console.log("✓ product_status_enum updated");

  await pool.end();
}

patchPgSchema().catch(console.error);
