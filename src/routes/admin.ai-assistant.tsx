import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Skeleton } from "@/components/admin/glass/Skeleton";

const AiAssistantScreen = lazy(() =>
  import("@/components/admin/screens/AiAssistantScreen").then((m) => ({
    default: m.AiAssistantScreen,
  }))
);

export const Route = createFileRoute("/admin/ai-assistant")({
  head: () => ({
    meta: [
      { title: "AI Assistant Telemetry — RiderzPro Admin" },
      { name: "description", content: "Customer EV assistant dialogue logs, resolution benchmarks and human handoffs." },
    ],
  }),
  component: () => (
    <Suspense fallback={<Skeleton className="h-[600px] w-full rounded-3xl" />}>
      <AiAssistantScreen />
    </Suspense>
  ),
});
