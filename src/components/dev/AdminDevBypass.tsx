import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

/**
 * DEV flag determining whether admin console entry points are rendered.
 * Strictly false in production builds unless VITE_SHOW_ADMIN_ENTRY is explicitly set to true.
 */
export const isDevAdminEnabled = Boolean(
  import.meta.env.DEV ||
    import.meta.env["VITE_SHOW_ADMIN_ENTRY"] === "true" ||
    (typeof window !== "undefined" &&
      (window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1"))
);

/**
 * Floating bypass pill deleted as per design cleanup.
 * Preserves optional keyboard shortcut Ctrl+Shift+A in dev mode.
 */
export function AdminDevBypass() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isDevAdminEnabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        (e.key === "A" || e.key === "a")
      ) {
        e.preventDefault();
        navigate({ to: "/login", search: { redirect: "/admin" } });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  return null;
}

/**
 * Development banner deleted as per design cleanup.
 */
export function AdminDevBanner() {
  return null;
}
