import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface GlassDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  width?: "md" | "lg" | "xl" | "2xl";
  className?: string;
}

export function GlassDrawer({
  isOpen,
  onClose,
  title,
  description,
  children,
  width = "lg",
  className,
}: GlassDrawerProps) {
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
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Glass Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={cn(
                "relative flex w-screen flex-col border-l border-[#E5E7EB] bg-white text-[#111111] shadow-2xl",
                width === "md" && "max-w-md",
                width === "lg" && "max-w-lg",
                width === "xl" && "max-w-xl",
                width === "2xl" && "max-w-2xl",
                className
              )}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4 border-b border-[#E5E7EB] bg-gray-50/70 p-6">
                <div>
                  {title && <h3 className="font-display text-xl font-bold tracking-tight text-[#111111]">{title}</h3>}
                  {description && <p className="mt-1 text-xs text-[#4B5563] font-medium">{description}</p>}
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close drawer"
                  className="rounded-full p-2 text-[#6B7280] transition hover:bg-gray-100 hover:text-[#111111] cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto p-6">{children}</div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
