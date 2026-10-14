import React, { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Package,
  Layers,
  Boxes,
  Percent,
  CreditCard,
  ShieldAlert,
  Star,
  BarChart3,
  Settings,
  Bell,
  Headphones,
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  LogOut,
  ChevronRight,
  Store,
  User,
  Menu,
  X,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "@/components/site/bits";
import { Vendor } from "@/lib/vendor/types";
import { useVendorAuth } from "@/lib/vendorAuth";
import { useVendorStore } from "@/lib/vendor/vendorStore";
import { useStore } from "@/lib/store";
import { signOut as endServerSession } from "@/lib/auth";
import { toast } from "sonner";

export interface NavSection {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
}

interface VendorDashboardShellProps {
  vendor: Vendor;
  activeSection: string;
  onSelectSection: (id: string) => void;
  children: React.ReactNode;
}

export function VendorDashboardShell({
  vendor,
  activeSection,
  onSelectSection,
  children,
}: VendorDashboardShellProps) {
  const navigate = useNavigate();
  const { logout } = useVendorAuth();
  const { signOut: storeSignOut } = useStore();
  const { notifications, products } = useVendorStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    try {
      await endServerSession();
    } catch {
      // server session end fallback
    }
    try {
      storeSignOut();
    } catch {}
    try {
      await logout();
    } catch (err) {
      console.warn("Vendor logout error:", err);
    }

    try {
      localStorage.setItem("vendor_signed_out", "true");
      localStorage.removeItem("riderzpro_vendor_session");
      sessionStorage.removeItem("riderzpro_vendor_session");
      localStorage.removeItem("riderzpro_auth_user");
      localStorage.removeItem("riderzpro_auth_token");
      localStorage.removeItem("riderzpro_admin_session");
      sessionStorage.removeItem("riderzpro_auth_user");
      sessionStorage.removeItem("riderzpro_auth_token");
    } catch {}

    toast.info("Signed out of Vendor Portal");

    try {
      await navigate({ to: "/vendor/auth", search: { mode: "signin" }, replace: true });
    } catch {
      window.location.replace("/vendor/auth");
    }
  };

  if (!vendor) return null;

  const unreadNotificationsCount = notifications.filter(
    (n) => n.vendorId === vendor.id && !n.read
  ).length;

  const lowStockCount = products.filter(
    (p) => p.vendorId === vendor.id && p.stock <= (p.minStockAlert || 5) && p.status === "live"
  ).length;

  const SECTIONS: NavSection[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "orders", label: "Orders", icon: Package, badge: 2 },
    { id: "products", label: "Products", icon: Layers },
    {
      id: "inventory",
      label: "Inventory",
      icon: Boxes,
      badge: lowStockCount > 0 ? lowStockCount : undefined,
    },
    { id: "pricing", label: "Pricing & Offers", icon: Percent },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "returns", label: "Returns & Warranty", icon: ShieldAlert },
    { id: "reviews", label: "Reviews", icon: Star },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "settings", label: "Store Settings", icon: Settings },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined,
    },
    { id: "support", label: "Help & Support", icon: Headphones },
  ];

  const currentSection = SECTIONS.find((s) => s.id === activeSection) || SECTIONS[0];

  return (
    <div className="min-h-screen bg-[#F5F6F8] pb-24 md:pb-0 font-sans">
      {/* DESKTOP SIDEBAR: Clean White with Red Active State */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-[#E5E7EB] bg-white p-4.5 md:flex shadow-xs">
        {/* Brand Header */}
        <div className="flex items-center justify-center pb-3 border-b border-gray-100">
          <Logo className="justify-center" imgClassName="h-8 md:h-9 w-auto" />
        </div>

        {/* Store Micro-profile */}
        <div className="my-3.5 flex items-center gap-2.5 rounded-2xl bg-gray-50 p-2.5 border border-gray-100">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-[#E31E24] font-bold text-xs">
            <Store className="h-4.5 w-4.5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <p className="truncate text-xs font-bold text-[#111111]">{vendor.storeName}</p>
              <ShieldCheck className="h-3 w-3 text-blue-500 shrink-0" />
            </div>
            <p className="truncate text-[10px] text-gray-500 font-medium">
              {vendor.area || "Indiranagar, Bengaluru"}
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-270px)] pr-1">
          {SECTIONS.map((s) => {
            const isActive = activeSection === s.id;
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => {
                  onSelectSection(s.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition cursor-pointer select-none ${
                  isActive
                    ? "bg-[#E31E24] text-white shadow-xs"
                    : "text-gray-600 hover:bg-gray-100/80 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`h-4 w-4 shrink-0 ${
                      isActive ? "text-white" : "text-gray-400"
                    }`}
                  />
                  <span>{s.label}</span>
                </div>

                {s.badge !== undefined && (
                  <span
                    className={`rounded-full px-2 py-0.2 text-[10px] font-bold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-red-50 text-[#E31E24] border border-red-200"
                    }`}
                  >
                    {s.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="mt-auto pt-3 border-t border-gray-100 space-y-1.5">
          <Link
            to="/store/$slug"
            params={{ slug: vendor.storeSlug || vendor.id }}
            target="_blank"
            className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="h-3.5 w-3.5 text-gray-400" />
              View My Live Store
            </span>
            <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
          </Link>

          <Link
            to="/"
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-gray-500 hover:text-[#E31E24] hover:bg-red-50 transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Marketplace
          </Link>

          <button
            type="button"
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer text-left"
          >
            <LogOut className="h-3.5 w-3.5 text-rose-500" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="md:pl-64">
        {/* STICKY HEADER */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[#E5E7EB] px-4 py-3 bg-white md:px-8 shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-xl border border-gray-200 text-gray-600 md:hidden"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div className="md:hidden">
              <Logo imgClassName="h-7" />
            </div>

            <div className="hidden md:block">
              <h1 className="font-display font-bold text-xl text-[#111111] leading-none">
                {currentSection.label}
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                {vendor.storeName} · Vendor Dashboard
              </p>
            </div>
          </div>

          {/* Right Header Menu */}
          <div className="flex items-center gap-2.5">
            {/* View store link */}
            <Link
              to="/store/$slug"
              params={{ slug: vendor.storeSlug || vendor.id }}
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 hover:border-gray-300 bg-white text-xs font-bold text-gray-700 shadow-2xs transition"
            >
              <ExternalLink className="h-3.5 w-3.5 text-gray-400" />
              Storefront
            </Link>

            {/* Notification Bell */}
            <button
              onClick={() => onSelectSection("notifications")}
              className="relative p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 transition cursor-pointer"
              title="Notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#E31E24] text-white text-[9px] font-bold flex items-center justify-center">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Logout button */}
            <button
              type="button"
              onClick={handleSignOut}
              title="Sign out from vendor dashboard"
              className="p-2 rounded-xl text-gray-400 hover:bg-red-50 hover:text-[#E31E24] transition cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Mobile Slide-out Menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 md:hidden backdrop-blur-xs flex">
            <div className="w-80 max-w-[85vw] bg-white h-full p-4 overflow-y-auto flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-200">
              <div className="space-y-4">
                {/* Brand & Close */}
                <div className="relative flex items-center justify-center pb-3 border-b border-gray-100">
                  <Logo className="justify-center" imgClassName="h-7.5 w-auto" />
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="absolute right-0 p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Store Micro-profile */}
                <div className="flex items-center gap-2.5 rounded-2xl bg-gray-50 p-2.5 border border-gray-100">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-[#E31E24] font-bold text-xs">
                    <Store className="h-4.5 w-4.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-gray-900">{vendor.storeName}</p>
                    <p className="text-[10px] text-gray-500 font-medium">
                      Status:{" "}
                      <span
                        className={`font-bold ${
                          vendor.status === "approved" ? "text-emerald-600" : "text-amber-600"
                        }`}
                      >
                        {vendor.status === "approved" ? "KYC Approved" : "KYC Pending"}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Navigation Sections */}
                <div className="space-y-1">
                  {SECTIONS.map((s) => {
                    const isActive = activeSection === s.id;
                    const Icon = s.icon;
                    return (
                      <button
                        key={s.id}
                        onClick={() => {
                          onSelectSection(s.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`flex w-full items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                          isActive
                            ? "bg-[#E31E24] text-white shadow-xs"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-gray-400"}`} />
                          <span>{s.label}</span>
                        </div>
                        {s.badge !== undefined && (
                          <span
                            className={`rounded-full px-2 py-0.2 text-[10px] font-bold ${
                              isActive
                                ? "bg-white/20 text-white"
                                : "bg-red-50 text-[#E31E24] border border-red-200"
                            }`}
                          >
                            {s.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Drawer Actions */}
              <div className="pt-4 mt-4 border-t border-gray-100 space-y-2">
                <Link
                  to="/store/$slug"
                  params={{ slug: vendor.storeSlug || vendor.id }}
                  target="_blank"
                  className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 transition"
                >
                  <span className="flex items-center gap-2">
                    <ExternalLink className="h-3.5 w-3.5 text-gray-400" />
                    Live Storefront
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
                </Link>

                <Link
                  to="/"
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-gray-500 hover:text-gray-900 transition"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Marketplace Home
                </Link>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                >
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              </div>
            </div>

            {/* Tap outside backdrop */}
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
          </div>
        )}

        {/* Content Body */}
        <main className="px-3 py-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">{children}</main>
      </div>

      {/* MOBILE BOTTOM TAB BAR (4 Core tabs + "More" drawer toggle) */}
      <nav className="fixed inset-x-3 bottom-3 z-40 flex justify-around rounded-2xl border border-gray-200 bg-white/95 backdrop-blur-md px-1 py-2 shadow-card md:hidden">
        {SECTIONS.slice(0, 4).map((s) => {
          const isActive = activeSection === s.id;
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              onClick={() => {
                onSelectSection(s.id);
                setMobileMenuOpen(false);
              }}
              className={`flex flex-1 flex-col items-center gap-0.5 text-[10px] font-bold transition py-1 relative ${
                isActive ? "text-[#E31E24]" : "text-gray-500"
              }`}
            >
              <Icon className="h-4.5 w-4.5" />
              <span className="truncate max-w-[62px]">{s.label}</span>
              {s.badge !== undefined && (
                <span className="absolute top-0 right-3 h-2 w-2 rounded-full bg-[#E31E24]" />
              )}
            </button>
          );
        })}

        {/* 5th Tab: "More" Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className={`flex flex-1 flex-col items-center gap-0.5 text-[10px] font-bold transition py-1 relative ${
            !["overview", "orders", "products", "inventory"].includes(activeSection)
              ? "text-[#E31E24]"
              : "text-gray-500"
          }`}
        >
          <LayoutGrid className="h-4.5 w-4.5" />
          <span>More</span>
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-0 right-3 h-2 w-2 rounded-full bg-[#E31E24]" />
          )}
        </button>
      </nav>
    </div>
  );
}
