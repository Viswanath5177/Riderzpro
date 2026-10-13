import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Skeleton } from "@/components/admin/glass/Skeleton";

const OffersScreen = lazy(() =>
  import("@/components/admin/screens/OffersScreen").then((m) => ({
    default: m.OffersScreen,
  }))
);

export const Route = createFileRoute("/admin/offers")({
  head: () => ({
    meta: [
      { title: "Offers & Coupons — RiderzPro Admin" },
      { name: "description", content: "Promotional discount codes, coupon usage limits and app promo banners." },
    ],
  }),
  component: () => (
    <Suspense fallback={<Skeleton className="h-[600px] w-full rounded-3xl" />}>
      <OffersScreen />
    </Suspense>
  ),
});
