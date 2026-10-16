/**
 * Seller Inventory API Layer & Mock Adapter
 *
 * Provides real-time stock levels, product catalog, and stock mutation tracking.
 * Syncs automatically with seller orders (drops stock when an order is accepted).
 *
 * Real Seller API is managed by Vamsi.
 * Endpoint: GET /api/seller/inventory
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { USE_MOCK } from "./mockFlags";

// Re-export mock toggle flag for UI components
export { USE_MOCK };

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

// Backward-compatible mock mutation helpers (dynamically loaded behind USE_MOCK)
export async function reduceMockStockByOrderItems(items: Array<{ name: string; qty: number }>) {
  if (!import.meta.env.PROD && USE_MOCK) {
    const { reduceMockStockByOrderItems: fn } = await import("./mocks/sellerInventoryMock");
    fn(items);
  }
}

export async function notifyInventoryListeners() {
  if (!import.meta.env.PROD && USE_MOCK) {
    const { notifyInventoryListeners: fn } = await import("./mocks/sellerInventoryMock");
    fn();
  }
}

// ==========================================
// CORE API CALL: getSellerInventory
// ==========================================

export async function getSellerInventory(): Promise<SellerInventoryProduct[]> {
  if (!import.meta.env.PROD && USE_MOCK) {
    const { getMockInventory } = await import("./mocks/sellerInventoryMock");
    return getMockInventory();
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

  // Subscribe to mock / order mutation events in mock mode
  useEffect(() => {
    if (!import.meta.env.PROD && USE_MOCK) {
      let cleanup: (() => void) | undefined;
      import("./mocks/sellerInventoryMock").then((m) => {
        cleanup = m.subscribeInventoryUpdates(() => {
          fetchInventory(true);
        });
      });
      return () => {
        cleanup?.();
      };
    }
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
