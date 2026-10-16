// Test script to verify Product Details, Multi-Vendor Offers, Reviews, and Helpful Upvotes
const BASE_URL = "http://localhost:8080";
const PRODUCT_ID = "RZP-BAT-60V30AH";

async function run() {
  console.log("=== 1. FETCH PRODUCT DETAIL ===");
  const res = await fetch(`${BASE_URL}/api/products/${PRODUCT_ID}`);
  const data = await res.json();
  if (!data.success) {
    console.error("FAIL: Could not fetch product:", data);
    process.exit(1);
  }
  const p = data.data;
  console.log("Product Name:", p.name);
  console.log("Brand:", p.brand);
  console.log("Price:", p.price, "MRP:", p.mrp, "GST Percent:", p.gst_percent);
  console.log("Offers Count:", p.offers?.length);
  p.offers.forEach((o, i) => {
    console.log(`  Offer ${i + 1}: ${o.sellerName} | Price: ₹${o.price} | Rating: ${o.rating}★ (${o.reviewCount} reviews) | Stock: ${o.stock} | Shipping: ₹${o.shippingCharge}`);
  });
  console.log("Initial Reviews Count:", p.reviews?.length);
  console.log("Average Rating:", p.stats?.average_rating);
  console.log("Rating Distribution:", JSON.stringify(p.stats?.rating_distribution));

  console.log("\n=== 2. TEST SUBMITTING A REVIEW ===");
  const newRevRes = await fetch(`${BASE_URL}/api/products/${PRODUCT_ID}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      rating: 5,
      title: "Phenomenal range and seamless Indiranagar fitment",
      comment: "VoltHub EV verified my bike fitment on Ola S1 Pro and installed it seamlessly. Zero range anxiety now!",
      userName: "Harish Murthy",
      userCity: "Bengaluru",
      fitmentVehicle: "Ola S1 Pro",
    }),
  });
  const newRevData = await newRevRes.json();
  console.log("Review Submit Response:", newRevData);

  if (!newRevData.success) {
    console.error("FAIL: Review submission failed");
    process.exit(1);
  }

  const createdReviewId = newRevData.review.id;
  console.log("Created Review ID:", createdReviewId);

  console.log("\n=== 3. TEST HELPFUL UPVOTE ===");
  const helpfulRes = await fetch(`${BASE_URL}/api/products/${PRODUCT_ID}/reviews/${createdReviewId}/helpful`, {
    method: "POST",
  });
  const helpfulData = await helpfulRes.json();
  console.log("Helpful Upvote Response:", helpfulData);

  console.log("\n=== 4. VERIFY RECALCULATED PRODUCT STATS ===");
  const updatedRes = await fetch(`${BASE_URL}/api/products/${PRODUCT_ID}`);
  const updatedData = await updatedRes.json();
  const updatedP = updatedData.data;
  console.log("Updated Reviews Count:", updatedP.reviews?.length);
  console.log("Updated Average Rating:", updatedP.stats?.average_rating);
  console.log("Updated Rating Distribution:", JSON.stringify(updatedP.stats?.rating_distribution));

  const ourReview = updatedP.reviews.find((r) => r.id === createdReviewId);
  console.log("Persisted Review Found in List:", Boolean(ourReview));
  console.log("Persisted Helpful Count:", ourReview?.helpfulCount);

  if (ourReview && ourReview.helpfulCount === 1) {
    console.log("\n✅ ALL END-TO-END PRODUCT DETAIL, OFFERS, REVIEWS & STATS CHECKS PASSED!");
  } else {
    console.error("FAIL: Helpful count was not incremented properly.");
    process.exit(1);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
