import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  Zap,
  Award,
  Clock,
  RefreshCw,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";
import evShowcaseImg from "@/assets/ev-login-showcase.jpg";
import { Logo } from "@/components/site/bits";

export const Route = createFileRoute("/vendor/login")({
  head: () => ({
    meta: [
      { title: "Vendor Sign In — RiderzPro" },
      {
        name: "description",
        content: "Sign in to manage your store, inventory, and marketplace activities on RiderzPro.",
      },
      { property: "og:title", content: "Vendor Sign In — RiderzPro" },
      { property: "og:description", content: "Vendor portal for automotive accessories and spares." },
    ],
  }),
  component: VendorLoginRouteComponent,
});

function VendorLoginRouteComponent() {
  const navigate = useNavigate();

  // Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setErrorMessage("Please enter a valid registered email address.");
      return;
    }

    if (!password) {
      setErrorMessage("Please enter your account password.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: cleanEmail,
          password,
          authType: "password",
          portal: "vendor",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Authentication failed. Please verify your credentials.");
      }

      // Store authenticated user in localStorage
      const userObj = data.user;
      const sessionUser = {
        id: userObj.id,
        name: userObj.fullName || userObj.storeName || "Partner",
        email: userObj.email,
        role: data.role,
      };

      localStorage.setItem("riderzpro_auth_user", JSON.stringify(sessionUser));
      localStorage.setItem("riderzpro_auth_token", "session_active");
      localStorage.setItem("riderzpro_token", "session_active");

      // If administrator, store admin session
      if (data.role && data.role !== "customer" && data.role !== "seller") {
        const adminSession = {
          token: "session_active",
          role: "admin",
          user: {
            id: userObj.id,
            name: userObj.fullName || userObj.storeName || "Administrator",
            email: userObj.email,
            role: "admin",
            roleTitle:
              data.role === "SUPER_ADMIN"
                ? "Super Administrator"
                : "Operations Administrator",
            department:
              data.role === "SUPER_ADMIN"
                ? "Executive Platform Oversight"
                : "Seller Compliance & Product Catalog Moderation",
          },
          loginTime: Date.now(),
        };
        localStorage.setItem("riderzpro_admin_session", JSON.stringify(adminSession));
      } else {
        localStorage.removeItem("riderzpro_admin_session");
      }

      try {
        const rawStore = localStorage.getItem("riderzpro-v7");
        if (rawStore) {
          const parsed = JSON.parse(rawStore);
          parsed.role = data.role === "seller" ? "seller" : "admin";
          localStorage.setItem("riderzpro-v7", JSON.stringify(parsed));
        }
      } catch {}

      toast.success(`Welcome back, ${sessionUser.name}!`);

      // Determine authoritative destination based on query param or backend response
      const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
      const queryRedirect = searchParams?.get("redirect");

      const destination = (queryRedirect && !queryRedirect.includes("/vendor/login")) 
        ? queryRedirect 
        : (data.redirectUrl || (
            data.role === "SUPER_ADMIN" ? "/superadmin" :
            data.role === "ADMIN" ? "/admin" :
            data.role === "seller" ? "/dashboard/vendor" :
            "/dashboard/vendor"
          ));

      navigate({ to: destination as any }).catch(() => {
        window.location.href = destination;
      });
      setTimeout(() => {
        if (window.location.pathname !== destination.split("?")[0]) {
          window.location.href = destination;
        }
      }, 250);
    } catch (err: any) {
      setErrorMessage(err?.message || "Login failed. Please check credentials.");
      toast.error(err?.message || "Login failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    toast.info("Password Reset Assistance", {
      description: "Please contact Seller Support at seller-support@riderzpro.com with your registered store details.",
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans text-[#111111]">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30">
        <Link to="/" className="flex items-center gap-2.5">
          <Logo className="flex items-center" imgClassName="h-9 sm:h-10 w-auto" />
        </Link>
        <div className="flex items-center gap-3">
          <Link
            to="/vendor/sign-up"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-gray-300 bg-white text-xs font-semibold text-gray-700 hover:text-black transition"
          >
            <span>Become a Vendor</span>
          </Link>
          <Link
            to="/"
            className="text-xs font-medium text-gray-500 hover:text-gray-900 transition flex items-center gap-1"
          >
            <span>Back to Store</span>
          </Link>
        </div>
      </header>

      {/* Main Split-Screen Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-5xl bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
          {/* Left Column: Visual Branding Panel */}
          <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-[#12141A] to-[#1A1D24] p-8 sm:p-10 flex-col justify-between text-white relative overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-luminosity"
              style={{ backgroundImage: `url(${evShowcaseImg})` }}
            />
            <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#E31E24]/20 blur-3xl pointer-events-none" />

            {/* Headline section */}
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-semibold mb-6 border border-white/10">
                <ShieldCheck className="h-3.5 w-3.5 text-[#E31E24]" />
                <span>Verified EV Marketplace</span>
              </div>
              <h2 className="text-3xl font-black tracking-tight leading-tight mb-3">
                Batteries & Spares <br />
                <span className="text-[#E31E24]">Guaranteed to Fit.</span>
              </h2>
              <p className="text-xs text-gray-300 leading-relaxed max-w-xs">
                Log in to manage your store catalog, fulfill multi-seller orders, track logistics coordination, and review weekly bank settlements.
              </p>
            </div>

            {/* Trust card at bottom */}
            <div className="relative z-10 pt-6">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[#E31E24] text-xs font-bold">
                    <Zap className="h-4 w-4" /> 100% Fitment Guarantee
                  </div>
                  <p className="text-[11px] text-gray-300 leading-relaxed">
                    Every component is verified against battery chemistry, BMS specs, and OEM bike dimensions.
                  </p>
                </div>
              </div>

              {/* Indicator Dots */}
              <div className="flex gap-1.5 mt-3 justify-center">
                <span className="h-1.5 w-6 rounded-full bg-[#E31E24]" />
                <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
                <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
              </div>
            </div>
          </div>

          {/* Right Column: Login Form */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
            <div className="max-w-md w-full mx-auto">
              <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#111111]">
                  Welcome to RiderzPro
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Sign in to manage your store and marketplace activities.
                </p>
              </div>

              {/* Error feedback banner */}
              {errorMessage && (
                <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2.5 animate-in fade-in duration-150">
                  <AlertCircle className="h-4.5 w-4.5 shrink-0 text-red-600 mt-0.5" />
                  <div className="flex-1 space-y-1">
                    <p className="font-semibold">{errorMessage}</p>
                    {(errorMessage.toLowerCase().includes("vendor account") || errorMessage.toLowerCase().includes("create a vendor")) && (
                      <div className="pt-0.5">
                        <Link
                          to="/vendor/sign-up"
                          className="inline-flex items-center gap-1 font-bold text-[#E31E24] hover:underline"
                        >
                          Create a Vendor Account →
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <form onSubmit={handleSignIn} className="space-y-4">
                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                    <input
                      type="email"
                      required
                      autoFocus
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errorMessage) setErrorMessage(null);
                      }}
                      placeholder="name@example.com"
                      className="w-full rounded-xl border border-gray-300 bg-white py-3 px-4 pl-10 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#E31E24] focus:ring-2 focus:ring-[#E31E24]/10 outline-none transition"
                    />
                  </div>
                </div>

                {/* Password with Show/Hide & Forgot Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-xs text-gray-500 hover:text-[#E31E24] transition cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errorMessage) setErrorMessage(null);
                      }}
                      placeholder="••••••••••••"
                      className="w-full rounded-xl border border-gray-300 bg-white py-3 px-4 pl-10 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#E31E24] focus:ring-2 focus:ring-[#E31E24]/10 outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-700 transition cursor-pointer"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !email.trim() || !password}
                  className="w-full rounded-xl bg-[#E31E24] hover:bg-[#c9181e] active:scale-[0.99] text-white py-3.5 px-4 font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-[#E31E24]/20 transition disabled:opacity-50 cursor-pointer mt-2"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Bottom Registration Link */}
              <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span>Are you an EV parts seller?</span>
                <Link
                  to="/vendor/sign-up"
                  className="text-[#E31E24] font-bold hover:underline flex items-center gap-1"
                >
                  <span>Register as Vendor</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
