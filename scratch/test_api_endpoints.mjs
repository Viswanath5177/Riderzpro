async function testApis() {
  console.log("Testing API endpoints against PostgreSQL-backed dev server...\n");

  const baseUrl = "http://localhost:8080";

  // 1. Categories
  try {
    const res = await fetch(`${baseUrl}/api/categories`);
    const data = await res.json();
    console.log(`✓ GET /api/categories -> Status ${res.status}, Count: ${data.data?.length || data.categories?.length || (Array.isArray(data) ? data.length : "OK")}`);
  } catch (e) {
    console.error("✗ GET /api/categories failed:", e.message);
  }

  // 2. Products
  try {
    const res = await fetch(`${baseUrl}/api/products`);
    const data = await res.json();
    const count = data.data?.length ?? (Array.isArray(data) ? data.length : 0);
    console.log(`✓ GET /api/products -> Status ${res.status}, Products count: ${count}`);
  } catch (e) {
    console.error("✗ GET /api/products failed:", e.message);
  }

  // 3. Orders
  try {
    const res = await fetch(`${baseUrl}/api/orders`);
    const data = await res.json();
    const count = data.orders?.length ?? (Array.isArray(data) ? data.length : 0);
    console.log(`✓ GET /api/orders -> Status ${res.status}, Orders count: ${count}`);
  } catch (e) {
    console.error("✗ GET /api/orders failed:", e.message);
  }

  // 4. Admin Sellers
  try {
    const res = await fetch(`${baseUrl}/api/admin/sellers`);
    const data = await res.json();
    const sellers = data.sellers || data.data || [];
    console.log(`✓ GET /api/admin/sellers -> Status ${res.status}, Sellers count: ${sellers.length}`);
    if (sellers.length > 0) {
      console.log("  Sellers:", sellers.map((s) => ({ store: s.store_name, email: s.email, status: s.status })));
    }
  } catch (e) {
    console.error("✗ GET /api/admin/sellers failed:", e.message);
  }

  // 5. Vendor Login
  try {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "vendor1@riderzpro.com",
        password: "Vendor@Riderzpro2026",
        portal: "vendor",
        role: "seller"
      })
    });
    const data = await res.json();
    console.log(`✓ POST /api/auth/login (vendor1) -> Status ${res.status}, Success: ${data.success}, User: ${data.user?.store_name || data.user?.full_name || data.user?.email}`);
  } catch (e) {
    console.error("✗ POST /api/auth/login failed:", e.message);
  }

  // 6. Admin Login
  try {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@riderzpro.com",
        password: "Admin@123",
        role: "admin"
      })
    });
    const data = await res.json();
    console.log(`✓ POST /api/auth/login (admin) -> Status ${res.status}, Success: ${data.success}, Role: ${data.user?.role}`);
  } catch (e) {
    console.error("✗ POST /api/auth/login failed:", e.message);
  }

  // 7. Wishlist GET
  try {
    const res = await fetch(`${baseUrl}/api/wishlist?email=customer1@riderzpro.com`);
    const data = await res.json();
    console.log(`✓ GET /api/wishlist -> Status ${res.status}, Success: ${data.success}, Items count: ${data.count}`);
  } catch (e) {
    console.error("✗ GET /api/wishlist failed:", e.message);
  }
}

testApis().catch(console.error);
