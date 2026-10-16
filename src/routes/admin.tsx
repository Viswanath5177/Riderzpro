import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";
import { AdminRouteGuard } from "@/lib/adminAuth";
import { AdminStoreProvider } from "@/mocks/admin/adminStore";
import { AdminLayout } from "@/components/admin/layout/AdminLayout";

export const Route = createFileRoute("/admin")({
  component: AdminRouteWrapper,
});

function AdminRouteWrapper() {
  return (
    <AdminRouteGuard>
      <AdminStoreProvider>
        <AdminLayout>
          <Outlet />
        </AdminLayout>
      </AdminStoreProvider>
    </AdminRouteGuard>
  );
}
