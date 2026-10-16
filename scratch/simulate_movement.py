"""Configurable Movement Simulator for RiderzPro Logistics.

Simulates real rider movement along the OSRM road polyline for active deliveries.
Pipeline:
  simulate_movement.py
    → POST /api/riders/{rider_id}/location
    → FastAPI
    → LocationTrackingService
    → Geofence & Route Deviation evaluation
    → WebSocket broadcast (/ws/deliveries/{delivery_id}/tracking)
    → Customer DeliveryMap

Near the dropoff destination, drops within 500m (RIDER_APPROACHING)
and 50m (RIDER_ARRIVED) to trigger real backend geofence events.
"""

import math
import time
import json
import urllib.request
import argparse
from datetime import datetime

DEFAULT_DELIVERY_ID = "delivery_noida_delhi_001"
DEFAULT_RIDER_ID = "rider_001"
DEFAULT_DURATION = 180.0  # ~3 minutes target runtime
DEFAULT_INTERVAL = 5.0    # 5 seconds between pings
DEFAULT_BASE_URL = "http://127.0.0.1:8000"


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


def get_route_geometry(base_url, delivery_id):
    """Fetch full road route geometry directly from backend tracking API."""
    url = f"{base_url}/api/deliveries/{delivery_id}/tracking"
    req = urllib.request.Request(url, headers={"X-User-Role": "admin"})
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            raw_pts = data.get("route_geometry") or data.get("route_waypoints") or []
            coords = []
            for p in raw_pts:
                lat = p.get("lat") if p.get("lat") is not None else p.get("latitude")
                lng = p.get("lng") if p.get("lng") is not None else p.get("longitude")
                if lat is not None and lng is not None:
                    coords.append((float(lat), float(lng)))
            dropoff = data.get("dropoff") or {}
            dropoff_lat = dropoff.get("latitude")
            dropoff_lng = dropoff.get("longitude")
            print(f"Loaded {len(coords)} road geometry coordinates for delivery '{delivery_id}'")
            return coords, (float(dropoff_lat), float(dropoff_lng)) if dropoff_lat and dropoff_lng else None
    except Exception as e:
        print(f"Error fetching route for '{delivery_id}': {e}")
        return [], None


def send_gps_update(base_url, rider_id, delivery_id, lat, lng, heading, speed_kmh=32.0):
    """Post GPS coordinate update for the specified rider and delivery."""
    payload = {
        "latitude": round(lat, 6),
        "longitude": round(lng, 6),
        "speed_kmh": round(speed_kmh, 1),
        "heading_degrees": round(heading, 1),
        "delivery_id": delivery_id,
        "timestamp": datetime.utcnow().isoformat()
    }
    req = urllib.request.Request(
        f"{base_url}/api/riders/{rider_id}/location",
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "X-User-Id": rider_id,
            "X-User-Role": "rider"
        },
        method="POST"
    )
    try:
        with urllib.request.urlopen(req) as resp:
            return resp.status == 200
    except Exception as e:
        print(f"Error sending GPS for {rider_id}: {e}")
        return False


def generate_road_trajectory(coords, num_steps=36, step_meters=None):
    """
    Generate fine-grained intermediate coordinates by walking along the actual road polyline.
    If step_meters is given, step by that distance. Otherwise step evenly across num_steps.
    """
    if len(coords) < 2:
        return []

    # 1. Compute cumulative distance at each vertex
    cum_dists = [0.0]
    for i in range(len(coords) - 1):
        d = haversine_distance_meters(coords[i][0], coords[i][1], coords[i+1][0], coords[i+1][1])
        cum_dists.append(cum_dists[-1] + d)

    total_len = cum_dists[-1]

    # 2. Determine target distances along the road network
    target_dists = []
    if step_meters and step_meters > 0:
        curr = 0.0
        while curr < total_len:
            target_dists.append(curr)
            curr += step_meters
        if not target_dists or target_dists[-1] < total_len:
            target_dists.append(total_len)
    else:
        # Divide into num_steps evenly
        steps = max(2, int(num_steps))
        target_dists = [total_len * (i / (steps - 1)) for i in range(steps)]

    # 3. For each target distance, interpolate along segment
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


def run_simulation(
    delivery_id=DEFAULT_DELIVERY_ID,
    rider_id=DEFAULT_RIDER_ID,
    duration=DEFAULT_DURATION,
    interval=DEFAULT_INTERVAL,
    step_meters=None,
    loop=False,
    base_url=DEFAULT_BASE_URL
):
    """Continuously stream rider movement along the road route."""
    coords, dropoff_pt = get_route_geometry(base_url, delivery_id)
    if not coords:
        print(f"No route geometry found for '{delivery_id}'. Please run python scratch/setup_live_test.py first.")
        return

    # Calculate number of steps based on duration and interval
    if duration and interval and duration > 0 and interval > 0:
        num_steps = max(2, int(math.ceil(duration / interval)) + 1)
    else:
        num_steps = 37

    trajectory = generate_road_trajectory(coords, num_steps=num_steps, step_meters=step_meters)
    total_points = len(trajectory)

    print(f"\n=======================================================")
    print(f"RiderzPro Live GPS Movement Simulator")
    print(f"Delivery:  {delivery_id}")
    print(f"Rider:     {rider_id}")
    print(f"Steps:     {total_points} pings")
    print(f"Interval:  {interval:.1f}s (Est. Duration: ~{(total_points * interval) / 60.0:.1f} min)")
    print(f"Target:    {base_url}/api/riders/{rider_id}/location")
    print(f"=======================================================\n")

    iteration = 0
    while True:
        iteration += 1
        for idx, (lat, lng, heading) in enumerate(trajectory):
            pct = round((idx / (total_points - 1)) * 100.0, 1)
            dist_to_drop = None
            if dropoff_pt:
                dist_to_drop = haversine_distance_meters(lat, lng, dropoff_pt[0], dropoff_pt[1])

            # Calculate realistic instantaneous speed (~28-36 km/h)
            speed = 32.0 + 3.0 * math.sin(idx * 0.4)
            success = send_gps_update(base_url, rider_id, delivery_id, lat, lng, heading, speed_kmh=speed)
            status_str = "OK" if success else "ERR"

            alert_str = ""
            if dist_to_drop is not None:
                if dist_to_drop <= 50.0:
                    alert_str = " [ARRIVED <= 50m]"
                elif dist_to_drop <= 500.0:
                    alert_str = " [APPROACHING <= 500m]"

            print(
                f"[{status_str}] Step {idx + 1:2d}/{total_points:2d} ({pct:5.1f}%): "
                f"Lat={lat:.5f}, Lng={lng:.5f}, Heading={heading:5.1f}°, Speed={speed:.1f}km/h{alert_str}"
            )
            time.sleep(interval)

        if not loop:
            print(f"\nSimulation complete: {rider_id} reached destination for delivery {delivery_id}.")
            break
        print("\nRestarting route loop...\n")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Live OSRM road movement simulator for RiderzPro Logistics")
    parser.add_argument("--delivery-id", type=str, default=DEFAULT_DELIVERY_ID, help="Delivery ID or Order ID to track")
    parser.add_argument("--rider-id", type=str, default=DEFAULT_RIDER_ID, help="Rider entity ID")
    parser.add_argument("--duration", type=float, default=DEFAULT_DURATION, help="Total simulation duration in seconds (~180s = 3 min)")
    parser.add_argument("--interval", type=float, default=DEFAULT_INTERVAL, help="Seconds between GPS pings (default: 5.0)")
    parser.add_argument("--step-meters", type=float, default=None, help="Optional fixed meters to advance per step along road")
    parser.add_argument("--loop", action="store_true", help="Loop continuously")
    parser.add_argument("--base-url", type=str, default=DEFAULT_BASE_URL, help="FastAPI Base URL")
    args = parser.parse_args()

    run_simulation(
        delivery_id=args.delivery_id,
        rider_id=args.rider_id,
        duration=args.duration,
        interval=args.interval,
        step_meters=args.step_meters,
        loop=args.loop,
        base_url=args.base_url
    )
