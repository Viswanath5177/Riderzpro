import { createFileRoute, redirect } from "@tanstack/react-router";
import { getCurrentRole, getCurrentUser } from "@/lib/auth";
import { isMobileDevice } from "@/lib/native/app";

export const Route = createFileRoute("/dashboard/vendor")({
  beforeLoad: async () => {
    if (typeof window === "undefined") {
      return;
    }
    if (isMobileDevice()) {
      throw redirect({ to: "/app" });
    }
    const role = await getCurrentRole();
    const user = await getCurrentUser();
    if (!role || !user) {
      throw redirect({ to: "/login", search: { redirect: "/dashboard/vendor" } });
    }
    if (role === "SUPER_ADMIN" || role === "super_admin" || role === "ADMIN" || role === "admin") {
      throw redirect({ to: "/admin/$id", params: { id: user.id }, search: { tab: "overview" } });
    }
    if (role === "customer") {
      throw redirect({ to: "/$id", params: { id: user.id }, search: { tab: "overview" } });
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
  component: () => null,
});
