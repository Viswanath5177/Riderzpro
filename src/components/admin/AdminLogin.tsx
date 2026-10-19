import React, { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { MeshBackground } from "./glass/MeshBackground";
import { GlassButton } from "./glass/GlassButton";
import { useAdminAuth } from "@/lib/adminAuth";
import { Logo } from "@/components/site/bits";

export function AdminLogin() {
  const { login, verifyOtp, loginWithDevBypass } = useAdminAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [email, setEmail] = useState("admin@riderzpro.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [otpCode, setOtpCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDevBypassing, setIsDevBypassing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [shake, setShake] = useState(false);

  const isDev = Boolean(
    import.meta.env.DEV ||
    import.meta.env["VITE_SHOW_ADMIN_ENTRY"] === "true" ||
    (typeof window !== "undefined" && window.location.hostname === "localhost")
  );

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage("Please enter both email and password.");
      triggerShake();
      return;
    }

    setIsLoading(true);
    try {
      const res = await login(email, password);
      if (res.success && res.requireOtp) {
        setStep("otp");
        toast.info("Security Verification Required", {
          description: "Enter test OTP 123456 to complete authentication.",
        });
      } else {
        setErrorMessage(res.error || "Invalid admin credentials");
        triggerShake();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!otpCode || otpCode.length < 6) {
      setErrorMessage("Please enter the 6-digit verification code (123456)");
      triggerShake();
      return;
    }

    setIsLoading(true);
    try {
      const res = await verifyOtp(otpCode);
      if (res.success) {
        toast.success("Welcome back, Admin", {
          description: "Signed in as Vikram Malhotra (Super Admin).",
        });
        navigate({ to: "/admin" });
      } else {
        setErrorMessage(res.error || "Invalid OTP code");
        triggerShake();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDevBypass = () => {
    setIsDevBypassing(true);
    setTimeout(() => {
      loginWithDevBypass();
      toast.success("Welcome back, Admin (Dev Bypass)", {
        description: "Authenticated with Super Admin privileges.",
      });
      navigate({ to: "/admin" });
    }, 200);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 font-sans text-gray-900 select-none bg-[#F5F6F8]">
      {/* Background with floating mesh blobs and subtle grid */}
      <MeshBackground isLight={true} />

      {/* Centered Glass Card with proper high-contrast text and border */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`relative z-10 w-full max-w-[440px] rounded-[32px] border border-black/[0.08] bg-white/95 p-7 sm:p-9 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.12),inset_0_1px_0_0_rgba(255,255,255,0.9)] backdrop-blur-2xl ${
          shake ? "animate-shake" : ""
        }`}
      >
        {/* Card Header */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center justify-center">
            <Logo className="flex items-center justify-center" imgClassName="h-12 sm:h-14 w-auto" />
          </div>

          <div className="mt-3.5 inline-flex items-center gap-1.5 rounded-full border border-[#E31E24]/20 bg-[#E31E24]/10 px-3 py-1 text-[10px] font-bold tracking-wider text-[#E31E24] uppercase">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Admin Console</span>
          </div>

          <h1 className="mt-4 font-display text-2xl sm:text-3xl font-black tracking-tight text-gray-900">
            {step === "credentials" ? "Welcome back, Admin" : "Two-Step Verification"}
          </h1>
          <p className="mt-1.5 text-xs text-gray-500 max-w-xs leading-relaxed">
            {step === "credentials"
              ? "Sign in to manage orders, sellers, riders and parts."
              : "Enter the 6-digit security code sent to your registered admin device."}
          </p>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-semibold text-red-700"
          >
            {errorMessage}
          </motion.div>
        )}

        {/* Step Transition Animation */}
        <div className="mt-6">
          <AnimatePresence mode="wait">
            {step === "credentials" ? (
              <motion.form
                key="step-credentials"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                onSubmit={handleCredentialsSubmit}
                noValidate
                className="space-y-4"
              >
                {/* Email Field */}
                <div>
                  <label
                    htmlFor="admin-email"
                    className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5"
                  >
                    Admin Email
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      id="admin-email"
                      type="email"
                      autoComplete="username"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@riderzpro.com"
                      className="w-full rounded-2xl border border-gray-200 bg-gray-50/80 pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:border-[#E31E24] focus:bg-white focus:ring-2 focus:ring-[#E31E24]/20"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="admin-password"
                      className="block text-xs font-bold uppercase tracking-wider text-gray-700"
                    >
                      Password
                    </label>
                  </div>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      id="admin-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-2xl border border-gray-200 bg-gray-50/80 pl-10 pr-10 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:border-[#E31E24] focus:bg-white focus:ring-2 focus:ring-[#E31E24]/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember & Forgot Password Row */}
                <div className="flex items-center justify-between pt-0.5 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-gray-700 font-medium">
                    <input
                      type="checkbox"
                      checked={rememberDevice}
                      onChange={(e) => setRememberDevice(e.target.checked)}
                      className="rounded border-gray-300 text-[#E31E24] accent-[#E31E24] focus:ring-0 cursor-pointer"
                    />
                    <span>Remember this device</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      toast.info("Password assistance", {
                        description: "Please enter your administrator account password.",
                      });
                    }}
                    className="font-semibold text-[#E31E24] hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Primary Sign In Button */}
                <GlassButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isLoading}
                  className="w-full shadow-[0_4px_16px_rgba(227,30,36,0.3)] hover:shadow-[0_6px_20px_rgba(227,30,36,0.4)]"
                >
                  <span>Sign in to Console</span>
                  <ArrowRight className="h-4 w-4" />
                </GlassButton>

                {/* Secondary Dev Bypass Button (DEV only) */}
                {isDev && (
                  <GlassButton
                    type="button"
                    variant="glass"
                    size="md"
                    isLoading={isDevBypassing}
                    onClick={handleDevBypass}
                    className="w-full border-amber-300 bg-amber-50/80 text-amber-900 hover:bg-amber-100 font-bold shadow-2xs"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                    <span>Use Dev Bypass (Super Admin)</span>
                  </GlassButton>
                )}

                {/* Credentials Helper Box */}
                <div className="mt-3 rounded-2xl border border-gray-200 bg-gray-50/90 p-3 text-[11px] text-gray-600">
                  <p className="font-bold text-gray-800">Administrator Console:</p>
                  <p className="mt-0.5 font-mono text-gray-600">
                    Sign in with your authorized administrator credentials.
                  </p>
                </div>
              </motion.form>
            ) : (
              <motion.form
                key="step-otp"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                onSubmit={handleOtpSubmit}
                className="space-y-4"
              >
                <div>
                  <label
                    htmlFor="admin-otp"
                    className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 text-center"
                  >
                    6-Digit Verification Code
                  </label>
                  <div className="relative">
                    <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      id="admin-otp"
                      type="text"
                      maxLength={6}
                      autoFocus
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                      placeholder="123456"
                      className="w-full text-center font-mono tracking-[0.4em] text-lg rounded-2xl border border-gray-200 bg-gray-50/80 pl-10 pr-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#E31E24] focus:bg-white focus:ring-2 focus:ring-[#E31E24]/20"
                    />
                  </div>
                  <p className="mt-2 text-center text-[11px] text-gray-500">
                    Mock test code: <code className="font-mono font-bold text-[#E31E24]">123456</code>
                  </p>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <GlassButton
                    type="button"
                    variant="glass"
                    size="md"
                    onClick={() => setStep("credentials")}
                    className="flex-1"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back</span>
                  </GlassButton>
                  <GlassButton
                    type="submit"
                    variant="primary"
                    size="md"
                    isLoading={isLoading}
                    className="flex-[2] shadow-[0_4px_16px_rgba(227,30,36,0.3)]"
                  >
                    <span>Verify & Launch</span>
                    <ArrowRight className="h-4 w-4" />
                  </GlassButton>
                </div>

                <button
                  type="button"
                  onClick={() => setOtpCode("123456")}
                  className="w-full text-center text-[11px] text-[#E31E24] font-semibold hover:underline pt-1 cursor-pointer"
                >
                  Click here to auto-fill code: 123456
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Link */}
        <div className="mt-6 border-t border-gray-100 pt-4 text-center">
          <Link
            to="/"
            className="text-xs font-semibold text-gray-500 hover:text-[#E31E24] transition flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Riderzpro Store</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
