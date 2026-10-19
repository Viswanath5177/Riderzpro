import { useState, useEffect } from "react";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { Package, ArrowRight, RefreshCw } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { inr } from "@/lib/data";
import { getCurrentRole, useAuth } from "@/lib/auth";
import { isMobileDevice } from "@/lib/native/app";

export const Route = createFileRoute("/orders")({
  beforeLoad: async () => {
    if (typeof window === "undefined") {
      return;
    }
    if (isMobileDevice()) {
      throw redirect({ to: "/app", search: { tab: "orders" } });
    }
    const role = await getCurrentRole();
    if (!role) {
      throw redirect({ to: "/", search: { openLogin: "customer", redirect: "/orders" } });
    }
  },
  head: () => ({
    meta: [
      { title: "My orders — Riderzpro" },
      { name: "description", content: "All your EV parts orders and their live status." },
      { property: "og:title", content: "My orders — Riderzpro" },
      { property: "og:description", content: "Track all your Riderzpro orders." },
    ],
  }),
  component: OrdersRoute,
});

function OrdersRoute() {
  return (
    <ProtectedRoute>
      <Orders />
    </ProtectedRoute>
  );
}

function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = () => {
    setIsLoading(true);
    const query = user?.id ? `?customer_id=${encodeURIComponent(user.id)}` : "";
    fetch(`/api/orders${query}`, { credentials: "include" })
      .then((r) => r.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          setOrders(res.data);
        }
      })
      .catch((err) => {
        console.error("Failed to load customer orders:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, [user?.id]);

  return (
    <SiteLayout>
      <div className="mx-auto max-w-4xl px-4 py-8 md:px-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-4xl md:text-5xl font-black text-[#111111]">My Orders</h1>
          <button
            onClick={fetchOrders}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>

        {isLoading ? (
          <div className="mt-8 space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-24 rounded-2xl bg-gray-100 animate-pulse border border-gray-200" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-border p-16 text-center">
            <Package className="mx-auto h-12 w-12 text-[#E31E24]" />
            <p className="mt-3 font-display text-2xl font-bold text-gray-900">No orders yet</p>
            <p className="mt-1 text-sm text-gray-500">Your genuine EV parts orders will be listed here after checkout.</p>
            <Link to="/shop" className="mt-4 inline-flex rounded-full bg-[#E31E24] px-5 py-2.5 font-semibold text-white shadow-xs hover:bg-red-700 transition">
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {orders.map((o) => {
              const orderId = o.order_number || o.id;
              const dateStr = o.created_at ? new Date(o.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Recent";
              const itemCount = Array.isArray(o.items) ? o.items.length : 1;
              const statusDisplay = (o.status || "confirmed").toUpperCase();

              return (
                <div key={o.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5 shadow-card transition hover:border-[#E31E24]">
                  <div className="flex items-center gap-4">
                    <span className="grid h-12 w-12 place-items-center rounded-xl bg-red-50 text-[#E31E24] border border-red-100">
                      <Package className="h-6 w-6" />
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-mono font-bold text-sm text-[#111111]">#{orderId}</p>
                        <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                          {statusDisplay}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {dateStr} • {itemCount} {itemCount === 1 ? "item" : "items"} {o.store_name ? `from ${o.store_name}` : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                    <div className="text-left sm:text-right">
                      <p className="font-bold text-base text-[#111111]">{inr(o.total_amount)}</p>
                      <p className="text-[11px] font-semibold text-[#6B7280]">Paid via {o.payment_method || "UPI"}</p>
                    </div>
                    <Link
                      to="/track/$id"
                      params={{ id: orderId }}
                      className="inline-flex items-center gap-1 rounded-xl bg-gray-50 hover:bg-gray-100 px-3 py-2 text-xs font-bold text-gray-800 transition"
                    >
                      <span>Track</span>
                      <ArrowRight className="h-3.5 w-3.5 text-gray-500" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
