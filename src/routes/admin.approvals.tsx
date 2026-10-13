import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Skeleton } from "@/components/admin/glass/Skeleton";

const ProductApprovalsScreen = lazy(() =>
  import("@/components/admin/screens/ProductApprovalsScreen").then((m) => ({
    default: m.ProductApprovalsScreen,
  }))
);

export const Route = createFileRoute("/admin/approvals")({
  head: () => ({
    meta: [
      { title: "Product Approvals & Moderation — RiderzPro Admin" },
      { name: "description", content: "Review and moderate vendor catalog additions, EV fitment and price compliance." },
    ],
  }),
  component: () => (
    <Suspense fallback={<Skeleton className="h-[600px] w-full rounded-3xl" />}>
      <ProductApprovalsScreen />
    </Suspense>
  ),
});
