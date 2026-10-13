import React from "react";
import { GlassCard } from "./GlassCard";
import { cn } from "@/lib/utils";

export interface ChartCardProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function ChartCard({ title, subtitle, action, children, className }: ChartCardProps) {
  return (
    <div className={cn("rounded-3xl border border-[#E5E7EB] bg-white p-6 flex flex-col justify-between shadow-xs", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5E7EB] pb-4 mb-4">
        <div>
          <h3 className="font-display text-base font-bold text-[#111111] tracking-tight">{title}</h3>
          {subtitle && <p className="text-xs text-[#4B5563] font-medium mt-0.5">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>

      <div className="flex-1 w-full min-h-[220px] min-w-0 overflow-hidden">{children}</div>
    </div>
  );
}

/**
 * Custom glass tooltip for Recharts components
 */
export function GlassTooltip({ active, payload, label, prefix = "", suffix = "" }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-3 shadow-xl text-xs text-[#111111]">
        {label && <p className="font-bold text-[#6B7280] border-b border-[#F3F4F6] pb-1 mb-1.5">{label}</p>}
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center gap-2 py-0.5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-[#4B5563] capitalize font-medium">{entry.name}:</span>
            <span className="font-bold tabular-nums text-[#111111]">
              {prefix}
              {typeof entry.value === "number" ? entry.value.toLocaleString("en-IN") : entry.value}
              {suffix}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}
