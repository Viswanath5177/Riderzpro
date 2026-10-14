# RiderzPro Logistics System

Comprehensive developer, operations, and integration manual for the RiderzPro Quantum Algorithm-Based E-Commerce Platform — Delivery Optimization & Rider Dispatch Subsystem.

---

## 1. Overview

The **RiderzPro Logistics System** is an end-to-end delivery fulfillment, real-time dispatch, and tracking platform built to support high-velocity electric vehicle (EV) parts and vehicle deliveries. It bridges customer storefront orders with fleet logistics, rider telemetry, route optimization, and live tracking.

### Core Capabilities
- **Delivery Lifecycle Management**: End-to-end milestone progression (`pending` $\rightarrow$ `assigned` $\rightarrow$ `picked_up` $\rightarrow$ `in_transit` $\rightarrow$ `delivered` / `failed` / `cancelled`).
- **Fleet Dispatch & Rider Assignment**: Dynamic candidate rider proximity ranking based on Haversine distance, active concurrent order load, vehicle type, and ratings.
- **Rider Telemetry & GPS Tracking**: High-frequency ingestion of rider coordinates, speed, heading, and accuracy from native Android/iOS devices (Capacitor Geolocation) and desktop web browsers.
- **Real-Time WebSocket Streaming**: Segregated, low-latency WebSocket channels streaming live coordinates, ETA projections, and delivery milestones directly to subscribers.
- **Customer Live Tracking**: Interactive OpenStreetMap (OSM) viewer with animated rider location markers, turn-by-turn road route polylines, milestone steppers, and automatic REST polling fallback.
- **Road Routing via OSRM**: Full road-network routing and turn waypoint synthesis powered by the Open Source Routing Machine (OSRM) with built-in Haversine geometric fallback. Zero reliance on paid proprietary map providers (no Google Maps or Mapbox required).
- **Automated Geofencing**: Proximity triggers detecting when a rider enters the approaching corridor ($\le 500\,\text{m}$) and the delivery destination ($\le 50\,\text{m}$).
- **Route Deviation Detection**: Real-time orthogonal corridor cross-track computation alerting customers and dispatchers when a rider strays beyond $250\,\text{m}$ from the planned route.
- **Rider Panel Integration**: Dedicated rider shift interface (`/rider` and `/rider/dashboard`) enabling riders to accept assignments, update delivery milestones, and stream live GPS coordinates in the background.

### Relationship Between Main RiderzPro and Logistics

The main application and the logistics backend operate as an integrated system sharing canonical IDs:

```
Customer Order (Storefront / Checkout)
      ↓
Main RiderzPro (React + Vite + SSR Server)
      ↓
Logistics Delivery Task (POST /api/deliveries with order_id)
      ↓
Rider Assignment (FastAPI Dispatcher / Rider Panel Acceptance)
      ↓
Rider GPS Telemetry (Capacitor / Browser Geolocation @ 5s interval)
      ↓
FastAPI Logistics Backend (Validation, Geofencing, Route Deviation, ETA)
      ↓
WebSocket Broadcast (/ws/deliveries/{delivery_id}/tracking)
      ↓
Customer Live Tracking Page (/track/:orderId)
      ↓
Interactive OSM Leaflet Map (Live moving rider marker, polyline, milestones)
```

---

## 2. Architecture

The system is split into two complementary layers communicating over high-speed HTTP and WebSocket protocols:

| Component | Technology | Default Port | Responsibility |
|---|---|---|---|
| **Main Web & API Server** | Vite, TanStack Router, React 18, Node.js HTTP Middleware | `8080` (or `3000`) | Customer storefront, vendor catalog, rider panel UI, auth sessions, and API proxy. |
| **Logistics Backend** | FastAPI, Python 3.10+, SQLAlchemy, Pydantic v2 | `8000` | Delivery lifecycle, fleet management, GPS telemetry ingestion, geofencing, route deviation, OSRM routing, WebSocket hub. |
| **Logistics Database** | SQLite (default) / PostgreSQL | Embedded file or `5432` | Stores deliveries, riders, routes, breadcrumb GPS history, and status audit logs. |
| **Main Database** | SQLite / PostgreSQL | Embedded file or `5432` | Stores products, customer carts, orders, users, and credentials. |
| **Routing Service** | Open Source Routing Machine (OSRM) | External HTTP (`router.project-osrm.org`) | Real road network routing geometry, durations, and turn instructions. |
| **Map Rendering** | Leaflet / OpenStreetMap (OSM) | Client Browser | Renders open-source raster map tiles, polylines, and animated vehicle markers. |

---

## 3. Repository Structure

```
Riderzpro/
├── main.py                     # FastAPI application entrypoint, lifespan, CORS, and router mounts
├── requirements.txt            # Python backend and test dependencies
├── package.json                # Frontend dependencies, scripts, and build configurations
├── .env.example                # Sample environment template for local and production deployments
├── LOGISTICS.md                # This manual
│
├── logistics/                  # FastAPI Logistics & Dispatch Subsystem
│   ├── __init__.py             # Subsystem initialization
│   ├── database.py             # SQLAlchemy engine, session maker, migrations, and seed riders
│   ├── models.py               # ORM models (Delivery, Rider, DeliveryRoute, RiderLocation, etc.)
│   ├── schemas.py              # Pydantic request/response validation schemas
│   ├── router.py               # REST endpoints for deliveries, fleet riders, and logistics dashboard
│   ├── realtime.py             # WebSocket connection manager, subscriber bridge, and broadcasters
│   ├── location_service.py     # GPS ingestion, timestamp/coordinate validation, and tracking queries
│   ├── geofence.py             # Distance evaluations for approaching (500m) and arrival (50m)
│   ├── route_deviation.py      # Cross-track corridor deviation (250m) and recovery detection
│   ├── route_planning.py       # OSRM HTTP client and Haversine distance calculation
│   ├── assignment.py           # Candidate rider ranking (proximity, capacity, ratings)
│   ├── optimizer.py            # Classical OR-Tools solver & Quantum Hybrid optimizer interface
│   └── mcp_tools.py            # Model Context Protocol tools for AI dispatcher agents
│
├── src/
│   ├── lib/
│   │   ├── api.ts              # Frontend client for FastAPI REST endpoints and WebSocket derivation
│   │   ├── store.tsx           # Global state (order creation, delivery triggering, cart)
│   │   └── native/
│   │       └── location.ts     # Capacitor native & Web browser GPS streaming (5-second loop)
│   │
│   ├── components/
│   │   └── map/
│   │       ├── DeliveryMap.tsx         # Leaflet OSM map component with rider, pickup, and dropoff markers
│   │       ├── useDeliveryTracking.ts  # React hook for WebSocket lifecycle, events, and REST fallback
│   │       ├── TrackingStatusPanel.tsx # Live metrics: ETA, distance, speed, battery, milestone stepper
│   │       └── types.ts                # TypeScript interfaces for WebSocket messages & tracking states
│   │
│   ├── routes/
│   │   ├── track.$id.tsx       # Customer tracking route (/track/:orderId or /track/:deliveryId)
│   │   ├── rider.index.tsx     # Rider sign-in screen (/rider)
│   │   ├── rider.dashboard.tsx # Rider shift dashboard (/rider/dashboard) with live GPS toggle
│   │   └── rider.tsx           # TanStack router layout for rider portal
│   │
│   └── server/
│       ├── dbMiddleware.ts     # Vite development server middleware router
│       └── routes/
│           ├── rider.ts        # Node.js API bridge for /api/rider/deliveries and /api/rider/location
│           ├── orders.ts       # Customer checkout and order placement router
│           └── auth.ts         # User authentication, role verification, and rider session handler
│
├── tests/                      # Python backend test suite (pytest)
│   ├── test_delivery_backend.py        # Delivery CRUD, status transitions, and audit logs
│   ├── test_delivery_operations.py     # Operations dashboard metrics and queue filtering
│   ├── test_geofence.py                # Geofence threshold evaluations (500m / 50m)
│   ├── test_realtime_tracking.py       # WebSocket connections, snapshots, and event broadcasts
│   ├── test_rider_location_tracking.py # GPS ingestion, velocity bounds, and clock skew validation
│   └── test_route_deviation.py         # Cross-track point-to-segment corridor deviation tests
│
└── scratch/                    # Developer utilities and live simulation scripts
    ├── simulate_movement.py    # Live GPS telemetry simulator walking the Vijayawada-Amaravati route
    ├── set_approaching.py      # Quick trigger setting rider to approaching threshold
    ├── set_deviation.py        # Quick trigger setting rider outside allowable route corridor
    └── setup_live_test.py      # Resets test delivery to in-transit state
```

---

## 4. Prerequisites

Verify that the following tools are installed on your workstation before starting:

- **Node.js**: Compatible LTS version (`v18.x` or `v20.x` recommended). Verify with `node -v`.
- **npm**: `v9.x` or `v10.x`. Verify with `npm -v`.
- **Python**: `3.10` or `3.11`. Verify with `python --version`.
- **Git**: Modern version. Verify with `git --version`.
- **PostgreSQL**: *(Optional)* Recommended for production. For local development, the system automatically uses embedded SQLite if PostgreSQL is not active.

---

## 5. Installation

Follow these steps to set up a clean development workspace:

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Riderzpro
```

### 2. Verify You Are on the Main Branch
```bash
git checkout main
git pull origin main
```

### 3. Install Frontend Dependencies
```bash
npm install
```

### 4. Create and Activate Python Virtual Environment
**Windows (PowerShell / Command Prompt):**
```powershell
python -m venv .venv
.\.venv\Scripts\activate
```

**macOS / Linux:**
```bash
python3 -m venv .venv
source .venv/bin/activate
```

### 5. Install Python Dependencies
```bash
pip install -r requirements.txt
```

---

## 6. Environment Configuration

The application reads environment variables from `.env` in the project root. A sample template is provided in `.env.example`.

### Create Your Local `.env` File

**Windows (PowerShell):**
```powershell
Copy-Item .env.example .env
```

**macOS / Linux:**
```bash
cp .env.example .env
```

### Documented Environment Variables

| Variable Name | Purpose | Default / Local Value | Required? |
|---|---|---|---|
| `FASTAPI_LOGISTICS_URL` | Base URL of the FastAPI backend called by the Node server API bridge. | `http://127.0.0.1:8000` | Optional (defaults to port 8000) |
| `VITE_API_BASE_URL` | Base URL used by browser client to call REST endpoints and derive WebSocket URL. | `http://127.0.0.1:8000` | Optional (defaults to port 8000) |
| `DATABASE_URL` | SQLAlchemy / pg database connection string. If omitted, uses local SQLite. | `sqlite:///./riderzpro_logistics.db` | Optional |
| `OSRM_API_URL` | Open Source Routing Machine endpoint for road polylines. | `http://router.project-osrm.org` | Optional |
| `ROUTE_DEVIATION_DISTANCE_METERS` | Allowable distance corridor before triggering deviation alert. | `250.0` | Optional |
| `NODE_ENV` | Runtime environment mode. | `development` | Optional |
| `OTP_HASH_SECRET` | Secret key used for cryptographic OTP hashing. | Any 32-char string | Optional in dev |
| `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE` | Individual PostgreSQL parameters when using a PostgreSQL server. | `localhost`, `5432`, `postgres` | Optional |

> [!NOTE]
> For standard local development, the default values in `.env.example` work out of the box with zero external configuration.

---

## 7. Database Setup

The logistics backend uses SQLAlchemy to support **SQLite** locally and **PostgreSQL** in staging/production through a unified ORM model seam.

1. **Automatic Initialization**:
   When the FastAPI backend starts, `lifespan(app)` in [main.py](file:///c:/Users/ASUS/Desktop/Riderxpro/Riderzpro/main.py) calls `init_db()` from [logistics/database.py](file:///c:/Users/ASUS/Desktop/Riderxpro/Riderzpro/logistics/database.py).
2. **Schema & Migration**:
   Table creation (`Base.metadata.create_all`) and automatic column backfilling (`_ensure_columns_exist()`) run automatically on startup.
3. **Default Seed Data**:
   If the database is empty, `seed_default_riders(db)` seeds 4 pre-configured technicians/riders:
   - `tech_ramesh` (Ramesh Kumar — Van, 50kg payload)
   - `tech_priya` (Priya Sharma — Electric Bike, BMS specialist)
   - `tech_anil` (Anil Deshmukh — Regular Bike)
   - `rider_sathesh` (Sathesh Ittraju — Electric Bike, active live demo rider)

---

## 8. Starting Logistics Backend

Start the FastAPI logistics backend using `uvicorn`:

```bash
uvicorn main:app --reload --port 8000
```
Or using python module syntax:
```bash
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

### Verification Endpoints
- **Service Health**: `GET http://127.0.0.1:8000/health`
  ```json
  {"status": "healthy", "service": "riderzpro-logistics-backend", "version": "1.0.0"}
  ```
- **Interactive Swagger Docs**: `http://127.0.0.1:8000/docs`
- **ReDoc Documentation**: `http://127.0.0.1:8000/redoc`

---

## 9. Starting Main RiderzPro Application

In a separate terminal, start the main web application:

```bash
npm run dev -- --port 8080
```
*(Or `npm run dev` which runs the Vite development server with the `.dev.vars` file).*

### Expected Access
- **Storefront & Customer Portal**: `http://localhost:8080/`
- **Rider Sign-In**: `http://localhost:8080/rider`
- **Rider Shift Dashboard**: `http://localhost:8080/rider/dashboard`
- **Customer Tracking**: `http://localhost:8080/track/delivery_vijayawada_amaravati_live`

---

## 10. Running Both Services

Running the complete platform requires two active terminal windows:

```
┌────────────────────────────────────────┐  ┌────────────────────────────────────────┐
│ TERMINAL 1: FastAPI Logistics Backend  │  │ TERMINAL 2: RiderzPro Main Web App     │
├────────────────────────────────────────┤  ├────────────────────────────────────────┤
│ (activate .venv)                       │  │                                        │
│ uvicorn main:app --reload --port 8000  │  │ npm run dev -- --port 8080            │
│                                        │  │                                        │
│ -> http://127.0.0.1:8000/docs          │  │ -> http://localhost:8080              │
│ -> ws://127.0.0.1:8000/ws/...          │  │ -> Proxying to FastAPI port 8000      │
└────────────────────────────────────────┘  └────────────────────────────────────────┘
```

---

## 11. Logistics API Reference

All endpoints are mounted on the FastAPI backend on port `8000`.

### Deliveries Subsystem (`/api/deliveries`)

| Method | Endpoint | Description | Key Request Fields | Key Response Fields |
|---|---|---|---|---|
| `POST` | `/api/deliveries` | Create delivery task for order | `order_id`, `pickup_address`, `pickup_lat`, `pickup_lng`, `dropoff_address`, `dropoff_lat`, `dropoff_lng` | `id`, `order_id`, `status: "pending"`, `created_at` |
| `GET` | `/api/deliveries` | List deliveries with pagination | Query params: `page`, `limit`, `status`, `order_id`, `rider_id`, `customer_id` | `items: [...]`, `total`, `page`, `total_pages` |
| `GET` | `/api/deliveries/{id}` | Get delivery details | Path: `{id}` | Full `DeliveryResponse` including assigned rider and route |
| `GET` | `/api/deliveries/{id}/history` | Audit history of status changes | Path: `{id}` | `[{from_status, to_status, changed_by, reason, created_at}]` |
| `PATCH` | `/api/deliveries/{id}/status` | Transition delivery state | `status`, `reason`, `actor_id`, `actor_role` | Updated `DeliveryResponse` with new state |
| `POST` | `/api/deliveries/{id}/assign` | Assign or reassign rider | `rider_id`, `actor_id`, `actor_role`, `reason` | `status: "assigned"`, `assigned_rider_id`, rider profile |
| `GET` | `/api/deliveries/{id}/eligible-riders` | Candidate riders ranked by proximity | Path: `{id}` | `[{rider_id, name, vehicle_type, rating, distance_to_pickup_km}]` |
| `POST` | `/api/deliveries/{id}/optimize-route` | Generate road route geometry | `provider: "osrm"`, `vehicle_type: "electric_bike"` | `route_id`, `distance_km`, `duration_minutes`, `waypoints` |
| `POST` | `/api/deliveries/optimize-batch` | Multi-delivery batch optimization | `delivery_ids: [...]`, `optimizer_type: "classical_ortools"` | `assigned_deliveries`, `assignments: [...]`, `total_distance_km` |

### Rider Tracking & Fleet (`/api/riders`)

| Method | Endpoint | Description | Key Request Fields | Key Response Fields |
|---|---|---|---|---|
| `POST` | `/api/riders/{rider_id}/location` | Ingest GPS location update | `latitude`, `longitude`, `heading_degrees`, `speed_kmh`, `accuracy_meters`, `delivery_id` | `success: true`, `rider_id`, `latitude`, `longitude`, `timestamp` |
| `GET` | `/api/riders/{rider_id}/location` | Get latest recorded rider fix | Path: `{rider_id}` | `has_location`, `latitude`, `longitude`, `heading_degrees`, `speed_kmh`, `is_stale` |
| `GET` | `/api/riders/{rider_id}/locations` | Query historical GPS breadcrumbs | Query params: `page`, `limit`, `start_time`, `end_time`, `delivery_id` | `items: [{latitude, longitude, speed_kmh, timestamp}]` |

### Tracking & Telemetry

| Method | Endpoint | Description | Parameters / Payload |
|---|---|---|---|
| `GET` | `/api/deliveries/{delivery_id}/tracking` | REST snapshot of current delivery tracking | Headers: `X-User-Id`, `X-User-Role`. Returns coordinates, waypoints, ETA, geofence, and deviation status. |
| `WS` | `/ws/deliveries/{delivery_id}/tracking` | Live WebSocket streaming channel | Query params or headers: `user_id`, `user_role`. Broadcasts location updates and milestones. |

### Operations Dashboard (`/api/logistics`)

| Method | Endpoint | Description | Output Metrics |
|---|---|---|---|
| `GET` | `/api/logistics/dashboard` | Aggregated operations overview | `total_deliveries`, `pending`, `assigned`, `in_transit`, `delivered`, `active_riders`, `delayed_deliveries`, `recent_activity` |

---

## 12. Rider Panel Integration

The Rider Panel gives couriers and technicians an interface to manage their deliveries and stream real-time telemetry.

```
Rider Mobile / Web Browser
         ↓
Main Server Proxy (/api/rider/*)
         ↓
FastAPI Logistics Backend (/api/deliveries, /api/riders)
         ↓
Database Sync + WebSocket Broadcast
```

### Authentication & Access
- Navigate to `/rider` on the main application.
- Sign in using rider credentials (e.g. `rider@riderzpro.com` / `rider123` or demo rider `Sathesh Ittraju` with phone `9845077889`).
- Session validation automatically navigates authorized couriers to `/rider/dashboard`.

### Shift & Deliveries Management
- **View Deliveries**: The dashboard polls `/api/rider/deliveries`, which retrieves all active delivery tasks assigned to the rider directly from the FastAPI backend.
- **Advance Milestones**: Clicking the action button advances the task forward:
  - `ready_for_pickup` / `rider_assigned` $\rightarrow$ **Picked up** (`PICKED_UP`)
  - `picked_up` $\rightarrow$ **In transit** (`IN_TRANSIT`)
  - `in_transit` $\rightarrow$ **Delivered** (`DELIVERED`)
- Updates are forwarded to FastAPI `PATCH /api/deliveries/{id}/status`, notifying connected customer tracking sockets instantly.

---

## 13. Order → Delivery Flow

Deliveries maintain a 1:1 reference to the canonical customer order:

1. **Checkout**: Customer places an order on the storefront (via `src/lib/store.tsx` or `POST /api/orders`).
2. **Delivery Creation**: The client calls `apiCreateDelivery` ([src/lib/api.ts](file:///c:/Users/ASUS/Desktop/Riderxpro/Riderzpro/src/lib/api.ts)) targeting `POST http://127.0.0.1:8000/api/deliveries`.
3. **Payload Structure**:
   ```json
   {
     "order_id": "RZ-104921",
     "customer_id": "cust_demo",
     "customer_name": "Aakash Sharma",
     "customer_phone": "+91 98765 43210",
     "vendor_id": "vnd_nexgen_ev",
     "vendor_name": "NexGen EV Logistics",
     "pickup_address": "Vijayawada Central Hub (16.5062, 80.6480)",
     "pickup_lat": 16.5062,
     "pickup_lng": 80.6480,
     "dropoff_address": "Amaravati Secretariat (16.5740, 80.3575)",
     "dropoff_lat": 16.5740,
     "dropoff_lng": 80.3575,
     "package_weight_kg": 4.5,
     "priority": "normal"
   }
   ```
4. **Order Linkage**: The generated `delivery.id` is linked to the order as `shipmentId`, allowing lookup by either `order_id` or `delivery_id`.

---

## 14. Rider GPS / Location Tracking

Telemetry flows continuously from the courier's hardware to the customer's screen:

```
Rider Hardware / Browser
         ↓
Capacitor Geolocation (@capacitor/geolocation) / Web Geolocation API
         ↓
src/lib/native/location.ts (startLocationSharing, 5000ms loop)
         ↓
POST /api/rider/location
         ↓
FastAPI Backend (POST /api/riders/{id}/location)
         ↓
LocationTrackingService (validation, geofencing, route deviation)
         ↓
DeliveryConnectionManager (WebSocket broadcast)
```

### Telemetry Packet Fields
- `latitude` (float: $-90.0$ to $90.0$)
- `longitude` (float: $-180.0$ to $180.0$)
- `heading_degrees` (float: $0.0$ to $360.0$)
- `speed_kmh` (float: $0.0$ to $300.0$)
- `accuracy_meters` (float radius in meters)
- `delivery_id` (active delivery reference)
- `timestamp` (ISO-8601 string, validated within $\le 5$ min future skew and $\le 24$ hours past age)

---

## 15. WebSocket Tracking & Events

The WebSocket endpoint provides live telemetry updates without polling.

### WebSocket URL
```
ws://127.0.0.1:8000/ws/deliveries/{delivery_id}/tracking?user_id=cust_demo&user_role=customer
```
*(Derived automatically by `getWebSocketUrl()` in [src/lib/api.ts](file:///c:/Users/ASUS/Desktop/Riderxpro/Riderzpro/src/lib/api.ts) using `VITE_API_BASE_URL`).*

### Broadcast Event Types

| Event Name | Trigger | Payload Contents |
|---|---|---|
| `INITIAL_TRACKING_SNAPSHOT` | Client establishes WebSocket connection | Full snapshot: current coordinates, pickup, destination, ETA minutes, remaining distance km, full polyline waypoints, and assigned rider profile. |
| `RIDER_LOCATION_UPDATED` | Ingested GPS packet accepted | `rider: {id, latitude, longitude, heading_degrees, speed_kmh}`, `eta_minutes`, `distance_km`, `timestamp`. |
| `RIDER_APPROACHING` | Rider reaches $\le 500\,\text{m}$ from destination | Milestone notification that rider is within delivery neighborhood. |
| `RIDER_ARRIVED` | Rider reaches $\le 50\,\text{m}$ from destination | Arrival milestone notification indicating courier is at doorstep. |
| `RIDER_ROUTE_DEVIATION` | Rider exceeds $250\,\text{m}$ corridor offset | `distance_from_route_meters`, `threshold_meters`, alert warning message. |
| `RIDER_ROUTE_RECOVERED` | Rider returns within $250\,\text{m}$ corridor | Recovery confirmation clearing customer deviation banner. |
| `DELIVERY_STATUS_UPDATED` | Delivery state changes | `from_status`, `status`, `reason`, `timestamp`. |
| `DELIVERY_COMPLETED` | Delivery marked `delivered` / `cancelled` | Final completion message; gracefully concludes WebSocket session (code 1000). |

---

## 16. Customer Tracking Experience

Customers track deliveries at `/track/:orderId` (e.g. `http://localhost:8080/track/delivery_vijayawada_amaravati_live`).

### Tracking Page Mechanics
1. **Resolution**: [src/routes/track.$id.tsx](file:///c:/Users/ASUS/Desktop/Riderxpro/Riderzpro/src/routes/track.$id.tsx) matches `:id` against store orders or treats it as a direct `delivery_id`.
2. **Lifecycle Hook**: `useDeliveryTracking` loads an initial REST snapshot (`GET /api/deliveries/{id}/tracking`) and immediately establishes a persistent WebSocket connection.
3. **Map Rendering**: [DeliveryMap.tsx](file:///c:/Users/ASUS/Desktop/Riderxpro/Riderzpro/src/components/map/DeliveryMap.tsx) renders:
   - Green pickup pin with warehouse icon
   - Red destination pin with location marker
   - Blue active road polyline with direction arrows
   - Animated courier marker with vehicle icon showing true orientation heading
4. **Metrics Bar**: Displays live calculated ETA (`~X min`), remaining distance (`X.X km`), and current delivery status.
5. **Failover**: If the WebSocket disconnects, the hook automatically reconnects with exponential backoff and transparently falls back to REST polling every 10 seconds.

---

## 17. OSM + OSRM Integration

The map stack is 100% open-source and requires **no external API keys**:

- **Map Tiles**: Leaflet renders tiles from OpenStreetMap:
  `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`
- **Road Routing**: The backend route planner ([logistics/route_planning.py](file:///c:/Users/ASUS/Desktop/Riderxpro/Riderzpro/logistics/route_planning.py)) calls the OSRM public service:
  `http://router.project-osrm.org/route/v1/driving/{lng1},{lat1};{lng2},{lat2}?overview=full&geometries=geojson&steps=true`
- **Fallback**: If OSRM is unreachable or rate-limited, the route planner automatically falls back to Haversine great-circle line generation, ensuring routing operations never fail.

---

## 18. Geofencing

Geofence triggers are computed in [logistics/geofence.py](file:///c:/Users/ASUS/Desktop/Riderxpro/Riderzpro/logistics/geofence.py) on every accepted GPS update:

- **Approaching Threshold**: **$500.0\,\text{meters}$** (`DEFAULT_APPROACHING_DISTANCE_METERS`).
  - Emits: `RIDER_APPROACHING`
  - Client effect: Status banner shows courier entering immediate area.
- **Arrival Threshold**: **$50.0\,\text{meters}$** (`DEFAULT_ARRIVAL_DISTANCE_METERS`).
  - Emits: `RIDER_ARRIVED`
  - Client effect: Status banner updates to "Rider Arrived!".
- **Idempotency**: `GeofenceMilestoneState` ensures milestone events fire at most once per delivery lifecycle.

---

## 19. Route Deviation Detection

Deviation detection is implemented in [logistics/route_deviation.py](file:///c:/Users/ASUS/Desktop/Riderxpro/Riderzpro/logistics/route_deviation.py):

- **Corridor Threshold**: **$250.0\,\text{meters}$** (`ROUTE_DEVIATION_DISTANCE_METERS`).
- **Algorithm**:
  1. Computes the orthogonal projection of the rider's coordinates onto every segment of the planned road polyline using equirectangular projection.
  2. Measures the minimum great-circle Haversine distance to the closest point along the route.
- **Deviation Trigger**: If minimum distance $> 250.0\,\text{m}$, emits `RIDER_ROUTE_DEVIATION`.
- **Recovery Trigger**: When the courier returns within $\le 250.0\,\text{m}$, emits `RIDER_ROUTE_RECOVERED` to clear the alert state.

---

## 20. Live GPS Telemetry Simulator

The repository includes a ready-to-use live GPS simulator for local demonstrations and end-to-end verification without requiring a physical vehicle.

### Running the Simulator
Ensure the FastAPI backend is running on port 8000, then execute:

```bash
python scratch/simulate_movement.py
```

### Simulation Characteristics
- **Route**: Vijayawada Central Hub (`16.5062, 80.6480`) $\rightarrow$ Amaravati Secretariat (`16.5740, 80.3575`).
- **Delivery ID**: `delivery_vijayawada_amaravati_live`.
- **Rider**: `rider_sathesh`.
- **Mechanics**: Reads the actual 42.9 km road polyline from the backend, interpolates intermediate coordinates in steps of $250\,\text{m}$, calculates true turn bearings, and posts updates every 2 seconds.
- **Verification**: Open `http://localhost:8080/track/delivery_vijayawada_amaravati_live` in your browser to observe the vehicle smoothly navigating turns in real time.

---

## 21. Testing & Validation

The test suite validates both Python backend logic and TypeScript frontend modules.

### Run Python Logistics Backend Tests
```bash
python -m pytest
```
*Executes all 141 tests covering deliveries, geofencing, route deviation, and WebSocket broadcasts.*

### Run Frontend & Integration Tests
```bash
npm test
```
*Executes Vitest tests including native location streaming, map tracking, and routing.*

### Run TypeScript Type Check
```bash
npx tsc --noEmit
```
*Must complete with 0 errors.*

### Run Production Build Verification
```bash
npm run build
```
*Builds the client application bundle and Nitro SSR server.*

---

## 22. Troubleshooting

### 1. Port 8000 Already in Use
**Error**: `[Errno 10048] error while attempting to bind on address ('127.0.0.1', 8000)`
**Solution**: Find and stop the existing process:
- Windows: `Get-Process python | Stop-Process` or `netstat -ano | findstr :8000`
- Linux/macOS: `lsof -i :8000` followed by `kill -9 <PID>`

### 2. WebSocket Connection Rejected (Policy Violation 1008)
**Cause**: The user ID or role does not match the delivery customer, rider, or an authorized role (`admin`, `dispatcher`).
**Solution**: Provide authorization query parameters in the connection URL:
`?user_id=cust_demo&user_role=customer` or `?user_role=admin`.

### 3. Rider Panel Shows "No assigned deliveries yet"
**Cause**: The signed-in rider ID does not match any assigned delivery tasks.
**Solution**: Sign in with phone `9845077889` or email `sathesh.ittraju@riderzpro.demo` (password: `rider123` or `vamsi123`). The default live delivery `delivery_vijayawada_amaravati_live` is assigned to `rider_sathesh`.

### 4. OSRM Road Geometry Not Loading
**Cause**: Public OSRM server (`router.project-osrm.org`) is temporarily rate-limiting requests.
**Solution**: The backend automatically falls back to direct Haversine geometric calculation. No action is required. Alternatively, specify a self-hosted OSRM URL via `OSRM_API_URL` in `.env`.

### 5. GPS Permission Denied in Desktop Browser
**Cause**: Browser blocked geolocation permission prompt on desktop.
**Solution**: [src/lib/native/location.ts](file:///c:/Users/ASUS/Desktop/Riderxpro/Riderzpro/src/lib/native/location.ts) includes built-in fallback coordinates (Noida Hub / Vijayawada) so development and simulation workflows are never blocked.

---

## 23. Production Deployment Notes

When moving from local development to production, update these configurations:

1. **Protocol Conversion**: Use `https://` and `wss://` in production. [src/lib/api.ts](file:///c:/Users/ASUS/Desktop/Riderxpro/Riderzpro/src/lib/api.ts) automatically converts `https:` to `wss:` when deriving WebSocket URLs.
2. **CORS Restrictions**: In [main.py](file:///c:/Users/ASUS/Desktop/Riderxpro/Riderzpro/main.py), replace `allow_origins=["*"]` with explicit production domains (e.g., `["https://riderzpro.com", "https://admin.riderzpro.com"]`).
3. **Database Migration**: Set `DATABASE_URL` to your production PostgreSQL connection string (`postgresql://user:pass@host:5432/dbname`).
4. **Environment Variables**: Configure `FASTAPI_LOGISTICS_URL` on the SSR host to point to the internal FastAPI service IP or DNS name.

---

## 24. Quick Start Guide

Ready to get started? Run through this 5-minute setup:

```bash
# 1. Pull latest code
git checkout main
git pull origin main

# 2. Install dependencies
npm install
python -m venv .venv
.\.venv\Scripts\activate      # On Linux/macOS: source .venv/bin/activate
pip install -r requirements.txt

# 3. Create environment file
copy .env.example .env        # On Linux/macOS: cp .env.example .env

# 4. Terminal 1: Start FastAPI Logistics Backend
uvicorn main:app --reload --port 8000

# 5. Terminal 2: Start Main Web Application
npm run dev -- --port 8080

# 6. Open in Browser
# - Storefront:        http://localhost:8080/
# - Rider Panel:       http://localhost:8080/rider (Login: sathesh.ittraju@riderzpro.demo / rider123)
# - Customer Tracking: http://localhost:8080/track/delivery_vijayawada_amaravati_live

# 7. Terminal 3 (Optional): Run live GPS simulator
python scratch/simulate_movement.py
```
