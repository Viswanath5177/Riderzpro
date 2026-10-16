// src/components/checkout/PaymentStepSlot.tsx
import React from "react";

export interface PaymentStepSlotProps {
  orderId?: string;
  amountPaise?: number;
  paymentMethod?: "UPI" | "CARD" | "COD";
  onPaymentComplete?: (result: { success: boolean; transactionId?: string }) => void;
}

/**
 * Empty labelled slot component for Sathwik's <PaymentStep> integration.
 */
export function PaymentStepSlot({ orderId, amountPaise, paymentMethod }: PaymentStepSlotProps) {
  return (
    <div
      data-testid="payment-step-slot"
      className="hidden border border-dashed border-gray-300 rounded-xl p-4 text-xs text-gray-500"
    >
      {/* Slot for Sathwik's PaymentStep component */}
      <span>
        PaymentStepSlot ({paymentMethod} - Order {orderId || "new"})
      </span>
    </div>
  );
}
