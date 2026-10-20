import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { useAuth } from "@/lib/auth";

export function AIChatButton() {
  const { isAuthenticated } = useAuth();
  const isAiEnabled = import.meta.env.VITE_ENABLE_AI_COPILOT !== "false";

  // Assistant only appears after login
  if (!isAiEnabled || !isAuthenticated) {
    return null;
  }

  // Only show on Home, Shop, and Product screens.
  // Hide on Cart, Checkout, Orders, Tracking, Profile, Login.
  const isAllowedScreen = (() => {
    if (typeof window !== "undefined") {
      const p = window.location.pathname;
      if (p === "/" || p === "/shop" || p.startsWith("/product")) {
        return true;
      }
      return false;
    }
    return true;
  })();

  if (!isAllowedScreen) {
    return null;
  }

  return (
    <Link
      to="/assistant"
      aria-label="Ask assistant"
      title="Ask assistant"
      className="fixed right-4 bottom-[calc(var(--nav-h,56px)+12px+env(safe-area-inset-bottom,0px))] md:bottom-6 md:right-6 z-[55] h-12 w-12 min-w-12 min-h-12 rounded-full grid place-items-center bg-[#111111] hover:bg-black text-white shadow-lg active:scale-95 transition-transform cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500"
    >
      <Sparkles className="h-5 w-5 text-white" />
    </Link>
  );
}
