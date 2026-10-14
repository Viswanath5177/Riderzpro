import urllib.request
import json
import sys, os
from datetime import datetime

sys.path.insert(0, os.getcwd())
from logistics.geofence import geofence_service
from logistics.route_deviation import route_deviation_service

# Reset milestone states so approaching triggers cleanly
geofence_service.reset_delivery("ord_demo_battery")
route_deviation_service.reset_delivery("ord_demo_battery")

# Dropoff is at 12.9352, 77.6245. 12.9375, 77.6255 is ~270m away (<500m, >50m)
payload = {
    "latitude": 12.9375,
    "longitude": 77.6255,
    "speed_kmh": 22.0,
    "heading_degrees": 180.0,
    "delivery_id": "ord_demo_battery",
    "timestamp": datetime.utcnow().isoformat()
}

req = urllib.request.Request(
    "http://127.0.0.1:8000/api/riders/tech_ramesh/location",
    data=json.dumps(payload).encode("utf-8"),
    headers={"Content-Type": "application/json"},
    method="POST"
)

with urllib.request.urlopen(req) as resp:
    print("Approaching location set:", resp.status)
