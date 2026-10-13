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
  const [password, setPassword] = useState("Admin@123");
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
    <div className="relative flex min-h-screen items-center justify-center p-4 font-sans text-white select-none bg-[#0b0d12]">
      {/* Background with floating mesh blobs and subtle grid */}
      <MeshBackground />

      {/* Centered Glass Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`admin-glass-card relative z-10 w-full max-w-[440px] rounded-[28px] border border-white/20 bg-white/[0.08] p-7 sm:p-9 shadow-2xl backdrop-blur-[24px] saturate-[180%] ${
          shake ? "animate-shake" : ""
        } before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent`}
        style={{
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5), 0 0 40px rgba(225, 29, 42, 0.15)",
        }}
      >
        {/* Card Header */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2">
            <Logo imgClassName="h-9" />
          </div>

          <div className="mt-3.5 inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/15 px-3 py-1 text-[10px] font-bold tracking-wider text-red-400 uppercase">
            <ShieldCheck className="h-3 w-3" />
            <span>Admin Console</span>
          </div>

          <h1 className="mt-4 font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            {step === "credentials" ? "Welcome back, Admin" : "Two-Step Verification"}
          </h1>
          <p className="mt-1.5 text-xs text-zinc-300 max-w-xs leading-relaxed">
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
            className="mt-5 rounded-2xl border border-red-500/40 bg-red-500/20 px-3.5 py-2.5 text-xs font-semibold text-red-200"
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
                    className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5"
                  >
                    Admin Email
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <input
                      id="admin-email"
                      type="email"
                      autoComplete="username"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@riderzpro.com"
                      className="w-full rounded-2xl border border-white/15 bg-white/[0.08] pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-500 backdrop-blur-xl outline-none transition-all focus:border-[#e11d2a] focus:bg-white/[0.12] focus:ring-2 focus:ring-[#e11d2a]/30"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="admin-password"
                      className="block text-xs font-semibold uppercase tracking-wider text-zinc-300"
                    >
                      Password
                    </label>
                  </div>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <input
                      id="admin-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-2xl border border-white/15 bg-white/[0.08] pl-10 pr-10 py-2.5 text-sm text-white placeholder:text-zinc-500 backdrop-blur-xl outline-none transition-all focus:border-[#e11d2a] focus:bg-white/[0.12] focus:ring-2 focus:ring-[#e11d2a]/30"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember & Forgot Password Row */}
                <div className="flex items-center justify-between pt-0.5 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-zinc-300">
                    <input
                      type="checkbox"
                      checked={rememberDevice}
                      onChange={(e) => setRememberDevice(e.target.checked)}
                      className="rounded border-white/20 bg-white/10 text-red-500 accent-[#e11d2a] focus:ring-0 cursor-pointer"
                    />
                    <span>Remember this device</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      toast.info("Mock password hint", {
                        description: "Use admin@riderzpro.com / Admin@123",
                      });
                    }}
                    className="font-medium text-orange-400 hover:underline cursor-pointer"
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
                  className="w-full shadow-red-500/30"
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
                    className="w-full border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 hover:border-amber-500/50"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                    <span>Use Dev Bypass (Super Admin)</span>
                  </GlassButton>
                )}

                {/* Credentials Helper Box */}
                <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-[11px] text-zinc-400">
                  <p className="font-semibold text-zinc-300">Default Test Credentials:</p>
                  <p className="mt-0.5 font-mono text-zinc-400">
                    Email: <span className="text-white font-semibold">admin@riderzpro.com</span> · Password:{" "}
                    <span className="text-white font-semibold">Admin@123</span>
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
                    className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5 text-center"
                  >
                    6-Digit Verification Code
                  </label>
                  <div className="relative">
                    <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <input
                      id="admin-otp"
                      type="text"
                      maxLength={6}
                      autoFocus
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                      placeholder="123456"
                      className="w-full text-center font-mono tracking-[0.4em] text-lg rounded-2xl border border-white/20 bg-white/[0.08] pl-10 pr-4 py-3 text-white placeholder:text-zinc-600 outline-none focus:border-[#e11d2a] focus:ring-2 focus:ring-[#e11d2a]/30"
                    />
                  </div>
                  <p className="mt-2 text-center text-[11px] text-zinc-400">
                    Mock test code: <code className="font-mono font-bold text-amber-300">123456</code>
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
                    className="flex-[2]"
                  >
                    <span>Verify & Launch</span>
                    <ArrowRight className="h-4 w-4" />
                  </GlassButton>
                </div>

                <button
                  type="button"
                  onClick={() => setOtpCode("123456")}
                  className="w-full text-center text-[11px] text-orange-400 hover:underline pt-1 cursor-pointer"
                >
                  Click here to auto-fill code: 123456
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Link */}
        <div className="mt-6 border-t border-white/10 pt-4 text-center">
          <Link
            to="/"
            className="text-xs font-semibold text-zinc-400 hover:text-white transition flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>Back to Riderzpro Store</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
