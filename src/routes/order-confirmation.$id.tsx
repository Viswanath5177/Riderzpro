// src/routes/order-confirmation.$id.tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Copy,
  Check,
  Truck,
  Package,
  MapPin,
  CreditCard,
  User,
  Phone,
  Mail,
  ArrowRight,
  Store,
  Tag,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/SiteLayout";
import { getOrder, formatPaise, type ApiOrder } from "@/lib/api/orders";
import {
  getPaymentStatusLabel,
  getPaymentBadgeProps,
  getOrderStatusBadgeProps,
} from "@/lib/orderStatus";

export const Route = createFileRoute("/order-confirmation/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Order Confirmed #${params.id} — RiderzPro` },
      { name: "description", content: "Your EV parts order has been confirmed." },
    ],
  }),
  component: OrderConfirmationPage,
});

function OrderConfirmationPage() {
  const { id } = Route.useParams();
  const [order, setOrder] = useState<ApiOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    getOrder(id)
      .then((data) => {
        if (isMounted) {
          setOrder(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err?.message || "Order not found");
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleCopyId = () => {
    if (!order) return;
    navigator.clipboard.writeText(order.orderNumber || order.id);
    setCopied(true);
    toast.success("Order ID copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-3xl px-4 py-12 md:py-16 space-y-6">
          <div className="h-20 w-full animate-pulse rounded-2xl bg-gray-200" />
          <div className="h-64 w-full animate-pulse rounded-2xl bg-gray-200" />
          <div className="h-48 w-full animate-pulse rounded-2xl bg-gray-200" />
        </div>
      </SiteLayout>
    );
  }

  if (error || !order) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-xl px-4 py-16 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-red-50 text-red-600 border border-red-200">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900 font-display">Order Not Found</h1>
          <p className="mt-2 text-sm text-gray-600">
            We couldn't retrieve the details for order #{id}. It may have expired from session
            storage or does not exist.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              to="/orders"
              className="inline-flex items-center gap-2 rounded-xl bg-[#E31E24] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-red-700 transition"
            >
              <Package className="h-4 w-4" />
              <span>View My Orders</span>
            </Link>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </SiteLayout>
    );
  }

  const placedDateStr = new Date(order.createdAt).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const paymentBadge = getPaymentBadgeProps(order.payment.status);
  const orderStatusBadge = getOrderStatusBadgeProps(order.status);
  const formattedTotal = formatPaise(order.totalPaise);
  const paymentLabel = getPaymentStatusLabel(order.payment.status, formattedTotal);

  // Group items by seller
  const sellerGroups = (order.sellers || []).map((seller) => {
    const items = (order.items || []).filter((it) => it.sellerId === seller.id);
    return {
      seller,
      items: items.length > 0 ? items : order.items,
    };
  });

  // If no sellers explicit, group everything as single group
  const displayGroups =
    sellerGroups.length > 0
      ? sellerGroups
      : [
          {
            seller: { id: "default", name: "RiderzPro Verified Supplier" },
            items: order.items,
          },
        ];

  return (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 py-8 md:py-12 animate-in fade-in duration-200">
        {/* Header Hero */}
        <div className="text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-2xs">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <span className="mt-4 inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            Order Confirmed & Placed
          </span>
          <h1 className="mt-2 text-2xl sm:text-4xl font-extrabold text-gray-900 font-display">
            Thank you, {order.contact.name}!
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-gray-500">
            We have received your order and notified our Delhi supplier network for fulfillment.
          </p>

          {/* Order Details Ribbon */}
          <div className="mt-4 inline-flex flex-wrap items-center justify-center gap-2 rounded-xl bg-gray-50 border border-gray-200 px-4 py-2 text-xs">
            <span className="text-gray-500">Order ID:</span>
            <span className="font-mono font-bold text-gray-900">
              {order.orderNumber || order.id}
            </span>
            <button
              onClick={handleCopyId}
              type="button"
              className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-semibold text-gray-700 hover:bg-gray-200 transition cursor-pointer"
            >
              {copied ? (
                <Check className="h-3 w-3 text-emerald-600" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
            <span className="text-gray-300">·</span>
            <span className="text-gray-500">{placedDateStr}</span>
            <span className="text-gray-300">·</span>
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-bold border ${orderStatusBadge.className}`}
            >
              {orderStatusBadge.label}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/track/$id"
            params={{ id: order.id }}
            className="inline-flex items-center gap-2 rounded-xl bg-[#E31E24] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-red-700 transition"
          >
            <Truck className="h-4 w-4" />
            <span>Track Order</span>
          </Link>
          <Link
            to="/orders"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            <Package className="h-4 w-4" />
            <span>View All Orders</span>
          </Link>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 space-y-6">
          {/* Customer & Delivery Information Card */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Contact Details */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                <User className="h-4 w-4 text-[#E31E24]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900">
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
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900">
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

          {/* Items Snapshot Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-[#E31E24]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                  Ordered Items ({order.items.length})
                </h3>
              </div>
              <span className="text-xs font-semibold text-gray-500">
                Estimated Delivery:{" "}
                <strong className="text-gray-900">{order.estimatedDelivery}</strong>
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

          {/* Price Breakdown & Payment Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-[#E31E24]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                  Payment & Price Breakdown
                </h3>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-xs font-bold border ${paymentBadge.className}`}
              >
                {paymentBadge.label}
              </span>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Payment Summary */}
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs space-y-1">
                  <p className="font-bold text-gray-900">Payment Method: {order.payment.method}</p>
                  <p className="text-gray-600 font-semibold">{paymentLabel}</p>
                  {order.payment.method === "COD" && (
                    <p className="text-amber-800 text-[11px] pt-1">
                      Please have the cash ready when your courier arrives.
                    </p>
                  )}
                </div>
              </div>

              {/* Price Breakdown */}
              <dl className="space-y-2 text-xs text-gray-600">
                <div className="flex justify-between">
                  <dt>Items Subtotal</dt>
                  <dd className="font-semibold text-gray-900">
                    {formatPaise(order.subtotalPaise)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt>Doorstep Consolidated Logistics</dt>
                  <dd className="font-semibold text-gray-900">
                    {formatPaise(order.deliveryPaise)}
                  </dd>
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
        </div>
      </div>
    </SiteLayout>
  );
}
