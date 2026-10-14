import { useState, useMemo } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import {
  Bike,
  Heart,
  LayoutGrid,
  Package,
  Wrench,
  Tag,
  Receipt,
  Bell,
  User,
  UserCog,
  LifeBuoy,
  ShoppingBag,
  ShoppingCart,
  ArrowLeft,
  Sparkles,
  Mic,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  Search,
  Check,
  CheckCheck,
  ExternalLink,
  Shield,
  Phone,
  LogOut,
  Calendar,
  ScanLine,
  Truck,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/site/bits";
import { useStore } from "@/lib/store";
import { signOut as endServerSession } from "@/lib/auth";
import { inr, products, type Product } from "@/lib/data";
import { cn } from "@/lib/utils";
import { VinSearchModal } from "./VinSearchModal";
import { CartDrawer } from "@/components/common/CartDrawer";
import { AiChatbotWidget } from "@/components/common/AiChatbotWidget";
import { LocationPickerModal } from "@/components/common/LocationPickerModal";

export type CustomerTab =
  | "overview"
  | "shop"
  | "garage"
  | "orders"
  | "tracking"
  | "saved"
  | "service"
  | "addresses"
  | "invoices"
  | "notifications"
  | "settings"
  | "support"
  | "offers";

interface CustomerLayoutProps {
  activeTab: CustomerTab;
  onTabChange: (tab: CustomerTab) => void;
  children: React.ReactNode;
  onOpenBookingModal?: () => void;
}

export function CustomerLayout({
  activeTab,
  onTabChange,
  children,
  onOpenBookingModal,
}: CustomerLayoutProps) {
  const {
    userProfile,
    garage,
    orders,
    savedProductIds,
    serviceBookings,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    cart,
    setIsCartOpen,
    signOut: storeSignOut,
    userLocation,
    isLocationModalOpen,
    setIsLocationModalOpen,
  } = useStore();
  const { user: authUser, signOut } = useAuth();
  const navigate = useNavigate();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isVinSearchOpen, setIsVinSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const userInitials = (authUser?.name || userProfile.name || "CP")
    .trim()
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const activeOrdersCount = orders.filter((o) => o.status < 5).length;
  const liveOrder = orders.find((o) => o.status < 5);
  const unreadNotifsCount = notifications.filter((n) => !n.read).length;
  const upcomingServicesCount = serviceBookings.filter(
    (s) => s.status === "Confirmed" || s.status === "In progress"
  ).length;

  const filteredSearchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  const navItems: Array<{
    id: CustomerTab;
    label: string;
    Icon: any;
    badge?: string;
    badgeColor?: string;
    to?: string;
  }> = [
    {
      id: "overview",
      label: "Overview",
      Icon: LayoutGrid,
    },
    {
      id: "shop",
      label: "Shop Bikes & Parts",
      Icon: ShoppingBag,
    },
    {
      id: "tracking",
      label: "Track Delivery",
      Icon: Truck,
    },
    {
      id: "garage",
      label: "My Garage",
      Icon: Bike,
      badge: `${garage.length}`,
    },
    {
      id: "service",
      label: "Service & Maintenance",
      Icon: Wrench,
      badge: upcomingServicesCount > 0 ? `${upcomingServicesCount} Due` : undefined,
      badgeColor: "bg-blue-600 text-white",
    },
    {
      id: "invoices",
      label: "Payments & Invoices",
      Icon: Receipt,
    },
    {
      id: "support",
      label: "Help & Support",
      Icon: LifeBuoy,
    },
  ];

  const handleNavClick = (item: (typeof navItems)[number]) => {
    if (item.to) {
      navigate({ to: item.to });
    } else {
      onTabChange(item.id as CustomerTab);
    }
    setIsMobileMenuOpen(false);
  };

  const getBreadcrumbTitle = () => {
    switch (activeTab) {
      case "overview":
        return "Dashboard Overview";
      case "shop":
        return "Shop Bikes & Parts";
      case "garage":
        return "My Registered EV Garage";
      case "orders":
        return "My Orders";
      case "tracking":
        return "Track Delivery & Courier Shipments";
      case "saved":
        return "Saved Items & Wishlist";
      case "service":
        return "Service & Doorstep Maintenance";
      case "addresses":
        return "Saved Delivery Addresses";
      case "invoices":
        return "Payments, Tax Invoices & Receipts";
      case "notifications":
        return "Notifications & Alerts";
      case "settings":
        return "Profile & Preferences";
      case "support":
        return "Help & Dedicated Support";
      default:
        return "Customer Dashboard";
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FB] text-[#111827] flex flex-col antialiased">
      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-xs pt-20 px-4 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white rounded-3xl border border-gray-200 shadow-2xl overflow-hidden">
            <div className="flex items-center px-5 py-4 border-b border-gray-100">
              <Search className="h-5 w-5 text-gray-400 mr-3" />
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search EV batteries, chargers, brake rotors, BMS boards..."
                className="flex-1 bg-transparent text-base text-gray-900 placeholder:text-gray-400 outline-none"
              />
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery("");
                }}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[380px] overflow-y-auto p-4">
              {searchQuery.trim() === "" ? (
                <div className="py-8 text-center text-sm text-gray-500">
                  <p className="font-medium text-gray-700 mb-1">Quick Search Categories</p>
                  <div className="flex flex-wrap justify-center gap-2 mt-3">
                    {["60V Li-ion Battery", "Fast Chargers", "Brembo Disc Rotor", "Smart BMS", "Ather 450X Parts", "Ola S1 Pro"].map(
                      (tag) => (
                        <button
                          key={tag}
                          onClick={() => setSearchQuery(tag)}
                          className="px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 hover:bg-primary/10 hover:text-primary transition"
                        >
                          {tag}
                        </button>
                      )
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setIsSearchOpen(false);
                      setIsVinSearchOpen(true);
                    }}
                    className="mt-5 w-full p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center justify-between hover:bg-emerald-100 transition"
                  >
                    <span className="flex items-center gap-2">
                      <ScanLine className="h-4 w-4 text-primary" />
                      <span>Know your 17-digit VIN? Search verified parts directly by VIN</span>
                    </span>
                    <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-md font-bold">
                      VIN Lookup →
                    </span>
                  </button>
                </div>
              ) : filteredSearchResults.length === 0 ? (
                <div className="py-10 text-center text-sm text-gray-500">
                  No parts found matching &ldquo;<span className="font-semibold text-gray-800">{searchQuery}</span>&rdquo;.
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2">
                    Found {filteredSearchResults.length} matching items
                  </p>
                  {filteredSearchResults.map((prod) => (
                    <Link
                      key={prod.id}
                      to="/product/$id"
                      params={{ id: prod.id }}
                      onClick={() => setIsSearchOpen(false)}
                      className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-gray-50 transition group"
                    >
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="h-12 w-12 rounded-xl object-cover bg-gray-100 border border-gray-200"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 group-hover:text-primary truncate transition">
                          {prod.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {prod.category} · {prod.brand} · Fits {prod.fits.length} EV models
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">{inr(prod.offers[0].price)}</p>
                        <span className="text-[11px] font-medium text-primary">View →</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Container with Solid Clean Neutral Backdrop */}
      <div className="flex flex-1 min-h-screen bg-[#F5F6F8] relative">
        {/* Desktop Left Sidebar (Static Fixed Container Pinned to Viewport) */}
        <aside
          className={cn(
            "hidden md:flex flex-col bg-white/95 backdrop-blur-xl backdrop-saturate-150 border-r border-black/[0.06] shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-all duration-300 z-30 select-none fixed inset-y-0 left-0 h-screen",
            isCollapsed ? "w-20" : "w-64"
          )}
        >
          {/* Logo & Header (Apple Glassmorphic Theme) */}
          <div className="relative h-20 flex items-center justify-center px-4 border-b border-black/[0.06] bg-white/60 backdrop-blur-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.85)]">
            {!isCollapsed ? (
              <div className="flex items-center justify-center">
                <Logo className="justify-center" imgClassName="h-15 sm:h-16 md:h-17 w-auto" />
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-tr from-[#E31E24] to-rose-500 text-white font-bold text-lg shadow-sm ring-2 ring-white">
                  R
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
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  className={cn(
                    "relative flex w-full items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all duration-200 group active:scale-[0.98]",
                    isActive
                      ? "bg-[#E31E24]/[0.08] text-[#E31E24] font-bold shadow-2xs backdrop-blur-sm"
                      : "text-[#4B5563] hover:bg-black/[0.04] hover:text-[#111111]",
                    isCollapsed && "justify-center px-0"
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-1.5 rounded-r-full bg-[#E31E24] shadow-[0_0_8px_rgba(227,30,36,0.35)]" />
                  )}
                  <item.Icon
                    className={cn(
                      "h-4.5 w-4.5 shrink-0 transition-transform duration-200 group-hover:scale-105",
                      isActive ? "text-[#E31E24]" : "text-[#6B7280] group-hover:text-[#111111]"
                    )}
                  />
                  {!isCollapsed && (
                    <span className="flex-1 text-left flex items-center justify-between">
                      <span className={cn(isActive && "font-bold text-[#E31E24]")}>{item.label}</span>
                      {item.badge && (
                        <span
                          className={cn(
                            "px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-tight transition-colors",
                            isActive
                              ? "bg-[#E31E24]/15 text-[#E31E24]"
                              : item.badgeColor || "bg-black/[0.05] text-gray-700 group-hover:bg-black/[0.08]"
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Bottom of Navbar: Profile & Account Settings */}
          <div className="p-3 border-t border-black/[0.06] bg-white/70 backdrop-blur-md">
            {!isCollapsed ? (
              <button
                onClick={() => onTabChange("settings")}
                className={cn(
                  "flex w-full items-center gap-3 p-2 rounded-2xl transition-all duration-200 text-left group cursor-pointer",
                  activeTab === "settings"
                    ? "bg-[#E31E24]/10 text-[#E31E24] ring-1 ring-[#E31E24]/30"
                    : "hover:bg-black/[0.04] text-gray-800"
                )}
                title="Profile & Account Settings"
              >
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-tr from-[#E31E24] to-rose-500 text-white font-extrabold text-xs shadow-xs shrink-0 ring-2 ring-white">
                  {userProfile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2) || "AS"}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold truncate group-hover:text-[#E31E24] transition-colors">
                      {userProfile.name}
                    </p>
                    <UserCog className="h-3.5 w-3.5 text-gray-400 group-hover:text-[#E31E24] shrink-0" />
                  </div>
                  <p className="text-[11px] text-[#E31E24] font-medium truncate flex items-center gap-1.5 mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#E31E24] shrink-0" />
                    <span>{userProfile.points || 450} pts · Gold Tier</span>
                  </p>
                </div>
              </button>
            ) : (
              <button
                onClick={() => onTabChange("settings")}
                className={cn(
                  "grid h-10 w-10 mx-auto place-items-center rounded-2xl transition cursor-pointer",
                  activeTab === "settings"
                    ? "bg-[#E31E24] text-white shadow-xs"
                    : "bg-gradient-to-tr from-[#E31E24] to-rose-500 text-white hover:opacity-90 shadow-xs"
                )}
                title={`Profile & Account: ${userProfile.name}`}
              >
                <span className="font-bold text-xs">
                  {userProfile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2) || "AS"}
                </span>
              </button>
            )}
          </div>
        </aside>

        {/* Right Content Area (Scrolls independently while navbar stays static) */}
        <div
          className={cn(
            "flex-1 flex flex-col min-w-0 transition-all duration-300",
            isCollapsed ? "md:pl-20" : "md:pl-64"
          )}
        >
          {/* Top Header: Height 56px plus safe-area top. Solid white background with a 1px bottom border, sticky */}
          <header className="sticky top-0 z-40 h-[calc(56px+env(safe-area-inset-top,0px))] pt-[env(safe-area-inset-top,0px)] bg-white border-b border-[#E5E7EB] px-3 sm:px-6 flex items-center justify-between gap-2.5 transition-all">
            {/* Exactly four items:
                1. menu button (44px)
                2. location pill (flex:1, min-width:0, pin icon, one line, truncated with ellipsis)
                3. cart icon (44px, badge hidden at 0, "9+" max)
                4. avatar (40px) with small unread dot
            */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="h-11 w-11 min-w-11 min-h-11 rounded-full grid place-items-center hover:bg-gray-100 text-gray-800 active:scale-95 transition-colors cursor-pointer shrink-0"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Location Pill: flex:1, min-width:0, pin icon, one line, truncated with ellipsis */}
            <button
              type="button"
              onClick={() => setIsLocationModalOpen(true)}
              className="flex-1 min-w-0 h-10 flex items-center gap-2 px-3 rounded-full bg-[#F5F6F8] hover:bg-gray-100 border border-[#E5E7EB] text-left transition-colors cursor-pointer group"
              title="Change delivery location"
            >
              <MapPin className="h-4 w-4 text-[#E31E24] shrink-0" />
              <span className="truncate text-xs font-semibold text-gray-900 leading-none">
                {userLocation?.name || "Indiranagar, Bengaluru"}
              </span>
            </button>

            {/* Cart Icon: 44px, badge hidden at 0, "9+" max */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative h-11 w-11 min-w-11 min-h-11 grid place-items-center rounded-full hover:bg-gray-100 text-gray-800 active:scale-95 transition-colors cursor-pointer shrink-0"
              aria-label="Shopping Cart"
              title="Shopping Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 grid h-4.5 min-w-4.5 px-1 place-items-center rounded-full bg-[#E31E24] text-[10px] font-bold text-white shadow-xs">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </button>

            {/* Avatar: 40px, notification dot when unread, no chevron */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="relative h-10 w-10 min-w-10 min-h-10 rounded-full grid place-items-center bg-[#111111] text-white font-bold text-xs ring-1 ring-black/[0.08] active:scale-95 transition-transform cursor-pointer"
                aria-label="Account menu"
                title="Account menu"
              >
                <span>{userInitials}</span>
                {unreadNotifsCount > 0 && (
                  <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-[#E31E24] ring-2 ring-white" />
                )}
              </button>

              {isProfileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-[58]"
                    onClick={() => setIsProfileOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-[#E5E7EB] shadow-xl p-1.5 z-[59] animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-2 border-b border-gray-100">
                      <p className="text-xs font-bold text-gray-900 truncate">{userProfile.name}</p>
                      <p className="text-[11px] text-gray-500 truncate">
                        {userProfile.email && !userProfile.email.includes("@riderzpro.in")
                          ? userProfile.email
                          : userProfile.phone || "+91 98765 43210"}
                      </p>
                    </div>

                    <div className="py-1">
                      {/* 1. Profile */}
                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileOpen(false);
                          onTabChange("settings");
                        }}
                        className="flex w-full items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <span>Profile</span>
                        <User className="h-3.5 w-3.5 text-gray-400" />
                      </button>

                      {/* 2. Notifications */}
                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileOpen(false);
                          onTabChange("notifications");
                        }}
                        className="flex w-full items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <span>Notifications</span>
                        {unreadNotifsCount > 0 ? (
                          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E31E24] text-white">
                            {unreadNotifsCount}
                          </span>
                        ) : (
                          <Bell className="h-3.5 w-3.5 text-gray-400" />
                        )}
                      </button>

                      {/* 3. Orders */}
                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileOpen(false);
                          onTabChange("orders");
                        }}
                        className="flex w-full items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <span>Orders</span>
                        <Package className="h-3.5 w-3.5 text-gray-400" />
                      </button>
                    </div>

                    {/* 4. Sign out */}
                    <div className="border-t border-gray-100 pt-1">
                      <button
                        type="button"
                        onClick={async () => {
                          setIsProfileOpen(false);
                          try {
                            await endServerSession();
                          } catch {
                            // ignore
                          }
                          signOut();
                          toast.success("Signed out successfully");
                          navigate({ to: "/" });
                        }}
                        className="flex w-full items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <span>Sign out</span>
                        <LogOut className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </header>

          {/* Main Dashboard Body: padding bottom ensures last item is never hidden behind bottom nav & AI button */}
          <main
            className={cn(
              "flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto z-0",
              activeTab === "overview" || activeTab === "shop"
                ? "pb-[calc(var(--nav-h)+64px)] md:pb-8"
                : "pb-[calc(var(--nav-h)+16px)] md:pb-8"
            )}
          >
            {children}
          </main>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-black/50 backdrop-blur-xs">
          <div className="w-72 bg-white h-full flex flex-col p-5 shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="relative flex items-center justify-center pb-4 border-b border-gray-100">
              <Logo className="justify-center" imgClassName="h-11 sm:h-12 w-auto" />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-gray-400 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-4 space-y-1">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item)}
                    className={cn(
                      "relative flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium transition",
                      isActive
                        ? "bg-[#FFF0F0] text-[#E31E24] font-bold"
                        : "text-[#4B5563] hover:bg-gray-50 hover:text-[#111111]"
                    )}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-1.5 rounded-r-full bg-[#E31E24]" />
                    )}
                    <span className="flex items-center gap-3">
                      <item.Icon className={cn("h-4.5 w-4.5 shrink-0", isActive ? "text-[#E31E24]" : "text-[#6B7280]")} />
                      <span className={cn(isActive && "font-bold text-[#E31E24]")}>{item.label}</span>
                    </span>
                    {item.badge && (
                      <span
                        className={cn(
                          "px-2.5 py-0.5 rounded-full text-[10px] font-bold",
                          isActive ? "bg-red-100 text-[#E31E24]" : item.badgeColor || "bg-gray-100 text-gray-700"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
            <div className="pt-4 border-t border-gray-100 space-y-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onTabChange("settings");
                }}
                className={cn(
                  "flex w-full items-center gap-3 p-2.5 rounded-2xl transition text-left cursor-pointer",
                  activeTab === "settings"
                    ? "bg-[#E31E24]/10 text-[#E31E24] ring-1 ring-[#E31E24]/30"
                    : "hover:bg-gray-50 text-gray-800"
                )}
              >
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-tr from-[#E31E24] to-rose-500 text-white font-extrabold text-xs shadow-xs shrink-0">
                  {userProfile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2) || "AS"}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold truncate">{userProfile.name}</p>
                  <p className="text-[11px] text-gray-500">Profile & Settings</p>
                </div>
              </button>

              <Link
                to="/"
                className="flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-primary transition px-2"
              >
                <ArrowLeft className="h-4 w-4" /> Back to store
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Customer Mobile Bottom Navigation: Height 56px plus safe-area bottom, solid white, 1px top border, 5 equal items */}
      <nav className="fixed inset-x-0 bottom-0 z-50 h-[calc(56px+env(safe-area-inset-bottom,0px))] pb-[env(safe-area-inset-bottom,0px)] bg-white border-t border-[#E5E7EB] md:hidden flex items-center justify-around px-1">
        {/* Item 1: Home */}
        <button
          type="button"
          onClick={() => onTabChange("overview")}
          className={cn(
            "relative flex flex-1 h-full flex-col items-center justify-center gap-1 transition-colors cursor-pointer",
            activeTab === "overview" ? "text-[#E31E24]" : "text-[#6B7280] hover:text-[#111111]"
          )}
        >
          {activeTab === "overview" && (
            <span className="absolute top-0 inset-x-3 h-[2px] bg-[#E31E24] rounded-full" />
          )}
          <LayoutGrid className="h-[22px] w-[22px]" />
          <span className="text-[11px] font-medium leading-none">Home</span>
        </button>

        {/* Item 2: Shop */}
        <button
          type="button"
          onClick={() => onTabChange("shop")}
          className={cn(
            "relative flex flex-1 h-full flex-col items-center justify-center gap-1 transition-colors cursor-pointer",
            activeTab === "shop" ? "text-[#E31E24]" : "text-[#6B7280] hover:text-[#111111]"
          )}
        >
          {activeTab === "shop" && (
            <span className="absolute top-0 inset-x-3 h-[2px] bg-[#E31E24] rounded-full" />
          )}
          <ShoppingBag className="h-[22px] w-[22px]" />
          <span className="text-[11px] font-medium leading-none">Shop</span>
        </button>

        {/* Item 3: Garage */}
        <button
          type="button"
          onClick={() => onTabChange("garage")}
          className={cn(
            "relative flex flex-1 h-full flex-col items-center justify-center gap-1 transition-colors cursor-pointer",
            activeTab === "garage" ? "text-[#E31E24]" : "text-[#6B7280] hover:text-[#111111]"
          )}
        >
          {activeTab === "garage" && (
            <span className="absolute top-0 inset-x-3 h-[2px] bg-[#E31E24] rounded-full" />
          )}
          <Bike className="h-[22px] w-[22px]" />
          <span className="text-[11px] font-medium leading-none">Garage</span>
        </button>

        {/* Item 4: Orders */}
        <button
          type="button"
          onClick={() => onTabChange("orders")}
          className={cn(
            "relative flex flex-1 h-full flex-col items-center justify-center gap-1 transition-colors cursor-pointer",
            activeTab === "orders" ? "text-[#E31E24]" : "text-[#6B7280] hover:text-[#111111]"
          )}
        >
          {activeTab === "orders" && (
            <span className="absolute top-0 inset-x-3 h-[2px] bg-[#E31E24] rounded-full" />
          )}
          <Package className="h-[22px] w-[22px]" />
          <span className="text-[11px] font-medium leading-none">Orders</span>
        </button>

        {/* Item 5: Profile */}
        <button
          type="button"
          onClick={() => onTabChange("settings")}
          className={cn(
            "relative flex flex-1 h-full flex-col items-center justify-center gap-1 transition-colors cursor-pointer",
            activeTab === "settings" ? "text-[#E31E24]" : "text-[#6B7280] hover:text-[#111111]"
          )}
        >
          {activeTab === "settings" && (
            <span className="absolute top-0 inset-x-3 h-[2px] bg-[#E31E24] rounded-full" />
          )}
          <User className="h-[22px] w-[22px]" />
          <span className="text-[11px] font-medium leading-none">Profile</span>
        </button>
      </nav>

      {/* Global VIN Search Modal */}
      <VinSearchModal
        isOpen={isVinSearchOpen}
        onClose={() => setIsVinSearchOpen(false)}
      />

      {/* Global Cart Slide-Over Drawer */}
      <CartDrawer />

      {/* Floating AI Assistant (Single Icon-Only Button on Home/Shop) */}
      <AiChatbotWidget activeTab={activeTab} />

      {/* Global Location Picker Modal */}
      <LocationPickerModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />
    </div>
  );
}
