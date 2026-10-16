"""Comprehensive Test Suite for Multi-Delivery Isolation and Real Customer Tracking.

Tests:
1. Canonical Order -> Delivery resolution
2. Multiple deliveries coexisting simultaneously
3. Multiple riders serving distinct deliveries
4. Delivery-specific GPS coordinates
5. WebSocket isolation per delivery
6. Route deviation state isolation
7. Geofence arrival milestone isolation
8. Missing delivery behavior (404)
9. Simulator road trajectory generation
"""

import pytest
import asyncio
from datetime import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from logistics.database import Base
from logistics.models import Delivery, Rider, RiderLocation, DeliveryRoute
from logistics.location_service import (
    LocationTrackingService,
    DeliveryNotFoundError,
    UnauthorizedLocationUpdateError
)
from logistics.schemas import RiderLocationUpdate
from logistics.realtime import DeliveryConnectionManager
from logistics.geofence import GeofenceService
from logistics.route_deviation import RouteDeviationService
from scratch.simulate_movement import generate_road_trajectory, calculate_bearing


@pytest.fixture
def test_db():
    """Create an isolated in-memory SQLite database for test isolation."""
    engine = create_engine("sqlite:///:memory:", echo=False)
    Base.metadata.create_all(bind=engine)
    Session = sessionmaker(bind=engine)
    session = Session()

    # Seed 3 distinct riders
    r1 = Rider(
        id="rider_001",
        name="Ramesh Kumar",
        phone="+91 98111 22222",
        vehicle_type="electric_bike",
        current_lat=28.6280,
        current_lng=77.3800,
        status="busy",
        is_online=True
    )
    r2 = Rider(
        id="rider_002",
        name="Priya Sharma",
        phone="+91 98222 33333",
        vehicle_type="cargo_ebike",
        current_lat=28.6260,
        current_lng=77.3750,
        status="busy",
        is_online=True
    )
    r3 = Rider(
        id="rider_003",
        name="Vikram Singh",
        phone="+91 98333 44444",
        vehicle_type="electric_bike",
        current_lat=28.6400,
        current_lng=77.3700,
        status="busy",
        is_online=True
    )
    session.add_all([r1, r2, r3])
    session.commit()

    # Seed 3 distinct deliveries
    d1 = Delivery(
        id="del_001",
        order_id="delivery_noida_delhi_001",
        customer_id="cust_demo",
        vendor_id="vnd_001",
        pickup_address="Sector 63 Noida",
        pickup_lat=28.6280,
        pickup_lng=77.3800,
        dropoff_address="Connaught Place Delhi",
        dropoff_lat=28.6315,
        dropoff_lng=77.2167,
        status="in_transit",
        assigned_rider_id="rider_001"
    )
    d2 = Delivery(
        id="del_002",
        order_id="delivery_noida_delhi_002",
        customer_id="cust_demo",
        vendor_id="vnd_001",
        pickup_address="Electronic City Noida",
        pickup_lat=28.6260,
        pickup_lng=77.3750,
        dropoff_address="South Extension Delhi",
        dropoff_lat=28.5700,
        dropoff_lng=77.2200,
        status="in_transit",
        assigned_rider_id="rider_002"
    )
    d3 = Delivery(
        id="del_003",
        order_id="delivery_noida_delhi_003",
        customer_id="cust_demo",
        vendor_id="vnd_001",
        pickup_address="Indirapuram",
        pickup_lat=28.6400,
        pickup_lng=77.3700,
        dropoff_address="Lajpat Nagar Delhi",
        dropoff_lat=28.5670,
        dropoff_lng=77.2430,
        status="in_transit",
        assigned_rider_id="rider_003"
    )
    session.add_all([d1, d2, d3])
    session.commit()

    yield session
    session.close()


def test_canonical_order_to_delivery_lookup(test_db):
    """Verify backend resolves deliveries by either Delivery.id or Delivery.order_id."""
    loc_service = LocationTrackingService()

    # Lookup by Delivery.id
    track_by_id = loc_service.get_delivery_tracking(test_db, "del_001")
    assert track_by_id.delivery_id == "del_001"
    assert track_by_id.order_id == "delivery_noida_delhi_001"
    assert track_by_id.rider is not None
    assert track_by_id.rider.name == "Ramesh Kumar"

    # Lookup by Delivery.order_id
    track_by_order = loc_service.get_delivery_tracking(test_db, "delivery_noida_delhi_001")
    assert track_by_order.delivery_id == "del_001"
    assert track_by_order.order_id == "delivery_noida_delhi_001"
    assert track_by_order.rider is not None
    assert track_by_order.rider.name == "Ramesh Kumar"


def test_multiple_deliveries_concurrent_existence(test_db):
    """Verify multiple deliveries exist simultaneously with independent states."""
    deliveries = test_db.query(Delivery).all()
    assert len(deliveries) >= 3

    deliv_ids = {d.id for d in deliveries}
    order_ids = {d.order_id for d in deliveries}
    rider_ids = {d.assigned_rider_id for d in deliveries}

    assert "del_001" in deliv_ids
    assert "del_002" in deliv_ids
    assert "del_003" in deliv_ids

    assert "delivery_noida_delhi_001" in order_ids
    assert "delivery_noida_delhi_002" in order_ids
    assert "delivery_noida_delhi_003" in order_ids

    assert "rider_001" in rider_ids
    assert "rider_002" in rider_ids
    assert "rider_003" in rider_ids


def test_delivery_specific_gps_isolation(test_db):
    """Verify GPS updates on delivery A never alter delivery B or C."""
    loc_service = LocationTrackingService()

    # Update rider 1 location on delivery 1
    update_1 = RiderLocationUpdate(
        latitude=28.6290,
        longitude=77.3750,
        speed_kmh=35.0,
        heading_degrees=270.0,
        accuracy_meters=4.0,
        delivery_id="delivery_noida_delhi_001",
        timestamp=datetime.utcnow()
    )
    resp_1 = loc_service.record_rider_location(
        db=test_db,
        rider_id="rider_001",
        update=update_1,
        actor_id="rider_001",
        actor_role="rider"
    )
    assert resp_1.success is True

    # Check rider 1 current coordinates
    r1 = test_db.query(Rider).filter_by(id="rider_001").first()
    assert r1.current_lat == 28.6290
    assert r1.current_lng == 77.3750
    assert r1.heading_degrees == 270.0

    # Verify rider 2 and rider 3 locations remain completely untouched
    r2 = test_db.query(Rider).filter_by(id="rider_002").first()
    assert r2.current_lat == 28.6260
    assert r2.current_lng == 77.3750

    r3 = test_db.query(Rider).filter_by(id="rider_003").first()
    assert r3.current_lat == 28.6400
    assert r3.current_lng == 77.3700

    # Verify locations table has record only associated with del_001
    records_del2 = test_db.query(RiderLocation).filter_by(delivery_id="del_002").all()
    assert len(records_del2) == 0


def test_mismatched_rider_rejected(test_db):
    """Verify a rider cannot send updates for a delivery assigned to someone else."""
    loc_service = LocationTrackingService()

    # Rider 2 attempts update on delivery 1 (assigned to Rider 1)
    bad_update = RiderLocationUpdate(
        latitude=28.6290,
        longitude=77.3750,
        speed_kmh=30.0,
        heading_degrees=90.0,
        delivery_id="del_001",
        timestamp=datetime.utcnow()
    )
    with pytest.raises(UnauthorizedLocationUpdateError):
        loc_service.record_rider_location(
            db=test_db,
            rider_id="rider_002",
            update=bad_update,
            actor_id="rider_002",
            actor_role="rider"
        )


@pytest.mark.asyncio
async def test_websocket_delivery_isolation():
    """Verify WebSocket clients subscribed to delivery A never receive events for delivery B."""
    manager = DeliveryConnectionManager()

    class MockWebSocket:
        def __init__(self, name):
            self.name = name
            self.received = []

        async def send_json(self, data):
            self.received.append(data)

    ws_client_del1 = MockWebSocket("client_del1")
    ws_client_del2 = MockWebSocket("client_del2")

    # Connect client 1 to del_001
    await manager.connect("del_001", ws_client_del1)
    # Connect client 2 to del_002
    await manager.connect("del_002", ws_client_del2)

    # Broadcast event to del_001
    msg1 = {"event": "RIDER_LOCATION_UPDATED", "delivery_id": "del_001", "lat": 28.629}
    await manager.broadcast_to_delivery("del_001", msg1)

    # Verify client 1 got the event
    assert len(ws_client_del1.received) == 1
    assert ws_client_del1.received[0]["delivery_id"] == "del_001"

    # Verify client 2 got ZERO events
    assert len(ws_client_del2.received) == 0

    # Broadcast event to del_002
    msg2 = {"event": "RIDER_LOCATION_UPDATED", "delivery_id": "del_002", "lat": 28.626}
    await manager.broadcast_to_delivery("del_002", msg2)

    # Verify client 2 got its event
    assert len(ws_client_del2.received) == 1
    assert ws_client_del2.received[0]["delivery_id"] == "del_002"

    # Verify client 1 did NOT receive delivery 2's event
    assert len(ws_client_del1.received) == 1


def test_route_deviation_isolation(test_db):
    """Verify route deviation state is strictly isolated per delivery task."""
    dev_service = RouteDeviationService(threshold_meters=200.0)

    # Route corridor for del_001 along longitude 77.38
    route_del1 = [{"lat": 28.6280, "lng": 77.3800}, {"lat": 28.6300, "lng": 77.3800}]
    # Route corridor for del_002 along longitude 77.375
    route_del2 = [{"lat": 28.6260, "lng": 77.3750}, {"lat": 28.6280, "lng": 77.3750}]

    # Rider 1 moves 1 km away from route_del1 (deviation)
    events_1 = dev_service.evaluate_deviation(
        delivery_id="del_001",
        rider_id="rider_001",
        latitude=28.6290,
        longitude=77.3950, # ~1.5 km off
        route_waypoints=route_del1,
        delivery_status="in_transit"
    )
    assert len(events_1) == 1
    assert events_1[0]["event"] == "RIDER_ROUTE_DEVIATION"
    assert dev_service.state.is_deviating("del_001") is True

    # Check delivery 2 state: must be completely normal (NOT deviating)
    assert dev_service.state.is_deviating("del_002") is False

    # Rider 2 moves directly along route_del2 (no deviation)
    events_2 = dev_service.evaluate_deviation(
        delivery_id="del_002",
        rider_id="rider_002",
        latitude=28.6270,
        longitude=77.3750, # exactly on route
        route_waypoints=route_del2,
        delivery_status="in_transit"
    )
    assert len(events_2) == 0
    assert dev_service.state.is_deviating("del_002") is False


def test_geofence_arrival_isolation(test_db):
    """Verify arrival milestone in delivery 1 does not trigger or affect delivery 2."""
    gf_service = GeofenceService(approaching_threshold_meters=500.0, arrival_threshold_meters=50.0)

    deliv_1 = test_db.query(Delivery).filter_by(id="del_001").first()
    deliv_2 = test_db.query(Delivery).filter_by(id="del_002").first()

    # Rider 1 arrives at deliv_1 dropoff (exact coordinates)
    events_1 = gf_service.evaluate_geofence(
        delivery=deliv_1,
        rider_id="rider_001",
        lat=deliv_1.dropoff_lat,
        lng=deliv_1.dropoff_lng
    )
    milestones_1 = [e["event"] for e in events_1]
    assert "RIDER_APPROACHING" in milestones_1
    assert "RIDER_ARRIVED" in milestones_1

    # Verify milestone state for deliv_1 is marked
    assert gf_service.state.has_emitted("del_001", "RIDER_ARRIVED") is True

    # Verify delivery 2 milestone state is completely untouched
    assert gf_service.state.has_emitted("del_002", "RIDER_ARRIVED") is False
    assert gf_service.state.has_emitted("del_002", "RIDER_APPROACHING") is False


def test_missing_delivery_not_found(test_db):
    """Verify non-existent delivery or order ID raises clean 404."""
    loc_service = LocationTrackingService()
    with pytest.raises(DeliveryNotFoundError):
        loc_service.get_delivery_tracking(test_db, "non_existent_delivery_99999")


def test_simulator_trajectory_generation():
    """Verify simulator generates fine-grained steps along road coordinates with bearings."""
    sample_route = [
        (28.6280, 77.3800), # Noida
        (28.6300, 77.3000), # Midpoint
        (28.6315, 77.2167)  # Delhi
    ]
    trajectory = generate_road_trajectory(sample_route, num_steps=10)
    assert len(trajectory) == 10

    # First point should start at origin
    assert round(trajectory[0][0], 4) == 28.6280
    assert round(trajectory[0][1], 4) == 77.3800

    # Last point should end at destination
    assert round(trajectory[-1][0], 4) == 28.6315
    assert round(trajectory[-1][1], 4) == 77.2167

    # Bearing should be computed for each step
    for lat, lng, bearing in trajectory:
        assert 0.0 <= bearing <= 360.0
