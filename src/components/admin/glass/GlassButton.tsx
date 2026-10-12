import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "glass" | "secondary" | "destructive" | "ghost" | "outline";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  loading?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}

export const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  (
    {
      children,
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      loading = false,
      icon: Icon,
      disabled,
      ...props
    },
    ref
  ) => {
    const isSpinnerActive = isLoading || loading;

    return (
      <button
        ref={ref}
        disabled={disabled || isSpinnerActive}
        className={cn(
          "inline-flex items-center justify-center font-semibold transition-all cursor-pointer select-none active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50",
          // Sizing
          size === "sm" && "h-8 px-3 text-xs rounded-xl gap-1.5",
          size === "md" && "h-10 px-4 text-sm rounded-2xl gap-2",
          size === "lg" && "h-12 px-6 text-base rounded-2xl gap-2.5",
          size === "icon" && "h-9 w-9 rounded-xl p-0",
          // Variants
          variant === "primary" &&
            "bg-[#E31E24] hover:bg-[#CC181E] text-white shadow-xs border border-transparent",
          variant === "glass" &&
            "border border-[#E5E7EB] bg-white text-[#111111] hover:bg-gray-50 hover:border-gray-300 shadow-2xs",
          variant === "secondary" &&
            "bg-gray-100 text-[#111111] hover:bg-gray-200 border border-[#E5E7EB] shadow-2xs",
          variant === "destructive" &&
            "bg-red-600 hover:bg-red-700 text-white shadow-xs border border-transparent",
          variant === "outline" &&
            "border border-[#E5E7EB] bg-white text-[#111111] hover:bg-gray-50 shadow-2xs",
          variant === "ghost" &&
            "text-[#4B5563] hover:text-[#111111] hover:bg-gray-100",
          className
        )}
        {...props}
      >
        {isSpinnerActive ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-current" />
            <span>{typeof children === "string" ? "Processing..." : children}</span>
          </>
        ) : (
          <>
            {Icon && <Icon className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"} />}
            {children}
          </>
        )}
      </button>
    );
  }
);

GlassButton.displayName = "GlassButton";
