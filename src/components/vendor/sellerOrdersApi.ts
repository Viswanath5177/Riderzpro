/**
 * Seller Orders API Layer & Mock Adapter
 *
 * Flow: Client orders -> Noida seller accepts & packs -> Rider assigned -> Picked up -> Delivered.
 * Real Seller API is managed by Vamsi.
 *
 * Mock mode is controlled via VITE_USE_MOCK in development only.
 * In production builds, USE_MOCK is always false and mock code is tree-shaken.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { USE_MOCK } from "./mockFlags";

// Re-export mock toggle flag for UI components
export { USE_MOCK };

// ==========================================
// TYPES & CONTRACT DEFINITIONS
// ==========================================

export type SellerOrderStatus =
  | "PLACED"
  | "ACCEPTED"
  | "REJECTED"
  | "PACKED"
  | "RIDER_ASSIGNED"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "CANCELLED";

export type SellerOrderAction = "accept" | "reject" | "packed";

export interface SellerOrderItem {
  name: string;
  qty: number;
  price: number;
}

export interface SellerOrderRider {
  name: string;
  phone: string;
}

export interface SellerOrder {
  id: string;
  orderNumber: string;
  createdAt: string; // ISO date string
  status: SellerOrderStatus;
  items: SellerOrderItem[];
  customerName: string;
  deliveryCity: string;
  amount: number;
  paymentMethod: string;
  paymentStatus: "PAID" | "PENDING" | "REFUNDED" | string;
  rider: SellerOrderRider | null;
  rejectReason?: string;
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
// API CLIENT IMPLEMENTATION
// ==========================================

/**
 * Fetch seller orders
 * Endpoint: GET /api/seller/orders
 * Identity is inferred from server cookie/session (never send seller_id)
 */
export async function getSellerOrders(): Promise<SellerOrder[]> {
  if (!import.meta.env.PROD && USE_MOCK) {
    const { getMockSellerOrders } = await import("./mocks/sellerOrdersMock");
    return getMockSellerOrders();
  }

  const res = await fetch("/api/seller/orders", {
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
    throw new ApiError("Access forbidden: you do not have seller permissions.", 403);
  }

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new ApiError(
      errBody.error || `Failed to fetch seller orders (${res.status})`,
      res.status,
    );
  }

  const data = await res.json();
  // Handle responses wrapped in { orders: [...] } or direct array
  const rawOrders: SellerOrder[] = Array.isArray(data) ? data : data.orders || [];
  return rawOrders.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

/**
 * Update seller order status
 * Endpoint: PATCH /api/seller/orders/:id
 * Body shape: { action, reason? }
 */
export async function updateSellerOrder(
  id: string,
  action: SellerOrderAction,
  reason?: string,
): Promise<SellerOrder> {
  if (!import.meta.env.PROD && USE_MOCK) {
    const { updateMockSellerOrder } = await import("./mocks/sellerOrdersMock");
    return updateMockSellerOrder(id, action, reason);
  }

  // Real API Call
  const payload: { action: SellerOrderAction; reason?: string } = { action };
  if (reason) {
    payload.reason = reason;
  }

  const res = await fetch(`/api/seller/orders/${encodeURIComponent(id)}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (res.status === 401) {
    if (typeof window !== "undefined") {
      window.location.href = "/vendor/auth";
    }
    throw new ApiError("Unauthorized. Please log in as a seller.", 401);
  }

  if (res.status === 403) {
    throw new ApiError("You are not authorized to update this order.", 403);
  }

  if (res.status === 409) {
    throw new ApiError("Order status was modified concurrently. Please refresh.", 409);
  }

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new ApiError(errBody.error || `Failed to update order (${res.status})`, res.status);
  }

  const json = await res.json();
  return json.order || json;
}

// ==========================================
// REACT HOOK: useSellerOrders
// ==========================================

export interface UseSellerOrdersResult {
  orders: SellerOrder[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  newOrderIds: Set<string>;
  clearNewOrderId: (id: string) => void;
}

export function useSellerOrders(): UseSellerOrdersResult {
  const [orders, setOrders] = useState<SellerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newOrderIds, setNewOrderIds] = useState<Set<string>>(new Set());

  // Track whether initial load has occurred
  const isInitialLoad = useRef(true);
  // Track known order IDs across polls
  const knownOrderIds = useRef<Set<string>>(new Set());

  const fetchOrders = useCallback(async (isSilent = false) => {
    if (!isSilent) {
      setLoading(true);
    }
    setError(null);

    try {
      const fetched = await getSellerOrders();

      // Check for newly arrived PLACED orders if not the first load
      if (!isInitialLoad.current) {
        const newlyPlaced = fetched.filter(
          (o) => o.status === "PLACED" && !knownOrderIds.current.has(o.id),
        );

        if (newlyPlaced.length > 0) {
          setNewOrderIds((prev) => {
            const next = new Set(prev);
            newlyPlaced.forEach((o) => next.add(o.id));
            return next;
          });
        }
      }

      // Update known IDs
      const currentIds = new Set<string>();
      fetched.forEach((o) => currentIds.add(o.id));
      knownOrderIds.current = currentIds;

      isInitialLoad.current = false;
      setOrders(fetched);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load seller orders";
      setError(msg);
    } finally {
      if (!isSilent) {
        setLoading(false);
      }
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchOrders(false);
  }, [fetchOrders]);

  // Subscribe to mock state changes for instant UI reaction in mock mode
  useEffect(() => {
    if (!import.meta.env.PROD && USE_MOCK) {
      let cleanup: (() => void) | undefined;
      import("./mocks/sellerOrdersMock").then((m) => {
        cleanup = m.subscribeOrdersUpdates(() => {
          fetchOrders(true);
        });
      });
      return () => {
        cleanup?.();
      };
    }
  }, [fetchOrders]);

  // Polling every 10 seconds, pausing when document is hidden
  useEffect(() => {
    const INTERVAL_MS = 10000;
    let timerId: NodeJS.Timeout | null = null;

    const startTimer = () => {
      if (!timerId) {
        timerId = setInterval(() => {
          if (document.visibilityState === "visible") {
            fetchOrders(true);
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
        // Tab became visible again: refresh immediately and restart timer
        fetchOrders(true);
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
  }, [fetchOrders]);

  const clearNewOrderId = useCallback((id: string) => {
    setNewOrderIds((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  return {
    orders,
    loading,
    error,
    refetch: () => fetchOrders(false),
    newOrderIds,
    clearNewOrderId,
  };
}
