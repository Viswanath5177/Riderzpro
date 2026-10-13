import { createFileRoute, Link, redirect, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Bike, CircleDollarSign, ClipboardList, LogOut, MapPin, ShieldCheck, Bell, CheckCircle2 } from "lucide-react";
import { RiderPortalFrame } from "@/components/rider/RiderPortalFrame";
import { getCurrentUser, signOut } from "@/lib/auth";
import { getRiderApplication } from "@/lib/rider";
import { getRiderDeliveries, getRiderEarnings, getRiderNotifications, updateRiderDelivery } from "@/lib/rider-operations";
import type { RiderDelivery } from "@/lib/rider-operations.server";

export const Route = createFileRoute("/rider/dashboard")({
  beforeLoad: async () => {
    const user = await getCurrentUser();
    if (!user) throw redirect({ to: "/login", search: { redirect: "/rider/dashboard" } as never });
    if (user.role !== "customer") throw redirect({ to: "/dashboard/admin" });
    const application = await getRiderApplication();
    if (!application) throw redirect({ to: "/rider/apply" });
    if (application.status !== "approved") throw redirect({ to: "/rider/status" });
    const [deliveries, earnings, notifications] = await Promise.all([getRiderDeliveries(), getRiderEarnings(), getRiderNotifications()]);
    return { application, deliveries, earnings, notifications };
  },
  head: () => ({ meta: [{ title: "Rider workspace — Riderzpro" }] }),
  component: RiderDashboardPage,
});

const tabs = [
  { id: "overview", label: "Overview", Icon: Bike },
  { id: "deliveries", label: "Deliveries", Icon: ClipboardList },
  { id: "earnings", label: "Earnings", Icon: CircleDollarSign },
  { id: "notifications", label: "Updates", Icon: Bell },
] as const;

function RiderDashboardPage() {
  const { application, deliveries, earnings, notifications } = Route.useRouteContext();
  const router = useRouter();
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("overview");
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  async function handleSignOut() { await signOut(); window.location.assign("/rider"); }
  async function advance(delivery: RiderDelivery, status: "accepted" | "picked_up" | "delivered") {
    setError(""); setBusyId(delivery.id);
    try { await updateRiderDelivery({ deliveryId: delivery.id, status }); await router.invalidate(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Could not update this delivery."); }
    finally { setBusyId(""); }
  }
  return (
    <RiderPortalFrame>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div><p className="text-sm font-semibold text-emerald-800">Approved rider</p><h1 className="mt-1 text-3xl font-extrabold tracking-tight">Welcome, {application.legal_name.split(" ")[0]}</h1><p className="mt-2 text-sm text-slate-600">Rider workspace · {application.city}</p></div>
        <button onClick={handleSignOut} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold"><LogOut className="h-4 w-4" /> Sign out</button>
      </div>
      <div className="mt-7 flex gap-2 overflow-x-auto border-b border-slate-200">
        {tabs.map(({ id, label, Icon }) => <button key={id} onClick={() => setTab(id)} className={`inline-flex min-h-11 items-center gap-2 border-b-2 px-3 text-sm font-semibold ${tab === id ? "border-emerald-700 text-emerald-800" : "border-transparent text-slate-500"}`}><Icon className="h-4 w-4" />{label}</button>)}
      </div>
      {tab === "overview" && <section className="mt-6 grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8"><div className="flex gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-50 text-emerald-800"><ShieldCheck className="h-5 w-5" /></span><div><h2 className="text-xl font-bold">Your account is approved</h2><p className="mt-1 text-sm text-slate-600">New delivery assignments and application updates appear in this workspace.</p></div></div><div className="mt-6 flex items-start gap-3 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-950"><MapPin className="mt-0.5 h-5 w-5 shrink-0" /><p><b>Live GPS sharing is not enabled.</b> Delivery progress is recorded manually. Location tracking will be added only after its consent and retention rules are approved.</p></div></div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6"><h2 className="font-bold">Rider profile</h2><dl className="mt-4 space-y-3 text-sm"><div><dt className="text-slate-500">Vehicle</dt><dd className="font-semibold capitalize">{application.vehicle_type}</dd></div><div><dt className="text-slate-500">Registration</dt><dd className="font-semibold">{application.vehicle_registration}</dd></div><div><dt className="text-slate-500">Service area</dt><dd className="font-semibold">{application.city}, {application.service_state}</dd></div></dl><Link to="/rider/status" className="mt-5 inline-block text-sm font-semibold text-emerald-800">Application details</Link></div>
      </section>}
      {tab === "deliveries" && <section className="mt-6"><h2 className="mb-3 text-xl font-bold">Delivery assignments</h2>{error && <p role="alert" className="mb-3 rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}{deliveries.length === 0 ? <EmptyPanel title="No delivery offers yet" body="Your dispatch team will send offers here when a delivery is assigned to you." /> : <div className="grid gap-3">{deliveries.map((delivery) => <RiderDeliveryCard key={delivery.id} delivery={delivery} busy={busyId === delivery.id} onAdvance={advance} />)}</div>}</section>}
      {tab === "earnings" && <section className="mt-6"><div className="grid gap-4 sm:grid-cols-3"><EarningStat label="Available" paise={Number(earnings.available_paise)} /><EarningStat label="Paid" paise={Number(earnings.paid_paise)} /><div className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-sm text-slate-500">Completed deliveries</p><p className="mt-2 text-2xl font-extrabold">{Number(earnings.deliveries)}</p></div></div><p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">Payouts are not enabled yet. The amounts shown are delivery earnings recorded by operations; Razorpay payout setup and reconciliation must be completed before money can be transferred.</p></section>}
      {tab === "notifications" && <section className="mt-6"><h2 className="mb-3 text-xl font-bold">Updates</h2>{notifications.length === 0 ? <EmptyPanel title="No updates" body="Application decisions and delivery offers will appear here." /> : <div className="grid gap-3">{notifications.map((item) => <article key={item.id} className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4"><Bell className="mt-1 h-4 w-4 shrink-0 text-emerald-800" /><div><h3 className="font-bold">{item.title}</h3><p className="mt-1 text-sm leading-6 text-slate-600">{item.message}</p><p className="mt-2 text-xs text-slate-400">{new Date(item.created_at).toLocaleString()}</p></div></article>)}</div>}</section>}
    </RiderPortalFrame>
  );
}

function EmptyPanel({ title, body }: { title: string; body: string }) {
  return <section className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center"><ClipboardList className="mx-auto h-8 w-8 text-slate-400" /><h2 className="mt-3 text-xl font-bold">{title}</h2><p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-600">{body}</p></section>;
}

function EarningStat({ label, paise }: { label: string; paise: number }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-2xl font-extrabold">₹{(paise / 100).toFixed(2)}</p></div>;
}

function RiderDeliveryCard({ delivery, busy, onAdvance }: { delivery: RiderDelivery; busy: boolean; onAdvance: (delivery: RiderDelivery, status: "accepted" | "picked_up" | "delivered") => void }) {
  const next = delivery.status === "offered" ? "accepted" : delivery.status === "accepted" ? "picked_up" : delivery.status === "picked_up" ? "delivered" : null;
  const buttonText = delivery.status === "offered" ? "Accept offer" : delivery.status === "accepted" ? "Mark picked up" : "Confirm delivery";
  return <article className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-semibold text-slate-500">{delivery.external_order_id || `Delivery ${delivery.id.slice(0, 8)}`} · {delivery.city}, {delivery.service_state}</p><h3 className="mt-1 font-bold">Pickup: {delivery.pickup_label}</h3><p className="mt-1 text-sm text-slate-600">Drop-off: {delivery.dropoff_label}</p><p className="mt-2 text-sm font-semibold text-emerald-800">Earning ₹{(Number(delivery.rider_earning_paise) / 100).toFixed(2)}</p></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold capitalize">{delivery.status.replaceAll("_", " ")}</span></div>{next && <button disabled={busy} onClick={() => onAdvance(delivery, next)} className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-xl bg-emerald-800 px-4 text-sm font-semibold text-white disabled:opacity-50"><CheckCircle2 className="h-4 w-4" />{busy ? "Saving…" : buttonText}</button>}</article>;
}
