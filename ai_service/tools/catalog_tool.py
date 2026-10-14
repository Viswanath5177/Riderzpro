"""
Riderzpro Catalog & Guaranteed Fitment Engine Tool
Backed by CatalogDatabase indexing 116+ vehicles across 50 Indian EV brands
from scratch/ev_two_wheeler_catalog.json and bikewale_ev_image_manifest.json.
"""

from typing import Dict, List, Optional, Any
from ai_service.database import catalog_db
from ai_service.config import settings


class CatalogTool:
    def __init__(self):
        self.db = catalog_db

    def find_bike_by_query(self, query: str) -> Optional[Dict[str, Any]]:
        """
        Resolves vehicle references against the comprehensive 116-model catalog.
        """
        return self.db.find_vehicle(query)

    def find_vehicles_in_query(self, query: str) -> List[Dict[str, Any]]:
        """
        Resolves multiple distinct vehicles for side-by-side comparison.
        """
        return self.db.find_vehicles_in_query(query)

    def get_compatible_batteries(self, bike_id: str) -> List[Dict[str, Any]]:
        """
        Returns guaranteed certified batteries compatible with the vehicle.
        """
        v = self.db.vehicle_index.get(bike_id)
        if not v:
            # Fallback by model search
            v = self.db.find_vehicle(bike_id)
        if not v:
            return []
        return self.db.get_compatible_batteries(v)

    def get_compatible_parts(self, bike_id: str, category: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Returns compatible replacement parts (chargers, belts, brakes, tires, electronics).
        """
        v = self.db.vehicle_index.get(bike_id)
        if not v:
            v = self.db.find_vehicle(bike_id)
        if not v:
            return []

        all_parts = self.db.get_compatible_parts(v)
        if category:
            return [p for p in all_parts if p.get("category", "").lower() == category.lower()]
        return all_parts

    def execute_fitment_lookup(self, vehicle_query: str, category: Optional[str] = None) -> Dict[str, Any]:
        """
        High-level fitment query executed by the AI Agent.
        """
        bike = self.find_bike_by_query(vehicle_query)
        if not bike:
            return {
                "status": "not_found",
                "message": f"Vehicle '{vehicle_query}' not recognized in Riderzpro 116-model database. Live web search required.",
                "total_catalog_models": len(self.db.vehicles)
            }

        compatible_batteries = self.db.get_compatible_batteries(bike)
        compatible_parts = self.db.get_compatible_parts(bike)
        if category:
            compatible_parts = [p for p in compatible_parts if p.get("category", "").lower() == category.lower()]

        return {
            "status": "success",
            "matched_vehicle": {
                "id": bike["id"],
                "brand": bike["brand"],
                "model": bike["model"],
                "variant": bike.get("variant", "Base"),
                "full_name": bike.get("full_name"),
                "nominal_voltage": bike["nominal_voltage"],
                "voltage_range": bike.get("voltage_range", f"{bike['nominal_voltage']}V operating standard"),
                "connector_type": bike["connector_type"],
                "drive_type": bike["drive_type"],
                "price_inr": bike.get("price_inr"),
                "claimed_range_km": bike.get("claimed_range_km"),
                "top_speed_kmh": bike.get("top_speed_kmh"),
                "charging_time": bike.get("charging_time"),
                "image_url": bike.get("image_url")
            },
            "compatible_batteries": compatible_batteries,
            "compatible_parts": compatible_parts,
            "installation_options": {
                "doorstep": {
                    "fee": settings.DOORSTEP_FEE,
                    "description": "Certified technician visits your home with full mobile diagnostic kit"
                },
                "service_center": {
                    "fee": settings.SERVICE_CENTER_FEE,
                    "description": "Drop off at nearest Riderzpro Certified EV Bay"
                },
                "old_battery_exchange_rebate": settings.OLD_BATTERY_REBATE
            }
        }

    def search_products(self, query: str, limit: int = 8) -> List[Dict[str, Any]]:
        """
        Searches the master and v2 catalogs for matching products by ID, name, category, brand, or fitment.
        """
        return self.db.search_products(query, limit)

    def get_product_by_id(self, product_id: str) -> Optional[Dict[str, Any]]:
        """
        Retrieves a product from the master catalog by Product ID (e.g. 'RZP-0001').
        """
        return self.db.get_product_by_id(product_id)

    def get_product_by_sku(self, sku_code: str) -> Optional[Dict[str, Any]]:
        """
        Retrieves a product from the v2 catalog by exact SKU code.
        """
        return self.db.get_product_by_sku(sku_code)

    def find_products_by_vehicle(self, vehicle: str, category: Optional[str] = None, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Finds accessories and upgrades custom-fitted for a specific 4-wheeler / SUV model.
        """
        return self.db.find_products_by_vehicle(vehicle, category, limit)

    def find_products_by_brand(self, brand: str, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Finds products manufactured by a specific brand (e.g. 'Blaupunkt', 'RECOIL', 'Autoform', 'Riderzpro').
        """
        return self.db.find_products_by_brand(brand, limit)

    def find_products_by_category(self, category: str, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Finds products in a specific category or department.
        """
        return self.db.find_products_by_category(category, limit)


catalog_tool = CatalogTool()

