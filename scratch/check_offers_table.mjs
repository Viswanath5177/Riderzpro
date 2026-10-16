import pg from "pg";

const pool = new pg.Pool({
  connectionString: "postgresql://postgres:Vsvg%40db1@localhost:5432/riderzpro"
});

async function checkOffersTable() {
  const res = await pool.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'product_offers'
  `);
  console.log("product_offers cols:", res.rows);
  await pool.end();
}

checkOffersTable().catch(console.error);
