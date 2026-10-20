import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:Vsvg%40db1@localhost:5432/riderzpro",
});

async function inspect() {
  console.log("=================================================");
  console.log("   LOCAL DATABASE SCHEMA & INVENTORY INSPECTION");
  console.log("=================================================\n");

  const serverInfo = await pool.query(`
    SELECT 
      current_database() AS db_name,
      current_user AS db_user,
      version() AS pg_version
  `);
  console.log("Server Info:", serverInfo.rows[0]);

  // Tables & row counts
  const tables = await pool.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    ORDER BY table_name;
  `);

  console.log(`\nFound ${tables.rows.length} base tables:`);
  const tableCounts = [];

  for (const t of tables.rows) {
    const tName = t.table_name;
    try {
      const cRes = await pool.query(`SELECT COUNT(*) as count FROM "${tName}"`);
      const count = parseInt(cRes.rows[0].count, 10);
      tableCounts.push({ table: tName, rows: count });
      console.log(`  - ${tName.padEnd(35)}: ${count} rows`);
    } catch (e) {
      console.log(`  - ${tName.padEnd(35)}: error (${e.message})`);
    }
  }

  // Sequences
  const seqs = await pool.query(`
    SELECT sequence_name 
    FROM information_schema.sequences 
    WHERE sequence_schema = 'public';
  `);
  console.log(`\nSequences (${seqs.rows.length}):`, seqs.rows.map(s => s.sequence_name));

  // Foreign keys
  const fks = await pool.query(`
    SELECT
      tc.constraint_name,
      tc.table_name, 
      kcu.column_name, 
      ccu.table_name AS foreign_table_name,
      ccu.column_name AS foreign_column_name 
    FROM information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
    WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema = 'public'
    ORDER BY tc.table_name;
  `);
  console.log(`\nForeign Key Constraints (${fks.rows.length}):`);
  for (const fk of fks.rows) {
    console.log(`  - ${fk.table_name}.${fk.column_name} -> ${fk.foreign_table_name}.${fk.foreign_column_name} (${fk.constraint_name})`);
  }

  // Indexes
  const idxs = await pool.query(`
    SELECT indexname, tablename, indexdef
    FROM pg_indexes
    WHERE schemaname = 'public'
    ORDER BY tablename, indexname;
  `);
  console.log(`\nIndexes count: ${idxs.rows.length}`);

  await pool.end();
}

inspect().catch(console.error);
