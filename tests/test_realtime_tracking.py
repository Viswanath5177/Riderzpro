"""Comprehensive test suite for Real-Time Delivery Tracking and WebSocket Streaming."""

import pytest
from datetime import datetime, timedelta
from fastapi.testclient import TestClient
from starlette.websockets import WebSocketDisconnect
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from logistics.database import Base, get_db, seed_default_riders
from logistics.models import Delivery, Rider
from logistics.realtime import realtime_manager
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


def helper_create_delivery(client, order_id="ORD-WS-001", customer_id="usr_cust_alice"):
    """Helper to create a test delivery."""
    payload = {
        "order_id": order_id,
        "customer_id": customer_id,
        "customer_name": "Alice Customer",
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


def test_websocket_authentication_rejects_missing_credentials(client):
    """1. WebSocket rejects connection when credentials/identity are missing."""
    del_id = helper_create_delivery(client)

    with pytest.raises(WebSocketDisconnect) as exc:
        with client.websocket_connect(f"/ws/deliveries/{del_id}/tracking"):
            pass
    assert exc.value.code == 1008


def test_websocket_rejects_nonexistent_delivery(client):
    """2. WebSocket rejects connection for a delivery ID that does not exist."""
    with pytest.raises(WebSocketDisconnect) as exc:
        with client.websocket_connect("/ws/deliveries/del_nonexistent_999/tracking?user_id=usr_admin&user_role=admin"):
            pass
    assert exc.value.code == 1008


def test_authorized_customer_connection(client):
    """3. Authorized customer receives initial tracking snapshot upon connection."""
    del_id = helper_create_delivery(client, customer_id="usr_cust_alice")

    with client.websocket_connect(f"/ws/deliveries/{del_id}/tracking?user_id=usr_cust_alice&user_role=customer") as ws:
        msg = ws.receive_json()
        assert msg["event"] == "INITIAL_TRACKING_SNAPSHOT"
        assert msg["delivery_id"] == del_id
        assert msg["status"] == "pending"
        assert msg["pickup"]["latitude"] == 12.9719
        assert msg["dropoff"]["latitude"] == 12.9550


def test_unauthorized_customer_connection_rejected(client):
    """4. Customer A is rejected when attempting to subscribe to Customer B's delivery."""
    del_id = helper_create_delivery(client, customer_id="usr_cust_alice")

    # Bob attempts to subscribe to Alice's delivery
    with pytest.raises(WebSocketDisconnect) as exc:
        with client.websocket_connect(f"/ws/deliveries/{del_id}/tracking?user_id=usr_cust_bob&user_role=customer"):
            pass
    assert exc.value.code == 1008


def test_authorized_rider_and_admin_connections(client):
    """5. Assigned rider and admin/dispatcher roles can connect successfully."""
    del_id = helper_create_delivery(client)
    client.post(f"/api/deliveries/{del_id}/assign", json={"rider_id": "tech_ramesh"})

    # 1. Assigned rider connects
    with client.websocket_connect(f"/ws/deliveries/{del_id}/tracking?user_id=tech_ramesh&user_role=rider") as ws:
        msg = ws.receive_json()
        assert msg["event"] == "INITIAL_TRACKING_SNAPSHOT"
        assert msg["rider"]["id"] == "tech_ramesh"

    # 2. Dispatcher connects
    with client.websocket_connect(f"/ws/deliveries/{del_id}/tracking?user_id=dispatcher_1&user_role=dispatcher") as ws:
        msg = ws.receive_json()
        assert msg["event"] == "INITIAL_TRACKING_SNAPSHOT"


def test_unauthorized_rider_connection_rejected(client):
    """6. Rider not assigned to this delivery is rejected."""
    del_id = helper_create_delivery(client)
    client.post(f"/api/deliveries/{del_id}/assign", json={"rider_id": "tech_ramesh"})

    # tech_priya attempts to connect
    with pytest.raises(WebSocketDisconnect) as exc:
        with client.websocket_connect(f"/ws/deliveries/{del_id}/tracking?user_id=tech_priya&user_role=rider"):
            pass
    assert exc.value.code == 1008


def test_successful_location_event_broadcast(client):
    """7. Live GPS update is broadcast to subscribed WebSocket client with ETA and distance."""
    del_id = helper_create_delivery(client, customer_id="usr_cust_stream")
    client.post(f"/api/deliveries/{del_id}/assign", json={"rider_id": "tech_ramesh"})

    with client.websocket_connect(f"/ws/deliveries/{del_id}/tracking?user_id=usr_cust_stream&user_role=customer") as ws:
        snapshot = ws.receive_json()
        assert snapshot["event"] == "INITIAL_TRACKING_SNAPSHOT"

        # Rider reports new GPS position
        loc_res = client.post("/api/riders/tech_ramesh/location", json={
            "latitude": 12.9700,
            "longitude": 77.6350,
            "delivery_id": del_id,
            "speed_kmh": 32.0,
            "heading_degrees": 140.0
        })
        assert loc_res.status_code == 200

        # WebSocket receives RIDER_LOCATION_UPDATED event
        event = ws.receive_json()
        assert event["event"] == "RIDER_LOCATION_UPDATED"
        assert event["delivery_id"] == del_id
        assert event["rider"]["id"] == "tech_ramesh"
        assert event["rider"]["latitude"] == 12.9700
        assert event["rider"]["longitude"] == 77.6350
        assert event["rider"]["speed_kmh"] == 32.0
        assert event["rider"]["heading_degrees"] == 140.0
        assert event["distance_km"] is not None
        assert event["eta_minutes"] is not None


def test_event_isolation_across_multiple_deliveries(client):
    """8. Events from Delivery A are only sent to Delivery A subscribers, not Delivery B."""
    del_a = helper_create_delivery(client, order_id="ORD-DEL-A", customer_id="usr_cust_a")
    del_b = helper_create_delivery(client, order_id="ORD-DEL-B", customer_id="usr_cust_b")

    client.post(f"/api/deliveries/{del_a}/assign", json={"rider_id": "tech_ramesh"})
    client.post(f"/api/deliveries/{del_b}/assign", json={"rider_id": "tech_priya"})

    with client.websocket_connect(f"/ws/deliveries/{del_a}/tracking?user_id=usr_cust_a&user_role=customer") as ws_a:
        with client.websocket_connect(f"/ws/deliveries/{del_b}/tracking?user_id=usr_cust_b&user_role=customer") as ws_b:
            assert ws_a.receive_json()["event"] == "INITIAL_TRACKING_SNAPSHOT"
            assert ws_b.receive_json()["event"] == "INITIAL_TRACKING_SNAPSHOT"

            # Ingest location update for Delivery A
            client.post("/api/riders/tech_ramesh/location", json={
                "latitude": 12.9710,
                "longitude": 77.6360,
                "delivery_id": del_a,
                "speed_kmh": 25.0
            })

            # ws_a receives event for del_a
            event_a = ws_a.receive_json()
            assert event_a["event"] == "RIDER_LOCATION_UPDATED"
            assert event_a["delivery_id"] == del_a

            # Ingest location update for Delivery B
            client.post("/api/riders/tech_priya/location", json={
                "latitude": 12.9300,
                "longitude": 77.6400,
                "delivery_id": del_b,
                "speed_kmh": 28.0
            })

            # ws_b receives event for del_b
            event_b = ws_b.receive_json()
            assert event_b["event"] == "RIDER_LOCATION_UPDATED"
            assert event_b["delivery_id"] == del_b


def test_multiple_clients_watching_same_delivery(client):
    """9. Multiple subscribers watching the same delivery all receive the live broadcast."""
    del_id = helper_create_delivery(client, customer_id="usr_cust_multi")
    client.post(f"/api/deliveries/{del_id}/assign", json={"rider_id": "tech_ramesh"})

    # Client 1: Customer
    with client.websocket_connect(f"/ws/deliveries/{del_id}/tracking?user_id=usr_cust_multi&user_role=customer") as ws1:
        # Client 2: Dispatcher
        with client.websocket_connect(f"/ws/deliveries/{del_id}/tracking?user_id=disp_1&user_role=dispatcher") as ws2:
            assert ws1.receive_json()["event"] == "INITIAL_TRACKING_SNAPSHOT"
            assert ws2.receive_json()["event"] == "INITIAL_TRACKING_SNAPSHOT"

            assert realtime_manager.get_connection_count(del_id) == 2

            # Trigger GPS update
            client.post("/api/riders/tech_ramesh/location", json={
                "latitude": 12.9730,
                "longitude": 77.6370,
                "delivery_id": del_id
            })

            ev1 = ws1.receive_json()
            ev2 = ws2.receive_json()
            assert ev1["event"] == "RIDER_LOCATION_UPDATED"
            assert ev2["event"] == "RIDER_LOCATION_UPDATED"
            assert ev1["rider"]["latitude"] == 12.9730
            assert ev2["rider"]["latitude"] == 12.9730


def test_client_disconnect_cleanup(client):
    """10. Connection manager accurately tracks connection count and cleans up on disconnect."""
    del_id = helper_create_delivery(client, customer_id="usr_cust_cleanup")

    assert realtime_manager.get_connection_count(del_id) == 0

    with client.websocket_connect(f"/ws/deliveries/{del_id}/tracking?user_id=usr_cust_cleanup&user_role=customer") as ws:
        assert ws.receive_json()["event"] == "INITIAL_TRACKING_SNAPSHOT"
        assert realtime_manager.get_connection_count(del_id) == 1

    # After exiting with block, socket is closed
    assert realtime_manager.get_connection_count(del_id) == 0


def test_delivered_delivery_tracking_closure(client):
    """11. When delivery reaches delivered status, active WebSocket receives DELIVERY_COMPLETED event and closes."""
    del_id = helper_create_delivery(client, customer_id="usr_cust_done")
    client.post(f"/api/deliveries/{del_id}/assign", json={"rider_id": "tech_ramesh"})
    client.patch(f"/api/deliveries/{del_id}/status", json={"status": "picked_up"})
    client.patch(f"/api/deliveries/{del_id}/status", json={"status": "in_transit"})

    with client.websocket_connect(f"/ws/deliveries/{del_id}/tracking?user_id=usr_cust_done&user_role=customer") as ws:
        assert ws.receive_json()["event"] == "INITIAL_TRACKING_SNAPSHOT"

        # Complete delivery
        patch_res = client.patch(
            f"/api/deliveries/{del_id}/status",
            json={"status": "delivered", "proof_of_delivery": "OTP-8899"}
        )
        assert patch_res.status_code == 200

        # Client receives completion event
        event = ws.receive_json()
        assert event["event"] == "DELIVERY_COMPLETED"
        assert event["status"] == "delivered"


def test_connecting_to_already_delivered_delivery(client):
    """12. Connecting to an already delivered delivery sends snapshot, terminal event, and cleanly closes."""
    del_id = helper_create_delivery(client, customer_id="usr_cust_terminal")
    client.post(f"/api/deliveries/{del_id}/assign", json={"rider_id": "tech_ramesh"})
    client.patch(f"/api/deliveries/{del_id}/status", json={"status": "picked_up"})
    client.patch(f"/api/deliveries/{del_id}/status", json={"status": "in_transit"})
    client.patch(f"/api/deliveries/{del_id}/status", json={"status": "delivered", "proof_of_delivery": "OTP-1111"})

    with client.websocket_connect(f"/ws/deliveries/{del_id}/tracking?user_id=usr_cust_terminal&user_role=customer") as ws:
        # 1. Receives initial snapshot
        msg1 = ws.receive_json()
        assert msg1["event"] == "INITIAL_TRACKING_SNAPSHOT"
        assert msg1["status"] == "delivered"

        # 2. Receives terminal event
        msg2 = ws.receive_json()
        assert msg2["event"] == "DELIVERY_COMPLETED"
        assert msg2["status"] == "delivered"


def test_battery_telemetry_payload_compatibility(client):
    """13. Real-time broadcast incorporates optional battery telemetry if reported."""
    del_id = helper_create_delivery(client, customer_id="usr_cust_battery")
    client.post(f"/api/deliveries/{del_id}/assign", json={"rider_id": "tech_ramesh"})

    with client.websocket_connect(f"/ws/deliveries/{del_id}/tracking?user_id=usr_cust_battery&user_role=customer") as ws:
        ws.receive_json()

        # Send location update with battery metrics
        client.post("/api/riders/tech_ramesh/location", json={
            "latitude": 12.9710,
            "longitude": 77.6350,
            "delivery_id": del_id,
            "speed_kmh": 29.0,
            "heading_degrees": 90.0,
            "battery_soc_percent": 82.5,
            "battery_temperature_celsius": 33.0
        })

        event = ws.receive_json()
        assert event["event"] == "RIDER_LOCATION_UPDATED"
        assert event["battery"] is not None
        assert event["battery"]["soc_percent"] == 82.5
        assert event["battery"]["temperature_celsius"] == 33.0


def test_client_ping_pong_heartbeat(client):
    """14. Client ping receives pong heartbeat reply."""
    del_id = helper_create_delivery(client, customer_id="usr_cust_ping")

    with client.websocket_connect(f"/ws/deliveries/{del_id}/tracking?user_id=usr_cust_ping&user_role=customer") as ws:
        ws.receive_json()  # snapshot
        ws.send_text("ping")
        reply = ws.receive_text()
        assert reply == "pong"
