"""FastAPI router providing REST endpoints for Delivery Management Subsystem."""

import math
import json
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from logistics.database import get_db
from logistics.models import Delivery, Rider, DeliveryRoute
from logistics.schemas import (
    DeliveryCreate,
    DeliveryResponse,
    DeliveryListResponse,
    DeliveryStatusUpdate,
    RiderAssignRequest,
    RouteCalculateRequest,
    RouteOptimizationResultResponse,
    BatchOptimizationRequest,
    OptimizationBatchResultResponse,
    RiderResponse
)
from logistics.service import (
    DeliveryService,
    DuplicateDeliveryError,
    InvalidStatusTransitionError
)
from logistics.assignment import RiderAssignmentService, AssignmentError
from logistics.route_planning import RoutePlanningService
from logistics.optimizer import (
    ClassicalORToolsOptimizer,
    ClassicalHeuristicOptimizer,
    QuantumHybridDeliveryOptimizer
)

router = APIRouter(prefix="/api/deliveries", tags=["Logistics & Deliveries"])

delivery_service = DeliveryService()
route_service = RoutePlanningService()
ortools_optimizer = ClassicalORToolsOptimizer()
heuristic_optimizer = ClassicalHeuristicOptimizer()
quantum_optimizer = QuantumHybridDeliveryOptimizer()


def serialize_delivery(delivery: Delivery) -> Dict[str, Any]:
    """Helper to convert Delivery SQLAlchemy model into dict matching DeliveryResponse schema."""
    latest_route = None
    if delivery.routes:
        rt = sorted(delivery.routes, key=lambda r: r.created_at, reverse=True)[0]
        waypoints = []
        if rt.waypoints_json:
            try:
                waypoints = json.loads(rt.waypoints_json)
            except Exception:
                waypoints = []

        latest_route = {
            "id": rt.id,
            "delivery_id": rt.delivery_id,
            "rider_id": rt.rider_id,
            "provider": rt.provider,
            "distance_km": rt.distance_km,
            "duration_minutes": rt.duration_minutes,
            "energy_consumption_kwh": rt.energy_consumption_kwh,
            "waypoints": waypoints,
            "created_at": rt.created_at
        }

    rider_data = None
    if delivery.assigned_rider:
        skills = []
        if delivery.assigned_rider.skills:
            try:
                skills = json.loads(delivery.assigned_rider.skills)
            except Exception:
                skills = []

        rider_data = {
            "id": delivery.assigned_rider.id,
            "name": delivery.assigned_rider.name,
            "phone": delivery.assigned_rider.phone,
            "email": delivery.assigned_rider.email,
            "vehicle_type": delivery.assigned_rider.vehicle_type,
            "certification": delivery.assigned_rider.certification,
            "skills": skills,
            "current_lat": delivery.assigned_rider.current_lat,
            "current_lng": delivery.assigned_rider.current_lng,
            "status": delivery.assigned_rider.status,
            "is_online": delivery.assigned_rider.is_online,
            "max_payload_kg": delivery.assigned_rider.max_payload_kg,
            "max_concurrent_orders": delivery.assigned_rider.max_concurrent_orders,
            "current_workload_count": delivery.assigned_rider.current_workload_count,
            "rating": delivery.assigned_rider.rating,
        }

    history_data = [
        {
            "id": h.id,
            "from_status": h.from_status,
            "to_status": h.to_status,
            "changed_by_user_id": h.changed_by_user_id,
            "changed_by_role": h.changed_by_role,
            "reason": h.reason,
            "created_at": h.created_at
        }
        for h in delivery.status_history
    ]

    return {
        "id": delivery.id,
        "order_id": delivery.order_id,
        "customer_id": delivery.customer_id,
        "customer_name": delivery.customer_name,
        "customer_phone": delivery.customer_phone,
        "vendor_id": delivery.vendor_id,
        "vendor_name": delivery.vendor_name,
        "pickup_address": delivery.pickup_address,
        "pickup_lat": delivery.pickup_lat,
        "pickup_lng": delivery.pickup_lng,
        "dropoff_address": delivery.dropoff_address,
        "dropoff_lat": delivery.dropoff_lat,
        "dropoff_lng": delivery.dropoff_lng,
        "package_weight_kg": delivery.package_weight_kg,
        "package_dimensions": delivery.package_dimensions,
        "priority": delivery.priority,
        "deadline": delivery.deadline,
        "status": delivery.status,
        "assigned_rider_id": delivery.assigned_rider_id,
        "assigned_rider": rider_data,
        "proof_of_delivery": delivery.proof_of_delivery,
        "failure_reason": delivery.failure_reason,
        "cancellation_reason": delivery.cancellation_reason,
        "notes": delivery.notes,
        "created_at": delivery.created_at,
        "updated_at": delivery.updated_at,
        "latest_route": latest_route,
        "status_history": history_data
    }


@router.post("", response_model=DeliveryResponse, status_code=status.HTTP_201_CREATED)
def create_delivery(payload: DeliveryCreate, db: Session = Depends(get_db)):
    """Create a new delivery fulfillment task for a confirmed customer order."""
    try:
        delivery = delivery_service.create_delivery(db, payload)
        return serialize_delivery(delivery)
    except DuplicateDeliveryError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=e.message)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("", response_model=DeliveryListResponse)
def list_deliveries(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page"),
    status: Optional[str] = Query(None, description="Filter by status (pending, assigned, in_transit, etc.)"),
    order_id: Optional[str] = Query(None, description="Filter by order ID"),
    vendor_id: Optional[str] = Query(None, description="Filter by seller/vendor ID"),
    rider_id: Optional[str] = Query(None, description="Filter by assigned rider ID"),
    priority: Optional[str] = Query(None, description="Filter by priority (standard, express, same_day)"),
    db: Session = Depends(get_db)
):
    """Retrieve paginated delivery tasks with optional filtering."""
    items, total = delivery_service.list_deliveries(
        db, page=page, limit=limit, status=status,
        order_id=order_id, vendor_id=vendor_id, rider_id=rider_id, priority=priority
    )
    total_pages = math.ceil(total / limit) if total > 0 else 1
    return {
        "items": [serialize_delivery(d) for d in items],
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": total_pages
    }


@router.get("/{delivery_id}", response_model=DeliveryResponse)
def get_delivery_details(delivery_id: str, db: Session = Depends(get_db)):
    """Retrieve comprehensive delivery details, active route, and milestone history."""
    delivery = delivery_service.get_delivery(db, delivery_id)
    if not delivery:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Delivery '{delivery_id}' not found.")
    return serialize_delivery(delivery)


@router.patch("/{delivery_id}/status", response_model=DeliveryResponse)
def update_delivery_status(
    delivery_id: str,
    payload: DeliveryStatusUpdate,
    db: Session = Depends(get_db)
):
    """Transition delivery state with state-machine validation and audit history."""
    delivery = delivery_service.get_delivery(db, delivery_id)
    if not delivery:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Delivery '{delivery_id}' not found.")

    try:
        updated = delivery_service.update_delivery_status(db, delivery, payload)
        return serialize_delivery(updated)
    except InvalidStatusTransitionError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.message)


@router.post("/{delivery_id}/assign", response_model=DeliveryResponse)
def assign_rider_to_delivery(
    delivery_id: str,
    payload: RiderAssignRequest,
    db: Session = Depends(get_db)
):
    """Assign or reassign an available rider to a delivery task."""
    delivery = delivery_service.get_delivery(db, delivery_id)
    if not delivery:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Delivery '{delivery_id}' not found.")

    try:
        updated = RiderAssignmentService.assign_or_reassign_rider(
            db=db,
            delivery=delivery,
            rider_id=payload.rider_id,
            actor_id=payload.actor_id or "system",
            actor_role=payload.actor_role or "dispatcher",
            reason=payload.reason
        )
        return serialize_delivery(updated)
    except AssignmentError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.get("/{delivery_id}/eligible-riders")
def get_eligible_riders_for_delivery(delivery_id: str, db: Session = Depends(get_db)):
    """Query available candidate riders ranked by proximity, workload, and rating."""
    delivery = delivery_service.get_delivery(db, delivery_id)
    if not delivery:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Delivery '{delivery_id}' not found.")

    eligible = RiderAssignmentService.get_eligible_riders(db, delivery)
    return [
        {
            "rider_id": r.id,
            "name": r.name,
            "vehicle_type": r.vehicle_type,
            "rating": r.rating,
            "current_workload_count": r.current_workload_count,
            "max_concurrent_orders": r.max_concurrent_orders,
            "distance_to_pickup_km": dist_km
        }
        for r, dist_km in eligible
    ]


@router.post("/{delivery_id}/optimize-route", response_model=RouteOptimizationResultResponse)
def optimize_delivery_route(
    delivery_id: str,
    payload: RouteCalculateRequest,
    db: Session = Depends(get_db)
):
    """Calculate and persist an optimized route for the delivery task."""
    delivery = delivery_service.get_delivery(db, delivery_id)
    if not delivery:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Delivery '{delivery_id}' not found.")

    route = route_service.plan_route_for_delivery(
        db=db,
        delivery=delivery,
        provider_name=payload.provider or "haversine_builtin",
        vehicle_type=payload.vehicle_type or "electric_bike"
    )

    waypoints = []
    if route.waypoints_json:
        try:
            waypoints = json.loads(route.waypoints_json)
        except Exception:
            waypoints = []

    return {
        "delivery_id": delivery.id,
        "route_id": route.id,
        "provider": route.provider,
        "distance_km": route.distance_km,
        "duration_minutes": route.duration_minutes,
        "energy_consumption_kwh": route.energy_consumption_kwh,
        "waypoints": waypoints,
        "origin": {
            "address": delivery.pickup_address,
            "lat": delivery.pickup_lat,
            "lng": delivery.pickup_lng
        },
        "destination": {
            "address": delivery.dropoff_address,
            "lat": delivery.dropoff_lat,
            "lng": delivery.dropoff_lng
        },
        "vehicle_type": payload.vehicle_type or "electric_bike"
    }


@router.post("/optimize-batch", response_model=OptimizationBatchResultResponse)
def optimize_batch_deliveries(
    payload: BatchOptimizationRequest,
    db: Session = Depends(get_db)
):
    """
    Batch optimization solving multi-delivery assignments and routes
    using classical OR-Tools constraint solver or quantum hybrid interface.
    """
    deliveries = db.query(Delivery).filter(Delivery.id.in_(payload.delivery_ids)).all()
    if not deliveries:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No matching deliveries found.")

    if payload.rider_ids:
        riders = db.query(Rider).filter(Rider.id.in_(payload.rider_ids)).all()
    else:
        riders = db.query(Rider).filter(Rider.is_online == True, Rider.status == "available").all()

    if not riders:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="No active available riders for batch optimization.")

    optimizer_type = (payload.optimizer_type or "classical_ortools").lower().strip()

    if optimizer_type == "quantum_hybrid":
        result = quantum_optimizer.optimize(deliveries, riders)
    elif optimizer_type == "classical_heuristic":
        result = heuristic_optimizer.optimize(deliveries, riders)
    else:
        result = ortools_optimizer.optimize(deliveries, riders)

    return result
