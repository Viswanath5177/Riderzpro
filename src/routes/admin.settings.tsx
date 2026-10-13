import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Skeleton } from "@/components/admin/glass/Skeleton";

const SettingsScreen = lazy(() =>
  import("@/components/admin/screens/SettingsScreen").then((m) => ({
    default: m.SettingsScreen,
  }))
);

export const Route = createFileRoute("/admin/settings")({
  head: () => ({
    meta: [
      { title: "System Settings — RiderzPro Admin" },
      { name: "description", content: "Platform policies, delivery geofencing, commission structures and taxation." },
    ],
  }),
  component: () => (
    <Suspense fallback={<Skeleton className="h-[600px] w-full rounded-3xl" />}>
      <SettingsScreen />
    </Suspense>
  ),
});
