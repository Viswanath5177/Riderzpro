-- ============================================================================
-- Riderzpro: Catalogue Staging to Production Mapping Script
-- Run in pgAdmin Query Tool after running riderzpro_catalogue_import.sql.
-- Maps staging table `riderzpro_catalogue_import` into `categories` and `products`.
-- ============================================================================

BEGIN;

-- 1. Ensure required schema enhancements in categories and products
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

-- 2. Ensure default seller exists in users table for foreign key reference
INSERT INTO users (id, email, phone, password_hash, full_name, role, store_name, is_active)
VALUES ('usr_seller_01', 'seller@riderzpro.com', '+91 98450 11223', 'hash', 'Riderzpro Official', 'seller', 'Riderzpro Official Store', TRUE)
ON CONFLICT (id) DO NOTHING;

-- 3. Map & Upsert Categories from staging table
INSERT INTO categories (id, name, slug, department)
SELECT DISTINCT
    'cat_' || lower(regexp_replace(regexp_replace(trim("Category"), '[^a-zA-Z0-9]+', '-', 'g'), '^-+|-+$', '', 'g')) AS id,
    trim("Category") AS name,
    lower(regexp_replace(regexp_replace(trim("Category"), '[^a-zA-Z0-9]+', '-', 'g'), '^-+|-+$', '', 'g')) AS slug,
    trim("Department") AS department
FROM riderzpro_catalogue_import
WHERE "Category" IS NOT NULL AND trim("Category") != ''
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    department = COALESCE(EXCLUDED.department, categories.department);

-- 4. Map & Upsert Products from staging table
INSERT INTO products (
    id,
    seller_id,
    category_id,
    name,
    brand,
    sku,
    description,
    price,
    mrp,
    discount_percent,
    stock,
    moq,
    supplier,
    variant_model,
    material,
    fitment_size,
    fitment_type,
    compatible_vehicles,
    color_options,
    key_features,
    warranty,
    weight_kg,
    image_url,
    image_2,
    verification_status,
    is_active,
    vehicle_type,
    department,
    price_type,
    availability,
    installation_price,
    installation_time,
    delivery_time,
    rating,
    reviews_count,
    is_bestseller,
    additional_specs,
    missing_details,
    listing_status,
    created_at,
    updated_at
)
SELECT 
    imp."Product ID" AS id,
    'usr_seller_01' AS seller_id,
    COALESCE(cat.id, 'cat_accessories') AS category_id,
    COALESCE(imp."Product", imp."Product ID") AS name,
    COALESCE(imp."Brand", 'Riderzpro') AS brand,
    COALESCE(imp."Model / SKU", imp."Product ID") AS sku,
    COALESCE(imp."Description", imp."Merged catalogue details", imp."Features", '') AS description,
    COALESCE(NULLIF(regexp_replace(imp."Selling price (INR)", '[^0-9.]', '', 'g'), '')::NUMERIC, NULLIF(regexp_replace(imp."MRP (INR)", '[^0-9.]', '', 'g'), '')::NUMERIC, 0.00) AS price,
    NULLIF(regexp_replace(imp."MRP (INR)", '[^0-9.]', '', 'g'), '')::NUMERIC AS mrp,
    CASE 
        WHEN NULLIF(regexp_replace(imp."MRP (INR)", '[^0-9.]', '', 'g'), '')::NUMERIC > NULLIF(regexp_replace(imp."Selling price (INR)", '[^0-9.]', '', 'g'), '')::NUMERIC
        THEN ROUND(((NULLIF(regexp_replace(imp."MRP (INR)", '[^0-9.]', '', 'g'), '')::NUMERIC - NULLIF(regexp_replace(imp."Selling price (INR)", '[^0-9.]', '', 'g'), '')::NUMERIC) / NULLIF(regexp_replace(imp."MRP (INR)", '[^0-9.]', '', 'g'), '')::NUMERIC) * 100)::INT
        ELSE 0
    END AS discount_percent,
    COALESCE(NULLIF(regexp_replace(imp."Stock (units)", '[^0-9]', '', 'g'), '')::INT, CASE WHEN imp."Availability" = 'In stock' THEN 25 ELSE 0 END) AS stock,
    1 AS moq,
    COALESCE(imp."Brand", 'Riderzpro') AS supplier,
    imp."Model / SKU" AS variant_model,
    imp."Options" AS material,
    imp."Fitment" AS fitment_size,
    CASE WHEN imp."Fitment" ILIKE '%universal%' THEN 'universal' ELSE 'vehicle_specific' END AS fitment_type,
    jsonb_build_array(COALESCE(lower(imp."Vehicle type"), 'universal')) AS compatible_vehicles,
    '[]'::jsonb AS color_options,
    COALESCE(imp."Features", imp."Additional specifications", '') AS key_features,
    imp."Warranty" AS warranty,
    2.0 AS weight_kg,
    COALESCE(imp."Image 1", imp."Primary image reference", imp."Image 2") AS image_url,
    imp."Image 2" AS image_2,
    CASE WHEN lower(imp."Listing status") = 'listed' THEN 'approved'::product_status ELSE 'pending_approval'::product_status END AS verification_status,
    (lower(imp."Listing status") = 'listed') AS is_active,
    imp."Vehicle type" AS vehicle_type,
    imp."Department" AS department,
    imp."Price type" AS price_type,
    imp."Availability" AS availability,
    NULLIF(regexp_replace(imp."Installation price (INR)", '[^0-9.]', '', 'g'), '')::NUMERIC AS installation_price,
    imp."Installation time" AS installation_time,
    imp."Delivery" AS delivery_time,
    NULLIF(regexp_replace(imp."Rating", '[^0-9.]', '', 'g'), '')::NUMERIC AS rating,
    COALESCE(NULLIF(regexp_replace(imp."Reviews", '[^0-9]', '', 'g'), '')::INT, 0) AS reviews_count,
    (lower(COALESCE(imp."Bestseller", 'false')) = 'true') AS is_bestseller,
    imp."Additional specifications" AS additional_specs,
    imp."Missing details" AS missing_details,
    imp."Listing status" AS listing_status,
    CURRENT_TIMESTAMP AS created_at,
    CURRENT_TIMESTAMP AS updated_at
FROM riderzpro_catalogue_import imp
LEFT JOIN categories cat ON cat.name = trim(imp."Category")
ON CONFLICT (id) DO UPDATE SET
    category_id = EXCLUDED.category_id,
    name = EXCLUDED.name,
    brand = EXCLUDED.brand,
    sku = EXCLUDED.sku,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    mrp = EXCLUDED.mrp,
    discount_percent = EXCLUDED.discount_percent,
    stock = EXCLUDED.stock,
    fitment_size = EXCLUDED.fitment_size,
    fitment_type = EXCLUDED.fitment_type,
    compatible_vehicles = EXCLUDED.compatible_vehicles,
    key_features = EXCLUDED.key_features,
    warranty = EXCLUDED.warranty,
    image_url = EXCLUDED.image_url,
    image_2 = EXCLUDED.image_2,
    verification_status = EXCLUDED.verification_status,
    is_active = EXCLUDED.is_active,
    vehicle_type = EXCLUDED.vehicle_type,
    department = EXCLUDED.department,
    price_type = EXCLUDED.price_type,
    availability = EXCLUDED.availability,
    installation_price = EXCLUDED.installation_price,
    installation_time = EXCLUDED.installation_time,
    delivery_time = EXCLUDED.delivery_time,
    rating = EXCLUDED.rating,
    reviews_count = EXCLUDED.reviews_count,
    is_bestseller = EXCLUDED.is_bestseller,
    additional_specs = EXCLUDED.additional_specs,
    missing_details = EXCLUDED.missing_details,
    listing_status = EXCLUDED.listing_status,
    updated_at = CURRENT_TIMESTAMP;

COMMIT;

-- 5. Verification queries
SELECT count(*) AS total_products, 
       count(*) FILTER (WHERE is_active = true) AS active_in_shop,
       count(*) FILTER (WHERE verification_status = 'approved') AS approved_products,
       count(*) FILTER (WHERE verification_status = 'pending_approval') AS pending_products
FROM products;

SELECT count(*) AS total_categories FROM categories;
