// src/lib/api/orders.ts
// Order operations API client. Supports 'mock' (default), 'live' backend API, and 'legacy' mode.

import {
  normalizeOrder,
  type NormalizedOrder,
  formatPaise,
  paiseToRupees,
} from "./orders.contract";

export class ApiError extends Error {
  code: string;
  requestId?: string;
  status?: number;

  constructor(message: string, code = "API_ERROR", requestId?: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.requestId = requestId;
    this.status = status;
  }
}

export type OrderContact = {
  name: string;
  phone: string;
  email?: string;
};

export type OrderShippingAddress = {
  street: string;
  locality: string;
  landmark?: string;
  city: string; // "Delhi"
  state: string; // "Delhi"
  pincode: string;
};

export type OrderItemSnapshot = {
  productId: string;
  name: string;
  imageUrl: string;
  qty: number;
  unitPricePaise: number;
  lineTotalPaise: number;
  sellerId: string;
};

export type OrderSeller = {
  id: string;
  name: string;
};

export type OrderPayment = {
  method: "UPI" | "CARD" | "COD" | string;
  status: "PENDING" | "PAID" | "FAILED" | "COD_DUE" | string;
  amountDuePaise: number;
};

export type OrderStatusHistoryItem = {
  status: string | number;
  timestamp: string | number;
  description?: string;
  source?: string;
};

export type ApiOrder = NormalizedOrder;
export type Order = ApiOrder;

export type CreateOrderPayload = {
  items: { productId: string; vendorId: string; qty: number }[];
  contact: OrderContact;
  shippingAddress: OrderShippingAddress;
  deliveryInstructions?: string;
  paymentMethod: "UPI" | "CARD" | "COD";
  couponCode?: string;
};

export { formatPaise, paiseToRupees };

function getApiMode(): "mock" | "live" | "legacy" {
  const mode = import.meta.env["VITE_ORDERS_API"] as string | undefined;
  if (mode === "live" || mode === "legacy") return mode;
  return "mock";
}

async function handleResponse<T>(res: Response): Promise<T> {
  let json: Record<string, unknown> = {};
  try {
    json = (await res.json()) as Record<string, unknown>;
  } catch {
    throw new ApiError(
      "Failed to parse response from server",
      "PARSE_ERROR",
      undefined,
      res.status,
    );
  }

  if (!res.ok) {
    const errorObj = (json?.error as Record<string, unknown>) || {};
    throw new ApiError(
      (errorObj.message as string) ||
        (json?.message as string) ||
        `Request failed with status ${res.status}`,
      (errorObj.code as string) ||
        (res.status === 409
          ? "STOCK_CONFLICT"
          : res.status === 401
            ? "UNAUTHORIZED"
            : res.status === 429
              ? "RATE_LIMITED"
              : "API_ERROR"),
      errorObj.requestId as string | undefined,
      res.status,
    );
  }

  return (json.data ?? json) as T;
}

/**
 * Create a new order with validated customer contact and Delhi shipping address.
 * Never sends totals, prices, customer_id, or paid status.
 */
export async function createOrder(payload: CreateOrderPayload, userId?: string): Promise<ApiOrder> {
  const mode = getApiMode();

  if (mode === "live") {
    const body = {
      items: payload.items.map((it) => ({
        productId: it.productId,
        vendorId: it.vendorId,
        qty: it.qty,
      })),
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
        pincode: payload.shippingAddress.pincode.trim(),
      },
      deliveryInstructions: payload.deliveryInstructions?.trim() || undefined,
      paymentMethod: payload.paymentMethod,
      couponCode: payload.couponCode?.trim() || undefined,
    };

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    });

    const raw = await handleResponse<unknown>(res);
    return normalizeOrder(raw);
  }

  if (mode === "legacy") {
    const { createMockOrder } = await import("../../mocks/orders");
    const rawOrder = createMockOrder(payload, userId);
    try {
      const raw = localStorage.getItem("riderzpro_legacy_orders");
      const list = raw ? JSON.parse(raw) : [];
      localStorage.setItem("riderzpro_legacy_orders", JSON.stringify([rawOrder, ...list]));
    } catch {
      // ignore
    }
    return normalizeOrder(rawOrder);
  }

  // Default: mock mode
  const { createMockOrder } = await import("../../mocks/orders");
  const mockOrder = createMockOrder(payload, userId);
  return normalizeOrder(mockOrder);
}

/**
 * Fetch all orders for the current authenticated user.
 */
export async function getMyOrders(userId?: string): Promise<ApiOrder[]> {
  const mode = getApiMode();

  if (mode === "live") {
    const res = await fetch("/api/orders/mine", {
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const raw = await handleResponse<unknown[]>(res);
    const list = Array.isArray(raw) ? raw : (raw as { data?: unknown[] })?.data || [];
    return list.map(normalizeOrder);
  }

  if (mode === "legacy") {
    try {
      const raw = localStorage.getItem("riderzpro_legacy_orders");
      if (raw) return (JSON.parse(raw) as unknown[]).map(normalizeOrder);
    } catch {
      // ignore
    }
    const { getAllMockOrders } = await import("../../mocks/orders");
    return getAllMockOrders(userId).map(normalizeOrder);
  }

  const { getAllMockOrders } = await import("../../mocks/orders");
  return getAllMockOrders(userId).map(normalizeOrder);
}

/**
 * Fetch a single order by ID or orderNumber.
 */
export async function getOrder(id: string, userId?: string): Promise<ApiOrder> {
  const mode = getApiMode();

  if (mode === "live") {
    const res = await fetch(`/api/orders/${encodeURIComponent(id)}`, {
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const raw = await handleResponse<unknown>(res);
    return normalizeOrder(raw);
  }

  if (mode === "legacy") {
    try {
      const raw = localStorage.getItem("riderzpro_legacy_orders");
      if (raw) {
        const list = JSON.parse(raw) as Record<string, unknown>[];
        const match = list.find((o) => o["id"] === id || o["orderNumber"] === id);
        if (match) return normalizeOrder(match);
      }
    } catch {
      // ignore
    }
  }

  const { getMockOrderById } = await import("../../mocks/orders");
  const rawOrder = getMockOrderById(id, userId);
  if (!rawOrder) {
    throw new ApiError(`Order not found: ${id}`, "ORDER_NOT_FOUND", undefined, 404);
  }
  return normalizeOrder(rawOrder);
}

// Backward compatibility alias
export async function fetchOrders(): Promise<ApiOrder[]> {
  return getMyOrders();
}

export async function placeOrder(payload: Record<string, unknown>): Promise<ApiOrder> {
  if (payload.items && payload.contact && payload.shippingAddress) {
    return createOrder(payload as unknown as CreateOrderPayload);
  }
  const addr = (payload["shippingAddress"] || {}) as Record<string, unknown>;
  return createOrder({
    items: [],
    contact: {
      name: (addr["name"] as string) || "Customer",
      phone: (addr["phone"] as string) || "9999999999",
    },
    shippingAddress: {
      street: (addr["street"] as string) || "",
      locality: (addr["locality"] as string) || "",
      landmark: addr["landmark"] as string | undefined,
      city: "Delhi",
      state: "Delhi",
      pincode: (addr["pincode"] as string) || "110001",
    },
    paymentMethod: (payload["payment"] as "UPI" | "CARD" | "COD") || "UPI",
    couponCode: payload["couponCode"] as string | undefined,
  });
}
