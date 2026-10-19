const accounts = [
  { role: "Super Admin", email: "admin@riderzpro.com", pass: "riderzpro@123", portal: "admin" },
  { role: "Unified Operations Admin", email: "admin.operations@riderzpro.com", pass: "riderzpro@123", portal: "admin" },
  { role: "Vendor 1 (Vendor Portal)", email: "vendor1@riderzpro.com", pass: "riderzpro@123", portal: "vendor" },
  { role: "Vendor 2 (Vendor Portal)", email: "vendor2@riderzpro.com", pass: "riderzpro@123", portal: "vendor" },
  { role: "Customer 1", email: "customer1@riderzpro.com", pass: "riderzpro@123", portal: "customer" },
  { role: "Customer 2", email: "customer2@riderzpro.com", pass: "riderzpro@123", portal: "customer" },
  { role: "Customer 3", email: "customer3@riderzpro.com", pass: "riderzpro@123", portal: "customer" },
];

console.log("=== VERIFYING SIGN-IN FOR ALL 7 TEST ACCOUNTS ===");

let passed = 0;
let failed = 0;

for (const acc of accounts) {
  try {
    const res = await fetch("http://localhost:8080/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: acc.email, password: acc.pass, portal: acc.portal }),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      console.log(`[PASS] ${acc.role} (${acc.email}) -> authenticated successfully (user ID: ${data.user?.id}, role: ${data.user?.role}, redirectUrl: ${data.redirectUrl})`);
      passed++;
    } else {
      console.error(`[FAIL] ${acc.role} (${acc.email}) -> status ${res.status}:`, data);
      failed++;
    }
  } catch (err) {
    console.error(`[ERROR] ${acc.role} (${acc.email}) ->`, err.message);
    failed++;
  }
}

console.log(`\nResult: ${passed} PASSED, ${failed} FAILED`);
if (failed > 0) process.exit(1);
