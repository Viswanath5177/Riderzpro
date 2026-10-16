import { createFileRoute, redirect } from "@tanstack/react-router";
import { getAdminUser } from "@/lib/adminAuth";

export const Route = createFileRoute("/admin/products")({
  beforeLoad: async () => {
    if (typeof window === "undefined") {
      return;
    }
    const adminUser = await getAdminUser();
    if (!adminUser) {
      throw redirect({ to: "/vendor/login", search: { redirect: "/admin" } });
    }
    throw redirect({
      to: "/admin/$id",
      params: { id: adminUser.id },
      search: { tab: "products" },
    });
  },
  component: () => null,
});
