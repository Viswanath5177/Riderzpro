import pg from "pg";

const pool = new pg.Pool({ connectionString: "postgresql://postgres:Vsvg%40db1@localhost:5432/riderzpro" });

async function check() {
  const uCols = await pool.query(`
    SELECT column_name, udt_name 
    FROM information_schema.columns 
    WHERE table_name = 'users';
  `);
  console.log("PostgreSQL users columns:");
  uCols.rows.forEach(r => console.log(`  ${r.column_name}: ${r.udt_name}`));
  await pool.end();
}

check().catch(console.error);
