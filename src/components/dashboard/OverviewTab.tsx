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
  MessageSquare,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  Truck,
  Heart,
  CheckCircle2,
  Tag,
} from "lucide-react";
import { toast } from "sonner";
import { useStore, type Order } from "@/lib/store";
import { getBike, getVendor, inr, products } from "@/lib/data";
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
  const processingOrdersCount = orders.filter((o) => o.status === 0 || o.status === 1).length;
  const inTransitCount = shipments.filter((s) => s.status === "In Transit" || s.status === "Out for Delivery").length;
  const deliveredCount = orders.filter((o) => o.status === 5).length;

  // Saved products items
  const savedItemsList = products.filter((p) => savedProductIds.includes(p.id)).slice(0, 3);

  const copyCoupon = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon code "${code}" copied to clipboard!`);
    setTimeout(() => setCopiedCode(null), 2500);
  };

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
              Verified successful handovers
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E5E7EB] flex items-center justify-between text-[11px] font-semibold text-[#E31E24]">
            <span>Delivered history</span>
            <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition" />
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

        {garage.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/60 p-8 text-center space-y-3">
            <Bike className="h-9 w-9 text-gray-400 mx-auto" />
            <h3 className="text-sm font-bold text-gray-900">No Vehicle in Your Garage Yet</h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              Add your electric scooter, bike, or EV to your garage to receive automated telemetry, customized service schedules, and exact part fitment guarantees.
            </p>
            <button
              onClick={() => onTabChange("garage")}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E31E24] text-white text-xs font-semibold hover:bg-red-700 transition shadow-2xs cursor-pointer"
            >
              + Add Vehicle to Garage
            </button>
          </div>
        ) : (
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
              <span className="text-[11px] font-mono font-medium text-gray-400">On-site</span>
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
        )}
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
