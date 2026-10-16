import assert from "node:assert";

const BASE_URL = "http://127.0.0.1:8080";

async function postJson(url, data, cookie = "") {
  const headers = { "Content-Type": "application/json" };
  if (cookie) headers["Cookie"] = cookie;
  const res = await fetch(`${BASE_URL}${url}`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
    redirect: "manual",
  });
  const text = await res.text();
  let json = {};
  try {
    json = JSON.parse(text);
  } catch {}
  return { status: res.status, headers: res.headers, json, text };
}

async function get(url, cookie = "") {
  const headers = {};
  if (cookie) headers["Cookie"] = cookie;
  const res = await fetch(`${BASE_URL}${url}`, {
    method: "GET",
    headers,
    redirect: "manual",
  });
  const text = await res.text();
  let json = {};
  try {
    json = JSON.parse(text);
  } catch {}
  return { status: res.status, headers: res.headers, json, text };
}

function extractCookie(headers) {
  const setCookie = headers.get("set-cookie") || "";
  const match = setCookie.match(/auth_session=[^;]+/);
  return match ? match[0] : "";
}

async function runTests() {
  console.log("==================================================================");
  console.log("  RIDERZPRO UNIFIED AUTH & ACCESS CONTROL VERIFICATION TEST SUITE ");
  console.log("==================================================================\n");

  let passed = 0;
  let total = 0;

  async function test(name, fn) {
    total++;
    try {
      await fn();
      console.log(`  ✓ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ✗ FAIL: ${name}`);
      console.error(`    -> ${err.message}`);
    }
  }

  // -------------------------------------------------------------------------
  // 1. Decommissioned standalone login endpoints redirect to /vendor/login
  // -------------------------------------------------------------------------
  console.log("[Suite 1: Decommissioned Standalone Admin Login Routes]");

  await test("Direct GET /admin/login redirects (302) to /vendor/login", async () => {
    const res = await get("/admin/login");
    assert.strictEqual(res.status, 302, `Expected 302, got ${res.status}`);
    const location = res.headers.get("location");
    assert(location && location.includes("/vendor/login"), `Expected redirect to /vendor/login, got ${location}`);
  });

  await test("Direct GET /super-admin/login redirects (302) to /vendor/login", async () => {
    const res = await get("/super-admin/login");
    assert.strictEqual(res.status, 302, `Expected 302, got ${res.status}`);
    const location = res.headers.get("location");
    assert(location && location.includes("/vendor/login"), `Expected redirect to /vendor/login, got ${location}`);
  });

  // -------------------------------------------------------------------------
  // 2. Deprovisioned legacy admin accounts CANNOT log in
  // -------------------------------------------------------------------------
  console.log("\n[Suite 2: Deprovisioned Legacy Admin Accounts]");

  await test("product.admin@riderzpro.com cannot authenticate", async () => {
    const res = await postJson("/api/auth/signin", {
      email: "product.admin@riderzpro.com",
      password: "Admin@123",
      portal: "vendor",
    });
    assert.strictEqual(res.status, 401, `Expected 401, got ${res.status}`);
    assert.strictEqual(res.json.success, false);
    assert.strictEqual(res.json.error, "Invalid email or password.");
  });

  await test("seller.admin@riderzpro.com cannot authenticate", async () => {
    const res = await postJson("/api/auth/signin", {
      email: "seller.admin@riderzpro.com",
      password: "Admin@123",
      portal: "vendor",
    });
    assert.strictEqual(res.status, 401, `Expected 401, got ${res.status}`);
    assert.strictEqual(res.json.success, false);
    assert.strictEqual(res.json.error, "Invalid email or password.");
  });

  await test("riderzpro@productadmin1 cannot authenticate", async () => {
    const res = await postJson("/api/auth/signin", {
      email: "riderzpro@productadmin1",
      password: "Admin@123",
      portal: "vendor",
    });
    assert.strictEqual(res.status, 401, `Expected 401, got ${res.status}`);
    assert.strictEqual(res.json.success, false);
    assert.strictEqual(res.json.error, "Invalid email or password.");
  });

  // -------------------------------------------------------------------------
  // 3. No account enumeration: identical generic error message
  // -------------------------------------------------------------------------
  console.log("\n[Suite 3: Uniform Error Handling (Anti-Account Enumeration)]");

  await test("Wrong password for existing super admin returns generic error", async () => {
    const res = await postJson("/api/auth/signin", {
      email: "admin@riderzpro.com",
      password: "WrongPassword!456",
      portal: "vendor",
    });
    assert.strictEqual(res.status, 401, `Expected 401, got ${res.status}`);
    assert.strictEqual(res.json.error, "Invalid email or password.");
  });

  await test("Non-existent account returns identical generic error", async () => {
    const res = await postJson("/api/auth/signin", {
      email: "nonexistent.phantom.user@riderzpro.com",
      password: "AnyPassword123",
      portal: "vendor",
    });
    assert.strictEqual(res.status, 401, `Expected 401, got ${res.status}`);
    assert.strictEqual(res.json.error, "Invalid email or password.");
  });

  // -------------------------------------------------------------------------
  // 4. Shared /vendor/login authenticates SUPER_ADMIN and ADMIN
  // -------------------------------------------------------------------------
  console.log("\n[Suite 4: Authorized Unified Admin Sign-in & Redirection]");

  let superAdminCookie = "";
  await test("Super Admin (admin@riderzpro.com) signs in -> redirectUrl: /superadmin", async () => {
    const res = await postJson("/api/auth/signin", {
      email: "admin@riderzpro.com",
      password: "Admin@123",
      portal: "vendor",
    });
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}: ${res.text}`);
    assert.strictEqual(res.json.success, true);
    assert.strictEqual(res.json.role, "SUPER_ADMIN");
    assert.strictEqual(res.json.redirectUrl, "/superadmin");
    superAdminCookie = extractCookie(res.headers);
    assert(superAdminCookie, "Expected auth_session cookie to be set");
  });

    let unifiedAdminCookie = "";
  await test("Unified Admin (admin.operations@riderzpro.com) signs in -> redirectUrl: /admin", async () => {
    const res = await postJson("/api/auth/signin", {
      email: "admin.operations@riderzpro.com",
      password: "Admin@123",
      portal: "vendor",
    });
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}: ${res.text}`);
    assert.strictEqual(res.json.success, true);
    assert.strictEqual(res.json.role, "ADMIN");
    assert.strictEqual(res.json.redirectUrl, "/admin");
    unifiedAdminCookie = extractCookie(res.headers);
    assert(unifiedAdminCookie, "Expected auth_session cookie to be set");
  });

  let vendorCookie = "";
  await test("Approved Vendor (vendor1@riderzpro.com) signs in -> redirectUrl: /dashboard/vendor", async () => {
    const res = await postJson("/api/auth/signin", {
      email: "vendor1@riderzpro.com",
      password: "Vendor@Riderzpro2026",
      portal: "vendor",
    });
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}: ${res.text}`);
    assert.strictEqual(res.json.success, true);
    assert.strictEqual(res.json.role, "seller");
    assert.strictEqual(res.json.redirectUrl, "/dashboard/vendor");
    vendorCookie = extractCookie(res.headers);
    assert(vendorCookie, "Expected auth_session cookie to be set");
  });

  // -------------------------------------------------------------------------
  // 5. Access Control & Privilege Separation
  // -------------------------------------------------------------------------
  console.log("\n[Suite 5: Access Control & Role Boundary Checks]");

  await test("Unauthenticated request to /api/admin/sellers is rejected (401)", async () => {
    const res = await get("/api/admin/sellers");
    assert.strictEqual(res.status, 401, `Expected 401, got ${res.status}`);
    assert.strictEqual(res.json.success, false);
  });

  await test("Unauthenticated request to /api/superadmin/analytics is rejected (401)", async () => {
    const res = await get("/api/superadmin/analytics");
    assert.strictEqual(res.status, 401, `Expected 401, got ${res.status}`);
    assert.strictEqual(res.json.success, false);
  });

  await test("Unified Admin CAN access /api/admin/sellers (200)", async () => {
    const res = await get("/api/admin/sellers", unifiedAdminCookie);
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}: ${res.text}`);
    assert.strictEqual(res.json.success, true);
  });

  await test("Unified Admin CAN access /api/admin/notifications (200)", async () => {
    const res = await get("/api/admin/notifications", unifiedAdminCookie);
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}: ${res.text}`);
    assert.strictEqual(res.json.success, true);
  });

  await test("Unified Admin CANNOT access /api/superadmin/analytics (403 Forbidden)", async () => {
    const res = await get("/api/superadmin/analytics", unifiedAdminCookie);
    assert.strictEqual(res.status, 403, `Expected 403 Forbidden, got ${res.status}: ${res.text}`);
    assert.strictEqual(res.json.success, false);
    assert(res.json.error?.includes("Super Administrator"), `Expected super admin error message, got: ${res.json.error}`);
  });

  await test("Super Admin CAN access /api/admin/sellers (200)", async () => {
    const res = await get("/api/admin/sellers", superAdminCookie);
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}: ${res.text}`);
    assert.strictEqual(res.json.success, true);
  });

  await test("Super Admin CAN access /api/superadmin/analytics (200)", async () => {
    const res = await get("/api/superadmin/analytics", superAdminCookie);
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}: ${res.text}`);
    assert.strictEqual(res.json.success, true);
  });

  await test("Super Admin CAN access /api/superadmin/admins (200)", async () => {
    const res = await get("/api/superadmin/admins", superAdminCookie);
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}: ${res.text}`);
    assert.strictEqual(res.json.success, true);
  });

  await test("Vendor CANNOT access /api/admin/sellers (401)", async () => {
    const res = await get("/api/admin/sellers", vendorCookie);
    assert.strictEqual(res.status, 401, `Expected 401 Unauthorized, got ${res.status}: ${res.text}`);
    assert.strictEqual(res.json.success, false);
  });

  await test("Vendor CANNOT access /api/superadmin/analytics (401)", async () => {
    const res = await get("/api/superadmin/analytics", vendorCookie);
    assert.strictEqual(res.status, 401, `Expected 401 Unauthorized, got ${res.status}: ${res.text}`);
    assert.strictEqual(res.json.success, false);
  });

  // -------------------------------------------------------------------------
  // Summary
  // -------------------------------------------------------------------------
  console.log("\n==================================================================");
  console.log(`  TEST RESULTS: ${passed} / ${total} PASSED (${Math.round((passed / total) * 100)}%)`);
  console.log("==================================================================\n");

  if (passed !== total) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test runner encountered error:", err);
  process.exit(1);
});
