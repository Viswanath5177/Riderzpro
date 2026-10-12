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
  Sparkles,
  ChevronRight,
  Wrench,
  Gauge,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import evShowcaseImg from "@/assets/ev-login-showcase.jpg";
import { Logo } from "@/components/site/bits";
import { useStore } from "@/lib/store";
import { bikes } from "@/lib/data";

export const Route = createFileRoute("/login")({
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
  const [authMode, setAuthMode] = useState<"phone" | "email">("phone");

  // Sign In state
  const [signInPhone, setSignInPhone] = useState("");
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Sign Up state
  const [signUpName, setSignUpName] = useState("");
  const [signUpPhone, setSignUpPhone] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpBikeId, setSignUpBikeId] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(true);

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
    setIsLoading(true);

    setTimeout(() => {
      // If user profile has no contact info yet, save current login credential
      if (authMode === "phone" && signInPhone.trim()) {
        if (!userProfile?.phone) {
          updateUserProfile({ phone: signInPhone.trim() });
        }
      } else if (authMode === "email" && signInEmail.trim()) {
        if (!userProfile?.email) {
          updateUserProfile({ email: signInEmail.trim() });
        }
      }

      signIn();
      setRole("customer");

      const welcomeName = userProfile?.name?.trim() ? userProfile.name.trim().split(" ")[0] : "Customer";
      toast.success(`Welcome back, ${welcomeName}!`, {
        description: "Successfully signed in to your customer dashboard.",
      });

      const target = getRedirectTarget();
      navigate({ to: target as any });
      setIsLoading(false);
    }, 400);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();

    if (!signUpName.trim()) {
      toast.error("Please enter your full name.");
      return;
    }
    if (!signUpPhone.trim()) {
      toast.error("Please enter a valid mobile number.");
      return;
    }
    if (!signUpPassword.trim() || signUpPassword.length < 4) {
      toast.error("Please enter a password of at least 4 characters.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // 1. Update user profile with real user details
      const primaryEmail = signUpEmail.trim() || `${signUpPhone.trim()}@riderzpro.in`;
      updateUserProfile({
        name: signUpName.trim(),
        phone: signUpPhone.trim(),
        email: primaryEmail,
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
            odoKm: 500,
          });
        }
      }

      // 3. Authenticate and set customer role
      signIn();
      setRole("customer");

      toast.success(`Account Created! Welcome to RiderzPro, ${signUpName.trim().split(" ")[0]}!`, {
        description: "Your EV profile and garage have been configured.",
      });

      const target = getRedirectTarget();
      navigate({ to: target as any });
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] antialiased flex flex-col lg:grid lg:grid-cols-2">
      {/* Mobile Hero Header (Visible on screens < lg) */}
      <div className="relative lg:hidden h-48 w-full overflow-hidden bg-[#0D0F12] text-white shrink-0">
        <img
          src={evShowcaseImg}
          alt="High-Performance Electric Motorcycle in High-Tech RiderzPro Showroom"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D10] via-[#0B0D10]/60 to-transparent" />
        <div className="relative z-10 h-full flex flex-col justify-between p-5">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-white flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#E31E24] animate-pulse" />
              EV Mobility Portal
            </span>
            <Link
              to="/"
              className="text-xs font-semibold text-gray-300 hover:text-white transition"
            >
              ← Store
            </Link>
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#E31E24]">
              RiderzPro Connected
            </span>
            <h2 className="text-xl font-black text-white leading-tight font-display">
              Every part for your EV. Zero guesswork.
            </h2>
          </div>
        </div>
      </div>

      {/* Left visual showcase (Desktop >= lg) */}
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-[#0D0F12] p-12 text-white">
        {/* Background EV superbike showroom visual */}
        <img
          src={evShowcaseImg}
          alt="High-Performance Electric Motorcycle in High-Tech RiderzPro Showroom"
          width={1280}
          height={896}
          className="absolute inset-0 h-full w-full object-cover object-center opacity-40 scale-102 transition-transform duration-700 ease-out"
        />
        {/* Ambient Dark Gradient & Red Hue Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D10] via-[#0B0D10]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0D10]/80 via-transparent to-transparent" />
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-72 w-72 rounded-full bg-red-600/15 blur-3xl pointer-events-none" />

        {/* Top Header Badge */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-xs font-medium text-gray-200">
            <span className="h-2 w-2 rounded-full bg-[#E31E24] animate-pulse" />
            <span className="font-semibold tracking-wide uppercase text-[11px] text-gray-300">
              Next-Gen EV Ecosystem
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <ShieldCheck className="h-4 w-4 text-[#E31E24]" />
            <span>OEM & Certified Spec</span>
          </div>
        </div>

        {/* Hero Copy & Core Benefits */}
        <div className="relative z-10 space-y-6 max-w-lg">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#E31E24] mb-2">
              <Zap className="h-3.5 w-3.5" />
              <span>Electric Vehicle Mobility Portal</span>
            </div>
            <h2 className="text-4xl font-black tracking-tight font-display text-white leading-[1.15]">
              Every part for your EV. Zero guesswork.
            </h2>
            <p className="mt-3 text-sm text-gray-300 leading-relaxed font-normal">
              Direct-fit lithium battery modules, smart fast chargers, performance accessories, and certified technician care engineered specifically for your EV.
            </p>
          </div>

          {/* Feature Highlights with Glassmorphic Cards */}
          <div className="grid gap-2.5 pt-2">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-xs text-gray-200">
              <div className="h-8 w-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0 text-[#E31E24]">
                <Bike className="h-4 w-4" />
              </div>
              <div>
                <span className="font-bold text-white block">Guaranteed Model Compatibility</span>
                <span className="text-gray-400 text-[11px]">Exact fitment for Ather, Ola, TVS, Revolt, Chetak & Hero</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-xs text-gray-200">
              <div className="h-8 w-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0 text-[#E31E24]">
                <Wrench className="h-4 w-4" />
              </div>
              <div>
                <span className="font-bold text-white block">Doorstep Certified EV Technicians</span>
                <span className="text-gray-400 text-[11px]">24-point battery health check, BMS diagnostics & brake service</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-xs text-gray-200">
              <div className="h-8 w-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0 text-[#E31E24]">
                <Gauge className="h-4 w-4" />
              </div>
              <div>
                <span className="font-bold text-white block">Hyperlocal Dispatch & Live GPS</span>
                <span className="text-gray-400 text-[11px]">Real-time telemetry and milestone courier tracking to your doorstep</span>
              </div>
            </div>
          </div>

          {/* Metric Badges */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs text-gray-400">
            <div>
              <span className="block text-base font-extrabold text-white">10,000+</span>
              <span className="text-[11px]">Compatible Parts</span>
            </div>
            <div className="h-6 w-px bg-white/15" />
            <div>
              <span className="block text-base font-extrabold text-white">100%</span>
              <span className="text-[11px]">Fitment Guarantee</span>
            </div>
            <div className="h-6 w-px bg-white/15" />
            <div>
              <span className="block text-base font-extrabold text-white">4.9 / 5</span>
              <span className="text-[11px]">Customer Rating</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Container */}
      <div className="flex flex-col justify-between p-6 sm:p-10 md:p-12 lg:p-14 bg-white max-w-xl mx-auto w-full flex-1">
        {/* Top Bar */}
        <div className="hidden lg:flex items-center justify-between pb-6 border-b border-gray-100">
          <Logo imgClassName="h-9" />
          <Link
            to="/"
            className="text-xs font-semibold text-gray-600 hover:text-[#E31E24] transition flex items-center gap-1"
          >
            ← Return to Store
          </Link>
        </div>

        {/* Center Auth Card */}
        <div className="my-auto py-4 sm:py-6">
          {/* Sign In vs Sign Up Tab Switcher */}
          <div className="flex p-1 rounded-2xl bg-gray-100 border border-gray-200/80 mb-6 text-xs font-bold">
            <button
              type="button"
              id="tab-signin-btn"
              onClick={() => setActiveTab("signin")}
              className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "signin"
                  ? "bg-white text-gray-900 shadow-xs font-extrabold border border-gray-200/60"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <User className="h-3.5 w-3.5 text-gray-500" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              id="tab-signup-btn"
              onClick={() => setActiveTab("signup")}
              className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "signup"
                  ? "bg-white text-gray-900 shadow-xs font-extrabold border border-gray-200/60"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-[#E31E24]" />
              <span>Create Account</span>
            </button>
          </div>

          {activeTab === "signin" ? (
            /* ================= SIGN IN TAB ================= */
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#E31E24] bg-red-50 border border-red-100 px-2.5 py-1 rounded-md">
                  Customer Portal
                </span>
                <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 font-display">
                  Welcome Back
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-gray-500">
                  Access your garage, order history, and compatible EV spares.
                </p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSignIn} className="space-y-4">
                {/* Phone vs Email sub-toggle */}
                <div className="flex p-0.5 rounded-lg bg-gray-50 border border-gray-200 text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => setAuthMode("phone")}
                    className={`flex-1 py-1.5 rounded-md transition ${
                      authMode === "phone"
                        ? "bg-white text-gray-900 shadow-2xs font-semibold"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    Mobile Number
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode("email")}
                    className={`flex-1 py-1.5 rounded-md transition ${
                      authMode === "email"
                        ? "bg-white text-gray-900 shadow-2xs font-semibold"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    Email Address
                  </button>
                </div>

                {authMode === "phone" ? (
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Registered Mobile Number
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        name="phone"
                        autoComplete="tel"
                        value={signInPhone}
                        onChange={(e) => setSignInPhone(e.target.value)}
                        placeholder="Enter 10-digit mobile number"
                        className="w-full h-11 rounded-xl border border-gray-300 px-3.5 pl-10 text-sm outline-none focus:border-[#E31E24] focus:ring-1 focus:ring-[#E31E24]/20 transition bg-white"
                        required
                      />
                      <Phone className="h-4 w-4 text-gray-400 absolute left-3.5 top-3.5" />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        autoComplete="email"
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        placeholder="e.g. name@example.com"
                        className="w-full h-11 rounded-xl border border-gray-300 px-3.5 pl-10 text-sm outline-none focus:border-[#E31E24] focus:ring-1 focus:ring-[#E31E24]/20 transition bg-white"
                        required
                      />
                      <Mail className="h-4 w-4 text-gray-400 absolute left-3.5 top-3.5" />
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        toast.info("Password Reset Link", {
                          description: "A recovery code has been sent to your registered contact.",
                        })
                      }
                      className="text-xs text-[#E31E24] hover:underline font-semibold cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showSignInPassword ? "text" : "password"}
                      name="password"
                      autoComplete="current-password"
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      placeholder="Enter your account password"
                      className="w-full h-11 rounded-xl border border-gray-300 px-3.5 pl-10 pr-10 text-sm outline-none focus:border-[#E31E24] focus:ring-1 focus:ring-[#E31E24]/20 transition bg-white"
                      required
                    />
                    <Lock className="h-4 w-4 text-gray-400 absolute left-3.5 top-3.5" />
                    <button
                      type="button"
                      onClick={() => setShowSignInPassword(!showSignInPassword)}
                      className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-700 cursor-pointer"
                    >
                      {showSignInPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-600">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded accent-[#E31E24] h-4 w-4 cursor-pointer"
                    />
                    <span>Remember this device for 30 days</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 rounded-xl bg-[#E31E24] text-white text-sm font-bold shadow-sm hover:bg-red-700 active:scale-[0.99] transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing in...
                    </span>
                  ) : (
                    <>
                      <span>Sign In to Dashboard</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Dedicated Sign Up Card For New Users Down Below */}
              <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 via-white to-red-50/20 p-5 shadow-2xs">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#E31E24]">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>New to RiderzPro?</span>
                    </div>
                    <h3 className="mt-1 text-sm font-bold text-gray-900">
                      Create your free customer account
                    </h3>
                    <p className="mt-0.5 text-xs text-gray-500 leading-relaxed">
                      Register your EV model, get 100% fitment spare recommendations, and book verified doorstep technicians.
                    </p>
                  </div>
                  <button
                    type="button"
                    id="new-user-signup-btn"
                    onClick={() => setActiveTab("signup")}
                    className="shrink-0 px-3.5 py-2 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-[#E31E24] transition shadow-xs cursor-pointer flex items-center gap-1 mt-1"
                  >
                    <span>Sign Up</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* ================= CREATE ACCOUNT (SIGN UP) TAB ================= */
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#E31E24] bg-red-50 border border-red-100 px-2.5 py-1 rounded-md">
                  New Customer Registration
                </span>
                <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 font-display">
                  Create Your Account
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-gray-500">
                  Set up your EV garage and unlock authentic spare parts with doorstep technician delivery.
                </p>
              </div>

              {/* Sign Up Form */}
              <form onSubmit={handleSignUp} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
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
                      className="w-full h-11 rounded-xl border border-gray-300 px-3.5 pl-10 text-sm outline-none focus:border-[#E31E24] focus:ring-1 focus:ring-[#E31E24]/20 transition bg-white"
                      required
                    />
                    <User className="h-4 w-4 text-gray-400 absolute left-3.5 top-3.5" />
                  </div>
                </div>

                {/* Phone & Email side-by-side or stacked */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Mobile Number <span className="text-[#E31E24]">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        name="tel"
                        autoComplete="tel"
                        value={signUpPhone}
                        onChange={(e) => setSignUpPhone(e.target.value)}
                        placeholder="10-digit number"
                        className="w-full h-11 rounded-xl border border-gray-300 px-3.5 pl-10 text-sm outline-none focus:border-[#E31E24] focus:ring-1 focus:ring-[#E31E24]/20 transition bg-white"
                        required
                      />
                      <Phone className="h-4 w-4 text-gray-400 absolute left-3.5 top-3.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Email Address <span className="text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        autoComplete="email"
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full h-11 rounded-xl border border-gray-300 px-3.5 pl-10 text-sm outline-none focus:border-[#E31E24] focus:ring-1 focus:ring-[#E31E24]/20 transition bg-white"
                      />
                      <Mail className="h-4 w-4 text-gray-400 absolute left-3.5 top-3.5" />
                    </div>
                  </div>
                </div>

                {/* Electric Vehicle Selection */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Your Electric Vehicle <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <select
                      value={signUpBikeId}
                      onChange={(e) => setSignUpBikeId(e.target.value)}
                      className="w-full h-11 rounded-xl border border-gray-300 px-3.5 pl-10 text-sm outline-none focus:border-[#E31E24] focus:ring-1 focus:ring-[#E31E24]/20 transition bg-white text-gray-800 appearance-none cursor-pointer"
                    >
                      <option value="">Select your EV model (e.g. Ather, Ola, TVS...)</option>
                      {bikes.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.make} {b.model} ({b.voltage}V)
                        </option>
                      ))}
                      <option value="none">I don't own an EV yet / Add later</option>
                    </select>
                    <Bike className="h-4 w-4 text-gray-400 absolute left-3.5 top-3.5 pointer-events-none" />
                    <ChevronRight className="h-4 w-4 text-gray-400 absolute right-3.5 top-3.5 rotate-90 pointer-events-none" />
                  </div>
                  <p className="mt-1 text-[11px] text-gray-500">
                    Selecting your model automatically sets up vehicle compatibility in your garage.
                  </p>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Set Account Password <span className="text-[#E31E24]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showSignUpPassword ? "text" : "password"}
                      name="password"
                      autoComplete="new-password"
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      placeholder="Minimum 4 characters"
                      className="w-full h-11 rounded-xl border border-gray-300 px-3.5 pl-10 pr-10 text-sm outline-none focus:border-[#E31E24] focus:ring-1 focus:ring-[#E31E24]/20 transition bg-white"
                      required
                    />
                    <Lock className="h-4 w-4 text-gray-400 absolute left-3.5 top-3.5" />
                    <button
                      type="button"
                      onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                      className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-700 cursor-pointer"
                    >
                      {showSignUpPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Terms agreement */}
                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="terms-check"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-0.5 rounded accent-[#E31E24] h-4 w-4 cursor-pointer"
                    required
                  />
                  <label htmlFor="terms-check" className="text-xs text-gray-600 leading-normal cursor-pointer">
                    I agree to the RiderzPro <span className="font-semibold text-gray-900">Terms of Service</span> and acknowledge the vehicle parts compatibility policy.
                  </label>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 rounded-xl bg-[#E31E24] text-white text-sm font-bold shadow-sm hover:bg-red-700 active:scale-[0.99] transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating Account...
                    </span>
                  ) : (
                    <>
                      <span>Complete Registration & Enter</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Already have an account toggle */}
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-center text-xs text-gray-600">
                Already registered with RiderzPro?{" "}
                <button
                  type="button"
                  onClick={() => setActiveTab("signin")}
                  className="font-bold text-[#E31E24] hover:underline cursor-pointer"
                >
                  Sign In to your existing account
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <div className="flex items-center gap-1.5 text-gray-400">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>256-Bit SSL Encrypted Customer Portal</span>
          </div>

          <div className="flex items-center gap-4 text-gray-400">
            <span>Verified EV Parts</span>
            <span>•</span>
            <span>Doorstep Service</span>
          </div>
        </div>
      </div>
    </div>
  );
}
