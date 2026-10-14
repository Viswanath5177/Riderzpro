# RiderzPro Demo Day - Web Test Checklist
**QA Owner:** Hima Bindu  
**Version:** 1.0  
**Last Updated:** 2026-10-13

---

## 🎯 Demo Day Success Criteria

**The Goal:** Client orders product → Noida seller accepts → Rider picks up → Client watches on live map → Delivered with GST invoice

**Scope:** Website + Android app on own domain. Everything else is out of scope.

---

## ✅ Pre-Deployment Checklist

### Environment Setup
- [ ] https://app.<domain> is accessible
- [ ] SSL certificate valid (HTTPS only)
- [ ] OTP emails arrive from verified Resend domain
- [ ] Database seeded with demo data
- [ ] Test accounts created (customer, seller, rider, admin)

### Test Accounts Ready
- [ ] **Customer:** Demo customer with Delhi delivery address
- [ ] **Seller:** Approved Noida seller (KYC done, GSTIN, bank details)
- [ ] **Rider:** Noida rider assigned to area
- [ ] **Admin:** Admin user for monitoring

---

## 🧪 After First Deploy: Seller Signup → Admin Approval → Catalog

### Test 1: Seller Signup Flow
**Priority:** HIGH (Needed for demo seller setup)

**Steps:**
1. [ ] Navigate to seller signup page
2. [ ] Fill personal details (name, email, phone, password)
3. [ ] Verify email with OTP
4. [ ] Fill business details (store name, address, GSTIN)
5. [ ] Upload documents (PAN, Aadhaar, business proof)
6. [ ] Fill bank details (account number, IFSC, name, bank)
7. [ ] Submit application
8. [ ] Verify "Pending Approval" status shown

**Expected:** Seller application created with PENDING status

**Issues to Flag:**
- Any fake/mock data visible (e.g., hardcoded seller IDs)
- Documents not uploading correctly
- GSTIN validation not working
- Bank/IFSC validation failures

---

### Test 2: Admin Approval Flow
**Priority:** HIGH (Required before seller can list products)

**Steps:**
1. [ ] Login as admin
2. [ ] Navigate to Admin → Sellers page
3. [ ] Find pending seller application
4. [ ] Review submitted documents
5. [ ] Verify business details (GSTIN, address, bank)
6. [ ] Click "Approve" for Noida seller
7. [ ] Verify seller status changes to APPROVED
8. [ ] Verify seller receives approval notification

**Expected:** Seller status = APPROVED, can now list products

**Issues to Flag:**
- Admin cannot see pending applications
- Approval button doesn't work
- Status doesn't update after approval
- Documents not visible to admin

---

### Test 3: Catalog with Real Products
**Priority:** CRITICAL (Core demo functionality)

**Steps:**
1. [ ] Login as Noida seller
2. [ ] Navigate to product listing page
3. [ ] Verify 8-10 demo products exist
4. [ ] Check each product has:
   - [ ] Working image URL (loads correctly)
   - [ ] Correct seller name (Noida seller)
   - [ ] Real price and MRP
   - [ ] GST % and HSN code
   - [ ] Stock quantity > 0
   - [ ] Vehicle fitment info
5. [ ] Visit shop page as customer
6. [ ] Search for demo products
7. [ ] Verify all demo products appear
8. [ ] Click product → detail page loads
9. [ ] Verify product shows "Sold by <Noida seller> · Ships from Noida"

**Expected:** All demo products searchable, viewable, with real data

**Issues to Flag:**
- ❌ **CRITICAL:** Any mock/fake data visible to customers
- ❌ **CRITICAL:** Images broken or not loading
- ❌ **CRITICAL:** Wrong seller name shown
- ❌ **CRITICAL:** Prices showing as ₹0 or incorrect
- Missing GST % or HSN codes
- Stock showing as 0 or negative
- "localhost" URLs visible anywhere

---

## 🎬 Full Demo Flow Test (Run After Every Deploy)

### 1️⃣ Customer: Order Placement
**URL:** https://app.<domain>

- [ ] **Login**
  - [ ] Customer logs in with email OTP
  - [ ] OTP email arrives within 30 seconds
  - [ ] Code verification works
  - [ ] Redirects to shop page

- [ ] **Browse & Search**
  - [ ] Shop page loads with all products
  - [ ] Search for demo product (e.g., "battery")
  - [ ] Product appears in results
  - [ ] Click product card

- [ ] **Product Detail**
  - [ ] Product page loads with image
  - [ ] Shows correct seller name
  - [ ] Shows "Ships from Noida"
  - [ ] Shows stock available
  - [ ] "Add to Cart" button enabled
  - [ ] Click "Add to Cart"

- [ ] **Cart & Checkout**
  - [ ] Cart page shows product
  - [ ] Vendor shown as Noida seller
  - [ ] Delivery fee calculated
  - [ ] GST (18%) calculated correctly
  - [ ] Total = Items + Delivery + GST
  - [ ] Fill Delhi delivery address
  - [ ] Select payment method (Test Razorpay or COD)
  - [ ] Apply coupon (optional)
  - [ ] Click "Confirm Order"

- [ ] **Payment** (if using Razorpay test mode)
  - [ ] Razorpay popup appears
  - [ ] Select test payment method
  - [ ] Payment succeeds
  - [ ] Returns to order confirmation

- [ ] **Order Confirmation**
  - [ ] Order number displayed
  - [ ] Shows items, total, address
  - [ ] Status shows "Placed" or "Pending"
  - [ ] "Track Order" link available

---

### 2️⃣ Seller: Accept & Pack Order
**URL:** https://app.<domain>/vendor/dashboard

- [ ] **Login as Seller**
  - [ ] Seller logs in successfully
  - [ ] Dashboard loads

- [ ] **See New Order (Within 10 seconds)**
  - [ ] Orders tab shows new order
  - [ ] New order highlighted/badged
  - [ ] Order details visible (items, customer, amount)
  - [ ] Customer address shown (Delhi)
  - [ ] Auto-refresh works (10s interval)

- [ ] **Accept Order**
  - [ ] Click "Accept" button
  - [ ] Confirmation dialog appears
  - [ ] Status updates to "Accepted"
  - [ ] Customer sees status update

- [ ] **Pack Order**
  - [ ] Click "Mark as Packed" button
  - [ ] Status updates to "Packed"
  - [ ] Rider assignment should trigger
  - [ ] Status shows "Rider Assigned" or "Awaiting Pickup"

---

### 3️⃣ Rider: Pickup & Delivery
**URL:** Rider mobile app or https://app.<domain>/rider

- [ ] **Login as Rider**
  - [ ] Rider logs in on mobile app
  - [ ] Dashboard shows assigned delivery

- [ ] **View Delivery Job**
  - [ ] Job card shows:
    - [ ] Pickup: Noida seller address
    - [ ] Drop: Customer Delhi address
    - [ ] Items list
    - [ ] Order ID

- [ ] **Picked Up**
  - [ ] Tap "Picked Up" button
  - [ ] Status updates to "Picked Up"
  - [ ] GPS location sharing starts automatically
  - [ ] Customer tracking page activates

- [ ] **In Transit**
  - [ ] Status shows "In Transit"
  - [ ] GPS updates every 5 seconds
  - [ ] Customer sees live map movement

- [ ] **Delivered**
  - [ ] Rider reaches customer location
  - [ ] Tap "Delivered" button
  - [ ] Status updates to "Delivered"
  - [ ] GPS sharing stops

---

### 4️⃣ Customer: Live Tracking & Invoice
**URL:** https://app.<domain>/dashboard/customer or /track/:id

- [ ] **Track Order**
  - [ ] Navigate to "My Orders"
  - [ ] Click on active order
  - [ ] Tracking page loads

- [ ] **Live Map**
  - [ ] Map shows Noida → Delhi route
  - [ ] Rider marker visible and moving
  - [ ] ETA displayed and updating
  - [ ] WebSocket or polling (5s) working
  - [ ] Status updates show progress bar

- [ ] **Delivery Confirmation**
  - [ ] Status changes to "Delivered"
  - [ ] Success message displayed
  - [ ] "Download Invoice" button appears

- [ ] **GST Invoice**
  - [ ] Click "Download Invoice"
  - [ ] PDF downloads or opens
  - [ ] Invoice contains:
    - [ ] Seller GSTIN
    - [ ] Customer details
    - [ ] HSN codes for products
    - [ ] Taxable value breakdown
    - [ ] IGST (inter-state: UP → Delhi)
    - [ ] Total amount matches order

- [ ] **Order Confirmation Email**
  - [ ] Email received with order details
  - [ ] Invoice link in email works

---

### 5️⃣ Admin: Live Monitoring
**URL:** https://app.<domain>/admin

- [ ] **Login as Admin**
  - [ ] Admin logs in successfully
  - [ ] Admin dashboard loads

- [ ] **Live Orders Board**
  - [ ] Navigate to Admin → Orders
  - [ ] See all orders in real-time
  - [ ] Order shows:
    - [ ] Order ID and status
    - [ ] Customer name
    - [ ] Seller name (Noida seller)
    - [ ] Rider name (if assigned)
    - [ ] Payment status
    - [ ] Current location (if in transit)

- [ ] **Seller Management**
  - [ ] Navigate to Admin → Sellers
  - [ ] Noida seller shows as APPROVED
  - [ ] KYC status visible
  - [ ] All documents accessible

---

## 🔒 Security & Access Control Tests

### Customer Access Controls
- [ ] Customer can only see own orders
- [ ] Customer cannot access another customer's order by changing URL ID
- [ ] Customer cannot access seller dashboard
- [ ] Customer cannot access admin pages
- [ ] Customer session expires appropriately

### Seller Access Controls
- [ ] Seller can only see own products and orders
- [ ] Seller cannot see another seller's orders
- [ ] Seller cannot access admin pages
- [ ] Seller cannot modify other sellers' products

### Admin Access Controls
- [ ] Non-admin cannot access /admin routes
- [ ] Admin can view all orders
- [ ] Admin can view all sellers
- [ ] Admin approval actions work

**How to Test:**
1. Login as customer
2. Note an order ID from your orders
3. Try to access another order by changing URL: `/orders/{different_id}`
4. Should show "Not found" or "Unauthorized"
5. Try to access `/admin` → should redirect to login or show error
6. Repeat for seller and rider roles

**Report findings to Pushpam immediately if any access control fails.**

---

## 🎥 Backup Recording Requirements

### Record Complete Successful Run
- [ ] Screen recording software ready (OBS, Loom, or Windows Game Bar)
- [ ] Audio enabled (for commentary)
- [ ] Full screen or browser tab capture
- [ ] Test internet connection stability

### What to Record:
1. **Customer flow:** Login → Browse → Add to cart → Checkout → Pay → Confirm
2. **Seller flow:** See order → Accept → Pack (2-minute segment)
3. **Tracking:** Live map with rider moving Noida → Delhi (3-minute segment)
4. **Delivery:** Status changing to delivered
5. **Invoice:** Download and show PDF
6. **Admin view:** Show order in admin dashboard

**Recording specs:**
- Resolution: 1920x1080 minimum
- Format: MP4
- Length: ~10-15 minutes total
- Save as: `riderzpro-demo-backup-web-2026-10-14.mp4`
- Upload to team Google Drive

---

## ⚠️ Common Issues to Watch For

### Performance Issues
- [ ] Page load time > 3 seconds
- [ ] Images loading slowly
- [ ] Map lagging or freezing
- [ ] Database queries timing out

### UI/UX Issues
- [ ] Buttons not responding
- [ ] Forms not validating
- [ ] Toast notifications not appearing
- [ ] Modal dialogs not closing
- [ ] Mobile viewport broken layouts

### Integration Issues
- [ ] Order status not syncing between customer/seller/admin views
- [ ] Stock not reducing after order
- [ ] Payment confirmation not triggering status update
- [ ] Rider assignment not happening automatically
- [ ] GPS location not updating on map

### Data Issues
- [ ] Mock data visible (e.g., "Demo Seller", fake addresses)
- [ ] Hardcoded IDs in URLs or code
- [ ] Localhost URLs visible anywhere
- [ ] Test mode indicators visible to customers
- [ ] Incorrect GST calculations

---

## 📊 Test Results Summary Template

### Date: _____________
### Tester: Hima Bindu
### Environment: Production (https://app.<domain>)
### Build/Deploy: #_____

| Test Area | Status | Issues Found | Severity |
|---|---|---|---|
| Customer Login | ⬜ Pass / ⬜ Fail | | |
| Product Catalog | ⬜ Pass / ⬜ Fail | | |
| Cart & Checkout | ⬜ Pass / ⬜ Fail | | |
| Payment | ⬜ Pass / ⬜ Fail | | |
| Seller Dashboard | ⬜ Pass / ⬜ Fail | | |
| Order Accept/Pack | ⬜ Pass / ⬜ Fail | | |
| Rider App | ⬜ Pass / ⬜ Fail | | |
| Live Tracking | ⬜ Pass / ⬜ Fail | | |
| Invoice Download | ⬜ Pass / ⬜ Fail | | |
| Admin Dashboard | ⬜ Pass / ⬜ Fail | | |
| Access Controls | ⬜ Pass / ⬜ Fail | | |

**Overall Result:** ⬜ PASS (Ready for Demo) / ⬜ FAIL (Blockers Found)

**Demo Blockers:** ___ (Count)

**Go/No-Go Recommendation:** ____________

**Signed off by:** Hima Bindu & Pushpam

---

## 🎯 Success Criteria for Go/No-Go

### ✅ MUST PASS (Demo Blockers if Failed)
1. Customer can login and place order
2. Order appears in seller dashboard within 10 seconds
3. Seller can accept and pack order
4. Rider can mark picked up and delivered
5. Customer sees live map movement
6. Invoice downloads successfully
7. Admin can see order in live board
8. No mock data visible to customer
9. HTTPS working, no security warnings
10. Zero open demo-blocker issues

### 🟡 NICE TO HAVE (Demo Polish)
1. Page load times < 2 seconds
2. Perfect responsive design
3. All images optimized
4. Email notifications working
5. Payment recovery flow
6. Advanced admin features

---

**If 2 consecutive full passes on production → Sign off Go for Demo**  
**If any blocker found → No-Go until fixed and retested**

---

## 📞 Escalation & Support

### Issue Priority Escalation
- **P0 (Demo Blocker):** Report to Pushpam immediately on Slack
- **P1 (High):** Create GitHub issue, assign to owner, notify in team channel
- **P2 (Medium):** Create GitHub issue, discuss in standup
- **P3 (Low):** Document for post-demo backlog

### Contact List
- **System Issues:** Pushpam (CTO)
- **Deployment:** Hema
- **Integration:** Amrutha
- **Database:** Vamsi
- **Frontend:** Harshith, Sathesh
- **Mobile:** Aakash, Harshitha (QA mobile)

---

**End of Web Test Checklist**  
**Keep this checklist updated as features are completed!**
