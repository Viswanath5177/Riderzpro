import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Skeleton } from "@/components/admin/glass/Skeleton";

const ProductsScreen = lazy(() =>
  import("@/components/admin/screens/ProductsScreen").then((m) => ({
    default: m.ProductsScreen,
  }))
);

export const Route = createFileRoute("/admin/products")({
  head: () => ({
    meta: [
      { title: "Products & Inventory — RiderzPro Admin" },
      { name: "description", content: "EV spare parts catalog, pricing, SKU inventory and compatibility fitment." },
    ],
  }),
  component: () => (
    <Suspense fallback={<Skeleton className="h-[600px] w-full rounded-3xl" />}>
      <ProductsScreen />
    </Suspense>
  ),
});
