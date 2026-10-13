import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Sparkles,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  CheckCircle2,
  Lock,
  Mail,
  Phone,
  Store,
  ShieldCheck,
  Building2,
  RefreshCw,
  KeyRound,
} from "lucide-react";
import { toast } from "sonner";
import partsImg from "@/assets/parts.jpg";
import { Logo } from "@/components/site/bits";
import { useVendorAuth } from "@/lib/vendorAuth";
import { otpAdapter, DEMO_OTP } from "@/lib/vendor/adapters/otp";
import type { VendorBusinessType } from "@/lib/vendor/types";
import { validateMobile } from "@/lib/vendor/validators";

interface VendorAuthPageProps {
  initialMode?: "signin" | "signup";
  redirectPath?: string;
}

export function VendorAuthPage({ initialMode = "signin", redirectPath }: VendorAuthPageProps) {
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const { vendor, isAuthenticated, loading } = useVendorAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  // If already authenticated, route by vendor state
  useEffect(() => {
    if (!loading && isAuthenticated && vendor) {
      if (vendor.status === "approved") {
        navigate({ to: redirectPath || "/vendor/dashboard" });
      } else if (vendor.status === "draft" && vendor.onboarding.currentStep < 6) {
        navigate({ to: "/vendor/onboarding" });
      } else {
        navigate({ to: "/vendor/pending" });
      }
    }
  }, [loading, isAuthenticated, vendor, navigate, redirectPath]);

  return (
    <div className="grid min-h-screen lg:grid-cols-2 bg-background font-sans">
      {/* Left Column: Vendor Hero image with dark gradient (hidden on mobile <=768px) */}
      <div className="relative hidden lg:block overflow-hidden bg-zinc-950">
        <img
          src={partsImg}
          alt="Riderzpro EV Spares & Warehouse"
          width={1280}
          height={896}
          className="absolute inset-0 h-full w-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/30" />

        <div className="absolute top-10 left-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-md border border-white/20">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Verified EV Merchant Network
          </span>
        </div>

        <div className="absolute bottom-12 left-12 right-12">
          <div className="inline-flex items-center gap-2 rounded-lg bg-red-600/90 text-white text-xs font-bold px-2.5 py-1 mb-3">
            <Store className="h-3.5 w-3.5" />
            Merchant Portal
          </div>
          <p className="font-display text-4xl xl:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
            Sell EV parts to riders<br />across your city.
          </p>
          <p className="mt-4 max-w-md text-sm text-zinc-300 leading-relaxed font-normal">
            Direct access to verified EV riders, chassis-fitment matching, automated hyperlocal rider pickups, and guaranteed T+7 direct bank settlements.
          </p>
        </div>
      </div>

      {/* Right Column: Form Container */}
      <div className="flex flex-col min-h-screen p-5 sm:p-8 md:p-12 lg:p-14 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Logo />
          <Link
            to="/"
            className="flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-3.5 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition"
          >
            <span>← Customer Store</span>
          </Link>
        </div>

        {/* Center Container */}
        <div className="my-auto py-8 sm:py-12 mx-auto w-full max-w-md">
          {/* Segmented Role Switcher: Customer | Vendor */}
          <div className="mb-5 flex items-center justify-center p-1 rounded-2xl bg-muted border border-border">
            <Link
              to="/auth"
              className="flex-1 text-center rounded-xl py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition"
            >
              Customer
            </Link>
            <button
              type="button"
              className="flex-1 rounded-xl py-2 text-xs font-bold transition bg-white text-primary shadow-xs cursor-default"
            >
              Vendor
            </button>
          </div>

          {mode === "signin" ? (
            <VendorSignInForm onSwitchToSignUp={() => setMode("signup")} />
          ) : (
            <VendorSignUpForm onSwitchToSignIn={() => setMode("signin")} />
          )}
        </div>

        {/* Footer info */}
        <div className="mt-auto pt-6 text-center text-xs text-muted-foreground border-t border-border/40">
          <p>© 2026 Riderzpro · Secure Vendor Onboarding & Merchant Portal</p>
        </div>
      </div>
    </div>
  );
}

// ===========================================================================
// VENDOR SIGN IN FORM
// ===========================================================================
function VendorSignInForm({ onSwitchToSignUp }: { onSwitchToSignUp: () => void }) {
  const { signInWithPassword, signInWithOtp, resetPasswordWithOtp } = useVendorAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState<"password" | "otp">("password");
  const [identifier, setIdentifier] = useState("9000000001");
  const [password, setPassword] = useState("Vendor@123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // OTP Login State
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpCountdown, setOtpCountdown] = useState(0);

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotTarget, setForgotTarget] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [forgotStep, setForgotStep] = useState<"send" | "verify">("send");

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Resend countdown timer
  useEffect(() => {
    if (otpCountdown > 0) {
      const timer = setTimeout(() => setOtpCountdown(otpCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpCountdown]);

  const handleSendOtp = async () => {
    if (!identifier.trim()) {
      toast.error("Enter your registered mobile or email");
      return;
    }
    setIsSubmitting(true);
    const channel = identifier.includes("@") ? "email" : "sms";
    const res = await otpAdapter.send(channel, identifier);
    setIsSubmitting(false);

    if (res.success) {
      setOtpSent(true);
      setOtpCountdown(30);
    } else {
      toast.error(res.message);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      toast.error("Please enter both contact and password.");
      return;
    }

    setIsSubmitting(true);
    const res = await signInWithPassword(identifier, password, rememberMe);
    setIsSubmitting(false);

    if (res.success) {
      // Auth provider will trigger navigate via useEffect
    } else {
      toast.error(res.error || "Sign in failed");
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim()) {
      toast.error("Please enter the 6-digit OTP");
      return;
    }

    setIsSubmitting(true);
    const res = await signInWithOtp(identifier, otpCode);
    setIsSubmitting(false);

    if (res.success) {
      // Auth provider will trigger navigate via useEffect
    } else {
      toast.error(res.error || "OTP sign in failed");
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-card">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground">
          Vendor Sign In
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Access your catalog, live orders, settlements and inventory.
        </p>
      </div>

      {/* Tabs: Password vs OTP */}
      <div className="flex p-1 rounded-xl bg-muted border border-border mb-5 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setTab("password")}
          className={`flex-1 py-2 rounded-lg transition ${
            tab === "password" ? "bg-white text-foreground shadow-2xs font-bold" : "text-muted-foreground"
          }`}
        >
          Password
        </button>
        <button
          type="button"
          onClick={() => setTab("otp")}
          className={`flex-1 py-2 rounded-lg transition ${
            tab === "otp" ? "bg-white text-foreground shadow-2xs font-bold" : "text-muted-foreground"
          }`}
        >
          Login with OTP
        </button>
      </div>

      {tab === "password" ? (
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Mobile Number or Email
            </label>
            <div className="relative">
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="9000000001 or store@example.com"
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <Phone className="absolute right-3.5 top-3 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Password
              </label>
              <button
                type="button"
                onClick={() => {
                  setForgotTarget(identifier);
                  setShowForgotModal(true);
                }}
                className="text-xs text-primary hover:underline font-semibold"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm pr-10 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-border text-primary accent-primary"
              />
              <span>Remember me</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 px-4 font-semibold text-primary-foreground shadow-glow hover:brightness-105 active:scale-[0.99] transition disabled:opacity-60"
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>Sign In as Vendor</span>}
          </button>
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Registered Mobile or Email
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="9000000001 or store@example.com"
                className="flex-1 rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={otpCountdown > 0 || isSubmitting}
                className="rounded-xl border border-primary text-primary font-semibold text-xs px-3 py-2 hover:bg-primary/10 transition disabled:opacity-50 shrink-0"
              >
                {otpCountdown > 0 ? `Resend (${otpCountdown}s)` : otpSent ? "Resend OTP" : "Send OTP"}
              </button>
            </div>
          </div>

          {otpSent && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Enter 6-digit OTP (Demo: 123456)
              </label>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                className="w-full tracking-widest text-center font-mono font-bold text-lg rounded-xl border border-border bg-background px-3.5 py-2.5 outline-none focus:border-primary"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={!otpSent || isSubmitting}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 px-4 font-semibold text-primary-foreground shadow-glow hover:brightness-105 active:scale-[0.99] transition disabled:opacity-60"
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>Verify & Sign In</span>}
          </button>
        </form>
      )}

      {/* Demo Credentials Helper Pill */}
      <div className="mt-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 p-3 text-xs text-emerald-800 dark:text-emerald-200">
        <p className="font-semibold flex items-center gap-1.5">
          <KeyRound className="h-3.5 w-3.5" />
          Demo Approved Vendor:
        </p>
        <p className="text-[11px] text-emerald-700 dark:text-emerald-300 mt-0.5">
          Mobile: <code className="font-mono font-bold">9000000001</code> · Password: <code className="font-mono font-bold">Vendor@123</code> · OTP: <code className="font-mono font-bold">123456</code>
        </p>
      </div>

      {/* Switch to Sign Up */}
      <div className="mt-6 pt-5 text-center text-sm border-t border-border">
        <span className="text-muted-foreground">New vendor to RiderzPro? </span>
        <button
          type="button"
          onClick={onSwitchToSignUp}
          className="font-semibold text-primary hover:underline ml-1"
        >
          Create seller account →
        </button>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-card border border-border p-6 shadow-2xl">
            <h3 className="font-display text-xl font-bold">Reset Vendor Password</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Enter your registered mobile or email to verify via OTP.
            </p>

            <div className="mt-4 space-y-3">
              <input
                type="text"
                placeholder="Mobile or Email"
                value={forgotTarget}
                onChange={(e) => setForgotTarget(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm outline-none"
              />

              {forgotStep === "verify" && (
                <>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit OTP (123456)"
                    value={forgotOtp}
                    onChange={(e) => setForgotOtp(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-center font-mono font-bold outline-none"
                  />
                  <input
                    type="password"
                    placeholder="New password (min 8 chars)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm outline-none"
                  />
                </>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="flex-1 rounded-xl border border-border py-2 text-xs font-semibold text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                {forgotStep === "send" ? (
                  <button
                    type="button"
                    onClick={async () => {
                      if (!forgotTarget) return toast.error("Enter target");
                      const channel = forgotTarget.includes("@") ? "email" : "sms";
                      await otpAdapter.send(channel, forgotTarget);
                      setForgotStep("verify");
                    }}
                    className="flex-1 rounded-xl bg-primary text-white py-2 text-xs font-semibold"
                  >
                    Send OTP
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={async () => {
                      const res = await resetPasswordWithOtp(forgotTarget, forgotOtp, newPassword);
                      if (res.success) {
                        setShowForgotModal(false);
                      } else {
                        toast.error(res.error || "Reset failed");
                      }
                    }}
                    className="flex-1 rounded-xl bg-primary text-white py-2 text-xs font-semibold"
                  >
                    Set Password
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ===========================================================================
// VENDOR SIGN UP FORM (Step 1: Seller Account Creation)
// ===========================================================================
function VendorSignUpForm({ onSwitchToSignIn }: { onSwitchToSignIn: () => void }) {
  const { signUpVendor } = useVendorAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [businessType, setBusinessType] = useState<VendorBusinessType>("Proprietorship");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // OTP Verification States
  const [mobileOtpSent, setMobileOtpSent] = useState(false);
  const [mobileOtpCode, setMobileOtpCode] = useState("");
  const [mobileVerified, setMobileVerified] = useState(false);
  const [mobileCountdown, setMobileCountdown] = useState(0);

  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtpCode, setEmailOtpCode] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailCountdown, setEmailCountdown] = useState(0);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Countdown timers
  useEffect(() => {
    if (mobileCountdown > 0) {
      const timer = setTimeout(() => setMobileCountdown(mobileCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [mobileCountdown]);

  useEffect(() => {
    if (emailCountdown > 0) {
      const timer = setTimeout(() => setEmailCountdown(emailCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [emailCountdown]);

  // Password strength calculator
  const passwordStrength = (() => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 8) s += 30;
    if (/[0-9]/.test(password)) s += 35;
    if (/[a-zA-Z]/.test(password)) s += 35;
    return Math.min(100, s);
  })();

  const handleSendMobileOtp = async () => {
    if (!validateMobile(mobile)) {
      toast.error("Please enter a valid 10-digit Indian mobile number");
      return;
    }
    const res = await otpAdapter.send("sms", mobile);
    if (res.success) {
      setMobileOtpSent(true);
      setMobileCountdown(30);
    } else {
      toast.error(res.message);
    }
  };

  const handleVerifyMobileOtp = async () => {
    const res = await otpAdapter.verify("sms", mobile, mobileOtpCode);
    if (res.success) {
      setMobileVerified(true);
      toast.success("Mobile number verified successfully!");
    } else {
      toast.error(res.error || "Invalid mobile OTP");
    }
  };

  const handleSendEmailOtp = async () => {
    if (!email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    const res = await otpAdapter.send("email", email);
    if (res.success) {
      setEmailOtpSent(true);
      setEmailCountdown(30);
    } else {
      toast.error(res.message);
    }
  };

  const handleVerifyEmailOtp = async () => {
    const res = await otpAdapter.verify("email", email, emailOtpCode);
    if (res.success) {
      setEmailVerified(true);
      toast.success("Email address verified successfully!");
    } else {
      toast.error(res.error || "Invalid email OTP");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) return toast.error("Enter full legal name");
    if (!mobileVerified) return toast.error("Please verify your mobile number with OTP");
    if (!emailVerified) return toast.error("Please verify your email address with OTP");
    if (password.length < 8 || !/[0-9]/.test(password) || !/[a-zA-Z]/.test(password)) {
      return toast.error("Password must be at least 8 characters with 1 letter and 1 number");
    }
    if (password !== confirmPassword) return toast.error("Passwords do not match");
    if (!agreedToTerms) return toast.error("You must accept the Seller Agreement & Policies");

    setIsSubmitting(true);
    const res = await signUpVendor({
      fullName,
      businessType,
      mobile,
      email,
      password,
    });
    setIsSubmitting(false);

    if (res.success) {
      toast.success("Seller account created! Continuing to Onboarding Stepper...");
      navigate({ to: "/vendor/onboarding" });
    } else {
      toast.error(res.error || "Failed to create seller account");
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-card">
      <div className="mb-6">
        <span className="text-xs font-bold text-primary tracking-wider uppercase">Step 1 of 6</span>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground mt-1">
          Seller Account Creation
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Create your verified EV parts vendor profile.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            Full Name of Authorized Representative
          </label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. Ramesh Chandra"
            className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary"
          />
        </div>

        {/* Business Type */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            Business Constitution / Type
          </label>
          <select
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value as VendorBusinessType)}
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary cursor-pointer"
          >
            <option value="Proprietorship">Proprietorship</option>
            <option value="Individual">Individual (Unregistered)</option>
            <option value="Partnership">Partnership</option>
            <option value="Pvt Ltd">Private Limited (Pvt Ltd)</option>
            <option value="LLP">Limited Liability Partnership (LLP)</option>
            <option value="Company">Public Ltd / Other Company</option>
          </select>
        </div>

        {/* Mobile Number with OTP */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            Mobile Number (+91)
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="tel"
                maxLength={10}
                disabled={mobileVerified}
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                placeholder="9876543210"
                className={`w-full rounded-xl border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary ${
                  mobileVerified ? "border-emerald-500 bg-emerald-50/30" : "border-border"
                }`}
              />
              {mobileVerified && (
                <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-emerald-600" />
              )}
            </div>
            {!mobileVerified && (
              <button
                type="button"
                onClick={handleSendMobileOtp}
                disabled={mobileCountdown > 0}
                className="rounded-xl border border-primary text-primary px-3 py-2 text-xs font-semibold hover:bg-primary/10 transition disabled:opacity-50 shrink-0"
              >
                {mobileCountdown > 0 ? `${mobileCountdown}s` : mobileOtpSent ? "Resend" : "Send OTP"}
              </button>
            )}
          </div>
          {mobileOtpSent && !mobileVerified && (
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                maxLength={6}
                value={mobileOtpCode}
                onChange={(e) => setMobileOtpCode(e.target.value.replace(/\D/g, ""))}
                placeholder="OTP (123456)"
                className="w-32 rounded-xl border border-border bg-background px-3 py-2 text-center text-xs font-mono font-bold"
              />
              <button
                type="button"
                onClick={handleVerifyMobileOtp}
                className="rounded-xl bg-emerald-600 text-white px-3 py-2 text-xs font-bold hover:bg-emerald-700"
              >
                Verify Mobile
              </button>
            </div>
          )}
        </div>

        {/* Email with OTP */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            Official Store Email
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="email"
                disabled={emailVerified}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="store@domain.com"
                className={`w-full rounded-xl border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary ${
                  emailVerified ? "border-emerald-500 bg-emerald-50/30" : "border-border"
                }`}
              />
              {emailVerified && (
                <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-emerald-600" />
              )}
            </div>
            {!emailVerified && (
              <button
                type="button"
                onClick={handleSendEmailOtp}
                disabled={emailCountdown > 0}
                className="rounded-xl border border-primary text-primary px-3 py-2 text-xs font-semibold hover:bg-primary/10 transition disabled:opacity-50 shrink-0"
              >
                {emailCountdown > 0 ? `${emailCountdown}s` : emailOtpSent ? "Resend" : "Send OTP"}
              </button>
            )}
          </div>
          {emailOtpSent && !emailVerified && (
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                maxLength={6}
                value={emailOtpCode}
                onChange={(e) => setEmailOtpCode(e.target.value.replace(/\D/g, ""))}
                placeholder="OTP (123456)"
                className="w-32 rounded-xl border border-border bg-background px-3 py-2 text-center text-xs font-mono font-bold"
              />
              <button
                type="button"
                onClick={handleVerifyEmailOtp}
                className="rounded-xl bg-emerald-600 text-white px-3 py-2 text-xs font-bold hover:bg-emerald-700"
              >
                Verify Email
              </button>
            </div>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            Create Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 8 chars, 1 letter, 1 number"
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm pr-10 outline-none focus:border-primary"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {/* Password strength bar */}
          {password && (
            <div className="mt-1.5 flex items-center gap-2">
              <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    passwordStrength < 60
                      ? "bg-destructive w-1/3"
                      : passwordStrength < 100
                      ? "bg-amber-500 w-2/3"
                      : "bg-emerald-500 w-full"
                  }`}
                />
              </div>
              <span className="text-[10px] font-semibold text-muted-foreground">
                {passwordStrength < 60 ? "Weak" : passwordStrength < 100 ? "Medium" : "Strong"}
              </span>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter password"
            className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary"
          />
        </div>

        {/* Terms Agreement */}
        <label className="flex items-start gap-2.5 pt-2 text-xs text-muted-foreground cursor-pointer">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-border text-primary accent-primary shrink-0"
          />
          <span>
            I agree to the RiderzPro <span className="font-semibold text-foreground underline">Seller Services Agreement</span>,{" "}
            <span className="font-semibold text-foreground underline">Merchant Terms</span>, and{" "}
            <span className="font-semibold text-foreground underline">Privacy Policy</span>.
          </span>
        </label>

        <button
          type="submit"
          disabled={isSubmitting || !mobileVerified || !emailVerified}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 px-4 font-bold text-primary-foreground shadow-glow hover:brightness-105 active:scale-[0.99] transition disabled:opacity-50 mt-2"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <span>Continue to Tax Verification</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {/* Switcher to Sign In */}
      <div className="mt-6 pt-5 text-center text-sm border-t border-border">
        <span className="text-muted-foreground">Already have a seller account? </span>
        <button
          type="button"
          onClick={onSwitchToSignIn}
          className="font-semibold text-primary hover:underline ml-1"
        >
          Sign in here
        </button>
      </div>
    </div>
  );
}
