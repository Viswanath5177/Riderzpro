/**
 * Isolated Mock Data and State for Seller Orders
 * Loaded dynamically ONLY when USE_MOCK is active in development.
 * Tree-shaken completely in production builds.
 *
 * NOTE: All fake timers (brand new order injection and fake status progression)
 * have been completely removed. Real data is never touched by mock code.
 */

import {
  type SellerOrder,
  type SellerOrderAction,
  type SellerOrderStatus,
  ApiError,
} from "../sellerOrdersApi";
import { reduceMockStockByOrderItems, notifyInventoryListeners } from "./sellerInventoryMock";

export const initialMockOrders: SellerOrder[] = [
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
const mockOrdersState: SellerOrder[] = [...initialMockOrders];

// Event listeners for mock store state changes
type StateListener = () => void;
const listeners = new Set<StateListener>();

export function notifyOrdersListeners() {
  listeners.forEach((fn) => {
    try {
      fn();
    } catch (e) {
      console.error("Orders listener error:", e);
    }
  });
}

export function subscribeOrdersUpdates(listener: StateListener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export async function getMockSellerOrders(): Promise<SellerOrder[]> {
  // Return shallow copy sorted newest first
  return [...mockOrdersState].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function updateMockSellerOrder(
  id: string,
  action: SellerOrderAction,
  reason?: string,
): Promise<SellerOrder> {
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
  notifyOrdersListeners();
  notifyInventoryListeners();

  return updatedOrder;
}
