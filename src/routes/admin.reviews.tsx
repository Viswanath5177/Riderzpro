import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Skeleton } from "@/components/admin/glass/Skeleton";

const ReviewsScreen = lazy(() =>
  import("@/components/admin/screens/ReviewsScreen").then((m) => ({
    default: m.ReviewsScreen,
  }))
);

export const Route = createFileRoute("/admin/reviews")({
  head: () => ({
    meta: [
      { title: "Review Moderation — RiderzPro Admin" },
      { name: "description", content: "Customer product reviews moderation, ratings feedback and sentiment." },
    ],
  }),
  component: () => (
    <Suspense fallback={<Skeleton className="h-[600px] w-full rounded-3xl" />}>
      <ReviewsScreen />
    </Suspense>
  ),
});
