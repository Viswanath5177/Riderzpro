# ⚡ Riderzpro — EV Bike Battery & Certified Installation Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Web%20%7C%20React%20%7C%20FastAPI%20%7C%20PostgreSQL-orange.svg)](#)

> **Riderzpro** is an EV bike battery e-commerce & certified technician marketplace connecting verified EV sellers, customers, and field installation riders with PostgreSQL database integration.

---

## 🚀 Key Features

1. **Guaranteed Fitment Engine**: Strictly matches EV batteries against vehicle brand, model, and year (Ather, Ola, TVS, Revolt, Hero, Chetak).
2. **Multi-Role Dashboards**:
   - **Customer**: Product discovery, cart, checkout, live rider tracking.
   - **Seller (Entrepreneur)**: Inventory management, "+ Add Product" submission, order fulfillment, weekly payouts.
   - **Rider (Technician)**: Dispatch queue, live GPS location updates, order completion.
   - **Support Admin**: Verification queue to review and approve/reject seller products and tickets.
   - **Super Admin**: Platform-wide metrics, governance, and user auditing.
3. **Database Architecture**: Clean PostgreSQL 18 schema (`database/schema.sql`) unifying users, products, orders, deliveries, and support tickets.

---

## 💻 Development & Running Locally

### 1. React / TanStack Web App
```sh
npm install --legacy-peer-deps
npm run dev
```

### 2. Static Web Preview / Dashboards
```sh
# Start local HTTP server
python -m http.server 3000 --directory web
```
Then visit:
- **Schema Visualizer**: `http://localhost:3000/schema-visualizer.html`
- **Main App**: `http://localhost:3000/`

---

## 🛠️ Built With

- **Frontend**: TanStack Start, React 19, TypeScript, Tailwind CSS, Lucide Icons
- **Database**: PostgreSQL 18
- **Backend / API**: FastAPI / Python

---

## 📄 License

MIT © 2026 Riderzpro Technologies Pvt Ltd.

