"""Phase 4.1 -- Geofence Service test suite.

Tests the GeofenceService in isolation and its integration with the
LocationTrackingService, WebSocket broadcast, and the delivery tracking
REST endpoint.

Reference coordinates (validated against haversine_distance):
  DROPOFF:     lat=12.9550, lng=77.7200  (Whitefield, Bengaluru)
  FAR:         lat=12.9550, lng=77.6300  (~7600m away -- well outside 500m zone)
  APPROACHING: lat=12.9550, lng=77.7162  (~420m away -- inside 500m, outside 50m)
  ARRIVED:     lat=12.9550, lng=77.7197  (~30m away  -- inside 50m arrival zone)
"""

import pytest
from datetime import datetime
from unittest.mock import MagicMock
from fastapi.testclient import TestClient
from starlette.websockets import WebSocketDisconnect
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from logistics.database import Base, get_db, seed_default_riders
from logistics.models import Rider
from logistics.geofence import (
    GeofenceService,
    GeofenceMilestoneState,
    DEFAULT_APPROACHING_DISTANCE_METERS,
    DEFAULT_ARRIVAL_DISTANCE_METERS,
    ACTIVE_GEOFENCE_STATUSES,
    geofence_service as singleton_geofence_service,
)
from logistics.route_planning import haversine_distance
from main import app

TEST_DATABASE_URL = "sqlite:///:memory:"
test_engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

DROPOFF_LAT = 12.9550
DROPOFF_LNG = 77.7200

# Coordinate fixtures (validated against haversine_distance)
FAR_LAT, FAR_LNG = 12.9550, 77.6300
APPROACHING_LAT, APPROACHING_LNG = 12.9550, 77.7162
ARRIVED_LAT, ARRIVED_LNG = 12.9550, 77.7197


def _make_delivery(status="assigned", dropoff_lat=DROPOFF_LAT, dropoff_lng=DROPOFF_LNG):
    """Return a minimal mock Delivery object for unit tests."""
    d = MagicMock()
    d.id = "del_test_geofence_001"
    d.order_id = "ORD-GF-001"
    d.status = status
    d.dropoff_lat = dropoff_lat
    d.dropoff_lng = dropoff_lng
    return d


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture(autouse=True)
def setup_test_database():
    """Fresh schema + seeded riders for each test. Resets geofence singleton state."""
    Base.metadata.create_all(bind=test_engine)
    with TestingSessionLocal() as db:
        seed_default_riders(db)
    app.dependency_overrides[get_db] = override_get_db
    singleton_geofence_service.reset_all()
    yield
    app.dependency_overrides.clear()
    Base.metadata.drop_all(bind=test_engine)
    singleton_geofence_service.reset_all()


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def svc() -> GeofenceService:
    """Fresh GeofenceService instance per test (not the shared singleton)."""
    return GeofenceService()


# ---------------------------------------------------------------------------
# Constants and configuration
# ---------------------------------------------------------------------------

def test_default_approaching_threshold():
    assert DEFAULT_APPROACHING_DISTANCE_METERS == 500.0


def test_default_arrival_threshold():
    assert DEFAULT_ARRIVAL_DISTANCE_METERS == 50.0


def test_service_uses_defaults_when_not_overridden(svc):
    assert svc.approaching_threshold_meters == DEFAULT_APPROACHING_DISTANCE_METERS
    assert svc.arrival_threshold_meters == DEFAULT_ARRIVAL_DISTANCE_METERS


def test_service_accepts_custom_thresholds():
    custom = GeofenceService(approaching_threshold_meters=300.0, arrival_threshold_meters=25.0)
    assert custom.approaching_threshold_meters == 300.0
    assert custom.arrival_threshold_meters == 25.0


def test_active_statuses_include_all_expected():
    assert "assigned" in ACTIVE_GEOFENCE_STATUSES
    assert "picked_up" in ACTIVE_GEOFENCE_STATUSES
    assert "in_transit" in ACTIVE_GEOFENCE_STATUSES


def test_terminal_statuses_excluded_from_active():
    assert "delivered" not in ACTIVE_GEOFENCE_STATUSES
    assert "cancelled" not in ACTIVE_GEOFENCE_STATUSES
    assert "failed" not in ACTIVE_GEOFENCE_STATUSES


# ---------------------------------------------------------------------------
# GeofenceMilestoneState unit tests
# ---------------------------------------------------------------------------

def test_milestone_state_initially_empty():
    state = GeofenceMilestoneState()
    assert not state.has_emitted("del_001", "RIDER_APPROACHING")
    assert not state.has_emitted("del_001", "RIDER_ARRIVED")


def test_milestone_state_mark_and_check():
    state = GeofenceMilestoneState()
    state.mark_emitted("del_001", "RIDER_APPROACHING")
    assert state.has_emitted("del_001", "RIDER_APPROACHING")
    assert not state.has_emitted("del_001", "RIDER_ARRIVED")


def test_milestone_state_no_cross_delivery_leak():
    state = GeofenceMilestoneState()
    state.mark_emitted("del_001", "RIDER_APPROACHING")
    assert not state.has_emitted("del_002", "RIDER_APPROACHING")


def test_milestone_state_reset_specific():
    state = GeofenceMilestoneState()
    state.mark_emitted("del_001", "RIDER_APPROACHING")
    state.mark_emitted("del_002", "RIDER_ARRIVED")
    state.reset("del_001")
    assert not state.has_emitted("del_001", "RIDER_APPROACHING")
    assert state.has_emitted("del_002", "RIDER_ARRIVED")


def test_milestone_state_reset_all():
    state = GeofenceMilestoneState()
    state.mark_emitted("del_001", "RIDER_APPROACHING")
    state.mark_emitted("del_002", "RIDER_ARRIVED")
    state.reset()
    assert not state.has_emitted("del_001", "RIDER_APPROACHING")
    assert not state.has_emitted("del_002", "RIDER_ARRIVED")


# ---------------------------------------------------------------------------
# Distance calculation
# ---------------------------------------------------------------------------

def test_calculate_distance_at_same_point(svc):
    delivery = _make_delivery()
    dist = svc.calculate_distance_to_dropoff(delivery, DROPOFF_LAT, DROPOFF_LNG)
    assert dist < 1.0


def test_far_rider_large_distance(svc):
    delivery = _make_delivery()
    dist = svc.calculate_distance_to_dropoff(delivery, FAR_LAT, FAR_LNG)
    assert dist > 5000.0


def test_approaching_coords_within_approaching_threshold(svc):
    delivery = _make_delivery()
    dist = svc.calculate_distance_to_dropoff(delivery, APPROACHING_LAT, APPROACHING_LNG)
    assert dist <= DEFAULT_APPROACHING_DISTANCE_METERS
    assert dist > DEFAULT_ARRIVAL_DISTANCE_METERS


def test_arrived_coords_within_arrival_threshold(svc):
    delivery = _make_delivery()
    dist = svc.calculate_distance_to_dropoff(delivery, ARRIVED_LAT, ARRIVED_LNG)
    assert dist <= DEFAULT_ARRIVAL_DISTANCE_METERS


# ---------------------------------------------------------------------------
# Test 1: Rider >500m away -- no approaching event
# ---------------------------------------------------------------------------

def test_1_far_rider_no_events(svc):
    delivery = _make_delivery(status="in_transit")
    dist = svc.calculate_distance_to_dropoff(delivery, FAR_LAT, FAR_LNG)
    assert dist > DEFAULT_APPROACHING_DISTANCE_METERS, f"Pre-condition: dist={dist}"
    events = svc.evaluate_geofence(delivery, "rider_1", FAR_LAT, FAR_LNG)
    assert events == []


def test_1_far_rider_no_events_repeated(svc):
    delivery = _make_delivery(status="in_transit")
    for _ in range(5):
        events = svc.evaluate_geofence(delivery, "rider_1", FAR_LAT, FAR_LNG)
        assert events == []


# ---------------------------------------------------------------------------
# Test 2: Rider enters <=500m -- RIDER_APPROACHING emitted
# ---------------------------------------------------------------------------

def test_2_approaching_event_emitted(svc):
    delivery = _make_delivery(status="in_transit")
    events = svc.evaluate_geofence(delivery, "rider_1", APPROACHING_LAT, APPROACHING_LNG)
    assert len(events) == 1
    ev = events[0]
    assert ev["event"] == "RIDER_APPROACHING"
    assert ev["delivery_id"] == delivery.id
    assert ev["rider_id"] == "rider_1"
    assert ev["threshold_meters"] == DEFAULT_APPROACHING_DISTANCE_METERS
    assert ev["distance_to_dropoff_meters"] <= DEFAULT_APPROACHING_DISTANCE_METERS
    assert "timestamp" in ev
    assert "order_id" in ev


def test_2_approaching_event_for_all_active_statuses():
    for status in ACTIVE_GEOFENCE_STATUSES:
        fresh = GeofenceService()
        delivery = _make_delivery(status=status)
        events = fresh.evaluate_geofence(delivery, "rider_1", APPROACHING_LAT, APPROACHING_LNG)
        names = [ev["event"] for ev in events]
        assert "RIDER_APPROACHING" in names, f"Missing RIDER_APPROACHING for status '{status}'"


# ---------------------------------------------------------------------------
# Test 3: Repeated GPS updates inside 500m -- approaching emitted only once
# ---------------------------------------------------------------------------

def test_3_approaching_emitted_only_once(svc):
    delivery = _make_delivery(status="in_transit")
    first = svc.evaluate_geofence(delivery, "rider_1", APPROACHING_LAT, APPROACHING_LNG)
    assert any(ev["event"] == "RIDER_APPROACHING" for ev in first)

    for _ in range(10):
        repeat = svc.evaluate_geofence(delivery, "rider_1", APPROACHING_LAT, APPROACHING_LNG)
        assert not any(ev["event"] == "RIDER_APPROACHING" for ev in repeat),             "RIDER_APPROACHING must not repeat on subsequent GPS updates in zone"


# ---------------------------------------------------------------------------
# Test 4: Rider enters <=50m -- RIDER_ARRIVED emitted
# ---------------------------------------------------------------------------

def test_4_arrived_event_emitted(svc):
    delivery = _make_delivery(status="in_transit")
    events = svc.evaluate_geofence(delivery, "rider_1", ARRIVED_LAT, ARRIVED_LNG)
    arrived = [ev for ev in events if ev["event"] == "RIDER_ARRIVED"]
    assert len(arrived) == 1
    ev = arrived[0]
    assert ev["threshold_meters"] == DEFAULT_ARRIVAL_DISTANCE_METERS
    assert ev["distance_to_dropoff_meters"] <= DEFAULT_ARRIVAL_DISTANCE_METERS


def test_4_arrival_does_not_change_delivery_status(svc):
    """RIDER_ARRIVED MUST NOT auto-complete the delivery."""
    delivery = _make_delivery(status="in_transit")
    svc.evaluate_geofence(delivery, "rider_1", ARRIVED_LAT, ARRIVED_LNG)
    assert delivery.status == "in_transit"


def test_4_arrival_also_emits_approaching(svc):
    """Entering 50m zone without prior approaching flag triggers both milestones."""
    delivery = _make_delivery(status="in_transit")
    events = svc.evaluate_geofence(delivery, "rider_1", ARRIVED_LAT, ARRIVED_LNG)
    names = [ev["event"] for ev in events]
    assert "RIDER_APPROACHING" in names
    assert "RIDER_ARRIVED" in names


# ---------------------------------------------------------------------------
# Test 5: Repeated GPS updates inside 50m -- arrived emitted only once
# ---------------------------------------------------------------------------

def test_5_arrived_emitted_only_once(svc):
    delivery = _make_delivery(status="in_transit")
    first = svc.evaluate_geofence(delivery, "rider_1", ARRIVED_LAT, ARRIVED_LNG)
    assert any(ev["event"] == "RIDER_ARRIVED" for ev in first)

    for _ in range(10):
        repeat = svc.evaluate_geofence(delivery, "rider_1", ARRIVED_LAT, ARRIVED_LNG)
        assert not any(ev["event"] == "RIDER_ARRIVED" for ev in repeat)
        assert not any(ev["event"] == "RIDER_APPROACHING" for ev in repeat)


# ---------------------------------------------------------------------------
# Test 6: Direct jump from >500m to <50m
# ---------------------------------------------------------------------------

def test_6_direct_jump_emits_both_milestones(svc):
    delivery = _make_delivery(status="in_transit")
    assert svc.evaluate_geofence(delivery, "rider_1", FAR_LAT, FAR_LNG) == []

    jump_events = svc.evaluate_geofence(delivery, "rider_1", ARRIVED_LAT, ARRIVED_LNG)
    names = [ev["event"] for ev in jump_events]
    assert "RIDER_APPROACHING" in names
    assert "RIDER_ARRIVED" in names


def test_6_after_jump_no_further_milestones(svc):
    delivery = _make_delivery(status="in_transit")
    svc.evaluate_geofence(delivery, "rider_1", FAR_LAT, FAR_LNG)
    svc.evaluate_geofence(delivery, "rider_1", ARRIVED_LAT, ARRIVED_LNG)
    assert svc.evaluate_geofence(delivery, "rider_1", ARRIVED_LAT, ARRIVED_LNG) == []


# ---------------------------------------------------------------------------
# Tests 7, 8, 9: Terminal delivery states produce no events
# ---------------------------------------------------------------------------

@pytest.mark.parametrize("terminal_status", ["delivered", "cancelled", "failed"])
def test_7_8_9_terminal_delivery_no_events(svc, terminal_status):
    delivery = _make_delivery(status=terminal_status)
    events = svc.evaluate_geofence(delivery, "rider_1", ARRIVED_LAT, ARRIVED_LNG)
    assert events == [], f"Unexpected events for terminal status '{terminal_status}': {events}"


def test_pending_delivery_no_events(svc):
    delivery = _make_delivery(status="pending")
    assert svc.evaluate_geofence(delivery, "rider_1", ARRIVED_LAT, ARRIVED_LNG) == []


# ---------------------------------------------------------------------------
# Test 10: Milestone state must not leak between different deliveries
# ---------------------------------------------------------------------------

def test_10_milestone_isolation_between_deliveries(svc):
    del_a = _make_delivery(status="in_transit")
    del_a.id = "del_a_isolation"
    del_b = _make_delivery(status="in_transit")
    del_b.id = "del_b_isolation"

    events_a = svc.evaluate_geofence(del_a, "rider_1", ARRIVED_LAT, ARRIVED_LNG)
    assert any(ev["event"] == "RIDER_APPROACHING" for ev in events_a)
    assert any(ev["event"] == "RIDER_ARRIVED" for ev in events_a)

    # Delivery B must fire independently
    events_b = svc.evaluate_geofence(del_b, "rider_2", ARRIVED_LAT, ARRIVED_LNG)
    assert any(ev["event"] == "RIDER_APPROACHING" for ev in events_b)
    assert any(ev["event"] == "RIDER_ARRIVED" for ev in events_b)


def test_10_reset_single_delivery_preserves_others(svc):
    del_a = _make_delivery(status="in_transit")
    del_a.id = "del_a_reset"
    del_b = _make_delivery(status="in_transit")
    del_b.id = "del_b_reset"

    svc.evaluate_geofence(del_a, "rider_1", ARRIVED_LAT, ARRIVED_LNG)
    svc.evaluate_geofence(del_b, "rider_2", ARRIVED_LAT, ARRIVED_LNG)

    svc.reset_delivery(del_a.id)

    events_a2 = svc.evaluate_geofence(del_a, "rider_1", ARRIVED_LAT, ARRIVED_LNG)
    assert any(ev["event"] == "RIDER_APPROACHING" for ev in events_a2)

    events_b2 = svc.evaluate_geofence(del_b, "rider_2", ARRIVED_LAT, ARRIVED_LNG)
    assert events_b2 == []


# ---------------------------------------------------------------------------
# Test 11: WebSocket / event subscriber receives the new events
# ---------------------------------------------------------------------------

def _ws_create(client, order_id, customer_id):
    resp = client.post("/api/deliveries", json={
        "order_id": order_id, "customer_id": customer_id,
        "vendor_id": "vnd_nexgen_ev", "pickup_address": "Indiranagar",
        "pickup_lat": 12.9719, "pickup_lng": 77.6412,
        "dropoff_address": "Whitefield", "dropoff_lat": DROPOFF_LAT,
        "dropoff_lng": DROPOFF_LNG, "package_weight_kg": 5.0, "priority": "standard"
    })
    assert resp.status_code == 201
    return resp.json()["id"]


def test_11_rider_approaching_received_via_websocket(client):
    del_id = _ws_create(client, "ORD-GF-WS-001", "cust_gf1")
    client.post(f"/api/deliveries/{del_id}/assign", json={"rider_id": "tech_ramesh"})

    with client.websocket_connect(
        f"/ws/deliveries/{del_id}/tracking?user_id=cust_gf1&user_role=customer"
    ) as ws:
        assert ws.receive_json()["event"] == "INITIAL_TRACKING_SNAPSHOT"
        assert client.post("/api/riders/tech_ramesh/location", json={
            "latitude": APPROACHING_LAT, "longitude": APPROACHING_LNG,
            "delivery_id": del_id, "speed_kmh": 20.0
        }).status_code == 200

        ev1 = ws.receive_json()["event"]
        ev2 = ws.receive_json()["event"]
        assert "RIDER_LOCATION_UPDATED" in (ev1, ev2)
        assert "RIDER_APPROACHING" in (ev1, ev2)


def test_11_rider_arrived_received_via_websocket(client):
    del_id = _ws_create(client, "ORD-GF-WS-002", "cust_gf2")
    client.post(f"/api/deliveries/{del_id}/assign", json={"rider_id": "tech_ramesh"})

    with client.websocket_connect(
        f"/ws/deliveries/{del_id}/tracking?user_id=cust_gf2&user_role=customer"
    ) as ws:
        ws.receive_json()
        assert client.post("/api/riders/tech_ramesh/location", json={
            "latitude": ARRIVED_LAT, "longitude": ARRIVED_LNG,
            "delivery_id": del_id, "speed_kmh": 5.0
        }).status_code == 200

        names = {ws.receive_json()["event"], ws.receive_json()["event"], ws.receive_json()["event"]}
        assert "RIDER_LOCATION_UPDATED" in names
        assert "RIDER_APPROACHING" in names
        assert "RIDER_ARRIVED" in names


def test_11_approaching_not_repeated_in_websocket(client):
    del_id = _ws_create(client, "ORD-GF-WS-003", "cust_gf3")
    client.post(f"/api/deliveries/{del_id}/assign", json={"rider_id": "tech_ramesh"})

    with client.websocket_connect(
        f"/ws/deliveries/{del_id}/tracking?user_id=cust_gf3&user_role=customer"
    ) as ws:
        ws.receive_json()
        client.post("/api/riders/tech_ramesh/location", json={
            "latitude": APPROACHING_LAT, "longitude": APPROACHING_LNG, "delivery_id": del_id})
        first = {ws.receive_json()["event"], ws.receive_json()["event"]}
        assert "RIDER_APPROACHING" in first

        # Second update in same zone -- only RIDER_LOCATION_UPDATED, no repeated milestone
        client.post("/api/riders/tech_ramesh/location", json={
            "latitude": APPROACHING_LAT, "longitude": APPROACHING_LNG, "delivery_id": del_id})
        assert ws.receive_json()["event"] == "RIDER_LOCATION_UPDATED"


def test_11_geofence_events_isolated_across_deliveries(client):
    del_a = _ws_create(client, "ORD-GF-ISO-A", "cust_iso_a")
    del_b = _ws_create(client, "ORD-GF-ISO-B", "cust_iso_b")
    client.post(f"/api/deliveries/{del_a}/assign", json={"rider_id": "tech_ramesh"})
    client.post(f"/api/deliveries/{del_b}/assign", json={"rider_id": "tech_priya"})

    with client.websocket_connect(
        f"/ws/deliveries/{del_a}/tracking?user_id=cust_iso_a&user_role=customer"
    ) as ws_a:
        with client.websocket_connect(
            f"/ws/deliveries/{del_b}/tracking?user_id=cust_iso_b&user_role=customer"
        ) as ws_b:
            ws_a.receive_json()
            ws_b.receive_json()

            client.post("/api/riders/tech_ramesh/location", json={
                "latitude": APPROACHING_LAT, "longitude": APPROACHING_LNG, "delivery_id": del_a})

            a_names = {ws_a.receive_json()["event"], ws_a.receive_json()["event"]}
            assert "RIDER_LOCATION_UPDATED" in a_names
            assert "RIDER_APPROACHING" in a_names

            # Delivery B rider is far -- no milestone events
            client.post("/api/riders/tech_priya/location", json={
                "latitude": FAR_LAT, "longitude": FAR_LNG, "delivery_id": del_b})
            ev_b = ws_b.receive_json()
            assert ev_b["event"] == "RIDER_LOCATION_UPDATED"
            assert ev_b["delivery_id"] == del_b


# ---------------------------------------------------------------------------
# Test 12: Existing location event (RIDER_LOCATION_UPDATED) still works
# ---------------------------------------------------------------------------

def _make_plain_delivery(client, order_id, customer_id):
    resp = client.post("/api/deliveries", json={
        "order_id": order_id, "customer_id": customer_id,
        "vendor_id": "vnd_nexgen_ev", "pickup_address": "Indiranagar",
        "pickup_lat": 12.9719, "pickup_lng": 77.6412,
        "dropoff_address": "Whitefield", "dropoff_lat": DROPOFF_LAT,
        "dropoff_lng": DROPOFF_LNG, "package_weight_kg": 5.0, "priority": "standard"
    })
    assert resp.status_code == 201
    return resp.json()["id"]


def test_12_rider_location_updated_still_fires(client):
    del_id = _make_plain_delivery(client, "ORD-GF-COMPAT-1", "cust_compat1")
    client.post(f"/api/deliveries/{del_id}/assign", json={"rider_id": "tech_ramesh"})

    captured = []
    from logistics.router import location_service as loc_svc

    def cap(name, payload):
        captured.append((name, payload))

    loc_svc.subscribe_to_events(cap)
    try:
        client.post("/api/riders/tech_ramesh/location", json={
            "latitude": FAR_LAT, "longitude": FAR_LNG,
            "delivery_id": del_id, "speed_kmh": 25.0})
        loc_names = [n for n, _ in captured if n == "RIDER_LOCATION_UPDATED"]
        assert len(loc_names) >= 1
    finally:
        loc_svc._event_subscribers.remove(cap)


def test_12_location_event_payload_fields_present(client):
    del_id = _make_plain_delivery(client, "ORD-GF-COMPAT-2", "cust_compat2")
    client.post(f"/api/deliveries/{del_id}/assign", json={"rider_id": "tech_ramesh"})

    captured = []
    from logistics.router import location_service as loc_svc

    def cap(name, payload):
        if name == "RIDER_LOCATION_UPDATED":
            captured.append(payload)

    loc_svc.subscribe_to_events(cap)
    try:
        client.post("/api/riders/tech_ramesh/location", json={
            "latitude": FAR_LAT, "longitude": FAR_LNG,
            "delivery_id": del_id, "speed_kmh": 30.0})
        assert len(captured) >= 1
        ev = captured[-1]
        for field in ("rider_id", "latitude", "longitude", "distance_km", "eta_minutes"):
            assert field in ev, f"Field '{field}' missing from RIDER_LOCATION_UPDATED payload"
    finally:
        loc_svc._event_subscribers.remove(cap)


# ---------------------------------------------------------------------------
# Test 13: Existing delivery tracking response + new geofence fields
# ---------------------------------------------------------------------------

def _create_tracking_del(client, order_id):
    resp = client.post("/api/deliveries", json={
        "order_id": order_id, "customer_id": "cust_track_gf",
        "vendor_id": "vnd_nexgen_ev", "pickup_address": "Indiranagar",
        "pickup_lat": 12.9719, "pickup_lng": 77.6412,
        "dropoff_address": "Whitefield", "dropoff_lat": DROPOFF_LAT,
        "dropoff_lng": DROPOFF_LNG, "package_weight_kg": 5.0, "priority": "standard"
    })
    assert resp.status_code == 201
    return resp.json()["id"]


def test_13_tracking_response_has_geofence_fields(client):
    del_id = _create_tracking_del(client, "ORD-GF-TRACK-1")
    client.post(f"/api/deliveries/{del_id}/assign", json={"rider_id": "tech_ramesh"})
    client.post("/api/riders/tech_ramesh/location", json={
        "latitude": APPROACHING_LAT, "longitude": APPROACHING_LNG, "delivery_id": del_id})

    data = client.get(f"/api/deliveries/{del_id}/tracking").json()
    assert "distance_to_dropoff_meters" in data
    assert "is_approaching" in data
    assert "is_arrived" in data


def test_13_is_approaching_true_when_rider_nearby(client):
    del_id = _create_tracking_del(client, "ORD-GF-TRACK-2")
    client.post(f"/api/deliveries/{del_id}/assign", json={"rider_id": "tech_ramesh"})
    client.post("/api/riders/tech_ramesh/location", json={
        "latitude": APPROACHING_LAT, "longitude": APPROACHING_LNG, "delivery_id": del_id})

    data = client.get(f"/api/deliveries/{del_id}/tracking").json()
    assert data["is_approaching"] is True
    assert data["is_arrived"] is False
    assert data["distance_to_dropoff_meters"] <= DEFAULT_APPROACHING_DISTANCE_METERS


def test_13_is_arrived_true_when_at_destination(client):
    del_id = _create_tracking_del(client, "ORD-GF-TRACK-3")
    client.post(f"/api/deliveries/{del_id}/assign", json={"rider_id": "tech_ramesh"})
    client.post("/api/riders/tech_ramesh/location", json={
        "latitude": ARRIVED_LAT, "longitude": ARRIVED_LNG, "delivery_id": del_id})

    data = client.get(f"/api/deliveries/{del_id}/tracking").json()
    assert data["is_arrived"] is True
    assert data["is_approaching"] is True
    assert data["distance_to_dropoff_meters"] <= DEFAULT_ARRIVAL_DISTANCE_METERS


def test_13_existing_tracking_fields_unchanged(client):
    del_id = _create_tracking_del(client, "ORD-GF-TRACK-4")
    data = client.get(f"/api/deliveries/{del_id}/tracking").json()
    assert client.get(f"/api/deliveries/{del_id}/tracking").status_code == 200
    for field in ["delivery_id", "order_id", "status", "pickup", "dropoff"]:
        assert field in data, f"Pre-existing field '{field}' missing"


# ---------------------------------------------------------------------------
# Test 14: Existing authorization behavior unchanged
# ---------------------------------------------------------------------------

def _create_auth_del(client, order_id, customer_id):
    resp = client.post("/api/deliveries", json={
        "order_id": order_id, "customer_id": customer_id,
        "vendor_id": "vnd_nexgen_ev", "pickup_address": "Pickup",
        "pickup_lat": 12.9719, "pickup_lng": 77.6412,
        "dropoff_address": "Dropoff", "dropoff_lat": DROPOFF_LAT,
        "dropoff_lng": DROPOFF_LNG, "package_weight_kg": 5.0, "priority": "standard"
    })
    assert resp.status_code == 201
    return resp.json()["id"]


def test_14_customer_cannot_track_other_delivery(client):
    del_id = _create_auth_del(client, "ORD-AUTH-GF-1", "cust_alice_gf")
    res = client.get(f"/api/deliveries/{del_id}/tracking",
                     headers={"X-User-Role": "customer", "X-User-Id": "cust_bob_gf"})
    assert res.status_code == 403


def test_14_customer_can_track_own_delivery(client):
    del_id = _create_auth_del(client, "ORD-AUTH-GF-2", "cust_alice_gf")
    res = client.get(f"/api/deliveries/{del_id}/tracking",
                     headers={"X-User-Role": "customer", "X-User-Id": "cust_alice_gf"})
    assert res.status_code == 200


def test_14_websocket_rejects_unauthorized(client):
    del_id = _create_auth_del(client, "ORD-AUTH-GF-3", "cust_alice_gf")
    with pytest.raises(WebSocketDisconnect) as exc:
        with client.websocket_connect(
            f"/ws/deliveries/{del_id}/tracking?user_id=malicious&user_role=customer"
        ):
            pass
    assert exc.value.code == 1008


def test_14_rider_cannot_update_another_riders_location(client):
    res = client.post("/api/riders/tech_ramesh/location",
                      json={"latitude": 12.9750, "longitude": 77.6000},
                      headers={"X-User-Role": "rider", "X-User-Id": "tech_priya"})
    assert res.status_code == 403


# ---------------------------------------------------------------------------
# get_geofence_status helper
# ---------------------------------------------------------------------------

def test_geofence_status_no_rider_location(svc):
    delivery = _make_delivery()
    s = svc.get_geofence_status(delivery, None, None)
    assert s["distance_to_dropoff_meters"] is None
    assert s["is_approaching"] is False
    assert s["is_arrived"] is False


def test_geofence_status_approaching(svc):
    delivery = _make_delivery()
    s = svc.get_geofence_status(delivery, APPROACHING_LAT, APPROACHING_LNG)
    assert s["is_approaching"] is True
    assert s["is_arrived"] is False


def test_geofence_status_arrived(svc):
    delivery = _make_delivery()
    s = svc.get_geofence_status(delivery, ARRIVED_LAT, ARRIVED_LNG)
    assert s["is_approaching"] is True
    assert s["is_arrived"] is True


def test_geofence_status_far(svc):
    delivery = _make_delivery()
    s = svc.get_geofence_status(delivery, FAR_LAT, FAR_LNG)
    assert s["is_approaching"] is False
    assert s["is_arrived"] is False
    assert s["distance_to_dropoff_meters"] > DEFAULT_APPROACHING_DISTANCE_METERS
