import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { getCurrentRole, getCurrentUser } from "@/lib/auth";

export const Route = createFileRoute("/dashboard/vendor")({
  beforeLoad: async () => {
    if (typeof window === "undefined") {
      return;
    }
    const role = await getCurrentRole();
    const user = await getCurrentUser();
    if (!role || role === "customer" || !user) {
      throw redirect({ to: "/vendor/login", search: { redirect: "/dashboard/vendor" } });
    }
    if (role === "SUPER_ADMIN" || role === "super_admin" || role === "ADMIN" || role === "admin") {
      throw redirect({ to: "/admin/$id", params: { id: user.id }, search: { tab: "overview" } });
    }
    let tab = "overview";
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search);
      tab = p.get("tab") || "overview";
    }
    throw redirect({
      to: "/vendor/$id",
      params: { id: user.id },
      search: { tab: tab as any },
    });
  },
  component: DashboardVendorRedirect,
});

function DashboardVendorRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    async function resolveAndRedirect() {
      let user: any = null;
      let role: any = null;

      try {
        const local = localStorage.getItem("riderzpro_auth_user");
        if (local) {
          user = JSON.parse(local);
          role = user?.role;
        }
      } catch {}

      if (!user || !role) {
        try {
          role = await getCurrentRole();
          user = await getCurrentUser();
        } catch {}
      }

      if (!isMounted) return;

      if (!role || role === "customer" || !user) {
        navigate({ to: "/vendor/login", search: { redirect: "/dashboard/vendor" } });
        return;
      }

      if (role === "SUPER_ADMIN" || role === "super_admin" || role === "ADMIN" || role === "admin") {
        navigate({ to: "/admin/$id", params: { id: user.id || "adm_super_01" }, search: { tab: "overview" } });
        return;
      }

      const p = new URLSearchParams(window.location.search);
      const tab = (p.get("tab") || "overview") as any;
      navigate({
        to: "/vendor/$id",
        params: { id: user.id },
        search: { tab },
      });
    }

    resolveAndRedirect();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950">
      <div className="flex flex-col items-center gap-3 text-center p-6">
        <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">Opening vendor dashboard...</p>
      </div>
    </div>
  );
}
