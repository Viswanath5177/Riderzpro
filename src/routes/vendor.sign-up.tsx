import { createFileRoute } from "@tanstack/react-router";
import { VendorSignupFlow } from "@/components/vendor/VendorSignupFlow";

export const Route = createFileRoute("/vendor/sign-up")({
  head: () => ({
    meta: [
      { title: "Seller Registration & Business KYC — Riderzpro" },
      {
        name: "description",
        content: "Register as an EV parts vendor or verified automotive manufacturer on Riderzpro.",
      },
      { property: "og:title", content: "Seller Registration & Business KYC — Riderzpro" },
      { property: "og:description", content: "Sell electric vehicle batteries, spares, and accessories on Riderzpro." },
    ],
  }),
  component: VendorSignUpRouteComponent,
});

function VendorSignUpRouteComponent() {
  return <VendorSignupFlow />;
}
