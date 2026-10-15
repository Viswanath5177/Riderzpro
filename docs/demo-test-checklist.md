# Riderzpro Demo Day — QA Test Checklist
**Owner:** Harshitha  
**Date:** 14 October 2026  
**Scope:** Customer order → Seller accept/pack → Rider → Live map → Delivered → Invoice → Admin

---

## Devices

| Device | Role | OS | Browser/App |
|--------|------|----|-------------|
| Phone 1 | Customer | Android | Chrome + APK |
| Phone 2 | Seller | Android | Chrome + APK |
| Phone 3 | Rider | Android | Chrome + APK |
| Laptop | Admin / QA | Windows | Chrome |

---

## 1. OTP Login

| # | Step | Expected | Pass/Fail | Bug # |
|---|------|----------|-----------|-------|
| 1.1 | Open app on customer phone | App loads, shows home/login | | |
| 1.2 | Enter demo customer email | OTP sent to email within 10 s | | |
| 1.3 | Enter correct OTP | Logged in as customer, redirected to home | | |
| 1.4 | Enter wrong OTP | Error message shown, not logged in | | |
| 1.5 | Login as seller (vendor.auth) | Seller dashboard opens | | |
| 1.6 | Login as rider | Rider panel opens with assigned jobs | | |
| 1.7 | Try to open /admin without admin role | Redirected to login or 403 | | |
| 1.8 | Try to open another customer's order URL | Blocked / 403 | | |
| 1.9 | Seller cannot see another seller's orders | Only own orders visible | | |

---

## 2. Customer — Browse & Add to Cart

| # | Step | Expected | Pass/Fail | Bug # |
|---|------|----------|-----------|-------|
| 2.1 | Open /shop | Products load from DB (not mock data) | | |
| 2.2 | Search "battery" | Relevant products appear | | |
| 2.3 | Open a product page | Shows seller name "Noida seller", price, GST, stock | | |
| 2.4 | Add to cart | Cart count updates | | |
| 2.5 | Out-of-stock product | Add to cart button disabled | | |
| 2.6 | Open /cart | Correct items, qty, price shown | | |

---

## 3. Checkout & Payment

| # | Step | Expected | Pass/Fail | Bug # |
|---|------|----------|-----------|-------|
| 3.1 | Proceed to checkout | Delhi delivery address form appears | | |
| 3.2 | Enter Delhi address | Address saved, proceed button enabled | | |
| 3.3 | Select Razorpay test payment | Razorpay modal opens | | |
| 3.4 | Complete test payment | Order placed, confirmation page shown | | |
| 3.5 | Select COD | Order placed with COD_PENDING status | | |
| 3.6 | Order confirmation page | Order number, items, amount, seller, status visible | | |
| 3.7 | /orders (My Orders) | New order appears with correct status | | |
| 3.8 | Stock drops after order | Product page shows reduced stock | | |

---

## 4. Seller — Accept & Pack

| # | Step | Expected | Pass/Fail | Bug # |
|---|------|----------|-----------|-------|
| 4.1 | Seller dashboard refreshes | New order appears within 10 s (highlighted) | | |
| 4.2 | Seller clicks Accept | Order status → ACCEPTED, customer sees update | | |
| 4.3 | Seller clicks Reject | Order status → REJECTED, customer notified | | |
| 4.4 | Seller clicks Mark Packed | Order status → PACKED, rider assigned automatically | | |
| 4.5 | Seller sees "Rider assigned / Picked up" | Status updates as rider moves | | |
| 4.6 | Seller cannot see other seller's orders | Access correctly restricted | | |

---

## 5. Rider — Pickup & Delivery

| # | Step | Expected | Pass/Fail | Bug # |
|---|------|----------|-----------|-------|
| 5.1 | Rider logs into app | Sees assigned job with pickup (Noida) and drop (Delhi) | | |
| 5.2 | Location permission prompt | Android permission dialog appears | | |
| 5.3 | Rider taps "Picked Up" | Order status → PICKED_UP; customer tracking updates | | |
| 5.4 | Rider location streams | POST /api/rider/location every 5 s | | |
| 5.5 | Rider taps "Delivered" | Order status → DELIVERED | | |

---

## 6. Live Tracking (Customer view)

| # | Step | Expected | Pass/Fail | Bug # |
|---|------|----------|-----------|-------|
| 6.1 | Customer opens order detail | Live map shows Noida → Delhi route | | |
| 6.2 | Rider marker moves | Marker updates in real time (WebSocket / 5 s poll) | | |
| 6.3 | ETA updates | ETA counts down as rider moves | | |
| 6.4 | Status stages update | Stages: Order Placed → Vendor Accepted → Rider Assigned → Picked Up → Out for Delivery → Delivered | | |
| 6.5 | Delivered state | Map shows rider at destination, "Delivered!" shown | | |
| 6.6 | No "Simulate next step" button visible | Button hidden from customer view | | |

---

## 7. Invoice & Email

| # | Step | Expected | Pass/Fail | Bug # |
|---|------|----------|-----------|-------|
| 7.1 | "Download invoice" on order page | PDF/printable opens | | |
| 7.2 | Invoice has seller GSTIN | Noida seller's GSTIN visible | | |
| 7.3 | Invoice shows IGST (inter-state) | Noida (UP) → Delhi = IGST, not CGST+SGST | | |
| 7.4 | Invoice has HSN codes | Each line item has HSN code | | |
| 7.5 | Order confirmation email | Email received with invoice link within 30 s | | |

---

## 8. Admin Panel

| # | Step | Expected | Pass/Fail | Bug # |
|---|------|----------|-----------|-------|
| 8.1 | Admin Live Orders board | All orders visible with status, seller, rider, payment | | |
| 8.2 | Noida seller shown as approved + KYC | Seller status correct in admin.sellers | | |
| 8.3 | Non-admin cannot access /admin | Blocked with redirect or 403 | | |

---

## 9. Mobile-specific (Phones)

| # | Step | Expected | Pass/Fail | Bug # |
|---|------|----------|-----------|-------|
| 9.1 | Back button behaviour | Does not exit app unexpectedly | | |
| 9.2 | OTP screen keyboard | Keyboard doesn't cover OTP input | | |
| 9.3 | Screen edges / notch | No UI clipped by notch or nav bar | | |
| 9.4 | Full buying flow on phone | Customer order → delivered end to end on mobile | | |

---

## 10. Access Control (Security)

| # | Step | Expected | Pass/Fail | Bug # |
|---|------|----------|-----------|-------|
| 10.1 | Customer opens `/orders/<other_id>` | 403 / not found | | |
| 10.2 | Seller opens `/admin` | Redirected / blocked | | |
| 10.3 | Unauthenticated user opens `/cart` | Redirected to login | | |
| 10.4 | No mock/hardcoded data visible in demo screens | All data from real DB | | |

---

## Bug Severity Labels

- **demo-blocker** — blocks the demo flow entirely; must fix before go/no-go
- **demo-polish** — visible but doesn't break the flow; fix if time allows

## How to Log a Bug

1. Go to GitHub Issues → New Issue
2. Title: `[demo-blocker] Short description` or `[demo-polish] Short description`
3. Body: Steps to reproduce, expected vs actual, device/browser, screenshot
4. Assign to the **file owner** from the team tasks doc
5. Add label `demo-blocker` or `demo-polish`

---

## Sign-off

| Run | Date | Device | Tester | Result |
|-----|------|--------|--------|--------|
| Run 1 | | | Harshitha | |
| Run 2 | | | Harshitha | |

**Done when:** Mobile flow passes twice in a row on production. Mobile backup video saved.
