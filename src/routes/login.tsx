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
  head: () => ({
    meta: [
      { title: "Customer Sign In & Registration — RiderzPro" },
      {
        name: "description",
        content: "Sign in or create your RiderzPro account to manage your electric vehicle garage, order verified spare parts, and book certified doorstep EV service.",
      },
      { property: "og:title", content: "Customer Sign In & Registration — RiderzPro" },
      { property: "og:description", content: "Access your EV ownership, spares, and service dashboard." },
    ],
  }),
  component: LoginRedirect,
});

function LoginRedirect() {
  const search = Route.useSearch();
  return <Navigate to="/auth" search={{ redirect: search.redirect }} replace />;
}
