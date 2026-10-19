import { useState, useEffect, useMemo, useCallback } from "react";
import {
  products as STATIC_PRODUCTS,
  vendors as STATIC_VENDORS,
  Product,
  Vendor,
  Category,
  mapDbProductToProduct,
} from "./data";
import { INITIAL_SEED_VENDORS, INITIAL_SEED_PRODUCTS } from "./vendor/seedData";
import { Vendor as VendorRecord, VendorProduct } from "./vendor/types";

const VENDORS_STORAGE_KEY = "riderzpro_vendors";
const PRODUCTS_STORAGE_KEY = "riderzpro_vendor_products";

export interface CatalogueVendor extends Vendor {
  storeSlug: string;
  logoUrl?: string;
  bannerUrl?: string;
  tagline?: string;
  description?: string;
  isVerified?: boolean;
  isSuspended?: boolean;
  holidayMode?: boolean;
}

export interface CatalogueProduct extends Product {
  vendorStoreId?: string;
  isLiveVendorProduct?: boolean;
  sku?: string;
  hsnCode?: string;
  gstRate?: number;
  partType?: "OEM" | "Genuine" | "Aftermarket";
  pendingRevision?: unknown;
}

function getStoredVendors(): VendorRecord[] {
  if (typeof window === "undefined" || typeof localStorage === "undefined")
    return INITIAL_SEED_VENDORS || [];
  try {
    const raw = localStorage.getItem(VENDORS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(VENDORS_STORAGE_KEY, JSON.stringify(INITIAL_SEED_VENDORS || []));
      return INITIAL_SEED_VENDORS || [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_SEED_VENDORS || [];
  } catch {
    return INITIAL_SEED_VENDORS || [];
  }
}

function getStoredProducts(): VendorProduct[] {
  if (typeof window === "undefined" || typeof localStorage === "undefined")
    return INITIAL_SEED_PRODUCTS || [];
  try {
    const raw = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(INITIAL_SEED_PRODUCTS || []));
      return INITIAL_SEED_PRODUCTS || [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_SEED_PRODUCTS || [];
  } catch {
    return INITIAL_SEED_PRODUCTS || [];
  }
}

/**
 * Returns merged vendors: static seed vendors + approved live vendor records.
 */
export function getCatalogueVendors(): CatalogueVendor[] {
  const dynamicVendors = getStoredVendors();

  // Map dynamic vendors
  const dynamicMapped: CatalogueVendor[] = dynamicVendors
    .filter((v) => v.status === "approved" && !v.isSuspended)
    .map((v) => ({
      id: v.id,
      name: v.storeName,
      area: v.area || v.onboarding?.shipping?.pickupAddress?.city || "Indiranagar",
      lat: v.onboarding?.shipping?.lat || 12.9784,
      lng: v.onboarding?.shipping?.lng || 77.6408,
      rating: v.rating || 4.8,
      prepMins: v.prepMins || v.onboarding?.shipping?.prepMins || 15,
      storeSlug: v.storeSlug || v.id,
      logoUrl: v.onboarding?.store?.logoUrl,
      bannerUrl: v.onboarding?.store?.bannerUrl,
      tagline: v.onboarding?.store?.tagline,
      description: v.onboarding?.store?.description,
      isVerified: true,
      isSuspended: v.isSuspended,
      holidayMode: v.onboarding?.store?.holidayMode,
    }));

  // Create a map to deduplicate by id (dynamic overrides static if same id, e.g. v1)
  const map = new Map<string, CatalogueVendor>();

  STATIC_VENDORS.forEach((sv) => {
    map.set(sv.id, {
      ...sv,
      storeSlug: sv.id,
      isVerified: true,
      isSuspended: false,
    });
  });

  dynamicMapped.forEach((dv) => {
    map.set(dv.id, dv);
  });

  return Array.from(map.values());
}

/**
 * Finds a single vendor by ID or slug.
 */
export function getCatalogueVendor(idOrSlug: string): CatalogueVendor | undefined {
  const all = getCatalogueVendors();
  return all.find((v) => v.id === idOrSlug || v.storeSlug === idOrSlug);
}

/**
 * Product Visibility Gate (Prompt 7b):
 * A product is shown to customers ONLY if:
 * 1. status === "live"
 * 2. Vendor is "approved" and NOT suspended and NOT on holiday mode
 */
export function isVendorProductVisible(
  vp: VendorProduct,
  vendorsMap: Map<string, VendorRecord>,
): boolean {
  if (vp.status !== "live") return false;
  const vendor = vendorsMap.get(vp.vendorId);
  if (!vendor) return false;
  if (vendor.status !== "approved") return false;
  if (vendor.isSuspended) return false;
  if (vendor.onboarding?.store?.holidayMode) return false;
  return true;
}

/**
 * Returns merged products: static catalog + live approved vendor products & offers.
 */
export function getCatalogueProducts(options?: {
  includeOutOfStock?: boolean;
}): CatalogueProduct[] {
  const storedVendors = getStoredVendors();
  const storedProducts = getStoredProducts();

  const vendorsMap = new Map<string, VendorRecord>();
  storedVendors.forEach((v) => vendorsMap.set(v.id, v));

  // Deep clone static products so we can safely attach new vendor offers
  const mergedProducts: CatalogueProduct[] = STATIC_PRODUCTS.map((sp) => ({
    ...sp,
    offers: [...sp.offers],
    isLiveVendorProduct: false,
  }));

  const productMap = new Map<string, CatalogueProduct>();
  mergedProducts.forEach((p) => productMap.set(p.id, p));

  // Process vendor products
  storedProducts.forEach((vp) => {
    if (!isVendorProductVisible(vp, vendorsMap)) {
      return; // Gate failed - NEVER show
    }

    // Check if this is an offer on an existing product
    if (vp.id.startsWith("offer_")) {
      const targetProductId = vp.id.replace(/^offer_/, "").split("_")[0];
      const targetProduct = productMap.get(targetProductId);
      if (targetProduct) {
        // Replace or add offer
        const existingOfferIdx = targetProduct.offers.findIndex((o) => o.vendorId === vp.vendorId);
        const newOffer = {
          vendorId: vp.vendorId,
          price: vp.sellingPrice,
          stock: vp.stock,
        };
        if (existingOfferIdx >= 0) {
          targetProduct.offers[existingOfferIdx] = newOffer;
        } else {
          targetProduct.offers.push(newOffer);
        }
      }
      return;
    }

    // Otherwise, this is a new standalone vendor product
    const parsedVoltage = vp.specs?.["voltage"]
      ? parseInt(String(vp.specs["voltage"]).replace(/\D/g, ""), 10)
      : undefined;
    const parsedCapacity = vp.specs?.["capacityAh"]
      ? parseFloat(String(vp.specs["capacityAh"]))
      : undefined;
    const rawChemistry = vp.specs?.["chemistry"];
    const chemistryStr = typeof rawChemistry === "string" ? rawChemistry : undefined;

    const catalogProd: CatalogueProduct = {
      id: vp.id,
      name: vp.title,
      brand: vp.brand,
      category: vp.category,
      image:
        vp.images?.[0] ||
        "https://images.unsplash.com/photo-1558441719-8b489c652758?w=500&auto=format&fit=crop&q=80",
      voltage: parsedVoltage,
      capacityAh: parsedCapacity,
      chemistry: chemistryStr,
      warrantyMonths: vp.warrantyMonths || 12,
      weightKg: vp.weightKg || 1,
      fits: vp.fits || [],
      description: vp.description || "",
      offers: [
        {
          vendorId: vp.vendorId,
          price: vp.sellingPrice,
          stock: vp.stock,
        },
      ],
      vendorStoreId: vp.vendorId,
      isLiveVendorProduct: true,
      sku: vp.sku,
      hsnCode: vp.hsnCode,
      gstRate: vp.gstRate,
      partType: vp.partType,
      pendingRevision: vp.pendingRevision,
    };

    productMap.set(vp.id, catalogProd);
  });

  let results = Array.from(productMap.values());

  if (!options?.includeOutOfStock) {
    // Hide items that have 0 total stock across all active offers for general discovery
    // (Notice: direct product page will pass includeOutOfStock: true)
    results = results.filter((p) => p.offers.some((o) => o.stock > 0));
  }

  return results;
}

/**
 * Retrieves a single product by ID.
 * Enforces the visibility gate: if product is not live or vendor is not approved, returns undefined (404).
 */
export function getCatalogueProduct(id: string): CatalogueProduct | undefined {
  const all = getCatalogueProducts({ includeOutOfStock: true });
  return all.find((p) => p.id === id);
}

/**
 * Reactive hook for customer components to consume the live catalogue with cross-tab sync.
 */
export function useCatalogue() {
  const [version, setVersion] = useState(0);
  const [dbProducts, setDbProducts] = useState<CatalogueProduct[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          const mapped = res.data.map((row: any) => mapDbProductToProduct(row) as CatalogueProduct);
          setDbProducts(mapped);
        }
      })
      .catch(() => {});
  }, [version]);

  useEffect(() => {
    const handleSync = () => setVersion((v) => v + 1);

    // Cross-tab storage listener
    window.addEventListener("storage", handleSync);

    // BroadcastChannel listener
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel("riderzpro_vendor_bus");
      channel.onmessage = () => handleSync();
    } catch {
      // BroadcastChannel unavailable
    }

    return () => {
      window.removeEventListener("storage", handleSync);
      if (channel) channel.close();
    };
  }, []);

  const products = useMemo(() => {
    void version;
    if (dbProducts.length > 0) return dbProducts;
    return getCatalogueProducts({ includeOutOfStock: true });
  }, [version, dbProducts]);

  const vendors = useMemo(() => {
    void version;
    return getCatalogueVendors();
  }, [version]);

  const getProduct = useCallback(
    (id: string) => {
      void version;
      if (dbProducts.length > 0) {
        const found = dbProducts.find((p) => p.id === id);
        if (found) return found;
      }
      return getCatalogueProduct(id);
    },
    [version, dbProducts],
  );

  const getVendor = useCallback(
    (id: string) => {
      void version;
      return getCatalogueVendor(id);
    },
    [version],
  );

  return {
    products,
    vendors,
    getProduct,
    getVendor,
    refetch: () => setVersion((v) => v + 1),
  };
}
