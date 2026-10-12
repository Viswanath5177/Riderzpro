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
      { title: "Customer Sign In — RiderzPro" },
      {
        name: "description",
        content: "Sign in to your RiderzPro customer portal to manage your EV garage, track live deliveries, and book certified technicians.",
      },
      { property: "og:title", content: "Customer Sign In — RiderzPro" },
      { property: "og:description", content: "Access your EV ownership & parts dashboard." },
    ],
  }),
  component: LoginRedirect,
});

function LoginRedirect() {
  const search = Route.useSearch();
  return <Navigate to="/auth" search={{ redirect: search.redirect }} replace />;
}
