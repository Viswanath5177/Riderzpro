// src/components/checkout/ServiceabilityBanner.tsx
import React from "react";
import { AlertCircle } from "lucide-react";
import { NOT_SERVICEABLE_MESSAGE } from "../../lib/checkoutConfig";

interface ServiceabilityBannerProps {
  show: boolean;
  message?: string;
}

export function ServiceabilityBanner({
  show,
  message = NOT_SERVICEABLE_MESSAGE,
}: ServiceabilityBannerProps) {
  if (!show) return null;

  return (
    <div className="rounded-xl border border-red-300 bg-red-50 p-3.5 text-xs text-red-700 flex items-start gap-2.5 shadow-2xs animate-in fade-in duration-150">
      <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
      <span className="font-semibold leading-relaxed">{message}</span>
    </div>
  );
}
