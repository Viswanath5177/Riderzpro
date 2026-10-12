"""Comprehensive test suite for Rider Location Tracking Subsystem."""

import pytest
from datetime import datetime, timedelta
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from logistics.database import Base, get_db, seed_default_riders
from logistics.models import Delivery, Rider, RiderLocation
from logistics.location_service import LocationTrackingService
from logistics.router import location_service
from main import app

# In-memory SQLite engine with StaticPool
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


def helper_create_delivery(client, order_id="ORD-TRACK-001", customer_id="usr_cust_1"):
    """Helper to create a test delivery."""
    payload = {
        "order_id": order_id,
        "customer_id": customer_id,
        "customer_name": "Test Customer",
        "vendor_id": "vnd_nexgen_ev",
        "pickup_address": "Indiranagar Hub, Bengaluru",
        "pickup_lat": 12.9719,
        "pickup_lng": 77.6412,
        "dropoff_address": "Whitefield, Bengaluru",
        "dropoff_lat": 12.9550,
        "dropoff_lng": 77.7200,
        "package_weight_kg": 15.0,
        "priority": "express"
    }
    resp = client.post("/api/deliveries", json=payload)
    assert resp.status_code == 201
    return resp.json()["id"]


def test_create_valid_rider_location(client):
    """1. Test successful ingestion of rider GPS location coordinates."""
    ts = datetime.utcnow().isoformat()
    payload = {
        "latitude": 12.9750,
        "longitude": 77.6000,
        "timestamp": ts,
        "accuracy_meters": 5.0,
        "speed_kmh": 28.5,
        "heading_degrees": 90.0
    }

    res = client.post("/api/riders/tech_ramesh/location", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert data["rider_id"] == "tech_ramesh"
    assert data["latitude"] == 12.9750
    assert data["longitude"] == 77.6000

    # Verify latest rider location matches
    get_res = client.get("/api/riders/tech_ramesh/location")
    assert get_res.status_code == 200
    loc_data = get_res.json()
    assert loc_data["has_location"] is True
    assert loc_data["latitude"] == 12.9750
    assert loc_data["longitude"] == 77.6000
    assert loc_data["speed_kmh"] == 28.5
    assert loc_data["heading_degrees"] == 90.0


def test_reject_invalid_coordinates(client):
    """2 & 3. Reject invalid latitude and longitude out of geographic bounds."""
    # Invalid latitude > 90
    res = client.post("/api/riders/tech_ramesh/location", json={"latitude": 95.0, "longitude": 77.6000})
    assert res.status_code in (400, 422)

    # Invalid latitude < -90
    res = client.post("/api/riders/tech_ramesh/location", json={"latitude": -95.0, "longitude": 77.6000})
    assert res.status_code in (400, 422)

    # Invalid longitude > 180
    res = client.post("/api/riders/tech_ramesh/location", json={"latitude": 12.9750, "longitude": 185.0})
    assert res.status_code in (400, 422)

    # Invalid longitude < -180
    res = client.post("/api/riders/tech_ramesh/location", json={"latitude": 12.9750, "longitude": -185.0})
    assert res.status_code in (400, 422)


def test_reject_unknown_rider(client):
    """4. Reject location update for non-existent rider."""
    res = client.post("/api/riders/unknown_rider_999/location", json={"latitude": 12.9750, "longitude": 77.6000})
    assert res.status_code == 404
    assert "not found" in res.json()["detail"].lower()


def test_reject_unknown_delivery(client):
    """5. Reject location update referencing a non-existent delivery ID."""
    res = client.post("/api/riders/tech_ramesh/location", json={
        "latitude": 12.9750,
        "longitude": 77.6000,
        "delivery_id": "del_non_existent_123"
    })
    assert res.status_code == 404
    assert "delivery with id" in res.json()["detail"].lower()


def test_reject_rider_updating_another_riders_delivery(client):
    """6. Reject location update when rider is not assigned to the specified delivery."""
    del_id = helper_create_delivery(client)

    # Assign to tech_ramesh
    asg_res = client.post(f"/api/deliveries/{del_id}/assign", json={"rider_id": "tech_ramesh"})
    assert asg_res.status_code == 200

    # tech_priya attempts to send location with tech_ramesh's delivery_id
    res = client.post("/api/riders/tech_priya/location", json={
        "latitude": 12.9750,
        "longitude": 77.6000,
        "delivery_id": del_id
    })
    assert res.status_code == 403
    assert "not assigned to delivery" in res.json()["detail"].lower()


def test_store_and_retrieve_location_history(client):
    """7 & 11. Verify historical location records are persisted and retrieved chronologically."""
    base_time = datetime.utcnow() - timedelta(minutes=15)
    points = [
        (12.9710, 77.6000, base_time),
        (12.9720, 77.6010, base_time + timedelta(minutes=5)),
        (12.9730, 77.6020, base_time + timedelta(minutes=10))
    ]

    for lat, lng, ts in points:
        res = client.post("/api/riders/tech_ramesh/location", json={
            "latitude": lat,
            "longitude": lng,
            "timestamp": ts.isoformat()
        })
        assert res.status_code == 200

    # Retrieve history
    hist_res = client.get("/api/riders/tech_ramesh/locations", headers={"X-User-Role": "admin"})
    assert hist_res.status_code == 200
    hist_data = hist_res.json()
    assert hist_data["total"] == 3
    assert len(hist_data["items"]) == 3
    # Check chronological ordering
    assert hist_data["items"][0]["latitude"] == 12.9710
    assert hist_data["items"][1]["latitude"] == 12.9720
    assert hist_data["items"][2]["latitude"] == 12.9730


def test_retrieve_latest_rider_location_never_reported(client):
    """9. When no GPS update has ever been received, return a clear response without fake coordinates."""
    with TestingSessionLocal() as db:
        new_rider = Rider(
            id="tech_fresh",
            name="Fresh New Rider",
            phone="+91 99999 11111",
            current_lat=12.9000,
            current_lng=77.6000,
            last_location_timestamp=None
        )
        db.add(new_rider)
        db.commit()

    res = client.get("/api/riders/tech_fresh/location")
    assert res.status_code == 200
    data = res.json()
    assert data["rider_id"] == "tech_fresh"
    assert data["has_location"] is False
    assert data["latitude"] is None
    assert data["longitude"] is None
    assert "no location update" in data["message"].lower()


def test_delivery_tracking_endpoint(client):
    """10. Retrieve customer delivery tracking info combining rider position, pickup, dropoff, and ETA."""
    del_id = helper_create_delivery(client, order_id="ORD-TRACK-MAP", customer_id="usr_cust_sathesh")

    # 1. Prior to assignment: rider is null
    t0_res = client.get(f"/api/deliveries/{del_id}/tracking")
    assert t0_res.status_code == 200
    t0_data = t0_res.json()
    assert t0_data["delivery_id"] == del_id
    assert t0_data["status"] == "pending"
    assert t0_data["rider"] is None
    assert t0_data["pickup"]["latitude"] == 12.9719
    assert t0_data["dropoff"]["latitude"] == 12.9550

    # 2. Assign rider
    client.post(f"/api/deliveries/{del_id}/assign", json={"rider_id": "tech_ramesh"})

    # 3. Report rider GPS with delivery_id
    client.post("/api/riders/tech_ramesh/location", json={
        "latitude": 12.9650,
        "longitude": 77.6300,
        "delivery_id": del_id,
        "speed_kmh": 30.0,
        "heading_degrees": 120.0
    })

    # 4. Check tracking
    track_res = client.get(f"/api/deliveries/{del_id}/tracking", headers={"X-User-Role": "customer", "X-User-Id": "usr_cust_sathesh"})
    assert track_res.status_code == 200
    data = track_res.json()
    assert data["status"] == "assigned"
    assert data["rider"] is not None
    assert data["rider"]["id"] == "tech_ramesh"
    assert data["rider"]["latitude"] == 12.9650
    assert data["rider"]["longitude"] == 77.6300
    assert data["rider"]["speed_kmh"] == 30.0
    assert data["eta_minutes"] is not None
    assert data["distance_km"] is not None
    assert data["distance_km"] > 0


def test_timestamp_validation_skew_and_ancient(client):
    """12. Timestamp validation rejects future and ancient timestamps."""
    # Future timestamp > 5 minutes
    future_ts = (datetime.utcnow() + timedelta(minutes=15)).isoformat()
    res_future = client.post("/api/riders/tech_ramesh/location", json={
        "latitude": 12.9750,
        "longitude": 77.6000,
        "timestamp": future_ts
    })
    assert res_future.status_code == 400
    assert "in the future" in res_future.json()["detail"].lower()

    # Ancient timestamp > 24 hours
    ancient_ts = (datetime.utcnow() - timedelta(hours=48)).isoformat()
    res_ancient = client.post("/api/riders/tech_ramesh/location", json={
        "latitude": 12.9750,
        "longitude": 77.6000,
        "timestamp": ancient_ts
    })
    assert res_ancient.status_code == 400
    assert "too old" in res_ancient.json()["detail"].lower()


def test_older_location_cannot_overwrite_newer_location(client):
    """13. Out-of-order GPS update preserves history but does not overwrite latest rider coordinates."""
    t_now = datetime.utcnow()
    t_newer = (t_now - timedelta(minutes=5)).isoformat()
    t_older = (t_now - timedelta(minutes=20)).isoformat()

    # 1. Ingest newer location
    res1 = client.post("/api/riders/tech_ramesh/location", json={
        "latitude": 12.9800,
        "longitude": 77.6100,
        "timestamp": t_newer
    })
    assert res1.status_code == 200

    # 2. Ingest out-of-order older location
    res2 = client.post("/api/riders/tech_ramesh/location", json={
        "latitude": 12.9500,
        "longitude": 77.5500,
        "timestamp": t_older
    })
    assert res2.status_code == 200

    # 3. Verify latest position remained 12.9800 / 77.6100 (from newer timestamp)
    latest_res = client.get("/api/riders/tech_ramesh/location")
    latest_data = latest_res.json()
    assert latest_data["latitude"] == 12.9800
    assert latest_data["longitude"] == 77.6100

    # 4. Verify BOTH exist in location history
    hist_res = client.get("/api/riders/tech_ramesh/locations", headers={"X-User-Role": "admin"})
    assert hist_res.json()["total"] == 2


def test_unauthorized_rider_updating_another_rider(client):
    """14. A rider cannot send location updates for another rider."""
    res = client.post(
        "/api/riders/tech_ramesh/location",
        json={"latitude": 12.9750, "longitude": 77.6000},
        headers={"X-User-Role": "rider", "X-User-Id": "tech_priya"}
    )
    assert res.status_code == 403
    assert "only permitted to update their own location" in res.json()["detail"].lower()


def test_unauthorized_customer_cannot_track_other_delivery(client):
    """14. Customer A cannot track delivery belonging to Customer B."""
    del_id = helper_create_delivery(client, order_id="ORD-AUTH-CHECK", customer_id="usr_cust_alice")

    # Alice tracks: allowed
    res_alice = client.get(f"/api/deliveries/{del_id}/tracking", headers={"X-User-Role": "customer", "X-User-Id": "usr_cust_alice"})
    assert res_alice.status_code == 200

    # Bob tracks: rejected 403
    res_bob = client.get(f"/api/deliveries/{del_id}/tracking", headers={"X-User-Role": "customer", "X-User-Id": "usr_cust_bob"})
    assert res_bob.status_code == 403


def test_unauthorized_location_history_access(client):
    """14. Unprivileged roles cannot inspect raw location history of a rider."""
    res = client.get(
        "/api/riders/tech_ramesh/locations",
        headers={"X-User-Role": "customer", "X-User-Id": "usr_unauthorized"}
    )
    assert res.status_code == 403


def test_delivered_and_cancelled_delivery_rejection(client):
    """15. Reject location updates associated with terminal/inactive delivery states."""
    del_id = helper_create_delivery(client, order_id="ORD-TERM-001")
    client.post(f"/api/deliveries/{del_id}/assign", json={"rider_id": "tech_ramesh"})

    # Move to delivered
    client.patch(f"/api/deliveries/{del_id}/status", json={"status": "picked_up"})
    client.patch(f"/api/deliveries/{del_id}/status", json={"status": "in_transit"})
    client.patch(f"/api/deliveries/{del_id}/status", json={"status": "delivered", "proof_of_delivery": "OTP-1234"})

    # Attempt to associate location with delivered task
    res = client.post("/api/riders/tech_ramesh/location", json={
        "latitude": 12.9750,
        "longitude": 77.6000,
        "delivery_id": del_id
    })
    assert res.status_code == 400
    assert "active tracking is only permitted for deliveries in" in res.json()["detail"].lower()


def test_location_history_pagination_and_filtering(client):
    """16. Test pagination and delivery_id filtering on location history."""
    del1 = helper_create_delivery(client, order_id="ORD-PAG-1")
    del2 = helper_create_delivery(client, order_id="ORD-PAG-2")

    client.post(f"/api/deliveries/{del1}/assign", json={"rider_id": "tech_ramesh"})
    client.post(f"/api/deliveries/{del2}/assign", json={"rider_id": "tech_ramesh"})

    base = datetime.utcnow() - timedelta(minutes=30)
    # 3 points for del1
    for i in range(3):
        client.post("/api/riders/tech_ramesh/location", json={
            "latitude": 12.9700 + (i * 0.001),
            "longitude": 77.6000,
            "delivery_id": del1,
            "timestamp": (base + timedelta(minutes=i)).isoformat()
        })

    # 2 points for del2
    for i in range(2):
        client.post("/api/riders/tech_ramesh/location", json={
            "latitude": 12.9800 + (i * 0.001),
            "longitude": 77.6000,
            "delivery_id": del2,
            "timestamp": (base + timedelta(minutes=10 + i)).isoformat()
        })

    # Filter by delivery_id=del1
    res_del1 = client.get(f"/api/riders/tech_ramesh/locations?delivery_id={del1}", headers={"X-User-Role": "admin"})
    assert res_del1.status_code == 200
    assert res_del1.json()["total"] == 3

    # Test pagination: limit=2, page=1
    res_page1 = client.get(f"/api/riders/tech_ramesh/locations?delivery_id={del1}&limit=2&page=1", headers={"X-User-Role": "admin"})
    assert len(res_page1.json()["items"]) == 2
    assert res_page1.json()["total_pages"] == 2

    # Test pagination: limit=2, page=2
    res_page2 = client.get(f"/api/riders/tech_ramesh/locations?delivery_id={del1}&limit=2&page=2", headers={"X-User-Role": "admin"})
    assert len(res_page2.json()["items"]) == 1


def test_realtime_event_publishing(client):
    """17. Test that LocationTrackingService fires registered event callbacks on location update."""
    events_captured = []

    def mock_subscriber(event_name, payload):
        events_captured.append((event_name, payload))

    location_service.subscribe_to_events(mock_subscriber)

    client.post("/api/riders/tech_ramesh/location", json={
        "latitude": 12.9750,
        "longitude": 77.6000,
        "speed_kmh": 32.0,
        "heading_degrees": 180.0
    })

    assert len(events_captured) >= 1
    ev_name, ev_payload = events_captured[-1]
    assert ev_name == "RIDER_LOCATION_UPDATED"
    assert ev_payload["rider_id"] == "tech_ramesh"
    assert ev_payload["latitude"] == 12.9750
    assert ev_payload["speed_kmh"] == 32.0
