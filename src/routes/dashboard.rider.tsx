import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { Bike, IndianRupee, LayoutGrid, MapPin, Navigation, Star, Store, Timer, Wallet } from "lucide-react";
import { toast } from "sonner";
import { DashboardShell, Panel, Stat, StatusPill } from "@/components/site/DashboardShell";
import { Bars, series } from "@/components/site/Charts";
import { DeliveryMap } from "@/components/map/DeliveryMap";
import { inr } from "@/lib/data";
import { getCurrentRole } from "@/lib/auth";

export const Route = createFileRoute("/dashboard/rider")({
  beforeLoad: async () => {
    const role = await getCurrentRole();
    if (!role) throw redirect({ to: "/login" });
    throw redirect({ to: role === "admin" ? "/dashboard/admin" : "/dashboard/customer" });
  },
  head: () => ({ meta: [
    { title: "Rider dashboard — Riderzpro" },
    { name: "description", content: "Accept nearby EV parts deliveries, follow multi-pickup routes and track earnings." },
    { property: "og:title", content: "Rider dashboard — Riderzpro" },
    { property: "og:description", content: "Deliver EV parts with Riderzpro." },
  ] }),
  component: RiderDash,
});

const sections = [
  { id: "jobs", label: "Jobs", Icon: LayoutGrid },
  { id: "active", label: "Active", Icon: Navigation },
  { id: "earnings", label: "Earnings", Icon: Wallet },
];

const STEPS = ["Heading to pickup", "Picked up", "On the way", "Delivered"];

function RiderDash() {
  const [tab, setTab] = useState("jobs");
  const [online, setOnline] = useState(true);
  const [active, setActive] = useState<null | { id: string; step: number }>(null);
  const requests = [
    { id: "RZ48213", pickups: ["VoltHub Indiranagar", "ChargeKart Koramangala"], drop: "MG Road", km: 9.4, pay: 168 },
    { id: "RZ48221", pickups: ["Riderz Dealer Malleshwaram"], drop: "Rajajinagar", km: 4.1, pay: 92 },
    { id: "RZ48225", pickups: ["EV Spares Jayanagar", "VoltHub Indiranagar", "Ampere Auto Hebbal"], drop: "Yelahanka", km: 21.8, pay: 342 },
  ];

  return (
    <DashboardShell title="Ravi Kumar" subtitle="Delivery rider dashboard" sections={sections} active={tab} onSelect={setTab}
      actions={<button onClick={() => setOnline(!online)} className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${online ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`}><span className={`h-2 w-2 rounded-full ${online ? "bg-success" : "bg-muted-foreground"}`} />{online ? "Online" : "Offline"}</button>}>
      {tab === "jobs" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Stat label="Today's earnings" value={inr(1240)} Icon={IndianRupee} />
            <Stat label="Deliveries" value="9" Icon={Bike} />
            <Stat label="Online time" value="6h 20m" Icon={Timer} />
            <Stat label="Rating" value="4.9" Icon={Star} />
          </div>
          <Panel title={online ? "Nearby requests" : "You're offline"}>
            {!online ? <p className="text-sm text-muted-foreground">Go online to receive delivery requests.</p> : (
              <div className="grid gap-4 md:grid-cols-3">
                {requests.map((r) => (
                  <div key={r.id} className="flex flex-col rounded-2xl border border-border p-4">
                    <div className="flex items-center justify-between"><p className="font-semibold">{r.id}</p><p className="font-display text-2xl text-primary">{inr(r.pay)}</p></div>
                    <div className="mt-3 space-y-1 text-sm">
                      {r.pickups.map((p) => <p key={p} className="flex items-center gap-2"><Store className="h-3.5 w-3.5 text-muted-foreground" />{p}</p>)}
                      <p className="flex items-center gap-2 font-semibold"><MapPin className="h-3.5 w-3.5 text-primary" />{r.drop}</p>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">{r.pickups.length} pickups · {r.km} km</p>
                    <button onClick={() => { setActive({ id: r.id, step: 0 }); setTab("active"); toast.success("Delivery accepted — customer can now see your details"); }} className="mt-4 rounded-xl bg-primary py-2.5 font-semibold text-primary-foreground">Accept</button>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </div>
      )}
      {tab === "active" && (
        active ? (
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <DeliveryMap orderId={active.id} className="aspect-[4/3] lg:min-h-[480px]" />
            <Panel title={`Order ${active.id}`}>
              <ol className="space-y-3">
                {STEPS.map((s, i) => <li key={s} className="flex items-center gap-3"><span className={`h-3 w-3 rounded-full ${i <= active.step ? "bg-primary" : "bg-muted"}`} /><span className={i <= active.step ? "font-semibold" : "text-muted-foreground"}>{s}</span></li>)}
              </ol>
              {active.step < 3 ? (
                <button onClick={() => setActive({ ...active, step: active.step + 1 })} className="mt-6 w-full rounded-xl bg-primary py-3 font-semibold text-primary-foreground">Mark “{STEPS[active.step + 1]}”</button>
              ) : <div className="mt-6"><StatusPill s="Delivered" /></div>}
              <a href="tel:+919900000000" className="mt-2 block w-full rounded-xl border border-border py-3 text-center font-semibold">Call customer</a>
            </Panel>
          </div>
        ) : <Panel title="No active delivery"><p className="text-sm text-muted-foreground">Accept a request from the Jobs tab.</p></Panel>
      )}
      {tab === "earnings" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            <Stat label="This week" value={inr(8420)} delta="+12%" Icon={Wallet} />
            <Stat label="Distance" value="312 km" Icon={Navigation} />
            <Stat label="Tips" value={inr(640)} Icon={IndianRupee} />
          </div>
          <Panel title="Daily earnings"><Bars data={series([980, 1320, 1110, 1540, 1240, 1690, 540])} /></Panel>
        </div>
      )}
    </DashboardShell>
  );
}
