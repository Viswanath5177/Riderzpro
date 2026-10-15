import { createClient } from "@libsql/client";
import { resolve } from "path";

const dbPath = resolve(process.cwd(), "dev.db");
const db = createClient({ url: `file:${dbPath}` });

const BASE_URL = "http://127.0.0.1:8080";

async function runTests() {
  console.log("=================================================");
  console.log("RIDERZPRO DATABASE-DRIVEN MARKETPLACE TEST SUITE");
  console.log("=================================================\n");

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

  // 1. Check database accounts
  console.log("1. Verifying Database Accounts...");
  const activeAdmins = await db.execute("SELECT email, role, is_active FROM admins WHERE is_active = 1");
  const activeSellers = await db.execute("SELECT email, store_name, is_active FROM sellers WHERE is_active = 1");
  const activeCustomers = await db.execute("SELECT email, full_name, is_active FROM customers WHERE is_active = 1");

  console.log(`  Active Admins (${activeAdmins.rows.length}):`, activeAdmins.rows.map(r => `${r.email} (${r.role})`).join(", "));
  console.log(`  Active Sellers (${activeSellers.rows.length}):`, activeSellers.rows.map(r => `${r.email} (${r.store_name})`).join(", "));
  console.log(`  Active Customers (${activeCustomers.rows.length}):`, activeCustomers.rows.map(r => `${r.email}`).join(", "));

  assert(activeAdmins.rows.length === 2, "Exactly 2 active admins (Super Admin & Unified Admin)");
  assert(activeSellers.rows.length === 2, "Exactly 2 active sellers (vendor1, vendor2)");
  assert(activeCustomers.rows.length === 3, "Exactly 3 active customers (customer1, customer2, customer3)");

  const inactiveAdmins = await db.execute("SELECT email FROM admins WHERE is_active = 0");
  const inactiveSellers = await db.execute("SELECT email FROM sellers WHERE is_active = 0");
  console.log(`  Deactivated legacy accounts count: Admins=${inactiveAdmins.rows.length}, Sellers=${inactiveSellers.rows.length}`);
  assert(inactiveAdmins.rows.length > 0, "Legacy admin accounts are properly deactivated (is_active = 0)");

  // 2. HTTP Authentication Tests
  console.log("\n2. Testing HTTP Authentication Endpoints (/api/auth/signin)...");

  // Admin login
  const adminRes = await fetch(`${BASE_URL}/api/auth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin.operations@riderzpro.com", password: "Admin@123" }),
  });
  const adminData = await adminRes.json();
  assert(adminRes.status === 200 && adminData.success && (adminData.role === "admin" || adminData.role === "ADMIN"), "Admin login successful with Admin@123");

  // Vendor 1 login
  const v1Res = await fetch(`${BASE_URL}/api/auth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "vendor1@riderzpro.com", password: "Vendor@Riderzpro2026" }),
  });
  const v1Data = await v1Res.json();
  assert(v1Res.status === 200 && v1Data.success && (v1Data.role === "seller" || v1Data.role === "vendor"), "Vendor 1 login successful with Vendor@Riderzpro2026");

  // Vendor 2 login
  const v2Res = await fetch(`${BASE_URL}/api/auth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "vendor2@riderzpro.com", password: "Vendor@Riderzpro2026" }),
  });
  const v2Data = await v2Res.json();
  assert(v2Res.status === 200 && v2Data.success, "Vendor 2 login successful with Vendor@Riderzpro2026");

  // Customer 1 login
  const c1Res = await fetch(`${BASE_URL}/api/auth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "customer1@riderzpro.com", password: "Customer@Riderzpro2026" }),
  });
  const c1Data = await c1Res.json();
  assert(c1Res.status === 200 && c1Data.success && c1Data.role === "customer", "Customer 1 login successful with Customer@Riderzpro2026");

  // Deactivated account login attempt
  const deactRes = await fetch(`${BASE_URL}/api/auth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "product.admin@riderzpro.com", password: "Admin@123" }),
  });
  assert(deactRes.status === 401 || deactRes.status === 403, "Deactivated legacy admin rejected with 401/403");

  // Wrong password attempt
  const wrongPassRes = await fetch(`${BASE_URL}/api/auth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "customer1@riderzpro.com", password: "WrongPassword999" }),
  });
  assert(wrongPassRes.status === 401 || wrongPassRes.status === 403, "Wrong password rejected with 401/403");

  // 3. Product & Stock Validation + Order Placement
  console.log("\n3. Testing Order Placement with Stock Validation (/api/orders)...");

  // Grab active products from DB
  const sampleProducts = await db.execute("SELECT id, name, price, stock, seller_id FROM products WHERE is_active = 1 AND stock > 2 LIMIT 2");
  assert(sampleProducts.rows.length >= 2, "Found at least 2 active products in DB for test");

  const p1 = sampleProducts.rows[0];
  const p2 = sampleProducts.rows[1];
  const initialStock1 = Number(p1.stock);
  const initialStock2 = Number(p2.stock);

  console.log(`  Selected test products: ${p1.name} (stock: ${initialStock1}), ${p2.name} (stock: ${initialStock2})`);

  // Place order
  const orderPayload = {
    customer_id: "cst_aarav_01",
    customer_email: "customer1@riderzpro.com",
    customer_name: "Aarav Sharma",
    delivery_address: "Flat 402, Green Glen Layout, Bellandur, Bengaluru 560103",
    items: [
      { product_id: p1.id, quantity: 1, unit_price: Number(p1.price), seller_id: p1.seller_id },
      { product_id: p2.id, quantity: 1, unit_price: Number(p2.price), seller_id: p2.seller_id },
    ],
    payment_method: "UPI",
  };

  const orderRes = await fetch(`${BASE_URL}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderPayload),
  });
  const orderData = await orderRes.json();

  assert(orderRes.status === 201 && orderData.success && orderData.orderId, `Order successfully placed (Order ID: ${orderData.orderId}, Number: ${orderData.orderNumber})`);

  // Check product stock decremented in DB
  const checkP1 = await db.execute({ sql: "SELECT stock FROM products WHERE id = ?", args: [p1.id] });
  const checkP2 = await db.execute({ sql: "SELECT stock FROM products WHERE id = ?", args: [p2.id] });
  assert(Number(checkP1.rows[0].stock) === initialStock1 - 1, `Product 1 stock correctly decremented from ${initialStock1} to ${checkP1.rows[0].stock}`);
  assert(Number(checkP2.rows[0].stock) === initialStock2 - 1, `Product 2 stock correctly decremented from ${initialStock2} to ${checkP2.rows[0].stock}`);

  // Check order records in DB
  const dbOrder = await db.execute({ sql: "SELECT * FROM orders WHERE id = ?", args: [orderData.orderId] });
  const dbOrderItems = await db.execute({ sql: "SELECT * FROM order_items WHERE order_id = ?", args: [orderData.orderId] });
  assert(dbOrder.rows.length === 1, "Order record verified in 'orders' table");
  assert(dbOrderItems.rows.length === 2, "Order items records (2) verified in 'order_items' table");

  // 4. Verification of Email Logs
  console.log("\n4. Verifying Email Notifications in 'email_delivery_logs'...");
  const emailLogs = await db.execute({
    sql: "SELECT * FROM email_delivery_logs WHERE metadata LIKE ? ORDER BY created_at DESC",
    args: [`%${orderData.orderId}%`],
  });
  console.log(`  Found ${emailLogs.rows.length} email delivery log entries for this order.`);
  const hasCustomerEmail = emailLogs.rows.some(r => r.recipient_email === "customer1@riderzpro.com" && r.template_name === "order_placed_customer");
  assert(hasCustomerEmail, "Customer confirmation email successfully logged in email_delivery_logs");
  const hasVendorEmail = emailLogs.rows.some(r => r.template_name === "new_order_vendor");
  assert(hasVendorEmail, "Vendor notification email successfully logged in email_delivery_logs");

  // 5. Vendor Order Isolation
  console.log("\n5. Testing Vendor and Customer Order Isolation...");
  const custOrdersRes = await fetch(`${BASE_URL}/api/orders?customer_id=cst_aarav_01`);
  const custOrders = await custOrdersRes.json();
  assert(custOrders.orders.some(o => o.id === orderData.orderId), "Customer 1 can retrieve their placed order");

  const otherCustRes = await fetch(`${BASE_URL}/api/orders?customer_id=cst_neha_03`);
  const otherCustOrders = await otherCustRes.json();
  assert(!otherCustOrders.orders.some(o => o.id === orderData.orderId), "Customer 2 cannot see Customer 1's order (Customer Isolation Verified)");

  // Vendor 1 view
  const v1OrdersRes = await fetch(`${BASE_URL}/api/orders?seller_id=sel_motocraft_01`);
  const v1Orders = await v1OrdersRes.json();
  const v1HasOnlyTheirItems = v1Orders.orders.every(o => o.items.every(item => item.seller_id === "sel_motocraft_01"));
  assert(v1HasOnlyTheirItems, "Vendor 1 only receives items belonging to seller sel_motocraft_01 (Vendor Isolation Verified)");

  // 6. Admin Revenue & Metrics
  console.log("\n6. Testing Unified Admin Metrics Endpoint (/api/admin/metrics)...");
  const metricsRes = await fetch(`${BASE_URL}/api/admin/metrics`);
  const metrics = await metricsRes.json();
  assert(metricsRes.status === 200 && metrics.success, "Admin metrics endpoint returned 200 OK");
  console.log(`  Gross Sales: ₹${metrics.grossSales}, Total Refunds: ₹${metrics.totalRefunds}, Net Revenue: ₹${metrics.netRevenue}`);
  assert(metrics.grossSales >= 0 && metrics.netRevenue === metrics.grossSales - metrics.totalRefunds, "Net revenue strictly equals gross sales minus refunds");
  assert(metrics.totalOrders >= 1, `Total orders counted from database: ${metrics.totalOrders}`);
  assert(metrics.totalCustomers === 3, `Total customers verified in DB: ${metrics.totalCustomers}`);

  // 7. Order Status Update & Refund
  console.log("\n7. Testing Order Status Update and Refund Flow...");
  const statusRes = await fetch(`${BASE_URL}/api/orders/${orderData.orderId}/status`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "confirmed" }),
  });
  const statusData = await statusRes.json();
  assert(statusRes.status === 200 && statusData.success, "Order status updated to 'confirmed'");

  const refundRes = await fetch(`${BASE_URL}/api/orders/${orderData.orderId}/refund`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reason: "Customer requested cancellation before shipment" }),
  });
  const refundData = await refundRes.json();
  assert(refundRes.status === 200 && refundData.success, "Order successfully refunded");

  // Check metrics after refund
  const metricsAfterRefund = await (await fetch(`${BASE_URL}/api/admin/metrics`)).json();
  assert(metricsAfterRefund.totalRefunds >= orderData.totalAmount || metricsAfterRefund.totalRefunds > 0, "Admin metrics updated with new refund amount");
  assert(metricsAfterRefund.netRevenue === metricsAfterRefund.grossSales - metricsAfterRefund.totalRefunds, "Net revenue dynamically updated after refund");

  console.log("\n=================================================");
  console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("=================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
