# RiderzPro Vendor Module — Architecture & Demo Guide

This document summarizes the end-to-end Vendor Sign-up/Sign-in, Seller Onboarding Stepper, Verification Lifecycle, Vendor Dashboard, Admin Moderation Queue, and Customer Merged Catalogue built for **RiderzPro**.

---

## 1. Demo Credentials & Quick Start

### Vendor Accounts
| Persona | Mobile Number | Password | Demo OTP | Starting Route | State |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Approved Vendor** (VoltHub Indiranagar) | `9000000001` | `Vendor@123` | `123456` | `/vendor/dashboard` | Approved (Gold Tier, 10% commission, active catalog) |
| **Pending Vendor** (Apex EV Motors) | `9000000002` | `Vendor@123` | `123456` | `/vendor/pending` | Under Review (Awaiting Admin KYC verification) |
| **Changes Requested Vendor** (GreenCharge Spares) | `9000000003` | `Vendor@123` | `123456` | `/vendor/pending` | Needs Revision (Re-opens flagged Tax & Document steps) |

### Customer & Admin Logins (Unchanged)
- **Admin Console:** Navigate to `/admin` or `/admin/login` (Admin user: *Vikram Malhotra*).
- **Customer Account:** `/auth` or `/login` with existing demo customer credentials.

---

## 2. Multi-Tab Realtime Demo Guide

The implementation includes cross-tab reactive synchronization using `BroadcastChannel("riderzpro_vendor_bus")` and storage events.

### Step-by-Step Two-Window Demo:
1. **Window A (Vendor Window):**
   - Go to `/vendor/auth`, sign in with `9000000001` / `Vendor@123`.
   - Lands on `/vendor/dashboard`.
   - Click **Add Product** -> Choose *Create New Product*.
   - Fill out Title, SKU, Battery specs (60V), multi-select compatible bikes, upload 3 photos, click **Submit for Admin Review**.
   - The product badge immediately shows **Under Review**.
2. **Window B (Admin Window):**
   - In another browser tab or side-by-side window, open `/admin/approvals`.
   - Notice the live sidebar badge for **Product Approvals** increments automatically without refreshing!
   - Click **Review** on the newly submitted listing in the table.
   - The admin drawer displays:
     - Full high-resolution image gallery with click-to-zoom modal
     - Price sanity check comparing with category benchmark
     - Duplicate detector & voltage compatibility checks
     - Verification checklist
   - Click **Approve Listing** (or use keyboard shortcut `A`).
3. **Back in Window A:**
   - The vendor listing status immediately updates to **Live in Shop** via the broadcast bus!
4. **Window C (Customer Shop):**
   - Open `/shop` or search for the product. The newly approved item is immediately listed, showing `"Sold by VoltHub Indiranagar"` with a verified merchant badge linking to `/store/volthub-indiranagar`.
   - Add it to cart -> Checkout groups it under VoltHub Indiranagar with accurate delivery fees and ETA based on pickup coordinates!

---

## 3. What Was Built

### A. Entry Points & Auth Layer
- **Segmented Role Switch:** Added a `Customer | Vendor` toggle to `AuthPage.tsx` and `login.tsx`.
- **Navigation Links:** Added "Sell on RiderzPro" to `Header.tsx`, `Navbar.tsx`, `MobileDrawer.tsx`, and `Footer.tsx`.
- **Split-Screen Vendor Auth (`/vendor/auth`):**
  - Sign Up: Full name, business type, mobile (+91), email, password strength meter, terms acceptance.
  - Dual OTP Verification: Mobile OTP + Email OTP (Demo OTP: `123456` with 30s resend timer and 5-attempt lockout).
  - Sign In: Mobile or Email login with password or OTP tab.
  - Smart Routing by Vendor State: Incomplete -> `/vendor/onboarding`, Submitted/Under Review -> `/vendor/pending`, Approved -> `/vendor/dashboard`.
- **Auth Guard (`VendorRouteGuard`):** Protects vendor surfaces and prevents unauthorized role access.

### B. 6-Step Onboarding Stepper (`/vendor/onboarding`)
Matches the design reference with horizontal desktop stepper and responsive mobile progress:
1. **Step 1: Seller Account Creation:** Verified mobile and email summary.
2. **Step 2: Verify Tax Details:**
   - 15-char GSTIN validator with **mathematical checksum character algorithm** (ISO 7064 Mod 36,36). Tested with `27AAPFU0939F1ZV`.
   - Mock GST lookup adapter returning legal name, trade name, active status, registration date.
   - Auto-derived PAN from characters 3–12.
   - Aadhaar-free identity (asks for ID type + last 4 digits only).
   - "I don't have a GSTIN" escape hatch (flags `gstExempt: true` for individual sellers).
3. **Step 3: Store Name:**
   - Store display name with live uniqueness check against registered vendors.
   - Auto-generated store slug (`/store/<slug>`).
   - Seller type, category multi-select from customer `Category` union, brand tags with authorization status, logo and banner upload.
4. **Step 4: Shipping Preferences & Pickup Address:**
   - Pincode auto-fill via `pincodeAdapter` returning city, state, and lat/lng coordinates (used by customer side for distance, delivery fee, and ETA calculation).
   - Handling/prep time in minutes (`prepMins`), working hours, and serviceable radius.
   - Hazardous goods declaration: Mandatory UN38.3 packaging declaration for Li-ion batteries/chargers.
5. **Step 5: Bank Details:**
   - Account holder, account number + confirm matching, IFSC resolver via `ifscAdapter`.
   - Mock penny drop verification.
   - Masked account display (`XXXXXX1234`).
6. **Step 6: Documents & Review:**
   - Document uploaders (PAN, GST, cheque, licences) with preview.
   - Summary review of all steps with direct edit links.
   - Digital agreement acceptance with typed signatory name and timestamp.
   - On submit, sets status to `submitted` and routes to `/vendor/pending`.

### C. Verification Status Page (`/vendor/pending`)
- Displays current status (`submitted`, `under_review`, `changes_requested`, `rejected`).
- Expected SLA card (24 to 48 hours).
- Detailed audit timeline tracking submission and moderation actions.
- **Fix and Resubmit Flow:** When `changes_requested`, displays admin's flagged section reasons and a button to re-open only the flagged steps without restarting from scratch.

### D. Admin KYC & Product Approvals Queues
- **Sellers & KYC Queue (`SellersScreen.tsx`):**
  - Displays real vendor store records merged into `adminStore`.
  - Drawer with GST results, PAN, store info, pickup address, masked bank with secure "Reveal" confirmation.
  - Inline document zoom modal.
  - Hazardous goods and GST-exempt flags.
  - Moderation checklist.
  - Actions: Approve (with commission rate and tier), Request Changes (section selector + feedback), Reject, Suspend/Reinstate.
- **Product Approvals Queue (`admin.approvals.tsx` / `ProductApprovalsScreen.tsx`):**
  - Table of pending products and pending revisions.
  - Live computed sidebar badge in `AdminSidebar.tsx`.
  - Review drawer with high-resolution image gallery, technical specs, fitment list with voltage mismatch detector, HSN/GST compliance, price sanity check, duplicate detector.
  - Actions: Quick Approve, Approve with Edits, Request Changes (per-field notes), Reject, Bulk Approve/Reject, Keyboard shortcuts (`A`, `R`, `Esc`).
  - "Approve All Pending (Demo)" helper button.

### E. Merged Customer Catalogue & Storefront
- **Data Seam (`src/lib/catalogue.ts`):** Single source of truth returning static seed items + live approved vendor products and offers.
- **Product Visibility Gate (Section 7b):** A product is shown to customers **ONLY** if:
  1. `status === "live"`
  2. Vendor is `approved` and **NOT** `suspended` and **NOT** in `holidayMode`.
  Non-live or unapproved items never appear in shop, search, compare, cart suggestions, AI voice assistant, or direct `/product/$id` URLs (renders gated 404).
- **Storefront Page (`/store/$slug`):** Merchant banner, logo, rating, area, fulfilment highlights, category filter, and live product catalog.
- **Product Cards & Detail Pages:** Updated to display `"Sold by {storeName}"` with verified badge linking to `/store/$slug`.

### F. Vendor Dashboard (`/vendor/dashboard`)
Built in `VendorDashboardShell.tsx` following `DashboardShell.tsx` styling (white sidebar with red active state, sticky header, mobile bottom nav):
1. **Overview:** KPIs (weekly sales, orders to accept, low stock, rating), Recharts sales area chart, action center, account health metrics.
2. **Orders:** Reads from `store.tsx` orders where `group.vendorId === vendor.id`. Tabs: New, Accepted, Packed, Picked up, Delivered, Cancelled. Actions: Accept/Reject, Mark Packed, Hand over to rider with OTP verification (`4921`), and printable **Packing Slip & GST Tax Invoice** modal.
3. **Products (Catalogue):** Catalog table with approval status badges (`Live`, `Under Review`, `Changes Needed`, `Draft`, `Rejected`), filters, search, duplicate SKU, archive.
4. **Add Product Modal (`AddProductModal.tsx`):**
   - Create New Product: Full specs, 3–8 image uploader with client-side compression via `storageAdapter` (IndexedDB), bike fitment mapping with voltage mismatch warning, duplicate checker.
   - Sell Existing Product: Search catalog and add offer with custom price and stock.
   - Bulk CSV Upload: Download template, upload spreadsheet, and row-level validation.
   - Live Product Edits: Price/stock edits apply instantly; content/spec changes create a `pendingRevision` under review.
5. **Inventory:** Per-SKU inline stock quantity editing, restock shortcuts (+5, +20), low-stock alert thresholds, out-of-stock auto-hide toggle.
6. **Pricing & Offers:** MRP vs selling price, discount %, net margin preview after commission and GST, CSV price export and bulk update.
7. **Payments & Settlements:** Wallet summary (pending, processing, settled), T+7 settlement breakdown table, downloadable CSV statement, bank account change-request flow.
8. **Returns & Warranty:** Warranty claims list, approve replacement label, dispute claim with photo evidence.
9. **Reviews & Ratings:** Product and store feedback, post official vendor reply, report abusive review.
10. **Store Profile & Settings:** Store identity, logo, handling prep time, pickup address, holiday mode (vacation pause) toggle, documents center.
11. **Notifications:** Unread alerts for new orders, approvals, stock warnings, payouts.
12. **Help & Support:** Raise support tickets to admin desk, FAQ accordion.

---

## 4. Security & Production Backend Swap List

Because this application currently runs on browser-side state (`localStorage` + `IndexedDB`), it is **not secure** for real financial transactions or statutory KYC. Before production launch, the following components must be moved to server-side infrastructure:

1. **Password Hashing & Session Management:**
   - Move client-side SHA-256 to server-side Argon2id or bcrypt with salting.
   - Replace localStorage tokens with secure, `HttpOnly`, `SameSite=Strict` cookies.
2. **OTP Generation & Dispatch:**
   - Remove demo OTP `123456`.
   - Swap `otpAdapter` with a secure server-side SMS/Email provider (e.g. Twilio, MSG91, SendGrid) using cryptographically secure random 6-digit tokens with Redis rate-limiting (5 attempts max, 10-minute lockout).
3. **Statutory KYC Verifications:**
   - Swap mock `gstAdapter`, `panAdapter`, and `bankAdapter` with regulated identity APIs (e.g., Cashfree, RazorpayX, Setu, or Karza Technologies).
   - Never accept client-side assertions of active GSTIN status or bank penny drop success.
4. **Image & Document Storage:**
   - Replace the IndexedDB `storageAdapter` with a private cloud object storage bucket (e.g., AWS S3, Cloudflare R2, or Lovable Cloud Storage).
   - Statutory documents (PAN, GST, Cheque) must be stored in private, encrypted buckets accessible only by authorized admins via time-limited pre-signed URLs.
5. **Role-Based Access Control (RBAC) & Row-Level Security (RLS):**
   - Implement database-level roles (`customer`, `vendor`, `admin`) with Postgres Row-Level Security.
   - Ensure a vendor can only read and mutate orders and inventory where `vendor_id == auth.uid()`.
6. **State Transition Guardrails:**
   - Every product and seller status transition (`submitted -> approved`) must be verified server-side.
   - A vendor must never possess API permissions to approve their own product or bypass the KYC queue.
7. **Data Masking & PII Encryption:**
   - Full bank account numbers and government IDs must be encrypted at rest (AES-256) in the database.
   - The API should only expose masked representations (`XXXXXX1234`) to the frontend.
8. **Audit Logging:**
   - Persist immutable audit log entries with admin ID, vendor ID, IP address, and timestamp for all KYC approvals, suspensions, and price modifications.

---

## 5. KYC Verification Gate & Mobile Interface (Latest Update)

### KYC Approval Gate Implementation
In accordance with marketplace compliance, all product catalog and inventory mutations are strictly locked until a seller's KYC application is approved by the admin team (`vendor.status === "approved"`):
1. **Store-Level Enforcement (`vendorStore.tsx`):**
   - `addProduct`: Throws and toasts error if `vendor.status !== "approved"`.
   - `updateProduct`: Blocks mutations and toasts error if the seller is not approved (supports `{ isStaffAction: true }` for admin overrides).
   - `submitProductRevision`: Blocks revisions for unapproved vendors.
   - `deleteProduct`: Blocks deletion requests for unapproved vendors.
2. **Catalogue UI Lock (`ProductsSection.tsx` & `AddProductModal.tsx`):**
   - Prominent Amber KYC lock banner informing sellers that their account is unverified/under review, with a direct link to check their verification SLA.
   - "Add Product" button is disabled and displays a `Lock` icon.
   - Edit, Duplicate, Archive, and Delete buttons are disabled for unapproved sellers.
   - In `AddProductModal.tsx`, draft saving, review submissions, and bulk CSV uploads are disabled with locked state alerts.
3. **Inventory & Pricing Lock (`InventorySection.tsx` & `PricingSection.tsx`):**
   - Stock quantity adjustments, quick restock (+5, +20), and low-inventory threshold changes are disabled.
   - Selling price editing, promotional discounts, and CSV price upload inputs are locked.
4. **Pending Portal Callout (`VendorPendingPage.tsx`):**
   - Displays a dedicated callout explaining that catalogue publishing and inventory management will unlock automatically once admin moderation is completed.

### Mobile Interface Optimization (Down to 360px)
The entire vendor portal has been engineered to provide a first-class mobile experience on small smartphones:
1. **Vendor Shell Navigation (`VendorDashboardShell.tsx`):**
   - **Mobile Bottom Navigation Bar:** Displays 4 core sections (`Overview`, `Orders`, `Products`, `Inventory`) + a 5th `"More"` button with `LayoutGrid` icon that opens a slide-out drawer containing all 12 vendor sections.
   - **Slide-Out Mobile Drawer:** Includes seller micro-profile with verified/pending status, direct storefront link, marketplace home button, all 12 navigation sections with badge counts, and logout.
   - **Compact Header:** Responsive logo, truncated store name, notification bell, and sign-out button that fit comfortably on 360px screens without overflow.
2. **Responsive Mobile Cards vs Desktop Tables:**
   - On desktop/tablet (`md:block`), wide multi-column data tables are rendered.
   - On mobile phones (`md:hidden`), specialized touch-friendly cards are rendered:
     - `ProductsSection`: Card with thumbnail, SKU, brand, category, status pill, bold selling price with strike-through MRP, and touch action buttons.
     - `InventorySection`: Card with available stock input, alert threshold input, quick restock shortcut buttons (+5, +20), health pill, and save button.
     - `PricingSection`: Card with price input, net payout margin estimate after platform commission, and quick save.
     - `OrdersSection`: Card with stage progress badge, customer contact, items breakdown, and touch action buttons for pack, accept, and print.
     - `PrintPackingSlipModal`: Responsive modal sheet with scrollable container and mobile-friendly printable preview.
