import pg from "pg";

const pool = new pg.Pool({ connectionString: "postgresql://postgres:Vsvg%40db1@localhost:5432/riderzpro" });

async function run() {
  await pool.query("ALTER TYPE admin_role_enum ADD VALUE IF NOT EXISTS 'ADMIN';");
  console.log("✓ Added ADMIN to admin_role_enum");
  await pool.end();
}

run().catch(console.error);
