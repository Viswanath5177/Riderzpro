import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Skeleton } from "@/components/admin/glass/Skeleton";

const PaymentsScreen = lazy(() =>
  import("@/components/admin/screens/PaymentsScreen").then((m) => ({
    default: m.PaymentsScreen,
  }))
);

export const Route = createFileRoute("/admin/payments")({
  head: () => ({
    meta: [
      { title: "Payments & Payouts — RiderzPro Admin" },
      { name: "description", content: "Financial transactions, vendor payouts, rider disbursements and refunds." },
    ],
  }),
  component: () => (
    <Suspense fallback={<Skeleton className="h-[600px] w-full rounded-3xl" />}>
      <PaymentsScreen />
    </Suspense>
  ),
});
