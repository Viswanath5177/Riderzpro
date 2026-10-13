-- ============================================================================
-- Riderzpro - Unified 7-Table Schema
-- All roles (Customer, Seller, Rider, Support Admin, Admin) in ONE USERS table.
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUM TYPES
CREATE TYPE user_role_enum AS ENUM ('customer', 'seller', 'rider', 'admin', 'support_admin');
CREATE TYPE rider_duty_enum AS ENUM ('available', 'busy', 'offline');
CREATE TYPE product_status_enum AS ENUM ('pending_approval', 'approved', 'rejected');
CREATE TYPE order_status_enum AS ENUM (
    'pending',              -- Customer placed order, waiting for seller
    'accepted',             -- Seller accepted order and preparing
    'ready_for_pickup',     -- Seller prepared order, ready for rider
    'rider_assigned',       -- Rider assigned to deliver
    'picked_up',            -- Rider picked up package from seller
    'in_transit',           -- Rider en route to customer
    'delivered',            -- Successfully delivered
    'cancelled'             -- Order cancelled
);
CREATE TYPE ticket_status_enum AS ENUM ('open', 'in_progress', 'resolved', 'closed');

-- ============================================================================
-- 3. UNIFIED USERS TABLE (ALL ROLES IN ONE TABLE)
-- ============================================================================

CREATE TABLE users (
    id VARCHAR(64) PRIMARY KEY DEFAULT ('usr_' || substr(md5(random()::text || clock_timestamp()::text), 1, 16)),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(32) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(128) NOT NULL,
    role user_role_enum NOT NULL, -- 'customer', 'seller', 'rider', 'admin', 'support_admin'
    
    -- Address fields (Customer / Seller / General)
    address TEXT,
    city VARCHAR(64) DEFAULT 'Bengaluru',
    
    -- Seller-specific fields (Used when role = 'seller')
    store_name VARCHAR(128),
    store_lat DOUBLE PRECISION,
    store_lng DOUBLE PRECISION,
    
    -- Rider-specific fields (Used when role = 'rider')
    vehicle_number VARCHAR(32),
    vehicle_type VARCHAR(64) DEFAULT 'Electric Scooter',
    duty_status rider_duty_enum DEFAULT 'available',
    current_lat DOUBLE PRECISION,
    current_lng DOUBLE PRECISION,
    last_location_updated_at TIMESTAMPTZ,
    
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_rider_status ON users(role, duty_status) WHERE role = 'rider';

-- ============================================================================
-- 4. CATEGORIES & PRODUCTS (WITH APPROVAL WORKFLOW)
-- ============================================================================

CREATE TABLE categories (
    id VARCHAR(64) PRIMARY KEY DEFAULT ('cat_' || substr(md5(random()::text || clock_timestamp()::text), 1, 16)),
    name VARCHAR(64) NOT NULL,
    slug VARCHAR(64) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Products created by Seller -> Approved by Support Admin -> Visible to Customer
CREATE TABLE products (
    id VARCHAR(64) PRIMARY KEY DEFAULT ('prod_' || substr(md5(random()::text || clock_timestamp()::text), 1, 16)),
    seller_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id VARCHAR(64) NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(12, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    image_url TEXT,
    
    -- Verification Workflow:
    verification_status product_status_enum NOT NULL DEFAULT 'pending_approval',
    verified_by VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    verified_at TIMESTAMPTZ,
    rejection_reason TEXT,
    
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_seller ON products(seller_id);
CREATE INDEX idx_products_verification ON products(verification_status, is_active);

-- ============================================================================
-- 5. ORDERS & ORDER ITEMS
-- ============================================================================

CREATE TABLE orders (
    id VARCHAR(64) PRIMARY KEY DEFAULT ('ord_' || substr(md5(random()::text || clock_timestamp()::text), 1, 16)),
    order_number VARCHAR(32) UNIQUE NOT NULL, -- e.g. "ORD-1001"
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

CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_seller_status ON orders(seller_id, status);

CREATE TABLE order_items (
    id VARCHAR(64) PRIMARY KEY DEFAULT ('item_' || substr(md5(random()::text || clock_timestamp()::text), 1, 16)),
    order_id VARCHAR(64) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id VARCHAR(64) NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity INT NOT NULL DEFAULT 1,
    unit_price NUMERIC(12, 2) NOT NULL,
    subtotal NUMERIC(12, 2) NOT NULL
);

CREATE INDEX idx_order_items_order ON order_items(order_id);

-- ============================================================================
-- 6. DELIVERIES (RIDER ASSIGNMENT & GPS TRACKING)
-- ============================================================================

CREATE TABLE deliveries (
    id VARCHAR(64) PRIMARY KEY DEFAULT ('del_' || substr(md5(random()::text || clock_timestamp()::text), 1, 16)),
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

CREATE INDEX idx_deliveries_rider ON deliveries(rider_id, status);

-- ============================================================================
-- 7. SUPPORT TICKETS (SUPPORT ADMIN RESOLUTION)
-- ============================================================================

CREATE TABLE support_tickets (
    id VARCHAR(64) PRIMARY KEY DEFAULT ('tkt_' || substr(md5(random()::text || clock_timestamp()::text), 1, 16)),
    ticket_number VARCHAR(32) UNIQUE NOT NULL, -- e.g. "TKT-101"
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

CREATE INDEX idx_support_tickets_status ON support_tickets(status);

-- ============================================================================
-- 8. AUTO-UPDATE TIMESTAMP TRIGGERS
-- ============================================================================

CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
CREATE TRIGGER trg_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
CREATE TRIGGER trg_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
CREATE TRIGGER trg_deliveries_updated_at BEFORE UPDATE ON deliveries FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
CREATE TRIGGER trg_support_tickets_updated_at BEFORE UPDATE ON support_tickets FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
