// scripts/test-routing-and-security.mjs
import http from "node:http";

const BASE_URL = "http://localhost:8080";

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const reqOptions = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: options.method || "GET",
      headers: {
        ...(options.headers || {}),
      },
    };

    if (options.cookies) {
      reqOptions.headers["Cookie"] = options.cookies;
    }

    const req = http.request(reqOptions, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch {}

        const setCookies = res.headers["set-cookie"] || [];
        const cookieMap = {};
        for (const sc of setCookies) {
          const [pair] = sc.split(";");
          const [k, v] = pair.split("=");
          cookieMap[k.trim()] = v.trim();
        }

        resolve({
          status: res.statusCode,
          headers: res.headers,
          data,
          json,
          setCookies,
          cookieMap,
        });
      });
    });

    req.on("error", reject);

    if (options.body) {
      const payload = typeof options.body === "string" ? options.body : JSON.stringify(options.body);
      req.setHeader("Content-Type", "application/json");
      req.setHeader("Content-Length", Buffer.byteLength(payload));
      req.write(payload);
    }
    req.end();
  });
}

function parseSessionCookie(setCookies) {
  for (const c of setCookies) {
    if (c.startsWith("auth_session=")) {
      return c.split(";")[0];
    }
  }
  return null;
}

async function runTests() {
  console.log("=================================================");
  console.log("   RIDERZPRO ROUTING & SECURITY VERIFICATION");
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

  // --------------------------------------------------------------------------
  // TEST 1: Unauthenticated 401 Protection
  // --------------------------------------------------------------------------
  console.log("\n--- TEST GROUP 1: Unauthenticated 401 Checks ---");
  const unauthMe = await request("/api/auth/me");
  assert(
    unauthMe.status === 200 && unauthMe.json?.authenticated === false,
    "GET /api/auth/me returns authenticated: false when unauthenticated"
  );

  const unauthVendorDash = await request("/api/vendor/dashboard");
  assert(
    unauthVendorDash.status === 401 || unauthVendorDash.json?.success === false,
    `GET /api/vendor/dashboard without cookie rejected (status: ${unauthVendorDash.status})`
  );

  const unauthCustProfile = await request("/api/customer/profile");
  assert(
    unauthCustProfile.status === 401,
    `GET /api/customer/profile without cookie rejected with 401 (status: ${unauthCustProfile.status})`
  );

  const unauthCustAddresses = await request("/api/customer/addresses");
  assert(
    unauthCustAddresses.status === 401,
    `GET /api/customer/addresses without cookie rejected with 401 (status: ${unauthCustAddresses.status})`
  );

  const unauthGarage = await request("/api/garage");
  assert(
    unauthGarage.status === 401,
    `GET /api/garage without cookie rejected with 401 (status: ${unauthGarage.status})`
  );

  // --------------------------------------------------------------------------
  // TEST 2: Customer Login, Session Cookie & Zero-IDOR Enforcement
  // --------------------------------------------------------------------------
  console.log("\n--- TEST GROUP 2: Customer Login & IDOR Enforcement ---");
  const custLogin = await request("/api/auth/signin", {
    method: "POST",
    body: { email: "customer1@riderzpro.com", password: "riderzpro@123" },
  });
  assert(
    custLogin.status === 200 && custLogin.json?.success === true,
    `Customer signin succeeded for customer1@riderzpro.com (role: ${custLogin.json?.role})`
  );

  const custCookie = parseSessionCookie(custLogin.setCookies);
  assert(Boolean(custCookie), `Server issued HttpOnly auth_session cookie: ${custCookie?.substring(0, 25)}...`);

  // Verify auth/me with session cookie
  const custMe = await request("/api/auth/me", { cookies: custCookie });
  assert(
    custMe.status === 200 && custMe.json?.authenticated === true && custMe.json?.user?.id === "cst_aarav_01",
    `GET /api/auth/me authoritative check identifies customer: ${custMe.json?.user?.id} (${custMe.json?.user?.email})`
  );

  // Access own profile -> 200
  const ownProfile = await request("/api/customer/profile", { cookies: custCookie });
  const profileId = ownProfile.json?.profile?.id || ownProfile.json?.data?.id;
  assert(
    ownProfile.status === 200 && profileId === "cst_aarav_01",
    `Customer can access own profile successfully (id: ${profileId})`
  );
  assert(
    ownProfile.json?.profile?.password_hash === undefined && ownProfile.json?.data?.password_hash === undefined,
    "Customer profile response does NOT leak password_hash"
  );

  // IDOR Attack: Customer A attempting to access Customer B's profile
  const idorProfile = await request("/api/customer/profile?customerId=cst_priya_02", { cookies: custCookie });
  assert(
    idorProfile.status === 403,
    `IDOR Attempt: Customer A requesting Customer B's profile returned 403 Forbidden (status: ${idorProfile.status})`
  );

  // IDOR Attack: Customer A attempting to access Customer B's addresses
  const idorAddresses = await request("/api/customer/addresses?customer_id=cst_priya_02", { cookies: custCookie });
  assert(
    idorAddresses.status === 403,
    `IDOR Attempt: Customer A requesting Customer B's delivery addresses returned 403 Forbidden (status: ${idorAddresses.status})`
  );

  // IDOR Attack: Customer A attempting to access vendor dashboard
  const custVendorDash = await request("/api/vendor/dashboard", { cookies: custCookie });
  assert(
    custVendorDash.status === 403,
    `Customer attempting to access vendor dashboard returned 403 Forbidden (status: ${custVendorDash.status})`
  );

  // --------------------------------------------------------------------------
  // TEST 3: Vendor Login, Scoped Dashboard & IDOR Prevention
  // --------------------------------------------------------------------------
  console.log("\n--- TEST GROUP 3: Vendor Login & IDOR Enforcement ---");
  const vendorLogin = await request("/api/auth/signin", {
    method: "POST",
    body: { email: "vendor1@riderzpro.com", password: "riderzpro@123", portal: "vendor" },
  });
  assert(
    vendorLogin.status === 200 && vendorLogin.json?.success === true,
    `Vendor signin succeeded for vendor1@riderzpro.com (role: ${vendorLogin.json?.role})`
  );

  const vendorCookie = parseSessionCookie(vendorLogin.setCookies);
  assert(Boolean(vendorCookie), "Server issued auth_session cookie for vendor");

  // Verify auth/me
  const vendorMe = await request("/api/auth/me", { cookies: vendorCookie });
  assert(
    vendorMe.status === 200 && vendorMe.json?.authenticated === true && vendorMe.json?.user?.id === "sel_volthub_01",
    `GET /api/auth/me authoritative check identifies vendor: ${vendorMe.json?.user?.id}`
  );

  // Access own dashboard
  const vendorDash = await request("/api/vendor/dashboard", { cookies: vendorCookie });
  assert(
    vendorDash.status === 200 && vendorDash.json?.success === true && vendorDash.json?.data?.vendor?.id === "sel_volthub_01",
    `Vendor successfully loaded own dashboard data (store: ${vendorDash.json?.data?.vendor?.storeName})`
  );

  // IDOR Attack: Vendor A attempting to inspect Vendor B's dashboard
  const idorVendorDash = await request("/api/vendor/dashboard?seller_id=sel_apex_02", { cookies: vendorCookie });
  assert(
    idorVendorDash.status === 403,
    `IDOR Attempt: Vendor A attempting to access Vendor B's dashboard returned 403 Forbidden (status: ${idorVendorDash.status})`
  );

  // IDOR Attack: Vendor A attempting to mutate Vendor B's profile
  const idorVendorProfileUpdate = await request("/api/vendor/profile", {
    method: "PUT",
    cookies: vendorCookie,
    headers: { Origin: "http://localhost:8080" },
    body: { sellerId: "sel_apex_02", storeName: "Hacked Store" },
  });
  assert(
    idorVendorProfileUpdate.status === 403,
    `IDOR Attempt: Vendor A attempting to modify Vendor B's store profile returned 403 Forbidden (status: ${idorVendorProfileUpdate.status})`
  );

  // --------------------------------------------------------------------------
  // TEST 4: Admin Login & Operations Console
  // --------------------------------------------------------------------------
  console.log("\n--- TEST GROUP 4: Admin Login & Privileged Scope ---");
  const adminLogin = await request("/api/auth/signin", {
    method: "POST",
    body: { email: "admin@riderzpro.com", password: "riderzpro@123" },
  });
  assert(
    adminLogin.status === 200 && adminLogin.json?.success === true,
    `Admin signin succeeded for admin@riderzpro.com (role: ${adminLogin.json?.role})`
  );

  const adminCookie = parseSessionCookie(adminLogin.setCookies);
  const adminMe = await request("/api/auth/me", { cookies: adminCookie });
  assert(
    adminMe.status === 200 && adminMe.json?.authenticated === true && adminMe.json?.role === "SUPER_ADMIN",
    `Admin session validated: ${adminMe.json?.user?.id} (${adminMe.json?.role})`
  );

  // Admin inspecting vendor dashboard (permitted for supervision)
  const adminVendorInspect = await request("/api/vendor/dashboard?seller_id=sel_volthub_01", { cookies: adminCookie });
  assert(
    adminVendorInspect.status === 200 && adminVendorInspect.json?.data?.vendor?.id === "sel_volthub_01",
    "Admin can inspect vendor store for compliance oversight"
  );

  // --------------------------------------------------------------------------
  // TEST 5: Session Revocation & Fixation Defense
  // --------------------------------------------------------------------------
  console.log("\n--- TEST GROUP 5: Session Revocation on Logout ---");
  const logoutRes = await request("/api/auth/signout", {
    method: "POST",
    cookies: custCookie,
    headers: { Origin: "http://localhost:8080" },
  });
  assert(
    logoutRes.status === 200 && logoutRes.json?.success === true,
    "Signout endpoint returned success: true"
  );

  // Now, previous custCookie should be revoked in auth_sessions table
  const postLogoutMe = await request("/api/auth/me", { cookies: custCookie });
  assert(
    postLogoutMe.status === 200 && postLogoutMe.json?.authenticated === false,
    "Revoked session cookie immediately rejected on /api/auth/me"
  );

  const postLogoutProfile = await request("/api/customer/profile", { cookies: custCookie });
  assert(
    postLogoutProfile.status === 401,
    `Revoked session cookie receives 401 on protected endpoint (status: ${postLogoutProfile.status})`
  );

  // --------------------------------------------------------------------------
  // TEST 6: CSRF Protection & Orders Scoping
  // --------------------------------------------------------------------------
  console.log("\n--- TEST GROUP 6: CSRF Protection & Mutating Scopes ---");
  // Log back in as customer
  const custRelogin = await request("/api/auth/signin", {
    method: "POST",
    body: { email: "customer1@riderzpro.com", password: "riderzpro@123" },
  });
  const activeCustCookie = parseSessionCookie(custRelogin.setCookies);

  // Cross-site mutating request (attacker origin) -> CSRF 403 Forbidden
  const csrfAttack = await request("/api/cart", {
    method: "POST",
    cookies: activeCustCookie,
    headers: { Origin: "http://evil-attacker.com" },
    body: { productId: "prod_rzp_sc_001", quantity: 1 },
  });
  assert(
    csrfAttack.status === 403,
    `CSRF Attack with Origin: http://evil-attacker.com blocked with 403 (status: ${csrfAttack.status})`
  );

  // Legitimate mutating request from same origin -> Allowed
  const legitimateCart = await request("/api/cart", {
    method: "POST",
    cookies: activeCustCookie,
    headers: { Origin: "http://localhost:8080" },
    body: { productId: "prod_rzp_sc_001", quantity: 1 },
  });
  assert(
    legitimateCart.status === 200 || legitimateCart.status === 201,
    `Legitimate request from same origin accepted (status: ${legitimateCart.status})`
  );

  // Orders list query strictly scoped to session identity
  const custOrders = await request("/api/orders", { cookies: activeCustCookie });
  assert(
    custOrders.status === 200 && Array.isArray(custOrders.json?.orders || custOrders.json?.data),
    "Customer orders list returned successfully"
  );
  const orderList = custOrders.json?.orders || custOrders.json?.data || [];
  const crossCustomerOrders = orderList.filter(o => o.customer_id && o.customer_id !== "cst_aarav_01");
  assert(
    crossCustomerOrders.length === 0,
    `Customer orders list strictly contains only current customer's orders (0 cross-customer orders found)`
  );

  console.log("\n=================================================");
  console.log(`   TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("=================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test execution error:", err);
  process.exit(1);
});
