import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Skeleton } from "@/components/admin/glass/Skeleton";

const RidersScreen = lazy(() =>
  import("@/components/admin/screens/RidersScreen").then((m) => ({
    default: m.RidersScreen,
  }))
);

export const Route = createFileRoute("/admin/riders")({
  head: () => ({
    meta: [
      { title: "Riders & Fleet Operations — RiderzPro Admin" },
      { name: "description", content: "Active hyperlocal dispatch fleet, live GPS radar and shift status." },
    ],
  }),
  component: () => (
    <Suspense fallback={<Skeleton className="h-[600px] w-full rounded-3xl" />}>
      <RidersScreen />
    </Suspense>
  ),
});
