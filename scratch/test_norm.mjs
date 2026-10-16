import pg from "pg";

const pool = new pg.Pool({
  connectionString: "postgresql://postgres:Vsvg%40db1@localhost:5432/riderzpro"
});

function translateToPostgres(text) {
  return text
    .replace(/datetime\('now',\s*'([+-]?)(\d+)\s*(minutes?|seconds?|hours?|days?)'\)/gi, (_m, sign, amount, unit) => {
      const s = sign === '-' ? '-' : '+';
      return `(CURRENT_TIMESTAMP ${s} INTERVAL '${amount} ${unit.toLowerCase()}')`;
    })
    .replace(/datetime\('now'\)/gi, 'CURRENT_TIMESTAMP')
    .replace(/\b(is_active|is_verified|is_read|is_bestseller|is_default)\s*=\s*1\b/gi, '$1 = true')
    .replace(/\b(is_active|is_verified|is_read|is_bestseller|is_default)\s*=\s*0\b/gi, '$1 = false')
    .replace(/\b(is_active|is_verified|is_read|is_bestseller|is_default)\s*!=\s*0\b/gi, '$1 = true')
    .replace(/\b(is_active|is_verified|is_read|is_bestseller|is_default)\s*!=\s*1\b/gi, '$1 = false');
}

async function testAll() {
  const q1 = translateToPostgres("SELECT * FROM sellers WHERE id = $1 AND is_active = 1 LIMIT 1");
  const r1 = await pool.query(q1, ["sel_volthub_01"]);
  console.log("Q1 Sellers:", r1.rows.length, "store:", r1.rows[0]?.store_name);

  const q2 = translateToPostgres("SELECT id FROM notifications WHERE created_at > datetime('now', '-5 minutes')");
  const r2 = await pool.query(q2);
  console.log("Q2 Notifications within 5 min:", r2.rows.length);

  const q3 = translateToPostgres("SELECT COUNT(*) as c FROM customers WHERE is_active = 1");
  const r3 = await pool.query(q3);
  console.log("Q3 Active customers count:", r3.rows[0]?.c);

  await pool.end();
}

testAll().catch(console.error);
