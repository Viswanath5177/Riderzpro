/**
 * In-memory orders fallback when PostgreSQL is unavailable.
 * Used so live API + Razorpay amount-from-DB still work for demo.
 */

export type StoredOrderItem = {
  productId: string;
  name: string;
  imageUrl: string;
  qty: number;
  unitPrice: number; // rupees
  lineTotal: number;
  sellerId: string;
  sellerName: string;
};

export type StoredOrder = {
  id: string;
  orderNumber: string;
  customerId: string;
  sellerId: string;
  status: string;
  totalAmount: number; // rupees — source of truth for Razorpay
  subtotal: number;
  deliveryFee: number;
  discount: number;
  tax: number;
  paymentMethod: string;
  paymentStatus: string;
  shippingAddress: Record<string, unknown>;
  contact: { name: string; phone: string; email?: string };
  deliveryInstructions?: string;
  couponCode?: string;
  items: StoredOrderItem[];
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt: string;
};

const ordersById = new Map<string, StoredOrder>();
const ordersByNumber = new Map<string, StoredOrder>();
const ordersByCustomer = new Map<string, string[]>();

function indexOrder(order: StoredOrder) {
  ordersById.set(order.id, order);
  ordersByNumber.set(order.orderNumber, order);
  const list = ordersByCustomer.get(order.customerId) || [];
  if (!list.includes(order.id)) {
    ordersByCustomer.set(order.customerId, [order.id, ...list]);
  }
}

export function memorySaveOrder(order: StoredOrder): StoredOrder {
  indexOrder(order);
  return order;
}

export function memoryGetOrder(idOrNumber: string): StoredOrder | null {
  return ordersById.get(idOrNumber) || ordersByNumber.get(idOrNumber) || null;
}

export function memoryListOrdersForCustomer(customerId: string): StoredOrder[] {
  const ids = ordersByCustomer.get(customerId) || [];
  // Also return all if guest / unknown — demo convenience for cookie-less sessions
  if (customerId === "cst_guest" || customerId === "anonymous") {
    return Array.from(ordersById.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }
  return ids
    .map((id) => ordersById.get(id))
    .filter((o): o is StoredOrder => Boolean(o));
}

export function memoryUpdateOrder(
  idOrNumber: string,
  patch: Partial<StoredOrder>,
): StoredOrder | null {
  const existing = memoryGetOrder(idOrNumber);
  if (!existing) return null;
  const updated = { ...existing, ...patch };
  indexOrder(updated);
  return updated;
}

export function memoryListAllOrders(): StoredOrder[] {
  return Array.from(ordersById.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

/** Shape expected by normalizeOrder / frontend contract */
export function toApiOrderShape(order: StoredOrder) {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    createdAt: new Date(order.createdAt).getTime(),
    status: order.status,
    contact: order.contact,
    shippingAddress: {
      street: String(order.shippingAddress.street || ""),
      locality: String(order.shippingAddress.locality || order.shippingAddress.city || "Delhi"),
      landmark: order.shippingAddress.landmark
        ? String(order.shippingAddress.landmark)
        : undefined,
      city: String(order.shippingAddress.city || "Delhi"),
      state: String(order.shippingAddress.state || "Delhi"),
      pincode: String(order.shippingAddress.pincode || "110001"),
      latitude: order.shippingAddress.latitude as number | undefined,
      longitude: order.shippingAddress.longitude as number | undefined,
    },
    deliveryInstructions: order.deliveryInstructions,
    items: order.items.map((it) => ({
      productId: it.productId,
      name: it.name,
      imageUrl: it.imageUrl,
      qty: it.qty,
      unitPricePaise: Math.round(it.unitPrice * 100),
      lineTotalPaise: Math.round(it.lineTotal * 100),
      sellerId: it.sellerId,
    })),
    sellers: Array.from(
      new Map(
        order.items.map((it) => [it.sellerId, { id: it.sellerId, name: it.sellerName }]),
      ).values(),
    ),
    subtotalPaise: Math.round(order.subtotal * 100),
    deliveryPaise: Math.round(order.deliveryFee * 100),
    discountPaise: Math.round(order.discount * 100),
    couponCode: order.couponCode,
    taxPaise: Math.round(order.tax * 100),
    totalPaise: Math.round(order.totalAmount * 100),
    payment: {
      method: order.paymentMethod,
      status: order.paymentStatus,
      amountDuePaise: Math.round(order.totalAmount * 100),
    },
    statusHistory: [
      {
        status: order.status,
        timestamp: new Date(order.createdAt).getTime(),
        description: "Order placed",
        source: "system",
      },
    ],
  };
}
