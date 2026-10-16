import pg from "pg";

const pool = new pg.Pool({
  connectionString: "postgresql://postgres:Vsvg%40db1@localhost:5432/riderzpro"
});

async function seedRealProducts() {
  console.log("Seeding authentic sample products and multi-vendor offers in PostgreSQL...");

  // Ensure products foreign key points to sellers table
  await pool.query(`
    ALTER TABLE products DROP CONSTRAINT IF EXISTS products_seller_id_fkey;
    ALTER TABLE products ADD CONSTRAINT products_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES sellers(id) ON DELETE CASCADE;

    INSERT INTO categories (id, name, slug) VALUES 
    ('cat_ev-batteries', 'EV Batteries & Power Packs', 'ev-batteries-power-packs'),
    ('cat_chargers', 'EV Fast Chargers & Adapters', 'ev-fast-chargers-adapters')
    ON CONFLICT (id) DO NOTHING;
  `);

  // Update seller genuine ratings
  await pool.query(`
    UPDATE sellers 
    SET rating = 4.85, review_count = 42 
    WHERE id = 'sel_volthub_01';

    UPDATE sellers 
    SET rating = 4.70, review_count = 28 
    WHERE id = 'sel_apex_02';
  `);

  // Product 1: Lithium LiFePO4 Smart Battery Pack 60V 30Ah
  const prod1Id = "RZP-BAT-60V30AH";
  await pool.query(`
    INSERT INTO products (
      id, seller_id, category_id, name, brand, sku, description,
      price, mrp, discount_percent, stock, moq, supplier,
      variant_model, material, fitment_size, fitment_type,
      compatible_vehicles, color_options, key_features, warranty,
      weight_kg, image_url, verification_status, is_active,
      department, price_type, availability, installation_price,
      installation_time, delivery_time, gst_percent, rating, reviews_count
    ) VALUES (
      $1, 'sel_volthub_01', 'cat_ev-batteries',
      'VoltMax Lithium LiFePO4 Smart Battery Pack 60V 30Ah',
      'VoltMax Energy', 'VM-60V-30AH-PRO',
      'High-performance 60V 30Ah Lithium Iron Phosphate (LiFePO4) battery pack engineered with integrated Smart Bluetooth BMS, thermal runaway protection, and IP67 weather-sealed aluminum enclosure. Delivers 2000+ deep discharge cycles with 98% round-trip efficiency for high-torque electric two-wheelers.',
      32500, 38000, 14, 18, 1, 'VoltHub EV Components',
      'Smart BMS Series X', 'Aviation Grade Aluminum Alloy', 'Standard 60V Compartment',
      'vehicle-specific', '["Ather 450X", "Ola S1 Pro", "TVS iQube", "Bajaj Chetak"]'::jsonb,
      '["Matte Black", "Silver Aluminum"]'::jsonb,
      '• 2,000+ Deep Charge Cycles at 80% DOD\n• Smart Bluetooth Mobile App Telemetry (iOS & Android)\n• Built-in 60A Smart BMS with Over-voltage and Low-temp Cutoff\n• IP67 Waterproof & Dustproof Cast Aluminum Case',
      '36 Months Full Replacement',
      14.5,
      '/src/assets/battery-1.jpg',
      'approved', true,
      'EV Batteries & Power', 'Fixed', 'In Stock', 499,
      '45 Minutes Doorstep Fitting', '1–2 Business Days Express', 18.00, 4.8, 4
    )
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      price = EXCLUDED.price,
      mrp = EXCLUDED.mrp,
      stock = EXCLUDED.stock,
      verification_status = 'approved',
      is_active = true;
  `, [prod1Id]);

  // Product 1 Multi-Vendor Offers
  await pool.query("DELETE FROM product_offers WHERE product_id = $1", [prod1Id]);
  await pool.query(`
    INSERT INTO product_offers (
      id, product_id, vendor_id, price, mrp, stock, status, warranty_terms, shipping_charge, delivery_days, dispatch_hours
    ) VALUES 
    ('off_volthub_01', $1, 'sel_volthub_01', 32500, 38000, 18, 'active', '36 Months Manufacturer Warranty', 0, 'Same Day / 24h Express', 12),
    ('off_apex_02', $1, 'sel_apex_02', 33200, 38000, 7, 'active', '36 Months Manufacturer Warranty + 6 Mos Extended', 99, '2–3 Business Days', 24);
  `, [prod1Id]);

  // Product 1 Reviews
  await pool.query("DELETE FROM product_reviews WHERE product_id = $1", [prod1Id]);
  await pool.query(`
    INSERT INTO product_reviews (
      id, product_id, user_id, user_name, user_city, rating, title, comment, fitment_vehicle, is_verified_purchase, helpful_count, status
    ) VALUES 
    ('rev_01', $1, 'cst_aarav_01', 'Aarav Sharma', 'Bengaluru', 5, 'Unbelievable range boost on my Ola S1 Pro', 'Replaced my aging OEM battery with this VoltMax 60V pack. Getting solid 115km real-world range in City mode! The Bluetooth telemetry app connects smoothly and shows individual cell voltage. Highly recommended.', 'Ola S1 Pro', true, 12, 'published'),
    ('rev_02', $1, 'cst_priya_02', 'Priya Patel', 'Bengaluru', 5, 'Solid aluminum build and genuine 3-year warranty', 'Packaged with extreme care and shock mounts. VoltHub EV verified my bike fitment before dispatch. Battery runs noticeably cooler than lithium-ion during heavy summer afternoon rides.', 'Ather 450X', true, 8, 'published'),
    ('rev_03', $1, 'cst_vikram_03', 'Vikram Malhotra', 'Bengaluru', 4, 'Excellent performance, slight weight increase', 'The weight is around 14.5kg which is a couple kilos heavier than stock, but the longevity and cycle life of LiFePO4 makes it completely worth it. Instant throttle response.', 'TVS iQube', true, 5, 'published'),
    ('rev_04', $1, 'cst_rohit_04', 'Karthik Venkat', 'Chennai', 5, 'Best aftermarket EV battery in India', 'Delivered within 48 hours to Chennai. Voltage curve is completely flat until 15%. Superb craftsmanship.', 'Bajaj Chetak', true, 3, 'published');
  `, [prod1Id]);

  // Recalculate average rating & count on product 1
  await pool.query(`
    UPDATE products 
    SET rating = (SELECT ROUND(AVG(rating)::numeric, 1) FROM product_reviews WHERE product_id = $1),
        reviews_count = (SELECT COUNT(*) FROM product_reviews WHERE product_id = $1)
    WHERE id = $1;
  `, [prod1Id]);

  // Product 2: Rapid Smart Charger 72V 10A CAN-Bus
  const prod2Id = "RZP-CHG-72V10A";
  await pool.query(`
    INSERT INTO products (
      id, seller_id, category_id, name, brand, sku, description,
      price, mrp, discount_percent, stock, moq, supplier,
      variant_model, material, fitment_size, fitment_type,
      compatible_vehicles, color_options, key_features, warranty,
      weight_kg, image_url, verification_status, is_active,
      department, price_type, availability, installation_price,
      installation_time, delivery_time, gst_percent, rating, reviews_count
    ) VALUES (
      $1, 'sel_apex_02', 'cat_chargers',
      'Rapid Smart Fast Charger 72V 10A CAN-Bus Protocol',
      'ChargePro Tech', 'CP-72V10A-CAN',
      'Intelligent high-efficiency CC/CV multi-stage rapid charger with CAN-Bus communication for 60V/72V EV batteries. Features active dual fan cooling, short-circuit shutdown, and 0-80% fast charging in under 90 minutes.',
      7999, 9999, 20, 25, 1, 'Apex EV Spares & Batteries',
      'Ultra Fast 10A', 'Fire-Retardant Polycarbonate + Aluminum', 'Universal Portable',
      'universal', '["universal"]'::jsonb,
      '["Graphite Gray"]'::jsonb,
      '• 0 to 80% Fast Charge in 90 Minutes\n• Intelligent CAN-Bus Battery Communication\n• Active Dual Ball-Bearing Fan Thermal Dissipation\n• Auto Cut-off at 100% Full Charge to Prevent Overcharging',
      '24 Months Manufacturer Warranty',
      3.2,
      '/src/assets/charger.jpg',
      'approved', true,
      'EV Charging & Cables', 'Fixed', 'In Stock', 0,
      'Plug & Play', '1–2 Business Days', 18.00, 4.7, 3
    )
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      price = EXCLUDED.price,
      mrp = EXCLUDED.mrp,
      stock = EXCLUDED.stock,
      verification_status = 'approved',
      is_active = true;
  `, [prod2Id]);

  // Product 2 Reviews
  await pool.query("DELETE FROM product_reviews WHERE product_id = $1", [prod2Id]);
  await pool.query(`
    INSERT INTO product_reviews (
      id, product_id, user_id, user_name, user_city, rating, title, comment, fitment_vehicle, is_verified_purchase, helpful_count, status
    ) VALUES 
    ('rev_chg_01', $1, 'cst_aarav_01', 'Rohan Deshmukh', 'Pune', 5, 'Cuts charging time by more than half', 'Tested on my 72V 30Ah pack, charges from 20% to 80% in just under an hour and 20 mins. Fans are quiet and keep the aluminum heat sink cool.', 'Universal 72V', true, 6, 'published'),
    ('rev_chg_02', $1, 'cst_priya_02', 'Sneha Reddy', 'Hyderabad', 5, 'Compact and durable build', 'Great compact fast charger to carry in the underseat storage. Connector fits firmly and auto cutoff works accurately.', 'Universal EV', true, 4, 'published'),
    ('rev_chg_03', $1, 'cst_vikram_03', 'Aditya Verma', 'Bengaluru', 4, 'Works as advertised', 'Solid metal housing. Gets slightly warm during full 10A peak charging but cools down once CC phase switches to CV.', 'Universal EV', true, 2, 'published');
  `, [prod2Id]);

  await pool.query(`
    UPDATE products 
    SET rating = (SELECT ROUND(AVG(rating)::numeric, 1) FROM product_reviews WHERE product_id = $1),
        reviews_count = (SELECT COUNT(*) FROM product_reviews WHERE product_id = $1)
    WHERE id = $1;
  `, [prod2Id]);

  console.log("✓ Successfully seeded authentic sample products, offers, and verified reviews in PostgreSQL!");
  await pool.end();
}

seedRealProducts().catch(console.error);
