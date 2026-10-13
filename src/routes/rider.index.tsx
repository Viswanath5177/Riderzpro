import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ArrowRight, CheckCircle2, ShieldCheck, Truck } from "lucide-react";
import { RiderPortalFrame } from "@/components/rider/RiderPortalFrame";

export const Route = createFileRoute("/rider/")({
  head: () => ({ meta: [{ title: "Rider Portal — Riderzpro" }, { name: "description", content: "Apply to deliver with Riderzpro and manage your rider account." }] }),
  component: RiderLanding,
});

function RiderLanding() {
  return (
    <RiderPortalFrame>
      <section className="grid gap-10 rounded-[2rem] bg-[#10372F] p-6 text-white sm:p-10 lg:grid-cols-[1.2fr_.8fr] lg:p-14">
        <div className="flex flex-col items-start justify-center">
          <span className="rounded-full border border-emerald-100/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[.18em] text-emerald-100">Rider partner portal</span>
          <h1 className="mt-5 max-w-xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">Deliver locally. Ride with purpose.</h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-emerald-50/80">Apply to join Riderzpro deliveries. After your application is reviewed and approved, your rider workspace will be activated.</p>
          <Link to="/rider/apply" className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-xl bg-white px-5 font-semibold text-[#10372F] hover:bg-emerald-50">
            Start rider application <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="mt-3 text-sm text-emerald-50/70">Already have an application? <Link to="/rider/status" className="font-semibold text-white underline underline-offset-4">Check status</Link></p>
        </div>
        <div className="grid content-center gap-3">
          <InfoCard icon={<CheckCircle2 />} title="Apply online" body="Share your contact, service city, and delivery vehicle details." />
          <InfoCard icon={<ShieldCheck />} title="Complete verification" body="Operations reviews the documents required for your region and vehicle." />
          <InfoCard icon={<Truck />} title="Get approved" body="After a manual review and required checks, approved riders can access the rider workspace." />
        </div>
      </section>
      <p className="mx-auto mt-6 max-w-3xl text-center text-xs leading-5 text-slate-500">Verification requirements depend on your location and vehicle. Do not email or upload identity documents through this prototype; a secure document-submission flow is still being built.</p>
    </RiderPortalFrame>
  );
}

function InfoCard({ icon, title, body }: { icon: ReactNode; title: string; body: string }) {
  return <div className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4"><span className="mt-0.5 text-emerald-200">{icon}</span><div><h2 className="font-semibold">{title}</h2><p className="mt-1 text-sm leading-5 text-emerald-50/70">{body}</p></div></div>;
}
