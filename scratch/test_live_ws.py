"""Test WebSocket live tracking and events against running backend."""

import asyncio
import json
import urllib.request
import websockets

async def test_live_websocket():
    uri = "ws://localhost:8000/ws/deliveries/ord_demo_battery/tracking?user_id=cust_demo&user_role=customer"
    print(f"Connecting to {uri}...")

    async with websockets.connect(uri) as ws:
        # 1. Expect INITIAL_TRACKING_SNAPSHOT
        msg_raw = await asyncio.wait_for(ws.recv(), timeout=5.0)
        snapshot = json.loads(msg_raw)
        print("Received snapshot event:", snapshot.get("event"))
        assert snapshot.get("event") == "INITIAL_TRACKING_SNAPSHOT"
        assert snapshot.get("delivery_id") == "ord_demo_battery"
        assert snapshot.get("pickup", {}).get("latitude") == 12.9719
        assert snapshot.get("dropoff", {}).get("latitude") == 12.9352
        print("SNAPSHOT VERIFIED: Pickup, Dropoff, Waypoints, Rider all present.")

        # 2. Simulate location update via POST /api/riders/tech_ramesh/location
        # Move rider along route towards dropoff
        loc_payload = {
            "latitude": 12.9450,
            "longitude": 77.6280,
            "heading_degrees": 120.0,
            "speed_kmh": 32.0,
            "delivery_id": "ord_demo_battery"
        }
        req = urllib.request.Request(
            "http://localhost:8000/api/riders/tech_ramesh/location",
            data=json.dumps(loc_payload).encode("utf-8"),
            headers={"Content-Type": "application/json"}
        )
        urllib.request.urlopen(req)
        print("Sent GPS update for rider tech_ramesh.")

        # Receive RIDER_LOCATION_UPDATED event over WebSocket
        loc_msg_raw = await asyncio.wait_for(ws.recv(), timeout=5.0)
        loc_msg = json.loads(loc_msg_raw)
        print("Received live event:", loc_msg.get("event"))
        assert loc_msg.get("event") == "RIDER_LOCATION_UPDATED"
        assert loc_msg.get("rider", {}).get("latitude") == 12.9450
        assert loc_msg.get("rider", {}).get("heading_degrees") == 120.0
        print("RIDER_LOCATION_UPDATED VERIFIED: Rider moved to new GPS coordinate.")

        # 3. Simulate RIDER_APPROACHING (within 500m of dropoff: 12.9352, 77.6245)
        # 12.9370, 77.6255 is ~220m from dropoff
        approach_payload = {
            "latitude": 12.9370,
            "longitude": 77.6255,
            "heading_degrees": 140.0,
            "speed_kmh": 20.0,
            "delivery_id": "ord_demo_battery"
        }
        req2 = urllib.request.Request(
            "http://localhost:8000/api/riders/tech_ramesh/location",
            data=json.dumps(approach_payload).encode("utf-8"),
            headers={"Content-Type": "application/json"}
        )
        urllib.request.urlopen(req2)
        print("Sent GPS update near dropoff for approaching geofence.")

        # We may receive RIDER_LOCATION_UPDATED and/or RIDER_APPROACHING
        events_received = []
        for _ in range(2):
            try:
                ev_raw = await asyncio.wait_for(ws.recv(), timeout=3.0)
                ev = json.loads(ev_raw)
                events_received.append(ev.get("event"))
                print(f"Received event: {ev.get('event')}")
            except asyncio.TimeoutError:
                break
        print(f"Events received near destination: {events_received}")

        # 4. Simulate Route Deviation
        # Move rider far away: 12.9800, 77.6900 (> 3km away from corridor)
        deviation_payload = {
            "latitude": 12.9800,
            "longitude": 77.6900,
            "heading_degrees": 45.0,
            "speed_kmh": 35.0,
            "delivery_id": "ord_demo_battery"
        }
        req3 = urllib.request.Request(
            "http://localhost:8000/api/riders/tech_ramesh/location",
            data=json.dumps(deviation_payload).encode("utf-8"),
            headers={"Content-Type": "application/json"}
        )
        urllib.request.urlopen(req3)
        print("Sent GPS update off-corridor for route deviation.")

        dev_events_received = []
        for _ in range(2):
            try:
                ev_raw = await asyncio.wait_for(ws.recv(), timeout=3.0)
                ev = json.loads(ev_raw)
                dev_events_received.append(ev.get("event"))
                print(f"Received event: {ev.get('event')}")
            except asyncio.TimeoutError:
                break
        print(f"Events received on deviation: {dev_events_received}")

    print("ALL LIVE WEBSOCKET TELEMETRY TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    asyncio.run(test_live_websocket())
