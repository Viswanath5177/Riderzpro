# ⚡ Riderzpro — EV Bike Battery & Certified Installation Ecosystem

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Web%20%7C%20Android%20%7C%20iOS%20%7C%20Desktop-orange.svg)](#)
[![Design](https://img.shields.io/badge/Design-Light%20Apple%20Glassmorphism-9cf.svg)](#)

> **Riderzpro** is a unified cross-platform platform for discovering guaranteed compatible EV bike batteries with bundled certified doorstep or service center installation, atomic zero-conflict slot booking, real-time technician dispatch & live GPS tracking, interactive diagnostic checklists, and digital warranty certificates.

---

## 🚀 Key Value Propositions

1. **Guaranteed Fitment Engine**: Strictly matches EV batteries against vehicle brand, model, and manufacturing year (e.g. Ather 450X, Ola S1 Pro, TVS iQube, Revolt RV400, Hero Vida V1, Bajaj Chetak). Incompatible batteries are never displayed.
2. **Unified 4-Step Booking**:
   - **Installation Type**: Doorstep Home Visit (+₹499) or Certified Service Center (+₹299).
   - **Date & Slot Grid**: 7-day horizontal date strip with dynamic slot capacity. Booked/closed slots are disabled with strikethrough. Shows 90-min duration with exact *"Ready by HH:MM"* completion timestamp.
   - **Old Battery Exchange**: 1-tap rebate toggle deducting ₹2,500 instant credit.
   - **Transparent Breakdown**: Battery + Installation + Travel + Taxes - Credit = Total. Single atomic booking confirmation.
3. **Multi-Role Orchestration**:
   - **Customer**: Find, Book, Order Timeline, Live Technician GPS Map, Tax Invoices, Digital Warranty Certificates, EV Garage.
   - **Vendor**: KPI command center, order triage (Accept/Decline), technician dispatch, battery catalog & stock steppers, weekly interactive slot matrix (1-tap open/close toggle), and payouts ledger.
   - **Technician**: Online/Offline toggle, assigned job queue, 6-step diagnostic checklist, photo verification uploaders, and customer digital signature canvas.
4. **Light Apple Glassmorphism**: Soft pastel mesh gradient (`#bcd6ff`, `#ffd9c2`, `#c9f2e0`, `#e3d4ff` over `#eaf0fb`), `26px` backdrop-filter blur, `180%` saturation, 1px white border, and inner top satin highlights.
5. **Dev Bypass Toolbar**: 1-click role switcher (`Customer`, `Vendor`, `Technician`) and viewport preview switcher (`1440px`, `768px`, `390px`).

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: Responsive Web, Flutter/Dart ready (Riverpod state notifier architecture, `go_router` navigation).
- **Styling**: Vanilla CSS Design System with Apple Glassmorphic surface primitives (`tokens.css`, `components.css`).
- **Interactive Widgets**:
  - Live animated Canvas Map with route interpolation and moving technician GPS beacon.
  - HTML5 Canvas Digital Signature Pad with touch/mouse capture.
- **Backend Architecture**: Python FastAPI, PostgreSQL async SQLAlchemy models, atomic `SELECT ... FOR UPDATE` slot reservation, WebSocket live broadcasting.

---

## 📂 Project Directory Structure

```
.
├── web/
│   ├── index.html               # Main entry point with pastel mesh canvas
│   ├── css/
│   │   ├── tokens.css           # Design tokens, mesh gradient, glass effects, typography
│   │   ├── components.css       # GlassCard, GlassSidebar, GlassTabBar, Segmented, Pills, Modals, Timelines
│   │   ├── customer.css         # Customer Find, Book 4-step, Orders, Map, Garage
│   │   ├── vendor.css           # Vendor KPIs, Orders triage, Catalog, Slot Matrix, Techs, Payouts
│   │   ├── technician.css       # Tech Jobs, Diagnostic Checklist, Camera/Signature, Earnings
│   │   └── dev-toolbar.css      # Dev Bypass role switch bar, Viewport simulator
│   └── js/
│       ├── state/
│       │   ├── store.js         # Reactive central state management (Riverpod notifier pattern)
│       │   └── mock_data.js     # Seed data (Bikes, Batteries, Fitments, Slots, Orders, Techs)
│       ├── components/
│       │   ├── glass_ui.js      # Reusable Glass UI components, Modal & Toast manager
│       │   ├── map_view.js      # Interactive Canvas Live Map widget
│       │   └── signature.js     # Digital Signature pad canvas
│       ├── views/
│       │   ├── customer_view.js # Customer Find, Book, Order Detail, Tracking, Garage
│       │   ├── vendor_view.js   # Overview, Orders Triage, Catalog Matrix, Slots Calendar, Payouts
│       │   └── technician_view.js # Queue, Active Checklist, Diagnostic Upload, Earnings
│       └── app.js               # Application router, role switcher, bypass auth
└── README.md
```

---

## 🏃 Running Locally

To run the web app locally:

```bash
# Start local HTTP server
python -m http.server 3000 --directory web
```

Then open **`http://localhost:3000/`** in your browser.

---

## 🧪 Acceptance Checks

- [x] **Strict Fitment**: Find screen strictly displays batteries matching the active bike.
- [x] **Slot Booking Guard**: Confirm button disabled until slot is chosen; disabled slots unselectable.
- [x] **Live Slot Toggle**: Vendor toggling slot closed immediately disables it for customers.
- [x] **Technician Reveal Guard**: Technician card and contact shortcuts appear only from `technician_assigned` status onward.
- [x] **Pricing Integrity**: Cost displayed equals exact line-item breakdown (Battery + Install + Travel + Taxes - Credit).
- [x] **Responsive Excellence**: Scales seamlessly across Desktop (1440px), Tablet (768px), and Mobile (390px).

---

## 📄 License

MIT © 2026 VoltFit Technologies
