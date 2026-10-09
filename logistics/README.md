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
