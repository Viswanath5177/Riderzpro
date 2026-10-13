"""Temporary Movement Simulator for Sathesh Ittraju on Vijayawada -> Amaravati route.
Reads actual backend route_waypoints, smoothly interpolates intermediate GPS coordinates,
calculates heading/bearing, and sends live GPS pings to the backend API.
"""

import math
import time
import json
import urllib.request
from datetime import datetime

DELIVERY_ID = "delivery_vijayawada_amaravati_live"
RIDER_ID = "rider_sathesh"
BASE_URL = "http://127.0.0.1:8000"

def calculate_bearing(lat1, lon1, lat2, lon2):
    """Calculate forward azimuth / bearing in degrees [0, 360)."""
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_lambda = math.radians(lon2 - lon1)

    y = math.sin(delta_lambda) * math.cos(phi2)
    x = math.cos(phi1) * math.sin(phi2) - math.sin(phi1) * math.cos(phi2) * math.cos(delta_lambda)
    bearing = math.degrees(math.atan2(y, x))
    return round((bearing + 360.0) % 360.0, 1)

def get_route_waypoints():
    """Fetch canonical waypoints directly from backend tracking API."""
    url = f"{BASE_URL}/api/deliveries/{DELIVERY_ID}/tracking"
    req = urllib.request.Request(url, headers={"X-User-Role": "admin"})
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode("utf-8"))
        waypoints = data.get("route_waypoints") or []
        print(f"Loaded {len(waypoints)} route waypoints from backend for delivery '{DELIVERY_ID}'")
        return waypoints

def send_gps_update(lat, lng, heading, speed_kmh=30.0):
    """Post GPS coordinate update for rider Sathesh Ittraju."""
    payload = {
        "latitude": round(lat, 6),
        "longitude": round(lng, 6),
        "speed_kmh": round(speed_kmh, 1),
        "heading_degrees": round(heading, 1),
        "delivery_id": DELIVERY_ID,
        "timestamp": datetime.utcnow().isoformat()
    }
    req = urllib.request.Request(
        f"{BASE_URL}/api/riders/{RIDER_ID}/location",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    try:
        with urllib.request.urlopen(req) as resp:
            return resp.status == 200
    except Exception as e:
        print(f"Error sending GPS: {e}")
        return False

def generate_interpolated_trajectory(waypoints, steps_per_segment=10):
    """Generate fine-grained intermediate coordinates along route corridor."""
    trajectory = []
    if len(waypoints) < 2:
        return trajectory

    for i in range(len(waypoints) - 1):
        p1 = waypoints[i]
        p2 = waypoints[i + 1]
        lat1, lng1 = p1["lat"], p1["lng"]
        lat2, lng2 = p2["lat"], p2["lng"]
        bearing = calculate_bearing(lat1, lng1, lat2, lng2)

        for step in range(steps_per_segment):
            fraction = step / float(steps_per_segment)
            interp_lat = lat1 + fraction * (lat2 - lat1)
            interp_lng = lng1 + fraction * (lng2 - lng1)
            trajectory.append((interp_lat, interp_lng, bearing))

    # Add final destination waypoint
    dest = waypoints[-1]
    last_bearing = trajectory[-1][2] if trajectory else 0.0
    trajectory.append((dest["lat"], dest["lng"], last_bearing))
    return trajectory

def run_simulation(interval_sec=1.0, steps_per_segment=8, loop=False):
    """Continuously stream rider movement along route."""
    waypoints = get_route_waypoints()
    if not waypoints:
        print("No waypoints found!")
        return

    trajectory = generate_interpolated_trajectory(waypoints, steps_per_segment=steps_per_segment)
    total_points = len(trajectory)
    print(f"Generated {total_points} interpolated GPS steps across Vijayawada -> Amaravati route.")
    print(f"Streaming live updates every {interval_sec}s for Sathesh Ittraju...\n")

    iteration = 0
    while True:
        iteration += 1
        for idx, (lat, lng, heading) in enumerate(trajectory):
            pct = round((idx / (total_points - 1)) * 100.0, 1)
            success = send_gps_update(lat, lng, heading, speed_kmh=32.0)
            status_str = "OK" if success else "ERR"
            print(f"[{status_str}] Step {idx + 1}/{total_points} ({pct:5.1f}%): Lat={lat:.5f}, Lng={lng:.5f}, Heading={heading:5.1f}°")
            time.sleep(interval_sec)

        if not loop:
            print("\nSimulation reached final destination at Amaravati Secretariat.")
            break
        print("\nRestarting route loop...\n")

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Live movement simulator for Sathesh Ittraju")
    parser.add_argument("--interval", type=float, default=1.0, help="Seconds between GPS pings")
    parser.add_argument("--steps", type=int, default=8, help="Interpolation points per waypoint segment")
    parser.add_argument("--loop", action="store_true", help="Loop continuously")
    args = parser.parse_args()

    run_simulation(interval_sec=args.interval, steps_per_segment=args.steps, loop=args.loop)
