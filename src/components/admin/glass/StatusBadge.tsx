import React from "react";
import { cn } from "@/lib/utils";

export interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
  className?: string;
}

export function StatusBadge({ status, size = "md", className }: StatusBadgeProps) {
  const normalized = status.toLowerCase();

  let colorClasses = "bg-gray-100 text-[#374151] border-gray-300 font-bold";

  if (["active", "approved", "delivered", "paid", "success", "resolved", "online", "vip"].includes(normalized)) {
    colorClasses = "bg-emerald-50 text-emerald-800 border-emerald-300 font-bold";
  } else if (["in transit", "delivering", "shipped"].includes(normalized)) {
    colorClasses = "bg-sky-50 text-sky-800 border-sky-300 font-bold";
  } else if (["dispatched", "processing", "pending", "pending review", "pending inspection", "in progress", "idle", "medium"].includes(normalized)) {
    colorClasses = "bg-amber-50 text-amber-900 border-amber-300 font-bold";
  } else if (["placed", "open", "invited"].includes(normalized)) {
    colorClasses = "bg-purple-50 text-purple-900 border-purple-300 font-bold";
  } else if (["cancelled", "refunded", "failed", "rejected", "blocked", "suspended", "low stock", "out of stock", "flagged", "high", "escalated"].includes(normalized)) {
    colorClasses = "bg-red-50 text-red-700 border-red-300 font-bold";
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border tracking-wide select-none shadow-2xs",
        size === "sm" ? "px-2.5 py-0.5 text-[11px]" : "px-3 py-1 text-xs",
        colorClasses,
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-90" />
      <span>{status}</span>
    </span>
  );
}
