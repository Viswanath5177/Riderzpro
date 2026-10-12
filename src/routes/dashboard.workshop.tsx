import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ClipboardList, LayoutGrid, Repeat, ShoppingCart, Wallet, Wrench, Users, Plus } from "lucide-react";
import { toast } from "sonner";
import { DashboardShell, Panel, Stat, StatusPill } from "@/components/site/DashboardShell";
import { Bars, series } from "@/components/site/Charts";
import { bestOffer, getBike, inr, products } from "@/lib/data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/dashboard/workshop")({
  head: () => ({ meta: [
    { title: "Workshop dashboard — Riderzpro" },
    { name: "description", content: "Job cards, bulk ordering and spend tracking for EV workshops and mechanics." },
    { property: "og:title", content: "Workshop dashboard — Riderzpro" },
    { property: "og:description", content: "Tools for EV workshops and mechanics." },
  ] }),
  component: WorkshopDash,
});

const sections = [
  { id: "overview", label: "Overview", Icon: LayoutGrid },
  { id: "jobs", label: "Job cards", Icon: ClipboardList },
  { id: "bulk", label: "Bulk order", Icon: ShoppingCart },
  { id: "reorder", label: "Reorder", Icon: Repeat },
];

const jobs = [
  { id: "JC-1042", customer: "Priya S.", bike: "ather-450x", issue: "Battery range dropped to 40 km", status: "Waiting parts", parts: ["p2"] },
  { id: "JC-1043", customer: "Rahul M.", bike: "revolt-rv400", issue: "Controller fault, no throttle", status: "In progress", parts: ["p11"] },
  { id: "JC-1044", customer: "Deepa K.", bike: "ola-s1pro", issue: "Charger not charging", status: "New", parts: ["p7"] },
  { id: "JC-1039", customer: "Arjun P.", bike: "bajaj-chetak", issue: "Brake rotor replacement", status: "Done", parts: ["p12"] },
];

function WorkshopDash() {
  const [tab, setTab] = useState("overview");
  const { addToCart } = useStore();
  const [qty, setQty] = useState<Record<string, number>>({});
  const addParts = (ids: string[]) => { ids.forEach((id) => { const p = products.find((x) => x.id === id)!; addToCart(id, bestOffer(p).vendorId); }); toast.success("Parts added to cart"); };

  return (
    <DashboardShell title="Manjunath Auto Works" subtitle="Workshop & mechanic dashboard" sections={sections} active={tab} onSelect={setTab}
      actions={<button onClick={() => toast("New job card created")} className="hidden items-center gap-1 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground sm:flex"><Plus className="h-4 w-4" />Job card</button>}>
      {tab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Stat label="Open jobs" value="7" delta="+2 today" Icon={Wrench} />
            <Stat label="Customers this month" value="64" Icon={Users} />
            <Stat label="Parts spend (Oct)" value={inr(284000)} Icon={Wallet} />
            <Stat label="Avg. turnaround" value="1.4d" delta="-0.3d" Icon={ClipboardList} />
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <Panel title="Parts spend this week"><Bars data={series([32, 18, 44, 27, 51, 39, 12].map((x) => x * 1000))} /></Panel>
            <Panel title="Today's jobs"><JobList onParts={addParts} /></Panel>
          </div>
        </div>
      )}
      {tab === "jobs" && <Panel title="All job cards"><JobList onParts={addParts} /></Panel>}
      {tab === "bulk" && (
        <Panel title="Bulk order" action={<button onClick={() => { Object.entries(qty).forEach(([id, q]) => q > 0 && addToCart(id, bestOffer(products.find((p) => p.id === id)!).vendorId, q)); toast.success("Bulk order added to cart"); setQty({}); }} className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Add all to cart</button>}>
          <div className="divide-y divide-border">
            {products.map((p) => (
              <div key={p.id} className="flex items-center gap-3 py-3">
                <img src={p.image} alt="" loading="lazy" width={48} height={48} className="h-12 w-12 rounded-lg object-cover" />
                <div className="flex-1"><p className="font-semibold leading-tight">{p.name}</p><p className="text-xs text-muted-foreground">Best {inr(bestOffer(p).price)} · {p.offers.length} sellers</p></div>
                <input type="number" min={0} value={qty[p.id] ?? 0} onChange={(e) => setQty({ ...qty, [p.id]: +e.target.value })} className="h-10 w-20 rounded-lg border border-border bg-background px-2 text-center" />
              </div>
            ))}
          </div>
        </Panel>
      )}
      {tab === "reorder" && (
        <div className="grid gap-4 md:grid-cols-3">
          {products.slice(6, 12).map((p) => (
            <div key={p.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-card">
              <img src={p.image} alt="" loading="lazy" width={64} height={64} className="h-16 w-16 rounded-xl object-cover" />
              <div className="flex-1"><p className="font-semibold leading-tight">{p.name}</p><p className="text-xs text-muted-foreground">Ordered 6× this year</p></div>
              <button onClick={() => addParts([p.id])} className="rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground">Reorder</button>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}

function JobList({ onParts }: { onParts: (ids: string[]) => void }) {
  return (
    <div className="space-y-3">
      {jobs.map((j) => { const b = getBike(j.bike)!; return (
        <div key={j.id} className="flex flex-col gap-2 rounded-2xl border border-border p-4 sm:flex-row sm:items-center">
          <div className="flex-1">
            <div className="flex items-center gap-2"><p className="font-semibold">{j.id}</p><StatusPill s={j.status} /></div>
            <p className="text-sm">{j.customer} · {b.make} {b.model}</p>
            <p className="text-xs text-muted-foreground">{j.issue}</p>
          </div>
          {j.status !== "Done" && <button onClick={() => onParts(j.parts)} className="rounded-xl border border-primary px-3 py-2 text-sm font-semibold text-primary">Order parts</button>}
        </div>
      ); })}
    </div>
  );
}
