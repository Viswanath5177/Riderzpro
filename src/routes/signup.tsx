import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "@/components/auth/AuthPage";

export type SignUpSearch = {
  redirect?: string;
};

export const Route = createFileRoute("/signup")({
  validateSearch: (search: Record<string, unknown>): SignUpSearch => {
    const rawRedirect = search["redirect"];
    return {
      redirect: typeof rawRedirect === "string" ? rawRedirect : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Create account — Riderzpro" },
      { name: "description", content: "Sign up for a customer account on Riderzpro." },
      { property: "og:title", content: "Create account — Riderzpro" },
      { property: "og:description", content: "Get parts that fit, delivered by riders you can track." },
    ],
  }),
  component: SignUpRouteComponent,
});

function SignUpRouteComponent() {
  const search = Route.useSearch();
  return <AuthPage initialMode="signup" redirectPath={search.redirect} />;
}
