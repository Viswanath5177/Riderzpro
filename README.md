# ⚡ Riderzpro — EV Bike Battery & Certified Installation Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Web%20%7C%20FastAPI%20%7C%20React%2019-orange.svg)](#)
[![Stack](https://img.shields.io/badge/Stack-FastAPI%20%2B%20TanStack%20Start%20%2B%20TailwindCSS-9cf.svg)](#)

> **Riderzpro** is an automotive e-commerce & certified technician marketplace connecting verified EV sellers, customers, and field installation riders with guaranteed vehicle fitment, live delivery tracking powered by a Python FastAPI backend, and a modern React/TanStack Start frontend.

---

## 🏗️ Architecture & Key Features

1. **Logistics & Delivery Backend (`/logistics`, `main.py`)**:
   - **FastAPI** REST and WebSocket endpoints.
   - Real-time rider GPS tracking, spatial queries, and telemetry ingestion (`POST /api/riders/{id}/location`).
   - Live delivery streaming via WebSocket (`/ws/deliveries/{id}/tracking`).
   - Automated rider dispatch engine with workload balancing.
   - Multi-provider route planning (Haversine, OSRM, Google Maps) with road route geometry.
   - Geofencing and route deviation detection corridors.

2. **Modern Web UI (`/src`, `/public`)**:
   - **TanStack Start**, **React 19**, and **TypeScript**.
   - **Tailwind CSS v4** and Radix UI accessible components.
   - Interactive Live Map and live tracking dashboards (`src/components/site/LiveMap.tsx`, `src/routes/track.$id.tsx`).
   - Customer, Vendor, Rider, and Workshop dashboards.
   - Guaranteed Fitment Engine: strictly matches EV batteries against vehicle brand, model, and year.

3. **Mobile App (Android & iOS via Capacitor)**:
   - Built with Capacitor 8 (`@capacitor/core`, `@capacitor/android`, `@capacitor/ios`).
   - Native animated launch screens, dark theme status bar, and hardware back button handling.

---

## 📂 Project Structure

```
.
├── logistics/                  # FastAPI Logistics & Dispatch Subsystem
│   ├── models.py               # Delivery, Rider, Location, Route SQLAlchemy models
│   ├── service.py              # Delivery lifecycle & state machine
│   ├── location_service.py     # Rider GPS telemetry & proximity filtering
│   ├── realtime.py             # WebSocket connection manager & broadcast hub
│   ├── router.py               # REST & WebSocket API router
│   ├── assignment.py           # Rider dispatch scoring engine
│   ├── route_planning.py       # Multi-provider routing (OSRM, Google Maps)
│   ├── optimizer.py            # Route optimization bridge
│   └── mcp_tools.py            # AI assistant logistics tools
├── main.py                     # FastAPI application entrypoint (port 8000)
├── tests/                      # Automated test suite (141+ pytest tests)
│   ├── test_delivery_backend.py
│   ├── test_delivery_operations.py
│   ├── test_geofence.py
│   ├── test_realtime_tracking.py
│   ├── test_rider_location_tracking.py
│   └── test_route_deviation.py
├── src/                        # Modern Frontend (React 19 + TanStack Start)
│   ├── routes/                 # File-based routes (index, shop, track, dashboards)
│   ├── components/             # Reusable UI & dashboard components (LiveMap, etc.)
│   └── lib/                    # State management & logistics adapters
├── public/                     # Static assets & logos
├── android/                    # Capacitor Android project
├── ios/                        # Capacitor iOS project
├── package.json                # Frontend scripts and dependencies
├── requirements.txt            # Python dependencies
└── vite.config.ts              # Vite configuration
```

---

## 🏃 Running Locally

### 1. Backend (FastAPI)
```bash
# Install Python dependencies
pip install -r requirements.txt

# Start backend server
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
- API & WebSocket: `http://localhost:8000`
- Interactive Swagger Docs: `http://localhost:8000/docs`

### 2. Frontend (React / Vite)
```bash
# Install Node dependencies
npm install

# Start Vite dev server
npm run dev
```
Open [http://localhost:8080](http://localhost:8080) in your browser.

---

## 🧪 Testing

```bash
# Run backend test suite
python -m pytest tests/ -v

# Run frontend tests
npm test -- --run
```

---

## 📱 Mobile App (Android & iOS via Capacitor)

```bash
# Build web bundle and sync to mobile shells
npm run build
npx cap sync

# Open in Android Studio / Xcode
npx cap open android
npx cap open ios
```

---

## 📄 License

MIT © 2026 Riderzpro Technologies Pvt Ltd.
