/**
 * TrackingTab — Zomato-inspired Live Order Tracking
 *
 * Architecture notes:
 * - Data source: useStore() → shipments: NormalizedShipment[], orders: Order[]
 * - All tracking data is generated client-side by the browser store.
 * - "Live GPS" animation (LiveMap) is a simulated SVG — NOT real GPS coordinates.
 * - ETAs are synthetic estimates from createNormalizedShipment().
 * - No real courier API (Delhivery / Bluedart / Shadowfax) is connected.
 * - Customer ownership: lookup only searches within the logged-in user's own shipments.
 * - Real-time: no WebSocket / polling available. Manual refresh only.
 */

import { useState, useCallback, useRef, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  Search, Package, Truck, MapPin, CheckCircle2, Clock, AlertTriangle,
  XCircle, RotateCcw, RefreshCw, Copy, Check, ExternalLink, ChevronRight,
  ShoppingBag, PhoneCall, Zap, Navigation, Radio, Building2, Info,
  PartyPopper, ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { useStore, ORDER_STEPS, type Order } from "@/lib/store";
import type { NormalizedShipment, ShipmentStatus } from "@/lib/logistics/types";
import { LiveMap } from "@/components/site/LiveMap";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Map shipment status → ORDER_STEPS index (0-5) */
function statusToStepIndex(status: ShipmentStatus): number {
  switch (status) {
    case "Pending Dispatch": return 0;
    case "Manifested":       return 1;
    case "In Transit":       return 3;
    case "Out for Delivery": return 4;
    case "Delivered":        return 5;
    default:                 return 1; // exceptions stay at last known
  }
}

function isException(s: ShipmentStatus) {
  return ["Delayed", "Failed Attempt", "Returned to Origin", "Cancelled"].includes(s);
}

function statusColor(s: ShipmentStatus): string {
  if (s === "Delivered")        return "text-emerald-700";
  if (s === "Out for Delivery") return "text-blue-700";
  if (isException(s))           return "text-amber-700";
  return "text-[#E31E24]";
}

function statusBg(s: ShipmentStatus): string {
  if (s === "Delivered")        return "bg-emerald-50 border-emerald-200";
  if (s === "Out for Delivery") return "bg-blue-50 border-blue-200";
  if (isException(s))           return "bg-amber-50 border-amber-200";
  return "bg-red-50 border-red-200";
}

function etaMessage(shipment: NormalizedShipment, order?: Order): string {
  if (shipment.status === "Delivered") return "Delivered!";
  if (isException(shipment.status))    return shipment.estimatedDelivery ?? "Check below for details";
  return shipment.estimatedDelivery ?? `~${order?.eta ?? "?"} min`;
}

function stepLabel(idx: number): string {
  const labels = ["Confirmed", "Packed", "Dispatched", "In Transit", "Out for Delivery", "Delivered"];
  return labels[idx] ?? ORDER_STEPS[idx];
}

// ─────────────────────────────────────────────────────────────────────────────
// Exception banner
// ─────────────────────────────────────────────────────────────────────────────
function ExceptionBanner({ status }: { status: ShipmentStatus }) {
  const msg: Partial<Record<ShipmentStatus, string>> = {
    "Delayed":            "Shipment delayed due to route congestion or weather. Expected to resume shortly.",
    "Failed Attempt":     "Delivery attempt was unsuccessful. Courier will retry the next business day.",
    "Returned to Origin": "Package is being returned to the dispatch hub. Contact support to reschedule.",
    "Cancelled":          "This shipment has been cancelled. Contact support regarding a refund.",
  };
  if (!msg[status]) return null;
  return (
    <div className="flex items-start gap-2.5 rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm">
      <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
      <div>
        <span className="font-bold text-amber-800">Delivery exception — </span>
        <span className="text-amber-700">{msg[status]}</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Zomato-style progress stepper
// ─────────────────────────────────────────────────────────────────────────────
function ProgressStepper({ orderStatus, shipmentStatus }: { orderStatus: number; shipmentStatus: ShipmentStatus }) {
  const exc   = isException(shipmentStatus);
  const total = ORDER_STEPS.length; // 6
  // Use whichever is further: order status or derived shipment step
  const current = exc ? orderStatus : Math.max(orderStatus, statusToStepIndex(shipmentStatus));
  const pct = Math.min(100, (current / (total - 1)) * 100);

  const icons = [Package, Package, Zap, Truck, Navigation, CheckCircle2];

  return (
    <div className="space-y-3">
      {/* Progress bar track */}
      <div className="relative h-1.5 rounded-full bg-gray-200 mx-4">
        <div
          className={cn(
            "absolute inset-y-0 left-0 rounded-full transition-all duration-700",
            exc ? "bg-amber-400" : shipmentStatus === "Delivered" ? "bg-emerald-500" : "bg-[#E31E24]"
          )}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Step dots */}
      <div className="flex justify-between px-1">
        {ORDER_STEPS.map((_, idx) => {
          const done    = idx < current;
          const active  = idx === current && !exc;
          const IconC   = icons[idx] ?? Package;
          return (
            <div key={idx} className="flex flex-col items-center gap-1 flex-1">
              <div
                aria-label={`${stepLabel(idx)}${done ? " completed" : active ? " current" : ""}`}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 text-xs font-bold",
                  done
                    ? "border-[#E31E24] bg-[#E31E24] text-white"
                    : active
                    ? "border-[#E31E24] bg-white ring-4 ring-red-100 scale-110"
                    : exc && idx === current
                    ? "border-amber-400 bg-amber-50"
                    : "border-gray-200 bg-white text-gray-400"
                )}
              >
                {done
                  ? <Check className="h-3.5 w-3.5" />
                  : active
                  ? <span className="h-2 w-2 rounded-full bg-[#E31E24] animate-pulse" />
                  : exc && idx === current
                  ? <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                  : <IconC className="h-3.5 w-3.5" />
                }
              </div>
              <span className={cn(
                "text-[9px] text-center leading-tight max-w-[52px]",
                done || active ? "font-semibold text-[#111111]" : "text-gray-400"
              )}>
                {stepLabel(idx)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Vertical event timeline
// ─────────────────────────────────────────────────────────────────────────────
function EventTimeline({ shipment }: { shipment: NormalizedShipment }) {
  const [expanded, setExpanded] = useState(false);
  const events = shipment.events;
  const shown  = expanded ? events : events.slice(0, 3);

  return (
    <div>
      <h3 className="text-sm font-bold text-[#111111] mb-3">
        Tracking Updates
        <span className="ml-1.5 text-xs font-normal text-gray-400">({events.length})</span>
      </h3>
      <ol className="relative pl-5 space-y-4 before:absolute before:left-2 before:top-1 before:bottom-1 before:w-0.5 before:bg-gray-200">
        {shown.map((evt, idx) => {
          const isLatest = idx === 0;
          return (
            <li key={evt.id || idx} className="relative text-sm">
              <div
                aria-hidden="true"
                className={cn(
                  "absolute -left-5 top-1 h-3 w-3 rounded-full border-2 border-white",
                  isLatest ? "bg-[#E31E24] ring-4 ring-red-100" : "bg-gray-300"
                )}
              />
              <p className="font-semibold text-[#111111] leading-snug">{evt.description}</p>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <MapPin className="h-3 w-3 shrink-0" />{evt.location}
                </span>
                <span className="text-xs text-gray-400">·</span>
                <span className="text-xs text-gray-400">{evt.timestamp}</span>
                {evt.isGps && (
                  <span className="text-[10px] bg-red-50 text-[#E31E24] font-bold px-1.5 py-0.5 rounded">GPS</span>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      {events.length > 3 && (
        <button
          type="button"
          onClick={() => setExpanded(v => !v)}
          className="mt-3 text-xs text-[#E31E24] font-semibold flex items-center gap-1 hover:underline"
        >
          {expanded ? "Show less" : `Show all ${events.length} updates`}
          <ChevronRight className={cn("h-3.5 w-3.5 transition-transform", expanded && "rotate-90")} />
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Delivered celebration card
// ─────────────────────────────────────────────────────────────────────────────
function DeliveredCard({ shipment, order }: { shipment: NormalizedShipment; order?: Order }) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 p-5 text-center space-y-2">
      <div className="flex items-center justify-center gap-2">
        <PartyPopper className="h-6 w-6 text-emerald-600" />
        <span className="text-xl font-extrabold text-emerald-800 font-display">Delivered!</span>
      </div>
      <p className="text-sm text-emerald-700">Your order arrived successfully.</p>
      {shipment.actualDeliveryTimestamp && (
        <p className="text-xs text-emerald-600">Delivered at {shipment.actualDeliveryTimestamp}</p>
      )}
      {shipment.proofOfDelivery?.signedBy && (
        <p className="text-xs text-emerald-600">
          Signed by <strong>{shipment.proofOfDelivery.signedBy}</strong>
          {shipment.proofOfDelivery.otpVerified && " · OTP verified"}
        </p>
      )}
      {order && (
        <Link
          to="/track/$id"
          params={{ id: order.id }}
          className="inline-flex items-center gap-1.5 mt-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition"
        >
          View Order Receipt <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main tracking view — shown once a shipment is found
// ─────────────────────────────────────────────────────────────────────────────
function TrackingView({
  shipment,
  order,
  onBack,
}: {
  shipment: NormalizedShipment;
  order?: Order;
  onBack: () => void;
}) {
  const [copied, setCopied]       = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [reportOpen, setReportOpen]   = useState(false);
  const [issueText, setIssueText]     = useState("");

  const isGpsActive = shipment.locationType === "Live GPS Telemetry" && !!shipment.currentGps;
  const orderStatus = order?.status ?? statusToStepIndex(shipment.status);
  const exc = isException(shipment.status);
  const isDelivered = shipment.status === "Delivered";

  const handleCopy = () => {
    navigator.clipboard.writeText(shipment.trackingNumber).catch(() => {});
    setCopied(true);
    toast.success("AWB copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setLastRefresh(new Date());
      toast.success("Tracking refreshed", {
        description: "Data loaded from browser store. No real courier API is connected.",
      });
    }, 1100);
  };

  const handleReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueText.trim()) return;
    toast.success("Issue reported", {
      description: `Support ticket created for AWB ${shipment.trackingNumber}.`,
    });
    setIssueText("");
    setReportOpen(false);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Back + refresh bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#111111] transition"
        >
          ← Track another order
        </button>
        <div className="flex items-center gap-2">
          {lastRefresh && (
            <span className="text-[11px] text-gray-400">
              Updated {lastRefresh.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            aria-label="Refresh tracking"
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-semibold text-[#111111] hover:bg-gray-50 shadow-2xs disabled:opacity-60 transition"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", refreshing && "animate-spin")} />
            {refreshing ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </div>

      {/* Synthetic data notice */}
      <div className="flex items-start gap-2 rounded-xl bg-blue-50 border border-blue-100 px-3.5 py-2.5 text-xs text-blue-700">
        <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
        <span>
          <strong>Demo mode:</strong> Tracking data is browser-generated. No real courier API is connected. ETAs and locations are synthetic.
        </span>
      </div>

      {/* ── HERO ETA CARD (Zomato-inspired) ── */}
      <div className={cn(
        "rounded-3xl border p-5 sm:p-6",
        isDelivered
          ? "bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200"
          : exc
          ? "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200"
          : "bg-gradient-to-br from-white to-red-50/40 border-[#E5E7EB]"
      )}>
        {/* Product / order header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className={cn(
              "grid h-10 w-10 shrink-0 place-items-center rounded-xl",
              isDelivered ? "bg-emerald-100 text-emerald-600"
                : exc ? "bg-amber-100 text-amber-600"
                : "bg-red-50 text-[#E31E24]"
            )}>
              {isDelivered ? <CheckCircle2 className="h-5 w-5" /> : exc ? <AlertTriangle className="h-5 w-5" /> : <Truck className="h-5 w-5" />}
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Order #{shipment.orderId}
              </p>
              <p className="text-sm font-bold text-[#111111] truncate">
                {order?.groups?.[0]?.items?.length
                  ? `${order.groups.reduce((s, g) => s + g.items.reduce((n, i) => n + i.qty, 0), 0)} item${
                      order.groups.reduce((s, g) => s + g.items.reduce((n, i) => n + i.qty, 0), 0) > 1 ? "s" : ""
                    } · ${shipment.provider}`
                  : shipment.provider}
              </p>
            </div>
          </div>

          {/* Status badge */}
          <span className={cn(
            "shrink-0 inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-bold",
            isDelivered ? "bg-emerald-100 text-emerald-800 border-emerald-200"
              : exc ? "bg-amber-100 text-amber-800 border-amber-200"
              : "bg-red-50 text-[#E31E24] border-red-200"
          )}>
            {isDelivered ? <CheckCircle2 className="h-3 w-3" />
              : exc ? <AlertTriangle className="h-3 w-3" />
              : <span className="h-1.5 w-1.5 rounded-full bg-[#E31E24] animate-pulse" />
            }
            {shipment.status}
          </span>
        </div>

        {/* Big ETA */}
        <div className="mb-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-0.5">
            {isDelivered ? "Delivered" : exc ? "Status" : "Estimated delivery"}
          </p>
          <p className={cn(
            "font-display text-3xl sm:text-4xl font-extrabold leading-tight",
            isDelivered ? "text-emerald-700" : exc ? "text-amber-700" : "text-[#111111]"
          )}>
            {etaMessage(shipment, order)}
          </p>
          {!isDelivered && !exc && (
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <MapPin className="h-3 w-3 shrink-0" /> {shipment.latestLocation}
            </p>
          )}
        </div>

        {/* Progress stepper */}
        {!isDelivered && (
          <ProgressStepper orderStatus={orderStatus} shipmentStatus={shipment.status} />
        )}

        {isDelivered && (
          <ProgressStepper orderStatus={5} shipmentStatus={shipment.status} />
        )}
      </div>

      {/* Exception banner */}
      {exc && <ExceptionBanner status={shipment.status} />}

      {/* ── DELIVERED state ── */}
      {isDelivered && <DeliveredCard shipment={shipment} order={order} />}

      {/* ── TWO-COLUMN on desktop: Map/Facility + Courier card ── */}
      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">

        {/* Map or Facility info */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden shadow-2xs">
          {isGpsActive ? (
            <div className="relative">
              <div className="px-4 pt-4 pb-2 flex items-center justify-between">
                <span className="text-sm font-bold text-[#111111] flex items-center gap-1.5">
                  <Radio className="h-4 w-4 text-[#E31E24] animate-pulse" />
                  Live Fleet GPS
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  {shipment.currentGps?.speedKmph} km/h
                </span>
              </div>
              <div className="rounded-xl overflow-hidden border border-gray-200">
                <LiveMap deliveryId={shipment.shipmentId || "delivery_vijayawada_amaravati_live"} className="h-64 sm:h-80 w-full" />
              </div>
            </div>
          ) : (
            <div className="p-4">
              <p className="text-sm font-bold text-[#111111] flex items-center gap-2 mb-3">
                <Building2 className="h-4 w-4 text-blue-500" />
                Shipment Journey
              </p>
              {/* Origin → Destination visual */}
              <div className="flex items-stretch gap-2 text-xs">
                <div className="flex flex-col items-center pt-1">
                  <div className="h-2 w-2 rounded-full bg-[#E31E24]" />
                  <div className="flex-1 w-0.5 bg-gray-200 my-1" />
                  <div className="h-2 w-2 rounded-full border-2 border-[#E31E24]" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="rounded-xl bg-[#F5F6F8] border border-gray-100 p-2.5">
                    <p className="font-bold text-[#111111]">{shipment.pickupAddress.name}</p>
                    <p className="text-gray-500 text-[11px] mt-0.5">
                      {shipment.pickupAddress.city}{shipment.pickupAddress.pincode ? ` - ${shipment.pickupAddress.pincode}` : ""}
                    </p>
                  </div>
                  <div className="rounded-xl bg-[#F5F6F8] border border-gray-100 p-2.5">
                    <p className="font-bold text-[#111111]">
                      {shipment.destinationAddress.name || "Your address"}
                    </p>
                    <p className="text-gray-500 text-[11px] mt-0.5">
                      {shipment.destinationAddress.city}
                      {shipment.destinationAddress.pincode ? ` - ${shipment.destinationAddress.pincode}` : ""}
                    </p>
                  </div>
                </div>
              </div>

              {!isGpsActive && (
                <p className="mt-3 text-[11px] text-gray-400 flex items-start gap-1">
                  <Info className="h-3 w-3 shrink-0 mt-0.5" />
                  Live GPS available only for RiderzPro Fleet shipments. This shipment uses facility checkpoints.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Courier info + AWB */}
        <div className="space-y-3">
          {/* AWB card */}
          <div className="rounded-2xl border border-[#E5E7EB] bg-white shadow-2xs p-4 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Courier & Tracking</p>

            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="font-bold text-[#111111] text-sm">{shipment.provider}</p>
                <p className="font-mono text-xs text-gray-500">{shipment.trackingNumber}</p>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                aria-label="Copy AWB number"
                className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>

            {shipment.trackingUrl.startsWith("http") && (
              <a
                href={shipment.trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 rounded-xl bg-[#E31E24] px-4 py-2.5 text-xs font-bold text-white hover:bg-red-700 transition w-full"
              >
                Track on {shipment.provider} <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}

            {/* Ref */}
            <p className="text-[11px] text-gray-400 font-mono">Ref: {shipment.providerReference}</p>
          </div>

          {/* Last updated */}
          <div className="rounded-2xl border border-[#E5E7EB] bg-white shadow-2xs p-3.5 flex items-center justify-between text-xs">
            <span className="text-gray-500 flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> Last update
            </span>
            <span className="font-semibold text-[#111111]">{shipment.lastEventTimestamp}</span>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setReportOpen(true)}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
              Report issue
            </button>
            <Link
              to="/dashboard/customer"
              search={{ tab: "support" } as any}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              <PhoneCall className="h-3.5 w-3.5 text-gray-400" />
              Contact support
            </Link>
          </div>
        </div>
      </div>

      {/* Event timeline */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white shadow-2xs p-5">
        <EventTimeline shipment={shipment} />
      </div>

      {/* Report Issue Modal */}
      {reportOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="report-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150"
        >
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 id="report-title" className="text-sm font-bold text-[#111111]">Report Delivery Issue</h3>
              <button
                type="button"
                onClick={() => setReportOpen(false)}
                aria-label="Close"
                className="rounded-full p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
              >✕</button>
            </div>
            <form onSubmit={handleReport} className="space-y-3 text-xs">
              <p className="text-gray-500">
                Having an issue with AWB{" "}
                <span className="font-mono font-bold text-[#111111]">{shipment.trackingNumber}</span>?
              </p>
              <label htmlFor="issue-text" className="block font-semibold text-gray-700">
                Describe the issue *
              </label>
              <textarea
                id="issue-text"
                rows={3}
                value={issueText}
                onChange={(e) => setIssueText(e.target.value)}
                placeholder="e.g. Out for delivery but not received, wrong address…"
                className="w-full rounded-xl border border-gray-200 p-2.5 text-xs outline-none focus:border-[#E31E24] resize-none"
                required
              />
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setReportOpen(false)}
                  className="rounded-xl border border-gray-200 px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
                >Cancel</button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#E31E24] px-4 py-2 text-xs font-bold text-white hover:bg-red-700 transition"
                >Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Search screen (shown before a shipment is selected)
// ─────────────────────────────────────────────────────────────────────────────
function SearchScreen({
  onFound,
  shipments,
  orders,
}: {
  onFound: (s: NormalizedShipment) => void;
  shipments: NormalizedShipment[];
  orders: Order[];
}) {
  const [query, setQuery]     = useState("");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus
  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();

    if (!q) {
      setError("Please enter an order ID or tracking number.");
      return;
    }

    setLoading(true);
    setError("");

    // Simulate async lookup (real: would call an authenticated API)
    setTimeout(() => {
      setLoading(false);
      const q_lower = q.toLowerCase();

      // Search by order ID (e.g. RZ-123456) or AWB (e.g. DEL12345678)
      const found = shipments.find(
        (s) =>
          s.orderId.toLowerCase() === q_lower ||
          s.trackingNumber.toLowerCase() === q_lower ||
          s.shipmentId.toLowerCase() === q_lower
      );

      if (found) {
        onFound(found);
      } else {
        // If the customer has no orders at all, suggest they place one
        if (shipments.length === 0) {
          setError("No orders found. Place an order first, then track it here.");
        } else {
          setError(
            "No shipment found matching that ID. Make sure you entered your own order ID or AWB number."
          );
        }
      }
    }, 400);
  }, [query, shipments, onFound]);

  // Quick-select from existing shipments
  const active = shipments.filter(
    (s) => s.status !== "Delivered" && s.status !== "Cancelled"
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Hero search card */}
      <div className="rounded-3xl bg-gradient-to-br from-[#E31E24] to-[#c0151b] p-6 sm:p-8 text-white shadow-lg">
        <div className="max-w-md mx-auto text-center space-y-4">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-white/15 mx-auto">
            <Truck className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold">Track Your Order</h1>
            <p className="text-sm text-white/80 mt-1">
              Enter your Order ID or AWB tracking number below
            </p>
          </div>

          <form onSubmit={handleSearch} className="space-y-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setError(""); }}
                placeholder="e.g. RZ-123456 or DEL98765432"
                aria-label="Order ID or tracking number"
                className={cn(
                  "w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm font-medium text-[#111111] bg-white outline-none placeholder:text-gray-400 transition",
                  error ? "ring-2 ring-red-400" : "ring-0 focus:ring-2 focus:ring-white/50"
                )}
              />
            </div>

            {error && (
              <p role="alert" className="text-sm text-white/90 bg-white/10 rounded-xl px-3 py-2 text-left flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />{error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-white text-[#E31E24] font-bold text-sm hover:bg-gray-50 transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><RefreshCw className="h-4 w-4 animate-spin" /> Looking up…</>
              ) : (
                <><Search className="h-4 w-4" /> Track Order</>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Active shipments quick-select */}
      {active.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 px-1">
            Your Active Deliveries
          </p>
          <div className="space-y-2">
            {active.map((s) => {
              const ord = orders.find((o) => o.id === s.orderId);
              return (
                <button
                  key={s.shipmentId}
                  type="button"
                  onClick={() => onFound(s)}
                  className="w-full rounded-2xl border border-[#E5E7EB] bg-white p-4 hover:border-[#E31E24] hover:shadow-sm transition text-left flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-red-50 text-[#E31E24]">
                      <Truck className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-[#111111]">Order #{s.orderId}</p>
                      <p className="text-xs text-gray-500 font-mono truncate">{s.trackingNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-bold text-[#E31E24]">{s.estimatedDelivery}</span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state when no orders at all */}
      {shipments.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[#E5E7EB] bg-white p-10 text-center space-y-4">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
            <Package className="h-7 w-7" />
          </span>
          <div>
            <h2 className="text-base font-bold text-[#111111]">No Active Shipments</h2>
            <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto">
              Your deliveries will appear here once an order has been dispatched.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <Link
              to="/dashboard/customer"
              search={{ tab: "orders" } as any}
              className="inline-flex items-center gap-2 rounded-xl bg-[#E31E24] px-5 py-2.5 text-sm font-bold text-white hover:bg-red-700 transition"
            >
              <Package className="h-4 w-4" /> View My Orders
            </Link>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-5 py-2.5 text-sm font-semibold text-[#111111] hover:bg-gray-50 transition"
            >
              <ShoppingBag className="h-4 w-4" /> Shop Parts
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Root export
// ─────────────────────────────────────────────────────────────────────────────
export function TrackingTab() {
  const { shipments, orders, simulateDemoOrder } = useStore();
  const [activeShipment, setActiveShipment] = useState<NormalizedShipment | null>(null);

  // If store already has live shipments, auto-select the most recent active one
  useEffect(() => {
    if (activeShipment) return; // user already selected
    const live = shipments.find(
      (s) => s.status !== "Delivered" && s.status !== "Cancelled"
    );
    if (live) setActiveShipment(live);
  }, [shipments, activeShipment]);

  const linkedOrder = activeShipment
    ? orders.find((o) => o.id === activeShipment.orderId)
    : undefined;

  if (activeShipment) {
    return (
      <TrackingView
        shipment={activeShipment}
        order={linkedOrder}
        onBack={() => setActiveShipment(null)}
      />
    );
  }

  return (
    <div className="space-y-4">
      <SearchScreen
        onFound={setActiveShipment}
        shipments={shipments}
        orders={orders}
      />

      {/* Dev helper — clearly labelled */}
      <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-4 text-center">
        <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">Development Preview</p>
        <button
          type="button"
          onClick={() => {
            const order = simulateDemoOrder();
            toast.success("Demo shipment created", {
              description: "This is sample data for UI testing. Not a real order.",
            });
          }}
          className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-white hover:border-gray-300 transition"
        >
          + Simulate Demo Shipment
        </button>
        <p className="mt-1.5 text-[10px] text-gray-400">
          Creates sample order &amp; shipment in the browser store for testing.
        </p>
      </div>
    </div>
  );
}
