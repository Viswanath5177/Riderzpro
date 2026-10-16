# ⚡ Riderzpro — EV Bike Battery & Certified Installation Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Web%20%7C%20FastAPI%20%7C%20React%2019-orange.svg)](#)
[![Stack](https://img.shields.io/badge/Stack-TanStack%20Start%20%2B%20FastAPI%20%2B%20TailwindCSS%20v4-9cf.svg)](#)
[![Database](https://img.shields.io/badge/Database-SQLite%20(Local)%20%7C%20PostgreSQL%20(Prod)-blueviolet.svg)](#)

> **Riderzpro** is an automotive e-commerce & certified technician marketplace connecting verified EV sellers, customers, and field installation riders with guaranteed vehicle fitment, real-time OTP authentication, live delivery tracking powered by a Python FastAPI logistics backend, and a modern React 19 / TanStack Start frontend with integrated Node.js commerce middleware.

---

## 🏗️ Architecture & Core Components

### 1. Modern Web Application & Full-Stack UI (`/src`, `/public`)
- **React 19** + **TanStack Start** file-based routing.
- **Tailwind CSS v4** + Radix UI accessible UI primitives.
- **Guaranteed Fitment Engine**: Strictly matches EV batteries and components against vehicle make, model, year, and voltage.
- **Role-based Dashboards**:
  - **Customer Dashboard** (`/$id`): Manage vehicle garage, order status, doorstep technician bookings, and invoices.
  - **Vendor / Seller Portal** (`/vendor/$id`): Product catalog moderation, inventory management, order dispatch, and financial settlements.
  - **Unified Operations & Super Admin** (`/admin/$id`): Platform oversight, seller approvals, dispute management, and product moderation.

### 2. Integrated Commerce & Auth API (`/src/server`)
- Runs out of the box via Vite dev server middleware (`dbMiddleware.ts`).
- **Zero-Config Local SQLite Mode**: Powered by `@libsql/client` with `dev.db` (38 pre-configured tables).
- **Production PostgreSQL Support**: Automatic SQL translation layer (`translateToPostgres` / `translateToSqlite`) supporting connection pooling.
- **Authentication**:
  - Secure session cookies (`auth_session`) with SHA-256 token hashing.
  - Email OTP authentication powered by Resend (with simulated fallback for local development).
  - Twilio SMS OTP support.

### 3. Logistics & Delivery Telemetry Subsystem (`/logistics`, `main.py`)
- **Python FastAPI** REST and WebSocket services on port 8000.
- Real-time rider GPS telemetry and spatial proximity queries (`POST /api/riders/{id}/location`).
- Live delivery tracking WebSocket stream (`/ws/deliveries/{id}/tracking`).
- Automated rider dispatch scoring engine with geofence corridor monitoring.
- Multi-provider route planning (OSRM, Haversine, Google Maps).

### 4. Native Mobile Shells (`/android`, `/ios`)
- Built with **Capacitor 8** (`@capacitor/core`, `@capacitor/android`, `@capacitor/ios`).
- Dark theme status bars, splash screens, and hardware back button handling.

---

## 🚀 Quick Start (Zero-Config Development)

You only need **Node.js 18+** to run the complete e-commerce platform and auth server locally.

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Dev Server
```bash
npm run dev
```

When started, Riderzpro automatically:
1. Generates your local `.env` and `.dev.vars` files if missing.
2. Initializes and verifies **`dev.db`** (38 core tables with mock product catalogs and vehicle models).
3. Provisions baseline development accounts.
4. Starts the Vite web application and backend middleware at **`http://localhost:8080`**.

---

## 👥 Pre-Configured Development Accounts

All pre-seeded local development accounts share the same default password:

> **Default Password:** `riderzpro@123`

| Role | Email | Portal Route | Description |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@riderzpro.com` | `/vendor/login` &rarr; `/admin/adm_super_01` | Full platform oversight & system control |
| **Operations Admin** | `admin.operations@riderzpro.com` | `/vendor/login` &rarr; `/admin/adm_unified_01` | Seller compliance & product moderation |
| **Approved Vendor** | `vendor1@riderzpro.com` | `/vendor/login` &rarr; `/vendor/sel_volthub_01` | Bengaluru EV Spares Hub |
| **Approved Vendor** | `vendor2@riderzpro.com` | `/vendor/login` &rarr; `/vendor/sel_apex_02` | Apex Power Solutions |
| **Customer** | `customer1@riderzpro.com` | Customer Login modal &rarr; `/$id` | Seed customer (Aarav Sharma) |
| **Customer** | `customer2@riderzpro.com` | Customer Login modal &rarr; `/$id` | Seed customer (Priya Patel) |

---

## 🏃 Running the Optional FastAPI Logistics Service

To test real-time rider tracking and simulated live delivery maps on port 8000:

```bash
# 1. Install Python dependencies
pip install -r requirements.txt

# 2. Launch FastAPI service
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
- API & Telemetry Root: `http://localhost:8000`
- Interactive Swagger UI: `http://localhost:8000/docs`

---

## 📜 Available NPM Scripts

| Script | Purpose |
| :--- | :--- |
| `npm run dev` | Runs predev checks and boots Vite dev server on `http://localhost:8080` |
| `npm run build` | Builds production client & server bundle |
| `npm run preview` | Previews production build locally |
| `npm run db:migrate:local` | Applies SQLite schema migrations from `database/migrations/sqlite/` |
| `npm run db:sqlite` | Rebuilds a fresh `dev.db` from scratch |
| `npm test` | Runs the Vitest automated test suite |
| `npm run lint` | Runs ESLint |
| `npm run build:mobile` | Builds web assets and copies them to Capacitor platforms |
| `npm run cap:sync` | Syncs web bundles to Android & iOS Capacitor native projects |

---

## ⚙️ Environment Configuration

Configuration is managed via `.env` and `.dev.vars`:

```ini
# Database: SQLite (default) or PostgreSQL
DATABASE_URL=file:./dev.db
# DATABASE_URL=postgresql://postgres:password@localhost:5432/riderzpro

# Application Environment
APP_ENV=development
OTP_HASH_SECRET=your_random_secret_hash_here

# Email OTP (Optional - Falls back to simulated console logs in development)
RESEND_API_KEY=your_resend_api_key
RESEND_FROM=support@riderzpro.com

# SMS OTP (Optional)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_FROM=your_twilio_phone
```

---

## 📱 Mobile Application (Android & iOS)

```bash
# Sync web build to native shells
npm run build:mobile

# Open native IDEs
npx cap open android   # Launches Android Studio
npx cap open ios       # Launches Xcode (macOS only)
```

---

## 🧪 Testing

```bash
# Frontend Unit & Integration Tests (Vitest)
npm test -- --run

# Backend Telemetry & Logistics Tests (Pytest)
python -m pytest tests/ -v
```

---

## 📄 License

MIT © 2026 Riderzpro Technologies Pvt Ltd.
