import React, { useState, useEffect } from "react";
import {
  X,
  Mail,
  Phone,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/site/bits";
import { useAuth, sendEmailOtp, checkEmailExists } from "@/lib/auth";
import { useStore } from "@/lib/store";

export function CustomerLoginModal() {
  const {
    isCustomerLoginModalOpen,
    closeCustomerLoginModal,
    customerLoginModalOptions,
    setUser: setAuthUser,
  } = useAuth();
  const { setRole } = useStore();

  // Stages: "identifier" | "otp"
  const [stage, setStage] = useState<"identifier" | "otp">("identifier");

  // Form states
  const [identifier, setIdentifier] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [userFullName, setUserFullName] = useState("");
  const [userRole, setUserRole] = useState<string | null>(null);

  // Status & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize with initialIdentifier if supplied
  useEffect(() => {
    if (isCustomerLoginModalOpen) {
      if (customerLoginModalOptions?.initialIdentifier) {
        setIdentifier(customerLoginModalOptions.initialIdentifier);
      }
      setStage("identifier");
      setOtpCode("");
      setErrorMessage(null);
      setIsLoading(false);
    }
  }, [isCustomerLoginModalOpen, customerLoginModalOptions]);

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer: any = null;
    if (otpCountdown > 0) {
      timer = setInterval(() => setOtpCountdown((c) => Math.max(0, c - 1)), 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [otpCountdown]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isCustomerLoginModalOpen) {
        closeCustomerLoginModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCustomerLoginModalOpen, closeCustomerLoginModal]);

  if (!isCustomerLoginModalOpen) return null;

  // Mask destination email or phone
  const maskedDestination = (() => {
    const raw = identifier.trim();
    if (raw.includes("@")) {
      const parts = raw.split("@");
      const local = parts[0] || "";
      const domain = parts[1] || "";
      if (local.length <= 2) return `${local[0]}*@${domain}`;
      return `${local[0]}***${local[local.length - 1]}@${domain}`;
    }
    const clean = raw.replace(/\D/g, "");
    if (clean.length >= 10) {
      return `${clean.slice(0, 3)}****${clean.slice(-3)}`;
    }
    return raw;
  })();

  // STAGE 1: IDENTIFIER SUBMISSION
  const handleIdentifierSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const raw = identifier.trim();
    if (!raw) {
      setErrorMessage("Please enter your email or mobile number.");
      return;
    }

    const isEmail = raw.includes("@");
    const digitsOnly = raw.replace(/\D/g, "");
    const isMobile = !isEmail && digitsOnly.length >= 7;

    // Mobile authentication constraint check
    if (isMobile) {
      setErrorMessage(
        "SMS OTP authentication is currently in carrier testing. Please sign in using your email address."
      );
      return;
    }

    if (!isEmail || !raw.includes(".")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    const cleanEmail = raw.toLowerCase();
    setIsLoading(true);

    try {
      // 1. Check account existence
      const checkRes = await checkEmailExists(cleanEmail);
      setIsRegistered(checkRes.isRegistered);
      if (checkRes.fullName) setUserFullName(checkRes.fullName);
      if (checkRes.role) setUserRole(checkRes.role);

      // 2. Dispatch OTP to email
      // Existing user -> CUSTOMER_SIGNIN, New user -> CUSTOMER_SIGNUP
      const purpose = checkRes.isRegistered ? "CUSTOMER_SIGNIN" : "CUSTOMER_SIGNUP";
      await sendEmailOtp(cleanEmail, purpose);

      setOtpCountdown(60);
      setStage("otp");
      toast.success(`6-digit verification code sent to ${cleanEmail}`);
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to process identifier. Please try again.");
      toast.error(err?.message || "Verification code dispatch failed.");
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (otpCountdown > 0 || isSendingOtp) return;
    setErrorMessage(null);
    setIsSendingOtp(true);
    const cleanEmail = identifier.trim().toLowerCase();

    try {
      const purpose = isRegistered ? "CUSTOMER_SIGNIN" : "CUSTOMER_SIGNUP";
      await sendEmailOtp(cleanEmail, purpose);
      setOtpCountdown(60);
      toast.success(`A fresh 6-digit code was sent to ${cleanEmail}`);
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to resend code.");
      toast.error(err?.message || "Failed to resend code.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  // STAGE 2: OTP VERIFICATION
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanOtp = otpCode.trim();
    if (cleanOtp.length !== 6) {
      setErrorMessage("Please enter the complete 6-digit verification code.");
      return;
    }

    const cleanEmail = identifier.trim().toLowerCase();
    setIsLoading(true);

    try {
      let sessionData: any = null;

      if (isRegistered) {
        // Sign In via OTP
        const res = await fetch("/api/auth/signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            email: cleanEmail,
            code: cleanOtp,
            authType: "otp",
            portal: "customer",
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Invalid or expired verification code.");
        }
        sessionData = data;
      } else {
        // Sign Up New Customer via OTP
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            email: cleanEmail,
            otpCode: cleanOtp,
            fullName: cleanEmail.split("@")[0] || "Customer",
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to complete account registration.");
        }
        sessionData = data;
      }

      // Establish authenticated session
      const userObj = sessionData.user || sessionData.customer;
      const sessionUser = {
        id: userObj.id,
        name: userObj.fullName || userObj.email.split("@")[0],
        email: userObj.email,
        phone: userObj.phone || "",
        role: "customer" as const,
      };

      localStorage.setItem("riderzpro_auth_user", JSON.stringify(sessionUser));
      localStorage.setItem("riderzpro_auth_token", "session_active");
      localStorage.setItem("riderzpro_token", "session_active");
      setAuthUser(sessionUser);
      setRole("customer");

      toast.success(`Welcome to RiderzPro, ${sessionUser.name}!`);

      // Close modal
      closeCustomerLoginModal();

      // Trigger post-login callback or navigation
      if (customerLoginModalOptions?.onAuthenticated) {
        customerLoginModalOptions.onAuthenticated();
      } else if (customerLoginModalOptions?.redirectTo) {
        window.location.href = customerLoginModalOptions.redirectTo;
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Verification failed. Please check code.");
      toast.error(err?.message || "Verification failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeCustomerLoginModal();
      }}
    >
      <div className="relative w-full max-w-md bg-white rounded-3xl border border-gray-100 shadow-2xl p-6 sm:p-8 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={closeCustomerLoginModal}
          aria-label="Close"
          className="absolute top-5 right-5 h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-black flex items-center justify-center transition cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Top Header / Logo */}
        <div className="flex flex-col items-center text-center mb-6">
          <Logo className="flex items-center mb-3" imgClassName="h-9 w-auto" />
          <h2 className="text-2xl font-black text-[#111111] tracking-tight">
            {stage === "identifier" ? "Welcome Back" : "Enter Verification Code"}
          </h2>
          <p className="text-xs text-gray-500 mt-1 max-w-xs">
            {stage === "identifier"
              ? "Sign in or create an account to continue shopping."
              : `We sent a 6-digit code to ${maskedDestination}`}
          </p>
        </div>

        {/* Inline Error / Alert message */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5 animate-in fade-in duration-150">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
            <div className="flex-1 text-left">{errorMessage}</div>
          </div>
        )}

        {/* STAGE 1: IDENTIFIER INPUT */}
        {stage === "identifier" && (
          <form onSubmit={handleIdentifierSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 text-left">
                Email or Mobile Number
              </label>
              <div className="relative flex items-center rounded-xl border border-gray-300 bg-white px-3.5 py-3 transition focus-within:border-[#E31E24] focus-within:ring-2 focus-within:ring-[#E31E24]/10">
                <Mail className="h-4 w-4 text-gray-400 mr-2.5 shrink-0" />
                <input
                  type="text"
                  autoFocus
                  required
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="Enter your email or mobile number"
                  className="w-full text-sm text-gray-900 placeholder:text-gray-400 outline-hidden bg-transparent"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !identifier.trim()}
              className="w-full h-12 rounded-xl bg-[#E31E24] hover:bg-[#c9181e] active:scale-[0.99] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-[#E31E24]/20 transition disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Verifying Identifier...</span>
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            <div className="pt-2 text-center text-[11px] text-gray-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Direct encrypted email OTP verification</span>
            </div>
          </form>
        )}

        {/* STAGE 2: 6-DIGIT OTP INPUT */}
        {stage === "otp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider text-left">
                  6-Digit OTP Code
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setStage("identifier");
                    setOtpCode("");
                    setErrorMessage(null);
                  }}
                  className="text-xs text-[#0066cc] hover:underline font-semibold cursor-pointer"
                >
                  Change Email
                </button>
              </div>

              <input
                type="text"
                autoFocus
                maxLength={6}
                value={otpCode}
                onChange={(e) => {
                  setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6));
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="• • • • • •"
                className="w-full h-13 text-center text-xl font-mono font-black tracking-[0.4em] rounded-xl border border-gray-300 bg-gray-50/50 focus:bg-white focus:border-[#E31E24] focus:ring-2 focus:ring-[#E31E24]/10 outline-hidden transition text-gray-900"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || otpCode.trim().length !== 6}
              className="w-full h-12 rounded-xl bg-[#E31E24] hover:bg-[#c9181e] active:scale-[0.99] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-[#E31E24]/20 transition disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Verifying Code...</span>
                </>
              ) : (
                <>
                  <span>Verify OTP</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            {/* Resend OTP with 60s countdown */}
            <div className="pt-2 flex items-center justify-between text-xs text-gray-500">
              <span>Didn't receive the code?</span>
              <button
                type="button"
                disabled={otpCountdown > 0 || isSendingOtp}
                onClick={handleResendOtp}
                className="font-bold text-[#E31E24] hover:underline disabled:text-gray-400 disabled:no-underline cursor-pointer"
              >
                {isSendingOtp
                  ? "Resending..."
                  : otpCountdown > 0
                  ? `Resend in ${otpCountdown}s`
                  : "Resend OTP"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
