import { useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, MessageCircle, Phone, Star, Lock, AlertCircle, RefreshCw, Package, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/SiteLayout";
import { DeliveryMap } from "@/components/map/DeliveryMap";
import { TrackingStatusPanel } from "@/components/map/TrackingStatusPanel";
import { useDeliveryTracking } from "@/components/map/useDeliveryTracking";
import type { DeliveryTrackingData } from "@/components/map/types";
import { getProduct, getVendor, inr, riders } from "@/lib/data";
import { ORDER_STEPS, useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { DownloadInvoiceButton } from "@/components/common/DownloadInvoiceButton";

export const Route = createFileRoute("/track/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Track order ${params.id} — Riderzpro` },
      { name: "description", content: "Live tracking of your EV parts delivery." },
      { property: "og:title", content: `Track order ${params.id} — Riderzpro` },
      { property: "og:description", content: "Follow your rider live on the map." },
    ],
  }),
  component: Track,
});

function Track() {
  const { id } = Route.useParams();
  const { orders, updateOrderStatus, role, userProfile } = useStore();

  // Find linked order in client store
  const targetOrder = orders.find((x) => x.id === id || x.shipmentId === id);
  // Canonical ID: URL id maps directly to either Delivery.id or Delivery.order_id in FastAPI backend
  const effectiveDeliveryId = id || targetOrder?.shipmentId || targetOrder?.id;
  const effectiveUserId = userProfile?.phone || "9876543210";

  // Connect live real-time backend tracking via REST + WebSocket
  const {
    data: tracking,
    connectionState,
    isApproaching,
    isArrived,
    isDeviating,
    deviationDistance,
    deviationThreshold,
    error: trackingError,
    refresh,
  } = useDeliveryTracking({
    deliveryId: effectiveDeliveryId ?? null,
    userId: effectiveUserId,
    userRole: role || "customer",
  });

  // Sync completion milestone back into store order state
  useEffect(() => {
    if (tracking?.status === "delivered" || connectionState === "completed") {
      if (targetOrder && targetOrder.status < 5) {
        updateOrderStatus(targetOrder.id, 5);
      }
    }
  }, [tracking?.status, connectionState, targetOrder, updateOrderStatus]);

  // Check demo store fallback
  const demoOrder = targetOrder;

  // If real backend tracking data is active and loaded
  if (tracking) {
    const statusText = isArrived
      ? "Rider Arrived!"
      : tracking.status === "delivered"
      ? "Delivered!"
      : tracking.eta_minutes !== null && tracking.eta_minutes !== undefined
      ? `Arriving in ~${Math.round(tracking.eta_minutes)} min`
      : `Status: ${tracking.status.replace(/_/g, " ").toUpperCase()}`;

    return (
      <SiteLayout>
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
          {/* Header */}
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border/50 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
                  Order {tracking.order_id || tracking.delivery_id}
                </span>
                <span className="text-xs text-muted-foreground">·</span>
                <span className="font-mono text-xs text-muted-foreground">{tracking.delivery_id}</span>
              </div>
              <h1 className="mt-1 font-display text-4xl md:text-6xl text-foreground font-bold tracking-tight">
                {statusText}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <DownloadInvoiceButton order={targetOrder} orderId={id} variant="dark" size="sm" />
              <button
                type="button"
                onClick={refresh}
                className="flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold hover:border-primary transition-colors shadow-sm"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Refresh
              </button>
            </div>
          </div>

          {/* Main Grid: Responsive Map + Telemetry Panel */}
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
            {/* Interactive Map */}
            <div className="min-h-[480px] lg:min-h-[580px] flex flex-col">
              <DeliveryMap
                tracking={tracking}
                connectionState={connectionState}
                isApproaching={isApproaching}
                isArrived={isArrived}
                isDeviating={isDeviating}
                deviationDistance={deviationDistance}
                deviationThreshold={deviationThreshold}
                className="flex-1 w-full min-h-[460px] lg:min-h-[580px]"
              />
            </div>

            {/* Status Panel */}
            <TrackingStatusPanel
              tracking={tracking}
              connectionState={connectionState}
              isApproaching={isApproaching}
              isArrived={isArrived}
              isDeviating={isDeviating}
              deviationDistance={deviationDistance}
              deviationThreshold={deviationThreshold}
            />
          </div>
        </div>
      </SiteLayout>
    );
  }

  // Loading State while connecting to backend REST/WebSocket
  if (connectionState === "connecting" && !tracking && !trackingError) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-4xl px-4 py-24 text-center">
          <div className="inline-flex items-center justify-center p-4 rounded-3xl bg-red-50 text-[#E31E24] mb-4 shadow-2xs">
            <RefreshCw className="h-8 w-8 animate-spin" />
          </div>
          <h2 className="text-2xl font-bold font-display text-gray-900">
            Connecting to Live Courier Telemetry...
          </h2>
          <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
            Establishing secure real-time GPS telemetry link with RiderzPro Logistics fleet.
          </p>
        </div>
      </SiteLayout>
    );
  }

  // If no backend logistics delivery is active/available yet
  return (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 py-16 sm:py-24 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-amber-50 text-amber-600 border border-amber-200 mb-5 shadow-xs">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Live tracking is not available for this order yet
        </h1>
        <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-lg mx-auto">
          {targetOrder
            ? `Order #${targetOrder.id} has been received and is being prepared by the vendor. Live GPS courier tracking will become active once dispatched.`
            : `We could not find active courier dispatch information for "${id}". Real-time tracking will start as soon as a delivery partner is assigned.`}
        </p>

        {targetOrder && (
          <div className="mt-8 text-left rounded-3xl border border-border bg-card p-6 shadow-card max-w-xl mx-auto space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-primary">#{targetOrder.id}</span>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Placed on {new Date(targetOrder.createdAt).toLocaleString("en-IN")}
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                {ORDER_STEPS[targetOrder.status] || "Processing"}
              </span>
            </div>

            {/* Step indicator */}
            <div className="py-2">
              <ol className="flex items-center justify-between text-xs">
                {ORDER_STEPS.slice(0, 4).map((step, idx) => (
                  <li key={step} className="flex flex-col items-center">
                    <span
                      className={cn(
                        "grid h-6 w-6 place-items-center rounded-full text-[10px] font-bold",
                        idx <= targetOrder.status
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {idx + 1}
                    </span>
                    <span className="mt-1 text-[10px] font-medium text-muted-foreground">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="border-t border-border/60 pt-3 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total: <strong className="text-foreground">{inr(targetOrder.total)}</strong></span>
              <span className="text-xs text-muted-foreground">Paid via {targetOrder.payment}</span>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/dashboard/customer"
            search={{ tab: "orders" } as any}
            className="rounded-2xl bg-[#E31E24] px-6 py-3 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-red-700 transition"
          >
            Back to My Orders
          </Link>
          <Link
            to="/shop"
            className="rounded-2xl border border-border bg-card px-6 py-3 text-xs sm:text-sm font-semibold hover:border-primary transition"
          >
            Browse Spare Parts
          </Link>
        </div>
      </div>
    </SiteLayout>
  );
}
