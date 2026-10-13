import React from "react";
import { CheckCircle2, Clock, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TimelineStep {
  title: string;
  description?: string;
  time?: string;
  status: "complete" | "current" | "upcoming";
}

export interface TimelineProps {
  steps: TimelineStep[];
  className?: string;
}

export function Timeline({ steps, className }: TimelineProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {steps.map((step, idx) => {
        const isLast = idx === steps.length - 1;

        return (
          <div key={step.title} className="relative flex gap-3.5">
            {/* Connecting Vertical Line */}
            {!isLast && (
              <span
                className={cn(
                  "absolute left-4 top-8 -bottom-3 w-0.5",
                  step.status === "complete" ? "bg-emerald-300" : "bg-gray-200"
                )}
                aria-hidden="true"
              />
            )}

            {/* Icon Node */}
            <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
              {step.status === "complete" && (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              )}
              {step.status === "current" && (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-[#E31E24] border border-red-300 animate-pulse">
                  <Clock className="h-4 w-4" />
                </div>
              )}
              {step.status === "upcoming" && (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-[#9CA3AF] border border-[#E5E7EB]">
                  <Circle className="h-3 w-3" />
                </div>
              )}
            </div>

            {/* Content Details */}
            <div className="flex-1 pt-1">
              <div className="flex items-center justify-between">
                <p
                  className={cn(
                    "text-xs font-bold tracking-tight",
                    step.status === "complete" && "text-[#111111]",
                    step.status === "current" && "text-[#E31E24]",
                    step.status === "upcoming" && "text-[#6B7280]"
                  )}
                >
                  {step.title}
                </p>
                {step.time && <span className="text-[11px] text-[#6B7280] font-semibold tabular-nums">{step.time}</span>}
              </div>
              {step.description && <p className="mt-0.5 text-xs text-[#4B5563] font-medium leading-relaxed">{step.description}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
