import { createFileRoute } from "@tanstack/react-router";
import { VendorSignupFlow } from "@/components/vendor/VendorSignupFlow";

export const Route = createFileRoute("/vendor-sign-up")({
  head: () => ({
    meta: [
      { title: "Vendor Onboarding & Business Verification — Riderzpro" },
      {
        name: "description",
        content: "Register your business to sell automotive and electric vehicle accessories, batteries, and genuine spares on Riderzpro.",
      },
      { property: "og:title", content: "Vendor Onboarding & Business Verification — Riderzpro" },
      { property: "og:description", content: "Dedicated vendor registration portal for automotive accessories and parts sellers." },
    ],
  }),
  component: VendorSignUpRouteComponent,
});

function VendorSignUpRouteComponent() {
  return <VendorSignupFlow />;
}
