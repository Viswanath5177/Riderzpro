// src/mocks/orders.ts
import { ApiError, type ApiOrder, type CreateOrderPayload } from "../lib/api/orders";
import { isDeliverablePincode, NOT_SERVICEABLE_MESSAGE } from "../lib/checkoutConfig";
import { getProduct, getVendor, GST_RATE } from "../lib/data";

function getCurrentUserId(): string {
  if (typeof window === "undefined") return "usr_default";
  try {
    const raw = localStorage.getItem("riderzpro_auth_user");
    if (raw) {
      const u = JSON.parse(raw);
      if (u?.id) return u.id;
    }
  } catch {
    // ignore
  }
  return "usr_guest";
}

function getStorageKey(userId?: string): string {
  const uid = userId || getCurrentUserId();
  return `riderzpro_mock_orders_${uid}`;
}

const memoryOrdersMap = new Map<string, ApiOrder[]>();

export function getSessionOrders(userId?: string): ApiOrder[] {
  const key = getStorageKey(userId);
  if (typeof window === "undefined") {
    return memoryOrdersMap.get(key) || [];
  }
  try {
    const raw = sessionStorage.getItem(key);
    if (raw) {
      return JSON.parse(raw);
    }
    // Also check legacy shared session key
    const legacyRaw = sessionStorage.getItem("riderzpro_orders_session");
    if (legacyRaw) {
      const parsed = JSON.parse(legacyRaw);
      sessionStorage.setItem(key, legacyRaw);
      return parsed;
    }
  } catch (e) {
    console.error("Failed to read orders from sessionStorage:", e);
  }
  return memoryOrdersMap.get(key) || [];
}

export function saveSessionOrders(orders: ApiOrder[], userId?: string) {
  const key = getStorageKey(userId);
  memoryOrdersMap.set(key, orders);
  if (typeof window !== "undefined") {
    try {
      sessionStorage.setItem(key, JSON.stringify(orders));
      sessionStorage.setItem("riderzpro_orders_session", JSON.stringify(orders));
    } catch (e) {
      console.error("Failed to save orders to sessionStorage:", e);
    }
  }
}

export function clearMockOrders(userId?: string) {
  const key = getStorageKey(userId);
  memoryOrdersMap.delete(key);
  if (typeof window !== "undefined") {
    try {
      sessionStorage.removeItem(key);
      sessionStorage.removeItem("riderzpro_orders_session");
    } catch {
      // ignore
    }
  }
}

export function getAllMockOrders(userId?: string): ApiOrder[] {
  return getSessionOrders(userId);
}

export function getMockOrderById(id: string, userId?: string): ApiOrder | undefined {
  const orders = getSessionOrders(userId);
  return orders.find((o) => o.id === id || o.orderNumber === id);
}

export function createMockOrder(payload: CreateOrderPayload, userId?: string): ApiOrder {
  // 1. Enforce Delhi-only delivery
  const pincode = payload.shippingAddress?.pincode || "";
  if (!isDeliverablePincode(pincode)) {
    throw new ApiError(NOT_SERVICEABLE_MESSAGE, "ADDRESS_NOT_SERVICEABLE", undefined, 400);
  }

  // 2. Build item snapshots from catalog
  const sellersMap = new Map<string, string>();
  let subtotalPaise = 0;

  const itemsSnapshot = (payload.items || []).map((item) => {
    const product = getProduct(item.productId);
    const vendor = getVendor(item.vendorId);
    if (vendor) {
      sellersMap.set(vendor.id, vendor.name);
    }

    const unitPriceInr =
      product?.offers?.find((o) => o.vendorId === item.vendorId)?.price ??
      product?.offers?.[0]?.price ??
      100;
    const unitPricePaise = Math.round(unitPriceInr * 100);
    const lineTotalPaise = unitPricePaise * item.qty;
    subtotalPaise += lineTotalPaise;

    return {
      productId: item.productId,
      name: product?.name || "EV Spare Part",
      imageUrl: product?.image || "/src/assets/parts.jpg",
      qty: item.qty,
      unitPricePaise,
      lineTotalPaise,
      sellerId: item.vendorId,
    };
  });

  const sellers = Array.from(sellersMap.entries()).map(([id, name]) => ({ id, name }));

  // 3. Pricing calculations
  let discountPaise = 0;
  const couponCode = payload.couponCode ? payload.couponCode.trim().toUpperCase() : undefined;
  if (couponCode === "EVSAFE") {
    discountPaise = Math.min(subtotalPaise, 50000); // ₹500
  } else if (couponCode === "RIDER10") {
    discountPaise = Math.round(subtotalPaise * 0.1);
  }

  const deliveryPaise = sellers.length > 0 ? sellers.length * 4900 : 4900; // ₹49 per seller
  const discountedSubtotal = Math.max(0, subtotalPaise - discountPaise);
  const taxPaise = Math.round(discountedSubtotal * GST_RATE);
  const totalPaise = discountedSubtotal + deliveryPaise + taxPaise;

  const orderNum = `RZ-${Math.floor(100000 + Math.random() * 900000)}`;
  const now = Date.now();

  const isCod = payload.paymentMethod === "COD";
  const paymentStatus = isCod ? ("COD_DUE" as const) : ("PENDING" as const);

  const order: ApiOrder = {
    id: orderNum,
    orderNumber: orderNum,
    createdAt: now,
    estimatedDelivery: "Delivered in 35–50 mins",
    status: "PLACED",
    contact: {
      name: payload.contact.name.trim(),
      phone: payload.contact.phone.trim(),
      email: payload.contact.email?.trim() || undefined,
    },
    shippingAddress: {
      street: payload.shippingAddress.street.trim(),
      locality: payload.shippingAddress.locality.trim(),
      landmark: payload.shippingAddress.landmark?.trim() || undefined,
      city: "Delhi",
      state: "Delhi",
      pincode: pincode.trim(),
    },
    deliveryInstructions: payload.deliveryInstructions?.trim() || undefined,
    items: itemsSnapshot,
    sellers,
    subtotalPaise,
    deliveryPaise,
    discountPaise,
    couponCode: couponCode || undefined,
    taxPaise,
    totalPaise,
    payment: {
      method: payload.paymentMethod,
      status: paymentStatus,
      amountDuePaise: totalPaise,
    },
    statusHistory: [
      {
        status: "PLACED",
        timestamp: now,
        description: "Order placed by customer",
        source: "customer",
      },
    ],
  };

  const existing = getSessionOrders(userId);
  saveSessionOrders([order, ...existing], userId);

  return order;
}

/**
 * Advances an order's status along the lifecycle:
 * PLACED -> PACKED -> DISPATCHED -> OUT_FOR_DELIVERY -> DELIVERED
 */
export function advanceMockOrder(orderNumber?: string): boolean {
  const orders = getSessionOrders();
  if (orders.length === 0) return false;

  const target = orderNumber
    ? orders.find((o) => o.orderNumber === orderNumber || o.id === orderNumber)
    : orders.find((o) => o.status !== "DELIVERED" && o.status !== "CANCELLED");

  if (!target) return false;

  const progression: Record<string, string> = {
    PLACED: "PACKED",
    PACKED: "DISPATCHED",
    DISPATCHED: "OUT_FOR_DELIVERY",
    OUT_FOR_DELIVERY: "DELIVERED",
  };

  const currentStatusStr = String(target.status).toUpperCase();
  const nextStatus = progression[currentStatusStr];
  if (!nextStatus) return false;

  target.status = nextStatus;
  const history = target.statusHistory || [];
  history.push({
    status: nextStatus,
    timestamp: Date.now(),
    description: `Order status automatically updated to ${nextStatus}`,
    source: "mock-auto-advance",
  });
  target.statusHistory = history;

  saveSessionOrders([...orders]);
  return true;
}

declare global {
  interface Window {
    __mockAdvanceOrder?: (orderNum?: string) => boolean;
    __mockAutoAdvanceStarted?: boolean;
  }
}

// Dev-only auto-advance & window exposure
if (import.meta.env.DEV) {
  if (typeof window !== "undefined") {
    window.__mockAdvanceOrder = (orderNum?: string) => {
      const advanced = advanceMockOrder(orderNum);
      if (advanced) {
        console.log(`[MockOrder] Advanced order status. Refetching...`);
      } else {
        console.log(`[MockOrder] No eligible active orders to advance.`);
      }
      return advanced;
    };

    // Auto-advance interval every 20s if VITE_MOCK_AUTO_ADVANCE !== "0"
    const autoAdvanceEnabled =
      import.meta.env["VITE_MOCK_AUTO_ADVANCE"] !== "0" &&
      import.meta.env["VITE_MOCK_AUTO_ADVANCE"] !== "false";

    if (autoAdvanceEnabled && !window.__mockAutoAdvanceStarted) {
      window.__mockAutoAdvanceStarted = true;
      setInterval(() => {
        advanceMockOrder();
      }, 20000);
    }
  }
}
