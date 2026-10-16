import pg from "pg";

const pool = new pg.Pool({
  connectionString: "postgresql://postgres:Vsvg%40db1@localhost:5432/riderzpro"
});

async function checkUsers() {
  const res = await pool.query("SELECT id, email, role FROM users WHERE role = 'seller' OR role = 'admin' LIMIT 10");
  console.log(res.rows);
  await pool.end();
}

checkUsers().catch(console.error);
