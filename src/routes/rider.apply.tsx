import { useState } from "react";
import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { AlertCircle, ArrowRight, FileCheck2, ShieldCheck } from "lucide-react";
import { RiderPortalFrame } from "@/components/rider/RiderPortalFrame";
import { getCurrentUser, linkVerifiedPhone, sendSignInCode } from "@/lib/auth";
import { getRiderApplication, submitRiderApplication } from "@/lib/rider";
import { normalizeIndiaPhone, RIDER_LAUNCH_STATES } from "@/lib/rider.validation";

export const Route = createFileRoute("/rider/apply")({
  beforeLoad: async () => {
    const user = await getCurrentUser();
    const application = await getRiderApplication();
    if (user && user.role !== "customer") throw redirect({ to: "/dashboard/admin" });
    if (application?.status === "approved") throw redirect({ to: "/rider/dashboard" });
    if (application?.status === "pending_review") throw redirect({ to: "/rider/status" });
    return { application, signedIn: Boolean(user), verifiedPhone: user?.phone ?? null };
  },
  head: () => ({ meta: [{ title: "Rider application — Riderzpro" }] }),
  component: RiderApplicationPage,
});

function RiderApplicationPage() {
  const { application, signedIn, verifiedPhone } = Route.useRouteContext();
  const navigate = useNavigate();
  const [accountSignedIn, setAccountSignedIn] = useState(signedIn);
  const [legalName, setLegalName] = useState(application?.legal_name ?? "");
  const [phone, setPhone] = useState(application?.phone ?? verifiedPhone ?? "");
  const [phoneIsVerified, setPhoneIsVerified] = useState(Boolean(verifiedPhone));
  const [phoneCode, setPhoneCode] = useState("");
  const [phoneCodeSent, setPhoneCodeSent] = useState(false);
  const [verifyingPhone, setVerifyingPhone] = useState(false);
  const [city, setCity] = useState(application?.city ?? "");
  const [serviceState, setServiceState] = useState(application?.service_state ?? "");
  const [vehicleType, setVehicleType] = useState<"motorcycle" | "scooter" | "bicycle">(application?.vehicle_type ?? "motorcycle");
  const [vehicleRegistration, setVehicleRegistration] = useState(application?.vehicle_registration ?? "");
  const [accepted, setAccepted] = useState(false);
  const [eligible, setEligible] = useState(false);
  const [privacyAcknowledged, setPrivacyAcknowledged] = useState(false);
  const [error, setError] = useState("");
  const [signInNeeded, setSignInNeeded] = useState(false);
  const [busy, setBusy] = useState(false);

  async function requestPhoneCode() {
    setError("");
    setVerifyingPhone(true);
    try {
      await sendSignInCode(normalizeIndiaPhone(phone));
      setPhoneCodeSent(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not send a verification code.");
    } finally {
      setVerifyingPhone(false);
    }
  }

  async function verifyPhoneCode() {
    setError("");
    setVerifyingPhone(true);
    try {
      const result = await linkVerifiedPhone(normalizeIndiaPhone(phone), phoneCode);
      setPhone(result.phone);
      setPhoneIsVerified(true);
      setPhoneCodeSent(false);
      setPhoneCode("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not verify this mobile number.");
    } finally {
      setVerifyingPhone(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSignInNeeded(false);
      if (!accepted || !eligible || !privacyAcknowledged) { setError("Confirm the application details and eligibility and acknowledge the privacy notice before submitting."); return; }
    setBusy(true);
    try {
      const user = await getCurrentUser();
      if (!user) {
        setSignInNeeded(true);
        return;
      }
      setAccountSignedIn(true);
      if (!user.phone || normalizeIndiaPhone(user.phone) !== normalizeIndiaPhone(phone)) {
        setError("Verify this mobile number with the OTP code before submitting your application.");
        return;
      }
      setPhoneIsVerified(true);
      await submitRiderApplication({ legalName, phone, city, serviceState, vehicleType, vehicleRegistration, accuracyConfirmed: accepted, eligibilityConfirmed: eligible, privacyNoticeAcknowledged: privacyAcknowledged });
      await navigate({ to: "/rider/status" });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not submit your application. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <RiderPortalFrame>
      <div className="mx-auto max-w-3xl">
        <Link to="/rider" className="text-sm font-semibold text-emerald-800">← Rider portal</Link>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight">Rider application</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">Enter your details and verify your Indian mobile number by OTP. If you need to sign in, open it in a new tab and return here; your entries stay in this tab.</p>
        {!accountSignedIn && <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-950">Sign in before verifying your mobile number. <Link to="/login" search={{ redirect: "/rider/apply" } as never} target="_blank" className="font-bold underline underline-offset-2">Open sign in in a new tab</Link>, then return here.</div>}
        <div className="mt-6 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" />
          <p><b>Document verification is not collected in this prototype.</b> Do not send identity, licence, or vehicle documents by email or through this form. Region-specific requirements must be reviewed securely before any account is activated.</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-6 space-y-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Legal name" value={legalName} onChange={setLegalName} autoComplete="name" required />
            <div className="grid gap-2 text-sm font-semibold">Verified Indian mobile number
              <div className="flex flex-wrap gap-2"><input value={phone} onChange={(e) => { setPhone(e.target.value); setPhoneCodeSent(false); }} disabled={phoneIsVerified} autoComplete="tel" placeholder="10-digit mobile or +91 number" required className="h-11 min-w-0 flex-1 rounded-xl border border-slate-300 px-3 font-normal outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-100" />
                {!phoneIsVerified && accountSignedIn && <button type="button" onClick={requestPhoneCode} disabled={verifyingPhone} className="min-h-11 rounded-xl border border-emerald-800 px-3 text-sm font-semibold text-emerald-800 disabled:opacity-60">{verifyingPhone && !phoneCodeSent ? "Sending…" : "Send OTP"}</button>}
                {phoneIsVerified && <span className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-emerald-50 px-3 text-sm font-semibold text-emerald-800"><ShieldCheck className="h-4 w-4" /> Verified</span>}
              </div>
            </div>
            {phoneCodeSent && <div className="grid gap-2 rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm sm:grid-cols-[1fr_auto]"><label className="grid gap-1 font-semibold text-blue-950">Six-digit code<input value={phoneCode} onChange={(e) => setPhoneCode(e.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" className="h-11 rounded-lg border border-blue-200 bg-white px-3 font-normal" /></label><button type="button" onClick={verifyPhoneCode} disabled={verifyingPhone || phoneCode.length !== 6} className="self-end rounded-lg bg-blue-900 px-4 py-3 font-semibold text-white disabled:opacity-50">{verifyingPhone ? "Verifying…" : "Verify mobile"}</button><p className="text-xs text-blue-900 sm:col-span-2">Enter the code sent to {normalizeIndiaPhone(phone)}. Codes expire after 10 minutes.</p></div>}
            <Field label="City / service area" value={city} onChange={setCity} autoComplete="address-level2" required />
            <label className="grid gap-2 text-sm font-semibold">State / union territory
              <select value={serviceState} onChange={(e) => setServiceState(e.target.value)} required className="h-11 rounded-xl border border-slate-300 bg-white px-3 font-normal">
                <option value="">Select state / union territory</option>
                {RIDER_LAUNCH_STATES.map((state) => <option key={state} value={state}>{state}</option>)}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-semibold">Delivery vehicle
              <select value={vehicleType} onChange={(e) => setVehicleType(e.target.value as typeof vehicleType)} className="h-11 rounded-xl border border-slate-300 bg-white px-3 font-normal">
                <option value="motorcycle">Motorcycle</option><option value="scooter">Scooter</option><option value="bicycle">Pedal bicycle (no motor)</option>
              </select>
            </label>
            {vehicleType !== "bicycle" && <div className="sm:col-span-2"><Field label="Vehicle registration number" value={vehicleRegistration} onChange={setVehicleRegistration} autoComplete="off" required /></div>}
            {vehicleType === "bicycle" && <p className="sm:col-span-2 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">Registration number is not required for a pedal bicycle. For an electric or motorized vehicle, choose its motorized vehicle type so the required details can be checked.</p>}
          </div>
          <label className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 text-sm leading-5 text-slate-700">
            <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} className="mt-1 h-4 w-4 accent-emerald-700" />
            <span>I confirm the details are accurate and understand that submitting does not grant delivery access.</span>
          </label>
          <label className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 text-sm leading-5 text-slate-700">
            <input type="checkbox" checked={eligible} onChange={(e) => setEligible(e.target.checked)} className="mt-1 h-4 w-4 accent-emerald-700" />
            <span>I confirm that I meet the minimum age and eligibility requirements that apply to this work and vehicle in my service area.</span>
          </label>
          <label className="flex items-start gap-3 rounded-xl border border-slate-200 p-3 text-sm leading-5 text-slate-700">
            <input type="checkbox" checked={privacyAcknowledged} onChange={(e) => setPrivacyAcknowledged(e.target.checked)} className="mt-1 h-4 w-4 accent-emerald-700" />
            <span>I acknowledge that Riderzpro will use these details to process and review my rider application. I have read the <Link to="/privacy" target="_blank" className="font-semibold underline">privacy notice</Link>.</span>
          </label>
          {error && <p role="alert" className="flex gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-800"><AlertCircle className="h-5 w-5 shrink-0" />{error}</p>}
          {signInNeeded && <p role="status" className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm leading-6 text-blue-950">Please sign in to submit this application. <Link to="/login" search={{ redirect: "/rider/apply" } as never} target="_blank" className="font-bold underline underline-offset-2">Open sign in in a new tab</Link>, then return here and submit again.</p>}
          <button disabled={busy} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-800 px-5 font-semibold text-white hover:bg-emerald-900 disabled:opacity-60 sm:w-auto">
            {busy ? "Submitting…" : "Submit for review"} <ArrowRight className="h-4 w-4" />
          </button>
          <p className="flex items-center gap-2 text-xs text-slate-500"><FileCheck2 className="h-4 w-4" />Your application is tied to your signed-in account.</p>
        </form>
      </div>
    </RiderPortalFrame>
  );
}


function Field({ label, value, onChange, ...props }: { label: string; value: string; onChange: (value: string) => void; autoComplete?: string; required?: boolean; placeholder?: string }) {
  return <label className="grid gap-2 text-sm font-semibold">{label}<input value={value} onChange={(e) => onChange(e.target.value)} className="h-11 rounded-xl border border-slate-300 px-3 font-normal outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100" {...props} /></label>;
}
