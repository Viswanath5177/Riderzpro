/**
 * Seller Inventory API Layer & Mock Adapter
 *
 * Provides real-time stock levels, product catalog, and stock mutation tracking.
 * Syncs automatically with seller orders (drops stock when an order is accepted).
 *
 * Real Seller API is managed by Vamsi.
 * Endpoint assumed: GET /api/seller/inventory
 */

import { useState, useEffect, useCallback, useRef } from "react";

// ==========================================
// CONFIGURATION & TOGGLE FLAG
// ==========================================
// Set VITE_USE_MOCK_SELLER_INVENTORY="true" to force mocks. Default is live.
export const USE_MOCK = import.meta.env.VITE_USE_MOCK_SELLER_INVENTORY === "true";

// ==========================================
// TYPES & CONTRACT DEFINITIONS
// ==========================================

export type StockStatus = "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";

export interface SellerInventoryProduct {
  id: string;
  name: string;
  category: string;
  sku: string;
  price: number;
  mrp: number;
  gstPercent: number;
  stock: number;
  minStockAlert: number;
  imageUrl: string;
  condition: "New" | "Refurbished";
  partType: "OEM" | "OES" | "Aftermarket";
  status: "live" | "draft" | "out_of_stock";
  updatedAt: string;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// ==========================================
// INITIAL MOCK INVENTORY (Noida EV Spares)
// Matches items present in seller orders
// ==========================================

const initialMockInventory: SellerInventoryProduct[] = [
  {
    id: "prod_noida_01",
    name: "Ather 450X Ceramic Brake Pad Set",
    category: "Brakes & Discs",
    sku: "ATH-BRK-450X",
    price: 1450,
    mrp: 1750,
    gstPercent: 18,
    stock: 8,
    minStockAlert: 5,
    imageUrl: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=300&q=80",
    condition: "New",
    partType: "OEM",
    status: "live",
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "prod_noida_02",
    name: "Fast Charger Cable 15A (Type 2)",
    category: "Smart Chargers",
    sku: "CHG-CBL-15A",
    price: 2899,
    mrp: 3499,
    gstPercent: 18,
    stock: 4, // Low stock (<= 5)
    minStockAlert: 5,
    imageUrl: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=300&q=80",
    condition: "New",
    partType: "OEM",
    status: "live",
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: "prod_noida_03",
    name: "Ola S1 Pro Heavy Duty Belt Drive",
    category: "Drivetrain & Belts",
    sku: "OLA-BLT-S1P",
    price: 3200,
    mrp: 3800,
    gstPercent: 18,
    stock: 12,
    minStockAlert: 5,
    imageUrl: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=300&q=80",
    condition: "New",
    partType: "OEM",
    status: "live",
    updatedAt: new Date(Date.now() - 10800000).toISOString(),
  },
  {
    id: "prod_noida_04",
    name: "High-Visibility LED Handlebar Indicators",
    category: "Lighting & Electricals",
    sku: "LGT-IND-LED2",
    price: 950,
    mrp: 1200,
    gstPercent: 18,
    stock: 15,
    minStockAlert: 5,
    imageUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300&q=80",
    condition: "New",
    partType: "Aftermarket",
    status: "live",
    updatedAt: new Date(Date.now() - 14400000).toISOString(),
  },
  {
    id: "prod_noida_05",
    name: "Chetak Smart Key Fob Replacement",
    category: "Electronics",
    sku: "BAJ-FOB-CHT",
    price: 1850,
    mrp: 2200,
    gstPercent: 18,
    stock: 3, // Low stock
    minStockAlert: 5,
    imageUrl: "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=300&q=80",
    condition: "New",
    partType: "OEM",
    status: "live",
    updatedAt: new Date(Date.now() - 18000000).toISOString(),
  },
  {
    id: "prod_noida_06",
    name: "TVS iQube Throttle Position Sensor (TPS)",
    category: "Sensors & Switches",
    sku: "TVS-TPS-IQB",
    price: 2100,
    mrp: 2600,
    gstPercent: 18,
    stock: 0, // Out of stock
    minStockAlert: 5,
    imageUrl: "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=300&q=80",
    condition: "New",
    partType: "OES",
    status: "out_of_stock",
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "prod_noida_07",
    name: "Lithium Pack Thermal Insulation Wrap",
    category: "Battery & Thermal",
    sku: "BAT-THM-WRP",
    price: 799,
    mrp: 999,
    gstPercent: 18,
    stock: 24,
    minStockAlert: 5,
    imageUrl: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=300&q=80",
    condition: "New",
    partType: "Aftermarket",
    status: "live",
    updatedAt: new Date(Date.now() - 43200000).toISOString(),
  },
  {
    id: "prod_noida_08",
    name: "Ather 450X Idler Tension Pulley",
    category: "Drivetrain & Belts",
    sku: "ATH-PLY-TEN",
    price: 1100,
    mrp: 1400,
    gstPercent: 18,
    stock: 5, // Exactly 5 = Low stock
    minStockAlert: 5,
    imageUrl: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=300&q=80",
    condition: "New",
    partType: "OEM",
    status: "live",
    updatedAt: new Date(Date.now() - 25000000).toISOString(),
  },
];

// In-memory mutable state for mock session
const mockInventoryState: SellerInventoryProduct[] = [...initialMockInventory];

// Listeners for mock state changes
type InventoryListener = () => void;
const inventoryListeners = new Set<InventoryListener>();

export function notifyInventoryListeners() {
  inventoryListeners.forEach((fn) => {
    try {
      fn();
    } catch (err) {
      console.error("Inventory listener error:", err);
    }
  });
}

export function subscribeInventoryUpdates(listener: InventoryListener) {
  inventoryListeners.add(listener);
  return () => {
    inventoryListeners.delete(listener);
  };
}

/**
 * Reduce mock stock by items in an accepted order
 */
export function reduceMockStockByOrderItems(items: Array<{ name: string; qty: number }>) {
  if (!USE_MOCK) return;

  let changed = false;
  items.forEach((item) => {
    const idx = mockInventoryState.findIndex(
      (p) =>
        p.name.toLowerCase() === item.name.toLowerCase() ||
        item.name.toLowerCase().includes(p.name.toLowerCase()) ||
        p.name.toLowerCase().includes(item.name.toLowerCase()),
    );

    if (idx !== -1) {
      const current = mockInventoryState[idx];
      const newStock = Math.max(0, current.stock - item.qty);
      mockInventoryState[idx] = {
        ...current,
        stock: newStock,
        status: newStock === 0 ? "out_of_stock" : current.status,
        updatedAt: new Date().toISOString(),
      };
      changed = true;
    }
  });

  if (changed) {
    notifyInventoryListeners();
  }
}

// ==========================================
// CORE API CALL: getSellerInventory
// ==========================================

export async function getSellerInventory(): Promise<SellerInventoryProduct[]> {
  if (USE_MOCK) {
    // Artificial 250ms network delay
    await new Promise((r) => setTimeout(r, 250));
    return [...mockInventoryState];
  }

  const res = await fetch("/api/seller/inventory", {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  if (res.status === 401) {
    if (typeof window !== "undefined") {
      window.location.href = "/vendor/auth";
    }
    throw new ApiError("Session expired. Please sign in again.", 401);
  }

  if (res.status === 403) {
    throw new ApiError("Access forbidden: you do not have seller inventory permissions.", 403);
  }

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new ApiError(
      errBody.error || `Failed to fetch seller inventory (${res.status})`,
      res.status,
    );
  }

  const data = await res.json();
  const rawProducts: SellerInventoryProduct[] = Array.isArray(data)
    ? data
    : data.products || data.inventory || [];
  return rawProducts;
}

// ==========================================
// REACT HOOK: useSellerInventory
// ==========================================

export interface UseSellerInventoryResult {
  products: SellerInventoryProduct[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  deltas: Record<string, number>; // productId -> delta quantity (e.g. -2)
  flashingIds: Set<string>; // set of product IDs currently flashing
}

export function useSellerInventory(): UseSellerInventoryResult {
  const [products, setProducts] = useState<SellerInventoryProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deltas, setDeltas] = useState<Record<string, number>>({});
  const [flashingIds, setFlashingIds] = useState<Set<string>>(new Set());

  // Track previous stock counts by ID across polls
  const prevStockRef = useRef<Map<string, number>>(new Map());
  const isFirstLoad = useRef(true);

  const fetchInventory = useCallback(async (isSilent = false) => {
    if (!isSilent) {
      setLoading(true);
    }
    setError(null);

    try {
      const fetched = await getSellerInventory();

      // Detect stock level changes
      if (!isFirstLoad.current) {
        const newDeltas: Record<string, number> = {};
        const newFlashes = new Set<string>();

        fetched.forEach((item) => {
          const prev = prevStockRef.current.get(item.id);
          if (prev !== undefined && prev !== item.stock) {
            const diff = item.stock - prev;
            newDeltas[item.id] = diff;
            newFlashes.add(item.id);
          }
        });

        if (newFlashes.size > 0) {
          setDeltas((prev) => ({ ...prev, ...newDeltas }));
          setFlashingIds((prev) => {
            const next = new Set(prev);
            newFlashes.forEach((id) => next.add(id));
            return next;
          });

          // Auto-clear flash & delta badge after 3.5 seconds
          setTimeout(() => {
            setFlashingIds((current) => {
              const updated = new Set(current);
              newFlashes.forEach((id) => updated.delete(id));
              return updated;
            });
            setDeltas((curr) => {
              const copy = { ...curr };
              newFlashes.forEach((id) => delete copy[id]);
              return copy;
            });
          }, 3500);
        }
      }

      // Update ref with latest stocks
      const nextMap = new Map<string, number>();
      fetched.forEach((item) => nextMap.set(item.id, item.stock));
      prevStockRef.current = nextMap;
      isFirstLoad.current = false;

      setProducts(fetched);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load seller inventory";
      setError(msg);
    } finally {
      if (!isSilent) {
        setLoading(false);
      }
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchInventory(false);
  }, [fetchInventory]);

  // Subscribe to mock / order mutation events
  useEffect(() => {
    const unsubscribe = subscribeInventoryUpdates(() => {
      fetchInventory(true);
    });
    return unsubscribe;
  }, [fetchInventory]);

  // Polling every 10 seconds, pausing when document is hidden
  useEffect(() => {
    const INTERVAL_MS = 10000;
    let timerId: NodeJS.Timeout | null = null;

    const startTimer = () => {
      if (!timerId) {
        timerId = setInterval(() => {
          if (document.visibilityState === "visible") {
            fetchInventory(true);
          }
        }, INTERVAL_MS);
      }
    };

    const stopTimer = () => {
      if (timerId) {
        clearInterval(timerId);
        timerId = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopTimer();
      } else {
        fetchInventory(true);
        startTimer();
      }
    };

    if (!document.hidden) {
      startTimer();
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stopTimer();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchInventory]);

  return {
    products,
    loading,
    error,
    refetch: () => fetchInventory(false),
    deltas,
    flashingIds,
  };
}
