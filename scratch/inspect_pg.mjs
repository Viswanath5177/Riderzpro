import pg from "pg";

const connStr = "postgresql://postgres:Vsvg%40db1@localhost:5432/riderzpro";
const pool = new pg.Pool({ connectionString: connStr });

async function check() {
  const tables = await pool.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name;
  `);
  console.log("PostgreSQL tables in riderzpro database:");
  for (const r of tables.rows) {
    try {
      const c = await pool.query(`SELECT COUNT(*) as c FROM "${r.table_name}"`);
      console.log(`  ${r.table_name}: ${c.rows[0].c}`);
    } catch (e) {
      console.log(`  ${r.table_name}: (error: ${e.message})`);
    }
  }

  // Check users, admins, sellers
  try {
    const users = await pool.query("SELECT id, email, role, full_name FROM users");
    console.log("\nUsers in PostgreSQL users table:", users.rows.length);
    console.table(users.rows);
  } catch (e) {
    console.log("Users query error:", e.message);
  }

  try {
    const sellers = await pool.query("SELECT id, email, store_name, status FROM sellers");
    console.log("\nSellers in PostgreSQL sellers table:", sellers.rows.length);
    console.table(sellers.rows);
  } catch (e) {
    console.log("Sellers query error:", e.message);
  }

  await pool.end();
}

check().catch(console.error);
