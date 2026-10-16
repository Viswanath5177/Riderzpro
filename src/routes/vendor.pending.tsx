import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { isMobileDevice } from "@/lib/native/app";
import { VendorRouteGuard } from "@/lib/vendorAuth";
import { VendorPendingPage } from "@/components/vendor/VendorPendingPage";

export const Route = createFileRoute("/vendor/pending")({
  head: () => ({
    meta: [
      { title: "Verification Status & KYC SLA — RiderzPro" },
      { name: "description", content: "Track your RiderzPro seller application, KYC document review, and approvals." },
    ],
  }),
  component: VendorPendingRouteComponent,
});

function VendorPendingRouteComponent() {
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
      <VendorPendingPage />
    </VendorRouteGuard>
  );
}

