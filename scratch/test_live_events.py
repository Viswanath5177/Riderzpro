import asyncio
import json
import urllib.request
import websockets
from datetime import datetime

DELIVERY_ID = "ord_demo_battery"
RIDER_ID = "tech_ramesh"
BASE_URL = "http://127.0.0.1:8000"
WS_URL = f"ws://127.0.0.1:8000/ws/deliveries/{DELIVERY_ID}/tracking?user_id=cust_demo&user_role=customer"

def send_location(lat, lng, speed=25.0, heading=90.0):
    payload = {
        "latitude": lat,
        "longitude": lng,
        "speed_kmh": speed,
        "heading_degrees": heading,
        "delivery_id": DELIVERY_ID,
        "timestamp": datetime.utcnow().isoformat()
    }
    req = urllib.request.Request(
        f"{BASE_URL}/api/riders/{RIDER_ID}/location",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode("utf-8"))

async def test_live_pipeline():
    results = {}
    print(f"Connecting to WebSocket: {WS_URL}...")
    async with websockets.connect(WS_URL) as ws:
        # 1. Snapshot
        raw_snapshot = await ws.recv()
        snapshot = json.loads(raw_snapshot)
        print("1. Snapshot received:", snapshot.get("event"), "Status:", snapshot.get("status"))
        results["INITIAL_TRACKING_SNAPSHOT"] = snapshot.get("event") == "INITIAL_TRACKING_SNAPSHOT"

        # 2. Test Live Rider Movement
        print("2. Sending live location update (12.9500, 77.6300)...")
        send_location(12.9500, 77.6300, speed=28.0, heading=110.0)
        
        while True:
            msg = json.loads(await asyncio.wait_for(ws.recv(), timeout=5.0))
            print("   WS received:", msg.get("event"))
            if msg.get("event") == "RIDER_LOCATION_UPDATED":
                results["RIDER_LOCATION_UPDATED"] = (
                    msg.get("rider", {}).get("latitude") == 12.9500 and
                    msg.get("rider", {}).get("longitude") == 77.6300
                )
                break

        # 3. Test Route Deviation (>250m away from route)
        print("3. Sending deviated location (12.9900, 77.7000, ~7km off route)...")
        send_location(12.9900, 77.7000, speed=30.0, heading=45.0)

        deviation_received = False
        start_time = asyncio.get_event_loop().time()
        while asyncio.get_event_loop().time() - start_time < 5.0:
            try:
                msg = json.loads(await asyncio.wait_for(ws.recv(), timeout=3.0))
                print("   WS received:", msg.get("event"))
                if msg.get("event") == "RIDER_ROUTE_DEVIATION":
                    deviation_received = True
                    results["RIDER_ROUTE_DEVIATION"] = True
                    break
            except asyncio.TimeoutError:
                break
        results["RIDER_ROUTE_DEVIATION"] = deviation_received

        # Reset location back to near dropoff before geofence tests
        print("4. Sending approaching location (12.9375, 77.6255, ~270m to dropoff)...")
        send_location(12.9375, 77.6255, speed=20.0, heading=180.0)

        approaching_received = False
        start_time = asyncio.get_event_loop().time()
        while asyncio.get_event_loop().time() - start_time < 5.0:
            try:
                msg = json.loads(await asyncio.wait_for(ws.recv(), timeout=3.0))
                print("   WS received:", msg.get("event"))
                if msg.get("event") == "RIDER_APPROACHING":
                    approaching_received = True
                    results["RIDER_APPROACHING"] = True
                    break
            except asyncio.TimeoutError:
                break
        results["RIDER_APPROACHING"] = approaching_received

        # 5. Test Arrived (<50m to dropoff: dropoff is 12.9352, 77.6245)
        print("5. Sending arrived location (12.93525, 77.62452, ~6m to dropoff)...")
        send_location(12.93525, 77.62452, speed=5.0, heading=180.0)

        arrived_received = False
        start_time = asyncio.get_event_loop().time()
        while asyncio.get_event_loop().time() - start_time < 5.0:
            try:
                msg = json.loads(await asyncio.wait_for(ws.recv(), timeout=3.0))
                print("   WS received:", msg.get("event"))
                if msg.get("event") == "RIDER_ARRIVED":
                    arrived_received = True
                    results["RIDER_ARRIVED"] = True
                    break
            except asyncio.TimeoutError:
                break
        results["RIDER_ARRIVED"] = arrived_received

    print("\n--- Summary of Live Telemetry Events ---")
    for k, v in results.items():
        print(f"{k}: {'PASS' if v else 'FAIL'}")

if __name__ == "__main__":
    asyncio.run(test_live_pipeline())
