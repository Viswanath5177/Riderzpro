import { createFileRoute, Link } from "@tanstack/react-router";
import { Package, ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { inr } from "@/lib/data";
import { ORDER_STEPS, useStore } from "@/lib/store";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title: "My orders — Riderzpro" },
      { name: "description", content: "All your EV parts orders and their live status." },
      { property: "og:title", content: "My orders — Riderzpro" },
      { property: "og:description", content: "Track all your Riderzpro orders." },
    ],
  }),
  component: Orders,
});

function Orders() {
  const { orders } = useStore();
  const { isAuthenticated } = useAuth();

  return (
    <SiteLayout>
      <div className="mx-auto max-w-4xl px-4 py-8 md:px-6">
        <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-extrabold text-[#111111]">My orders</h1>
        {!isAuthenticated ? (
          <div className="mt-10 rounded-3xl border border-dashed border-[#ececec] bg-white p-12 text-center shadow-xs">
            <Package className="mx-auto h-12 w-12 text-[#e11d2a]" />
            <p className="mt-4 font-display text-2xl sm:text-3xl font-bold text-[#111111]">Sign in to view orders</p>
            <p className="mt-2 text-sm text-[#6b7280]">Sign in to your customer account to track your orders, live rider GPS and dispatches.</p>
            <Link
              to="/auth"
              search={{ redirect: "/orders" } as any}
              className="mt-6 inline-flex rounded-xl bg-[#e11d2a] hover:bg-[#c91823] px-6 py-3 font-semibold text-white shadow-xs transition"
            >
              Sign in to your account
            </Link>
          </div>
        ) : orders.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-border p-16 text-center">
            <Package className="mx-auto h-12 w-12 text-primary" />
            <p className="mt-3 font-display text-3xl">No orders yet</p>
            <Link to="/shop" className="mt-4 inline-flex rounded-full bg-primary px-5 py-2.5 font-semibold text-primary-foreground">Start shopping</Link>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {orders.map((o) => (
              <Link key={o.id} to="/track/$id" params={{ id: o.id }} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-card transition hover:border-primary">
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
