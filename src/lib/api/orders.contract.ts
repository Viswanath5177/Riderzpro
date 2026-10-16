// src/lib/api/orders.contract.ts
import { z } from "zod";

export const ApiErrorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    requestId: z.string().optional(),
  }),
});

export const OrderContactSchema = z.object({
  name: z.string(),
  phone: z.string(),
  email: z.string().optional(),
});

export const OrderShippingAddressSchema = z.object({
  street: z.string(),
  locality: z.string(),
  landmark: z.string().optional(),
  city: z.string(),
  state: z.string(),
  pincode: z.string(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const OrderItemSnapshotSchema = z.object({
  productId: z.string(),
  name: z.string(),
  imageUrl: z.string(),
  qty: z.number().int().positive(),
  unitPricePaise: z.number().int().nonnegative(),
  lineTotalPaise: z.number().int().nonnegative(),
  sellerId: z.string(),
});

export const OrderSellerSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const OrderPaymentSchema = z.object({
  method: z.enum(["UPI", "CARD", "COD"]).or(z.string()),
  status: z.enum(["PENDING", "PAID", "FAILED", "COD_DUE"]).or(z.string()),
  amountDuePaise: z.number().int().nonnegative(),
});

export const OrderStatusHistoryItemSchema = z.object({
  status: z.union([z.string(), z.number()]),
  timestamp: z.union([z.string(), z.number()]),
  description: z.string().optional(),
  source: z.string().optional(),
});

export const OrderSchema = z.object({
  id: z.string(),
  orderNumber: z.string(),
  createdAt: z.number().int(),
  estimatedDelivery: z.string(),
  status: z.union([z.string(), z.number()]),
  contact: OrderContactSchema,
  shippingAddress: OrderShippingAddressSchema,
  deliveryInstructions: z.string().optional(),
  items: z.array(OrderItemSnapshotSchema),
  sellers: z.array(OrderSellerSchema).default([]),
  subtotalPaise: z.number().int().nonnegative(),
  deliveryPaise: z.number().int().nonnegative(),
  discountPaise: z.number().int().nonnegative().default(0),
  couponCode: z.string().optional(),
  taxPaise: z.number().int().nonnegative(),
  totalPaise: z.number().int().nonnegative(),
  payment: OrderPaymentSchema,
  statusHistory: z.array(OrderStatusHistoryItemSchema).optional(),
});

export type NormalizedOrder = z.infer<typeof OrderSchema>;
export type ApiErrorResponse = z.infer<typeof ApiErrorSchema>;

export function formatPaise(paise: number): string {
  const inrValue = Math.round(paise) / 100;
  return "₹" + inrValue.toLocaleString("en-IN");
}

export function paiseToRupees(paise: number): number {
  return Math.round(paise) / 100;
}

/**
 * Normalizes raw order payload from any backend contract (default or Vamsi's SQL/API contract)
 * into the single internal NormalizedOrder type.
 */
export function normalizeOrder(raw: unknown): NormalizedOrder {
  if (!raw || typeof raw !== "object") {
    throw new Error("Invalid raw order: expected object");
  }

  const r = raw as Record<string, unknown>;

  // 1. Resolve ID and Order Number
  const id = String(r.id || r.order_id || r.orderId || `ORD-${Date.now()}`);
  const orderNumber = String(r.orderNumber || r.order_number || r.id || id);

  // 2. Resolve timestamps
  let createdAt = Date.now();
  if (r.createdAt) {
    createdAt =
      typeof r.createdAt === "number" ? r.createdAt : new Date(String(r.createdAt)).getTime();
  } else if (r.created_at) {
    createdAt =
      typeof r.created_at === "number" ? r.created_at : new Date(String(r.created_at)).getTime();
  }

  // 3. Resolve Contact
  let contact = { name: "Valued Customer", phone: "", email: undefined as string | undefined };
  if (r.contact && typeof r.contact === "object") {
    const c = r.contact as Record<string, unknown>;
    contact = {
      name: String(c.name || "Customer"),
      phone: String(c.phone || ""),
      email: c.email ? String(c.email) : undefined,
    };
  } else {
    contact = {
      name: String(r.customer_name || r.customerName || "Customer"),
      phone: String(r.customer_phone || r.customerPhone || ""),
      email:
        r.customer_email || r.customerEmail
          ? String(r.customer_email || r.customerEmail)
          : undefined,
    };
  }

  // 4. Resolve Shipping Address
  let shippingAddress = {
    street: "",
    locality: "",
    landmark: undefined as string | undefined,
    city: "Delhi",
    state: "Delhi",
    pincode: "110001",
  };

  const rawAddr = r.shippingAddress || r.shipping_address;
  if (rawAddr) {
    let parsedAddr = rawAddr;
    if (typeof rawAddr === "string") {
      try {
        parsedAddr = JSON.parse(rawAddr);
      } catch {
        parsedAddr = { street: rawAddr };
      }
    }
    const a = parsedAddr as Record<string, unknown>;
    shippingAddress = {
      street: String(a.street || a.line1 || a.address || ""),
      locality: String(a.locality || a.area || a.city || "Delhi"),
      landmark: a.landmark ? String(a.landmark) : undefined,
      city: String(a.city || "Delhi"),
      state: String(a.state || "Delhi"),
      pincode: String(a.pincode || a.postal_code || "110001"),
    };
  }

  // 5. Resolve Items
  const rawItems = (
    Array.isArray(r.items) ? r.items : Array.isArray(r.order_items) ? r.order_items : []
  ) as unknown[];
  const sellersMap = new Map<string, string>();

  const items = rawItems.map((item, idx) => {
    const it = (item || {}) as Record<string, unknown>;
    const productId = String(it.productId || it.product_id || `prod_${idx}`);
    const name = String(it.name || it.product_name || it.title || "EV Spare Part");
    const imageUrl = String(it.imageUrl || it.image_url || it.image || "/src/assets/parts.jpg");
    const qty = Number(it.qty || it.quantity || 1);

    // Calculate paise prices
    let unitPricePaise = 0;
    if (typeof it.unitPricePaise === "number") {
      unitPricePaise = it.unitPricePaise;
    } else if (typeof it.unit_price_paise === "number") {
      unitPricePaise = it.unit_price_paise;
    } else if (typeof it.unitPrice === "number") {
      unitPricePaise = Math.round(it.unitPrice * 100);
    } else if (typeof it.unit_price === "number") {
      unitPricePaise = Math.round(it.unit_price * 100);
    } else if (typeof it.price === "number") {
      unitPricePaise = Math.round(it.price * 100);
    }

    let lineTotalPaise = unitPricePaise * qty;
    if (typeof it.lineTotalPaise === "number") {
      lineTotalPaise = it.lineTotalPaise;
    } else if (typeof it.line_total_paise === "number") {
      lineTotalPaise = it.line_total_paise;
    }

    const sellerId = String(it.sellerId || it.seller_id || it.vendorId || it.vendor_id || "v1");
    const sellerName = String(
      it.sellerName || it.seller_name || it.vendorName || `Seller ${sellerId}`,
    );
    sellersMap.set(sellerId, sellerName);

    return {
      productId,
      name,
      imageUrl,
      qty,
      unitPricePaise,
      lineTotalPaise,
      sellerId,
    };
  });

  // 6. Sellers
  let sellers: { id: string; name: string }[] = [];
  if (Array.isArray(r.sellers)) {
    sellers = (r.sellers as Record<string, unknown>[]).map((s) => ({
      id: String(s.id || s.seller_id || "v1"),
      name: String(s.name || s.seller_name || "Supplier"),
    }));
  } else {
    sellers = Array.from(sellersMap.entries()).map(([sId, sName]) => ({ id: sId, name: sName }));
  }

  // 7. Money & Totals
  const subtotalPaise =
    typeof r.subtotalPaise === "number"
      ? r.subtotalPaise
      : typeof r.subtotal_paise === "number"
        ? r.subtotal_paise
        : typeof r.subtotal === "number"
          ? Math.round(r.subtotal * 100)
          : items.reduce((sum, it) => sum + it.lineTotalPaise, 0);

  const deliveryPaise =
    typeof r.deliveryPaise === "number"
      ? r.deliveryPaise
      : typeof r.delivery_paise === "number"
        ? r.delivery_paise
        : typeof r.delivery_fee === "number"
          ? Math.round(r.delivery_fee * 100)
          : 4900;

  const discountPaise =
    typeof r.discountPaise === "number"
      ? r.discountPaise
      : typeof r.discount_paise === "number"
        ? r.discount_paise
        : typeof r.discount === "number"
          ? Math.round(r.discount * 100)
          : 0;

  const taxPaise =
    typeof r.taxPaise === "number"
      ? r.taxPaise
      : typeof r.tax_paise === "number"
        ? r.tax_paise
        : typeof r.tax === "number"
          ? Math.round(r.tax * 100)
          : Math.round(Math.max(0, subtotalPaise - discountPaise) * 0.18);

  const totalPaise =
    typeof r.totalPaise === "number"
      ? r.totalPaise
      : typeof r.total_paise === "number"
        ? r.total_paise
        : typeof r.total === "number"
          ? Math.round(r.total * 100)
          : typeof r.total_amount === "number"
            ? Math.round(r.total_amount * 100)
            : Math.max(0, subtotalPaise - discountPaise) + deliveryPaise + taxPaise;

  // 8. Payment
  let payment: {
    method: "UPI" | "CARD" | "COD" | string;
    status: "PENDING" | "PAID" | "FAILED" | "COD_DUE" | string;
    amountDuePaise: number;
  } = {
    method: "UPI",
    status: "PENDING",
    amountDuePaise: totalPaise,
  };

  if (r.payment && typeof r.payment === "object") {
    const p = r.payment as Record<string, unknown>;
    payment = {
      method: (typeof p["method"] === "string" ? p["method"] : "UPI") as
        "UPI" | "CARD" | "COD" | string,
      status: (typeof p["status"] === "string" ? p["status"] : "PENDING") as
        "PENDING" | "PAID" | "FAILED" | "COD_DUE" | string,
      amountDuePaise:
        typeof p["amountDuePaise"] === "number" ? (p["amountDuePaise"] as number) : totalPaise,
    };
  } else {
    const rawMethod = String(r.payment_method || r.paymentMethod || "UPI").toUpperCase();
    const method = rawMethod.includes("COD")
      ? ("COD" as const)
      : rawMethod.includes("CARD")
        ? ("CARD" as const)
        : ("UPI" as const);
    const rawStatus = String(
      r.payment_status || r.paymentStatus || (method === "COD" ? "COD_DUE" : "PENDING"),
    ).toUpperCase();
    const status = ["PENDING", "PAID", "FAILED", "COD_DUE"].includes(rawStatus)
      ? (rawStatus as "PENDING" | "PAID" | "FAILED" | "COD_DUE")
      : ("PENDING" as const);

    payment = {
      method,
      status,
      amountDuePaise: totalPaise,
    };
  }

  // 9. Status history
  let statusHistory: {
    status: string | number;
    timestamp: string | number;
    description?: string;
    source?: string;
  }[] = [];
  if (Array.isArray(r.statusHistory)) {
    statusHistory = (r.statusHistory as Record<string, unknown>[]).map((h) => ({
      status: (h["status"] as string | number) ?? "PLACED",
      timestamp: (h["timestamp"] as string | number) ?? createdAt,
      description: h["description"] ? String(h["description"]) : undefined,
      source: h["source"] ? String(h["source"]) : undefined,
    }));
  } else if (Array.isArray(r.status_history)) {
    statusHistory = (r.status_history as Record<string, unknown>[]).map((h) => ({
      status: (h["status"] as string | number) ?? "PLACED",
      timestamp: (h["timestamp"] as string | number) ?? createdAt,
      description: h["description"] ? String(h["description"]) : undefined,
      source: h["source"] ? String(h["source"]) : undefined,
    }));
  } else {
    statusHistory = [
      {
        status: "PLACED",
        timestamp: createdAt,
        description: "Order placed successfully",
        source: "system",
      },
    ];
  }

  const normalized: NormalizedOrder = {
    id,
    orderNumber,
    createdAt,
    estimatedDelivery: String(
      r.estimatedDelivery || r.estimated_delivery || "Estimated in 35–50 mins",
    ),
    status: (r.status as string | number) ?? (r.order_status as string | number) ?? "PLACED",
    contact,
    shippingAddress,
    deliveryInstructions: r.deliveryInstructions
      ? String(r.deliveryInstructions)
      : r.delivery_instructions
        ? String(r.delivery_instructions)
        : undefined,
    items,
    sellers,
    subtotalPaise,
    deliveryPaise,
    discountPaise,
    couponCode: r.couponCode
      ? String(r.couponCode)
      : r.coupon_code
        ? String(r.coupon_code)
        : undefined,
    taxPaise,
    totalPaise,
    payment,
    statusHistory,
  };

  return OrderSchema.parse(normalized);
}
