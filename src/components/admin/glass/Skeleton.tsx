import React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "admin-skeleton animate-pulse rounded-xl bg-white/[0.08] backdrop-blur-md border border-white/10",
        className
      )}
      {...props}
    />
  );
}
