import pg from "pg";

const pool = new pg.Pool({ connectionString: "postgresql://postgres:Vsvg%40db1@localhost:5432/riderzpro" });

async function migrate() {
  console.log("Applying missing columns and tables to PostgreSQL...");

  await pool.query(`
    ALTER TABLE customers ADD COLUMN IF NOT EXISTS user_id VARCHAR(255);
    ALTER TABLE customers ADD COLUMN IF NOT EXISTS address TEXT;
    ALTER TABLE customers ADD COLUMN IF NOT EXISTS city VARCHAR(255);

    ALTER TABLE order_items ADD COLUMN IF NOT EXISTS seller_id VARCHAR(255);

    ALTER TABLE orders ADD COLUMN IF NOT EXISTS refund_amount NUMERIC DEFAULT 0;
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'paid';
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method VARCHAR(100) DEFAULT 'UPI / Card';

    ALTER TABLE sellers ADD COLUMN IF NOT EXISTS account_status VARCHAR(50) DEFAULT 'ACTIVE';
    ALTER TABLE sellers ADD COLUMN IF NOT EXISTS freeze_reason TEXT;
    ALTER TABLE sellers ADD COLUMN IF NOT EXISTS frozen_by VARCHAR(255);
    ALTER TABLE sellers ADD COLUMN IF NOT EXISTS frozen_at TIMESTAMP;

    CREATE TABLE IF NOT EXISTS vendor_change_requests (
      id VARCHAR(255) PRIMARY KEY,
      seller_id VARCHAR(255) NOT NULL,
      field_name VARCHAR(100) NOT NULL,
      field_label VARCHAR(255) NOT NULL,
      old_value TEXT,
      new_value TEXT NOT NULL,
      reason TEXT NOT NULL,
      supporting_doc_url TEXT,
      requested_by VARCHAR(255),
      status VARCHAR(50) DEFAULT 'PENDING',
      admin_notes TEXT,
      reviewed_by VARCHAR(255),
      reviewed_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS admin_invitations (
      id VARCHAR(255) PRIMARY KEY,
      email VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL,
      status VARCHAR(50) DEFAULT 'PENDING',
      invited_by VARCHAR(255),
      token_hash VARCHAR(255),
      expires_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      accepted_at TIMESTAMP
    );
  `);

  console.log("✓ Applied schema updates to PostgreSQL!");
  await pool.end();
}

migrate().catch(console.error);
