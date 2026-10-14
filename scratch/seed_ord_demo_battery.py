"""Seed ord_demo_battery into riderzpro_logistics.db."""

from datetime import datetime
import json
from logistics.database import SessionLocal
from logistics.models import Delivery, DeliveryRoute, Rider, RiderLocation

def seed():
    with SessionLocal() as db:
        existing = db.query(Delivery).filter((Delivery.id == "ord_demo_battery") | (Delivery.order_id == "ord_demo_battery")).first()
        if existing:
            print("ord_demo_battery already exists:", existing.id)
            return

        # Ensure rider tech_ramesh exists
        rider = db.query(Rider).filter(Rider.id == "tech_ramesh").first()
        if not rider:
            rider = Rider(
                id="tech_ramesh",
                name="Ramesh Kumar",
                phone="+91 98450 12345",
                email="ramesh.k@riderzpro.demo",
                vehicle_type="van",
                certification="Master High-Voltage EV Certified (Level 4)",
                skills=json.dumps(["EV_BATTERY_INSTALL", "DIAGNOSTICS", "HEAVY_CARGO"]),
                current_lat=12.9550,
                current_lng=77.6500,
                status="busy",
                is_online=True,
                max_payload_kg=50.0,
                max_concurrent_orders=3,
                current_workload_count=1,
                rating=4.9,
                last_location_timestamp=datetime.utcnow(),
                speed_kmh=24.5,
                heading_degrees=85.0
            )
            db.add(rider)
            db.commit()

        # Create delivery ord_demo_battery
        # Route from Indiranagar (12.9719, 77.6412) to Koramangala (12.9352, 77.6245)
        waypoints = [
            {"step": 0, "lat": 12.9719, "lng": 77.6412, "eta_minute_offset": 0.0},
            {"step": 1, "lat": 12.9645, "lng": 77.6380, "eta_minute_offset": 4.5},
            {"step": 2, "lat": 12.9550, "lng": 77.6330, "eta_minute_offset": 9.0},
            {"step": 3, "lat": 12.9450, "lng": 77.6280, "eta_minute_offset": 14.0},
            {"step": 4, "lat": 12.9352, "lng": 77.6245, "eta_minute_offset": 19.5}
        ]

        delivery = Delivery(
            id="ord_demo_battery",
            order_id="ord_demo_battery",
            customer_id="cust_demo",
            customer_name="Aakash Sharma",
            customer_phone="+91 98765 43210",
            vendor_id="vnd_nexgen_ev",
            vendor_name="NexGen EV Workshop",
            pickup_address="Indiranagar Hub, Bengaluru",
            pickup_lat=12.9719,
            pickup_lng=77.6412,
            dropoff_address="Koramangala 4th Block, Bengaluru",
            dropoff_lat=12.9352,
            dropoff_lng=77.6245,
            package_weight_kg=14.0,
            package_dimensions="40x25x20 cm",
            priority="express",
            status="in_transit",
            assigned_rider_id="tech_ramesh",
            notes="EV Lithium-ion Battery Pack Replacement (60V 30Ah)",
            created_at=datetime.utcnow()
        )
        db.add(delivery)
        db.flush()

        route = DeliveryRoute(
            delivery_id=delivery.id,
            rider_id="tech_ramesh",
            provider="haversine_builtin",
            distance_km=5.8,
            duration_minutes=19.5,
            waypoints_json=json.dumps(waypoints)
        )
        db.add(route)

        # Add initial rider location
        loc = RiderLocation(
            rider_id="tech_ramesh",
            delivery_id=delivery.id,
            latitude=12.9550,
            longitude=77.6330,
            speed_kmh=24.5,
            heading_degrees=85.0,
            accuracy_meters=5.0,
            timestamp=datetime.utcnow()
        )
        db.add(loc)

        rider.current_lat = 12.9550
        rider.current_lng = 77.6330
        rider.speed_kmh = 24.5
        rider.heading_degrees = 85.0
        rider.last_location_timestamp = datetime.utcnow()

        db.commit()
        print("Successfully seeded ord_demo_battery in database.")

if __name__ == "__main__":
    seed()
