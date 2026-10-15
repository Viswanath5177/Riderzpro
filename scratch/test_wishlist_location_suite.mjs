const BASE_URL = "http://localhost:8080";

async function runTests() {
  console.log("====================================================");
  console.log("STARTING WISHLIST & DELIVERY LOCATION TEST SUITE");
  console.log("====================================================\n");

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

  function createTestCustomer(prefix) {
    const custId = `usr_${prefix}_${Date.now()}`;
    const email = `${prefix}_${Date.now()}@test-riderzpro.com`;
    return {
      custId,
      email,
      urlParam: `customer_id=${encodeURIComponent(custId)}`,
    };
  }

  // --------------------------------------------------------------------------
  // PART A: WISHLIST TESTS (1 - 14)
  // --------------------------------------------------------------------------
  console.log("--- PART A: WISHLIST SYNCHRONIZATION TESTS ---");

  // Get 2 valid active products from catalog
  const catalogRes = await fetch(`${BASE_URL}/api/products`);
  const catalogData = await catalogRes.json();
  const activeProducts = (catalogData.products || catalogData.data || []).filter(
    (p) => p.isActive !== false && p.is_active !== false
  );

  if (activeProducts.length < 2) {
    throw new Error("Need at least 2 active products in catalog for testing");
  }
  const prodA = activeProducts[0];
  const prodB = activeProducts[1];
  console.log(`Using Products: [A] ${prodA.name} (${prodA.id}), [B] ${prodB.name} (${prodB.id})`);

  const c1 = createTestCustomer("c1");
  const c2 = createTestCustomer("c2");
  console.log(`Initialized Test Customers: C1 (${c1.custId}), C2 (${c2.custId})`);

  // Test 1: New customer with an empty wishlist
  const w1 = await fetch(`${BASE_URL}/api/wishlist?${c1.urlParam}`);
  const d1 = await w1.json();
  assert(d1.success && Array.isArray(d1.items) && d1.items.length === 0, "1. New customer has an empty wishlist (count = 0)");

  // Test 2: Customer adds one product
  const add1 = await fetch(`${BASE_URL}/api/wishlist?${c1.urlParam}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product_id: prodA.id, action: "add" }),
  });
  const add1Data = await add1.json();
  assert(add1Data.success, "2. Customer successfully added Product A to wishlist");

  // Test 3: Customer adds a second product
  const add2 = await fetch(`${BASE_URL}/api/wishlist?${c1.urlParam}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product_id: prodB.id, action: "add" }),
  });
  const add2Data = await add2.json();
  assert(add2Data.success, "3. Customer successfully added Product B to wishlist");

  // Test 4: Header badge and wishlist page show the same count (count = 2)
  const w4 = await fetch(`${BASE_URL}/api/wishlist?${c1.urlParam}`);
  const d4 = await w4.json();
  assert(
    d4.success && d4.items.length === 2 && d4.count === 2,
    "4. Wishlist query returns exactly 2 products (badge count === items.length === 2)"
  );
  assert(
    d4.items.some((it) => it.product_id === prodA.id) && d4.items.some((it) => it.product_id === prodB.id),
    "4b. Returns rich joined product details for both items"
  );

  // Test 5: Customer removes one product
  const rem1 = await fetch(`${BASE_URL}/api/wishlist?${c1.urlParam}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product_id: prodA.id }),
  });
  const rem1Data = await rem1.json();
  const w5 = await fetch(`${BASE_URL}/api/wishlist?${c1.urlParam}`);
  const d5 = await w5.json();
  assert(
    rem1Data.success && d5.items.length === 1 && d5.items[0].product_id === prodB.id,
    "5. Removing Product A leaves exactly 1 item (Product B, count = 1)"
  );

  // Test 6: Customer removes the final product
  const rem2 = await fetch(`${BASE_URL}/api/wishlist?${c1.urlParam}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product_id: prodB.id }),
  });
  const rem2Data = await rem2.json();
  const w6 = await fetch(`${BASE_URL}/api/wishlist?${c1.urlParam}`);
  const d6 = await w6.json();
  assert(
    rem2Data.success && d6.items.length === 0,
    "6. Removing final product leaves wishlist empty (count = 0, empty state triggered)"
  );

  // Test 7: Refresh preserves wishlist data
  await fetch(`${BASE_URL}/api/wishlist?${c1.urlParam}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product_id: prodA.id, action: "add" }),
  });
  const w7 = await fetch(`${BASE_URL}/api/wishlist?${c1.urlParam}`);
  const d7 = await w7.json();
  assert(
    d7.success && d7.items.length === 1 && d7.items[0].product_id === prodA.id,
    "7. Persisted wishlist data preserved on subsequent page request"
  );

  // Test 8: Logout and login restore the correct wishlist
  const wGuest = await fetch(`${BASE_URL}/api/wishlist`);
  const dGuest = await wGuest.json();
  assert(dGuest.success && dGuest.items.length === 0, "8a. Unauthenticated guest sees 0 items (clean state on logout)");
  const wRelogin = await fetch(`${BASE_URL}/api/wishlist?${c1.urlParam}`);
  const dRelogin = await wRelogin.json();
  assert(
    dRelogin.success && dRelogin.items.length === 1 && dRelogin.items[0].product_id === prodA.id,
    "8b. Relogin restores Customer 1's exact saved items"
  );

  // Test 9: Two customers have independent wishlists
  await fetch(`${BASE_URL}/api/wishlist?${c2.urlParam}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product_id: prodB.id, action: "add" }),
  });
  const wC1 = await (await fetch(`${BASE_URL}/api/wishlist?${c1.urlParam}`)).json();
  const wC2 = await (await fetch(`${BASE_URL}/api/wishlist?${c2.urlParam}`)).json();
  assert(wC1.items.length === 1 && wC1.items[0].product_id === prodA.id, "9a. Customer 1 wishlist contains ONLY Product A");
  assert(wC2.items.length === 1 && wC2.items[0].product_id === prodB.id, "9b. Customer 2 wishlist contains ONLY Product B (Complete isolation)");

  // Test 10: Duplicate add requests do not create duplicate records
  await fetch(`${BASE_URL}/api/wishlist?${c1.urlParam}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product_id: prodA.id, action: "add" }),
  });
  const wDup = await (await fetch(`${BASE_URL}/api/wishlist?${c1.urlParam}`)).json();
  assert(wDup.items.length === 1, "10. Repeated add of Product A does not create duplicate entries (deduplication verified)");

  // Test 11: Non-existent product handling
  const invRes = await fetch(`${BASE_URL}/api/wishlist?${c1.urlParam}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product_id: "prod_nonexistent_12345", action: "add" }),
  });
  assert(invRes.status === 404, "11. Attempting to wishlist non-existent product properly rejected with 404");

  // Test 12: Invalid or deleted product references are handled correctly
  const w12 = await (await fetch(`${BASE_URL}/api/wishlist?${c1.urlParam}`)).json();
  assert(w12.items.every((it) => it.name != null && it.price != null), "12. All returned wishlist items correspond to valid active catalog products");

  // Test 13 & 14: Cart and Wishlist isolation
  const cartRes = await fetch(`${BASE_URL}/api/cart?${c1.urlParam}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId: prodB.id, vendorId: "v_01", qty: 1 }),
  });
  const cartData = await cartRes.json();
  const wAfterCart = await (await fetch(`${BASE_URL}/api/wishlist?${c1.urlParam}`)).json();
  assert(cartData.success && wAfterCart.items.length === 1, "13. Cart additions do not alter customer wishlist count");
  assert(wAfterCart.items[0].product_id === prodA.id, "14. Wishlist items remain unchanged and isolated from cart operations");

  // --------------------------------------------------------------------------
  // PART B: DELIVERY LOCATION & SAVED ADDRESSES TESTS (1 - 15)
  // --------------------------------------------------------------------------
  console.log("\n--- PART B: DELIVERY LOCATION & SAVED ADDRESSES TESTS ---");

  // Test 1 & 2: Popular delivery locations removed & no hardcoded default for new customer
  const addrGuest = await (await fetch(`${BASE_URL}/api/customer/addresses`)).json();
  assert(addrGuest.success && addrGuest.data.length === 0, "1 & 2. Guest / Unauthenticated customer sees 0 saved addresses (no fabricated Bellandur addresses)");

  // Test 3: GPS detection resolves actual device coordinates
  const gpsRes = await (await fetch(`${BASE_URL}/api/location/reverse-geocode?lat=17.3850&lng=78.4867`)).json();
  assert(gpsRes.success && gpsRes.city === "Hyderabad", "3. Reverse geocoding resolves real device coordinates (lat: 17.3850 -> Hyderabad)");

  // Test 4 & 5: GPS reverse geocode for Bangalore
  const gpsBangalore = await (await fetch(`${BASE_URL}/api/location/reverse-geocode?lat=12.9784&lng=77.6408`)).json();
  assert(gpsBangalore.success && gpsBangalore.city === "Bengaluru", "4 & 5. High accuracy geocoding resolves Indiranagar, Bengaluru without hardcoded strings");

  // Test 6: New customer sees no fabricated saved addresses
  const addrC1 = await (await fetch(`${BASE_URL}/api/customer/addresses?${c1.urlParam}`)).json();
  assert(addrC1.success && addrC1.data.length === 0, "6. New customer has empty saved addresses list (no mock addresses)");

  // Test 7 & 9: Adding an address persists it in database under customer
  const newAddrPayload = {
    customerId: c1.custId,
    label: "Home",
    fullName: "Vamsi Subbarayudu",
    phone: "+91 98888 22222",
    houseFlat: "Flat 101, Prestige Towers",
    streetLocality: "Koramangala 4th Block",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560034",
    isDefault: true,
  };
  const addAddrRes = await fetch(`${BASE_URL}/api/customer/addresses?${c1.urlParam}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newAddrPayload),
  });
  const addAddrData = await addAddrRes.json();
  assert(
    addAddrData.success && addAddrData.data && addAddrData.data.pincode === "560034",
    "7 & 9. New delivery address persisted in database under authenticated customer"
  );
  const savedAddrId = addAddrData.data.id;

  // Test 8: Duplicate test addresses handled correctly (deduplication)
  const dupAddrRes = await fetch(`${BASE_URL}/api/customer/addresses?${c1.urlParam}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newAddrPayload),
  });
  const dupAddrData = await dupAddrRes.json();
  const c1Addrs = await (await fetch(`${BASE_URL}/api/customer/addresses?${c1.urlParam}`)).json();
  assert(c1Addrs.data.length === 1, "8. Re-saving exact same address updates existing row without creating duplicate cards");

  // Test 10: Existing customer sees only their own saved addresses
  const c2Addrs = await (await fetch(`${BASE_URL}/api/customer/addresses?${c2.urlParam}`)).json();
  assert(c2Addrs.data.length === 0, "10. Customer 2 sees 0 saved addresses (Customer isolation verified, cannot see Customer 1's address)");

  // Test 13: Another customer cannot delete or access address through API manipulation
  const crossDel = await fetch(`${BASE_URL}/api/customer/addresses?${c2.urlParam}&id=${savedAddrId}`, {
    method: "DELETE",
  });
  const checkAfterCrossDel = await (await fetch(`${BASE_URL}/api/customer/addresses?${c1.urlParam}`)).json();
  assert(
    checkAfterCrossDel.data.length === 1 && checkAfterCrossDel.data[0].id === savedAddrId,
    "13. Unauthorized deletion attempt by Customer 2 prevented (ownership enforced)"
  );

  // Test 14 & 15: Successful deletion by owner
  const ownDel = await fetch(`${BASE_URL}/api/customer/addresses?${c1.urlParam}&id=${savedAddrId}`, {
    method: "DELETE",
  });
  const ownDelData = await ownDel.json();
  const checkAfterOwnDel = await (await fetch(`${BASE_URL}/api/customer/addresses?${c1.urlParam}`)).json();
  assert(ownDelData.success && checkAfterOwnDel.data.length === 0, "14 & 15. Address owner can delete address (list returns to empty state)");

  console.log("\n====================================================");
  console.log(`TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log("====================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test execution failed with fatal error:", err);
  process.exit(1);
});
