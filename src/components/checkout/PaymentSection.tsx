// src/components/checkout/PaymentSection.tsx
import React from "react";
import { Smartphone, CreditCard, Banknote, AlertCircle, Check } from "lucide-react";
import { COD_MAX_PAISE } from "../../lib/checkoutConfig";
import { formatPaise } from "../../lib/api/orders";

export type PaymentMethod = "UPI" | "CARD" | "COD";

interface PaymentSectionProps {
  selected: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
  orderTotalPaise: number;
}

export function PaymentSection({ selected, onChange, orderTotalPaise }: PaymentSectionProps) {
  const isCodDisabled = COD_MAX_PAISE !== null && orderTotalPaise > COD_MAX_PAISE;

  const methods: {
    id: PaymentMethod;
    title: string;
    description: string;
    icon: typeof Smartphone;
    disabled?: boolean;
    disabledReason?: string;
  }[] = [
    {
      id: "UPI",
      title: "UPI",
      description: "Pay online using any UPI app.",
      icon: Smartphone,
    },
    {
      id: "CARD",
      title: "Card",
      description: "Pay securely with a debit or credit card.",
      icon: CreditCard,
    },
    {
      id: "COD",
      title: "Cash on Delivery (COD)",
      description: "Pay in cash when the order arrives.",
      icon: Banknote,
      disabled: isCodDisabled,
      disabledReason: isCodDisabled
        ? `COD is not available for orders above ${formatPaise(COD_MAX_PAISE!)}`
        : undefined,
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs">
      <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
        <div className="grid h-7 w-7 place-items-center rounded-lg bg-red-50 text-[#E31E24]">
          <CreditCard className="h-4 w-4" />
        </div>
        <h2 className="text-sm font-bold text-gray-900 font-display">3. Payment Method</h2>
      </div>

      <div className="mt-4 grid gap-3">
        {methods.map((m) => {
          const isSelected = selected === m.id;
          const Icon = m.icon;

          return (
            <div
              key={m.id}
              onClick={() => {
                if (!m.disabled) onChange(m.id);
              }}
              className={`relative flex items-center justify-between p-4 rounded-xl border transition cursor-pointer ${
                m.disabled
                  ? "border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed"
                  : isSelected
                    ? "border-[#E31E24] bg-red-50/20 ring-1 ring-[#E31E24]"
                    : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`mt-0.5 grid h-9 w-9 place-items-center rounded-lg shrink-0 ${
                    isSelected ? "bg-[#E31E24] text-white" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-gray-900">{m.title}</p>
                    {isSelected && (
                      <span className="text-[10px] font-bold uppercase bg-red-100 text-[#E31E24] px-1.5 py-0.5 rounded">
                        Selected
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{m.description}</p>
                  {m.disabledReason && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {m.disabledReason}
                    </p>
                  )}
                </div>
              </div>

              <div
                className={`grid h-5 w-5 place-items-center rounded-full border shrink-0 transition ${
                  isSelected
                    ? "border-[#E31E24] bg-[#E31E24] text-white"
                    : "border-gray-300 bg-white"
                }`}
              >
                {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
              </div>
            </div>
          );
        })}
      </div>

      {/* COD detailed message */}
      {selected === "COD" && (
        <div className="mt-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
          <Banknote className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-900">
              Pay {formatPaise(orderTotalPaise)} in cash to the delivery partner when your order
              arrives.
            </p>
            <p className="text-amber-700 mt-0.5">Please keep the exact amount ready.</p>
          </div>
        </div>
      )}
    </div>
  );
}
