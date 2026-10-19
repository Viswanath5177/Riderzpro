import React, { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Phone,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  Store,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  Building2,
  KeyRound,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useVendorAuth } from "@/lib/vendorAuth";

interface VendorLoginTabProps {
  redirectTarget?: string;
}

export function VendorLoginTab({ redirectTarget = "/vendor/dashboard" }: VendorLoginTabProps) {
  const navigate = useNavigate();
  const { signInWithPassword, signInWithOtp } = useVendorAuth();

  const [authMethod, setAuthMethod] = useState<"password" | "otp">("password");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle password submission
  const handlePasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      toast.error("Please enter your registered vendor phone or email.");
      return;
    }
    if (!password.trim()) {
      toast.error("Please enter your vendor account password.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await signInWithPassword(identifier.trim(), password);
      if (res.success) {
        toast.success("Vendor signed in successfully!");
        navigate({ to: redirectTarget as never });
      } else {
        toast.error(res.error || "Vendor sign in failed. Please verify credentials.");
      }
    } catch {
      toast.error("An error occurred during sign in. Try demo credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle OTP request
  const handleSendOtp = () => {
    if (!identifier.trim()) {
      toast.error("Please enter your phone number to receive an OTP.");
      return;
    }
    setOtpSent(true);
    setOtpCode("123456"); // Pre-fill demo OTP
    toast.info("Demo OTP sent: 123456");
  };

  // Handle OTP verify
  const handleOtpSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim()) {
      toast.error("Please enter the 6-digit OTP code.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await signInWithOtp(identifier.trim(), otpCode.trim());
      if (res.success) {
        toast.success("Verified and signed in as Vendor!");
        navigate({ to: redirectTarget as never });
      } else {
        toast.error(res.error || "Invalid OTP code.");
      }
    } catch {
      toast.error("OTP verification failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fast Demo 1-Click Sign In
  const handleFastDemoLogin = async () => {
    setIsSubmitting(true);
    try {
      const res = await signInWithPassword("9000000001", "Vendor@123");
      if (res.success) {
        toast.success("Signed in as VoltHub Indiranagar (Demo Seller)!");
        navigate({ to: redirectTarget as never });
      } else {
        // Fallback direct navigate if session already initialized
        navigate({ to: redirectTarget as never });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight font-display">
            Vendor Sign In
          </h1>
          <span className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2 py-0.5 text-[10px] font-black text-[#E31E24] border border-red-200 uppercase">
            Seller Hub
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-1 leading-relaxed">
          Manage your catalogue, pack parts, and fulfill rider pickups.
        </p>
      </div>

      {/* Auth Method Toggle: Password vs OTP */}
      <div className="flex p-0.5 rounded-xl bg-gray-100 border border-gray-200/80 text-xs font-bold">
        <button
          type="button"
          onClick={() => setAuthMethod("password")}
          className={`flex-1 py-1.5 rounded-lg transition cursor-pointer text-center ${
            authMethod === "password"
              ? "bg-white text-gray-900 shadow-2xs font-extrabold"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          Password
        </button>
        <button
          type="button"
          onClick={() => setAuthMethod("otp")}
          className={`flex-1 py-1.5 rounded-lg transition cursor-pointer text-center ${
            authMethod === "otp"
              ? "bg-white text-gray-900 shadow-2xs font-extrabold"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          Mobile OTP
        </button>
      </div>

      {/* Password Auth Form */}
      {authMethod === "password" ? (
        <form onSubmit={handlePasswordSignIn} className="space-y-3.5 pt-1">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Vendor Mobile or Email
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                name="vendor-username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. 9000000001 or store@riderzpro.com"
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
                onClick={() => toast.info("Demo vendor password: Vendor@123")}
                className="text-xs text-[#E31E24] font-bold hover:underline cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                name="vendor-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter vendor password"
                className="w-full h-12 rounded-2xl border border-gray-200 bg-gray-50/80 hover:bg-gray-50 focus:bg-white px-4 pl-11 pr-11 text-sm outline-none focus:border-[#E31E24] focus:ring-4 focus:ring-[#E31E24]/10 transition"
                required
              />
              <Lock className="h-4.5 w-4.5 text-gray-400 absolute left-3.5 pointer-events-none" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-gray-400 hover:text-gray-700 p-1 cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="h-4.5 w-4.5" />
                ) : (
                  <Eye className="h-4.5 w-4.5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#E31E24] to-[#C1121F] text-white font-extrabold text-sm shadow-[0_6px_20px_rgba(227,30,36,0.3)] hover:shadow-[0_8px_25px_rgba(227,30,36,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-1"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in...
              </span>
            ) : (
              <>
                <span>Sign In to Seller Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      ) : (
        /* OTP Auth Form */
        <form onSubmit={handleOtpSignIn} className="space-y-3.5 pt-1">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Registered Mobile Number
            </label>
            <div className="relative flex items-center">
              <input
                type="tel"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="10-digit mobile number"
                className="w-full h-12 rounded-2xl border border-gray-200 bg-gray-50/80 hover:bg-gray-50 focus:bg-white px-4 pl-11 text-sm outline-none focus:border-[#E31E24] focus:ring-4 focus:ring-[#E31E24]/10 transition"
                required
              />
              <Phone className="h-4.5 w-4.5 text-gray-400 absolute left-3.5 pointer-events-none" />
            </div>
          </div>

          {!otpSent ? (
            <button
              type="button"
              onClick={handleSendOtp}
              className="w-full h-12 rounded-2xl bg-gray-900 text-white font-bold text-sm hover:bg-black transition flex items-center justify-center gap-2 cursor-pointer mt-1"
            >
              <KeyRound className="h-4 w-4" />
              <span>Get 6-Digit OTP</span>
            </button>
          ) : (
            <>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Enter OTP Code (Demo: 123456)
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    className="w-full h-12 rounded-2xl border border-gray-200 bg-gray-50/80 focus:bg-white px-4 text-center text-lg font-mono tracking-widest outline-none focus:border-[#E31E24] focus:ring-4 focus:ring-[#E31E24]/10 transition font-bold"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#E31E24] to-[#C1121F] text-white font-extrabold text-sm shadow-[0_6px_20px_rgba(227,30,36,0.3)] hover:shadow-[0_8px_25px_rgba(227,30,36,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-1"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Verifying...
                  </span>
                ) : (
                  <>
                    <span>Verify & Open Seller Dashboard</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </>
          )}
        </form>
      )}

      {/* Fast Demo Seller Login Badge */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleFastDemoLogin}
          disabled={isSubmitting}
          className="w-full py-2.5 px-3 rounded-2xl border border-amber-300 bg-amber-50/70 hover:bg-amber-100/70 text-amber-900 transition flex items-center justify-between text-xs font-bold cursor-pointer group"
        >
          <span className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-600 group-hover:scale-110 transition-transform" />
            <span>Fast 1-Click Demo Seller Sign In</span>
          </span>
          <span className="text-[10px] bg-amber-200/80 px-2 py-0.5 rounded-full font-black text-amber-950">
            VoltHub
          </span>
        </button>
      </div>

      {/* Register as Vendor link */}
      <div className="pt-2 text-center text-xs text-gray-500">
        New to RiderzPro?{" "}
        <Link to="/vendor/onboarding" className="font-bold text-[#E31E24] hover:underline">
          Register as verified seller partner →
        </Link>
      </div>
    </div>
  );
}
