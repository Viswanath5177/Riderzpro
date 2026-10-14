import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString =
  process.env.DATABASE_URL ||
  `postgresql://${process.env.PGUSER || 'postgres'}:${encodeURIComponent(process.env.PGPASSWORD || 'Vsvg@db1')}@${process.env.PGHOST || 'localhost'}:${process.env.PGPORT || '5432'}/${process.env.PGDATABASE || 'riderzpro'}`;

const client = new pg.Client({
  connectionString
});

async function setup() {
  await client.connect();
  console.log('Connected to PostgreSQL riderzpro database.');

  // 1. Expand Products Table with first-class columns for all spreadsheet & fitment details
  console.log('Altering products table with additional columns...');
  await client.query(`
    ALTER TABLE products 
      ADD COLUMN IF NOT EXISTS brand VARCHAR(128) DEFAULT 'Riderz Armor',
      ADD COLUMN IF NOT EXISTS sku VARCHAR(64),
      ADD COLUMN IF NOT EXISTS mrp NUMERIC(12, 2),
      ADD COLUMN IF NOT EXISTS discount_percent INT DEFAULT 0,
      ADD COLUMN IF NOT EXISTS moq INT DEFAULT 1,
      ADD COLUMN IF NOT EXISTS supplier VARCHAR(255),
      ADD COLUMN IF NOT EXISTS variant_model VARCHAR(255),
      ADD COLUMN IF NOT EXISTS material VARCHAR(255),
      ADD COLUMN IF NOT EXISTS fitment_size VARCHAR(255),
      ADD COLUMN IF NOT EXISTS fitment_type VARCHAR(64) DEFAULT 'specific',
      ADD COLUMN IF NOT EXISTS compatible_vehicles JSONB DEFAULT '["ola-s1pro", "ather-450x", "tata-nexon-ev"]'::jsonb,
      ADD COLUMN IF NOT EXISTS color_options JSONB DEFAULT '["Black", "Beige"]'::jsonb,
      ADD COLUMN IF NOT EXISTS key_features TEXT,
      ADD COLUMN IF NOT EXISTS warranty VARCHAR(128),
      ADD COLUMN IF NOT EXISTS weight_kg NUMERIC(6, 2) DEFAULT 4.5;
  `);

  // 2. Insert or Update all Categories
  console.log('Upserting platform categories...');
  const categoriesList = [
    { id: 'cat_batteries', name: 'EV Batteries (Lithium & LFP)', slug: 'ev-batteries' },
    { id: 'cat_chargers', name: 'Smart Chargers & Converters', slug: 'smart-chargers' },
    { id: 'cat_accessories', name: 'Vehicle Accessories & Mounts', slug: 'vehicle-accessories' },
    { id: 'cat_bms', name: 'Battery Management Systems (BMS)', slug: 'bms' },
    { id: 'cat_motors', name: 'EV BLDC Motors & Drivetrain', slug: 'motors' },
    { id: 'cat_controllers', name: 'Motor Controllers & Throttle', slug: 'controllers' },
    { id: 'cat_brakes', name: 'Braking & Safety Parts', slug: 'brakes' },
    { id: 'cat_parts', name: 'Spare Parts & OEM Components', slug: 'spare-parts' },
    { id: 'cat_vehicles', name: 'Electric Scooters & Bikes', slug: 'electric-bikes' },
  ];

  for (const cat of categoriesList) {
    await client.query(`
      INSERT INTO categories (id, name, slug)
      VALUES ($1, $2, $3)
      ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug
    `, [cat.id, cat.name, cat.slug]);
  }

  // 3. Create customer_garage table for Customer Garage Page
  console.log('Creating customer_garage table...');
  await client.query(`
    CREATE TABLE IF NOT EXISTS customer_garage (
      id VARCHAR(64) PRIMARY KEY DEFAULT ('gar_' || substr(md5(random()::text || clock_timestamp()::text), 1, 16)),
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

  // 4. Create service_bookings table for Doorstep Technicians / Bookings
  console.log('Creating service_bookings table...');
  await client.query(`
    CREATE TABLE IF NOT EXISTS service_bookings (
      id VARCHAR(64) PRIMARY KEY DEFAULT ('bk_' || substr(md5(random()::text || clock_timestamp()::text), 1, 16)),
      customer_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      vehicle_id VARCHAR(64),
      service_type VARCHAR(128) NOT NULL,
      scheduled_date DATE,
      scheduled_slot VARCHAR(64),
      address TEXT,
      notes TEXT,
      status VARCHAR(32) DEFAULT 'pending',
      total_amount NUMERIC(12, 2) DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_service_bookings_customer ON service_bookings(customer_id);
  `);

  // 5. Create saved_items table (Wishlist)
  console.log('Creating saved_items table...');
  await client.query(`
    CREATE TABLE IF NOT EXISTS saved_items (
      id VARCHAR(64) PRIMARY KEY DEFAULT ('save_' || substr(md5(random()::text || clock_timestamp()::text), 1, 16)),
      customer_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      product_id VARCHAR(64) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(customer_id, product_id)
    );
    CREATE INDEX IF NOT EXISTS idx_saved_items_customer ON saved_items(customer_id);
  `);

  // 6. Seed Customer Garage with Initial Demo Vehicles for usr_customer_demo
  console.log('Checking customer_garage seed data...');
  const garageCount = await client.query(`SELECT count(*) FROM customer_garage WHERE customer_id = 'usr_customer_demo'`);
  if (parseInt(garageCount.rows[0].count) === 0) {
    console.log('Seeding customer_garage for usr_customer_demo...');
    await client.query(`
      INSERT INTO customer_garage (id, customer_id, vehicle_id, make, model, year, vin, vehicle_type, voltage, battery_kwh, is_active)
      VALUES 
        ('gar_ola_s1pro', 'usr_customer_demo', 'ola-s1pro', 'Ola', 'S1 Pro Gen 2', 2023, 'P6R1S1PR2PN000001', 'bike', 60, 4.0, TRUE),
        ('gar_ather_450x', 'usr_customer_demo', 'ather-450x', 'Ather', '450X Gen 3', 2024, 'MD9A450XAN1234567', 'bike', 48, 3.7, FALSE),
        ('gar_tata_nexon', 'usr_customer_demo', 'tata-nexon-ev', 'Tata', 'Nexon.ev Empowered', 2024, 'MAT1234NEXON56789', 'car', 400, 40.5, FALSE);
    `);
  }

  // Ensure seller users exist in users table so products_seller_id_fkey is satisfied
  await client.query(`
    INSERT INTO users (id, email, phone, password_hash, full_name, role)
    VALUES ('usr_seller_01', 'seller@volthub.com', '+91 91111 22222', '$2a$10$dummyHashForSeller01SeedPlaceholder', 'VoltHub Indiranagar', 'seller')
    ON CONFLICT (email) DO NOTHING;
  `);

  // 7. Seed Initial Catalog Products if products table only has 1 or few items
  const productCount = await client.query(`SELECT count(*) FROM products`);
  console.log(`Current products in DB: ${productCount.rows[0].count}`);
  
  // Seed sample products matching our pages so the customer garage immediately has rich parts
  const initialProductsSeed = [
    {
      id: 'prod_rzp_sc_001',
      seller_id: 'usr_seller_01',
      category_id: 'cat_accessories',
      name: 'Custom Fit Leatherette Seat Cover',
      brand: 'Riderz Armor',
      sku: 'RZP-SC-001',
      description: 'Custom-fit PU leatherette automotive seat cover with airbag compatible stitching and high durability finish.',
      price: 3499,
      mrp: 4999,
      discount_percent: 30,
      stock: 45,
      moq: 1,
      supplier: 'Autotech Premium Ltd.',
      variant_model: 'Custom Fit Leatherette Seat Cover',
      material: 'PU leatherette',
      fitment_size: 'Model specific (Swift, Creta, Nexon)',
      fitment_type: 'specific',
      compatible_vehicles: JSON.stringify(['tata-nexon-ev', 'ola-s1pro', 'ather-450x']),
      color_options: JSON.stringify(['Black', 'Beige', 'Black-Red', 'Tan']),
      key_features: 'Exact fit, airbag compatible stitching, perforated breathable texture',
      warranty: '1 Year Replacement',
      image_url: '/src/assets/parts.jpg',
      verification_status: 'approved'
    },
    {
      id: 'prod_rzp_sc_002',
      seller_id: 'usr_seller_01',
      category_id: 'cat_accessories',
      name: 'Custom Fit Fabric Breathable Seat Cover',
      brand: 'ComfortCraft Auto',
      sku: 'RZP-SC-002',
      description: 'Breathable Jacquard velvet automotive fabric seat cover engineered for hot climates.',
      price: 2499,
      mrp: 3499,
      discount_percent: 28,
      stock: 30,
      moq: 1,
      supplier: 'ComfortCraft Auto',
      variant_model: 'Custom Fit Fabric Seat Cover',
      material: 'Jacquard / velvet fabric',
      fitment_size: 'Model specific',
      fitment_type: 'specific',
      compatible_vehicles: JSON.stringify(['tata-nexon-ev', 'ola-s1pro']),
      color_options: JSON.stringify(['Grey', 'Black', 'Beige']),
      key_features: 'Breathable, good for hot climate, dust resistant',
      warranty: '1 Year Warranty',
      image_url: '/src/assets/parts.jpg',
      verification_status: 'approved'
    },
    {
      id: 'prod_volt_60v_30ah',
      seller_id: 'usr_seller_01',
      category_id: 'cat_batteries',
      name: 'VoltRide 60V 30Ah Li-ion Battery Pack',
      brand: 'VoltRide',
      sku: 'VR-60V-30AH',
      description: 'High-density NMC pack with smart Bluetooth BMS, IP67 casing and fast-charge support.',
      price: 59520,
      mrp: 68000,
      discount_percent: 12,
      stock: 14,
      moq: 1,
      supplier: 'VoltRide Tech',
      variant_model: '60V 30Ah NMC Module',
      material: 'Aviation Aluminum IP67',
      fitment_size: 'OEM Bay Mount',
      fitment_type: 'specific',
      compatible_vehicles: JSON.stringify(['ola-s1pro', 'bajaj-chetak', 'hero-vida-v1']),
      color_options: JSON.stringify(['Black', 'Silver']),
      key_features: 'Smart Bluetooth telemetry, 2000+ cycle life, active thermal runaway guard',
      warranty: '3 Years Comprehensive',
      image_url: '/src/assets/battery-1.jpg',
      verification_status: 'approved'
    },
    {
      id: 'prod_chargemax_3kw',
      seller_id: 'usr_seller_01',
      category_id: 'cat_chargers',
      name: 'ChargeMax 3.3kW Portable Fast Charger',
      brand: 'ChargeMax',
      sku: 'CM-3300-FAST',
      description: '3.3kW portable fast charger with intelligent cut-off, dual cooling fans and LED screen.',
      price: 13920,
      mrp: 16500,
      discount_percent: 15,
      stock: 22,
      moq: 1,
      supplier: 'ChargeMax Electronics',
      variant_model: '3.3kW Level-2 Portable',
      material: 'Flame Retardant Polycarbonate',
      fitment_size: 'Compact Trunk Fit',
      fitment_type: 'universal',
      compatible_vehicles: JSON.stringify(['ola-s1pro', 'ather-450x', 'tata-nexon-ev', 'bajaj-chetak']),
      color_options: JSON.stringify(['Black']),
      key_features: 'Overvoltage surge protection, auto cut-off at 100%, IP65 weather resistant',
      warranty: '2 Years Replacement',
      image_url: '/src/assets/charger.jpg',
      verification_status: 'approved'
    },
    {
      id: 'prod_brembo_rotor',
      seller_id: 'usr_seller_01',
      category_id: 'cat_brakes',
      name: 'Wave Disc Brake Rotor 220mm High Heat Dissipation',
      brand: 'Brembo',
      sku: 'BR-WAVE-220',
      description: 'Premium stainless steel wave disc rotor engineered for heavy regenerative deceleration.',
      price: 2300,
      mrp: 2900,
      discount_percent: 20,
      stock: 35,
      moq: 1,
      supplier: 'Brembo Racing Ind.',
      variant_model: '220mm Wave Performance',
      material: '420 High Carbon Stainless Steel',
      fitment_size: '220mm 4-Bolt OEM Hub',
      fitment_type: 'specific',
      compatible_vehicles: JSON.stringify(['ola-s1pro', 'ather-450x', 'revolt-rv400', 'tvs-iqube']),
      color_options: JSON.stringify(['Silver', 'Gold Accent']),
      key_features: 'Wave contour cooling slots, zero brake fade, anti-corrosion electroplate',
      warranty: '1 Year Warranty',
      image_url: '/src/assets/parts.jpg',
      verification_status: 'approved'
    },
    {
      id: 'prod_volt_smart_chg_60v',
      seller_id: 'usr_demo_02',
      category_id: 'cat_chargers',
      name: 'Smart 60V 5A Fast Charger Auto Cut-Off',
      brand: 'VoltPro Tech',
      sku: 'VPT-60V-5A',
      description: 'Intelligent high-efficiency EV scooter battery charger with dynamic temperature control and auto shut-off.',
      price: 2899,
      mrp: 3499,
      discount_percent: 17,
      stock: 25,
      moq: 1,
      supplier: "GATTIKOPPULA NAGA VAMSI SUBBARAYUDU's Auto Parts",
      variant_model: '60V 5A Dual Fan Smart',
      material: 'Aluminum Extrusion IP54',
      fitment_size: 'Universal Trunk / Bag',
      fitment_type: 'universal',
      compatible_vehicles: JSON.stringify(['ola-s1pro', 'ather-450x', 'bajaj-chetak', 'tvs-iqube']),
      color_options: JSON.stringify(['Matte Black']),
      key_features: 'Over-voltage protection, auto cut-off, active dual fan cooling',
      warranty: '1 Year Comprehensive',
      image_url: '/src/assets/charger.jpg',
      verification_status: 'pending_approval'
    },
    {
      id: 'prod_brembo_ceramic_pads',
      seller_id: 'usr_demo_02',
      category_id: 'cat_brakes',
      name: 'Sintered Ceramic Brake Pad Kit (Front & Rear)',
      brand: 'Brembo Racing',
      sku: 'BRM-CP-002',
      description: 'High-friction sintered ceramic disc brake pad set engineered for heavy regenerative deceleration on modern EV scooters.',
      price: 1499,
      mrp: 1899,
      discount_percent: 21,
      stock: 40,
      moq: 1,
      supplier: "GATTIKOPPULA NAGA VAMSI SUBBARAYUDU's Auto Parts",
      variant_model: 'Ceramic Composite Heavy Duty',
      material: 'Copper-free Ceramic Composite',
      fitment_size: 'OEM Caliper Direct Fit',
      fitment_type: 'specific',
      compatible_vehicles: JSON.stringify(['ather-450x', 'ola-s1pro', 'hero-vida-v1']),
      color_options: JSON.stringify(['Gold Backplate']),
      key_features: 'Zero brake fade, rotor-friendly formulation, low dust',
      warranty: '6 Months Replacement',
      image_url: '/src/assets/parts.jpg',
      verification_status: 'pending_approval'
    }
  ];

  for (const p of initialProductsSeed) {
    await client.query(`
      INSERT INTO products (
        id, seller_id, category_id, name, brand, sku, description,
        price, mrp, discount_percent, stock, moq, supplier,
        variant_model, material, fitment_size, fitment_type,
        compatible_vehicles, color_options, key_features, warranty,
        image_url, verification_status, is_active
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13,
        $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, TRUE
      )
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        brand = EXCLUDED.brand,
        sku = EXCLUDED.sku,
        description = EXCLUDED.description,
        price = EXCLUDED.price,
        mrp = EXCLUDED.mrp,
        discount_percent = EXCLUDED.discount_percent,
        stock = EXCLUDED.stock,
        moq = EXCLUDED.moq,
        supplier = EXCLUDED.supplier,
        variant_model = EXCLUDED.variant_model,
        material = EXCLUDED.material,
        fitment_size = EXCLUDED.fitment_size,
        fitment_type = EXCLUDED.fitment_type,
        compatible_vehicles = EXCLUDED.compatible_vehicles,
        color_options = EXCLUDED.color_options,
        key_features = EXCLUDED.key_features,
        warranty = EXCLUDED.warranty,
        image_url = EXCLUDED.image_url,
        verification_status = EXCLUDED.verification_status;
    `, [
      p.id, p.seller_id, p.category_id, p.name, p.brand, p.sku, p.description,
      p.price, p.mrp, p.discount_percent, p.stock, p.moq, p.supplier,
      p.variant_model, p.material, p.fitment_size, p.fitment_type,
      p.compatible_vehicles, p.color_options, p.key_features, p.warranty,
      p.image_url, p.verification_status
    ]);
  }

  // Create vendor_notifications table for approval/rejection and order alerts
  await client.query(`
    CREATE TABLE IF NOT EXISTS vendor_notifications (
      id VARCHAR(64) PRIMARY KEY DEFAULT ('vnotif_' || substr(md5(random()::text || clock_timestamp()::text), 1, 16)),
      seller_id VARCHAR(64) NOT NULL,
      title VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      type VARCHAR(64) NOT NULL,
      product_id VARCHAR(64),
      is_read BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_vendor_notifications_seller ON vendor_notifications(seller_id);
  `);

  console.log('Database tables successfully verified and seeded!');
  await client.end();
}

setup().catch((err) => {
  console.error('Error during setup:', err);
  process.exit(1);
});
