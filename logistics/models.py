"""SQLAlchemy models for Riderzpro Delivery Management Subsystem."""

import uuid
from datetime import datetime
from sqlalchemy import (
    Column,
    String,
    Float,
    Integer,
    Boolean,
    DateTime,
    Text,
    ForeignKey,
    Index
)
from sqlalchemy.orm import relationship
from logistics.database import Base


def generate_id(prefix: str = "del") -> str:
    """Generate a prefixed unique entity ID."""
    return f"{prefix}_{uuid.uuid4().hex[:12]}"


class Delivery(Base):
    """Delivery Task Entity representing a product fulfillment request."""
    __tablename__ = "deliveries"

    id = Column(String(64), primary_key=True, default=lambda: generate_id("del"))
    order_id = Column(String(64), nullable=False, index=True)
    customer_id = Column(String(64), nullable=False, index=True)
    customer_name = Column(String(128), nullable=True)
    customer_phone = Column(String(32), nullable=True)
    vendor_id = Column(String(64), nullable=False, index=True)
    vendor_name = Column(String(128), nullable=True)

    pickup_address = Column(String(512), nullable=False)
    pickup_lat = Column(Float, nullable=False)
    pickup_lng = Column(Float, nullable=False)

    dropoff_address = Column(String(512), nullable=False)
    dropoff_lat = Column(Float, nullable=False)
    dropoff_lng = Column(Float, nullable=False)

    package_weight_kg = Column(Float, default=5.0)
    package_dimensions = Column(String(128), default="30x20x15 cm")
    priority = Column(String(32), default="standard", index=True)  # standard, express, same_day
    deadline = Column(DateTime, nullable=True)

    status = Column(String(32), default="pending", index=True)
    assigned_rider_id = Column(String(64), ForeignKey("riders.id"), nullable=True, index=True)

    proof_of_delivery = Column(Text, nullable=True)
    failure_reason = Column(Text, nullable=True)
    cancellation_reason = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    assigned_rider = relationship("Rider", back_populates="deliveries")
    assignments = relationship("RiderAssignment", back_populates="delivery", cascade="all, delete-orphan")
    routes = relationship("DeliveryRoute", back_populates="delivery", cascade="all, delete-orphan")
    status_history = relationship("DeliveryStatusHistory", back_populates="delivery", cascade="all, delete-orphan", order_by="DeliveryStatusHistory.created_at")

    __table_args__ = (
        Index("ix_deliveries_order_status", "order_id", "status"),
        Index("ix_deliveries_vendor_status", "vendor_id", "status"),
    )


class Rider(Base):
    """Rider / Technician Entity in fulfillment fleet."""
    __tablename__ = "riders"

    id = Column(String(64), primary_key=True)
    name = Column(String(128), nullable=False)
    phone = Column(String(32), nullable=False)
    email = Column(String(128), nullable=True)
    vehicle_type = Column(String(32), default="electric_bike")  # regular_bike, electric_bike, cargo_ebike, van
    certification = Column(String(256), nullable=True)
    skills = Column(Text, default="[]")  # JSON encoded list of strings

    current_lat = Column(Float, default=12.9716)
    current_lng = Column(Float, default=77.5946)

    status = Column(String(32), default="available", index=True)  # available, busy, on_break, offline
    is_online = Column(Boolean, default=True)

    max_payload_kg = Column(Float, default=30.0)
    max_concurrent_orders = Column(Integer, default=3)
    current_workload_count = Column(Integer, default=0)
    rating = Column(Float, default=4.9)

    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    deliveries = relationship("Delivery", back_populates="assigned_rider")
    assignments = relationship("RiderAssignment", back_populates="rider")


class RiderAssignment(Base):
    """Record of dispatch binding between rider and delivery task."""
    __tablename__ = "rider_assignments"

    id = Column(String(64), primary_key=True, default=lambda: generate_id("asg"))
    delivery_id = Column(String(64), ForeignKey("deliveries.id"), nullable=False, index=True)
    rider_id = Column(String(64), ForeignKey("riders.id"), nullable=False, index=True)

    status = Column(String(32), default="assigned", index=True)  # assigned, active, reassigned, completed, cancelled
    assigned_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    reassigned_at = Column(DateTime, nullable=True)
    reassignment_reason = Column(Text, nullable=True)

    # Relationships
    delivery = relationship("Delivery", back_populates="assignments")
    rider = relationship("Rider", back_populates="assignments")


class DeliveryRoute(Base):
    """Calculated route itinerary and optimization metric."""
    __tablename__ = "delivery_routes"

    id = Column(String(64), primary_key=True, default=lambda: generate_id("rt"))
    delivery_id = Column(String(64), ForeignKey("deliveries.id"), nullable=False, index=True)
    rider_id = Column(String(64), ForeignKey("riders.id"), nullable=True)

    provider = Column(String(64), default="haversine_builtin")
    distance_km = Column(Float, nullable=False)
    duration_minutes = Column(Float, nullable=False)
    energy_consumption_kwh = Column(Float, default=0.0)
    waypoints_json = Column(Text, nullable=True)  # JSON encoded list of lat/lng stops

    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    delivery = relationship("Delivery", back_populates="routes")


class DeliveryStatusHistory(Base):
    """Audit log for delivery state transitions."""
    __tablename__ = "delivery_status_history"

    id = Column(String(64), primary_key=True, default=lambda: generate_id("dsh"))
    delivery_id = Column(String(64), ForeignKey("deliveries.id"), nullable=False, index=True)

    from_status = Column(String(32), nullable=True)
    to_status = Column(String(32), nullable=False)
    changed_by_user_id = Column(String(64), default="system")
    changed_by_role = Column(String(32), default="system")
    reason = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    # Relationships
    delivery = relationship("Delivery", back_populates="status_history")
