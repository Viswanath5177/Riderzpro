"""
tools/build_catalog.py - Riderzpro catalog builder.
Run from project root: python tools/build_catalog.py
"""
from __future__ import annotations
import json, logging, re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC  = ROOT / "source"
OUT  = ROOT / "assets" / "data"

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
log = logging.getLogger("build_catalog")

def to_paise(v):
    if v is None: return None
    try: return int(round(float(v) * 100))
    except: return None

def slugify(t):
    return re.sub(r"[^a-z0-9]+", "-", t.lower()).strip("-")

# 1. Accessory catalog
log.info("Loading accessory catalog...")
with open(SRC / "src" / "data" / "accessory_catalog.json", encoding="utf-8") as f:
    raw = json.load(f)
products_raw = raw.get("products", raw if isinstance(raw, list) else [])

# 2. Vehicle accessories
with open(SRC / "web" / "data" / "vehicle_accessories.json", encoding="utf-8") as f:
    va_raw = json.load(f).get("products", [])

# 3. Missing-image list
missing_ids = set()
csv_path = SRC / "products_missing_images.csv"
if csv_path.exists():
    for line in csv_path.open(encoding="utf-8", errors="ignore"):
        pid = line.strip().split(",")[0].strip().strip('"')
        if pid and pid.lower() not in ("id", "product_id"):
            missing_ids.add(pid)
log.info(f"Missing images list: {len(missing_ids)} products")

# 4. Local catalogue images (source/public/catalogue/images/<id>/01.jpg)
cat_dir = SRC / "public" / "catalogue" / "images"
local_imgs = {}
if cat_dir.is_dir():
    for fld in cat_dir.iterdir():
        if fld.is_dir():
            img = fld / "01.jpg"
            if img.exists():
                local_imgs[fld.name] = f"assets/catalogue/{fld.name}/01.jpg"
log.info(f"Local product images: {len(local_imgs)}")

# 5. Filter and transform accessories
VISIBLE = {"Listed"}

def img_info(p):
    pid = p.get("id", "")
    st = p.get("imageStatus", "")
    loc = local_imgs.get(pid)
    if st == "Photo files included" and loc:
        return loc, None
    if st == "Stock placeholder only":
        return None, None
    urls = p.get("imageUrls", []) or []
    rem = urls[0] if urls else None
    if not rem and not loc:
        log.warning(f"BUILD WARNING: {pid} - {p.get('name', '')} - no image")
    return loc, rem

acc_out = []
hidden = 0
for p in products_raw:
    if p.get("status") in VISIBLE and p.get("price") is not None:
        loc, rem = img_info(p)
        acc_out.append({
            "id": p.get("id"), "name": p.get("name"), "brand": p.get("brand"),
            "department": p.get("department"), "category": p.get("category"),
            "vehicleType": p.get("vehicleType"),
            "pricePaise": to_paise(p.get("price")),
            "mrpPaise": to_paise(p.get("mrp")),
            "priceType": p.get("priceType", "Fixed"),
            "availability": p.get("availability", "In stock"),
            "stock": p.get("stock"), "fits": p.get("fits"), "options": p.get("options"),
            "installationPricePaise": to_paise(p.get("installationPrice")),
            "installationTime": p.get("installationTime"),
            "warranty": p.get("warranty"), "delivery": p.get("delivery"),
            "rating": p.get("rating"), "reviewCount": p.get("reviewCount", 0),
            "bestseller": p.get("bestseller", False),
            "description": p.get("description"), "features": p.get("features", []),
            "imageStatus": p.get("imageStatus"), "localImageAsset": loc,
            "remoteImageUrl": rem, "specifications": p.get("specifications", []),
            "sellerId": p.get("sellerId", "v1"), "catalogType": "accessory",
        })
    else:
        hidden += 1
log.info(f"Accessories: {len(acc_out)} visible, {hidden} hidden")

# Merge vehicle_accessories not already in catalog
acc_ids = {a["id"] for a in acc_out}
for va in va_raw:
    if va["id"] not in acc_ids:
        acc_out.append({
            "id": va["id"], "name": va.get("name"), "brand": va.get("brand"),
            "department": "Accessories", "category": va.get("category", "Accessories"),
            "vehicleType": va.get("vehicle_type", "car"),
            "pricePaise": to_paise(va.get("price_inr")), "mrpPaise": None,
            "priceType": "Fixed", "availability": "In stock", "stock": None,
            "fits": va.get("fitment"), "options": None,
            "installationPricePaise": None, "installationTime": None,
            "warranty": None, "delivery": None, "rating": None,
            "reviewCount": 0, "bestseller": False,
            "description": "; ".join(va.get("details", [])),
            "features": va.get("details", []),
            "imageStatus": "Remote", "localImageAsset": None,
            "remoteImageUrl": va.get("image_url"),
            "specifications": [
                {"label": "Part Number", "value": va.get("part_number", "")},
                {"label": "Fitment", "value": va.get("fitment", "")},
            ],
            "sellerId": "v1", "catalogType": "accessory",
        })

# 6. EV two-wheelers
log.info("Loading EV two-wheeler catalog...")
with open(SRC / "web" / "data" / "ev_two_wheeler_catalog.json", encoding="utf-8") as f:
    ev_raw = json.load(f).get("products", [])
with open(SRC / "web" / "data" / "ev_image_manifest.json", encoding="utf-8") as f:
    ev_imgs = json.load(f)

def ev_img_url(p):
    url = p.get("image_url")
    if url:
        return url
    slug = slugify(f"{p.get('brand', '')}-{p.get('model', '')}")
    for k, v in ev_imgs.items():
        if slug in k:
            return v.get("url") if isinstance(v, dict) else (v if isinstance(v, str) else None)
    return None

ev_out = []
for p in ev_raw:
    ev_out.append({
        "id": p.get("id"), "brand": p.get("brand"), "model": p.get("model"),
        "variant": p.get("variant"), "vehicleType": p.get("vehicle_type"),
        "pricePaise": to_paise(p.get("price_inr")),
        "priceType": p.get("price_type", "starting_ex_showroom"),
        "topSpeedKmh": p.get("top_speed_kmh"),
        "claimedRangeKm": p.get("claimed_range_km"),
        "chargingTimeText": p.get("charging_time_text"),
        "batteryCapacityKwh": p.get("battery_capacity_kwh"),
        "imageUrl": ev_img_url(p),
        "availability": p.get("availability", "listed"),
        "catalogType": "ev",
    })
log.info(f"EV two-wheelers: {len(ev_out)}")

# 7. EV parts seed (from data.ts)
B  = ["assets/photos/battery-1.jpg", "assets/photos/battery-2.jpg", "assets/photos/battery-3.jpg"]
CH = "assets/photos/charger.jpg"
PT = "assets/photos/parts.jpg"

def ep(id_, name, brand, cat, vt, price, mrp, avail, fits, wrnty, rat, rc, bs, desc, feats, img, specs, sid):
    return {
        "id": id_, "name": name, "brand": brand, "department": "EV Parts", "category": cat,
        "vehicleType": vt, "pricePaise": to_paise(price), "mrpPaise": to_paise(mrp),
        "priceType": "Fixed", "availability": avail, "fits": fits, "warranty": wrnty,
        "rating": rat, "reviewCount": rc, "bestseller": bs, "description": desc,
        "features": feats, "localImageAsset": img, "remoteImageUrl": None,
        "specifications": specs, "sellerId": sid, "catalogType": "ev_part",
    }

def sp(label, value):
    return {"label": label, "value": value}

ev_parts = [
    ep("ev-voltride-60v-30ah", "VoltRide 60V 30Ah Li-ion Pack", "VoltRide", "Battery", "bike",
       62000, None, "In stock", ["ola-s1pro", "bajaj-chetak", "hero-vida-v1"], "36 months",
       4.7, 142, True, "High-density NMC pack with smart BMS, IP67 casing and fast-charge support.",
       ["IP67 waterproof", "Smart BMS", "Fast-charge ready"], B[0],
       [sp("Voltage","60V"),sp("Capacity","30Ah"),sp("Chemistry","NMC"),sp("Range","~110 km"),sp("Weight","13 kg"),sp("Warranty","36 months")], "v1"),
    ep("ev-voltedge-48v-50ah", "VoltEdge 48V 50Ah LiFePO4", "VoltEdge", "Battery", "bike",
       54000, None, "In stock", ["ather-450x", "tvs-iqube"], "48 months",
       4.8, 89, False, "Ultra-safe LiFePO4 chemistry with 3000+ cycles.",
       ["3000+ cycles", "Thermal safe", "Fleet grade"], B[1],
       [sp("Voltage","48V"),sp("Capacity","50Ah"),sp("Chemistry","LiFePO4"),sp("Range","~120 km"),sp("Weight","18 kg"),sp("Warranty","48 months")], "v1"),
    ep("ev-titan-72v-120ah", "Titan 72V 120Ah Motorcycle Module", "Titan Energy", "Battery", "bike",
       98000, None, "Made to order", ["revolt-rv400"], "36 months",
       4.6, 31, False, "High-capacity module for performance EV motorcycles with CAN-bus.",
       ["CAN-bus", "High discharge", "Performance"], B[2],
       [sp("Voltage","72V"),sp("Capacity","120Ah"),sp("Chemistry","NMC"),sp("Range","~180 km"),sp("Weight","38 kg"),sp("Warranty","36 months")], "v2"),
    ep("ev-voltride-60v-24ah", "VoltRide 60V 24Ah City Pack", "VoltRide", "Battery", "bike",
       46000, None, "In stock", ["ola-s1pro", "hero-vida-v1"], "24 months",
       4.5, 67, False, "Lightweight swap-friendly pack for city riders.",
       ["Swap-friendly", "City optimized", "Lightweight"], B[0],
       [sp("Voltage","60V"),sp("Capacity","24Ah"),sp("Chemistry","NMC"),sp("Range","~85 km"),sp("Weight","11 kg"),sp("Warranty","24 months")], "v1"),
    ep("ev-voltedge-48v-30ah", "VoltEdge 48V 30Ah Compact", "VoltEdge", "Battery", "bike",
       36000, None, "In stock", ["ather-450x", "tvs-iqube"], "36 months",
       4.7, 44, False, "Compact LiFePO4 replacement with plug-and-play connectors.",
       ["Plug-and-play", "Compact", "LiFePO4"], B[1],
       [sp("Voltage","48V"),sp("Capacity","30Ah"),sp("Chemistry","LiFePO4"),sp("Range","~75 km"),sp("Weight","12 kg"),sp("Warranty","36 months")], "v3"),
    ep("ev-titan-72v-60ah", "Titan 72V 60Ah Sport", "Titan Energy", "Battery", "bike",
       72000, None, "In stock", ["revolt-rv400"], "24 months",
       4.6, 23, False, "Sport-tuned discharge curve for quick acceleration.",
       ["Sport discharge", "Performance", "CAN-bus"], B[2],
       [sp("Voltage","72V"),sp("Capacity","60Ah"),sp("Chemistry","NMC"),sp("Range","~120 km"),sp("Weight","22 kg"),sp("Warranty","24 months")], "v4"),
    ep("ev-chargemax-3kw", "ChargeMax 3.3kW Fast Charger", "ChargeMax", "Charger", "both",
       14500, 16000, "In stock", ["ola-s1pro", "bajaj-chetak", "hero-vida-v1"], "12 months",
       4.8, 211, True, "3.3kW portable fast charger with Type-2 connector.",
       ["Type-2 connector", "LED status", "Portable", "Fast charge"], CH,
       [sp("Power","3.3kW"),sp("Voltage","60V"),sp("Connector","Type-2"),sp("Weight","3 kg"),sp("Warranty","12 months")], "v1"),
    ep("ev-chargemax-48v-home", "ChargeMax 48V Home Charger", "ChargeMax", "Charger", "both",
       7800, 9000, "In stock", ["ather-450x", "tvs-iqube"], "12 months",
       4.6, 98, False, "Smart home charger with auto cut-off and temperature protection.",
       ["Auto cut-off", "Temp protection", "Smart"], CH,
       [sp("Voltage","48V"),sp("Weight","2 kg"),sp("Warranty","12 months")], "v3"),
    ep("ev-daly-bms-60v", "SmartBMS 16S 60A Board", "Daly", "BMS", "both",
       4200, None, "In stock", ["ola-s1pro", "bajaj-chetak", "hero-vida-v1"], "12 months",
       4.5, 76, False, "Bluetooth BMS with cell balancing and thermal protection.",
       ["Bluetooth", "Cell balancing", "Thermal protection"], CH,
       [sp("Voltage","60V"),sp("Current","60A"),sp("Cells","16S"),sp("Weight","0.4 kg"),sp("Warranty","12 months")], "v2"),
    ep("ev-qs-hub-motor-3kw", "QS 3000W 72V Hub Motor", "QS Motor", "Motor", "bike",
       28000, None, "Made to order", ["revolt-rv400"], "18 months",
       4.7, 19, False, "Brushless hub motor rated 3kW continuous with hall sensors.",
       ["3kW continuous", "Hall sensors", "Brushless"], PT,
       [sp("Power","3000W"),sp("Voltage","72V"),sp("Weight","9 kg"),sp("Warranty","18 months")], "v4"),
    ep("ev-kelly-72v-controller", "Kelly 72V 80A Controller", "Kelly", "Controller", "bike",
       9500, None, "In stock", ["revolt-rv400"], "12 months",
       4.6, 28, False, "Programmable sinusoidal controller with regen braking.",
       ["Sinusoidal", "Regen braking", "Programmable"], PT,
       [sp("Voltage","72V"),sp("Current","80A"),sp("Weight","1.6 kg"),sp("Warranty","12 months")], "v2"),
    ep("ev-brembo-wave-rotor", "Wave Disc Brake Rotor 220mm", "Brembo", "Brakes", "bike",
       2400, 3000, "In stock",
       ["ather-450x", "ola-s1pro", "tvs-iqube", "bajaj-chetak", "revolt-rv400", "hero-vida-v1"],
       "6 months", 4.8, 156, True, "Stainless wave rotor for improved heat dissipation.",
       ["Stainless steel", "Wave pattern", "Heat dissipation"], PT,
       [sp("Diameter","220mm"),sp("Material","Stainless steel"),sp("Weight","0.8 kg"),sp("Warranty","6 months")], "v1"),
]

# 8. Departments grid
dept_map = {}
for p in acc_out + ev_parts:
    d = p.get("department") or "Accessories"
    c = p.get("category") or "Other"
    dept_map.setdefault(d, {}).setdefault(c, 0)
    dept_map[d][c] += 1

departments = [
    {
        "name": d,
        "categories": [{"name": c, "count": n} for c, n in sorted(cs.items(), key=lambda x: -x[1])],
        "totalCount": sum(cs.values()),
    }
    for d, cs in sorted(dept_map.items())
]

# 9. Vendors (relocated to Delhi coordinates)
vendors = [
    {"id": "v1", "name": "VoltHub Delhi",          "area": "Connaught Place", "lat": 28.6315, "lng": 77.2167, "rating": 4.8, "prepMins": 15, "isVerified": True},
    {"id": "v2", "name": "ChargeKart Karol Bagh",   "area": "Karol Bagh",      "lat": 28.6519, "lng": 77.1908, "rating": 4.6, "prepMins": 20, "isVerified": True},
    {"id": "v3", "name": "EV Spares Lajpat Nagar",  "area": "Lajpat Nagar",   "lat": 28.5707, "lng": 77.2435, "rating": 4.5, "prepMins": 25, "isVerified": True},
    {"id": "v4", "name": "Ampere Auto Dwarka",       "area": "Dwarka",          "lat": 28.5921, "lng": 77.0460, "rating": 4.7, "prepMins": 15, "isVerified": True},
    {"id": "v5", "name": "GreenWheels Rohini",       "area": "Rohini",          "lat": 28.7495, "lng": 77.0687, "rating": 4.4, "prepMins": 30, "isVerified": False},
    {"id": "v6", "name": "Riderzpro Store Janakpuri","area": "Janakpuri",       "lat": 28.6264, "lng": 77.0837, "rating": 4.9, "prepMins": 10, "isVerified": True},
]

# 10. Write
OUT.mkdir(parents=True, exist_ok=True)
catalog = {
    "version": 2, "currency": "INR", "priceBasis": "paise",
    "accessories": acc_out, "evParts": ev_parts,
    "evTwoWheelers": ev_out, "departments": departments, "vendors": vendors,
}
out_file = OUT / "catalog.json"
with open(out_file, "w", encoding="utf-8") as f:
    json.dump(catalog, f, ensure_ascii=False, separators=(",", ":"))

size_kb = out_file.stat().st_size // 1024
log.info(f"Wrote catalog.json ({size_kb} KB)")
log.info(f"accessories={len(acc_out)} evParts={len(ev_parts)} evTwoWheelers={len(ev_out)} depts={len(departments)}")
