import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface GlassModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
}

export function GlassModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = "md",
  size,
  className,
}: GlassModalProps) {
  const effectiveMaxWidth = size || maxWidth;
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Glass Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/65 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.35, bounce: 0.1 }}
            className={cn(
              "relative z-10 w-full overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white p-6 text-[#111111] shadow-2xl",
              effectiveMaxWidth === "sm" && "max-w-sm",
              effectiveMaxWidth === "md" && "max-w-md",
              effectiveMaxWidth === "lg" && "max-w-lg",
              effectiveMaxWidth === "xl" && "max-w-xl",
              effectiveMaxWidth === "2xl" && "max-w-2xl",
              className
            )}
          >
            <div className="flex items-start justify-between gap-4 border-b border-[#E5E7EB] pb-4">
              <div>
                {title && <h3 className="font-display text-xl font-bold tracking-tight text-[#111111]">{title}</h3>}
                {description && <p className="mt-1 text-xs text-[#4B5563] font-medium">{description}</p>}
              </div>
              <button
                onClick={onClose}
                aria-label="Close modal"
                className="rounded-full p-1.5 text-[#6B7280] transition hover:bg-gray-100 hover:text-[#111111] cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
