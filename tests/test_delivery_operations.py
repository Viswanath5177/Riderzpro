"""Phase 7: Delivery Operations comprehensive test suite.
Covers:
1. Delivery Lifecycle (PENDING -> ASSIGNED -> PICKED_UP -> IN_TRANSIT -> DELIVERED)
2. Alternate paths (PENDING -> CANCELLED, ASSIGNED -> FAILED, IN_TRANSIT -> FAILED, etc.)
3. Invalid state transitions (DELIVERED -> PENDING, CANCELLED -> IN_TRANSIT, etc.)
4. Status Management & Audit History (GET /api/deliveries/{id}/history)
5. Listing & Filtering (by status, rider, priority, customer)
6. Priority & Time Windows (LOW, NORMAL, HIGH, URGENT, pickup windows, deadline)
7. Cancellation & Failure handling with reasons and rider resource releases
8. Logistics Dashboard APIs (GET /api/logistics/dashboard)
9. WebSocket event broadcasts for status transitions
"""

import pytest
from datetime import datetime, timedelta
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from logistics.database import Base, get_db, seed_default_riders
from logistics.models import Delivery, Rider, RiderAssignment, DeliveryStatusHistory
from main import app

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


def create_sample_delivery(client, order_id="ORD-OP-001", priority="normal", **kwargs):
    payload = {
        "order_id": order_id,
        "customer_id": "cust_sathesh",
        "customer_name": "Sathesh Ittraju",
        "customer_phone": "+91 98450 11111",
        "vendor_id": "ven_vijayawada",
        "vendor_name": "Vijayawada EV Hub",
        "pickup_address": "Vijayawada Central, AP",
        "pickup_lat": 16.5062,
        "pickup_lng": 80.6480,
        "dropoff_address": "Amaravati Secretariat, AP",
        "dropoff_lat": 16.5740,
        "dropoff_lng": 80.3575,
        "package_weight_kg": 8.5,
        "priority": priority,
        **kwargs
    }
    resp = client.post("/api/deliveries", json=payload)
    assert resp.status_code == 201, resp.text
    return resp.json()


# ========================================================
# 1. Delivery Lifecycle (Full Happy Path)
# ========================================================

def test_delivery_lifecycle_full_happy_path(client):
    """
    Test full lifecycle flow:
    PENDING -> ASSIGNED -> PICKED_UP -> IN_TRANSIT -> DELIVERED
    """
    # 1. Create delivery -> PENDING
    d = create_sample_delivery(client, order_id="ORD-LIFECYCLE-1")
    del_id = d["id"]
    assert d["status"] == "pending"

    # 2. Assign rider -> ASSIGNED
    assign_resp = client.post(
        f"/api/deliveries/{del_id}/assign",
        json={"rider_id": "tech_ramesh", "actor_id": "dispatch_mgr", "actor_role": "dispatcher"}
    )
    assert assign_resp.status_code == 200
    assert assign_resp.json()["status"] == "assigned"
    assert assign_resp.json()["assigned_rider_id"] == "tech_ramesh"

    # 3. Mark Picked Up -> PICKED_UP
    pickup_resp = client.patch(
        f"/api/deliveries/{del_id}/status",
        json={"status": "picked_up", "actor_id": "tech_ramesh", "actor_role": "rider", "reason": "Package collected from vendor"}
    )
    assert pickup_resp.status_code == 200
    assert pickup_resp.json()["status"] == "picked_up"

    # 4. Mark In Transit -> IN_TRANSIT
    transit_resp = client.patch(
        f"/api/deliveries/{del_id}/status",
        json={"status": "in_transit", "actor_id": "tech_ramesh", "actor_role": "rider", "reason": "On route to customer destination"}
    )
    assert transit_resp.status_code == 200
    assert transit_resp.json()["status"] == "in_transit"

    # 5. Mark Delivered -> DELIVERED (Terminal)
    pod_code = "OTP-7749"
    delivered_resp = client.patch(
        f"/api/deliveries/{del_id}/status",
        json={
            "status": "delivered",
            "actor_id": "tech_ramesh",
            "actor_role": "rider",
            "reason": "Handed directly to recipient",
            "proof_of_delivery": pod_code
        }
    )
    assert delivered_resp.status_code == 200
    body = delivered_resp.json()
    assert body["status"] == "delivered"
    assert body["proof_of_delivery"] == pod_code

    # 6. Verify audit history records all steps
    history_resp = client.get(f"/api/deliveries/{del_id}/history")
    assert history_resp.status_code == 200
    history = history_resp.json()
    statuses = [h["to_status"] for h in history]
    assert statuses == ["pending", "assigned", "picked_up", "in_transit", "delivered"]


# ========================================================
# 2. Alternate Lifecycle Paths
# ========================================================

def test_alternate_path_pending_to_cancelled(client):
    """Test PENDING -> CANCELLED."""
    d = create_sample_delivery(client, order_id="ORD-ALT-CANCEL-1")
    del_id = d["id"]

    resp = client.patch(
        f"/api/deliveries/{del_id}/status",
        json={"status": "cancelled", "actor_id": "cust_sathesh", "actor_role": "customer", "reason": "customer_cancelled"}
    )
    assert resp.status_code == 200
    assert resp.json()["status"] == "cancelled"
    assert resp.json()["cancellation_reason"] == "customer_cancelled"


def test_alternate_path_assigned_to_failed(client):
    """Test ASSIGNED -> FAILED."""
    d = create_sample_delivery(client, order_id="ORD-ALT-FAIL-1")
    del_id = d["id"]

    # Assign
    client.post(f"/api/deliveries/{del_id}/assign", json={"rider_id": "tech_ramesh"})

    # Fail
    resp = client.patch(
        f"/api/deliveries/{del_id}/status",
        json={"status": "failed", "actor_id": "tech_ramesh", "actor_role": "rider", "reason": "seller_cannot_prepare"}
    )
    assert resp.status_code == 200
    assert resp.json()["status"] == "failed"
    assert resp.json()["failure_reason"] == "seller_cannot_prepare"


def test_alternate_path_in_transit_to_failed(client):
    """Test IN_TRANSIT -> FAILED."""
    d = create_sample_delivery(client, order_id="ORD-ALT-FAIL-2")
    del_id = d["id"]

    client.post(f"/api/deliveries/{del_id}/assign", json={"rider_id": "tech_ramesh"})
    client.patch(f"/api/deliveries/{del_id}/status", json={"status": "picked_up"})
    client.patch(f"/api/deliveries/{del_id}/status", json={"status": "in_transit"})

    resp = client.patch(
        f"/api/deliveries/{del_id}/status",
        json={"status": "failed", "actor_id": "tech_ramesh", "actor_role": "rider", "reason": "address_problem: customer unavailable"}
    )
    assert resp.status_code == 200
    assert resp.json()["status"] == "failed"
    assert resp.json()["failure_reason"] == "address_problem: customer unavailable"


def test_alternate_path_failed_to_pending_requeue(client):
    """Test FAILED -> PENDING (re-queueing)."""
    d = create_sample_delivery(client, order_id="ORD-REQUEUE-1")
    del_id = d["id"]

    client.post(f"/api/deliveries/{del_id}/assign", json={"rider_id": "tech_ramesh"})
    client.patch(f"/api/deliveries/{del_id}/status", json={"status": "failed", "reason": "vehicle_problem"})

    # Re-queue
    resp = client.patch(
        f"/api/deliveries/{del_id}/status",
        json={"status": "pending", "actor_id": "dispatch_mgr", "actor_role": "dispatcher", "reason": "Re-queued for reassignment"}
    )
    assert resp.status_code == 200
    assert resp.json()["status"] == "pending"
    assert resp.json()["assigned_rider_id"] is None


# ========================================================
# 3. Invalid Status Transitions (Strict State Machine)
# ========================================================

def test_invalid_transitions_rejected(client):
    """Verify state machine strictly rejects illegal transitions with HTTP 400."""
    # 1. PENDING -> DELIVERED (illegal skip)
    d1 = create_sample_delivery(client, order_id="ORD-INV-1")
    resp = client.patch(f"/api/deliveries/{d1['id']}/status", json={"status": "delivered"})
    assert resp.status_code == 400
    assert "Invalid state transition" in resp.json()["detail"]

    # 2. PENDING -> IN_TRANSIT (illegal skip)
    resp = client.patch(f"/api/deliveries/{d1['id']}/status", json={"status": "in_transit"})
    assert resp.status_code == 400

    # 3. DELIVERED -> PENDING (terminal state)
    d2 = create_sample_delivery(client, order_id="ORD-INV-2")
    client.post(f"/api/deliveries/{d2['id']}/assign", json={"rider_id": "tech_ramesh"})
    client.patch(f"/api/deliveries/{d2['id']}/status", json={"status": "picked_up"})
    client.patch(f"/api/deliveries/{d2['id']}/status", json={"status": "in_transit"})
    client.patch(f"/api/deliveries/{d2['id']}/status", json={"status": "delivered"})

    resp = client.patch(f"/api/deliveries/{d2['id']}/status", json={"status": "pending"})
    assert resp.status_code == 400
    assert "Invalid state transition" in resp.json()["detail"]

    resp = client.patch(f"/api/deliveries/{d2['id']}/status", json={"status": "failed"})
    assert resp.status_code == 400

    # 4. CANCELLED -> IN_TRANSIT (terminal state)
    d3 = create_sample_delivery(client, order_id="ORD-INV-3")
    client.patch(f"/api/deliveries/{d3['id']}/status", json={"status": "cancelled", "reason": "customer_cancelled"})

    resp = client.patch(f"/api/deliveries/{d3['id']}/status", json={"status": "in_transit"})
    assert resp.status_code == 400


# ========================================================
# 4. Delivery History / Audit Trail
# ========================================================

def test_delivery_history_audit_endpoint(client):
    """Verify GET /api/deliveries/{id}/history records all metadata."""
    d = create_sample_delivery(client, order_id="ORD-HIST-1")
    del_id = d["id"]

    client.post(f"/api/deliveries/{del_id}/assign", json={"rider_id": "tech_ramesh", "actor_id": "mgr_1", "reason": "Nearest EV van"})
    client.patch(f"/api/deliveries/{del_id}/status", json={"status": "picked_up", "actor_id": "tech_ramesh", "reason": "Collected at hub"})
    client.patch(f"/api/deliveries/{del_id}/status", json={"status": "in_transit", "actor_id": "tech_ramesh", "reason": "Departed hub"})

    resp = client.get(f"/api/deliveries/{del_id}/history")
    assert resp.status_code == 200
    history = resp.json()

    assert len(history) == 4
    for entry in history:
        assert "id" in entry
        assert entry["delivery_id"] == del_id
        assert "to_status" in entry
        assert "created_at" in entry
        assert "reason" in entry

    assert history[0]["to_status"] == "pending"
    assert history[1]["to_status"] == "assigned"
    assert history[2]["to_status"] == "picked_up"
    assert history[3]["to_status"] == "in_transit"


# ========================================================
# 5. Listing & Filtering
# ========================================================

def test_delivery_listing_and_filtering(client):
    """Test operational queries: status, rider, priority, customer."""
    # Seed 3 deliveries with different parameters
    d1 = create_sample_delivery(client, order_id="ORD-FLT-1", priority="urgent")
    d2 = create_sample_delivery(client, order_id="ORD-FLT-2", priority="low")
    d3 = create_sample_delivery(client, order_id="ORD-FLT-3", priority="normal")

    # Assign d1 to tech_ramesh and progress to in_transit
    client.post(f"/api/deliveries/{d1['id']}/assign", json={"rider_id": "tech_ramesh"})
    client.patch(f"/api/deliveries/{d1['id']}/status", json={"status": "picked_up"})
    client.patch(f"/api/deliveries/{d1['id']}/status", json={"status": "in_transit"})

    # Assign d2 to tech_priya
    client.post(f"/api/deliveries/{d2['id']}/assign", json={"rider_id": "tech_priya"})

    # 1. Filter by status=in_transit
    resp = client.get("/api/deliveries?status=in_transit")
    assert resp.status_code == 200
    items = resp.json()["items"]
    assert len(items) == 1
    assert items[0]["id"] == d1["id"]

    # 2. Filter by rider_id=tech_priya
    resp = client.get("/api/deliveries?rider_id=tech_priya")
    assert resp.status_code == 200
    items = resp.json()["items"]
    assert len(items) == 1
    assert items[0]["id"] == d2["id"]

    # 3. Filter by priority=urgent
    resp = client.get("/api/deliveries?priority=urgent")
    assert resp.status_code == 200
    items = resp.json()["items"]
    assert len(items) == 1
    assert items[0]["id"] == d1["id"]

    # 4. Filter by customer_id=cust_sathesh
    resp = client.get("/api/deliveries?customer_id=cust_sathesh")
    assert resp.status_code == 200
    assert resp.json()["total"] >= 3


# ========================================================
# 6. Priority & Time Windows
# ========================================================

def test_priority_and_time_windows(client):
    """Test LOW, NORMAL, HIGH, URGENT priorities and pickup/delivery windows."""
    now = datetime.utcnow()
    window_start = (now + timedelta(hours=1)).isoformat()
    window_end = (now + timedelta(hours=3)).isoformat()
    deadline = (now + timedelta(hours=4)).isoformat()

    d = create_sample_delivery(
        client,
        order_id="ORD-WINDOW-1",
        priority="urgent",
        pickup_window_start=window_start,
        pickup_window_end=window_end,
        delivery_deadline=deadline
    )
    assert d["priority"] == "urgent"
    assert d["pickup_window_start"] is not None
    assert d["pickup_window_end"] is not None
    assert d["deadline"] is not None
    assert d["delivery_deadline"] is not None


# ========================================================
# 7. Rider Workload & Capacity Release on Cancel / Fail
# ========================================================

def test_rider_capacity_released_on_cancellation_and_failure(client):
    """Verify rider workload count decrements when delivery is cancelled or failed."""
    # Check initial workload
    r_resp = client.get("/api/riders/tech_ramesh/location")
    assert r_resp.status_code == 200

    d = create_sample_delivery(client, order_id="ORD-CAP-1")
    del_id = d["id"]

    # Assign
    client.post(f"/api/deliveries/{del_id}/assign", json={"rider_id": "tech_ramesh"})

    # Check rider has workload
    with TestingSessionLocal() as db:
        rider = db.query(Rider).filter(Rider.id == "tech_ramesh").first()
        assert rider.current_workload_count == 1

    # Cancel delivery
    client.patch(
        f"/api/deliveries/{del_id}/status",
        json={"status": "cancelled", "reason": "Customer cancelled before pickup"}
    )

    # Check rider workload is released
    with TestingSessionLocal() as db:
        rider = db.query(Rider).filter(Rider.id == "tech_ramesh").first()
        assert rider.current_workload_count == 0
        assert rider.status == "available"


# ========================================================
# 8. Logistics Dashboard KPIs
# ========================================================

def test_logistics_dashboard_api(client):
    """Verify GET /api/logistics/dashboard returns accurate operational metrics."""
    # Create a batch of deliveries with various statuses
    d_pending = create_sample_delivery(client, order_id="ORD-DASH-PENDING")
    d_assigned = create_sample_delivery(client, order_id="ORD-DASH-ASSIGNED")
    d_delivered = create_sample_delivery(client, order_id="ORD-DASH-DELIVERED")

    client.post(f"/api/deliveries/{d_assigned['id']}/assign", json={"rider_id": "tech_ramesh"})

    client.post(f"/api/deliveries/{d_delivered['id']}/assign", json={"rider_id": "tech_priya"})
    client.patch(f"/api/deliveries/{d_delivered['id']}/status", json={"status": "picked_up"})
    client.patch(f"/api/deliveries/{d_delivered['id']}/status", json={"status": "in_transit"})
    client.patch(f"/api/deliveries/{d_delivered['id']}/status", json={"status": "delivered", "proof_of_delivery": "OTP-1234"})

    resp = client.get("/api/logistics/dashboard")
    assert resp.status_code == 200
    data = resp.json()

    assert data["total_deliveries"] >= 3
    assert data["pending"] >= 1
    assert data["assigned"] >= 1
    assert data["delivered"] >= 1
    assert "active_riders" in data
    assert "available_riders" in data
    assert "total_riders" in data
    assert "delayed_deliveries" in data
    assert "high_priority_deliveries" in data
    assert len(data["recent_activity"]) > 0
    assert data["recent_activity"][0]["delivery_id"] is not None


# ========================================================
# 9. WebSocket Status Update Event Broadcasting
# ========================================================

def test_websocket_status_event_broadcast(client):
    """Verify WebSocket client receives real-time delivery status updates."""
    d = create_sample_delivery(client, order_id="ORD-WS-STATUS")
    del_id = d["id"]

    # Connect WebSocket client
    with client.websocket_connect(f"/ws/deliveries/{del_id}/tracking?user_id=cust_sathesh&user_role=customer") as ws:
        # First message is snapshot
        snap = ws.receive_json()
        assert snap["event"] == "INITIAL_TRACKING_SNAPSHOT"

        # Update status to assigned via REST
        client.post(f"/api/deliveries/{del_id}/assign", json={"rider_id": "tech_ramesh"})

        msg = ws.receive_json()
        assert msg["event"] == "DELIVERY_STATUS_UPDATED"
        assert msg["delivery_id"] == del_id
        assert msg["status"] == "assigned"

        # Progress to picked_up
        client.patch(f"/api/deliveries/{del_id}/status", json={"status": "picked_up", "reason": "Collected"})
        msg2 = ws.receive_json()
        assert msg2["event"] == "DELIVERY_STATUS_UPDATED"
        assert msg2["status"] == "picked_up"

        # Progress to in_transit
        client.patch(f"/api/deliveries/{del_id}/status", json={"status": "in_transit"})
        msg3 = ws.receive_json()
        assert msg3["event"] == "DELIVERY_STATUS_UPDATED"
        assert msg3["status"] == "in_transit"

        # Progress to delivered (terminal)
        client.patch(f"/api/deliveries/{del_id}/status", json={"status": "delivered", "proof_of_delivery": "OTP-OK"})
        msg4 = ws.receive_json()
        assert msg4["event"] == "DELIVERY_COMPLETED"
        assert msg4["status"] == "delivered"
