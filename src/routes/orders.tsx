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
        {!isAuthenticated && (
          <div className="mt-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50/60 p-4 text-xs">
            <div className="flex items-center gap-2.5 text-[#111111] font-medium">
              <Package className="h-4 w-4 text-[#e11d2a] shrink-0" />
              <span>Viewing demo order with live rider GPS telemetry. Sign in to manage your account.</span>
            </div>
            <Link
              to="/auth"
              search={{ redirect: "/orders" } as any}
              className="rounded-lg bg-[#e11d2a] px-3.5 py-1.5 font-bold text-white hover:bg-[#c91823] transition whitespace-nowrap shadow-2xs"
            >
              Sign in
            </Link>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-[#ececec] bg-white p-16 text-center">
            <Package className="mx-auto h-12 w-12 text-[#e11d2a]" />
            <p className="mt-3 font-display text-3xl font-bold text-[#111111]">No orders yet</p>
            <Link to="/shop" className="mt-4 inline-flex rounded-xl bg-[#e11d2a] px-5 py-2.5 font-semibold text-white shadow-xs">Start shopping</Link>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {orders.map((o) => (
              <Link key={o.id} to="/track/$id" params={{ id: o.id }} className="flex items-center gap-4 rounded-2xl border border-[#ececec] bg-white p-5 shadow-xs transition hover:border-[#e11d2a] hover:shadow-md">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-red-50 text-[#e11d2a]"><Package className="h-5 w-5" /></span>
                <div className="flex-1">
                  <p className="font-bold text-[#111111]">{o.id} · {o.groups.length} vendor dispatch</p>
                  <p className="text-sm text-[#6b7280]">{new Date(o.createdAt).toLocaleString("en-IN")}</p>
                </div>
                <div className="text-right">
                  <p className="font-extrabold text-[#111111]">{inr(o.total)}</p>
                  <p className={`text-xs font-semibold ${o.status === 5 ? "text-emerald-600" : "text-[#e11d2a]"}`}>{ORDER_STEPS[o.status]}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-[#6b7280]" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
