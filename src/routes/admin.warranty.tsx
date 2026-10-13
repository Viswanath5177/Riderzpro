import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Skeleton } from "@/components/admin/glass/Skeleton";

const WarrantyScreen = lazy(() =>
  import("@/components/admin/screens/WarrantyScreen").then((m) => ({
    default: m.WarrantyScreen,
  }))
);

export const Route = createFileRoute("/admin/warranty")({
  head: () => ({
    meta: [
      { title: "Warranty & RMA Claims — RiderzPro Admin" },
      { name: "description", content: "Battery and spare parts warranty claims, defect verifications and RMA." },
    ],
  }),
  component: () => (
    <Suspense fallback={<Skeleton className="h-[600px] w-full rounded-3xl" />}>
      <WarrantyScreen />
    </Suspense>
  ),
});
