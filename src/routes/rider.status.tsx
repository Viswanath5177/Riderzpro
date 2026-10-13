import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { BadgeCheck, Clock3, FileWarning, ShieldCheck } from "lucide-react";
import { RiderPortalFrame } from "@/components/rider/RiderPortalFrame";
import { getCurrentUser } from "@/lib/auth";
import { getRiderApplication } from "@/lib/rider";

export const Route = createFileRoute("/rider/status")({
  beforeLoad: async () => {
    const user = await getCurrentUser();
    if (!user) throw redirect({ to: "/login", search: { redirect: "/rider/status" } as never });
    const application = await getRiderApplication();
    if (!application) throw redirect({ to: "/rider/apply" });
    if (application.status === "approved") throw redirect({ to: "/rider/dashboard" });
    return { application };
  },
  head: () => ({ meta: [{ title: "Application status — Riderzpro" }] }),
  component: RiderStatusPage,
});

function RiderStatusPage() {
  const { application } = Route.useRouteContext();
  const needsCorrection = application.status === "needs_correction";
  const rejected = application.status === "rejected";
  const Icon = needsCorrection ? FileWarning : rejected ? ShieldCheck : Clock3;
  return (
    <RiderPortalFrame>
      <section className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <span className={`grid h-14 w-14 place-items-center rounded-2xl ${needsCorrection || rejected ? "bg-amber-100 text-amber-800" : "bg-blue-50 text-blue-800"}`}><Icon className="h-7 w-7" /></span>
        <p className="mt-6 text-xs font-bold uppercase tracking-[.18em] text-emerald-800">Rider application</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight">{needsCorrection ? "We need a little more information" : rejected ? "Application not approved" : "Your application is under review"}</h1>
        <p className="mt-3 leading-7 text-slate-600">{needsCorrection ? "Review the note below, update your application, and submit it again." : rejected ? "You can review the decision below. Contact rider support if you think this needs another review." : "Your details were received. Delivery access stays disabled while the team reviews your application and required verification."}</p>
        {application.review_note && <div className="mt-5 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-950"><b>Review note:</b> {application.review_note}</div>}
        <div className="mt-6 grid gap-3 rounded-2xl bg-slate-50 p-4 text-sm sm:grid-cols-2">
          <p><span className="text-slate-500">Name</span><br /><b>{application.legal_name}</b></p>
          <p><span className="text-slate-500">Submitted</span><br /><b>{new Date(application.submitted_at).toLocaleDateString()}</b></p>
          <p><span className="text-slate-500">Service area</span><br /><b>{application.city}, {application.service_state}</b></p>
          <p><span className="text-slate-500">Status</span><br /><b className="capitalize">{application.status.replaceAll("_", " ")}</b></p>
        </div>
        <p className="mt-5 flex gap-2 text-xs leading-5 text-slate-500"><BadgeCheck className="h-4 w-4 shrink-0" /> The review team will apply Riderzpro's approved checks before activation. This portal does not collect identity documents.</p>
        {needsCorrection && <Link to="/rider/apply" className="mt-6 inline-flex rounded-xl bg-emerald-800 px-5 py-3 font-semibold text-white">Update application</Link>}
      </section>
    </RiderPortalFrame>
  );
}
