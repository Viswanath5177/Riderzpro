"""Route deviation detection service for Riderzpro delivery tracking.

Evaluates whether a rider's active GPS coordinates have deviated beyond a configurable
corridor distance from the planned delivery route waypoints.
"""

import os
import json
import math
import logging
from datetime import datetime
from typing import Dict, Any, List, Optional, Tuple, Union

from logistics.route_planning import haversine_distance
from logistics.models import Delivery

logger = logging.getLogger("riderzpro.route_deviation")

# Configurable Default Route Deviation Threshold (in meters)
DEFAULT_ROUTE_DEVIATION_DISTANCE_METERS: float = float(
    os.getenv("ROUTE_DEVIATION_DISTANCE_METERS", "250.0")
)

# Canonical Event Name
EVENT_RIDER_ROUTE_DEVIATION = "RIDER_ROUTE_DEVIATION"

# Delivery states eligible for route deviation evaluation
ACTIVE_DEVIATION_STATUSES = {"assigned", "picked_up", "in_transit"}


def extract_route_coordinates(waypoints: Any) -> List[Tuple[float, float]]:
    """
    Safely extract a list of (latitude, longitude) float tuples from arbitrary waypoint representations.
    Handles:
    - Lists of dictionaries with 'lat'/'lng' or 'latitude'/'longitude'
    - Lists of lists or tuples [lat, lng]
    - JSON-encoded strings representing any of the above
    - Objects with .lat/.lng or .latitude/.longitude attributes
    Skips malformed, non-numeric, or out-of-range coordinate entries safely.
    """
    if not waypoints:
        return []

    if isinstance(waypoints, str):
        try:
            waypoints = json.loads(waypoints)
        except Exception:
            return []

    if isinstance(waypoints, dict):
        waypoints = waypoints.get("geometry") or waypoints.get("route_geometry") or waypoints.get("waypoints") or []

    if not isinstance(waypoints, (list, tuple)):
        return []

    coords: List[Tuple[float, float]] = []
    for item in waypoints:
        lat = None
        lng = None
        if isinstance(item, dict):
            lat = item.get("lat") if item.get("lat") is not None else item.get("latitude")
            lng = item.get("lng") if item.get("lng") is not None else item.get("lon", item.get("longitude"))
        elif isinstance(item, (list, tuple)) and len(item) >= 2:
            lat = item[0]
            lng = item[1]
        elif hasattr(item, "lat") and hasattr(item, "lng"):
            lat = getattr(item, "lat")
            lng = getattr(item, "lng")
        elif hasattr(item, "latitude") and hasattr(item, "longitude"):
            lat = getattr(item, "latitude")
            lng = getattr(item, "longitude")

        try:
            if lat is not None and lng is not None:
                lat_f = float(lat)
                lng_f = float(lng)
                if -90.0 <= lat_f <= 90.0 and -180.0 <= lng_f <= 180.0:
                    coords.append((lat_f, lng_f))
        except (ValueError, TypeError):
            continue

    return coords


def point_to_segment_distance_meters(
    lat_p: float, lng_p: float,
    lat_a: float, lng_a: float,
    lat_b: float, lng_b: float
) -> float:
    """
    Calculate the minimum distance in meters from point P to line segment AB.
    Uses equirectangular projection to find the orthogonal projection scalar t
    onto segment AB, clamped to [0.0, 1.0], then calculates great-circle haversine
    distance to the closest point on the segment.
    """
    mid_lat = math.radians((lat_a + lat_b) / 2.0)
    cos_mid = math.cos(mid_lat)

    d_lat = lat_b - lat_a
    d_lng = (lng_b - lng_a) * cos_mid

    seg_len_sq = d_lat * d_lat + d_lng * d_lng

    if seg_len_sq < 1e-15:
        # A and B are effectively identical
        return haversine_distance(lat_p, lng_p, lat_a, lng_a) * 1000.0

    ap_lat = lat_p - lat_a
    ap_lng = (lng_p - lng_a) * cos_mid

    t = (ap_lat * d_lat + ap_lng * d_lng) / seg_len_sq
    t_clamped = max(0.0, min(1.0, t))

    closest_lat = lat_a + t_clamped * (lat_b - lat_a)
    closest_lng = lng_a + t_clamped * (lng_b - lng_a)

    return round(haversine_distance(lat_p, lng_p, closest_lat, closest_lng) * 1000.0, 2)


def calculate_distance_to_route_meters(
    lat: float,
    lng: float,
    waypoints: Any
) -> Optional[float]:
    """
    Calculate the rider's minimum perpendicular/segment distance in meters to the planned route corridor.
    Returns None if route has no valid waypoints.
    """
    coords = extract_route_coordinates(waypoints)
    if not coords:
        return None

    if len(coords) == 1:
        single_lat, single_lng = coords[0]
        return round(haversine_distance(lat, lng, single_lat, single_lng) * 1000.0, 2)

    min_dist = float("inf")
    for i in range(len(coords) - 1):
        lat_a, lng_a = coords[i]
        lat_b, lng_b = coords[i + 1]
        dist = point_to_segment_distance_meters(lat, lng, lat_a, lng_a, lat_b, lng_b)
        if dist < min_dist:
            min_dist = dist

    return round(min_dist, 2)


class RouteDeviationState:
    """In-memory process-local tracker for route deviation status per delivery."""

    def __init__(self):
        # Maps delivery_id -> bool (True if currently deviating beyond threshold)
        self._deviating: Dict[str, bool] = {}

    def is_deviating(self, delivery_id: str) -> bool:
        """Check whether delivery is currently flagged as deviating."""
        return self._deviating.get(delivery_id, False)

    def set_deviating(self, delivery_id: str, deviating: bool) -> None:
        """Update deviation state for a delivery."""
        if deviating:
            self._deviating[delivery_id] = True
        else:
            self._deviating[delivery_id] = False

    def reset(self, delivery_id: Optional[str] = None) -> None:
        """Reset deviation state for a specific delivery or all deliveries."""
        if delivery_id:
            self._deviating.pop(delivery_id, None)
        else:
            self._deviating.clear()


class RouteDeviationService:
    """Service evaluating rider adherence to planned delivery route corridor."""

    def __init__(
        self,
        threshold_meters: float = DEFAULT_ROUTE_DEVIATION_DISTANCE_METERS
    ):
        self.threshold_meters = threshold_meters
        self.state = RouteDeviationState()

    def calculate_distance_to_route(
        self,
        lat: float,
        lng: float,
        route_waypoints: Any
    ) -> Optional[float]:
        """Compute the minimum distance in meters from rider coordinates to planned route corridor."""
        return calculate_distance_to_route_meters(lat, lng, route_waypoints)

    def evaluate_deviation(
        self,
        delivery_id: Optional[Union[str, Delivery]] = None,
        rider_id: Optional[str] = None,
        latitude: float = 0.0,
        longitude: float = 0.0,
        route_waypoints: Optional[Any] = None,
        delivery_status: Optional[str] = None,
        order_id: Optional[str] = None,
        timestamp: Optional[datetime] = None,
        delivery: Optional[Delivery] = None,
    ) -> List[Dict[str, Any]]:
        """
        Evaluate rider GPS coordinates against the planned route corridor.

        Returns a list containing a RIDER_ROUTE_DEVIATION event if the rider moves
        beyond the allowed corridor and was not already marked as deviating.
        If the rider returns within corridor, the internal state resets without emitting
        repeated recovery events, allowing subsequent deviations to trigger again.

        Active delivery states: 'assigned', 'picked_up', 'in_transit'.
        Missing/malformed routes: safely skipped without error.
        """
        # Resolve delivery object vs delivery_id parameter polymorphism
        deliv_obj: Optional[Delivery] = None
        if isinstance(delivery_id, Delivery):
            deliv_obj = delivery_id
            actual_delivery_id = deliv_obj.id
        elif delivery is not None:
            deliv_obj = delivery
            actual_delivery_id = delivery.id
        elif delivery_id is not None:
            actual_delivery_id = str(delivery_id)
        else:
            return []

        if deliv_obj:
            status = delivery_status or deliv_obj.status
            ord_id = order_id or getattr(deliv_obj, "order_id", None)
            if route_waypoints is None and getattr(deliv_obj, "routes", None):
                routes = deliv_obj.routes
                if routes:
                    latest = sorted(routes, key=lambda rt: rt.created_at, reverse=True)[0]
                    if latest and latest.waypoints_json:
                        try:
                            raw = json.loads(latest.waypoints_json)
                            if isinstance(raw, dict):
                                route_waypoints = raw.get("geometry") or raw.get("route_geometry") or raw.get("waypoints")
                            else:
                                route_waypoints = raw
                        except Exception:
                            route_waypoints = None
        else:
            status = delivery_status
            ord_id = order_id

        # 1. Active delivery check
        if status not in ACTIVE_DEVIATION_STATUSES:
            return []

        # 2. Missing/malformed route check
        if route_waypoints is None:
            return []

        dist_meters = self.calculate_distance_to_route(latitude, longitude, route_waypoints)
        if dist_meters is None:
            return []

        event_timestamp = (timestamp or datetime.utcnow()).isoformat()

        # 3. Deviation check
        if dist_meters > self.threshold_meters:
            if not self.state.is_deviating(actual_delivery_id):
                # Transition: normal -> deviating
                self.state.set_deviating(actual_delivery_id, True)
                payload: Dict[str, Any] = {
                    "event": EVENT_RIDER_ROUTE_DEVIATION,
                    "delivery_id": actual_delivery_id,
                    "rider_id": rider_id,
                    "distance_from_route_meters": dist_meters,
                    "threshold_meters": self.threshold_meters,
                    "latitude": latitude,
                    "longitude": longitude,
                    "timestamp": event_timestamp
                }
                if ord_id:
                    payload["order_id"] = ord_id
                return [payload]
            else:
                # Already deviating: deduplicated, no duplicate event
                return []
        else:
            # Rider is within corridor
            if self.state.is_deviating(actual_delivery_id):
                # Transition: deviating -> normal (recovered)
                self.state.set_deviating(actual_delivery_id, False)
            return []

    def get_deviation_status(
        self,
        delivery: Optional[Delivery] = None,
        lat: Optional[float] = None,
        lng: Optional[float] = None,
        waypoints: Optional[Any] = None,
        delivery_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """Query route deviation status for delivery tracking responses."""
        target_id = delivery.id if delivery else delivery_id
        if lat is None or lng is None:
            return {
                "distance_from_route_meters": None,
                "is_route_deviating": False,
                "route_deviation_threshold_meters": self.threshold_meters
            }

        # Resolve waypoints if not provided
        wp = waypoints
        if wp is None and delivery and getattr(delivery, "routes", None):
            routes = delivery.routes
            if routes:
                latest = sorted(routes, key=lambda rt: rt.created_at, reverse=True)[0]
                if latest and latest.waypoints_json:
                    try:
                        raw = json.loads(latest.waypoints_json)
                        if isinstance(raw, dict):
                            wp = raw.get("geometry") or raw.get("route_geometry") or raw.get("waypoints")
                        else:
                            wp = raw
                    except Exception:
                        wp = None

        dist = self.calculate_distance_to_route(lat, lng, wp) if wp else None
        is_deviating = False
        if dist is not None:
            is_deviating = dist > self.threshold_meters
        elif target_id:
            is_deviating = self.state.is_deviating(target_id)

        return {
            "distance_from_route_meters": dist,
            "is_route_deviating": is_deviating,
            "route_deviation_threshold_meters": self.threshold_meters
        }

    def reset_delivery(self, delivery_id: str):
        """Reset deviation state for a specific delivery."""
        self.state.reset(delivery_id)

    def reset_all(self):
        """Reset all deviation states across deliveries."""
        self.state.reset()


# Singleton instance
route_deviation_service = RouteDeviationService()
