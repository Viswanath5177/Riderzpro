import { createFileRoute, redirect } from "@tanstack/react-router";
import { getCurrentUser } from "@/lib/auth";
import { getRiderApplication } from "@/lib/rider";

export const Route = createFileRoute("/dashboard/rider")({
  beforeLoad: async () => {
    const user = await getCurrentUser();
    if (!user) throw redirect({ to: "/login", search: { redirect: "/dashboard/rider" } as never });
    if (user.role !== "customer") throw redirect({ to: "/dashboard/admin" });
    const application = await getRiderApplication();
    if (!application) throw redirect({ to: "/rider/apply" });
    if (application.status !== "approved") throw redirect({ to: "/rider/status" });
    throw redirect({ to: "/rider/dashboard" });
  },
  head: () => ({ meta: [
    { title: "Rider dashboard — Riderzpro" },
    { name: "description", content: "Accept nearby EV parts deliveries, follow multi-pickup routes and track earnings." },
    { property: "og:title", content: "Rider dashboard — Riderzpro" },
    { property: "og:description", content: "Deliver EV parts with Riderzpro." },
  ] }),
  component: () => null,
});
