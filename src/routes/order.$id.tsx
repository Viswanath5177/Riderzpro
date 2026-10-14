// src/routes/order.$id.tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, AlertCircle, Package } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useAuth } from "@/lib/auth";
import { useStore } from "@/lib/store";
import { getOrder, type ApiOrder } from "@/lib/api/orders";
import { OrderDetailsView } from "@/components/orders/OrderDetailsView";

export const Route = createFileRoute("/order/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Order #${params.id} — RiderzPro` },
      { name: "description", content: "View order receipt, items, payment, and delivery details." },
      { property: "og:title", content: `Order #${params.id} — RiderzPro` },
      { property: "og:description", content: "EV parts order details and fulfillment timeline." },
    ],
  }),
  component: OrderDetailPage,
});

function OrderDetailPage() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const { syncApiOrders } = useStore();

  const {
    data: order,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<ApiOrder, Error>({
    queryKey: ["order", user?.id, id],
    queryFn: () => getOrder(id, user?.id),
    // Extension Slot 2: 5s polling interval when order status is active
    // refetchInterval: (query) => {
    //   const status = query.state.data?.status;
    //   return status && !["DELIVERED", "CANCELLED", "RETURNED"].includes(status) ? 5000 : false;
    // },
  });

  // Mirror into store for legacy dashboard/vendor/cart parity
  useEffect(() => {
    if (order) {
      syncApiOrders([order]);
    }
  }, [order, syncApiOrders]);

  if (isLoading) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-4xl px-4 py-8 md:px-6 space-y-6">
          <div className="h-6 w-36 bg-gray-200 rounded animate-pulse" />
          <div className="h-24 w-full bg-gray-200 rounded-2xl animate-pulse" />
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

          {/* Extension Slot 3: Invoice link */}
          {/* <button type="button" onClick={() => downloadInvoice(order.id)} className="...">Download Invoice</button> */}
          <div className="flex items-center gap-2">
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              <Package className="h-3.5 w-3.5" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Extension Slot 1: <DeliveryMap order={order} /> */}
        {/*
          <div className="mb-6">
            <DeliveryMap orderId={order.id} status={order.status} />
          </div>
        */}

        {/* Shared Order Details View */}
        <OrderDetailsView order={order} titlePrefix="Order ID" />
      </div>
    </SiteLayout>
  );
}
