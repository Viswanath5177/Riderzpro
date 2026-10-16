"""
Riderzpro Domain Catalog Data
Contains comprehensive specifications for EV Bikes, Guaranteed Fitment Batteries,
and OEM / Aftermarket EV Spare Parts.
"""

from typing import Dict, List, Any

# ==============================================================================
# Supported EV Bike Models & Mechanical / Electrical Profiles
# ==============================================================================
EV_BIKE_MODELS: List[Dict[str, Any]] = [
    {
        "id": "bm_ather_450x",
        "brand": "Ather",
        "model": "450X Gen 3",
        "aliases": ["ather 450x", "ather 450", "ather gen 3", "ather 450x gen 3"],
        "year_from": 2021,
        "year_to": 2025,
        "nominal_voltage": 51.1,
        "voltage_range": "44.0V - 58.4V",
        "connector_type": "Ather High-Flow Prop Plug",
        "battery_compartment": "Under-floor integrated pack with aluminum die-cast enclosure",
        "drive_type": "Belt Drive (Gates Poly Chain Carbon)",
        "brake_spec": "Front: 200mm Disc (Ceramic/Organic pads), Rear: 190mm Disc",
        "tire_spec": "Front: 90/90-12, Rear: 100/80-12 (Tubeless EV-spec)",
        "charger_spec": "700W Home Pod / 3.3kW Fast Charger",
        "description": "High-performance urban scooter with intelligent telematics & active thermal monitoring."
    },
    {
        "id": "bm_ola_s1_pro",
        "brand": "Ola Electric",
        "model": "S1 Pro (Gen 2)",
        "aliases": ["ola s1 pro", "ola s1", "ola s1 pro gen 2", "ola s1 air"],
        "year_from": 2022,
        "year_to": 2025,
        "nominal_voltage": 72.0,
        "voltage_range": "60.0V - 84.0V",
        "connector_type": "HyperCharge Dual-Pin",
        "battery_compartment": "Floorboard mounted 4kWh structural banana-pack architecture",
        "drive_type": "Mid-drive motor with reduction gearbox & sealed hub",
        "brake_spec": "Front: 220mm Disc, Rear: 180mm Disc with CBS",
        "tire_spec": "Front: 110/70-R12, Rear: 110/70-R12",
        "charger_spec": "750W Portable 240V AC Home Charger",
        "description": "Extended range 4kWh battery architecture with advanced thermal jacket."
    },
    {
        "id": "bm_tvs_iqube",
        "brand": "TVS",
        "model": "iQube Electric ST",
        "aliases": ["tvs iqube", "iqube", "iqube st", "iqube s"],
        "year_from": 2020,
        "year_to": 2025,
        "nominal_voltage": 52.0,
        "voltage_range": "45.0V - 58.8V",
        "connector_type": "TVS SmartConnect Plug",
        "battery_compartment": "Dual split-pack prismatic cells under floor and seat cavity",
        "drive_type": "BLDC Hub Motor (4.4kW peak)",
        "brake_spec": "Front: 220mm Disc, Rear: 130mm Drum",
        "tire_spec": "Front: 90/90-12, Rear: 90/90-12",
        "charger_spec": "650W / 950W TVS Smart Fast Charger",
        "description": "Reliable dual-pack prismatic cells with regenerative BMS and high safety margins."
    },
    {
        "id": "bm_revolt_rv400",
        "brand": "Revolt",
        "model": "RV400",
        "aliases": ["revolt rv400", "revolt rv 400", "rv400", "revolt motorcycle"],
        "year_from": 2019,
        "year_to": 2025,
        "nominal_voltage": 72.0,
        "voltage_range": "60.0V - 84.0V",
        "connector_type": "Revolt Quick-Swap Chogori",
        "battery_compartment": "Top tank bay quick-swap removable battery unit",
        "drive_type": "Belt Drive (High-tensile rubber composite)",
        "brake_spec": "Front: 240mm Disc, Rear: 240mm Disc with CBS",
        "tire_spec": "Front: 90/80-17, Rear: 120/80-17 Motorcycle Spec",
        "charger_spec": "72V 15A Portable Quick-Charger",
        "description": "Swappable high-draw lithium-ion motorcycle battery with dual ride modes."
    },
    {
        "id": "bm_hero_vida",
        "brand": "Hero",
        "model": "Vida V1 Pro",
        "aliases": ["hero vida", "vida v1", "vida v1 pro", "hero vida v1"],
        "year_from": 2022,
        "year_to": 2025,
        "nominal_voltage": 50.4,
        "voltage_range": "43.2V - 57.6V",
        "connector_type": "Hero Removable Modular",
        "battery_compartment": "Dual removable modular packs under seat with quick-latch",
        "drive_type": "PMSM with belt transmission",
        "brake_spec": "Front: Disc, Rear: Drum",
        "tire_spec": "Front: 90/90-12, Rear: 100/80-12",
        "charger_spec": "Hero Portable Fast-Charger 1.2kW",
        "description": "Dual removable modules for flexible indoor charging and smart battery rotation."
    },
    {
        "id": "bm_chetak",
        "brand": "Bajaj",
        "model": "Chetak Premium",
        "aliases": ["bajaj chetak", "chetak", "chetak premium", "chetak urbane"],
        "year_from": 2020,
        "year_to": 2025,
        "nominal_voltage": 48.0,
        "voltage_range": "41.0V - 54.6V",
        "connector_type": "Bajaj Sealed Heavy-Duty",
        "battery_compartment": "All-metal pressed steel unibody floor enclosure (IP67)",
        "drive_type": "Solid Gear Drive (Automotive grade helical)",
        "brake_spec": "Front: Disc, Rear: Drum",
        "tire_spec": "Front: 90/90-12, Rear: 90/90-12 MRF Zapper-N",
        "charger_spec": "650W Off-board Intelligent Charger",
        "description": "All-metal casing IP67 lithium battery with smart deep sleep mode."
    }
]

# ==============================================================================
# Guaranteed Compatible Batteries (Certified by Riderzpro)
# ==============================================================================
BATTERY_CATALOG: List[Dict[str, Any]] = [
    # Ather 450X
    {
        "id": "bat_nexcharge_51",
        "name": "NexCharge Pro 51.1V 3.7kWh",
        "brand": "NexCharge",
        "chemistry": "NMC (Nickel Manganese Cobalt)",
        "voltage": 51.1,
        "capacity_ah": 72,
        "kwh": 3.7,
        "range_km": 140,
        "charge_time_hours": 3.0,
        "weight_kg": 19.5,
        "connector_type": "Ather High-Flow Prop Plug",
        "bms_features": "Active Cell Balancing, Thermal Runaway Isolation, Cloud Telematics",
        "ip_rating": "IP67 Submersible",
        "warranty_months": 48,
        "price": 44500,
        "badge": "OEM Approved",
        "compatible_bike_ids": ["bm_ather_450x"]
    },
    {
        "id": "bat_voltpro_ather_lfp",
        "name": "VoltPro Ultra-Life LFP 51.1V 4.0kWh",
        "brand": "VoltPro",
        "chemistry": "LFP (Lithium Iron Phosphate)",
        "voltage": 51.1,
        "capacity_ah": 78,
        "kwh": 4.0,
        "range_km": 155,
        "charge_time_hours": 3.2,
        "weight_kg": 20.2,
        "connector_type": "Ather High-Flow Prop Plug",
        "bms_features": "3000+ Deep Cycles, Smart Bluetooth App Monitoring, Anti-Spark Harness",
        "ip_rating": "IP67 Waterproof",
        "warranty_months": 60,
        "price": 47999,
        "badge": "Extended Warranty",
        "compatible_bike_ids": ["bm_ather_450x"]
    },
    {
        "id": "bat_hypercell_sport_51",
        "name": "HyperCell WarpSport 51.1V 3.9kWh",
        "brand": "HyperCell",
        "chemistry": "NMC Fast-Discharge 3.5C",
        "voltage": 51.1,
        "capacity_ah": 76,
        "kwh": 3.88,
        "range_km": 145,
        "charge_time_hours": 2.6,
        "weight_kg": 18.8,
        "connector_type": "Ather High-Flow Prop Plug",
        "bms_features": "Peak 6kW Burst Delivery, Instant Heat Dissipation Jacket, Overload Shield",
        "ip_rating": "IP68 Submersible",
        "warranty_months": 48,
        "price": 49500,
        "badge": "Warp Mode Boost",
        "compatible_bike_ids": ["bm_ather_450x"]
    },

    # Ola S1 Pro
    {
        "id": "bat_voltpro_72",
        "name": "VoltPro Max LFP 72V 45Ah (3.24kWh)",
        "brand": "VoltPro",
        "chemistry": "LFP (Lithium Iron Phosphate)",
        "voltage": 72.0,
        "capacity_ah": 45,
        "kwh": 3.24,
        "range_km": 155,
        "charge_time_hours": 3.5,
        "weight_kg": 18.2,
        "connector_type": "HyperCharge Dual-Pin",
        "bms_features": "Smart Bluetooth CAN BMS, Over-temperature Auto-Cut, 2500+ Cycles",
        "ip_rating": "IP67 Waterproof",
        "warranty_months": 60,
        "price": 48999,
        "badge": "Best Seller",
        "compatible_bike_ids": ["bm_ola_s1_pro"]
    },
    {
        "id": "bat_ola_hypermax_72",
        "name": "HyperMax Ultra-Range 72V 55Ah (4.0kWh)",
        "brand": "HyperMax",
        "chemistry": "NMC High-Energy Density",
        "voltage": 72.0,
        "capacity_ah": 55,
        "kwh": 3.96,
        "range_km": 185,
        "charge_time_hours": 3.8,
        "weight_kg": 19.8,
        "connector_type": "HyperCharge Dual-Pin",
        "bms_features": "Dual Microcontroller BMS, Smart Regenerative Sync, Low Temp Pre-Heat",
        "ip_rating": "IP67 Sealed",
        "warranty_months": 60,
        "price": 54900,
        "badge": "185km Ultra Range",
        "compatible_bike_ids": ["bm_ola_s1_pro"]
    },

    # Revolt RV400
    {
        "id": "bat_voltpro_rv_boost",
        "name": "VoltPro RV-Boost 72V 50Ah Performance",
        "brand": "VoltPro",
        "chemistry": "NMC Fast-Discharge 3C",
        "voltage": 72.0,
        "capacity_ah": 50,
        "kwh": 3.6,
        "range_km": 170,
        "charge_time_hours": 2.8,
        "weight_kg": 19.0,
        "connector_type": "Revolt Quick-Swap Chogori",
        "bms_features": "High-Amp Sport Mode Delivery, Regenerative Braking Optimizer, App Link",
        "ip_rating": "IP68 Submersible",
        "warranty_months": 60,
        "price": 56900,
        "badge": "Performance Edition",
        "compatible_bike_ids": ["bm_revolt_rv400"]
    },
    {
        "id": "bat_revolt_swap_lfp",
        "name": "Revolt Swappable Matrix 72V 45Ah LFP",
        "brand": "Revolt",
        "chemistry": "LFP Heavy Metal Reinforced",
        "voltage": 72.0,
        "capacity_ah": 45,
        "kwh": 3.24,
        "range_km": 150,
        "charge_time_hours": 3.2,
        "weight_kg": 18.5,
        "connector_type": "Revolt Quick-Swap Chogori",
        "bms_features": "Quick-Lock Ergonomic Handle, IP67 Terminal, Flame Retardant Pack",
        "ip_rating": "IP67 Submersible",
        "warranty_months": 48,
        "price": 46500,
        "badge": "Swappable OEM",
        "compatible_bike_ids": ["bm_revolt_rv400"]
    },

    # TVS iQube
    {
        "id": "bat_ecofit_52",
        "name": "EcoFit Dual-Core 52V 40Ah",
        "brand": "EcoFit",
        "chemistry": "LFP Prismatic SafeCell",
        "voltage": 52.0,
        "capacity_ah": 40,
        "kwh": 3.04,
        "range_km": 140,
        "charge_time_hours": 3.4,
        "weight_kg": 17.5,
        "connector_type": "TVS SmartConnect Plug",
        "bms_features": "Balanced Dual-Module Discharge, Vibration Isolation Base",
        "ip_rating": "IP67 Waterproof",
        "warranty_months": 48,
        "price": 43500,
        "badge": "OEM Form Factor",
        "compatible_bike_ids": ["bm_tvs_iqube"]
    },

    # Hero Vida V1
    {
        "id": "bat_herovida_modular_50",
        "name": "VidaPower Dual-Module Set 50.4V 3.94kWh",
        "brand": "VidaPower",
        "chemistry": "NMC High C-Rate",
        "voltage": 50.4,
        "capacity_ah": 78,
        "kwh": 3.94,
        "range_km": 165,
        "charge_time_hours": 3.0,
        "weight_kg": 19.2,
        "connector_type": "Hero Removable Modular",
        "bms_features": "Dual Pack Auto-Leveling, Portable Carry Strap, Anti-Theft Lock",
        "ip_rating": "IP67 Submersible",
        "warranty_months": 60,
        "price": 51900,
        "badge": "Removable Dual Set",
        "compatible_bike_ids": ["bm_hero_vida"]
    },

    # Bajaj Chetak
    {
        "id": "bat_chetak_steellock_48",
        "name": "SteelLock Armor 48V 60Ah (3.2kWh)",
        "brand": "SteelLock",
        "chemistry": "LFP Steel Cased Prismatic",
        "voltage": 48.0,
        "capacity_ah": 60,
        "kwh": 3.2,
        "range_km": 135,
        "charge_time_hours": 3.2,
        "weight_kg": 18.0,
        "connector_type": "Bajaj Sealed Heavy-Duty",
        "bms_features": "Monocoque Vibration Resistance, CAN-Bus Telematics, Deep-Sleep Wakeup",
        "ip_rating": "IP67 Waterproof",
        "warranty_months": 60,
        "price": 42000,
        "badge": "Heavy Duty Steel",
        "compatible_bike_ids": ["bm_chetak"]
    }
]

# ==============================================================================
# EV Spare Parts Catalog (Guaranteed & Tested)
# ==============================================================================
EV_PARTS_CATALOG: List[Dict[str, Any]] = [
    # Chargers
    {
        "id": "part_chg_ather_fast",
        "category": "chargers",
        "name": "Ather Dot Smart Home Charger 700W / 1.2kW",
        "compatible_bike_ids": ["bm_ather_450x"],
        "specs": "Auto-cut off, Wi-Fi connected, surge protection, IP65 outdoor rated",
        "price": 8999,
        "warranty_months": 24,
        "availability": "In Stock"
    },
    {
        "id": "part_chg_ola_portable",
        "category": "chargers",
        "name": "Ola 750W Portable Travel Charger (Gen 2)",
        "compatible_bike_ids": ["bm_ola_s1_pro"],
        "specs": "16A 3-pin plug, thermal sensor in plug head, 5m heavy duty cable",
        "price": 7499,
        "warranty_months": 12,
        "availability": "In Stock"
    },
    {
        "id": "part_chg_revolt_fast",
        "category": "chargers",
        "name": "Revolt 72V 15A Quick-Charger",
        "compatible_bike_ids": ["bm_revolt_rv400"],
        "specs": "0-80% in 90 minutes, dual-fan cooling, Chogori heavy connector",
        "price": 9200,
        "warranty_months": 24,
        "availability": "In Stock"
    },

    # Drive Belts & Transmission
    {
        "id": "part_belt_ather_carbon",
        "category": "transmission",
        "name": "Gates Poly Chain Carbon Drive Belt (Ather 450X)",
        "compatible_bike_ids": ["bm_ather_450x"],
        "specs": "Carbon tensile cord, grease-free, rated for 30,000 km lifespan",
        "price": 2850,
        "warranty_months": 12,
        "availability": "In Stock"
    },
    {
        "id": "part_belt_revolt_kevlar",
        "category": "transmission",
        "name": "Revolt RV400 Kevlar-Reinforced Drive Belt",
        "compatible_bike_ids": ["bm_revolt_rv400"],
        "specs": "High torque transmission, silent operation, mud & water resistant",
        "price": 2400,
        "warranty_months": 12,
        "availability": "In Stock"
    },

    # Brake Pads (Ceramic / Sintered for Regenerative Braking)
    {
        "id": "part_brake_ather_ceramic",
        "category": "brakes",
        "name": "CeramiGlide Front & Rear Disc Brake Pad Set (Ather 450X)",
        "compatible_bike_ids": ["bm_ather_450x"],
        "specs": "Low-dust ceramic formula, high heat dissipation, eliminates EV brake squeal",
        "price": 899,
        "warranty_months": 6,
        "availability": "In Stock"
    },
    {
        "id": "part_brake_ola_s1_sintered",
        "category": "brakes",
        "name": "SinterMax EV Disc Pads (Ola S1 Pro Front 220mm)",
        "compatible_bike_ids": ["bm_ola_s1_pro"],
        "specs": "Sintered metallic blend, aggressive initial bite, optimized for CBS sync",
        "price": 799,
        "warranty_months": 6,
        "availability": "In Stock"
    },
    {
        "id": "part_brake_revolt_front_rear",
        "category": "brakes",
        "name": "EnduroBrake 240mm Disc Pad Pair (Revolt RV400)",
        "compatible_bike_ids": ["bm_revolt_rv400"],
        "specs": "Dual disc compound, wet weather grooved channels",
        "price": 950,
        "warranty_months": 6,
        "availability": "In Stock"
    },

    # EV Tires (Low Rolling Resistance)
    {
        "id": "part_tire_ev_12in_mrf",
        "category": "tires",
        "name": "MRF Zapper EV 90/90-12 Low-Rolling Resistance Tire",
        "compatible_bike_ids": ["bm_ather_450x", "bm_tvs_iqube", "bm_chetak", "bm_hero_vida"],
        "specs": "Silica-infused compound adds +6% range, heavy EV load rating (54J)",
        "price": 1450,
        "warranty_months": 36,
        "availability": "In Stock"
    },
    {
        "id": "part_tire_ola_12in_ceat",
        "category": "tires",
        "name": "CEAT EnergyDrive EV 110/70-R12 (Ola S1 Pro Spec)",
        "compatible_bike_ids": ["bm_ola_s1_pro"],
        "specs": "Cavity-damped acoustic layer reduces motor/road noise, anti-aquaplaning tread",
        "price": 1750,
        "warranty_months": 36,
        "availability": "In Stock"
    },

    # Electronics & Accessories
    {
        "id": "part_dcdc_converter_72_12",
        "category": "electronics",
        "name": "SmartSync Isolated DC-DC Converter (72V/60V to 12V 15A)",
        "compatible_bike_ids": ["bm_ola_s1_pro", "bm_revolt_rv400"],
        "specs": "Powers headlights, horns, and telematics box with short-circuit protection",
        "price": 1250,
        "warranty_months": 12,
        "availability": "In Stock"
    },
    {
        "id": "part_bms_telematics_dongle",
        "category": "electronics",
        "name": "Riderzpro Bluetooth Cloud Telematics OBD/CAN Dongle",
        "compatible_bike_ids": ["bm_ather_450x", "bm_ola_s1_pro", "bm_tvs_iqube", "bm_revolt_rv400", "bm_hero_vida", "bm_chetak"],
        "specs": "Live cell voltage monitoring, SOH (State of Health) logger, Riderzpro app sync",
        "price": 1999,
        "warranty_months": 24,
        "availability": "In Stock"
    }
]

# ==============================================================================
# Enterprise General Support & Customer Service Knowledge Base
# ==============================================================================
RIDERZPRO_SUPPORT_KNOWLEDGE = {
    "booking": {
        "title": "Booking & Installation Process",
        "doorstep": "Doorstep Home Visit (+₹499): A certified technician visits your home with a mobile diagnostic kit, testing equipment, and battery disposal pack.",
        "service_center": "Certified Service Center (+₹299): Book an atomic slot at our certified service bay with dedicated battery testing stations.",
        "slots": "Dynamic 7-day slot grid with 90-minute appointment windows and guaranteed 'Ready by HH:MM' completion times.",
        "old_battery_exchange": "1-tap exchange toggle gives an instant ₹2,500 rebate credit deducted upfront from your battery order total."
    },
    "warranty": {
        "title": "Digital Warranty Certificates",
        "coverage": "All Riderzpro certified batteries come with 36 to 60 months zero-depreciation direct replacement warranty.",
        "activation": "Digital warranty certificate is issued immediately to your Riderzpro account upon technician diagnostic sign-off.",
        "claim": "1-click warranty claim in 'My Garage'. Doorstep technician dispatch within 24 hours for on-site load and cell voltage verification."
    },
    "technicians": {
        "title": "Certified Technicians & Quality Assurance",
        "certification": "Every technician is trained on high-voltage DC safety (NFPA 70E / AIS-156 standard) and certified for EV battery swaps.",
        "protocol": "6-Step Diagnostic Checklist: (1) Open-Circuit Voltage, (2) Dynamic Load Drop Test, (3) High-Torque Terminal tightening, (4) IP67 Seal verification, (5) BMS CAN handshake, (6) Post-install test ride.",
        "tracking": "Live animated GPS tracking beacon shows technician movement and accurate ETA once assigned."
    },
    "ev_care": {
        "title": "EV Battery Maintenance & Range Optimization",
        "cell_balancing": "Charge to 100% and keep plugged in for an extra 2-3 hours once a month to let the BMS bleed resistors balance parallel cell voltages.",
        "temperature": "Avoid fast charging immediately after prolonged high-speed riding. Let the pack cool down for 15-20 minutes.",
        "storage": "If storing the EV for >2 weeks, leave the state of charge (SOC) between 50% and 70% in a cool, shaded area.",
        "tire_pressure": "Maintain 30-34 PSI on tubeless tires. A 5 PSI drop increases EV rolling resistance and reduces range by 10-15%."
    }
}

