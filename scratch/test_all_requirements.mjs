import { createClient } from "@libsql/client";

const BASE_URL = "http://localhost:8080";
const db = createClient({ url: "file:dev.db" });

async function runTests() {
  console.log("=== RIDERZPRO E2E DATABASE & AUTH VERIFICATION ===");
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
      failed++;
    }
  }

  // 1. Super Admin Authentication
  console.log("\n1. Testing Super Admin Login (admin@riderzpro.com / Admin@123)...");
  const saRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@riderzpro.com", password: "Admin@123" }),
  });
  const saData = await saRes.json();
  assert(saRes.ok && saData.user?.role === "SUPER_ADMIN", "Super Admin logged in with role SUPER_ADMIN");

  // 2. Unified Admin Authentication
  console.log("\n2. Testing Unified Operations Admin Login (admin.operations@riderzpro.com / Admin@123)...");
  const admRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin.operations@riderzpro.com", password: "Admin@123" }),
  });
  const admData = await admRes.json();
  assert(admRes.ok && admData.user?.role === "ADMIN", "Unified Admin logged in with role ADMIN");

  // 3. Customer Authentication
  console.log("\n3. Testing Customer Login (customer1@riderzpro.com / Customer@Riderzpro2026)...");
  const custRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "customer1@riderzpro.com", password: "Customer@Riderzpro2026" }),
  });
  const custData = await custRes.json();
  assert(custRes.ok && custData.user?.role === "customer", "Customer logged in with role customer");

  // 4. Verify Mock Sellers are removed from Admin Sellers endpoint
  console.log("\n4. Checking Admin Sellers Endpoint for Mock Profiles...");
  const sellersRes = await fetch(`${BASE_URL}/api/admin/sellers`);
  const sellersData = await sellersRes.json();
  const mockNames = ["VoltHub EV Components", "Apex EV Spares & Batteries"];
  const hasMock = sellersData.data?.some((s) => mockNames.includes(s.store_name));
  assert(!hasMock, "Mock sellers (VoltHub, Apex) are NOT present in /api/admin/sellers");
  console.log(`Current sellers count in database: ${sellersData.data?.length || 0}`);

  // 5. Test Live Order Placement & Stock Validation
  console.log("\n5. Testing Live Order Placement & Email Delivery...");
  // First ensure there is at least 1 active product in dev.db
  let prodRes = await db.execute("SELECT id, name, price, stock, seller_id FROM products WHERE is_active = 1 LIMIT 1");
  if (prodRes.rows.length === 0) {
    console.log("Seeding test product...");
    await db.execute({
      sql: `INSERT OR REPLACE INTO products (id, seller_id, name, slug, price, stock, is_active, verification_status)
            VALUES ('prod_test_battery_01', 'adm_super_01', 'Lithium Smart Pack 60V 30Ah', 'lithium-smart-pack-60v-30ah', 24999, 10, 1, 'approved')`,
    });
    prodRes = await db.execute("SELECT id, name, price, stock, seller_id FROM products WHERE id = 'prod_test_battery_01'");
  }
  const prod = prodRes.rows[0];
  // Ensure product has plenty of stock for test
  await db.execute({
    sql: "UPDATE products SET stock = 15 WHERE id = ?",
    args: [prod.id],
  });
  const initialStock = 15;
  console.log(`Found product: ${prod.name} (Stock set to: ${initialStock}, Price: ₹${prod.price})`);

  // Place order with quantity 1
  const orderRes = await fetch(`${BASE_URL}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      customer_id: "cst_aarav_01",
      customer_name: "Aarav Sharma",
      customer_email: "customer1@riderzpro.com",
      customer_phone: "+91 98765 43212",
      delivery_address: "Flat 402, Green Glen Layout, Bellandur, Bengaluru 560103",
      items: [
        {
          id: prod.id,
          product_id: prod.id,
          quantity: 1,
          price: Number(prod.price),
        },
      ],
      payment_method: "UPI",
    }),
  });
  const orderData = await orderRes.json();
  const orderId = orderData.data?.id || orderData.orderId;
  assert(orderRes.ok && orderData.success && Boolean(orderId), `Order placed successfully (ID: ${orderId})`);

  // Check stock decrement
  const updatedProdRes = await db.execute({
    sql: "SELECT stock FROM products WHERE id = ?",
    args: [prod.id],
  });
  const newStock = Number(updatedProdRes.rows[0].stock);
  assert(newStock === initialStock - 1, `Product stock decremented from ${initialStock} to ${newStock}`);

  // Check email log
  const emailRes = await db.execute({
    sql: "SELECT recipient_email, subject, status FROM email_delivery_logs WHERE recipient_email = 'customer1@riderzpro.com' LIMIT 1",
  });
  assert(emailRes.rows.length > 0, `Order confirmation email logged for customer1@riderzpro.com (Subject: "${emailRes.rows[0]?.subject}")`);

  // 6. Test Admin Metrics Computed from Live Database
  console.log("\n6. Testing Live Admin Marketplace Metrics...");
  const metricsRes = await fetch(`${BASE_URL}/api/admin/metrics`);
  const metricsData = await metricsRes.json();
  assert(metricsRes.ok && metricsData.success, "Metrics endpoint responded successfully");
  assert(metricsData.data.totalOrders > 0, `Live total orders metric: ${metricsData.data.totalOrders}`);
  assert(metricsData.data.grossSales > 0, `Live gross sales metric: ₹${metricsData.data.grossSales}`);
  assert(metricsData.data.netRevenue === metricsData.data.grossSales - metricsData.data.totalRefunds, "Net revenue strictly equals gross sales minus refunds");

  console.log("\n=== SUMMARY ===");
  console.log(`Passed: ${passed}, Failed: ${failed}`);
  if (failed > 0) process.exit(1);
}

runTests().catch((e) => {
  console.error("Test error:", e);
  process.exit(1);
});
