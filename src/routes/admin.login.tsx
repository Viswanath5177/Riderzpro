import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/login")({
  beforeLoad: ({ search }: { search: Record<string, unknown> }) => {
    const rawRedirect = search["redirect"];
    const dest = typeof rawRedirect === "string" && !rawRedirect.includes("/login")
      ? rawRedirect
      : "/admin";
    throw redirect({ to: "/vendor/login", search: { redirect: dest } });
  },
  component: () => null,
});
