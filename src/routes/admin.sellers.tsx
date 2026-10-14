import { createFileRoute } from "@tanstack/react-router";
import { AdminRouteGuard } from "@/lib/adminAuth";
import { AdminSellersBoard } from "@/components/admin/AdminSellersBoard";

export const Route = createFileRoute("/admin/sellers")({
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
