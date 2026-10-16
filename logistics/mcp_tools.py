"""Model Context Protocol (MCP) tool specifications and handler definitions for approved logistics operations."""

from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from logistics.service import DeliveryService
from logistics.assignment import RiderAssignmentService
from logistics.route_planning import RoutePlanningService

# Tool Declarations following standard Model Context Protocol schema
MCP_LOGISTICS_TOOLS = [
    {
        "name": "logistics_find_available_deliveries",
        "description": "Find unassigned or pending delivery fulfillment tasks matching criteria.",
        "parameters": {
            "type": "object",
            "properties": {
                "vendor_id": {"type": "string", "description": "Filter by vendor/merchant ID"},
                "priority": {"type": "string", "enum": ["standard", "express", "same_day"]},
                "limit": {"type": "integer", "default": 10}
            }
        },
        "required_permissions": ["logistics:read"]
    },
    {
        "name": "logistics_check_delivery_status",
        "description": "Retrieve real-time status, assigned rider details, and tracking for a delivery ID.",
        "parameters": {
            "type": "object",
            "properties": {
                "delivery_id": {"type": "string", "description": "Unique delivery task ID"}
            },
            "required": ["delivery_id"]
        },
        "required_permissions": ["logistics:read"]
    },
    {
        "name": "logistics_propose_rider_assignment",
        "description": "Propose or evaluate optimal rider assignment for a delivery without executing a binding change without approval.",
        "parameters": {
            "type": "object",
            "properties": {
                "delivery_id": {"type": "string", "description": "Unique delivery task ID"},
                "max_search_radius_km": {"type": "number", "default": 25.0}
            },
            "required": ["delivery_id"]
        },
        "required_permissions": ["logistics:assign"]
    },
    {
        "name": "logistics_request_route_optimization",
        "description": "Calculate optimal transit distance, duration, and energy profile for a delivery waypoint pair.",
        "parameters": {
            "type": "object",
            "properties": {
                "delivery_id": {"type": "string", "description": "Delivery ID"},
                "provider": {"type": "string", "enum": ["haversine_builtin", "osrm", "google_maps"], "default": "haversine_builtin"}
            },
            "required": ["delivery_id"]
        },
        "required_permissions": ["logistics:read"]
    }
]


class LogisticsMCPHandler:
    """Authorized handler bridge for executing MCP operations."""

    def __init__(self, db: Session):
        self.db = db
        self.delivery_service = DeliveryService()
        self.route_service = RoutePlanningService()

    def check_authorization(self, tool_name: str, user_role: str) -> bool:
        """Verify role has required permissions for tool execution."""
        write_tools = {"logistics_propose_rider_assignment"}
        if tool_name in write_tools and user_role not in ("admin", "dispatcher", "system"):
            return False
        return True

    def execute_tool(self, tool_name: str, arguments: Dict[str, Any], user_role: str = "system") -> Dict[str, Any]:
        """Execute approved MCP tool safely."""
        if not self.check_authorization(tool_name, user_role):
            return {
                "error": "Forbidden",
                "message": f"Role '{user_role}' is not authorized to execute '{tool_name}'."
            }

        if tool_name == "logistics_find_available_deliveries":
            deliveries, total = self.delivery_service.list_deliveries(
                self.db,
                status="pending",
                vendor_id=arguments.get("vendor_id"),
                priority=arguments.get("priority"),
                limit=arguments.get("limit", 10)
            )
            return {
                "total_available": total,
                "deliveries": [
                    {
                        "delivery_id": d.id,
                        "order_id": d.order_id,
                        "pickup": d.pickup_address,
                        "dropoff": d.dropoff_address,
                        "priority": d.priority,
                        "weight_kg": d.package_weight_kg
                    }
                    for d in deliveries
                ]
            }

        elif tool_name == "logistics_check_delivery_status":
            del_id = arguments.get("delivery_id")
            delivery = self.delivery_service.get_delivery(self.db, del_id)
            if not delivery:
                return {"error": "Not Found", "message": f"Delivery '{del_id}' does not exist."}

            return {
                "delivery_id": delivery.id,
                "status": delivery.status,
                "order_id": delivery.order_id,
                "assigned_rider_id": delivery.assigned_rider_id,
                "assigned_rider_name": delivery.assigned_rider.name if delivery.assigned_rider else None,
                "pickup_address": delivery.pickup_address,
                "dropoff_address": delivery.dropoff_address
            }

        elif tool_name == "logistics_propose_rider_assignment":
            del_id = arguments.get("delivery_id")
            delivery = self.delivery_service.get_delivery(self.db, del_id)
            if not delivery:
                return {"error": "Not Found", "message": f"Delivery '{del_id}' does not exist."}

            radius = arguments.get("max_search_radius_km", 25.0)
            eligible = RiderAssignmentService.get_eligible_riders(self.db, delivery, max_search_radius_km=radius)

            return {
                "delivery_id": delivery.id,
                "current_status": delivery.status,
                "proposed_candidates": [
                    {
                        "rider_id": r.id,
                        "name": r.name,
                        "vehicle_type": r.vehicle_type,
                        "distance_km": dist_km,
                        "rating": r.rating,
                        "workload": r.current_workload_count
                    }
                    for r, dist_km in eligible
                ]
            }

        elif tool_name == "logistics_request_route_optimization":
            del_id = arguments.get("delivery_id")
            delivery = self.delivery_service.get_delivery(self.db, del_id)
            if not delivery:
                return {"error": "Not Found", "message": f"Delivery '{del_id}' does not exist."}

            route = self.route_service.plan_route_for_delivery(
                self.db, delivery, provider_name=arguments.get("provider", "haversine_builtin")
            )
            return {
                "delivery_id": delivery.id,
                "distance_km": route.distance_km,
                "duration_minutes": route.duration_minutes,
                "energy_kwh": route.energy_consumption_kwh,
                "provider": route.provider
            }

        return {"error": "Unknown Tool", "message": f"Tool '{tool_name}' not implemented."}
