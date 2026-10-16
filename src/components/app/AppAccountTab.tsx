import React from "react";
import {
  User,
  ShieldCheck,
  MapPin,
  Package,
  Bike,
  LogOut,
  ChevronRight,
  RotateCcw,
  CheckCircle2,
  Phone,
  Mail,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useStore } from "@/lib/store";
import { toast } from "sonner";

export function AppAccountTab({
  onOpenOrders,
  onTriggerLogin,
}: {
  onOpenOrders: () => void;
  onTriggerLogin?: () => void;
}) {
  const { user, isAuthenticated, signOut } = useAuth();
  const { userProfile, activeBikeId, setActiveBikeId } = useStore();

  const displayName = userProfile?.name && userProfile.name !== "Guest Rider"
    ? userProfile.name
    : user?.name || null;
  const displayPhone = userProfile?.phone || user?.phone || "+91 98765 00001";
  const displayEmail = userProfile?.email || user?.email || "customer@riderzpro.in";

  const handleResetDemoState = () => {
    localStorage.removeItem("riderzpro_orders");
    localStorage.removeItem("riderzpro_cart");
    toast.success("QA Demo State Reset", {
      description: "Cleared local order and cart cache for fresh run",
    });
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const handleSignOut = () => {
    try {
      localStorage.removeItem("riderzpro_auth_user");
      localStorage.removeItem("riderzpro_auth_token");
      signOut();
      toast.success("Logged out successfully");
    } catch {}
  };

  return (
    <div className="space-y-3.5 pb-6">
      {/* 1. Profile or Login Prompt */}
      {!isAuthenticated && !displayName ? (
        <div className="rounded-2xl bg-white p-5 border border-gray-200/90 shadow-2xs text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 border border-red-100">
            <User className="h-7 w-7" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-gray-900">Sign in to Riderzpro</h2>
            <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
              Login with mobile OTP to save your addresses, sync carts, and track deliveries.
            </p>
          </div>

          <button
            onClick={onTriggerLogin}
            className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-md shadow-red-600/30 transition active:scale-95"
          >
            Login / Register with Mobile OTP
          </button>
        </div>
      ) : (
        /* User Profile Card */
        <div className="rounded-2xl bg-white p-4 border border-gray-200/90 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 text-white font-black text-xl shadow-md shadow-red-600/20">
              {(displayName || "U").charAt(0).toUpperCase()}
              <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white ring-2 ring-white">
                <CheckCircle2 className="h-3.5 w-3.5 fill-current" />
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-extrabold text-gray-900 truncate">
                  {displayName}
                </h2>
                <span className="shrink-0 rounded-md bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 text-[9px] font-bold text-emerald-700">
                  Customer
                </span>
              </div>
              <p className="text-xs text-gray-500 truncate flex items-center gap-1 mt-0.5">
                <Phone className="h-3 w-3 text-gray-400" />
                <span>{displayPhone}</span>
              </p>
              <p className="text-[11px] text-gray-400 truncate flex items-center gap-1">
                <Mail className="h-3 w-3 text-gray-300" />
                <span>{displayEmail}</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. Primary Delivery Address Card */}
      <div className="rounded-2xl bg-white p-4 border border-gray-200/90 shadow-2xs">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
          Primary Delivery Address
        </h3>
        <div className="flex items-start gap-2.5 rounded-xl bg-gray-50 p-3 border border-gray-100 text-xs text-gray-700">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
          <div>
            <div className="flex items-center gap-2 font-bold text-gray-900">
              <span>Connaught Place Hub</span>
              <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[9px] font-bold text-emerald-800">
                Default
              </span>
            </div>
            <p className="mt-0.5 text-[11px] text-gray-500">
              {userProfile?.address || "Flat 402, Green Glen Layout, Connaught Place"}, {userProfile?.city || "New Delhi"}, 110001
            </p>
          </div>
        </div>
      </div>

      {/* 3. Quick Account Actions List */}
      <div className="space-y-2">
        <button
          onClick={onOpenOrders}
          className="flex w-full items-center justify-between rounded-2xl bg-white p-3.5 border border-gray-200/80 shadow-2xs text-left text-xs font-bold text-gray-800 transition hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-blue-50 text-blue-600 grid place-items-center">
              <Package className="h-4 w-4" />
            </div>
            <span>My Orders & Invoices</span>
          </div>
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </button>

        <button
          onClick={handleResetDemoState}
          className="flex w-full items-center justify-between rounded-2xl bg-white p-3.5 border border-gray-200/80 shadow-2xs text-left text-xs font-bold text-gray-800 transition hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-amber-50 text-amber-600 grid place-items-center">
              <RotateCcw className="h-4 w-4" />
            </div>
            <span>Reset Demo State (Clear Cart/Cache)</span>
          </div>
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </button>

        {isAuthenticated && (
          <button
            onClick={handleSignOut}
            className="flex w-full items-center justify-between rounded-2xl bg-white p-3.5 border border-gray-200/80 shadow-2xs text-left text-xs font-bold text-red-600 transition hover:bg-red-50"
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-red-50 text-red-600 grid place-items-center">
                <LogOut className="h-4 w-4" />
              </div>
              <span>Sign Out</span>
            </div>
            <ChevronRight className="h-4 w-4 text-red-400" />
          </button>
        )}
      </div>
    </div>
  );
}
