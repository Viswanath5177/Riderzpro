import { createFileRoute, Navigate } from "@tanstack/react-router";

export type LoginSearch = {
  redirect?: string;
};

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): LoginSearch => {
    const rawRedirect = search["redirect"];
    return {
      redirect: typeof rawRedirect === "string" ? rawRedirect : undefined,
    };
  },
  component: LoginRedirect,
});

function LoginRedirect() {
  const search = Route.useSearch();
  return <Navigate to="/auth" search={{ redirect: search.redirect }} replace />;
}
