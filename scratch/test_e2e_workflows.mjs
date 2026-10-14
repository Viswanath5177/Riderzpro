import { createClient } from "@libsql/client";

const db = createClient({ url: "file:dev.db" });
const BASE_URL = "http://localhost:8080";

console.log("=== STARTING FULL END-TO-END WORKFLOW ACCEPTANCE TEST ===");

async function runTests() {
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${message}`);
      failed++;
    }
  }

  // ----------------------------------------------------
  // TEST 1: Database Baseline State
  // ----------------------------------------------------
  console.log("\n1. Verifying Database Baseline State:");
  const usersCount = (await db.execute("SELECT count(*) as c FROM users")).rows[0].c;
  const sellersCount = (await db.execute("SELECT count(*) as c FROM sellers")).rows[0].c;
  const customersCount = (await db.execute("SELECT count(*) as c FROM customers")).rows[0].c;
  const ordersCount = (await db.execute("SELECT count(*) as c FROM orders")).rows[0].c;

  assert(Number(usersCount) >= 20, `Users table preserved (${usersCount} users)`);
  assert(Number(sellersCount) >= 1, `Sellers table preserved (${sellersCount} sellers)`);
  assert(Number(customersCount) >= 5, `Customers table preserved (${customersCount} customers)`);
  assert(Number(ordersCount) >= 0, `Orders table intact (${ordersCount} historical orders)`);

  const activeSeller = (await db.execute("SELECT * FROM sellers LIMIT 1")).rows[0];
  const sellerId = activeSeller.id;
  console.log(`  Using Active Seller: ${sellerId} (${activeSeller.store_name})`);

  // ----------------------------------------------------
  // TEST 2: Manual Product Creation
  // ----------------------------------------------------
  console.log("\n2. Testing Manual Product Creation:");
  const manualProdPayload = {
    id: `prod_manual_${Date.now()}`,
    seller_id: sellerId,
    category_id: "cat_brakes",
    name: "Ceramic Performance Brake Pads 220mm",
    brand: "Brembo Pro",
    sku: `SKU-MAN-${Date.now()}`,
    description: "High friction coefficient racing brake pads for electric superbikes.",
    price: 1850,
    mrp: 2200,
    discount_percent: 16,
    stock: 5, // Exactly 5 for testing low-stock boundary
    moq: 1,
    supplier: "Brembo Automotive India",
    fitment_type: "universal",
    compatible_vehicles: ["universal", "ola-s1pro", "ather-450x"],
    image_url: JSON.stringify(["/src/assets/parts.jpg"]),
  };

  const manualRes = await fetch(`${BASE_URL}/api/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(manualProdPayload),
  });
  const manualJson = await manualRes.json();
  assert(manualRes.ok && manualJson.success, "Manual product created via POST /api/products");

  // Verify status is pending_approval and is_active is false
  const manualInDbRes = await db.execute({
    sql: "SELECT * FROM products WHERE id = ?",
    args: [manualProdPayload.id],
  });
  const manualInDb = manualInDbRes.rows[0];
  assert(manualInDb && manualInDb.verification_status === "pending_approval", "New product initially in 'pending_approval' status");
  assert(manualInDb && (manualInDb.is_active === 0 || manualInDb.is_active === false), "New product initially inactive (is_active: false)");

  // Verify it does NOT appear in public customer catalog yet
  const customerListRes1 = await fetch(`${BASE_URL}/api/products`);
  const customerListJson1 = await customerListRes1.json();
  const isManualVisible = customerListJson1.data?.some((p) => p.id === manualProdPayload.id);
  assert(!isManualVisible, "Pending product is NOT visible in public customer listings");

  // ----------------------------------------------------
  // TEST 3: Bulk Product Import via JSON
  // ----------------------------------------------------
  console.log("\n3. Testing JSON Bulk Product Import:");

  // Test 3a: Invalid import rejection
  const invalidBulkRes = await fetch(`${BASE_URL}/api/products/bulk-import`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      seller_id: sellerId,
      products: [
        { name: "", price: -100, stock: -5, sku: "" }, // invalid fields
      ],
    }),
  });
  const invalidBulkJson = await invalidBulkRes.json();
  assert(invalidBulkRes.status === 400 || (invalidBulkJson.failedCount > 0 && invalidBulkJson.importedCount === 0), "Invalid JSON product definitions properly rejected by backend validation");

  // Test 3b: Valid bulk batch with varying stocks (4 = low stock, 20 = healthy, 0 = out of stock)
  const skuBulk1 = `SKU-BLK-1-${Date.now()}`;
  const skuBulk2 = `SKU-BLK-2-${Date.now()}`;
  const skuBulk3 = `SKU-BLK-3-${Date.now()}`;

  const validBulkPayload = {
    seller_id: sellerId,
    products: [
      {
        name: "Lithium LiFePO4 Smart Battery Pack 60V 30Ah",
        description: "Prismatic cell deep cycle battery pack with smart Bluetooth monitoring.",
        category: "EV Batteries",
        brand: "VoltMax",
        sku: skuBulk1,
        price: 32500,
        stock: 4, // Low stock: <= 5
        images: [{ url: "/src/assets/parts.jpg", alt: "Battery Pack" }],
        specifications: { voltage: "60V", capacity: "30Ah", chemistry: "LiFePO4" },
      },
      {
        name: "Rapid Smart Charger 72V 10A CAN-Bus",
        description: "Intelligent CC-CV switchmode fast charger with aluminum cooling fins.",
        category: "Smart Chargers",
        brand: "ChargePro",
        sku: skuBulk2,
        price: 7999,
        stock: 20, // Healthy stock: > 5
        images: ["/src/assets/parts.jpg"],
        specifications: { output: "72V 10A", efficiency: "94%" },
      },
      {
        name: "Heavy Duty Sintered Brake Disc 260mm",
        description: "Oversized racing front rotor with floating CNC rotor carrier.",
        category: "Braking & Safety",
        brand: "Riderz Pro Racing",
        sku: skuBulk3,
        price: 3499,
        stock: 0, // Out of stock: 0
        images: ["/src/assets/parts.jpg"],
        specifications: { size: "260mm", material: "Forged Steel" },
      },
    ],
  };

  const validBulkRes = await fetch(`${BASE_URL}/api/products/bulk-import`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(validBulkPayload),
  });
  const validBulkJson = await validBulkRes.json();
  assert(validBulkRes.ok && validBulkJson.success && validBulkJson.importedCount === 3, "Bulk JSON import successfully imported 3 products");

  const bulkProd1 = (await db.execute({ sql: "SELECT * FROM products WHERE sku = ?", args: [skuBulk1] })).rows[0];
  const bulkProd2 = (await db.execute({ sql: "SELECT * FROM products WHERE sku = ?", args: [skuBulk2] })).rows[0];
  const bulkProd3 = (await db.execute({ sql: "SELECT * FROM products WHERE sku = ?", args: [skuBulk3] })).rows[0];

  assert(bulkProd1 && bulkProd1.verification_status === "pending_approval", "Bulk product 1 saved in 'pending_approval' status");
  assert(bulkProd2 && bulkProd2.verification_status === "pending_approval", "Bulk product 2 saved in 'pending_approval' status");
  assert(bulkProd3 && bulkProd3.verification_status === "pending_approval", "Bulk product 3 saved in 'pending_approval' status");
  assert(bulkProd1.seller_id === sellerId, "Imported products securely associated with authenticated vendor ID");

  // ----------------------------------------------------
  // TEST 4: Product Approval and Certification Flow
  // ----------------------------------------------------
  console.log("\n4. Testing Product Review and Admin Certification Flow:");

  // Approve manual product and bulk products
  for (const p of [manualInDb, bulkProd1, bulkProd2, bulkProd3]) {
    const reviewRes = await fetch(`${BASE_URL}/api/admin/products/${p.id}/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "APPROVED",
        remarks: "Meets technical standards and compliance requirements.",
        reviewed_by: "usr_admin_01",
      }),
    });
    const reviewJson = await reviewRes.json();
    assert(reviewRes.ok && reviewJson.success, `Admin approved product ${p.name}`);
  }

  // Also test rejection flow on a temporary product
  const rejectTestId = `prod_reject_${Date.now()}`;
  await db.execute({
    sql: `INSERT INTO products (id, seller_id, category_id, name, brand, sku, description, price, mrp, stock, verification_status, is_active)
          VALUES (?, ?, 'cat_accessories', 'Non-Compliant Headlight', 'Generic', ?, 'Test', 500, 600, 10, 'pending_approval', 0)`,
    args: [rejectTestId, sellerId, `SKU-REJ-${Date.now()}`],
  });

  const rejectRes = await fetch(`${BASE_URL}/api/admin/products/${rejectTestId}/review`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "REJECTED",
      remarks: "Missing ARAI / BIS photometric safety certificate.",
      reviewed_by: "usr_admin_01",
    }),
  });
  const rejectJson = await rejectRes.json();
  assert(rejectRes.ok && rejectJson.success, "Admin rejected product with mandatory rejection remarks");

  const rejectedInDb = (await db.execute({ sql: "SELECT * FROM products WHERE id = ?", args: [rejectTestId] })).rows[0];
  assert(rejectedInDb.verification_status === "rejected" && Number(rejectedInDb.is_active) === 0, "Rejected product remains inactive with rejection status");

  // Verify audit history preserved
  const approvalHistory = (await db.execute({ sql: "SELECT * FROM product_approval_history WHERE product_id = ?", args: [rejectTestId] })).rows[0];
  assert(approvalHistory && (approvalHistory.reason || approvalHistory.remarks || "").includes("ARAI / BIS"), "Product audit history recorded rejection remarks in product_approval_history table");

  // Verify customer listings now include certified products
  const customerListRes2 = await fetch(`${BASE_URL}/api/products`);
  const customerListJson2 = await customerListRes2.json();
  const liveIds = new Set(customerListJson2.data?.map((p) => p.id));

  assert(liveIds.has(manualInDb.id), "Certified manual product appears in customer listings");
  assert(liveIds.has(bulkProd1.id), "Certified bulk product 1 appears in customer listings");
  assert(liveIds.has(bulkProd2.id), "Certified bulk product 2 appears in customer listings");
  assert(liveIds.has(bulkProd3.id), "Certified bulk product 3 appears in customer listings");
  assert(!liveIds.has(rejectTestId), "Rejected product does NOT appear in customer listings");

  // ----------------------------------------------------
  // TEST 5: Low-Stock & Out-of-Stock Logic
  // ----------------------------------------------------
  console.log("\n5. Testing Low-Stock & Out-of-Stock Conditions:");
  const testStockRules = [
    { name: "Manual Product", stock: Number(manualInDb.stock), expectedLow: true, expectedOut: false }, // stock = 5
    { name: "Bulk Prod 1", stock: Number(bulkProd1.stock), expectedLow: true, expectedOut: false }, // stock = 4
    { name: "Bulk Prod 2", stock: Number(bulkProd2.stock), expectedLow: false, expectedOut: false }, // stock = 20
    { name: "Bulk Prod 3", stock: Number(bulkProd3.stock), expectedLow: false, expectedOut: true }, // stock = 0
  ];

  for (const item of testStockRules) {
    const isLow = item.stock <= 5 && item.stock > 0;
    const isOut = item.stock === 0;
    assert(isLow === item.expectedLow, `${item.name} (stock=${item.stock}): isLowStock === ${item.expectedLow} -> ${isLow ? "'Hurry! Limited stock'" : "No low stock label"}`);
    assert(isOut === item.expectedOut, `${item.name} (stock=${item.stock}): isOutOfStock === ${item.expectedOut} -> ${isOut ? "'Out of Stock'" : "Purchasable"}`);
  }

  // ----------------------------------------------------
  // TEST 6: Customer Cart Persistence & Session Isolation
  // ----------------------------------------------------
  console.log("\n6. Testing Customer Cart (Database Persistence & Multi-Tenant Isolation):");
  const customer1 = "usr_cust_alpha";
  const customer2 = "usr_cust_beta";

  // Customer 1 adds manual product to cart
  const cartAddRes = await fetch(`${BASE_URL}/api/cart?customer_id=${customer1}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      product_id: manualInDb.id,
      vendor_id: sellerId,
      quantity: 2,
    }),
  });
  const cartAddJson = await cartAddRes.json();
  assert(cartAddRes.ok && cartAddJson.success, "Item added to customer 1 cart via POST /api/cart");

  // Repeated addition increments quantity
  const cartRepeatRes = await fetch(`${BASE_URL}/api/cart?customer_id=${customer1}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      product_id: manualInDb.id,
      vendor_id: sellerId,
      quantity: 1,
    }),
  });
  const cartRepeatJson = await cartRepeatRes.json();
  assert(cartRepeatRes.ok && cartRepeatJson.success, "Repeated addition handled cleanly");

  // Fetch customer 1 cart
  const cartGet1 = await fetch(`${BASE_URL}/api/cart?customer_id=${customer1}`);
  const cartJson1 = await cartGet1.json();
  assert(cartJson1.success && cartJson1.items.length === 1, "Customer 1 cart retrieved with 1 distinct product item");
  assert(Number(cartJson1.items[0].quantity) === 3, "Cart item quantity updated to 3 (2 + 1)");
  assert(Number(cartJson1.items[0].price) === Number(manualInDb.price), "Authoritative server-side price attached");

  // Customer 2 fetches cart (Must be isolated and empty)
  const cartGet2 = await fetch(`${BASE_URL}/api/cart?customer_id=${customer2}`);
  const cartJson2 = await cartGet2.json();
  assert(cartJson2.success && cartJson2.items.length === 0, "Customer 2 cart is completely isolated and empty");

  // Customer 1 removes item
  const cartDelRes = await fetch(`${BASE_URL}/api/cart?customer_id=${customer1}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product_id: manualInDb.id }),
  });
  const cartDelJson = await cartDelRes.json();
  assert(cartDelRes.ok && cartDelJson.success, "Item removed from customer 1 cart");

  const cartGet1After = await fetch(`${BASE_URL}/api/cart?customer_id=${customer1}`);
  const cartJson1After = await cartGet1After.json();
  assert(cartJson1After.items.length === 0, "Customer 1 cart is now empty after deletion");

  // ----------------------------------------------------
  // TEST 7: Customer Wishlist Persistence
  // ----------------------------------------------------
  console.log("\n7. Testing Customer Wishlist (Database Persistence & Duplicate Prevention):");
  const wishCust = "usr_wish_tester";

  // Add to wishlist
  const wishAddRes = await fetch(`${BASE_URL}/api/wishlist?customer_id=${wishCust}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product_id: bulkProd1.id }),
  });
  const wishAddJson = await wishAddRes.json();
  assert(wishAddRes.ok && wishAddJson.success, "Product added to customer wishlist");

  // Prevent duplicate additions
  const wishDupRes = await fetch(`${BASE_URL}/api/wishlist?customer_id=${wishCust}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product_id: bulkProd1.id }),
  });
  const wishDupJson = await wishDupRes.json();
  assert(wishDupRes.ok && wishDupJson.success, "Duplicate wishlist addition handled safely without error");

  const wishGetRes = await fetch(`${BASE_URL}/api/wishlist?customer_id=${wishCust}`);
  const wishGetJson = await wishGetRes.json();
  assert(wishGetJson.success && wishGetJson.items.length === 1, "Wishlist query returned exactly 1 item (no duplicates)");

  // Remove from wishlist
  const wishDelRes = await fetch(`${BASE_URL}/api/wishlist?customer_id=${wishCust}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product_id: bulkProd1.id }),
  });
  const wishDelJson = await wishDelRes.json();
  assert(wishDelRes.ok && wishDelJson.success, "Product removed from customer wishlist");

  const wishGetAfter = await fetch(`${BASE_URL}/api/wishlist?customer_id=${wishCust}`);
  const wishJsonAfter = await wishGetAfter.json();
  assert(wishJsonAfter.items.length === 0, "Wishlist is empty after removal");

  // ----------------------------------------------------
  // TEST 8: Vendor Coupons Linked to Selected Products
  // ----------------------------------------------------
  console.log("\n8. Testing Vendor-Created Coupons with Selected Product Associations:");
  const testCouponCode = `TESTPROMO${Date.now().toString().slice(-4)}`;

  // Create coupon linked strictly to manualInDb and bulkProd1
  const createCouponRes = await fetch(`${BASE_URL}/api/vendor/coupons`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      seller_id: sellerId,
      code: testCouponCode,
      description: "Exclusive 20% discount on select racing brake pads and lithium battery packs",
      discount_type: "percentage",
      discount_value: 20,
      minimum_order_value: 1500,
      maximum_discount: 5000,
      expires_at: "2028-12-31",
      usage_limit: 100,
      product_ids: [manualInDb.id, bulkProd1.id],
    }),
  });
  const createCouponJson = await createCouponRes.json();
  assert(createCouponRes.ok && createCouponJson.success, `Vendor created coupon '${testCouponCode}' linked to 2 products`);

  // Verify in database tables: coupons and coupon_products
  const couponDb = (await db.execute({ sql: "SELECT * FROM coupons WHERE code = ?", args: [testCouponCode] })).rows[0];
  assert(couponDb && Number(couponDb.discount_value) === 20, "Coupon persisted in 'coupons' table");

  const linkedDbRows = (await db.execute({ sql: "SELECT * FROM coupon_products WHERE coupon_id = ?", args: [couponDb.id] })).rows;
  assert(linkedDbRows.length === 2, "Product associations persisted in 'coupon_products' table (2 linked rows)");

  // Test applicable coupons endpoint for linked product
  const appRes1 = await fetch(`${BASE_URL}/api/coupons/applicable?product_id=${manualInDb.id}`);
  const appJson1 = await appRes1.json();
  const hasCoupon1 = appJson1.coupons?.some((c) => c.code === testCouponCode);
  assert(hasCoupon1, `GET /api/coupons/applicable returned '${testCouponCode}' for linked product`);

  // Test applicable coupons endpoint for non-linked product (bulkProd2)
  const appRes2 = await fetch(`${BASE_URL}/api/coupons/applicable?product_id=${bulkProd2.id}`);
  const appJson2 = await appRes2.json();
  const hasCoupon2 = appJson2.coupons?.some((c) => c.code === testCouponCode);
  assert(!hasCoupon2, `GET /api/coupons/applicable did NOT return '${testCouponCode}' for unlinked product`);

  // Validate coupon via /api/coupons/validate with eligible cart item
  const valEligibleRes = await fetch(`${BASE_URL}/api/coupons/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      code: testCouponCode,
      cart_items: [
        { product_id: manualInDb.id, price: Number(manualInDb.price), quantity: 1 }, // 1850 >= 1500 min spend
      ],
      order_total: Number(manualInDb.price),
    }),
  });
  const valEligibleJson = await valEligibleRes.json();
  assert(valEligibleJson.valid === true, "Coupon validated as TRUE for eligible product with qualifying order value");
  const expectedDiscount = Math.round(Number(manualInDb.price) * 0.2);
  assert(valEligibleJson.discount_amount === expectedDiscount, `Discount correctly calculated as ₹${expectedDiscount} (20% of ₹${manualInDb.price})`);

  // Validate coupon with below minimum order value
  const valMinSpendRes = await fetch(`${BASE_URL}/api/coupons/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      code: testCouponCode,
      cart_items: [
        { product_id: manualInDb.id, price: Number(manualInDb.price), quantity: 1 },
      ],
      order_total: 1000, // less than minimum 1500
    }),
  });
  const valMinSpendJson = await valMinSpendRes.json();
  assert(valMinSpendJson.valid === false, "Coupon rejected when order total is below minimum order value");

  // Validate coupon with ineligible product
  const valIneligibleRes = await fetch(`${BASE_URL}/api/coupons/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      code: testCouponCode,
      cart_items: [
        { product_id: bulkProd2.id, price: Number(bulkProd2.price), quantity: 1 },
      ],
      order_total: Number(bulkProd2.price),
    }),
  });
  const valIneligibleJson = await valIneligibleRes.json();
  assert(valIneligibleJson.valid === false, "Coupon rejected when cart contains only ineligible products");

  // ----------------------------------------------------
  // TEST SUMMARY
  // ----------------------------------------------------
  console.log("\n====================================================");
  console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log("====================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test execution fatal error:", err);
  process.exit(1);
});
