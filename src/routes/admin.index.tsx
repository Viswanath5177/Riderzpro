import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Skeleton } from "@/components/admin/glass/Skeleton";

const DashboardScreen = lazy(() =>
  import("@/components/admin/screens/DashboardScreen").then((m) => ({
    default: m.DashboardScreen,
  }))
);

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Operations Console — RiderzPro Admin" },
      { name: "description", content: "Executive real-time operations console for RiderzPro." },
    ],
  }),
  component: AdminIndexPage,
});

function AdminIndexPage() {
  return (
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
  );
}
