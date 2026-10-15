import { createClient } from "@libsql/client";
import bcrypt from "bcryptjs";
import path from "node:path";
import crypto from "node:crypto";

const dbPath = path.resolve(process.cwd(), "dev.db");
const client = createClient({ url: `file:${dbPath}` });

async function run() {
  console.log("Applying database migrations and admin consolidation...");

  // 1. Ensure columns in orders table
  const ordersInfo = await client.execute("PRAGMA table_info(orders)");
  const existingOrderCols = new Set(ordersInfo.rows.map((r) => r.name));

  if (!existingOrderCols.has("payment_status")) {
    await client.execute("ALTER TABLE orders ADD COLUMN payment_status TEXT DEFAULT 'paid'");
    console.log("  + Added payment_status to orders");
  }
  if (!existingOrderCols.has("payment_method")) {
    await client.execute("ALTER TABLE orders ADD COLUMN payment_method TEXT DEFAULT 'UPI'");
    console.log("  + Added payment_method to orders");
  }
  if (!existingOrderCols.has("refund_amount")) {
    await client.execute("ALTER TABLE orders ADD COLUMN refund_amount REAL DEFAULT 0");
    console.log("  + Added refund_amount to orders");
  }
  if (!existingOrderCols.has("cancelled_at")) {
    await client.execute("ALTER TABLE orders ADD COLUMN cancelled_at TEXT");
    console.log("  + Added cancelled_at to orders");
  }
  if (!existingOrderCols.has("completed_at")) {
    await client.execute("ALTER TABLE orders ADD COLUMN completed_at TEXT");
    console.log("  + Added completed_at to orders");
  }

  // 2. Ensure columns in order_items table
  const orderItemsInfo = await client.execute("PRAGMA table_info(order_items)");
  const existingItemCols = new Set(orderItemsInfo.rows.map((r) => r.name));

  if (!existingItemCols.has("seller_id")) {
    await client.execute("ALTER TABLE order_items ADD COLUMN seller_id TEXT");
    console.log("  + Added seller_id to order_items");
  }

  // 3. Consolidate Admins & set verified working passwords
  const passwordHash = await bcrypt.hash("Admin@123", 10);

  // Super Admin: admin@riderzpro.com
  await client.execute({
    sql: `INSERT INTO admins (id, email, password_hash, full_name, role, is_active, updated_at)
          VALUES ('adm_super_01', 'admin@riderzpro.com', ?, 'Super Administrator', 'SUPER_ADMIN', 1, CURRENT_TIMESTAMP)
          ON CONFLICT(email) DO UPDATE SET 
            password_hash = excluded.password_hash,
            role = 'SUPER_ADMIN',
            full_name = 'Super Administrator',
            is_active = 1,
            updated_at = CURRENT_TIMESTAMP`,
    args: [passwordHash],
  });
  console.log("  ✓ Verified Super Admin: admin@riderzpro.com (role: SUPER_ADMIN)");

  // Unified Admin: admin.operations@riderzpro.com
  await client.execute({
    sql: `INSERT INTO admins (id, email, password_hash, full_name, role, is_active, updated_at)
          VALUES ('adm_unified_01', 'admin.operations@riderzpro.com', ?, 'Unified Operations Administrator', 'ADMIN', 1, CURRENT_TIMESTAMP)
          ON CONFLICT(email) DO UPDATE SET 
            password_hash = excluded.password_hash,
            role = 'ADMIN',
            full_name = 'Unified Operations Administrator',
            is_active = 1,
            updated_at = CURRENT_TIMESTAMP`,
    args: [passwordHash],
  });
  console.log("  ✓ Verified Unified Admin: admin.operations@riderzpro.com (role: ADMIN)");

  // Deprovision legacy product.admin and seller.admin
  await client.execute({
    sql: `UPDATE admins SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE email IN ('product.admin@riderzpro.com', 'seller.admin@riderzpro.com')`,
  });
  await client.execute({
    sql: `UPDATE users SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE email IN ('product.admin@riderzpro.com', 'seller.admin@riderzpro.com')`,
  });
  await client.execute({
    sql: `UPDATE auth_sessions SET revoked_at = datetime('now') WHERE revoked_at IS NULL AND (
      user_id IN (SELECT id FROM admins WHERE is_active = 0) OR
      user_id IN (SELECT id FROM users WHERE is_active = 0)
    )`,
  });
  console.log("  ✓ Deprovisioned legacy product.admin and seller.admin accounts");

  // Also sync users table for admin accounts
  await client.execute({
    sql: `INSERT INTO users (id, email, password_hash, full_name, role, is_active, updated_at)
          VALUES ('usr_adm_super_01', 'admin@riderzpro.com', ?, 'Super Administrator', 'SUPER_ADMIN', 1, CURRENT_TIMESTAMP)
          ON CONFLICT(email) DO UPDATE SET 
            password_hash = excluded.password_hash,
            role = 'SUPER_ADMIN',
            full_name = 'Super Administrator',
            is_active = 1,
            updated_at = CURRENT_TIMESTAMP`,
    args: [passwordHash],
  });

  await client.execute({
    sql: `INSERT INTO users (id, email, password_hash, full_name, role, is_active, updated_at)
          VALUES ('usr_adm_unified_01', 'admin.operations@riderzpro.com', ?, 'Unified Operations Administrator', 'ADMIN', 1, CURRENT_TIMESTAMP)
          ON CONFLICT(email) DO UPDATE SET 
            password_hash = excluded.password_hash,
            role = 'ADMIN',
            full_name = 'Unified Operations Administrator',
            is_active = 1,
            updated_at = CURRENT_TIMESTAMP`,
    args: [passwordHash],
  });

  // 4. Check if orders exist; if 0 orders, insert realistic sample orders linked to actual products & sellers
  const orderCountRes = await client.execute("SELECT count(*) as count FROM orders");
  const count = Number(orderCountRes.rows[0]?.count || 0);

  if (count === 0) {
    console.log("  Creating baseline authentic order records in database...");

    const sellersRes = await client.execute("SELECT id, store_name FROM sellers LIMIT 2");
    const seller1 = sellersRes.rows[0]?.id || "sel_volthub_01";
    const seller2 = sellersRes.rows[1]?.id || "sel_apex_02";

    const s1Prods = await client.execute({
      sql: "SELECT id, name, price FROM products WHERE seller_id = ? LIMIT 3",
      args: [seller1],
    });
    const s2Prods = await client.execute({
      sql: "SELECT id, name, price FROM products WHERE seller_id = ? LIMIT 3",
      args: [seller2],
    });

    const custRes = await client.execute("SELECT id, full_name FROM customers LIMIT 2");
    const cust1 = custRes.rows[0]?.id || "usr_cst_aarav_01";
    const cust2 = custRes.rows[1]?.id || "usr_cst_priya_02";

    const p1_1 = s1Prods.rows[0] || { id: "prod_manual_1791979908120", price: 1850 };
    const p1_2 = s1Prods.rows[1] || { id: "prod_bc5ffe23c38f", price: 32500 };
    const p2_1 = s2Prods.rows[0] || { id: "prod_490bd88dedbc", price: 7999 };
    const p2_2 = s2Prods.rows[1] || { id: "prod_7d02a24f670c", price: 3499 };

    // Baseline orders across past 7 days:
    const ordersToInsert = [
      {
        id: "ord_rz_1001",
        order_number: "RZ-100801",
        customer_id: cust1,
        seller_id: seller1,
        status: "completed",
        payment_status: "paid",
        payment_method: "UPI",
        total_amount: Number(p1_1.price) * 2,
        refund_amount: 0,
        delivery_address: "Flat 402, Green Glen Layout, Bellandur, Bengaluru - 560103",
        created_at: new Date(Date.now() - 6 * 86400000).toISOString().replace("T", " ").substring(0, 19),
        items: [{ product_id: p1_1.id, seller_id: seller1, quantity: 2, unit_price: Number(p1_1.price), subtotal: Number(p1_1.price) * 2 }],
      },
      {
        id: "ord_rz_1002",
        order_number: "RZ-100802",
        customer_id: cust2,
        seller_id: seller1,
        status: "completed",
        payment_status: "paid",
        payment_method: "CARD",
        total_amount: Number(p1_2.price),
        refund_amount: 0,
        delivery_address: "Plot 15, Defence Colony, Indiranagar, Bengaluru - 560038",
        created_at: new Date(Date.now() - 4 * 86400000).toISOString().replace("T", " ").substring(0, 19),
        items: [{ product_id: p1_2.id, seller_id: seller1, quantity: 1, unit_price: Number(p1_2.price), subtotal: Number(p1_2.price) }],
      },
      {
        id: "ord_rz_1003",
        order_number: "RZ-100803",
        customer_id: cust1,
        seller_id: seller2,
        status: "completed",
        payment_status: "paid",
        payment_method: "UPI",
        total_amount: Number(p2_1.price),
        refund_amount: 0,
        delivery_address: "No 77, 4th Cross, Koramangala 4th Block, Bengaluru - 560034",
        created_at: new Date(Date.now() - 3 * 86400000).toISOString().replace("T", " ").substring(0, 19),
        items: [{ product_id: p2_1.id, seller_id: seller2, quantity: 1, unit_price: Number(p2_1.price), subtotal: Number(p2_1.price) }],
      },
      {
        id: "ord_rz_1004",
        order_number: "RZ-100804",
        customer_id: cust2,
        seller_id: seller2,
        status: "completed",
        payment_status: "paid",
        payment_method: "NETBANKING",
        total_amount: Number(p2_2.price) * 2,
        refund_amount: 0,
        delivery_address: "Villa 12, Palm Meadows, Whitefield, Bengaluru - 560066",
        created_at: new Date(Date.now() - 1 * 86400000).toISOString().replace("T", " ").substring(0, 19),
        items: [{ product_id: p2_2.id, seller_id: seller2, quantity: 2, unit_price: Number(p2_2.price), subtotal: Number(p2_2.price) * 2 }],
      },
      {
        id: "ord_rz_1005",
        order_number: "RZ-100805",
        customer_id: cust1,
        seller_id: seller1,
        status: "refunded",
        payment_status: "refunded",
        payment_method: "UPI",
        total_amount: Number(p1_1.price),
        refund_amount: Number(p1_1.price),
        delivery_address: "Flat 402, Green Glen Layout, Bellandur, Bengaluru - 560103",
        created_at: new Date(Date.now() - 2 * 86400000).toISOString().replace("T", " ").substring(0, 19),
        items: [{ product_id: p1_1.id, seller_id: seller1, quantity: 1, unit_price: Number(p1_1.price), subtotal: Number(p1_1.price) }],
      },
      {
        id: "ord_rz_1006",
        order_number: "RZ-100806",
        customer_id: cust2,
        seller_id: seller2,
        status: "pending",
        payment_status: "pending",
        payment_method: "COD",
        total_amount: Number(p2_2.price),
        refund_amount: 0,
        delivery_address: "Villa 12, Palm Meadows, Whitefield, Bengaluru - 560066",
        created_at: new Date().toISOString().replace("T", " ").substring(0, 19),
        items: [{ product_id: p2_2.id, seller_id: seller2, quantity: 1, unit_price: Number(p2_2.price), subtotal: Number(p2_2.price) }],
      },
    ];

    for (const o of ordersToInsert) {
      await client.execute({
        sql: `INSERT OR REPLACE INTO orders (id, order_number, customer_id, seller_id, status, payment_status, payment_method, total_amount, refund_amount, delivery_address, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          o.id,
          o.order_number,
          o.customer_id,
          o.seller_id,
          o.status,
          o.payment_status,
          o.payment_method,
          o.total_amount,
          o.refund_amount,
          o.delivery_address,
          o.created_at,
          o.created_at,
        ],
      });

      for (let i = 0; i < o.items.length; i++) {
        const it = o.items[i];
        const itemId = `oi_${o.id}_${i + 1}`;
        await client.execute({
          sql: `INSERT OR REPLACE INTO order_items (id, order_id, product_id, seller_id, quantity, unit_price, subtotal)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
          args: [itemId, o.id, it.product_id, it.seller_id, it.quantity, it.unit_price, it.subtotal],
        });
      }
    }
    console.log(`  ✓ Inserted ${ordersToInsert.length} baseline realistic orders and order items.`);
  }

  console.log("\nDatabase migration completed successfully!");
}

run().catch((e) => {
  console.error("Migration error:", e);
  process.exit(1);
});
