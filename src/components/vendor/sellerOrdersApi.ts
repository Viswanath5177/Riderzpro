/**
 * Seller Orders API Layer & Mock Adapter
 *
 * Flow: Client orders -> Noida seller accepts & packs -> Rider assigned -> Picked up -> Delivered.
 * Real Seller API is managed by Vamsi.
 *
 * To toggle between Mock Data and Real API:
 * Set VITE_USE_MOCK_SELLER_ORDERS="true" to force mocks. Default is live.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { reduceMockStockByOrderItems, notifyInventoryListeners } from "./sellerInventoryApi";

// ==========================================
// CONFIGURATION & TOGGLE FLAG
// ==========================================
export const USE_MOCK = import.meta.env.VITE_USE_MOCK_SELLER_ORDERS === "true";

// ==========================================
// TYPES & CONTRACT DEFINITION
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
// INITIAL MOCK DATA (Covers all 9 statuses)
// ==========================================

const initialMockOrders: SellerOrder[] = [
  {
    id: "ord_demo_01",
    orderNumber: "RP-ORD-9821",
    createdAt: new Date(Date.now() - 4 * 60 * 1000).toISOString(), // 4 mins ago
    status: "PLACED",
    items: [
      { name: "Ather 450X Ceramic Brake Pad Set", qty: 2, price: 1450 },
      { name: "Fast Charger Cable 15A (Type 2)", qty: 1, price: 2899 },
    ],
    customerName: "Rohan Sharma",
    deliveryCity: "Noida Sector 62",
    amount: 5799,
    paymentMethod: "UPI / Razorpay",
    paymentStatus: "PAID",
    rider: null,
  },
  {
    id: "ord_demo_02",
    orderNumber: "RP-ORD-9819",
    createdAt: new Date(Date.now() - 14 * 60 * 1000).toISOString(), // 14 mins ago
    status: "ACCEPTED",
    items: [
      { name: "Ola S1 Pro Heavy Duty Belt Drive", qty: 1, price: 3200 },
      { name: "High-Visibility LED Handlebar Indicators", qty: 1, price: 950 },
    ],
    customerName: "Amit Verma",
    deliveryCity: "Noida Sector 18",
    amount: 4150,
    paymentMethod: "Credit Card",
    paymentStatus: "PAID",
    rider: null,
  },
  {
    id: "ord_demo_03",
    orderNumber: "RP-ORD-9815",
    createdAt: new Date(Date.now() - 28 * 60 * 1000).toISOString(), // 28 mins ago
    status: "PACKED",
    items: [{ name: "EV Hub Motor Seal & Bearing Repair Kit", qty: 1, price: 1850 }],
    customerName: "Sneha Kapur",
    deliveryCity: "Greater Noida West",
    amount: 1850,
    paymentMethod: "UPI / PhonePe",
    paymentStatus: "PAID",
    rider: null,
  },
  {
    id: "ord_demo_04",
    orderNumber: "RP-ORD-9810",
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    status: "RIDER_ASSIGNED",
    items: [
      { name: "TVS iQube Smart Lithium Battery Lock", qty: 1, price: 2400 },
      { name: "Handle Grip Bar Ends (Anodized Red)", qty: 2, price: 650 },
    ],
    customerName: "Vikas Malhotra",
    deliveryCity: "Noida Sector 76",
    amount: 3700,
    paymentMethod: "Cash on Delivery",
    paymentStatus: "PENDING",
    rider: {
      name: "Rajesh Kumar (Noida Express)",
      phone: "+91 98765 43210",
    },
  },
  {
    id: "ord_demo_05",
    orderNumber: "RP-ORD-9804",
    createdAt: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
    status: "PICKED_UP",
    items: [{ name: "Digital Tire Pressure Gauge (EV Compatible)", qty: 1, price: 1299 }],
    customerName: "Priyanka Sen",
    deliveryCity: "Noida Sector 50",
    amount: 1299,
    paymentMethod: "UPI / Paytm",
    paymentStatus: "PAID",
    rider: {
      name: "Deepak Saini",
      phone: "+91 98112 88421",
    },
  },
  {
    id: "ord_demo_06",
    orderNumber: "RP-ORD-9799",
    createdAt: new Date(Date.now() - 110 * 60 * 1000).toISOString(),
    status: "IN_TRANSIT",
    items: [
      { name: "Waterproof Mobile Mount with Wireless Qi", qty: 1, price: 2150 },
      { name: "Reinforced Alloy Foot Pegs", qty: 1, price: 1100 },
    ],
    customerName: "Anil Rawat",
    deliveryCity: "Noida Sector 128",
    amount: 3250,
    paymentMethod: "Net Banking",
    paymentStatus: "PAID",
    rider: {
      name: "Manoj Yadav",
      phone: "+91 98234 11099",
    },
  },
  {
    id: "ord_demo_07",
    orderNumber: "RP-ORD-9780",
    createdAt: new Date(Date.now() - 190 * 60 * 1000).toISOString(),
    status: "DELIVERED",
    items: [
      { name: "Full Synthetic Electric Scooter Fork Oil 500ml", qty: 2, price: 490 },
      { name: "Brembo Sintered Brake Shoes", qty: 1, price: 1650 },
    ],
    customerName: "Karan Johar",
    deliveryCity: "Noida Sector 15",
    amount: 2630,
    paymentMethod: "UPI / GPay",
    paymentStatus: "PAID",
    rider: {
      name: "Sunil Verma",
      phone: "+91 98910 22345",
    },
  },
  {
    id: "ord_demo_08",
    orderNumber: "RP-ORD-9772",
    createdAt: new Date(Date.now() - 320 * 60 * 1000).toISOString(),
    status: "REJECTED",
    items: [{ name: "Custom 72V Lithium BMS Controller Unit", qty: 1, price: 8400 }],
    customerName: "Gaurav Mehta",
    deliveryCity: "Noida Sector 93",
    amount: 8400,
    paymentMethod: "Credit Card",
    paymentStatus: "REFUNDED",
    rider: null,
    rejectReason: "Inventory discrepancy - component currently out of stock.",
  },
  {
    id: "ord_demo_09",
    orderNumber: "RP-ORD-9765",
    createdAt: new Date(Date.now() - 480 * 60 * 1000).toISOString(),
    status: "CANCELLED",
    items: [{ name: "Universal Scooter Windshield Deflector", qty: 1, price: 1750 }],
    customerName: "Neha Tiwari",
    deliveryCity: "Noida Sector 137",
    amount: 1750,
    paymentMethod: "UPI / Razorpay",
    paymentStatus: "REFUNDED",
    rider: null,
  },
];

// In-memory mutable state for mock session
let mockOrdersState: SellerOrder[] = [...initialMockOrders];

// Event listeners for mock store state changes
type StateListener = () => void;
const listeners = new Set<StateListener>();
function notifyListeners() {
  listeners.forEach((fn) => {
    try {
      fn();
    } catch (e) {
      console.error("Listener error:", e);
    }
  });
}

// Sequence progression for PACKED orders in mock mode
function startMockOrderProgression(orderId: string) {
  // Step 1: After ~8 seconds -> RIDER_ASSIGNED
  setTimeout(() => {
    const idx = mockOrdersState.findIndex((o) => o.id === orderId);
    if (idx !== -1 && mockOrdersState[idx].status === "PACKED") {
      mockOrdersState[idx] = {
        ...mockOrdersState[idx],
        status: "RIDER_ASSIGNED",
        rider: {
          name: "Rajesh Kumar (Noida Express)",
          phone: "+91 98765 43210",
        },
      };
      notifyListeners();

      // Step 2: After ~8 seconds -> PICKED_UP
      setTimeout(() => {
        const i2 = mockOrdersState.findIndex((o) => o.id === orderId);
        if (i2 !== -1 && mockOrdersState[i2].status === "RIDER_ASSIGNED") {
          mockOrdersState[i2] = {
            ...mockOrdersState[i2],
            status: "PICKED_UP",
          };
          notifyListeners();

          // Step 3: After ~8 seconds -> IN_TRANSIT
          setTimeout(() => {
            const i3 = mockOrdersState.findIndex((o) => o.id === orderId);
            if (i3 !== -1 && mockOrdersState[i3].status === "PICKED_UP") {
              mockOrdersState[i3] = {
                ...mockOrdersState[i3],
                status: "IN_TRANSIT",
              };
              notifyListeners();

              // Step 4: After ~8 seconds -> DELIVERED
              setTimeout(() => {
                const i4 = mockOrdersState.findIndex((o) => o.id === orderId);
                if (i4 !== -1 && mockOrdersState[i4].status === "IN_TRANSIT") {
                  mockOrdersState[i4] = {
                    ...mockOrdersState[i4],
                    status: "DELIVERED",
                  };
                  notifyListeners();
                }
              }, 8000);
            }
          }, 8000);
        }
      }, 8000);
    }
  }, 8000);
}

// Brand new order injection after ~20 seconds
let mockNewOrderTimerStarted = false;
function scheduleBrandNewOrderInjection() {
  if (mockNewOrderTimerStarted || !USE_MOCK) return;
  mockNewOrderTimerStarted = true;

  setTimeout(() => {
    const newOrderId = `ord_live_${Date.now()}`;
    const newOrderNumber = `RP-ORD-${Math.floor(9900 + Math.random() * 99)}`;
    const brandNewOrder: SellerOrder = {
      id: newOrderId,
      orderNumber: newOrderNumber,
      createdAt: new Date().toISOString(),
      status: "PLACED",
      items: [
        { name: "Ather 450 Series Performance Front Fork Assembly", qty: 1, price: 4850 },
        { name: "Brembo Brake Fluid DOT 4 250ml", qty: 2, price: 420 },
      ],
      customerName: "Pooja Verma (Live Demo)",
      deliveryCity: "Noida Sector 63",
      amount: 5690,
      paymentMethod: "UPI / Instant Paid",
      paymentStatus: "PAID",
      rider: null,
    };

    // Prepend as newest
    mockOrdersState = [brandNewOrder, ...mockOrdersState];
    notifyListeners();
  }, 20000);
}

// Start schedule on module execution if mock is enabled
if (typeof window !== "undefined" && USE_MOCK) {
  scheduleBrandNewOrderInjection();
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
  if (USE_MOCK) {
    // Return shallow copy sorted newest first
    return [...mockOrdersState].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
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
 * Body shape is isolated here: { action, reason? }
 */
export async function updateSellerOrder(
  id: string,
  action: SellerOrderAction,
  reason?: string,
): Promise<SellerOrder> {
  if (USE_MOCK) {
    // Artificial 400ms network delay for realistic UI loading feedback
    await new Promise((r) => setTimeout(r, 400));

    const idx = mockOrdersState.findIndex((o) => o.id === id);
    if (idx === -1) {
      throw new ApiError("Order not found", 404);
    }

    const current = mockOrdersState[idx];

    // Conflict check in mock (e.g. if already rejected or packed)
    if (action === "accept" && current.status !== "PLACED") {
      throw new ApiError("Order has already been processed or changed.", 409);
    }
    if (action === "reject" && current.status !== "PLACED") {
      throw new ApiError("Order can no longer be rejected.", 409);
    }
    if (action === "packed" && current.status !== "ACCEPTED") {
      throw new ApiError("Order must be accepted before marking as packed.", 409);
    }

    let updatedStatus: SellerOrderStatus = current.status;
    if (action === "accept") {
      updatedStatus = "ACCEPTED";
      // Task 1: Reduce mock stock by order item quantities on order acceptance
      reduceMockStockByOrderItems(current.items);
    }
    if (action === "reject") updatedStatus = "REJECTED";
    if (action === "packed") updatedStatus = "PACKED";

    const updatedOrder: SellerOrder = {
      ...current,
      status: updatedStatus,
      rejectReason: action === "reject" ? reason || "Rejected by seller." : current.rejectReason,
    };

    mockOrdersState[idx] = updatedOrder;
    notifyListeners();
    // Task 1: Refetch inventory immediately after order actions (accept, reject, packed)
    notifyInventoryListeners();

    if (action === "packed") {
      startMockOrderProgression(id);
    }

    return updatedOrder;
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
    if (!USE_MOCK) return;

    const handleMockUpdate = () => {
      fetchOrders(true);
    };

    listeners.add(handleMockUpdate);
    return () => {
      listeners.delete(handleMockUpdate);
    };
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
