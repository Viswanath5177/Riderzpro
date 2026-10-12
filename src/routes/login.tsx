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
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import riderImg from "@/assets/rider.jpg";
import { Logo } from "@/components/site/bits";
import { useStore } from "@/lib/store";

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
  const { userProfile, setRole } = useStore();

  const [authMode, setAuthMode] = useState<"phone" | "email">("phone");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [email, setEmail] = useState("aakash.sharma@example.com");
  const [password, setPassword] = useState("••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setRole("customer");
      toast.success(`Welcome back, ${userProfile.name.split(" ")[0]}!`, {
        description: "Successfully signed in to your customer dashboard.",
      });
      navigate({ to: "/dashboard/customer" });
    }, 450);
  };

  const handleQuickDemoSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      setRole("customer");
      toast.success(`Welcome back, ${userProfile.name.split(" ")[0]}!`, {
        description: "One-click demo sign-in to customer dashboard.",
      });
      navigate({ to: "/dashboard/customer" });
    }, 300);
  };

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
              Enter your credentials to access your garage, track orders, and view compatible spares.
            </p>
          </div>

          {/* Quick Demo Sign-in Button */}
          <button
            type="button"
            onClick={handleQuickDemoSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-between p-3.5 rounded-xl border border-red-200 bg-red-50/60 hover:bg-red-100/70 text-gray-900 transition shadow-2xs group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#E31E24] text-white font-bold text-xs shadow-xs">
                AS
              </span>
              <div className="text-left">
                <p className="text-xs font-bold text-gray-900">
                  Quick Demo: Sign In as Aakash Sharma
                </p>
                <p className="text-[11px] text-[#6B7280]">
                  Ola S1 Pro Owner · 1 Active Vehicle
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-[#E31E24] flex items-center gap-1 group-hover:translate-x-1 transition">
              <span>Sign In</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </button>

          <div className="relative flex items-center justify-center">
            <span className="absolute inset-x-0 h-px bg-gray-200" />
            <span className="relative bg-white px-3 text-xs font-medium text-gray-400 uppercase">
              Or sign in with mobile / email
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSignIn} className="space-y-4">
            {/* Phone vs Email Toggle */}
            <div className="flex p-1 rounded-xl bg-gray-100 border border-gray-200 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setAuthMode("phone")}
                className={`flex-1 py-1.5 rounded-lg transition ${
                  authMode === "phone" ? "bg-white text-gray-900 shadow-2xs font-bold" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Mobile Number
              </button>
              <button
                type="button"
                onClick={() => setAuthMode("email")}
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
                    placeholder="+91 98765 43210"
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
                    placeholder="aakash.sharma@example.com"
                    className="w-full h-11 rounded-2xl border border-gray-300 px-3.5 pl-10 text-sm outline-none focus:border-primary transition"
                    required
                  />
                  <Mail className="h-4 w-4 text-gray-400 absolute left-3.5 top-3.5" />
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => toast.info("Demo reset link sent to registered contact.")}
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full h-11 rounded-2xl border border-gray-300 px-3.5 pl-10 pr-10 text-sm outline-none focus:border-primary transition"
                  required
                />
                <Lock className="h-4 w-4 text-gray-400 absolute left-3.5 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-600">
                <input type="checkbox" defaultChecked className="rounded accent-[#E31E24]" />
                <span>Keep me signed in on this device</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-xl bg-[#E31E24] text-white text-xs sm:text-sm font-bold shadow-xs hover:bg-red-700 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In to Customer Dashboard</span>
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
