import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Skeleton } from "@/components/admin/glass/Skeleton";

const CustomersScreen = lazy(() =>
  import("@/components/admin/screens/CustomersScreen").then((m) => ({
    default: m.CustomersScreen,
  }))
);

export const Route = createFileRoute("/admin/customers")({
  head: () => ({
    meta: [
      { title: "Customers — RiderzPro Admin" },
      { name: "description", content: "Customer profiles, connected EV garage vehicles and order history." },
    ],
  }),
  component: () => (
    <Suspense fallback={<Skeleton className="h-[600px] w-full rounded-3xl" />}>
      <CustomersScreen />
    </Suspense>
  ),
});
