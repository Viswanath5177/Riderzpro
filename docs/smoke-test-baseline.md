# RiderzPro Demo Day - Smoke Test Baseline
**Tester:** Hima Bindu  
**Date:** 2026-10-13 Pre-Lunch  
**Branch:** feature/hima-quality  
**Server:** http://localhost:8080  

---

## Test Environment
- ✅ Server running on port 8080
- ✅ Database: SQLite/in-memory fallback mode
- ✅ Branch: feature/hima-quality (synced with main)
- ⚠️ Resend API configured (email OTP delivery)

---

## 🧪 Smoke Test 1: Login Flow

### Test Case: Customer Login via Email OTP
**URL:** http://localhost:8080/login

**Steps:**
1. Navigate to login page
2. Select "Email Address" tab
3. Enter email: `patchavabindu@gmail.com`
4. Click "Send sign-in code"
5. Check email for OTP code
6. Enter 6-digit code
7. Click "Verify and continue"

**Expected Result:**
- OTP email should arrive within 30 seconds
- Code should be valid for 10 minutes
- Successful login redirects to customer dashboard or /shop

**Actual Result:**
- ✅ Login page loads correctly
- ✅ Email input validation works
- ✅ "Send sign-in code" button enabled
- ⚠️ **NEEDS LIVE TEST:** OTP email delivery (Resend configured but not tested live)
- ⚠️ **NEEDS LIVE TEST:** OTP code verification flow

**Issues Found:**
- None in UI layer - backend integration needs testing with real OTP

**Status:** ✅ **UI PASS** | ⏳ **PENDING LIVE OTP TEST**

---

## 🧪 Smoke Test 2: Shop / Catalog

### Test Case: Browse Product Catalog
**URL:** http://localhost:8080/shop

**Steps:**
1. Navigate to shop page
2. Verify products load
3. Test search functionality
4. Test category filters
5. Test voltage filters (48V, 60V, 72V)
6. Click on a product card

**Expected Result:**
- Product catalog displays with images, prices, and stock
- Search filters products correctly
- Category filters work (All, Electric Bikes, EV Batteries, etc.)
- Product cards clickable to detail page

**Actual Result:**
- ✅ Shop page loads successfully
- ✅ Product grid displays (2-4 columns responsive)
- ✅ Search bar functional with live filtering
- ✅ Category pills work (All, Electric Bikes, EV Batteries, Car Accessories, Bike Accessories)
- ✅ Subcategory dropdown shows all categories
- ✅ Voltage filter buttons (48V, 60V, 72V) functional
- ✅ Sort by (Relevance, Price: Low→High, High→Low) working
- ✅ Product cards show: image, name, brand, price, rating, warranty, stock status
- ✅ "Load More" and "Show All" buttons work correctly
- ✅ Product detail page navigation works

**Issues Found:**
- None - catalog is fully functional

**Status:** ✅ **PASS**

---

## 🧪 Smoke Test 3: Shopping Cart

### Test Case: Add to Cart and Checkout Flow
**URL:** http://localhost:8080/cart

**Steps:**
1. Add product to cart from shop page
2. Navigate to cart page
3. Verify product appears in cart
4. Test quantity adjustment (+/-)
5. Verify price calculations (subtotal, delivery, GST, total)
6. Test address form
7. Test coupon code application
8. Review payment method selection

**Expected Result:**
- Products add to cart with toast notification
- Cart displays items grouped by vendor
- Quantity adjustments update totals
- Price calculation: items + delivery + GST - discount
- Address form validation works
- Coupon codes apply discounts
- Payment methods selectable (UPI, Card, COD)

**Actual Result:**
- ✅ Add to cart works with toast: "Added [product] to cart"
- ✅ Cart page loads with grouped items by vendor
- ✅ Each vendor group shows: store name, location, delivery fee, ETA
- ✅ Product display: image, name, price, stock status
- ✅ Quantity controls (+/-) update correctly
- ✅ Stock warnings show for low inventory
- ✅ Price summary displays:
  - ✅ Items Subtotal
  - ✅ Delivery Total (₹40 base + ₹12/km per vendor)
  - ✅ GST (18%)
  - ✅ Coupon discount (EVSAFE: ₹500 off, RIDER10: 10% off)
  - ✅ Grand Total
- ✅ Address form with all fields (name, phone, street, city, pincode)
- ✅ Address editing toggle works
- ✅ Coupon application: "EVSAFE" and "RIDER10" both work
- ✅ Payment method selector (UPI, Card, COD) with icons
- ⚠️ **MOCK DATA:** Cart uses browser localStorage, not real backend
- ⚠️ **NOT TESTED:** Actual order placement API call
- ⚠️ **NOT TESTED:** Payment processing (Razorpay integration)

**Issues Found:**
1. **MEDIUM** - Stock validation happens in UI but needs backend verification
2. **LOW** - Empty cart shows recommended products (good UX, works correctly)

**Status:** ✅ **UI/UX PASS** | ⏳ **PENDING BACKEND INTEGRATION**

---

## 📊 Baseline Bug Summary

### 🔴 Demo Blockers Found: **0**
No critical blockers identified in current main.

### 🟡 Demo Polish Found: **2**

#### BUG-SMOKE-001: Cart Stock Validation UI Only
- **Component:** Cart (cart.tsx)
- **Owner:** Harshith
- **Severity:** demo-polish
- **Description:** Stock validation happens in UI but should be verified server-side during order placement
- **Impact:** LOW - Won't break demo, but production needs backend check
- **Fix Priority:** After Vamsi's orders API is live

#### BUG-SMOKE-002: Missing Backend Integration Indicators
- **Component:** Multiple (Cart, Login)
- **Severity:** demo-polish
- **Description:** No clear indication to users when mock data vs real API is being used
- **Impact:** LOW - Demo prep issue, not user-facing
- **Fix Priority:** Documentation only

---

## ✅ What Works Well (Positive Findings)

1. ✅ **Responsive Design:** All pages tested work on desktop and mobile viewports
2. ✅ **Navigation:** Site navigation, breadcrumbs, and routing functional
3. ✅ **Product Search:** Fast, accurate filtering and search
4. ✅ **Cart UX:** Clean interface, multi-vendor support, clear pricing
5. ✅ **Form Validation:** Email, phone, address fields validate correctly
6. ✅ **Loading States:** Proper loading indicators and disabled states
7. ✅ **Error Handling:** UI-level error messages display correctly
8. ✅ **Performance:** Pages load quickly, no noticeable lag

---

## 🚧 Testing Blockers (Waiting On)

### Cannot Test Until Available:
1. ⏳ **Live OTP Delivery** - Waiting for Resend email test with real inbox
2. ⏳ **Order Placement API** - Waiting for Vamsi's POST /api/orders
3. ⏳ **Seller Portal** - Waiting for Amrutha's API split and Sathesh's seller UI
4. ⏳ **Admin Approval Flow** - Waiting for seller approval API
5. ⏳ **Payment Integration** - Waiting for Sathwik's Razorpay implementation
6. ⏳ **Real Catalog** - Waiting for Muni's catalog API and Vamsi's demo products
7. ⏳ **Rider Panel** - Waiting for Amrutha's rider routes
8. ⏳ **Live Tracking** - Waiting for Viswanath's logistics integration

---

## 🎯 Next Steps (After First Deploy)

### Priority 1: Test After Hema's First Deployment
1. Verify https://app.<domain> is accessible
2. Test OTP email delivery on production
3. Verify SSL certificate and HTTPS
4. Test from multiple devices

### Priority 2: Test After Vamsi's Orders API Merge
1. End-to-end order placement
2. Verify order appears in database
3. Test stock reduction
4. Verify pricing calculations server-side

### Priority 3: Test Seller Flow
1. Seller sees incoming orders
2. Accept/Reject/Pack actions work
3. Status updates propagate to customer view

### Priority 4: Test Full Demo Flow
1. Customer orders → Seller accepts → Rider picks up → Delivered
2. Invoice generation
3. Admin visibility
4. Mobile app testing (with Harshitha)

---

## 📝 Recommendations for Team

### For Amrutha (Integration Lead):
- ✅ Current UI is ready for backend integration
- Focus on orders API first (highest demo priority)
- Stock validation should be enforced server-side

### For Vamsi (Database):
- UI expects these order fields: id, items[], customer, seller, total, payment_method, status, shipping_address
- Cart sends vendor-grouped items with quantities

### For Harshith (Customer Flow):
- ✅ Cart UI is excellent
- Consider adding "processing" state between click and redirect
- Test with slow network conditions

### For Sathwik (Payments):
- Cart supports UPI/Card/COD selection
- Need to disable "Place Order" during payment processing
- Consider payment failure scenarios

### For Hema (Deployment):
- Current localhost:8080 setup works perfectly
- No environment-specific issues found
- Ready for deployment

---

## 🎬 Demo Day Readiness: **ON TRACK** ✅

**Current State:** UI layer is production-ready and fully functional. Waiting on backend APIs and integrations for end-to-end flow.

**Risk Level:** LOW - No blockers found in current implementation. Timeline depends on API development completing before demo day.

**Confidence Level:** HIGH - Solid foundation with clean separation between UI and backend. Integration should be straightforward.

---

**End of Baseline Smoke Test Report**  
**Next Update:** After Hema's first deployment and Amrutha's API split
