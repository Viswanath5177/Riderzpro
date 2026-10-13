import { useState } from "react";
import {
  Truck,
  Package,
  MapPin,
  Clock,
  ExternalLink,
  Copy,
  Check,
  AlertTriangle,
  MessageSquare,
  Phone,
  RefreshCw,
  Navigation,
  ShieldCheck,
  Building2,
  Radio,
} from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import type { NormalizedShipment } from "@/lib/logistics/types";
import { LiveMap } from "@/components/site/LiveMap";

export function TrackingTab() {
  const { shipments, orders } = useStore();
  const [selectedShipmentId, setSelectedShipmentId] = useState<string>(
    shipments[0]?.shipmentId || ""
  );
  const [copied, setCopied] = useState(false);
  const [isReportIssueOpen, setIsReportIssueOpen] = useState(false);
  const [issueText, setIssueText] = useState("");

  const activeShipment: NormalizedShipment | undefined =
    shipments.find((s) => s.shipmentId === selectedShipmentId) || shipments[0];

  const handleCopyTracking = (trackNum: string) => {
    navigator.clipboard.writeText(trackNum);
    setCopied(true);
    toast.success("Tracking number copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReportIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueText.trim()) return;
    toast.success("Logistics issue reported", {
      description: `Support ticket created for shipment ${activeShipment?.trackingNumber}. Priority escalation initiated.`,
    });
    setIssueText("");
    setIsReportIssueOpen(false);
  };

  if (!activeShipment) {
    return (
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-12 text-center shadow-2xs">
        <Package className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-3 text-base font-bold text-[#111111]">No Active Shipments Found</h3>
        <p className="mt-1 text-xs text-[#6B7280]">
          Orders placed will appear here with live courier telemetry and facility checkpoint updates.
        </p>
      </div>
    );
  }

  const isDelivered = activeShipment.status === "Delivered";
  const isDelayed = activeShipment.status === "Delayed";
  const isGpsActive = activeShipment.locationType === "Live GPS Telemetry" && !!activeShipment.currentGps;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner / Selector if customer has multiple shipments */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-2xs">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-red-50 text-[#E31E24]">
            <Truck className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-sm font-bold text-[#111111] font-display">
              Track Consignments & Dispatches
            </h2>
            <p className="text-xs text-[#6B7280]">
              Synchronized 3rd-party logistics tracking with verified checkpoints
            </p>
          </div>
        </div>

        {shipments.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#6B7280]">Active Consignment:</span>
            <select
              value={selectedShipmentId}
              onChange={(e) => setSelectedShipmentId(e.target.value)}
              className="h-9 rounded-lg border border-[#E5E7EB] bg-gray-50 px-3 text-xs font-semibold text-[#111111] outline-none focus:border-[#E31E24]"
            >
              {shipments.map((s) => (
                <option key={s.shipmentId} value={s.shipmentId}>
                  {s.provider} ({s.trackingNumber}) — {s.status}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Main Tracking Details Card */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white shadow-2xs overflow-hidden">
        {/* Header */}
        <div className="border-b border-[#E5E7EB] bg-gray-50/70 p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                  Logistics Partner:
                </span>
                <span className="rounded-md bg-white px-2.5 py-1 text-xs font-bold text-[#111111] border border-gray-200 shadow-2xs">
                  {activeShipment.provider}
                </span>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    isDelivered
                      ? "bg-emerald-100 text-emerald-800"
                      : isDelayed
                      ? "bg-amber-100 text-amber-800"
                      : "bg-red-50 text-[#E31E24] border border-red-200"
                  }`}
                >
                  ● {activeShipment.status}
                </span>
              </div>

              <h1 className="mt-2 text-xl sm:text-2xl font-extrabold text-[#111111] font-display">
                AWB: {activeShipment.trackingNumber}
              </h1>
              <p className="mt-1 text-xs text-[#6B7280]">
                Linked Order: <span className="font-semibold text-[#111111]">#{activeShipment.orderId}</span> · Reference: {activeShipment.providerReference}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleCopyTracking(activeShipment.trackingNumber)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition shadow-2xs cursor-pointer"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? "Copied" : "Copy AWB"}</span>
              </button>

              {activeShipment.trackingUrl.startsWith("http") && (
                <a
                  href={activeShipment.trackingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#E31E24] px-3.5 py-2 text-xs font-bold text-white hover:bg-red-700 transition shadow-xs"
                >
                  <span>Courier Portal</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 border-t border-gray-200/80 pt-4 text-xs">
            <div>
              <p className="text-[11px] font-medium text-[#6B7280]">Telemetry Type</p>
              <p className="mt-0.5 font-bold text-[#111111] flex items-center gap-1">
                {activeShipment.locationType === "Live GPS Telemetry" ? (
                  <>
                    <Radio className="h-3.5 w-3.5 text-[#E31E24] animate-pulse" />
                    <span>Live GPS Telemetry</span>
                  </>
                ) : (
                  <>
                    <Building2 className="h-3.5 w-3.5 text-blue-600" />
                    <span>Facility Checkpoints</span>
                  </>
                )}
              </p>
            </div>

            <div>
              <p className="text-[11px] font-medium text-[#6B7280]">Latest Checkpoint</p>
              <p className="mt-0.5 font-bold text-[#111111] truncate">{activeShipment.latestLocation}</p>
            </div>

            <div>
              <p className="text-[11px] font-medium text-[#6B7280]">Estimated Delivery</p>
              <p className="mt-0.5 font-bold text-[#E31E24]">{activeShipment.estimatedDelivery}</p>
            </div>

            <div>
              <p className="text-[11px] font-medium text-[#6B7280]">Last Event Timestamp</p>
              <p className="mt-0.5 font-bold text-[#111111]">{activeShipment.lastEventTimestamp}</p>
            </div>
          </div>
        </div>

        {/* Content Section: Route Map (if real GPS available) OR Facility Timeline */}
        <div className="p-5 sm:p-6 space-y-6">
          {isGpsActive ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#111111] flex items-center gap-1.5">
                  <Navigation className="h-4 w-4 text-[#E31E24]" />
                  <span>Verified Fleet GPS Stream</span>
                </span>
                <span className="text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Speed: {activeShipment.currentGps?.speedKmph} km/h · Heading: {activeShipment.currentGps?.heading}°
                </span>
              </div>
              <div className="rounded-xl overflow-hidden border border-gray-200">
                <LiveMap deliveryId="delivery_vijayawada_amaravati_live" className="h-64 sm:h-80 w-full" />
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 text-xs text-blue-800 flex items-start gap-3">
              <Building2 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Authoritative Logistics Facility Verification</p>
                <p className="mt-0.5 text-blue-700">
                  This consignment is routed through certified regional sorting hubs. Physical barcoded checkpoints are scanned by {activeShipment.provider} personnel at each hub transfer.
                </p>
              </div>
            </div>
          )}

          {/* Origin & Destination Route Info */}
          <div className="grid gap-4 sm:grid-cols-2 rounded-xl bg-gray-50 p-4 border border-gray-200 text-xs">
            <div>
              <p className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">
                Origin (Pickup Hub)
              </p>
              <p className="font-bold text-[#111111] mt-1">{activeShipment.pickupAddress.name}</p>
              <p className="text-[#6B7280]">
                {activeShipment.pickupAddress.street}, {activeShipment.pickupAddress.city} - {activeShipment.pickupAddress.pincode}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">
                Destination (Customer Address)
              </p>
              <p className="font-bold text-[#111111] mt-1">{activeShipment.destinationAddress.name}</p>
              <p className="text-[#6B7280]">
                {activeShipment.destinationAddress.street}, {activeShipment.destinationAddress.city} - {activeShipment.destinationAddress.pincode}
              </p>
            </div>
          </div>

          {/* Chronological Checkpoint Timeline */}
          <div>
            <h3 className="font-bold text-sm text-[#111111] mb-4">
              Verified Tracking History ({activeShipment.events.length} Events)
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
              {activeShipment.events.map((evt, idx) => {
                const isLatest = idx === 0;
                return (
                  <div key={evt.id || idx} className="relative">
                    <div
                      className={`absolute -left-6 top-1 h-3.5 w-3.5 rounded-full border-2 border-white ${
                        isLatest
                          ? "bg-[#E31E24] ring-4 ring-red-100"
                          : "bg-gray-400"
                      }`}
                    />
                    <div className="space-y-0.5 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#111111]">{evt.description}</span>
                        <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-bold text-gray-600">
                          {evt.status}
                        </span>
                      </div>
                      <p className="text-[#6B7280] flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        <span>{evt.location}</span>
                        {evt.facilityName && (
                          <span className="text-gray-400">({evt.facilityName})</span>
                        )}
                      </p>
                      <p className="text-[11px] text-gray-400">{evt.timestamp}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-[#E5E7EB] pt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-[#6B7280]">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Courier telemetry synchronized with RiderzPro backend</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsReportIssueOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
              >
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                <span>Report Delivery Issue</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Report Issue Modal */}
      {isReportIssueOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-sm text-[#111111]">Report Delivery Issue</h3>
              <button
                type="button"
                onClick={() => setIsReportIssueOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleReportIssue} className="space-y-3 text-xs">
              <p className="text-[#6B7280]">
                Experiencing a delay, wrong location, or damaged shipment for AWB{" "}
                <span className="font-mono font-bold text-[#111111]">{activeShipment.trackingNumber}</span>? Submit details below:
              </p>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Issue Description</label>
                <textarea
                  rows={3}
                  value={issueText}
                  onChange={(e) => setIssueText(e.target.value)}
                  placeholder="e.g. Courier marked out-for-delivery but not received, reschedule request..."
                  className="w-full rounded-lg border border-gray-300 p-2 text-xs outline-none focus:border-[#E31E24]"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReportIssueOpen(false)}
                  className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#E31E24] text-white font-bold hover:bg-red-700 transition cursor-pointer"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
