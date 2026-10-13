import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Skeleton } from "@/components/admin/glass/Skeleton";

const OrdersScreen = lazy(() =>
  import("@/components/admin/screens/OrdersScreen").then((m) => ({
    default: m.OrdersScreen,
  }))
);

export const Route = createFileRoute("/admin/orders")({
  head: () => ({
    meta: [
      { title: "Orders Management — RiderzPro Admin" },
      { name: "description", content: "Hyperlocal orders tracking, fitment validation and dispatch routing." },
    ],
  }),
  component: () => (
    <Suspense fallback={<Skeleton className="h-[600px] w-full rounded-3xl" />}>
      <OrdersScreen />
    </Suspense>
  ),
});
