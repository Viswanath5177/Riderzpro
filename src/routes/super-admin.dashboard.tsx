import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/super-admin/dashboard")({
  beforeLoad: () => {
    throw redirect({ to: "/superadmin" });
  },
  component: () => null,
});
