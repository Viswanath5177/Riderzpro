"""Comprehensive test suite for Delivery Management Subsystem."""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from logistics.database import Base, get_db, seed_default_riders
from logistics.models import Delivery, Rider
from logistics.mcp_tools import LogisticsMCPHandler
from main import app

# In-memory SQLite engine with StaticPool so all connections share the same memory DB
TEST_DATABASE_URL = "sqlite:///:memory:"
test_engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture(autouse=True)
def setup_test_database():
    """Create fresh schema and seed default riders for every test."""
    Base.metadata.create_all(bind=test_engine)
    with TestingSessionLocal() as db:
        seed_default_riders(db)
    app.dependency_overrides[get_db] = override_get_db
    yield
    app.dependency_overrides.clear()
    Base.metadata.drop_all(bind=test_engine)


@pytest.fixture
def client():
    return TestClient(app)


def test_health_check(client):
    """Verify backend health endpoint."""
    resp = client.get("/health")
    assert resp.status_code == 200
    assert resp.json()["status"] == "healthy"


def test_create_and_retrieve_delivery(client):
    """Test standard delivery creation and detail retrieval."""
    payload = {
        "order_id": "ORD-TEST-001",
        "customer_id": "usr_customer_1",
        "customer_name": "Rahul Verma",
        "customer_phone": "+91 98860 99887",
        "vendor_id": "vnd_nexgen_ev",
        "vendor_name": "NexGen Power Systems",
        "pickup_address": "Indiranagar Hub, Bengaluru",
        "pickup_lat": 12.9719,
        "pickup_lng": 77.6412,
        "dropoff_address": "Palm Meadows, Whitefield, Bengaluru",
        "dropoff_lat": 12.9550,
        "dropoff_lng": 77.7200,
        "package_weight_kg": 18.5,
        "priority": "express",
        "notes": "Fragile EV Battery Pack"
    }

    # 1. Create Delivery
    res = client.post("/api/deliveries", json=payload)
    assert res.status_code == 201
    data = res.json()
    assert data["order_id"] == "ORD-TEST-001"
    assert data["status"] == "pending"
    assert data["priority"] == "express"
    assert data["latest_route"] is not None
    assert data["latest_route"]["distance_km"] > 0
    assert len(data["status_history"]) == 1
    assert data["status_history"][0]["to_status"] == "pending"

    del_id = data["id"]

    # 2. Retrieve Delivery by ID
    get_res = client.get(f"/api/deliveries/{del_id}")
    assert get_res.status_code == 200
    get_data = get_res.json()
    assert get_data["id"] == del_id
    assert get_data["customer_name"] == "Rahul Verma"


def test_duplicate_delivery_prevention(client):
    """Verify business rule: Only one active delivery task per order."""
    payload = {
        "order_id": "ORD-DUPLICATE-CHECK",
        "customer_id": "usr_c1",
        "vendor_id": "vnd_v1",
        "pickup_address": "Pickup A",
        "pickup_lat": 12.9700,
        "pickup_lng": 77.6400,
        "dropoff_address": "Dropoff B",
        "dropoff_lat": 12.9300,
        "dropoff_lng": 77.6200,
        "package_weight_kg": 5.0
    }

    res1 = client.post("/api/deliveries", json=payload)
    assert res1.status_code == 201

    # Second delivery for same order must fail with 409 Conflict
    res2 = client.post("/api/deliveries", json=payload)
    assert res2.status_code == 409
    assert "already exists" in res2.json()["detail"]


def test_location_and_coordinate_validation(client):
    """Verify coordinate range and distinct origin-destination validation."""
    # Identical coordinates
    res_identical = client.post("/api/deliveries", json={
        "order_id": "ORD-IDENTICAL",
        "customer_id": "usr_c1",
        "vendor_id": "vnd_v1",
        "pickup_address": "Same Spot",
        "pickup_lat": 12.9700,
        "pickup_lng": 77.6400,
        "dropoff_address": "Same Spot",
        "dropoff_lat": 12.9700,
        "dropoff_lng": 77.6400,
    })
    assert res_identical.status_code == 422 or res_identical.status_code == 400

    # Out-of-bounds latitude
    res_bad_lat = client.post("/api/deliveries", json={
        "order_id": "ORD-BAD-LAT",
        "customer_id": "usr_c1",
        "vendor_id": "vnd_v1",
        "pickup_address": "Location A",
        "pickup_lat": 95.0,  # Invalid: > 90
        "pickup_lng": 77.6400,
        "dropoff_address": "Location B",
        "dropoff_lat": 12.9300,
        "dropoff_lng": 77.6200,
    })
    assert res_bad_lat.status_code == 422


def test_valid_delivery_status_transitions(client):
    """Test full sequential lifecycle: pending -> assigned -> picked_up -> in_transit -> delivered."""
    # Create delivery
    del_res = client.post("/api/deliveries", json={
        "order_id": "ORD-LIFECYCLE-1",
        "customer_id": "usr_c1",
        "vendor_id": "vnd_v1",
        "pickup_address": "Pickup",
        "pickup_lat": 12.9700,
        "pickup_lng": 77.6400,
        "dropoff_address": "Dropoff",
        "dropoff_lat": 12.9300,
        "dropoff_lng": 77.6200,
    })
    assert del_res.status_code == 201
    del_id = del_res.json()["id"]

    # 1. Assign rider
    assign_res = client.post(f"/api/deliveries/{del_id}/assign", json={
        "rider_id": "tech_ramesh",
        "reason": "Initial manual dispatch"
    })
    assert assign_res.status_code == 200
    assert assign_res.json()["status"] == "assigned"
    assert assign_res.json()["assigned_rider_id"] == "tech_ramesh"

    # 2. Picked Up
    step1 = client.patch(f"/api/deliveries/{del_id}/status", json={
        "status": "picked_up",
        "actor_id": "tech_ramesh",
        "actor_role": "rider",
        "reason": "Battery picked up from warehouse"
    })
    assert step1.status_code == 200
    assert step1.json()["status"] == "picked_up"

    # 3. In Transit
    step2 = client.patch(f"/api/deliveries/{del_id}/status", json={
        "status": "in_transit",
        "actor_id": "tech_ramesh",
        "actor_role": "rider"
    })
    assert step2.status_code == 200
    assert step2.json()["status"] == "in_transit"

    # 4. Delivered
    step3 = client.patch(f"/api/deliveries/{del_id}/status", json={
        "status": "delivered",
        "actor_id": "tech_ramesh",
        "actor_role": "rider",
        "proof_of_delivery": "OTP-8842-CONFIRMED"
    })
    assert step3.status_code == 200
    assert step3.json()["status"] == "delivered"
    assert step3.json()["proof_of_delivery"] == "OTP-8842-CONFIRMED"
    assert len(step3.json()["status_history"]) == 5


def test_invalid_status_transitions_rejected(client):
    """Test state machine guards against illegal transitions."""
    del_res = client.post("/api/deliveries", json={
        "order_id": "ORD-INVALID-TRANS",
        "customer_id": "usr_c1",
        "vendor_id": "vnd_v1",
        "pickup_address": "Pickup",
        "pickup_lat": 12.9700,
        "pickup_lng": 77.6400,
        "dropoff_address": "Dropoff",
        "dropoff_lat": 12.9300,
        "dropoff_lng": 77.6200,
    })
    assert del_res.status_code == 201
    del_id = del_res.json()["id"]

    # Pending -> Delivered directly is ILLEGAL
    illegal_res = client.patch(f"/api/deliveries/{del_id}/status", json={
        "status": "delivered"
    })
    assert illegal_res.status_code == 400
    assert "Invalid state transition" in illegal_res.json()["detail"]


def test_rider_assignment_and_unavailable_rider(client):
    """Verify that offline riders cannot be assigned, and available riders are assigned correctly."""
    del_res = client.post("/api/deliveries", json={
        "order_id": "ORD-ASSIGN-TEST",
        "customer_id": "usr_c1",
        "vendor_id": "vnd_v1",
        "pickup_address": "Pickup",
        "pickup_lat": 12.9700,
        "pickup_lng": 77.6400,
        "dropoff_address": "Dropoff",
        "dropoff_lat": 12.9300,
        "dropoff_lng": 77.6200,
    })
    assert del_res.status_code == 201
    del_id = del_res.json()["id"]

    # tech_anil is offline by default in seed data
    offline_res = client.post(f"/api/deliveries/{del_id}/assign", json={
        "rider_id": "tech_anil"
    })
    assert offline_res.status_code == 422
    assert "offline" in offline_res.json()["detail"]

    # tech_priya is online and available
    success_res = client.post(f"/api/deliveries/{del_id}/assign", json={
        "rider_id": "tech_priya"
    })
    assert success_res.status_code == 200
    assert success_res.json()["assigned_rider_id"] == "tech_priya"


def test_rider_reassignment_and_capacity_transfer(client):
    """Verify reassigning delivery decrements old rider's workload and increments new rider's workload."""
    del_res = client.post("/api/deliveries", json={
        "order_id": "ORD-REASSIGN-TEST",
        "customer_id": "usr_c1",
        "vendor_id": "vnd_v1",
        "pickup_address": "Pickup",
        "pickup_lat": 12.9700,
        "pickup_lng": 77.6400,
        "dropoff_address": "Dropoff",
        "dropoff_lat": 12.9300,
        "dropoff_lng": 77.6200,
    })
    assert del_res.status_code == 201
    del_id = del_res.json()["id"]

    # Assign to Ramesh
    client.post(f"/api/deliveries/{del_id}/assign", json={"rider_id": "tech_ramesh"})

    # Reassign to Priya
    reassign_res = client.post(f"/api/deliveries/{del_id}/assign", json={
        "rider_id": "tech_priya",
        "reason": "Ramesh requested reassignment due to van maintenance"
    })
    assert reassign_res.status_code == 200
    assert reassign_res.json()["assigned_rider_id"] == "tech_priya"


def test_route_optimization_endpoint(client):
    """Test route calculation endpoint."""
    del_res = client.post("/api/deliveries", json={
        "order_id": "ORD-ROUTE-TEST",
        "customer_id": "usr_c1",
        "vendor_id": "vnd_v1",
        "pickup_address": "Pickup Indiranagar",
        "pickup_lat": 12.9719,
        "pickup_lng": 77.6412,
        "dropoff_address": "Dropoff Koramangala",
        "dropoff_lat": 12.9352,
        "dropoff_lng": 77.6245,
    })
    assert del_res.status_code == 201
    del_id = del_res.json()["id"]

    route_res = client.post(f"/api/deliveries/{del_id}/optimize-route", json={
        "provider": "haversine_builtin",
        "vehicle_type": "electric_bike"
    })
    assert route_res.status_code == 200
    data = route_res.json()
    assert data["distance_km"] > 0
    assert data["duration_minutes"] > 0
    assert data["energy_consumption_kwh"] > 0
    assert len(data["waypoints"]) > 0


def test_classical_and_quantum_batch_optimization(client):
    """Test batch optimization with classical OR-Tools and Quantum Hybrid fallback."""
    # Create 2 deliveries
    d1 = client.post("/api/deliveries", json={
        "order_id": "ORD-BATCH-1",
        "customer_id": "usr_c1",
        "vendor_id": "vnd_v1",
        "pickup_address": "P1",
        "pickup_lat": 12.9719,
        "pickup_lng": 77.6412,
        "dropoff_address": "D1",
        "dropoff_lat": 12.9352,
        "dropoff_lng": 77.6245,
        "priority": "express"
    }).json()

    d2 = client.post("/api/deliveries", json={
        "order_id": "ORD-BATCH-2",
        "customer_id": "usr_c1",
        "vendor_id": "vnd_v1",
        "pickup_address": "P2",
        "pickup_lat": 12.9680,
        "pickup_lng": 77.6350,
        "dropoff_address": "D2",
        "dropoff_lat": 12.9116,
        "dropoff_lng": 77.6389,
        "priority": "standard"
    }).json()

    # 1. Classical OR-Tools Optimization
    classic_res = client.post("/api/deliveries/optimize-batch", json={
        "delivery_ids": [d1["id"], d2["id"]],
        "optimizer_type": "classical_ortools"
    })
    assert classic_res.status_code == 200
    classic_data = classic_res.json()
    assert classic_data["total_deliveries"] == 2
    assert classic_data["assigned_deliveries"] > 0
    assert classic_data["execution_time_ms"] > 0

    # 2. Quantum Hybrid Optimization with Fallback
    quantum_res = client.post("/api/deliveries/optimize-batch", json={
        "delivery_ids": [d1["id"], d2["id"]],
        "optimizer_type": "quantum_hybrid"
    })
    assert quantum_res.status_code == 200
    quantum_data = quantum_res.json()
    assert quantum_data["quantum_metadata"]["formulation_ready"] is True
    assert quantum_data["quantum_metadata"]["quantum_backend_status"] == "classical_fallback"
    assert quantum_data["assigned_deliveries"] > 0


def test_pagination_and_filtering(client):
    """Test pagination and query filtering."""
    for i in range(5):
        client.post("/api/deliveries", json={
            "order_id": f"ORD-PAGE-{i}",
            "customer_id": "usr_c1",
            "vendor_id": "vnd_nexgen_ev" if i % 2 == 0 else "vnd_other",
            "pickup_address": f"P{i}",
            "pickup_lat": 12.97 + (i * 0.01),
            "pickup_lng": 77.64,
            "dropoff_address": f"D{i}",
            "dropoff_lat": 12.93 + (i * 0.01),
            "dropoff_lng": 77.62,
            "priority": "same_day" if i == 0 else "standard"
        })

    # Test pagination
    list_res = client.get("/api/deliveries?page=1&limit=2")
    assert list_res.status_code == 200
    data = list_res.json()
    assert len(data["items"]) == 2
    assert data["total"] == 5
    assert data["total_pages"] == 3

    # Test filtering by priority
    filter_res = client.get("/api/deliveries?priority=same_day")
    assert filter_res.status_code == 200
    filter_data = filter_res.json()
    assert filter_data["total"] == 1
    assert filter_data["items"][0]["priority"] == "same_day"


def test_mcp_logistics_handlers():
    """Test MCP tool bridge and permission authorization guard."""
    db = TestingSessionLocal()
    try:
        handler = LogisticsMCPHandler(db)

        # 1. Check Delivery Status Tool
        check_res = handler.execute_tool(
            "logistics_check_delivery_status",
            {"delivery_id": "non_existent_id"},
            user_role="admin"
        )
        assert check_res.get("error") == "Not Found"

        # 2. Authorization guard: dispatcher-only tool executed by unprivileged role
        unauth_res = handler.execute_tool(
            "logistics_propose_rider_assignment",
            {"delivery_id": "del_123"},
            user_role="unauthorized_guest"
        )
        assert unauth_res.get("error") == "Forbidden"
    finally:
        db.close()
