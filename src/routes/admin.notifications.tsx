import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Skeleton } from "@/components/admin/glass/Skeleton";

const NotificationsScreen = lazy(() =>
  import("@/components/admin/screens/NotificationsScreen").then((m) => ({
    default: m.NotificationsScreen,
  }))
);

export const Route = createFileRoute("/admin/notifications")({
  head: () => ({
    meta: [
      { title: "Broadcast Communications — RiderzPro Admin" },
      { name: "description", content: "Targeted push notifications, SMS alerts and customer engagement campaigns." },
    ],
  }),
  component: () => (
    <Suspense fallback={<Skeleton className="h-[600px] w-full rounded-3xl" />}>
      <NotificationsScreen />
    </Suspense>
  ),
});
