async function runTests() {
  console.log("=== Testing Wishlist API ===");

  // 1. Guest add
  const guestRes = await fetch("http://localhost:8080/api/wishlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product_id: "b1", action: "add" }),
  });
  const guestData = await guestRes.json();
  console.log("Guest POST /api/wishlist response:", guestData);

  // 2. Customer add
  const custAddRes = await fetch("http://localhost:8080/api/wishlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      product_id: "b1",
      action: "add",
      email: "customer1@riderzpro.com",
    }),
  });
  const custAddData = await custAddRes.json();
  console.log("Customer add /api/wishlist response:", custAddData);

  // 3. Customer GET wishlist
  const getRes = await fetch("http://localhost:8080/api/wishlist?email=customer1@riderzpro.com");
  const getData = await getRes.json();
  console.log("Customer GET /api/wishlist response:", getData);

  if (getData.success && getData.data.includes("b1")) {
    console.log("✅ SUCCESS: b1 saved and retrieved in customer wishlist!");
  } else {
    console.error("❌ FAILED to retrieve b1 in wishlist!");
  }

  // 4. Customer remove
  const delRes = await fetch("http://localhost:8080/api/wishlist", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      product_id: "b1",
      email: "customer1@riderzpro.com",
    }),
  });
  const delData = await delRes.json();
  console.log("Customer DELETE /api/wishlist response:", delData);

  // 5. Verify deleted
  const getRes2 = await fetch("http://localhost:8080/api/wishlist?email=customer1@riderzpro.com");
  const getData2 = await getRes2.json();
  console.log("Customer GET after delete response:", getData2);
  if (getData2.success && !getData2.data.includes("b1")) {
    console.log("✅ SUCCESS: b1 removed from wishlist!");
  }
}

runTests().catch(console.error);
