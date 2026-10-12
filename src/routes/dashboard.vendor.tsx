import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  AlertTriangle,
  Boxes,
  IndianRupee,
  LayoutGrid,
  PackageOpen,
  ShoppingBag,
  Star,
  Wallet,
  Check,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { DashboardShell, Panel, Stat, StatusPill } from "@/components/site/DashboardShell";
import { AreaTrend, Bars, series } from "@/components/site/Charts";
import { bikes, inr, products } from "@/lib/data";

export const Route = createFileRoute("/dashboard/vendor")({
  head: () => ({
    meta: [
      { title: "Vendor dashboard — Riderzpro" },
      {
        name: "description",
        content: "Sales, incoming orders, inventory and fitment management for EV parts sellers.",
      },
      { property: "og:title", content: "Vendor dashboard — Riderzpro" },
      { property: "og:description", content: "Sell EV batteries and parts on Riderzpro." },
    ],
  }),
  component: VendorDash,
});

const sections = [
  { id: "overview", label: "Overview", Icon: LayoutGrid },
  { id: "orders", label: "Orders", Icon: ShoppingBag },
  { id: "inventory", label: "Inventory", Icon: Boxes },
  { id: "payouts", label: "Payouts", Icon: Wallet },
];

const mine = products.filter((p) => p.offers.some((o) => o.vendorId === "v1"));

function VendorDash() {
  const [tab, setTab] = useState("overview");
  const [incoming, setIncoming] = useState([
    {
      id: "RZ48213",
      item: "VoltRide 60V 30Ah Li-ion Pack",
      qty: 1,
      amount: 59520,
      bike: "Ola S1 Pro 2023",
      status: "New",
    },
    {
      id: "RZ48207",
      item: "ChargeMax 3.3kW Fast Charger",
      qty: 2,
      amount: 27840,
      bike: "Bajaj Chetak 2022",
      status: "New",
    },
    {
      id: "RZ48199",
      item: "VoltEdge 48V 50Ah LiFePO4",
      qty: 1,
      amount: 51840,
      bike: "Ather 450X 2024",
      status: "Accepted",
    },
    {
      id: "RZ48188",
      item: "Wave Disc Brake Rotor",
      qty: 4,
      amount: 9200,
      bike: "Workshop order",
      status: "Delivered",
    },
  ]);
  const act = (id: string, status: string) => {
    setIncoming((l) => l.map((o) => (o.id === id ? { ...o, status } : o)));
    toast.success(`Order ${id} ${status.toLowerCase()}`);
  };

  return (
    <DashboardShell
      title="VoltHub Indiranagar"
      subtitle="Vendor & dealership dashboard"
      sections={sections}
      active={tab}
      onSelect={setTab}
    >
      {tab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Stat label="Revenue (7d)" value={inr(412000)} delta="+18%" Icon={IndianRupee} />
            <Stat label="Orders (7d)" value="46" delta="+9" Icon={ShoppingBag} />
            <Stat label="Rating" value="4.8" Icon={Star} />
            <Stat label="Low stock items" value="3" Icon={AlertTriangle} />
          </div>
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <Panel title="Revenue this week">
              <AreaTrend data={series([42, 58, 49, 71, 66, 88, 38].map((x) => x * 1000))} />
            </Panel>
            <Panel title="New orders">
              <OrderList list={incoming.filter((o) => o.status === "New")} act={act} />
            </Panel>
          </div>
          <Panel title="Top sellers by units">
            <Bars
              data={mine
                .slice(0, 6)
                .map((p, i) => ({ name: p.brand, value: [34, 28, 21, 17, 12, 9][i] }))}
            />
          </Panel>
        </div>
      )}
      {tab === "orders" && (
        <Panel title="All orders">
          <OrderList list={incoming} act={act} />
        </Panel>
      )}
      {tab === "inventory" && (
        <Panel
          title="Inventory & fitment"
          action={
            <button
              onClick={() => toast("Add product form coming soon")}
              className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              + Product
            </button>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="py-2">Product</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Fits</th>
                  <th />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {mine.map((p) => {
                  const o = p.offers.find((x) => x.vendorId === "v1")!;
                  return (
                    <tr key={p.id}>
                      <td className="flex items-center gap-3 py-3">
                        <img
                          src={p.image}
                          alt=""
                          loading="lazy"
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                        <span className="font-semibold">{p.name}</span>
                      </td>
                      <td>{inr(o.price)}</td>
                      <td>{o.stock < 5 ? <StatusPill s={`Low · ${o.stock}`} /> : o.stock}</td>
                      <td className="text-xs text-muted-foreground">
                        {p.fits.map((f) => bikes.find((b) => b.id === f)?.model).join(", ")}
                      </td>
                      <td>
                        <button onClick={() => toast("Edit product")} className="text-primary">
                          Edit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>
      )}
      {tab === "payouts" && (
        <div className="grid gap-6 lg:grid-cols-3">
          <Stat label="Available balance" value={inr(186400)} Icon={Wallet} />
          <Stat label="Next payout" value="Oct 12" Icon={PackageOpen} />
          <Stat label="Paid this month" value={inr(624000)} Icon={IndianRupee} />
          <Panel title="Payout history" className="lg:col-span-3">
            {["Oct 05", "Sep 28", "Sep 21"].map((d, i) => (
              <div
                key={d}
                className="flex justify-between border-b border-border py-3 last:border-0"
              >
                <span>{d}</span>
                <span className="font-semibold">{inr([212000, 198500, 176300][i])}</span>
                <StatusPill s="Paid" />
              </div>
            ))}
          </Panel>
        </div>
      )}
    </DashboardShell>
  );
}

function OrderList({
  list,
  act,
}: {
  list: { id: string; item: string; qty: number; amount: number; bike: string; status: string }[];
  act: (id: string, s: string) => void;
}) {
  if (!list.length) return <p className="text-sm text-muted-foreground">No orders here 🎉</p>;
  return (
    <div className="space-y-3">
      {list.map((o) => (
        <div key={o.id} className="rounded-2xl border border-border p-4">
          <div className="flex items-center justify-between">
            <p className="font-semibold">{o.id}</p>
            <StatusPill s={o.status} />
          </div>
          <p className="text-sm">
            {o.qty} × {o.item}
          </p>
          <p className="text-xs text-muted-foreground">
            For {o.bike} · {inr(o.amount)}
          </p>
          {o.status === "New" && (
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => act(o.id, "Accepted")}
                className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-primary py-2 text-sm font-semibold text-primary-foreground"
              >
                <Check className="h-4 w-4" />
                Accept
              </button>
              <button
                onClick={() => act(o.id, "Rejected")}
                className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-border py-2 text-sm font-semibold"
              >
                <X className="h-4 w-4" />
                Reject
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
