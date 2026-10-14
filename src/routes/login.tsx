import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  Zap,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowLeft,
  KeyRound,
  RefreshCw,
  AlertCircle,
  HelpCircle,
  Star,
  Award,
  Shield,
  Clock,
  Wrench,
  Store,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import evShowcaseImg from "@/assets/ev-login-showcase.jpg";
import { Logo } from "@/components/site/bits";
import { useStore } from "@/lib/store";
import { sendEmailOtp, getCurrentRole, useAuth } from "@/lib/auth";

export type LoginSearch = {
  redirect?: string;
  email?: string;
};

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): LoginSearch => {
    return {
      redirect: typeof search["redirect"] === "string" ? search["redirect"] : undefined,
      email: typeof search["email"] === "string" ? search["email"] : undefined,
    };
  },
  beforeLoad: async ({ search }) => {
    try {
      const role = await getCurrentRole();
      if (!role) return;
      if (role === "PRODUCT_ADMIN") throw redirect({ to: "/admin/products" });
      if (role === "SELLER_ADMIN") throw redirect({ to: "/admin/sellers" });
      if (role === "seller") throw redirect({ to: "/dashboard/vendor" });
      if (role === "admin") throw redirect({ to: "/admin" });
      if (role === "customer") {
        const target = (search as any)?.redirect;
        if (target && target !== "/login") {
          throw redirect({ to: target });
        }
      }
    } catch (e) {
      if ((e as any)?.to) throw e;
    }
  },
  head: () => ({
    meta: [
      { title: "Sign In & Register — RiderzPro" },
      {
        name: "description",
        content: "Sign in or create your customer account to access exact-fit EV parts, order tracking, and doorstep certified service.",
      },
      { property: "og:title", content: "Customer Sign In & Registration — RiderzPro" },
      { property: "og:description", content: "Email-only quick sign in and account activation." },
    ],
  }),
  component: () => <CustomerLogin />,
});

export function CustomerLogin({ defaultTab }: { defaultTab?: string } = {}) {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const { setRole, signIn: storeSignIn } = useStore();
  const { setUser: setAuthUser } = useAuth();

  // Workflow Step: "enter_email" | "existing_choice" | "existing_password" | "existing_otp" | "new_user_otp"
  const [step, setStep] = useState<"enter_email" | "existing_choice" | "existing_password" | "existing_otp" | "new_user_otp">("enter_email");

  // Form States
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Carousel Slide for Left Showcase
  const [activeSlide, setActiveSlide] = useState(0);

  // Rotating slide timer
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 3);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  // OTP Countdown timer
  useEffect(() => {
    let interval: any = null;
    if (otpCountdown > 0) {
      interval = setInterval(() => setOtpCountdown((c) => Math.max(0, c - 1)), 1000);
    }
    return () => clearInterval(interval);
  }, [otpCountdown]);

  // Read URL email if provided
  useEffect(() => {
    if (search.email) {
      setEmail(search.email);
    }
  }, [search.email]);

  const redirectTarget = search.redirect && search.redirect.startsWith("/") ? search.redirect : "/dashboard/customer";

  // Step 1: Check Email
  const handleCheckEmail = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@") || !cleanEmail.includes(".")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to check email.");

      setIsRegistered(data.isRegistered);
      if (data.fullName) setFullName(data.fullName);

      if (data.isRegistered) {
        // User exists -> offer options
        setStep("existing_choice");
      } else {
        // New user -> initiate OTP verification immediately
        setStep("new_user_otp");
        await triggerSendOtp(cleanEmail, "CUSTOMER_SIGNUP");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to check email.");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to send OTP
  const triggerSendOtp = async (targetEmail: string, purpose: "CUSTOMER_SIGNUP" | "CUSTOMER_SIGNIN" | "RESET_PASSWORD") => {
    setIsSendingOtp(true);
    try {
      await sendEmailOtp(targetEmail, purpose);
      setOtpCountdown(60);
      toast.success(`6-digit verification code sent to ${targetEmail}`);
    } catch (err: any) {
      toast.error(err?.message || "Failed to send verification code.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Login via Password
  const handlePasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      toast.error("Please enter your password.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
          authType: "password",
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Incorrect password.");
      }

      completeSession(data);
    } catch (err: any) {
      toast.error(err?.message || "Sign in failed.");
    } finally {
      setIsLoading(false);
    }
  };

  // Login via Email OTP
  const handleOtpSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length !== 6) {
      toast.error("Please enter the 6-digit code received in your email.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          code: otpCode.trim(),
          authType: "otp",
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Invalid verification code.");
      }

      completeSession(data);
    } catch (err: any) {
      toast.error(err?.message || "OTP sign in failed.");
    } finally {
      setIsLoading(false);
    }
  };

  // New Customer Signup via OTP
  const handleNewCustomerSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length !== 6) {
      toast.error("Please enter the 6-digit code sent to your email.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otpCode: otpCode.trim(),
          password: password || undefined,
          fullName: fullName.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create account.");
      }

      toast.success("Account created successfully! Welcome to Riderzpro.");
      completeSession(data);
    } catch (err: any) {
      toast.error(err?.message || "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  // Common Session Completion
  const completeSession = (data: any) => {
    const userObj = data.user || data.customer;
    const sessionUser = {
      id: userObj.id,
      name: userObj.fullName || userObj.email.split("@")[0],
      email: userObj.email,
      phone: userObj.phone || "",
      role: (data.role || "customer") as any,
    };

    localStorage.setItem("riderzpro_auth_user", JSON.stringify(sessionUser));
    localStorage.setItem("riderzpro_token", "session_active");
    setAuthUser(sessionUser);
    setRole("customer");

    toast.success(`Signed in as ${sessionUser.name}!`);

    // Redirect to requested page (e.g. checkout /cart) or customer dashboard
    setTimeout(() => {
      window.location.href = redirectTarget;
    }, 300);
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
            to="/vendor/login"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-gray-300 bg-white text-xs font-semibold text-gray-700 hover:text-black transition"
          >
            <Store className="h-3.5 w-3.5 text-[#E31E24]" />
            <span>Vendor Portal</span>
          </Link>
          <Link
            to="/"
            className="text-xs font-medium text-gray-500 hover:text-gray-900 transition flex items-center gap-1"
          >
            <span>Back to Store</span>
          </Link>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-5xl bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
          {/* Left Column: Brand Showcase */}
          <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-[#12141A] to-[#1A1D24] p-8 sm:p-10 flex-col justify-between text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-luminosity" style={{ backgroundImage: `url(${evShowcaseImg})` }} />
            <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#E31E24]/20 blur-3xl pointer-events-none" />

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
                Log in to order verified components, unlock door-step battery swaps, and manage your vehicle garage.
              </p>
            </div>

            {/* Rotating Trust Slides */}
            <div className="relative z-10 pt-6">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                {activeSlide === 0 && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[#E31E24] text-xs font-bold">
                      <Zap className="h-4 w-4" /> 100% Fitment Guarantee
                    </div>
                    <p className="text-[11px] text-gray-300">
                      Every component is verified against battery chemistry, BMS specs, and OEM bike dimensions.
                    </p>
                  </div>
                )}
                {activeSlide === 1 && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                      <Award className="h-4 w-4" /> Manufacturer Warranty
                    </div>
                    <p className="text-[11px] text-gray-300">
                      Up to 3-year official warranty with free doorstep diagnostics and instant replacement.
                    </p>
                  </div>
                )}
                {activeSlide === 2 && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-blue-400 text-xs font-bold">
                      <Clock className="h-4 w-4" /> Lightning Doorstep Delivery
                    </div>
                    <p className="text-[11px] text-gray-300">
                      Track your delivery rider live in real-time right to your home or office parking.
                    </p>
                  </div>
                )}
              </div>
              <div className="flex gap-1.5 mt-3 justify-center">
                {[0, 1, 2].map((i) => (
                  <button
                    key={i}
                    onClick={() => setActiveSlide(i)}
                    className={`h-1.5 rounded-full transition-all ${activeSlide === i ? "w-6 bg-[#E31E24]" : "w-1.5 bg-white/30"}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Customer Auth Interface */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
            <div className="max-w-md w-full mx-auto">
              {/* Back button if past step 1 */}
              {step !== "enter_email" && (
                <button
                  type="button"
                  onClick={() => setStep("enter_email")}
                  className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-black font-semibold mb-4 transition cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Change email address</span>
                </button>
              )}

              {/* STAGE 1: ENTER EMAIL */}
              {step === "enter_email" && (
                <div>
                  <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#111111]">
                      Welcome to RiderzPro
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                      Enter your email to sign in or create your customer account.
                    </p>
                  </div>

                  <form onSubmit={handleCheckEmail} className="space-y-4">
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
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full rounded-xl border border-gray-300 px-4 py-3 pl-10 text-sm text-[#111111] placeholder-gray-400 focus:outline-none focus:border-[#E31E24] focus:ring-2 focus:ring-[#E31E24]/10 transition"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading || !email}
                      className="w-full rounded-xl bg-[#E31E24] hover:bg-[#c9181e] active:scale-[0.99] text-white py-3.5 px-4 font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-[#E31E24]/20 transition disabled:opacity-50 cursor-pointer"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          <span>Checking Email...</span>
                        </>
                      ) : (
                        <>
                          <span>Continue</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </form>

                  <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <span>Are you an EV parts seller?</span>
                    <Link to="/vendor/login" className="text-[#E31E24] font-bold hover:underline flex items-center gap-1">
                      <span>Vendor Sign In</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              )}

              {/* STAGE 2A: EXISTING USER — CHOOSE METHOD */}
              {step === "existing_choice" && (
                <div className="space-y-5">
                  <div>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 mb-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Account Found
                    </span>
                    <h2 className="text-2xl font-black text-[#111111]">
                      Welcome back{fullName ? `, ${fullName}` : ""}!
                    </h2>
                    <p className="text-xs text-gray-500 mt-1 font-mono">{email}</p>
                  </div>

                  <p className="text-xs font-medium text-gray-600">
                    Choose how you would like to sign in:
                  </p>

                  <div className="grid grid-cols-1 gap-3">
                    <button
                      type="button"
                      onClick={async () => {
                        setStep("existing_otp");
                        await triggerSendOtp(email.trim().toLowerCase(), "CUSTOMER_SIGNIN");
                      }}
                      className="p-4 rounded-2xl border-2 border-gray-200 hover:border-[#E31E24] bg-white hover:bg-red-50/20 text-left transition flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-red-100 text-[#E31E24] flex items-center justify-center font-bold">
                          <Mail className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-[#111111]">Continue with Email OTP</h4>
                          <p className="text-xs text-gray-500">We'll send a 6-digit one-time code to your email</p>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-[#E31E24] transition-transform group-hover:translate-x-1" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setStep("existing_password")}
                      className="p-4 rounded-2xl border-2 border-gray-200 hover:border-[#E31E24] bg-white hover:bg-red-50/20 text-left transition flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center font-bold">
                          <Lock className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-[#111111]">Continue with Password</h4>
                          <p className="text-xs text-gray-500">Sign in with your established account password</p>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-[#E31E24] transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              )}

              {/* STAGE 2B: EXISTING USER — PASSWORD */}
              {step === "existing_password" && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-2xl font-black text-[#111111]">Sign In with Password</h2>
                    <p className="text-xs text-gray-500 mt-1 font-mono">{email}</p>
                  </div>

                  <form onSubmit={handlePasswordSignIn} className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Account Password
                        </label>
                        <button
                          type="button"
                          onClick={async () => {
                            setStep("existing_otp");
                            await triggerSendOtp(email.trim().toLowerCase(), "CUSTOMER_SIGNUP");
                          }}
                          className="text-xs text-[#E31E24] hover:underline font-semibold"
                        >
                          Use Email OTP instead
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          autoFocus
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          className="w-full rounded-xl border border-gray-300 px-4 py-3 pl-10 pr-10 text-sm text-[#111111] focus:outline-none focus:border-[#E31E24] focus:ring-2 focus:ring-[#E31E24]/10 transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-700"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading || !password}
                      className="w-full rounded-xl bg-[#E31E24] hover:bg-[#c9181e] text-white py-3.5 px-4 font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-[#E31E24]/20 transition disabled:opacity-50 cursor-pointer"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          <span>Signing In...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign In</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}

              {/* STAGE 2C: EXISTING USER — OTP */}
              {step === "existing_otp" && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-2xl font-black text-[#111111]">Verify Email OTP</h2>
                    <p className="text-xs text-gray-500 mt-1">
                      Enter the 6-digit verification code sent to <span className="font-mono font-bold text-black">{email}</span>
                    </p>
                  </div>

                  <form onSubmit={handleOtpSignIn} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        6-Digit Verification Code
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        autoFocus
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                        placeholder="• • • • • •"
                        className="w-full text-center tracking-[0.5em] font-mono text-2xl font-bold rounded-xl border border-gray-300 py-3 text-[#111111] focus:outline-none focus:border-[#E31E24] focus:ring-2 focus:ring-[#E31E24]/10 transition"
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Didn't receive code?</span>
                      <button
                        type="button"
                        disabled={isSendingOtp || otpCountdown > 0}
                        onClick={() => triggerSendOtp(email.trim().toLowerCase(), "CUSTOMER_SIGNUP")}
                        className="text-[#E31E24] font-bold hover:underline disabled:opacity-50 cursor-pointer"
                      >
                        {isSendingOtp ? "Sending..." : otpCountdown > 0 ? `Resend code in ${otpCountdown}s` : "Resend code"}
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading || otpCode.length !== 6}
                      className="w-full rounded-xl bg-[#E31E24] hover:bg-[#c9181e] text-white py-3.5 px-4 font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-[#E31E24]/20 transition disabled:opacity-50 cursor-pointer"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          <span>Verifying OTP...</span>
                        </>
                      ) : (
                        <>
                          <span>Verify & Sign In</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>

                    <div className="pt-2 text-center">
                      <button
                        type="button"
                        onClick={() => setStep("existing_password")}
                        className="text-xs text-gray-600 hover:text-black font-semibold underline cursor-pointer"
                      >
                        Sign in using password instead
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* STAGE 3: NEW CUSTOMER REGISTRATION */}
              {step === "new_user_otp" && (
                <div>
                  <div className="mb-5">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#E31E24] mb-1">
                      <Sparkles className="h-3.5 w-3.5" /> New Customer
                    </span>
                    <h2 className="text-2xl font-black text-[#111111]">Verify & Activate Account</h2>
                    <p className="text-xs text-gray-500 mt-1">
                      We've dispatched a 6-digit activation code to <span className="font-mono font-bold text-black">{email}</span>. No long registration forms required!
                    </p>
                  </div>

                  <form onSubmit={handleNewCustomerSignup} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        6-Digit Verification Code
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        autoFocus
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                        placeholder="• • • • • •"
                        className="w-full text-center tracking-[0.5em] font-mono text-2xl font-bold rounded-xl border border-gray-300 py-3 text-[#111111] focus:outline-none focus:border-[#E31E24] focus:ring-2 focus:ring-[#E31E24]/10 transition"
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Didn't receive code?</span>
                      <button
                        type="button"
                        disabled={isSendingOtp || otpCountdown > 0}
                        onClick={() => triggerSendOtp(email.trim().toLowerCase(), "CUSTOMER_SIGNUP")}
                        className="text-[#E31E24] font-bold hover:underline disabled:opacity-50 cursor-pointer"
                      >
                        {isSendingOtp ? "Sending..." : otpCountdown > 0 ? `Resend in ${otpCountdown}s` : "Resend code"}
                      </button>
                    </div>

                    {/* Optional Password creation for future fast password logins */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Optional: Set account password for future logins
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Create password (optional)"
                          className="w-full rounded-xl border border-gray-300 px-4 py-2.5 pl-10 pr-10 text-xs text-[#111111] focus:outline-none focus:border-[#E31E24]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-700"
                        >
                          {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading || otpCode.length !== 6}
                      className="w-full rounded-xl bg-[#E31E24] hover:bg-[#c9181e] text-white py-3.5 px-4 font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-[#E31E24]/20 transition disabled:opacity-50 cursor-pointer"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          <span>Activating Account...</span>
                        </>
                      ) : (
                        <>
                          <span>Activate & Continue</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>

                    <p className="text-[11px] text-gray-400 text-center leading-relaxed">
                      By proceeding, you agree to Riderzpro's Terms of Service and Privacy Policy.
                    </p>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
