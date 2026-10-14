import sys, os
sys.path.insert(0, os.getcwd())

from logistics.database import SessionLocal, init_db
from logistics.models import Delivery, Rider, DeliveryRoute
from logistics.route_planning import RoutePlanningService
import json

SEED_DATA = [
    {
        "rider": {
            "id": "rider_sathesh",
            "name": "Sathesh Ittraju",
            "phone": "+91 98888 77777",
            "email": "sathesh.ittraju@riderzpro.demo",
            "vehicle_type": "electric_bike",
            "certification": "Senior EV Powertrain Specialist",
            "skills": ["EV_BATTERY_INSTALL", "EXPRESS_DELIVERY"],
            "current_lat": 16.5062,
            "current_lng": 80.6480,
            "status": "busy",
            "is_online": True,
            "max_payload_kg": 35.0,
            "max_concurrent_orders": 3,
            "current_workload_count": 1,
            "rating": 5.0,
        },
        "delivery": {
            "id": "delivery_vijayawada_amaravati_live",
            "order_id": "delivery_vijayawada_amaravati_live",
            "customer_id": "cust_demo",
            "customer_name": "Aakash Sharma",
            "customer_phone": "+91 98765 43210",
            "vendor_id": "vnd_nexgen_ev",
            "vendor_name": "NexGen EV Logistics",
            "pickup_address": "Vijayawada Central Hub, MG Road (16.5062, 80.6480)",
            "pickup_lat": 16.5062,
            "pickup_lng": 80.6480,
            "dropoff_address": "Amaravati Secretariat / City Center (16.5740, 80.3575)",
            "dropoff_lat": 16.5740,
            "dropoff_lng": 80.3575,
            "package_weight_kg": 8.5,
            "package_dimensions": "30x20x15 cm",
            "priority": "express",
            "status": "in_transit",
            "assigned_rider_id": "rider_sathesh",
            "notes": "Live movement test Vijayawada -> Amaravati",
        },
    },
    {
        "rider": {
            "id": "rider_001",
            "name": "Ramesh Kumar",
            "phone": "+91 98111 22222",
            "email": "ramesh.kumar@riderzpro.demo",
            "vehicle_type": "electric_bike",
            "certification": "Certified EV Express Courier",
            "skills": ["EXPRESS_DELIVERY", "HEAVY_CARGO"],
            "current_lat": 28.6280,
            "current_lng": 77.3800,
            "status": "busy",
            "is_online": True,
            "max_payload_kg": 30.0,
            "max_concurrent_orders": 3,
            "current_workload_count": 1,
            "rating": 4.9,
        },
        "delivery": {
            "id": "delivery_noida_delhi_001",
            "order_id": "delivery_noida_delhi_001",
            "customer_id": "cust_demo",
            "customer_name": "Aakash Sharma",
            "customer_phone": "+91 98765 43210",
            "vendor_id": "vnd_nexgen_ev",
            "vendor_name": "NexGen EV Logistics",
            "pickup_address": "Sector 63 Logistics Hub, Noida (28.6280, 77.3800)",
            "pickup_lat": 28.6280,
            "pickup_lng": 77.3800,
            "dropoff_address": "Connaught Place, Central Delhi (28.6315, 77.2167)",
            "dropoff_lat": 28.6315,
            "dropoff_lng": 77.2167,
            "package_weight_kg": 5.0,
            "package_dimensions": "25x20x10 cm",
            "priority": "urgent",
            "status": "in_transit",
            "assigned_rider_id": "rider_001",
            "notes": "Live delivery #1: Sector 63 Noida -> Connaught Place Delhi",
        },
    },
    {
        "rider": {
            "id": "rider_002",
            "name": "Priya Sharma",
            "phone": "+91 98222 33333",
            "email": "priya.sharma@riderzpro.demo",
            "vehicle_type": "cargo_ebike",
            "certification": "Lithium Battery Handling Certified",
            "skills": ["BATTERY_TRANSPORT", "COLD_CHAIN"],
            "current_lat": 28.6260,
            "current_lng": 77.3750,
            "status": "busy",
            "is_online": True,
            "max_payload_kg": 40.0,
            "max_concurrent_orders": 2,
            "current_workload_count": 1,
            "rating": 4.95,
        },
        "delivery": {
            "id": "delivery_noida_delhi_002",
            "order_id": "delivery_noida_delhi_002",
            "customer_id": "cust_demo",
            "customer_name": "Aakash Sharma",
            "customer_phone": "+91 98765 43210",
            "vendor_id": "vnd_nexgen_ev",
            "vendor_name": "NexGen EV Logistics",
            "pickup_address": "Electronic City Metro, Noida (28.6260, 77.3750)",
            "pickup_lat": 28.6260,
            "pickup_lng": 77.3750,
            "dropoff_address": "South Extension Market, New Delhi (28.5700, 77.2200)",
            "dropoff_lat": 28.5700,
            "dropoff_lng": 77.2200,
            "package_weight_kg": 12.0,
            "package_dimensions": "40x30x20 cm",
            "priority": "normal",
            "status": "in_transit",
            "assigned_rider_id": "rider_002",
            "notes": "Live delivery #2: Electronic City Noida -> South Extension Delhi",
        },
    },
    {
        "rider": {
            "id": "rider_003",
            "name": "Vikram Singh",
            "phone": "+91 98333 44444",
            "email": "vikram.singh@riderzpro.demo",
            "vehicle_type": "electric_bike",
            "certification": "High-Speed Rapid Response Rider",
            "skills": ["EXPRESS_DELIVERY"],
            "current_lat": 28.6400,
            "current_lng": 77.3700,
            "status": "busy",
            "is_online": True,
            "max_payload_kg": 25.0,
            "max_concurrent_orders": 3,
            "current_workload_count": 1,
            "rating": 4.88,
        },
        "delivery": {
            "id": "delivery_noida_delhi_003",
            "order_id": "delivery_noida_delhi_003",
            "customer_id": "cust_demo",
            "customer_name": "Aakash Sharma",
            "customer_phone": "+91 98765 43210",
            "vendor_id": "vnd_nexgen_ev",
            "vendor_name": "NexGen EV Logistics",
            "pickup_address": "Indirapuram Habitat Centre (28.6400, 77.3700)",
            "pickup_lat": 28.6400,
            "pickup_lng": 77.3700,
            "dropoff_address": "Lajpat Nagar Central Market, Delhi (28.5670, 77.2430)",
            "dropoff_lat": 28.5670,
            "dropoff_lng": 77.2430,
            "package_weight_kg": 3.2,
            "package_dimensions": "20x15x8 cm",
            "priority": "express",
            "status": "in_transit",
            "assigned_rider_id": "rider_003",
            "notes": "Live delivery #3: Indirapuram -> Lajpat Nagar Delhi",
        },
    },
]

def main():
    init_db()
    db = SessionLocal()
    planner = RoutePlanningService()

    try:
        for item in SEED_DATA:
            r_info = item["rider"]
            d_info = item["delivery"]

            # 1. Upsert Rider
            rider = db.query(Rider).filter_by(id=r_info["id"]).first()
            if not rider:
                rider = Rider(
                    id=r_info["id"],
                    name=r_info["name"],
                    phone=r_info["phone"],
                    email=r_info["email"],
                    vehicle_type=r_info["vehicle_type"],
                    certification=r_info["certification"],
                    skills=json.dumps(r_info["skills"]),
                    current_lat=r_info["current_lat"],
                    current_lng=r_info["current_lng"],
                    status=r_info["status"],
                    is_online=r_info["is_online"],
                    max_payload_kg=r_info["max_payload_kg"],
                    max_concurrent_orders=r_info["max_concurrent_orders"],
                    current_workload_count=r_info["current_workload_count"],
                    rating=r_info["rating"],
                )
                db.add(rider)
            else:
                rider.name = r_info["name"]
                rider.phone = r_info["phone"]
                rider.vehicle_type = r_info["vehicle_type"]
                rider.current_lat = r_info["current_lat"]
                rider.current_lng = r_info["current_lng"]
                rider.status = r_info["status"]
                rider.is_online = r_info["is_online"]

            db.commit()
            print(f"Rider ready: {rider.id} ({rider.name})")

            # 2. Upsert Delivery
            deliv = db.query(Delivery).filter_by(id=d_info["id"]).first()
            if not deliv:
                deliv = Delivery(
                    id=d_info["id"],
                    order_id=d_info["order_id"],
                    customer_id=d_info["customer_id"],
                    customer_name=d_info["customer_name"],
                    customer_phone=d_info["customer_phone"],
                    vendor_id=d_info["vendor_id"],
                    vendor_name=d_info["vendor_name"],
                    pickup_address=d_info["pickup_address"],
                    pickup_lat=d_info["pickup_lat"],
                    pickup_lng=d_info["pickup_lng"],
                    dropoff_address=d_info["dropoff_address"],
                    dropoff_lat=d_info["dropoff_lat"],
                    dropoff_lng=d_info["dropoff_lng"],
                    package_weight_kg=d_info["package_weight_kg"],
                    package_dimensions=d_info["package_dimensions"],
                    priority=d_info["priority"],
                    status=d_info["status"],
                    assigned_rider_id=d_info["assigned_rider_id"],
                    notes=d_info["notes"],
                )
                db.add(deliv)
            else:
                deliv.order_id = d_info["order_id"]
                deliv.status = d_info["status"]
                deliv.assigned_rider_id = d_info["assigned_rider_id"]
                deliv.pickup_lat = d_info["pickup_lat"]
                deliv.pickup_lng = d_info["pickup_lng"]
                deliv.dropoff_lat = d_info["dropoff_lat"]
                deliv.dropoff_lng = d_info["dropoff_lng"]
                deliv.pickup_address = d_info["pickup_address"]
                deliv.dropoff_address = d_info["dropoff_address"]

            db.commit()
            db.refresh(deliv)
            print(f"Delivery ready: {deliv.id} (order: {deliv.order_id}), assigned to {deliv.assigned_rider_id}")

            # 3. Plan route with OSRM (or fallback)
            db.query(DeliveryRoute).filter_by(delivery_id=deliv.id).delete()
            db.commit()

            route = planner.plan_route_for_delivery(db, deliv, provider_name="osrm")
            raw_wps = json.loads(route.waypoints_json) if route.waypoints_json else []
            geom_count = (
                len(raw_wps.get("geometry", raw_wps.get("waypoints", [])))
                if isinstance(raw_wps, dict)
                else len(raw_wps)
            )
            print(f"  Route planned with {route.provider}: distance={route.distance_km}km, geometry_points={geom_count}")

        print("\nSuccessfully seeded 4 independent deliveries with unique riders and OSRM routes.")

    finally:
        db.close()


if __name__ == "__main__":
    main()
