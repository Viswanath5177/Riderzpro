async function runVerification() {
  console.log("==================================================================");
  console.log("  RiderzPro Unified Admin & Super Admin System Verification");
  console.log("==================================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`  ✓ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${testName}`);
      failed++;
    }
  }

  // TEST 1: Check admin login page is served
  try {
    const res = await fetch("http://127.0.0.1:8080/admin/login");
    assert(res.status === 200, "GET /admin/login serves successfully (Status 200)");
  } catch (e) {
    assert(false, `GET /admin/login failed: ${e.message}`);
  }

  // TEST 2: Super Admin Sign-in
  let superCookie = "";
  try {
    const res = await fetch("http://127.0.0.1:8080/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@riderzpro.com",
        password: "Admin@123",
        authType: "password",
      }),
    });
    const data = await res.json();
    superCookie = res.headers.get("set-cookie") || "";
    assert(res.status === 200 && data.success === true, "POST /api/auth/signin authenticated Super Admin");
    assert(data.role === "SUPER_ADMIN", "Super Admin role is verified as 'SUPER_ADMIN'");
    assert(data.redirectUrl === "/superadmin", "Super Admin redirect destination is '/superadmin'");
  } catch (e) {
    assert(false, `Super Admin signin failed: ${e.message}`);
  }

  // TEST 3: Unified Admin Sign-in
  let adminCookie = "";
  try {
    const res = await fetch("http://127.0.0.1:8080/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin.operations@riderzpro.com",
        password: "Admin@123",
        authType: "password",
      }),
    });
    const data = await res.json();
    adminCookie = res.headers.get("set-cookie") || "";
    assert(res.status === 200 && data.success === true, "POST /api/auth/signin authenticated Unified Admin");
    assert(data.role === "ADMIN", "Unified Admin role is verified as 'ADMIN'");
    assert(data.redirectUrl === "/admin", "Unified Admin redirect destination is '/admin'");
  } catch (e) {
    assert(false, `Unified Admin signin failed: ${e.message}`);
  }

  // TEST 4: RBAC Security — Super Admin endpoint rejects unauthenticated request
  try {
    const res = await fetch("http://127.0.0.1:8080/api/superadmin/analytics");
    assert(res.status === 401, "GET /api/superadmin/analytics returns 401 Unauthorized without session");
  } catch (e) {
    assert(false, `RBAC unauthenticated check failed: ${e.message}`);
  }

  // TEST 5: RBAC Security — Super Admin endpoint rejects regular Admin
  try {
    const res = await fetch("http://127.0.0.1:8080/api/superadmin/analytics", {
      headers: { Cookie: adminCookie },
    });
    assert(res.status === 403, "GET /api/superadmin/analytics returns 403 Forbidden for Unified Admin");
  } catch (e) {
    assert(false, `RBAC regular admin rejection check failed: ${e.message}`);
  }

  // TEST 6: Super Admin Analytics Live Database Data
  try {
    const res = await fetch("http://127.0.0.1:8080/api/superadmin/analytics", {
      headers: { Cookie: superCookie },
    });
    const data = await res.json();
    assert(res.status === 200 && data.success === true, "GET /api/superadmin/analytics returns 200 for Super Admin");
    
    const s = data.data.summaryCards;
    assert(typeof s.totalCustomers === "number" && s.totalCustomers > 0, `Total Customers live query: ${s.totalCustomers}`);
    assert(typeof s.totalAdmins === "number" && s.totalAdmins > 0, `Total Admins live query: ${s.totalAdmins}`);
    assert(typeof s.totalVendors === "number" && s.totalVendors > 0, `Total Vendors live query: ${s.totalVendors}`);
    assert(typeof s.totalProducts === "number" && s.totalProducts > 0, `Total Products live query: ${s.totalProducts}`);
    assert(typeof s.totalOrders === "number" && s.totalOrders > 0, `Total Orders live query: ${s.totalOrders}`);
    assert(typeof s.grossSales === "number" && s.grossSales > 0, `Gross Sales calculated: ₹${s.grossSales}`);
    assert(typeof s.refunds === "number", `Refunds calculated: ₹${s.refunds}`);
    assert(s.netRevenue === s.grossSales - s.refunds, `Net Revenue formula verified: ₹${s.netRevenue} = ₹${s.grossSales} - ₹${s.refunds}`);
    assert(Array.isArray(data.data.vendors) && data.data.vendors.length > 0, `Vendor dropdown populated with ${data.data.vendors.length} vendors`);
  } catch (e) {
    assert(false, `Super Admin Analytics check failed: ${e.message}`);
  }

  // TEST 7: Vendor Drill-down Analytics
  try {
    const res = await fetch("http://127.0.0.1:8080/api/superadmin/analytics?vendor_id=sel_volthub_01", {
      headers: { Cookie: superCookie },
    });
    const data = await res.json();
    assert(res.status === 200 && data.success === true, "GET /api/superadmin/analytics?vendor_id=sel_volthub_01 drill-down returns 200");
    assert(data.data.selectedVendor?.storeName === "VoltHub EV Components", "Selected vendor details resolved correctly");
    assert(data.data.summaryCards.totalOrders === 3, `VoltHub order count matches database (3 orders)`);
    assert(data.data.summaryCards.netRevenue === 34350, `VoltHub net revenue matches database transactions (₹34,350)`);
  } catch (e) {
    assert(false, `Vendor drill-down check failed: ${e.message}`);
  }

  // TEST 8: Unified Admin Seller KYC API
  try {
    const res = await fetch("http://127.0.0.1:8080/api/admin/sellers", {
      headers: { Cookie: adminCookie },
    });
    const data = await res.json();
    assert(res.status === 200 && data.success === true, "GET /api/admin/sellers accessible by Unified Admin");
    assert(Array.isArray(data.data) && data.data.length >= 2, `Unified Admin retrieved ${data.data?.length} sellers`);
  } catch (e) {
    assert(false, `Unified Admin seller management check failed: ${e.message}`);
  }

  // TEST 9: Unified Admin Product Management API
  try {
    const res = await fetch("http://127.0.0.1:8080/api/products?all=true", {
      headers: { Cookie: adminCookie },
    });
    const data = await res.json();
    assert(res.status === 200 && data.success === true, "GET /api/products?all=true accessible by Unified Admin");
    assert(Array.isArray(data.data) && data.data.length >= 8, `Unified Admin retrieved ${data.data?.length} products`);
  } catch (e) {
    assert(false, `Unified Admin product management check failed: ${e.message}`);
  }

  console.log("\n==================================================================");
  console.log(`  VERIFICATION RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("==================================================================\n");

  if (failed > 0) process.exit(1);
}

runVerification().catch(console.error);
