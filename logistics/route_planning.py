"""Route planning service, coordinate validation, and distance/duration providers."""

import math
import os
import json
import logging
from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from logistics.models import Delivery, DeliveryRoute

logger = logging.getLogger("riderzpro.route_planning")

EARTH_RADIUS_KM = 6371.0

# Road network detour factor (actual road route vs great-circle flight distance)
DEFAULT_DETOUR_FACTOR = 1.25

# Average vehicle speeds in urban Indian traffic conditions (km/h)
SPEED_PROFILES = {
    "regular_bike": 18.0,
    "electric_bike": 28.0,
    "cargo_ebike": 24.0,
    "van": 32.0,
}

# Average energy consumption per km for EV vehicles (kWh/km)
ENERGY_CONSUMPTION_PROFILES = {
    "regular_bike": 0.0,
    "electric_bike": 0.022,
    "cargo_ebike": 0.035,
    "van": 0.180,
}


def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate the great-circle distance between two points in kilometers."""
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = (
        math.sin(delta_phi / 2.0) ** 2
        + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2
    )
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return EARTH_RADIUS_KM * c


class RoutingProvider(ABC):
    """Abstract interface for route calculation providers."""

    @abstractmethod
    def calculate_route(
        self,
        origin_lat: float,
        origin_lng: float,
        dest_lat: float,
        dest_lng: float,
        vehicle_type: str = "electric_bike"
    ) -> Dict[str, Any]:
        """Compute route distance (km), duration (minutes), and waypoints."""
        pass


class HaversineRoutingProvider(RoutingProvider):
    """Deterministic, local routing engine using Haversine with urban road detour adjustments."""

    def calculate_route(
        self,
        origin_lat: float,
        origin_lng: float,
        dest_lat: float,
        dest_lng: float,
        vehicle_type: str = "electric_bike"
    ) -> Dict[str, Any]:
        straight_km = haversine_distance(origin_lat, origin_lng, dest_lat, dest_lng)
        road_distance_km = round(straight_km * DEFAULT_DETOUR_FACTOR, 2)

        speed_kmh = SPEED_PROFILES.get(vehicle_type, 28.0)
        # Duration in minutes = (distance / speed) * 60 + 5 minutes fixed pickup buffer
        duration_mins = round((road_distance_km / speed_kmh) * 60.0 + 5.0, 1)

        energy_per_km = ENERGY_CONSUMPTION_PROFILES.get(vehicle_type, 0.022)
        total_energy_kwh = round(road_distance_km * energy_per_km, 3)

        # Generate intermediate interpolated waypoints for GPS tracking
        steps = 5
        waypoints = []
        for i in range(steps + 1):
            fraction = i / steps
            wp_lat = origin_lat + fraction * (dest_lat - origin_lat)
            wp_lng = origin_lng + fraction * (dest_lng - origin_lng)
            waypoints.append({
                "step": i,
                "lat": round(wp_lat, 6),
                "lng": round(wp_lng, 6),
                "eta_minute_offset": round(duration_mins * fraction, 1)
            })

        return {
            "provider": "haversine_builtin",
            "distance_km": road_distance_km,
            "duration_minutes": duration_mins,
            "energy_consumption_kwh": total_energy_kwh,
            "waypoints": waypoints,
            "geometry": [
                {"lat": wp["lat"], "lng": wp["lng"], "latitude": wp["lat"], "longitude": wp["lng"]}
                for wp in waypoints
            ],
            "status": "success"
        }


DEFAULT_OSRM_URL = "https://router.project-osrm.org"


class OSRMRoutingProvider(RoutingProvider):
    """OSRM (Open Source Routing Machine) external API integration with graceful fallback."""

    def __init__(self, api_url: Optional[str] = None):
        self.api_url = api_url or os.getenv("OSRM_API_URL") or DEFAULT_OSRM_URL
        self.fallback = HaversineRoutingProvider()

    def calculate_route(
        self,
        origin_lat: float,
        origin_lng: float,
        dest_lat: float,
        dest_lng: float,
        vehicle_type: str = "electric_bike"
    ) -> Dict[str, Any]:
        if not self.api_url:
            res = self.fallback.calculate_route(origin_lat, origin_lng, dest_lat, dest_lng, vehicle_type)
            res["provider"] = "haversine_fallback (no OSRM url configured)"
            return res

        try:
            import requests
            url = f"{self.api_url.rstrip('/')}/route/v1/driving/{origin_lng},{origin_lat};{dest_lng},{dest_lat}?overview=full&geometries=geojson&steps=true"
            response = requests.get(url, timeout=5.0)
            if response.status_code == 200:
                data = response.json()
                routes = data.get("routes", [])
                if routes:
                    route = routes[0]
                    distance_km = round(route.get("distance", 0) / 1000.0, 2)
                    duration_mins = round(route.get("duration", 0) / 60.0, 1)
                    coordinates = route.get("geometry", {}).get("coordinates", [])
                    # In GeoJSON coordinates are [lng, lat]
                    geometry = [
                        {
                            "lat": round(c[1], 6),
                            "lng": round(c[0], 6),
                            "latitude": round(c[1], 6),
                            "longitude": round(c[0], 6)
                        }
                        for c in coordinates
                    ]

                    legs = route.get("legs", [])
                    steps = legs[0].get("steps", []) if legs else []
                    if steps:
                        waypoints = []
                        for idx, s in enumerate(steps):
                            maneuver = s.get("maneuver", {})
                            loc = maneuver.get("location", [0, 0])
                            waypoints.append({
                                "step": idx,
                                "lat": round(loc[1], 6),
                                "lng": round(loc[0], 6),
                                "latitude": round(loc[1], 6),
                                "longitude": round(loc[0], 6),
                                "name": s.get("name", ""),
                                "instruction": maneuver.get("type", "") + (" " + maneuver.get("modifier", "") if maneuver.get("modifier") else ""),
                                "distance_meters": s.get("distance", 0),
                                "duration_seconds": s.get("duration", 0)
                            })
                    else:
                        waypoints = [
                            {
                                "step": idx,
                                "lat": g["lat"],
                                "lng": g["lng"],
                                "latitude": g["lat"],
                                "longitude": g["lng"]
                            }
                            for idx, g in enumerate(geometry)
                        ]

                    energy_per_km = ENERGY_CONSUMPTION_PROFILES.get(vehicle_type, 0.022)
                    return {
                        "provider": "osrm_external",
                        "distance_km": distance_km,
                        "duration_minutes": duration_mins,
                        "energy_consumption_kwh": round(distance_km * energy_per_km, 3),
                        "waypoints": waypoints,
                        "geometry": geometry,
                        "status": "success"
                    }
        except Exception as e:
            logger.warning(f"OSRM route calculation failed ({e}), falling back to Haversine.")

        res = self.fallback.calculate_route(origin_lat, origin_lng, dest_lat, dest_lng, vehicle_type)
        res["provider"] = "haversine_fallback (OSRM unreachable)"
        return res


class RoutePlanningService:
    """Service orchestrating route distance, duration, and persistence."""

    def __init__(self):
        self.providers = {
            "osrm": OSRMRoutingProvider(),
            "haversine_builtin": HaversineRoutingProvider(),
            "google_maps": HaversineRoutingProvider(),  # Safe fallback default
        }

    def get_provider(self, name: str) -> RoutingProvider:
        return self.providers.get(name.lower(), self.providers["osrm"])

    def plan_route_for_delivery(
        self,
        db: Session,
        delivery: Delivery,
        provider_name: str = "osrm",
        vehicle_type: Optional[str] = None
    ) -> DeliveryRoute:
        """Calculate and persist an optimized route for a specific delivery task."""
        if not vehicle_type:
            vehicle_type = delivery.assigned_rider.vehicle_type if delivery.assigned_rider else "electric_bike"

        provider = self.get_provider(provider_name)
        result = provider.calculate_route(
            origin_lat=delivery.pickup_lat,
            origin_lng=delivery.pickup_lng,
            dest_lat=delivery.dropoff_lat,
            dest_lng=delivery.dropoff_lng,
            vehicle_type=vehicle_type
        )

        payload = {
            "waypoints": result.get("waypoints", []),
            "geometry": result.get("geometry", result.get("waypoints", [])),
        }

        route_record = DeliveryRoute(
            delivery_id=delivery.id,
            rider_id=delivery.assigned_rider_id,
            provider=result["provider"],
            distance_km=result["distance_km"],
            duration_minutes=result["duration_minutes"],
            energy_consumption_kwh=result["energy_consumption_kwh"],
            waypoints_json=json.dumps(payload)
        )
        db.add(route_record)
        db.commit()
        db.refresh(route_record)
        return route_record
