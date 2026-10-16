import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Bike, LogOut, MapPin, Navigation, PackageCheck, Radio, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  isLocationSharingActive,
  startLocationSharing,
  stopLocationSharing,
} from "@/lib/native/location";

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
  const [isStreaming, setIsStreaming] = useState(false);

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
      const list: Delivery[] = data.data || [];
      setDeliveries(list);

      // Auto-stream location if there is an in-flight delivery
      const inFlight = list.find((d) => d.status === "picked_up" || d.status === "in_transit");
      if (inFlight) {
        void startLocationSharing(inFlight.id);
        setIsStreaming(true);
      } else if (!list.some((d) => d.status === "picked_up" || d.status === "in_transit")) {
        stopLocationSharing();
        setIsStreaming(false);
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not load deliveries.");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    void refresh();
    const timer = window.setInterval(() => void refresh(), 10000);
    return () => {
      window.clearInterval(timer);
      stopLocationSharing();
    };
  }, [refresh]);

  async function moveDelivery(delivery: Delivery) {
    const next =
      delivery.status === "ready_for_pickup" || delivery.status === "rider_assigned"
        ? "PICKED_UP"
        : delivery.status === "picked_up"
        ? "IN_TRANSIT"
        : delivery.status === "in_transit"
        ? "DELIVERED"
        : null;
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

      // Start/Stop GPS location sharing according to transit state
      if (next === "PICKED_UP" || next === "IN_TRANSIT") {
        void startLocationSharing(delivery.id);
        setIsStreaming(true);
      } else if (next === "DELIVERED") {
        stopLocationSharing();
        setIsStreaming(false);
      }

      await refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not update delivery.");
    } finally {
      setSavingId("");
    }
  }

  async function signOut() {
    stopLocationSharing();
    await fetch("/api/auth/signout", { method: "POST", credentials: "include" });
    await navigate({ to: "/rider/" });
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-slate-950 text-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500">
              <Bike className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs uppercase tracking-widest text-red-300">Riderzpro</p>
              <h1 className="font-semibold">Rider panel</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isStreaming && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-3 py-1 text-xs font-semibold text-emerald-400">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                </span>
                <Navigation className="h-3 w-3 ml-0.5" />
                GPS Streaming
              </span>
            )}
            <button
              onClick={signOut}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/10 hover:text-white"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>
      </header>
      <section className="mx-auto max-w-4xl px-4 py-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-red-600">YOUR SHIFT</p>
            <h2 className="mt-1 text-2xl font-bold">Assigned deliveries</h2>
          </div>
          <button
            onClick={() => void refresh()}
            aria-label="Refresh deliveries"
            className="rounded-xl border border-slate-200 bg-white p-3 text-slate-600 hover:bg-slate-100"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
        {error && (
          <p role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </p>
        )}
        {loading ? (
          <p className="mt-8 text-slate-500">Loading your deliveries…</p>
        ) : deliveries.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <PackageCheck className="mx-auto h-8 w-8 text-slate-400" />
            <h3 className="mt-3 font-semibold">No assigned deliveries yet</h3>
            <p className="mt-1 text-sm text-slate-500">New jobs will appear here automatically when orders are packed.</p>
          </div>
        ) : (
          <div className="mt-6 grid gap-4">
            {deliveries.map((delivery) => {
              const next =
                delivery.status === "ready_for_pickup" || delivery.status === "rider_assigned"
                  ? "Picked up"
                  : delivery.status === "picked_up"
                  ? "In transit"
                  : delivery.status === "in_transit"
                  ? "Delivered"
                  : null;
              const isJobActive = delivery.status === "picked_up" || delivery.status === "in_transit";
              return (
                <article key={delivery.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Order {delivery.order_number}</p>
                        {isJobActive && (
                          <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 border border-emerald-200">
                            <Radio className="h-3 w-3 animate-pulse text-emerald-600" /> Live Tracking Active
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-lg font-bold capitalize">{delivery.status.replaceAll("_", " ")}</p>
                    </div>
                    {next && (
                      <button
                        disabled={savingId === delivery.id}
                        onClick={() => void moveDelivery(delivery)}
                        className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-50"
                      >
                        {savingId === delivery.id ? "Updating…" : next}
                      </button>
                    )}
                  </div>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <Address icon="pickup" label="Pickup (Noida Seller)" value={delivery.pickup_address} />
                    <Address icon="drop" label="Drop-off (Delhi Customer)" value={delivery.dropoff_address} />
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

function Address({ icon, label, value }: { icon: "pickup" | "drop"; label: string; value: string }) {
  return (
    <div className="flex gap-3 rounded-xl bg-slate-50 p-4">
      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
        <p className="mt-1 text-sm">{value}</p>
      </div>
    </div>
  );
}
