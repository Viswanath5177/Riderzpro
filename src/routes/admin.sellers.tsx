import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Skeleton } from "@/components/admin/glass/Skeleton";

const SellersScreen = lazy(() =>
  import("@/components/admin/screens/SellersScreen").then((m) => ({
    default: m.SellersScreen,
  }))
);

export const Route = createFileRoute("/admin/sellers")({
  head: () => ({
    meta: [
      { title: "Sellers & KYC Queue — RiderzPro Admin" },
      { name: "description", content: "Vendor KYC document verification, tier assignments and commission rates." },
    ],
  }),
  component: () => (
    <Suspense fallback={<Skeleton className="h-[600px] w-full rounded-3xl" />}>
      <SellersScreen />
    </Suspense>
  ),
});
