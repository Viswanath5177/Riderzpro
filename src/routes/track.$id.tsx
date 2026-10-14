import { useEffect, useState, useCallback } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Check,
  MessageCircle,
  Phone,
  Star,
  Lock,
  RefreshCw,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react";
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

const DEMO_ROUTE_WAYPOINTS = [
  { sequence: 0, lat: 16.5062, lng: 80.6480, latitude: 16.5062, longitude: 80.6480, label: "Vijayawada Central Hub" },
  { sequence: 1, lat: 16.5120, lng: 80.6300, latitude: 16.5120, longitude: 80.6300, label: "Prakasam Barrage Road" },
  { sequence: 2, lat: 16.5182, lng: 80.6050, latitude: 16.5182, longitude: 80.6050, label: "Krishna River Crossing" },
  { sequence: 3, lat: 16.5280, lng: 80.5650, latitude: 16.5280, longitude: 80.5650, label: "Seed Access Road" },
  { sequence: 4, lat: 16.5417, lng: 80.5158, latitude: 16.5417, longitude: 80.5158, label: "Amaravati Secretariat" },
];

const DEMO_ROUTE_GEOMETRY = [
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
];

function Track() {
  const { id } = Route.useParams();
  const { orders, advanceOrder, updateOrderStatus, role, userProfile } = useStore();

  const [localSimStatus, setLocalSimStatus] = useState<number>(3);
  const [autoPlay, setAutoPlay] = useState<boolean>(false);

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

  // Sync completion milestone back into store order state if real backend delivery finishes
  useEffect(() => {
    if (tracking?.status === "delivered" || connectionState === "completed") {
      if (targetOrder && targetOrder.status < 5) {
        updateOrderStatus(targetOrder.id, 5);
      }
    }
  }, [tracking?.status, connectionState, targetOrder, updateOrderStatus]);

  // Demo order resolution: use targetOrder from store if found, else synthesize a fallback demo order
  const demoOrder = targetOrder || {
    id: id || "RZ-849201",
    createdAt: Date.now() - 1000 * 60 * 18,
    groups: [
      {
        vendorId: "v1",
        items: [{ productId: "p1", qty: 1 }],
        km: 18.4,
        fee: 45,
        eta: 25,
      },
    ],
    itemsTotal: 1250,
    deliveryTotal: 45,
    tax: 225,
    total: 1520,
    eta: 25,
    payment: "UPI · Paid Online",
    status: localSimStatus,
    riderId: riders[0]?.id || "r1",
    customerName: userProfile?.name || "Customer",
    customerPhone: userProfile?.phone || "+91 98765 43210",
    shippingAddress: {
      name: userProfile?.name || "Customer",
      street: "Amaravati Capital Complex, Sector 4",
      city: "Amaravati",
      state: "Andhra Pradesh",
      pincode: "522503",
    },
  };

  const currentStatus = targetOrder ? targetOrder.status : localSimStatus;
  const rider = demoOrder.riderId ? riders.find((r) => r.id === demoOrder.riderId) || riders[0] : riders[0];

  const handleNextStep = useCallback(() => {
    if (targetOrder) {
      if (targetOrder.status < 5) {
        advanceOrder(targetOrder.id);
      } else {
        updateOrderStatus(targetOrder.id, 0);
      }
    } else {
      setLocalSimStatus((prev) => (prev < 5 ? prev + 1 : 0));
    }
  }, [targetOrder, advanceOrder, updateOrderStatus]);

  const handleResetSim = useCallback(() => {
    if (targetOrder) {
      updateOrderStatus(targetOrder.id, 0);
    } else {
      setLocalSimStatus(0);
    }
    setAutoPlay(false);
  }, [targetOrder, updateOrderStatus]);

  // Auto-play simulation timer
  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => {
      if (currentStatus >= 5) {
        setAutoPlay(false);
      } else {
        handleNextStep();
      }
    }, 2800);
    return () => clearInterval(interval);
  }, [autoPlay, currentStatus, handleNextStep]);

  // 1. If real backend tracking data is active and loaded
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
              <DownloadInvoiceButton order={targetOrder || demoOrder} orderId={id} variant="dark" size="sm" />
              {targetOrder && targetOrder.status < 5 && (
                <button
                  type="button"
                  onClick={() => advanceOrder(targetOrder.id)}
                  className="flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold hover:border-primary transition-colors shadow-sm"
                >
                  Simulate next step →
                </button>
              )}
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

  // 2. Interactive Map Simulation (for store orders, testing, and offline telemetry)
  const progress =
    currentStatus <= 1
      ? 0.0
      : currentStatus === 2
      ? 0.15
      : currentStatus === 3
      ? 0.50
      : currentStatus === 4
      ? 0.85
      : 1.0;

  const remaining = Math.max(0, Math.round(demoOrder.eta * (1 - currentStatus / (ORDER_STEPS.length - 1))));

  const geomIdx = Math.min(
    DEMO_ROUTE_GEOMETRY.length - 1,
    Math.max(0, Math.round(progress * (DEMO_ROUTE_GEOMETRY.length - 1)))
  );
  const riderPos = DEMO_ROUTE_GEOMETRY[geomIdx];
  const nextPos = DEMO_ROUTE_GEOMETRY[Math.min(DEMO_ROUTE_GEOMETRY.length - 1, geomIdx + 1)];
  const dLat = nextPos.lat - riderPos.lat;
  const dLng = nextPos.lng - riderPos.lng;
  const heading = dLat !== 0 || dLng !== 0 ? (Math.atan2(dLng, dLat) * 180) / Math.PI : 285.0;

  const demoTracking: DeliveryTrackingData = {
    delivery_id: demoOrder.id,
    order_id: demoOrder.id,
    status: currentStatus === 5 ? "delivered" : currentStatus >= 3 ? "in_transit" : currentStatus >= 2 ? "assigned" : "pending",
    rider: {
      id: rider?.id || "rider_sathesh",
      name: rider?.name || "Sathesh Ittraju",
      phone: rider?.phone || "+91 98490 12345",
      vehicle_type: "electric_bike",
      latitude: riderPos.lat,
      longitude: riderPos.lng,
      current_latitude: riderPos.lat,
      current_longitude: riderPos.lng,
      heading_degrees: heading,
      speed_kmh: currentStatus >= 3 && currentStatus < 5 ? 32.0 : 0,
      accuracy_meters: 4.0,
      is_stale: false,
    },
    pickup: {
      address: "Vijayawada Central Hub, MG Road, Vijayawada",
      latitude: 16.5062,
      longitude: 80.6480,
    },
    dropoff: {
      address: demoOrder.shippingAddress?.street
        ? `${demoOrder.shippingAddress.street}, ${demoOrder.shippingAddress.city || "Amaravati"}`
        : "Amaravati Capital Complex, Sector 4, Amaravati",
      latitude: 16.5417,
      longitude: 80.5158,
    },
    eta_minutes: remaining,
    distance_km: Math.round(18.4 * (1 - progress) * 10) / 10,
    route_waypoints: DEMO_ROUTE_WAYPOINTS,
    route_geometry: DEMO_ROUTE_GEOMETRY,
    distance_to_dropoff_meters: Math.round(18400 * (1 - progress)),
    is_approaching: progress > 0.8 && progress < 0.98,
    is_arrived: progress >= 0.98,
    is_route_deviating: false,
  };

  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border/50 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
                Order {demoOrder.id}
              </span>
              <span className="text-xs text-muted-foreground">·</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-600">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Simulation
              </span>
            </div>
            <h1 className="mt-1 font-display text-4xl md:text-6xl text-foreground font-bold tracking-tight">
              {currentStatus === 5 ? "Delivered!" : `Arriving in ${remaining} min`}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <DownloadInvoiceButton order={demoOrder} orderId={id} variant="dark" size="sm" />

            {/* Auto-simulate toggle button */}
            <button
              type="button"
              onClick={() => setAutoPlay((p) => !p)}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors shadow-sm",
                autoPlay
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card text-foreground hover:border-primary"
              )}
            >
              {autoPlay ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              {autoPlay ? "Pause" : "Auto Simulate"}
            </button>

            {/* Step simulation button */}
            {currentStatus < 5 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold hover:border-primary transition-colors shadow-sm"
              >
                Simulate next step →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleResetSim}
                className="flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold hover:border-primary transition-colors shadow-sm"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Restart Simulation
              </button>
            )}
          </div>
        </div>

        {/* Main Grid: Interactive Map + Status Panels */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
          {/* Interactive Map */}
          <div className="min-h-[480px] lg:min-h-[580px] flex flex-col">
            <DeliveryMap
              tracking={demoTracking}
              connectionState="connected"
              isApproaching={demoTracking.is_approaching ?? false}
              isArrived={demoTracking.is_arrived ?? false}
              isDeviating={false}
              className="flex-1 w-full min-h-[460px] lg:min-h-[580px]"
            />
          </div>

          {/* Side Info Cards */}
          <div className="space-y-4">
            {/* Rider Info Card */}
            <div className="rounded-3xl border border-border bg-card p-5 shadow-card">
              {rider ? (
                <>
                  <p className="text-xs text-muted-foreground">Your rider</p>
                  <div className="mt-3 flex items-center gap-3">
                    <span className="grid h-14 w-14 place-items-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                      {rider.avatar}
                    </span>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{rider.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {rider.vehicle} · {rider.plate}
                      </p>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        {rider.rating}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <a
                      href={`tel:${rider.phone}`}
                      className="flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
                    >
                      <Phone className="h-4 w-4" />
                      Call
                    </a>
                    <button
                      type="button"
                      onClick={() => toast("Chat opened", { description: `Message ${rider.name}` })}
                      className="flex items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-sm font-semibold hover:border-primary transition-colors"
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

            {/* Step Checklist */}
            <div className="rounded-3xl border border-border bg-card p-5 shadow-card">
              <ol className="space-y-4">
                {ORDER_STEPS.map((s, i) => (
                  <li key={s} className="flex items-center gap-3">
                    <span
                      className={cn(
                        "grid h-7 w-7 place-items-center rounded-full text-xs font-bold transition-colors",
                        i <= currentStatus
                          ? "bg-primary text-primary-foreground"
                          : "border border-border text-muted-foreground"
                      )}
                    >
                      {i < currentStatus ? <Check className="h-3.5 w-3.5" /> : i + 1}
                    </span>
                    <span className={i <= currentStatus ? "font-semibold text-foreground" : "text-muted-foreground"}>
                      {s}
                    </span>
                    {i === currentStatus && currentStatus < 5 && (
                      <span className="ml-auto h-2 w-2 animate-pulse rounded-full bg-primary" />
                    )}
                  </li>
                ))}
              </ol>
            </div>

            {/* Order Summary */}
            <div className="rounded-3xl border border-border bg-card p-5 text-sm shadow-card">
              {demoOrder.groups && demoOrder.groups.length > 0 ? (
                demoOrder.groups.map((g) => {
                  const vendor = getVendor(g.vendorId);
                  return (
                    <div key={g.vendorId} className="border-b border-border py-2 last:border-0">
                      <p className="font-semibold text-foreground">{vendor?.name || "Certified EV Parts Hub"}</p>
                      {g.items && g.items.length > 0 ? (
                        g.items.map((it) => (
                          <p key={it.productId} className="text-muted-foreground">
                            {it.qty} × {getProduct(it.productId)?.name || "EV Spare Component"}
                          </p>
                        ))
                      ) : (
                        <p className="text-muted-foreground">EV Spare Components</p>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="border-b border-border py-2">
                  <p className="font-semibold text-foreground">Riderzpro Hub Dispatch</p>
                  <p className="text-muted-foreground">EV Fast Charging Cable & Spares</p>
                </div>
              )}
              <div className="mt-3 flex justify-between font-bold text-foreground">
                <span>Paid ({demoOrder.payment || "Online UPI"})</span>
                <span>{inr(demoOrder.total || 1520)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
