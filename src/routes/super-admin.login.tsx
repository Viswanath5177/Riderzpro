import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/super-admin/login")({
  beforeLoad: () => {
    throw redirect({ to: "/admin/login", search: { redirect: "/superadmin" } });
  },
  component: () => null,
});
