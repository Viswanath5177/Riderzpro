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
} from "lucide-react";
import { toast } from "sonner";
import evShowcaseImg from "@/assets/ev-login-showcase.jpg";
import { Logo } from "@/components/site/bits";
import { useStore } from "@/lib/store";
import { bikes } from "@/lib/data";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In — RiderzPro" },
      {
        name: "description",
        content: "Sign in or create your RiderzPro account to manage your electric vehicle garage, parts orders, and doorstep service.",
      },
    ],
  }),
  component: CustomerLogin,
});

function CustomerLogin() {
  const navigate = useNavigate();
  const { userProfile, setRole, signIn, updateUserProfile, addBike } = useStore();

  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [authMode, setAuthMode] = useState<"phone" | "email">("phone");

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
      // If user profile has no contact yet, save current input
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

      // 2. If a bike was selected, register it in the customer's garage
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
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col items-center justify-center p-0 sm:p-6 antialiased">
      {/* Mobile-First Center Container */}
      <div className="w-full sm:max-w-md min-h-screen sm:min-h-0 bg-white sm:rounded-3xl sm:shadow-xl sm:border sm:border-gray-200/80 p-5 sm:p-7 flex flex-col justify-between">
        {/* Top Bar */}
        <div>
          <div className="flex items-center justify-between pb-3">
            <Logo imgClassName="h-8" />
            <Link
              to="/"
              className="text-xs font-semibold text-gray-500 hover:text-[#E31E24] transition"
            >
              ← Store
            </Link>
          </div>

          {/* Visual Showcase Banner */}
          <div className="relative h-36 w-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#7F1D1D] via-[#991B1B] to-[#E31E24] mb-5 shadow-2xs border border-red-200/50">
            <img
              src={evShowcaseImg}
              alt="Electric Vehicle Motorcycle"
              className="absolute inset-0 h-full w-full object-cover opacity-55 mix-blend-luminosity"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#7F1D1D]/95 via-[#7F1D1D]/40 to-transparent" />
            <div className="relative z-10 h-full flex flex-col justify-between p-3.5">
              <span className="self-start px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold text-white flex items-center gap-1.5 border border-white/25">
                <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                EV Mobility & Service
              </span>
              <div>
                <p className="text-white font-black text-sm leading-tight font-display">
                  Genuine EV Spares & Doorstep Care
                </p>
                <p className="text-gray-300 text-[11px] mt-0.5">
                  Ather · Ola · TVS · Revolt · Chetak
                </p>
              </div>
            </div>
          </div>

          {/* Tab Switcher: Sign In vs Create Account */}
          <div className="flex p-1 rounded-xl bg-gray-100 border border-gray-200/80 mb-5 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab("signin")}
              className={`flex-1 py-2 rounded-lg transition cursor-pointer text-center ${
                activeTab === "signin"
                  ? "bg-white text-gray-900 shadow-2xs font-black"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("signup")}
              className={`flex-1 py-2 rounded-lg transition cursor-pointer text-center ${
                activeTab === "signup"
                  ? "bg-white text-gray-900 shadow-2xs font-black"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              SIGN IN FORM
             ───────────────────────────────────────────────────────────── */}
          {activeTab === "signin" ? (
            <div className="space-y-4">
              <div>
                <h1 className="text-xl font-black text-gray-900 tracking-tight font-display">
                  Welcome to RiderzPro
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  Enter your mobile number or email to access your garage and orders.
                </p>
              </div>

              <form onSubmit={handleSignIn} className="space-y-3.5 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Mobile Number or Email
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="username"
                      autoComplete="username"
                      value={signInContact}
                      onChange={(e) => setSignInContact(e.target.value)}
                      placeholder="e.g. 9876543210 or name@mail.com"
                      className="w-full h-11 rounded-xl border border-gray-300 px-3.5 pl-10 text-sm outline-none focus:border-[#E31E24] focus:ring-1 focus:ring-[#E31E24]/20 transition bg-white"
                      required
                    />
                    <Phone className="h-4 w-4 text-gray-400 absolute left-3.5 top-3.5" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => toast.info("Demo recovery link sent.")}
                      className="text-[11px] text-[#E31E24] font-semibold hover:underline"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showSignInPassword ? "text" : "password"}
                      name="password"
                      autoComplete="current-password"
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full h-11 rounded-xl border border-gray-300 px-3.5 pl-10 pr-10 text-sm outline-none focus:border-[#E31E24] focus:ring-1 focus:ring-[#E31E24]/20 transition bg-white"
                      required
                    />
                    <Lock className="h-4 w-4 text-gray-400 absolute left-3.5 top-3.5" />
                    <button
                      type="button"
                      onClick={() => setShowSignInPassword(!showSignInPassword)}
                      className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-700"
                    >
                      {showSignInPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 rounded-xl bg-[#E31E24] hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-sm transition active:scale-98 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5 mt-2"
                >
                  {isLoading ? (
                    <span>Signing in...</span>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="pt-3 text-center text-xs text-gray-500">
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
                CREATE ACCOUNT (SIGN UP) FORM
               ───────────────────────────────────────────────────────────── */
            <div className="space-y-4">
              <div>
                <h1 className="text-xl font-black text-gray-900 tracking-tight font-display">
                  Create Your Account
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  Register your vehicle to unlock compatible parts and doorstep service.
                </p>
              </div>

              <form onSubmit={handleSignUp} className="space-y-3 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Full Name <span className="text-[#E31E24]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      autoComplete="name"
                      value={signUpName}
                      onChange={(e) => setSignUpName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full h-11 rounded-xl border border-gray-300 px-3.5 pl-10 text-sm outline-none focus:border-[#E31E24] transition bg-white"
                      required
                    />
                    <User className="h-4 w-4 text-gray-400 absolute left-3.5 top-3.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Mobile Number <span className="text-[#E31E24]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="tel"
                      autoComplete="tel"
                      value={signUpPhone}
                      onChange={(e) => setSignUpPhone(e.target.value)}
                      placeholder="10-digit mobile number"
                      className="w-full h-11 rounded-xl border border-gray-300 px-3.5 pl-10 text-sm outline-none focus:border-[#E31E24] transition bg-white"
                      required
                    />
                    <Phone className="h-4 w-4 text-gray-400 absolute left-3.5 top-3.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Electric Vehicle <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <select
                      value={signUpBikeId}
                      onChange={(e) => setSignUpBikeId(e.target.value)}
                      className="w-full h-11 rounded-xl border border-gray-300 px-3.5 pl-10 text-sm outline-none focus:border-[#E31E24] transition bg-white text-gray-800 appearance-none cursor-pointer"
                    >
                      <option value="">Select your model (e.g. Ather, Ola...)</option>
                      {bikes.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.make} {b.model}
                        </option>
                      ))}
                      <option value="none">I don't own an EV yet</option>
                    </select>
                    <Bike className="h-4 w-4 text-gray-400 absolute left-3.5 top-3.5 pointer-events-none" />
                    <ChevronRight className="h-4 w-4 text-gray-400 absolute right-3.5 top-3.5 rotate-90 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Password <span className="text-[#E31E24]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showSignUpPassword ? "text" : "password"}
                      name="password"
                      autoComplete="new-password"
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      placeholder="Min. 4 characters"
                      className="w-full h-11 rounded-xl border border-gray-300 px-3.5 pl-10 pr-10 text-sm outline-none focus:border-[#E31E24] transition bg-white"
                      required
                    />
                    <Lock className="h-4 w-4 text-gray-400 absolute left-3.5 top-3.5" />
                    <button
                      type="button"
                      onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                      className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-700"
                    >
                      {showSignUpPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 rounded-xl bg-[#E31E24] hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-sm transition active:scale-98 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5 mt-2"
                >
                  {isLoading ? (
                    <span>Creating account...</span>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="pt-2 text-center text-xs text-gray-500">
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

        {/* Footer */}
        <div className="pt-6 border-t border-gray-100 flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>256-Bit SSL Encrypted · RiderzPro Mobility</span>
        </div>
      </div>
    </div>
  );
}
