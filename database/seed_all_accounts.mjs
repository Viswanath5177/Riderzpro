import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcryptjs";
import crypto from "crypto";
import pg from "pg";

const connectionString = process.env.DATABASE_URL || `postgresql://${process.env.PGUSER || "postgres"}:${encodeURIComponent(process.env.PGPASSWORD || "")}@${process.env.PGHOST || "localhost"}:${process.env.PGPORT || "5432"}/${process.env.PGDATABASE || "riderzpro"}`;

const pool = new pg.Pool({ connectionString });

async function seedAll() {
  console.log("Seeding all role accounts in PostgreSQL...");

  // 1. PRODUCT & SELLER ADMINS
  const admins = [
    { email: "riderzpro@productadmin1", pass: "riderzpro@product1", name: "Product Admin 1", role: "PRODUCT_ADMIN" },
    { email: "riderzpro@productadmin2", pass: "riderzpro@product2", name: "Product Admin 2", role: "PRODUCT_ADMIN" },
    { email: "riderzpro@productadmin3", pass: "riderzpro@product3", name: "Product Admin 3", role: "PRODUCT_ADMIN" },
    { email: "riderzpro@selleradmin1", pass: "riderzpro@seller1", name: "Seller Admin 1", role: "SELLER_ADMIN" },
    { email: "riderzpro@selleradmin2", pass: "riderzpro@seller2", name: "Seller Admin 2", role: "SELLER_ADMIN" },
    { email: "riderzpro@selleradmin3", pass: "riderzpro@seller3", name: "Seller Admin 3", role: "SELLER_ADMIN" },
    { email: "product.admin@riderzpro.com", pass: "productadmin123", name: "Senior Product Admin", role: "PRODUCT_ADMIN" },
    { email: "support.admin@riderzpro.com", pass: "supportadmin123", name: "Support Operations Admin", role: "SUPPORT_ADMIN" },
    { email: "admin@riderzpro.com", pass: "admin123", name: "System Administrator", role: "SUPER_ADMIN" },
  ];

  for (const a of admins) {
    const hash = await bcrypt.hash(a.pass, 10);
    const variants = [a.email, a.email.includes("@") && !a.email.includes(".") ? a.email + ".com" : null].filter(Boolean);

    for (const em of variants) {
      const id = "adm_" + crypto.createHash("md5").update(em).digest("hex").slice(0, 16);
      await pool.query(
        `INSERT INTO admins (id, email, password_hash, full_name, role, is_active)
         VALUES ($1, $2, $3, $4, $5, true)
         ON CONFLICT (email) DO UPDATE 
         SET password_hash = EXCLUDED.password_hash,
             full_name = EXCLUDED.full_name,
             role = EXCLUDED.role,
             is_active = true`,
        [id, em, hash, a.name, a.role]
      );

      // Mirror into users
      const randomPhoneSuffix = Math.floor(100000 + Math.random() * 900000);
      const userPhone = `+91 9900${randomPhoneSuffix}`;
      await pool.query(
        `INSERT INTO users (id, email, phone, password_hash, full_name, role, is_active)
         VALUES ($1, $2, $3, $4, $5, 'admin', true)
         ON CONFLICT (email) DO UPDATE 
         SET password_hash = EXCLUDED.password_hash,
             full_name = EXCLUDED.full_name,
             role = 'admin',
             is_active = true`,
        ["usr_" + id.slice(4), em, userPhone, hash, a.name]
      );
    }
  }

  // 2. SELLERS / VENDORS (Strictly empty - only real vendors who register through /vendor/signup appear)
  const sellers = [];

  for (const s of sellers) {
    const hash = await bcrypt.hash(s.pass, 10);
    await pool.query(
      `INSERT INTO sellers (
        id, email, phone, password_hash, store_name, owner_name, business_type, 
        business_address, city, state, pincode, country, gstin, status, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, 'Proprietorship', '100ft Road', $7, 'Karnataka', '560038', 'India', $8, $9, true)
      ON CONFLICT (email) DO UPDATE
      SET password_hash = EXCLUDED.password_hash,
          store_name = EXCLUDED.store_name,
          owner_name = EXCLUDED.owner_name,
          status = EXCLUDED.status,
          is_active = true`,
      [s.id, s.email, s.phone, hash, s.storeName, s.ownerName, s.city, s.gstin, s.status]
    );

    await pool.query(
      `INSERT INTO users (id, email, phone, password_hash, full_name, role, is_active)
       VALUES ($1, $2, $3, $4, $5, 'seller', true)
       ON CONFLICT (email) DO UPDATE 
       SET password_hash = EXCLUDED.password_hash,
           full_name = EXCLUDED.full_name,
           role = 'seller',
           is_active = true`,
      ["usr_" + s.id.slice(4), s.email, s.phone, hash, s.ownerName]
    );
  }

  // 3. CUSTOMERS
  const customers = [
    {
      id: "cst_demo_01",
      email: "customer@riderzpro.com",
      pass: "riderzpro@customer1",
      name: "Rahul Verma",
      phone: "+91 98765 43210"
    },
    {
      id: "cst_demo_02",
      email: "vamsigattikoppula@gmail.com",
      pass: "vamsi123",
      name: "G VAMSI",
      phone: "+91 93924 07273"
    },
    {
      id: "cst_demo_03",
      email: "customer@example.com",
      pass: "customer123",
      name: "Rahul Verma",
      phone: "+91 98450 12345"
    }
  ];

  for (const c of customers) {
    const hash = await bcrypt.hash(c.pass, 10);
    await pool.query(
      `INSERT INTO customers (id, email, phone, password_hash, full_name, is_active)
       VALUES ($1, $2, $3, $4, $5, true)
       ON CONFLICT (email) DO UPDATE
       SET password_hash = EXCLUDED.password_hash,
           full_name = EXCLUDED.full_name,
           phone = EXCLUDED.phone,
           is_active = true`,
      [c.id, c.email, c.phone, hash, c.name]
    );

    const userCheck = await pool.query("SELECT id FROM users WHERE email = $1", [c.email]);
    if (userCheck.rows[0]) {
      await pool.query("UPDATE users SET password_hash = $1, is_active = true WHERE email = $2", [hash, c.email]);
    } else {
      const randomPhone = `+91 98${Math.floor(10000000 + Math.random() * 90000000)}`;
      await pool.query(
        `INSERT INTO users (id, email, phone, password_hash, full_name, role, is_active)
         VALUES ($1, $2, $3, $4, $5, 'customer', true)
         ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
        ["usr_" + c.id.slice(4), c.email, c.phone || randomPhone, hash, c.name]
      ).catch(() => {});
    }
  }

  console.log("Successfully seeded all role accounts into PostgreSQL database!");
  await pool.end();
}

seedAll().catch(err => {
  console.error("Seed error:", err);
  process.exit(1);
});
