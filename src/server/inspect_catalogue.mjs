import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL
});

async function run() {
  await client.connect();

  const colsRes = await client.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'riderzpro_catalogue_import'
    ORDER BY ordinal_position;
  `);
  console.log('Columns in riderzpro_catalogue_import:');
  console.log(colsRes.rows.map(r => `${r.column_name} (${r.data_type})`));

  const total = await client.query('SELECT count(*) FROM riderzpro_catalogue_import');
  console.log('\nTotal count:', total.rows[0].count);

  const stats = await client.query(`
    SELECT 
      count(*) FILTER (WHERE "Selling price (INR)" IS NOT NULL AND "Selling price (INR)" != '') as has_selling_price,
      count(*) FILTER (WHERE "MRP (INR)" IS NOT NULL AND "MRP (INR)" != '') as has_mrp,
      count(*) FILTER (WHERE "Image 1" IS NOT NULL AND "Image 1" != '') as has_image_1,
      count(*) FILTER (WHERE "Description" IS NOT NULL AND "Description" != '') as has_description,
      count(*) FILTER (WHERE "Features" IS NOT NULL AND "Features" != '') as has_features,
      count(*) FILTER (WHERE "Listing status" = 'Listed') as listed_count,
      count(*) FILTER (WHERE "Listing status" = 'Planned') as planned_count,
      count(*) FILTER (WHERE "Listing status" = 'Held back') as held_back_count
    FROM riderzpro_catalogue_import;
  `);
  console.log('\nStats:', stats.rows[0]);

  // Let's inspect unique departments and categories
  const deptCat = await client.query(`
    SELECT "Department", count(DISTINCT "Category") as cat_count, count(*) as prod_count
    FROM riderzpro_catalogue_import
    GROUP BY "Department"
    ORDER BY prod_count DESC;
  `);
  console.log('\nDepartments breakdown:');
  console.log(deptCat.rows);

  // Check categories that exist in our categories table vs import
  const currentCats = await client.query('SELECT id, name, slug FROM categories;');
  console.log('\nCurrent production categories:');
  console.log(currentCats.rows);

  // Check products table
  const prodCount = await client.query('SELECT count(*) FROM products;');
  console.log('\nCurrent products table count:', prodCount.rows[0].count);

  await client.end();
}

run().catch(console.error);
