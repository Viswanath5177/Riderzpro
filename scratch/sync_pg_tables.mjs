import pg from "pg";
import { createClient } from "@libsql/client";

const pgPool = new pg.Pool({ connectionString: "postgresql://postgres:Vsvg%40db1@localhost:5432/riderzpro" });
const sqlite = createClient({ url: "file:dev.db" });

async function syncPg() {
  console.log("Synchronizing PostgreSQL tables with clean state and demo accounts...");

  // 1. Clean dynamic tables in PostgreSQL
  const tablesToEmpty = [
    "products",
    "orders",
    "order_items",
    "deliveries",
    "support_tickets",
    "vendor_notifications",
    "carts",
    "cart_items",
    "wishlists",
    "wishlist_items",
    "saved_items",
    "product_approval_history",
    "audit_logs",
    "email_delivery_logs",
    "email_verification_attempts",
    "auth_sessions",
    "service_bookings",
    "product_specifications",
    "product_vehicle_compatibility",
    "riderzpro_catalogue_import",
    "vendor_change_requests",
    "customer_garage",
    "customer_addresses",
    "customer_profiles",
    "admin_invitations",
    "seller_documents",
    "seller_bank_accounts"
  ];

  for (const t of tablesToEmpty) {
    try {
      await pgPool.query(`TRUNCATE TABLE "${t}" CASCADE`);
      console.log(`✓ Truncated PG table: ${t}`);
    } catch (e) {
      try {
        await pgPool.query(`DELETE FROM "${t}"`);
        console.log(`✓ Deleted from PG table: ${t}`);
      } catch (err) {
        console.log(`- Note for PG table ${t}: ${err.message}`);
      }
    }
  }

  // Clear non-demo sellers in PG first
  await pgPool.query("DELETE FROM sellers");

  // 2. Sync sellers from SQLite to PostgreSQL
  const sellersRes = await sqlite.execute("SELECT * FROM sellers");
  for (const s of sellersRes.rows) {
    await pgPool.query(`
      INSERT INTO sellers (
        id, email, phone, password_hash, store_name, owner_name,
        business_type, business_address, city, state, pincode, country,
        gstin, status, is_active, account_status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        store_name = EXCLUDED.store_name,
        owner_name = EXCLUDED.owner_name,
        status = EXCLUDED.status,
        is_active = EXCLUDED.is_active;
    `, [
      s.id, s.email, s.phone, s.password_hash, s.store_name, s.owner_name,
      s.business_type, s.business_address, s.city, s.state, s.pincode, s.country,
      s.gstin, s.status, s.is_active ? true : false, s.account_status || "ACTIVE"
    ]);
  }
  console.log("✓ Synced demo sellers in PostgreSQL");

  // Clear non-demo admins in PG
  await pgPool.query("DELETE FROM admins");

  // 3. Sync admins from SQLite to PostgreSQL
  const adminsRes = await sqlite.execute("SELECT * FROM admins");
  for (const a of adminsRes.rows) {
    await pgPool.query(`
      INSERT INTO admins (id, email, password_hash, full_name, role, is_active)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        role = EXCLUDED.role,
        is_active = EXCLUDED.is_active;
    `, [a.id, a.email, a.password_hash, a.full_name, a.role, a.is_active ? true : false]);
  }
  console.log("✓ Synced demo admins in PostgreSQL");

  // Clear non-demo customers in PG
  await pgPool.query("DELETE FROM customers");

  // 4. Sync customers from SQLite to PostgreSQL
  const custRes = await sqlite.execute("SELECT * FROM customers");
  for (const c of custRes.rows) {
    await pgPool.query(`
      INSERT INTO customers (id, email, phone, password_hash, full_name, is_active, user_id, address, city)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        phone = EXCLUDED.phone,
        user_id = EXCLUDED.user_id,
        is_active = EXCLUDED.is_active;
    `, [c.id, c.email, c.phone, c.password_hash, c.full_name, c.is_active ? true : false, c.user_id, c.address, c.city]);
  }
  console.log("✓ Synced demo customers in PostgreSQL");

  // Clear users in PG and sync demo users
  await pgPool.query("ALTER TABLE users ALTER COLUMN phone DROP NOT NULL");
  await pgPool.query("DELETE FROM users");

  // 5. Sync users from SQLite to PostgreSQL
  const usersRes = await sqlite.execute("SELECT * FROM users");
  for (const u of usersRes.rows) {
    await pgPool.query(`
      INSERT INTO users (id, email, phone, password_hash, full_name, role, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        role = EXCLUDED.role,
        is_active = EXCLUDED.is_active;
    `, [u.id, u.email, u.phone || null, u.password_hash, u.full_name, u.role, u.is_active ? true : false]);
  }
  console.log("✓ Synced demo users in PostgreSQL");

  // Summary counts
  console.log("\n=== POSTGRESQL TABLE COUNTS ===");
  const checkTables = ["users", "admins", "sellers", "customers", "products", "orders", "order_items", "categories", "wishlists", "carts"];
  for (const t of checkTables) {
    const r = await pgPool.query(`SELECT COUNT(*) as c FROM "${t}"`);
    console.log(`  ${t}: ${r.rows[0].c}`);
  }

  await pgPool.end();
}

syncPg().catch(console.error);
