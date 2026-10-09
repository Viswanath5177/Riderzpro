"""Rider assignment business logic, workload management, and concurrency guards."""

import logging
from datetime import datetime
from typing import List, Tuple, Optional
from sqlalchemy.orm import Session
from sqlalchemy import select

from logistics.models import Delivery, Rider, RiderAssignment, DeliveryStatusHistory
from logistics.route_planning import haversine_distance

logger = logging.getLogger("riderzpro.assignment")


class AssignmentError(Exception):
    """Custom exception raised when assignment constraints cannot be satisfied."""
    def __init__(self, message: str, status_code: int = 422):
        super().__init__(message)
        self.message = message
        self.status_code = status_code


class RiderAssignmentService:
    """Service governing dispatch matching, capacity tracking, and reassignment."""

    @staticmethod
    def get_eligible_riders(
        db: Session,
        delivery: Delivery,
        max_search_radius_km: float = 30.0
    ) -> List[Tuple[Rider, float]]:
        """
        Find and rank all active, available riders qualified to fulfill the delivery.
        Ranks by composite score: distance to pickup, active workload, and rating.
        """
        # Query online riders with available status
        candidates = db.query(Rider).filter(
            Rider.is_online == True,
            Rider.status == "available",
            Rider.current_workload_count < Rider.max_concurrent_orders,
            Rider.max_payload_kg >= delivery.package_weight_kg
        ).all()

        scored_candidates: List[Tuple[Rider, float, float]] = []

        for rider in candidates:
            dist_km = haversine_distance(
                rider.current_lat, rider.current_lng,
                delivery.pickup_lat, delivery.pickup_lng
            )

            if dist_km <= max_search_radius_km:
                # Scoring metric: Lower is better
                # Distance weight: 1.0 per km
                # Workload penalty: 3.0 per existing order
                # Rating bonus: -1.0 per star above 4.0
                rating_offset = max(0.0, rider.rating - 4.0)
                score = dist_km + (rider.current_workload_count * 3.0) - rating_offset
                scored_candidates.append((rider, dist_km, score))

        # Sort candidate riders by composite score ascending
        scored_candidates.sort(key=lambda item: item[2])
        return [(item[0], round(item[1], 2)) for item in scored_candidates]

    @staticmethod
    def assign_or_reassign_rider(
        db: Session,
        delivery: Delivery,
        rider_id: Optional[str] = None,
        actor_id: str = "system",
        actor_role: str = "dispatcher",
        reason: Optional[str] = None
    ) -> Delivery:
        """
        Safely bind a delivery to a rider with concurrency checks,
        workload updates, and assignment history logging.
        """
        # Ensure delivery is not terminal
        if delivery.status in ("delivered", "cancelled"):
            raise AssignmentError(
                f"Cannot assign rider to a delivery in '{delivery.status}' state.",
                status_code=400
            )

        target_rider: Optional[Rider] = None

        if rider_id:
            # Explicit rider requested
            target_rider = db.query(Rider).filter(Rider.id == rider_id).first()
            if not target_rider:
                raise AssignmentError(f"Rider with ID '{rider_id}' was not found.", status_code=404)

            # Check if rider is already assigned to this delivery
            if delivery.assigned_rider_id == target_rider.id:
                return delivery

            # Validate eligibility of selected rider
            if not target_rider.is_online:
                raise AssignmentError(f"Rider '{target_rider.name}' is currently offline.", status_code=422)

            if target_rider.status != "available":
                raise AssignmentError(f"Rider '{target_rider.name}' is currently {target_rider.status}.", status_code=422)

            if target_rider.current_workload_count >= target_rider.max_concurrent_orders:
                raise AssignmentError(
                    f"Rider '{target_rider.name}' has reached maximum concurrent capacity ({target_rider.max_concurrent_orders} orders).",
                    status_code=422
                )

            if target_rider.max_payload_kg < delivery.package_weight_kg:
                raise AssignmentError(
                    f"Package weight ({delivery.package_weight_kg}kg) exceeds rider payload limit ({target_rider.max_payload_kg}kg).",
                    status_code=422
                )
        else:
            # Automated selection of best candidate
            eligible = RiderAssignmentService.get_eligible_riders(db, delivery)
            if not eligible:
                raise AssignmentError(
                    "No eligible riders are currently available within range matching capacity and vehicle requirements.",
                    status_code=422
                )
            target_rider = eligible[0][0]

        previous_rider_id = delivery.assigned_rider_id
        previous_status = delivery.status

        # 1. Handle previous rider unassignment if reassigning
        if previous_rider_id and previous_rider_id != target_rider.id:
            prev_rider = db.query(Rider).filter(Rider.id == previous_rider_id).first()
            if prev_rider:
                prev_rider.current_workload_count = max(0, prev_rider.current_workload_count - 1)
                if prev_rider.status == "busy" and prev_rider.current_workload_count < prev_rider.max_concurrent_orders:
                    prev_rider.status = "available"

            # Close active assignment record
            active_asg = db.query(RiderAssignment).filter(
                RiderAssignment.delivery_id == delivery.id,
                RiderAssignment.rider_id == previous_rider_id,
                RiderAssignment.status.in_(["assigned", "active"])
            ).first()
            if active_asg:
                active_asg.status = "reassigned"
                active_asg.reassigned_at = datetime.utcnow()
                active_asg.reassignment_reason = reason or f"Reassigned to {target_rider.name}"

        # 2. Update new rider's workload & capacity state
        target_rider.current_workload_count += 1
        if target_rider.current_workload_count >= target_rider.max_concurrent_orders:
            target_rider.status = "busy"

        # 3. Create new assignment record
        new_assignment = RiderAssignment(
            delivery_id=delivery.id,
            rider_id=target_rider.id,
            status="assigned",
            assigned_at=datetime.utcnow()
        )
        db.add(new_assignment)

        # 4. Update delivery state
        delivery.assigned_rider_id = target_rider.id
        delivery.status = "assigned"

        # 5. Record status history
        history = DeliveryStatusHistory(
            delivery_id=delivery.id,
            from_status=previous_status,
            to_status="assigned",
            changed_by_user_id=actor_id,
            changed_by_role=actor_role,
            reason=reason or f"Assigned to {target_rider.name} ({target_rider.vehicle_type})"
        )
        db.add(history)

        db.commit()
        db.refresh(delivery)
        logger.info(f"Delivery {delivery.id} successfully assigned to rider {target_rider.name} ({target_rider.id})")
        return delivery
