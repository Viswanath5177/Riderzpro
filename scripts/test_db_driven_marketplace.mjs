import { createClient } from "@libsql/client";
import path from "node:path";
import bcrypt from "bcryptjs";

const dbPath = path.resolve("dev.db");
const client = createClient({ url: `file:${dbPath}` });

console.log("=== RIDERZPRO END-TO-END DATABASE VERIFICATION TEST ===");

async function runTests() {
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

  try {
    // 1. Verify exactly 7 mock development accounts are active in database
    console.log("\n--- TEST 1: Account Inventory & Status Verification ---");
    const activeAdmins = await client.execute("SELECT email, role, is_active FROM admins WHERE is_active = 1");
    const activeSellers = await client.execute("SELECT email, status, is_active FROM sellers WHERE is_active = 1");
    const activeCustomers = await client.execute("SELECT email, is_active FROM customers WHERE is_active = 1");

    assert(activeAdmins.rows.length === 2, `Expected 2 active admins (Super Admin + Unified Operations Admin), got ${activeAdmins.rows.length}`);
    assert(activeSellers.rows.length === 2, `Expected 2 active approved sellers, got ${activeSellers.rows.length}`);
    assert(activeCustomers.rows.length === 3, `Expected 3 active customers, got ${activeCustomers.rows.length}`);

    // Verify all 7 specific accounts exist and are active
    const adminEmails = activeAdmins.rows.map(r => r.email);
    assert(adminEmails.includes("admin@riderzpro.com"), "admin@riderzpro.com is active Super Admin");
    assert(adminEmails.includes("admin.operations@riderzpro.com"), "admin.operations@riderzpro.com is active Operations Admin");

    const sellerEmails = activeSellers.rows.map(r => r.email);
    assert(sellerEmails.includes("vendor1@riderzpro.com"), "vendor1@riderzpro.com is active Seller");
    assert(sellerEmails.includes("vendor2@riderzpro.com"), "vendor2@riderzpro.com is active Seller");

    const customerEmails = activeCustomers.rows.map(r => r.email);
    assert(customerEmails.includes("customer1@riderzpro.com"), "customer1@riderzpro.com is active Customer");
    assert(customerEmails.includes("customer2@riderzpro.com"), "customer2@riderzpro.com is active Customer");
    assert(customerEmails.includes("customer3@riderzpro.com"), "customer3@riderzpro.com is active Customer");

    // Verify deactivation of all decommissioned legacy accounts
    const legacyAdminCheck = await client.execute(`
      SELECT email FROM admins 
      WHERE email IN ('product.admin@riderzpro.com', 'seller.admin@riderzpro.com', 'support.admin@riderzpro.com') 
        AND is_active = 1
    `);
    assert(legacyAdminCheck.rows.length === 0, "Decommissioned legacy admin accounts are deactivated (is_active = 0)");

    // 2. Verify Bcrypt password hashes for the active accounts
    console.log("\n--- TEST 2: Password Authentication Verification ---");
    const superAdminRow = await client.execute("SELECT password_hash FROM admins WHERE email = 'admin@riderzpro.com'");
    const superAdminValid = await bcrypt.compare("Admin@123", superAdminRow.rows[0].password_hash);
    assert(superAdminValid, "Super Admin password matches Admin@123");

    const opsAdminRow = await client.execute("SELECT password_hash FROM admins WHERE email = 'admin.operations@riderzpro.com'");
    const opsAdminValid = await bcrypt.compare("Admin@123", opsAdminRow.rows[0].password_hash);
    assert(opsAdminValid, "Unified Operations Admin password matches Admin@123");

    const v1Row = await client.execute("SELECT password_hash FROM sellers WHERE email = 'vendor1@riderzpro.com'");
    const v1Valid = await bcrypt.compare("Vendor@Riderzpro2026", v1Row.rows[0].password_hash);
    assert(v1Valid, "Vendor 1 password matches Vendor@Riderzpro2026");

    const c1Row = await client.execute("SELECT password_hash FROM customers WHERE email = 'customer1@riderzpro.com'");
    const c1Valid = await bcrypt.compare("Customer@Riderzpro2026", c1Row.rows[0].password_hash);
    assert(c1Valid, "Customer 1 password matches Customer@Riderzpro2026");

    // 3. Verify Database Product Catalog & Stock
    console.log("\n--- TEST 3: Live Catalog & Stock Isolation ---");
    const productsRes = await client.execute("SELECT id, name, seller_id, price, stock FROM products WHERE is_active = 1 AND stock >= 5 LIMIT 5");
    assert(productsRes.rows.length > 0, `Catalog has active products with adequate stock in database (${productsRes.rows.length} inspected)`);
    const testProduct = productsRes.rows[0];
    console.log(`Inspected product: ${testProduct.name} | Price: ₹${testProduct.price} | Stock: ${testProduct.stock} | Seller: ${testProduct.seller_id}`);

    // Verify out-of-stock / overselling prevention
    const oversellPayload = {
      customerId: "cst_aarav_01",
      customerName: "Aarav Sharma",
      customerEmail: "customer1@riderzpro.com",
      deliveryAddress: "Flat 402, Green Glen Layout, Bellandur, Bengaluru 560103",
      paymentMethod: "UPI",
      items: [{ productId: testProduct.id, quantity: Number(testProduct.stock) + 50, price: Number(testProduct.price) }]
    };
    const oversellRes = await fetch("http://localhost:8080/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(oversellPayload)
    });
    const oversellResult = await oversellRes.json();
    assert(oversellResult.success === false, "Overselling is prevented by backend stock validation");

    // 4. Test Order Creation & Email Notification Flow via Server API
    console.log("\n--- TEST 4: API Order Placement, Stock Reduction & Email Logs ---");
    const initialStock = Number(testProduct.stock);
    const orderQty = 2;

    const orderPayload = {
      customerId: "cst_aarav_01",
      customerName: "Aarav Sharma",
      customerEmail: "customer1@riderzpro.com",
      customerPhone: "+91 98765 43210",
      deliveryAddress: "Flat 402, Green Glen Layout, Bellandur, Bengaluru 560103",
      paymentMethod: "UPI",
      items: [
        {
          productId: testProduct.id,
          productName: testProduct.name,
          quantity: orderQty,
          price: Number(testProduct.price),
        }
      ]
    };

    const res = await fetch("http://localhost:8080/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderPayload)
    });

    const orderResult = await res.json();
    assert(orderResult.success === true, `POST /api/orders succeeded: ${orderResult.data?.orderNumber || orderResult.data?.id}`);
    const createdOrderId = orderResult.data?.id;

    // Verify database record in `orders`
    const dbOrder = await client.execute({
      sql: "SELECT * FROM orders WHERE id = ?",
      args: [createdOrderId]
    });
    assert(dbOrder.rows.length === 1, `Order record created in SQLite orders table (ID: ${createdOrderId})`);

    // Verify database records in `order_items`
    const dbOrderItems = await client.execute({
      sql: "SELECT * FROM order_items WHERE order_id = ?",
      args: [createdOrderId]
    });
    assert(dbOrderItems.rows.length === 1, `Order item record created in SQLite order_items table`);
    assert(Number(dbOrderItems.rows[0].quantity) === orderQty, `Quantity matches order quantity (${orderQty})`);

    // Verify stock reduction in database
    const updatedProd = await client.execute({
      sql: "SELECT stock FROM products WHERE id = ?",
      args: [testProduct.id]
    });
    const newStock = Number(updatedProd.rows[0].stock);
    assert(newStock === initialStock - orderQty, `Stock decremented in database from ${initialStock} to ${newStock}`);

    // Verify email delivery logs for both customer and vendor
    const emailLogs = await client.execute({
      sql: "SELECT recipient_email, subject, status FROM email_delivery_logs ORDER BY created_at DESC LIMIT 5",
      args: []
    });
    const recipientEmails = emailLogs.rows.map(r => r.recipient_email);
    assert(recipientEmails.some(e => e.includes("customer") || e.includes("customer1@riderzpro.com")), "Order placement confirmation email logged for customer");
    assert(recipientEmails.some(email => email.includes("vendor") || email.includes("vendor1@riderzpro.com")), "Vendor notification email logged for new order");

    // 5. Test Vendor Isolation
    console.log("\n--- TEST 5: Vendor Order Isolation ---");
    const v1OrdersRes = await fetch("http://localhost:8080/api/orders?seller_id=sel_blrv_01");
    const v1OrdersData = await v1OrdersRes.json();
    assert(v1OrdersData.success === true, "GET /api/orders?seller_id=sel_blrv_01 returned success");

    const v2OrdersRes = await fetch("http://localhost:8080/api/orders?seller_id=sel_evp_02");
    const v2OrdersData = await v2OrdersRes.json();
    assert(v2OrdersData.success === true, "GET /api/orders?seller_id=sel_evp_02 returned success");

    // Verify Vendor 1 items only belong to Vendor 1
    for (const ord of (v1OrdersData.data || [])) {
      if (Array.isArray(ord.items)) {
        for (const it of ord.items) {
          assert(it.seller_id === "sel_blrv_01", `Vendor 1 only sees their items: item ${it.product_name} has seller_id ${it.seller_id}`);
        }
      }
    }

    // 6. Test Admin Metrics & Revenue Computations
    console.log("\n--- TEST 6: Admin Marketplace Metrics & Revenue ---");
    const metricsRes = await fetch("http://localhost:8080/api/admin/metrics");
    const metricsData = await metricsRes.json();
    assert(metricsData.success === true, "GET /api/admin/metrics returned authoritative data");
    const m = metricsData.data;
    assert(m.totalCustomers >= 3, `Authoritative total customers: ${m.totalCustomers}`);
    assert(m.activeSellers === 2, `Authoritative active sellers: ${m.activeSellers}`);
    assert(m.totalOrders >= 1, `Authoritative total orders: ${m.totalOrders}`);
    assert(m.grossSales >= 0, `Authoritative gross sales: ₹${m.grossSales}`);
    assert(m.netRevenue === m.grossSales - m.totalRefunds, `Net revenue formula holds: ${m.netRevenue} = ${m.grossSales} - ${m.totalRefunds}`);

    // 7. Test Order Refund flow
    console.log("\n--- TEST 7: Order Refund & Stock Restoration Flow ---");
    const refundRes = await fetch(`http://localhost:8080/api/orders/${createdOrderId}/refund`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason: "Customer requested return" })
    });
    const refundData = await refundRes.json();
    assert(refundData.success === true, `Order ${createdOrderId} refunded successfully`);

    const refundedDbOrder = await client.execute({
      sql: "SELECT status, payment_status, refund_amount FROM orders WHERE id = ?",
      args: [createdOrderId]
    });
    assert(refundedDbOrder.rows[0].payment_status === "refunded", "Order payment_status updated to 'refunded'");
    assert(Number(refundedDbOrder.rows[0].refund_amount) > 0, "Order refund_amount recorded");

    // Stock should be restored
    const restoredProd = await client.execute({
      sql: "SELECT stock FROM products WHERE id = ?",
      args: [testProduct.id]
    });
    assert(Number(restoredProd.rows[0].stock) === initialStock, `Stock restored to original quantity (${initialStock}) upon refund`);

    console.log(`\n========================================`);
    console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log(`========================================\n`);

    if (failed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (err) {
    console.error("Test execution failed with error:", err);
    process.exit(1);
  }
}

runTests();
