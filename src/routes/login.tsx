import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Phone,
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import riderImg from "@/assets/rider.jpg";
import { Logo } from "@/components/site/bits";
import { useStore } from "@/lib/store";
import { sendSignInCode, verifySignInCode } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Customer Sign In — RiderzPro" },
      {
        name: "description",
        content: "Sign in to your RiderzPro customer portal to manage your EV garage, track live deliveries, and book certified technicians.",
      },
      { property: "og:title", content: "Customer Sign In — RiderzPro" },
      { property: "og:description", content: "Access your EV ownership & parts dashboard." },
    ],
  }),
  component: CustomerLogin,
});

function CustomerLogin() {
  const navigate = useNavigate();
  const { setRole, signIn } = useStore();

  const [authMode, setAuthMode] = useState<"phone" | "email">("phone");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const identity = authMode === "phone" ? phone : email;

  const requestCode = async () => {
    setError("");
    setIsLoading(true);
    try {
      await sendSignInCode(identity);
      setCodeSent(true);
      toast.success("Sign-in code sent", { description: `Check ${identity} for your six-digit code.` });
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "Could not send a sign-in code. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const getRedirectTarget = () => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const redir = params.get("redirect");
      if (redir && redir.startsWith("/")) return redir;
    }
    return "/shop";
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      if (!codeSent) {
        await requestCode();
        return;
      }
      const role = await verifySignInCode(identity, code);
      setRole(role);
      signIn();
      toast.success("Signed in successfully");
      const target = role === "admin" ? "/dashboard/admin" : getRedirectTarget();
      navigate({ to: target as any });
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "Could not sign in. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const changeIdentity = () => { setCodeSent(false); setCode(""); setError(""); };

  return (
    <div className="grid min-h-screen lg:grid-cols-2 bg-[#F7F9FB] antialiased">
      {/* Left visual showcase (Desktop) */}
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-emerald-950 p-12 text-white">
        <img
          src={riderImg}
          alt="RiderzPro EV Rider"
          width={1280}
          height={896}
          className="absolute inset-0 h-full w-full object-cover opacity-35 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        {/* Top badge */}
        <div className="relative z-10 flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-emerald-300">
            Automotive EV Ownership & Logistics
          </span>
        </div>

        {/* Bottom quotes and benefits */}
        <div className="relative z-10 space-y-6 max-w-lg">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Customer Portal
            </span>
            <h2 className="mt-2 text-4xl font-extrabold tracking-tight font-display text-white leading-tight">
              Every part for your EV. Zero guesswork.
            </h2>
            <p className="mt-3 text-sm text-gray-300 leading-relaxed">
              VIN-matched lithium battery packs, fast chargers, and doorstep certified technician care tailored for your Ather, Ola, TVS, Revolt, Hero & Chetak.
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-white/15 text-xs">
            <div className="flex items-center gap-2.5 text-gray-200">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
              <span>100% Fitment Guarantee with 17-digit VIN decoding</span>
            </div>
            <div className="flex items-center gap-2.5 text-gray-200">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
              <span>Real-time courier GPS tracking with milestone dispatch</span>
            </div>
            <div className="flex items-center gap-2.5 text-gray-200">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
              <span>Doorstep 24-point battery health and BMS calibration visits</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Container */}
      <div className="flex flex-col justify-between p-6 sm:p-10 md:p-14 lg:p-16 bg-white max-w-xl mx-auto w-full">
        {/* Top Bar */}
        <div className="flex items-center justify-between pb-6">
          <Logo imgClassName="h-9" />
          <Link
            to="/"
            className="text-xs font-semibold text-[#6B7280] hover:text-[#E31E24] transition"
          >
            ← Back to Store
          </Link>
        </div>

        {/* Center Login Form */}
        <div className="my-auto py-6 space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#E31E24] bg-red-50 px-2.5 py-1 rounded-md">
              Customer Access
            </span>
            <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 font-display">
              Sign In to Your Dashboard
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-gray-500">
              Sign in with a one-time code sent to your mobile number or email.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignIn} className="space-y-4">
            {/* Phone vs Email Toggle */}
            <div className="flex p-1 rounded-xl bg-gray-100 border border-gray-200 text-xs font-semibold">
              <button
                type="button"
                onClick={() => { setAuthMode("phone"); changeIdentity(); }}
                className={`flex-1 py-1.5 rounded-lg transition ${
                  authMode === "phone" ? "bg-white text-gray-900 shadow-2xs font-bold" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Mobile Number
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode("email"); changeIdentity(); }}
                className={`flex-1 py-1.5 rounded-lg transition ${
                  authMode === "email" ? "bg-white text-gray-900 shadow-2xs font-bold" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Email Address
              </button>
            </div>

            {authMode === "phone" ? (
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Mobile Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+919876543210"
                    className="w-full h-11 rounded-2xl border border-gray-300 px-3.5 pl-10 text-sm outline-none focus:border-primary transition"
                    required
                  />
                  <Phone className="h-4 w-4 text-gray-400 absolute left-3.5 top-3.5" />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full h-11 rounded-2xl border border-gray-300 px-3.5 pl-10 text-sm outline-none focus:border-primary transition"
                    required
                  />
                  <Mail className="h-4 w-4 text-gray-400 absolute left-3.5 top-3.5" />
                </div>
              </div>
            )}

            {codeSent && <>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">Six-digit sign-in code</label>
                <input type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="Enter the code" className="w-full h-11 rounded-2xl border border-gray-300 px-3.5 text-sm outline-none focus:border-primary transition" required />
                <p className="mt-2 text-xs text-gray-500">Code sent to {identity}.</p>
              </div>
              <div className="flex justify-between text-xs">
                <button type="button" onClick={changeIdentity} className="text-primary hover:underline">Use a different {authMode === "phone" ? "number" : "email"}</button>
                <button type="button" disabled={isLoading} onClick={() => void requestCode()} className="text-primary hover:underline disabled:opacity-50">Resend code</button>
              </div>
            </>}
            {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-xl bg-[#E31E24] text-white text-xs sm:text-sm font-bold shadow-xs hover:bg-red-700 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>{codeSent ? "Verifying code..." : "Sending code..."}</span>
              ) : (
                <>
                  <span>{codeSent ? "Verify and continue" : "Send sign-in code"}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <div className="flex items-center gap-1.5 text-gray-400">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>256-bit Encrypted Customer Portal</span>
          </div>

          <Link to="/" className="text-xs font-semibold text-gray-700 hover:text-primary transition">
            ← Return to RiderzPro Home
          </Link>
        </div>
      </div>
    </div>
  );
}
