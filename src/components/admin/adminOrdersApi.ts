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

export interface AdminOrdersSummary {
  total: number;
  inProgress: number;
  delivered: number;
  awaitingSeller: number;
  unassignedRider: number;
}

export interface AdminOrderJoined {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: OrderStatus;
  customerName: string;
  customerPhone?: string;
  deliveryAddress?: string;
  city?: string;
  seller?: {
    id: string;
    name: string;
  };
  sellerId: string;
  sellerName: string;
  sellerPhone?: string;
  sellerAddress?: string;
  rider?: {
    id: string;
    name: string;
    phone: string;
  } | null;
  riderName: string | null;
  riderPhone: string | null;
  payment?: {
    method: string;
    status: PaymentStatus;
  };
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  amount: number;
  items: OrderItem[];
  statusHistory: StatusHistoryEntry[] | null;
}

export interface GetAdminOrdersParams {
  status?: string;
  seller?: string;
  payment?: string;
  q?: string;
  limit?: number;
  cursor?: string;
}

export interface GetAdminOrdersResult {
  orders: AdminOrderJoined[];
  summary: AdminOrdersSummary;
  nextCursor: string | null;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function normalizeAdminOrder(raw: any): AdminOrderJoined {
  const sellerId = raw.seller?.id || raw.sellerId || raw.seller_id || "";
  const sellerName = raw.seller?.name || raw.sellerName || raw.seller_name || "Seller Hub";
  const sellerObj = { id: sellerId, name: sellerName };

  const riderId = raw.rider?.id || raw.riderId || raw.rider_id || null;
  const riderName = raw.rider?.name || raw.riderName || raw.rider_name || null;
  const riderPhone = raw.rider?.phone || raw.riderPhone || raw.rider_phone || "";
  const riderObj =
    raw.rider !== undefined
      ? raw.rider
      : riderName
        ? { id: riderId || "", name: riderName, phone: riderPhone }
        : null;

  const paymentMethod = raw.payment?.method || raw.paymentMethod || raw.payment_method || "UPI";
  const rawPayStatus = (
    raw.payment?.status ||
    raw.paymentStatus ||
    raw.payment_status ||
    "PENDING"
  ).toUpperCase();
  let paymentStatus: PaymentStatus = "PENDING";
  if (rawPayStatus === "PAID") paymentStatus = "PAID";
  else if (rawPayStatus === "COD_PENDING" || rawPayStatus === "COD") paymentStatus = "COD_PENDING";
  else if (rawPayStatus === "FAILED") paymentStatus = "FAILED";

  const paymentObj = {
    method: paymentMethod,
    status: paymentStatus,
  };

  const rawStatus = (raw.status || raw.raw_status || raw.delivery_status || "PLACED").toUpperCase();
  let status: OrderStatus = "PLACED";
  if (
    [
      "PLACED",
      "ACCEPTED",
      "REJECTED",
      "PACKED",
      "RIDER_ASSIGNED",
      "PICKED_UP",
      "IN_TRANSIT",
      "DELIVERED",
      "CANCELLED",
    ].includes(rawStatus)
  ) {
    status = rawStatus as OrderStatus;
  } else if (rawStatus === "PENDING" || rawStatus === "CONFIRMED") {
    status = "PLACED";
  } else if (rawStatus === "READY_FOR_PICKUP") {
    status = "PACKED";
  }

  const amount = Number(
    raw.amount !== undefined ? raw.amount : raw.total_amount !== undefined ? raw.total_amount : 0,
  );

  return {
    id: raw.id,
    orderNumber: raw.orderNumber || raw.order_number || `RZ-${String(raw.id).slice(-6)}`,
    createdAt: raw.createdAt || raw.created_at || new Date().toISOString(),
    status,
    customerName: raw.customerName || raw.customer_name || "Customer",
    customerPhone: raw.customerPhone || raw.customer_phone || "",
    deliveryAddress: raw.deliveryAddress || raw.delivery_address || "",
    city: raw.city || "",
    seller: sellerObj,
    sellerId: sellerObj.id,
    sellerName: sellerObj.name,
    sellerPhone: raw.sellerPhone || raw.seller_phone || "",
    sellerAddress: raw.sellerAddress || raw.seller_address || "",
    rider: riderObj,
    riderName: riderObj ? riderObj.name : null,
    riderPhone: riderObj ? riderObj.phone : null,
    payment: paymentObj,
    paymentStatus,
    paymentMethod,
    amount,
    items: Array.isArray(raw.items) ? raw.items : [],
    statusHistory: Array.isArray(raw.statusHistory) ? raw.statusHistory : null,
  };
}

// ==========================================
// CORE API CALL: getAdminOrders
// ==========================================

export async function getAdminOrders(params?: GetAdminOrdersParams): Promise<GetAdminOrdersResult> {
  if (USE_MOCK) {
    const { getMockAdminOrders } = await import("./mocks/adminOrdersMock");
    const rawMock = await getMockAdminOrders();
    const normalized = rawMock.map(normalizeAdminOrder);
    const summary: AdminOrdersSummary = {
      total: normalized.length,
      inProgress: normalized.filter((o) =>
        ["ACCEPTED", "PACKED", "RIDER_ASSIGNED", "PICKED_UP", "IN_TRANSIT"].includes(o.status),
      ).length,
      delivered: normalized.filter((o) => o.status === "DELIVERED").length,
      awaitingSeller: normalized.filter((o) => o.status === "PLACED").length,
      unassignedRider: normalized.filter(
        (o) => o.status === "PACKED" && (!o.riderName || o.riderName.trim() === ""),
      ).length,
    };
    return {
      orders: normalized,
      summary,
      nextCursor: null,
    };
  }

  const queryParams = new URLSearchParams();
  if (params?.status && params.status !== "ALL") queryParams.set("status", params.status);
  if (params?.seller && params.seller !== "ALL") queryParams.set("seller", params.seller);
  if (params?.payment && params.payment !== "ALL") queryParams.set("payment", params.payment);
  if (params?.q && params.q.trim()) queryParams.set("q", params.q.trim());
  if (params?.limit) queryParams.set("limit", String(params.limit));
  if (params?.cursor) queryParams.set("cursor", params.cursor);

  const url = `/api/admin/orders${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

  const res = await fetch(url, {
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
  const rawOrders: any[] = Array.isArray(data) ? data : data.orders || [];
  const normalizedOrders = rawOrders.map(normalizeAdminOrder);

  const summary: AdminOrdersSummary = data.summary || {
    total: normalizedOrders.length,
    inProgress: normalizedOrders.filter((o) =>
      ["ACCEPTED", "PACKED", "RIDER_ASSIGNED", "PICKED_UP", "IN_TRANSIT"].includes(o.status),
    ).length,
    delivered: normalizedOrders.filter((o) => o.status === "DELIVERED").length,
    awaitingSeller: normalizedOrders.filter((o) => o.status === "PLACED").length,
    unassignedRider: normalizedOrders.filter(
      (o) => o.status === "PACKED" && (!o.riderName || o.riderName.trim() === ""),
    ).length,
  };

  return {
    orders: normalizedOrders.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    ),
    summary,
    nextCursor: data.nextCursor || null,
  };
}

// ==========================================
// REACT HOOK: useAdminOrders
// Auto-refreshes every 6 seconds, pauses when tab is hidden,
// and detects status changes to highlight rows.
// ==========================================

export interface UseAdminOrdersResult {
  orders: AdminOrderJoined[];
  summary: AdminOrdersSummary;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  statusChangedIds: Set<string>;
  nextCursor: string | null;
}

export function useAdminOrders(params?: GetAdminOrdersParams): UseAdminOrdersResult {
  const [orders, setOrders] = useState<AdminOrderJoined[]>([]);
  const [summary, setSummary] = useState<AdminOrdersSummary>({
    total: 0,
    inProgress: 0,
    delivered: 0,
    awaitingSeller: 0,
    unassignedRider: 0,
  });
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusChangedIds, setStatusChangedIds] = useState<Set<string>>(new Set());

  const prevStatusesRef = useRef<Map<string, OrderStatus>>(new Map());
  const isFirstLoad = useRef(true);
  const paramsRef = useRef(params);
  paramsRef.current = params;

  const fetchOrders = useCallback(async (isSilent = false) => {
    if (!isSilent) {
      setLoading(true);
    }
    setError(null);

    try {
      const result = await getAdminOrders(paramsRef.current);

      // Check for status changes since previous poll
      if (!isFirstLoad.current) {
        const changed = new Set<string>();
        result.orders.forEach((ord) => {
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
      result.orders.forEach((ord) => nextMap.set(ord.id, ord.status));
      prevStatusesRef.current = nextMap;
      isFirstLoad.current = false;

      setOrders(result.orders);
      setSummary(result.summary);
      setNextCursor(result.nextCursor);
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

  // Polling every 6 seconds (between 5 and 10s), pausing on hidden tab
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
    summary,
    loading,
    error,
    refetch: () => fetchOrders(false),
    statusChangedIds,
    nextCursor,
  };
}
