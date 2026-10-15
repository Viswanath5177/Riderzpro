import pg from "pg";

const pool = new pg.Pool({
  connectionString: "postgresql://postgres:Vsvg%40db1@localhost:5432/riderzpro"
});

async function migrateSchema() {
  console.log("Migrating PostgreSQL schema for Product Detail features...");

  // 1. product_reviews table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS product_reviews (
      id VARCHAR(64) PRIMARY KEY,
      product_id VARCHAR(64) NOT NULL,
      user_id VARCHAR(64),
      user_name VARCHAR(128) NOT NULL,
      user_city VARCHAR(128) DEFAULT 'Bengaluru',
      rating NUMERIC(2,1) NOT NULL CHECK (rating >= 1 AND rating <= 5),
      title VARCHAR(255) NOT NULL,
      comment TEXT NOT NULL,
      fitment_vehicle VARCHAR(128),
      is_verified_purchase BOOLEAN DEFAULT TRUE,
      helpful_count INTEGER DEFAULT 0,
      status VARCHAR(32) DEFAULT 'published',
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_product_reviews_pid ON product_reviews(product_id);
    CREATE INDEX IF NOT EXISTS idx_product_reviews_status ON product_reviews(status);
  `);
  console.log("✓ product_reviews table created/verified");

  // 2. product_offers table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS product_offers (
      id VARCHAR(64) PRIMARY KEY,
      product_id VARCHAR(64) NOT NULL,
      vendor_id VARCHAR(64) NOT NULL,
      price NUMERIC NOT NULL,
      mrp NUMERIC,
      stock INTEGER DEFAULT 0,
      status VARCHAR(32) DEFAULT 'active',
      warranty_terms VARCHAR(255),
      shipping_charge NUMERIC DEFAULT 0,
      delivery_days VARCHAR(64) DEFAULT '2-3 business days',
      dispatch_hours INTEGER DEFAULT 24,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_product_offers_pid ON product_offers(product_id);
    CREATE INDEX IF NOT EXISTS idx_product_offers_vid ON product_offers(vendor_id);
  `);
  console.log("✓ product_offers table created/verified");

  // 3. Sellers rating and review_count columns
  await pool.query(`
    ALTER TABLE sellers ADD COLUMN IF NOT EXISTS rating NUMERIC(3,2) DEFAULT 0.00;
    ALTER TABLE sellers ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;
  `);
  console.log("✓ sellers rating columns added");

  // 4. Products gst_percent and specs columns
  await pool.query(`
    ALTER TABLE products ADD COLUMN IF NOT EXISTS gst_percent NUMERIC(4,2) DEFAULT 18.00;
    ALTER TABLE products ADD COLUMN IF NOT EXISTS rating NUMERIC(3,2) DEFAULT 0.00;
    ALTER TABLE products ADD COLUMN IF NOT EXISTS reviews_count INTEGER DEFAULT 0;
  `);
  console.log("✓ products extra columns verified");

  await pool.end();
}

migrateSchema().catch(console.error);
