"""Phase 4.2 -- Route Deviation Detection test suite.

Tests RouteDeviationService in isolation and its integration with:
- LocationTrackingService
- Realtime WebSocket broadcast (/ws/deliveries/{delivery_id}/tracking)
- Delivery tracking REST endpoint (/api/deliveries/{delivery_id}/tracking)
- Geofence milestone interoperability
"""

import json
import pytest
from datetime import datetime
from unittest.mock import MagicMock
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from logistics.database import Base, get_db, seed_default_riders
from logistics.models import Delivery, DeliveryRoute, Rider
from logistics.route_deviation import (
    RouteDeviationService,
    RouteDeviationState,
    DEFAULT_ROUTE_DEVIATION_DISTANCE_METERS,
    ACTIVE_DEVIATION_STATUSES,
    EVENT_RIDER_ROUTE_DEVIATION,
    extract_route_coordinates,
    point_to_segment_distance_meters,
    calculate_distance_to_route_meters,
    route_deviation_service as singleton_deviation_service,
)
from logistics.geofence import geofence_service as singleton_geofence_service
from logistics.route_planning import haversine_distance, RoutePlanningService
from main import app

TEST_DATABASE_URL = "sqlite:///:memory:"
test_engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

# Reference route waypoints in Bengaluru: Indiranagar -> Whitefield
# Segment: (12.9719, 77.6412) to (12.9719, 77.7000)
WP_START = {"step": 0, "lat": 12.9719, "lng": 77.6412}
WP_MID = {"step": 1, "lat": 12.9719, "lng": 77.6700}
WP_END = {"step": 2, "lat": 12.9719, "lng": 77.7000}
SAMPLE_WAYPOINTS = [WP_START, WP_MID, WP_END]


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture(autouse=True)
def setup_test_database():
    """Fresh schema + seeded riders. Resets singletons."""
    Base.metadata.create_all(bind=test_engine)
    with TestingSessionLocal() as db:
        seed_default_riders(db)
    app.dependency_overrides[get_db] = override_get_db
    singleton_deviation_service.reset_all()
    singleton_geofence_service.reset_all()
    yield
    app.dependency_overrides.clear()
    Base.metadata.drop_all(bind=test_engine)
    singleton_deviation_service.reset_all()
    singleton_geofence_service.reset_all()


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def svc() -> RouteDeviationService:
    """Fresh RouteDeviationService instance per test."""
    return RouteDeviationService()


def _make_delivery(status="assigned", waypoints=None):
    d = MagicMock()
    d.id = "del_test_dev_001"
    d.order_id = "ORD-DEV-001"
    d.status = status
    d.pickup_lat = 12.9719
    d.pickup_lng = 77.6412
    d.dropoff_lat = 12.9719
    d.dropoff_lng = 77.7000
    if waypoints is not None:
        rt = MagicMock()
        rt.created_at = datetime.utcnow()
        rt.waypoints_json = json.dumps(waypoints)
        d.routes = [rt]
    else:
        d.routes = []
    return d


# ===========================================================================
# 1. Service Initialization and Configuration Tests
# ===========================================================================

def test_01_service_initialization(svc):
    assert svc is not None
    assert isinstance(svc.state, RouteDeviationState)
    assert svc.threshold_meters == 250.0


def test_02_default_threshold_is_250m():
    assert DEFAULT_ROUTE_DEVIATION_DISTANCE_METERS == 250.0
    custom_svc = RouteDeviationService(threshold_meters=150.0)
    assert custom_svc.threshold_meters == 150.0


def test_02_active_statuses_definition():
    assert "assigned" in ACTIVE_DEVIATION_STATUSES
    assert "picked_up" in ACTIVE_DEVIATION_STATUSES
    assert "in_transit" in ACTIVE_DEVIATION_STATUSES
    assert "pending" not in ACTIVE_DEVIATION_STATUSES
    assert "delivered" not in ACTIVE_DEVIATION_STATUSES
    assert "cancelled" not in ACTIVE_DEVIATION_STATUSES
    assert "failed" not in ACTIVE_DEVIATION_STATUSES


def test_02_canonical_event_name():
    assert EVENT_RIDER_ROUTE_DEVIATION == "RIDER_ROUTE_DEVIATION"


# ===========================================================================
# 2. Waypoint Parsing and Geometric Calculation Tests
# ===========================================================================

def test_extract_route_coordinates_dict_lat_lng():
    wps = [{"lat": 12.9719, "lng": 77.6412}, {"lat": 12.9800, "lng": 77.6500}]
    coords = extract_route_coordinates(wps)
    assert len(coords) == 2
    assert coords[0] == (12.9719, 77.6412)


def test_extract_route_coordinates_dict_latitude_longitude():
    wps = [{"latitude": 12.9719, "longitude": 77.6412}]
    coords = extract_route_coordinates(wps)
    assert len(coords) == 1
    assert coords[0] == (12.9719, 77.6412)


def test_extract_route_coordinates_tuples():
    wps = [[12.9719, 77.6412], (12.9800, 77.6500)]
    coords = extract_route_coordinates(wps)
    assert len(coords) == 2


def test_extract_route_coordinates_json_string():
    raw_json = json.dumps([{"lat": 12.9719, "lng": 77.6412}])
    coords = extract_route_coordinates(raw_json)
    assert len(coords) == 1


def test_extract_route_coordinates_malformed_entries_skipped():
    wps = [
        {"lat": 12.9719, "lng": 77.6412},
        None,
        {"lat": "invalid", "lng": 77.0},
        {"invalid": True},
        [999.0, 77.0],  # Out of latitude range (-90 to 90)
        {"lat": 12.9800, "lng": 77.6500}
    ]
    coords = extract_route_coordinates(wps)
    assert len(coords) == 2
    assert coords[0] == (12.9719, 77.6412)
    assert coords[1] == (12.9800, 77.6500)


def test_point_to_segment_distance_on_segment():
    # Point exactly halfway on the segment
    dist = point_to_segment_distance_meters(
        12.9719, 77.6556,  # P
        12.9719, 77.6412,  # A
        12.9719, 77.6700   # B
    )
    assert dist < 1.0  # essentially 0 meters


def test_point_to_segment_distance_at_endpoints():
    dist_a = point_to_segment_distance_meters(12.9719, 77.6412, 12.9719, 77.6412, 12.9719, 77.6700)
    dist_b = point_to_segment_distance_meters(12.9719, 77.6700, 12.9719, 77.6412, 12.9719, 77.6700)
    assert dist_a < 1.0
    assert dist_b < 1.0


def test_single_waypoint_route():
    dist = calculate_distance_to_route_meters(12.9719, 77.6412, [{"lat": 12.9719, "lng": 77.6412}])
    assert dist == 0.0


# ===========================================================================
# 3. Route Corridor & Threshold Evaluation Tests
# ===========================================================================

def test_03_rider_on_route_not_flagged(svc):
    # Rider exactly on midpoint of route segment
    events = svc.evaluate_deviation(
        delivery_id="del_1",
        rider_id="rider_1",
        latitude=12.9719,
        longitude=77.6556,
        route_waypoints=SAMPLE_WAYPOINTS,
        delivery_status="in_transit"
    )
    assert events == []
    assert not svc.state.is_deviating("del_1")


def test_04_rider_slightly_away_below_threshold_not_flagged(svc):
    # Latitude offset of ~0.001 deg at Bangalore is ~111 meters (< 250m threshold)
    events = svc.evaluate_deviation(
        delivery_id="del_1",
        rider_id="rider_1",
        latitude=12.9729,  # ~111m north of line
        longitude=77.6556,
        route_waypoints=SAMPLE_WAYPOINTS,
        delivery_status="in_transit"
    )
    assert events == []
    assert not svc.state.is_deviating("del_1")


def test_05_rider_beyond_threshold_is_flagged(svc):
    # Latitude offset of ~0.0035 deg is ~389 meters (> 250m threshold)
    events = svc.evaluate_deviation(
        delivery_id="del_1",
        rider_id="rider_1",
        latitude=12.9754,
        longitude=77.6556,
        route_waypoints=SAMPLE_WAYPOINTS,
        delivery_status="in_transit"
    )
    assert len(events) == 1
    event = events[0]
    assert event["event"] == EVENT_RIDER_ROUTE_DEVIATION
    assert event["delivery_id"] == "del_1"
    assert event["rider_id"] == "rider_1"
    assert event["distance_from_route_meters"] > 250.0
    assert event["threshold_meters"] == 250.0
    assert event["latitude"] == 12.9754
    assert event["longitude"] == 77.6556
    assert "timestamp" in event
    assert svc.state.is_deviating("del_1")


def test_06_rider_around_threshold_consistent_boundary(svc):
    # Distance slightly below threshold vs slightly above threshold
    # Let's test with a custom small threshold for precision testing
    exact_svc = RouteDeviationService(threshold_meters=200.0)
    # Point ~111m away:
    assert exact_svc.evaluate_deviation("del_b", "r1", 12.9729, 77.6556, SAMPLE_WAYPOINTS, "in_transit") == []
    # Point ~389m away:
    evs = exact_svc.evaluate_deviation("del_b", "r1", 12.9754, 77.6556, SAMPLE_WAYPOINTS, "in_transit")
    assert len(evs) == 1


def test_07_deviation_event_payload_fields(svc):
    events = svc.evaluate_deviation(
        delivery_id="del_full",
        rider_id="rider_full",
        latitude=12.9760,
        longitude=77.6556,
        route_waypoints=SAMPLE_WAYPOINTS,
        delivery_status="assigned",
        order_id="ORD-PAYLOAD-99"
    )
    assert len(events) == 1
    ev = events[0]
    assert ev["event"] == "RIDER_ROUTE_DEVIATION"
    assert ev["delivery_id"] == "del_full"
    assert ev["order_id"] == "ORD-PAYLOAD-99"
    assert ev["rider_id"] == "rider_full"
    assert isinstance(ev["distance_from_route_meters"], float)
    assert ev["threshold_meters"] == 250.0
    assert ev["latitude"] == 12.9760
    assert ev["longitude"] == 77.6556
    assert isinstance(ev["timestamp"], str)


# ===========================================================================
# 4. State Deduplication and Route Recovery Tests
# ===========================================================================

def test_08_repeated_gps_updates_while_deviating_deduplicated(svc):
    # 1st ping: deviates (emits event)
    evs1 = svc.evaluate_deviation("del_dedup", "r1", 12.9755, 77.6556, SAMPLE_WAYPOINTS, "in_transit")
    assert len(evs1) == 1

    # 2nd ping: still deviating at 12.9760 (should NOT emit duplicate)
    evs2 = svc.evaluate_deviation("del_dedup", "r1", 12.9760, 77.6556, SAMPLE_WAYPOINTS, "in_transit")
    assert evs2 == []

    # 3rd ping: further deviation at 12.9770 (should NOT emit duplicate)
    evs3 = svc.evaluate_deviation("del_dedup", "r1", 12.9770, 77.6556, SAMPLE_WAYPOINTS, "in_transit")
    assert evs3 == []


def test_09_rider_returns_inside_corridor_resets_deviation_state(svc):
    # Deviates:
    evs1 = svc.evaluate_deviation("del_rec", "r1", 12.9755, 77.6556, SAMPLE_WAYPOINTS, "in_transit")
    assert len(evs1) == 1
    assert svc.state.is_deviating("del_rec") is True

    # Recovers (back to corridor):
    evs2 = svc.evaluate_deviation("del_rec", "r1", 12.9719, 77.6556, SAMPLE_WAYPOINTS, "in_transit")
    assert evs2 == []  # No event emitted on recovery
    assert svc.state.is_deviating("del_rec") is False  # State cleanly reset


def test_10_later_deviation_after_recovery_emits_new_event(svc):
    # 1. First deviation
    evs1 = svc.evaluate_deviation("del_cycle", "r1", 12.9755, 77.6556, SAMPLE_WAYPOINTS, "in_transit")
    assert len(evs1) == 1

    # 2. Recovery
    evs2 = svc.evaluate_deviation("del_cycle", "r1", 12.9719, 77.6556, SAMPLE_WAYPOINTS, "in_transit")
    assert evs2 == []

    # 3. Second deviation
    evs3 = svc.evaluate_deviation("del_cycle", "r1", 12.9760, 77.6556, SAMPLE_WAYPOINTS, "in_transit")
    assert len(evs3) == 1
    assert evs3[0]["event"] == "RIDER_ROUTE_DEVIATION"


def test_11_different_deliveries_maintain_independent_deviation_state(svc):
    # Del A deviates
    evs_a = svc.evaluate_deviation("del_A", "r1", 12.9755, 77.6556, SAMPLE_WAYPOINTS, "in_transit")
    assert len(evs_a) == 1
    assert svc.state.is_deviating("del_A") is True
    assert svc.state.is_deviating("del_B") is False

    # Del B stays on route
    evs_b = svc.evaluate_deviation("del_B", "r2", 12.9719, 77.6556, SAMPLE_WAYPOINTS, "in_transit")
    assert evs_b == []
    assert svc.state.is_deviating("del_B") is False


def test_reset_delivery_and_reset_all(svc):
    svc.state.set_deviating("del_1", True)
    svc.state.set_deviating("del_2", True)
    svc.reset_delivery("del_1")
    assert svc.state.is_deviating("del_1") is False
    assert svc.state.is_deviating("del_2") is True

    svc.reset_all()
    assert svc.state.is_deviating("del_2") is False


# ===========================================================================
# 5. Missing and Malformed Route Handling Tests
# ===========================================================================

def test_12_missing_route_does_not_crash(svc):
    events = svc.evaluate_deviation("del_noroute", "r1", 12.9755, 77.6556, None, "in_transit")
    assert events == []


def test_13_empty_waypoints_does_not_crash(svc):
    events = svc.evaluate_deviation("del_empty", "r1", 12.9755, 77.6556, [], "in_transit")
    assert events == []


def test_14_malformed_waypoints_handled_safely(svc):
    malformed = [{"invalid": 123}, "not-a-dict", None]
    events = svc.evaluate_deviation("del_malformed", "r1", 12.9755, 77.6556, malformed, "in_transit")
    assert events == []


# ===========================================================================
# 6. Delivery Lifecycle State Tests
# ===========================================================================

def test_15_pending_delivery_does_not_trigger_deviation(svc):
    events = svc.evaluate_deviation("del_pend", "r1", 12.9755, 77.6556, SAMPLE_WAYPOINTS, "pending")
    assert events == []


def test_16_assigned_delivery_can_trigger_deviation(svc):
    events = svc.evaluate_deviation("del_asgn", "r1", 12.9755, 77.6556, SAMPLE_WAYPOINTS, "assigned")
    assert len(events) == 1


def test_17_picked_up_delivery_can_trigger_deviation(svc):
    events = svc.evaluate_deviation("del_pkup", "r1", 12.9755, 77.6556, SAMPLE_WAYPOINTS, "picked_up")
    assert len(events) == 1


def test_18_in_transit_delivery_can_trigger_deviation(svc):
    events = svc.evaluate_deviation("del_intran", "r1", 12.9755, 77.6556, SAMPLE_WAYPOINTS, "in_transit")
    assert len(events) == 1


def test_19_delivered_delivery_does_not_trigger_deviation(svc):
    events = svc.evaluate_deviation("del_dlvd", "r1", 12.9755, 77.6556, SAMPLE_WAYPOINTS, "delivered")
    assert events == []


def test_20_cancelled_delivery_does_not_trigger_deviation(svc):
    events = svc.evaluate_deviation("del_canc", "r1", 12.9755, 77.6556, SAMPLE_WAYPOINTS, "cancelled")
    assert events == []


def test_21_failed_delivery_does_not_trigger_deviation(svc):
    events = svc.evaluate_deviation("del_fail", "r1", 12.9755, 77.6556, SAMPLE_WAYPOINTS, "failed")
    assert events == []


# ===========================================================================
# 7. End-to-End API and Location Service Tests
# ===========================================================================

def _create_and_plan_delivery(client, order_id, rider_id="tech_ramesh", customer_id="cust_dev_test"):
    # 1. Create delivery
    resp = client.post("/api/deliveries", json={
        "order_id": order_id,
        "customer_id": customer_id,
        "vendor_id": "vnd_nexgen_ev",
        "pickup_address": "Indiranagar",
        "pickup_lat": 12.9719,
        "pickup_lng": 77.6412,
        "dropoff_address": "Whitefield",
        "dropoff_lat": 12.9719,
        "dropoff_lng": 77.7000,
        "package_weight_kg": 5.0,
        "priority": "standard"
    })
    assert resp.status_code == 201
    del_id = resp.json()["id"]

    # 2. Assign rider (automatically plans route via Haversine built-in)
    assign_resp = client.post(f"/api/deliveries/{del_id}/assign", json={"rider_id": rider_id})
    assert assign_resp.status_code == 200

    return del_id


def test_22_and_23_websocket_receives_deviation_and_isolated(client):
    # Create two deliveries with separate riders and customers
    del_a = _create_and_plan_delivery(client, "ORD-WS-DEV-A", rider_id="tech_ramesh", customer_id="cust_iso_a")
    del_b = _create_and_plan_delivery(client, "ORD-WS-DEV-B", rider_id="tech_priya", customer_id="cust_iso_b")

    with client.websocket_connect(f"/ws/deliveries/{del_a}/tracking?user_id=cust_iso_a&user_role=customer") as ws_a:
        with client.websocket_connect(f"/ws/deliveries/{del_b}/tracking?user_id=cust_iso_b&user_role=customer") as ws_b:
            # Drain initial connection messages
            msg_a = ws_a.receive_json()
            assert msg_a["event"] == "INITIAL_TRACKING_SNAPSHOT"
            msg_b = ws_b.receive_json()
            assert msg_b["event"] == "INITIAL_TRACKING_SNAPSHOT"

            # Send deviating location update for Delivery A (~389m north of route)
            resp = client.post("/api/riders/tech_ramesh/location", json={
                "latitude": 12.9754,
                "longitude": 77.6556,
                "delivery_id": del_a
            })
            assert resp.status_code == 200

            # Delivery A WebSocket should receive RIDER_LOCATION_UPDATED and RIDER_ROUTE_DEVIATION
            received_events_a = {ws_a.receive_json()["event"], ws_a.receive_json()["event"]}
            assert "RIDER_LOCATION_UPDATED" in received_events_a
            assert "RIDER_ROUTE_DEVIATION" in received_events_a

            # Now send a normal on-route update for Delivery B
            resp_b = client.post("/api/riders/tech_priya/location", json={
                "latitude": 12.9719,
                "longitude": 77.6556,
                "delivery_id": del_b
            })
            assert resp_b.status_code == 200

            # Delivery B WebSocket should receive only RIDER_LOCATION_UPDATED, never Delivery A's deviation
            msg_b_update = ws_b.receive_json()
            assert msg_b_update["event"] == "RIDER_LOCATION_UPDATED"
            assert msg_b_update["delivery_id"] == del_b


def test_24_existing_geofence_events_still_work_alongside_deviation(client):
    del_id = _create_and_plan_delivery(client, "ORD-GF-DEV-INTEROP")

    # Send GPS update near dropoff (~30m away) to trigger geofence arrival
    # Dropoff is (12.9719, 77.7000)
    resp = client.post("/api/riders/tech_ramesh/location", json={
        "latitude": 12.9719,
        "longitude": 77.6998,  # ~21m away from dropoff
        "delivery_id": del_id
    })
    assert resp.status_code == 200

    # Geofence milestone state should record arrival
    assert singleton_geofence_service.state.has_emitted(del_id, "RIDER_ARRIVED")


def test_25_missing_route_does_not_crash_location_endpoint(client):
    # Create delivery but do not assign or plan route
    resp = client.post("/api/deliveries", json={
        "order_id": "ORD-NO-ROUTE",
        "customer_id": "cust_dev_test",
        "vendor_id": "vnd_nexgen_ev",
        "pickup_address": "Indiranagar",
        "pickup_lat": 12.9719,
        "pickup_lng": 77.6412,
        "dropoff_address": "Whitefield",
        "dropoff_lat": 12.9719,
        "dropoff_lng": 77.7000,
        "package_weight_kg": 5.0,
        "priority": "standard"
    })
    del_id = resp.json()["id"]

    # Assign rider without route
    with TestingSessionLocal() as db:
        d = db.query(Delivery).filter(Delivery.id == del_id).first()
        d.assigned_rider_id = "tech_ramesh"
        d.status = "assigned"
        db.commit()

    # Location update should succeed without error
    loc_resp = client.post("/api/riders/tech_ramesh/location", json={
        "latitude": 12.9754,
        "longitude": 77.6556,
        "delivery_id": del_id
    })
    assert loc_resp.status_code == 200
    assert loc_resp.json()["success"] is True


def test_26_tracking_api_exposes_deviation_fields(client):
    del_id = _create_and_plan_delivery(client, "ORD-TRACK-FIELDS")

    # Send location update on route
    client.post("/api/riders/tech_ramesh/location", json={
        "latitude": 12.9719,
        "longitude": 77.6556,
        "delivery_id": del_id
    })

    track_data = client.get(f"/api/deliveries/{del_id}/tracking").json()
    assert "distance_from_route_meters" in track_data
    assert "is_route_deviating" in track_data
    assert "route_deviation_threshold_meters" in track_data
    assert track_data["is_route_deviating"] is False
    assert track_data["route_deviation_threshold_meters"] == 250.0
    assert track_data["distance_from_route_meters"] is not None
    assert track_data["distance_from_route_meters"] < 250.0


def test_no_automatic_reassignment_or_cancellation_on_deviation(client):
    del_id = _create_and_plan_delivery(client, "ORD-NO-REASSIGN")

    # Rider deviates
    client.post("/api/riders/tech_ramesh/location", json={
        "latitude": 12.9754,
        "longitude": 77.6556,
        "delivery_id": del_id
    })

    # Verify delivery status and assigned rider are unchanged
    track_data = client.get(f"/api/deliveries/{del_id}/tracking").json()
    assert track_data["status"] == "assigned"
    assert track_data["rider"]["id"] == "tech_ramesh"
    assert track_data["is_route_deviating"] is True
