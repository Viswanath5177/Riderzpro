/**
 * Admin Orders API Layer & Mock Adapter
 *
 * Joins order records with customer, seller, rider, payment, and status history.
 * Polling every 6 seconds, pausing on background tab, and highlighting status changes.
 *
 * Real API endpoint assumed: GET /api/admin/orders
 */

import { useState, useEffect, useCallback, useRef } from "react";

// ==========================================
// CONFIGURATION & TOGGLE FLAG
// ==========================================
// Flip this single flag to false to switch to real backend endpoints
export const USE_MOCK = true;

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
// INITIAL MOCK ORDERS (Joined shape across all 9 statuses)
// ==========================================

const now = Date.now();

export const initialAdminOrders: AdminOrderJoined[] = [
  {
    id: "adm_ord_01",
    orderNumber: "RP-ORD-9821",
    createdAt: new Date(now - 4 * 60 * 1000).toISOString(), // 4 mins ago
    customerName: "Rohan Sharma",
    customerPhone: "+91 98765 11001",
    deliveryAddress: "Flat 402, Lotus Boulevard, Sector 100, Noida, UP",
    city: "Noida",
    sellerId: "sel_noida_01",
    sellerName: "Noida EV Spares & Care",
    sellerPhone: "+91 98112 34567",
    sellerAddress: "Shop 12, Sector 62 Electronic City, Noida, UP",
    status: "PLACED", // Awaiting seller action
    riderName: null, // Unassigned
    riderPhone: null,
    paymentStatus: "PAID",
    paymentMethod: "UPI / Razorpay",
    amount: 5799,
    items: [
      { name: "Ather 450X Ceramic Brake Pad Set", qty: 2, price: 1450 },
      { name: "Fast Charger Cable 15A (Type 2)", qty: 1, price: 2899 },
    ],
    statusHistory: [
      {
        status: "PLACED",
        timestamp: new Date(now - 4 * 60 * 1000).toISOString(),
        note: "Customer placed order via UPI",
        source: "system",
      },
    ],
  },
  {
    id: "adm_ord_02",
    orderNumber: "RP-ORD-9819",
    createdAt: new Date(now - 14 * 60 * 1000).toISOString(),
    customerName: "Pooja Verma",
    customerPhone: "+91 98765 22002",
    deliveryAddress: "House 18, Block B, Sector 50, Noida, UP",
    city: "Noida",
    sellerId: "sel_noida_01",
    sellerName: "Noida EV Spares & Care",
    sellerPhone: "+91 98112 34567",
    sellerAddress: "Shop 12, Sector 62 Electronic City, Noida, UP",
    status: "ACCEPTED",
    riderName: null,
    riderPhone: null,
    paymentStatus: "PAID",
    paymentMethod: "Credit Card",
    amount: 4150,
    items: [
      { name: "Ola S1 Pro Heavy Duty Belt Drive", qty: 1, price: 3200 },
      { name: "High-Visibility LED Handlebar Indicators", qty: 1, price: 950 },
    ],
    statusHistory: [
      {
        status: "PLACED",
        timestamp: new Date(now - 14 * 60 * 1000).toISOString(),
        note: "Order created",
        source: "system",
      },
      {
        status: "ACCEPTED",
        timestamp: new Date(now - 10 * 60 * 1000).toISOString(),
        note: "Accepted by Noida EV Spares",
        source: "seller",
      },
    ],
  },
  {
    id: "adm_ord_03",
    orderNumber: "RP-ORD-9815",
    createdAt: new Date(now - 28 * 60 * 1000).toISOString(),
    customerName: "Amitabh Sen",
    customerPhone: "+91 98765 33003",
    deliveryAddress: "Villa 9, ATS Greens, Greater Noida West, UP",
    city: "Noida",
    sellerId: "sel_noida_01",
    sellerName: "Noida EV Spares & Care",
    sellerPhone: "+91 98112 34567",
    sellerAddress: "Shop 12, Sector 62 Electronic City, Noida, UP",
    status: "PACKED", // PACKED with no rider = Unassigned rider!
    riderName: null,
    riderPhone: null,
    paymentStatus: "COD_PENDING",
    paymentMethod: "Cash on Delivery",
    amount: 1850,
    items: [{ name: "Chetak Smart Key Fob Replacement", qty: 1, price: 1850 }],
    statusHistory: [
      {
        status: "PLACED",
        timestamp: new Date(now - 28 * 60 * 1000).toISOString(),
        note: "Order placed (COD)",
        source: "system",
      },
      {
        status: "ACCEPTED",
        timestamp: new Date(now - 22 * 60 * 1000).toISOString(),
        note: "Merchant confirmed order",
        source: "seller",
      },
      {
        status: "PACKED",
        timestamp: new Date(now - 8 * 60 * 1000).toISOString(),
        note: "Parcel packed, awaiting rider broadcast",
        source: "seller",
      },
    ],
  },
  {
    id: "adm_ord_04",
    orderNumber: "RP-ORD-9807",
    createdAt: new Date(now - 45 * 60 * 1000).toISOString(),
    customerName: "Vikas Patel",
    customerPhone: "+91 98765 44004",
    deliveryAddress: "Tower 3, Supertech Capetown, Sector 74, Noida, UP",
    city: "Noida",
    sellerId: "sel_noida_01",
    sellerName: "Noida EV Spares & Care",
    sellerPhone: "+91 98112 34567",
    sellerAddress: "Shop 12, Sector 62 Electronic City, Noida, UP",
    status: "RIDER_ASSIGNED",
    riderName: "Rajesh Kumar",
    riderPhone: "+91 98765 43210",
    paymentStatus: "PAID",
    paymentMethod: "UPI / Razorpay",
    amount: 799,
    items: [{ name: "Lithium Pack Thermal Insulation Wrap", qty: 1, price: 799 }],
    statusHistory: [
      {
        status: "PLACED",
        timestamp: new Date(now - 45 * 60 * 1000).toISOString(),
        note: "Order placed",
        source: "system",
      },
      {
        status: "ACCEPTED",
        timestamp: new Date(now - 40 * 60 * 1000).toISOString(),
        note: "Order accepted",
        source: "seller",
      },
      {
        status: "PACKED",
        timestamp: new Date(now - 25 * 60 * 1000).toISOString(),
        note: "Packed with barcode slip",
        source: "seller",
      },
      {
        status: "RIDER_ASSIGNED",
        timestamp: new Date(now - 12 * 60 * 1000).toISOString(),
        note: "Rider Rajesh Kumar assigned for pickup",
        source: "system",
      },
    ],
  },
  {
    id: "adm_ord_05",
    orderNumber: "RP-ORD-9799",
    createdAt: new Date(now - 75 * 60 * 1000).toISOString(),
    customerName: "Kavita Reddy",
    customerPhone: "+91 98765 55005",
    deliveryAddress: "Plot 88, Sector 15A, Noida, UP",
    city: "Noida",
    sellerId: "sel_noida_01",
    sellerName: "Noida EV Spares & Care",
    sellerPhone: "+91 98112 34567",
    sellerAddress: "Shop 12, Sector 62 Electronic City, Noida, UP",
    status: "PICKED_UP",
    riderName: "Mohd. Shakeel",
    riderPhone: "+91 98765 54321",
    paymentStatus: "PAID",
    paymentMethod: "UPI",
    amount: 2200,
    items: [{ name: "Ather 450X Idler Tension Pulley", qty: 2, price: 1100 }],
    statusHistory: [
      {
        status: "PLACED",
        timestamp: new Date(now - 75 * 60 * 1000).toISOString(),
        note: "Order placed",
        source: "system",
      },
      {
        status: "ACCEPTED",
        timestamp: new Date(now - 68 * 60 * 1000).toISOString(),
        note: "Order accepted",
        source: "seller",
      },
      {
        status: "PACKED",
        timestamp: new Date(now - 50 * 60 * 1000).toISOString(),
        note: "Order packed",
        source: "seller",
      },
      {
        status: "RIDER_ASSIGNED",
        timestamp: new Date(now - 35 * 60 * 1000).toISOString(),
        note: "Rider assigned",
        source: "system",
      },
      {
        status: "PICKED_UP",
        timestamp: new Date(now - 15 * 60 * 1000).toISOString(),
        note: "OTP verified at merchant hub. Rider picked up parcel.",
        source: "rider",
      },
    ],
  },
  {
    id: "adm_ord_06",
    orderNumber: "RP-ORD-9791",
    createdAt: new Date(now - 110 * 60 * 1000).toISOString(),
    customerName: "Sneha Nair",
    customerPhone: "+91 98765 66006",
    deliveryAddress: "C-12, Sector 44, Noida, UP",
    city: "Noida",
    sellerId: "sel_noida_01",
    sellerName: "Noida EV Spares & Care",
    sellerPhone: "+91 98112 34567",
    sellerAddress: "Shop 12, Sector 62 Electronic City, Noida, UP",
    status: "IN_TRANSIT",
    riderName: "Deepak Rawat",
    riderPhone: "+91 98765 67890",
    paymentStatus: "PAID",
    paymentMethod: "Net Banking",
    amount: 3200,
    items: [{ name: "Ola S1 Pro Heavy Duty Belt Drive", qty: 1, price: 3200 }],
    statusHistory: [
      {
        status: "PLACED",
        timestamp: new Date(now - 110 * 60 * 1000).toISOString(),
        note: "Order placed",
        source: "system",
      },
      {
        status: "IN_TRANSIT",
        timestamp: new Date(now - 20 * 60 * 1000).toISOString(),
        note: "Rider on the way. Geofence tracking active.",
        source: "rider",
      },
    ],
  },
  {
    id: "adm_ord_07",
    orderNumber: "RP-ORD-9783",
    createdAt: new Date(now - 190 * 60 * 1000).toISOString(),
    customerName: "Anand Sundaram",
    customerPhone: "+91 98765 77007",
    deliveryAddress: "12A, Indiranagar 100ft Road, Bengaluru, KA",
    city: "Bengaluru",
    sellerId: "sel_blr_01",
    sellerName: "VoltHub Indiranagar",
    sellerPhone: "+91 90000 00001",
    sellerAddress: "14/2, 100 Feet Rd, HAL 2nd Stage, Indiranagar, Bengaluru",
    status: "DELIVERED",
    riderName: "Suresh Gowda",
    riderPhone: "+91 98765 99887",
    paymentStatus: "PAID",
    paymentMethod: "UPI / Razorpay",
    amount: 4350,
    items: [{ name: "Ather 450X Ceramic Brake Pad Set", qty: 3, price: 1450 }],
    statusHistory: [
      {
        status: "PLACED",
        timestamp: new Date(now - 190 * 60 * 1000).toISOString(),
        note: "Order placed",
        source: "system",
      },
      {
        status: "DELIVERED",
        timestamp: new Date(now - 45 * 60 * 1000).toISOString(),
        note: "Delivered to customer. OTP confirmed: 7891",
        source: "rider",
      },
    ],
  },
  {
    id: "adm_ord_08",
    orderNumber: "RP-ORD-9772",
    createdAt: new Date(now - 320 * 60 * 1000).toISOString(),
    customerName: "Gaurav Mehta",
    customerPhone: "+91 98765 88008",
    deliveryAddress: "Tower B, Sector 93A, Noida, UP",
    city: "Noida",
    sellerId: "sel_noida_01",
    sellerName: "Noida EV Spares & Care",
    sellerPhone: "+91 98112 34567",
    sellerAddress: "Shop 12, Sector 62 Electronic City, Noida, UP",
    status: "REJECTED",
    riderName: null,
    riderPhone: null,
    paymentStatus: "PAID", // Refunded or failed in status history
    paymentMethod: "Credit Card",
    amount: 8400,
    items: [{ name: "Custom 72V Lithium BMS Controller Unit", qty: 1, price: 8400 }],
    statusHistory: [
      {
        status: "PLACED",
        timestamp: new Date(now - 320 * 60 * 1000).toISOString(),
        note: "Order placed",
        source: "system",
      },
      {
        status: "REJECTED",
        timestamp: new Date(now - 305 * 60 * 1000).toISOString(),
        note: "Merchant rejected: Inventory discrepancy - component currently out of stock.",
        source: "seller",
      },
    ],
  },
  {
    id: "adm_ord_09",
    orderNumber: "RP-ORD-9765",
    createdAt: new Date(now - 480 * 60 * 1000).toISOString(),
    customerName: "Neha Tiwari",
    customerPhone: "+91 98765 99009",
    deliveryAddress: "Apartment 5B, Sector 137, Noida, UP",
    city: "Noida",
    sellerId: "sel_noida_01",
    sellerName: "Noida EV Spares & Care",
    sellerPhone: "+91 98112 34567",
    sellerAddress: "Shop 12, Sector 62 Electronic City, Noida, UP",
    status: "CANCELLED",
    riderName: null,
    riderPhone: null,
    paymentStatus: "FAILED",
    paymentMethod: "UPI / Razorpay",
    amount: 1750,
    items: [{ name: "Universal Scooter Windshield Deflector", qty: 1, price: 1750 }],
    statusHistory: [
      {
        status: "PLACED",
        timestamp: new Date(now - 480 * 60 * 1000).toISOString(),
        note: "Order initiated",
        source: "system",
      },
      {
        status: "CANCELLED",
        timestamp: new Date(now - 475 * 60 * 1000).toISOString(),
        note: "Payment authorization failed; cancelled by payment gateway.",
        source: "system",
      },
    ],
  },
];

const mockAdminOrdersState: AdminOrderJoined[] = [...initialAdminOrders];

// ==========================================
// CORE API CALL: getAdminOrders
// ==========================================

export async function getAdminOrders(): Promise<AdminOrderJoined[]> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200));
    return [...mockAdminOrdersState].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
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
