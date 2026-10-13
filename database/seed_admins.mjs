import bcrypt from "bcryptjs";
import crypto from "crypto";
import pg from "pg";

async function seed() {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

  // Clear previous attempt rows for riderzpro@
  await pool.query("DELETE FROM admins WHERE email LIKE 'riderzpro@%'");
  await pool.query("DELETE FROM users WHERE email LIKE 'riderzpro@%'");

  const admins = [
    { email: "riderzpro@productadmin1", pass: "riderzpro@product1", name: "Product Admin 1", role: "PRODUCT_ADMIN", phone: "+91 99000 00001", altPhone: "+91 99001 00001" },
    { email: "riderzpro@productadmin2", pass: "riderzpro@product2", name: "Product Admin 2", role: "PRODUCT_ADMIN", phone: "+91 99000 00002", altPhone: "+91 99001 00002" },
    { email: "riderzpro@productadmin3", pass: "riderzpro@product3", name: "Product Admin 3", role: "PRODUCT_ADMIN", phone: "+91 99000 00003", altPhone: "+91 99001 00003" },
    { email: "riderzpro@selleradmin1", pass: "riderzpro@seller1", name: "Seller Admin 1", role: "SELLER_ADMIN", phone: "+91 99000 00004", altPhone: "+91 99001 00004" },
    { email: "riderzpro@selleradmin2", pass: "riderzpro@seller2", name: "Seller Admin 2", role: "SELLER_ADMIN", phone: "+91 99000 00005", altPhone: "+91 99001 00005" },
    { email: "riderzpro@selleradmin3", pass: "riderzpro@seller3", name: "Seller Admin 3", role: "SELLER_ADMIN", phone: "+91 99000 00006", altPhone: "+91 99001 00006" },
  ];

  for (const item of admins) {
    const hash = await bcrypt.hash(item.pass, 10);

    const variants = [
      { em: item.email, ph: item.phone },
      { em: item.email + ".com", ph: item.altPhone }
    ];

    for (const { em, ph } of variants) {
      const hashId = crypto.createHash("md5").update(em).digest("hex").slice(0, 16);
      const adminId = "adm_" + hashId;
      await pool.query(
        `INSERT INTO admins (id, email, password_hash, full_name, role, is_active)
         VALUES ($1, $2, $3, $4, $5, true)
         ON CONFLICT (email) DO UPDATE 
         SET password_hash = EXCLUDED.password_hash,
             full_name = EXCLUDED.full_name,
             role = EXCLUDED.role,
             is_active = true,
             updated_at = now()`,
        [adminId, em, hash, item.name, item.role]
      );

      const userId = "usr_" + hashId;
      await pool.query(
        `INSERT INTO users (id, email, phone, password_hash, full_name, role, is_active)
         VALUES ($1, $2, $3, $4, $5, 'admin', true)
         ON CONFLICT (email) DO UPDATE 
         SET password_hash = EXCLUDED.password_hash,
             phone = EXCLUDED.phone,
             full_name = EXCLUDED.full_name,
             role = 'admin',
             is_active = true,
             updated_at = now()`,
        [userId, em, ph, hash, item.name]
      );
    }

    console.log(`[Seed] Seeded ${item.email} (Role: ${item.role})`);
  }

  const result = await pool.query(
    "SELECT id, email, role, full_name, is_active FROM admins WHERE email LIKE 'riderzpro@%' ORDER BY role, email"
  );
  console.log("[Seed] Successfully seeded admins in PostgreSQL database:");
  console.table(result.rows);

  await pool.end();
}

seed().catch((err) => {
  console.error("[Seed] Error:", err);
  process.exit(1);
});
