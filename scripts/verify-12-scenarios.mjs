// scripts/verify-12-scenarios.mjs
import http from "node:http";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const BASE_URL = "http://localhost:8080";

import fs from "node:fs";
import path from "node:path";

const dbHost = process.env.DB_HOST || "localhost";
const dbPort = parseInt(process.env.DB_PORT || "5432", 10);
const dbName = process.env.DB_NAME || "riderzpro";
const dbUser = process.env.DB_USER || "postgres";
const dbPassword = process.env.DB_PASSWORD || process.env.PGPASSWORD;
const dbSsl = process.env.DB_SSL === "true";
const dbSslCa = process.env.DB_SSL_CA || "./global-bundle.pem";

let sslConfig = false;
if (dbSsl) {
  const resolvedCa = path.resolve(process.cwd(), dbSslCa);
  if (fs.existsSync(resolvedCa)) {
    sslConfig = {
      rejectUnauthorized: true,
      ca: fs.readFileSync(resolvedCa, "utf8"),
      servername: dbHost,
    };
  }
}

const pgPool = new pg.Pool({
  host: dbHost,
  port: dbPort,
  database: dbName,
  user: dbUser,
  password: dbPassword,
  ssl: sslConfig,
  max: 5,
  connectionTimeoutMillis: 10000,
});

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
          if (k && v) cookieMap[k.trim()] = v.trim();
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

function extractToken(cookieStr) {
  if (!cookieStr) return null;
  const match = cookieStr.match(/auth_session=([^;]+)/);
  return match ? match[1] : null;
}

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

async function runAll() {
  console.log("===============================================================");
  console.log("   RIDERZPRO 12-SCENARIO AUTOMATED AUTH & NAVIGATION TEST");
  console.log("===============================================================\n");

  // --------------------------------------------------------------------------
  // Scenario 10: Multi-Role Signin (Customer, Vendor, Admin)
  // --------------------------------------------------------------------------
  console.log("--- SCENARIO 10: Multi-Role Signin Verification ---");

  // Customer
  const custSignin = await request("/api/auth/signin", {
    method: "POST",
    body: { email: "customer1@riderzpro.com", password: "riderzpro@123", portal: "customer" },
  });
  assert(custSignin.status === 200 && custSignin.json?.success === true, "Customer signin returns 200 success");
  const custCookie = parseSessionCookie(custSignin.setCookies);
  assert(Boolean(custCookie), "Customer signin issued auth_session cookie");

  // Vendor
  const vendSignin = await request("/api/auth/signin", {
    method: "POST",
    body: { email: "vendor1@riderzpro.com", password: "riderzpro@123", portal: "vendor" },
  });
  assert(vendSignin.status === 200 && vendSignin.json?.success === true, "Vendor signin returns 200 success");
  const vendCookie = parseSessionCookie(vendSignin.setCookies);
  assert(Boolean(vendCookie), "Vendor signin issued auth_session cookie");

  // Super Admin
  const adminSignin = await request("/api/auth/signin", {
    method: "POST",
    body: { email: "admin@riderzpro.com", password: "riderzpro@123", portal: "admin" },
  });
  assert(adminSignin.status === 200 && adminSignin.json?.success === true, "Admin signin returns 200 success");
  const adminCookie = parseSessionCookie(adminSignin.setCookies);
  assert(Boolean(adminCookie), "Admin signin issued auth_session cookie");

  // --------------------------------------------------------------------------
  // Scenario 12: bfcache Headers Protection
  // --------------------------------------------------------------------------
  console.log("\n--- SCENARIO 12: Back-Forward Cache (bfcache) Headers Protection ---");
  const vendDashRes = await request("/api/vendor/dashboard", { cookies: vendCookie });
  assert(
    vendDashRes.headers["cache-control"]?.includes("no-store") &&
    vendDashRes.headers["cache-control"]?.includes("no-cache"),
    `Protected API returned Cache-Control: ${vendDashRes.headers["cache-control"]}`
  );
  assert(
    vendDashRes.headers["pragma"] === "no-cache",
    `Protected API returned Pragma: no-cache`
  );

  // --------------------------------------------------------------------------
  // Scenario 3: Session State & Inactivity Remaining
  // --------------------------------------------------------------------------
  console.log("\n--- SCENARIO 3: Session State & Remaining Time Metadata ---");
  const vendMe = await request("/api/auth/me", { cookies: vendCookie });
  assert(
    vendMe.status === 200 && vendMe.json?.authenticated === true && vendMe.json?.role === "seller",
    "GET /api/auth/me authenticates vendor correctly"
  );
  assert(
    vendMe.json?.inactivityTimeoutSeconds === 600,
    `Inactivity timeout is configured to 600 seconds (10 min): ${vendMe.json?.inactivityTimeoutSeconds}s`
  );
  assert(
    typeof vendMe.json?.inactivityRemainingSeconds === "number" && vendMe.json?.inactivityRemainingSeconds > 500,
    `Remaining inactivity time is healthy: ${vendMe.json?.inactivityRemainingSeconds}s remaining`
  );

  // --------------------------------------------------------------------------
  // Scenario 4: Sliding Inactivity Window (Active at 9 mins -> Reset to 10 mins)
  // --------------------------------------------------------------------------
  console.log("\n--- SCENARIO 4: Sliding Inactivity Window (Idle 9m -> Activity resets timer) ---");
  const vendToken = extractToken(vendCookie);
  // Fast-forward last_active_at by setting it to 9 minutes ago in the DB
  const crypto = await import("node:crypto");
  const tokenHash = crypto.createHash("sha256").update(vendToken).digest("hex");

  await pgPool.query(
    "UPDATE auth_sessions SET last_active_at = NOW() - INTERVAL '9 minutes' WHERE token_hash = $1",
    [tokenHash]
  );

  // Send an activity heartbeat
  const activityRes = await request("/api/auth/activity", {
    method: "POST",
    cookies: vendCookie,
  });
  assert(
    activityRes.status === 200 && activityRes.json?.success === true,
    "Activity heartbeat at 9 mins succeeded"
  );
  assert(
    activityRes.json?.inactivityRemainingSeconds === 600,
    `Activity reset remaining inactivity back to full 600 seconds: ${activityRes.json?.inactivityRemainingSeconds}s`
  );

  // Verify DB timestamp was refreshed to current time
  const dbCheck = await pgPool.query(
    "SELECT last_active_at FROM auth_sessions WHERE token_hash = $1",
    [tokenHash]
  );
  const diffMs = Math.abs(Date.now() - new Date(dbCheck.rows[0].last_active_at).getTime());
  assert(diffMs < 30000, `Database last_active_at updated to now (diff: ${diffMs}ms)`);

  // --------------------------------------------------------------------------
  // Scenario 6: Passive Polling Does NOT Reset Inactivity Timer
  // --------------------------------------------------------------------------
  console.log("\n--- SCENARIO 6: Passive Polling Does NOT Reset Inactivity Timer ---");
  // Set last_active_at to 8 minutes ago
  await pgPool.query(
    "UPDATE auth_sessions SET last_active_at = NOW() - INTERVAL '8 minutes' WHERE token_hash = $1",
    [tokenHash]
  );

  // Perform passive notification request
  const passiveRes = await request("/api/vendor/notifications", {
    cookies: vendCookie,
    headers: { "x-passive-poll": "true" },
  });
  assert(passiveRes.status === 200, `Passive poll request succeeded with 200`);

  // Verify last_active_at in DB was NOT updated (still ~8 minutes old)
  const passiveDbCheck = await pgPool.query(
    "SELECT last_active_at FROM auth_sessions WHERE token_hash = $1",
    [tokenHash]
  );
  const passiveDiffMs = Date.now() - new Date(passiveDbCheck.rows[0].last_active_at).getTime();
  assert(
    passiveDiffMs > 7 * 60 * 1000,
    `Passive polling preserved idle age (~8 mins), did not reset timer (current age: ${(passiveDiffMs / 1000).toFixed(1)}s)`
  );

  // --------------------------------------------------------------------------
  // Scenario 5: Inactivity Timeout Expiration (> 10 minutes)
  // --------------------------------------------------------------------------
  console.log("\n--- SCENARIO 5: Inactivity Timeout Expiration (> 10 minutes) ---");
  // Set last_active_at to 10 minutes and 10 seconds ago
  await pgPool.query(
    "UPDATE auth_sessions SET last_active_at = NOW() - INTERVAL '10 minutes 10 seconds' WHERE token_hash = $1",
    [tokenHash]
  );

  // Next request should be rejected with 401 sessionExpired
  const expiredReq = await request("/api/vendor/dashboard", { cookies: vendCookie });
  assert(
    expiredReq.status === 401 && expiredReq.json?.sessionExpired === true,
    `Request rejected with 401 and sessionExpired: true (status: ${expiredReq.status}, body: ${JSON.stringify(expiredReq.json)})`
  );

  // Verify session cookie was cleared in response
  const clearCookieHeader = expiredReq.setCookies.find((c) => c.startsWith("auth_session="));
  assert(
    Boolean(clearCookieHeader && (clearCookieHeader.includes("Max-Age=0") || clearCookieHeader.includes("1970"))),
    `Session cookie was cleared by server response: ${clearCookieHeader}`
  );

  // Verify session revoked in database
  const revokedDbCheck = await pgPool.query(
    "SELECT revoked_at FROM auth_sessions WHERE token_hash = $1",
    [tokenHash]
  );
  assert(
    Boolean(revokedDbCheck.rows[0]?.revoked_at),
    `Session was marked revoked in database: ${revokedDbCheck.rows[0]?.revoked_at}`
  );

  // --------------------------------------------------------------------------
  // Scenario 7: Explicit Logout Revocation & Cookie Clearing
  // --------------------------------------------------------------------------
  console.log("\n--- SCENARIO 7: Explicit Logout Revocation ---");
  const custToken = extractToken(custCookie);
  const custTokenHash = crypto.createHash("sha256").update(custToken).digest("hex");

  const signoutRes = await request("/api/auth/signout", {
    method: "POST",
    cookies: custCookie,
  });
  assert(signoutRes.status === 200 && signoutRes.json?.success === true, "Logout returned 200 success");

  // Verify cookie cleared
  const custClearCookie = signoutRes.setCookies.find((c) => c.startsWith("auth_session="));
  assert(
    Boolean(custClearCookie && (custClearCookie.includes("Max-Age=0") || custClearCookie.includes("1970"))),
    "auth_session cookie cleared with Max-Age=0"
  );

  // Subsequent check with old cookie must fail
  const postLogoutMe = await request("/api/auth/me", { cookies: custCookie });
  assert(
    postLogoutMe.status === 200 && postLogoutMe.json?.authenticated === false,
    `Post-logout request rejected (status: ${postLogoutMe.status}, authenticated: ${postLogoutMe.json?.authenticated})`
  );

  // --------------------------------------------------------------------------
  // Scenario 8: Multi-Tab Synchronization & Revoked Token Rejection
  // --------------------------------------------------------------------------
  console.log("\n--- SCENARIO 8: Multi-Tab Synchronization (Cross-Tab Session Revocation) ---");
  // Create a new vendor session to simulate Tab A and Tab B sharing the session cookie
  const tabLogin = await request("/api/auth/signin", {
    method: "POST",
    body: { email: "vendor2@riderzpro.com", password: "riderzpro@123", portal: "vendor" },
  });
  const tabCookie = parseSessionCookie(tabLogin.setCookies);
  const tabToken = extractToken(tabCookie);
  const tabTokenHash = crypto.createHash("sha256").update(tabToken).digest("hex");

  // Tab A logs out
  await request("/api/auth/signout", { method: "POST", cookies: tabCookie });

  // Tab B attempts to fetch protected dashboard with same cookie
  const tabBOp = await request("/api/vendor/dashboard", { cookies: tabCookie });
  assert(
    tabBOp.status === 401,
    `Tab B protected operation rejected with status 401 (status: ${tabBOp.status})`
  );

  const tabBMe = await request("/api/auth/me", { cookies: tabCookie });
  assert(
    tabBMe.json?.authenticated === false && tabBMe.json?.sessionRevoked === true,
    `Tab B /api/auth/me identifies revoked session: authenticated=${tabBMe.json?.authenticated}, sessionRevoked=${tabBMe.json?.sessionRevoked}`
  );

  // --------------------------------------------------------------------------
  // Scenario 9: Unauthenticated Route Protection & IDOR Validation
  // --------------------------------------------------------------------------
  console.log("\n--- SCENARIO 9: Direct Unauthenticated Access Protection ---");
  const unauthDash = await request("/api/vendor/dashboard");
  assert(
    unauthDash.status === 401,
    `Unauthenticated GET /api/vendor/dashboard returned 401: ${unauthDash.json?.error}`
  );

  const unauthMeCheck = await request("/api/auth/me");
  assert(
    unauthMeCheck.status === 200 && unauthMeCheck.json?.authenticated === false,
    `Unauthenticated GET /api/auth/me returns authenticated: false`
  );

  // --------------------------------------------------------------------------
  // Scenario 11: Security Edge Cases (Forged, Malformed, Missing Tokens)
  // --------------------------------------------------------------------------
  console.log("\n--- SCENARIO 11: Security Edge Cases (Forged, Malformed, Garbage Tokens) ---");
  const forgedToken = await request("/api/auth/me", { cookies: "auth_session=forged_token_12345" });
  assert(
    forgedToken.status === 200 && forgedToken.json?.authenticated === false,
    "Forged token returns authenticated: false"
  );

  const malformedToken = await request("/api/vendor/dashboard", { cookies: "auth_session=;;;" });
  assert(
    malformedToken.status === 401,
    "Malformed cookie returns 401"
  );

  // Clean up pgPool
  await pgPool.end();

  console.log(`\n===============================================================`);
  console.log(`SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log(`===============================================================\n`);

  if (failed > 0) process.exit(1);
}

runAll().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
