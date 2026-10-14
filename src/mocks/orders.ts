// src/mocks/orders.ts
import { ApiError, type ApiOrder, type CreateOrderPayload } from "../lib/api/orders";
import { isDeliverablePincode, NOT_SERVICEABLE_MESSAGE } from "../lib/checkoutConfig";
import { getProduct, getVendor, GST_RATE } from "../lib/data";

const SESSION_STORAGE_KEY = "riderzpro_orders_session";
let memoryOrders: ApiOrder[] = [];

function getSessionOrders(): ApiOrder[] {
  if (typeof window === "undefined") return memoryOrders;
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error("Failed to read orders from sessionStorage:", e);
  }
  return memoryOrders;
}

function saveSessionOrders(orders: ApiOrder[]) {
  memoryOrders = orders;
  if (typeof window !== "undefined") {
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error("Failed to save orders to sessionStorage:", e);
    }
  }
}

export function getAllMockOrders(): ApiOrder[] {
  return getSessionOrders();
}

export function getMockOrderById(id: string): ApiOrder | undefined {
  const orders = getSessionOrders();
  return orders.find((o) => o.id === id || o.orderNumber === id);
}

export function createMockOrder(payload: CreateOrderPayload): ApiOrder {
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
  // Coupon calculation
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
    status: 0,
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
    // Backwards compatibility fields
    total: Math.round(totalPaise / 100),
    customerName: payload.contact.name.trim(),
    customerPhone: payload.contact.phone.trim(),
  };

  const existing = getSessionOrders();
  saveSessionOrders([order, ...existing]);

  return order;
}
