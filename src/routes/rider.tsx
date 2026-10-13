import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/rider")({
  component: RiderPortalLayout,
});

function RiderPortalLayout() {
  return <Outlet />;
}
