-- ============================================================================
-- Riderzpro Migration 002: Complete Authentication, Vendor Verification, 
-- Inventory Management, Customer Shopping & Admin Approval System
-- ============================================================================

BEGIN;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. CUSTOMERS & CUSTOMER PROFILES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS customers (
    id VARCHAR(64) PRIMARY KEY DEFAULT ('cst_' || substr(md5(random()::text || clock_timestamp()::text), 1, 16)),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(32),
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(128) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customer_profiles (
    id VARCHAR(64) PRIMARY KEY DEFAULT ('cp_' || substr(md5(random()::text || clock_timestamp()::text), 1, 16)),
    customer_id VARCHAR(64) UNIQUE NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    avatar_url TEXT,
    bio TEXT,
    loyalty_points INT DEFAULT 100,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customer_addresses (
    id VARCHAR(64) PRIMARY KEY DEFAULT ('addr_' || substr(md5(random()::text || clock_timestamp()::text), 1, 16)),
    customer_id VARCHAR(64) NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    label VARCHAR(32) DEFAULT 'Home',
    recipient_name VARCHAR(128) NOT NULL,
    phone VARCHAR(32) NOT NULL,
    street_address TEXT NOT NULL,
    landmark TEXT,
    city VARCHAR(64) NOT NULL,
    state VARCHAR(64) NOT NULL,
    pincode VARCHAR(16) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 2. ADMINISTRATORS & ROLES (PRODUCT_ADMIN, SUPPORT_ADMIN)
-- ----------------------------------------------------------------------------
DO $$ BEGIN
    CREATE TYPE admin_role_enum AS ENUM ('PRODUCT_ADMIN', 'SUPPORT_ADMIN', 'SUPER_ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS admins (
    id VARCHAR(64) PRIMARY KEY DEFAULT ('adm_' || substr(md5(random()::text || clock_timestamp()::text), 1, 16)),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(128) NOT NULL,
    role admin_role_enum NOT NULL DEFAULT 'PRODUCT_ADMIN',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 3. SELLERS / VENDORS, KYC DOCUMENTS & BANK ACCOUNTS
-- ----------------------------------------------------------------------------
DO $$ BEGIN
    CREATE TYPE seller_status_enum AS ENUM (
        'PENDING_REVIEW',
        'UNDER_REVIEW',
        'APPROVED',
        'REJECTED',
        'MORE_INFORMATION_REQUIRED',
        'SUSPENDED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS sellers (
    id VARCHAR(64) PRIMARY KEY DEFAULT ('sel_' || substr(md5(random()::text || clock_timestamp()::text), 1, 16)),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(32) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    store_name VARCHAR(128) NOT NULL,
    owner_name VARCHAR(128) NOT NULL,
    business_type VARCHAR(64) DEFAULT 'Proprietorship',
    business_address TEXT NOT NULL,
    city VARCHAR(64) NOT NULL,
    state VARCHAR(64) NOT NULL,
    pincode VARCHAR(16) NOT NULL,
    country VARCHAR(32) DEFAULT 'India',
    gstin VARCHAR(32),
    status seller_status_enum NOT NULL DEFAULT 'PENDING_REVIEW',
    approved_by VARCHAR(64) REFERENCES admins(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ,
    rejection_reason TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS seller_documents (
    id VARCHAR(64) PRIMARY KEY DEFAULT ('sdoc_' || substr(md5(random()::text || clock_timestamp()::text), 1, 16)),
    seller_id VARCHAR(64) NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,
    doc_type VARCHAR(32) NOT NULL, -- 'PAN', 'AADHAAR_FRONT', 'GST_CERT', 'BUSINESS_REG'
    doc_number VARCHAR(64),
    file_path TEXT NOT NULL,
    mime_type VARCHAR(64),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS seller_bank_accounts (
    id VARCHAR(64) PRIMARY KEY DEFAULT ('sbnk_' || substr(md5(random()::text || clock_timestamp()::text), 1, 16)),
    seller_id VARCHAR(64) UNIQUE NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,
    account_holder_name VARCHAR(128) NOT NULL,
    bank_name VARCHAR(128) NOT NULL,
    account_number VARCHAR(64) NOT NULL,
    ifsc_code VARCHAR(32) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 4. EMAIL OTP VERIFICATION SYSTEM (EMAIL ONLY)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS email_verification_attempts (
    id VARCHAR(64) PRIMARY KEY DEFAULT ('otp_' || substr(md5(random()::text || clock_timestamp()::text), 1, 16)),
    email VARCHAR(255) NOT NULL,
    purpose VARCHAR(32) NOT NULL, -- 'CUSTOMER_SIGNUP', 'VENDOR_SIGNUP', 'RESET_PASSWORD'
    code_hash VARCHAR(128) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    consumed_at TIMESTAMPTZ,
    attempts INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_otp_email_purpose ON email_verification_attempts(email, purpose, created_at DESC);

-- ----------------------------------------------------------------------------
-- 5. PERSISTENT SHOPPING CARTS & WISHLISTS IN POSTGRESQL
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS carts (
    id VARCHAR(64) PRIMARY KEY DEFAULT ('crt_' || substr(md5(random()::text || clock_timestamp()::text), 1, 16)),
    customer_id VARCHAR(64) UNIQUE NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cart_items (
    id VARCHAR(64) PRIMARY KEY DEFAULT ('ci_' || substr(md5(random()::text || clock_timestamp()::text), 1, 16)),
    cart_id VARCHAR(64) NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    product_id VARCHAR(64) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_cart_product UNIQUE (cart_id, product_id)
);

CREATE TABLE IF NOT EXISTS wishlists (
    id VARCHAR(64) PRIMARY KEY DEFAULT ('wsh_' || substr(md5(random()::text || clock_timestamp()::text), 1, 16)),
    customer_id VARCHAR(64) UNIQUE NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS wishlist_items (
    id VARCHAR(64) PRIMARY KEY DEFAULT ('wi_' || substr(md5(random()::text || clock_timestamp()::text), 1, 16)),
    wishlist_id VARCHAR(64) NOT NULL REFERENCES wishlists(id) ON DELETE CASCADE,
    product_id VARCHAR(64) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_wishlist_product UNIQUE (wishlist_id, product_id)
);

-- ----------------------------------------------------------------------------
-- 6. PRODUCT VEHICLE COMPATIBILITY, SPECIFICATIONS & APPROVAL HISTORY
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS product_specifications (
    id VARCHAR(64) PRIMARY KEY DEFAULT ('pspec_' || substr(md5(random()::text || clock_timestamp()::text), 1, 16)),
    product_id VARCHAR(64) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    spec_key VARCHAR(128) NOT NULL,
    spec_value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS product_vehicle_compatibility (
    id VARCHAR(64) PRIMARY KEY DEFAULT ('pvc_' || substr(md5(random()::text || clock_timestamp()::text), 1, 16)),
    product_id VARCHAR(64) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    vehicle_make VARCHAR(64) NOT NULL,
    vehicle_model VARCHAR(64) NOT NULL,
    model_year VARCHAR(32),
    variant VARCHAR(64),
    fitment_type VARCHAR(64),
    vin VARCHAR(32), -- Optional VIN
    notes TEXT
);

CREATE TABLE IF NOT EXISTS product_approval_history (
    id VARCHAR(64) PRIMARY KEY DEFAULT ('pah_' || substr(md5(random()::text || clock_timestamp()::text), 1, 16)),
    product_id VARCHAR(64) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    admin_id VARCHAR(64) REFERENCES admins(id) ON DELETE SET NULL,
    action VARCHAR(32) NOT NULL, -- 'APPROVED', 'REJECTED'
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 7. AUDITING & EMAIL DELIVERY LOGS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(64) PRIMARY KEY DEFAULT ('aud_' || substr(md5(random()::text || clock_timestamp()::text), 1, 16)),
    actor_id VARCHAR(64) NOT NULL,
    actor_role VARCHAR(32) NOT NULL,
    action VARCHAR(64) NOT NULL,
    target_type VARCHAR(32) NOT NULL,
    target_id VARCHAR(64) NOT NULL,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS email_delivery_logs (
    id VARCHAR(64) PRIMARY KEY DEFAULT ('eml_' || substr(md5(random()::text || clock_timestamp()::text), 1, 16)),
    recipient_email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    template_name VARCHAR(64) NOT NULL,
    status VARCHAR(32) NOT NULL, -- 'SENT', 'FAILED'
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS auth_sessions (
    id VARCHAR(64) PRIMARY KEY DEFAULT ('sess_' || substr(md5(random()::text || clock_timestamp()::text), 1, 16)),
    user_id VARCHAR(64) NOT NULL,
    user_role VARCHAR(32) NOT NULL, -- 'customer', 'seller', 'PRODUCT_ADMIN', 'SUPPORT_ADMIN'
    token_hash CHAR(64) UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_token ON auth_sessions(token_hash) WHERE revoked_at IS NULL;

-- ----------------------------------------------------------------------------
-- 8. INITIAL PROVISIONED ADMINISTRATORS (PRODUCT_ADMIN & SUPPORT_ADMIN)
-- Password for demo/initial: Admin@Riderzpro2026
-- ----------------------------------------------------------------------------
INSERT INTO admins (id, email, password_hash, full_name, role)
VALUES 
    (
        'adm_product_01', 
        'product.admin@riderzpro.com', 
        crypt('Admin@Riderzpro2026', gen_salt('bf')), 
        'Product Approval Admin', 
        'PRODUCT_ADMIN'
    ),
    (
        'adm_support_01', 
        'support.admin@riderzpro.com', 
        crypt('Admin@Riderzpro2026', gen_salt('bf')), 
        'Support Operations Admin', 
        'SUPPORT_ADMIN'
    )
ON CONFLICT (email) DO NOTHING;

COMMIT;
