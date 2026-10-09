"""Delivery management service implementing CRUD, validation, and state machine transitions."""

import logging
from datetime import datetime
from typing import Optional, List, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import desc

from logistics.models import Delivery, Rider, RiderAssignment, DeliveryStatusHistory, DeliveryRoute
from logistics.schemas import DeliveryCreate, DeliveryStatusUpdate
from logistics.route_planning import RoutePlanningService

logger = logging.getLogger("riderzpro.service")


class DuplicateDeliveryError(Exception):
    """Raised when an active delivery task already exists for the given order."""
    def __init__(self, message: str):
        super().__init__(message)
        self.message = message
        self.status_code = 409


class InvalidStatusTransitionError(Exception):
    """Raised when a status update violates the delivery state machine."""
    def __init__(self, message: str):
        super().__init__(message)
        self.message = message
        self.status_code = 400


class DeliveryService:
    """Service handling lifecycle, persistence, and state transitions for deliveries."""

    VALID_TRANSITIONS = {
        "pending": {"assigned", "cancelled"},
        "assigned": {"picked_up", "pending", "cancelled"},
        "picked_up": {"in_transit", "failed", "cancelled"},
        "in_transit": {"delivered", "failed", "cancelled"},
        "failed": {"pending", "cancelled"},
        "delivered": set(),   # Terminal state
        "cancelled": set(),   # Terminal state
    }

    def __init__(self):
        self.route_planner = RoutePlanningService()

    def create_delivery(self, db: Session, data: DeliveryCreate) -> Delivery:
        """Create a delivery task with duplicate prevention and route calculation."""
        # 1. Prevent duplicate delivery task for the same active order
        existing_active = db.query(Delivery).filter(
            Delivery.order_id == data.order_id,
            Delivery.status.notin_(["cancelled", "failed"])
        ).first()

        if existing_active:
            raise DuplicateDeliveryError(
                f"An active delivery task ({existing_active.id}) already exists for Order '{data.order_id}'."
            )

        # 2. Instantiate delivery record
        delivery = Delivery(
            order_id=data.order_id,
            customer_id=data.customer_id,
            customer_name=data.customer_name,
            customer_phone=data.customer_phone,
            vendor_id=data.vendor_id,
            vendor_name=data.vendor_name,
            pickup_address=data.pickup_address,
            pickup_lat=data.pickup_lat,
            pickup_lng=data.pickup_lng,
            dropoff_address=data.dropoff_address,
            dropoff_lat=data.dropoff_lat,
            dropoff_lng=data.dropoff_lng,
            package_weight_kg=data.package_weight_kg,
            package_dimensions=data.package_dimensions,
            priority=data.priority,
            deadline=data.deadline,
            notes=data.notes,
            status="pending"
        )
        db.add(delivery)
        db.flush()  # Populates delivery.id

        # 3. Create initial status history entry
        initial_history = DeliveryStatusHistory(
            delivery_id=delivery.id,
            from_status=None,
            to_status="pending",
            changed_by_user_id=data.customer_id,
            changed_by_role="customer",
            reason="Fulfillment task created and queued for dispatch"
        )
        db.add(initial_history)

        # 4. Plan initial route calculation
        self.route_planner.plan_route_for_delivery(
            db=db,
            delivery=delivery,
            provider_name="haversine_builtin"
        )

        db.commit()
        db.refresh(delivery)
        logger.info(f"Created delivery task {delivery.id} for Order {data.order_id}")
        return delivery

    def get_delivery(self, db: Session, delivery_id: str) -> Optional[Delivery]:
        """Fetch delivery entity with associated relationships."""
        return db.query(Delivery).filter(Delivery.id == delivery_id).first()

    def list_deliveries(
        self,
        db: Session,
        page: int = 1,
        limit: int = 20,
        status: Optional[str] = None,
        order_id: Optional[str] = None,
        vendor_id: Optional[str] = None,
        rider_id: Optional[str] = None,
        priority: Optional[str] = None
    ) -> Tuple[List[Delivery], int]:
        """List and filter deliveries with pagination."""
        query = db.query(Delivery)

        if status:
            query = query.filter(Delivery.status == status.lower().strip())
        if order_id:
            query = query.filter(Delivery.order_id == order_id)
        if vendor_id:
            query = query.filter(Delivery.vendor_id == vendor_id)
        if rider_id:
            query = query.filter(Delivery.assigned_rider_id == rider_id)
        if priority:
            query = query.filter(Delivery.priority == priority.lower().strip())

        total = query.count()
        offset = (page - 1) * limit
        items = query.order_by(desc(Delivery.created_at)).offset(offset).limit(limit).all()
        return items, total

    def update_delivery_status(
        self,
        db: Session,
        delivery: Delivery,
        update_data: DeliveryStatusUpdate
    ) -> Delivery:
        """Validate state transition, record history, and release rider capacity on completion."""
        current_status = delivery.status
        target_status = update_data.status.lower().strip()

        if current_status == target_status:
            return delivery

        # Validate legal transition
        allowed_targets = self.VALID_TRANSITIONS.get(current_status, set())
        if target_status not in allowed_targets:
            raise InvalidStatusTransitionError(
                f"Invalid state transition from '{current_status}' to '{target_status}'. Allowed transitions: {list(allowed_targets)}"
            )

        # Handle completion or cancellation resource releases
        if target_status in ("delivered", "failed", "cancelled"):
            if delivery.assigned_rider_id:
                rider = db.query(Rider).filter(Rider.id == delivery.assigned_rider_id).first()
                if rider:
                    rider.current_workload_count = max(0, rider.current_workload_count - 1)
                    if rider.status == "busy" and rider.current_workload_count < rider.max_concurrent_orders:
                        rider.status = "available"

                # Update active assignment record
                active_asg = db.query(RiderAssignment).filter(
                    RiderAssignment.delivery_id == delivery.id,
                    RiderAssignment.rider_id == delivery.assigned_rider_id,
                    RiderAssignment.status.in_(["assigned", "active"])
                ).first()
                if active_asg:
                    active_asg.status = "completed" if target_status == "delivered" else target_status
                    active_asg.completed_at = datetime.utcnow()

        if target_status == "delivered":
            if update_data.proof_of_delivery:
                delivery.proof_of_delivery = update_data.proof_of_delivery
        elif target_status == "failed":
            delivery.failure_reason = update_data.reason or "Delivery attempt unsuccessful"
        elif target_status == "cancelled":
            delivery.cancellation_reason = update_data.reason or "Cancelled by user/operator"

        delivery.status = target_status

        # Append status audit log
        history = DeliveryStatusHistory(
            delivery_id=delivery.id,
            from_status=current_status,
            to_status=target_status,
            changed_by_user_id=update_data.actor_id or "system",
            changed_by_role=update_data.actor_role or "system",
            reason=update_data.reason or f"Status changed to {target_status}"
        )
        db.add(history)

        db.commit()
        db.refresh(delivery)
        logger.info(f"Delivery {delivery.id} transitioned: {current_status} -> {target_status}")
        return delivery
