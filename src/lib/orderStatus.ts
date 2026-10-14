// src/lib/orderStatus.ts
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "COD_DUE";

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

export function getPaymentBadgeProps(status: PaymentStatus): {
  label: string;
  className: string;
} {
  switch (status) {
    case "PAID":
      return {
        label: "Paid",
        className: "bg-emerald-50 text-emerald-700 border-emerald-200",
      };
    case "COD_DUE":
      return {
        label: "Cash on Delivery",
        className: "bg-blue-50 text-blue-700 border-blue-200",
      };
    case "FAILED":
      return {
        label: "Payment Failed",
        className: "bg-rose-50 text-rose-700 border-rose-200",
      };
    case "PENDING":
    default:
      return {
        label: "Payment Pending",
        className: "bg-amber-50 text-amber-700 border-amber-200",
      };
  }
}

export function getOrderStatusBadgeProps(status: number | string): {
  label: string;
  className: string;
} {
  const num = typeof status === "number" ? status : 0;
  if (num >= 5) {
    return {
      label: "Delivered",
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    };
  }
  if (num >= 4) {
    return {
      label: "Out for Delivery",
      className: "bg-indigo-50 text-indigo-700 border-indigo-200",
    };
  }
  if (num >= 3) {
    return {
      label: "In Transit",
      className: "bg-purple-50 text-purple-700 border-purple-200",
    };
  }
  if (num >= 2) {
    return {
      label: "Dispatched",
      className: "bg-blue-50 text-blue-700 border-blue-200",
    };
  }
  if (num >= 1) {
    return {
      label: "Preparing",
      className: "bg-amber-50 text-amber-700 border-amber-200",
    };
  }
  return {
    label: "Order Placed",
    className: "bg-gray-100 text-gray-800 border-gray-200",
  };
}
