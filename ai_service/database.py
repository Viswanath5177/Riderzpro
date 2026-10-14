"""
Riderzpro Enterprise Catalog Database Engine
Loads, indexes, and queries the comprehensive 116+ EV two-wheeler catalog,
certified battery replacements, spare parts, and vehicle images from scratch data.
"""

import os
import json
import re
from typing import Dict, List, Any, Optional
from ai_service.config import settings

SCRATCH_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "scratch")
KB_DIR = os.path.join(os.path.dirname(__file__), "knowledge_base")
CATALOG_JSON_PATH = os.path.join(SCRATCH_DIR, "ev_two_wheeler_catalog.json")
MANIFEST_JSON_PATH = os.path.join(SCRATCH_DIR, "bikewale_ev_image_manifest.json")
HANDOVER_CATALOG_PATH = os.path.join(KB_DIR, "handover_master_catalog.json")


class CatalogDatabase:
    _instance = None

    def __init__(self):
        self.vehicles: List[Dict[str, Any]] = []
        self.vehicle_index: Dict[str, Dict[str, Any]] = {}  # id -> vehicle
        self.alias_map: Dict[str, str] = {}  # alias -> vehicle_id
        self.image_manifest: Dict[str, str] = {}  # slug/name -> image_url
        self.brands: set = set()
        self.batteries: List[Dict[str, Any]] = []
        self.parts: List[Dict[str, Any]] = []
        # Master Catalogue (352 products from official handover dataset)
        self.master_products: List[Dict[str, Any]] = []
        self.master_id_index: Dict[str, Dict[str, Any]] = {}  # RZP-0001 -> product
        self.master_brand_index: Dict[str, List[Dict[str, Any]]] = {}  # brand -> list
        self.master_category_index: Dict[str, List[Dict[str, Any]]] = {}  # category -> list
        self.master_dept_index: Dict[str, List[Dict[str, Any]]] = {}  # department -> list
        self.master_vehicle_index: Dict[str, List[Dict[str, Any]]] = {}  # vehicle -> list
        # Legacy v2 Catalog (160 products)
        self.v2_products: List[Dict[str, Any]] = []
        self.sku_index: Dict[str, Dict[str, Any]] = {}  # sku -> product
        self.categories: Dict[str, List[Dict[str, Any]]] = {}  # category -> list of products
        self.loaded_catalogs: List[str] = []
        self.is_loaded = False
        self.load()

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = CatalogDatabase()
        return cls._instance

    def reload(self) -> Dict[str, Any]:
        """Clears existing indices and re-scans scratch and knowledge base directories."""
        self.vehicles.clear()
        self.vehicle_index.clear()
        self.alias_map.clear()
        self.image_manifest.clear()
        self.brands.clear()
        self.master_products.clear()
        self.master_id_index.clear()
        self.master_brand_index.clear()
        self.master_category_index.clear()
        self.master_dept_index.clear()
        self.master_vehicle_index.clear()
        self.v2_products.clear()
        self.sku_index.clear()
        self.categories.clear()
        self.loaded_catalogs.clear()
        self.load()
        return self.get_catalog_summary()

    def get_catalog_summary(self) -> Dict[str, Any]:
        """Returns statistics on loaded catalog data and knowledge base."""
        return {
            "catalog_files_loaded": self.loaded_catalogs,
            "total_vehicles": len(self.vehicles),
            "total_brands": len(self.brands),
            "brands_sample": sorted(list(self.brands))[:15],
            "total_batteries": len(self.batteries),
            "total_parts": len(self.parts),
            "total_master_products": len(self.master_products),
            "master_brands": list(self.master_brand_index.keys()),
            "master_vehicles_indexed": len(self.master_vehicle_index),
            "total_v2_products": len(self.v2_products),
            "total_v2_categories": len(self.categories),
            "v2_categories_sample": list(self.categories.keys())[:10],
        }

    def get_all_brands(self) -> set:
        """Returns the set of all indexed automotive and EV brands in lowercase."""
        return self.brands

    def load(self):
        """Loads and indexes the full scratch catalog and images."""
        # 1. Load image manifest if available
        if os.path.exists(MANIFEST_JSON_PATH):
            try:
                with open(MANIFEST_JSON_PATH, "r", encoding="utf-8") as f:
                    manifest_data = json.load(f)
                    for item in manifest_data.get("images", []):
                        slug = item.get("slug", "").lower()
                        name = item.get("product_name", "").lower()
                        url = item.get("image_url", "")
                        if slug:
                            self.image_manifest[slug] = url
                        if name:
                            self.image_manifest[name] = url
            except Exception as e:
                pass

        # 2. Load 116 EV vehicle catalog
        if os.path.exists(CATALOG_JSON_PATH):
            try:
                with open(CATALOG_JSON_PATH, "r", encoding="utf-8") as f:
                    catalog_data = json.load(f)
                    raw_products = catalog_data.get("products", [])
                    for p in raw_products:
                        v_id = p.get("id")
                        brand = p.get("brand", "")
                        model = p.get("model", "")
                        variant = p.get("variant", "Base")
                        v_type = p.get("vehicle_type", "electric_scooter")
                        price = p.get("price_inr")
                        range_km = p.get("claimed_range_km")
                        top_speed = p.get("top_speed_kmh")
                        chg_time = p.get("charging_time_text")
                        img = p.get("image_url") or self.image_manifest.get(f"{brand}-{model}".lower().replace(" ", "-"))

                        # Infer voltage and connector based on OEM specs
                        voltage, v_range, connector, drive = self._infer_electrical_specs(brand, model, v_type, range_km, top_speed)

                        v_record = {
                            "id": v_id,
                            "brand": brand,
                            "model": model,
                            "variant": variant,
                            "full_name": f"{brand} {model} ({variant})",
                            "vehicle_type": v_type,
                            "price_inr": price,
                            "claimed_range_km": range_km,
                            "top_speed_kmh": top_speed,
                            "charging_time": chg_time,
                            "nominal_voltage": voltage,
                            "voltage_range": v_range,
                            "connector_type": connector,
                            "drive_type": drive,
                            "image_url": img,
                            "source_url": p.get("source_url")
                        }
                        self.vehicles.append(v_record)
                        self.vehicle_index[v_id] = v_record
                        if brand:
                            self.brands.add(brand.lower().strip())

                        # Index search aliases
                        self._index_aliases(v_id, brand, model, variant)

                self.loaded_catalogs.append(os.path.basename(CATALOG_JSON_PATH))
                self.is_loaded = True
            except Exception as e:
                self.is_loaded = False

        # Scan for any additional JSON or CSV files in scratch or knowledge_base
        for folder in [SCRATCH_DIR, KB_DIR]:
            if not os.path.exists(folder):
                continue
            for fname in os.listdir(folder):
                fpath = os.path.join(folder, fname)
                if not os.path.isfile(fpath) or fpath in [CATALOG_JSON_PATH, MANIFEST_JSON_PATH]:
                    continue
                if fname.endswith(".json") and fname not in self.loaded_catalogs:
                    try:
                        with open(fpath, "r", encoding="utf-8") as f:
                            extra_data = json.load(f)
                            items = extra_data.get("products") or extra_data.get("vehicles") or (extra_data if isinstance(extra_data, list) else [])
                            for p in items:
                                if isinstance(p, dict) and (p.get("brand") or p.get("model")):
                                    b = p.get("brand", "EV")
                                    m = p.get("model", "")
                                    v_id = p.get("id") or f"{b.lower()}_{m.lower()}".replace(" ", "_")
                                    if v_id not in self.vehicle_index:
                                        voltage, v_range, connector, drive = self._infer_electrical_specs(b, m, p.get("vehicle_type", "electric_scooter"), p.get("claimed_range_km"), p.get("top_speed_kmh"))
                                        rec = {
                                            "id": v_id,
                                            "brand": b,
                                            "model": m,
                                            "variant": p.get("variant", "Standard"),
                                            "full_name": f"{b} {m}",
                                            "vehicle_type": p.get("vehicle_type", "electric_scooter"),
                                            "price_inr": p.get("price_inr"),
                                            "claimed_range_km": p.get("claimed_range_km"),
                                            "top_speed_kmh": p.get("top_speed_kmh"),
                                            "nominal_voltage": p.get("nominal_voltage", voltage),
                                            "voltage_range": v_range,
                                            "connector_type": connector,
                                            "drive_type": drive,
                                        }
                                        self.vehicles.append(rec)
                                        self.vehicle_index[v_id] = rec
                                        self.brands.add(b.lower().strip())
                                        self._index_aliases(v_id, b, m, rec["variant"])
                        self.loaded_catalogs.append(fname)
                    except Exception:
                        pass

        # 3. Load certified battery packs and spare parts
        from ai_service.catalog_data import BATTERY_CATALOG, EV_PARTS_CATALOG
        self.batteries = BATTERY_CATALOG
        self.parts = EV_PARTS_CATALOG

        # 4. Load master handover catalog (352 products from official handover dataset)
        self._load_handover_catalog()

        # 5. Load v2 catalog (160 products across 58 categories)
        self._load_v2_catalog()

    def _load_handover_catalog(self):
        """Loads and indexes the 352 products from the official Riderzpro handover catalog."""
        if not os.path.exists(HANDOVER_CATALOG_PATH):
            return

        try:
            with open(HANDOVER_CATALOG_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)
                products = data.get("products", [])

            for p in products:
                pid = p.get("id", "").strip()
                if not pid:
                    continue
                self.master_products.append(p)
                self.master_id_index[pid.upper()] = p
                self.master_id_index[pid.lower()] = p

                # Brand indexing
                b = p.get("brand", "").strip()
                if b:
                    b_low = b.lower()
                    self.brands.add(b_low)
                    self.master_brand_index.setdefault(b_low, []).append(p)

                # Category and Department indexing
                cat = p.get("category", "").strip().lower()
                if cat:
                    self.master_category_index.setdefault(cat, []).append(p)
                dept = p.get("department", "").strip().lower()
                if dept:
                    self.master_dept_index.setdefault(dept, []).append(p)

                # Vehicle fitment indexing
                for m in p.get("fits_models", []):
                    m_clean = m.strip().lower()
                    if m_clean:
                        self.master_vehicle_index.setdefault(m_clean, []).append(p)
                        self.brands.add(m_clean)

            if os.path.basename(HANDOVER_CATALOG_PATH) not in self.loaded_catalogs:
                self.loaded_catalogs.append(os.path.basename(HANDOVER_CATALOG_PATH))
        except Exception:
            pass

    def get_product_by_id(self, product_id: str) -> Optional[Dict[str, Any]]:
        """Returns product details by master Product ID (e.g. 'RZP-0001')."""
        return self.master_id_index.get(product_id.strip().upper())

    def find_products_by_vehicle(self, vehicle: str, category: Optional[str] = None, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Retrieves products custom-fitted or verified for a specific vehicle model.
        e.g., 'Thar', 'Creta', 'Scorpio N', 'Fortuner', 'Swift'.
        """
        v_clean = vehicle.strip().lower().replace("-", " ")
        if not v_clean:
            return []

        matched = []
        for p in self.master_products:
            fits_models = [m.lower().replace("-", " ") for m in p.get("fits_models", [])]
            fits_text = p.get("fits", "").lower().replace("-", " ")
            name_text = p.get("name", "").lower().replace("-", " ")

            is_match = False
            # Specific vehicle match (exclude universal so exact fits surface first)
            if any(v_clean in m or m in v_clean for m in fits_models if m != "universal"):
                is_match = True
            elif v_clean in fits_text or v_clean in name_text:
                is_match = True

            if is_match:
                if category and category.lower() not in p.get("category", "").lower() and category.lower() not in p.get("department", "").lower():
                    continue
                matched.append(p)

        return matched[:limit]

    def find_products_by_brand(self, brand: str, limit: int = 10) -> List[Dict[str, Any]]:
        """Returns products manufactured by a specific brand (e.g. 'RECOIL', 'Blaupunkt', 'Autoform')."""
        b_clean = brand.strip().lower()
        return self.master_brand_index.get(b_clean, [])[:limit]

    def find_products_by_category(self, category: str, limit: int = 10) -> List[Dict[str, Any]]:
        """Returns products in a specific category or department."""
        c_clean = category.strip().lower()
        if c_clean in self.master_category_index:
            return self.master_category_index[c_clean][:limit]
        if c_clean in self.master_dept_index:
            return self.master_dept_index[c_clean][:limit]
        # Partial match
        matched = []
        for cat, prods in self.master_category_index.items():
            if c_clean in cat:
                matched.extend(prods)
        return matched[:limit]

    def search_master_catalog(self, query: str, limit: int = 8) -> List[Dict[str, Any]]:
        """
        High-precision multi-attribute search across the 352 official master products.
        Scores on exact vehicle fitments, brand names, product types, and features.
        """
        q = query.lower().strip()
        if not q or not self.master_products:
            return []

        # 1. Exact ID match (e.g. RZP-0001, RZP-0038)
        id_match = re.search(r'\b(RZP-\d+)\b', query, re.IGNORECASE)
        if id_match:
            code = id_match.group(1).upper()
            if code in self.master_id_index:
                return [self.master_id_index[code]]

        STOP_WORDS = {
            "can", "you", "give", "tell", "what", "which", "how", "why", "where",
            "for", "the", "and", "with", "have", "does", "are", "from", "this",
            "that", "please", "some", "any", "about", "your", "our", "all", "get", "like", "in", "me"
        }
        tokens = [t for t in re.split(r'\W+', q) if len(t) > 2 and t not in STOP_WORDS]
        if not tokens:
            return []

        scored = []
        for p in self.master_products:
            score = 0
            name = p.get("name", "").lower()
            brand = p.get("brand", "").lower()
            cat = p.get("category", "").lower()
            dept = p.get("department", "").lower()
            fits_text = p.get("fits", "").lower()
            fits_models = [m.lower() for m in p.get("fits_models", [])]
            summary = p.get("summary", "").lower()

            # Vehicle match (high priority)
            for m in fits_models:
                if m != "universal" and (m in q or any(t == m for t in tokens)):
                    score += 35
                    break

            # Brand match
            if brand in q or any(t == brand for t in tokens):
                score += 25

            # Name match
            if q in name:
                score += 30

            # Category / Dept match
            if cat in q:
                score += 20
            if dept in q:
                score += 15

            # Token overlap
            for t in tokens:
                if t in name:
                    score += 12
                if t in cat:
                    score += 10
                if t in fits_text:
                    score += 8
                if t in dept:
                    score += 5
                if t in summary:
                    score += 3

            if score >= 10:
                scored.append((score, p))

        scored.sort(key=lambda x: x[0], reverse=True)
        return [p for _, p in scored[:limit]]

    def search_products(self, query: str, limit: int = 8) -> List[Dict[str, Any]]:
        """
        Searches both official master catalogue (352 items) and legacy v2 catalogue (160 items)
        with prioritized multi-attribute scoring.
        """
        q = query.lower().strip()
        if not q:
            return []

        # 1. Exact SKU/ID match
        clean_code = q.upper()
        if clean_code in self.master_id_index:
            return [self.master_id_index[clean_code]]
        if clean_code in self.sku_index:
            return [self.sku_index[clean_code]]

        # Check for RZP-0001 or RZP-TI-001 pattern in query
        master_id_match = re.search(r'\b(RZP-\d+)\b', query, re.IGNORECASE)
        if master_id_match:
            code = master_id_match.group(1).upper()
            if code in self.master_id_index:
                return [self.master_id_index[code]]

        v2_sku_match = re.search(r'\b(RZP-[A-Z0-9]+-\d+)\b', query, re.IGNORECASE)
        if v2_sku_match:
            code = v2_sku_match.group(1).upper()
            if code in self.sku_index:
                return [self.sku_index[code]]

        # Search master catalog first
        master_matches = self.search_master_catalog(query, limit=limit)
        if master_matches:
            return master_matches

        # Fallback to v2 catalog
        if not self.v2_products:
            return []

        STOP_WORDS = {
            "can", "you", "give", "tell", "what", "which", "how", "why", "where",
            "for", "the", "and", "with", "have", "does", "are", "from", "this",
            "that", "please", "some", "any", "about", "your", "our", "all", "get", "like"
        }
        tokens = [t for t in re.split(r'\W+', q) if len(t) > 2 and t not in STOP_WORDS]
        if not tokens:
            return []

        scored = []
        for p in self.v2_products:
            score = 0
            name_low = p.get("name", "").lower()
            cat_low = p.get("category", "").lower()
            subcat_low = p.get("sub_category", "").lower()
            fitment_low = p.get("fitment", "").lower()
            features_low = p.get("features", "").lower()

            if q in name_low:
                score += 25
            if q in subcat_low:
                score += 20

            for t in tokens:
                if t in name_low:
                    score += 10
                if t in subcat_low:
                    score += 8
                if t in cat_low:
                    score += 5
                if t in fitment_low:
                    score += 4
                if t in features_low:
                    score += 3

            if score >= 6:
                scored.append((score, p))

        scored.sort(key=lambda x: x[0], reverse=True)
        return [p for _, p in scored[:limit]]

    def _load_v2_catalog(self):
        """Loads and indexes the legacy Riderzpro v2 catalog."""
        v2_json = os.path.join(KB_DIR, "v2_catalog_products.json")
        v2_excel = os.path.join(SCRATCH_DIR, "Riderzpro_Product_Catalogue_v2.xlsx")

        raw_products = []
        if os.path.exists(v2_json):
            try:
                with open(v2_json, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    raw_products = data.get("products", [])
                    if "v2_catalog_products.json" not in self.loaded_catalogs:
                        self.loaded_catalogs.append("v2_catalog_products.json")
            except Exception:
                pass

        if not raw_products and os.path.exists(v2_excel):
            try:
                import openpyxl
                wb = openpyxl.load_workbook(v2_excel, data_only=True)
                index_ws = wb["Index"]
                index_meta = {}
                for r in range(5, index_ws.max_row + 1):
                    pname = index_ws.cell(r, 2).value
                    if pname and str(pname).strip() != "Total variants":
                        index_meta[str(pname).strip()] = {
                            "category": str(index_ws.cell(r, 3).value or "").strip(),
                            "target": str(index_ws.cell(r, 4).value or "Both").strip()
                        }
                for sname in wb.sheetnames:
                    if sname == "Index":
                        continue
                    ws = wb[sname]
                    meta = index_meta.get(sname) or index_meta.get(sname.replace(" - ", " / ")) or {}
                    for r in range(5, ws.max_row + 1):
                        sku = ws.cell(r, 1).value
                        if sku and str(sku).strip().startswith("RZP"):
                            raw_products.append({
                                "sku_code": str(sku).strip(),
                                "name": str(ws.cell(r, 2).value or "").strip(),
                                "category": meta.get("category", "Accessories"),
                                "sub_category": sname,
                                "target_vehicle": meta.get("target", "Both"),
                                "material": str(ws.cell(r, 3).value or "").strip(),
                                "fitment": str(ws.cell(r, 4).value or "").strip(),
                                "colours": str(ws.cell(r, 5).value or "").strip(),
                                "features": str(ws.cell(r, 6).value or "").strip(),
                                "mrp": ws.cell(r, 7).value,
                                "selling_price": ws.cell(r, 8).value,
                                "discount_pct": ws.cell(r, 9).value,
                                "moq": ws.cell(r, 10).value,
                                "supplier": str(ws.cell(r, 11).value or "").strip(),
                                "status": str(ws.cell(r, 12).value or "Active").strip()
                            })
                if os.path.basename(v2_excel) not in self.loaded_catalogs:
                    self.loaded_catalogs.append(os.path.basename(v2_excel))
            except Exception:
                pass

        for p in raw_products:
            sku = p.get("sku_code", "").strip()
            if not sku:
                continue
            self.v2_products.append(p)
            self.sku_index[sku.upper()] = p
            self.sku_index[sku.lower()] = p

            cat = p.get("category", "General")
            self.categories.setdefault(cat, []).append(p)

    def get_product_by_sku(self, sku_code: str) -> Optional[Dict[str, Any]]:
        """Returns product details by SKU code (e.g. 'RZP-TI-001')."""
        return self.sku_index.get(sku_code.strip().upper())

    def _infer_electrical_specs(self, brand: str, model: str, v_type: str, range_km: Optional[int], top_speed: Optional[int]):
        b = brand.lower()
        m = model.lower()

        # Known OEM standards
        if "ather" in b:
            return 51.1, "44.0V - 58.4V", "Ather High-Flow Prop Plug", "Belt Drive (Gates Carbon)"
        if "ola" in b:
            return 72.0, "60.0V - 84.0V", "HyperCharge Dual-Pin", "Mid-drive reduction gearbox"
        if "tvs" in b and "iqube" in m:
            return 52.0, "45.0V - 58.8V", "TVS SmartConnect Plug", "BLDC Hub Motor"
        if "revolt" in b:
            return 72.0, "60.0V - 84.0V", "Revolt Quick-Swap Chogori", "High-tensile belt drive"
        if "chetak" in m or "bajaj" in b:
            return 48.0, "41.0V - 54.6V", "Bajaj Sealed Heavy-Duty", "Solid Helical Gear Drive"
        if "vida" in b or "hero" in b:
            return 50.4, "43.2V - 57.6V", "Hero Removable Modular", "PMSM belt drive"
        if "ultraviolette" in b:
            return 72.0, "60.0V - 88.0V", "UV Fast SuperCharge Port", "Chain Drive (Performance)"
        if "simple" in b:
            return 72.0, "60.0V - 84.0V", "Simple Loop Fast Plug", "Chain Drive"
        if "river" in b:
            return 51.1, "44.0V - 58.4V", "River Industrial Plug", "Belt Drive"

        # General inference by vehicle type and performance
        if v_type == "electric_motorcycle" or (top_speed and top_speed > 80):
            return 72.0, "60.0V - 84.0V", "High-Current Industrial DC Port", "Chain / Belt Drive"
        elif range_km and range_km > 100:
            return 60.0, "50.0V - 70.0V", "Standard Modular EV Connector", "BLDC Hub Motor"
        else:
            return 48.0, "40.0V - 56.0V", "Standard 48V Waterproof Plug", "BLDC Hub Motor"

    def _index_aliases(self, v_id: str, brand: str, model: str, variant: str):
        # Comprehensive alias generation
        b_clean = brand.lower().replace("electric", "").strip()
        m_clean = model.lower().replace("-", " ").strip()
        v_clean = variant.lower().strip()

        candidates = [
            f"{brand} {model}".lower().strip(),
            f"{b_clean} {m_clean}".strip(),
            f"{brand} {model} {variant}".lower().strip(),
            f"{m_clean}".strip(),
            f"{m_clean} {v_clean}".strip(),
            v_id.lower().replace("-", " "),
            v_id.lower()
        ]
        # Specific high-frequency user phrases
        if "ola" in b_clean and "s1" in m_clean:
            candidates.extend(["ola s1 pro", "ola s1", "ola s1 pro gen 2", "ola s1 air", "ola s1x", "ola"])
        if "ather" in b_clean:
            candidates.extend(["ather 450x", "ather 450", "ather 450x gen 3", "ather 450s", "ather rizta", "ather"])
        if "iqube" in m_clean:
            candidates.extend(["tvs iqube", "iqube", "tvs iqube st", "iqube st", "iqube s"])
        if "revolt" in b_clean or "rv" in m_clean:
            candidates.extend(["revolt rv400", "rv400", "revolt rv 400", "revolt rv1", "revolt"])
        if "chetak" in m_clean:
            candidates.extend(["bajaj chetak", "chetak", "chetak premium", "chetak urbane"])
        if "vida" in b_clean or "vida" in m_clean:
            candidates.extend(["hero vida", "vida v1", "vida v1 pro", "vida"])
        if "simple" in b_clean:
            candidates.extend(["simple one", "simple energy", "simple energy one"])
        if "ultraviolette" in b_clean or "f77" in m_clean:
            candidates.extend(["ultraviolette f77", "f77", "ultraviolette f77 mach 2"])

        for c in candidates:
            if len(c) > 2:
                self.alias_map[c] = v_id

    def find_vehicle(self, query: str) -> Optional[Dict[str, Any]]:
        """Resolves natural language vehicle references against the 116 catalog models."""
        q = query.lower().strip()

        # 1. Word boundary alias match
        for alias, v_id in self.alias_map.items():
            if re.search(r'\b' + re.escape(alias) + r'\b', q):
                return self.vehicle_index.get(v_id)

        # 2. Token match on brand + model
        for v in self.vehicles:
            b = v["brand"].lower()
            m = v["model"].lower()
            if re.search(r'\b' + re.escape(b) + r'\b', q) and any(re.search(r'\b' + re.escape(w) + r'\b', q) for w in m.split() if len(w) > 2):
                return v

        # 3. Model token match
        for v in self.vehicles:
            m = v["model"].lower()
            if len(m) > 3 and re.search(r'\b' + re.escape(m) + r'\b', q):
                return v

        # 4. Brand only match
        for v in self.vehicles:
            b = v["brand"].lower()
            if len(b) > 2 and re.search(r'\b' + re.escape(b) + r'\b', q):
                return v

        return None

    def find_vehicles_in_query(self, query: str) -> List[Dict[str, Any]]:
        """Finds distinct vehicles mentioned in a natural language query (for multi-vehicle comparisons)."""
        q = query.lower().strip()
        matched = []
        matched_brands = set()
        matched_ids = set()

        # 1. Alias matching sorted by descending length
        sorted_aliases = sorted(self.alias_map.keys(), key=len, reverse=True)
        for alias in sorted_aliases:
            if len(alias) > 2 and re.search(r'\b' + re.escape(alias) + r'\b', q):
                v_id = self.alias_map[alias]
                v = self.vehicle_index.get(v_id)
                if v and v["brand"] not in matched_brands and v_id not in matched_ids:
                    matched.append(v)
                    matched_brands.add(v["brand"])
                    matched_ids.add(v_id)

        # 2. Token match on brand + model
        for v in self.vehicles:
            b = v["brand"].lower()
            m = v["model"].lower()
            if v["brand"] in matched_brands or v["id"] in matched_ids:
                continue
            if re.search(r'\b' + re.escape(b) + r'\b', q) and any(re.search(r'\b' + re.escape(w) + r'\b', q) for w in m.split() if len(w) > 2):
                matched.append(v)
                matched_brands.add(v["brand"])
                matched_ids.add(v["id"])

        # 3. Brand only match if needed
        for v in self.vehicles:
            b = v["brand"].lower()
            if v["brand"] in matched_brands or v["id"] in matched_ids:
                continue
            if len(b) > 2 and re.search(r'\b' + re.escape(b) + r'\b', q):
                matched.append(v)
                matched_brands.add(v["brand"])
                matched_ids.add(v["id"])

        return matched

    def get_compatible_batteries(self, vehicle: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Matches batteries based on vehicle ID or voltage & connector compatibility."""
        v_id = vehicle.get("id")
        v_voltage = vehicle.get("nominal_voltage")
        v_connector = vehicle.get("connector_type")

        matched = []
        for b in self.batteries:
            # Direct ID match
            if v_id in b.get("compatible_bike_ids", []):
                bat = dict(b)
                bat["rebate_amount"] = settings.OLD_BATTERY_REBATE
                bat["effective_price_with_rebate"] = bat["price"] - settings.OLD_BATTERY_REBATE
                matched.append(bat)
            # Or voltage & connector compatibility match
            elif abs(b.get("voltage", 0) - v_voltage) < 1.0 and b.get("connector_type") == v_connector:
                bat = dict(b)
                bat["rebate_amount"] = settings.OLD_BATTERY_REBATE
                bat["effective_price_with_rebate"] = bat["price"] - settings.OLD_BATTERY_REBATE
                matched.append(bat)

        # If OEM specific pack isn't in catalog, create a certified custom spec card
        if not matched:
            matched.append({
                "id": f"bat_custom_{v_id}",
                "name": f"VoltFit Certified OEM-Replacement {v_voltage}V Pack",
                "brand": "VoltFit Certified",
                "chemistry": "LFP Automotive Grade",
                "voltage": v_voltage,
                "kwh": round(v_voltage * 40 / 1000, 2),
                "range_km": vehicle.get("claimed_range_km") or 100,
                "warranty_months": 48,
                "price": int(v_voltage * 650),
                "rebate_amount": settings.OLD_BATTERY_REBATE,
                "effective_price_with_rebate": int(v_voltage * 650) - settings.OLD_BATTERY_REBATE,
                "badge": "Certified Compatible",
                "connector_type": v_connector
            })

        return matched

    def get_compatible_parts(self, vehicle: Dict[str, Any]) -> List[Dict[str, Any]]:
        v_id = vehicle.get("id", "")
        v_brand = vehicle.get("brand", "").lower()
        v_model = vehicle.get("model", "").lower()

        matched = []
        for p in self.parts:
            compat = p.get("compatible_bike_ids", [])
            if v_id in compat:
                matched.append(p)
            elif any("revolt" in c for c in compat) and "revolt" in v_brand:
                matched.append(p)
            elif any("ather" in c for c in compat) and "ather" in v_brand:
                matched.append(p)
            elif any("ola" in c for c in compat) and "ola" in v_brand:
                matched.append(p)
            elif any("chetak" in c for c in compat) and "chetak" in v_model:
                matched.append(p)
            elif any("iqube" in c for c in compat) and "iqube" in v_model:
                matched.append(p)

        # Standard EV consumables if model-specific not present
        if not matched:
            matched.append({
                "id": f"part_chg_{v_id}",
                "category": "chargers",
                "name": f"Smart Auto-Cut {vehicle.get('nominal_voltage')}V Fast Charger",
                "specs": "Surge protection, IP65 weather-resistant, 16A socket compatible",
                "price": 6999,
                "warranty_months": 12
            })
            matched.append({
                "id": f"part_brake_{v_id}",
                "category": "brakes",
                "name": "EnduroCeramic Low-Dust EV Brake Pad Set",
                "specs": "Designed for regenerative braking friction and silent operation",
                "price": 850,
                "warranty_months": 6
            })
            matched.append({
                "id": f"part_tire_{v_id}",
                "category": "tires",
                "name": "MRF Zapper EV Low Rolling Resistance Tire Pair",
                "specs": "Silica compound adds +6% battery range with heavy EV load index",
                "price": 2800,
                "warranty_months": 36
            })

        # Append certified accessories from Riderzpro v2 catalog
        v2_accessories = [
            ("RZP-BBC-004", "accessories", 1299),
            ("RZP-TI-001", "tyre_care", 2499),
            ("RZP-PRK-001", "tyre_care", 499),
            ("RZP-ATD-003", "security", 899),
        ]
        for sku, cat, default_price in v2_accessories:
            prod = self.get_product_by_sku(sku)
            if prod:
                matched.append({
                    "id": f"part_{sku.lower().replace('-', '_')}",
                    "sku_code": prod["sku_code"],
                    "category": cat,
                    "name": f"{prod['name']} ({prod['sku_code']})",
                    "specs": f"{prod.get('features') or 'Standard'} | Material: {prod.get('material') or 'OEM'} | Fitment: {prod.get('fitment') or 'Universal'}",
                    "price": prod.get("selling_price") or default_price,
                    "warranty_months": 12
                })

        return matched


catalog_db = CatalogDatabase.get_instance()
