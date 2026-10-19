import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { isMobileDevice } from "@/lib/native/app";
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
  const navigate = useNavigate();

  useEffect(() => {
    if (isMobileDevice()) {
      navigate({ to: "/app", replace: true });
    }
  }, [navigate]);

  if (typeof window !== "undefined" && isMobileDevice()) {
    return null;
  }

  return (
    <VendorRouteGuard allowPending={true}>
      <OnboardingScreen />
    </VendorRouteGuard>
  );
}

