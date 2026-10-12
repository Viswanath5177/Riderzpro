import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, MessageCircle, Phone, Star, Lock } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/SiteLayout";
import { LiveMap } from "@/components/site/LiveMap";
import { getProduct, getVendor, inr, riders } from "@/lib/data";
import { ORDER_STEPS, useStore } from "@/lib/store";

export const Route = createFileRoute("/track/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Track order ${params.id} — Riderzpro` },
      { name: "description", content: "Live tracking of your EV parts delivery." },
      { property: "og:title", content: `Track order ${params.id} — Riderzpro` },
      { property: "og:description", content: "Follow your rider live on the map." },
    ],
  }),
  component: Track,
});

function Track() {
  const { id } = Route.useParams();
  const { orders, advanceOrder } = useStore();
  const o = orders.find((x) => x.id === id);
  if (!o)
    return (
      <SiteLayout>
        <div className="py-24 text-center"><p className="font-display text-4xl">Order not found</p><Link to="/orders" className="text-primary">See your orders</Link></div>
      </SiteLayout>
    );
  const rider = o.riderId ? riders.find((r) => r.id === o.riderId) : null;
  const progress = o.status <= 2 ? 0 : o.status === 3 ? 0.45 : o.status === 4 ? 0.8 : 1;
  const remaining = Math.max(0, Math.round(o.eta * (1 - o.status / (ORDER_STEPS.length - 1))));

  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">Order {o.id}</p>
            <h1 className="font-display text-5xl md:text-7xl">{o.status === 5 ? "Delivered!" : `Arriving in ${remaining} min`}</h1>
          </div>
          {o.status < 5 && <button onClick={() => advanceOrder(o.id)} className="rounded-full border border-border px-4 py-2 text-sm hover:border-primary">Simulate next step →</button>}
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
          <LiveMap stops={o.groups.length} progress={o.status >= 3 ? undefined : progress} className="aspect-[4/3] lg:aspect-auto lg:min-h-[520px]" />
          <div className="space-y-4">
            <div className="rounded-3xl border border-border bg-card p-5 shadow-card">
              {rider ? (
                <>
                  <p className="text-xs text-muted-foreground">Your rider</p>
                  <div className="mt-3 flex items-center gap-3">
                    <span className="grid h-14 w-14 place-items-center rounded-full bg-primary text-lg font-bold text-primary-foreground">{rider.avatar}</span>
                    <div className="flex-1">
                      <p className="font-semibold">{rider.name}</p>
                      <p className="text-sm text-muted-foreground">{rider.vehicle} · {rider.plate}</p>
                      <p className="flex items-center gap-1 text-xs"><Star className="h-3 w-3 fill-warning text-warning" />{rider.rating}</p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <a href={`tel:${rider.phone}`} className="flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground"><Phone className="h-4 w-4" />Call</a>
                    <button onClick={() => toast("Chat opened", { description: `Message ${rider.name}` })} className="flex items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-sm font-semibold"><MessageCircle className="h-4 w-4" />Chat</button>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-3 text-sm text-muted-foreground"><Lock className="h-5 w-5" /> Rider details appear once a rider accepts your delivery.</div>
              )}
            </div>
            <div className="rounded-3xl border border-border bg-card p-5 shadow-card">
              <ol className="space-y-4">
                {ORDER_STEPS.map((s, i) => (
                  <li key={s} className="flex items-center gap-3">
                    <span className={`grid h-7 w-7 place-items-center rounded-full text-xs font-bold ${i <= o.status ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground"}`}>{i < o.status ? <Check className="h-3.5 w-3.5" /> : i + 1}</span>
                    <span className={i <= o.status ? "font-semibold" : "text-muted-foreground"}>{s}</span>
                    {i === o.status && o.status < 5 && <span className="ml-auto h-2 w-2 animate-pulse rounded-full bg-primary" />}
                  </li>
                ))}
              </ol>
            </div>
            <div className="rounded-3xl border border-border bg-card p-5 text-sm shadow-card">
              {o.groups.map((g) => (
                <div key={g.vendorId} className="border-b border-border py-2 last:border-0">
                  <p className="font-semibold">{getVendor(g.vendorId).name}</p>
                  {g.items.map((it) => <p key={it.productId} className="text-muted-foreground">{it.qty} × {getProduct(it.productId)?.name}</p>)}
                </div>
              ))}
              <p className="mt-2 flex justify-between font-bold"><span>Paid ({o.payment})</span><span>{inr(o.total)}</span></p>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
