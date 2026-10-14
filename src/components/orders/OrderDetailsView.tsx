// src/components/orders/OrderDetailsView.tsx
import { useState } from "react";
import {
  Copy,
  Check,
  User,
  Phone,
  Mail,
  MapPin,
  Package,
  CreditCard,
  Store,
  Tag,
  Clock,
  CircleDot,
  CheckCircle2,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import { formatPaise, type ApiOrder } from "@/lib/api/orders";
import {
  getPaymentStatusLabel,
  getPaymentBadgeProps,
  getOrderStatusBadgeProps,
  getOrderStatusMetadata,
} from "@/lib/orderStatus";

interface OrderDetailsViewProps {
  order: ApiOrder;
  titlePrefix?: string;
  onDownloadInvoice?: () => void;
}

export function OrderDetailsView({ order, titlePrefix, onDownloadInvoice }: OrderDetailsViewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(order.orderNumber || order.id);
    setCopied(true);
    toast.success("Order ID copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const placedDateStr = new Date(order.createdAt).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const paymentBadge = getPaymentBadgeProps(order.payment.status);
  const orderStatusBadge = getOrderStatusBadgeProps(order.status);
  const formattedTotal = formatPaise(order.totalPaise);
  const paymentLabel = getPaymentStatusLabel(
    order.payment.status as import("@/lib/orderStatus").PaymentStatus,
    formattedTotal,
  );

  // Group items by seller
  const sellerGroups = (order.sellers || []).map((seller) => {
    const items = (order.items || []).filter((it) => it.sellerId === seller.id);
    return {
      seller,
      items: items.length > 0 ? items : order.items,
    };
  });

  const displayGroups =
    sellerGroups.length > 0
      ? sellerGroups
      : [
          {
            seller: { id: "default", name: "RiderzPro Verified Supplier" },
            items: order.items,
          },
        ];

  const history = order.statusHistory || [
    {
      status: order.status,
      timestamp: order.createdAt,
      description: "Order placed by customer",
      source: "customer",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Order Identity Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-gray-500">{titlePrefix || "Order ID"}:</span>
          <span className="font-mono font-bold text-gray-900 text-sm">
            {order.orderNumber || order.id}
          </span>
          <button
            onClick={handleCopyId}
            type="button"
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-100 transition cursor-pointer"
          >
            {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
          {onDownloadInvoice && (
            <button
              onClick={onDownloadInvoice}
              type="button"
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-100 transition cursor-pointer"
            >
              <Download className="h-3 w-3 text-gray-500" />
              <span>Invoice</span>
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 text-gray-500">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-gray-400" />
            <span>{placedDateStr}</span>
          </span>
          <span className="text-gray-300">·</span>
          <span
            className={`px-2 py-0.5 rounded text-[11px] font-bold border ${orderStatusBadge.className}`}
          >
            {orderStatusBadge.label}
          </span>
          <span
            className={`px-2 py-0.5 rounded text-[11px] font-bold border ${paymentBadge.className}`}
          >
            {paymentBadge.label}
          </span>
        </div>
      </div>

      {/* Customer & Address Details */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Contact Details */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <User className="h-4 w-4 text-[#E31E24]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 font-display">
              Customer Contact
            </h3>
          </div>
          <div className="text-xs space-y-1.5 text-gray-700">
            <p className="font-bold text-gray-900 text-sm">{order.contact.name}</p>
            <p className="flex items-center gap-1.5 text-gray-600">
              <Phone className="h-3.5 w-3.5 text-gray-400" />
              <span>+91 {order.contact.phone}</span>
            </p>
            {order.contact.email && (
              <p className="flex items-center gap-1.5 text-gray-600">
                <Mail className="h-3.5 w-3.5 text-gray-400" />
                <span>{order.contact.email}</span>
              </p>
            )}
          </div>
        </div>

        {/* Delivery Address */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#E31E24]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 font-display">
                Delivery Address
              </h3>
            </div>
            <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              Delhi Delivery
            </span>
          </div>
          <div className="text-xs space-y-1 text-gray-700">
            <p className="font-medium text-gray-900">{order.shippingAddress.street}</p>
            <p className="text-gray-600">
              {order.shippingAddress.locality}
              {order.shippingAddress.landmark ? `, Near ${order.shippingAddress.landmark}` : ""}
            </p>
            <p className="text-gray-600">
              {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
              <span className="font-mono font-bold text-gray-900">
                {order.shippingAddress.pincode}
              </span>
            </p>
            {order.deliveryInstructions && (
              <div className="mt-2 pt-2 border-t border-gray-100 text-[11px] text-gray-500 italic">
                Instructions: "{order.deliveryInstructions}"
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ordered Items Grouped By Seller */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-[#E31E24]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 font-display">
              Items Ordered ({order.items.length})
            </h3>
          </div>
          <span className="text-xs font-semibold text-gray-500">
            Est. Delivery: <strong className="text-gray-900">{order.estimatedDelivery}</strong>
          </span>
        </div>

        <div className="space-y-4">
          {displayGroups.map((group, gIdx) => (
            <div
              key={gIdx}
              className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 space-y-3"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-gray-800 border-b border-gray-200/60 pb-2">
                <Store className="h-3.5 w-3.5 text-[#E31E24]" />
                <span>Seller: {group.seller.name}</span>
              </div>

              <div className="divide-y divide-gray-200/60">
                {group.items.map((it, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2.5 gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={it.imageUrl}
                        alt={it.name}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = "/src/assets/parts.jpg";
                        }}
                        className="h-12 w-12 rounded-lg object-cover border border-gray-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-xs text-gray-900 truncate">{it.name}</p>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          {formatPaise(it.unitPricePaise)} × {it.qty}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-extrabold text-xs text-gray-900">
                        {formatPaise(it.lineTotalPaise)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment & Price Breakdown */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-[#E31E24]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 font-display">
              Payment & Price Summary
            </h3>
          </div>
          <span
            className={`px-2 py-0.5 rounded text-xs font-bold border ${paymentBadge.className}`}
          >
            {paymentBadge.label}
          </span>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Payment Details */}
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs space-y-1">
              <p className="font-bold text-gray-900">Payment Method: {order.payment.method}</p>
              <p className="text-gray-700 font-semibold">{paymentLabel}</p>
              {order.payment.method === "COD" && (
                <p className="text-amber-800 text-[11px] pt-1 font-medium">
                  Please keep exact cash ready for the courier partner.
                </p>
              )}
            </div>
          </div>

          {/* Price Breakdown */}
          <dl className="space-y-2 text-xs text-gray-600">
            <div className="flex justify-between">
              <dt>Items Subtotal</dt>
              <dd className="font-semibold text-gray-900">{formatPaise(order.subtotalPaise)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Doorstep Consolidated Logistics</dt>
              <dd className="font-semibold text-gray-900">{formatPaise(order.deliveryPaise)}</dd>
            </div>
            {order.discountPaise > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <dt className="flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  <span>Coupon Discount {order.couponCode ? `(${order.couponCode})` : ""}</span>
                </dt>
                <dd>- {formatPaise(order.discountPaise)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt>GST (18% Statutory EV Tax)</dt>
              <dd className="font-semibold text-gray-900">{formatPaise(order.taxPaise)}</dd>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between font-extrabold text-base text-gray-900">
              <dt>Total Amount</dt>
              <dd className="text-[#E31E24]">{formatPaise(order.totalPaise)}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Status Timeline (Vertical on Phones & Desktop) */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
          <CircleDot className="h-4 w-4 text-[#E31E24]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 font-display">
            Order Status Timeline
          </h3>
        </div>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
          {history.map((event, idx) => {
            const meta = getOrderStatusMetadata(event.status);
            const isLast = idx === history.length - 1;
            const timeFormatted = new Date(
              typeof event.timestamp === "number" ? event.timestamp : Date.now(),
            ).toLocaleString("en-IN", {
              dateStyle: "short",
              timeStyle: "short",
            });

            return (
              <div key={idx} className="relative flex items-start gap-3">
                <div
                  className={`absolute -left-6 mt-0.5 grid h-5 w-5 place-items-center rounded-full border bg-white ${
                    isLast
                      ? "border-[#E31E24] text-[#E31E24] ring-2 ring-red-100"
                      : "border-emerald-600 text-emerald-600"
                  }`}
                >
                  {isLast ? (
                    <CircleDot className="h-3 w-3 stroke-[3]" />
                  ) : (
                    <CheckCircle2 className="h-3 w-3 stroke-[3]" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <span className="text-xs font-bold text-gray-900">{meta.label}</span>
                    <span className="text-[11px] text-gray-400">{timeFormatted}</span>
                  </div>
                  {event.description && (
                    <p className="text-xs text-gray-600 mt-0.5">{event.description}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
