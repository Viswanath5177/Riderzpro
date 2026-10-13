-- ============================================================================
-- Riderzpro - Unified Seed Data
-- All 5 roles inserted into the single USERS table.
-- Products, orders, deliveries, and support tickets remain 100% empty.
-- ============================================================================

-- 1. Insert All Roles into Single USERS Table
INSERT INTO users (
    id, email, phone, password_hash, full_name, role, 
    address, city, store_name, store_lat, store_lng, 
    vehicle_number, vehicle_type, duty_status
) VALUES
-- Super Admin
('usr_admin_01', 'admin@riderzpro.com', '+91 90000 00001', crypt('AdminPass123!', gen_salt('bf')), 'System Admin', 'admin', 
 NULL, 'Bengaluru', NULL, NULL, NULL, NULL, NULL, NULL),

-- Support Admin
('usr_support_01', 'support@riderzpro.com', '+91 90000 00002', crypt('SupportPass123!', gen_salt('bf')), 'Ananya Sen', 'support_admin', 
 NULL, 'Bengaluru', NULL, NULL, NULL, NULL, NULL, NULL),

-- Rider (Technician & Delivery)
('usr_rider_ramesh', 'rider@riderzpro.com', '+91 98450 12345', crypt('RiderPass123!', gen_salt('bf')), 'Ramesh Kumar', 'rider', 
 'HSR Layout', 'Bengaluru', NULL, NULL, NULL, 'KA 01 EV 8899', 'Electric Cargo Scooter', 'available'),

-- Customer (End User)
('usr_customer_demo', 'customer@example.com', '+91 98860 99887', crypt('CustPass123!', gen_salt('bf')), 'Rahul Verma', 'customer', 
 'Flat 202, Green Glen Layout, Bellandur', 'Bengaluru', NULL, NULL, NULL, NULL, NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- 2. Product Categories
INSERT INTO categories (id, name, slug) VALUES
('cat_batteries', 'EV Batteries', 'ev-batteries'),
('cat_accessories', 'Chargers & Accessories', 'chargers-accessories')
ON CONFLICT (id) DO NOTHING;
