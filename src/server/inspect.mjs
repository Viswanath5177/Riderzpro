import pg from 'pg';

const client = new pg.Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'Vsvg@db1',
  database: 'riderzpro'
});

async function run() {
  await client.connect();
  const tables = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name;
  `);
  console.log('Tables:', tables.rows.map(r => r.table_name));

  for (const t of tables.rows) {
    const cols = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = $1
      ORDER BY ordinal_position;
    `, [t.table_name]);
    console.log(`\n=== Table: ${t.table_name} ===`);
    console.log(cols.rows.map(c => `  - ${c.column_name}: ${c.data_type} (nullable: ${c.is_nullable})`).join('\n'));
    
    const count = await client.query(`SELECT count(*) FROM "${t.table_name}"`);
    console.log(`  Count: ${count.rows[0].count} rows`);
  }
  await client.end();
}

run().catch(console.error);
