import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Bike, CalendarCheck, Heart, LayoutGrid, Package, Wallet, MapPin } from "lucide-react";
import { toast } from "sonner";
import scooterImg from "@/assets/scooter.jpg";
import { DashboardShell, Panel, Stat, StatusPill } from "@/components/site/DashboardShell";
import { LiveMap } from "@/components/site/LiveMap";
import { ProductCard } from "@/components/site/bits";
import { getBike, inr, products } from "@/lib/data";
import { ORDER_STEPS, useStore } from "@/lib/store";

export const Route = createFileRoute("/dashboard/customer")({
  head: () => ({ meta: [
    { title: "Customer dashboard — Riderzpro" },
    { name: "description", content: "Your garage, live orders, saved parts and technician bookings." },
    { property: "og:title", content: "Customer dashboard — Riderzpro" },
    { property: "og:description", content: "Manage your EV parts orders." },
  ] }),
  component: CustomerDash,
});

const sections = [
  { id: "overview", label: "Overview", Icon: LayoutGrid },
  { id: "garage", label: "Garage", Icon: Bike },
  { id: "orders", label: "Orders", Icon: Package },
  { id: "saved", label: "Saved", Icon: Heart },
  { id: "bookings", label: "Service", Icon: CalendarCheck },
];

function CustomerDash() {
  const [tab, setTab] = useState("overview");
  const { orders, garage } = useStore();
  const live = orders.find((o) => o.status < 5);
  const spent = orders.reduce((s, o) => s + o.total, 0);
  const [slot, setSlot] = useState<string | null>(null);

  return (
    <DashboardShell title="Hi, Aakash 👋" subtitle="Customer dashboard" sections={sections} active={tab} onSelect={setTab}>
      {(tab === "overview" || tab === "orders") && (
        <div className="space-y-6">
          {tab === "overview" && (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <Stat label="Bikes in garage" value={String(garage.length)} Icon={Bike} />
              <Stat label="Total orders" value={String(orders.length)} Icon={Package} />
              <Stat label="Total spent" value={inr(spent)} Icon={Wallet} />
              <Stat label="Active deliveries" value={String(orders.filter((o) => o.status < 5).length)} Icon={MapPin} />
            </div>
          )}
          <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
            <Panel title="Live delivery" action={live && <Link to="/track/$id" params={{ id: live.id }} className="text-sm font-semibold text-primary">Open →</Link>}>
              {live ? (
                <>
                  <LiveMap stops={live.groups.length} className="aspect-video" />
                  <p className="mt-3 text-sm"><b>{live.id}</b> · {ORDER_STEPS[live.status]}</p>
                </>
              ) : (
                <div className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">No active delivery. <Link to="/shop" className="text-primary">Shop parts</Link></div>
              )}
            </Panel>
            <Panel title="Recent orders">
              <div className="space-y-2">
                {orders.length === 0 && <p className="text-sm text-muted-foreground">Your orders will show up here.</p>}
                {orders.slice(0, 6).map((o) => (
                  <Link key={o.id} to="/track/$id" params={{ id: o.id }} className="flex items-center justify-between rounded-xl p-2 hover:bg-muted">
                    <div><p className="font-semibold">{o.id}</p><p className="text-xs text-muted-foreground">{o.groups.length} sellers · {inr(o.total)}</p></div>
                    <StatusPill s={ORDER_STEPS[o.status]} />
                  </Link>
                ))}
              </div>
            </Panel>
          </div>
        </div>
      )}
      {tab === "garage" && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {garage.map((g) => { const b = getBike(g.bikeId)!; return (
            <div key={g.bikeId} className="overflow-hidden rounded-3xl border border-border bg-card shadow-card">
              <img src={scooterImg} alt={b.model} loading="lazy" width={1024} height={1024} className="aspect-video w-full object-cover" />
              <div className="p-5"><p className="font-display text-3xl leading-none">{b.make} {b.model}</p><p className="text-sm text-muted-foreground">{g.year} · {b.voltage}V {g.vin ? `· ${g.vin}` : ""}</p></div>
            </div>
          ); })}
          <Link to="/garage" className="grid min-h-48 place-items-center rounded-3xl border border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary">+ Add bike / decode VIN</Link>
        </div>
      )}
      {tab === "saved" && <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{products.slice(0, 4).map((p) => <ProductCard key={p.id} p={p} />)}</div>}
      {tab === "bookings" && (
        <Panel title="Book a technician">
          <p className="text-sm text-muted-foreground">Battery health check, installation or BMS diagnostics at home or workshop.</p>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {["Today 4:00 PM", "Today 6:00 PM", "Tomorrow 10:00 AM", "Tomorrow 2:00 PM"].map((s) => (
              <button key={s} onClick={() => setSlot(s)} className={`rounded-xl border p-3 text-sm font-semibold ${slot === s ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>{s}</button>
            ))}
          </div>
          <button disabled={!slot} onClick={() => toast.success("Technician booked", { description: slot! })} className="mt-4 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground disabled:opacity-40">Confirm booking · {inr(299)}</button>
        </Panel>
      )}
    </DashboardShell>
  );
}
