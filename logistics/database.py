"""Database engine, session management, and initialization for Riderzpro logistics."""

import os
import json
from datetime import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./riderzpro_logistics.db")

# Handle SQLite vs PostgreSQL connect args
connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """FastAPI dependency for yielding database session with automatic cleanup."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Create all tables and seed default riders if database is empty."""
    from logistics import models  # noqa: F401
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        seed_default_riders(db)


def seed_default_riders(db: Session):
    """Seed initial riders/technicians from Riderzpro platform if none exist."""
    from logistics.models import Rider

    existing_count = db.query(Rider).count()
    if existing_count > 0:
        return

    default_riders = [
        Rider(
            id="tech_ramesh",
            name="Ramesh Kumar",
            phone="+91 98450 12345",
            email="ramesh.k@riderzpro.demo",
            vehicle_type="van",
            certification="Master High-Voltage EV Certified (Level 4)",
            skills=json.dumps(["EV_BATTERY_INSTALL", "DIAGNOSTICS", "HEAVY_CARGO"]),
            current_lat=12.9680,
            current_lng=77.6350,
            status="available",
            is_online=True,
            max_payload_kg=50.0,
            max_concurrent_orders=3,
            current_workload_count=0,
            rating=4.9
        ),
        Rider(
            id="tech_priya",
            name="Priya Sharma",
            phone="+91 97410 88765",
            email="priya.s@riderzpro.demo",
            vehicle_type="electric_bike",
            certification="Certified Lithium BMS & Electrical Systems Specialist",
            skills=json.dumps(["EV_BATTERY_INSTALL", "FAST_DISPATCH", "BMS_TUNING"]),
            current_lat=12.9200,
            current_lng=77.6300,
            status="available",
            is_online=True,
            max_payload_kg=25.0,
            max_concurrent_orders=2,
            current_workload_count=0,
            rating=4.8
        ),
        Rider(
            id="tech_anil",
            name="Anil Deshmukh",
            phone="+91 99160 55432",
            email="anil.d@riderzpro.demo",
            vehicle_type="regular_bike",
            certification="Automotive High-Tension Safety Certified",
            skills=json.dumps(["PARCEL_DELIVERY", "BASIC_INSPECTION"]),
            current_lat=12.9550,
            current_lng=77.6500,
            status="offline",
            is_online=False,
            max_payload_kg=15.0,
            max_concurrent_orders=2,
            current_workload_count=0,
            rating=4.7
        )
    ]
    for r in default_riders:
        db.add(r)
    db.commit()
