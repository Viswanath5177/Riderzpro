import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Skeleton } from "@/components/admin/glass/Skeleton";

const TeamScreen = lazy(() =>
  import("@/components/admin/screens/TeamScreen").then((m) => ({
    default: m.TeamScreen,
  }))
);

export const Route = createFileRoute("/admin/team")({
  head: () => ({
    meta: [
      { title: "Team & Role Access — RiderzPro Admin" },
      { name: "description", content: "Platform operators, support executives, finance managers and granular permissions." },
    ],
  }),
  component: () => (
    <Suspense fallback={<Skeleton className="h-[600px] w-full rounded-3xl" />}>
      <TeamScreen />
    </Suspense>
  ),
});
