// src/components/checkout/MissingFieldsChecklist.tsx
import React from "react";
import { CircleDot, CheckCircle2 } from "lucide-react";

interface MissingFieldsChecklistProps {
  missingItems: string[];
}

export function MissingFieldsChecklist({ missingItems }: MissingFieldsChecklistProps) {
  if (missingItems.length === 0) return null;

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3.5 text-xs text-amber-900">
      <div className="flex items-center gap-1.5 font-bold text-amber-950 mb-2">
        <CircleDot className="h-3.5 w-3.5 text-amber-600" />
        <span>Required before placing order:</span>
      </div>
      <ul className="space-y-1">
        {missingItems.map((item, idx) => (
          <li key={idx} className="flex items-center gap-1.5 text-amber-800">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
