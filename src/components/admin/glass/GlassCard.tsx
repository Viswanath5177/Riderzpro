import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  intensity?: "normal" | "subtle" | "heavy";
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ children, className, hoverEffect = false, intensity = "normal", ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={hoverEffect ? { y: -3, transition: { duration: 0.2 } } : undefined}
        className={cn(
          "admin-glass-card relative overflow-hidden rounded-3xl border transition-all duration-300",
          // RiderzPro Clean White Card Aesthetic (matching landing page)
          intensity === "normal" &&
            "border-[#E5E7EB] bg-white/95 text-[#111111] shadow-xs hover:shadow-md backdrop-blur-xl dark:border-white/10 dark:bg-[#121826]/90 dark:text-white",
          intensity === "subtle" &&
            "border-[#E5E7EB]/80 bg-white/80 text-[#111111] shadow-2xs backdrop-blur-lg dark:border-white/10 dark:bg-[#0e1422]/80 dark:text-white",
          intensity === "heavy" &&
            "border-[#E5E7EB] bg-white text-[#111111] shadow-lg backdrop-blur-2xl dark:border-white/15 dark:bg-[#161e30] dark:text-white",
          // Inner top gradient highlight
          "before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-black/5 before:to-transparent dark:before:via-white/20",
          hoverEffect && "hover:border-[#E31E24]/30 hover:shadow-lg hover:shadow-red-500/5",
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

GlassCard.displayName = "GlassCard";
