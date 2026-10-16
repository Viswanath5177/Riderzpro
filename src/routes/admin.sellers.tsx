import { createFileRoute, redirect } from "@tanstack/react-router";
import { getAdminUser, AdminRouteGuard } from "@/lib/adminAuth";
import { AdminSellersBoard } from "@/components/admin/AdminSellersBoard";
import { SHOW_ADMIN_SELLERS } from "@/components/admin/mockFlags";

export const Route = createFileRoute("/admin/sellers")({
  beforeLoad: async () => {
    if (SHOW_ADMIN_SELLERS) {
      return;
    }
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
      search: { tab: "vendors" },
    });
  },
  head: () => ({
    meta: [
      { title: "Sellers & KYC Operations — RiderzPro Admin" },
      {
        name: "description",
        content:
          "Merchant directory, KYC verification, GST compliance records, and store fulfillment hubs.",
      },
    ],
  }),
  component: AdminSellersRoute,
});

function AdminSellersRoute() {
  if (!SHOW_ADMIN_SELLERS) {
    return null;
  }

  return (
    <AdminRouteGuard>
      <div className="min-h-screen bg-[#F6F7F9] p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <AdminSellersBoard />
        </div>
      </div>
    </AdminRouteGuard>
  );
}
