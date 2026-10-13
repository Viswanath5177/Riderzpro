import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "@/components/auth/AuthPage";

export type AuthSearch = {
  mode?: "signin" | "signup";
  redirect?: string;
};

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): AuthSearch => {
    const rawMode = search["mode"];
    const rawRedirect = search["redirect"];
    return {
      mode: rawMode === "signup" ? "signup" : rawMode === "signin" ? "signin" : undefined,
      redirect: typeof rawRedirect === "string" ? rawRedirect : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Sign in & Sign up — Riderzpro" },
      { name: "description", content: "Sign in or create your customer account on Riderzpro." },
      { property: "og:title", content: "Customer Account — Riderzpro" },
      { property: "og:description", content: "One account for EV parts, live tracking and garage fitment." },
    ],
  }),
  component: AuthRouteComponent,
});

function AuthRouteComponent() {
  const search = Route.useSearch();
  return <AuthPage initialMode={search.mode || "signin"} redirectPath={search.redirect} />;
}
