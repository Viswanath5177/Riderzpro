import React from "react";
import { GlassModal } from "./GlassModal";
import { GlassButton } from "./GlassButton";
import { AlertTriangle } from "lucide-react";

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "destructive" | "primary";
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "destructive",
}: ConfirmDialogProps) {
  return (
    <GlassModal isOpen={isOpen} onClose={onClose} maxWidth="sm">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/15 text-red-500 border border-red-500/30 mb-4">
          <AlertTriangle className="h-6 w-6" />
        </div>

        <h3 className="font-display text-lg font-bold text-[#111111]">{title}</h3>
        <p className="mt-2 text-xs text-[#4B5563] font-medium leading-relaxed">{description}</p>

        <div className="mt-6 flex w-full gap-3">
          <GlassButton variant="secondary" className="flex-1" onClick={onClose}>
            {cancelLabel}
          </GlassButton>
          <GlassButton
            variant={variant}
            className="flex-1"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmLabel}
          </GlassButton>
        </div>
      </div>
    </GlassModal>
  );
}
