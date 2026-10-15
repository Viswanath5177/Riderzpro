import { useState } from "react";
import {
  Truck,
  Package,
  Search,
  ShoppingBag,
  ExternalLink,
  Copy,
  Check,
  MapPin,
  Clock,
  Radio,
  Building2,
  ShieldCheck,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import type { NormalizedShipment } from "@/lib/logistics/types";
import { LiveMap } from "@/components/site/LiveMap";

interface TrackingTabProps {
  onTabChange?: (tab: any) => void;
}

export function TrackingTab({ onTabChange }: TrackingTabProps) {
  const { shipments, orders, simulateDemoOrder } = useStore();
  const [searchTrackingInput, setSearchTrackingInput] = useState("");
  const [activeSearchedShipment, setActiveSearchedShipment] = useState<NormalizedShipment | null>(null);
  const [copied, setCopied] = useState(false);

  // Default active shipment if exists in store
  const currentShipment: NormalizedShipment | undefined =
    activeSearchedShipment || (shipments.length > 0 ? shipments[0] : undefined);

  const handleTrackSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchTrackingInput.trim();
    if (!query) {
      toast.error("Please enter an Order ID or AWB tracking number");
      return;
    }

    // Search in existing shipments
    const found = shipments.find(
      (s) =>
        s.trackingNumber.toLowerCase() === query.toLowerCase() ||
        s.orderId.toLowerCase() === query.toLowerCase() ||
        s.shipmentId.toLowerCase() === query.toLowerCase()
    );

    if (found) {
      setActiveSearchedShipment(found);
      toast.success(`Consignment found for ${found.trackingNumber}`);
    } else {
      // Check if it's an existing order without shipment yet
      const matchedOrder = orders.find((o) => o.id.toLowerCase() === query.toLowerCase());
      if (matchedOrder) {
        toast.info(`Order #${matchedOrder.id} is confirmed and currently in warehouse packing.`);
      } else {
        toast.error(`No consignment or order found for "${query}"`);
      }
    }
  };

  const handleSimulate = () => {
    const demo = simulateDemoOrder();
    toast.success(`Demo order #${demo.id} and live Delhivery shipment simulated!`);
  };

  const handleCopyTracking = (trackNum: string) => {
    navigator.clipboard.writeText(trackNum);
    setCopied(true);
    toast.success("Tracking number copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* ─────────────────────────────────────────────────────────────
          1. HERO RED BANNER: TRACK YOUR ORDER (Matches Screenshot 3)
         ───────────────────────────────────────────────────────────── */}
      <div className="rounded-3xl bg-[#E31E24] p-8 sm:p-12 text-white text-center shadow-md relative overflow-hidden flex flex-col items-center justify-center space-y-4">
        {/* Background glow styling */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute -left-10 -top-10 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-4 w-full max-w-lg flex flex-col items-center">
          {/* Truck Icon in Translucent Circle */}
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/20 text-white shadow-2xs">
            <Truck className="h-7 w-7" />
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              Track Your Order
            </h1>
            <p className="text-xs sm:text-sm text-white/90 mt-1">
              Enter your Order ID or AWB tracking number below
            </p>
          </div>

          {/* Search Input & Button Form */}
          <form onSubmit={handleTrackSubmit} className="w-full space-y-2.5">
            <div className="relative">
              <input
                type="text"
                value={searchTrackingInput}
                onChange={(e) => setSearchTrackingInput(e.target.value)}
                placeholder="e.g. RZ-123456 or DEL98765432"
                className="w-full rounded-full bg-white px-5 py-3 text-xs sm:text-sm text-[#111111] placeholder:text-gray-400 shadow-md outline-none focus:ring-2 focus:ring-white/40"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-white hover:bg-gray-50 text-[#E31E24] font-extrabold text-xs sm:text-sm py-3 px-6 shadow-sm transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Search className="h-4 w-4" />
              <span>Track Order</span>
            </button>
          </form>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. SHIPMENT STATE (Empty state matches Screenshot 3, or active tracker)
         ───────────────────────────────────────────────────────────── */}
      {!currentShipment ? (
        <div className="rounded-3xl border border-gray-200/80 bg-white p-10 sm:p-14 text-center space-y-4 shadow-2xs">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gray-50 text-gray-400 mx-auto">
            <Package className="h-7 w-7" />
          </div>

          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-bold text-[#111111]">
              No Active Shipments
            </h2>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Your deliveries will appear here once an order has been dispatched.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                if (typeof window !== "undefined") {
                  const url = new URL(window.location.href);
                  url.searchParams.set("tab", "orders");
                  window.location.href = url.toString();
                }
              }}
              className="px-5 py-2.5 rounded-xl bg-[#E31E24] hover:bg-red-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
            >
              View My Orders
            </button>

            <button
              onClick={() => {
                if (typeof window !== "undefined") {
                  const url = new URL(window.location.href);
                  url.searchParams.set("tab", "shop");
                  window.location.href = url.toString();
                }
              }}
              className="px-5 py-2.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <ShoppingBag className="h-3.5 w-3.5 text-gray-500" />
              <span>Shop Parts</span>
            </button>
          </div>
        </div>
      ) : (
        /* Detailed Active Shipment View when tracking is available */
        <div className="rounded-3xl border border-gray-200/80 bg-white shadow-2xs overflow-hidden">
          {/* Header */}
          <div className="border-b border-gray-100 bg-gray-50/60 p-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Carrier:
                </span>
                <span className="rounded-md bg-white px-2.5 py-0.5 text-xs font-bold text-gray-900 border border-gray-200 shadow-2xs">
                  {currentShipment.provider}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 text-[#E31E24] border border-red-200">
                  ● {currentShipment.status}
                </span>
              </div>

              <h2 className="mt-2 text-xl sm:text-2xl font-extrabold text-[#111111] font-display">
                AWB: {currentShipment.trackingNumber}
              </h2>
              <p className="mt-0.5 text-xs text-gray-500">
                Linked Order: <span className="font-semibold text-gray-900">#{currentShipment.orderId}</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleCopyTracking(currentShipment.trackingNumber)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 transition shadow-2xs cursor-pointer"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? "Copied" : "Copy AWB"}</span>
              </button>

              {currentShipment.trackingUrl && (
                <a
                  href={currentShipment.trackingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#E31E24] hover:bg-red-700 px-4 py-2 text-xs font-bold text-white transition shadow-xs"
                >
                  <span>Courier Portal</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>

          {/* Timeline & Map Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
            {/* Timeline */}
            <div className="p-6 space-y-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#E31E24]" />
                Checkpoint Progress
              </h3>

              <div className="space-y-4 relative pl-4 border-l-2 border-red-200 ml-2">
                {currentShipment.events.map((ev, idx) => (
                  <div key={ev.id || idx} className="relative">
                    <span className="absolute -left-[23px] top-1 h-3.5 w-3.5 rounded-full bg-[#E31E24] border-2 border-white shadow-2xs" />
                    <div>
                      <p className="text-xs font-bold text-gray-900">{ev.status} · {ev.location}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{ev.description}</p>
                      <span className="text-[10px] text-gray-400 font-mono mt-1 block">{ev.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map / Coordinates */}
            <div className="p-6 space-y-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#E31E24]" />
                Live Hub Dispatch Map
              </h3>
              <div className="h-64 rounded-2xl overflow-hidden border border-gray-200">
                <LiveMap />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          3. DEVELOPMENT PREVIEW (Matches Screenshot 3 bottom button)
         ───────────────────────────────────────────────────────────── */}
      <div className="pt-6 text-center space-y-2">
        <p className="text-[10.5px] font-bold tracking-wider text-gray-400 uppercase">
          DEVELOPMENT PREVIEW
        </p>
        <button
          onClick={handleSimulate}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-xs font-bold text-gray-700 shadow-2xs hover:border-gray-300 transition cursor-pointer active:scale-95"
        >
          <span>+ Simulate Demo Shipment</span>
        </button>
      </div>
    </div>
  );
}
