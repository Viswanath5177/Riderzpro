import { createFileRoute, Link } from "@tanstack/react-router";
import { Package, ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { inr } from "@/lib/data";
import { ORDER_STEPS, useStore } from "@/lib/store";

export const Route = createFileRoute("/orders")({
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
  const { orders } = useStore();
  return (
    <SiteLayout>
      <div className="mx-auto max-w-4xl px-4 py-8 md:px-6">
        <h1 className="font-display text-5xl md:text-7xl">My orders</h1>
        {orders.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-border p-16 text-center">
            <Package className="mx-auto h-12 w-12 text-primary" />
            <p className="mt-3 font-display text-3xl">No orders yet</p>
            <Link to="/shop" className="mt-4 inline-flex rounded-full bg-primary px-5 py-2.5 font-semibold text-primary-foreground">Start shopping</Link>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {orders.map((o) => (
              <Link key={o.id} to="/track/$id" params={{ id: o.shipmentId || o.id }} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-card transition hover:border-primary">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent text-accent-foreground"><Package className="h-5 w-5" /></span>
                <div className="flex-1">
                  <p className="font-semibold">{o.id} · {o.groups.length} sellers</p>
                  <p className="text-sm text-muted-foreground">{new Date(o.createdAt).toLocaleString("en-IN")}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{inr(o.total)}</p>
                  <p className={`text-xs font-semibold ${o.status === 5 ? "text-success" : "text-primary"}`}>{ORDER_STEPS[o.status]}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
