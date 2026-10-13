import React from "react";
import { GlassCard } from "./GlassCard";
import { GlassButton } from "./GlassButton";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon = <Sparkles className="h-8 w-8 text-[#9CA3AF]" />,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <GlassCard className={cn("p-10 text-center flex flex-col items-center justify-center bg-white border-[#E5E7EB]", className)}>
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-[#E5E7EB] bg-gray-50 shadow-2xs mb-4">
        {icon}
      </div>
      <h3 className="font-display text-base font-extrabold text-[#111111]">{title}</h3>
      <p className="mt-1 max-w-sm text-xs font-medium text-[#4B5563] leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <GlassButton variant="primary" size="sm" onClick={onAction} className="mt-5">
          {actionLabel}
        </GlassButton>
      )}
    </GlassCard>
  );
}

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-2xl bg-gray-100 border border-[#E5E7EB]",
        className
      )}
      {...props}
    />
  );
}
