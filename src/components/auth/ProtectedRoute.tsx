import React, { useEffect } from "react";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { Zap } from "lucide-react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      const loc = router.state.location;
      const currentPath = loc.pathname + (loc.searchStr ? `?${loc.searchStr}` : "");
      navigate({
        to: "/auth",
        search: { redirect: currentPath } as any,
        replace: true,
      });
    }
  }, [loading, isAuthenticated, navigate, router]);

  if (loading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary animate-pulse">
            <Zap className="h-6 w-6 text-primary" fill="currentColor" />
          </div>
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-xs font-medium text-muted-foreground">Checking session...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
