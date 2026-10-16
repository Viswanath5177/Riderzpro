import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/super-admin/login")({
  beforeLoad: () => {
    throw redirect({ to: "/vendor/login", search: { redirect: "/superadmin" } });
  },
  component: () => null,
});
