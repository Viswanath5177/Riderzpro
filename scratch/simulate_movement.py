"""Movement Simulator for Sathesh Ittraju on Vijayawada -> Amaravati route.
Reads actual backend road route_geometry, smoothly walks along the road polyline
by cumulative distance steps, calculates road heading/bearing on turns,
and sends live GPS telemetry pings to the backend API.
"""

import math
import time
import json
import urllib.request
from datetime import datetime

DELIVERY_ID = "delivery_vijayawada_amaravati_live"
RIDER_ID = "rider_sathesh"
BASE_URL = "http://127.0.0.1:8000"

def haversine_distance_meters(lat1, lon1, lat2, lon2):
    """Calculate great-circle distance between two points in meters."""
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)
    a = (
        math.sin(delta_phi / 2.0) ** 2
        + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2
    )
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return 6371000.0 * c

def calculate_bearing(lat1, lon1, lat2, lon2):
    """Calculate forward azimuth / bearing in degrees [0, 360)."""
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_lambda = math.radians(lon2 - lon1)

    y = math.sin(delta_lambda) * math.cos(phi2)
    x = math.cos(phi1) * math.sin(phi2) - math.sin(phi1) * math.cos(phi2) * math.cos(delta_lambda)
    bearing = math.degrees(math.atan2(y, x))
    return round((bearing + 360.0) % 360.0, 1)

def get_route_geometry():
    """Fetch full road route geometry directly from backend tracking API."""
    url = f"{BASE_URL}/api/deliveries/{DELIVERY_ID}/tracking"
    req = urllib.request.Request(url, headers={"X-User-Role": "admin"})
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode("utf-8"))
        raw_pts = data.get("route_geometry") or data.get("route_waypoints") or []
        coords = []
        for p in raw_pts:
            lat = p.get("lat") if p.get("lat") is not None else p.get("latitude")
            lng = p.get("lng") if p.get("lng") is not None else p.get("longitude")
            if lat is not None and lng is not None:
                coords.append((float(lat), float(lng)))
        print(f"Loaded {len(coords)} road geometry coordinates from backend for '{DELIVERY_ID}'")
        return coords

def send_gps_update(lat, lng, heading, speed_kmh=32.0):
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

def generate_road_trajectory(coords, step_meters=250.0):
    """Generate fine-grained intermediate coordinates by walking along the actual road polyline."""
    if len(coords) < 2:
        return []

    # 1. Compute cumulative distance at each vertex
    cum_dists = [0.0]
    for i in range(len(coords) - 1):
        d = haversine_distance_meters(coords[i][0], coords[i][1], coords[i+1][0], coords[i+1][1])
        cum_dists.append(cum_dists[-1] + d)

    total_len = cum_dists[-1]

    # 2. Sample target distances along the road network
    target_dists = []
    curr = 0.0
    while curr < total_len:
        target_dists.append(curr)
        curr += step_meters
    if not target_dists or target_dists[-1] < total_len:
        target_dists.append(total_len)

    # 3. For each target distance, locate the segment and interpolate along the road
    trajectory = []
    seg_idx = 0
    for td in target_dists:
        while seg_idx < len(cum_dists) - 2 and cum_dists[seg_idx + 1] < td:
            seg_idx += 1
        p1 = coords[seg_idx]
        p2 = coords[seg_idx + 1]
        seg_len = cum_dists[seg_idx + 1] - cum_dists[seg_idx]
        frac = 0.0 if seg_len < 1e-4 else (td - cum_dists[seg_idx]) / seg_len
        frac = max(0.0, min(1.0, frac))
        lat = p1[0] + frac * (p2[0] - p1[0])
        lng = p1[1] + frac * (p2[1] - p1[1])
        bearing = calculate_bearing(p1[0], p1[1], p2[0], p2[1])
        trajectory.append((lat, lng, bearing))

    return trajectory

def run_simulation(interval_sec=1.0, step_meters=250.0, loop=False):
    """Continuously stream rider movement along the road route."""
    coords = get_route_geometry()
    if not coords:
        print("No route geometry found! Please run python scratch/setup_live_test.py first.")
        return

    trajectory = generate_road_trajectory(coords, step_meters=step_meters)
    total_points = len(trajectory)
    print(f"Generated {total_points} road-following GPS steps across Vijayawada -> Amaravati route.")
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
    parser = argparse.ArgumentParser(description="Live road movement simulator for Sathesh Ittraju")
    parser.add_argument("--interval", type=float, default=1.0, help="Seconds between GPS pings")
    parser.add_argument("--step-meters", type=float, default=250.0, help="Meters to advance per step along road")
    parser.add_argument("--loop", action="store_true", help="Loop continuously")
    args = parser.parse_args()

    run_simulation(interval_sec=args.interval, step_meters=args.step_meters, loop=args.loop)
