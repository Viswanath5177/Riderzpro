import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Bike,
  Package,
  Wallet,
  CalendarCheck,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Zap,
  ShoppingBag,
  Wrench,
  Clock,
  Sparkles,
  Phone,
  MessageSquare,
  Copy,
  Check,
  Star,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  Truck,
  Heart,
  CheckCircle2,
  Tag,
  Receipt,
  Download,
  Navigation,
} from "lucide-react";
import { toast } from "sonner";
import { LiveMap } from "@/components/site/LiveMap";
import { useStore, ORDER_STEPS, type Order } from "@/lib/store";
import { getBike, getProduct, getVendor, inr, products, riders } from "@/lib/data";
import { cn } from "@/lib/utils";
import type { CustomerTab } from "./CustomerLayout";

interface OverviewTabProps {
  onTabChange: (tab: CustomerTab) => void;
  onOpenBookingModal: () => void;
  onOpenAddBikeModal?: () => void;
}

export function OverviewTab({
  onTabChange,
  onOpenBookingModal,
  onOpenAddBikeModal: _onOpenAddBikeModal,
}: OverviewTabProps) {
  const {
    userProfile,
    garage,
    activeBikeId,
    orders,
    shipments,
    advanceOrder,
    simulateDemoOrder,
    addToCart,
    toggleSaved,
    isSaved,
    serviceBookings,
    savedProductIds,
  } = useStore();

  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [recentOrderFilter, setRecentOrderFilter] = useState<"all" | "active" | "delivered">("all");
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  const activeBike = garage.find((b) => b.bikeId === activeBikeId) || garage[0];
  const activeBikeMeta = activeBike ? getBike(activeBike.bikeId) : null;

  // Real calculations
  const totalSpent = orders.reduce((s, o) => s + o.total, 0);
  const liveOrder = orders.find((o) => o.status < 5);
  const activeOrdersCount = orders.filter((o) => o.status < 5).length;
  const processingOrdersCount = orders.filter((o) => o.status === 0 || o.status === 1).length;
  const inTransitCount = shipments.filter((s) => s.status === "In Transit" || s.status === "Out for Delivery").length;
  const deliveredCount = orders.filter((o) => o.status === 5).length;
  const activeShipment = shipments.find((s) => s.status !== "Delivered" && s.status !== "Cancelled") || shipments[0];

  // Recommended products verified for customer's active bike
  const compatibleProducts = products
    .filter((p) => (activeBike ? p.fits.includes(activeBike.bikeId) : true))
    .slice(0, 4);

  // Saved products items
  const savedItemsList = products.filter((p) => savedProductIds.includes(p.id)).slice(0, 3);

  const copyCoupon = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon code "${code}" copied to clipboard!`);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const activeRider = liveOrder?.riderId ? riders.find((r) => r.id === liveOrder.riderId) : null;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* ─────────────────────────────────────────────────────────────
          SECTION A: WELCOME SECTION & CONTEXTUAL PROMO BANNER
         ───────────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 font-display">
              Welcome back, {userProfile.name.split(" ")[0]} 👋
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Your electric vehicle command center. Track live orders, check telemetry, and book verified service.
            </p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-2 px-4.5 py-2.5 rounded-lg bg-[#E31E24] text-white text-xs font-semibold shadow-2xs hover:bg-red-700 active:scale-95 transition"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Shop Products</span>
            </Link>
            <button
              onClick={() => onTabChange("orders")}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[#E5E7EB] bg-white text-[#111111] text-xs font-semibold hover:bg-gray-50 hover:border-gray-300 active:scale-95 transition shadow-2xs"
            >
              <Truck className="h-4 w-4 text-[#E31E24]" />
              <span>Track Order</span>
            </button>
          </div>
        </div>

        {/* Monsoon EV Care Campaign Banner */}
        <div className="relative overflow-hidden rounded-xl border border-[#E5E7EB] bg-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-start sm:items-center gap-3.5">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#E31E24] text-white shadow-2xs shrink-0">
              <Zap className="h-5 w-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-red-50 text-[#E31E24] text-[10px] font-bold uppercase tracking-wider">
                  Monsoon Special
                </span>
                <span className="text-xs font-bold text-[#111111]">Free 24-Point Battery & BMS Diagnostic</span>
              </div>
              <p className="text-xs text-[#6B7280] mt-0.5">
                Protect your EV against monsoon humidity and thermal imbalance. Free with any parts order above ₹5,000.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
            <div className="flex items-center border border-dashed border-red-300 bg-red-50/50 rounded-lg px-2.5 py-1 text-xs font-mono font-bold text-[#E31E24]">
              EVSAFE
            </div>
            <button
              onClick={() => copyCoupon("EVSAFE")}
              className="p-1.5 rounded-lg bg-white border border-[#E5E7EB] text-gray-600 hover:text-[#E31E24] transition"
              title="Copy promo code"
            >
              {copiedCode === "EVSAFE" ? <Check className="h-4 w-4 text-[#E31E24]" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION B: SUMMARY METRIC CARDS (4 RESPONSIVE SOLID WHITE CARDS)
         ───────────────────────────────────────────────────────────── */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Orders */}
        <div
          onClick={() => onTabChange("orders")}
          className="group rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs hover:shadow-md hover:border-gray-300 p-5 cursor-pointer transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Total Orders</span>
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-gray-100 text-[#111111] group-hover:bg-red-50 group-hover:text-[#E31E24] transition shadow-2xs">
              <Package className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-extrabold text-[#111111] font-display leading-none">{orders.length}</p>
            <p className="text-xs text-[#6B7280] mt-1">
              All placed & recorded orders
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E5E7EB] flex items-center justify-between text-[11px] font-semibold text-[#E31E24]">
            <span>View all orders</span>
            <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition" />
          </div>
        </div>

        {/* Card 2: Orders Being Processed */}
        <div
          onClick={() => onTabChange("orders")}
          className="group rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs hover:shadow-md hover:border-gray-300 p-5 cursor-pointer transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Being Processed</span>
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-amber-50 text-amber-700 group-hover:scale-105 transition shadow-2xs">
              <Clock className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-extrabold text-amber-700 font-display leading-none">{processingOrdersCount}</p>
            <p className="text-xs text-[#6B7280] mt-1">
              {processingOrdersCount > 0 ? "Supplier packing & verification" : "Zero orders awaiting processing"}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E5E7EB] flex items-center justify-between text-[11px] font-semibold text-[#E31E24]">
            <span>Fulfillment queue</span>
            <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition" />
          </div>
        </div>

        {/* Card 3: Shipments in Transit */}
        <div
          onClick={() => onTabChange("tracking")}
          className="group rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs hover:shadow-md hover:border-gray-300 p-5 cursor-pointer transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Shipments in Transit</span>
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-red-50 text-[#E31E24] group-hover:scale-105 transition shadow-2xs">
              <Truck className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-extrabold text-[#E31E24] font-display leading-none">{inTransitCount}</p>
            <p className="text-xs text-[#6B7280] mt-1">
              {inTransitCount > 0 ? `${inTransitCount} active courier dispatches` : "No consignments in transit"}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E5E7EB] flex items-center justify-between text-[11px] font-semibold text-[#E31E24]">
            <span>Track live delivery</span>
            <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition" />
          </div>
        </div>

        {/* Card 4: Delivered Orders */}
        <div
          onClick={() => onTabChange("orders")}
          className="group rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs hover:shadow-md hover:border-gray-300 p-5 cursor-pointer transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Delivered Orders</span>
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-50 text-emerald-700 group-hover:scale-105 transition">
              <CheckCircle2 className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-extrabold text-emerald-700 font-display leading-none">
              {deliveredCount}
            </p>
            <p className="text-xs text-[#6B7280] mt-1">
              Verified doorstep handovers
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E5E7EB] flex items-center justify-between text-[11px] font-semibold text-[#E31E24]">
            <span>Delivered history</span>
            <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition" />
          </div>
        </div>
      </section>



      {/* ─────────────────────────────────────────────────────────────
          SECTION D & E: ORDERS & LIVE TRACKING + RECENT ORDERS
         ───────────────────────────────────────────────────────────── */}
      {/* ─────────────────────────────────────────────────────────────
          SECTION D & E: ORDERS & LIVE TRACKING + RECENT ORDERS (REVAMPED)
         ───────────────────────────────────────────────────────────── */}
      {/* Tax Invoice Modal for Quick View */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-gray-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <p className="text-base font-bold text-gray-900 font-display">Tax Invoice & Receipt</p>
                <p className="text-xs text-gray-500 font-mono">Invoice #{selectedInvoiceOrder.id}</p>
              </div>
              <button
                onClick={() => setSelectedInvoiceOrder(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="text-xs space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Date: {new Date(selectedInvoiceOrder.createdAt).toLocaleDateString("en-IN")}</span>
                <span>Payment: {selectedInvoiceOrder.payment}</span>
              </div>

              <div className="border border-gray-100 rounded-2xl p-3 bg-gray-50 divide-y divide-gray-100">
                {selectedInvoiceOrder.groups.map((g) => {
                  const v = getVendor(g.vendorId);
                  return (
                    <div key={g.vendorId} className="py-2 first:pt-0 last:pb-0">
                      <p className="font-bold text-gray-800">{v?.name || "Verified EV Vendor"}</p>
                      {g.items.map((it) => {
                        const p = getProduct(it.productId);
                        return (
                          <div key={it.productId} className="flex justify-between text-gray-600 mt-1">
                            <span>{it.qty} × {p?.name || "EV Spare"}</span>
                            <span className="font-semibold text-gray-900">{inr(it.price * it.qty)}</span>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>

              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>{inr(selectedInvoiceOrder.itemsTotal)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Doorstep Delivery (GPS Logged)</span>
                  <span>{inr(selectedInvoiceOrder.deliveryTotal)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>GST (18% Statutory EV Tax)</span>
                  <span>{inr(selectedInvoiceOrder.tax)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-gray-900 pt-2 border-t border-gray-100">
                  <span>Total Amount Paid</span>
                  <span className="text-[#E31E24]">{inr(selectedInvoiceOrder.total)}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
              <button
                onClick={() => {
                  toast.success(`Invoice ${selectedInvoiceOrder.id}.pdf downloaded`);
                  setSelectedInvoiceOrder(null);
                }}
                className="px-4 py-2 rounded-xl bg-[#E31E24] text-white text-xs font-semibold hover:bg-red-700 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download PDF Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="grid gap-6 lg:grid-cols-[1.25fr_1fr]">
        {/* SECTION D: Active Order & Live Doorstep Delivery Tracking */}
        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-2xs flex flex-col justify-between space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  {liveOrder && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  )}
                  <span className={cn("relative inline-flex rounded-full h-2.5 w-2.5", liveOrder ? "bg-emerald-500" : "bg-gray-300")} />
                </span>
                <h2 className="text-base font-bold text-gray-900 font-display">Live Doorstep Delivery</h2>
                {liveOrder && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <Zap className="h-3 w-3" />
                    <span>In Transit</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">Real-time GPS rider telemetry & multi-vendor dispatch tracker.</p>
            </div>

            {liveOrder ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/track/$id"
                  params={{ id: liveOrder.id }}
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 bg-red-50 px-3 py-1.5 rounded-xl border border-red-100"
                >
                  <Navigation className="h-3.5 w-3.5" />
                  <span>Interactive Map</span>
                </Link>
              </div>
            ) : (
              <button
                onClick={() => {
                  simulateDemoOrder();
                  toast.success("Sample order created! Watch live dispatch progress.");
                }}
                className="text-xs font-semibold text-white bg-[#E31E24] hover:bg-red-700 px-3 py-1.5 rounded-xl transition shadow-2xs cursor-pointer"
              >
                + Simulate Test Order
              </button>
            )}
          </div>

          {liveOrder ? (
            <div className="space-y-4 flex-1 flex flex-col justify-between">
              {/* Telemetry HUD Strip */}
              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-2xl bg-gray-50 border border-gray-100 text-center text-xs">
                <div className="border-r border-gray-200/60 pr-1">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Speed</p>
                  <p className="font-bold text-gray-900 mt-0.5 text-xs flex items-center justify-center gap-1">
                    <Zap className="h-3 w-3 text-emerald-500" />
                    <span>32 km/h</span>
                  </p>
                </div>
                <div className="border-r border-gray-200/60 pr-1">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Courier EV</p>
                  <p className="font-bold text-gray-900 mt-0.5 text-xs">Ather 450X · 88%</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">ETA</p>
                  <p className="font-bold text-emerald-700 mt-0.5 text-xs">~{Math.max(5, liveOrder.eta)} mins</p>
                </div>
              </div>

              {/* Live Map Frame */}
              <div className="overflow-hidden rounded-2xl border border-gray-200 relative shadow-2xs">
                <LiveMap stops={liveOrder.groups.length} className="aspect-video w-full" />
                <div className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-gray-200 text-[10px] font-bold text-gray-800 shadow-2xs flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span>GPS Lock: 99.8% Accuracy</span>
                </div>
              </div>

              {/* Order Info & Consignment Strip */}
              <div className="p-3.5 rounded-2xl bg-gray-50/80 border border-gray-100 text-xs space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 font-mono">#{liveOrder.id}</span>
                    <span className="text-gray-400">·</span>
                    <span className="text-gray-500">{new Date(liveOrder.createdAt).toLocaleDateString("en-IN")}</span>
                    <span className="text-gray-400">·</span>
                    <span className="text-gray-500 font-medium">Paid via {liveOrder.payment}</span>
                  </div>
                  <span className="font-bold text-gray-900 text-sm">{inr(liveOrder.total)}</span>
                </div>

                {/* Items in Consignment */}
                <div className="flex flex-wrap gap-1.5 pt-1 border-t border-gray-200/60">
                  {liveOrder.groups.flatMap((g) => g.items).map((it, idx) => {
                    const prod = getProduct(it.productId);
                    return (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-gray-200 text-[10px] font-medium text-gray-700"
                      >
                        <Package className="h-2.5 w-2.5 text-[#E31E24]" />
                        <span>{it.qty}× {prod?.name || it.productId}</span>
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Active Shipment Telemetry if available */}
              {activeShipment && (
                <div
                  onClick={() => onTabChange("tracking")}
                  className="p-3 rounded-2xl bg-red-50/60 border border-red-200 hover:bg-red-50 cursor-pointer transition flex items-center justify-between gap-2 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#E31E24] text-white shrink-0 shadow-2xs">
                      <Truck className="h-4 w-4" />
                    </span>
                    <div className="truncate">
                      <p className="font-bold text-[#111111] truncate">
                        {activeShipment.provider} Courier · AWB {activeShipment.trackingNumber}
                      </p>
                      <p className="text-[11px] text-[#6B7280] truncate">
                        Last Checkpoint: <span className="font-semibold text-gray-900">{activeShipment.latestLocation}</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-bold text-[#E31E24] bg-white px-2 py-0.5 rounded border border-red-200">
                      {activeShipment.estimatedDelivery}
                    </span>
                  </div>
                </div>
              )}

              {/* Horizontal Progress Timeline */}
              <div className="pt-1">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Milestone Dispatch Timeline
                  </p>
                  <span className="text-[10px] font-semibold text-primary">
                    Step {liveOrder.status + 1} of {ORDER_STEPS.length}
                  </span>
                </div>
                <div className="grid grid-cols-6 gap-1 relative text-center">
                  {ORDER_STEPS.map((step, idx) => {
                    const isPassed = idx <= liveOrder.status;
                    const isCurrent = idx === liveOrder.status;
                    return (
                      <div key={step} className="flex flex-col items-center">
                        <div
                          className={cn(
                            "h-7 w-7 rounded-full grid place-items-center text-[10px] font-bold transition-all duration-300",
                            isCurrent
                              ? "bg-[#E31E24] text-white ring-4 ring-red-100 scale-110 shadow-xs"
                              : isPassed
                              ? "bg-emerald-600 text-white"
                              : "bg-gray-100 text-gray-400 border border-gray-200"
                          )}
                        >
                          {isPassed ? <Check className="h-3.5 w-3.5" /> : idx + 1}
                        </div>
                        <p
                          className={cn(
                            "mt-1.5 text-[9px] leading-tight line-clamp-1",
                            isCurrent ? "font-bold text-[#111111]" : isPassed ? "font-medium text-gray-700" : "text-gray-400"
                          )}
                        >
                          {step}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Rider Assigned Card */}
              {activeRider && (
                <div className="p-3 rounded-2xl border border-gray-200 bg-white flex items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 text-white font-bold text-xs shadow-xs shrink-0">
                      {activeRider.avatar}
                    </span>
                    <div className="truncate">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-bold text-gray-900 truncate">{activeRider.name}</p>
                        <span className="flex items-center text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 font-semibold shrink-0">
                          <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400 inline mr-0.5" />
                          {activeRider.rating}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 truncate">
                        {activeRider.vehicle} · {activeRider.plate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={`tel:${activeRider.phone}`}
                      className="p-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-[#E31E24] hover:text-white transition cursor-pointer"
                      title="Call Delivery Partner"
                    >
                      <Phone className="h-3.5 w-3.5" />
                    </a>
                    {liveOrder.status < 5 && (
                      <button
                        onClick={() => advanceOrder(liveOrder.id)}
                        className="px-2.5 py-1.5 rounded-xl border border-gray-200 text-gray-700 hover:border-[#E31E24] hover:text-[#E31E24] text-[11px] font-semibold transition cursor-pointer"
                      >
                        Advance Step →
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-14 px-6 text-center flex flex-col items-center justify-center flex-1">
              <span className="grid h-16 w-16 place-items-center rounded-3xl bg-red-50 text-[#E31E24] mb-3">
                <Truck className="h-8 w-8" />
              </span>
              <p className="text-base font-bold text-gray-900 font-display">No Active Deliveries Right Now</p>
              <p className="text-xs text-gray-500 mt-1 max-w-sm">
                When you order batteries, chargers, or replacement components, real-time rider tracking, GPS telematics, and ETA countdowns will appear here.
              </p>
              <div className="mt-5 flex items-center gap-3">
                <button
                  onClick={() => onTabChange("garage")}
                  className="px-4 py-2 rounded-xl bg-[#E31E24] text-white text-xs font-semibold shadow-xs hover:bg-red-700 transition cursor-pointer"
                >
                  View Garage Spares
                </button>
                <button
                  onClick={() => {
                    simulateDemoOrder();
                    toast.success("Demo order created! See live tracker.");
                  }}
                  className="px-3.5 py-2 rounded-xl border border-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-50 transition cursor-pointer"
                >
                  Simulate Order
                </button>
              </div>
            </div>
          )}
        </div>

        {/* SECTION E: Recent Orders (Revamped like My Orders) */}
        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-2xs flex flex-col justify-between space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-base font-bold text-gray-900 font-display">Recent Orders</h2>
              <p className="text-xs text-gray-500 mt-0.5">Purchases and doorstep parts delivery logs.</p>
            </div>
            <button
              onClick={() => onTabChange("orders")}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Quick Filter Pills */}
          <div className="flex gap-1.5">
            {[
              { id: "all", label: `All (${orders.length})` },
              { id: "active", label: `In Transit (${activeOrdersCount})` },
              { id: "delivered", label: `Delivered (${deliveredCount})` },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setRecentOrderFilter(t.id as any)}
                className={cn(
                  "px-3 py-1 rounded-xl text-xs font-semibold border transition cursor-pointer",
                  recentOrderFilter === t.id
                    ? "bg-[#E31E24] text-white border-[#E31E24]"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50 bg-white"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Orders Card Feed */}
          <div className="flex-1 space-y-3 overflow-y-auto max-h-[460px] pr-0.5">
            {orders.filter((o) => {
              if (recentOrderFilter === "active") return o.status < 5;
              if (recentOrderFilter === "delivered") return o.status === 5;
              return true;
            }).length === 0 ? (
              <div className="py-12 text-center text-xs text-gray-400 border border-dashed border-gray-200 rounded-2xl p-6">
                <Package className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                <p className="font-semibold text-gray-700">No orders match this filter</p>
                <p className="text-gray-400 mt-0.5">Check our certified EV components and order doorstep delivery.</p>
                <button
                  onClick={() => onTabChange("garage")}
                  className="mt-3 inline-block px-3 py-1.5 rounded-lg bg-red-50 text-[#E31E24] font-semibold text-xs hover:bg-red-100 transition cursor-pointer"
                >
                  Explore Garage Spares
                </button>
              </div>
            ) : (
              orders
                .filter((o) => {
                  if (recentOrderFilter === "active") return o.status < 5;
                  if (recentOrderFilter === "delivered") return o.status === 5;
                  return true;
                })
                .slice(0, 4)
                .map((o) => {
                  const firstVendor = o.groups[0] ? getVendor(o.groups[0].vendorId) : null;
                  const totalItems = o.groups.reduce((s, g) => s + g.items.reduce((sum, it) => sum + it.qty, 0), 0);

                  return (
                    <div
                      key={o.id}
                      className="rounded-2xl border border-gray-200/90 bg-white p-3.5 shadow-2xs hover:border-gray-300 hover:shadow-xs transition space-y-2.5"
                    >
                      {/* Top Row: ID, Status, Date */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-gray-900">
                            #{o.id}
                          </span>
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-full text-[10px] font-bold",
                              o.status === 5
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-blue-50 text-blue-700 border border-blue-200 animate-pulse"
                            )}
                          >
                            {ORDER_STEPS[o.status]}
                          </span>
                        </div>
                        <span className="text-[11px] text-gray-400">
                          {new Date(o.createdAt).toLocaleDateString("en-IN")}
                        </span>
                      </div>

                      {/* Items & Vendor Pills */}
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                        <span className="text-gray-500 font-medium">
                          {firstVendor?.name || "Verified EV Hub"}:
                        </span>
                        {o.groups.flatMap((g) => g.items).slice(0, 2).map((it, idx) => {
                          const p = getProduct(it.productId);
                          return (
                            <span
                              key={idx}
                              className="inline-flex items-center px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 text-[10px] font-medium"
                            >
                              {it.qty}× {p?.name || it.productId}
                            </span>
                          );
                        })}
                        {totalItems > 2 && (
                          <span className="text-[10px] text-gray-400">
                            +{totalItems - 2} more
                          </span>
                        )}
                      </div>

                      {/* Bottom Row: Price, Payment & Action Buttons */}
                      <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                        <div>
                          <span className="text-xs font-extrabold text-gray-900">{inr(o.total)}</span>
                          <span className="text-[10px] text-gray-400 ml-1.5 font-medium">· {o.payment}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setSelectedInvoiceOrder(o)}
                            className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition cursor-pointer"
                            title="View Tax Invoice"
                          >
                            <Receipt className="h-3.5 w-3.5" />
                          </button>
                          <Link
                            to="/track/$id"
                            params={{ id: o.id }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-[#E31E24] hover:text-white text-[11px] font-semibold text-gray-700 transition"
                          >
                            <span>Track</span>
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })
            )}
          </div>

          <div className="pt-3 border-t border-gray-100 text-center">
            <button
              onClick={() => onTabChange("orders")}
              className="text-xs font-semibold text-primary hover:underline transition cursor-pointer"
            >
              Open Full Orders & Tracking Center →
            </button>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION F: SERVICE AND MAINTENANCE REMINDERS
         ───────────────────────────────────────────────────────────── */}
      <section className="rounded-3xl border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-xl bg-purple-50 text-purple-600">
                <Wrench className="h-4 w-4" />
              </span>
              <h2 className="text-base font-bold text-gray-900 font-display">Service & Preventive Maintenance</h2>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Automated service intervals based on odometer wear for {activeBikeMeta ? `${activeBikeMeta.make} ${activeBikeMeta.model}` : "your bike"}.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenBookingModal}
              className="px-3.5 py-2 rounded-xl bg-primary text-white text-xs font-semibold shadow-xs hover:bg-emerald-600 transition"
            >
              + Book Technician (₹299)
            </button>
            <button
              onClick={() => onTabChange("service")}
              className="px-3 py-2 rounded-xl border border-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-50 transition"
            >
              Service History
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {/* Item 1: Battery & BMS Health */}
          <div className="p-4 rounded-2xl bg-[#F7F9FB] border border-gray-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Due in 42 Days
              </span>
              <span className="text-[11px] font-mono font-medium text-gray-400">Interval: 6 mo</span>
            </div>
            <p className="text-sm font-bold text-gray-900">BMS Calibration & Cell Health Audit</p>
            <p className="text-xs text-gray-600 leading-relaxed">
              Detect voltage drift, thermal balance across cell strings, and check IP67 seal integrity.
            </p>
            <button
              onClick={onOpenBookingModal}
              className="text-xs font-semibold text-primary hover:underline pt-1 block"
            >
              Schedule checkup →
            </button>
          </div>

          {/* Item 2: Regenerative Braking & Rotors */}
          <div className="p-4 rounded-2xl bg-[#F7F9FB] border border-gray-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                Inspect at 15,000 km
              </span>
              <span className="text-[11px] font-mono font-medium text-gray-400">2,550 km left</span>
            </div>
            <p className="text-sm font-bold text-gray-900">Brake Fluid & Pad Wear Inspection</p>
            <p className="text-xs text-gray-600 leading-relaxed">
              Check front/rear rotor thickness, bleed air from hydraulic lines, and calibrate regen cutoff switch.
            </p>
            <button
              onClick={onOpenBookingModal}
              className="text-xs font-semibold text-primary hover:underline pt-1 block"
            >
              Book brake overhaul →
            </button>
          </div>

          {/* Item 3: Belt & Hub Motor Bearings */}
          <div className="p-4 rounded-2xl bg-[#F7F9FB] border border-gray-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                Standard Care
              </span>
              <span className="text-[11px] font-mono font-medium text-gray-400">Doorstep</span>
            </div>
            <p className="text-sm font-bold text-gray-900">Drive Belt Tension & Axle Inspection</p>
            <p className="text-xs text-gray-600 leading-relaxed">
              Ensure vibration dampeners, motor mount torques, and tire pressure are optimized for maximum range.
            </p>
            <button
              onClick={onOpenBookingModal}
              className="text-xs font-semibold text-primary hover:underline pt-1 block"
            >
              Book technician visit →
            </button>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION G: RECOMMENDED PARTS & ACCESSORIES (COMPATIBLE!)
         ───────────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-900 font-display">Recommended Compatible Parts</h2>
              {activeBikeMeta && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  ✓ Verified for {activeBikeMeta.make} {activeBikeMeta.model}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500">
              Only verified components matching your voltage, frame geometry, and connector pinouts.
            </p>
          </div>
          <button
            onClick={() => onTabChange("garage")}
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            <span>All Garage Spares</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {compatibleProducts.map((p) => {
            const offer = p.offers[0];
            const saved = isSaved(p.id);
            return (
              <div
                key={p.id}
                className="group rounded-3xl border border-[#E5E7EB] bg-white overflow-hidden shadow-2xs hover:shadow-lg hover:border-primary/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-0.5 rounded-full bg-white border border-[#E5E7EB] text-gray-800 text-[10px] font-bold shadow-2xs">
                      {p.category}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      toggleSaved(p.id);
                      toast.success(saved ? "Removed from saved" : "Saved to wishlist");
                    }}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white border border-[#E5E7EB] text-gray-600 hover:text-rose-500 shadow-2xs transition"
                    title={saved ? "Remove from saved" : "Save for later"}
                  >
                    <Heart className={cn("h-4 w-4", saved && "fill-rose-500 text-rose-500")} />
                  </button>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      ✓ Fits {activeBikeMeta ? activeBikeMeta.model : "Your Bike"}
                    </span>
                    <Link
                      to="/product/$id"
                      params={{ id: p.id }}
                      className="block text-sm font-bold text-gray-900 group-hover:text-primary transition mt-1.5 line-clamp-1"
                    >
                      {p.name}
                    </Link>
                    <p className="text-xs text-gray-500 mt-0.5">{p.brand} · {p.warrantyMonths}m warranty</p>
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="text-base font-extrabold text-gray-900">{inr(offer.price)}</p>
                      <span className="text-[10px] text-emerald-600 font-medium">In stock · Ready</span>
                    </div>
                    <button
                      onClick={() => {
                        addToCart(p.id, offer.vendorId);
                        toast.success(`${p.name} added to cart`);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-semibold shadow-xs hover:bg-emerald-600 active:scale-95 transition"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION H: SAVED ITEMS & EXCLUSIVE OFFERS
         ───────────────────────────────────────────────────────────── */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* Saved Items Quick Panel */}
        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-xl bg-rose-50 text-rose-600">
                  <Heart className="h-4 w-4" />
                </span>
                <h2 className="text-base font-bold text-gray-900 font-display">Saved Parts & Wishlist</h2>
              </div>
              <button
                onClick={() => onTabChange("saved")}
                className="text-xs font-semibold text-primary hover:underline"
              >
                View all ({savedProductIds.length})
              </button>
            </div>

            <div className="mt-3 divide-y divide-gray-100">
              {savedItemsList.length === 0 ? (
                <p className="py-8 text-center text-xs text-gray-400">
                  You haven&rsquo;t saved any items yet. Tap the heart icon on any product to save.
                </p>
              ) : (
                savedItemsList.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-12 w-12 rounded-xl object-cover bg-gray-100 border border-gray-200"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-900 truncate">{item.name}</p>
                      <p className="text-[11px] text-gray-500">
                        {item.category} · {inr(item.offers[0].price)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          addToCart(item.id, item.offers[0].vendorId);
                          toast.success(`${item.name} added to cart`);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-semibold hover:bg-primary hover:text-white transition"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => toggleSaved(item.id)}
                        className="p-1 rounded-md text-gray-400 hover:text-rose-500 transition"
                        title="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 text-center">
            <button
              onClick={() => onTabChange("saved")}
              className="text-xs font-semibold text-gray-600 hover:text-primary transition"
            >
              Manage saved wishlist items →
            </button>
          </div>
        </div>

        {/* Exclusive Coupons & ProPoints Balance */}
        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-xl bg-amber-50 text-amber-600">
                  <Tag className="h-4 w-4" />
                </span>
                <h2 className="text-base font-bold text-gray-900 font-display">Active Offers & Rewards</h2>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                {userProfile.points} ProPoints Active
              </span>
            </div>

            <div className="mt-3 space-y-2.5">
              {/* Coupon 1 */}
              <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200/80 flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-gray-900 bg-white px-2 py-0.5 rounded-md border border-gray-200">
                      RIDERZ10
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700">10% OFF Batteries</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">Valid on all NMC & LiFePO4 packs above ₹30,000.</p>
                </div>
                <button
                  onClick={() => copyCoupon("RIDERZ10")}
                  className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition"
                >
                  {copiedCode === "RIDERZ10" ? "Copied" : "Copy"}
                </button>
              </div>

              {/* Coupon 2 */}
              <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200/80 flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-gray-900 bg-white px-2 py-0.5 rounded-md border border-gray-200">
                      FREEDEL
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700">Free Express Delivery</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">Zero delivery fee on all spare parts and chargers.</p>
                </div>
                <button
                  onClick={() => copyCoupon("FREEDEL")}
                  className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition"
                >
                  {copiedCode === "FREEDEL" ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-gray-500">
              Loyalty Points Value: <b className="text-gray-900">{inr(userProfile.points)}</b> discount
            </span>
            <button
              onClick={() => onTabChange("offers")}
              className="font-semibold text-primary hover:underline"
            >
              View Rewards Tier →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
