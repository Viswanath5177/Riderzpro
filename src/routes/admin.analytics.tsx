import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Skeleton } from "@/components/admin/glass/Skeleton";

const AnalyticsScreen = lazy(() =>
  import("@/components/admin/screens/AnalyticsScreen").then((m) => ({
    default: m.AnalyticsScreen,
  }))
);

export const Route = createFileRoute("/admin/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics & SLA Reports — RiderzPro Admin" },
      { name: "description", content: "Gross merchandise value, delivery speed SLAs, cohort retention and category mix." },
    ],
  }),
  component: () => (
    <Suspense fallback={<Skeleton className="h-[600px] w-full rounded-3xl" />}>
      <AnalyticsScreen />
    </Suspense>
  ),
});
