import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BadgeCheck, IndianRupee, LayoutGrid, Settings, ShieldAlert, Store, Truck, Users, Map, Check, X } from "lucide-react";
import { toast } from "sonner";
import { DashboardShell, Panel, Stat, StatusPill } from "@/components/site/DashboardShell";
import { AreaTrend, Bars, series } from "@/components/site/Charts";
import { LiveMap } from "@/components/site/LiveMap";
import { DELIVERY_BASE, DELIVERY_PER_KM, inr, vendors } from "@/lib/data";

export const Route = createFileRoute("/dashboard/admin")({
  head: () => ({ meta: [
    { title: "Admin dashboard — Riderzpro" },
    { name: "description", content: "Platform KPIs, vendor approvals, fitment review, live orders and delivery settings." },
    { property: "og:title", content: "Admin dashboard — Riderzpro" },
    { property: "og:description", content: "Run the Riderzpro marketplace." },
  ] }),
  component: AdminDash,
});

const sections = [
  { id: "overview", label: "Overview", Icon: LayoutGrid },
  { id: "approvals", label: "Approvals", Icon: BadgeCheck },
  { id: "live", label: "Live map", Icon: Map },
  { id: "disputes", label: "Disputes", Icon: ShieldAlert },
  { id: "settings", label: "Settings", Icon: Settings },
];

function AdminDash() {
  const [tab, setTab] = useState("overview");
  const [queue, setQueue] = useState([
    { id: "a1", type: "Vendor", name: "PowerCell Electronics, HSR", status: "Pending" },
    { id: "a2", type: "Fitment", name: "VoltRide 60V 30Ah → Hero Vida V1", status: "Review" },
    { id: "a3", type: "Rider", name: "Imran Pasha · KA05 EV 7781", status: "Pending" },
    { id: "a4", type: "Fitment", name: "Titan 72V 60Ah → Revolt RV400", status: "Review" },
  ]);
  const [base, setBase] = useState(DELIVERY_BASE);
  const [perKm, setPerKm] = useState(DELIVERY_PER_KM);
  const decide = (id: string, s: string) => { setQueue((q) => q.map((x) => (x.id === id ? { ...x, status: s } : x))); toast.success(s); };

  return (
    <DashboardShell title="Control center" subtitle="Admin dashboard" sections={sections} active={tab} onSelect={setTab}>
      {tab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Stat label="GMV (7d)" value={inr(4820000)} delta="+22%" Icon={IndianRupee} />
            <Stat label="Active users" value="12.4k" delta="+640" Icon={Users} />
            <Stat label="Vendors" value={String(vendors.length + 42)} Icon={Store} />
            <Stat label="Riders online" value="128" Icon={Truck} />
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <Panel title="Orders per day"><AreaTrend data={series([310, 420, 380, 510, 470, 620, 290])} /></Panel>
            <Panel title="Avg delivery time (min)"><Bars data={series([41, 38, 36, 39, 35, 33, 37])} /></Panel>
          </div>
          <Panel title="Approval queue"><Queue queue={queue} decide={decide} /></Panel>
        </div>
      )}
      {tab === "approvals" && <Panel title="Approvals & fitment review"><Queue queue={queue} decide={decide} /></Panel>}
      {tab === "live" && (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <LiveMap stops={3} className="aspect-[4/3] lg:min-h-[520px]" />
          <Panel title="Live orders">
            {["RZ48213", "RZ48221", "RZ48225", "RZ48230"].map((id, i) => <div key={id} className="flex justify-between border-b border-border py-3 last:border-0"><span className="font-semibold">{id}</span><StatusPill s={["On the way", "Picked up", "Rider assigned", "Placed"][i]} /></div>)}
          </Panel>
        </div>
      )}
      {tab === "disputes" && (
        <Panel title="Open disputes">
          {[["RZ48102", "Wrong battery delivered", "Dispute"], ["RZ48077", "Late delivery refund", "Review"], ["RZ48050", "Damaged charger", "Resolved — refunded"]].map(([id, t, s]) => (
            <div key={id} className="flex items-center justify-between border-b border-border py-3 last:border-0"><div><p className="font-semibold">{id}</p><p className="text-sm text-muted-foreground">{t}</p></div><StatusPill s={s} /></div>
          ))}
        </Panel>
      )}
      {tab === "settings" && (
        <Panel title="Delivery pricing">
          <p className="text-sm text-muted-foreground">Fee per vendor = base + per-km × distance from vendor to customer.</p>
          <div className="mt-4 grid max-w-md gap-4 sm:grid-cols-2">
            <label className="text-sm">Base fee (₹)<input type="number" value={base} onChange={(e) => setBase(+e.target.value)} className="mt-1 h-11 w-full rounded-xl border border-border bg-background px-3" /></label>
            <label className="text-sm">Per km (₹)<input type="number" value={perKm} onChange={(e) => setPerKm(+e.target.value)} className="mt-1 h-11 w-full rounded-xl border border-border bg-background px-3" /></label>
          </div>
          <p className="mt-3 text-sm">Example 8 km delivery: <b>{inr(base + perKm * 8)}</b></p>
          <button onClick={() => toast.success("Pricing saved")} className="mt-4 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground">Save</button>
        </Panel>
      )}
    </DashboardShell>
  );
}

function Queue({ queue, decide }: { queue: { id: string; type: string; name: string; status: string }[]; decide: (id: string, s: string) => void }) {
  return (
    <div className="space-y-2">
      {queue.map((q) => (
        <div key={q.id} className="flex flex-col gap-2 rounded-2xl border border-border p-3 sm:flex-row sm:items-center">
          <span className="w-20 text-xs font-bold uppercase tracking-wider text-primary">{q.type}</span>
          <p className="flex-1 font-medium">{q.name}</p>
          {q.status === "Pending" || q.status === "Review" ? (
            <div className="flex gap-2">
              <button onClick={() => decide(q.id, "Approved")} className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground"><Check className="h-3.5 w-3.5" />Approve</button>
              <button onClick={() => decide(q.id, "Rejected")} className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm"><X className="h-3.5 w-3.5" />Reject</button>
            </div>
          ) : <StatusPill s={q.status} />}
        </div>
      ))}
    </div>
  );
}
