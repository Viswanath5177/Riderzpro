import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Skeleton } from "@/components/admin/glass/Skeleton";

const SupportScreen = lazy(() =>
  import("@/components/admin/screens/SupportScreen").then((m) => ({
    default: m.SupportScreen,
  }))
);

export const Route = createFileRoute("/admin/support")({
  head: () => ({
    meta: [
      { title: "Support Tickets — RiderzPro Admin" },
      { name: "description", content: "Customer and rider support tickets, dispatch disputes and resolutions." },
    ],
  }),
  component: () => (
    <Suspense fallback={<Skeleton className="h-[600px] w-full rounded-3xl" />}>
      <SupportScreen />
    </Suspense>
  ),
});
