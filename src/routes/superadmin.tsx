import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { AdminRouteGuard } from "@/lib/adminAuth";
import { AdminStoreProvider } from "@/mocks/admin/adminStore";
import { AdminLayout } from "@/components/admin/layout/AdminLayout";
import { Skeleton } from "@/components/admin/glass/Skeleton";
import { ShieldAlert, ArrowRight, Store, Box, CheckCircle2, Crown, Sparkles } from "lucide-react";
import { getCurrentRole } from "@/lib/auth";

const DashboardScreen = lazy(() =>
  import("@/components/admin/screens/DashboardScreen").then((m) => ({
    default: m.DashboardScreen,
  }))
);

export const Route = createFileRoute("/superadmin")({
  beforeLoad: async () => {
    if (typeof window === "undefined") {
      return;
    }
    const role = await getCurrentRole();
    if (!role) {
      throw redirect({ to: "/login", search: { redirect: "/superadmin" } });
    }
    if (role === "PRODUCT_ADMIN" || role === "SELLER_ADMIN") {
      throw redirect({ to: "/admin" });
    }
    if (role === "seller") {
      throw redirect({ to: "/dashboard/vendor" });
    }
    if (role !== "admin" && role !== "SUPER_ADMIN" && role !== "SUPPORT_ADMIN") {
      throw redirect({ to: "/dashboard/customer" });
    }
  },
  head: () => ({
    meta: [
      { title: "Super Admin Console — RiderzPro" },
      {
        name: "description",
        content: "Executive real-time operations console and platform governance for RiderzPro Super Administrators.",
      },
    ],
  }),
  component: SuperAdminRouteWrapper,
});

function SuperAdminRouteWrapper() {
  return (
    <AdminRouteGuard>
      <AdminStoreProvider>
        <AdminLayout>
          <div className="space-y-6">
            {/* Executive Super Administrator Hero Banner */}
            <div className="relative overflow-hidden rounded-3xl border border-red-500/20 bg-gradient-to-r from-red-950/40 via-[#12151f] to-[#0c101a] p-6 shadow-xl backdrop-blur-xl">
              <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-[#E31E24]/20 blur-3xl pointer-events-none" />
              
              <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#E31E24] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-sm shadow-red-500/30">
                      <Crown className="h-3 w-3" /> SUPER ADMINISTRATOR
                    </span>
                    <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-gray-300 border border-white/10">
                      Executive Platform Oversight
                    </span>
                  </div>

                  <h1 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-white">
                    Master Platform & Operations Console
                  </h1>
                  <p className="mt-1 text-xs sm:text-sm text-gray-300 max-w-2xl">
                    High-level ecosystem metrics: platform gross revenue, 100% fitment accuracy, multi-city dispatch velocity, and cross-department governance.
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-2.5">
                  <Link
                    to="/admin"
                    className="inline-flex items-center gap-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 px-4 py-2.5 text-xs font-bold text-white transition shadow-sm"
                  >
                    <Store className="h-4 w-4 text-[#E31E24]" />
                    <span>Combined Operations (/admin)</span>
                    <ArrowRight className="h-3.5 w-3.5 text-gray-400" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Executive Platform Dashboard */}
            <Suspense
              fallback={
                <div className="space-y-6">
                  <Skeleton className="h-32 w-full rounded-3xl" />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {[...Array(6)].map((_, i) => (
                      <Skeleton key={i} className="h-36 rounded-2xl" />
                    ))}
                  </div>
                  <Skeleton className="h-80 w-full rounded-3xl" />
                </div>
              }
            >
              <DashboardScreen />
            </Suspense>
          </div>
        </AdminLayout>
      </AdminStoreProvider>
    </AdminRouteGuard>
  );
}
