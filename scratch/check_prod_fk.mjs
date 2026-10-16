import pg from "pg";

const pool = new pg.Pool({
  connectionString: "postgresql://postgres:Vsvg%40db1@localhost:5432/riderzpro"
});

async function checkFk() {
  const res = await pool.query(`
    SELECT
      tc.constraint_name, 
      kcu.column_name, 
      ccu.table_name AS foreign_table_name,
      ccu.column_name AS foreign_column_name 
    FROM information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
    WHERE tc.table_name = 'products' AND tc.constraint_type = 'FOREIGN KEY';
  `);
  console.table(res.rows);
  await pool.end();
}

checkFk().catch(console.error);
