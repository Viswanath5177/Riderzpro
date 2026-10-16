import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { getCurrentRole, getCurrentUser } from "@/lib/auth";

export const Route = createFileRoute("/dashboard/customer")({
  beforeLoad: async () => {
    if (typeof window === "undefined") {
      return;
    }
    const role = await getCurrentRole();
    const user = await getCurrentUser();
    if (!role || !user) {
      throw redirect({ to: "/login", search: { redirect: "/dashboard/customer" } });
    }
    if (role === "SUPER_ADMIN" || role === "super_admin" || role === "ADMIN" || role === "admin") {
      throw redirect({ to: "/admin/$id", params: { id: user.id }, search: { tab: "overview" } });
    }
    if (role === "seller") {
      throw redirect({ to: "/vendor/$id", params: { id: user.id }, search: { tab: "overview" } });
    }
    let tab = "overview";
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search);
      tab = p.get("tab") || "overview";
    }
    throw redirect({ to: "/$id", params: { id: user.id }, search: { tab: tab as any } });
  },
  component: DashboardCustomerRedirect,
});

function DashboardCustomerRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    async function resolveAndRedirect() {
      let user: any = null;
      let role: any = null;

      // 1. Instant check from localStorage
      try {
        const local = localStorage.getItem("riderzpro_auth_user");
        if (local) {
          user = JSON.parse(local);
          role = user?.role || "customer";
        }
      } catch {}

      // 2. Authoritative check from API if not in localStorage
      if (!user || !role) {
        try {
          role = await getCurrentRole();
          user = await getCurrentUser();
        } catch {}
      }

      if (!isMounted) return;

      if (!role || !user) {
        navigate({ to: "/login", search: { redirect: "/dashboard/customer" } });
        return;
      }

      if (role === "SUPER_ADMIN" || role === "super_admin" || role === "ADMIN" || role === "admin") {
        navigate({ to: "/admin/$id", params: { id: user.id || "adm_super_01" }, search: { tab: "overview" } });
        return;
      }

      if (role === "seller") {
        navigate({ to: "/vendor/$id", params: { id: user.id }, search: { tab: "overview" } });
        return;
      }

      const p = new URLSearchParams(window.location.search);
      const tab = (p.get("tab") || "overview") as any;
      navigate({ to: "/$id", params: { id: user.id }, search: { tab } });
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
        <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">Opening your customer dashboard...</p>
      </div>
    </div>
  );
}
