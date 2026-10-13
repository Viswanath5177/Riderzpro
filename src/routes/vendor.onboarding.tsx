import { createFileRoute } from "@tanstack/react-router";
import { VendorRouteGuard } from "@/lib/vendorAuth";
import { OnboardingScreen } from "@/components/vendor/onboarding/OnboardingScreen";

export const Route = createFileRoute("/vendor/onboarding")({
  head: () => ({
    meta: [
      { title: "Seller Onboarding Stepper — RiderzPro" },
      { name: "description", content: "Complete tax verification, pickup address, bank details and KYC review." },
    ],
  }),
  component: VendorOnboardingRouteComponent,
});

function VendorOnboardingRouteComponent() {
  return (
    <VendorRouteGuard allowPending={true}>
      <OnboardingScreen />
    </VendorRouteGuard>
  );
}
