import { useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, MessageCircle, Phone, Star, Lock, AlertCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/SiteLayout";
import { DeliveryMap } from "@/components/map/DeliveryMap";
import { TrackingStatusPanel } from "@/components/map/TrackingStatusPanel";
import { useDeliveryTracking } from "@/components/map/useDeliveryTracking";
import type { DeliveryTrackingData } from "@/components/map/types";
import { getProduct, getVendor, inr, riders } from "@/lib/data";
import { ORDER_STEPS, useStore } from "@/lib/store";

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
  const { orders, advanceOrder, updateOrderStatus, role, userProfile } = useStore();

  // Find linked order to resolve deliveryId or fallback to id
  const targetOrder = orders.find((x) => x.id === id || x.shipmentId === id);
  const effectiveDeliveryId = targetOrder?.shipmentId || id;
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
    deliveryId: effectiveDeliveryId,
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

  // If demo order exists in store and backend tracking is pending/not yet created
  if (demoOrder) {
    const rider = demoOrder.riderId ? riders.find((r) => r.id === demoOrder.riderId) : null;
    const progress = demoOrder.status <= 2 ? 0 : demoOrder.status === 3 ? 0.45 : demoOrder.status === 4 ? 0.8 : 1;
    const remaining = Math.max(0, Math.round(demoOrder.eta * (1 - demoOrder.status / (ORDER_STEPS.length - 1))));

    const demoTracking: DeliveryTrackingData = {
      delivery_id: demoOrder.id,
      order_id: demoOrder.id,
      status: demoOrder.status === 5 ? "delivered" : demoOrder.status >= 3 ? "in_transit" : "assigned",
      rider: {
        id: rider?.id || "rider_sathesh",
        name: rider?.name || "Sathesh Ittraju",
        phone: rider?.phone || "+91 98490 12345",
        vehicle_type: "electric_bike",
        latitude: 16.5062 + (16.5417 - 16.5062) * progress,
        longitude: 80.6480 + (80.5158 - 80.6480) * progress,
        heading_degrees: 285.0,
        speed_kmh: 30.0,
        accuracy_meters: 4.0,
        is_stale: false,
      },
      pickup: {
        address: "Vijayawada Central Hub, MG Road, Vijayawada",
        latitude: 16.5062,
        longitude: 80.6480,
      },
      dropoff: {
        address: "Amaravati Capital Complex, Sector 4, Amaravati",
        latitude: 16.5417,
        longitude: 80.5158,
      },
      eta_minutes: remaining,
      distance_km: Math.round(18.4 * (1 - progress) * 10) / 10,
      route_waypoints: [
        { sequence: 0, lat: 16.5062, lng: 80.6480, latitude: 16.5062, longitude: 80.6480, label: "Vijayawada Central Hub" },
        { sequence: 1, lat: 16.5120, lng: 80.6300, latitude: 16.5120, longitude: 80.6300, label: "Prakasam Barrage Road" },
        { sequence: 2, lat: 16.5182, lng: 80.6050, latitude: 16.5182, longitude: 80.6050, label: "Krishna River Crossing" },
        { sequence: 3, lat: 16.5280, lng: 80.5650, latitude: 16.5280, longitude: 80.5650, label: "Seed Access Road" },
        { sequence: 4, lat: 16.5417, lng: 80.5158, latitude: 16.5417, longitude: 80.5158, label: "Amaravati Secretariat" },
      ],
      route_geometry: [
        { lat: 16.5062, lng: 80.6480 },
        { lat: 16.5085, lng: 80.6420 },
        { lat: 16.5105, lng: 80.6350 },
        { lat: 16.5120, lng: 80.6300 },
        { lat: 16.5145, lng: 80.6210 },
        { lat: 16.5160, lng: 80.6120 },
        { lat: 16.5182, lng: 80.6050 },
        { lat: 16.5210, lng: 80.5950 },
        { lat: 16.5235, lng: 80.5840 },
        { lat: 16.5260, lng: 80.5730 },
        { lat: 16.5280, lng: 80.5650 },
        { lat: 16.5315, lng: 80.5520 },
        { lat: 16.5350, lng: 80.5390 },
        { lat: 16.5385, lng: 80.5270 },
        { lat: 16.5417, lng: 80.5158 },
      ],
      distance_to_dropoff_meters: Math.round(18400 * (1 - progress)),
      is_approaching: progress > 0.85 && progress < 0.98,
      is_arrived: progress >= 0.98,
      is_route_deviating: false,
    };

    return (
      <SiteLayout>
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">Demo Order {demoOrder.id}</p>
              <h1 className="font-display text-5xl md:text-7xl">
                {demoOrder.status === 5 ? "Delivered!" : `Arriving in ${remaining} min`}
              </h1>
            </div>
            {demoOrder.status < 5 && (
              <button
                onClick={() => advanceOrder(demoOrder.id)}
                className="rounded-full border border-border px-4 py-2 text-sm hover:border-primary"
              >
                Simulate next step →
              </button>
            )}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
            <DeliveryMap
              tracking={tracking || demoTracking}
              className="aspect-[4/3] lg:aspect-auto lg:min-h-[520px]"
            />

            <div className="space-y-4">
              <div className="rounded-3xl border border-border bg-card p-5 shadow-card">
                {rider ? (
                  <>
                    <p className="text-xs text-muted-foreground">Your rider</p>
                    <div className="mt-3 flex items-center gap-3">
                      <span className="grid h-14 w-14 place-items-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                        {rider.avatar}
                      </span>
                      <div className="flex-1">
                        <p className="font-semibold">{rider.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {rider.vehicle} · {rider.plate}
                        </p>
                        <p className="flex items-center gap-1 text-xs">
                          <Star className="h-3 w-3 fill-warning text-warning" />
                          {rider.rating}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <a
                        href={`tel:${rider.phone}`}
                        className="flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground"
                      >
                        <Phone className="h-4 w-4" />
                        Call
                      </a>
                      <button
                        onClick={() => toast("Chat opened", { description: `Message ${rider.name}` })}
                        className="flex items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-sm font-semibold"
                      >
                        <MessageCircle className="h-4 w-4" />
                        Chat
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Lock className="h-5 w-5" /> Rider details appear once a rider accepts your delivery.
                  </div>
                )}
              </div>

              <div className="rounded-3xl border border-border bg-card p-5 shadow-card">
                <ol className="space-y-4">
                  {ORDER_STEPS.map((s, i) => (
                    <li key={s} className="flex items-center gap-3">
                      <span
                        className={`grid h-7 w-7 place-items-center rounded-full text-xs font-bold ${
                          i <= demoOrder.status
                            ? "bg-primary text-primary-foreground"
                            : "border border-border text-muted-foreground"
                        }`}
                      >
                        {i < demoOrder.status ? <Check className="h-3.5 w-3.5" /> : i + 1}
                      </span>
                      <span className={i <= demoOrder.status ? "font-semibold" : "text-muted-foreground"}>{s}</span>
                      {i === demoOrder.status && demoOrder.status < 5 && (
                        <span className="ml-auto h-2 w-2 animate-pulse rounded-full bg-primary" />
                      )}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="rounded-3xl border border-border bg-card p-5 text-sm shadow-card">
                {demoOrder.groups.map((g) => (
                  <div key={g.vendorId} className="border-b border-border py-2 last:border-0">
                    <p className="font-semibold">{getVendor(g.vendorId).name}</p>
                    {g.items.map((it) => (
                      <p key={it.productId} className="text-muted-foreground">
                        {it.qty} × {getProduct(it.productId)?.name}
                      </p>
                    ))}
                  </div>
                ))}
                <p className="mt-2 flex justify-between font-bold">
                  <span>Paid ({demoOrder.payment})</span>
                  <span>{inr(demoOrder.total)}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </SiteLayout>
    );
  }

  // Neither backend tracking nor demo order found
  return (
    <SiteLayout>
      <div className="py-24 text-center px-4">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-muted border border-border mb-4">
          <AlertCircle className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="font-display text-4xl text-foreground font-bold">Delivery Not Found</p>
        <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
          We could not find active delivery tracking information for &ldquo;{id}&rdquo;. Please verify your tracking
          code or check your order history.
        </p>
        {trackingError && (
          <p className="mt-2 text-xs text-amber-500 font-mono">Error: {trackingError}</p>
        )}
        <div className="mt-6 flex justify-center gap-3">
          <Link
            to="/orders"
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
          >
            View Your Orders
          </Link>
          <Link
            to="/"
            className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:border-primary transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    </SiteLayout>
  );
}
