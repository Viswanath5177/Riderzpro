"""Rider GPS location tracking service implementing validation, persistence, and tracking views."""

import logging
import math
from datetime import datetime, timezone
from typing import Optional, List, Tuple, Dict, Any, Callable
from sqlalchemy.orm import Session
from sqlalchemy import desc, asc

from logistics.models import Rider, Delivery, RiderLocation
from logistics.schemas import (
    RiderLocationUpdate,
    RiderLocationUpdateResponse,
    RiderCurrentLocationResponse,
    DeliveryTrackingResponse,
    DeliveryTrackingRiderInfo,
    RiderLocationHistoryResponse,
    RiderLocationHistoryItem
)
from logistics.route_planning import haversine_distance
from logistics.geofence import geofence_service
from logistics.route_deviation import route_deviation_service

logger = logging.getLogger("riderzpro.location")

# Configuration Constants
MAX_FUTURE_SKEW_SECONDS = 300       # 5 minutes allowable forward clock skew
MAX_PAST_AGE_SECONDS = 86400        # 24 hours maximum historical age
STALE_THRESHOLD_MINUTES = 10.0      # Stale threshold for lack of location pings
MAX_PLAUSIBLE_SPEED_KMH = 180.0     # Plausible velocity threshold for teleportation warning


class LocationTrackingError(Exception):
    """Base exception for location tracking failures."""
    def __init__(self, message: str, status_code: int = 400):
        super().__init__(message)
        self.message = message
        self.status_code = status_code


class RiderNotFoundError(LocationTrackingError):
    def __init__(self, message: str):
        super().__init__(message, status_code=404)


class DeliveryNotFoundError(LocationTrackingError):
    def __init__(self, message: str):
        super().__init__(message, status_code=404)


class LocationValidationError(LocationTrackingError):
    def __init__(self, message: str):
        super().__init__(message, status_code=400)


class UnauthorizedLocationUpdateError(LocationTrackingError):
    def __init__(self, message: str):
        super().__init__(message, status_code=403)


class InvalidDeliveryTrackingStateError(LocationTrackingError):
    def __init__(self, message: str):
        super().__init__(message, status_code=400)


class ForbiddenTrackingAccessError(LocationTrackingError):
    def __init__(self, message: str):
        super().__init__(message, status_code=403)


class LocationTrackingService:
    """Service governing rider GPS ingestion, validation, historical logging, and tracking queries."""

    def __init__(self):
        # Event callbacks registered for real-time dispatch (WebSocket/MessageQueue in Phase 3)
        self._event_subscribers: List[Callable[[str, Dict[str, Any]], None]] = []

    def subscribe_to_events(self, callback: Callable[[str, Dict[str, Any]], None]):
        """Register a callback for location tracking events."""
        self._event_subscribers.append(callback)

    def publish_event(self, event_name: str, payload: Dict[str, Any]):
        """Publish location event to subscribers (for real-time streaming)."""
        logger.debug(f"Publishing location event: {event_name} -> {payload}")
        for subscriber in self._event_subscribers:
            try:
                subscriber(event_name, payload)
            except Exception as e:
                logger.error(f"Error notifying location event subscriber: {e}")

    @staticmethod
    def _normalize_datetime(dt: Optional[datetime]) -> datetime:
        """Convert aware datetime to naive UTC datetime for consistent storage and comparisons."""
        if dt is None:
            return datetime.utcnow()
        if dt.tzinfo is not None:
            # Convert to UTC and strip tzinfo
            dt = dt.astimezone(timezone.utc).replace(tzinfo=None)
        return dt

    def record_rider_location(
        self,
        db: Session,
        rider_id: str,
        update: RiderLocationUpdate,
        actor_id: Optional[str] = None,
        actor_role: Optional[str] = None
    ) -> RiderLocationUpdateResponse:
        """
        Validate, persist, and update current GPS location reported by a rider.
        Enforces coordinate validity, timestamp bounds, delivery assignments, and actor authorization.
        """
        # 1. Validate Rider existence
        rider = db.query(Rider).filter(Rider.id == rider_id).first()
        if not rider:
            logger.warning(f"Location update rejected: Rider '{rider_id}' not found.")
            raise RiderNotFoundError(f"Rider with ID '{rider_id}' was not found.")

        # 2. Authorization check: Rider can only update their own location
        if actor_role and actor_role.lower() == "rider":
            if actor_id and actor_id != rider_id:
                logger.warning(f"Unauthorized location update: Actor '{actor_id}' tried to update rider '{rider_id}'.")
                raise UnauthorizedLocationUpdateError("Riders are only permitted to update their own location coordinates.")

        # 3. Coordinate validation
        lat = update.latitude
        lng = update.longitude
        if not (-90.0 <= lat <= 90.0):
            raise LocationValidationError(f"Invalid latitude {lat}. Must be between -90.0 and 90.0.")
        if not (-180.0 <= lng <= 180.0):
            raise LocationValidationError(f"Invalid longitude {lng}. Must be between -180.0 and 180.0.")

        # 4. Timestamp validation
        timestamp = self._normalize_datetime(update.timestamp)
        now = datetime.utcnow()

        future_skew = (timestamp - now).total_seconds()
        if future_skew > MAX_FUTURE_SKEW_SECONDS:
            logger.warning(f"Location update rejected: Timestamp {timestamp} is in the future by {future_skew}s.")
            raise LocationValidationError(f"Timestamp cannot be in the future (skew: {future_skew:.0f}s exceeds {MAX_FUTURE_SKEW_SECONDS}s limit).")

        past_age = (now - timestamp).total_seconds()
        if past_age > MAX_PAST_AGE_SECONDS:
            logger.warning(f"Location update rejected: Timestamp {timestamp} is too old ({past_age}s ago).")
            raise LocationValidationError(f"Timestamp is too old ({past_age:.0f}s exceeds maximum age of {MAX_PAST_AGE_SECONDS}s).")

        # 5. Delivery validation if delivery_id is supplied
        target_delivery: Optional[Delivery] = None
        if update.delivery_id:
            target_delivery = db.query(Delivery).filter(Delivery.id == update.delivery_id).first()
            if not target_delivery:
                logger.warning(f"Location update rejected: Delivery '{update.delivery_id}' not found.")
                raise DeliveryNotFoundError(f"Delivery with ID '{update.delivery_id}' was not found.")

            # Verify rider is assigned to this delivery
            if target_delivery.assigned_rider_id != rider.id:
                logger.warning(
                    f"Rider/delivery mismatch: Rider '{rider_id}' attempted update on delivery "
                    f"'{update.delivery_id}' assigned to '{target_delivery.assigned_rider_id}'."
                )
                raise UnauthorizedLocationUpdateError(
                    f"Rider '{rider_id}' is not assigned to delivery '{update.delivery_id}'."
                )

            # Check delivery state: only active states permit delivery location tracking
            active_delivery_states = {"assigned", "picked_up", "in_transit"}
            if target_delivery.status not in active_delivery_states:
                logger.warning(
                    f"Location update rejected for delivery '{update.delivery_id}': status '{target_delivery.status}' is not active."
                )
                raise InvalidDeliveryTrackingStateError(
                    f"Cannot associate location update with delivery '{update.delivery_id}' in '{target_delivery.status}' status. "
                    f"Active tracking is only permitted for deliveries in: {sorted(list(active_delivery_states))}."
                )

        # 6. Quality Checks: Teleportation / jump & out-of-order check
        is_out_of_order = False
        if rider.last_location_timestamp:
            delta_seconds = (timestamp - rider.last_location_timestamp).total_seconds()
            if delta_seconds < 0:
                is_out_of_order = True
                logger.info(
                    f"Out-of-order GPS update received for rider {rider_id}: "
                    f"incoming timestamp {timestamp} < latest {rider.last_location_timestamp}. "
                    "Historical record will be saved, but latest position will not be overwritten."
                )
            elif 0 < delta_seconds <= 60:
                # Check for unrealistic coordinate leap
                dist_km = haversine_distance(rider.current_lat, rider.current_lng, lat, lng)
                computed_speed_kmh = dist_km / (delta_seconds / 3600.0)
                if computed_speed_kmh > MAX_PLAUSIBLE_SPEED_KMH:
                    logger.warning(
                        f"Unrealistic coordinate jump detected for rider {rider_id}: "
                        f"moved {dist_km:.2f} km in {delta_seconds:.1f}s (~{computed_speed_kmh:.1f} km/h). "
                        "Saving location record with quality warning."
                    )

        # 7. Persist historical record
        location_record = RiderLocation(
            rider_id=rider.id,
            delivery_id=update.delivery_id,
            latitude=lat,
            longitude=lng,
            accuracy_meters=update.accuracy_meters,
            speed_kmh=update.speed_kmh,
            heading_degrees=update.heading_degrees,
            timestamp=timestamp
        )
        db.add(location_record)

        # 8. Update rider's latest position if update is not out-of-order
        if not is_out_of_order:
            rider.current_lat = lat
            rider.current_lng = lng
            rider.last_location_timestamp = timestamp
            rider.accuracy_meters = update.accuracy_meters
            rider.speed_kmh = update.speed_kmh
            rider.heading_degrees = update.heading_degrees

        db.commit()

        # Compute remaining distance and live ETA if associated with delivery
        remaining_dist_km = None
        est_eta_minutes = None
        if target_delivery:
            remaining_dist_km = round(haversine_distance(lat, lng, target_delivery.dropoff_lat, target_delivery.dropoff_lng), 2)
            speed_val = update.speed_kmh if (update.speed_kmh and update.speed_kmh > 5.0) else 25.0
            est_eta_minutes = round((remaining_dist_km / speed_val) * 60.0, 1)

        # 9. Trigger real-time event hook
        event_payload = {
            "rider_id": rider.id,
            "delivery_id": update.delivery_id,
            "latitude": lat,
            "longitude": lng,
            "timestamp": timestamp.isoformat(),
            "speed_kmh": update.speed_kmh,
            "heading_degrees": update.heading_degrees,
            "distance_km": remaining_dist_km,
            "eta_minutes": est_eta_minutes,
            "battery_soc_percent": getattr(update, "battery_soc_percent", None),
            "battery_temperature_celsius": getattr(update, "battery_temperature_celsius", None)
        }
        self.publish_event("RIDER_LOCATION_UPDATED", event_payload)

        # 10. Evaluate geofence and publish milestone events (RIDER_APPROACHING / RIDER_ARRIVED)
        if target_delivery:
            geofence_events = geofence_service.evaluate_geofence(
                delivery=target_delivery,
                rider_id=rider.id,
                lat=lat,
                lng=lng,
                timestamp=timestamp
            )
            for gf_event in geofence_events:
                self.publish_event(gf_event["event"], gf_event)

        # 11. Evaluate route deviation and publish RIDER_ROUTE_DEVIATION event
        if target_delivery:
            try:
                deviation_events = route_deviation_service.evaluate_deviation(
                    delivery_id=target_delivery.id,
                    rider_id=rider.id,
                    latitude=lat,
                    longitude=lng,
                    order_id=target_delivery.order_id,
                    timestamp=timestamp,
                    delivery=target_delivery
                )
                for dev_event in deviation_events:
                    self.publish_event(dev_event["event"], dev_event)
            except Exception as e:
                logger.warning(
                    f"Route deviation evaluation encountered error for delivery '{target_delivery.id}': {e}"
                )

        return RiderLocationUpdateResponse(
            success=True,
            rider_id=rider.id,
            delivery_id=update.delivery_id,
            latitude=lat,
            longitude=lng,
            timestamp=timestamp,
            message="Location update accepted and recorded."
        )

    def get_latest_rider_location(self, db: Session, rider_id: str) -> RiderCurrentLocationResponse:
        """
        Fetch the current/latest coordinates and status for a rider.
        Returns clear response if no location update has ever been received.
        """
        rider = db.query(Rider).filter(Rider.id == rider_id).first()
        if not rider:
            raise RiderNotFoundError(f"Rider with ID '{rider_id}' was not found.")

        # Check if rider has ever reported a GPS location
        if rider.last_location_timestamp is None:
            # Check if any location record exists in history
            latest_history = db.query(RiderLocation).filter(
                RiderLocation.rider_id == rider.id
            ).order_by(desc(RiderLocation.timestamp)).first()

            if not latest_history:
                return RiderCurrentLocationResponse(
                    rider_id=rider.id,
                    name=rider.name,
                    has_location=False,
                    latitude=None,
                    longitude=None,
                    timestamp=None,
                    message=f"No location update has ever been received from rider '{rider.name}'."
                )

        # Determine staleness
        now = datetime.utcnow()
        last_ts = rider.last_location_timestamp or now
        age_minutes = (now - last_ts).total_seconds() / 60.0
        is_stale = age_minutes > STALE_THRESHOLD_MINUTES

        # Locate active delivery if currently in flight
        active_delivery = db.query(Delivery).filter(
            Delivery.assigned_rider_id == rider.id,
            Delivery.status.in_(["assigned", "picked_up", "in_transit"])
        ).first()

        active_delivery_data = None
        active_delivery_id = None
        if active_delivery:
            active_delivery_id = active_delivery.id
            active_delivery_data = {
                "id": active_delivery.id,
                "order_id": active_delivery.order_id,
                "status": active_delivery.status,
                "pickup_address": active_delivery.pickup_address,
                "dropoff_address": active_delivery.dropoff_address
            }

        return RiderCurrentLocationResponse(
            rider_id=rider.id,
            name=rider.name,
            has_location=True,
            latitude=rider.current_lat,
            longitude=rider.current_lng,
            timestamp=rider.last_location_timestamp,
            accuracy_meters=rider.accuracy_meters,
            speed_kmh=rider.speed_kmh,
            heading_degrees=rider.heading_degrees,
            is_stale=is_stale,
            active_delivery_id=active_delivery_id,
            active_delivery=active_delivery_data
        )

    def get_delivery_tracking(
        self,
        db: Session,
        delivery_id: str,
        actor_id: Optional[str] = None,
        actor_role: Optional[str] = None
    ) -> DeliveryTrackingResponse:
        """
        Retrieve tracking view for customer or dispatch dashboard,
        combining live rider coordinates, pickup/dropoff, ETA, and route waypoints.
        """
        delivery = db.query(Delivery).filter(Delivery.id == delivery_id).first()
        if not delivery:
            raise DeliveryNotFoundError(f"Delivery with ID '{delivery_id}' was not found.")

        # Authorization: Customers can only track their own deliveries
        if actor_role and actor_role.lower() == "customer":
            if actor_id and actor_id != delivery.customer_id and actor_id != getattr(delivery, "customer_phone", None):
                raise ForbiddenTrackingAccessError("You are not authorized to track this delivery order.")

        # Construct Rider Info if assigned
        rider_info: Optional[DeliveryTrackingRiderInfo] = None
        eta_minutes: Optional[float] = None
        distance_km: Optional[float] = None

        if delivery.assigned_rider:
            r = delivery.assigned_rider
            is_stale = False
            if r.last_location_timestamp:
                age_minutes = (datetime.utcnow() - r.last_location_timestamp).total_seconds() / 60.0
                is_stale = age_minutes > STALE_THRESHOLD_MINUTES

            has_reported = r.last_location_timestamp is not None
            rider_info = DeliveryTrackingRiderInfo(
                id=r.id,
                name=r.name,
                phone=r.phone,
                vehicle_type=r.vehicle_type,
                latitude=r.current_lat if has_reported else None,
                longitude=r.current_lng if has_reported else None,
                last_updated=r.last_location_timestamp,
                heading_degrees=r.heading_degrees,
                speed_kmh=r.speed_kmh,
                accuracy_meters=r.accuracy_meters,
                is_stale=is_stale
            )

            # Compute live remaining distance and ETA if rider has coordinates
            if has_reported and delivery.status in ("assigned", "picked_up", "in_transit"):
                if delivery.status == "in_transit":
                    # Rider to dropoff
                    distance_km = round(haversine_distance(r.current_lat, r.current_lng, delivery.dropoff_lat, delivery.dropoff_lng), 2)
                else:
                    # Rider to pickup + pickup to dropoff
                    dist_to_pickup = haversine_distance(r.current_lat, r.current_lng, delivery.pickup_lat, delivery.pickup_lng)
                    dist_to_dropoff = haversine_distance(delivery.pickup_lat, delivery.pickup_lng, delivery.dropoff_lat, delivery.dropoff_lng)
                    distance_km = round(dist_to_pickup + dist_to_dropoff, 2)

                # Estimate speed by vehicle type: e-bike ~25km/h, regular ~18km/h, van ~30km/h
                speed_est = 25.0
                if r.vehicle_type == "regular_bike":
                    speed_est = 18.0
                elif r.vehicle_type == "van":
                    speed_est = 30.0

                eta_minutes = round((distance_km / speed_est) * 60.0, 1)

        # Fallback to planned route distance/duration if live computation unavailable
        if distance_km is None and delivery.routes:
            latest_route = sorted(delivery.routes, key=lambda rt: rt.created_at, reverse=True)[0]
            distance_km = latest_route.distance_km
            eta_minutes = latest_route.duration_minutes

        # Extract waypoints from route if available
        waypoints: List[Dict[str, Any]] = []
        if delivery.routes:
            latest_route = sorted(delivery.routes, key=lambda rt: rt.created_at, reverse=True)[0]
            if latest_route.waypoints_json:
                import json
                try:
                    waypoints = json.loads(latest_route.waypoints_json)
                except Exception:
                    waypoints = []

        # Populate geofence proximity status for tracking response
        rider_lat = None
        rider_lng = None
        if delivery.assigned_rider and delivery.assigned_rider.last_location_timestamp:
            rider_lat = delivery.assigned_rider.current_lat
            rider_lng = delivery.assigned_rider.current_lng

        gf_status = geofence_service.get_geofence_status(delivery, rider_lat, rider_lng)
        dev_status = route_deviation_service.get_deviation_status(
            delivery=delivery,
            lat=rider_lat,
            lng=rider_lng,
            waypoints=waypoints
        )

        return DeliveryTrackingResponse(
            delivery_id=delivery.id,
            order_id=delivery.order_id,
            status=delivery.status,
            rider=rider_info,
            pickup={
                "address": delivery.pickup_address,
                "latitude": delivery.pickup_lat,
                "longitude": delivery.pickup_lng
            },
            dropoff={
                "address": delivery.dropoff_address,
                "latitude": delivery.dropoff_lat,
                "longitude": delivery.dropoff_lng
            },
            eta_minutes=eta_minutes,
            distance_km=distance_km,
            route_waypoints=waypoints if waypoints else None,
            distance_to_dropoff_meters=gf_status["distance_to_dropoff_meters"],
            is_approaching=gf_status["is_approaching"],
            is_arrived=gf_status["is_arrived"],
            distance_from_route_meters=dev_status["distance_from_route_meters"],
            is_route_deviating=dev_status["is_route_deviating"],
            route_deviation_threshold_meters=dev_status["route_deviation_threshold_meters"]
        )

    def get_location_history(
        self,
        db: Session,
        rider_id: str,
        page: int = 1,
        limit: int = 50,
        start_time: Optional[datetime] = None,
        end_time: Optional[datetime] = None,
        delivery_id: Optional[str] = None,
        actor_id: Optional[str] = None,
        actor_role: Optional[str] = None
    ) -> RiderLocationHistoryResponse:
        """
        Retrieve paginated historical coordinates for a rider.
        Guarded so unauthorized users cannot access location trails.
        """
        rider = db.query(Rider).filter(Rider.id == rider_id).first()
        if not rider:
            raise RiderNotFoundError(f"Rider with ID '{rider_id}' was not found.")

        # Authorization guard
        allowed_roles = {"admin", "dispatcher", "supervisor", "system"}
        if actor_role and actor_role.lower() not in allowed_roles:
            if actor_id != rider_id:
                raise ForbiddenTrackingAccessError("You are not authorized to view this rider's location history.")

        query = db.query(RiderLocation).filter(RiderLocation.rider_id == rider_id)

        if delivery_id:
            query = query.filter(RiderLocation.delivery_id == delivery_id)
        if start_time:
            query = query.filter(RiderLocation.timestamp >= self._normalize_datetime(start_time))
        if end_time:
            query = query.filter(RiderLocation.timestamp <= self._normalize_datetime(end_time))

        total = query.count()
        offset = (page - 1) * limit
        items = query.order_by(asc(RiderLocation.timestamp)).offset(offset).limit(limit).all()

        total_pages = math.ceil(total / limit) if total > 0 else 1

        return RiderLocationHistoryResponse(
            rider_id=rider.id,
            total=total,
            page=page,
            limit=limit,
            total_pages=total_pages,
            items=[RiderLocationHistoryItem.model_validate(item) for item in items]
        )
