import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Skeleton } from "@/components/admin/glass/Skeleton";

const FitmentScreen = lazy(() =>
  import("@/components/admin/screens/FitmentScreen").then((m) => ({
    default: m.FitmentScreen,
  }))
);

export const Route = createFileRoute("/admin/fitment")({
  head: () => ({
    meta: [
      { title: "Bikes & Fitment Matrix — RiderzPro Admin" },
      { name: "description", content: "EV two-wheeler specifications and parts-vs-bikes compatibility mapping." },
    ],
  }),
  component: () => (
    <Suspense fallback={<Skeleton className="h-[600px] w-full rounded-3xl" />}>
      <FitmentScreen />
    </Suspense>
  ),
});
