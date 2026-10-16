import pg from "pg";

const pool = new pg.Pool({
  connectionString: "postgresql://postgres:Vsvg%40db1@localhost:5432/riderzpro"
});

async function checkSellers() {
  const res = await pool.query(`
    SELECT column_name, data_type, is_nullable
    FROM information_schema.columns
    WHERE table_name = 'sellers'
    ORDER BY ordinal_position
  `);
  console.table(res.rows);
  await pool.end();
}

checkSellers().catch(console.error);
