// src/lib/orderStatus.ts

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "COD_DUE";

export interface StatusMetadata {
  label: string;
  colour: string; // Tailwind styling class
  orderStepsIndex: number; // 0 to 5 for ORDER_STEPS in store.tsx
  isActive: boolean;
  isTerminal: boolean;
}

// Set to deduplicate warnings for unknown statuses
const warnedUnknownStatuses = new Set<string>();

/**
 * Table: server status -> label, colour, ORDER_STEPS index, isActive/isTerminal.
 * TODO: Confirm final DB status enums with Vamsi and courier event codes with Viswanath.
 */
export const ORDER_STATUS_MAP: Record<string, StatusMetadata> = {
  // 0. Placed
  PLACED: {
    label: "Order Placed",
    colour: "bg-blue-50 text-blue-700 border-blue-200",
    orderStepsIndex: 0,
    isActive: true,
    isTerminal: false,
  },
  CONFIRMED: {
    label: "Order Confirmed",
    colour: "bg-blue-50 text-blue-700 border-blue-200",
    orderStepsIndex: 0,
    isActive: true,
    isTerminal: false,
  },
  // 1. Vendor Accepted / Packed
  PACKED: {
    label: "Packed & Ready",
    colour: "bg-amber-50 text-amber-700 border-amber-200",
    orderStepsIndex: 1,
    isActive: true,
    isTerminal: false,
  },
  VENDOR_ACCEPTED: {
    label: "Vendor Accepted",
    colour: "bg-amber-50 text-amber-700 border-amber-200",
    orderStepsIndex: 1,
    isActive: true,
    isTerminal: false,
  },
  // 2. Rider Assigned / Picked Up
  RIDER_ASSIGNED: {
    label: "Rider Assigned",
    colour: "bg-purple-50 text-purple-700 border-purple-200",
    orderStepsIndex: 2,
    isActive: true,
    isTerminal: false,
  },
  PICKED_UP: {
    label: "Picked Up",
    colour: "bg-indigo-50 text-indigo-700 border-indigo-200",
    orderStepsIndex: 3,
    isActive: true,
    isTerminal: false,
  },
  // 3. Dispatched / In Transit
  DISPATCHED: {
    label: "Dispatched",
    colour: "bg-indigo-50 text-indigo-700 border-indigo-200",
    orderStepsIndex: 3,
    isActive: true,
    isTerminal: false,
  },
  SHIPPED: {
    label: "In Transit",
    colour: "bg-indigo-50 text-indigo-700 border-indigo-200",
    orderStepsIndex: 3,
    isActive: true,
    isTerminal: false,
  },
  IN_TRANSIT: {
    label: "In Transit",
    colour: "bg-indigo-50 text-indigo-700 border-indigo-200",
    orderStepsIndex: 3,
    isActive: true,
    isTerminal: false,
  },
  // 4. Out For Delivery
  OUT_FOR_DELIVERY: {
    label: "Out for Delivery",
    colour: "bg-teal-50 text-teal-700 border-teal-200",
    orderStepsIndex: 4,
    isActive: true,
    isTerminal: false,
  },
  ON_THE_WAY: {
    label: "On the Way",
    colour: "bg-teal-50 text-teal-700 border-teal-200",
    orderStepsIndex: 4,
    isActive: true,
    isTerminal: false,
  },
  // 5. Delivered (Terminal Success)
  DELIVERED: {
    label: "Delivered",
    colour: "bg-emerald-50 text-emerald-700 border-emerald-200",
    orderStepsIndex: 5,
    isActive: false,
    isTerminal: true,
  },
  // Terminal Exceptions
  CANCELLED: {
    label: "Cancelled",
    colour: "bg-rose-50 text-rose-700 border-rose-200",
    orderStepsIndex: 0,
    isActive: false,
    isTerminal: true,
  },
  REFUNDED: {
    label: "Refunded",
    colour: "bg-gray-100 text-gray-700 border-gray-300",
    orderStepsIndex: 0,
    isActive: false,
    isTerminal: true,
  },
  RETURNED: {
    label: "Returned",
    colour: "bg-amber-50 text-amber-800 border-amber-300",
    orderStepsIndex: 0,
    isActive: false,
    isTerminal: true,
  },
  FAILED: {
    label: "Delivery Failed",
    colour: "bg-red-50 text-red-700 border-red-300",
    orderStepsIndex: 0,
    isActive: false,
    isTerminal: true,
  },
};

/**
 * Resolves metadata for any order status string or number.
 * Falls back safely to neutral "Processing" if unknown, issuing a single console.warn.
 */
export function getOrderStatusMetadata(status: string | number | undefined): StatusMetadata {
  if (status === undefined || status === null) {
    return {
      label: "Processing",
      colour: "bg-gray-100 text-gray-700 border-gray-200",
      orderStepsIndex: 0,
      isActive: true,
      isTerminal: false,
    };
  }

  // Handle numeric legacy statuses 0 to 5
  if (typeof status === "number") {
    switch (status) {
      case 0:
        return ORDER_STATUS_MAP["PLACED"];
      case 1:
        return ORDER_STATUS_MAP["PACKED"];
      case 2:
        return ORDER_STATUS_MAP["RIDER_ASSIGNED"];
      case 3:
        return ORDER_STATUS_MAP["DISPATCHED"];
      case 4:
        return ORDER_STATUS_MAP["OUT_FOR_DELIVERY"];
      case 5:
        return ORDER_STATUS_MAP["DELIVERED"];
      default:
        break;
    }
  }

  const normalizedKey = String(status).trim().toUpperCase().replace(/[\s-]/g, "_");
  if (ORDER_STATUS_MAP[normalizedKey]) {
    return ORDER_STATUS_MAP[normalizedKey];
  }

  // Handle unknown status gracefully
  if (!warnedUnknownStatuses.has(normalizedKey)) {
    warnedUnknownStatuses.add(normalizedKey);
    console.warn(
      `[OrderStatus] Unknown status encountered: "${status}". Falling back to "Processing".`,
    );
  }

  return {
    label: "Processing",
    colour: "bg-gray-100 text-gray-700 border-gray-200",
    orderStepsIndex: 0,
    isActive: true,
    isTerminal: false,
  };
}

export function getOrderStatusBadgeProps(status: number | string | undefined): {
  label: string;
  className: string;
} {
  const meta = getOrderStatusMetadata(status);
  return {
    label: meta.label,
    className: meta.colour,
  };
}

export function getPaymentStatusLabel(status: PaymentStatus, amountFormatted: string): string {
  switch (status) {
    case "COD_DUE":
      return `Amount to pay on delivery ${amountFormatted}`;
    case "PAID":
      return `Amount paid ${amountFormatted}`;
    case "PENDING":
    default:
      return `Payment pending ${amountFormatted}`;
  }
}

export function getPaymentBadgeProps(status: PaymentStatus | string): {
  label: string;
  className: string;
} {
  const norm = String(status || "").toUpperCase();
  switch (norm) {
    case "PAID":
      return {
        label: "Paid",
        className: "bg-emerald-50 text-emerald-700 border-emerald-200",
      };
    case "COD_DUE":
      return {
        label: "COD Due",
        className: "bg-blue-50 text-blue-700 border-blue-200",
      };
    case "FAILED":
      return {
        label: "Failed",
        className: "bg-rose-50 text-rose-700 border-rose-200",
      };
    case "PENDING":
    default:
      return {
        label: "Pending",
        className: "bg-amber-50 text-amber-700 border-amber-200",
      };
  }
}

export function isOrderActive(status: number | string | undefined): boolean {
  return getOrderStatusMetadata(status).isActive;
}

export function isOrderTerminal(status: number | string | undefined): boolean {
  return getOrderStatusMetadata(status).isTerminal;
}
