"""Pydantic v2 validation and serialization schemas for Riderzpro Delivery Subsystem."""

from datetime import datetime
from typing import Optional, List, Any, Dict
from pydantic import BaseModel, Field, field_validator, model_validator, ConfigDict


VALID_DELIVERY_STATUSES = {
    "pending",
    "assigned",
    "picked_up",
    "in_transit",
    "delivered",
    "failed",
    "cancelled",
}

VALID_PRIORITIES = {"standard", "express", "same_day"}
VALID_VEHICLE_TYPES = {"regular_bike", "electric_bike", "cargo_ebike", "van"}


class LocationCoordinate(BaseModel):
    """Geographic coordinate pair."""
    lat: float = Field(..., ge=-90.0, le=90.0, description="Latitude in decimal degrees")
    lng: float = Field(..., ge=-180.0, le=180.0, description="Longitude in decimal degrees")


class DeliveryCreate(BaseModel):
    """Request payload to instantiate a new delivery task."""
    order_id: str = Field(..., min_length=1, max_length=64, description="Originating order identifier")
    customer_id: str = Field(..., min_length=1, max_length=64)
    customer_name: Optional[str] = Field(None, max_length=128)
    customer_phone: Optional[str] = Field(None, max_length=32)
    vendor_id: str = Field(..., min_length=1, max_length=64)
    vendor_name: Optional[str] = Field(None, max_length=128)

    pickup_address: str = Field(..., min_length=1, max_length=512)
    pickup_lat: float = Field(..., ge=-90.0, le=90.0)
    pickup_lng: float = Field(..., ge=-180.0, le=180.0)

    dropoff_address: str = Field(..., min_length=1, max_length=512)
    dropoff_lat: float = Field(..., ge=-90.0, le=90.0)
    dropoff_lng: float = Field(..., ge=-180.0, le=180.0)

    package_weight_kg: float = Field(5.0, gt=0.0, le=200.0, description="Weight in kilograms")
    package_dimensions: Optional[str] = Field("30x20x15 cm", max_length=128)
    priority: str = Field("standard", description="standard | express | same_day")
    deadline: Optional[datetime] = None
    notes: Optional[str] = None

    @field_validator("priority")
    @classmethod
    def validate_priority(cls, v: str) -> str:
        v_clean = v.lower().strip()
        if v_clean not in VALID_PRIORITIES:
            raise ValueError(f"Priority must be one of {list(VALID_PRIORITIES)}")
        return v_clean

    @model_validator(mode="after")
    def validate_distinct_locations(self) -> "DeliveryCreate":
        if (
            abs(self.pickup_lat - self.dropoff_lat) < 1e-6
            and abs(self.pickup_lng - self.dropoff_lng) < 1e-6
        ):
            raise ValueError("Pickup and drop-off coordinates cannot be identical.")
        return self


class DeliveryStatusUpdate(BaseModel):
    """Request payload to transition delivery status."""
    status: str = Field(..., description="Target delivery status")
    actor_id: Optional[str] = Field("system", max_length=64)
    actor_role: Optional[str] = Field("system", max_length=32, description="rider | vendor | customer | admin | system")
    reason: Optional[str] = Field(None, max_length=512)
    proof_of_delivery: Optional[str] = Field(None, description="OTP confirmation code, digital signature, or image URL")

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: str) -> str:
        v_clean = v.lower().strip()
        if v_clean not in VALID_DELIVERY_STATUSES:
            raise ValueError(f"Status must be one of {list(VALID_DELIVERY_STATUSES)}")
        return v_clean


class RiderAssignRequest(BaseModel):
    """Request payload to assign or reassign a rider."""
    rider_id: Optional[str] = Field(None, description="Explicit rider ID. If null, optimal rider is auto-assigned.")
    actor_id: Optional[str] = Field("system", max_length=64)
    actor_role: Optional[str] = Field("dispatcher", max_length=32)
    reason: Optional[str] = Field(None, max_length=512)


class RouteCalculateRequest(BaseModel):
    """Request payload to calculate an optimized route for a delivery."""
    provider: Optional[str] = Field("haversine_builtin", description="haversine_builtin | osrm | google_maps")
    vehicle_type: Optional[str] = Field("electric_bike", description="regular_bike | electric_bike | cargo_ebike | van")


class BatchOptimizationRequest(BaseModel):
    """Request payload for multi-delivery route & assignment optimization."""
    delivery_ids: List[str] = Field(..., min_length=1, description="List of pending delivery IDs to optimize")
    rider_ids: Optional[List[str]] = Field(None, description="Candidate rider IDs pool. If omitted, all available riders used.")
    optimizer_type: Optional[str] = Field("classical_ortools", description="classical_ortools | classical_heuristic | quantum_hybrid")


# Response Models

class RiderResponse(BaseModel):
    id: str
    name: str
    phone: str
    email: Optional[str] = None
    vehicle_type: str
    certification: Optional[str] = None
    skills: List[str] = []
    current_lat: float
    current_lng: float
    status: str
    is_online: bool
    max_payload_kg: float
    max_concurrent_orders: int
    current_workload_count: int
    rating: float

    model_config = ConfigDict(from_attributes=True)


class DeliveryStatusHistoryResponse(BaseModel):
    id: str
    from_status: Optional[str] = None
    to_status: str
    changed_by_user_id: str
    changed_by_role: str
    reason: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class DeliveryRouteResponse(BaseModel):
    id: str
    delivery_id: str
    rider_id: Optional[str] = None
    provider: str
    distance_km: float
    duration_minutes: float
    energy_consumption_kwh: float
    waypoints: List[Dict[str, Any]] = []
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class DeliveryResponse(BaseModel):
    id: str
    order_id: str
    customer_id: str
    customer_name: Optional[str] = None
    customer_phone: Optional[str] = None
    vendor_id: str
    vendor_name: Optional[str] = None

    pickup_address: str
    pickup_lat: float
    pickup_lng: float

    dropoff_address: str
    dropoff_lat: float
    dropoff_lng: float

    package_weight_kg: float
    package_dimensions: Optional[str] = None
    priority: str
    deadline: Optional[datetime] = None

    status: str
    assigned_rider_id: Optional[str] = None
    assigned_rider: Optional[RiderResponse] = None

    proof_of_delivery: Optional[str] = None
    failure_reason: Optional[str] = None
    cancellation_reason: Optional[str] = None
    notes: Optional[str] = None

    created_at: datetime
    updated_at: datetime

    latest_route: Optional[DeliveryRouteResponse] = None
    status_history: List[DeliveryStatusHistoryResponse] = []

    model_config = ConfigDict(from_attributes=True)


class DeliveryListResponse(BaseModel):
    items: List[DeliveryResponse]
    total: int
    page: int
    limit: int
    total_pages: int


class RouteOptimizationResultResponse(BaseModel):
    delivery_id: str
    route_id: str
    provider: str
    distance_km: float
    duration_minutes: float
    energy_consumption_kwh: float
    waypoints: List[Dict[str, Any]]
    origin: Dict[str, Any]
    destination: Dict[str, Any]
    vehicle_type: str


class OptimizationBatchResultResponse(BaseModel):
    optimizer_type: str
    execution_time_ms: float
    total_deliveries: int
    assigned_deliveries: int
    assignments: List[Dict[str, Any]]
    unassigned_delivery_ids: List[str]
    total_estimated_distance_km: float
    quantum_metadata: Optional[Dict[str, Any]] = None
