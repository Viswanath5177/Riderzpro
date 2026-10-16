import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Bike,
  Package,
  ShoppingBag,
  Wrench,
  Clock,
  Zap,
  Truck,
  ScanLine,
  Copy,
  Check,
  ChevronRight,
  ShieldCheck,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { inr } from "@/lib/data";
import { cn } from "@/lib/utils";
import type { CustomerTab } from "./CustomerLayout";
import { VinSearchModal } from "./VinSearchModal";

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
  const { userProfile, garage, orders, userLocation } = useStore();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isVinSearchOpen, setIsVinSearchOpen] = useState(false);

  const copyCoupon = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon code "${code}" copied to clipboard!`);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const displayName = userProfile.name ? userProfile.name.split(" ")[0] : "User";

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* ─────────────────────────────────────────────────────────────
          1. TOP GREETING & ADD BIKE BUTTON (Matches Screenshot 1)
         ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111111] font-display flex items-center gap-2">
            <span>Hi, {displayName}</span>
            <span role="img" aria-label="wave">👋</span>
          </h1>
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
            <span className="flex items-center gap-1 text-gray-600 font-medium">
              <MapPin className="h-3.5 w-3.5 text-[#E31E24]" />
              {userLocation?.name || "Bengaluru"}, {userLocation?.city ? "KA" : "KA"}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              EV Connected
            </span>
          </div>
        </div>

        <button
          onClick={onOpenAddBikeModal}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-red-200 bg-white text-[#E31E24] hover:bg-red-50 text-xs font-bold transition shadow-2xs cursor-pointer active:scale-95"
        >
          <span>+ Add Bike</span>
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. HERO CARD: MY EV GARAGE (Matches Screenshot 1)
         ───────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl border border-red-100 bg-gradient-to-r from-red-50/50 via-rose-50/30 to-red-50/40 p-6 sm:p-7 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative z-10">
          <div className="space-y-2 max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100/70 text-[#E31E24] text-[11px] font-bold tracking-wider uppercase">
              <Bike className="h-3.5 w-3.5" />
              <span>MY EV GARAGE</span>
            </span>

            <h2 className="text-xl sm:text-2xl font-extrabold text-[#111111] font-display">
              Add your electric scooter or bike
            </h2>

            <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
              Select your vehicle to get 100% verified fitment spares, battery diagnostics, and doorstep care.
            </p>
          </div>

          <div className="shrink-0">
            <button
              onClick={onOpenAddBikeModal}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#E31E24] hover:bg-red-700 text-white text-xs sm:text-sm font-bold shadow-xs active:scale-95 transition cursor-pointer"
            >
              <span>+ Add Vehicle</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. QUICK ACTIONS (4 Cards: Shop Spares, Doorstep Service, My Orders, VIN Fitment)
         ───────────────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
          QUICK ACTIONS
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Action 1: Shop Spares */}
          <div
            onClick={() => onTabChange("shop")}
            className="p-5 rounded-2xl bg-white border border-gray-100 shadow-2xs hover:shadow-md hover:border-red-200 transition-all duration-200 cursor-pointer group flex items-start gap-4"
          >
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-red-50 text-[#E31E24] shrink-0 group-hover:scale-105 transition-transform">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-[#111111] group-hover:text-[#E31E24] transition-colors">
                Shop Spares
              </h3>
              <p className="text-xs text-gray-500 mt-0.5 truncate">
                Batteries &amp; chargers
              </p>
            </div>
          </div>

          {/* Action 2: Doorstep Service */}
          <div
            onClick={onOpenBookingModal}
            className="p-5 rounded-2xl bg-white border border-gray-100 shadow-2xs hover:shadow-md hover:border-blue-200 transition-all duration-200 cursor-pointer group flex items-start gap-4"
          >
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-blue-600 shrink-0 group-hover:scale-105 transition-transform">
              <Wrench className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-[#111111] group-hover:text-blue-600 transition-colors">
                Doorstep Service
              </h3>
              <p className="text-xs text-gray-500 mt-0.5 truncate">
                Certified visit ₹299
              </p>
            </div>
          </div>

          {/* Action 3: My Orders */}
          <div
            onClick={() => onTabChange("orders")}
            className="p-5 rounded-2xl bg-white border border-gray-100 shadow-2xs hover:shadow-md hover:border-emerald-200 transition-all duration-200 cursor-pointer group flex items-start gap-4"
          >
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 shrink-0 group-hover:scale-105 transition-transform">
              <Truck className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-[#111111] group-hover:text-emerald-600 transition-colors">
                My Orders
              </h3>
              <p className="text-xs text-gray-500 mt-0.5 truncate">
                {orders.length} past orders
              </p>
            </div>
          </div>

          {/* Action 4: VIN Fitment */}
          <div
            onClick={() => setIsVinSearchOpen(true)}
            className="p-5 rounded-2xl bg-white border border-gray-100 shadow-2xs hover:shadow-md hover:border-purple-200 transition-all duration-200 cursor-pointer group flex items-start gap-4"
          >
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-purple-50 text-purple-600 shrink-0 group-hover:scale-105 transition-transform">
              <ScanLine className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-[#111111] group-hover:text-purple-600 transition-colors">
                VIN Fitment
              </h3>
              <p className="text-xs text-gray-500 mt-0.5 truncate">
                17-digit decoder
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. PROMO BANNER (SPECIAL: ₹200 Off First Visit / RIDERZ200)
         ───────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-red-100 bg-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-red-50 text-[#E31E24] shrink-0">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-red-50 text-[#E31E24] text-[10px] font-bold uppercase tracking-wider">
                SPECIAL
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#111111]">
                ₹200 Off First Visit
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Valid on all doorstep service bookings.
            </p>
          </div>
        </div>

        <button
          onClick={() => copyCoupon("RIDERZ200")}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-dashed border-red-300 bg-red-50/40 text-[#E31E24] hover:bg-red-100/60 transition self-start sm:self-auto cursor-pointer"
          title="Copy coupon code"
        >
          {copiedCode === "RIDERZ200" ? (
            <Check className="h-3.5 w-3.5 text-emerald-600" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
          <span className="font-mono text-xs font-bold">RIDERZ200</span>
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          5. DOORSTEP TECHNICIAN CARE (3 Cards + Book Visit > Action)
         ───────────────────────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#111111] font-display">
              Doorstep Technician Care
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Certified technicians at your location
            </p>
          </div>

          <button
            onClick={onOpenBookingModal}
            className="text-xs font-bold text-[#E31E24] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Book Visit</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Service Card 1: 24-Point General Care */}
          <div
            onClick={onOpenBookingModal}
            className="p-5 rounded-2xl bg-white border border-gray-100 shadow-2xs hover:shadow-md hover:border-red-200 transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-red-50 text-[#E31E24]">
                <Wrench className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#111111]">
                  24-Point General Care
                </h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  Brakes, tire wear, electrical harnesses &amp; torque check.
                </p>
              </div>
            </div>
            <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
              <span className="text-sm font-extrabold text-[#111111]">₹299</span>
              <span className="text-xs font-bold text-[#E31E24] hover:underline">Book →</span>
            </div>
          </div>

          {/* Service Card 2: Battery & BMS Check */}
          <div
            onClick={onOpenBookingModal}
            className="p-5 rounded-2xl bg-white border border-gray-100 shadow-2xs hover:shadow-md hover:border-blue-200 transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#111111]">
                  Battery &amp; BMS Check
                </h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  Cell balance test, voltage audit &amp; thermal seal check.
                </p>
              </div>
            </div>
            <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
              <span className="text-sm font-extrabold text-[#111111]">₹399</span>
              <span className="text-xs font-bold text-[#E31E24] hover:underline">Book →</span>
            </div>
          </div>

          {/* Service Card 3: Brake Overhaul */}
          <div
            onClick={onOpenBookingModal}
            className="p-5 rounded-2xl bg-white border border-gray-100 shadow-2xs hover:shadow-md hover:border-emerald-200 transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#111111]">
                  Brake Overhaul
                </h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  Pad replacement, fluid flush &amp; rotor alignment.
                </p>
              </div>
            </div>
            <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
              <span className="text-sm font-extrabold text-[#111111]">₹249</span>
              <span className="text-xs font-bold text-[#E31E24] hover:underline">Book →</span>
            </div>
          </div>
        </div>
      </div>

      {/* Global VIN Search Modal */}
      <VinSearchModal
        isOpen={isVinSearchOpen}
        onClose={() => setIsVinSearchOpen(false)}
      />
    </div>
  );
}
