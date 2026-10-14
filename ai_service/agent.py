"""
Riderzpro Autonomous Enterprise AI Agent
High-speed domain intelligence engine that enforces strict domain boundaries
(blocking out-of-topic questions in <5ms), retrieves guaranteed catalog fitment,
enforces high-voltage electrical safety guardrails, provides instant verified
answers on battery lifespan, winter range, rebates, and technician bookings,
and searches the 160-item Riderzpro product catalogue with zero external API costs.
"""

import re
import time
import logging
from typing import Dict, List, Any, Optional
from ai_service.tools.catalog_tool import catalog_tool
from ai_service.tools.web_search_tool import web_search_tool
from ai_service.catalog_data import RIDERZPRO_SUPPORT_KNOWLEDGE
from ai_service.database import catalog_db
from ai_service.config import settings
from ai_service.tools.order_tool import order_tool, OrderTool

logger = logging.getLogger("riderzpro_ai.agent")

# Known automotive brands, models, and two-wheeler EV models
KNOWN_EV_BRANDS_MODELS = {
    # Two-Wheeler EV Models & Brands
    "ather", "ola", "chetak", "iqube", "tvs", "revolt", "rv400", "rv300", "rv1",
    "vida", "hero vida", "simple one", "simple energy", "river indie", "river",
    "ultraviolette", "f77", "okinawa", "praise", "ridge", "bounce", "infinity",
    "ampere", "magnus", "nexus", "pure ev", "etryst", "epluto", "komaki",
    "joy e-bike", "beast", "wolf", "kinetic", "e-luna", "tork", "kratos",
    "benling", "bgauss", "battre", "amo", "lectrix", "zelio", "odysse",
    "hop oxo", "evolet", "matter aera", "obeno", "greaves",
    # 4-Wheelers, SUVs & Off-Roaders (Official Handover Catalog)
    "thar", "thar roxx", "creta", "seltos", "scorpio n", "scorpio", "fortuner",
    "xuv700", "xuv 700", "harrier", "swift", "city", "brezza", "nexon",
    "3 series", "glc", "jimny", "gurkha", "d max v cross", "d max", "v cross",
    "compass", "wrangler", "venue", "defender", "kushaq", "taigun", "polo",
    "mahindra thar", "hyundai creta", "kia seltos", "toyota fortuner", "maruti swift",
    "tata nexon", "tata harrier", "honda city",
    # Official Handover & Automotive Brands
    "riderzpro", "riderz pro", "blaupunkt", "recoil", "autoform"
}

# Core EV & Automotive terminology
EV_DOMAIN_KEYWORDS = {
    "electric bike", "electric scooter", "electric vehicle", "e-bike", "e-scooter",
    "ev bike", "ev scooter", "two wheeler", "2-wheeler", "2 wheeler", "scooter",
    "scooty", "motorcycle", "battery", "batteries", "cell", "cells", "bms",
    "voltage", "volt", "48v", "50v", "51v", "52v", "60v", "72v", "84v", "96v",
    "lfp", "lifepo4", "nmc", "lithium", "li-ion", "kwh", "amp", "ah",
    "charger", "charging", "fast charge", "slow charge", "type-2", "type 2",
    "chogori", "prop plug", "plug", "socket", "connector",
    "bldc", "hub motor", "mid-drive", "controller", "mosfet", "throttle",
    "drive belt", "carbon belt", "brake pad", "brake", "brakes", "disc rotor",
    "regen", "regenerative", "tire", "tyre", "low rolling resistance",
    "swappable", "swap", "fixed battery", "removable battery",
    "range", "claimed range", "drop", "mileage", "soh", "soc",
    "winter range", "cold weather", "cell balancing", "degradation",
    "thermal runaway", "swelling", "overheat", "waterproof", "ip67", "ip65",
    "ais-156", "ais 156", "subsidy", "subsidies", "fame", "pm e-drive",
    "riderzpro", "riderz pro", "volt", "rebate", "exchange", "old battery", "warranty", "technician",
    "doorstep", "service center", "installation", "checklist", "garage", "vin", "ev", "charge"
}

# Riderzpro Official Product Catalogue Domain Keywords (352+ Handover Products & V2 Catalog)
CATALOG_DOMAIN_KEYWORDS = {
    # Covers, Seating & Interior
    "seat cover", "seat covers", "cushion", "back support", "neck rest", "cervical pillow",
    "arm rest", "armrest", "seat belt", "racing seat", "bucket seat", "upholstery",
    "body cover", "body covers", "bike cover", "scooter cover", "car cover",
    # Floor Mats & Organization
    "floor mat", "floor mats", "7d mat", "7d mats", "9d mat", "9d mats", "tpe mat", "tpe mats",
    "all-weather mat", "steering cover", "steering wheel", "boot organizer",
    "trunk organizer", "back seat organizer", "bottle holder", "cup holder", "umbrella holder",
    "sunshade", "sunshades", "curtain", "door visor", "rain guard",
    # Audio, Lighting & Multimedia
    "ambient light", "ambient lighting", "head unit", "touchscreen", "infotainment",
    "car audio", "amplifier", "subwoofer", "monoblock", "4-channel", "6-channel", "8-channel",
    "class-d", "class d", "dsp", "sound processor", "coaxial", "speaker", "speakers",
    "dash cam", "dashcam", "projector fog lamp", "fog lamp", "bi-led", "led bar", "auxiliary light",
    # Exterior, Armour & Off-Road
    "wiper", "wiper blade", "mud flap", "mudflap", "mudguard", "door guard", "scratch guard",
    "wheel rim protector", "spoiler", "bumper protector", "horn", "horns", "electric horn",
    "blind spot mirror", "side mirror", "wing mirror", "rear view mirror",
    "side steps", "rock sliders", "winch", "roof rack", "roof rails", "body kit",
    # Luggage & Carriers
    "luggage carrier", "roof carrier", "roof rack", "top box", "saddle stay", "saddle stays",
    "cycle carrier", "bicycle carrier", "surfboard carrier", "hitch cargo", "e-cargo",
    "cargo bike", "pet carrier", "rear rack", "front basket",
    # Tyre care & Mechanical
    "tyre inflator", "tire inflator", "portable inflator", "cordless inflator", "puncture kit",
    "puncture repair", "snow chain", "anti-skid", "alloy wheel", "wheel rim", "wheel hub",
    "inner tube", "drive chain", "chain sprocket", "o-ring chain", "bicycle chain",
    # Security, Installation & Support
    "car alarm", "alarm system", "anti-theft", "steering lock", "gear lock", "disc lock",
    "u lock", "gps tracker", "anti theft", "installation", "garage fitting", "doorstep fitting",
    "shipping", "delivery", "order", "return policy", "warranty claim", "fitment guarantee"
}

# Enterprise General Customer Support, Policies & Operations Domain Keywords
SUPPORT_DOMAIN_KEYWORDS = {
    # Payments & Invoicing
    "payment", "payments", "pay", "payment method", "payment methods", "payment option",
    "payment options", "upi", "gpay", "google pay", "phonepe", "paytm", "bhim",
    "credit card", "debit card", "net banking", "emi", "no cost emi", "cod",
    "cash on delivery", "pay on delivery", "gst", "gst invoice", "tax invoice",
    "invoicing", "invoice", "bill", "billing", "receipt",
    # Order Tracking & Status
    "track", "tracking", "track order", "track my order", "order status", "where is my order",
    "delivery status", "dispatch status", "awb", "courier", "courier status", "shipping status",
    # Returns, Refunds & Cancellations
    "return", "returns", "return policy", "refund", "refunds", "refund policy", "replacement",
    "replace", "exchange", "cancel", "cancellation", "cancel order", "cancel my order",
    "modify order", "change address", "change delivery address", "wrong item", "damaged item",
    # Warranty & Guarantees
    "warranty", "warranties", "guarantee", "guaranteed", "claim warranty", "warranty claim",
    "warranty period", "warranty coverage", "digital warranty", "fitment guarantee",
    # Customer Service, Helplines & Emergency
    "support", "customer support", "customer care", "customer service", "help", "contact",
    "contact support", "helpline", "phone number", "call", "toll free", "call support",
    "email", "support email", "emergency", "roadside assistance", "rsa", "towing", "sos",
    "human", "agent", "human agent", "live agent", "representative", "executive", "person",
    "real person", "escalate", "escalation", "complaint", "assistance", "helpdesk", "hotline",
    "callback", "talk to human", "speak to agent", "connect to agent",
    # Installation & Technicians
    "installation", "install", "fitting", "technician", "book technician", "doorstep",
    "doorstep service", "doorstep visit", "home visit", "service center", "workshop", "garage fitting",
    # Battery Exchange & Rebate
    "rebate", "exchange", "old battery", "battery exchange", "scrap", "2500 rebate",
    # Locations & Stores
    "store", "stores", "store location", "hub", "hubs", "branch", "where are you located",
    "offline store", "bangalore", "bengaluru",
    # Vehicle Registration & Garage
    "my garage", "vin", "vin decoder", "chassis number", "vehicle registration"
}

# Explicit non-domain indicators (coding, recipes, politics, medicine, entertainment, trivia)
NON_EV_INDICATORS = [
    "python", "javascript", "java", "c++", "html", "css", "sql", "react", "programming",
    "code", "function", "algorithm", "compile", "git", "linux", "script",
    "recipe", "pasta", "cake", "cooking", "bake", "ingredients", "soup", "pizza",
    "president", "prime minister", "capital of", "history of", "who wrote", "poem", "essay",
    "movie", "actor", "actress", "song", "lyrics", "cricket score", "football",
    "medicine", "headache", "symptom", "disease", "stock market", "crypto", "bitcoin"
]

# High-frequency typo corrections & vehicle aliases for instant normalization
COMMON_TYPO_MAP = {
    # EV Models
    r"\bathr\b": "ather",
    r"\baether\b": "ather",
    r"\bathre\b": "ather",
    r"\b450\s*x\b": "450x",
    r"\b450\s*apex\b": "450 apex",
    r"\bola\s*s\s*1\b": "ola s1",
    r"\bola\s*s1pro\b": "ola s1 pro",
    r"\bola\s*pro\b": "ola s1 pro",
    r"\bchetk\b": "chetak",
    r"\bcheteck\b": "chetak",
    r"\bbajaj\s*chetk\b": "bajaj chetak",
    r"\biqbue\b": "iqube",
    r"\bi-qube\b": "iqube",
    r"\btvs\s*iqbue\b": "tvs iqube",
    r"\brevlt\b": "revolt",
    r"\brv\s*400\b": "rv400",
    r"\brv\s*300\b": "rv300",
    r"\bvda\b": "vida",
    r"\bhero\s*vda\b": "hero vida",
    # 4-Wheelers
    r"\btharr\b": "thar",
    r"\bcretta\b": "creta",
    r"\bseltoss\b": "seltos",
    r"\bfortuner\b": "fortuner",
    r"\bfortunar\b": "fortuner",
    r"\bscorpio-n\b": "scorpio n",
    # Parts & Keywords
    r"\bchargr\b": "charger",
    r"\bchargre\b": "charger",
    r"\bcharget\b": "charger",
    r"\bchagrer\b": "charger",
    r"\bchargng\b": "charging",
    r"\bbattry\b": "battery",
    r"\bbatry\b": "battery",
    r"\bbatter\b": "battery",
    r"\bbatery\b": "battery",
    r"\bbrak\b": "brake",
    r"\bbraks\b": "brakes",
    r"\bbreak\s*pads?\b": "brake pads",
    r"\btyr\b": "tyre",
    r"\btyres\b": "tyres",
    r"\btir\b": "tire",
    r"\bmatt\b": "mat",
    r"\bmatts\b": "mats",
    # Support & Order keywords
    r"\bcancle\b": "cancel",
    r"\bcancelation\b": "cancellation",
    r"\bcanceld\b": "cancelled",
    r"\btraack\b": "track",
    r"\btrak\b": "track",
    r"\btrck\b": "track",
    r"\btrackingg\b": "tracking",
    r"\bwaranty\b": "warranty",
    r"\bgarantee\b": "guarantee",
    r"\bgaranty\b": "guarantee",
    r"\binvois\b": "invoice",
    r"\binvoic\b": "invoice",
    r"\bdelivry\b": "delivery",
    r"\bdeliverey\b": "delivery",
    r"\bshippng\b": "shipping",
    r"\breffund\b": "refund",
    r"\brefnd\b": "refund",
}


RICH_COMPARISON_PROFILES = {
    "ather": {
        "name": "Ather 450X (Gen 3)",
        "voltage": "51.1V (44.0V - 58.4V)",
        "battery": "3.7 kWh NMC (Nickel Manganese Cobalt)",
        "claimed_range": "146 – 150 km (IDC)",
        "real_range": "105 km (TrueRange City)",
        "speed_accel": "90 km/h | 0-40 in 3.3 sec (Warp Mode)",
        "powertrain": "6.2 kW PMSM Mid-Drive (Gates Carbon Belt)",
        "charging": "Ather Grid Fast Charging (1.5 km/min) | 700W Home Pod",
        "brakes": "Front 200mm / Rear 190mm Disc (CBS)",
        "key_strength": "Sharp sport-tuned chassis, intuitive Google Maps UI, smooth throttle calibration",
        "ideal_rider": "Enthusiastic urban commuters prioritizing premium handling, build precision, and fast charging infrastructure."
    },
    "ola": {
        "name": "Ola S1 Pro (Gen 2)",
        "voltage": "72.0V (60.0V - 84.0V)",
        "battery": "4.0 kWh NMC High-Density Structural Pack",
        "claimed_range": "195 km (ARAI)",
        "real_range": "135 – 140 km (Normal/Eco)",
        "speed_accel": "120 km/h | 0-40 in 2.6 sec (Hyper Mode)",
        "powertrain": "11 kW Mid-Drive with Single Reduction Gearbox",
        "charging": "Ola Hypercharger (50 km in 15 min) | 750W Portable Home",
        "brakes": "Front 220mm / Rear 180mm Disc (CBS)",
        "key_strength": "Massive acceleration, class-leading top speed, 34L boot space, extensive tech suite",
        "ideal_rider": "Highway and long-distance commuters who want maximum acceleration, high top speed, and expansive luggage space."
    },
    "tvs": {
        "name": "TVS iQube Electric ST",
        "voltage": "52.0V (45.0V - 58.8V)",
        "battery": "3.4 – 5.1 kWh Dual Prismatic NMC Architecture",
        "claimed_range": "140 – 145 km (Economy)",
        "real_range": "100 – 115 km (Real City Traffic)",
        "speed_accel": "82 km/h | 0-40 in 4.2 sec",
        "powertrain": "4.4 kW BLDC Hub Motor with Silent Coasting",
        "charging": "650W / 950W Smart Fast Charger (4.5 hrs)",
        "brakes": "Front 220mm Disc / Rear 130mm Drum",
        "key_strength": "Rock-solid automotive build quality, plush dual shock suspension, silent hub motor",
        "ideal_rider": "Families and practical riders who prioritize proven OEM manufacturing reliability, pillion comfort, and soft suspension."
    },
    "chetak": {
        "name": "Bajaj Chetak Premium",
        "voltage": "48.0V (41.0V - 54.6V)",
        "battery": "3.2 kWh Automotive Grade Steel-Enclosed Pack",
        "claimed_range": "126 km (ARAI)",
        "real_range": "95 – 100 km (Eco Mode)",
        "speed_accel": "73 km/h | 0-40 in 3.9 sec",
        "powertrain": "4.2 kW PMSM Motor with Helical Solid Gear Drive",
        "charging": "650W Intelligent Off-Board Charger (4.0 hrs)",
        "brakes": "Front Disc / Rear Drum (CBS)",
        "key_strength": "Full pressed-sheet-metal unibody, retro Italian styling, zero-maintenance gear drive (no belt/chain)",
        "ideal_rider": "Classic scooter lovers seeking timeless all-metal body construction, durability, and stress-free urban commuting."
    },
    "revolt": {
        "name": "Revolt RV400",
        "voltage": "72.0V (60.0V - 84.0V)",
        "battery": "3.24 kWh Swappable Lithium-Ion Pack (Chogori)",
        "claimed_range": "150 km (Eco Mode)",
        "real_range": "100 – 110 km (Normal City Mode)",
        "speed_accel": "85 km/h | 0-40 in 3.9 sec",
        "powertrain": "3.0 kW Mid-Drive Motor with High-Tensile Composite Belt",
        "charging": "72V 15A Portable Quick-Charger (4.5 hrs) | Swappable Hubs",
        "brakes": "Front 240mm / Rear 240mm Disc (CBS)",
        "key_strength": "Full electric motorcycle ergonomics, swappable portable battery (charge inside apartments)",
        "ideal_rider": "Motorcycle commuters who cannot park near a ground-floor plug and need to carry their battery upstairs to charge."
    },
    "vida": {
        "name": "Hero Vida V1 Pro",
        "voltage": "50.4V (43.2V - 57.6V)",
        "battery": "3.94 kWh Dual Modular Removable Packs",
        "claimed_range": "165 km (IDC)",
        "real_range": "110 km (Eco Mode)",
        "speed_accel": "80 km/h | 0-40 in 3.2 sec",
        "powertrain": "6.0 kW Peak PMSM Motor (Belt Transmission)",
        "charging": "Dual Removable Modules (Indoor Charging) | Fast Charging (1.2 km/min)",
        "brakes": "Front Disc / Rear Drum",
        "key_strength": "Dual modular removable batteries, extensive Hero service footprint, custom ride modes",
        "ideal_rider": "Riders seeking the peace of mind of India's largest two-wheeler network with dual removable battery flexibility."
    }
}


class AutonomousRiderzproAgent:
    def __init__(self):
        self.catalog = catalog_tool
        self.web_search = web_search_tool
        self.support_kb = RIDERZPRO_SUPPORT_KNOWLEDGE

    def _normalize_query(self, query: str) -> str:
        """Applies high-frequency regex typo normalization and alias expansion."""
        q = query.strip()
        for pattern, replacement in COMMON_TYPO_MAP.items():
            q = re.sub(pattern, replacement, q, flags=re.IGNORECASE)
        return q

    def _extract_dialogue_state(self, history: Optional[List[Dict[str, str]]]) -> Dict[str, Any]:
        """
        Enterprise Dialogue State Tracker (DST):
        Traverses multi-turn conversation history backwards to extract the most recent
        active vehicle, active order ID, active category, and active SKU code.
        """
        state = {
            "vehicle": None,
            "order_id": None,
            "category": None,
            "matched_bike": None,
            "last_product_code": None
        }
        if not history:
            return state

        for msg in reversed(history):
            content = msg.get("content", "")
            if not content:
                continue

            # 1. Order ID (e.g., RZP-8492)
            if not state["order_id"]:
                oid = OrderTool.extract_order_id(content)
                if oid:
                    state["order_id"] = oid

            # 2. EV Bike
            if not state["matched_bike"]:
                norm_c = self._normalize_query(content)
                bike = self.catalog.find_bike_by_query(norm_c)
                if bike:
                    state["matched_bike"] = bike
                    state["vehicle"] = f"{bike['brand']} {bike['model']}"

            # 3. 4-Wheeler Vehicle
            if not state["vehicle"]:
                v_4w = self._detect_vehicle_in_query(content)
                if v_4w:
                    state["vehicle"] = v_4w

            # 4. Product Category
            if not state["category"]:
                c_low = content.lower()
                if "charger" in c_low or "charging" in c_low:
                    state["category"] = "charger"
                elif "battery" in c_low or "batteries" in c_low:
                    state["category"] = "battery"
                elif "brake" in c_low:
                    state["category"] = "brake"
                elif "belt" in c_low:
                    state["category"] = "belt"
                elif "mat" in c_low:
                    state["category"] = "mat"
                elif "seat" in c_low:
                    state["category"] = "seat cover"
                elif "audio" in c_low or "amplifier" in c_low:
                    state["category"] = "audio"

            # 5. SKU Code
            if not state["last_product_code"]:
                sku_m = re.search(r'\b(RZP-[A-Z0-9-]+)\b', content, re.IGNORECASE)
                if sku_m:
                    state["last_product_code"] = sku_m.group(1).upper()

        return state

    def _is_followup_for_parts_or_specs(self, q: str) -> bool:
        """Detects whether a user prompt is asking a contextual follow-up for a known vehicle."""
        triggers = [
            "what charger", "which charger", "charger for it", "chargers", "fast charger",
            "what battery", "which battery", "battery for it", "batteries", "replacement pack",
            "brake pads", "brakes", "drive belt", "belt", "tires", "tyres", "parts", "accessories",
            "how much is it", "how much does it cost", "what is the price", "price of it",
            "cost of it", "is there a warranty", "warranty", "waterproof", "can i ride in rain",
            "range drop", "low range", "tell me more", "show me budget one", "show me cheap ones"
        ]
        q_low = q.lower()
        return any(t in q_low for t in triggers)

    def _is_context_shift(self, q: str) -> bool:
        """Detects a topic transition to a new vehicle while preserving category intent."""
        triggers = [
            "what about for", "what about", "how about for", "how about",
            "and for", "what of", "same for"
        ]
        q_low = q.lower()
        return any(t in q_low for t in triggers)

    def _is_anaphoric_followup(self, q: str) -> bool:
        """Detects anaphoric questions referring to a previously mentioned entity."""
        triggers = [
            "how much is it", "how much does it cost", "what is the price", "what is its price",
            "what does it cost", "price of it", "cost of it", "is it in stock",
            "is there a warranty", "how much warranty", "warranty on it", "warranty period",
            "is it waterproof", "can it get wet", "can i ride it in rain",
            "show me budget one", "show me cheap ones", "any cheaper option"
        ]
        q_low = q.lower()
        return any(t in q_low for t in triggers)

    def _synthesize_anaphoric_specs(self, query: str, bike: Dict[str, Any], fitment: Optional[Dict[str, Any]]) -> str:
        """Synthesizes high-precision answers for context-dependent follow-up questions."""
        q_low = query.lower()
        b_name = f"{bike['brand']} {bike['model']}"
        nom_v = f"{bike['nominal_voltage']}V"

        if any(w in q_low for w in ["price", "cost", "how much", "rate", "cheap", "budget"]):
            lines = [
                f"### 💰 Pricing & Quotation: {b_name}\n",
                f"Here is the official verified pricing for certified components compatible with your **{b_name}** ({nom_v} architecture):\n",
                "| Component | Specification | Price (Incl. GST) | Effective Price (Rebate) | Warranty |",
                "| :--- | :--- | :--- | :--- | :--- |"
            ]
            if fitment and fitment.get("compatible_batteries"):
                for b in fitment["compatible_batteries"]:
                    eff = b.get("effective_price_with_rebate", b["price"] - 2500)
                    lines.append(f"| **{b['name']}** | {b['kwh']} kWh ({b['range_km']} km range) | **₹{b['price']:,}** | **₹{eff:,}** *(Save ₹2,500)* | {b['warranty_months']} Months |")
            if fitment and fitment.get("compatible_parts"):
                for p in fitment["compatible_parts"]:
                    lines.append(f"| **{p['name']}** | {p.get('specs', 'OEM Spec')} | **₹{p['price']:,}** | — | {p.get('warranty_months', 12)} Months |")

            lines.extend([
                "\n#### 👨‍🔧 Installation Options:",
                "- 🏬 **100% FREE Partner Garage Fitting** at 450+ authorized Riderzpro hubs nationwide.",
                "- 🏠 **Doorstep Home Visit (+₹499)**: Certified technician arrives with diagnostic gear and handles old battery HazMat collection.",
                "- 🛡️ **Instant Digital Warranty**: Automatically activated on technician sign-off."
            ])
            return "\n".join(lines)

        elif any(w in q_low for w in ["warranty", "guarantee"]):
            return (
                f"### 🛡️ Warranty Coverage: {b_name}\n\n"
                f"All certified components for your **{b_name}** are backed by Riderzpro's direct replacement warranty:\n\n"
                f"- **🔋 Replacement Battery Packs**: **36 to 60 Months Comprehensive Warranty** (Zero-depreciation replacement for capacity degradation >30% or cell drift).\n"
                f"- **🔌 Chargers & Electronics**: **12 to 24 Months OEM Electronics Warranty**.\n"
                f"- **🛠️ Spare Parts & Mechanicals**: **12 Months Warranty** against manufacturing defects.\n"
                f"- **Digital Certificate**: Issued instantly to your *My Garage* vault upon delivery or installation.\n\n"
                f"*Claiming warranty is 1-click inside your dashboard with 24-hour doorstep technician dispatch!*"
            )

        elif any(w in q_low for w in ["waterproof", "rain", "ip67", "ip65", "monsoon"]):
            return (
                f"### 🌧️ Waterproofing & Ingress Protection: {b_name}\n\n"
                f"Your **{b_name}** is engineered for Indian monsoon conditions:\n\n"
                f"- **Battery & Motor**: **IP67 Certified** (100% dust-tight and submersible up to 1 meter for 30 minutes).\n"
                f"- **Throttle & Instrument Cluster**: **IP65 Ingress Protection** against pressurized rain spray.\n"
                f"- **Safe Water Wading Depth**: Up to the **wheel axle center line (~150mm to 200mm)**.\n\n"
                f"⚡ *Tip: Avoid riding through standing floodwaters that submerge the floorboard, and never pressure-wash the charging port.*"
            )

        return self._synthesize_vehicle_fitment(bike, fitment or {}, [])

    def process_query(
        self,
        user_query: str,
        history: Optional[List[Dict[str, str]]] = None,
        user_vehicle: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        High-Speed Enterprise Agent Pipeline (< 15ms latency):
        1. Typo Normalization & Multi-Turn Dialogue State Tracking (DST)
        2. Real-Time Order Tool Actions (Live Tracking & Cancellations)
        3. Intent Classification & Guardrails
        4. Entity Resolution with Conversational Memory & Context Shift
        5. Deep Domain & Category-Filtered Synthesis
        """
        query_text = user_query.strip()
        t_start = time.time()
        sources: List[Dict[str, str]] = []

        # Step 1: Typo Normalization & Dialogue State Extraction
        norm_query = self._normalize_query(query_text)
        dialogue_state = self._extract_dialogue_state(history)

        # Step 2: Greetings & Capabilities (<1ms)
        if self._is_greeting(norm_query):
            return {
                "query": query_text,
                "response": self._get_greeting_response(),
                "matched_vehicle": None,
                "compatible_batteries": [],
                "compatible_parts": [],
                "sources": [],
                "safety_advisories": [],
                "web_search_executed": False,
                "is_out_of_topic": False,
                "latency_ms": round((time.time() - t_start) * 1000, 2),
            }

        if self._is_smartness_meta_query(norm_query.lower()):
            return {
                "query": query_text,
                "response": self._synthesize_smartness_overview(),
                "matched_vehicle": None,
                "compatible_batteries": [],
                "compatible_parts": [],
                "sources": [],
                "safety_advisories": [],
                "web_search_executed": False,
                "is_out_of_topic": False,
                "latency_ms": round((time.time() - t_start) * 1000, 2),
            }

        if self._is_polite_or_gratitude(norm_query.lower()):
            return {
                "query": query_text,
                "response": self._synthesize_polite_response(),
                "matched_vehicle": None,
                "compatible_batteries": [],
                "compatible_parts": [],
                "sources": [],
                "safety_advisories": [],
                "web_search_executed": False,
                "is_out_of_topic": False,
                "latency_ms": round((time.time() - t_start) * 1000, 2),
            }

        # Step 3: Interactive Order Management & Live Tracking Tool
        order_id = (
            OrderTool.extract_order_id(query_text)
            or OrderTool.extract_order_id(norm_query)
            or dialogue_state.get("order_id")
        )
        is_cancellation = self._is_cancellation_query(norm_query.lower())
        is_tracking = (
            self._is_order_tracking_query(norm_query.lower())
            or bool(re.search(r'\brzp[-_\s]?[0-9]{3,6}\b', query_text, re.IGNORECASE))
        )

        if is_cancellation:
            if order_id:
                cancel_output = order_tool.cancel_order_action(order_id)
                return {
                    "query": query_text,
                    "response": cancel_output,
                    "matched_vehicle": None,
                    "compatible_batteries": [],
                    "compatible_parts": [],
                    "sources": [{
                        "type": "order_support",
                        "title": f"Order Cancellation Notice ({order_id})",
                        "link": f"/orders/{order_id}",
                        "snippet": f"Cancellation evaluation and policy check for {order_id}."
                    }],
                    "safety_advisories": [],
                    "web_search_executed": False,
                    "is_out_of_topic": False,
                    "latency_ms": round((time.time() - t_start) * 1000, 2),
                }

        if is_tracking:
            if order_id:
                tracking_output = order_tool.track_order_summary(order_id)
                order_info = order_tool.get_order(order_id)
                return {
                    "query": query_text,
                    "response": tracking_output,
                    "matched_vehicle": None,
                    "compatible_batteries": [],
                    "compatible_parts": [],
                    "sources": [{
                        "type": "order_tracking",
                        "title": f"Live Order Tracking ({order_id})",
                        "link": f"/track/{order_id}",
                        "snippet": f"Status: {order_info['status']} | Carrier: {order_info['carrier']} | ETA: {order_info['eta']}"
                    }],
                    "safety_advisories": [],
                    "web_search_executed": False,
                    "is_out_of_topic": False,
                    "latency_ms": round((time.time() - t_start) * 1000, 2),
                }

        # Step 4: Dedicated General Customer Support Queries
        if self._is_contact_support_query(norm_query):
            return {
                "query": query_text,
                "response": self._synthesize_contact_support(),
                "matched_vehicle": None,
                "compatible_batteries": [],
                "compatible_parts": [],
                "sources": [{
                    "type": "support",
                    "title": "Riderzpro Customer Support & Human Escalation Desk",
                    "link": "/support",
                    "snippet": "Direct Helpline: +91 98765 43210 | Email: support@riderzpro.com | 24/7 Roadside SOS: +91 80 4567 8900"
                }],
                "safety_advisories": [],
                "web_search_executed": False,
                "is_out_of_topic": False,
                "latency_ms": round((time.time() - t_start) * 1000, 2),
            }

        is_pure_support = self._is_pure_support_intent(norm_query)

        # Step 5: Multi-Turn Context Resolution & Category Extraction
        target_category = None
        q_low = norm_query.lower()
        if "charger" in q_low or "charging" in q_low:
            target_category = "charger"
        elif "battery" in q_low or "batteries" in q_low:
            target_category = "battery"
        elif "brake" in q_low:
            target_category = "brake"
        elif "belt" in q_low:
            target_category = "belt"
        elif "mat" in q_low:
            target_category = "mat"
        elif "seat" in q_low:
            target_category = "seat cover"
        elif "audio" in q_low or "amplifier" in q_low:
            target_category = "audio"

        is_comparison = False if is_pure_support else self._is_vehicle_comparison_query(norm_query)
        comparison_vehicles: List[Dict[str, Any]] = []
        if is_comparison:
            comparison_vehicles = self.catalog.find_vehicles_in_query(norm_query)

        matched_bike = None
        if not is_comparison and not is_pure_support:
            matched_bike = self.catalog.find_bike_by_query(norm_query)

            # Context Shift: "What about for Ola S1 Pro?" -> Inherit previous category if present
            if matched_bike and self._is_context_shift(norm_query):
                if not target_category and dialogue_state.get("category"):
                    target_category = dialogue_state["category"]

            # Context Carryover: No vehicle in current prompt, but dialogue history has one
            if not matched_bike:
                if user_vehicle and self._is_fitment_specific_query(norm_query):
                    matched_bike = self.catalog.find_bike_by_query(user_vehicle)
                elif dialogue_state.get("matched_bike") and (self._is_followup_for_parts_or_specs(norm_query) or self._is_anaphoric_followup(norm_query)):
                    matched_bike = dialogue_state["matched_bike"]

        matched_products = [] if is_pure_support else self.catalog.search_products(norm_query, limit=4)
        first_ref = matched_bike or (comparison_vehicles[0] if comparison_vehicles else None)
        is_in_domain = True if is_pure_support else self._is_riderzpro_domain(norm_query, first_ref, matched_products)

        if not is_in_domain:
            return {
                "query": query_text,
                "response": self._get_out_of_topic_response(),
                "matched_vehicle": None,
                "compatible_batteries": [],
                "compatible_parts": [],
                "sources": [],
                "safety_advisories": [],
                "web_search_executed": False,
                "is_out_of_topic": True,
                "latency_ms": round((time.time() - t_start) * 1000, 2),
            }

        # Step 6: In-Domain Catalog Retrieval
        fitment_result = None
        if not is_pure_support and matched_bike and not is_comparison:
            fitment_result = self.catalog.execute_fitment_lookup(matched_bike["model"])
            sources.append({
                "type": "catalog",
                "title": f"Riderzpro Verified Fitment Catalog ({matched_bike['brand']} {matched_bike['model']})",
                "link": "https://riderzpro.com/catalog",
                "snippet": f"Verified nominal voltage {matched_bike['nominal_voltage']}V with certified battery and parts compatibility."
            })
        elif not is_pure_support and is_comparison and comparison_vehicles:
            for v in comparison_vehicles[:2]:
                sources.append({
                    "type": "catalog",
                    "title": f"Riderzpro Vehicle Index ({v['brand']} {v['model']})",
                    "link": "https://riderzpro.com/catalog",
                    "snippet": f"Nominal voltage {v['nominal_voltage']}V | Claimed {v.get('claimed_range_km', 'N/A')} km range | Top Speed {v.get('top_speed_kmh', 'N/A')} km/h"
                })

        if not is_pure_support and matched_products:
            for p in matched_products[:3]:
                code = p.get("id") or p.get("sku_code", "RZP")
                cat_desc = p.get("category") or p.get("sub_category", "Accessories")
                price_val = p.get("price") or p.get("selling_price") or p.get("mrp")
                fits_val = p.get("fits") or p.get("fitment") or "Universal"
                sources.append({
                    "type": "catalog",
                    "title": f"Riderzpro Catalogue: {p['name']} ({code})",
                    "link": p.get("product_page") or "https://riderzpro.com/shop",
                    "snippet": f"{cat_desc} | Price: ₹{price_val:,} | Fits: {fits_val}" if price_val else f"{cat_desc} | Fits: {fits_val}"
                })

        # Step 7: Compatible Parts & Batteries Filtering for UI Cards
        compatible_parts_list = []
        compatible_batteries_list = []

        if not is_pure_support:
            if fitment_result and fitment_result.get("compatible_batteries"):
                compatible_batteries_list = fitment_result.get("compatible_batteries", [])

            if fitment_result and fitment_result.get("compatible_parts"):
                compatible_parts_list = fitment_result.get("compatible_parts", [])
            elif matched_products:
                for p in matched_products:
                    code = p.get("id") or p.get("sku_code", "RZP")
                    features = " | ".join(p.get("highlights", [])[:2]) if p.get("highlights") else (p.get("summary") or p.get("features") or "Official Verified Spec")
                    compatible_parts_list.append({
                        "id": f"part_{code.lower().replace('-', '_')}",
                        "sku_code": code,
                        "category": (p.get("category") or p.get("department") or "accessories").lower(),
                        "name": f"{p['name']} ({code})",
                        "specs": f"{features} | Fits: {p.get('fits') or p.get('fitment') or 'Universal'}",
                        "price": p.get("price") or p.get("selling_price") or p.get("mrp") or 1499,
                        "warranty_months": 24 if "year" in str(p.get("warranty", "")).lower() else 12,
                        "product_page": p.get("product_page")
                    })

            # Category-specific filtering for UI cards
            if target_category == "charger":
                compatible_batteries_list = []
                compatible_parts_list = [p for p in compatible_parts_list if "charg" in p.get("category", "").lower() or "charg" in p.get("name", "").lower() or "charg" in p.get("specs", "").lower()]
            elif target_category == "battery":
                compatible_parts_list = []
            elif target_category == "brake":
                compatible_batteries_list = []
                compatible_parts_list = [p for p in compatible_parts_list if "brake" in p.get("category", "").lower() or "brake" in p.get("name", "").lower() or "brake" in p.get("specs", "").lower()]
            elif target_category == "belt":
                compatible_batteries_list = []
                compatible_parts_list = [p for p in compatible_parts_list if "belt" in p.get("category", "").lower() or "belt" in p.get("name", "").lower() or "belt" in p.get("specs", "").lower()]

        # Step 8: High-Voltage Electrical Safety Audit
        safety_advisories = self._apply_safety_guardrails(norm_query, fitment_result)

        # Step 9: Web Search Decision (Explicit only)
        web_search_results = []
        needs_web_search = self._should_explicit_search(norm_query, matched_bike is not None or bool(comparison_vehicles))
        if needs_web_search:
            search_query = self._build_search_query(norm_query, matched_bike or (comparison_vehicles[0] if comparison_vehicles else None))
            search_res = self.web_search.search(search_query)
            if search_res.get("status") in ["success", "partial_error"]:
                web_search_results = search_res.get("results", [])
                for r in web_search_results[:3]:
                    sources.append({
                        "type": "web",
                        "title": r.get("title", "Live EV Web Reference"),
                        "link": r.get("url", "https://duckduckgo.com"),
                        "snippet": r.get("snippet", "")
                    })

        # Step 10: Deep Domain Synthesis
        if matched_bike and self._is_anaphoric_followup(norm_query):
            response_markdown = self._synthesize_anaphoric_specs(norm_query, matched_bike, fitment_result)
        else:
            response_markdown = self._synthesize_response(
                query=norm_query,
                matched_bike=matched_bike,
                fitment_data=fitment_result,
                matched_products=matched_products,
                web_results=web_search_results,
                safety_advisories=safety_advisories,
                user_vehicle=user_vehicle,
                comparison_vehicles=comparison_vehicles
            )

        elapsed_ms = round((time.time() - t_start) * 1000, 2)

        return {
            "query": query_text,
            "response": response_markdown,
            "matched_vehicle": fitment_result.get("matched_vehicle") if fitment_result else None,
            "compatible_batteries": compatible_batteries_list,
            "compatible_parts": compatible_parts_list,
            "sources": sources,
            "safety_advisories": safety_advisories,
            "web_search_executed": needs_web_search,
            "is_out_of_topic": False,
            "latency_ms": elapsed_ms
        }

    # ==========================================================================
    # Classification & Routing Helpers
    # ==========================================================================
    def _is_greeting(self, query: str) -> bool:
        q = query.strip().lower()
        greeting_patterns = [
            r"^(hi|hello|hey|greetings|namaste)[!.?]?$",
            r"^(good\s+(morning|afternoon|evening))[!.?]?$",
            r"^(who\s+are\s+you|what\s+can\s+you\s+do|help|what\s+is\s+volt|tell\s+me\s+about\s+yourself)[!.?]?$",
            r"^hey\s+volt[!.?]?$"
        ]
        return any(re.match(p, q) for p in greeting_patterns)

    def _is_fitment_specific_query(self, query: str) -> bool:
        q = query.lower()
        triggers = [
            "which battery fits", "what battery fits", "battery for my", "charger for my",
            "parts for my", "brake pads for my", "compatible battery", "fit my bike", "fits my bike"
        ]
        return any(t in q for t in triggers)

    def _is_riderzpro_domain(
        self,
        query: str,
        matched_bike: Optional[Dict[str, Any]],
        matched_products: Optional[List[Dict[str, Any]]] = None
    ) -> bool:
        """
        Determines whether the user question belongs to the Riderzpro ecosystem domain:
        EV two-wheelers, batteries, spare parts, OR automotive/bike accessories in the v2 catalog.
        Strictly rejects coding, recipes, general trivia, and non-automotive questions.
        """
        if matched_bike is not None:
            return True

        q = query.lower()

        # Check for explicit SKU codes like RZP-TI-001, RZP-BBC-001
        if re.search(r'\b(RZP-[A-Z0-9]+(-\d+)?)\b', query, re.IGNORECASE):
            return True

        # Check for explicit non-domain triggers (programming, recipes, trivia, etc.)
        has_non_domain_trigger = any(re.search(r'\b' + re.escape(w) + r'\b', q) for w in NON_EV_INDICATORS)

        # Check if matched products exist from catalog
        has_catalog_product_match = bool(matched_products and len(matched_products) > 0)

        # Check indexed brands from the catalog database
        indexed_brands = catalog_db.get_all_brands()
        has_indexed_brand = any(re.search(r'\b' + re.escape(b) + r'\b', q) for b in indexed_brands if len(b) > 2)

        # Check known EV brands or models
        has_ev_brand_or_model = any(re.search(r'\b' + re.escape(b) + r'\b', q) for b in KNOWN_EV_BRANDS_MODELS)

        # Check domain keywords
        has_ev_keyword = any(
            (bool(re.search(r'\b' + re.escape(k) + r'\b', q)) if len(k) <= 3 else (k in q))
            for k in EV_DOMAIN_KEYWORDS
        )
        has_catalog_keyword = any(k in q for k in CATALOG_DOMAIN_KEYWORDS)
        has_support_keyword = any(
            (bool(re.search(r'\b' + re.escape(k) + r'\b', q)) if len(k) <= 4 else (k in q))
            for k in SUPPORT_DOMAIN_KEYWORDS
        )

        # If it has non-domain triggers (coding, recipes, medicine, trivia, etc.), strictly reject
        if has_non_domain_trigger:
            if not (has_indexed_brand or has_ev_brand_or_model or has_support_keyword):
                return False

        # Must have at least one verified domain signal
        return has_indexed_brand or has_ev_brand_or_model or has_ev_keyword or has_catalog_keyword or has_support_keyword or has_catalog_product_match

    def _get_greeting_response(self) -> str:
        return (
            "### Hello! I'm Volt ⚡\n\n"
            "I'm your automotive & EV specialist for **Riderzpro**, connected to **350+ certified vehicle accessories** and **116+ electric two-wheelers** across India.\n\n"
            "#### Quick Demo Shortcuts:\n"
            "- 🔋 **Fitment & Voltage Check**: *\"60V battery for Ola S1 Pro\"* or *\"Cheap charger for Ather 450X\"*\n"
            "- 📦 **Real-Time Order Tracking**: *\"Track order RZP-8492\"* (Live courier, AWB, and ETA)\n"
            "- ⚡ **Safety Guardrails**: *\"Can I install a 72V battery in 48V Chetak?\"*\n"
            "- 🚗 **4-Wheeler Accessories**: *\"Floor mats for Mahindra Thar\"* or *\"RECOIL amplifiers\"*\n"
            "- 🔄 **Order Support & Policies**: *\"How do returns work?\"* or *\"Can I cancel order RZP-5541?\"*\n\n"
            "*Type your query or tap one of the suggestion chips below.*"
        )

    def _get_out_of_topic_response(self) -> str:
        return (
            "### ⚡ Volt — Riderzpro Automotive & EV Specialist\n\n"
            "I specialize exclusively in **Automotive Accessories, SUV Upgrades, Car Audio Systems (RECOIL, Blaupunkt, Autoform, Riderzpro)** and **Electric Two-Wheelers**.\n\n"
            "I am unable to assist with non-automotive topics, programming, cooking, medical questions, or general trivia.\n\n"
            "**Please ask me about:**\n"
            "- **Vehicle Accessories & Fitment**: Floor mats (9D TPE vs 7D Luxury), seat covers, ambient lighting, side steps, body covers for Thar, Creta, Scorpio N, Fortuner, Seltos, Swift, etc.\n"
            "- **Car Audio Upgrades**: RECOIL Class-D amplifiers, Blaupunkt Android head units, DSP tuning, subwoofers, and OFC wiring.\n"
            "- **EV Batteries & Rebates**: Certified replacement packs for Ather, Ola, Chetak, TVS, Revolt with ₹2,500 instant old battery exchange credit.\n"
            "- **Installation & Network**: FREE Partner Garage fitting, fixed-rate electrical routing, doorstep home service (+₹499).\n"
            "- **Order Support & Delivery**: 2–4 days express delivery, 100% Guaranteed Fitment, and 7-day hassle-free returns.\n\n"
            "*Please share your car or two-wheeler model, or ask for any accessory or technical upgrade!*"
        )

    def _should_explicit_search(self, query: str, bike_found: bool) -> bool:
        """
        Only execute live web search if user explicitly requests internet search
        or asks about an external model not present in the catalog.
        Prevents blocking queries with 3-5 seconds of slow web latency.
        """
        q = query.lower()
        explicit_search_terms = [
            "search google", "search online", "search web", "check internet",
            "compare market price", "what is market price", "latest news on"
        ]
        return any(term in q for term in explicit_search_terms)

    def _build_search_query(self, query: str, matched_bike: Optional[Dict[str, Any]]) -> str:
        q = query
        if matched_bike and matched_bike["model"].lower() not in q.lower():
            q = f"{matched_bike['brand']} {matched_bike['model']} {q}"
        if "ev" not in q.lower() and "electric" not in q.lower():
            q = f"{q} electric scooter bike"
        return q

    def _apply_safety_guardrails(self, query: str, fitment_data: Optional[Dict[str, Any]]) -> List[str]:
        advisories = []
        q = query.lower()

        if "diy" in q or "self install" in q or "open battery" in q or "tamper" in q:
            advisories.append(
                "⚡ **High Voltage Safety Warning**: EV battery packs operate at hazardous DC voltages (48V-72V). "
                "DIY opening of sealed battery enclosures risks severe electric shock, thermal runaway, and voids warranty. "
                "Always utilize Riderzpro Certified Technicians."
            )

        voltage_mismatch = bool(
            re.search(r'72\s*v.*(?:in|into|to|on).*48\s*v', q)
            or re.search(r'72\s*v.*(?:in|into|to|on).*60\s*v', q)
            or re.search(r'(\d+)\s*v.*(?:in|into|on).*(\d+)\s*v', q)
            or "higher voltage" in q
            or "boost speed with battery" in q
            or "overvolt" in q
        )

        if fitment_data and fitment_data.get("status") == "success":
            v = fitment_data["matched_vehicle"]
            v_nom = float(v.get("nominal_voltage") or 48.0)
            if v_nom < 65.0 and re.search(r'\b72\s*v\b', q):
                voltage_mismatch = True
            elif v_nom < 55.0 and re.search(r'\b60\s*v\b', q):
                voltage_mismatch = True

        if voltage_mismatch:
            advisories.append(
                "Voltage Incompatibility Detected: Never install a 72V battery into a 48V or 60V system. "
                "This causes immediate motor controller MOSFET breakdown and telematics burnout."
            )

        return advisories

    # ==========================================================================
    # Specialized High-Speed Domain Synthesizers (< 5ms)
    # ==========================================================================
    def _synthesize_response(
        self,
        query: str,
        matched_bike: Optional[Dict[str, Any]],
        fitment_data: Optional[Dict[str, Any]],
        matched_products: Optional[List[Dict[str, Any]]],
        web_results: List[Dict[str, str]],
        safety_advisories: List[str],
        user_vehicle: Optional[str] = None,
        comparison_vehicles: Optional[List[Dict[str, Any]]] = None
    ) -> str:
        q = query.lower()

        # 1. Critical Voltage Overvoltage Warning check
        is_voltage_mismatch = any("Voltage Incompatibility" in a for a in safety_advisories)
        if is_voltage_mismatch:
            return self._synthesize_overvoltage_warning(query, matched_bike, fitment_data)

        # 2. Meta Intelligence / Capability Query
        if self._is_smartness_meta_query(q):
            return self._synthesize_smartness_overview()

        # 3. Riderzpro Platform & Services Overview Intent
        if self._is_about_riderzpro_query(q):
            return self._synthesize_about_riderzpro()

        # Dedicated General Customer Support & Operations (Prioritized before product search)
        if self._is_contact_support_query(q):
            return self._synthesize_contact_support()

        if self._is_payment_query(q):
            return self._synthesize_payment_methods()

        if self._is_order_tracking_query(q):
            return self._synthesize_order_tracking()

        if self._is_return_refund_query(q):
            return self._synthesize_return_policy()

        if self._is_cancellation_query(q):
            return self._synthesize_cancellation_policy()

        if self._is_warranty_query(q) and not matched_bike:
            return self._synthesize_warranty_info()

        if self._is_store_locations_query(q):
            return self._synthesize_store_locations()

        if self._is_invoice_gst_query(q):
            return self._synthesize_gst_invoicing()

        if self._is_garage_vin_query(q):
            return self._synthesize_garage_vin()

        if self._is_polite_or_gratitude(q):
            return self._synthesize_polite_response()

        # 4. 7D vs 9D Floor Mats Comparison Intent
        if self._is_mat_comparison_query(q):
            return self._synthesize_mat_comparison(query)

        # 5. Car Audio & Amplifier Engineering Guidance (RECOIL, Blaupunkt)
        if self._is_audio_guidance_query(q):
            return self._synthesize_audio_guidance(query)

        # 6. Installation & Network Support (Garage fitting, doorstep, fixed labor rates)
        if self._is_installation_support_query(q):
            return self._synthesize_installation_support(query)

        # 7. Delivery, Shipping, Returns & 100% Fitment Guarantee
        if self._is_delivery_support_query(q):
            return self._synthesize_delivery_support(query)

        # 8. Specific 4-Wheeler / SUV Vehicle Upgrade Intent (Thar, Creta, Scorpio N, Fortuner, etc.)
        detected_vehicle = self._detect_vehicle_in_query(query)
        if detected_vehicle:
            veh_products = self.catalog.find_products_by_vehicle(detected_vehicle)
            if veh_products:
                return self._synthesize_vehicle_accessories(detected_vehicle, veh_products, query)

        # 9. Brand Showcase Intent (RECOIL, Blaupunkt, Autoform, Riderzpro)
        detected_brand = self._detect_brand_in_query(query)
        if detected_brand and (any(w in q for w in ["brand", "products", "amplifier", "audio", "seat", "tell me about", "what do you have", "show"]) or len(q.split()) <= 3):
            brand_prods = self.catalog.find_products_by_brand(detected_brand)
            if brand_prods:
                return self._synthesize_brand_showcase(detected_brand, brand_prods, query)

        # 10. Multi-Vehicle Comparison Intent
        if self._is_vehicle_comparison_query(q):
            vehicles = comparison_vehicles or self.catalog.find_vehicles_in_query(query)
            if len(vehicles) >= 2:
                return self._synthesize_vehicle_comparison(vehicles[0], vehicles[1], query)
            elif len(vehicles) == 1 and any(w in q for w in ["compare", "vs", "versus", "which is better"]):
                rival = self._get_default_rival(vehicles[0])
                if rival:
                    return self._synthesize_vehicle_comparison(vehicles[0], rival, query)

        # 11. Battery Chemistry Deep Dive (LFP vs NMC)
        if self._is_battery_chemistry_query(q):
            return self._synthesize_battery_chemistry()

        # 12. Battery Management System (BMS) Architecture
        if self._is_bms_query(q):
            return self._synthesize_bms_architecture()

        # 13. General Battery Lifespan & Longevity Intent
        if self._is_battery_lifespan_query(q):
            return self._synthesize_battery_lifespan(user_vehicle)

        # 14. Winter / Cold Weather Range Drop Intent
        if any(w in q for w in ["winter", "cold weather", "cold climate", "winter weather", "range drop in cold", "winter range"]):
            return self._synthesize_winter_range()

        # 15. Range Loss & Troubleshooting Intent
        if self._is_range_troubleshooting_query(q):
            return self._synthesize_range_troubleshooting()

        # 16. Waterproofing & Monsoon Riding Intent
        if self._is_waterproof_query(q):
            return self._synthesize_waterproof_info()

        # 17. Regenerative Braking Intent
        if self._is_regen_query(q):
            return self._synthesize_regenerative_braking()

        # 18. EV Charging Best Practices Intent
        if self._is_charging_guidance_query(q):
            return self._synthesize_charging_guidance()

        # 19. Old Battery Exchange Rebate Intent
        if any(r in q for r in ["rebate", "exchange", "2500", "2,500", "old battery credit", "exchange offer"]):
            return self._synthesize_rebate_info()

        # 20. Technician & Service Booking Intent
        if any(b in q for b in ["book technician", "doorstep visit", "technician booking", "appointment slot", "doorstep home"]):
            return self._synthesize_booking_info()

        # 21. Warranty & Claims Intent
        if any(w in q for w in ["warranty claim", "digital warranty", "how to claim", "warranty coverage"]) and not matched_bike:
            return self._synthesize_warranty_info()

        # 22. Subsidies & AIS-156 Regulations
        if self._is_subsidy_regulations_query(q):
            return self._synthesize_subsidy_regulations()

        # 23. Catalog Products / Categories Overview Intent
        if self._is_catalog_overview_query(q):
            return self._synthesize_catalog_overview()

        # 24. Vehicle-Specific Fitment Synthesis
        if matched_bike and fitment_data and fitment_data.get("status") == "success":
            return self._synthesize_vehicle_fitment(matched_bike, fitment_data, safety_advisories)

        # 25. Catalog Product Search Matches
        if matched_products and len(matched_products) > 0:
            return self._synthesize_catalog_products(matched_products, query)

        # 26. General In-Domain Support Fallback
        return self._synthesize_general_support(query, web_results, safety_advisories)

    def _is_battery_lifespan_query(self, q: str) -> bool:
        patterns = [
            r"how long can (a|the|my)?\s*battery (work|last|run)",
            r"battery (lifespan|longevity|life|cycles|degradation|duration)",
            r"how many years (does|will|can) (a|the|my)?\s*battery",
            r"how many (charge|charging)?\s*cycles",
            r"life of (a|the|my)?\s*(ev|electric)?\s*battery",
            r"how long does (a|the|my)?\s*battery last",
            r"soh|state of health"
        ]
        return any(re.search(p, q) for p in patterns)

    def _synthesize_battery_lifespan(self, user_vehicle: Optional[str] = None) -> str:
        vehicle_note = ""
        if user_vehicle:
            vehicle_note = (
                f"\n\n#### 💡 Registered Vehicle Reference\n"
                f"For your registered **{user_vehicle}**, the OEM electrical system is designed for ~1,500 full charge cycles. "
                f"When upgrading on Riderzpro, you receive guaranteed certified fitment packs with doorstep installation."
            )

        return (
            "### 🔋 Electric Two-Wheeler Battery Lifespan & Longevity\n\n"
            "An EV battery's operational lifespan depends primarily on its **cell chemistry**, **total charge cycles**, and **thermal management habits**:\n\n"
            "#### 1. Expected Lifespan & Cycle Life\n"
            "- **LFP (Lithium Iron Phosphate)**: **5 to 7 years** or **2,000 – 3,000 full charge-discharge cycles** (exceptional thermal stability and cycle life).\n"
            "- **NMC (Nickel Manganese Cobalt)**: **4 to 6 years** or **1,200 – 1,800 full charge cycles** (high energy density, standard in Ather, Ola, Chetak).\n"
            "- **Daily Commute Benchmark**: Riding 30–40 km daily (~250 cycles/year) means a certified EV battery easily delivers **4 to 6 years of trouble-free daily service** before noticeable degradation.\n\n"
            "#### 2. What Is \"Battery Retirement\"?\n"
            "An EV battery does not suddenly fail; its capacity gradually decreases over time. A battery is considered ready for replacement when its **State of Health (SOH) drops below 70% to 75%** of its original kWh rating.\n\n"
            "#### 3. Riderzpro Certified Guarantee\n"
            "- **36 to 60 Months Direct Replacement Warranty**: Zero depreciation on all certified replacement packs.\n"
            "- **Instant ₹2,500 Old Battery Exchange Rebate**: Claim an upfront discount at checkout with free doorstep collection and authorized eco-friendly recycling.\n\n"
            "#### 4. Top 4 Pro Tips to Maximize Battery Life\n"
            "1. **The 20%–80% Rule**: Avoid letting your battery sit at 0% or 100% for days. Keep daily state of charge between 20% and 80%.\n"
            "2. **Monthly Cell Balancing**: Charge to 100% and keep plugged in for an extra 2–3 hours once a month so BMS bleed resistors equalize parallel cell voltages.\n"
            "3. **Avoid Hot Charging**: Never fast-charge immediately after high-speed highway riding. Let the pack cool down for 15–20 minutes.\n"
            "4. **Maintain Tyre Pressure**: Keeping tyres at 30–34 PSI reduces rolling resistance and lowers battery amp draw by up to 12%."
            f"{vehicle_note}"
        )

    def _synthesize_winter_range(self) -> str:
        return (
            "### ❄️ Why EV Range Drops in Cold Winter Weather\n\n"
            "If you experience a **15% to 25% drop in driving range during cold weather (<15°C)**, your vehicle is operating under normal electrochemical physics:\n\n"
            "#### 1. The Science Behind Winter Range Drop\n"
            "- **Sluggish Electrolyte Viscosity**: In low ambient temperatures, the liquid electrolyte inside lithium-ion cells thickens, significantly increasing **internal DC resistance**.\n"
            "- **Voltage Sag Under Throttle**: High acceleration draws high current from cold cells, causing temporary voltage sag. The BMS limits peak motor power earlier to protect the cells.\n"
            "- **Reduced Regenerative Braking**: The BMS automatically dials back regenerative braking power to prevent lithium plating onto the cold anode.\n\n"
            "#### 2. 3 Actionable Tips to Regain Winter Range\n"
            "1. **Charge Immediately After Riding**: Plug in your EV right after returning from a ride while the battery pack is still warm. Warm cells absorb charge with 98% efficiency.\n"
            "2. **Park in Covered/Indoor Bays**: Avoid leaving the two-wheeler outdoors overnight in sub-10°C ambient temperatures.\n"
            "3. **Check Cold Tyre Pressure**: Cold air contracts, causing tyres to lose 2–4 PSI. Inflating tyres back to **32–34 PSI** immediately recovers 5% to 10% of lost range."
        )

    def _synthesize_rebate_info(self) -> str:
        return (
            "### ♻️ Riderzpro ₹2,500 Old Battery Exchange Rebate\n\n"
            "Riderzpro operates India's official certified circular battery exchange program compliant with the **Battery Waste Management Rules (BWMR)**:\n\n"
            "#### How It Works:\n"
            "1. **Instant Upfront Discount**: When selecting any certified replacement battery pack on Riderzpro, toggle *\"Exchange Old Battery\"* to receive an **instant ₹2,500 credit** deducted directly at checkout.\n"
            "2. **Universal Acceptance**: We accept both old OEM lithium-ion packs and lead-acid batteries from any registered electric two-wheeler.\n"
            "3. **Doorstep Collection**: When our certified technician arrives with your new battery, they inspect, safely disconnect, and pack your old battery in a certified HazMat transport case.\n"
            "4. **Eco-Friendly Recycling**: Over 95% of lithium, cobalt, nickel, and copper are recovered by authorized recycling partners, preventing hazardous landfill contamination."
        )

    def _synthesize_booking_info(self) -> str:
        return (
            "### 👨‍🔧 Riderzpro Certified Installation & Technician Booking\n\n"
            "Riderzpro provides professional on-demand installation and diagnostics for electric two-wheelers across India:\n\n"
            "#### Available Service Modes:\n"
            "- **🏠 Doorstep Home Visit (+₹499)**: A certified high-voltage technician visits your home with a mobile diagnostic kit, torque-calibrated tools, and HazMat battery packing.\n"
            "- **🏬 Certified Service Center (+₹299)**: Reserved bay at a certified Riderzpro service hub with dedicated battery testing stations.\n\n"
            "#### Our 6-Step Diagnostic Protocol:\n"
            "1. **Open-Circuit Voltage (OCV) Check**: Verification of pack health before mounting.\n"
            "2. **Dynamic Load Drop Test**: Testing under 15A–30A simulated throttle draw.\n"
            "3. **Torque-Calibrated Terminal Tightening**: Prevents resistance heating at high currents.\n"
            "4. **IP67 Waterproof Enclosure Seal**: Ensuring all gaskets and grommets are intact.\n"
            "5. **BMS CAN-bus Handshake**: Validating communication with speedometer/telematics.\n"
            "6. **Digital Warranty Sign-off**: Certificate issued instantly to your Riderzpro account."
        )

    def _synthesize_warranty_info(self) -> str:
        return (
            "### 🛡️ Riderzpro Digital Warranty Certificates & Claims Process\n\n"
            "Every certified battery and component on Riderzpro is backed by a comprehensive enterprise warranty:\n\n"
            "#### Coverage Details:\n"
            "- **36 to 60 Months Direct Replacement**: Zero-depreciation replacement guarantee on certified lithium-ion battery packs.\n"
            "- **12 to 24 Months OEM Electronics Warranty**: Full coverage on smart fast chargers, BMS modules, hub motors, and controllers.\n"
            "- **Instant Digital Certificate**: Issued directly to your *My Garage* dashboard upon delivery or technician diagnostic sign-off (no paper receipts required).\n\n"
            "#### 1-Click Warranty Claim Protocol:\n"
            "1. **Open My Garage**: Go to **Customer Dashboard ➔ My Garage ➔ Active Vehicles**.\n"
            "2. **Tap Claim Warranty**: Select the battery or part under warranty.\n"
            "3. **Technician Dispatch (Within 24 Hours)**: A certified high-voltage technician visits your doorstep with digital impedance analyzers and cell voltage drift equipment.\n"
            "4. **Immediate Replacement**: If internal resistance degradation (>30%) or cell group failure is detected, an on-the-spot replacement is processed."
        )

    def _synthesize_payment_methods(self) -> str:
        return (
            "### 💳 Riderzpro Accepted Payment Methods & Billing Options\n\n"
            "Riderzpro supports fast, flexible, and 100% secure payment gateways for both retail consumers and commercial fleet accounts:\n\n"
            "#### 1. Instant Digital Payments (0% Surcharge)\n"
            "- **UPI**: Google Pay, PhonePe, Paytm, BHIM, Cred, and all major UPI apps via instant dynamic QR or VPA.\n"
            "- **Credit & Debit Cards**: Visa, MasterCard, RuPay, and American Express with 3D-Secure 2.0 OTP authentication.\n"
            "- **Net Banking**: Instant direct debit across 50+ Indian banks (HDFC, ICICI, SBI, Axis, Kotak, etc.).\n\n"
            "#### 2. Cash / Pay on Delivery (COD)\n"
            "- Available for verified delivery pin codes on orders up to **₹10,000**.\n"
            "- You can pay via Cash or scan the delivery rider's dynamic UPI QR code on the spot.\n\n"
            "#### 3. Flexible No-Cost & Low-Cost EMIs\n"
            "- **Credit Card EMI**: 3, 6, 9, and 12-month tenure options available across major bank credit cards.\n"
            "- **Instant Checkout NBFC Finance**: Zero-paperwork split-pay plans on high-value items like replacement battery packs and full car audio sets.\n\n"
            "#### 4. 🧾 B2B GST Invoicing & Input Tax Credit\n"
            "- Registered businesses can enter their 15-digit GSTIN at checkout to receive an automated B2B Tax Invoice with **18% to 28% Input Tax Credit (ITC)**.\n\n"
            "*All online transactions are encrypted via 256-bit SSL and comply with PCI-DSS Level 1 standards.*"
        )

    def _synthesize_order_tracking(self) -> str:
        return (
            "### 📍 Riderzpro Live Order Tracking & Dispatch Portal\n\n"
            "You can track your order in real-time from our fulfillment warehouse to your doorstep with live milestone updates and courier AWB sync:\n\n"
            "#### 🚀 Try Tracking a Sample Order:\n"
            "- **`Track order RZP-8492`**: Ather 450X 700W Smart Fast Charger (Out for Delivery via Blue Dart Express)\n"
            "- **`Track order RZP-1029`**: 72V 40Ah NMC Battery Pack (In Interstate Transit via Delhivery Surface)\n"
            "- **`Track order RZP-5541`**: Ceramic Sintered Brake Pads (Packing & Processing at Bengaluru Hub)\n"
            "- **`Track order RZP-3301`**: Autoform 7D Luxury Floor Mats (Delivered)\n\n"
            "#### 📦 How to Track Your Own Order:\n"
            "1. **Provide Your Order ID**: Simply type **`Track order <Your Order ID>`** (e.g. `Track order RZP-8492` or `Where is order 8492`).\n"
            "2. **Customer Dashboard**: Log in and visit **Customer Dashboard ➔ Active Orders** to view live GPS tracking.\n"
            "3. **SMS & WhatsApp Dispatch Link**: An automated tracking link with Air Waybill (AWB) number is sent automatically when your package leaves our fulfillment center.\n\n"
            "#### ⚡ Express Delivery Timelines:\n"
            "- **Bengaluru Hyper-Local**: 25 – 45 Minutes via nearest hub.\n"
            "- **Pan-India Express Air**: 2 – 4 Business Days nationwide.\n\n"
            "*Need immediate logistics assistance? Call our dispatch desk at **1800-419-7977** (9 AM - 8 PM).*"
        )

    def _synthesize_return_policy(self) -> str:
        return (
            "### 🔄 Riderzpro 7-Day Hassle-Free Return & Replacement Policy\n\n"
            "Riderzpro stands behind every automotive accessory and EV component with our **100% Guaranteed Fitment Promise**:\n\n"
            "#### 1. Return & Replacement Window\n"
            "- **7-Day Hassle-Free Replacement**: If an unopened, defective, or incorrect part is delivered, request an instant return or replacement within 7 calendar days of delivery.\n"
            "- **🛡️ 100% Guaranteed Fitment Guarantee**: If a battery, charger, or accessory verified for your car or bike does not fit with flush OEM factory precision, we arrange **100% FREE doorstep reverse pickup** and provide an immediate exchange or full refund with zero restocking fees.\n\n"
            "#### 2. Eligibility Guidelines\n"
            "- **Eligible**: Damaged in transit, manufacturing defects, missing accessories, or fitment incompatibility verified against your vehicle specs.\n"
            "- **Condition**: Items should be in original condition with OEM packaging, user manuals, and warranty documentation.\n\n"
            "#### 3. How to Request a Return (1-Click Process)\n"
            "1. Navigate to **Customer Dashboard ➔ Orders**.\n"
            "2. Select your order and click **Request Return / Replacement**.\n"
            "3. Upload a quick photo of the issue/fitment mismatch.\n"
            "4. Our logistics partner will pick up the package from your doorstep within 24–48 hours.\n\n"
            "#### 4. Refund Timelines\n"
            "- **Prepaid Orders (UPI/Card/Net Banking)**: Refund initiated within 24 hours of reverse pickup inspection, reflecting in your source account within 2–4 banking days.\n"
            "- **COD Orders**: Refund transferred directly to your bank account via UPI or credited instantly to your Riderzpro Wallet."
        )

    def _synthesize_contact_support(self) -> str:
        return (
            "### 📞 Riderzpro Customer Support & Human Escalation Desk\n\n"
            "Our dedicated support engineering and customer escalation teams are available to assist you:\n\n"
            "#### 1. Live Human Agent & Phone Helplines\n"
            "- **Direct Voice Support**: **+91 98765 43210** *(Mon–Sat, 9:00 AM – 8:00 PM IST)*\n"
            "  - Immediate assistance for active orders, warranty claims, cancellations, and technician dispatches.\n"
            "- **💬 WhatsApp Support Desk**: **+91 98765 43210** *(Instant chat with a support executive)*\n"
            "- **🚨 24/7 Roadside Assistance & EV Towing SOS**: **+91 80 4567 8900** *(24x7 Nationwide Coverage)*\n"
            "  - Emergency roadside battery recovery, flat tire assistance, and towing.\n\n"
            "#### 2. Digital Support & Escalations\n"
            "- **Priority Support Email**: `support@riderzpro.com` *(Guaranteed response within 2 business hours)*\n"
            "- **Instant In-Chat Shortcuts**:\n"
            "  - Track your package: Type **`Track order RZP-8492`**\n"
            "  - Cancel order: Type **`Cancel order RZP-5541`**\n"
            "  - Check fitment: Type **`Battery for Ather 450X`** or **`Floor mats for Thar`**\n"
            "  - Return policy: Type **`Return policy`**\n\n"
            "#### 3. Request a Priority Callback\n"
            "*If you would like a support specialist to call you directly, please reply with your **Order ID** or **Contact Number**, and a Senior Support Executive will connect with you within 15 minutes.*"
        )

    def _synthesize_cancellation_policy(self) -> str:
        return (
            "### ❌ Riderzpro Order Cancellation & Address Modification Policy\n\n"
            "We ensure maximum flexibility for your orders before dispatch:\n\n"
            "#### 1. How to Cancel Your Order\n"
            "- **Pre-Dispatch (1-Click Instant Cancellation)**:\n"
            "  - Go to **Customer Dashboard ➔ Active Orders**.\n"
            "  - Select your order and tap **Cancel Order**.\n"
            "  - Pre-dispatch cancellations are approved immediately with an **instant 100% full refund** back to your original payment method.\n"
            "- **Post-Dispatch**:\n"
            "  - If your package has already been handed to the courier, simply decline the package at your doorstep or utilize our **7-day hassle-free return window** upon delivery.\n\n"
            "#### 2. Modifying Delivery Address or Contact Details\n"
            "- If your order has not been dispatched yet, you can edit the shipping address directly in **Active Orders** or call our support helpline at **+91 98765 43210** to update your delivery destination.\n\n"
            "#### 3. Refund Turnaround\n"
            "- **UPI & Wallets**: Instant refund (within 2 to 4 hours).\n"
            "- **Cards & Net Banking**: 2 to 4 business days depending on your issuing bank."
        )

    def _synthesize_store_locations(self) -> str:
        return (
            "### 🏬 Riderzpro Hub & Partner Workshop Network\n\n"
            "Riderzpro operates through a hybrid network of company fulfillment hubs and 450+ certified partner garages across India:\n\n"
            "#### 1. Bengaluru Local Hubs (25 – 45 Min Express Delivery & Fitting)\n"
            "- **Indiranagar**: 100ft Road Hub (Fast delivery to Central & East Bengaluru)\n"
            "- **Koramangala**: 5th Block Hub (South Bengaluru coverage)\n"
            "- **Jayanagar**: 4th Block Service Hub (South-West Bengaluru)\n"
            "- **Hebbal**: Outer Ring Road Center (North Bengaluru & Airport corridor)\n"
            "- **Whitefield**: ITPL Main Road Hub (East tech corridor)\n"
            "- **Malleshwaram**: 8th Cross Automotive Center (West Bengaluru)\n\n"
            "#### 2. Pan-India Partner Garage Network\n"
            "- Over **450+ Riderzpro Certified Partner Hubs** across Mumbai, Pune, Delhi NCR, Hyderabad, Chennai, and Kolkata.\n"
            "- Standard accessories (floor mats, seat covers, sunshades) come with **100% FREE Partner Garage installation** upon delivery.\n"
            "- Complex electrical wiring (concealed ambient lights, amplifiers) is performed by certified auto-electricians with transparent, fixed labor rates."
        )

    def _synthesize_gst_invoicing(self) -> str:
        return (
            "### 🧾 Riderzpro Commercial B2B & GST Tax Invoicing\n\n"
            "Riderzpro provides fully compliant tax invoices for individual vehicle owners, automotive workshops, and corporate fleet operators:\n\n"
            "#### 1. How to Add Your GSTIN at Checkout\n"
            "- During checkout on the payment screen, select **\"Add Business GSTIN\"**.\n"
            "- Enter your registered Company Name and 15-digit GST Identification Number (GSTIN).\n"
            "- Our system automatically verifies the GSTIN and issues a formal Tax Invoice reflecting your business address and state tax codes (CGST + SGST or IGST).\n\n"
            "#### 2. Downloading Invoices\n"
            "- Every order's tax invoice is permanently archived in your **Customer Dashboard ➔ Invoices**.\n"
            "- You can view or download the digital PDF invoice anytime with a single click.\n\n"
            "#### 3. Input Tax Credit (ITC)\n"
            "- All automotive accessories, spare parts, and EV batteries qualify for standard **18% or 28% GST Input Tax Credit**, allowing registered enterprises to offset taxes on fleet maintenance."
        )

    def _synthesize_garage_vin(self) -> str:
        return (
            "### 🏍️ My Garage & 17-Digit VIN Compatibility Engine\n\n"
            "**My Garage** is your personalized automotive hub inside Riderzpro, ensuring you never purchase an incompatible part:\n\n"
            "#### 1. Automated 17-Digit VIN Decoding\n"
            "- Enter your vehicle chassis number (17-character VIN) in **My Garage** or through the *Add Vehicle* modal.\n"
            "- Our deterministic decoding engine reads the World Manufacturer Identifier (WMI) and model year code:\n"
            "  - Instantly verifies vehicle make, model, nominal battery voltage (48V, 60V, 72V), and connector pinouts.\n"
            "  - Automatically filters the entire store so you only see **100% Verified Compatible Parts**.\n\n"
            "#### 2. Digital Garage Features\n"
            "- **Vehicle Specs at a Glance**: View nominal system voltage, battery capacity (kWh), real-world range, and tire pressure recommendations.\n"
            "- **Digital Warranty Vault**: Access zero-depreciation warranty certificates issued for your batteries and electronics without keeping physical paperwork.\n"
            "- **Service & Diagnostic History**: Track technician visit records, cell impedance logs, and scheduled maintenance checklists."
        )

    def _synthesize_polite_response(self) -> str:
        return (
            "### You're very welcome! ⚡\n\n"
            "I'm always here to help you get the best performance, safety, and guaranteed fitment for your vehicle.\n\n"
            "If you need anything else — whether it's battery specifications, vehicle accessories, installation bookings, or order updates — feel free to ask anytime! Have a great and safe ride! 🚗🏍️"
        )

    def _synthesize_overvoltage_warning(
        self,
        query: str,
        matched_bike: Optional[Dict[str, Any]],
        fitment_data: Optional[Dict[str, Any]]
    ) -> str:
        v_name = f"{matched_bike['brand']} {matched_bike['model']}" if matched_bike else "your EV"
        v_nom = f"{matched_bike['nominal_voltage']}V" if matched_bike else "48V/60V"

        lines = [
            f"### ⚠️ Electrical Safety Notice: Voltage Incompatibility Detected\n",
            f"**A 72V battery cannot be safely installed in {v_name} ({v_nom} architecture).**\n",
            f"#### Technical Reason for Incompatibility:",
            f"- **Motor Controller MOSFET Breakdown**: A 48V motor controller uses MOSFET switches rated up to ~60V–63V. A 72V battery charges up to **84.0V peak**, causing instant avalanche breakdown, blowing the power stage, and creating severe fire risks.",
            f"- **Telematics & DC-DC Burnout**: Overvoltage permanently destroys the 12V DC-DC converter, digital instrument cluster, and CAN-bus telematics, completely voiding insurance and vehicle warranty.\n",
            f"### 🔋 Certified Safe Replacement Packs for {v_name}:"
        ]

        if matched_bike and fitment_data and fitment_data.get("status") == "success":
            batteries = fitment_data.get("compatible_batteries", [])
            if batteries:
                for b in batteries:
                    eff_price = b.get("effective_price_with_rebate", b["price"] - 2500)
                    lines.append(
                        f"- **{b['name']}** ({b['chemistry']}): **{b['kwh']} kWh** ({b['range_km']} km claimed range). "
                        f"**₹{b['price']:,}** *(₹{eff_price:,} after ₹2,500 exchange rebate)* | **{b['warranty_months']} Months Warranty**"
                    )

            lines.extend([
                f"\n#### 👨‍🔧 Certified Installation Options:",
                f"- 🏠 **Doorstep Home Visit (+₹499)**: Certified technician arrives with high-voltage diagnostic equipment and performs a full 6-step checklist.",
                f"- 🏬 **Service Center Slot (+₹299)**: Reserved bay at a certified Riderzpro partner.",
                f"- 🛡️ **Instant Digital Warranty**: Activated immediately upon technician sign-off."
            ])
        return "\n".join(lines)

    def _synthesize_vehicle_fitment(
        self,
        matched_bike: Dict[str, Any],
        fitment_data: Dict[str, Any],
        safety_advisories: List[str]
    ) -> str:
        v = fitment_data["matched_vehicle"]
        batteries = fitment_data.get("compatible_batteries", [])
        parts = fitment_data.get("compatible_parts", [])

        lines = [
            f"### ⚡ Guaranteed Fitment: {v['brand']} {v['model']}\n",
            f"**Verified Electrical Architecture:**",
            f"- **Nominal System Voltage**: `{v['nominal_voltage']}V` (Operating range: `{v.get('voltage_range', 'OEM standard')}`)",
            f"- **Connector Standard**: `{v.get('connector_type', 'Standard DC Plug')}`",
            f"- **Drive Type**: `{v.get('drive_type', 'BLDC Hub Motor')}`",
            f"- **Certification**: AIS-156 Phase 2 Certified\n",
            "#### 🔋 Certified Replacement Battery Packs:"
        ]

        if batteries:
            for b in batteries:
                eff_price = b.get("effective_price_with_rebate", b["price"] - 2500)
                lines.append(
                    f"- **{b['name']}** ({b['chemistry']}): **{b['kwh']} kWh** ({b['range_km']} km claimed range). "
                    f"**₹{b['price']:,}** *(Effective price after ₹2,500 exchange rebate: **₹{eff_price:,}**)* | "
                    f"**{b['warranty_months']} Months Warranty**"
                )
        else:
            lines.append("- *No direct OEM pack listed; universal compatible packs available upon technician audit.*")

        if parts:
            lines.append("\n#### 🛠️ Certified Compatible Spare Parts & Upgrades:")
            for p in parts[:3]:
                lines.append(
                    f"- **{p['name']}**: {p.get('specs', 'OEM Spec')} — **₹{p['price']:,}** ({p.get('warranty_months', 12)} mo warranty)"
                )

        lines.extend([
            "\n#### 👨‍🔧 Installation Options:",
            "- 🏠 **Doorstep Home Visit (+₹499)**: Certified technician arrives with high-voltage testing equipment and performs a full 6-step diagnostic checklist.",
            "- 🏬 **Service Center Slot (+₹299)**: Reserved bay at a certified Riderzpro partner.",
            "- 🛡️ **Instant Digital Warranty**: Activated immediately upon technician sign-off."
        ])

        return "\n".join(lines)

    def _synthesize_catalog_products(
        self,
        products: List[Dict[str, Any]],
        query: str
    ) -> str:
        lines = [
            "### 🧰 Riderzpro Official Product Catalogue Matches\n",
            "Here are verified items from our official master catalogue matching your query:\n\n",
            "| Product | Brand & Code | Category | Price (Incl. GST) | Fitment | Installation | Warranty |",
            "| :--- | :--- | :--- | :--- | :--- | :--- | :--- |"
        ]

        for p in products[:6]:
            code = p.get("id") or p.get("sku_code", "RZP")
            brand = p.get("brand") or "Riderzpro"
            name = p.get("name", "Product")
            cat = p.get("category") or p.get("sub_category") or p.get("department") or "Accessories"
            price = p.get("price") or p.get("selling_price") or p.get("mrp")
            mrp = p.get("mrp")
            price_str = f"**₹{price:,}**" if price else "Contact"
            if mrp and price and mrp > price:
                pct = int(round((1 - price / mrp) * 100))
                price_str += f" `({pct}% off)`"

            fits = p.get("fits") or p.get("fitment") or "Universal"
            if len(fits) > 28:
                fits = fits[:25] + "..."

            fee = p.get("installation_fee")
            install_str = "Free Garage Fit" if (fee == 0 or fee is None) else f"₹{fee:,}"
            warranty = p.get("warranty") or "1 Year"

            lines.append(f"| **{name}** | {brand} (`{code}`) | {cat} | {price_str} | {fits} | {install_str} | {warranty} |")

        lines.append("\n#### 🔍 Detailed Item Specifications:")
        for i, p in enumerate(products[:3], 1):
            code = p.get("id") or p.get("sku_code", "RZP")
            brand = p.get("brand") or "Riderzpro"
            name = p.get("name", "Product")
            summary = p.get("summary") or p.get("features") or "High-durability OEM certified component."
            highlights = p.get("highlights", [])
            page = p.get("product_page") or "https://riderzpro.com/shop"

            lines.append(f"\n**{i}. [{code}] {name}** — *{brand}*")
            lines.append(f"- **Summary**: {summary}")
            if highlights:
                lines.append(f"- **Highlights**: {' • '.join(highlights[:3])}")
            lines.append(f"- **Fitment**: `{p.get('fits') or p.get('fitment') or 'Universal'}`")
            lines.append(f"- **Product Link**: [{name} Details]({page})")

        lines.extend([
            "\n*All products include free partner garage fitting or transparent labor rates, express delivery (2–4 days), and our 100% Guaranteed Fitment Promise.*"
        ])
        return "\n".join(lines)

    def _synthesize_general_support(
        self,
        query: str,
        web_results: List[Dict[str, str]],
        safety_advisories: List[str]
    ) -> str:
        lines = [
            "### ⚡ Volt — Riderzpro Automotive & EV Specialist\n",
            "I provide certified engineering intelligence and guaranteed fitment recommendations across our master catalogue of **350+ automotive accessories** and **116+ electric two-wheelers**.\n",
            "#### How I Can Assist You:",
            "- **🚗 4-Wheelers & SUVs**: Custom 9D TPE & 7D luxury mats, laser-cut leatherette seat covers, 64-colour concealed ambient lighting, and off-road armour for Thar, Creta, Scorpio N, Fortuner, etc.",
            "- **🔊 Car Audio Systems**: High-efficiency Class-D amplifiers (RECOIL), German Android head units & DSP sound processors (Blaupunkt).",
            "- **🔋 EV Two-Wheeler Batteries & Spares**: AIS-156 certified replacement packs for Ather, Ola, Chetak, TVS, Revolt with instant ₹2,500 exchange rebate.",
            "- **👨‍🔧 Certified Installation Network**: 100% FREE Partner Garage fitting on standard items, transparent labor for complex wiring, and doorstep home visits (+₹499).",
            "- **📦 100% Guaranteed Fitment**: 2–4 business days delivery with a 7-day hassle-free return or replacement guarantee.\n"
        ]

        if web_results:
            lines.append("#### 🌐 Technical Research Notes:")
            for r in web_results[:2]:
                lines.append(f"- **{r.get('title')}**: {r.get('snippet')}")

        lines.append(
            "\n*Tell me your car or EV model (e.g. \"Mahindra Thar\", \"Creta\", \"Ather 450X\") or ask about any accessory or audio upgrade!*"
        )
        return "\n".join(lines)

    def _detect_vehicle_in_query(self, query: str) -> Optional[str]:
        q = query.lower()
        ev_2w = ["ather", "ola", "chetak", "iqube", "revolt", "vida", "f77", "ultraviolette"]
        if any(re.search(r'\b' + re.escape(e) + r'\b', q) for e in ev_2w):
            return None
        vehicles = sorted(catalog_db.master_vehicle_index.keys(), key=len, reverse=True)
        for v in vehicles:
            if v == "universal" or len(v) < 3:
                continue
            pattern = r'\b' + re.escape(v) + r'\b'
            if re.search(pattern, q):
                return v
        return None

    def _detect_brand_in_query(self, query: str) -> Optional[str]:
        q = query.lower()
        for b in ["recoil", "blaupunkt", "autoform", "riderzpro"]:
            if re.search(r'\b' + re.escape(b) + r'\b', q):
                return b
        return None

    def _is_mat_comparison_query(self, q: str) -> bool:
        triggers = [
            "7d vs 9d", "9d vs 7d", "7d or 9d", "9d or 7d",
            "difference between 7d and 9d", "difference between 9d and 7d",
            "compare 7d and 9d", "compare 9d and 7d",
            "7d mat vs 9d mat", "7d mats vs 9d mats", "which floor mat is better"
        ]
        return any(t in q for t in triggers)

    def _is_audio_guidance_query(self, q: str) -> bool:
        triggers = [
            "how to choose an amplifier", "class d vs class ab", "class-d vs class-ab",
            "car audio setup", "subwoofer wiring", "mono vs 4 channel", "4-channel vs mono",
            "amplifier guide", "audio upgrade guide", "car audio engineering"
        ]
        return any(t in q for t in triggers)

    def _is_installation_support_query(self, q: str) -> bool:
        patterns = [
            r"do you provide (installation|fitting)",
            r"is (garage|partner)?\s*fitting free",
            r"how (does|is) installation (work|done|handled)",
            r"who installs (the|my)?\s*(accessories|parts|products)",
            r"(installation|fitting)\s*(charges|cost|fee|service|support)",
            r"can you install at (my)?\s*home",
            r"doorstep (installation|fitting|visit)"
        ]
        return any(re.search(p, q) for p in patterns)

    def _is_delivery_support_query(self, q: str) -> bool:
        patterns = [
            r"how (long|many days) (does|will)?\s*(delivery|shipping) take",
            r"(delivery|shipping)\s*(time|duration|charges|fee|policy|timeline|speed|schedule)",
            r"shipping charges",
            r"free delivery",
            r"express delivery"
        ]
        return any(re.search(p, q) for p in patterns)

    def _is_payment_query(self, q: str) -> bool:
        patterns = [
            r"payment (method|methods|option|options|mode|modes|gateway|terms)",
            r"how (can|do) i pay",
            r"methods? of payment",
            r"accept.*(upi|gpay|google pay|phonepe|paytm|credit card|debit card|cod|cash on delivery|emi)",
            r"\b(cod|cash on delivery|pay on delivery)\b",
            r"\b(emi|no cost emi|instalment|installment)\b",
            r"accept.*(card|cards|upi)",
            r"what payment",
            r"pay via",
            r"pay with"
        ]
        return any(re.search(p, q) for p in patterns)

    def _is_order_tracking_query(self, q: str) -> bool:
        patterns = [
            r"(how|where) (can|do) i track (my)?\s*(order|package|delivery|shipment)",
            r"track (my)?\s*(order|package|shipment|delivery)",
            r"order (tracking|status|location|update)",
            r"where is my (order|package|item|shipment|battery|part)",
            r"tracking (link|number|id|awb|details)",
            r"status of my order",
            r"dispatch status"
        ]
        return any(re.search(p, q) for p in patterns)

    def _is_return_refund_query(self, q: str) -> bool:
        patterns = [
            r"(return|refund|replacement|replace|exchange)\s*(policy|rules|process|timeline|guarantee)",
            r"how (can|do) i (return|refund|replace|exchange)",
            r"what (is|are) (your|the)?\s*(return|refund|replacement) policy",
            r"can i (return|replace|exchange|refund)",
            r"what if (it|the part|the battery) (does not|doesn't) fit",
            r"wrong (item|part|product|battery) received",
            r"defective (item|product|part|battery)",
            r"how (long|many days) (for|to get) refund"
        ]
        return any(re.search(p, q) for p in patterns)

    def _is_contact_support_query(self, q: str) -> bool:
        q_low = q.lower().strip()

        # If it's explicitly a vehicle part/accessory containing "support", do not treat as support desk
        if any(term in q_low for term in ["lumbar", "back support", "seat support", "cushion", "bracket", "mount support", "engine support"]):
            return False

        # Tokenize words
        words = set(re.split(r'\W+', q_low))

        # Direct token checks for agent/human/support
        human_agent_tokens = {"agent", "human", "representative", "executive", "operator", "helpline", "helpdesk", "hotline", "escalate", "escalation", "complaint", "callcenter"}
        if any(tok in words for tok in human_agent_tokens):
            return True

        # Support token when not referring to product
        if "support" in words and not any(w in words for w in ["lumbar", "cushion", "bracket", "mat", "seat"]):
            return True

        # General help phrases
        if q_low in ["help", "help me", "i need help", "need help", "assist", "assistance", "support", "i need support", "human", "agent", "human agent"]:
            return True

        patterns = [
            r"\b(contact|talk to|speak to|speak with|connect (me )?to|reach|call)\b.*(human|agent|person|someone|representative|executive|support|team|desk|care)",
            r"\b(i\s+)?(need|want|get|require)\b.*(human|agent|person|someone|representative|executive|support|help|assistance)",
            r"\b(human|live|real)\s*(agent|person|support|help|executive|representative|assistance)\b",
            r"(how (can|do) i|how to)?\s*contact (customer)?\s*(support|care|service|team|help)",
            r"(customer|support)?\s*(helpline|phone number|toll free|contact number|call support)",
            r"(emergency|roadside|rsa|towing|breakdown)\s*(assistance|support|number|sos|helpline)",
            r"(what is|give me|share)?\s*(your|the)?\s*(support|customer care)?\s*(email|number|phone)",
            r"talk to (a|an)?\s*(human|agent|executive|representative|person)",
            r"speak with (customer)?\s*(care|support)",
            r"call customer care",
            r"customer (care|service|support|help)",
            r"\b(helpline|hotline|helpdesk)\b"
        ]
        return any(re.search(p, q_low) for p in patterns)

    def _is_cancellation_query(self, q: str) -> bool:
        patterns = [
            r"cancel\s*(it|this|my order|the order)?",
            r"can\s*i\s*cancel\s*(it|this|my order|the order)?",
            r"(how (can|do) i|how to)?\s*cancel",
            r"order cancellation (policy|process|charges)?",
            r"change (my)?\s*(delivery|shipping)?\s*address",
            r"modify (my)?\s*order",
            r"\bcancel\b",
            r"\bcancellation\b"
        ]
        return any(re.search(p, q) for p in patterns)

    def _is_warranty_query(self, q: str) -> bool:
        patterns = [
            r"(how (can|do) i|how to)?\s*claim (the|my)?\s*warranty",
            r"warranty (claim|process|policy|period|coverage|details|tenure|duration|guarantee)",
            r"is there (any)?\s*warranty",
            r"how (long|much) is (the)?\s*warranty",
            r"digital warranty (certificate)?",
            r"warranty on (batteries|parts|chargers|accessories)"
        ]
        return any(re.search(p, q) for p in patterns)

    def _is_store_locations_query(self, q: str) -> bool:
        patterns = [
            r"(where (are|is)|do you have)\s*(your)?\s*(stores?|shops?|hubs?|branches?|service centers?|dealers?)",
            r"(store|hub|workshop|service center|dealer)\s*(locations?|address|network|near me)",
            r"where are you located",
            r"(offline|physical)\s*(store|presence|hub)"
        ]
        return any(re.search(p, q) for p in patterns)

    def _is_invoice_gst_query(self, q: str) -> bool:
        patterns = [
            r"(gst|tax|commercial|b2b)\s*(invoice|bill|receipt|credit)",
            r"can i get (a)?\s*(gst|tax)?\s*invoice",
            r"how (can|do) i download (the|my)?\s*invoice",
            r"input tax credit"
        ]
        return any(re.search(p, q) for p in patterns)

    def _is_garage_vin_query(self, q: str) -> bool:
        patterns = [
            r"how (can|do) i (add|register) (my)?\s*(bike|scooter|vehicle|car)",
            r"my garage (feature|section|tab)?",
            r"vin (decoder|number|search|lookup)",
            r"17[\s-]digit vin",
            r"chassis number"
        ]
        return any(re.search(p, q) for p in patterns)

    def _is_polite_or_gratitude(self, q: str) -> bool:
        patterns = [
            r"thank\s*(you|u)",
            r"\b(thanks|thx|many thanks|appreciate it|great job|great help|awesome|perfect|ok thanks|okay thanks)\b",
            r"\b(bye|goodbye|see you|good night)\b"
        ]
        return any(re.search(p, q) for p in patterns)

    def _is_pure_support_intent(self, q: str) -> bool:
        q_low = q.lower().strip()
        return (
            self._is_contact_support_query(q_low)
            or self._is_payment_query(q_low)
            or self._is_order_tracking_query(q_low)
            or self._is_return_refund_query(q_low)
            or self._is_cancellation_query(q_low)
            or self._is_warranty_query(q_low)
            or self._is_store_locations_query(q_low)
            or self._is_invoice_gst_query(q_low)
            or self._is_garage_vin_query(q_low)
            or self._is_about_riderzpro_query(q_low)
            or self._is_installation_support_query(q_low)
            or self._is_delivery_support_query(q_low)
            or self._is_polite_or_gratitude(q_low)
        )

    def _synthesize_vehicle_accessories(
        self,
        vehicle_name: str,
        products: List[Dict[str, Any]],
        query: str
    ) -> str:
        v_title = vehicle_name.title()

        # Prioritize products matching specific intent keywords in the user query
        q_low = query.lower()
        scored_products = []
        for p in products:
            relevance = 0
            cat_low = (p.get("category") or "").lower()
            dept_low = (p.get("department") or "").lower()
            name_low = (p.get("name") or "").lower()
            fits_low = (p.get("fits") or "").lower()

            for kw in ["mat", "mats", "seat", "cover", "covers", "ambient", "light", "lighting", "fog", "audio", "speaker", "amplifier", "winch", "step", "steps", "sunshade", "sunshades", "body kit"]:
                if kw in q_low:
                    if kw in name_low:
                        relevance += 40
                    if kw in cat_low or kw in dept_low:
                        relevance += 30

            scored_products.append((relevance, p))

        scored_products.sort(key=lambda x: x[0], reverse=True)
        ranked_products = [p for _, p in scored_products]

        lines = [
            f"### 🚗 Guaranteed Fitment & Upgrades: {v_title}\n",
            f"Riderzpro engineers laser-measured, custom-tailored accessories and electronics specifically designed for the **{v_title}**. "
            f"All components feature 100% precision fitment, zero wire-slicing on electrical upgrades, and comprehensive warranty coverage.\n",
            "#### 📊 Verified Compatible Upgrades:\n",
            "| Product | Brand & Code | Category | Price (Incl. GST) | MRP (Savings) | Installation | Warranty |",
            "| :--- | :--- | :--- | :--- | :--- | :--- | :--- |"
        ]

        for p in ranked_products[:8]:
            code = p.get("id") or p.get("sku_code", "RZP")
            brand = p.get("brand") or "Riderzpro"
            name = p.get("name", "Accessory")
            cat = p.get("category") or p.get("department") or "Interior"
            price = p.get("price") or p.get("selling_price")
            mrp = p.get("mrp")
            price_str = f"**₹{price:,}**" if price else "Contact"
            mrp_str = f"~~₹{mrp:,}~~" if mrp else ""
            if mrp and price and mrp > price:
                pct = int(round((1 - price / mrp) * 100))
                mrp_str += f" `({pct}% off)`"

            fee = p.get("installation_fee")
            time_est = p.get("install_time", "30 mins")
            if fee == 0 or fee is None:
                install_str = "Free Garage Fit"
            else:
                install_str = f"₹{fee:,} ({time_est})"

            warranty_str = p.get("warranty") or "1 Year"
            lines.append(f"| **{name}** | {brand} (`{code}`) | {cat} | {price_str} | {mrp_str} | {install_str} | {warranty_str} |")

        lines.append(f"\n#### 🔍 Top Recommended Upgrades for {v_title}:")
        for i, p in enumerate(ranked_products[:3], 1):
            code = p.get("id") or p.get("sku_code", "RZP")
            brand = p.get("brand") or "Riderzpro"
            name = p.get("name")
            summary = p.get("summary") or "OEM-grade engineered custom component."
            highlights = p.get("highlights", [])
            specs = p.get("specifications", {})
            page = p.get("product_page") or "https://riderzpro.com/shop"

            lines.append(f"\n**{i}. [{code}] {name}** — *{brand}*")
            lines.append(f"- **Overview**: {summary}")
            if highlights:
                lines.append(f"- **Key Highlights**: {' • '.join(highlights[:3])}")
            if specs and isinstance(specs, dict):
                spec_items = [f"{k}: `{v}`" for k, v in list(specs.items())[:3]]
                lines.append(f"- **Technical Specs**: {' | '.join(spec_items)}")
            lines.append(f"- **Direct Product Link**: [{name} Details]({page})")

        lines.extend([
            f"\n#### 👨‍🔧 Installation & Delivery Assurance for {v_title}:",
            "- 🏬 **100% FREE Partner Garage Fitting**: Available on all floor mats, seat covers, and body accessories across 450+ Riderzpro partner hubs in India.",
            "- ⚡ **Coupler-to-Coupler Wiring**: Ambient lighting and audio systems are installed using OEM-standard coupler harnesses without cutting factory wires, preserving vehicle warranty.",
            "- 🏠 **Doorstep Installation Option (+₹499)**: Professional technician arrives at your home or workplace in 28+ metro cities.",
            "- 📦 **100% Guaranteed Fitment Promise**: 7-day hassle-free replacement or return if fitment is not 100% factory flush."
        ])

        return "\n".join(lines)

    def _synthesize_mat_comparison(self, query: str) -> str:
        return (
            "### 🛡️ Riderzpro Floor Mat Engineering: 7D Luxury vs 9D All-Weather TPE\n\n"
            "Choosing the right floor mats protects your vehicle carpet from permanent stain damage, monsoon mud, and moisture rust. "
            "Here is an engineering comparison between **Riderzpro 7D Luxury Mats** and **Riderzpro 9D Injection-Molded TPE Mats**:\n\n"
            "#### 📊 Technical & Performance Matrix:\n\n"
            "| Parameter | 7D Luxury Floor Mats (`RZP-0002`) | 9D All-Weather TPE Mats (`RZP-0003`) |\n"
            "| :--- | :--- | :--- |\n"
            "| **Material Architecture** | Multi-Layer Stitched PU Leatherette + High-Density EVA foam | **100% Vulcanized Automotive TPE (Thermoplastic Elastomer)** |\n"
            "| **Manufacturing Method** | Hand-stitched quilted diamond layers with edge piping | **3D Laser-Scanned High-Pressure Injection Molded (Single-Piece)** |\n"
            "| **Spill Containment Lip** | 25 mm – 30 mm raised edge | **45 mm Ultra-Deep Raised Wall** (holds up to 2.5L liquid) |\n"
            "| **Water & Mud Resistance** | Water-resistant surface (seams can trap dampness over time) | **100% Impermeable Monolithic Barrier** (Zero fluid penetration) |\n"
            "| **Cleaning & Maintenance** | Requires vacuuming and damp microfiber towel wiping | **Direct High-Pressure Hose Wash** (Dries in under 2 minutes) |\n"
            "| **Odour & Thermal Limits** | Mild synthetic aroma in first 48 hours | **100% Odorless & Non-Toxic** (stable from -40°C to +75°C summer heat) |\n"
            "| **Floor Anchor Security** | Anti-skid velcro base backing with side clips | **OEM Twist-Lock Retention Clip Sockets** + anti-slide bottom micro-nibs |\n"
            "| **Endurance & Lifespan** | 2 to 3 years under regular commuter usage | **5+ Years Extreme Endurance** (Resists heel scuffing, curling, and cracking) |\n"
            "| **Selling Price (Incl. GST)** | **₹2,999** ~~(MRP ₹4,999 — Save 40%)~~ | **₹4,499** ~~(MRP ₹6,999 — Save 36%)~~ |\n"
            "| **Warranty Coverage** | 1 Year Stitching & Material Warranty | **3 Years Comprehensive Anti-Crack Warranty** |\n\n"
            "#### 🎯 Recommendation Based on Driving Profile:\n\n"
            "1. **Choose 7D Luxury Floor Mats (`RZP-0002`) If:**\n"
            "   - You prioritize plush executive cabin aesthetics, diamond-stitched leatherette, and comfortable cushioned heel rest.\n"
            "   - Your driving is primarily dry city commutes and highway cruising with low dust/mud exposure.\n\n"
            "2. **Choose 9D All-Weather TPE Mats (`RZP-0003`) If:**\n"
            "   - You drive an SUV or off-roader (Thar, Scorpio N, Creta, Seltos, Fortuner) frequently exposed to rain, monsoon mud, sand, or snow.\n"
            "   - You have pets, children, or outdoor lifestyle gear and want hose-down cleanability with zero carpet odor.\n\n"
            "#### 👨‍🔧 Installation & Fitment Promise:\n"
            "- **100% FREE Partner Garage Fitting** across 450+ Riderzpro certified partner hubs in India (DIY takes under 10 minutes).\n"
            "- Backed by Riderzpro's **100% Guaranteed Fitment Promise** with 7-day hassle-free exchange."
        )

    def _synthesize_audio_guidance(self, query: str) -> str:
        return (
            "### 🔊 Riderzpro Car Audio & Amplifier Engineering Guide\n\n"
            "Upgrading your vehicle audio requires understanding power distribution, amplifier topology, and acoustic staging. "
            "Here is our engineering guidance backed by our official **RECOIL** and **Blaupunkt** product lineup:\n\n"
            "#### 1. Why Class-D Digital Amplifiers Are Standard in Modern Vehicles\n"
            "- **90%+ Electrical Efficiency**: Traditional Class-AB amplifiers run at ~50% efficiency, converting half their power into heat and heavily loading the vehicle alternator. Class-D digital switching topology operates above 90% efficiency.\n"
            "- **Compact Chassis for Under-Seat Mounting**: Generates minimal heat, allowing placement under the driver or passenger seat in SUVs (Thar, Creta, Scorpio N) without thermal cut-off.\n"
            "- **Low Voltage Sag Tolerance**: Engineered to maintain steady RMS output even during start-stop engine restarts.\n\n"
            "#### 2. Featured Amplifier Lineup on Riderzpro:\n\n"
            "| Model | Brand | Channels & Power | Key Application | Price (Incl. GST) |\n"
            "| :--- | :--- | :--- | :--- | :--- |\n"
            "| **4-Channel RMS 1200W** (`RZP-0040`) | RECOIL | 4 x 300W RMS @ 2Ω / Bridgeable | Premium 4-door coaxial/component cabin speaker upgrade | **₹27,000** |\n"
            "| **1200W Class-D 6-Channel Marine** (`RZP-0038`) | RECOIL | 6-Channel High-Current (IP65 Conformal Coated) | Open-top SUVs (Thar), marine audio, front + rear + sub staging | **₹32,400** |\n"
            "| **1600W Class-D 8-Channel Marine** (`RZP-0039`) | RECOIL | 8-Channel Multi-Zone Digital Power Stage | Full active 3-way component staging + subwoofer | **₹40,500** |\n"
            "| **ODx 2.100D Digital Power** (`RZP-0335`) | Blaupunkt | 2 x 100W RMS Compact High-Fidelity | Compact 2-speaker or bridged mono bass upgrade | **₹10,350** |\n"
            "| **ODx 4.100D 4-Channel** (`RZP-0336`) | Blaupunkt | 4 x 100W RMS Ultra-Clean Stage | Factory head unit integration with low-level inputs | **₹12,590** |\n\n"
            "#### 3. Critical Installation & Wiring Rules:\n"
            "1. **100% Oxygen-Free Copper (OFC)**: Never use cheap Copper-Clad Aluminum (CCA). For 1000W+ systems, always use 4 AWG OFC power and ground cables to prevent voltage drop and fire risk.\n"
            "2. **Inline ANL Fusing**: Mount an inline fuse within 18 inches of the vehicle battery terminal to protect factory wiring against short circuits.\n"
            "3. **Coupler-to-Coupler DSP Integration**: When retaining the factory touchscreen, use plug-and-play T-harnesses to protect OEM electrical warranties.\n\n"
            "#### 👨‍🔧 Professional Audio Installation:\n"
            "- Fixed labor rates of **₹1,500 to ₹2,500** at 450+ Riderzpro Certified Partner Hubs.\n"
            "- Calibrated oscilloscope gain setting to prevent speaker clipping and distortion."
        )

    def _synthesize_brand_showcase(
        self,
        brand: str,
        products: List[Dict[str, Any]],
        query: str
    ) -> str:
        b_title = brand.title()
        brand_bios = {
            "recoil": "RECOIL is a world-renowned car and marine audio engineering brand known for ultra-high-efficiency Class-D digital amplifiers, marine IP65 conformal-coated circuits, and audiophile-grade high-current sound reproduction.",
            "blaupunkt": "Blaupunkt represents over 90 years of German automotive audio and multimedia heritage, specializing in high-fidelity digital amplifiers, touchscreen Android head units, and DSP processors.",
            "autoform": "Autoform is India's leading automotive seating and comfort brand, producing OEM-grade custom leatherette seat covers, ergonomic lumbar supports, and cervical neck rests with ISO-certified precision.",
            "riderzpro": "Riderzpro is our flagship engineering brand, producing laser-scanned 9D TPE floor mats, 64-colour concealed ambient lighting, off-road armour, and heavy-duty SUV accessories."
        }
        bio = brand_bios.get(brand.lower(), f"{b_title} is an authorized, certified brand on the Riderzpro marketplace.")

        lines = [
            f"### 🏆 Official Brand Showcase: {b_title}\n",
            f"{bio}\n",
            f"#### 📊 Featured {b_title} Catalog Highlights:\n",
            "| Product Name | Product ID | Category | Price (Incl. GST) | Fitment | Warranty |",
            "| :--- | :--- | :--- | :--- | :--- | :--- |"
        ]

        for p in products[:8]:
            code = p.get("id") or p.get("sku_code", "RZP")
            name = p.get("name", "Product")
            cat = p.get("category") or p.get("department") or "Accessories"
            price = p.get("price") or p.get("selling_price")
            price_str = f"**₹{price:,}**" if price else "Contact"
            fits = p.get("fits") or p.get("fitment") or "Universal"
            if len(fits) > 30:
                fits = fits[:27] + "..."
            warranty = p.get("warranty") or "1 Year"
            lines.append(f"| **{name}** | `{code}` | {cat} | {price_str} | {fits} | {warranty} |")

        lines.extend([
            f"\n#### 🛡️ The Riderzpro Brand Guarantee for {b_title}:",
            "- **100% Genuine OEM Sourced**: Direct manufacturer distribution with verified serial numbers and digital warranty.",
            "- **Free Garage Installation**: Standard accessories installed free at 450+ partner garages.",
            "- **100% Guaranteed Fitment**: 7-day hassle-free return or replacement if not perfectly compatible."
        ])

        return "\n".join(lines)

    def _synthesize_installation_support(self, query: str) -> str:
        return (
            "### 👨‍🔧 Riderzpro Certified Installation Network\n\n"
            "Riderzpro provides professional, warranty-safe installation services across India through our certified network of 450+ partner garages and doorstep technicians.\n\n"
            "#### 1. 100% FREE Partner Garage Installation\n"
            "Standard vehicle accessories are installed **completely FREE** at any authorized Riderzpro Partner Hub upon delivery:\n"
            "- **7D Luxury & 9D TPE Floor Mats** (`RZP-0002`, `RZP-0003`)\n"
            "- **Custom Leatherette Seat Covers** (`RZP-0004`)\n"
            "- **Magnetic Window Sunshades & Door Visors**\n"
            "- **All-Weather Body Covers & Mud Flaps**\n\n"
            "#### 2. Fixed-Rate Certified Electrical & Performance Labor\n"
            "Complex electrical upgrades require skilled auto-electricians to ensure zero electrical load issues and preserve OEM factory warranties. We maintain fixed, transparent labor rates:\n\n"
            "| Upgrade Category | Labor Fee | Install Duration | Engineering Standard |\n"
            "| :--- | :--- | :--- | :--- |\n"
            "| **64-Colour Concealed Ambient Lighting** (`RZP-0001`) | **₹2,500** | 4–5 Hours | Concealed fiber-optics routed behind door cards and dash trim; relay-switched and ignition-linked |\n"
            "| **Multimedia Touchscreens & Head Units** | **₹1,500** | 2–3 Hours | Plug-and-play OEM coupler harness; zero factory wire slicing |\n"
            "| **Car Audio Amplifiers & Subwoofers** (`RZP-0038`, `RZP-0040`) | **₹1,500 – ₹2,000** | 2–3 Hours | 4 AWG OFC power run, inline ANL fused, calibrated oscilloscope gain tuning |\n"
            "| **Off-Road Heavy-Duty Winches & Armour** (`RZP-0025`) | **₹2,500** | 3–4 Hours | Chassis bracket torque calibration, high-current isolation switch |\n\n"
            "#### 3. 🏠 Doorstep Home Installation Option (+₹499)\n"
            "- Available across 28+ metro cities in India.\n"
            "- A certified technician arrives at your home or workplace with full tools and diagnostic kits.\n\n"
            "#### 🛡️ Vehicle Warranty Protection Guarantee:\n"
            "All Riderzpro installations use **coupler-to-coupler (T-harness) plug-and-play wiring** without cutting or splicing OEM vehicle wires, keeping your manufacturer warranty and insurance 100% intact."
        )

    def _synthesize_delivery_support(self, query: str) -> str:
        return (
            "### 📦 Shipping, Delivery & 100% Guaranteed Fitment Promise\n\n"
            "Riderzpro operates a pan-India fulfillment logistics network delivering to over 19,000 postal codes:\n\n"
            "#### 1. Express Shipping Benchmarks\n"
            "- **Ready-to-Ship Accessories**: **2 to 4 business days** nationwide via BlueDart and Delhivery Express Air.\n"
            "- **Custom-Tailored Items (Laser-Cut Seat Covers)**: **5 to 7 business days** (custom-manufactured to your exact car variant and trim, dispatched straight from ISO-certified production).\n"
            "- **Free Shipping**: Orders above **₹1,999** receive free express delivery across India.\n\n"
            "#### 2. Real-Time Order Tracking\n"
            "- Receive an instant live tracking link via SMS and WhatsApp as soon as your package is dispatched from our fulfillment hub.\n"
            "- Track courier location, estimated delivery time, and dispatch status in your *My Garage* dashboard.\n\n"
            "#### 3. 🛡️ 100% Guaranteed Fitment Promise\n"
            "- **7-Day Hassle-Free Returns**: If any product does not fit your car or two-wheeler with 100% flush factory precision, we provide a free reverse pickup and instant replacement or full refund.\n"
            "- **Zero Restocking Fees**: If our fitment recommendation was incorrect, we bear all return logistics costs."
        )

    # ==========================================================================
    # Smart Intent Detection & Synthesizers
    # ==========================================================================
    def _is_smartness_meta_query(self, q: str) -> bool:
        triggers = [
            "can the model be anymore smarter", "can the model be smarter",
            "can you be smarter", "how smart are you", "are you smart",
            "can volt be smarter", "can you be more intelligent", "how intelligent are you"
        ]
        return any(t in q for t in triggers)

    def _synthesize_smartness_overview(self) -> str:
        return (
            "### ⚡ Volt — Advanced Automotive AI Engine\n\n"
            "I am engineered specifically as an autonomous, high-speed domain specialist for automotive accessories, 4-wheeler/SUV upgrades, car audio engineering, and electric two-wheelers across India. Here is my operational scope with verified precision:\n\n"
            "#### 🧠 Core Intelligence Capabilities:\n"
            "- **🚗 350+ Item Official Master Catalogue**: Instant deterministic lookup of 9D TPE floor mats, 7D luxury mats, 64-colour concealed ambient lighting, Autoform seat covers, and RECOIL/Blaupunkt car audio with exact pricing, fitments, and warranty.\n"
            "- **🔍 30+ 4-Wheeler & SUV Precision Fitments**: Guaranteed compatibility matching for Mahindra Thar, Thar Roxx, Creta, Seltos, Scorpio N, Fortuner, XUV700, Harrier, Swift, City, Brezza, Nexon, etc.\n"
            "- **🔊 Car Audio Engineering**: In-depth guidance on Class-D amplifier efficiency, 4-channel vs mono sub staging, marine IP65 conformal coating, and 4 AWG OFC power wiring.\n"
            "- **🔋 116-Model EV Two-Wheeler Systems**: Voltage validation (48V–72V), peak busbar limits, and connector pinouts across Ather, Ola, Chetak, TVS, Revolt with ₹2,500 battery exchange rebate.\n"
            "- **👨‍🔧 Certified Installation Network**: 100% FREE Partner Garage fitting on standard items, fixed transparent labor for electrical upgrades, and doorstep home service (+₹499).\n"
            "- **📦 Pan-India Fulfillment & Assurance**: 2–4 days express delivery, 100% Guaranteed Fitment Promise, and 7-day hassle-free returns.\n\n"
            "*Try asking me:*\n"
            "- *\"What accessories do you have for Mahindra Thar?\"*\n"
            "- *\"Difference between 7D and 9D floor mats\"*\n"
            "- *\"Do you provide installation and is garage fitting free?\"*\n"
            "- *\"Tell me about RECOIL amplifiers\"*\n"
            "- *\"Floor mats for Hyundai Creta\"*\n"
            "- *\"Compare Ather 450X and Ola S1 Pro\"*"
        )

    def _is_about_riderzpro_query(self, q: str) -> bool:
        patterns = [
            r"what is (riderzpro|riderz pro)",
            r"about (riderzpro|riderz pro)",
            r"who is (riderzpro|riderz pro)",
            r"why (riderzpro|riderz pro)",
            r"what does (riderzpro|riderz pro) do",
            r"how does (riderzpro|riderz pro) work",
            r"services (offered|provided)?\s*(by|on)?\s*(riderzpro|riderz pro)",
            r"(tell me|know) about (riderzpro|riderz pro)",
            r"what can (riderzpro|riderz pro) do",
            r"^(what is this platform|about this platform|what do you do|what services do you offer)[?.!]?$"
        ]
        return any(re.search(p, q) for p in patterns)

    def _synthesize_about_riderzpro(self) -> str:
        return (
            "### ⚡ Riderzpro — India's Premier Automotive & EV Platform\n\n"
            "**Riderzpro** is an engineering-first ecosystem and marketplace built exclusively for automotive accessories, SUV upgrades, car audio systems, and electric two-wheelers across India.\n\n"
            "We eliminate compatibility guesswork and substandard fitments through four core pillars:\n\n"
            "#### 1. 🔍 Guaranteed Vehicle Fitment Engine\n"
            "- Master database spanning major Indian 4-wheelers (Mahindra Thar, Creta, Seltos, Scorpio N, Fortuner, XUV700, Harrier, Swift, etc.) and **116+ EV two-wheelers** (Ather, Ola, Chetak, TVS, Revolt).\n"
            "- Every accessory is verified for exact 3D laser-scanned dimensions, OEM twist-lock anchors, and factory flush finishes.\n\n"
            "#### 2. 👨‍🔧 Certified Installation Network (450+ Garages)\n"
            "- **100% FREE Partner Garage Fitting**: Floor mats, seat covers, body covers, and sunshades fitted free of charge at authorized hubs upon delivery.\n"
            "- **Fixed Transparent Labor for Electricals**: Concealed ambient lighting (`RZP-0001` at ₹2,500), audio amplifiers, and multimedia head units installed by certified auto-electricians with zero factory wire cutting (preserving vehicle warranty).\n"
            "- **Doorstep Home Service (+₹499)**: Mobile technician visits in 28+ metro cities.\n\n"
            "#### 3. 🏆 Authorized Premium Brand Portfolio\n"
            "- **Riderzpro**: 9D all-weather TPE floor mats, 7D luxury mats, 64-colour concealed ambient lighting, and off-road armour.\n"
            "- **RECOIL**: World-class Class-D marine & automotive amplifiers, subwoofers, and OFC wiring.\n"
            "- **Blaupunkt**: German high-fidelity head units, digital amplifiers, and DSP audio processors.\n"
            "- **Autoform**: OEM-grade ergonomic seat covers, lumbar supports, and cervical neck rests.\n\n"
            "#### 4. 📦 Logistics & 100% Guaranteed Fitment Promise\n"
            "- Express 2–4 business days nationwide delivery via BlueDart and Delhivery.\n"
            "- **7-Day Hassle-Free Returns**: If an item does not fit your car or two-wheeler perfectly, enjoy free return pickup and instant replacement or full refund."
        )

    def _is_vehicle_comparison_query(self, q: str) -> bool:
        comp_triggers = [
            "compare", "comparison", " vs ", " vs. ", " versus ", " v/s ",
            "which is better", "better than", "which one should i buy",
            "which to buy", "difference between"
        ]
        return any(t in f" {q} " for t in comp_triggers)

    def _get_default_rival(self, v: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        b = v.get("brand", "").lower()
        m = v.get("model", "").lower()
        if "ather" in b:
            return self.catalog.find_bike_by_query("ola s1 pro")
        elif "ola" in b:
            return self.catalog.find_bike_by_query("ather 450x")
        elif "chetak" in m or "bajaj" in b:
            return self.catalog.find_bike_by_query("tvs iqube")
        elif "tvs" in b or "iqube" in m:
            return self.catalog.find_bike_by_query("chetak")
        elif "revolt" in b:
            return self.catalog.find_bike_by_query("ather 450x")
        return self.catalog.find_bike_by_query("ather 450x")

    def _match_comparison_profile(self, vehicle: Dict[str, Any]) -> Dict[str, str]:
        b = vehicle.get("brand", "").lower()
        m = vehicle.get("model", "").lower()
        for key, prof in RICH_COMPARISON_PROFILES.items():
            if key in b or key in m:
                return prof

        # Dynamic fallback profile
        v_name = f"{vehicle.get('brand', 'EV')} {vehicle.get('model', 'Model')}"
        nom_v = f"{vehicle.get('nominal_voltage', 48.0)}V"
        return {
            "name": v_name,
            "voltage": f"{nom_v} Nominal ({vehicle.get('voltage_range', 'OEM Spec')})",
            "battery": f"{round(float(vehicle.get('nominal_voltage', 48.0)) * 40 / 1000, 2)} kWh Certified Pack",
            "claimed_range": f"{vehicle.get('claimed_range_km') or 100} km (Claimed)",
            "real_range": f"{int((vehicle.get('claimed_range_km') or 100) * 0.75)} km (Realistic City)",
            "speed_accel": f"{vehicle.get('top_speed_kmh') or 75} km/h Top Speed",
            "powertrain": vehicle.get('drive_type') or 'BLDC Hub Motor',
            "charging": vehicle.get('charging_time') or '4.0 - 5.0 hrs Standard',
            "brakes": "Front Disc / Rear CBS Drum",
            "key_strength": "Reliable daily commuter with standard certified component ecosystem",
            "ideal_rider": "Urban riders seeking reliable everyday transportation and low maintenance."
        }

    def _synthesize_vehicle_comparison(
        self,
        v1: Dict[str, Any],
        v2: Dict[str, Any],
        query: str
    ) -> str:
        p1 = self._match_comparison_profile(v1)
        p2 = self._match_comparison_profile(v2)

        return (
            f"### ⚡ Head-to-Head Comparison: {p1['name']} vs {p2['name']}\n\n"
            f"Here is an engineering and operational comparison between the **{p1['name']}** and the **{p2['name']}** "
            f"across electrical architecture, battery performance, real-world dynamics, and Riderzpro ecosystem support:\n\n"
            f"#### 📊 Engineering & Performance Matrix:\n\n"
            f"| Specification / Feature | {p1['name']} | {p2['name']} |\n"
            f"| :--- | :--- | :--- |\n"
            f"| **Nominal Voltage Architecture** | `{p1['voltage']}` | `{p2['voltage']}` |\n"
            f"| **Battery Capacity & Chemistry** | {p1['battery']} | {p2['battery']} |\n"
            f"| **Claimed Range (ARAI/IDC)** | `{p1['claimed_range']}` | `{p2['claimed_range']}` |\n"
            f"| **Real-World City Range** | **{p1['real_range']}** | **{p2['real_range']}** |\n"
            f"| **Top Speed & Acceleration** | `{p1['speed_accel']}` | `{p2['speed_accel']}` |\n"
            f"| **Motor & Transmission** | {p1['powertrain']} | {p2['powertrain']} |\n"
            f"| **Charging System** | {p1['charging']} | {p2['charging']} |\n"
            f"| **Braking & Safety** | {p1['brakes']} | {p2['brakes']} |\n\n"
            f"#### 🔍 Deep Engineering Assessment:\n"
            f"- **Powertrain & Handling**: {p1['name']} offers {p1['key_strength']}. In comparison, {p2['name']} highlights {p2['key_strength']}.\n"
            f"- **Thermal & Safety Engineering**: Both models incorporate AIS-156 Phase 2 thermal propagation containment. Replaceable battery packs are available with torque-calibrated mounting on Riderzpro.\n\n"
            f"#### 🎯 Rider Persona Recommendation:\n"
            f"- **Choose {p1['name']}**: {p1['ideal_rider']}\n"
            f"- **Choose {p2['name']}**: {p2['ideal_rider']}\n\n"
            f"#### 🛒 Riderzpro Guaranteed Support for Both Models:\n"
            f"- 🔋 **Certified Replacement Batteries**: Available with instant **₹2,500 old battery exchange rebate**.\n"
            f"- 🛠️ **Consumables & Spares**: Smart fast chargers, ceramic low-dust brake pads, and EV low-rolling-resistance tyres.\n"
            f"- 👨‍🔧 **Certified Installation**: Doorstep home visits (+₹499) and service center slots (+₹299) backed by our 6-step diagnostic protocol."
        )

    def _is_battery_chemistry_query(self, q: str) -> bool:
        triggers = [
            "lfp vs nmc", "lifepo4 vs nmc", "difference between lfp and nmc",
            "which battery is better lfp or nmc", "lfp or nmc", "nmc vs lfp",
            "lithium iron phosphate vs nmc", "lfp battery chemistry", "nmc battery chemistry",
            "compare lfp and nmc"
        ]
        return any(t in q for t in triggers)

    def _synthesize_battery_chemistry(self) -> str:
        return (
            "### 🔋 Lithium Battery Chemistry Deep Dive: LFP vs NMC\n\n"
            "In the Indian electric two-wheeler market, the two dominant cathode chemistries are **LFP (Lithium Iron Phosphate / LiFePO₄)** and **NMC (Nickel Manganese Cobalt / LiNiMnCoO₂)**. Here is an in-depth automotive engineering breakdown:\n\n"
            "#### 📊 Engineering Comparison:\n\n"
            "| Parameter | LFP (Lithium Iron Phosphate) | NMC (Nickel Manganese Cobalt) |\n"
            "| :--- | :--- | :--- |\n"
            "| **Cathode Formula** | LiFePO₄ (Olivine Crystal Structure) | LiNiMnCoO₂ (Layered Oxide Structure) |\n"
            "| **Nominal Cell Voltage** | `3.2V` per cell | `3.6V – 3.7V` per cell |\n"
            "| **Energy Density** | `140 – 160 Wh/kg` (Moderate) | `220 – 250 Wh/kg` (High) |\n"
            "| **Cycle Life (100% DOD)** | **2,500 – 3,500+ full cycles** | **1,200 – 1,800 full cycles** |\n"
            "| **Thermal Runaway Onset** | **~270°C** (Extremely safe) | **~210°C** (Requires active thermal monitoring) |\n"
            "| **High Ambient Heat (40°C+)** | Highly resilient, minimal capacity fade | Accelerates degradation without cooling |\n"
            "| **Voltage Discharge Curve** | Very flat 3.2V plateau (difficult SOC tracking) | Sloped linear curve (easy, precise SOC tracking) |\n"
            "| **Common OEM Implementations** | Ola S1X, Commercial EV Fleets, Swappable packs | Ather 450X, Ola S1 Pro, Chetak, TVS iQube |\n\n"
            "#### 🔬 Key Engineering Insights:\n\n"
            "1. **Thermal Stability in Indian Climates**:\n"
            "   LFP's strong covalent P-O chemical bonds prevent oxygen release even at extreme temperatures, making thermal runaway almost impossible up to 270°C. NMC cells release oxygen around 210°C, requiring rigorous AIS-156 Phase 2 thermal propagation barriers.\n\n"
            "2. **Cycle Longevity**:\n"
            "   An LFP pack lasts **2,500+ cycles** (~8–10 years of daily commuting) before dropping to 80% State of Health (SOH). NMC typically reaches 80% SOH after **1,200–1,500 cycles** (~5–6 years).\n\n"
            "3. **Packaging vs Weight**:\n"
            "   Because NMC is ~40% more energy dense, scooters with tight under-floor cavities (like the Ather 450X) use NMC to save weight and maximize cabin/boot space. LFP packs are slightly bulkier and heavier for the same kWh.\n\n"
            "#### 🛒 Riderzpro Certified Battery Packs:\n"
            "Riderzpro supplies **AIS-156 Phase 2 certified packs** in both chemistries:\n"
            "- **VoltPro Ultra-Life LFP**: 60 Months Warranty, best for heavy commercial riders and maximum heat resilience.\n"
            "- **NexCharge Pro NMC**: 48 Months Warranty, maximum energy density and spirited acceleration.\n"
            "- ♻️ **Instant ₹2,500 Rebate**: Apply your old battery for an upfront ₹2,500 deduction at checkout!"
        )

    def _is_bms_query(self, q: str) -> bool:
        patterns = [
            r"\b(what is bms|how does bms work|what does bms do)\b",
            r"\bbattery management system\b",
            r"\b(bms architecture|bms function|bms protection|cell balancing)\b",
            r"\bactive vs passive balancing\b"
        ]
        return any(re.search(p, q) for p in patterns)

    def _synthesize_bms_architecture(self) -> str:
        return (
            "### 🧠 How an EV Battery Management System (BMS) Works\n\n"
            "The **BMS (Battery Management System)** is the electronic brain of an electric two-wheeler battery pack. It manages electrochemical safety, cell longevity, and telemetry communication with the vehicle ECU.\n\n"
            "#### 🛠️ The 4 Core Functions of an Enterprise BMS:\n\n"
            "1. **Cell Voltage & Temperature Monitoring**:\n"
            "   - Monitored down to **±2 mV accuracy** across every series group (`13S` to `20S` configurations).\n"
            "   - Multi-point NTC thermistors continuously track cell core and busbar temperatures.\n\n"
            "2. **Cell Balancing (Passive vs Active)**:\n"
            "   - **Passive Balancing**: Shunts excess current through bleed resistors (typically 50–100mA) when any cell group hits peak cutoff voltage during 100% soak charge.\n"
            "   - **Active Balancing**: Uses inductive/capacitive charge shuttling to transfer energy from high cells to lower cells during riding.\n\n"
            "3. **Multi-Tier Safety Guardrails**:\n"
            "   - **Over-Voltage Cutoff (OVC)**: Cuts charge if cell exceeds 4.25V (NMC) or 3.65V (LFP).\n"
            "   - **Under-Voltage Cutoff (UVC)**: Cuts discharge if cell drops below 2.8V (NMC) or 2.5V (LFP) to prevent internal copper dissolution.\n"
            "   - **Short-Circuit Isolation**: Solid-state MOSFETs disconnect within **<10 microseconds** during high-current surges.\n"
            "   - **Thermal Cutoff**: Disables fast charging above 45°C and cuts discharge above 60°C.\n\n"
            "4. **Algorithms (SOC & SOH Estimation)**:\n"
            "   - **State of Charge (SOC)**: Calculated using **Coulomb Counting** combined with **Extended Kalman Filters (EKF)** to eliminate drift over time.\n"
            "   - **State of Health (SOH)**: Tracks total amp-hour throughput and internal DC resistance over thousands of kilometers.\n\n"
            "#### 👨‍🔧 How Riderzpro Technicians Test BMS Health:\n"
            "During our **6-Step Diagnostic Protocol** (Doorstep +₹499 / Service Center +₹299), our certified technicians connect a digital CAN-bus diagnostic scanner to inspect cell delta voltage (imbalance >30mV indicates failing cells) and confirm live firmware telemetry."
        )

    def _is_range_troubleshooting_query(self, q: str) -> bool:
        triggers = [
            "range drop", "range dropping", "why is my range low", "range is low",
            "loss of range", "low mileage", "mileage drop", "mileage dropping",
            "increase range", "improve range", "how to get more range", "range problem",
            "ev range decrease", "battery draining fast", "battery discharging fast"
        ]
        return any(t in q for t in triggers)

    def _synthesize_range_troubleshooting(self) -> str:
        return (
            "### 🔍 EV Range Troubleshooting: Why Range Drops & How to Fix It\n\n"
            "If your electric scooter is delivering less range than its claimed or previous performance, it is almost always caused by one of these four engineering factors:\n\n"
            "#### 1. The 4 Root Causes of Range Drop:\n\n"
            "- **1. Under-Inflated Tyres (Most Common - 8% to 15% Range Loss)**:\n"
            "  EV two-wheelers are significantly heavier than petrol scooters due to the battery pack. A pressure drop of just **3 to 4 PSI** increases rolling resistance drastically, requiring the motor to draw extra amps continuously.\n"
            "- **2. Mechanical Brake Drag or Tight Drive Belt**:\n"
            "  Misaligned disc brake calipers or road debris inside ceramic brake pads create continuous friction drag. On belt-driven models (Ather, Revolt), an over-tensioned belt increases transmission drag.\n"
            "- **3. High-Speed Wind Resistance ($v^2$ Physics)**:\n"
            "  Aerodynamic drag increases with the **square of speed**. Riding at **70 km/h** consumes up to **40% more watt-hours per kilometer** than cruising at **45 km/h**.\n"
            "- **4. Unbalanced Battery Cells (BMS Drift)**:\n"
            "  If an EV is repeatedly charged only to 80%–90%, parallel cell groups develop voltage delta drift. The BMS triggers low-battery limp mode as soon as the *lowest* cell group hits the cutoff voltage, even if other cells still have 20% capacity.\n\n"
            "#### 🛠️ 5-Step Actionable Range Recovery Protocol:\n\n"
            "1. **Check Cold Tyre Pressure Weekly**: Inflate to **32–34 PSI** (rear) and **30–32 PSI** (front) using a precision inflator like the **Riderzpro Portable Inflator (`RZP-TI-001`)**.\n"
            "2. **Perform a Monthly 100% Soak Charge**: Plug your scooter in overnight and leave it connected for **2 to 3 hours after reaching 100%**. This activates the BMS passive bleed resistors to equalize all cell voltages.\n"
            "3. **Check Free Wheel Rotation**: Put the scooter on its main stand and spin both wheels by hand. They should spin freely for 3–5 rotations without brake rubbing noise.\n"
            "4. **Use Progressive Throttle Application**: Avoid sudden full-throttle launches from standstill; initial high-amp draw produces the highest heat and energy waste.\n"
            "5. **Book a Certified SOH Diagnostic**: If range remains low, book a **Riderzpro Doorstep Visit (+₹499)** for our 6-step dynamic load test to measure exact battery capacity and cell delta."
        )

    def _is_waterproof_query(self, q: str) -> bool:
        triggers = [
            "waterproof", "ride in rain", "riding in rain", "monsoon", "can i ride in rain",
            "ip67", "ip65", "water wading", "water damage in ev", "water resistant"
        ]
        return any(t in q for t in triggers)

    def _synthesize_waterproof_info(self) -> str:
        return (
            "### 🌧️ Electric Two-Wheeler Waterproofing & Monsoon Riding Guide\n\n"
            "Modern electric two-wheelers are engineered for heavy tropical monsoons, but understanding **IP (Ingress Protection)** ratings and water wading limits is essential for electrical safety:\n\n"
            "#### 1. Ingress Protection (IP) Standards Explained:\n\n"
            "- **IP67 (Battery Pack & BLDC/PMSM Motor)**:\n"
            "  - `6`: **Dust-Tight** (complete protection against dust, sand, and particulate ingress).\n"
            "  - `7`: **Submersion Proof** (withstands temporary immersion in water up to **1 meter deep for 30 minutes** without liquid penetration into live high-voltage terminals).\n"
            "- **IP65 (Digital Dashboard, Switchgear & Throttle)**:\n"
            "  - Protected against multi-directional water jets from rain and road spray.\n\n"
            "#### 2. Safe Monsoon Riding Guidelines:\n\n"
            "- **Safe Water Wading Depth**: You can safely ride through standing water up to the **wheel axle center line (~150mm to 200mm)**.\n"
            "- **Avoid Submerged Floorboards**: If water levels rise above the floorboard for prolonged periods, electrical connectors to the DC-DC converter and side-stand sensor risk moisture contamination.\n"
            "- **Post-Flood Caution**: If an EV was parked in standing water above the floorboard, **do not turn the key on or plug in the charger**. Allow 24 hours of drying and request a certified technician inspection.\n"
            "- **Never Pressure-Wash Charger Ports**: High-pressure power washers (>100 bar) can force moisture past rubber silicone grommets into charging terminals.\n\n"
            "#### 🛡️ Riderzpro All-Weather Protection:\n"
            "- **Heavy-Duty All-Weather Body Cover (`RZP-BBC-004`)**: 100% waterproof PU-coated protection with heat shield for parking during monsoon storms.\n"
            "- **Doorstep Waterproof Seal Audit (+₹499)**: Certified technicians test enclosure silicone gaskets and dielectric terminal grease."
        )

    def _is_regen_query(self, q: str) -> bool:
        triggers = [
            "regenerative braking", "how does regen work", "regen brake", "what is regen",
            "regen in ev", "regen braking"
        ]
        return any(t in q for t in triggers)

    def _synthesize_regenerative_braking(self) -> str:
        return (
            "### ⚡ How Regenerative Braking Works on Electric Two-Wheelers\n\n"
            "**Regenerative Braking (Regen)** is an electrodynamic braking system that recovers kinetic energy during deceleration and feeds it back into the battery pack as electrical energy.\n\n"
            "#### 🔬 The Engineering Behind Regen:\n\n"
            "1. **Motor as a Generator (Back-EMF)**:\n"
            "   When you release the throttle or tap the brake lever, the motor controller reverses the phase switching in the inverter. Instead of drawing DC current from the battery to produce torque, the spinning motor encounters magnetic resistance and generates three-phase AC electricity via Back-Electromotive Force (Back-EMF).\n"
            "2. **AC to DC Rectification**:\n"
            "   The motor controller rectifies the AC current back to high-voltage DC and directs it into the battery pack, slowing down the vehicle while recharging the cells.\n"
            "3. **Dual Regen Types**:\n"
            "   - **Passive / Coasting Regen**: Activates automatically whenever you roll off the throttle.\n"
            "   - **Active Brake-Actuated Regen**: Engages progressively when you gently squeeze the brake lever before the mechanical brake pads touch the disc rotor.\n\n"
            "#### 📊 Real-World Benefits:\n"
            "- **Range Extension**: Recovers **8% to 15% of energy** in stop-and-go urban city traffic.\n"
            "- **Brake Pad Longevity**: Extends disc brake pad life by **2x to 3x** because ceramic pads only engage during heavy or sudden emergency stops.\n\n"
            "#### ⚠️ When Does Regen Turn OFF?\n"
            "1. **100% Battery State of Charge (SOC)**: When the battery is fully charged, there is zero chemical headroom to absorb high-amperage charge. The BMS temporarily disables regen to prevent cell over-voltage.\n"
            "2. **Cold Weather (<15°C)**: When battery cells are cold, high regen charging currents can cause lithium plating onto the graphite anode. The BMS limits or disables regen until the pack warms up."
        )

    def _is_charging_guidance_query(self, q: str) -> bool:
        patterns = [
            r"how\s+(to|should\s+i|can\s+i|do\s+i)\s+charge",
            r"charging\s+(tips|guide|guidance|habits|best\s+practices)",
            r"fast\s+charging\s+vs\s+slow",
            r"charge\s+overnight",
            r"overcharging\s+ev",
            r"best\s+way\s+to\s+charge",
            r"charge\s+to\s+100",
            r"20\s*(%|percent)?\s*(to|-)\s*80\s*(%|percent)?"
        ]
        return any(re.search(p, q) for p in patterns)

    def _synthesize_charging_guidance(self) -> str:
        return (
            "### 🔌 Electric Two-Wheeler Charging Best Practices\n\n"
            "To maximize the lifespan, range, and safety of your EV battery pack, follow these certified guidelines recommended by Riderzpro engineers:\n\n"
            "#### 1. The Golden 20%–80% Rule:\n"
            "- For daily commuting, maintain your battery State of Charge (SOC) between **20% and 80%**.\n"
            "- Operating in this central electrochemical zone reduces mechanical stress on cathode crystal lattices and prevents lithium plating.\n\n"
            "#### 2. The Monthly 100% Soak Charge:\n"
            "- **Once every 3 to 4 weeks**, charge your battery to **100% and leave it plugged in for an additional 2 to 3 hours**.\n"
            "- This allows the BMS passive bleed resistors to equalize parallel cell group voltages, resetting battery capacity calibration and preventing false range drops.\n\n"
            "#### 3. Post-Ride Thermal Cooldown:\n"
            "- **Never plug in a fast charger immediately after aggressive riding or highway cruising in summer**.\n"
            "- Allow the battery pack to cool down for **15 to 20 minutes** before plugging in. Charging hot cells accelerates electrolyte oxidation and internal resistance growth.\n\n"
            "#### 4. Leaving Plugged in Overnight:\n"
            "- **Yes, it is completely safe** with Riderzpro certified and OEM smart chargers. Modern BMS units feature automatic low-current trickle cutoff once all cell groups reach 4.20V (NMC) or 3.65V (LFP).\n\n"
            "#### 5. Storage / Prolonged Inactivity:\n"
            "- If leaving your EV unused for more than two weeks, store it at **50% to 60% SOC** in a shaded area. Never leave an EV parked at 0% or 100% for weeks."
        )

    def _is_subsidy_regulations_query(self, q: str) -> bool:
        triggers = [
            "subsidy", "subsidies", "fame", "fame ii", "pm e-drive", "pmedrive",
            "ais 156", "ais-156", "ais156", "government subsidy", "ev subsidy", "regulations"
        ]
        return any(t in q for t in triggers)

    def _synthesize_subsidy_regulations(self) -> str:
        return (
            "### 📜 EV Subsidies & AIS-156 Phase 2 Safety Regulations\n\n"
            "India's electric vehicle ecosystem is governed by strict government policies and central safety standards:\n\n"
            "#### 1. Central EV Schemes (PM E-DRIVE):\n"
            "- The Ministry of Heavy Industries introduced the **PM E-DRIVE Scheme** (succeeding FAME II), providing direct demand incentives for electric two-wheelers and three-wheelers with phased subsidies based on battery capacity (kWh).\n"
            "- Requires localized component sourcing (Phased Manufacturing Programme) and telematics compliance.\n\n"
            "#### 2. AIS-156 Phase 2 Safety Mandate:\n"
            "Following thermal runaway incidents in 2022, India instituted the world's most rigorous two-wheeler battery safety standard:\n"
            "- **Thermal Propagation Isolation**: A single cell failure must not trigger adjacent cell runaway; the pack must provide at least a **5-minute acoustic/visual warning** before smoke or fire.\n"
            "- **Smart Active BMS**: Continuous logging of voltage, current, and temperature, with auto-cutoff for abnormal charge rates.\n"
            "- **Micro-Crack & Vibration Testing**: Stringent vibration shock testing to prevent busbar cracking under Indian pothole road conditions.\n"
            "- **IP67 Ingress Certification**: Pack submersion in water without water ingress or dielectric breakdown.\n\n"
            "#### 🛡️ Riderzpro Compliance:\n"
            "Every certified replacement battery supplied and installed by Riderzpro is **100% compliant with AIS-156 Phase 2 standards**, accompanied by digital test certificates in your account dashboard."
        )

    def _is_catalog_overview_query(self, q: str) -> bool:
        triggers = [
            "what accessories", "all accessories", "show catalog", "what products do you sell",
            "catalog categories", "list of accessories", "categories of products", "what parts do you sell",
            "accessory catalog", "parts catalog"
        ]
        return any(t in q for t in triggers)

    def _synthesize_catalog_overview(self) -> str:
        return (
            "### 🧰 Riderzpro Official Product Catalogue Overview\n\n"
            "Riderzpro's verified catalogue features **160+ automotive and two-wheeler products across 58 certified categories**, precision-tested for OEM fitment and extreme durability:\n\n"
            "#### 1. 🛞 Tyre Care & Emergency Maintenance\n"
            "- **Portable Cordless Tyre Inflator (`RZP-TI-001`)**: High-pressure 150 PSI digital auto-cut inflator with 4000mAh battery for quick roadside top-ups.\n"
            "- **Tubeless Puncture Repair Kit (`RZP-PRK-001`)**: Heavy-duty T-handle reamer and probe with 10 vulcanized butyl strips.\n\n"
            "#### 2. 🛡️ All-Weather Protection & Covers\n"
            "- **Triple-Layer Waterproof Body Cover (`RZP-BBC-004`)**: PU-coated waterproof and UV-reflective heat-shield fabric with buckle strap.\n"
            "- **Anti-Slip Mesh Breathable Seat Covers (`RZP-SC-002`)**: Honeycomb 3D ventilation prevents heat buildup and protects factory seat foam.\n\n"
            "#### 3. 🔒 Vehicle Security & Anti-Theft\n"
            "- **Heavy Alloy Disc Brake Alarm Lock (`RZP-ATD-003`)**: Hardened steel locking pin with 110dB motion vibration alarm.\n"
            "- **Reinforced U-Lock & Heavy-Duty Security Cables**: Premium cut-resistant alloy for secure street parking.\n\n"
            "#### 4. 🎒 Luggage, Carriers & Ergonomics\n"
            "- **Heavy-Duty Rear Saddle Stays & Luggage Racks (`RZP-MLC-001`)**: Powder-coated steel racks for top boxes and saddle bags.\n"
            "- **Vibration-Damping Handlebar Mobile Mounts**: High-speed aluminum mounts with mechanical claw locks.\n\n"
            "#### 5. ⚡ Powertrain Spares & Certified Batteries\n"
            "- **Certified Replacement Batteries**: 48V–72V AIS-156 Phase 2 certified packs with instant **₹2,500 exchange rebate**.\n"
            "- **Ceramic Low-Dust EV Brake Pads & Gates Carbon Drive Belts**: OEM-certified replacements.\n\n"
            "*Search any SKU code (e.g., `RZP-TI-001`) or ask about fitment for your vehicle!*"
        )


agent_instance = AutonomousRiderzproAgent()
