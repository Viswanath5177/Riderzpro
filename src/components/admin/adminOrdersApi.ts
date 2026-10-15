/**
 * Admin Orders API Layer & Mock Adapter
 *
 * Joins order records with customer, seller, rider, payment, and status history.
 * Polling every 6 seconds, pausing on background tab, and highlighting status changes.
 *
 * Real API endpoint: GET /api/admin/orders
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { USE_MOCK } from "./mockFlags";

// Re-export mock toggle flag for UI components
export { USE_MOCK };

// ==========================================
// TYPES & CONTRACT DEFINITIONS
// ==========================================

export type OrderStatus =
  | "PLACED"
  | "ACCEPTED"
  | "REJECTED"
  | "PACKED"
  | "RIDER_ASSIGNED"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentStatus = "PAID" | "COD_PENDING" | "PENDING" | "FAILED";

export interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

export interface StatusHistoryEntry {
  status: OrderStatus;
  timestamp: string;
  note?: string;
  source: "system" | "admin" | "seller" | "rider";
}

export interface AdminOrderJoined {
  id: string;
  orderNumber: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  city: string;
  sellerId: string;
  sellerName: string;
  sellerPhone: string;
  sellerAddress: string;
  status: OrderStatus;
  riderName: string | null;
  riderPhone: string | null;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  amount: number;
  items: OrderItem[];
  statusHistory: StatusHistoryEntry[];
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
// CORE API CALL: getAdminOrders
// ==========================================

export async function getAdminOrders(): Promise<AdminOrderJoined[]> {
  if (!import.meta.env.PROD && USE_MOCK) {
    const { getMockAdminOrders } = await import("./mocks/adminOrdersMock");
    return getMockAdminOrders();
  }

  const res = await fetch("/api/admin/orders", {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  if (res.status === 401 || res.status === 403) {
    throw new ApiError("Admin access required. Please sign in as an administrator.", res.status);
  }

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new ApiError(errBody.error || `Failed to fetch admin orders (${res.status})`, res.status);
  }

  const data = await res.json();
  const rawOrders: AdminOrderJoined[] = Array.isArray(data) ? data : data.orders || [];
  return rawOrders.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

// ==========================================
// REACT HOOK: useAdminOrders
// Auto-refreshes every 6 seconds, pauses when tab is hidden,
// and detects status changes to highlight rows.
// ==========================================

export interface UseAdminOrdersResult {
  orders: AdminOrderJoined[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  statusChangedIds: Set<string>;
}

export function useAdminOrders(): UseAdminOrdersResult {
  const [orders, setOrders] = useState<AdminOrderJoined[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusChangedIds, setStatusChangedIds] = useState<Set<string>>(new Set());

  const prevStatusesRef = useRef<Map<string, OrderStatus>>(new Map());
  const isFirstLoad = useRef(true);

  const fetchOrders = useCallback(async (isSilent = false) => {
    if (!isSilent) {
      setLoading(true);
    }
    setError(null);

    try {
      const fetched = await getAdminOrders();

      // Check for status changes since previous poll
      if (!isFirstLoad.current) {
        const changed = new Set<string>();
        fetched.forEach((ord) => {
          const prev = prevStatusesRef.current.get(ord.id);
          if (prev !== undefined && prev !== ord.status) {
            changed.add(ord.id);
          }
        });

        if (changed.size > 0) {
          setStatusChangedIds((current) => {
            const next = new Set(current);
            changed.forEach((id) => next.add(id));
            return next;
          });

          // Auto-fade highlight after 3.5 seconds
          setTimeout(() => {
            setStatusChangedIds((curr) => {
              const updated = new Set(curr);
              changed.forEach((id) => updated.delete(id));
              return updated;
            });
          }, 3500);
        }
      }

      // Update ref
      const nextMap = new Map<string, OrderStatus>();
      fetched.forEach((ord) => nextMap.set(ord.id, ord.status));
      prevStatusesRef.current = nextMap;
      isFirstLoad.current = false;

      setOrders(fetched);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load admin orders";
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

  // Polling every 6 seconds, pausing on background tab
  useEffect(() => {
    const INTERVAL_MS = 6000;
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

    const handleVisibility = () => {
      if (document.hidden) {
        stopTimer();
      } else {
        fetchOrders(true);
        startTimer();
      }
    };

    if (!document.hidden) {
      startTimer();
    }

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      stopTimer();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [fetchOrders]);

  return {
    orders,
    loading,
    error,
    refetch: () => fetchOrders(false),
    statusChangedIds,
  };
}
