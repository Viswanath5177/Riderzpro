import { createFileRoute, redirect } from "@tanstack/react-router";
import { isMobileDevice } from "@/lib/native/app";

export type LoginSearch = {
  redirect?: string;
  email?: string;
};

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): LoginSearch => {
    return {
      redirect: typeof search["redirect"] === "string" ? search["redirect"] : undefined,
      email: typeof search["email"] === "string" ? search["email"] : undefined,
    };
  },
  beforeLoad: async ({ search }) => {
    if (isMobileDevice()) {
      throw redirect({ to: "/app", search: { tab: "account" } });
    }
    // Permanently remove standalone /login page: redirect to home with customer login modal triggered
    const target = (search as any)?.redirect || "/dashboard/customer";
    throw redirect({
      to: "/",
      search: {
        openLogin: "customer",
        redirect: target,
      },
    });
  },
  component: () => null,
});
