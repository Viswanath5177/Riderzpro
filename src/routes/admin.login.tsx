import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/login")({
  validateSearch: (search: Record<string, unknown>): { redirect?: string } => ({
    redirect: typeof search["redirect"] === "string" ? search["redirect"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Redirecting to Login — RiderzPro" },
      { name: "description", content: "Redirecting to RiderzPro unified sign-in page." },
    ],
  }),
  component: AdminLoginRedirect,
});

function AdminLoginRedirect() {
  const search = Route.useSearch();
  const target = search.redirect || "/admin";
  return <Navigate to="/login" search={{ redirect: target }} replace />;
}
