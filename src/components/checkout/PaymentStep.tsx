// src/components/checkout/PaymentStep.tsx
// Owned by Sathwik. Placed by Checkout flow.
import React, { useState } from "react";
import {
  Smartphone,
  CreditCard,
  Banknote,
  ShieldCheck,
  Lock,
  QrCode,
  CheckCircle2,
  Sparkles,
  Info,
} from "lucide-react";
import { formatPaise } from "@/lib/api/orders";

export type PaymentMethod = "UPI" | "CARD" | "COD";

export interface PaymentStepProps {
  method: PaymentMethod;
  onChangeMethod: (method: PaymentMethod) => void;
  totalPaise: number;
  disabled?: boolean;
}

/**
 * Sathwik's PaymentStep component:
 * Integrates Razorpay Test mode (UPI / Cards) and Doorstep COD rails.
 */
export function PaymentStep({
  method,
  onChangeMethod,
  totalPaise,
  disabled = false,
}: PaymentStepProps) {
  // UPI State
  const [selectedUpiApp, setSelectedUpiApp] = useState("gpay");
  const [upiId, setUpiId] = useState("");

  // Card State (Razorpay test values)
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardHolder, setCardHolder] = useState("");

  const fillTestCard = () => {
    setCardNumber("4111 2222 3333 4444");
    setCardExpiry("12/28");
    setCardCvv("999");
    setCardHolder("RiderzPro Test Rider");
  };

  return (
    <div
      data-testid="sathwik-payment-step"
      className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs space-y-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-lg bg-red-50 text-[#E31E24]">
            <CreditCard className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900 font-display">
              3. Payment Method & Gateways
            </h2>
            <p className="text-[11px] text-gray-500">
              Razorpay Test Sandbox · Instant Verification · Cash on Delivery
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>Razorpay 256-Bit SSL</span>
        </div>
      </div>

      {/* Payment Method Selector Tabs */}
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChangeMethod("UPI")}
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
          disabled={disabled}
          onClick={() => onChangeMethod("CARD")}
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
          disabled={disabled}
          onClick={() => onChangeMethod("COD")}
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
            <span className="font-bold text-gray-800">Select Instant UPI App</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> Zero Gateway Fee
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
                placeholder="username@okaxis or mobile@upi"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="flex-1 rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 outline-none focus:border-[#E31E24] focus:ring-1 focus:ring-[#E31E24]"
              />
            </div>
          </div>
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
              className="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-100 text-[#E31E24] text-[11px] font-bold hover:bg-red-200 transition cursor-pointer"
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
            <strong className="text-gray-900 font-extrabold">{formatPaise(totalPaise)}</strong>.
          </p>
        </div>
      )}
    </div>
  );
}
