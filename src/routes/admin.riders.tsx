import { useState } from "react";
import { createFileRoute, Link, redirect, useRouter } from "@tanstack/react-router";
import { AlertTriangle, ArrowLeft, Bike, CheckCircle2, Clock3, RefreshCw, ShieldCheck, XCircle } from "lucide-react";
import { RiderPortalFrame } from "@/components/rider/RiderPortalFrame";
import { getCurrentRole } from "@/lib/auth";
import { getRiderApplicationsForAdmin, reviewRiderApplication } from "@/lib/rider";
import type { RiderApplication } from "@/lib/rider.server";

export const Route = createFileRoute("/admin/riders")({
  beforeLoad: async () => {
    const role = await getCurrentRole();
    if (!role) throw redirect({ to: "/login", search: { redirect: "/admin/riders" } as never });
    if (role !== "admin") throw redirect({ to: "/dashboard/customer" });
    return { applications: await getRiderApplicationsForAdmin() };
  },
  head: () => ({ meta: [{ title: "Rider applications — Riderzpro Admin" }] }),
  component: AdminRiderApplications,
});

function AdminRiderApplications() {
  const { applications } = Route.useRouteContext();
  const router = useRouter();
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [verified, setVerified] = useState<Record<string, boolean>>({});
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  async function decide(application: RiderApplication, status: "approved" | "needs_correction" | "rejected") {
    setError("");
    setBusy(application.id);
    try {
      await reviewRiderApplication({
        applicationId: application.id,
        status,
        note: notes[application.id] ?? "",
        verificationConfirmed: verified[application.id] === true,
      });
      await router.invalidate();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save the review decision.");
    } finally {
      setBusy("");
    }
  }

  const openApplications = applications.filter((item) => item.status === "pending_review" || item.status === "needs_correction");
  return (
    <RiderPortalFrame>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div><Link to="/dashboard/admin" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800"><ArrowLeft className="h-4 w-4" /> Admin console</Link><h1 className="mt-3 text-3xl font-extrabold tracking-tight">Rider applications</h1><p className="mt-1 text-sm text-slate-600">Review applications and record a decision. Only admin accounts can access this page.</p></div>
        <div className="flex gap-2"><Link to="/admin/rider-deliveries" className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-emerald-800 px-4 text-sm font-semibold text-white"><Bike className="h-4 w-4" /> Rider dispatch</Link><button onClick={() => router.invalidate()} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold"><RefreshCw className="h-4 w-4" /> Refresh</button></div>
      </div>
      <div className="mb-6 flex gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950"><AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" /><p><b>Verification policy and secure document checks are not configured yet.</b> Approval is blocked by default; the server also requires `RIDER_APPROVALS_ENABLED=true`. Do not enable it until Riderzpro has an approved India onboarding checklist and an authorized, secure review process. Never put document numbers in review notes.</p></div>
      {error && <p role="alert" className="mb-5 rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      <p className="mb-3 text-sm font-semibold text-slate-600">{openApplications.length} application{openApplications.length === 1 ? "" : "s"} awaiting review · {applications.length} total</p>
      {applications.length === 0 ? <section className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center"><Bike className="mx-auto h-8 w-8 text-slate-400" /><h2 className="mt-3 text-xl font-bold">No rider applications yet</h2><p className="mt-2 text-sm text-slate-600">Submitted applications will appear here.</p></section> : <div className="grid gap-4">
        {applications.map((application) => {
          const actionable = application.status === "pending_review" || application.status === "needs_correction";
          return <article key={application.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Submitted {new Date(application.submitted_at).toLocaleString()}</p><h2 className="mt-1 text-xl font-bold">{application.legal_name}</h2><p className="mt-1 text-sm text-slate-600">{application.phone} · {application.city}, {application.service_state}</p></div>
              <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${application.status === "approved" ? "bg-emerald-50 text-emerald-800" : application.status === "rejected" ? "bg-red-50 text-red-800" : application.status === "needs_correction" ? "bg-amber-50 text-amber-900" : "bg-blue-50 text-blue-800"}`}>{application.status === "approved" ? <CheckCircle2 className="h-4 w-4" /> : application.status === "rejected" ? <XCircle className="h-4 w-4" /> : <Clock3 className="h-4 w-4" />}{application.status.replaceAll("_", " ")}</span>
            </div>
            <div className="mt-5 grid gap-3 rounded-2xl bg-slate-50 p-4 text-sm sm:grid-cols-3"><p><span className="text-slate-500">Vehicle</span><br /><b className="capitalize">{application.vehicle_type}</b></p><p><span className="text-slate-500">Registration</span><br /><b>{application.vehicle_registration}</b></p><p><span className="text-slate-500">Service area</span><br /><b>{application.city}, {application.service_state}</b></p></div>
            {application.review_note && <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm leading-5 text-amber-950"><b>Previous note:</b> {application.review_note}</p>}
            {actionable && <div className="mt-5 border-t border-slate-200 pt-5">
              <label className="grid gap-2 text-sm font-semibold">Review note <span className="text-xs font-normal text-slate-500">Required for correction or rejection. Keep sensitive document identifiers out.</span><textarea value={notes[application.id] ?? ""} onChange={(event) => setNotes((prev) => ({ ...prev, [application.id]: event.target.value }))} maxLength={1000} rows={3} className="rounded-xl border border-slate-300 p-3 font-normal" placeholder="Tell the applicant what to fix or why the application was declined." /></label>
              <label className="mt-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm leading-5 text-amber-950"><input type="checkbox" checked={verified[application.id] ?? false} onChange={(event) => setVerified((prev) => ({ ...prev, [application.id]: event.target.checked }))} className="mt-1 h-4 w-4 accent-emerald-700" /><span>I completed the identity, contact, age/eligibility, and vehicle checks required by the approved Riderzpro India policy using an authorized process. I did not rely on unverified applicant statements alone.</span></label>
              <div className="mt-4 flex flex-wrap gap-2"><button disabled={busy === application.id || !verified[application.id]} onClick={() => decide(application, "approved")} className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-emerald-800 px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"><ShieldCheck className="h-4 w-4" />{busy === application.id ? "Saving…" : "Approve"}</button><button disabled={busy === application.id} onClick={() => decide(application, "needs_correction")} className="min-h-10 rounded-xl border border-amber-300 px-4 text-sm font-semibold text-amber-950 disabled:opacity-50">Request correction</button><button disabled={busy === application.id} onClick={() => decide(application, "rejected")} className="min-h-10 rounded-xl border border-red-200 px-4 text-sm font-semibold text-red-800 disabled:opacity-50">Reject</button></div>
            </div>}
          </article>;
        })}
      </div>}
    </RiderPortalFrame>
  );
}
