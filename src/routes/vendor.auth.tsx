import { createFileRoute } from "@tanstack/react-router";
import { VendorAuthPage } from "@/components/vendor/VendorAuthPage";

export type VendorAuthSearch = {
  mode?: "signin" | "signup";
  redirect?: string;
};

export const Route = createFileRoute("/vendor/auth")({
  validateSearch: (search: Record<string, unknown>): VendorAuthSearch => {
    const rawMode = search["mode"];
    const rawRedirect = search["redirect"];
    return {
      mode: rawMode === "signup" ? "signup" : rawMode === "signin" ? "signin" : undefined,
      redirect: typeof rawRedirect === "string" ? rawRedirect : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Vendor Sign In & Merchant Onboarding — RiderzPro" },
      { name: "description", content: "Sell EV batteries, fast chargers and spares on RiderzPro marketplace across India." },
      { property: "og:title", content: "Vendor Portal — RiderzPro" },
      { property: "og:description", content: "Direct access to EV riders, live deliveries and merchant settlements." },
    ],
  }),
  component: VendorAuthRouteComponent,
});

function VendorAuthRouteComponent() {
  const search = Route.useSearch();
  return <VendorAuthPage initialMode={search.mode || "signin"} redirectPath={search.redirect} />;
}
