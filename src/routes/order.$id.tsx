// src/routes/order.$id.tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, AlertCircle, Package, Download } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useAuth } from "@/lib/auth";
import { useStore, type Order as StoreOrder } from "@/lib/store";
import { getOrder, type ApiOrder } from "@/lib/api/orders";
import { OrderDetailsView } from "@/components/orders/OrderDetailsView";
import { DeliveryMap } from "@/components/map/DeliveryMap";
import { InvoiceModal } from "@/components/dashboard/InvoiceModal";

export const Route = createFileRoute("/order/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Order #${params.id} — RiderzPro` },
      { name: "description", content: "View order receipt, items, payment, and delivery details." },
      { property: "og:title", content: `Order #${params.id} — RiderzPro` },
      { property: "og:description", content: "EV parts order details and live courier telemetry." },
    ],
  }),
  component: OrderDetailPage,
});

function OrderDetailPage() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const { syncApiOrders } = useStore() as any;
  const [showInvoice, setShowInvoice] = useState(false);

  const {
    data: order,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<ApiOrder, Error>({
    queryKey: ["order", user?.id, id],
    queryFn: () => getOrder(id, user?.id),
    // Live courier status polling every 5s when order is active
    refetchInterval: (query) => {
      const status = String(query.state.data?.status || "").toUpperCase();
      const isTerminal =
        ["DELIVERED", "CANCELLED", "RETURNED"].includes(status) || query.state.data?.status === 5;
      return isTerminal ? false : 5000;
    },
  });

  // Mirror into store for legacy dashboard/vendor/cart parity
  useEffect(() => {
    if (order) {
      syncApiOrders?.([order]);
    }
  }, [order, syncApiOrders]);

  // Adapt ApiOrder to StoreOrder for InvoiceModal
  const storeOrderForInvoice = useMemo<StoreOrder | null>(() => {
    if (!order) return null;
    return {
      id: order.orderNumber || order.id,
      createdAt: order.createdAt,
      groups: (order.sellers || []).map((s) => ({
        vendorId: s.id,
        items: (order.items || [])
          .filter((it) => it.sellerId === s.id)
          .map((it) => ({
            productId: it.productId,
            qty: it.qty,
            price: Math.round(it.unitPricePaise / 100),
          })),
        subtotal: Math.round(order.subtotalPaise / 100),
        km: 4.5,
        fee: Math.round(order.deliveryPaise / 100),
        eta: 25,
      })),
      itemsTotal: Math.round(order.subtotalPaise / 100),
      deliveryTotal: Math.round(order.deliveryPaise / 100),
      discountTotal: Math.round((order.discountPaise || 0) / 100),
      couponCode: order.couponCode,
      tax: Math.round(order.taxPaise / 100),
      total: Math.round(order.totalPaise / 100),
      eta: 25,
      payment: `${order.payment.method} · ${order.payment.status}`,
      status: typeof order.status === "number" ? order.status : 0,
    };
  }, [order]);

  if (isLoading) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-4xl px-4 py-8 md:px-6 space-y-6">
          <div className="h-6 w-36 bg-gray-200 rounded animate-pulse" />
          <div className="h-24 w-full bg-gray-200 rounded-2xl animate-pulse" />
          <div className="h-72 w-full bg-gray-200 rounded-2xl animate-pulse" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="h-44 bg-gray-200 rounded-2xl animate-pulse" />
            <div className="h-44 bg-gray-200 rounded-2xl animate-pulse" />
          </div>
          <div className="h-64 bg-gray-200 rounded-2xl animate-pulse" />
        </div>
      </SiteLayout>
    );
  }

  if (isError || !order) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-xl px-4 py-16 text-center space-y-4">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-red-50 text-red-600 border border-red-200">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">Order Not Found</h1>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            {error?.message ||
              `We couldn't retrieve order #${id}. It may have been placed in another session or does not exist.`}
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-gray-800 transition cursor-pointer"
            >
              Retry
            </button>
            <Link
              to="/orders"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to My Orders</span>
            </Link>
          </div>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="mx-auto max-w-4xl px-4 py-8 md:px-6">
        {/* Navigation & Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-4">
          <Link
            to="/orders"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-600 hover:text-gray-900 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to My Orders</span>
          </Link>

          <div className="flex items-center gap-2">
            {/* Download Invoice link from Sathwik's invoice module */}
            <button
              type="button"
              onClick={() => setShowInvoice(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer shadow-2xs"
            >
              <Download className="h-3.5 w-3.5 text-gray-500" />
              <span>Download Invoice</span>
            </button>

            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              <Package className="h-3.5 w-3.5" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Viswanath's <DeliveryMap orderId={order.id} /> with live telemetry */}
        <div className="mb-6 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-800">
                Live Courier Delivery Map
              </span>
            </div>
            <span className="text-[11px] text-gray-500">Auto-refresh: 5s</span>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-2xs bg-white">
            <DeliveryMap orderId={order.orderNumber || order.id} className="h-72 sm:h-80 w-full" />
          </div>
        </div>

        {/* Shared Order Details View with Status Timeline */}
        <OrderDetailsView
          order={order}
          titlePrefix="Order ID"
          onDownloadInvoice={() => setShowInvoice(true)}
        />

        {/* Invoice Modal */}
        {showInvoice && storeOrderForInvoice && (
          <InvoiceModal order={storeOrderForInvoice} onClose={() => setShowInvoice(false)} />
        )}
      </div>
    </SiteLayout>
  );
}
