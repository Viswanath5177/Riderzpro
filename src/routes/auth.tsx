import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

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
    meta: [{ title: "Sign In — Riderzpro" }],
  }),
  component: AuthRouteComponent,
});

function AuthRouteComponent() {
  const search = Route.useSearch();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams();
    if (search.redirect) params.set("redirect", search.redirect);
    const qs = params.toString() ? `?${params.toString()}` : "";
    navigate({ to: `/login${qs}` as never });
  }, [search, navigate]);

  return null;
}
