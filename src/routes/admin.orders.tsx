import { createFileRoute } from "@tanstack/react-router";
import { AdminRouteGuard } from "@/lib/adminAuth";
import { AdminOrdersBoard } from "@/components/admin/AdminOrdersBoard";

export const Route = createFileRoute("/admin/orders")({
  head: () => ({
    meta: [
      { title: "Live Orders Operations Board — RiderzPro Admin" },
      {
        name: "description",
        content:
          "Real-time orders operations console, fulfillment tracking, and courier dispatch oversight.",
      },
    ],
  }),
  component: AdminOrdersRoute,
});

function AdminOrdersRoute() {
  return (
    <AdminRouteGuard>
      <div className="min-h-screen bg-[#F6F7F9] p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <AdminOrdersBoard />
        </div>
      </div>
    </AdminRouteGuard>
  );
}
