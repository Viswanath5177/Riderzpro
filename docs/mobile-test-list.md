# Riderzpro Mobile & APK Test List

**Owner:** Harshitha (Mobile app · APK · QA (mobile) · Delivery end-to-end)  
**Date:** 15 October 2026  
**Target:** Android APK (Capacitor 8) & Production Mobile Browser  
**Server URL:** `CAPACITOR_SERVER_URL=https://app.<domain>` / `http://localhost:8080/app`

---

## 📱 Test Matrix: 3 Dedicated Phones + Laptop

| Device | Role | Platform / Build | Primary Screens Under Test |
|---|---|---|---|
| **Phone 1** | **Customer** | Android APK / Chrome Mobile | `/app` Light App Shell, Cart, Delhi Checkout, Live Map Tracking |
| **Phone 2** | **Seller** | Android APK / Chrome Mobile | `/vendor/dashboard` (Orders Section, Accept/Reject, Mark Packed, Inventory Decrement) |
| **Phone 3** | **Rider** | Android APK / Chrome Mobile | `/rider/dashboard` (Location Sharing, Job Card, Picked Up, Mark Delivered) |
| **Laptop** | **Admin / QA** | Windows / Chrome Desktop | `/admin` Live Orders Board, Sellers KYC Directory, Telemetry Oversight |

---

## 🛠️ Bug Ownership & Triage Routing

If any step fails during the demo runs, file a GitHub Issue immediately using the exact labels and assignee:

| Failure Type | Triage Owner | GitHub Label | Action |
|---|---|---|---|
| **Backend / DB breaks** | **Vamsi** | `backend-db` / `demo-blocker` | API 500, SQLite locks, delivery state row missing |
| **Screen / State breaks** | **Sathesh** | `seller-rider-ui` / `demo-blocker` | Seller button unresponsive, Rider job state sync |
| **Layout / Buying flow bugs** | **Harshith** | `buying-flow` / `demo-polish` | Checkout form, payment slot, cart drawer overlap |
| **Mobile shell / Safe area bugs** | **Harshitha** | `mobile-qa` / `demo-polish` | Header/footer leaking on native, notch clipping, back button |

---

## 1. Light App Shell & Native Navigation (`/app`)

| # | Test Case | Target / Route | Expected Result | Pass/Fail | Bug # |
|---|---|---|---|---|---|
| **1.1** | **Native Header Suppression** | Launch APK (`/app`) | Web header with desktop navbar is NEVER shown. Clean mobile top bar with Riderzpro logo and vehicle pill is displayed. | | |
| **1.2** | **Native Footer Suppression** | Launch APK (`/app`) | 4-column desktop footer with links is NEVER shown. | | |
| **1.3** | **Hero Video Suppression** | Launch APK (`/app`) | No desktop marketing hero video loads. Lightweight Delhi express banner is shown instead. | | |
| **1.4** | **Floating Chatbot Bubble** | Launch APK (`/app`) | Chatbot bubble widget is hidden from the main view and does not obstruct bottom tabs or buttons. | | |
| **1.5** | **Bottom Tab Bar Rendering** | Bottom Bar | 4 tabs are visible and accessible with safe area padding: `Home`, `Categories`, `Orders`, `Account`. | | |
| **1.6** | **Hardware Back Button** | Hardware Back Button | On `/app` root screen, first press shows toast *"Press back again to exit RiderzPro"*. Second press exits app. On child routes, navigates back in history. | | |
| **1.7** | **Soft Keyboard Handling** | OTP / Login / Input | Input fields automatically scroll into comfortable center view on focus; viewport padding adjusts to prevent keyboard occlusion. | | |

---

## 2. Customer Buying Flow (Phone 1)

| # | Test Case | Target / Route | Expected Result | Pass/Fail | Bug # |
|---|---|---|---|---|---|
| **2.1** | **Browse & Select Vehicle** | Home tab → Switch Bike | Select "Ather 450X" or "Ola S1 Pro"; featured products filter to compatible EV batteries. | | |
| **2.2** | **Add to Cart** | Home tab → Add Button | Product adds to cart instantly; top cart badge updates with count; toast notification confirms 30-min express dispatch. | | |
| **2.3** | **Checkout Address** | Cart → Checkout | Delhi delivery address validation accepts valid pincode (e.g. `110001` Connaught Place); rejects non-Delhi addresses. | | |
| **2.4** | **Payment Method** | Payment Step | Razorpay test modal opens cleanly; COD option creates order with `COD_PENDING` status. | | |
| **2.5** | **Order Confirmation** | `/order-confirmation/$id` | Shows order number, items, total with statutory GST, seller name, and live tracking button. | | |

---

## 3. Seller Order Processing (Phone 2)

| # | Test Case | Target / Route | Expected Result | Pass/Fail | Bug # |
|---|---|---|---|---|---|
| **3.1** | **New Order Highlight** | `/vendor/dashboard` | New customer order appears in Seller Orders section within 10s with highlight banner. | | |
| **3.2** | **Accept Order** | Seller Orders | Seller taps "Accept"; status transitions to `ACCEPTED`; customer view reflects update. | | |
| **3.3** | **Mark Packed** | Seller Orders | Seller taps "Mark Packed"; status transitions to `PACKED`; delivery dispatch row created in logistics engine. | | |
| **3.4** | **Inventory Decrement** | Seller Inventory | Product stock quantity decrements in real-time matching the ordered quantity. | | |

---

## 4. Rider Delivery & Telemetry (Phone 3)

| # | Test Case | Target / Route | Expected Result | Pass/Fail | Bug # |
|---|---|---|---|---|---|
| **4.1** | **Job Assignment** | `/rider/dashboard` | Rider sees assigned delivery job showing Pickup (Noida Hub) and Dropoff (Delhi customer). | | |
| **4.2** | **Location Permission** | Rider Dashboard | Geolocation module requests permission and streams GPS coordinates every 5s to `/api/rider/location`. | | |
| **4.3** | **Picked Up Action** | Rider Panel | Rider taps "Picked Up"; order status transitions to `PICKED_UP`. | | |
| **4.4** | **Delivered Action** | Rider Panel | Rider taps "Delivered"; order status transitions to `DELIVERED`. | | |

---

## 5. Live Tracking & Full-Height Map (Phone 1 & Customer)

| # | Test Case | Target / Route | Expected Result | Pass/Fail | Bug # |
|---|---|---|---|---|---|
| **5.1** | **In-App Live Map** | Orders tab → Track Live GPS | Full-height `<DeliveryMap>` opens smoothly with OpenStreetMap / Carto raster tiles. | | |
| **5.2** | **Rider Movement** | Map Component | Rider marker smoothly lerps along route with heading angle and pulse effect. | | |
| **5.3** | **Route Status Stages** | Map Overlay | Progress reflects stages: Placed → Accepted → Packed → Picked Up → Delivered. | | |
| **5.4** | **Delivery Completion** | Map Component | On `DELIVERED`, rider marker reaches destination pin; "Delivered!" success card appears. | | |

---

## 6. Statutory GST Invoice Verification

| # | Test Case | Target / Route | Expected Result | Pass/Fail | Bug # |
|---|---|---|---|---|---|
| **6.1** | **Download Invoice Button** | Orders tab / Order Detail | Tapping "Download Tax Invoice" opens formatted Rule 46 GST printable invoice. | | |
| **6.2** | **Tax Breakdown** | Invoice Modal | Correctly computes IGST for inter-state (UP Noida → Delhi) or CGST+SGST for intra-state. | | |
| **6.3** | **Seller GSTIN & HSN** | Invoice Modal | Displays Noida seller's registered GSTIN and valid automotive HSN codes. | | |

---

## 7. Sign-off & Completion Criteria

- [ ] **Run 1 (Pre-Demo Validation):** End-to-end sequence (Customer order → Seller Pack → Rider Delivery → Live Map → GST Invoice) passes without crash.
- [ ] **Run 2 (Production Run):** Full mobile flow passes twice consecutively on production devices.
- [ ] **Backup Video:** Screen recording of full flow saved locally for emergency backup.

**Signed off by:** Harshitha (QA Mobile Lead)
