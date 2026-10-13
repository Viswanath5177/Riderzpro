import React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface GlassSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: { value: string; label: string }[];
}

export const GlassSelect = React.forwardRef<HTMLSelectElement, GlassSelectProps>(
  ({ label, error, options, children, className, id, ...props }, ref) => {
    const selectId = id || (label ? `sel_${label.toLowerCase().replace(/\s+/g, "_")}` : undefined);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#374151]">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              "w-full appearance-none rounded-2xl border border-[#E5E7EB] bg-white px-3.5 py-2.5 pr-10 text-sm font-medium text-[#111111] shadow-2xs outline-none transition-all cursor-pointer",
              "focus:border-[#E31E24] focus:ring-2 focus:ring-red-500/20",
              "[&>option]:bg-white [&>option]:text-[#111111]",
              error && "border-red-500 focus:border-red-500",
              className
            )}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3.5 h-4 w-4 text-[#6B7280]" />
        </div>
        {error && <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>}
      </div>
    );
  }
);

GlassSelect.displayName = "GlassSelect";
