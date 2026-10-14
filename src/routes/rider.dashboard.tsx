import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Bike, LogOut, MapPin, PackageCheck, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type Delivery = {
  id: string;
  order_id: string;
  order_number: string;
  status: string;
  pickup_address: string;
  dropoff_address: string;
};

export const Route = createFileRoute("/rider/dashboard")({
  component: RiderDashboard,
});

function RiderDashboard() {
  const navigate = useNavigate();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState("");

  const refresh = useCallback(async () => {
    setError("");
    try {
      const auth = await fetch("/api/auth/me", { credentials: "include" });
      const authData = await auth.json();
      if (!auth.ok || !authData.authenticated || authData.role !== "rider") {
        await navigate({ to: "/rider/" });
        return;
      }
      const response = await fetch("/api/rider/deliveries", { credentials: "include" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not load deliveries.");
      setDeliveries(data.data || []);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not load deliveries.");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    void refresh();
    const timer = window.setInterval(() => void refresh(), 10000);
    return () => window.clearInterval(timer);
  }, [refresh]);

  async function moveDelivery(delivery: Delivery) {
    const next = delivery.status === "ready_for_pickup" || delivery.status === "rider_assigned"
      ? "PICKED_UP"
      : delivery.status === "picked_up" ? "IN_TRANSIT" : delivery.status === "in_transit" ? "DELIVERED" : null;
    if (!next) return;
    setSavingId(delivery.id);
    try {
      const response = await fetch(`/api/rider/deliveries/${encodeURIComponent(delivery.id)}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not update delivery.");
      await refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not update delivery.");
    } finally {
      setSavingId("");
    }
  }

  async function signOut() {
    await fetch("/api/auth/signout", { method: "POST", credentials: "include" });
    await navigate({ to: "/rider/" });
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-slate-950 text-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-5">
          <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500"><Bike className="h-5 w-5" /></span><div><p className="text-xs uppercase tracking-widest text-red-300">Riderzpro</p><h1 className="font-semibold">Rider panel</h1></div></div>
          <button onClick={signOut} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/10 hover:text-white"><LogOut className="h-4 w-4" /> Sign out</button>
        </div>
      </header>
      <section className="mx-auto max-w-4xl px-4 py-8">
        <div className="flex items-end justify-between gap-4"><div><p className="text-sm font-semibold text-red-600">YOUR SHIFT</p><h2 className="mt-1 text-2xl font-bold">Assigned deliveries</h2></div><button onClick={() => void refresh()} aria-label="Refresh deliveries" className="rounded-xl border border-slate-200 bg-white p-3 text-slate-600 hover:bg-slate-100"><RefreshCw className="h-4 w-4" /></button></div>
        {error && <p role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
        {loading ? <p className="mt-8 text-slate-500">Loading your deliveries…</p> : deliveries.length === 0 ? <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center"><PackageCheck className="mx-auto h-8 w-8 text-slate-400" /><h3 className="mt-3 font-semibold">No assigned deliveries yet</h3><p className="mt-1 text-sm text-slate-500">New jobs will appear here automatically.</p></div> : (
          <div className="mt-6 grid gap-4">{deliveries.map((delivery) => {
            const next = delivery.status === "ready_for_pickup" || delivery.status === "rider_assigned" ? "Picked up" : delivery.status === "picked_up" ? "In transit" : delivery.status === "in_transit" ? "Delivered" : null;
            return <article key={delivery.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Order {delivery.order_number}</p><p className="mt-1 text-lg font-bold">{delivery.status.replaceAll("_", " ")}</p></div>{next && <button disabled={savingId === delivery.id} onClick={() => void moveDelivery(delivery)} className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-50">{savingId === delivery.id ? "Updating…" : next}</button>}</div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2"><Address icon="pickup" label="Pickup" value={delivery.pickup_address} /><Address icon="drop" label="Drop-off" value={delivery.dropoff_address} /></div>
            </article>;
          })}</div>
        )}
      </section>
    </main>
  );
}

function Address({ label, value }: { label: string; value: string }) {
  return <div className="flex gap-3 rounded-xl bg-slate-50 p-4"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-red-500" /><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p><p className="mt-1 text-sm">{value}</p></div></div>;
}
