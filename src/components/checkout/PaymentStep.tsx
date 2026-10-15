// src/components/checkout/PaymentStep.tsx
// Owned by Sathwik. Placed by Checkout flow.
import React, { useState } from "react";
import {
  Smartphone,
  CreditCard,
  Banknote,
  ShieldCheck,
  Lock,
  CheckCircle2,
  Sparkles,
  Info,
  ArrowRight,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { inr } from "@/lib/data";
import { formatPaise } from "@/lib/api/orders";

export type PaymentMethod = "UPI" | "CARD" | "COD";

export interface PaymentSuccessDetails {
  method: string;
  payment_status: "PAID" | "COD_PENDING";
  paymentId?: string;
  orderId?: string;
  signature?: string;
}

export interface PaymentStepProps {
  // Inline Checkout Form props (Harshith's Cart / Checkout flow)
  method?: PaymentMethod;
  onChangeMethod?: (method: PaymentMethod) => void;
  totalPaise?: number;
  disabled?: boolean;

  // Modal props (Legacy / Dialog mode)
  isOpen?: boolean;
  onClose?: () => void;
  quote?: { total: number };
  shippingAddress?: any;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  gstin?: string;
  businessName?: string;
  onPaymentSuccess?: (details: PaymentSuccessDetails) => void;
  onPaymentError?: (error: any) => void;
}

// Dynamically load Razorpay checkout script if not present
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Sathwik's PaymentStep component:
 * Integrates Razorpay Test mode (UPI / Cards) and Doorstep COD rails.
 * Supports both inline embedding and standalone modal presentation.
 */
export function PaymentStep({
  method = "CARD",
  onChangeMethod,
  totalPaise = 0,
  disabled = false,
  isOpen = true,
  onClose,
  quote,
  shippingAddress,
  customerName = "Aakash Sharma",
  customerPhone = "+91 98765 43210",
  customerEmail = "aakash.sharma@riderzpro.com",
  gstin,
  businessName,
  onPaymentSuccess,
  onPaymentError,
}: PaymentStepProps) {
  // UPI State
  const [selectedUpiApp, setSelectedUpiApp] = useState("gpay");
  const [upiId, setUpiId] = useState("");

  // Card State (Razorpay test values)
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardHolder, setCardHolder] = useState(customerName || "");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState("");

  const effectiveTotalPaise = totalPaise || (quote?.total ? Math.round(quote.total * 100) : 4815000);
  const effectiveTotalRupees = effectiveTotalPaise / 100;

  const handleMethodSelect = (newMethod: PaymentMethod) => {
    if (onChangeMethod) onChangeMethod(newMethod);
  };

  const fillTestCard = () => {
    setCardNumber("4111 2222 3333 4444");
    setCardExpiry("12/28");
    setCardCvv("999");
    setCardHolder("RiderzPro Test Rider");
    toast.success("Loaded Razorpay Sandbox test credentials");
  };

  // Launch Razorpay standard checkout popup in test mode
  const handleLaunchRazorpay = async () => {
    setIsProcessing(true);
    setProcessingStage("Initializing Razorpay Gateway...");

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Unable to load Razorpay SDK. Please check your internet connection.");
      }

      // Step 1: Create Order on backend (POST /api/payments/create-order)
      let orderData: any = null;
      try {
        const res = await fetch("/api/payments/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: effectiveTotalRupees,
            currency: "INR",
            receipt: `rcpt_${Date.now()}`,
            notes: {
              customer_name: customerName,
              customer_phone: customerPhone,
              gstin: gstin || "",
            },
          }),
        });
        if (res.ok) {
          const data = await res.json();
          orderData = data.order || data;
        }
      } catch (e) {
        console.warn("[PaymentStep] Backend order creation fallback:", e);
      }

      const keyId = orderData?.key_id || orderData?.key || (import.meta as any).env?.VITE_RAZORPAY_KEY_ID;
      if (!keyId || !orderData?.id) {
        throw new Error("Payment gateway is not configured. Missing Razorpay keys or order.");
      }

      const rzpOrderId = orderData.id || orderData.order_id;

      // Step 2: Configure Razorpay Checkout Options
      const options = {
        key: keyId,
        amount: effectiveTotalPaise, // in paise
        currency: "INR",
        name: "RiderzPro Mobility",
        description: `EV Parts Order · ₹150 Flat Delivery Included`,
        image: "https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/zap.svg",
        order_id: rzpOrderId,
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerPhone,
        },
        notes: {
          address: shippingAddress ? `${shippingAddress.street || ''}, ${shippingAddress.city || 'Delhi'}` : "Delhi NCR",
          gstin: gstin || "Unregistered",
        },
        theme: {
          color: "#E31E24",
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            toast.info("Razorpay checkout dismissed");
          },
        },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id?: string;
          razorpay_signature?: string;
        }) => {
          setProcessingStage("Verifying cryptographic signature with banking switch...");
          try {
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...response,
                order_id: rzpOrderId,
                amount: effectiveTotalRupees,
                customer_email: customerEmail,
                customer_name: customerName,
              }),
            });
            const verifyBody = await verifyRes.json().catch(() => ({}));
            if (!verifyRes.ok || !verifyBody?.success || verifyBody?.signature_verified !== true) {
              throw new Error(verifyBody?.error || "Payment signature verification failed");
            }

            setIsProcessing(false);
            toast.success("Payment verified! Payment Status: PAID");
            if (onPaymentSuccess) {
              onPaymentSuccess({
                method: "Razorpay",
                payment_status: "PAID",
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id || rzpOrderId,
                signature: response.razorpay_signature,
              });
            }
            if (onClose) onClose();
          } catch (verifyErr: any) {
            console.error("Signature verification failed:", verifyErr);
            setIsProcessing(false);
            toast.error(verifyErr?.message || "Payment verification failed");
            if (onPaymentError) onPaymentError(verifyErr);
          }
        },
      };

      const rzpInstance = new (window as any).Razorpay(options);
      rzpInstance.on("payment.failed", (failResponse: any) => {
        setIsProcessing(false);
        const desc = failResponse?.error?.description || "Payment failed at gateway";
        toast.error(`Transaction Failed: ${desc}`);
        if (onPaymentError) onPaymentError(failResponse.error);
      });

      rzpInstance.open();
      setIsProcessing(false);
    } catch (err: any) {
      setIsProcessing(false);
      toast.error(err.message || "Failed to initialize Razorpay checkout");
      if (onPaymentError) onPaymentError(err);
    }
  };

  const content = (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs space-y-4">
      {/* Step Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-lg bg-red-50 text-[#E31E24]">
            <Lock className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900 font-display">
              3. Payment Method (Razorpay Test Gateway)
            </h2>
            <p className="text-[11px] text-gray-500">
              End-to-end encrypted · Statutory 18% GST Invoice Included
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Razorpay 256-Bit SSL</span>
        </div>
      </div>

      {/* Payment Method Selector Tabs */}
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          disabled={disabled || isProcessing}
          onClick={() => handleMethodSelect("UPI")}
          className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition cursor-pointer ${
            method === "UPI"
              ? "border-[#E31E24] bg-red-50/30 text-[#E31E24] ring-1 ring-[#E31E24]"
              : "border-gray-200 hover:border-gray-300 text-gray-700 bg-gray-50/50"
          }`}
        >
          <Smartphone className="h-5 w-5 mb-1" />
          <span className="text-xs font-bold">UPI / QR</span>
          <span className="text-[10px] text-gray-500">GPay, PhonePe</span>
        </button>

        <button
          type="button"
          disabled={disabled || isProcessing}
          onClick={() => handleMethodSelect("CARD")}
          className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition cursor-pointer ${
            method === "CARD"
              ? "border-[#E31E24] bg-red-50/30 text-[#E31E24] ring-1 ring-[#E31E24]"
              : "border-gray-200 hover:border-gray-300 text-gray-700 bg-gray-50/50"
          }`}
        >
          <CreditCard className="h-5 w-5 mb-1" />
          <span className="text-xs font-bold">Cards</span>
          <span className="text-[10px] text-gray-500">Credit / Debit</span>
        </button>

        <button
          type="button"
          disabled={disabled || isProcessing}
          onClick={() => handleMethodSelect("COD")}
          className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition cursor-pointer ${
            method === "COD"
              ? "border-[#E31E24] bg-red-50/30 text-[#E31E24] ring-1 ring-[#E31E24]"
              : "border-gray-200 hover:border-gray-300 text-gray-700 bg-gray-50/50"
          }`}
        >
          <Banknote className="h-5 w-5 mb-1" />
          <span className="text-xs font-bold">Cash on Delivery</span>
          <span className="text-[10px] text-gray-500">Pay at Doorstep</span>
        </button>
      </div>

      {/* Tab Specific Content */}
      {method === "UPI" && (
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-gray-800">Instant UPI Direct Checkout</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> Zero Surcharge
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: "gpay", name: "Google Pay" },
              { id: "phonepe", name: "PhonePe" },
              { id: "paytm", name: "Paytm" },
              { id: "bhim", name: "BHIM UPI" },
            ].map((app) => (
              <button
                key={app.id}
                type="button"
                onClick={() => setSelectedUpiApp(app.id)}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border transition text-center cursor-pointer ${
                  selectedUpiApp === app.id
                    ? "border-emerald-600 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-500"
                    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {app.name}
              </button>
            ))}
          </div>

          <div className="pt-2">
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">
              Or Enter UPI ID / VPA
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="username@okhdfcbank or mobile@upi"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="flex-1 rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 outline-none focus:border-[#E31E24] focus:ring-1 focus:ring-[#E31E24]"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleLaunchRazorpay}
            disabled={isProcessing}
            className="w-full h-10 mt-1 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Launch Razorpay UPI Modal · {formatPaise(effectiveTotalPaise)}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {method === "CARD" && (
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-800">
              Razorpay Card Processing (Test Mode)
            </span>
            <button
              type="button"
              onClick={fillTestCard}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-red-100 text-[#E31E24] text-[11px] font-bold hover:bg-red-200 transition cursor-pointer"
            >
              <Sparkles className="h-3 w-3" />
              <span>Fill Test Card</span>
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">
                Card Number
              </label>
              <input
                type="text"
                placeholder="4111 2222 3333 4444"
                maxLength={19}
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs font-mono text-gray-900 outline-none focus:border-[#E31E24]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">
                  Valid Thru (MM/YY)
                </label>
                <input
                  type="text"
                  placeholder="12/28"
                  maxLength={5}
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs font-mono text-gray-900 outline-none focus:border-[#E31E24]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">
                  CVV / CVC
                </label>
                <input
                  type="password"
                  placeholder="•••"
                  maxLength={4}
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs font-mono text-gray-900 outline-none focus:border-[#E31E24]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">
                Name on Card
              </label>
              <input
                type="text"
                placeholder="Customer Name"
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 outline-none focus:border-[#E31E24]"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleLaunchRazorpay}
            disabled={isProcessing}
            className="w-full h-10 mt-1 rounded-xl bg-[#E31E24] hover:bg-red-700 text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Launch Razorpay Test Gateway · {formatPaise(effectiveTotalPaise)}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {method === "COD" && (
        <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 space-y-2 text-xs text-amber-900">
          <div className="flex items-center gap-2 font-bold">
            <Info className="h-4 w-4 text-amber-700" />
            <span>Pay on Doorstep Delivery</span>
          </div>
          <p className="text-[11px] text-amber-800 leading-relaxed">
            Please keep exact change ready or scan the delivery courier's dynamic UPI QR code on
            arrival. Total amount payable on delivery:{" "}
            <strong className="text-gray-900 font-extrabold">{formatPaise(effectiveTotalPaise)}</strong>.
          </p>
          <div className="inline-block mt-1 px-2.5 py-1 rounded bg-amber-100 text-amber-900 text-[10px] font-mono font-bold">
            payment_status = COD_PENDING
          </div>
        </div>
      )}

      {/* Processing State */}
      {isProcessing && (
        <div className="p-3 rounded-xl bg-gray-900 text-white text-center space-y-1.5 animate-in fade-in duration-150">
          <div className="flex items-center justify-center gap-2 text-xs font-bold">
            <Sparkles className="h-4 w-4 animate-spin text-amber-400" />
            <span>{processingStage}</span>
          </div>
          <p className="text-[10px] text-gray-400">Please do not refresh or close this window</p>
        </div>
      )}
    </div>
  );

  // If invoked as a modal popup
  if (onClose && !disabled) {
    if (!isOpen) return null;
    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-step-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
      >
        <div className="relative w-full max-w-lg my-6 rounded-3xl border border-gray-200 bg-white p-5 sm:p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h2 id="payment-step-title" className="font-extrabold text-base text-gray-900">
              Payment Gateway
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="grid h-8 w-8 place-items-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          {content}
        </div>
      </div>
    );
  }

  // Otherwise return inline
  return content;
}
