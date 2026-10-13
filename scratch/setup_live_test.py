import sys, os
sys.path.insert(0, os.getcwd())

from logistics.database import SessionLocal
from logistics.models import Delivery, Rider, DeliveryRoute
from logistics.route_planning import RoutePlanningService
import json

db = SessionLocal()

try:
    # 1. Rider: Sathesh Ittraju
    rider = db.query(Rider).filter_by(id="rider_sathesh").first()
    if not rider:
        rider = Rider(
            id="rider_sathesh",
            name="Sathesh Ittraju",
            phone="+91 98888 77777",
            email="sathesh.ittraju@riderzpro.demo",
            vehicle_type="electric_bike",
            certification="Senior EV Powertrain Specialist",
            skills=json.dumps(["EV_BATTERY_INSTALL", "EXPRESS_DELIVERY"]),
            current_lat=16.5062,
            current_lng=80.6480,
            status="busy",
            is_online=True,
            max_payload_kg=35.0,
            max_concurrent_orders=3,
            current_workload_count=1,
            rating=5.0
        )
        db.add(rider)
    else:
        rider.name = "Sathesh Ittraju"
        rider.current_lat = 16.5062
        rider.current_lng = 80.6480
        rider.is_online = True
        rider.status = "busy"
    
    db.commit()
    print(f"Rider ready: {rider.id} ({rider.name})")

    # 2. Delivery: delivery_vijayawada_amaravati_live
    deliv = db.query(Delivery).filter_by(id="delivery_vijayawada_amaravati_live").first()
    if not deliv:
        deliv = Delivery(
            id="delivery_vijayawada_amaravati_live",
            order_id="delivery_vijayawada_amaravati_live",
            customer_id="cust_demo",
            customer_name="Aakash Sharma",
            customer_phone="+91 98765 43210",
            vendor_id="vnd_nexgen_ev",
            vendor_name="NexGen EV Logistics",
            pickup_address="Vijayawada Central Hub (16.5062, 80.6480)",
            pickup_lat=16.5062,
            pickup_lng=80.6480,
            dropoff_address="Amaravati Secretariat / City Center (16.5740, 80.3575)",
            dropoff_lat=16.5740,
            dropoff_lng=80.3575,
            package_weight_kg=8.5,
            package_dimensions="30x20x15 cm",
            priority="express",
            status="in_transit",
            assigned_rider_id="rider_sathesh",
            notes="Live movement test Vijayawada -> Amaravati"
        )
        db.add(deliv)
    else:
        deliv.status = "in_transit"
        deliv.assigned_rider_id = "rider_sathesh"
        deliv.pickup_lat = 16.5062
        deliv.pickup_lng = 80.6480
        deliv.dropoff_lat = 16.5740
        deliv.dropoff_lng = 80.3575

    db.commit()
    db.refresh(deliv)
    print(f"Delivery ready: {deliv.id}, assigned to {deliv.assigned_rider_id}")

    # 3. Generate route using existing RoutePlanningService
    planner = RoutePlanningService()
    # Remove older route for this delivery if any
    db.query(DeliveryRoute).filter_by(delivery_id=deliv.id).delete()
    db.commit()

    route = planner.plan_route_for_delivery(db, deliv, provider_name="osrm")
    raw_wps = json.loads(route.waypoints_json) if route.waypoints_json else []
    geom_count = len(raw_wps.get("geometry", raw_wps.get("waypoints", []))) if isinstance(raw_wps, dict) else len(raw_wps)
    wps_count = len(raw_wps.get("waypoints", [])) if isinstance(raw_wps, dict) else len(raw_wps)
    print(f"Route planned with {route.provider}: distance={route.distance_km}km, road_geometry_points={geom_count}, waypoints={wps_count}")

finally:
    db.close()
