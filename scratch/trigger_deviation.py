import urllib.request
import json
from datetime import datetime

payload = {
    "latitude": 12.9900,
    "longitude": 77.7000,
    "speed_kmh": 32.0,
    "heading_degrees": 45.0,
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
    print("Deviation update response:", resp.status, resp.read().decode("utf-8"))
