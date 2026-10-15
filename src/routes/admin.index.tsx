import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Skeleton } from "@/components/admin/glass/Skeleton";

const CombinedOperationsScreen = lazy(() =>
  import("@/components/admin/screens/CombinedOperationsScreen").then((m) => ({
    default: m.CombinedOperationsScreen,
  }))
);

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Operations Console — RiderzPro Admin" },
      { name: "description", content: "Unified Seller KYC Verification and Product Catalog Moderation Console." },
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-3xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-80 w-full rounded-3xl" />
            <Skeleton className="h-80 w-full rounded-3xl" />
          </div>
        </div>
      }
    >
      <CombinedOperationsScreen />
    </Suspense>
  );
}
