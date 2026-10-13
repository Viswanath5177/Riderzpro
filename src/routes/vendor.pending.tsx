import { createFileRoute } from "@tanstack/react-router";
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
  return (
    <VendorRouteGuard allowPending={true}>
      <VendorPendingPage />
    </VendorRouteGuard>
  );
}
