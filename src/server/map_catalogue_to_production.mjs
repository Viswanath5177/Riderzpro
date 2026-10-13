import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:Vsvg%40db1@localhost:5432/riderzpro'
});

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

function parseNumber(val) {
  if (!val) return null;
  const cleaned = String(val).replace(/[^0-9.]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

function parseInteger(val) {
  if (!val) return null;
  const cleaned = String(val).replace(/[^0-9]/g, '');
  const num = parseInt(cleaned, 10);
  return isNaN(num) ? null : num;
}

export async function mapCatalogueToProduction() {
  await client.connect();
  console.log('[Migration] Starting Riderzpro Catalogue Mapping to Production Tables...');

  // 1. Ensure required columns in categories
  await client.query(`
    ALTER TABLE categories ADD COLUMN IF NOT EXISTS department VARCHAR(128);
  `);

  // 2. Ensure required columns in products
  await client.query(`
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

  // 3. Ensure default seller exists in users
  await client.query(`
    INSERT INTO users (id, email, phone, password_hash, full_name, role, store_name, is_active)
    VALUES ('usr_seller_01', 'seller@riderzpro.com', '+91 98450 11223', 'hash', 'Riderzpro Official', 'seller', 'Riderzpro Official Store', TRUE)
    ON CONFLICT (id) DO NOTHING;
  `);

  // 4. Extract and sync Categories
  const catRows = await client.query(`
    SELECT DISTINCT "Category", "Department"
    FROM riderzpro_catalogue_import
    WHERE "Category" IS NOT NULL AND "Category" != ''
    ORDER BY "Category";
  `);

  const categoryMap = new Map(); // Category Name -> category_id

  for (const row of catRows.rows) {
    const catName = row.Category.trim();
    const dept = row.Department ? row.Department.trim() : null;
    let slug = slugify(catName);
    if (!slug) slug = 'general';
    const catId = `cat_${slug.substring(0, 50)}`;

    await client.query(`
      INSERT INTO categories (id, name, slug, department)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        department = COALESCE(EXCLUDED.department, categories.department)
      RETURNING id;
    `, [catId, catName, slug, dept]);

    // Query exact id
    const existing = await client.query(`SELECT id FROM categories WHERE slug = $1 LIMIT 1`, [slug]);
    if (existing.rows.length > 0) {
      categoryMap.set(catName, existing.rows[0].id);
    } else {
      categoryMap.set(catName, catId);
    }
  }

  console.log(`[Migration] Synced ${categoryMap.size} categories.`);

  // 5. Read all 508 products from staging table
  const importRows = await client.query(`
    SELECT * FROM riderzpro_catalogue_import
    ORDER BY "Product ID";
  `);

  console.log(`[Migration] Processing ${importRows.rows.length} products from riderzpro_catalogue_import...`);

  let insertedCount = 0;
  let updatedCount = 0;

  for (const item of importRows.rows) {
    const productId = item["Product ID"];
    const productName = item["Product"] || productId;
    const brand = item["Brand"] || "Riderzpro";
    const categoryName = item["Category"]?.trim();
    const categoryId = categoryMap.get(categoryName) || "cat_accessories";

    const sellingPrice = parseNumber(item["Selling price (INR)"]);
    const mrp = parseNumber(item["MRP (INR)"]);
    const price = sellingPrice !== null ? sellingPrice : (mrp !== null ? mrp : 0.00);

    let discount = 0;
    if (mrp && price && mrp > price) {
      discount = Math.round(((mrp - price) / mrp) * 100);
    }

    let stock = parseInteger(item["Stock (units)"]);
    if (stock === null) {
      stock = item["Availability"] === "In stock" ? 25 : 0;
    }

    const fitment = item["Fitment"] || "Universal";
    const isUniversal = /universal/i.test(fitment);
    const fitmentType = isUniversal ? "universal" : "vehicle_specific";

    let compatibleVehicles = ["universal"];
    if (!isUniversal && fitment) {
      compatibleVehicles = fitment
        .split(/[,/;\n]+/)
        .map((s) => s.trim().toLowerCase())
        .filter((s) => s.length > 0 && !s.includes("per ") && !s.includes("universal"));
      if (compatibleVehicles.length === 0) compatibleVehicles = ["universal"];
    }

    let colorOptions = [];
    if (item["Options"]) {
      colorOptions = item["Options"]
        .split(/[,;]+/)
        .map((s) => s.trim())
        .filter(Boolean);
    }

    const listingStatus = item["Listing status"] || "Listed";
    const isListed = listingStatus.toLowerCase() === "listed";
    const verificationStatus = isListed ? "approved" : "pending_approval";
    const isActive = isListed;

    const imageUrl = item["Image 1"] || item["Primary image reference"] || item["Image 2"] || null;
    const image2 = item["Image 2"] || null;
    const isBestseller = (item["Bestseller"] || "").toLowerCase() === "true";
    const rating = parseNumber(item["Rating"]);
    const reviews = parseInteger(item["Reviews"]) || 0;
    const installPrice = parseNumber(item["Installation price (INR)"]);

    const description = item["Description"] || item["Merged catalogue details"] || item["Features"] || "";
    const keyFeatures = item["Features"] || item["Additional specifications"] || "";

    const upsertSql = `
      INSERT INTO products (
        id, seller_id, category_id, name, brand, sku, description,
        price, mrp, discount_percent, stock, moq, supplier, variant_model,
        material, fitment_size, fitment_type, compatible_vehicles, color_options,
        key_features, warranty, weight_kg, image_url, image_2,
        verification_status, is_active,
        vehicle_type, department, price_type, availability,
        installation_price, installation_time, delivery_time,
        rating, reviews_count, is_bestseller, additional_specs, missing_details, listing_status,
        created_at, updated_at
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10, $11, $12, $13, $14,
        $15, $16, $17, $18, $19,
        $20, $21, $22, $23, $24,
        $25, $26,
        $27, $28, $29, $30,
        $31, $32, $33,
        $34, $35, $36, $37, $38, $39,
        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      )
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
        color_options = EXCLUDED.color_options,
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
    `;

    const params = [
      productId,
      'usr_seller_01',
      categoryId,
      productName,
      brand,
      item["Model / SKU"] || productId,
      description,
      price,
      mrp,
      discount,
      stock,
      1, // moq
      brand, // supplier
      item["Model / SKU"],
      item["Options"] || null, // material / options
      item["Fitment"], // fitment_size
      fitmentType,
      JSON.stringify(compatibleVehicles),
      JSON.stringify(colorOptions),
      keyFeatures,
      item["Warranty"],
      2.0, // weight_kg
      imageUrl,
      image2,
      verificationStatus,
      isActive,
      item["Vehicle type"],
      item["Department"],
      item["Price type"],
      item["Availability"],
      installPrice,
      item["Installation time"],
      item["Delivery"],
      rating,
      reviews,
      isBestseller,
      item["Additional specifications"],
      item["Missing details"],
      listingStatus
    ];

    await client.query(upsertSql, params);
    insertedCount++;
  }

  console.log(`[Migration] Successfully mapped and synced ${insertedCount} products to the production 'products' table.`);

  // Validation query
  const check = await client.query(`
    SELECT 
      count(*) as total,
      count(*) FILTER (WHERE is_active = true) as active_count,
      count(*) FILTER (WHERE verification_status = 'approved') as approved_count,
      count(*) FILTER (WHERE verification_status = 'pending_approval') as pending_count
    FROM products;
  `);

  console.log('[Migration] Production products table verification:', check.rows[0]);

  await client.end();
}

mapCatalogueToProduction().catch((err) => {
  console.error('[Migration Error]:', err);
  process.exit(1);
});
