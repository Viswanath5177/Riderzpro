import { useState } from "react";
import { createFileRoute, Link, redirect, useRouter } from "@tanstack/react-router";
import { ArrowLeft, ClipboardList, Plus, RefreshCw } from "lucide-react";
import { RiderPortalFrame } from "@/components/rider/RiderPortalFrame";
import { getCurrentRole } from "@/lib/auth";
import { getAdminRiderDeliveries, getApprovedRidersForDispatch, createRiderDelivery } from "@/lib/rider-operations";
import type { RiderDelivery } from "@/lib/rider-operations.server";

export const Route = createFileRoute("/admin/rider-deliveries")({
  beforeLoad: async () => {
    const role = await getCurrentRole();
    if (!role) throw redirect({ to: "/login", search: { redirect: "/admin/rider-deliveries" } as never });
    if (role !== "admin") throw redirect({ to: "/dashboard/customer" });
    const [riders, deliveries] = await Promise.all([getApprovedRidersForDispatch(), getAdminRiderDeliveries()]);
    return { riders, deliveries };
  },
  head: () => ({ meta: [{ title: "Rider dispatch — Riderzpro Admin" }] }),
  component: AdminRiderDispatchPage,
});

function AdminRiderDispatchPage() {
  const { riders, deliveries } = Route.useRouteContext();
  const router = useRouter();
  const [riderUserId, setRiderUserId] = useState(riders[0]?.user_id ?? "");
  const [orderId, setOrderId] = useState("");
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [city, setCity] = useState("");
  const [serviceState, setServiceState] = useState("Andhra Pradesh");
  const [earning, setEarning] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function createOffer(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(""); setNotice(""); setBusy(true);
    try {
      const amountPaise = Math.round(Number(earning) * 100);
      await createRiderDelivery({
        riderUserId, externalOrderId: orderId, pickupLabel: pickup, dropoffLabel: dropoff,
        city, serviceState, earningPaise: amountPaise,
      });
      setOrderId(""); setPickup(""); setDropoff(""); setCity(""); setEarning("");
      setNotice("Delivery offer created and the rider was notified in their portal.");
      await router.invalidate();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not create the delivery offer.");
    } finally { setBusy(false); }
  }

  return <RiderPortalFrame>
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div><Link to="/admin/riders" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800"><ArrowLeft className="h-4 w-4" /> Rider applications</Link><h1 className="mt-3 text-3xl font-extrabold tracking-tight">Rider dispatch</h1><p className="mt-1 text-sm text-slate-600">Create and assign a delivery offer to an approved Riderzpro rider.</p></div>
      <button onClick={() => router.invalidate()} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold"><RefreshCw className="h-4 w-4" /> Refresh</button>
    </div>
    <section className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-7">
      <h2 className="text-xl font-bold">Create delivery offer</h2>
      <p className="mt-1 text-sm leading-6 text-slate-600">This first version is an admin-operated dispatch tool. It does not yet connect to customer order checkout or record GPS coordinates.</p>
      {riders.length === 0 ? <p className="mt-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-950">No approved riders are available. Complete policy review and approve a rider before dispatching live work.</p> : <form onSubmit={createOffer} className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm font-semibold">Approved rider<select required value={riderUserId} onChange={(e) => setRiderUserId(e.target.value)} className="h-11 rounded-xl border border-slate-300 bg-white px-3 font-normal">{riders.map((rider) => <option key={rider.user_id} value={rider.user_id}>{rider.legal_name} · {rider.city}, {rider.service_state}</option>)}</select></label>
        <label className="grid gap-1.5 text-sm font-semibold">Order reference (optional)<input value={orderId} onChange={(e) => setOrderId(e.target.value)} maxLength={100} className="h-11 rounded-xl border border-slate-300 px-3 font-normal" /></label>
        <label className="grid gap-1.5 text-sm font-semibold">Pickup details<input required value={pickup} onChange={(e) => setPickup(e.target.value)} maxLength={240} className="h-11 rounded-xl border border-slate-300 px-3 font-normal" /></label>
        <label className="grid gap-1.5 text-sm font-semibold">Drop-off details<input required value={dropoff} onChange={(e) => setDropoff(e.target.value)} maxLength={240} className="h-11 rounded-xl border border-slate-300 px-3 font-normal" /></label>
        <label className="grid gap-1.5 text-sm font-semibold">City/service area<input required value={city} onChange={(e) => setCity(e.target.value)} maxLength={100} className="h-11 rounded-xl border border-slate-300 px-3 font-normal" /></label>
        <label className="grid gap-1.5 text-sm font-semibold">State<select value={serviceState} onChange={(e) => setServiceState(e.target.value)} className="h-11 rounded-xl border border-slate-300 bg-white px-3 font-normal"><option>Andhra Pradesh</option><option>Telangana</option></select></label>
        <label className="grid gap-1.5 text-sm font-semibold">Rider earning (₹)<input required type="number" min="0" max="100000" step="0.01" value={earning} onChange={(e) => setEarning(e.target.value)} className="h-11 rounded-xl border border-slate-300 px-3 font-normal" /><span className="text-xs font-normal text-slate-500">This amount becomes available in the rider ledger only after delivery completion.</span></label>
        <div className="flex items-end"><button disabled={busy || !riderUserId} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-emerald-800 px-5 font-semibold text-white disabled:opacity-50"><Plus className="h-4 w-4" />{busy ? "Creating…" : "Offer delivery"}</button></div>
      </form>}
      {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      {notice && <p role="status" className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-900">{notice}</p>}
    </section>
    <section className="mt-7">
      <h2 className="mb-3 flex items-center gap-2 text-xl font-bold"><ClipboardList className="h-5 w-5" /> Recent deliveries</h2>
      {deliveries.length === 0 ? <p className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">No delivery offers created.</p> : <div className="grid gap-3">{deliveries.map((delivery) => <DispatchCard key={delivery.id} delivery={delivery} riders={riders} />)}</div>}
    </section>
  </RiderPortalFrame>;
}

function DispatchCard({ delivery, riders }: { delivery: RiderDelivery; riders: { user_id: string; legal_name: string }[] }) {
  const riderName = riders.find((rider) => rider.user_id === delivery.rider_user_id)?.legal_name ?? "Assigned rider";
  return <article className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-semibold text-slate-500">{delivery.external_order_id || delivery.id.slice(0, 8)} · {riderName}</p><h3 className="mt-1 font-bold">{delivery.pickup_label} → {delivery.dropoff_label}</h3><p className="mt-1 text-sm text-slate-600">{delivery.city}, {delivery.service_state} · Rider earnings ₹{(Number(delivery.rider_earning_paise) / 100).toFixed(2)}</p></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold capitalize">{delivery.status.replaceAll("_", " ")}</span></div></article>;
}
