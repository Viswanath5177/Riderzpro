"""Real-time WebSocket streaming and event broadcasting for Riderzpro delivery tracking."""

import asyncio
import logging
from collections import defaultdict
from datetime import datetime
from typing import Dict, Set, Optional, Any, Callable
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, Query, status
from sqlalchemy.orm import Session

from logistics.database import get_db
from logistics.models import Delivery

logger = logging.getLogger("riderzpro.realtime")

_main_event_loop: Optional[asyncio.AbstractEventLoop] = None


def set_main_loop(loop: asyncio.AbstractEventLoop):
    """Store reference to the main asyncio event loop for thread-safe cross-thread dispatching."""
    global _main_event_loop
    _main_event_loop = loop


def dispatch_coroutine(coro):
    """Safely schedule an asynchronous coroutine from either async or sync contexts."""
    global _main_event_loop
    try:
        loop = asyncio.get_running_loop()
        if loop and loop.is_running():
            asyncio.create_task(coro)
            return
    except RuntimeError:
        pass

    if _main_event_loop and _main_event_loop.is_running():
        asyncio.run_coroutine_threadsafe(coro, _main_event_loop)
        return

    # Fallback for standalone/sync runner
    try:
        temp_loop = asyncio.new_event_loop()
        temp_loop.run_until_complete(coro)
        temp_loop.close()
    except Exception as e:
        logger.error(f"Error executing realtime dispatch fallback: {e}")


class DeliveryConnectionManager:
    """Connection manager maintaining WebSocket subscriptions segregated by delivery ID."""

    def __init__(self):
        self.active_connections: Dict[str, Set[WebSocket]] = defaultdict(set)
        self.connection_meta: Dict[WebSocket, Dict[str, Any]] = {}
        self._lock = asyncio.Lock()

    async def connect(self, delivery_id: str, websocket: WebSocket, meta: Optional[Dict[str, Any]] = None):
        """Register a new authenticated WebSocket client for delivery tracking."""
        async with self._lock:
            self.active_connections[delivery_id].add(websocket)
            if meta:
                self.connection_meta[websocket] = meta
        count = len(self.active_connections[delivery_id])
        logger.info(f"WebSocket client connected to delivery {delivery_id}. Active subscribers for delivery: {count}")

    async def disconnect(self, delivery_id: str, websocket: WebSocket):
        """Safely remove disconnected client and cleanup empty sets."""
        async with self._lock:
            if delivery_id in self.active_connections:
                self.active_connections[delivery_id].discard(websocket)
                if not self.active_connections[delivery_id]:
                    del self.active_connections[delivery_id]
            self.connection_meta.pop(websocket, None)
        logger.info(f"WebSocket client disconnected from delivery {delivery_id}")

    async def broadcast_to_delivery(self, delivery_id: str, message: Dict[str, Any], order_id: Optional[str] = None):
        """Broadcast real-time message strictly to clients watching the given delivery ID or order ID."""
        target_ids = [delivery_id]
        if order_id and order_id != delivery_id:
            target_ids.append(order_id)

        async with self._lock:
            client_set: Set[WebSocket] = set()
            for did in target_ids:
                client_set.update(self.active_connections.get(did, set()))
            clients = list(client_set)

        if not clients:
            logger.debug(f"No active WebSocket clients subscribed to delivery {delivery_id}")
            return

        logger.info(f"Broadcasting '{message.get('event')}' to {len(clients)} client(s) on delivery {delivery_id}")
        dead_clients = []
        for ws in clients:
            try:
                await ws.send_json(message)
            except Exception as e:
                logger.warning(f"Error sending message to WebSocket client on delivery {delivery_id}: {e}")
                dead_clients.append(ws)

        if dead_clients:
            async with self._lock:
                for ws in dead_clients:
                    for did in target_ids:
                        if did in self.active_connections:
                            self.active_connections[did].discard(ws)
                    self.connection_meta.pop(ws, None)

    async def close_delivery_connections(
        self,
        delivery_id: str,
        final_event: Optional[Dict[str, Any]] = None,
        code: int = 1000
    ):
        """Send optional final event and gracefully close all WebSocket connections for a delivery."""
        async with self._lock:
            clients = list(self.active_connections.get(delivery_id, set()))

        for ws in clients:
            try:
                if final_event:
                    await ws.send_json(final_event)
                await ws.close(code=code)
            except Exception as e:
                logger.debug(f"Error while closing delivery {delivery_id} socket: {e}")
            finally:
                await self.disconnect(delivery_id, ws)

    def get_connection_count(self, delivery_id: Optional[str] = None) -> int:
        """Return count of active connections for a specific delivery or total across all deliveries."""
        if delivery_id:
            return len(self.active_connections.get(delivery_id, set()))
        return sum(len(conns) for conns in self.active_connections.values())


# Singleton instance
realtime_manager = DeliveryConnectionManager()


def handle_realtime_event(event_name: str, payload: Dict[str, Any]):
    """
    Subscriber callback receiving events from LocationTrackingService and DeliveryService.
    Translates and broadcasts delivery events to WebSocket clients.
    """
    if event_name == "RIDER_LOCATION_UPDATED":
        delivery_id = payload.get("delivery_id")
        order_id = payload.get("order_id")
        if not delivery_id and not order_id:
            return

        battery_data = None
        if payload.get("battery_soc_percent") is not None or payload.get("battery_temperature_celsius") is not None:
            battery_data = {
                "soc_percent": payload.get("battery_soc_percent"),
                "temperature_celsius": payload.get("battery_temperature_celsius")
            }

        realtime_payload = {
            "event": "RIDER_LOCATION_UPDATED",
            "delivery_id": delivery_id,
            "order_id": order_id,
            "rider": {
                "id": payload.get("rider_id"),
                "latitude": payload.get("latitude"),
                "longitude": payload.get("longitude"),
                "heading_degrees": payload.get("heading_degrees"),
                "speed_kmh": payload.get("speed_kmh")
            },
            "eta_minutes": payload.get("eta_minutes"),
            "distance_km": payload.get("distance_km"),
            "timestamp": payload.get("timestamp"),
            "battery": battery_data
        }
        dispatch_coroutine(realtime_manager.broadcast_to_delivery(delivery_id, realtime_payload, order_id=order_id))

    elif event_name in ("RIDER_APPROACHING", "RIDER_ARRIVED", "RIDER_ROUTE_DEVIATION"):
        # Geofence milestone and route deviation events — broadcast the payload directly to the delivery's WebSocket clients.
        delivery_id = payload.get("delivery_id")
        order_id = payload.get("order_id")
        if delivery_id or order_id:
            dispatch_coroutine(realtime_manager.broadcast_to_delivery(delivery_id or order_id, payload, order_id=order_id))

    elif event_name == "DELIVERY_STATUS_CHANGED":
        delivery_id = payload.get("delivery_id")
        order_id = payload.get("order_id")
        to_status = payload.get("to_status")
        if delivery_id or order_id:
            target_id = delivery_id or order_id
            if to_status in ("delivered", "cancelled", "failed"):
                final_event = {
                    "event": "DELIVERY_COMPLETED",
                    "delivery_id": delivery_id,
                    "order_id": order_id,
                    "status": to_status,
                    "reason": payload.get("reason"),
                    "message": f"Delivery transitioned to terminal state '{to_status}'. Tracking concluded.",
                    "timestamp": datetime.utcnow().isoformat()
                }
                dispatch_coroutine(realtime_manager.close_delivery_connections(target_id, final_event=final_event, code=1000))
                if order_id and order_id != target_id:
                    dispatch_coroutine(realtime_manager.close_delivery_connections(order_id, final_event=final_event, code=1000))
            else:
                status_event = {
                    "event": "DELIVERY_STATUS_UPDATED",
                    "delivery_id": delivery_id,
                    "order_id": order_id,
                    "from_status": payload.get("from_status"),
                    "status": to_status,
                    "reason": payload.get("reason"),
                    "timestamp": datetime.utcnow().isoformat()
                }
                dispatch_coroutine(realtime_manager.broadcast_to_delivery(target_id, status_event, order_id=order_id))


def setup_realtime_subscribers(loc_service, del_service):
    """Wire real-time event handlers into location and delivery service instances."""
    loc_service.subscribe_to_events(handle_realtime_event)
    del_service.subscribe_to_status_events(handle_realtime_event)


realtime_router = APIRouter(tags=["Real-Time Tracking & WebSockets"])


@realtime_router.websocket("/ws/deliveries/{delivery_id}/tracking")
@realtime_router.websocket("/ws/deliveries/{delivery_id}/track")
async def delivery_tracking_websocket(
    websocket: WebSocket,
    delivery_id: str,
    user_id: Optional[str] = Query(None),
    user_role: Optional[str] = Query(None),
    token: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """
    WebSocket endpoint streaming live rider GPS coordinates, heading, speed, ETA, and status.
    Enforces delivery authorization:
      - Customers can only subscribe to their own deliveries.
      - Assigned riders can subscribe to their active deliveries.
      - Dispatchers and admins have authorized supervision access.
    Immediately transmits an INITIAL_TRACKING_SNAPSHOT upon connection.
    """
    # Extract identity from query parameters or request headers
    effective_user_id = user_id or websocket.headers.get("x-user-id") or websocket.headers.get("user-id")
    effective_user_role = user_role or websocket.headers.get("x-user-role") or websocket.headers.get("user-role")

    # 1. Validate delivery existence
    delivery = db.query(Delivery).filter(
        (Delivery.id == delivery_id) | (Delivery.order_id == delivery_id)
    ).first()
    if not delivery:
        logger.warning(f"WebSocket rejected: Delivery '{delivery_id}' does not exist.")
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION, reason="Delivery not found")
        return

    # 2. Authorization check
    is_authorized = False
    clean_user = "".join(ch for ch in str(effective_user_id or "") if ch.isdigit())
    clean_phone = "".join(ch for ch in str(getattr(delivery, "customer_phone", "") or "") if ch.isdigit())
    phone_match = bool(clean_user and clean_phone and (clean_user.endswith(clean_phone[-10:]) or clean_phone.endswith(clean_user[-10:]))) if (len(clean_user) >= 10 and len(clean_phone) >= 10) else False
    demo_match = bool(effective_user_id in ("cust_demo", "usr_aakash_default") and delivery.customer_id == "cust_demo")

    if effective_user_role:
        role_clean = effective_user_role.lower().strip()
        if role_clean in ("admin", "dispatcher", "supervisor", "system"):
            is_authorized = True
        elif role_clean == "customer" and (
            effective_user_id == delivery.customer_id
            or (getattr(delivery, "customer_phone", None) and effective_user_id == delivery.customer_phone)
            or phone_match
            or demo_match
        ):
            is_authorized = True
        elif role_clean == "rider" and effective_user_id == delivery.assigned_rider_id:
            is_authorized = True
    elif effective_user_id:
        # If role omitted but user_id matches customer or rider
        if (
            effective_user_id == delivery.customer_id
            or effective_user_id == delivery.assigned_rider_id
            or phone_match
            or demo_match
        ):
            is_authorized = True

    if not is_authorized:
        logger.warning(
            f"WebSocket unauthorized access attempt: user_id='{effective_user_id}', role='{effective_user_role}' "
            f"on delivery '{delivery_id}' owned by customer '{delivery.customer_id}'."
        )
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION, reason="Unauthorized subscription")
        return

    # 3. Accept connection and register with connection manager
    await websocket.accept()
    await realtime_manager.connect(
        delivery_id=delivery.id,
        websocket=websocket,
        meta={"user_id": effective_user_id, "user_role": effective_user_role}
    )
    if delivery.order_id and delivery.order_id != delivery.id:
        await realtime_manager.connect(
            delivery_id=delivery.order_id,
            websocket=websocket,
            meta={"user_id": effective_user_id, "user_role": effective_user_role}
        )
    if delivery_id not in (delivery.id, delivery.order_id):
        await realtime_manager.connect(
            delivery_id=delivery_id,
            websocket=websocket,
            meta={"user_id": effective_user_id, "user_role": effective_user_role}
        )

    # 4. Generate and send initial tracking snapshot
    from logistics.router import location_service
    try:
        snapshot = location_service.get_delivery_tracking(
            db=db,
            delivery_id=delivery.id,
            actor_id=effective_user_id,
            actor_role=effective_user_role
        )
        snapshot_dict = snapshot.model_dump(mode="json")
        initial_payload = {
            "event": "INITIAL_TRACKING_SNAPSHOT",
            "timestamp": datetime.utcnow().isoformat(),
            **snapshot_dict
        }
        await websocket.send_json(initial_payload)
    except Exception as e:
        logger.error(f"Error generating initial tracking snapshot for {delivery_id}: {e}")

    # 5. Handle terminal delivery states immediately
    if delivery.status in ("delivered", "cancelled", "failed"):
        terminal_event = {
            "event": "DELIVERY_COMPLETED",
            "delivery_id": delivery_id,
            "status": delivery.status,
            "message": f"Delivery is in terminal state '{delivery.status}'. Real-time tracking concluded.",
            "timestamp": datetime.utcnow().isoformat()
        }
        await websocket.send_json(terminal_event)
        await realtime_manager.disconnect(delivery_id, websocket)
        await websocket.close(code=1000)
        return

    # 6. Maintain persistent socket connection and listen for client pings
    try:
        while True:
            msg = await websocket.receive_text()
            if msg == "ping":
                await websocket.send_text("pong")
    except WebSocketDisconnect:
        logger.info(f"WebSocket client disconnected from delivery {delivery_id}")
    except Exception as e:
        logger.warning(f"WebSocket communication error on delivery {delivery_id}: {e}")
    finally:
        await realtime_manager.disconnect(delivery.id, websocket)
        if delivery.order_id and delivery.order_id != delivery.id:
            await realtime_manager.disconnect(delivery.order_id, websocket)
        if delivery_id not in (delivery.id, delivery.order_id):
            await realtime_manager.disconnect(delivery_id, websocket)
