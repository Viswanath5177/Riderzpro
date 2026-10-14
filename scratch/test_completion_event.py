import asyncio
import json
import urllib.request
import websockets
from datetime import datetime

BASE_URL = "http://127.0.0.1:8000"

def create_delivery():
    payload = {
        "order_id": "ORD-TEST-COMPLETION",
        "customer_id": "cust_demo",
        "customer_name": "Test User",
        "vendor_id": "vnd_nexgen_ev",
        "pickup_address": "Indiranagar Hub, Bengaluru",
        "pickup_lat": 12.9719,
        "pickup_lng": 77.6412,
        "dropoff_address": "Whitefield, Bengaluru",
        "dropoff_lat": 12.9550,
        "dropoff_lng": 77.7200,
        "package_weight_kg": 5.0,
        "priority": "standard"
    }
    req = urllib.request.Request(
        f"{BASE_URL}/api/deliveries",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode("utf-8"))["id"]

def assign_and_progress(delivery_id):
    # Assign
    req = urllib.request.Request(
        f"{BASE_URL}/api/deliveries/{delivery_id}/assign",
        data=json.dumps({"rider_id": "tech_priya"}).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    urllib.request.urlopen(req)

    # Picked up
    req = urllib.request.Request(
        f"{BASE_URL}/api/deliveries/{delivery_id}/status",
        data=json.dumps({"status": "picked_up"}).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="PATCH"
    )
    urllib.request.urlopen(req)

    # In transit
    req = urllib.request.Request(
        f"{BASE_URL}/api/deliveries/{delivery_id}/status",
        data=json.dumps({"status": "in_transit"}).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="PATCH"
    )
    urllib.request.urlopen(req)

def complete_delivery(delivery_id):
    req = urllib.request.Request(
        f"{BASE_URL}/api/deliveries/{delivery_id}/status",
        data=json.dumps({
            "status": "delivered",
            "proof_of_delivery": "OTP-8899-VERIFIED",
            "reason": "Package delivered to customer"
        }).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="PATCH"
    )
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode("utf-8"))

async def test_completion():
    del_id = create_delivery()
    print("Created test delivery:", del_id)
    assign_and_progress(del_id)
    
    ws_url = f"ws://127.0.0.1:8000/ws/deliveries/{del_id}/tracking?user_id=cust_demo&user_role=customer"
    async with websockets.connect(ws_url) as ws:
        snapshot = json.loads(await ws.recv())
        print("Connected, snapshot received for:", snapshot.get("delivery_id"))
        
        # Complete delivery
        print("Completing delivery...")
        complete_delivery(del_id)
        
        # Wait for DELIVERY_COMPLETED
        completed_event = False
        while True:
            try:
                msg = json.loads(await asyncio.wait_for(ws.recv(), timeout=5.0))
                print("WS received:", msg.get("event"), msg.get("status"))
                if msg.get("event") == "DELIVERY_COMPLETED":
                    completed_event = True
                    break
            except Exception as e:
                print("Connection closed / timeout:", e)
                break
        
        print("DELIVERY_COMPLETED test result:", "PASS" if completed_event else "FAIL")

if __name__ == "__main__":
    asyncio.run(test_completion())
