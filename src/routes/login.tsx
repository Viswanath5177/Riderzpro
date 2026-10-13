import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Phone,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  Zap,
  Bike,
  Eye,
  EyeOff,
  User,
  ChevronRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import evShowcaseImg from "@/assets/ev-login-showcase.jpg";
import { Logo } from "@/components/site/bits";
import { useStore } from "@/lib/store";
import { bikes } from "@/lib/data";

export type LoginSearch = {
  redirect?: string;
};

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): LoginSearch => {
    const rawRedirect = search["redirect"];
    return {
      redirect: typeof rawRedirect === "string" ? rawRedirect : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Customer Sign In & Registration — RiderzPro" },
      {
        name: "description",
        content: "Sign in or create your RiderzPro account to manage your electric vehicle garage, order verified spare parts, and book certified doorstep EV service.",
      },
      { property: "og:title", content: "Customer Sign In & Registration — RiderzPro" },
      { property: "og:description", content: "Access your EV ownership, spares, and service dashboard." },
    ],
  }),
  component: CustomerLogin,
});

function CustomerLogin() {
  const navigate = useNavigate();
  const { userProfile, setRole, signIn, updateUserProfile, addBike } = useStore();

  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");

  // Sign In state
  const [signInContact, setSignInContact] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [showSignInPassword, setShowSignInPassword] = useState(false);

  // Sign Up state
  const [signUpName, setSignUpName] = useState("");
  const [signUpPhone, setSignUpPhone] = useState("");
  const [signUpBikeId, setSignUpBikeId] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const getRedirectTarget = () => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const redir = params.get("redirect");
      if (redir && redir.startsWith("/")) return redir;
    }
    return "/dashboard/customer";
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInContact.trim()) {
      toast.error("Please enter your mobile number or email.");
      return;
    }
    if (!signInPassword.trim()) {
      toast.error("Please enter your password.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const isEmail = signInContact.includes("@");
      if (isEmail && !userProfile?.email) {
        updateUserProfile({ email: signInContact.trim() });
      } else if (!isEmail && !userProfile?.phone) {
        updateUserProfile({ phone: signInContact.trim() });
      }

      signIn();
      setRole("customer");

      const welcomeName = userProfile?.name?.trim()
        ? userProfile.name.trim().split(" ")[0]
        : "Rider";
      toast.success(`Welcome back, ${welcomeName}!`);

      const target = getRedirectTarget();
      navigate({ to: target as any });
      setIsLoading(false);
    }, 350);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();

    if (!signUpName.trim()) {
      toast.error("Please enter your full name.");
      return;
    }
    if (!signUpPhone.trim()) {
      toast.error("Please enter your mobile number.");
      return;
    }
    if (!signUpPassword.trim() || signUpPassword.length < 4) {
      toast.error("Password must be at least 4 characters.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // 1. Update user profile
      updateUserProfile({
        name: signUpName.trim(),
        phone: signUpPhone.trim(),
        email: `${signUpPhone.trim()}@riderzpro.in`,
        city: "Bengaluru, KA",
        address: "",
      });

      // 2. If a bike was selected, register it in garage
      if (signUpBikeId && signUpBikeId !== "none") {
        const selectedBike = bikes.find((b) => b.id === signUpBikeId);
        if (selectedBike) {
          addBike({
            bikeId: selectedBike.id,
            year: selectedBike.years.at(-1),
            nickname: `${signUpName.trim().split(" ")[0]}'s ${selectedBike.model}`,
            batteryHealth: 99,
            nextServiceDays: 90,
            odoKm: 0,
          });
        }
      }

      // 3. Authenticate and set role
      signIn();
      setRole("customer");

      toast.success(`Account created! Welcome, ${signUpName.trim().split(" ")[0]}!`);

      const target = getRedirectTarget();
      navigate({ to: target as any });
      setIsLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col items-center justify-center sm:p-4 md:p-6 antialiased">
      {/* Phone Mockup Frame on Desktop / Full Screen on Mobile */}
      <div className="w-full sm:max-w-[425px] min-h-screen sm:min-h-[820px] bg-white sm:rounded-[36px] sm:shadow-[0_20px_60px_rgba(0,0,0,0.12)] sm:border sm:border-gray-200/80 flex flex-col justify-between overflow-hidden">
        
        {/* Top: Immersive Full-Bleed EV Motorcycle Hero Banner */}
        <div className="relative h-56 sm:h-60 w-full overflow-hidden bg-black shrink-0">
          <img
            src={evShowcaseImg}
            alt="RiderzPro Electric Motorcycle"
            className="absolute inset-0 h-full w-full object-cover object-center brightness-95"
          />
          {/* Subtle gradient vignette to blend smoothly into white sheet */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/40" />

          {/* Floating Header Over Image */}
          <div className="relative z-10 p-4 sm:p-5 flex items-center justify-between">
            <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm flex items-center">
              <Logo imgClassName="h-6 w-auto" />
            </div>

            <Link
              to="/"
              className="px-3 py-1.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white text-xs font-semibold border border-white/20 transition active:scale-95"
            >
              ← Store
            </Link>
          </div>

          {/* Headline Over Bottom of Image */}
          <div className="absolute bottom-6 left-5 right-5 z-10">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold text-white border border-white/25">
              <span className="h-1.5 w-1.5 rounded-full bg-[#E31E24] animate-pulse" />
              EV Mobility & Doorstep Care
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1 leading-tight tracking-tight font-display drop-shadow-sm">
              Your Ride. Verified Spares.
            </h2>
          </div>
        </div>

        {/* Bottom Form Sheet (Overlapping with curved top) */}
        <div className="relative -mt-5 rounded-t-[28px] bg-white px-5 sm:px-6 pt-5 pb-6 flex-1 flex flex-col justify-between shadow-2xl z-20">
          <div>
            {/* Sheet Handle */}
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4 sm:hidden" />

            {/* Role Switcher: Customer vs Vendor */}
            <div className="flex p-1 rounded-2xl bg-red-50/60 border border-red-100 mb-4 text-xs font-bold">
              <button
                type="button"
                className="flex-1 py-1.5 rounded-xl bg-white text-[#E31E24] shadow-xs font-black cursor-default"
              >
                Customer
              </button>
              <Link
                to="/vendor/auth"
                className="flex-1 text-center py-1.5 rounded-xl text-gray-600 hover:text-gray-900 transition font-semibold"
              >
                Vendor
              </Link>
            </div>

            {/* Apple-style Segmented Control */}
            <div className="flex p-1 rounded-2xl bg-gray-100 border border-gray-200/70 mb-5 text-sm font-bold">
              <button
                type="button"
                onClick={() => setActiveTab("signin")}
                className={`flex-1 py-2.5 rounded-xl transition cursor-pointer text-center ${
                  activeTab === "signin"
                    ? "bg-white text-gray-900 shadow-[0_2px_8px_rgba(0,0,0,0.06)] font-black"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("signup")}
                className={`flex-1 py-2.5 rounded-xl transition cursor-pointer text-center ${
                  activeTab === "signup"
                    ? "bg-white text-gray-900 shadow-[0_2px_8px_rgba(0,0,0,0.06)] font-black"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Create Account
              </button>
            </div>

            {/* ─────────────────────────────────────────────────────────────
                SIGN IN TAB
               ───────────────────────────────────────────────────────────── */}
            {activeTab === "signin" ? (
              <div className="space-y-4">
                <div>
                  <h1 className="text-2xl font-black text-gray-900 tracking-tight font-display">
                    Welcome to RiderzPro
                  </h1>
                  <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                    Access your garage, live delivery tracking, and certified service.
                  </p>
                </div>

                <form onSubmit={handleSignIn} className="space-y-3.5 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Mobile Number or Email
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        name="username"
                        autoComplete="username"
                        value={signInContact}
                        onChange={(e) => setSignInContact(e.target.value)}
                        placeholder="e.g. 9876543210 or name@mail.com"
                        className="w-full h-12 rounded-2xl border border-gray-200 bg-gray-50/80 hover:bg-gray-50 focus:bg-white px-4 pl-11 text-sm outline-none focus:border-[#E31E24] focus:ring-4 focus:ring-[#E31E24]/10 transition"
                        required
                      />
                      <Phone className="h-4.5 w-4.5 text-gray-400 absolute left-3.5 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => toast.info("Demo reset code sent.")}
                        className="text-xs text-[#E31E24] font-bold hover:underline cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative flex items-center">
                      <input
                        type={showSignInPassword ? "text" : "password"}
                        name="password"
                        autoComplete="current-password"
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full h-12 rounded-2xl border border-gray-200 bg-gray-50/80 hover:bg-gray-50 focus:bg-white px-4 pl-11 pr-11 text-sm outline-none focus:border-[#E31E24] focus:ring-4 focus:ring-[#E31E24]/10 transition"
                        required
                      />
                      <Lock className="h-4.5 w-4.5 text-gray-400 absolute left-3.5 pointer-events-none" />
                      <button
                        type="button"
                        onClick={() => setShowSignInPassword(!showSignInPassword)}
                        className="absolute right-3.5 text-gray-400 hover:text-gray-700 p-1 cursor-pointer"
                      >
                        {showSignInPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#E31E24] to-[#C1121F] text-white font-extrabold text-sm shadow-[0_6px_20px_rgba(227,30,36,0.3)] hover:shadow-[0_8px_25px_rgba(227,30,36,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-3"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Signing in...
                      </span>
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>

                <div className="pt-2 text-center text-sm text-gray-500">
                  New to RiderzPro?{" "}
                  <button
                    type="button"
                    onClick={() => setActiveTab("signup")}
                    className="font-bold text-[#E31E24] hover:underline cursor-pointer"
                  >
                    Create an account
                  </button>
                </div>
              </div>
            ) : (
              /* ─────────────────────────────────────────────────────────────
                  CREATE ACCOUNT TAB
                 ───────────────────────────────────────────────────────────── */
              <div className="space-y-4">
                <div>
                  <h1 className="text-2xl font-black text-gray-900 tracking-tight font-display">
                    Create Your Account
                  </h1>
                  <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                    Set up your EV garage to get verified spares and doorstep service.
                  </p>
                </div>

                <form onSubmit={handleSignUp} className="space-y-3.5 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Full Name <span className="text-[#E31E24]">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        name="name"
                        autoComplete="name"
                        value={signUpName}
                        onChange={(e) => setSignUpName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full h-12 rounded-2xl border border-gray-200 bg-gray-50/80 hover:bg-gray-50 focus:bg-white px-4 pl-11 text-sm outline-none focus:border-[#E31E24] focus:ring-4 focus:ring-[#E31E24]/10 transition"
                        required
                      />
                      <User className="h-4.5 w-4.5 text-gray-400 absolute left-3.5 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Mobile Number <span className="text-[#E31E24]">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="tel"
                        name="tel"
                        autoComplete="tel"
                        value={signUpPhone}
                        onChange={(e) => setSignUpPhone(e.target.value)}
                        placeholder="10-digit mobile number"
                        className="w-full h-12 rounded-2xl border border-gray-200 bg-gray-50/80 hover:bg-gray-50 focus:bg-white px-4 pl-11 text-sm outline-none focus:border-[#E31E24] focus:ring-4 focus:ring-[#E31E24]/10 transition"
                        required
                      />
                      <Phone className="h-4.5 w-4.5 text-gray-400 absolute left-3.5 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Electric Vehicle Model <span className="text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <div className="relative flex items-center">
                      <select
                        value={signUpBikeId}
                        onChange={(e) => setSignUpBikeId(e.target.value)}
                        className="w-full h-12 rounded-2xl border border-gray-200 bg-gray-50/80 hover:bg-gray-50 focus:bg-white px-4 pl-11 pr-10 text-sm outline-none focus:border-[#E31E24] focus:ring-4 focus:ring-[#E31E24]/10 transition text-gray-800 appearance-none cursor-pointer"
                      >
                        <option value="">Select your model (e.g. Ather, Ola...)</option>
                        {bikes.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.make} {b.model}
                          </option>
                        ))}
                        <option value="none">I don't own an EV yet</option>
                      </select>
                      <Bike className="h-4.5 w-4.5 text-gray-400 absolute left-3.5 pointer-events-none" />
                      <ChevronRight className="h-4.5 w-4.5 text-gray-400 absolute right-3.5 rotate-90 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Password <span className="text-[#E31E24]">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type={showSignUpPassword ? "text" : "password"}
                        name="password"
                        autoComplete="new-password"
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        placeholder="Min. 4 characters"
                        className="w-full h-12 rounded-2xl border border-gray-200 bg-gray-50/80 hover:bg-gray-50 focus:bg-white px-4 pl-11 pr-11 text-sm outline-none focus:border-[#E31E24] focus:ring-4 focus:ring-[#E31E24]/10 transition"
                        required
                      />
                      <Lock className="h-4.5 w-4.5 text-gray-400 absolute left-3.5 pointer-events-none" />
                      <button
                        type="button"
                        onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                        className="absolute right-3.5 text-gray-400 hover:text-gray-700 p-1 cursor-pointer"
                      >
                        {showSignUpPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#E31E24] to-[#C1121F] text-white font-extrabold text-sm shadow-[0_6px_20px_rgba(227,30,36,0.3)] hover:shadow-[0_8px_25px_rgba(227,30,36,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-3"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Creating account...
                      </span>
                    ) : (
                      <>
                        <span>Create Account</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>

                <div className="pt-2 text-center text-sm text-gray-500">
                  Already registered?{" "}
                  <button
                    type="button"
                    onClick={() => setActiveTab("signin")}
                    className="font-bold text-[#E31E24] hover:underline cursor-pointer"
                  >
                    Sign in here
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Selling EV parts link */}
          <div className="py-2 text-center text-xs text-gray-500">
            Selling EV parts?{" "}
            <Link to="/vendor/auth" search={{ mode: "signup" }} className="font-bold text-[#E31E24] hover:underline">
              Become a RiderzPro vendor →
            </Link>
          </div>

          {/* Bottom Security Footer */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-center gap-1.5 text-xs text-gray-400">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>256-Bit SSL Encrypted · RiderzPro Mobility</span>
          </div>
        </div>
      </div>
    </div>
  );
}
