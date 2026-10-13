# Logistics & Services Optimization Module

## Part 1 — Logistics Requirements and Workflow

---

### 1. Project Overview

The **Logistics and Services Optimization System** is a mission-critical subsystem of the **Quantum Algorithm-Based E-Commerce Platform**. The platform is designed as an end-to-end commerce and fulfillment ecosystem supporting:
- **Regular Bicycles and Bikes**: Traditional pedal bikes, performance bicycles, accessories, spare parts, and mechanical gear.
- **Electric Bikes (E-Bikes)**: Electric bicycles, lithium-ion battery units, smart drive systems, motors, and charging hardware.
- **Products & Consumables**: Spare components, safety equipment, replacement parts, and maintenance kits.
- **On-Site & Workshop Services**: Specialized technical services including EV battery assembly and installation, powertrain diagnostics, preventative maintenance, roadside support, and warranty tune-ups.

#### Strategic Objective
To orchestrate high-efficiency, SLA-compliant dispatching, delivery routing, and technician scheduling by establishing a deterministic classical operational baseline and integrating cutting-edge quantum and hybrid quantum-classical optimization algorithms for complex multi-stop routing and constrained service scheduling.

```
+-----------------------------------------------------------------------------------+
|               Quantum Algorithm-Based E-Commerce Platform                         |
+-----------------------------------------------------------------------------------+
|  Storefront & Orders  |  Rider Panel  |  Database & Core  |  Quantum Solvers      |
|  (Product & Service)  |  (Amrutha)    |  (Vamsi / Pushpam)|  (Harshitha & Hema)   |
+-----------------------------------------------------------------------------------+
|               [ Logistics & Services Optimization Module ]                        |
|   - Delivery Management        - Rider Workload & Capacity                        |
|   - Route Optimization         - Service Appointment Scheduling                   |
|   - Dynamic Reassignment       - Classical Baseline & Hybrid Optimizer Bridge    |
|   - MCP Integration Tools                                                         |
+-----------------------------------------------------------------------------------+
```

---

### 2. Product Delivery Workflow

The product delivery workflow governs the end-to-end lifecycle of physical goods fulfillment—from customer purchase to final drop-off and proof-of-delivery verification.

```mermaid
sequenceDiagram
    autonumber
    actor Customer
    participant Platform as E-Commerce Platform
    actor Seller
    participant Logistics as Logistics Subsystem
    participant Optimizer as Route / Assignment Engine
    actor Rider

    Customer->>Platform: 1. Places order for regular/e-bike products
    Platform->>Seller: 2. Notifies seller of new order
    Seller->>Platform: 3. Confirms product availability & marks ready for pickup
    Platform->>Logistics: 4. Ingests delivery request & creates delivery task
    Logistics->>Optimizer: 5. Evaluates locations, priority, SLA deadlines, & rider pool
    Optimizer-->>Logistics: 6. Returns optimal rider assignment & route itinerary
    Logistics->>Rider: 7. Dispatches task offer with pickup & drop-off details
    Rider->>Logistics: 8. Accepts assignment & marks status: EN_ROUTE_TO_PICKUP
    Rider->>Logistics: 9. Verifies pickup at seller/hub & marks status: PICKED_UP
    Rider->>Logistics: 10. Transits to customer & marks status: IN_TRANSIT
    Rider->>Customer: 11. Completes delivery (OTP / signature / photo proof)
    Rider->>Logistics: 12. Marks task status: DELIVERED
    Logistics->>Platform: 13. Notifies platform of successful fulfillment
```

#### Detailed Workflow Steps:
1. **Order Placement**:
   - Customer completes checkout on the e-commerce platform for products (e.g., e-bike batteries, helmets, bicycle drive chains).
   - Order metadata is published with destination geocodes, delivery tier (Standard vs. Express), and delivery time preferences.
2. **Seller Confirmation & Readiness**:
   - The seller or fulfillment hub receives the order notification.
   - Seller validates inventory, packages the item, and triggers the `READY_FOR_PICKUP` signal with warehouse/store address and parcel physical parameters (weight, dimensions).
3. **Logistics Intake**:
   - The Logistics Subsystem receives the delivery request via an internal event/API.
   - A new `Delivery` entity is registered in the state machine with status `PENDING`.
4. **Constraint Validation & Opportunity Evaluation**:
   - System analyzes geolocations (pickup vs. drop-off), transit distance, package weight/cargo size, deadline thresholds, and current rider pool availability.
5. **Rider Assignment & Route Planning**:
   - The optimization engine matches the delivery to an optimal rider based on proximity, vehicle capability, and active workload.
   - An optimized multi-stop route itinerary is generated.
6. **Rider Execution & Real-Time Tracking**:
   - The selected rider accepts the task via the rider app.
   - The rider transitions through discrete milestones: `ACCEPTED` -> `EN_ROUTE_TO_PICKUP` -> `PICKED_UP` -> `IN_TRANSIT` -> `DELIVERED`.
   - Completion requires verified proof of delivery (e.g., customer OTP confirmation or digital signature).

---

### 3. Service and Installation Workflow

The service workflow manages skilled field operations, such as EV battery replacements, electrical system diagnostics, motor tuning, and bicycle assemblies requiring both an available technician and synchronized parts logistics.

```mermaid
sequenceDiagram
    autonumber
    actor Customer
    participant ServiceCatalog as Service Catalog
    participant Logistics as Logistics Subsystem
    participant Inventory as Parts & Inventory Hub
    participant Scheduler as Service Scheduling Engine
    actor Technician as Service Technician / Rider

    Customer->>ServiceCatalog: 1. Selects service (e.g., EV Battery Installation)
    Customer->>ServiceCatalog: 2. Chooses preferred appointment date & time slot
    ServiceCatalog->>Logistics: 3. Submits service booking request with location & parts needed
    Logistics->>Inventory: 4. Verifies required products (e.g., battery pack, wiring harness)
    Logistics->>Scheduler: 5. Matches certified technician, location, time window, & parts readiness
    Scheduler-->>Logistics: 6. Confirms appointment schedule & assigns technician
    Logistics->>Technician: 7. Dispatches appointment details & parts pickup location
    Logistics->>Customer: 8. Sends appointment confirmation & preparation guidelines
    Technician->>Inventory: 9. Collects required service parts/tools
    Technician->>Logistics: 10. Updates status: EN_ROUTE_TO_APPOINTMENT
    Technician->>Customer: 11. Arrives on site & performs installation/maintenance
    Technician->>Logistics: 12. Logs diagnostic checklist & marks status: COMPLETED
    Logistics->>Customer: 13. Issues service report & warranty activation
```

#### Detailed Workflow Steps:
1. **Service Selection**:
   - Customer selects an eligible service from the platform catalog (e.g., EV Battery Upgrade/Installation, Brake Overhaul, Full Drivetrain Tune-up).
2. **Appointment Slot Selection**:
   - Customer chooses an open time slot and designates the service address (home, office, or authorized local service point).
3. **Resource & Component Coordination**:
   - The Logistics Subsystem cross-references the appointment requirements against technical certifications (e.g., high-voltage EV battery certified) and inventory status for mandatory parts (e.g., specific battery model, mounting bracket).
   - If parts must be delivered to the location ahead of time or collected by the technician en route, combined product-service routing is generated.
4. **Appointment Tracking & Service Execution**:
   - The appointment state machine transitions through: `SCHEDULED` -> `TECHNICIAN_ASSIGNED` -> `PARTS_ACQUIRED` -> `EN_ROUTE` -> `IN_PROGRESS` -> `COMPLETED`.
   - The technician executes a standardized digital inspection checklist, records battery serial numbers/diagnostic metrics, and obtains customer sign-off.

---

### 4. Core Features

| Feature Name | Description | Key Capabilities |
|---|---|---|
| **Delivery Task Management** | End-to-end lifecycle management of all physical shipment tasks. | Task creation, parcel dimensioning, priority escalation (Standard/Express), status transitions, SLA monitoring. |
| **Rider Availability & Workload Management** | Real-time tracking of rider operational states and current load. | Online/offline/break toggles, shift hours enforcement, active delivery counter, weight/volume capacity limits. |
| **Rider Assignment Engine** | Algorithmic matching of deliveries and services to qualified riders. | Distance-based filtering, skill/vehicle capability verification, capacity-checked assignment, load balancing. |
| **Route Optimization** | Multi-stop trajectory planning for riders and field technicians. | Minimization of transit distance and time, turn-by-turn waypoint sequencing, vehicle-specific routing (bike lanes vs. roads). |
| **Service Appointment Coordination** | Harmonization of customer appointment windows with technician availability. | Time-slot reservation, multi-resource synchronization (technician + replacement parts), technician skill matching. |
| **Delivery Tracking & Rescheduling** | Transparency and resilience against real-world fulfillment disruptions. | Live ETA estimation, customer milestone notifications, SLA breach warnings, automated exception handling and re-booking. |
| **Classical & Quantum/Hybrid Optimization Integration** | Dual-tier optimization architecture. | Classical heuristics (OR-Tools, Clarke-Wright, Simulated Annealing) as the operational baseline; hybrid quantum (QUBO/QAOA/VQE) for complex combinatorial scenarios. |
| **MCP Integration for Approved Logistics Operations** | Standardized Model Context Protocol tool endpoints for AI agent interactions. | Secure read/write tools for delivery querying, schedule inspection, route retrieval, and supervisor-approved reassignment triggers. |

---

### 5. Core Entities

*Note: Conceptual domain modeling only. Database schemas and ORM models will be finalized in later phases in coordination with the database team.*

#### 5.1 Delivery
- **Purpose**: Represents an individual package fulfillment request from a merchant/hub to a customer.
- **Important Fields**:
  - `delivery_id`: Unique identifier for the delivery task.
  - `order_id`: Reference to parent e-commerce order.
  - `customer_id`: Reference to recipient profile.
  - `seller_id` / `hub_id`: Origin merchant or fulfillment depot identifier.
  - `pickup_address`: Geolocation (latitude, longitude) and street address of pickup.
  - `dropoff_address`: Geolocation (latitude, longitude) and street address of recipient.
  - `package_weight_kg`: Weight of package (must not exceed rider capacity).
  - `package_dimensions`: Dimensional metrics (length, width, height) and volume.
  - `delivery_tier`: Priority level (`STANDARD`, `EXPRESS`, `SAME_DAY`).
  - `time_window_start`: Earliest acceptable delivery time.
  - `deadline`: Hard delivery deadline / SLA commitment.
  - `status`: Discrete lifecycle stage (`PENDING`, `ASSIGNED`, `PICKED_UP`, `IN_TRANSIT`, `DELIVERED`, `FAILED`, `CANCELLED`).
  - `proof_of_delivery`: Verification payload (OTP hash, customer signature URL, photo proof).
  - `created_at` / `updated_at`: Audit timestamps.

#### 5.2 Rider
- **Purpose**: Represents a delivery partner or mobile field technician participating in the fulfillment network.
- **Important Fields**:
  - `rider_id`: Unique identifier for the rider.
  - `user_id`: Reference to authentication/account profile.
  - `name`: Full name of the rider.
  - `contact_phone`: Verified contact number.
  - `vehicle_type`: Transport mode (`REGULAR_BIKE`, `ELECTRIC_BIKE`, `CARGO_EBIKE`, `VAN`).
  - `skill_certifications`: List of validated technician capabilities (e.g., `["EV_BATTERY_INSTALL", "MECHANICAL_TUNEUP"]`).
  - `current_location`: Real-time GPS coordinate (`latitude`, `longitude`, `timestamp`).
  - `status`: Real-time operational state (`AVAILABLE`, `BUSY`, `ON_BREAK`, `OFFLINE`).
  - `max_payload_kg`: Upper weight threshold the vehicle/rider can transport.
  - `max_active_orders`: Maximum concurrent deliveries allowed simultaneously.
  - `active_order_count`: Current count of orders in transit or assigned.
  - `shift_start` / `shift_end`: Daily operational schedule boundaries.
  - `performance_rating`: Composite rating score for assignment weighting.

#### 5.3 Rider Assignment
- **Purpose**: Represents an explicit dispatch binding associating a specific rider with a delivery task or service appointment.
- **Important Fields**:
  - `assignment_id`: Unique identifier for the assignment record.
  - `rider_id`: Reference to assigned rider.
  - `task_type`: Nature of assignment (`PRODUCT_DELIVERY` or `SERVICE_APPOINTMENT`).
  - `task_id`: Foreign key reference to either `delivery_id` or `appointment_id`.
  - `assigned_at`: Timestamp when the system offered or bound the task.
  - `accepted_at`: Timestamp when the rider accepted the dispatch offer.
  - `status`: Assignment state (`OFFERED`, `ACCEPTED`, `REJECTED`, `IN_PROGRESS`, `COMPLETED`, `REASSIGNED`).
  - `reassignment_reason`: Diagnostic rationale if reassignment occurred (e.g., `TIMEOUT`, `VEHICLE_BREAKDOWN`, `REJECTED_BY_RIDER`).
  - `sequence_order`: The waypoint sequence order within the rider's overall active route.
  - `estimated_arrival_time`: Target ETA computed by route optimizer.

#### 5.4 Service Appointment
- **Purpose**: Represents a scheduled technical service, installation, or maintenance booking.
- **Important Fields**:
  - `appointment_id`: Unique identifier for the service booking.
  - `order_id`: Reference to parent order.
  - `customer_id`: Customer receiving the on-site service.
  - `service_type`: Service category (`EV_BATTERY_INSTALLATION`, `BRAKE_MAINTENANCE`, `MOTOR_DIAGNOSTICS`, `GENERAL_TUNEUP`).
  - `service_location`: Geolocation (latitude, longitude) and customer address.
  - `scheduled_date`: Date of the appointment.
  - `slot_start` / `slot_end`: Time window committed to the customer.
  - `required_product_ids`: Array of products/parts needed for installation (e.g., battery pack SKU).
  - `assigned_technician_id`: Reference to certified rider/technician assigned.
  - `status`: Appointment lifecycle stage (`SCHEDULED`, `ASSIGNED`, `PARTS_EN_ROUTE`, `IN_PROGRESS`, `COMPLETED`, `RESCHEDULED`, `CANCELLED`).
  - `completion_checklist`: Structured completion data (battery serial number, diagnostic checklist, test-drive confirmation).
  - `customer_signoff`: Digital signature or acceptance code from customer.

#### 5.5 Route / Optimization Result
- **Purpose**: Captures the computed multi-stop itinerary and dispatch output generated by the optimization engine.
- **Important Fields**:
  - `route_id`: Unique identifier for the planned route.
  - `rider_id`: Assigned rider for this itinerary.
  - `optimizer_engine`: Solver identifier (`CLASSICAL_BASELINE`, `QUANTUM_QUBO_HYBRID`).
  - `waypoints`: Ordered array of stop nodes with target arrival time, stop type (`PICKUP`, `DROPOFF`, `SERVICE`), and entity references.
  - `total_distance_km`: Aggregate route distance.
  - `total_estimated_duration_min`: Aggregate travel and service duration.
  - `energy_consumption_estimate`: Projected battery/energy expenditure for e-bikes.
  - `objective_cost_score`: Objective function value (combination of distance, time, penalty weights).
  - `solver_metadata`: Solver performance metrics (computation time in ms, quantum qubit count/shots if applicable, convergence status).
  - `status`: Route execution state (`PLANNED`, `ACTIVE`, `MODIFIED`, `COMPLETED`).
  - `computed_at`: Timestamp of computation.

---

### 6. Initial Business Rules

1. **Rider Availability Constraint**:
   - Only riders with status `AVAILABLE` and within their designated active shift window (`shift_start` <= current_time <= `shift_end`) can receive new assignments.
2. **Multi-Constraint Feasibility**:
   - Every candidate assignment must satisfy all hard constraints:
     - Distance and travel time within SLA deadline limits.
     - Cumulative package weight must not exceed `max_payload_kg`.
     - Active task count must not exceed `max_active_orders`.
     - Technician must possess active certifications matching the required `service_type`.
3. **Overload Prevention**:
   - The system must reject automatic task assignment if the rider's queue is full, preventing delivery delays, rider exhaustion, and safety hazards.
4. **Dynamic Reassignment & Failover**:
   - If an assignment offer is rejected or ignored beyond the acceptance timeout (e.g., 90 seconds), the assignment state is set to `REASSIGNED` and immediately dispatched to the next best candidate.
   - In case of reported vehicle failure or rider emergency, active tasks must be dynamically recalled and rescheduled or split across nearby available riders.
5. **Immutable Audit & Status History**:
   - All state transitions across deliveries, appointments, and rider assignments must generate immutable audit events capturing timestamp, previous state, new state, actor, and contextual notes.
6. **Classical Baseline First Strategy**:
   - The system must execute all routing and assignment logic through deterministic classical solvers (e.g., Google OR-Tools / Clarke-Wright Savings) first.
   - The classical solution serves as the immediate fallback, production safety net, and benchmark against which quantum/hybrid solvers are validated.

---

### 7. Team Dependencies

| Team Member(s) | Primary Responsibilities | Logistics Integration Points |
|---|---|---|
| **Harshitha & Hema** | Quantum Algorithms & Optimization | Formulate QUBO/Ising models for Vehicle Routing Problem with Time Windows (VRPTW) and Job Shop Scheduling; build quantum-classical hybrid solvers; benchmark quantum solutions against classical baselines. |
| **Amrutha** | Rider Panel & Frontend Integration | Build mobile-responsive rider web interface; implement rider status toggles (Available/Offline), task acceptance modals, turn-by-turn route view, and delivery/appointment completion flows. |
| **Vamsi** | Database Architecture & Relationships | Implement relational/NoSQL schemas, indices, spatial geometry queries (PostGIS/geohash), foreign key integrity, and migration pipelines for logistics entities. |
| **Pushpam** | Backend Integration & Cloud Deployment | Design REST/WebSocket API endpoints, authentication middleware (JWT/RBAC), message queues (Redis/RabbitMQ) for asynchronous logistics events, CI/CD, and deployment infrastructure. |
| **Viswanath** | Logistics Workflow, Service Coordination, Rider Assignment & Optimization Integration | Lead logistics requirements and domain architecture; develop assignment logic and service appointment coordination; build bridges to classical and quantum optimizers; implement logistics MCP tools. |

---

### 8. Scope and Deliverables

#### Current Phase Scope (Part 1):
- Comprehensive requirements specification, domain entity design, and workflow architecture.
- Definition of operational state machines and initial business rules.
- Team dependency mapping and architectural boundary definition.

#### Future Phase Deliverables (Out of Scope for This Task):
- Database schema implementation, migrations, and ORM entity classes (Vamsi / Database).
- REST/GraphQL/WebSocket API controllers, microservices, and deployment scripts (Pushpam / Backend).
- Quantum QUBO formulation, hybrid quantum algorithm coding, and Qiskit/D-Wave integration (Harshitha & Hema / Quantum).
- Rider panel user interfaces and mobile web views (Amrutha / Rider Panel).
- MCP tool runtime server execution and automated background workers.

#### Requirements to Confirm with the Team Before Implementation:
1. **Geolocation & Spatial Storage Format** *(with Vamsi)*:
   - Determine whether locations will be stored as PostGIS `GEOMETRY(Point, 4326)`, raw `(latitude, longitude)` floats, or geohashes for spatial indexing.
2. **Real-Time Communication Protocol** *(with Pushpam & Amrutha)*:
   - Confirm protocol for live rider location updates and instant dispatch notifications (WebSockets, Server-Sent Events, or MQTT).
3. **Quantum Solver Interface Contract** *(with Harshitha & Hema)*:
   - Establish standard JSON payload contract for the optimization problem instance (distance matrix, time windows, capacity constraints, objective weights) and expected solution schema.
4. **Service Technician vs. Delivery Rider Modeling** *(with Amrutha & Pushpam)*:
   - Confirm if technicians and riders share the same base `Rider` profile with different capability tags, or if they require distinct user roles and permissions in the authentication service.
5. **Dispatch Acceptance SLA & Timeout Window**:
   - Finalize the timeout threshold before auto-reassignment (e.g., 60s vs. 120s) and rider penalty/re-routing policy.
6. **MCP Tool Capabilities & Security Policy**:
   - Confirm exact tool specifications and authorization rules for Model Context Protocol (MCP) agents interacting with logistics state.

---

## Part 2 — Delivery Management Backend Implementation

### 1. Module Responsibilities
The **Delivery Management Subsystem** implements the backend core for order fulfillment, rider assignment, delivery tracking, and route optimization.
- **Fulfillment Lifecycle**: Ingests confirmed customer orders, verifies spatial coordinates, enforces duplicate delivery prevention, and creates traceable delivery entities.
- **State Machine Management**: Validates status transitions (`pending` &rarr; `assigned` &rarr; `picked_up` &rarr; `in_transit` &rarr; `delivered`), logs immutable audit history, and manages terminal outcomes (`failed`, `cancelled`).
- **Rider Assignment Business Logic**: Evaluates rider availability, active workloads, payload limits, vehicle capabilities, and proximity to pickup, with concurrency control and safe reassignment.
- **Route Planning Engine**: Calculates road-adjusted transit distance, estimated travel duration, and EV battery energy consumption profiles.
- **Optimization Bridge**: Dual-tier optimizer supporting classical baselines (Google OR-Tools & heuristic nearest-neighbor) alongside a quantum QUBO/QAOA formulation with automatic fallback.
- **MCP Integration**: Exposes authorized Model Context Protocol tools for AI agent task queries and supervisor-approved dispatches.

---

### 2. API Endpoints and Request/Response Examples

Base URL: `http://localhost:8000/api/deliveries`

#### 2.1 Create Delivery Task
- **Endpoint**: `POST /api/deliveries`
- **Status**: `201 Created` (or `409 Conflict` if active delivery exists for order, `400 Bad Request` if invalid coordinates)
- **Request Example**:
```json
{
  "order_id": "VF-2026-8941",
  "customer_id": "usr_customer_demo",
  "customer_name": "Rahul Verma",
  "customer_phone": "+91 98860 99887",
  "vendor_id": "vnd_nexgen_ev",
  "vendor_name": "NexGen Power Systems",
  "pickup_address": "Indiranagar Hub, HAL 2nd Stage, Bengaluru",
  "pickup_lat": 12.9719,
  "pickup_lng": 77.6412,
  "dropoff_address": "Apartment 4B, Palm Meadows, Whitefield, Bengaluru",
  "dropoff_lat": 12.9550,
  "dropoff_lng": 77.7200,
  "package_weight_kg": 19.5,
  "package_dimensions": "45x30x25 cm",
  "priority": "express",
  "notes": "NexCharge Pro 51.1V battery delivery"
}
```
- **Response Example**:
```json
{
  "id": "del_a1b2c3d4e5f6",
  "order_id": "VF-2026-8941",
  "customer_id": "usr_customer_demo",
  "customer_name": "Rahul Verma",
  "customer_phone": "+91 98860 99887",
  "vendor_id": "vnd_nexgen_ev",
  "vendor_name": "NexGen Power Systems",
  "pickup_address": "Indiranagar Hub, HAL 2nd Stage, Bengaluru",
  "pickup_lat": 12.9719,
  "pickup_lng": 77.6412,
  "dropoff_address": "Apartment 4B, Palm Meadows, Whitefield, Bengaluru",
  "dropoff_lat": 12.9550,
  "dropoff_lng": 77.7200,
  "package_weight_kg": 19.5,
  "package_dimensions": "45x30x25 cm",
  "priority": "express",
  "status": "pending",
  "assigned_rider_id": null,
  "assigned_rider": null,
  "created_at": "2026-10-09T17:50:00Z",
  "updated_at": "2026-10-09T17:50:00Z",
  "latest_route": {
    "id": "rt_88419201",
    "delivery_id": "del_a1b2c3d4e5f6",
    "provider": "haversine_builtin",
    "distance_km": 11.25,
    "duration_minutes": 29.1,
    "energy_consumption_kwh": 0.248,
    "waypoints": [
      {"step": 0, "lat": 12.9719, "lng": 77.6412, "eta_minute_offset": 0.0},
      {"step": 5, "lat": 12.9550, "lng": 77.7200, "eta_minute_offset": 29.1}
    ]
  },
  "status_history": [
    {
      "id": "dsh_9921",
      "from_status": null,
      "to_status": "pending",
      "changed_by_user_id": "usr_customer_demo",
      "changed_by_role": "customer",
      "reason": "Fulfillment task created and queued for dispatch",
      "created_at": "2026-10-09T17:50:00Z"
    }
  ]
}
```

#### 2.2 List and Filter Deliveries
- **Endpoint**: `GET /api/deliveries?page=1&limit=20&status=pending&priority=express`
- **Status**: `200 OK`
- **Response Example**:
```json
{
  "items": [...],
  "total": 1,
  "page": 1,
  "limit": 20,
  "total_pages": 1
}
```

#### 2.3 Retrieve Delivery Details
- **Endpoint**: `GET /api/deliveries/{delivery_id}`
- **Status**: `200 OK` (or `404 Not Found`)

#### 2.4 Update Delivery Status
- **Endpoint**: `PATCH /api/deliveries/{delivery_id}/status`
- **Status**: `200 OK` (or `400 Bad Request` on invalid state transition)
- **Request Example**:
```json
{
  "status": "delivered",
  "actor_id": "tech_ramesh",
  "actor_role": "rider",
  "reason": "Completed installation and verified OTP with customer",
  "proof_of_delivery": "OTP-9921-VERIFIED"
}
```

#### 2.5 Assign or Reassign Rider
- **Endpoint**: `POST /api/deliveries/{delivery_id}/assign`
- **Status**: `200 OK` (or `422 Unprocessable Entity` if rider is offline/busy, `404 Not Found`)
- **Request Example**:
```json
{
  "rider_id": "tech_ramesh",
  "actor_id": "vnd_nexgen_ev",
  "actor_role": "vendor",
  "reason": "Dispatched for morning time slot"
}
```
*Note: If `rider_id` is omitted, the assignment engine automatically finds and assigns the top-ranked available rider.*

#### 2.6 Calculate / Optimize Route
- **Endpoint**: `POST /api/deliveries/{delivery_id}/optimize-route`
- **Status**: `200 OK`
- **Request Example**:
```json
{
  "provider": "haversine_builtin",
  "vehicle_type": "electric_bike"
}
```

#### 2.7 Multi-Delivery Batch Optimization
- **Endpoint**: `POST /api/deliveries/optimize-batch`
- **Status**: `200 OK`
- **Request Example**:
```json
{
  "delivery_ids": ["del_001", "del_002", "del_003"],
  "optimizer_type": "classical_ortools"
}
```

---

### 3. Database Dependencies

The subsystem utilizes SQLAlchemy 2.0 models mapped to SQLite (local) or PostgreSQL (production):
- **`deliveries`**: Master delivery task record with foreign keys to `riders`, composite indexes on `(order_id, status)` and `(vendor_id, status)`.
- **`riders`**: Fleet partner profiles with live coordinates, status flags (`available`, `busy`, `on_break`, `offline`), capacity limits, and current workload counters.
- **`rider_assignments`**: Audit logs of every dispatch binding, tracking reassignments and completion timestamps.
- **`delivery_routes`**: Persisted route computations containing distances, durations, energy usage, and JSON waypoints.
- **`delivery_status_history`**: Immutable ledger of all lifecycle transitions with actor ID, role, and reasoning.

*Coordinated with Database Lead (Vamsi): Shared models reuse existing user/order IDs without breaking dependencies.*

---

### 4. Rider Assignment Business Rules

1. **Availability Gate**: A rider must be `is_online == True` and `status == "available"`. Offline or on-break riders are strictly excluded.
2. **Workload Ceiling**: Current workload must satisfy `current_workload_count < max_concurrent_orders`. Reaching the limit automatically marks the rider `status = "busy"`.
3. **Payload Check**: `max_payload_kg >= delivery.package_weight_kg`.
4. **Ranking Objective Function**:
   $$\text{Score} = \text{Distance}_{\text{pickup}}(\text{km}) + 3.0 \times \text{Workload} - 1.0 \times \max(0, \text{Rating} - 4.0)$$
   *Minimizes travel time while balancing fleet workload.*
5. **Reassignment Safety**: Reassigning automatically decrements the previous rider's workload counter, sets their status back to `available` if previously busy, and logs a `reassigned` event.

---

### 5. Delivery Status State Machine

```
              +-------------+
              |   pending   |
              +------+------+
                     |
         +-----------+-----------+
         |                       |
         v                       v
   +----------+            +-----------+
   | assigned |            | cancelled | [Terminal]
   +-----+----+            +-----------+
         |
         +-----------------------+
         |                       |
         v                       v
   +-----------+           +-----------+
   | picked_up |           |  pending  | (Reassignment fallback)
   +-----+-----+           +-----------+
         |
         +-----------------------+
         |                       |
         v                       v
   +------------+          +-----------+
   | in_transit |          |  failed   |
   +-----+------+          +-----+-----+
         |                       |
         +-----------+           +---> retry &rarr; pending
         |           |
         v           v
   +-----------+ +--------+
   | delivered | | failed |
   +-----------+ +--------+
    [Terminal]
```

- Invalid transitions (e.g. `pending` &rarr; `delivered`, or mutating `delivered`/`cancelled`) are rejected with `HTTP 400 Bad Request`.
- Completion releases the assigned rider's capacity slot and marks the assignment `completed`.

---

### 6. Route Planning Design

- **Pluggable Architecture (`RoutingProvider`)**:
  - `HaversineRoutingProvider`: Great-circle distance with a 1.25x urban road detour coefficient and vehicle speed profiling (`regular_bike`: 18 km/h, `electric_bike`: 28 km/h, `van`: 32 km/h).
  - `OSRMRoutingProvider`: Connects to OSRM APIs via `OSRM_API_URL` with automatic fallback to Haversine.
  - `GoogleMapsRoutingProvider`: Connects to Google Maps Directions via `GOOGLE_MAPS_API_KEY` with fallback.
- **EV Energy Estimator**: Tracks energy draw ($\approx 0.022\text{ kWh/km}$ for e-bikes, $0.180\text{ kWh/km}$ for vans).

---

### 7. Quantum Optimization Integration Points

- **Classical Baseline**: Production-ready implementation using **Google OR-Tools** (`pywrapcp.RoutingModel` with `PATH_CHEAPEST_ARC` heuristic) solving Capacitated VRP.
- **Quantum Hybrid Bridge (`QuantumHybridDeliveryOptimizer`)**:
  - Prepares Quadratic Unconstrained Binary Optimization (QUBO) formulations:
    $$\min_{x} x^T Q x \quad \text{where } x_{d,r} \in \{0, 1\}$$
  - Exposes standardized input/output payloads ready for **Harshitha and Hema's** Qiskit/QAOA module.
  - **Graceful Fallback**: If the quantum backend is unreachable or unconfigured, the classical solver executes transparently and returns `quantum_backend_status: "classical_fallback"` without blocking fulfillment operations.

---

### 8. Environment Variables & Testing

#### Environment Variables
```bash
DATABASE_URL="sqlite:///./riderzpro_logistics.db"  # Or postgresql://user:pass@localhost:5432/riderzpro
OSRM_API_URL="http://router.project-osrm.org"      # Optional external OSRM endpoint
GOOGLE_MAPS_API_KEY=""                            # Optional Google Maps API key
QUANTUM_BACKEND_URL=""                            # Optional Quantum simulator/service endpoint
```

#### Running Locally
```bash
# Install dependencies
pip install -r requirements.txt

# Run backend development server
uvicorn main:app --reload --port 8000
```
Open **`http://localhost:8000/docs`** in your browser for interactive Swagger API documentation.

#### Executing the Test Suite
```bash
python -m pytest tests/test_delivery_backend.py -v
```

---

### 9. Cross-Team Coordination

| Team Member | Shared Interface | Coordination Items |
|---|---|---|
| **Vamsi** | Database & Models | Align on PostGIS spatial geometry column types for production PostgreSQL migration. |
| **Pushpam** | Backend & Deployment | Coordinate JWT authentication middleware injection into `/api/deliveries` endpoints. |
| **Amrutha** | Rider Panel | Provide delivery task payload schema and status webhook triggers for the Rider Panel UI. |
| **Harshitha & Hema** | Quantum Algorithms | Connect QUBO/Ising formulation matrices generated by `QuantumHybridDeliveryOptimizer` to Qiskit simulator endpoints. |

---

## Part 3 — Rider Location Tracking Backend Implementation

### 1. Overview & Data Flow
The **Rider Location Tracking Subsystem** establishes persistent tracking, quality validation, historical auditing, and customer tracking for fleet riders:
```
RIDER PANEL
    ↓ (GPS lat, lng, speed, heading, timestamp)
POST /api/riders/{rider_id}/location
    ↓
LOGISTICS BACKEND & VALIDATION
    (Coordinates, Future/Past Clock Skew, Delivery Association, Out-of-Order Check)
    ↓
DATABASE PERSISTENCE
    ├── riders (current_lat, current_lng, last_location_timestamp, speed, heading)
    └── rider_locations (immutable historical breadcrumb trail)
    ↓
TRACKING VIEWS
    ├── GET /api/riders/{rider_id}/location (Fleet status & staleness check)
    ├── GET /api/riders/{rider_id}/locations (Authorized location history)
    └── GET /api/deliveries/{delivery_id}/tracking (Customer Map UI + Live ETA)
```

---

### 2. Location APIs and Specifications

#### 2.1 Send Rider GPS Location Update
- **Endpoint**: `POST /api/riders/{rider_id}/location`
- **Request Body**:
```json
{
  "latitude": 12.9750,
  "longitude": 77.6000,
  "timestamp": "2026-10-12T10:30:00Z",
  "accuracy_meters": 5.0,
  "speed_kmh": 28.5,
  "heading_degrees": 90.0,
  "delivery_id": "del_a1b2c3d4e5f6"
}
```
- **Response**: `200 OK`
```json
{
  "success": true,
  "rider_id": "tech_ramesh",
  "delivery_id": "del_a1b2c3d4e5f6",
  "latitude": 12.9750,
  "longitude": 77.6000,
  "timestamp": "2026-10-12T10:30:00Z",
  "message": "Location update accepted and recorded."
}
```

#### 2.2 Retrieve Current Rider Location
- **Endpoint**: `GET /api/riders/{rider_id}/location`
- **Response**: `200 OK`
```json
{
  "rider_id": "tech_ramesh",
  "name": "Ramesh Kumar",
  "has_location": true,
  "latitude": 12.9750,
  "longitude": 77.6000,
  "timestamp": "2026-10-12T10:30:00Z",
  "accuracy_meters": 5.0,
  "speed_kmh": 28.5,
  "heading_degrees": 90.0,
  "is_stale": false,
  "active_delivery_id": "del_a1b2c3d4e5f6",
  "active_delivery": {
    "id": "del_a1b2c3d4e5f6",
    "order_id": "VF-2026-8941",
    "status": "in_transit",
    "pickup_address": "Indiranagar Hub, Bengaluru",
    "dropoff_address": "Whitefield, Bengaluru"
  }
}
```
*Note: If no location has ever been reported, `has_location: false` is returned with `latitude: null, longitude: null, timestamp: null` rather than fake coordinates.*

#### 2.3 Customer / Dispatch Delivery Tracking
- **Endpoint**: `GET /api/deliveries/{delivery_id}/tracking`
- **Response**: `200 OK`
```json
{
  "delivery_id": "del_a1b2c3d4e5f6",
  "order_id": "VF-2026-8941",
  "status": "in_transit",
  "rider": {
    "id": "tech_ramesh",
    "name": "Ramesh Kumar",
    "phone": "+91 98450 12345",
    "vehicle_type": "van",
    "latitude": 12.9750,
    "longitude": 77.6000,
    "last_updated": "2026-10-12T10:30:00Z",
    "heading_degrees": 90.0,
    "speed_kmh": 28.5,
    "is_stale": false
  },
  "pickup": {
    "address": "Indiranagar Hub, Bengaluru",
    "latitude": 12.9719,
    "longitude": 77.6412
  },
  "dropoff": {
    "address": "Whitefield, Bengaluru",
    "latitude": 12.9550,
    "longitude": 77.7200
  },
  "eta_minutes": 18.2,
  "distance_km": 9.1,
  "route_waypoints": [...]
}
```

#### 2.4 Retrieve Location History
- **Endpoint**: `GET /api/riders/{rider_id}/locations?page=1&limit=50&delivery_id=del_xxx`
- **Headers**: `X-User-Role: admin` (Restricted to dispatchers/admins or the rider themselves)
- **Response**: `200 OK`

---

### 3. GPS Quality & Business Rules
1. **Coordinate Bounds**: Rejects latitudes outside $[-90, 90]$ and longitudes outside $[-180, 180]$.
2. **Clock Skew Protection**: Rejects timestamps $> 300\text{s}$ (5 minutes) into the future, and historical records $> 86400\text{s}$ (24 hours) old.
3. **Out-of-Order Preservation**: If an older timestamp arrives after a newer timestamp, it is persisted in `rider_locations` for auditing, but does **not** overwrite the rider's latest `current_lat`/`current_lng`.
4. **Teleportation Warning**: Logs quality alerts if consecutive updates within 60 seconds indicate speed $> 180\text{ km/h}$.
5. **Delivery Association & State Rules**:
   - Updates with `delivery_id` are strictly verified to ensure the delivery is assigned to that rider (`403 Forbidden` on mismatch).
   - Updates are rejected (`400 Bad Request`) if associated with inactive/terminal delivery states (`delivered`, `cancelled`, `failed`, `pending`).
6. **Staleness Threshold**: Riders with no location ping in the last 10 minutes are flagged as `is_stale = true`.

---

### 4. Frontend Map Contract (`map_view.js`)
The `GET /api/deliveries/{delivery_id}/tracking` endpoint directly supplies the exact parameters required by the `LiveMapCanvas` component in `web/js/components/map_view.js`:
- `rider.latitude` & `rider.longitude`: Moving vehicle marker position.
- `rider.heading_degrees`: Marker icon rotation angle.
- `pickup.latitude` & `pickup.longitude`: Origin pickup pin.
- `dropoff.latitude` & `dropoff.longitude`: Customer destination marker.
- `eta_minutes` & `distance_km`: Floating ETA banner metrics.
- `route_waypoints`: Polylines and interpolation path.

---

## Part 4 — Real-Time Delivery Tracking & WebSocket Streaming

### 1. Architectural Overview & Event Bus
The real-time streaming subsystem establishes a low-latency, bidirectional WebSocket bridge connecting rider GPS updates to customer tracking maps:

```
RIDER GPS (Panel / Device)
    ↓
POST /api/riders/{rider_id}/location
    ↓
LocationTrackingService.record_rider_location()
    ↓
Database commit (riders + rider_locations)
    ↓
Event Hook: RIDER_LOCATION_UPDATED
    ↓
DeliveryConnectionManager.broadcast_to_delivery()
    ↓ (WebSocket: /ws/deliveries/{delivery_id}/tracking)
Active Customer Sockets
    ↓
LiveMapCanvas (web/js/components/map_view.js)
    ↓
Canvas Rider Marker & Live ETA Updates (Zero Page Refresh)
```

### 2. WebSocket Endpoint Specification
- **URL**: `ws://<host>/ws/deliveries/{delivery_id}/tracking` (or `wss://` in production)
- **Authentication & Query Parameters**:
  - `user_id`: Unique identifier of the actor (e.g. `usr_customer_demo`).
  - `user_role`: Role of actor (`customer`, `rider`, `dispatcher`, `admin`, `system`).
  - `token`: (Optional) Bearer / session authentication token.
  - Alternatively supported via HTTP headers: `X-User-Id`, `X-User-Role`.
- **Authorization Rules**:
  - `customer`: Verified against `delivery.customer_id`. Mismatches are rejected with code `1008` (Policy Violation).
  - `rider`: Verified against `delivery.assigned_rider_id`. Non-assigned riders are rejected with code `1008`.
  - `admin` / `dispatcher` / `supervisor`: Granted full operational visibility.
  - Non-existent delivery IDs are rejected with code `1008`.

### 3. Real-Time Payloads & Wire Format

#### 3.1 Initial Connection Snapshot
Immediately upon accepted handshake, the server sends the full tracking state:
```json
{
  "event": "INITIAL_TRACKING_SNAPSHOT",
  "delivery_id": "del_577d5ca2f3cc",
  "status": "in_transit",
  "rider": {
    "id": "tech_ramesh",
    "name": "Ramesh Kumar",
    "phone": "+91 98450 12345",
    "vehicle_type": "van",
    "latitude": 12.9720,
    "longitude": 77.6420,
    "last_updated": "2026-10-12T07:23:45Z",
    "heading_degrees": 180.0,
    "speed_kmh": 35.0,
    "accuracy_meters": 5.0,
    "is_stale": false
  },
  "pickup": {
    "address": "Indiranagar Hub, Bengaluru",
    "latitude": 12.9719,
    "longitude": 77.6412
  },
  "dropoff": {
    "address": "Whitefield, Bengaluru",
    "latitude": 12.9550,
    "longitude": 77.7200
  },
  "eta_minutes": 14.8,
  "distance_km": 8.66,
  "route_waypoints": [...],
  "timestamp": "2026-10-12T07:23:45Z"
}
```

#### 3.2 Live Location Update Event
Dispatched whenever the assigned rider reports new GPS coordinates:
```json
{
  "event": "RIDER_LOCATION_UPDATED",
  "delivery_id": "del_577d5ca2f3cc",
  "rider": {
    "id": "tech_ramesh",
    "latitude": 12.9720,
    "longitude": 77.6420,
    "heading_degrees": 180.0,
    "speed_kmh": 35.0
  },
  "eta_minutes": 14.8,
  "distance_km": 8.66,
  "timestamp": "2026-10-12T07:23:45Z",
  "battery": {
    "soc_percent": 82.5,
    "temperature_celsius": 33.0
  }
}
```
*Note: If battery telemetry is not reported, the `battery` object is omitted or retains `null` values.*

#### 3.3 Delivery Lifecycle Completion Event
Dispatched when delivery transitions to a terminal state (`delivered`, `cancelled`, `failed`):
```json
{
  "event": "DELIVERY_COMPLETED",
  "delivery_id": "del_577d5ca2f3cc",
  "status": "delivered",
  "reason": "Customer OTP verified and signature obtained",
  "message": "Delivery transitioned to terminal state 'delivered'. Tracking concluded.",
  "timestamp": "2026-10-12T07:25:00Z"
}
```
Following this event, the server terminates the connection with WebSocket normal closure code `1000`.

### 4. Client Reconnect & Resilience Strategy
The `LiveMapCanvas` component in `web/js/components/map_view.js` implements fault-tolerant streaming:
1. **Exponential Backoff Reconnect**: Upon unexpected socket closure (e.g. mobile cellular handoff), reconnects automatically with delays scaled by $1000\text{ms} \times 1.5^{\text{attempts}}$ (capped at 12s, max 5 attempts).
2. **REST Polling Fallback**: If reconnect attempts exhaust, the map switches gracefully to background HTTP polling (`GET /api/deliveries/{id}/tracking` every 8s) without halting canvas rendering.
3. **Heartbeat Protocol**: Clients can send `"ping"` text frames; the server responds with `"pong"` to keep connections alive through reverse proxies and load balancers.
4. **Stale Signal Awareness**: If rider GPS pings exceed the 10-minute staleness threshold, the UI highlights a `(Stale Signal)` warning while preserving the last known coordinates.


---

## Phase 4.1 — Delivery Geofencing & Proximity Events

### Overview

Phase 4.1 introduces automatic geofence evaluation into the rider location tracking pipeline. When a rider's GPS coordinate update is processed, the system evaluates the rider's distance from the delivery dropoff and emits proximity milestone events when configurable thresholds are crossed.

```
POST /api/riders/{rider_id}/location
         ↓
validate GPS
         ↓
store location record
         ↓
update rider latest position
         ↓
calculate distance / ETA
         ↓
[NEW] evaluate geofence thresholds
         ↓
[NEW] generate milestone event if threshold crossed
         ↓
publish event via LocationTrackingService.publish_event()
         ↓
handle_realtime_event() subscriber in realtime.py
         ↓
DeliveryConnectionManager.broadcast_to_delivery()
         ↓
WebSocket clients subscribed to /ws/deliveries/{id}/tracking
```

---

### GeofenceService

**File:** `logistics/geofence.py`

The `GeofenceService` is a small, stateless-evaluator + stateful-deduplicator service responsible for:

1. **Calculating rider distance from destination** using the existing `haversine_distance()` function from `route_planning.py`. No second distance algorithm is introduced.
2. **Determining whether the rider is approaching** the destination (within the approaching threshold).
3. **Determining whether the rider has arrived** at the destination (within the arrival threshold).
4. **Preventing duplicate milestone events** within the current delivery lifecycle via `GeofenceMilestoneState`.

#### Configurable Thresholds

Thresholds are defined as module-level constants in a single location (`logistics/geofence.py`) and must not be hardcoded elsewhere in the application:

| Constant | Value | Meaning |
|---|---|---|
| `DEFAULT_APPROACHING_DISTANCE_METERS` | **500.0 m** | Rider is approaching — notify the customer |
| `DEFAULT_ARRIVAL_DISTANCE_METERS` | **50.0 m** | Rider has arrived at the destination |

Both thresholds are passed to `GeofenceService.__init__()` as constructor parameters with the above defaults, enabling easy override in tests or future configuration.

#### Active Delivery States

Geofence evaluation is only performed for deliveries in an active state:

```
ACTIVE_GEOFENCE_STATUSES = {"assigned", "picked_up", "in_transit"}
```

Terminal states (`delivered`, `cancelled`, `failed`) and pre-assignment states (`pending`) never trigger geofence events.

---

### Events

#### RIDER_APPROACHING

Emitted **once** when the rider's distance to the dropoff falls at or below **500 meters**.

```json
{
  "event": "RIDER_APPROACHING",
  "delivery_id": "del_577d5ca2f3cc",
  "order_id": "ORD-98421",
  "rider_id": "tech_ramesh",
  "distance_to_dropoff_meters": 420.5,
  "threshold_meters": 500.0,
  "timestamp": "2026-10-12T14:30:00.123456"
}
```

#### RIDER_ARRIVED

Emitted **once** when the rider's distance to the dropoff falls at or below **50 meters**.

```json
{
  "event": "RIDER_ARRIVED",
  "delivery_id": "del_577d5ca2f3cc",
  "order_id": "ORD-98421",
  "rider_id": "tech_ramesh",
  "distance_to_dropoff_meters": 28.3,
  "threshold_meters": 50.0,
  "timestamp": "2026-10-12T14:35:10.654321"
}
```

> [!IMPORTANT]
> **`RIDER_ARRIVED` does NOT automatically complete the delivery.**
> Arrival means the rider is physically near the destination. Delivery completion (proof of delivery, status transition to `delivered`, payment release) is a separate business event that must be triggered explicitly by an authorized user. The existing delivery state machine remains completely unchanged by Phase 4.1.

**Direct jump behavior:** If a rider GPS update crosses from outside the 500 m zone to inside the 50 m zone in a single update (e.g. due to a GPS correction or coarse polling interval), **both** `RIDER_APPROACHING` and `RIDER_ARRIVED` are emitted in the same batch.

---

### Event Deduplication

Rider devices may send GPS updates every few seconds. To prevent flooding clients with repeated milestone events:

- `RIDER_APPROACHING` is emitted **at most once** per delivery lifecycle.
- `RIDER_ARRIVED` is emitted **at most once** per delivery lifecycle.

Deduplication is tracked in-memory via `GeofenceMilestoneState`, which maintains a `Dict[delivery_id, Set[milestone_name]]` registry.

The milestone state can be **safely reset** for a specific delivery via `GeofenceService.reset_delivery(delivery_id)` (e.g. when a delivery is reassigned). A full reset is available via `GeofenceService.reset_all()`.

---

### WebSocket Delivery

Phase 4.1 reuses the existing WebSocket infrastructure (`/ws/deliveries/{delivery_id}/tracking`) without modification. The new events are routed through `handle_realtime_event()` in `realtime.py`:

```python
elif event_name in ("RIDER_APPROACHING", "RIDER_ARRIVED"):
    delivery_id = payload.get("delivery_id")
    if delivery_id:
        dispatch_coroutine(realtime_manager.broadcast_to_delivery(delivery_id, payload))
```

The payload from `GeofenceService.evaluate_geofence()` is broadcast as-is. All existing authorization rules are preserved:

- **Customers** receive events only for their own deliveries.
- **Assigned riders** receive events for their active delivery.
- **Dispatchers / admins / supervisors** retain full access.
- **Different deliveries remain isolated** — events from delivery A never reach delivery B subscribers.

---

### Tracking API Extension

`GET /api/deliveries/{delivery_id}/tracking` response now includes three optional geofence proximity fields:

| Field | Type | Description |
|---|---|---|
| `distance_to_dropoff_meters` | `float` or `null` | Current rider distance to dropoff in meters. `null` if rider has no reported location. |
| `is_approaching` | `bool` or `null` | `true` if rider is within 500 m of dropoff. |
| `is_arrived` | `bool` or `null` | `true` if rider is within 50 m of dropoff. |

These fields are populated by `GeofenceService.get_geofence_status()` and do **not** affect any existing response fields.

---

### Known Limitations

> [!WARNING]
> **Process-local state**: Both the `DeliveryConnectionManager` (WebSocket connections) and `GeofenceMilestoneState` (milestone deduplication) are held in-memory within the current process. In a multi-worker deployment (e.g. multiple Uvicorn workers or Kubernetes pods), WebSocket clients and milestone flags will not be shared across processes.
>
> **Mitigation (future phase)**: Redis Pub/Sub and a distributed milestone store (Redis HASH or database flag) are planned for the production-hardening phase. No code changes are needed here to enable that upgrade — the `GeofenceService` and `GeofenceMilestoneState` interfaces are already designed for a clean swap.

---

### Files Modified / Created (Phase 4.1)

| File | Change |
|---|---|
| `logistics/geofence.py` | **New** — `GeofenceService`, `GeofenceMilestoneState`, threshold constants |
| `logistics/location_service.py` | **Modified** — imports `geofence_service`; calls `evaluate_geofence()` after GPS publish; populates `get_geofence_status()` in tracking response |
| `logistics/realtime.py` | **Modified** — `handle_realtime_event()` routes `RIDER_APPROACHING` and `RIDER_ARRIVED` to `broadcast_to_delivery()` |
| `logistics/schemas.py` | **Modified (pre-existing)** — `DeliveryTrackingResponse` already contains `distance_to_dropoff_meters`, `is_approaching`, `is_arrived` optional fields |
| `tests/test_geofence.py` | **New** — 50 geofence tests covering all 14 scenarios from the spec |

---

### Phase 4.2 Recommendation

The following capabilities are suitable for implementation in Phase 4.2 once Phase 4.1 is verified in staging:

1. **Route deviation detection**: Alert dispatchers when rider GPS diverges significantly from the planned route waypoints.
2. **Redis-backed geofence state**: Replace `GeofenceMilestoneState` in-memory dict with a Redis HASH for multi-worker correctness.
3. **Push notification dispatch**: Trigger customer SMS / FCM push when `RIDER_APPROACHING` is emitted.
4. **React LiveMap integration**: Wire `src/routes/track.$id.tsx` WebSocket client to receive and render `RIDER_APPROACHING` / `RIDER_ARRIVED` events on the map.

---

## Phase 4.2 — Route Deviation Detection

### Overview & Purpose

Phase 4.2 introduces route deviation monitoring to the Riderzpro location tracking pipeline. When a rider reports GPS coordinates during an active delivery task, the system evaluates the rider's physical perpendicular distance to the planned delivery route corridor. If the rider strays beyond a configurable threshold distance from the route, a canonical `RIDER_ROUTE_DEVIATION` event is triggered and broadcast through the existing delivery-scoped WebSocket infrastructure.

> [!IMPORTANT]
> **Detection-Only Architecture**: This phase does **not** automatically reassign riders, cancel deliveries, modify task statuses, or recalculate routes. Its sole responsibility is accurate detection, in-memory state tracking/deduplication, and real-time event dissemination.

---

### Route Corridor Concept

Rather than calculating a naive distance to the nearest individual waypoint (which produces false positives when a rider travels legitimately between distant waypoints on a straight road), Phase 4.2 implements a **route corridor** model:

```
Planned Route:   Waypoint A ===============[Corridor]=============== Waypoint B
                                                  |
                                                  | orthogonal distance
                                                  v
Rider GPS:                                    Rider (P)
```

1. The route is represented as an ordered sequence of segments $[W_i, W_{i+1}]$.
2. For each segment, the orthogonal projection parameter $t$ of the rider coordinate onto the segment line is calculated using equirectangular projection adjusted for local latitude shrinkage:
   $$t = \frac{\vec{AP} \cdot \vec{AB}}{|\vec{AB}|^2}, \quad t_{\text{clamped}} = \max(0.0, \min(1.0, t))$$
3. Great-circle Haversine distance is calculated between the rider and the closest clamped point on each segment.
4. The minimum distance across all segments represents the rider's true distance from the planned route corridor.

---

### Configurable Threshold

- **Constant**: `DEFAULT_ROUTE_DEVIATION_DISTANCE_METERS = 250.0`
- **Environment Override**: `ROUTE_DEVIATION_DISTANCE_METERS` (defaults to `250.0` meters if unset)
- The threshold is centrally defined in `logistics/route_deviation.py` and passed to `RouteDeviationService.__init__()`.

---

### Active Delivery States

Route deviation is evaluated **only** for deliveries in active fulfillment states:

```python
ACTIVE_DEVIATION_STATUSES = {"assigned", "picked_up", "in_transit"}
```

Deliveries in terminal states (`delivered`, `cancelled`, `failed`) or pre-assignment state (`pending`) are ignored and will never emit deviation events.

---

### Canonical Event: `RIDER_ROUTE_DEVIATION`

When a rider exceeds the threshold corridor, the system emits `RIDER_ROUTE_DEVIATION`:

```json
{
  "event": "RIDER_ROUTE_DEVIATION",
  "delivery_id": "del_a1b2c3d4e5f6",
  "order_id": "ORD-12345",
  "rider_id": "tech_ramesh",
  "distance_from_route_meters": 312.5,
  "threshold_meters": 250.0,
  "latitude": 12.9754,
  "longitude": 77.6556,
  "timestamp": "2026-10-12T16:20:00.000000"
}
```

---

### State Deduplication & Recovery Behavior

1. **Deduplication**: Once a delivery enters the deviating state (`is_deviating = True`), subsequent GPS updates that remain beyond the threshold will **not** emit duplicate events. This protects subscribers and networks from event flooding.
2. **Recovery Reset**: When the rider moves back within the corridor ($\le 250\,\text{m}$), the internal state transitions back to `is_deviating = False`. No recovery events are spammed, but the state cleanly resets so that any subsequent departure from the route corridor will trigger a new deviation event.
3. **Delivery Isolation**: State is tracked per delivery ID in `RouteDeviationState`. Deviation on Delivery A has zero effect on Delivery B.

---

### Missing & Malformed Route Handling

If a delivery has no associated route, an empty waypoints list, or malformed coordinate data:
- The system safely skips deviation evaluation without raising exceptions.
- `POST /api/riders/{rider_id}/location` continues to succeed and records rider coordinates normally.

---

### WebSocket & REST API Integration

1. **WebSocket Broadcast**: Events are routed through `handle_realtime_event()` in `logistics/realtime.py` to `DeliveryConnectionManager.broadcast_to_delivery(delivery_id, payload)`. Only clients subscribed to the specific delivery's tracking stream receive the event.
2. **Tracking REST API**: `GET /api/deliveries/{delivery_id}/tracking` exposes three optional deviation fields:
   - `distance_from_route_meters`: Minimum distance to the route corridor in meters (or `null`).
   - `is_route_deviating`: Boolean flag indicating if rider currently exceeds corridor threshold.
   - `route_deviation_threshold_meters`: Active corridor threshold in meters (default `250.0`).

---

### Process-Local State & Multi-Worker Limitation

> [!WARNING]
> **Process-Local State**: `RouteDeviationState` is held in memory within the current Python process. In a multi-worker deployment (e.g. multiple Uvicorn workers), deviation state is not shared across processes.
>
> **Future Redis Integration**: A distributed state store (e.g., Redis HASH `riderzpro:deviation:{delivery_id}`) can be introduced in production hardening without modifying the external service interface.

---

### Files Modified / Created (Phase 4.2)

| File | Change |
|---|---|
| `logistics/route_deviation.py` | **New** — `RouteDeviationService`, `RouteDeviationState`, corridor geometry, coordinate parsing, threshold constants |
| `logistics/location_service.py` | **Modified** — imports `route_deviation_service`; evaluates route deviation after GPS update; enriches tracking response with route deviation status |
| `logistics/realtime.py` | **Modified** — `handle_realtime_event()` broadcasts `RIDER_ROUTE_DEVIATION` to delivery WebSocket clients |
| `logistics/schemas.py` | **Modified** — `DeliveryTrackingResponse` schema enriches optional `distance_from_route_meters`, `is_route_deviating`, `route_deviation_threshold_meters` |
| `tests/test_route_deviation.py` | **New** — 37 tests covering unit, geometric projection, thresholds, deduplication, recovery, lifecycle, WebSocket isolation, and API integration |
| `logistics/README.md` | **Modified** — added Phase 4.2 documentation |

---

## Part 6 — Frontend Map Integration & Live Tracking Visualization

### 1. Architecture Overview

The Map Integration phase connects the React/TanStack frontend (`src/routes/track.$id.tsx` and `src/components/site/LiveMap.tsx`) directly to the backend REST tracking API and WebSocket real-time event pipeline without vendor lock-in.

```
       track.$id.tsx (Route Page)
               │
      useDeliveryTracking (Hook)
       ├── REST GET /api/deliveries/{id}/tracking (Initial snapshot & fallback)
       └── WS  /ws/deliveries/{id}/tracking (Real-time telemetry & milestone events)
               │
        ┌──────┴─────────────────────────────────┐
        ▼                                        ▼
   DeliveryMap (Interactive Canvas/Tiles)    TrackingStatusPanel (Metadata)
   ├── MapProvider (Agnostic context)        ├── Live/Connecting/Stale Status Pill
   ├── OpenStreetMap / Carto tiles           ├── ETA & Remaining Distance
   ├── PickupMarker & DropoffMarker          ├── Geofence Alerts (Approaching/Arrived)
   │     (500m & 50m geofence rings)         └── Route Deviation Diagnostics
   ├── RiderMarker (Bearing & Radar Pulse)
   └── RouteLayer (Backend Waypoints & Deviation vector)
```

### 2. Map Provider Abstraction

- **Provider Agnostic**: Implemented through pure EPSG:3857 Web Mercator coordinate transformations (`MercatorProjection.ts`) and `MapProvider.tsx`.
- **Zero API Key Requirement**: Uses standard tile providers (OpenStreetMap / Carto Positron / Voyager) out of the box with customizable `MapProviderConfig`.
- **Easy Vendor Replacement**: Mapbox, Google Maps, or Leaflet can be swapped in via the `MapProviderConfig` without modifying the core delivery business components.

### 3. REST Initialization & WebSocket Lifecycle

- **Initial Load**: `GET /api/deliveries/{delivery_id}/tracking` fetches the canonical delivery snapshot, including coordinates for pickup, dropoff, current rider location, and pre-calculated `route_waypoints`.
- **WebSocket Connection**: `/ws/deliveries/{delivery_id}/tracking?user_id=...&user_role=...` streams real-time updates.
- **Handled Events**:
  - `INITIAL_TRACKING_SNAPSHOT`: Synchronizes state on initial handshake.
  - `RIDER_LOCATION_UPDATED`: Moves rider marker smoothly and updates telemetry (speed, bearing, distance, ETA) without reloading the page.
  - `RIDER_APPROACHING`: Triggers amber approaching banner and highlights the 500m destination proximity zone.
  - `RIDER_ARRIVED`: Triggers green arrival alert and highlights the 50m destination geofence.
  - `RIDER_ROUTE_DEVIATION`: Displays high-visibility warning pill and projects the rider's deviation vector to the nearest waypoint corridor.
  - `DELIVERY_COMPLETED`: Signals delivery completion, gracefully disconnecting the active live tracker.
- **Connection Management & Reconnection**: Exponential backoff reconnection (1s base up to 15s max with jitter) handles intermittent connectivity. Disconnects cleanly on unmount with no orphaned listeners.

### 4. Markers & Route Visualization

- **Pickup & Dropoff**: Styled markers with distinct emerald and violet branding. Dropoff features concentric SVG circles showing 500m (approaching) and 50m (arrival) geofence thresholds.
- **Rider Marker**: Displays real-time GPS coordinates, vehicle type indicator, bearing rotation based on `heading_degrees`, and an animated radar ping when transmitting live telemetry.
- **Route Visualization**: Rendered strictly from the backend's `route_waypoints` polyline. The frontend never recalculates routes or calls external routing APIs.
- **Viewport Management**: Fits bounds containing pickup, dropoff, and rider on initial snapshot only. User panning and zooming are preserved across subsequent live GPS pings.

### 5. API Configuration

- Frontend API base URLs are centralized in `src/lib/api.ts` through `VITE_API_BASE_URL` (defaulting to window origin or `http://localhost:8000`).
- WebSocket URLs automatically translate HTTP/HTTPS protocols to WS/WSS schemes and serialize session query parameters.
