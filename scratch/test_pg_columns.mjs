import pg from "pg";

const pool = new pg.Pool({
  connectionString: "postgresql://postgres:Vsvg%40db1@localhost:5432/riderzpro"
});

async function checkCols() {
  const res = await pool.query(`
    SELECT column_name, data_type, udt_name, is_nullable
    FROM information_schema.columns
    WHERE table_name = 'products'
    ORDER BY ordinal_position
  `);
  console.table(res.rows);
  await pool.end();
}

checkCols().catch(console.error);
