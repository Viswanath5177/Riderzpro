import React from "react";
import { GlassCard } from "./GlassCard";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  subtext?: string;
  icon: React.ReactNode;
  sparklineData?: number[];
  color?: "red" | "orange" | "green" | "blue" | "violet";
}

export function StatCard({
  title,
  value,
  change,
  isPositive = true,
  subtext,
  icon,
  sparklineData = [12, 19, 15, 27, 24, 38, 32, 45],
  color = "red",
}: StatCardProps) {
  // Generate simple sparkline SVG path
  const min = Math.min(...sparklineData);
  const max = Math.max(...sparklineData);
  const range = max - min || 1;
  const width = 80;
  const height = 30;

  const points = sparklineData
    .map((val, idx) => {
      const x = (idx / (sparklineData.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 6) - 3;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <GlassCard hoverEffect className="p-5 flex flex-col justify-between bg-white border-[#E5E7EB] shadow-xs hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#4B5563]">{title}</p>
          <p className="mt-2 font-display text-3xl font-extrabold tracking-tight tabular-nums text-[#111111]">
            {value}
          </p>
        </div>

        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-2xl border shadow-2xs",
            color === "red" && "border-red-200 bg-red-50 text-[#E31E24]",
            color === "orange" && "border-amber-200 bg-amber-50 text-amber-600",
            color === "green" && "border-emerald-200 bg-emerald-50 text-emerald-600",
            color === "blue" && "border-sky-200 bg-sky-50 text-sky-600",
            color === "violet" && "border-purple-200 bg-purple-50 text-purple-600"
          )}
        >
          {icon}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between pt-2 border-t border-[#E5E7EB]">
        <div className="flex items-center gap-1.5">
          {change && (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-bold border",
                isPositive
                  ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                  : "bg-red-50 text-red-700 border-red-300"
              )}
            >
              {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              <span>{change}</span>
            </span>
          )}
          {subtext && <span className="text-xs font-medium text-[#6B7280]">{subtext}</span>}
        </div>

        {/* Mini SVG Sparkline */}
        <div className="shrink-0">
          <svg width={width} height={height} className="overflow-visible">
            <polyline
              fill="none"
              stroke={isPositive ? "#16a34a" : "#dc2626"}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
          </svg>
        </div>
      </div>
    </GlassCard>
  );
}
