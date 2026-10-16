"""Delivery geofencing and proximity milestone event detection service for Riderzpro."""

import logging
from datetime import datetime
from typing import Dict, Any, List, Optional, Set
from logistics.route_planning import haversine_distance
from logistics.models import Delivery

logger = logging.getLogger("riderzpro.geofence")

# Configurable Default Geofence Thresholds (in meters)
DEFAULT_APPROACHING_DISTANCE_METERS = 500.0
DEFAULT_ARRIVAL_DISTANCE_METERS = 50.0

# Delivery states eligible for active geofence evaluation
ACTIVE_GEOFENCE_STATUSES = {"assigned", "picked_up", "in_transit"}


class GeofenceMilestoneState:
    """In-memory tracker for milestone events emitted per delivery during its lifecycle."""

    def __init__(self):
        # Maps delivery_id -> set of emitted milestone event names
        # e.g., {"del_123": {"RIDER_APPROACHING", "RIDER_ARRIVED"}}
        self._emitted: Dict[str, Set[str]] = {}

    def has_emitted(self, delivery_id: str, milestone: str) -> bool:
        """Check whether a specific milestone has already been emitted for a delivery."""
        return milestone in self._emitted.get(delivery_id, set())

    def mark_emitted(self, delivery_id: str, milestone: str):
        """Mark a milestone event as emitted for a delivery."""
        if delivery_id not in self._emitted:
            self._emitted[delivery_id] = set()
        self._emitted[delivery_id].add(milestone)

    def reset(self, delivery_id: Optional[str] = None):
        """
        Reset milestone state for a specific delivery or all deliveries.
        Useful when a delivery is reassigned or reset to pending.
        """
        if delivery_id:
            self._emitted.pop(delivery_id, None)
        else:
            self._emitted.clear()


class GeofenceService:
    """Service governing proximity detection and milestone alerts for active deliveries."""

    def __init__(
        self,
        approaching_threshold_meters: float = DEFAULT_APPROACHING_DISTANCE_METERS,
        arrival_threshold_meters: float = DEFAULT_ARRIVAL_DISTANCE_METERS
    ):
        self.approaching_threshold_meters = approaching_threshold_meters
        self.arrival_threshold_meters = arrival_threshold_meters
        self.state = GeofenceMilestoneState()

    def calculate_distance_to_dropoff(
        self,
        delivery: Delivery,
        lat: float,
        lng: float
    ) -> float:
        """Calculate straight-line distance in meters from rider location to delivery dropoff."""
        km = haversine_distance(lat, lng, delivery.dropoff_lat, delivery.dropoff_lng)
        return round(km * 1000.0, 2)

    def evaluate_geofence(
        self,
        delivery: Delivery,
        rider_id: str,
        lat: float,
        lng: float,
        timestamp: Optional[datetime] = None
    ) -> List[Dict[str, Any]]:
        """
        Evaluate rider GPS against delivery dropoff geofences.
        Returns a list of milestone events that were triggered on this update (if not previously emitted).

        Only active deliveries ('assigned', 'picked_up', 'in_transit') are evaluated.
        Terminal deliveries ('delivered', 'cancelled', 'failed') return an empty list.
        """
        if delivery.status not in ACTIVE_GEOFENCE_STATUSES:
            return []

        dist_meters = self.calculate_distance_to_dropoff(delivery, lat, lng)
        event_timestamp = (timestamp or datetime.utcnow()).isoformat()

        events_to_emit: List[Dict[str, Any]] = []

        # 1. Evaluate approaching threshold (<= approaching_threshold_meters)
        if dist_meters <= self.approaching_threshold_meters:
            if not self.state.has_emitted(delivery.id, "RIDER_APPROACHING"):
                self.state.mark_emitted(delivery.id, "RIDER_APPROACHING")
                events_to_emit.append({
                    "event": "RIDER_APPROACHING",
                    "delivery_id": delivery.id,
                    "order_id": delivery.order_id,
                    "rider_id": rider_id,
                    "distance_to_dropoff_meters": dist_meters,
                    "threshold_meters": self.approaching_threshold_meters,
                    "timestamp": event_timestamp
                })

        # 2. Evaluate arrival threshold (<= arrival_threshold_meters)
        if dist_meters <= self.arrival_threshold_meters:
            if not self.state.has_emitted(delivery.id, "RIDER_ARRIVED"):
                self.state.mark_emitted(delivery.id, "RIDER_ARRIVED")
                events_to_emit.append({
                    "event": "RIDER_ARRIVED",
                    "delivery_id": delivery.id,
                    "order_id": delivery.order_id,
                    "rider_id": rider_id,
                    "distance_to_dropoff_meters": dist_meters,
                    "threshold_meters": self.arrival_threshold_meters,
                    "timestamp": event_timestamp
                })

        return events_to_emit

    def get_geofence_status(
        self,
        delivery: Delivery,
        lat: Optional[float],
        lng: Optional[float]
    ) -> Dict[str, Any]:
        """Query proximity state for delivery tracking responses."""
        if lat is None or lng is None:
            return {
                "distance_to_dropoff_meters": None,
                "is_approaching": False,
                "is_arrived": False
            }

        dist_meters = self.calculate_distance_to_dropoff(delivery, lat, lng)
        return {
            "distance_to_dropoff_meters": dist_meters,
            "is_approaching": dist_meters <= self.approaching_threshold_meters,
            "is_arrived": dist_meters <= self.arrival_threshold_meters
        }

    def reset_delivery(self, delivery_id: str):
        """Reset milestone flags for a specific delivery."""
        self.state.reset(delivery_id)

    def reset_all(self):
        """Reset all milestone flags across deliveries."""
        self.state.reset()


# Default singleton instance
geofence_service = GeofenceService()
