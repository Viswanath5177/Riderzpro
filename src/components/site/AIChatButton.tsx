import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export function AIChatButton() {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full right-0 mb-2 whitespace-nowrap rounded-lg bg-[#111111] px-3 py-1.5 text-xs font-semibold text-white shadow-lg animate-in fade-in zoom-in-95 duration-150 pointer-events-none">
          Ask AI Assistant
          <div className="absolute -bottom-1 right-5 h-2 w-2 rotate-45 bg-[#111111]" />
        </div>
      )}

      {/* Floating circular red button */}
      <Link
        to="/assistant"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        aria-label="Ask AI Automotive Assistant"
        className="flex h-13 w-13 items-center justify-center rounded-full bg-[#e11d2a] hover:bg-[#c91823] text-white shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-red-400/30"
      >
        <Sparkles className="h-6 w-6" />
      </Link>
    </div>
  );
}
