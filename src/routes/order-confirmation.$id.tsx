// src/routes/order-confirmation.$id.tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, Truck, Package, ArrowRight, AlertCircle } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useAuth } from "@/lib/auth";
import { useStore } from "@/lib/store";
import { getOrder, type ApiOrder } from "@/lib/api/orders";
import { OrderDetailsView } from "@/components/orders/OrderDetailsView";

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
  const { user } = useAuth();
  const { syncApiOrders } = useStore() as any;
  const [order, setOrder] = useState<ApiOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    getOrder(id, user?.id)
      .then((data) => {
        if (isMounted) {
          setOrder(data);
          syncApiOrders?.([data]);
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
  }, [id, user?.id, syncApiOrders]);

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
        </div>

        {/* Action Buttons */}
        <div className="mt-6 mb-8 flex flex-wrap items-center justify-center gap-3">
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

        {/* Shared Detailed Order View */}
        <OrderDetailsView order={order} titlePrefix="Confirmed Order ID" />
      </div>
    </SiteLayout>
  );
}
