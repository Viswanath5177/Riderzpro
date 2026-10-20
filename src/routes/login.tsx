import { createFileRoute, redirect } from "@tanstack/react-router";
import { isMobileDevice } from "@/lib/native/app";

export type LoginSearch = {
  redirect?: string;
  email?: string;
  sessionExpired?: string | boolean;
};

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): LoginSearch => {
    return {
      redirect: typeof search["redirect"] === "string" ? search["redirect"] : undefined,
      email: typeof search["email"] === "string" ? search["email"] : undefined,
      sessionExpired: search["sessionExpired"] ? String(search["sessionExpired"]) : undefined,
    };
  },
  beforeLoad: async ({ search }) => {
    if (isMobileDevice()) {
      throw redirect({ to: "/app", search: { tab: "account" } });
    }

    // If already authenticated and not explicitly redirected for session expiration, redirect to target
    if (typeof window !== "undefined" && !search.sessionExpired) {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
          headers: { "X-Passive-Poll": "true" },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            const target = search.redirect || (data.role === "seller" ? `/vendor/${data.user.id}` : "/dashboard/customer");
            throw redirect({ to: target as any });
          }
        }
      } catch (e: any) {
        if (e?.to) throw e;
      }
    }

    // Redirect to home with customer login modal triggered
    const target = search.redirect || "/dashboard/customer";
    throw redirect({
      to: "/",
      search: {
        openLogin: "customer",
        redirect: target,
        sessionExpired: search.sessionExpired ? "true" : undefined,
      },
    });
  },
  component: () => null,
});
