import React from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  User,
  ShieldCheck,
  MapPin,
  Package,
  Store,
  Bike,
  Shield,
  Smartphone,
  LogOut,
  ChevronRight,
  ExternalLink,
  RotateCcw,
  CheckCircle2,
  Phone,
  Mail,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useStore } from "@/lib/store";
import { toast } from "sonner";

export function AppAccountTab({ onOpenOrders }: { onOpenOrders: () => void }) {
  const { user, isAuthenticated, signOut } = useAuth();
  const { userProfile } = useStore();
  const navigate = useNavigate();

  const displayName = userProfile?.name || user?.name || "Harshitha (QA Tester)";
  const displayEmail = userProfile?.email || user?.email || "harshitha@silicofeller.com";
  const displayPhone = userProfile?.phone || "+91 98765 00001";

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

  return (
    <div className="space-y-4 pb-6">
      {/* 1. User Profile Card */}
      <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 p-4 border border-zinc-800 shadow-md">
        <div className="flex items-center gap-3">
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-red-600 to-amber-600 text-white font-black text-xl shadow-lg shadow-red-600/20">
            {displayName.charAt(0)}
            <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-zinc-950 ring-2 ring-zinc-900">
              <CheckCircle2 className="h-3.5 w-3.5 fill-current" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white leading-tight">
                {displayName}
              </h2>
              <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-bold text-emerald-400">
                KYC Verified
              </span>
            </div>
            <div className="mt-1 space-y-0.5 text-xs text-zinc-400">
              <div className="flex items-center gap-1.5">
                <Mail className="h-3 w-3 text-zinc-500" />
                <span>{displayEmail}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="h-3 w-3 text-zinc-500" />
                <span>{displayPhone}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Demo Day 3-Phone Role Switcher */}
      <div className="rounded-xl bg-zinc-900/90 border border-zinc-800 p-3.5">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
            <Smartphone className="h-3.5 w-3.5" />
            <span>3-Device Demo Switcher</span>
          </div>
          <span className="text-[10px] text-zinc-500 font-medium">Demo Day QA</span>
        </div>
        <p className="text-[11px] text-zinc-400 mb-3">
          Quickly switch between phone roles to test end-to-end buying & delivery flow:
        </p>

        <div className="space-y-2">
          {/* Phone 1: Customer (Current) */}
          <div className="flex items-center justify-between rounded-lg bg-zinc-800/80 p-2.5 border border-zinc-700">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 text-white">
                <Smartphone className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">
                  Phone 1: Customer View (Current)
                </span>
                <span className="text-[10px] text-zinc-400">
                  Cart, Checkout & Live Map Tracking
                </span>
              </div>
            </div>
            <span className="rounded bg-red-500/20 px-2 py-0.5 text-[10px] font-bold text-red-400">
              Active
            </span>
          </div>

          {/* Phone 2: Seller Dashboard */}
          <Link
            to="/vendor/dashboard"
            className="flex items-center justify-between rounded-lg bg-zinc-800/40 p-2.5 border border-zinc-800 transition hover:bg-zinc-800 active:scale-[0.99]"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400">
                <Store className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-zinc-200 block">
                  Phone 2: Seller Dashboard
                </span>
                <span className="text-[10px] text-zinc-400">
                  Accept order & click "Mark Packed"
                </span>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-zinc-500" />
          </Link>

          {/* Phone 3: Rider Delivery Panel */}
          <Link
            to="/rider/dashboard"
            className="flex items-center justify-between rounded-lg bg-zinc-800/40 p-2.5 border border-zinc-800 transition hover:bg-zinc-800 active:scale-[0.99]"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600/20 text-emerald-400">
                <Bike className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-zinc-200 block">
                  Phone 3: Rider Delivery Panel
                </span>
                <span className="text-[10px] text-zinc-400">
                  Accept job, "Picked Up" & "Delivered"
                </span>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-zinc-500" />
          </Link>

          {/* Laptop: Admin Board */}
          <Link
            to="/admin"
            className="flex items-center justify-between rounded-lg bg-zinc-800/40 p-2.5 border border-zinc-800 transition hover:bg-zinc-800 active:scale-[0.99]"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600/20 text-purple-400">
                <Shield className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-zinc-200 block">
                  Laptop: Admin Live Orders Board
                </span>
                <span className="text-[10px] text-zinc-400">
                  Full multi-vendor oversight & approvals
                </span>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-zinc-500" />
          </Link>
        </div>
      </div>

      {/* 3. Saved Addresses */}
      <div className="rounded-xl bg-zinc-900/90 border border-zinc-800 p-3.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2.5">
          Delivery Address
        </h3>
        <div className="flex items-start gap-2.5 rounded-lg bg-zinc-800/50 p-2.5 border border-zinc-800 text-xs text-zinc-300">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
          <div>
            <div className="flex items-center gap-2 font-bold text-white">
              <span>Primary (Delhi/NCR)</span>
              <span className="rounded bg-zinc-700 px-1.5 py-0.2 text-[9px] text-zinc-300">
                Default
              </span>
            </div>
            <p className="mt-0.5 text-[11px] text-zinc-400">
              {userProfile?.address || "Flat 402, Green Glen Layout, Connaught Place"}, {userProfile?.city || "New Delhi"}, 110001
            </p>
          </div>
        </div>
      </div>

      {/* 4. Quick Account Actions */}
      <div className="space-y-2">
        <button
          onClick={onOpenOrders}
          className="flex w-full items-center justify-between rounded-xl bg-zinc-900 p-3 border border-zinc-800 text-left text-xs font-semibold text-zinc-200 transition hover:bg-zinc-800"
        >
          <div className="flex items-center gap-2.5">
            <Package className="h-4 w-4 text-red-500" />
            <span>Track Active Orders & Invoices</span>
          </div>
          <ChevronRight className="h-4 w-4 text-zinc-500" />
        </button>

        <button
          onClick={handleResetDemoState}
          className="flex w-full items-center justify-between rounded-xl bg-zinc-900 p-3 border border-zinc-800 text-left text-xs font-semibold text-zinc-200 transition hover:bg-zinc-800"
        >
          <div className="flex items-center gap-2.5">
            <RotateCcw className="h-4 w-4 text-amber-400" />
            <span>Reset Local QA Demo State</span>
          </div>
          <ChevronRight className="h-4 w-4 text-zinc-500" />
        </button>

        <Link
          to="/login"
          className="flex w-full items-center justify-between rounded-xl bg-zinc-900 p-3 border border-zinc-800 text-left text-xs font-semibold text-zinc-200 transition hover:bg-zinc-800"
        >
          <div className="flex items-center gap-2.5">
            <LogOut className="h-4 w-4 text-zinc-400" />
            <span>Switch User / OTP Sign In</span>
          </div>
          <ChevronRight className="h-4 w-4 text-zinc-500" />
        </Link>
      </div>
    </div>
  );
}
