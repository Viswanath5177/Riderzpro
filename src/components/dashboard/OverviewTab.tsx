import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Bike,
  Package,
  ArrowRight,
  ShieldCheck,
  Zap,
  ShoppingBag,
  Wrench,
  Clock,
  Sparkles,
  Phone,
  Copy,
  Check,
  Star,
  ChevronRight,
  Truck,
  Plus,
  ScanLine,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { useStore, ORDER_STEPS } from "@/lib/store";
import { getBike, getProduct, inr, products, riders } from "@/lib/data";
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
  onOpenAddBikeModal,
}: OverviewTabProps) {
  const {
    userProfile,
    garage,
    activeBikeId,
    orders,
    shipments,
    addToCart,
    advanceOrder,
    simulateDemoOrder,
  } = useStore();

  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const activeBike = garage.find((b) => b.bikeId === activeBikeId) || garage[0];
  const activeBikeMeta = activeBike ? getBike(activeBike.bikeId) : null;

  const liveOrder = orders.find((o) => o.status < 5);
  const activeShipment = shipments.find((s) => s.status !== "Delivered" && s.status !== "Cancelled") || shipments[0];
  const activeRider = liveOrder?.riderId ? riders.find((r) => r.id === liveOrder.riderId) : null;

  // Filter recommended parts for user's bike, or default popular spares
  const recommendedParts = products
    .filter((p) => (activeBike ? p.fits.includes(activeBike.bikeId) : true))
    .slice(0, 4);

  const copyCoupon = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon "${code}" copied!`);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleAddBikeClick = () => {
    if (onOpenAddBikeModal) {
      onOpenAddBikeModal();
    } else {
      onTabChange("garage");
    }
  };

  return (
    <div className="space-y-6 sm:space-y-7 animate-in fade-in duration-200">
      {/* ─────────────────────────────────────────────────────────────
          1. WELCOME & USER GREETING (Compact Mobile Header)
         ───────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight font-display">
            Hi, {userProfile?.name?.trim() ? userProfile.name.trim().split(" ")[0] : "Rider"} 👋
          </h1>
          <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1">
            <MapPin className="h-3.5 w-3.5 text-[#E31E24]" />
            <span>{userProfile?.city?.trim() || "Bengaluru, KA"}</span>
            <span className="text-gray-300">·</span>
            <span className="text-emerald-600 font-bold">EV Care Active</span>
          </p>
        </div>

        <button
          onClick={handleAddBikeClick}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-sm font-bold text-gray-800 transition active:scale-95 cursor-pointer"
        >
          <Plus className="h-4 w-4 text-[#E31E24]" />
          <span>{garage.length > 0 ? "My Garage" : "Add Bike"}</span>
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. VEHICLE HERO CARD (Matching Brand Red & Warm Colors)
         ───────────────────────────────────────────────────────────── */}
      {garage.length > 0 && activeBike ? (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#E31E24] via-[#DC2626] to-[#B91C1C] p-5 sm:p-6 text-white shadow-md">
          {/* Subtle ambient light glow */}
          <div className="absolute -right-8 -top-8 h-44 w-44 rounded-full bg-white/10 blur-xl pointer-events-none" />

          <div className="relative z-10 flex items-start justify-between gap-3">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider border border-white/20">
                <Bike className="h-3.5 w-3.5" />
                Connected Vehicle
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-2 tracking-tight font-display">
                {activeBike.nickname || `${activeBikeMeta?.make} ${activeBikeMeta?.model}`}
              </h2>
              <p className="text-sm text-red-100 mt-1 font-medium">
                {activeBikeMeta?.voltage}V Architecture · {activeBike.odoKm ? `${activeBike.odoKm} km` : "Ready to ride"}
              </p>
            </div>

            <div className="text-right shrink-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-sm font-bold border border-white/25">
                <Zap className="h-4 w-4 fill-white" />
                {activeBike.batteryHealth || 98}% Health
              </span>
            </div>
          </div>

          <div className="relative z-10 mt-5 pt-3.5 border-t border-white/20 grid grid-cols-3 gap-2.5">
            <button
              onClick={onOpenBookingModal}
              className="py-2.5 px-3 rounded-xl bg-white text-[#E31E24] hover:bg-red-50 text-sm font-bold text-center transition active:scale-95 flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Wrench className="h-4 w-4" />
              <span>Service</span>
            </button>
            <button
              onClick={() => onTabChange("shop")}
              className="py-2.5 px-3 rounded-xl bg-white/20 hover:bg-white/30 text-white text-sm font-bold text-center transition active:scale-95 flex items-center justify-center gap-1.5 border border-white/25 cursor-pointer"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Parts</span>
            </button>
            <button
              onClick={() => onTabChange("garage")}
              className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-bold text-center transition active:scale-95 cursor-pointer"
            >
              Garage
            </button>
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-50 via-white to-red-50/40 p-5 sm:p-6 border border-red-200/90 shadow-2xs">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-[#E31E24] text-xs font-bold uppercase tracking-wider">
                <Bike className="h-3.5 w-3.5" />
                My EV Garage
              </span>
              <h3 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">
                Add your EV scooter or bike
              </h3>
              <p className="text-sm text-gray-600 max-w-sm leading-relaxed">
                Select your vehicle to get 100% verified fitment spares, battery diagnostics, and doorstep care.
              </p>
            </div>
            <button
              onClick={handleAddBikeClick}
              className="shrink-0 px-4 py-2.5 rounded-xl bg-[#E31E24] hover:bg-red-700 text-white text-sm font-bold transition active:scale-95 shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Add Vehicle</span>
            </button>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          3. QUICK ACTIONS GRID (Touch-Friendly Native App Tiles)
         ───────────────────────────────────────────────────────────── */}
      <div>
        <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-gray-500 mb-3">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Action 1: Shop Spares */}
          <button
            onClick={() => onTabChange("shop")}
            className="p-4 rounded-2xl bg-white border border-gray-200/90 hover:border-gray-300 text-left transition active:scale-98 shadow-2xs flex flex-col justify-between cursor-pointer group"
          >
            <span className="h-10 w-10 rounded-xl bg-red-50 text-[#E31E24] grid place-items-center mb-2.5 group-hover:scale-105 transition">
              <ShoppingBag className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-bold text-gray-900 leading-tight">Shop Spares</p>
              <p className="text-xs text-gray-500 mt-1">Batteries & chargers</p>
            </div>
          </button>

          {/* Action 2: Book Service */}
          <button
            onClick={onOpenBookingModal}
            className="p-4 rounded-2xl bg-white border border-gray-200/90 hover:border-gray-300 text-left transition active:scale-98 shadow-2xs flex flex-col justify-between cursor-pointer group"
          >
            <span className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 grid place-items-center mb-2.5 group-hover:scale-105 transition">
              <Wrench className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-bold text-gray-900 leading-tight">Doorstep Service</p>
              <p className="text-xs text-gray-500 mt-1">Certified visit ₹299</p>
            </div>
          </button>

          {/* Action 3: Track Orders */}
          <button
            onClick={() => onTabChange("orders")}
            className="p-4 rounded-2xl bg-white border border-gray-200/90 hover:border-gray-300 text-left transition active:scale-98 shadow-2xs flex flex-col justify-between cursor-pointer group"
          >
            <span className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 grid place-items-center mb-2.5 group-hover:scale-105 transition">
              <Truck className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-bold text-gray-900 leading-tight">My Orders</p>
              <p className="text-xs text-gray-500 mt-1">
                {liveOrder ? "1 active dispatch" : `${orders.length} past orders`}
              </p>
            </div>
          </button>

          {/* Action 4: Search by VIN */}
          <button
            onClick={() => onTabChange("garage")}
            className="p-4 rounded-2xl bg-white border border-gray-200/90 hover:border-gray-300 text-left transition active:scale-98 shadow-2xs flex flex-col justify-between cursor-pointer group"
          >
            <span className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 grid place-items-center mb-2.5 group-hover:scale-105 transition">
              <ScanLine className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-bold text-gray-900 leading-tight">VIN Fitment</p>
              <p className="text-xs text-gray-500 mt-1">17-digit decoder</p>
            </div>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. ACTIVE ORDER / DELIVERY STATUS (If order in progress)
         ───────────────────────────────────────────────────────────── */}
      {liveOrder ? (
        <div className="rounded-2xl border border-red-200/80 bg-red-50/40 p-4.5 shadow-2xs space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E31E24] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#E31E24]" />
              </span>
              <span className="text-sm font-bold text-gray-900">
                Delivery in Progress · ETA ~{Math.max(5, liveOrder.eta)} mins
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-gray-700">
              {liveOrder.id}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 bg-white p-3 rounded-xl border border-gray-200/70">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-[#E31E24]" />
              <span>Status: <strong className="text-gray-900">{ORDER_STEPS[liveOrder.status]}</strong></span>
            </div>
            <button
              onClick={() => onTabChange("orders")}
              className="text-xs sm:text-sm font-bold text-[#E31E24] hover:underline flex items-center gap-0.5"
            >
              <span>Track Live</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Welcome Promo Banner */
        <div className="rounded-2xl border border-gray-200 bg-white p-4.5 shadow-2xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-red-50 text-[#E31E24] shrink-0">
              <Zap className="h-5 w-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-red-100 text-[#E31E24] text-xs font-bold">
                  SPECIAL OFFER
                </span>
                <span className="text-sm font-bold text-gray-900">₹200 Off First Service</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Use code on any doorstep technician visit.
              </p>
            </div>
          </div>

          <button
            onClick={() => copyCoupon("RIDERZ200")}
            className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-dashed border-[#E31E24] bg-red-50/50 text-[#E31E24] text-sm font-mono font-bold hover:bg-red-50 transition cursor-pointer"
          >
            {copiedCode === "RIDERZ200" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span>RIDERZ200</span>
          </button>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          5. DOORSTEP SERVICE PACKAGES
         ───────────────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-black text-gray-900">Doorstep Technician Care</h3>
            <p className="text-xs sm:text-sm text-gray-500">Certified technicians at your location</p>
          </div>
          <button
            onClick={onOpenBookingModal}
            className="text-xs sm:text-sm font-bold text-[#E31E24] hover:underline flex items-center gap-0.5"
          >
            <span>Book Visit</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="font-bold text-gray-900">24-Point General Care</span>
                <span className="font-extrabold text-[#E31E24] font-mono">₹299</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                Brakes, tire wear, electrical harnesses & torque check.
              </p>
            </div>
            <button
              onClick={onOpenBookingModal}
              className="mt-3.5 w-full py-2 rounded-xl bg-red-50 hover:bg-[#E31E24] hover:text-white text-[#E31E24] text-xs sm:text-sm font-bold transition text-center cursor-pointer"
            >
              Book Service
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="font-bold text-gray-900">Battery & BMS Check</span>
                <span className="font-extrabold text-[#E31E24] font-mono">₹399</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                Cell balance test, voltage audit & thermal seal check.
              </p>
            </div>
            <button
              onClick={onOpenBookingModal}
              className="mt-3.5 w-full py-2 rounded-xl bg-red-50 hover:bg-[#E31E24] hover:text-white text-[#E31E24] text-xs sm:text-sm font-bold transition text-center cursor-pointer"
            >
              Book Checkup
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="font-bold text-gray-900">Brake Overhaul</span>
                <span className="font-extrabold text-[#E31E24] font-mono">₹249</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                Pad replacement, hydraulic fluid flush & regen calibration.
              </p>
            </div>
            <button
              onClick={onOpenBookingModal}
              className="mt-3.5 w-full py-2 rounded-xl bg-red-50 hover:bg-[#E31E24] hover:text-white text-[#E31E24] text-xs sm:text-sm font-bold transition text-center cursor-pointer"
            >
              Book Repair
            </button>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          6. RECOMMENDED COMPATIBLE SPARES
         ───────────────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-black text-gray-900">
              {activeBikeMeta ? `Verified Parts for ${activeBikeMeta.model}` : "Recommended EV Spares"}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500">100% Guaranteed OEM fitment</p>
          </div>
          <button
            onClick={() => onTabChange("shop")}
            className="text-xs sm:text-sm font-bold text-[#E31E24] hover:underline flex items-center gap-0.5"
          >
            <span>View All</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {recommendedParts.map((p) => (
            <div
              key={p.id}
              className="p-3.5 rounded-2xl bg-white border border-gray-200 shadow-2xs flex flex-col justify-between group"
            >
              <div>
                <div className="aspect-square rounded-xl overflow-hidden bg-gray-50 mb-2.5 flex items-center justify-center p-2">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-full w-full object-contain group-hover:scale-105 transition"
                  />
                </div>
                <span className="text-xs font-bold text-[#E31E24] uppercase tracking-wider block truncate">
                  {p.brand}
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-2 mt-1 leading-snug">
                  {p.name}
                </h4>
              </div>

              <div className="mt-3.5 pt-2.5 border-t border-gray-100 flex items-center justify-between">
                <span className="text-sm font-black text-gray-900 font-mono">
                  {inr(p.offers[0]?.price || 999)}
                </span>
                <button
                  onClick={() => {
                    const vendorId = p.offers[0]?.vendorId || "v1";
                    addToCart(p.id, vendorId);
                    toast.success(`Added ${p.name.split(" ")[0]} to cart!`);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#E31E24] hover:bg-red-700 text-white text-xs font-bold transition active:scale-95 cursor-pointer"
                >
                  + Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
