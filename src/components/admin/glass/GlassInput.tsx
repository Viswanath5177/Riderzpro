import React from "react";
import { cn } from "@/lib/utils";

export interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
  error?: string;
}

export const GlassInput = React.forwardRef<HTMLInputElement, GlassInputProps>(
  ({ label, icon, rightElement, error, className, id, ...props }, ref) => {
    const inputId = id || (label ? `inp_${label.toLowerCase().replace(/\s+/g, "_")}` : undefined);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#374151]">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="pointer-events-none absolute left-3.5 flex items-center justify-center text-[#6B7280]">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full rounded-2xl border border-[#E5E7EB] bg-white px-3.5 py-2.5 text-sm font-medium text-[#111111] placeholder:text-[#9CA3AF] shadow-2xs outline-none transition-all",
              "focus:border-[#E31E24] focus:ring-2 focus:ring-red-500/20",
              icon && "pl-10",
              rightElement && "pr-10",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500/30",
              className
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3.5 flex items-center justify-center">
              {rightElement}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>}
      </div>
    );
  }
);

GlassInput.displayName = "GlassInput";
