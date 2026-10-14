import React, { useState } from "react";
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
  Headphones,
  LogOut,
  Menu,
  X,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  UserCog,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/site/bits";
import { Vendor } from "@/lib/vendor/types";
import { useVendorAuth } from "@/lib/vendorAuth";
import { useVendorStore } from "@/lib/vendor/vendorStore";
import { cn } from "@/lib/utils";

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
  ordersBadge?: number;
  children: React.ReactNode;
}

export function VendorDashboardShell({
  vendor,
  activeSection,
  onSelectSection,
  ordersBadge,
  children,
}: VendorDashboardShellProps) {
  const { logout } = useVendorAuth();
  const { products } = useVendorStore();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const vendorInitials = (vendor.storeName || vendor.ownerName || "VP")
    .trim()
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const lowStockCount = products.filter(
    (p) => p.vendorId === vendor.id && p.stock <= (p.minStockAlert || 5) && p.status === "live"
  ).length;

  const SECTIONS: NavSection[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    {
      id: "orders",
      label: "Orders",
      icon: Package,
      badge: ordersBadge !== undefined ? (ordersBadge > 0 ? ordersBadge : undefined) : undefined,
    },
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
    { id: "support", label: "Help & Support", icon: Headphones },
  ];

  const currentSection = SECTIONS.find((s) => s.id === activeSection) || SECTIONS[0];
  const bottomBarSections = SECTIONS.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#F5F6F8] relative text-[#111827] flex flex-col antialiased">
      <div className="flex flex-1 min-h-screen bg-[#F5F6F8] relative">
        {/* Desktop Left Sidebar: Identical glassmorphic architecture to Customer Dashboard */}
        <aside
          className={cn(
            "hidden md:flex flex-col bg-white/95 backdrop-blur-xl backdrop-saturate-150 border-r border-black/[0.06] shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-all duration-300 z-30 select-none fixed inset-y-0 left-0 h-screen",
            isCollapsed ? "w-20" : "w-64"
          )}
        >
          {/* Logo & Header */}
          <div className="relative h-20 flex items-center justify-center px-4 border-b border-black/[0.06] bg-white/60 backdrop-blur-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.85)]">
            {!isCollapsed ? (
              <div className="flex items-center justify-center">
                <Logo className="justify-center" imgClassName="h-13 sm:h-14 w-auto" />
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-tr from-[#E31E24] to-rose-500 text-white font-bold text-lg shadow-sm ring-2 ring-white">
                  {vendorInitials[0] || "V"}
                </span>
              </div>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              className={cn(
                "hidden lg:grid h-7 w-7 place-items-center rounded-full bg-white/80 hover:bg-white text-gray-400 hover:text-gray-800 border border-black/[0.08] shadow-2xs hover:shadow-xs hover:scale-105 active:scale-95 transition-all absolute top-1/2 -translate-y-1/2",
                isCollapsed ? "right-2" : "right-3"
              )}
            >
              {isCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
            {SECTIONS.map((s) => {
              const isActive = activeSection === s.id;
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => onSelectSection(s.id)}
                  title={isCollapsed ? s.label : undefined}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-xs font-semibold transition-all duration-200 group cursor-pointer relative",
                    isActive
                      ? "bg-[#E31E24]/10 text-[#E31E24] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8)] ring-1 ring-[#E31E24]/20"
                      : "text-gray-700 hover:text-gray-950 hover:bg-black/[0.035]",
                    isCollapsed && "justify-center px-0"
                  )}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-[#E31E24]" />
                  )}
                  <Icon
                    className={cn(
                      "h-4.5 w-4.5 shrink-0 transition-transform duration-200 group-hover:scale-110",
                      isActive ? "text-[#E31E24]" : "text-gray-400 group-hover:text-gray-700"
                    )}
                  />
                  {!isCollapsed && (
                    <span className="flex-1 text-left flex items-center justify-between">
                      <span className={cn(isActive && "font-bold text-[#E31E24]")}>{s.label}</span>
                      {s.badge !== undefined && (
                        <span
                          className={cn(
                            "px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-tight transition-colors",
                            isActive
                              ? "bg-[#E31E24]/15 text-[#E31E24]"
                              : "bg-black/[0.05] text-gray-700 group-hover:bg-black/[0.08]"
                          )}
                        >
                          {s.badge}
                        </span>
                      )}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Bottom of Sidebar: Profile & Account Settings Section (Same as Customer Dashboard) */}
          <div className="p-3 border-t border-black/[0.06] bg-white/70 backdrop-blur-md">
            {!isCollapsed ? (
              <button
                onClick={() => onSelectSection("settings")}
                className={cn(
                  "flex w-full items-center gap-3 p-2 rounded-2xl transition-all duration-200 text-left group cursor-pointer",
                  activeSection === "settings"
                    ? "bg-[#E31E24]/10 text-[#E31E24] ring-1 ring-[#E31E24]/30"
                    : "hover:bg-black/[0.04] text-gray-800"
                )}
                title="Profile & Store Settings"
              >
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-tr from-[#E31E24] to-rose-500 text-white font-extrabold text-xs shadow-xs shrink-0 ring-2 ring-white">
                  {vendorInitials}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold truncate group-hover:text-[#E31E24] transition-colors">
                      {vendor.storeName}
                    </p>
                    <UserCog className="h-3.5 w-3.5 text-gray-400 group-hover:text-[#E31E24] shrink-0" />
                  </div>
                  <p className="text-[11px] text-[#E31E24] font-medium truncate flex items-center gap-1.5 mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#E31E24] shrink-0" />
                    <span>{vendor.status === "approved" ? "Verified Partner" : "KYC Pending"} · {vendor.city || "Bengaluru"}</span>
                  </p>
                </div>
              </button>
            ) : (
              <button
                onClick={() => onSelectSection("settings")}
                className={cn(
                  "grid h-10 w-10 mx-auto place-items-center rounded-2xl transition cursor-pointer",
                  activeSection === "settings"
                    ? "bg-[#E31E24] text-white shadow-xs"
                    : "bg-gradient-to-tr from-[#E31E24] to-rose-500 text-white hover:opacity-90 shadow-xs"
                )}
                title={`Profile & Settings: ${vendor.storeName}`}
              >
                <span className="font-bold text-xs">{vendorInitials}</span>
              </button>
            )}
          </div>
        </aside>

        {/* Right Content Area */}
        <div
          className={cn(
            "flex-1 flex flex-col min-w-0 transition-all duration-300",
            isCollapsed ? "md:pl-20" : "md:pl-64"
          )}
        >
          {/* Top Header: Apple Glassmorphic theme identical to Customer Dashboard */}
          <header className="sticky top-0 z-20 h-18 sm:h-20 bg-white/65 backdrop-blur-2xl backdrop-saturate-180 border-b border-black/[0.06] px-3 sm:px-4 md:px-8 flex items-center justify-between gap-2 sm:gap-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.85),0_10px_30px_-10px_rgba(0,0,0,0.04)] transition-all duration-200">
            {/* Left: Mobile hamburger & breadcrumbs */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden h-9 w-9 sm:h-10 sm:w-10 grid place-items-center rounded-2xl bg-white/70 hover:bg-white active:bg-white/95 backdrop-blur-md border border-black/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_2px_6px_rgba(0,0,0,0.03)] text-gray-700 hover:text-gray-950 active:scale-95 transition-all duration-200 cursor-pointer shrink-0"
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="hidden sm:block min-w-0">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-400 tracking-wide">
                  <span className="hover:text-gray-600 transition-colors">Vendor Network</span>
                  <span className="text-gray-300">/</span>
                  <span className="text-gray-600 truncate">{vendor.storeName}</span>
                </div>
                <h1 className="font-display font-black text-xl sm:text-2xl text-gray-900 tracking-tight leading-tight mt-0.5">
                  {currentSection.label}
                </h1>
              </div>
            </div>

            {/* Right: Profile Menu Dropdown */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="relative flex items-center gap-1.5 sm:gap-2.5 p-1 pl-1 pr-2 sm:pr-3.5 rounded-full bg-white/70 hover:bg-white active:bg-white/95 backdrop-blur-md border border-black/[0.08] hover:border-black/[0.16] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,1),0_4px_16px_rgba(0,0,0,0.08)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer group shrink-0"
                  aria-label="Profile and store menu"
                  title="Profile & Store Menu"
                >
                  <span className="grid h-7 w-7 sm:h-8 sm:w-8 place-items-center rounded-full bg-gradient-to-tr from-[#E31E24] via-rose-500 to-red-600 text-white font-extrabold text-xs shadow-xs ring-2 ring-white">
                    {vendorInitials}
                  </span>
                  <span className="hidden sm:inline-block text-xs font-bold text-gray-800 group-hover:text-gray-950 max-w-[120px] truncate transition-colors">
                    {vendor.ownerName?.split(" ")[0] || vendor.storeName.split(" ")[0]}
                  </span>
                  <ChevronDown className={cn("h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-400 group-hover:text-gray-700 transition-transform duration-200", isProfileOpen && "rotate-180")} />
                </button>

                {isProfileOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsProfileOpen(false)}
                    />
                    <div className="absolute right-0 mt-2.5 w-[calc(100vw-1.5rem)] max-w-xs sm:w-80 rounded-3xl bg-white/94 backdrop-blur-3xl border border-white/80 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.18),inset_0_1px_0_0_rgba(255,255,255,0.95)] p-3.5 z-50 ring-1 ring-black/[0.06] animate-in fade-in zoom-in-95 duration-150">
                      {/* User Header Preview */}
                      <div className="p-3.5 rounded-2xl bg-gradient-to-b from-white/70 to-black/[0.02] border border-black/[0.05] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9)] mb-2 flex items-center gap-3">
                        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-tr from-[#E31E24] to-rose-500 text-white font-extrabold text-sm shadow-xs ring-2 ring-white shrink-0">
                          {vendorInitials}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-gray-950 truncate">{vendor.storeName}</p>
                          <p className="text-[11px] text-gray-500 truncate">{vendor.email || vendor.ownerName}</p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#E31E24]" />
                            <span className="text-[10px] font-semibold text-[#E31E24]">
                              {vendor.status === "approved" ? "Verified Vendor Partner" : "KYC Pending"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        {/* Profile & Settings */}
                        <button
                          type="button"
                          onClick={() => {
                            setIsProfileOpen(false);
                            onSelectSection("settings");
                          }}
                          className={cn(
                            "flex w-full items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer group",
                            activeSection === "settings"
                              ? "bg-[#E31E24]/10 text-[#E31E24]"
                              : "hover:bg-black/[0.04] text-gray-700 hover:text-gray-900"
                          )}
                        >
                          <span className="flex items-center gap-2.5">
                            <UserCog className="h-4 w-4 text-[#E31E24] group-hover:scale-110 transition-transform" />
                            <span>Store Profile & Settings</span>
                          </span>
                          <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
                        </button>

                        {/* Orders */}
                        <button
                          type="button"
                          onClick={() => {
                            setIsProfileOpen(false);
                            onSelectSection("orders");
                          }}
                          className={cn(
                            "flex w-full items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer group",
                            activeSection === "orders"
                              ? "bg-[#E31E24]/10 text-[#E31E24]"
                              : "hover:bg-black/[0.04] text-gray-700 hover:text-gray-900"
                          )}
                        >
                          <span className="flex items-center gap-2.5">
                            <Package className="h-4 w-4 text-gray-500 group-hover:text-gray-900 group-hover:scale-110 transition-transform" />
                            <span>Orders & Shipping</span>
                          </span>
                          <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
                        </button>

                        {/* Products */}
                        <button
                          type="button"
                          onClick={() => {
                            setIsProfileOpen(false);
                            onSelectSection("products");
                          }}
                          className={cn(
                            "flex w-full items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer group",
                            activeSection === "products"
                              ? "bg-[#E31E24]/10 text-[#E31E24]"
                              : "hover:bg-black/[0.04] text-gray-700 hover:text-gray-900"
                          )}
                        >
                          <span className="flex items-center gap-2.5">
                            <Layers className="h-4 w-4 text-gray-500 group-hover:text-gray-900 group-hover:scale-110 transition-transform" />
                            <span>Product Catalogue</span>
                          </span>
                          <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
                        </button>
                      </div>

                      <div className="my-2 border-t border-black/[0.06]" />

                      {/* Sign Out inside profile dropdown */}
                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileOpen(false);
                          logout();
                          toast.success("Vendor signed out successfully.");
                        }}
                        className="flex w-full items-center gap-2.5 p-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer group"
                      >
                        <LogOut className="h-4 w-4 text-rose-500 group-hover:scale-110 transition-transform" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </header>

          {/* Main Content Body */}
          <main className="p-3 sm:p-4 md:p-8 min-w-0 max-w-7xl w-full mx-auto pb-28 md:pb-8">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile Slide-out Menu (Clean glass design matching CustomerLayout) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 md:hidden backdrop-blur-xs flex">
          <div className="w-80 max-w-[85vw] bg-white/95 backdrop-blur-2xl h-full p-4 overflow-y-auto flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="space-y-4">
              {/* Brand & Close */}
              <div className="flex items-center justify-between pb-3 border-b border-black/[0.06]">
                <div className="flex items-center gap-2">
                  <Logo imgClassName="h-8" />
                  <span className="rounded-md bg-red-50 px-1.5 py-0.5 text-[9px] font-black uppercase text-[#E31E24] border border-red-200">
                    VENDOR
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-black/[0.04] transition cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
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
                      className={cn(
                        "w-full flex items-center justify-between p-3 rounded-2xl text-xs font-semibold transition cursor-pointer",
                        isActive
                          ? "bg-[#E31E24]/10 text-[#E31E24] font-bold ring-1 ring-[#E31E24]/20"
                          : "text-gray-700 hover:bg-black/[0.035]"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={cn(
                            "h-4.5 w-4.5 shrink-0",
                            isActive ? "text-[#E31E24]" : "text-gray-400"
                          )}
                        />
                        <span>{s.label}</span>
                      </div>
                      {s.badge !== undefined && (
                        <span
                          className={cn(
                            "px-2.5 py-0.5 rounded-full text-[10px] font-bold",
                            isActive
                              ? "bg-[#E31E24]/15 text-[#E31E24]"
                              : "bg-black/[0.05] text-gray-700"
                          )}
                        >
                          {s.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mobile Bottom Profile Card */}
            <div className="pt-4 mt-4 border-t border-black/[0.06] space-y-2">
              <button
                onClick={() => {
                  onSelectSection("settings");
                  setMobileMenuOpen(false);
                }}
                className="flex w-full items-center gap-3 p-2.5 rounded-2xl bg-black/[0.02] border border-black/[0.05] text-left cursor-pointer"
              >
                <span className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-tr from-[#E31E24] to-rose-500 text-white font-extrabold text-xs shadow-xs shrink-0 ring-2 ring-white">
                  {vendorInitials}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold truncate text-gray-900">{vendor.storeName}</p>
                  <p className="text-[10px] text-[#E31E24] font-medium truncate">
                    {vendor.status === "approved" ? "Verified Partner" : "KYC Pending"}
                  </p>
                </div>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                  toast.success("Signed out successfully.");
                }}
                className="flex w-full items-center justify-center gap-2 rounded-2xl px-3 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
              >
                <LogOut className="h-4 w-4" /> Sign Out
              </button>
            </div>
          </div>

          {/* Tap outside backdrop */}
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* Mobile Bottom Dock (Same design as Customer Dashboard) */}
      <nav className="fixed inset-x-2.5 bottom-2.5 z-40 flex justify-around rounded-2xl border border-black/[0.06] px-1 py-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.08)] bg-white/95 backdrop-blur-md md:hidden">
        {bottomBarSections.map((s) => {
          const isActive = activeSection === s.id;
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              onClick={() => onSelectSection(s.id)}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 py-1 text-[9.5px] font-medium transition cursor-pointer relative",
                isActive ? "text-[#E31E24] font-bold" : "text-gray-500 hover:text-gray-900"
              )}
            >
              <Icon className="h-4.5 w-4.5" />
              <span className="truncate max-w-[58px]">{s.label.split(" ")[0]}</span>
              {s.badge !== undefined && (
                <span className="absolute top-0.5 right-3 h-2 w-2 rounded-full bg-[#E31E24]" />
              )}
            </button>
          );
        })}

        {/* 5th Tab: "More" Menu Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className={cn(
            "flex flex-1 flex-col items-center gap-0.5 py-1 text-[9.5px] font-medium transition cursor-pointer",
            !bottomBarSections.some((s) => s.id === activeSection)
              ? "text-[#E31E24] font-bold"
              : "text-gray-500 hover:text-gray-900"
          )}
        >
          <LayoutGrid className="h-4.5 w-4.5" />
          <span>More</span>
        </button>
      </nav>
    </div>
  );
}
