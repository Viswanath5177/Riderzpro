import React, { useState } from "react";
import { X, ShieldCheck, ArrowRight, Phone, CheckCircle2, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useStore } from "@/lib/store";
import { toast } from "sonner";

interface MobileOtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  title?: string;
  subtitle?: string;
}

export function MobileOtpModal({
  isOpen,
  onClose,
  onSuccess,
  title = "Login to Place Order",
  subtitle = "Enter your mobile number for Delhi 30-min express delivery",
}: MobileOtpModalProps) {
  const { setUser } = useAuth();
  const { signIn, setRole, updateUserProfile } = useStore();

  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phoneNumber.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setStep("otp");
      setOtpCode("123456");
      toast.info("Demo OTP sent: 123456", {
        description: "Auto-filled demo code for quick access",
      });
    }, 400);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length < 4) {
      setError("Please enter the verification code.");
      return;
    }
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const cleanPhone = phoneNumber.replace(/\D/g, "") || "9876543210";
      const customerName = fullName.trim() || "EV Rider";

      const sessionUser = {
        id: `usr_${Date.now()}`,
        name: customerName,
        phone: cleanPhone,
        email: `${cleanPhone}@riderzpro.in`,
        role: "customer" as const,
      };

      try {
        localStorage.setItem("riderzpro_auth_user", JSON.stringify(sessionUser));
        localStorage.setItem("riderzpro_auth_token", `tok_${Date.now()}`);
      } catch {}

      if (setUser) setUser(sessionUser);
      signIn();
      setRole("customer");
      updateUserProfile({
        phone: cleanPhone,
        name: customerName,
        city: "Delhi",
        address: "Connaught Place, Central Delhi",
      });

      toast.success(`Welcome ${customerName}!`, {
        description: "Mobile OTP verified successfully.",
      });

      onClose();
      if (onSuccess) onSuccess();
    }, 400);
  };

  const handleQuickDemoFill = () => {
    setPhoneNumber("9876543210");
    setFullName("Harshitha (Demo Rider)");
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Backdrop tap to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Sheet */}
      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden z-10 animate-in slide-in-from-bottom duration-300">
        {/* Top Accent bar & Handle */}
        <div className="pt-3 pb-1 flex justify-center sm:hidden">
          <div className="h-1.5 w-12 rounded-full bg-gray-300" />
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 grid place-items-center text-gray-500 transition"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-6">
          {/* Header */}
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>⚡ 30 MINS DISPATCH</span>
            </span>
          </div>

          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">{title}</h2>
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>

          {error && (
            <div className="mt-3 rounded-xl bg-red-50 border border-red-200 p-2.5 text-xs font-semibold text-red-600">
              {error}
            </div>
          )}

          {/* STEP 1: Phone Input */}
          {step === "phone" ? (
            <form onSubmit={handleSendOtp} className="mt-5 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Mobile Number
                </label>
                <div className="flex items-center rounded-2xl border-2 border-gray-200 bg-gray-50/50 px-3 py-2.5 focus-within:border-red-600 focus-within:bg-white transition">
                  <span className="text-sm font-bold text-gray-800 pr-2 border-r border-gray-200">
                    🇮🇳 +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                    placeholder="Enter 10-digit number"
                    className="w-full pl-3 text-sm font-semibold text-gray-900 bg-transparent focus:outline-none"
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Aakash Sharma"
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-xs font-semibold text-gray-900 focus:border-red-600 focus:bg-white focus:outline-none transition"
                />
              </div>

              {/* Quick Demo Fill Pill */}
              <button
                type="button"
                onClick={handleQuickDemoFill}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 text-[11px] font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100/80 rounded-xl border border-red-200/60 transition"
              >
                <Sparkles className="h-3 w-3" />
                <span>Fill 1-Click Demo Number (9876543210)</span>
              </button>

              <button
                type="submit"
                disabled={isLoading || phoneNumber.length < 10}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-red-600 hover:bg-red-700 disabled:opacity-50 py-3.5 text-sm font-extrabold text-white shadow-md shadow-red-600/30 transition active:scale-98"
              >
                {isLoading ? (
                  <span>Sending Code...</span>
                ) : (
                  <>
                    <span>Continue with OTP</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* STEP 2: OTP Input */
            <form onSubmit={handleVerifyOtp} className="mt-5 space-y-4">
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>Sent to: <b className="text-gray-900">+91 {phoneNumber}</b></span>
                <button
                  type="button"
                  onClick={() => setStep("phone")}
                  className="font-bold text-red-600 hover:underline"
                >
                  Edit
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Enter 6-Digit OTP
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="123456"
                  className="w-full text-center tracking-[0.5em] text-xl font-mono font-bold rounded-2xl border-2 border-red-500 bg-white py-3 text-gray-900 focus:outline-none shadow-xs"
                  autoFocus
                />
              </div>

              <button
                type="button"
                onClick={() => setOtpCode("123456")}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 rounded-xl border border-emerald-200/80"
              >
                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                <span>Auto-fill Demo Code (123456)</span>
              </button>

              <button
                type="submit"
                disabled={isLoading || !otpCode}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 py-3.5 text-sm font-extrabold text-white shadow-md shadow-emerald-600/30 transition active:scale-98"
              >
                {isLoading ? (
                  <span>Verifying...</span>
                ) : (
                  <>
                    <span>Verify & Continue</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Trust badges */}
          <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-center gap-4 text-[10px] text-gray-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-emerald-500" />
              <span>Verified EV Parts</span>
            </span>
            <span>•</span>
            <span>Zero Spam SMS</span>
            <span>•</span>
            <span>Delhi NCR Express</span>
          </div>
        </div>
      </div>
    </div>
  );
}
