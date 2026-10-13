import React from "react";
import { Navigate, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { Zap } from "lucide-react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading, setUser } = useAuth();
  const currentPath = useRouterState({
    select: (s) => s.location.pathname + (s.location.searchStr ? `?${s.location.searchStr}` : ""),
  });

  // Check if active local session is present
  const hasLocalSession = typeof window !== "undefined" && Boolean(
    localStorage.getItem("riderzpro_auth_user") || localStorage.getItem("riderzpro_admin_session")
  );

  // Sync user from local storage if auth context is still synchronizing
  React.useEffect(() => {
    if (!isAuthenticated && typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("riderzpro_auth_user");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed?.id) setUser(parsed);
        }
      } catch {}
    }
  }, [isAuthenticated, setUser]);

  if (loading && !hasLocalSession) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary animate-pulse">
            <Zap className="h-6 w-6 text-primary" fill="currentColor" />
          </div>
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-xs font-medium text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !hasLocalSession) {
    return <Navigate to="/login" search={{ redirect: currentPath }} replace />;
  }

  return <>{children}</>;
}
