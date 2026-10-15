import { createClient } from "@libsql/client";
import bcrypt from "bcryptjs";
import path from "node:path";

const dbPath = path.resolve(process.cwd(), "dev.db");
const client = createClient({ url: `file:${dbPath}` });

export async function consolidateAdminAccounts() {
  console.log("=== RIDERZPRO ADMIN CONSOLIDATION & MIGRATION ===");

  // Pre-generate standard hash for admin credentials (Admin@123 / admin123)
  const passwordHash = await bcrypt.hash("Admin@123", 10);

  // 1. Ensure Super Admin (admin@riderzpro.com -> SUPER_ADMIN)
  await client.execute({
    sql: `INSERT INTO admins (id, email, password_hash, full_name, role, is_active, updated_at)
          VALUES ('adm_super_01', 'admin@riderzpro.com', ?, 'Super Administrator', 'SUPER_ADMIN', 1, CURRENT_TIMESTAMP)
          ON CONFLICT(email) DO UPDATE SET 
            role = 'SUPER_ADMIN',
            full_name = 'Super Administrator',
            is_active = 1,
            password_hash = excluded.password_hash,
            updated_at = CURRENT_TIMESTAMP`,
    args: [passwordHash],
  });

  await client.execute({
    sql: `INSERT INTO users (id, email, password_hash, full_name, role, is_active, updated_at)
          VALUES ('usr_adm_super_01', 'admin@riderzpro.com', ?, 'Super Administrator', 'SUPER_ADMIN', 1, CURRENT_TIMESTAMP)
          ON CONFLICT(email) DO UPDATE SET 
            role = 'SUPER_ADMIN',
            full_name = 'Super Administrator',
            is_active = 1,
            password_hash = excluded.password_hash,
            updated_at = CURRENT_TIMESTAMP`,
    args: [passwordHash],
  });
  console.log("  ✓ Configured Super Admin: admin@riderzpro.com (role: SUPER_ADMIN, is_active: 1)");

  // 2. Ensure Unified Admin (admin.operations@riderzpro.com -> ADMIN)
  await client.execute({
    sql: `INSERT INTO admins (id, email, password_hash, full_name, role, is_active, updated_at)
          VALUES ('adm_unified_01', 'admin.operations@riderzpro.com', ?, 'Unified Operations Administrator', 'ADMIN', 1, CURRENT_TIMESTAMP)
          ON CONFLICT(email) DO UPDATE SET 
            role = 'ADMIN',
            full_name = 'Unified Operations Administrator',
            is_active = 1,
            password_hash = excluded.password_hash,
            updated_at = CURRENT_TIMESTAMP`,
    args: [passwordHash],
  });

  await client.execute({
    sql: `INSERT INTO users (id, email, password_hash, full_name, role, is_active, updated_at)
          VALUES ('usr_adm_unified_01', 'admin.operations@riderzpro.com', ?, 'Unified Operations Administrator', 'ADMIN', 1, CURRENT_TIMESTAMP)
          ON CONFLICT(email) DO UPDATE SET 
            role = 'ADMIN',
            full_name = 'Unified Operations Administrator',
            is_active = 1,
            password_hash = excluded.password_hash,
            updated_at = CURRENT_TIMESTAMP`,
    args: [passwordHash],
  });
  console.log("  ✓ Configured Unified Admin: admin.operations@riderzpro.com (role: ADMIN, is_active: 1)");

  // 3. Deprovision legacy administrator accounts
  const deprecatedEmails = [
    "product.admin@riderzpro.com",
    "seller.admin@riderzpro.com",
    "support.admin@riderzpro.com",
    "riderzpro@productadmin1",
    "riderzpro@productadmin1.com",
    "riderzpro@productadmin2",
    "riderzpro@productadmin2.com",
    "riderzpro@productadmin3",
    "riderzpro@productadmin3.com",
    "riderzpro@selleradmin1",
    "riderzpro@selleradmin1.com",
    "riderzpro@selleradmin2",
    "riderzpro@selleradmin2.com",
    "riderzpro@selleradmin3",
    "riderzpro@selleradmin3.com",
  ];

  const deprovisionPlaceholders = deprecatedEmails.map(() => "?").join(", ");

  await client.execute({
    sql: `UPDATE admins SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE email IN (${deprovisionPlaceholders})`,
    args: deprecatedEmails,
  });

  await client.execute({
    sql: `UPDATE users SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE email IN (${deprovisionPlaceholders})`,
    args: deprecatedEmails,
  });
  console.log("  ✓ Deprovisioned legacy administrator accounts (product.admin@riderzpro.com, seller.admin@riderzpro.com, etc.)");

  // 4. Revoke active sessions for deprovisioned accounts
  const revokeResult = await client.execute({
    sql: `UPDATE auth_sessions 
          SET revoked_at = datetime('now') 
          WHERE revoked_at IS NULL 
            AND (
              user_id IN (SELECT id FROM admins WHERE is_active = 0)
              OR user_id IN (SELECT id FROM users WHERE is_active = 0)
            )`,
    args: [],
  });
  console.log(`  ✓ Revoked active sessions for deprovisioned accounts (affected rows: ${revokeResult.rowsAffected || 0})`);

  // 5. Verification summary
  const activeAdmins = await client.execute("SELECT id, email, role, is_active FROM admins WHERE is_active = 1");
  console.log("  [Verification] Active Administrators in database:");
  for (const a of activeAdmins.rows) {
    console.log(`    - ${a.email} [ID: ${a.id}] -> Role: ${a.role} (Active: ${a.is_active})`);
  }

  const inactiveAdmins = await client.execute("SELECT id, email, role, is_active FROM admins WHERE is_active = 0");
  console.log("  [Verification] Deprovisioned Administrators in database:");
  for (const a of inactiveAdmins.rows) {
    console.log(`    - ${a.email} [ID: ${a.id}] -> Role: ${a.role} (Active: ${a.is_active})`);
  }

  console.log("=== Admin Consolidation Complete ===\n");
}

if (process.argv[1] && process.argv[1].endsWith("consolidate_admin_accounts.mjs")) {
  consolidateAdminAccounts()
    .then(() => client.close())
    .catch((err) => {
      console.error("Migration error:", err);
      client.close();
      process.exit(1);
    });
}
