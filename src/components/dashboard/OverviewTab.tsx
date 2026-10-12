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
  Plus,
  CheckCircle2,
  Tag,
} from "lucide-react";
import { toast } from "sonner";
import scooterImg from "@/assets/scooter.jpg";
import { LiveMap } from "@/components/site/LiveMap";
import { useStore, ORDER_STEPS, type Order } from "@/lib/store";
import { getBike, getProduct, getVendor, inr, products, riders } from "@/lib/data";
import { cn } from "@/lib/utils";
import type { CustomerTab } from "./CustomerLayout";

interface OverviewTabProps {
  onTabChange: (tab: CustomerTab) => void;
  onOpenBookingModal: () => void;
  onOpenAddBikeModal: () => void;
}

export function OverviewTab({
  onTabChange,
  onOpenBookingModal,
  onOpenAddBikeModal,
}: OverviewTabProps) {
  const {
    userProfile,
    garage,
    activeBikeId,
    setActiveBikeId,
    orders,
    advanceOrder,
    simulateDemoOrder,
    addToCart,
    toggleSaved,
    isSaved,
    serviceBookings,
    savedProductIds,
  } = useStore();

  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const activeBike = garage.find((b) => b.bikeId === activeBikeId) || garage[0];
  const activeBikeMeta = activeBike ? getBike(activeBike.bikeId) : null;

  // Real calculations
  const totalSpent = orders.reduce((s, o) => s + o.total, 0);
  const liveOrder = orders.find((o) => o.status < 5);
  const activeOrdersCount = orders.filter((o) => o.status < 5).length;
  const upcomingServices = serviceBookings.filter(
    (s) => s.status === "Confirmed" || s.status === "In progress"
  );

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
          SECTION B: SUMMARY METRIC CARDS (4 RESPONSIVE CARDS)
         ───────────────────────────────────────────────────────────── */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Orders */}
        <div
          onClick={() => onTabChange("orders")}
          className="group rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-2xs hover:shadow-sm hover:border-[#E31E24] cursor-pointer transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Total Orders</span>
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gray-100 text-[#111111] group-hover:bg-red-50 group-hover:text-[#E31E24] transition">
              <Package className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-extrabold text-[#111111] font-display leading-none">{orders.length}</p>
            <p className="text-xs text-[#6B7280] mt-1">
              All placed & recorded orders
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] font-semibold text-[#E31E24]">
            <span>View order history</span>
            <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition" />
          </div>
        </div>

        {/* Card 2: Active Shipments */}
        <div
          onClick={() => onTabChange("orders")}
          className="group rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-2xs hover:shadow-sm hover:border-[#E31E24] cursor-pointer transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Active Shipments</span>
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-red-50 text-[#E31E24] group-hover:scale-105 transition">
              <Truck className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-extrabold text-[#E31E24] font-display leading-none">{activeOrdersCount}</p>
            <p className="text-xs text-[#6B7280] mt-1">
              {activeOrdersCount > 0 ? `${activeOrdersCount} live in courier transit` : "No shipments currently in transit"}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] font-semibold text-[#E31E24]">
            <span>Track live delivery</span>
            <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition" />
          </div>
        </div>

        {/* Card 3: Delivered Orders */}
        <div
          onClick={() => onTabChange("orders")}
          className="group rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-2xs hover:shadow-sm hover:border-[#E31E24] cursor-pointer transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Delivered Orders</span>
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-50 text-emerald-700 group-hover:scale-105 transition">
              <CheckCircle2 className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-extrabold text-emerald-700 font-display leading-none">
              {orders.filter((o) => o.status === 5).length}
            </p>
            <p className="text-xs text-[#6B7280] mt-1">
              Verified doorstep handovers
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] font-semibold text-[#E31E24]">
            <span>Delivered packages</span>
            <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition" />
          </div>
        </div>

        {/* Card 4: Total Spending */}
        <div
          onClick={() => onTabChange("invoices")}
          className="group rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-2xs hover:shadow-sm hover:border-[#E31E24] cursor-pointer transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Total Spending</span>
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gray-100 text-[#111111] group-hover:bg-red-50 group-hover:text-[#E31E24] transition">
              <Wallet className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-extrabold text-[#111111] font-display leading-none">{inr(totalSpent)}</p>
            <p className="text-xs text-[#6B7280] mt-1">Lifetime spending on parts & spares</p>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] font-semibold text-[#E31E24]">
            <span>Invoices & tax receipts</span>
            <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition" />
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION C: MY GARAGE PREVIEW
         ───────────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 font-display">My Garage</h2>
            <p className="text-xs text-gray-500">Your registered electric two-wheelers and fitment telemetry.</p>
          </div>
          <button
            onClick={() => onTabChange("garage")}
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            <span>All vehicles ({garage.length})</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {garage.map((g) => {
            const b = getBike(g.bikeId)!;
            const isCurrentActive = activeBikeId === g.bikeId;
            return (
              <div
                key={g.bikeId}
                className={cn(
                  "overflow-hidden rounded-3xl border bg-white shadow-2xs transition-all duration-300 hover:shadow-md flex flex-col",
                  isCurrentActive ? "border-primary ring-1 ring-primary/20" : "border-[#E5E7EB]"
                )}
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
                  <img
                    src={scooterImg}
                    alt={b.model}
                    className="h-full w-full object-cover transition duration-500 hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    {isCurrentActive && (
                      <span className="px-2.5 py-1 rounded-full bg-primary text-white text-[10px] font-bold shadow-xs">
                        Primary EV
                      </span>
                    )}
                    <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold">
                      {b.voltage}V Architecture
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-bold text-gray-900 font-display">
                        {b.make} {b.model}
                      </p>
                      <span className="text-xs font-mono font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                        {g.regNo || "KA 01 EQ ••••"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {g.year ?? "2023"} · VIN: {g.vin ? `${g.vin.slice(0, 6)}••••${g.vin.slice(-4)}` : "Verified OEM"}
                    </p>

                    {/* Telemetry info */}
                    <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-400 block text-[10px] uppercase font-semibold">Odometer</span>
                        <span className="font-bold text-gray-800">{g.odoKm?.toLocaleString("en-IN") ?? 12450} km</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[10px] uppercase font-semibold">Battery SOH</span>
                        <span className="font-bold text-emerald-600">{g.batteryHealth ?? 96}% Optimal</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => onTabChange("garage")}
                      className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-primary/10 text-primary text-xs font-semibold hover:bg-primary hover:text-white transition"
                    >
                      <ShoppingBag className="h-3.5 w-3.5" />
                      <span>Find Compatible Parts in Garage</span>
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={onOpenBookingModal}
                        className="py-1.5 rounded-xl border border-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-50 transition"
                      >
                        Book Service
                      </button>
                      <button
                        onClick={() => {
                          setActiveBikeId(g.bikeId);
                          toast.success(`${b.make} ${b.model} set as primary EV`);
                        }}
                        disabled={isCurrentActive}
                        className={cn(
                          "py-1.5 rounded-xl text-xs font-semibold transition",
                          isCurrentActive
                            ? "bg-gray-100 text-gray-400 cursor-default"
                            : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                        )}
                      >
                        {isCurrentActive ? "Active" : "Set Active"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add Your Bike Card */}
          <div
            onClick={onOpenAddBikeModal}
            className="group rounded-3xl border-2 border-dashed border-gray-200 hover:border-primary/60 bg-white/50 p-6 flex flex-col items-center justify-center text-center cursor-pointer min-h-[320px] transition-all hover:bg-emerald-50/20"
          >
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-primary group-hover:scale-110 transition shadow-2xs">
              <Plus className="h-6 w-6" />
            </span>
            <p className="mt-3 text-base font-bold text-gray-900 font-display">Add Your Electric Bike</p>
            <p className="text-xs text-gray-500 mt-1 max-w-xs">
              Decode your 17-digit VIN or pick from Ather, Ola, TVS, Revolt, Hero Vida & Chetak to guarantee 100% fitment.
            </p>
            <button className="mt-4 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold shadow-xs group-hover:bg-emerald-600 transition">
              + Decode VIN or Add
            </button>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION D & E: ORDERS & LIVE TRACKING + RECENT ORDERS
         ───────────────────────────────────────────────────────────── */}
      <section className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        {/* SECTION D: Active Order & Delivery Tracking */}
        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  {liveOrder && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  )}
                  <span className={cn("relative inline-flex rounded-full h-2.5 w-2.5", liveOrder ? "bg-primary" : "bg-gray-300")} />
                </span>
                <h2 className="text-base font-bold text-gray-900 font-display">Live Doorstep Delivery</h2>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">GPS rider telemetry & milestone dispatch status.</p>
            </div>
            {liveOrder ? (
              <Link
                to="/track/$id"
                params={{ id: liveOrder.id }}
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                <span>Full Map</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ) : (
              <button
                onClick={() => {
                  simulateDemoOrder();
                  toast.success("Sample order created! Watch live dispatch progress.");
                }}
                className="text-[11px] font-semibold text-primary bg-primary/10 hover:bg-primary hover:text-white px-2.5 py-1 rounded-lg transition"
              >
                + Simulate Test Order
              </button>
            )}
          </div>

          {liveOrder ? (
            <div className="mt-4 space-y-4">
              {/* Live Map Frame */}
              <div className="overflow-hidden rounded-2xl border border-gray-200">
                <LiveMap stops={liveOrder.groups.length} className="aspect-video w-full" />
              </div>

              {/* Order Info & ETA Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-gray-50 border border-gray-100 text-xs">
                <div>
                  <span className="text-gray-500">Order ID: </span>
                  <span className="font-bold text-gray-900 font-mono">{liveOrder.id}</span>
                  <span className="mx-2 text-gray-300">·</span>
                  <span className="text-gray-500">{new Date(liveOrder.createdAt).toLocaleDateString("en-IN")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full text-[11px]">
                    ETA ~{Math.max(5, liveOrder.eta)} mins
                  </span>
                  <span className="font-bold text-gray-900">{inr(liveOrder.total)}</span>
                </div>
              </div>

              {/* Horizontal Progress Timeline */}
              <div className="pt-2">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Delivery Progress Timeline
                </p>
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
                              ? "bg-primary text-white ring-4 ring-emerald-100 scale-110"
                              : isPassed
                              ? "bg-emerald-600 text-white"
                              : "bg-gray-100 text-gray-400 border border-gray-200"
                          )}
                        >
                          {isPassed ? <Check className="h-3.5 w-3.5" /> : idx + 1}
                        </div>
                        <p
                          className={cn(
                            "mt-2 text-[10px] leading-tight line-clamp-1",
                            isCurrent ? "font-bold text-gray-900" : isPassed ? "font-medium text-gray-700" : "text-gray-400"
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
                <div className="p-3 rounded-2xl border border-gray-200 bg-white flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-white font-bold text-xs shadow-xs">
                      {activeRider.avatar}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-bold text-gray-900">{activeRider.name}</p>
                        <span className="flex items-center text-[10px] text-amber-600 font-semibold">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400 inline mr-0.5" />
                          {activeRider.rating}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500">
                        {activeRider.vehicle} · {activeRider.plate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${activeRider.phone}`}
                      className="p-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-primary hover:text-white transition"
                      title="Call Rider"
                    >
                      <Phone className="h-3.5 w-3.5" />
                    </a>
                    {liveOrder.status < 5 && (
                      <button
                        onClick={() => advanceOrder(liveOrder.id)}
                        className="px-2.5 py-1.5 rounded-xl border border-gray-200 text-gray-600 hover:border-primary hover:text-primary text-[11px] font-semibold transition"
                      >
                        Simulate Next →
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 px-6 text-center flex flex-col items-center justify-center">
              <span className="grid h-14 w-14 place-items-center rounded-3xl bg-gray-100 text-gray-400 mb-3">
                <Truck className="h-7 w-7" />
              </span>
              <p className="text-base font-bold text-gray-900 font-display">No Active Deliveries Right Now</p>
              <p className="text-xs text-gray-500 mt-1 max-w-sm">
                When you order batteries, chargers, or replacement components, real-time rider tracking and ETA countdowns will appear here.
              </p>
              <div className="mt-5 flex items-center gap-3">
                <button
                  onClick={() => onTabChange("garage")}
                  className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold shadow-xs hover:bg-emerald-600 transition"
                >
                  View Garage Spares
                </button>
                <button
                  onClick={() => {
                    simulateDemoOrder();
                    toast.success("Demo order created! See live tracker.");
                  }}
                  className="px-3.5 py-2 rounded-xl border border-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-50 transition"
                >
                  Simulate Order
                </button>
              </div>
            </div>
          )}
        </div>

        {/* SECTION E: Recent Orders */}
        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-base font-bold text-gray-900 font-display">Recent Orders</h2>
              <p className="text-xs text-gray-500 mt-0.5">Purchases and doorstep parts delivery logs.</p>
            </div>
            <button
              onClick={() => onTabChange("orders")}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-4 flex-1 divide-y divide-gray-100 overflow-y-auto max-h-[360px]">
            {orders.length === 0 ? (
              <div className="py-12 text-center text-xs text-gray-400">
                <Package className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                <p className="font-medium text-gray-600">No orders placed yet</p>
                <p className="text-gray-400 mt-0.5">Browse certified EV batteries & chargers in your garage to get started.</p>
                <button
                  onClick={() => onTabChange("garage")}
                  className="mt-3 inline-block px-3 py-1.5 rounded-lg bg-primary/10 text-primary font-semibold text-xs hover:bg-primary hover:text-white transition"
                >
                  Explore Garage Spares
                </button>
              </div>
            ) : (
              orders.slice(0, 5).map((o) => (
                <Link
                  key={o.id}
                  to="/track/$id"
                  params={{ id: o.id }}
                  className="py-3 px-1 flex items-center justify-between gap-3 hover:bg-gray-50 rounded-xl transition group"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-gray-900 font-mono group-hover:text-primary transition truncate">
                        {o.id}
                      </p>
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-bold",
                          o.status === 5
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-blue-100 text-blue-800"
                        )}
                      >
                        {ORDER_STEPS[o.status]}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5 truncate">
                      {o.groups.length} vendor{o.groups.length > 1 ? "s" : ""} · {new Date(o.createdAt).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold text-gray-900">{inr(o.total)}</p>
                    <span className="text-[10px] text-primary font-semibold group-hover:underline">Track →</span>
                  </div>
                </Link>
              ))
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 text-center">
            <Link
              to="/orders"
              className="text-xs font-semibold text-gray-600 hover:text-primary transition"
            >
              Open Orders & Tracking Center →
            </Link>
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
                    <span className="px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-gray-800 text-[10px] font-bold shadow-2xs">
                      {p.category}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      toggleSaved(p.id);
                      toast.success(saved ? "Removed from saved" : "Saved to wishlist");
                    }}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-xs text-gray-600 hover:text-rose-500 shadow-2xs transition"
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
