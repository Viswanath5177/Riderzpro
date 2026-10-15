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
import { inr, products, getProduct, type Product } from "@/lib/data";
import { cn } from "@/lib/utils";
import { VinSearchModal } from "./VinSearchModal";
import { CartDrawer } from "@/components/common/CartDrawer";
import { AiChatbotWidget } from "@/components/common/AiChatbotWidget";
import { LocationPickerModal } from "@/components/common/LocationPickerModal";
import { DashboardNotificationBell } from "@/components/common/DashboardNotificationBell";

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
  const { user: authUser, signOut: authSignOut } = useAuth();
  const navigate = useNavigate();

  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
    toast.info("Signing out...", { duration: 1500 });
    try {
      storeSignOut();
      await authSignOut();
    } catch (e) {
      console.warn("Signout error:", e);
    } finally {
      try {
        localStorage.removeItem("riderzpro_auth_user");
        localStorage.removeItem("riderzpro_auth_token");
        localStorage.removeItem("riderzpro_token");
        localStorage.removeItem("riderzpro_admin_session");
        localStorage.removeItem("riderzpro_seller_store_confirmed");
        localStorage.removeItem("riderzpro-v7");
        localStorage.removeItem("riderzpro_active_bike");
        sessionStorage.clear();
      } catch {}
      window.location.href = "/";
    }
  };

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isVinSearchOpen, setIsVinSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const userInitials = (authUser?.name || userProfile.name || "U")
    .trim()
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "U";

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

  const cartCount = cart
    .filter((c) => Boolean(getProduct(c.productId)))
    .reduce((s, c) => s + c.qty, 0);

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
      badge: liveOrder ? "Live" : undefined,
      badgeColor: "bg-[#E31E24] text-white",
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
                <Logo className="justify-center" imgClassName="h-13 sm:h-14 w-auto" />
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
              <div className="space-y-1.5">
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
                    {userInitials}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold truncate group-hover:text-[#E31E24] transition-colors">
                        {userProfile.name || authUser?.name || "User"}
                      </p>
                      <UserCog className="h-3.5 w-3.5 text-gray-400 group-hover:text-[#E31E24] shrink-0" />
                    </div>
                    <p className="text-[11px] text-[#E31E24] font-medium truncate flex items-center gap-1.5 mt-0.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#E31E24] shrink-0" />
                      <span>{userProfile.points || 0} pts · Member</span>
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="flex w-full items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition cursor-pointer group"
                  title="Sign out of your account"
                >
                  <LogOut className="h-3.5 w-3.5 text-rose-500 group-hover:-translate-x-0.5 transition-transform" />
                  <span>{isSigningOut ? "Signing out..." : "Sign Out"}</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={() => onTabChange("settings")}
                  className={cn(
                    "grid h-10 w-10 mx-auto place-items-center rounded-2xl transition cursor-pointer",
                    activeTab === "settings"
                      ? "bg-[#E31E24] text-white shadow-xs"
                      : "bg-gradient-to-tr from-[#E31E24] to-rose-500 text-white hover:opacity-90 shadow-xs"
                  )}
                  title={`Profile & Account: ${userProfile.name || "User"}`}
                >
                  <span className="font-bold text-xs">{userInitials}</span>
                </button>
                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="grid h-8 w-8 mx-auto place-items-center rounded-xl text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition cursor-pointer"
                  title="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
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
          {/* Top Header (Apple Glassmorphic Theme) */}
          <header className="sticky top-0 z-20 h-18 sm:h-20 bg-white/65 backdrop-blur-2xl backdrop-saturate-180 border-b border-black/[0.06] px-3 sm:px-4 md:px-8 flex items-center justify-between gap-2 sm:gap-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.85),0_10px_30px_-10px_rgba(0,0,0,0.04)] transition-all duration-200">
            {/* Left: Mobile hamburger & location selector */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden h-9 w-9 sm:h-10 sm:w-10 grid place-items-center rounded-2xl bg-white/70 hover:bg-white active:bg-white/95 backdrop-blur-md border border-black/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_2px_6px_rgba(0,0,0,0.03)] text-gray-700 hover:text-gray-950 active:scale-95 transition-all duration-200 cursor-pointer shrink-0"
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5" />
              </button>

              {/* Location Drop Down to select saved location or device location */}
              <button
                onClick={() => setIsLocationModalOpen(true)}
                className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/90 hover:bg-white active:bg-white border border-black/[0.08] hover:border-black/[0.18] shadow-2xs hover:shadow-xs text-xs font-semibold text-gray-800 transition-all cursor-pointer shrink-0 max-w-[200px] sm:max-w-[280px] group"
                title="Select delivery location"
              >
                <div className="h-6 w-6 rounded-full bg-red-50 text-[#E31E24] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <MapPin className="h-3.5 w-3.5" />
                </div>
                <div className="text-left min-w-0 flex-1">
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider leading-none">Delivering to</p>
                  <p className="text-xs font-bold text-gray-900 truncate leading-tight mt-0.5">{userLocation?.name || "Select delivery location"}</p>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-gray-400 group-hover:text-gray-700 shrink-0" />
              </button>
            </div>

            {/* Center: Command Search Bar (Spotlight Glass) */}
            <div className="flex-1 max-w-md hidden md:block">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-full bg-white/70 hover:bg-white active:bg-white/95 backdrop-blur-md border border-black/[0.08] hover:border-black/[0.16] shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.9),0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[inset_0_1px_1px_0_rgba(255,255,255,1),0_4px_16px_rgba(0,0,0,0.06)] active:scale-[0.99] text-sm text-gray-700 transition-all duration-200 group cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  <Search className="h-4 w-4 text-gray-400 group-hover:text-[#E31E24] group-hover:scale-110 transition-all duration-200" />
                  <span className="text-xs text-gray-500 group-hover:text-gray-800 transition-colors font-medium">Search EV batteries, chargers, fitments...</span>
                </span>
                <kbd className="hidden lg:inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-mono font-semibold text-gray-500 group-hover:text-gray-700 bg-white/80 border border-black/[0.08] rounded-md shadow-2xs backdrop-blur-xs transition-colors">
                  ⌘K
                </kbd>
              </button>
            </div>

            {/* Right: Actions, Search by VIN, Notifications, Wishlist, Cart, Avatar */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
              {/* Search by VIN Button */}
              <button
                onClick={() => setIsVinSearchOpen(true)}
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full border border-emerald-500/25 hover:border-emerald-500/40 bg-emerald-500/[0.08] hover:bg-emerald-500/[0.15] active:bg-emerald-500/[0.22] text-xs font-bold text-emerald-800 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.7),0_2px_8px_rgba(16,185,129,0.06)] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_4px_14px_rgba(16,185,129,0.12)] backdrop-blur-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 group cursor-pointer shrink-0"
                title="Search items based on 17-digit VIN number"
              >
                <ScanLine className="h-3.5 w-3.5 text-emerald-600 group-hover:rotate-12 transition-transform duration-200" />
                <span className="hidden sm:inline">Search by VIN</span>
                <span className="sm:hidden font-mono text-[10.5px]">VIN</span>
              </button>

              {/* Mobile Search trigger */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="md:hidden h-9 w-9 sm:h-10 sm:w-10 grid place-items-center rounded-full bg-white/70 hover:bg-white active:bg-white/95 backdrop-blur-md border border-black/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_2px_8px_rgba(0,0,0,0.03)] text-gray-700 active:scale-95 transition-all duration-200 cursor-pointer shrink-0"
                aria-label="Search products"
              >
                <Search className="h-4 w-4" />
              </button>

              {/* Centralized In-Dashboard Notification Bell */}
              <DashboardNotificationBell role="customer" userId={authUser?.id} />

              {/* Wishlist Symbol to Check Wishlisted Items */}
              <button
                type="button"
                onClick={() => onTabChange("saved")}
                className="relative h-9 w-9 sm:h-10 sm:w-10 grid place-items-center rounded-full bg-white/70 hover:bg-white active:bg-white/95 backdrop-blur-md border border-black/[0.08] hover:border-black/[0.16] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_14px_rgba(0,0,0,0.08)] hover:scale-105 active:scale-95 transition-all duration-200 text-gray-600 hover:text-[#E31E24] cursor-pointer group shrink-0"
                aria-label="Wishlist"
                title="View Saved / Wishlisted Items"
              >
                <Heart className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-gray-700 group-hover:text-[#E31E24] transition-colors" />
                {savedProductIds.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 grid h-4.5 min-w-4.5 px-1 place-items-center rounded-full bg-gradient-to-r from-[#E31E24] to-rose-500 text-[9.5px] font-extrabold text-white shadow-[0_2px_6px_rgba(227,30,36,0.4)] ring-2 ring-white">
                    {savedProductIds.length}
                  </span>
                )}
              </button>


              {/* Cart Button to Open Cart Drawer */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="relative h-9 w-9 sm:h-10 sm:w-10 grid place-items-center rounded-full bg-white/70 hover:bg-white active:bg-white/95 backdrop-blur-md border border-black/[0.08] hover:border-black/[0.16] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_14px_rgba(0,0,0,0.08)] hover:scale-105 active:scale-95 transition-all duration-200 text-gray-600 hover:text-gray-950 cursor-pointer group shrink-0"
                aria-label="Shopping Cart"
                title="Open Shopping Cart"
              >
                <ShoppingCart className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-gray-700 group-hover:-translate-y-0.5 transition-transform duration-200" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 grid h-4.5 min-w-4.5 px-1 place-items-center rounded-full bg-gradient-to-r from-[#E31E24] to-rose-500 text-[9.5px] font-extrabold text-white shadow-[0_2px_6px_rgba(227,30,36,0.4)] ring-2 ring-white">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Profile Button on Right Top */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="relative flex items-center gap-1.5 sm:gap-2.5 p-1 pl-1 pr-2 sm:pr-3.5 rounded-full bg-white/70 hover:bg-white active:bg-white/95 backdrop-blur-md border border-black/[0.08] hover:border-black/[0.16] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,1),0_4px_16px_rgba(0,0,0,0.08)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer group shrink-0"
                  aria-label="Profile and account menu"
                  title="Profile & Account Menu"
                >
                  <span className="grid h-7 w-7 sm:h-8 sm:w-8 place-items-center rounded-full bg-gradient-to-tr from-[#E31E24] via-rose-500 to-red-600 text-white font-extrabold text-xs shadow-xs ring-2 ring-white">
                    {userInitials}
                  </span>
                  <span className="hidden sm:inline-block text-xs font-bold text-gray-800 group-hover:text-gray-950 max-w-[90px] truncate transition-colors">
                    {(userProfile.name || authUser?.name || "User").split(" ")[0]}
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
                          {userInitials}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-gray-950 truncate">{userProfile.name || authUser?.name || "User"}</p>
                          <p className="text-[11px] text-gray-500 truncate">{userProfile.email || authUser?.email || "No email"}</p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#E31E24]" />
                            <span className="text-[10px] font-semibold text-[#E31E24]">Member · {userProfile.points || 0} pts</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        {/* 1. MY ORDERS (Requested) */}
                        <button
                          type="button"
                          onClick={() => {
                            setIsProfileOpen(false);
                            onTabChange("orders");
                          }}
                          className={cn(
                            "flex w-full items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer group",
                            activeTab === "orders"
                              ? "bg-[#E31E24]/10 text-[#E31E24]"
                              : "hover:bg-black/[0.04] text-gray-700 hover:text-gray-900"
                          )}
                        >
                          <span className="flex items-center gap-2.5">
                            <Package className="h-4 w-4 text-[#E31E24] group-hover:scale-110 transition-transform" />
                            <span>My Orders</span>
                          </span>
                          {activeOrdersCount > 0 ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E31E24] text-white shadow-2xs">
                              {activeOrdersCount} Active
                            </span>
                          ) : (
                            <span className="text-[10px] text-gray-400 font-normal">
                              {orders.length} Total
                            </span>
                          )}
                        </button>

                        {/* 2. Account & Profile Settings */}
                        <button
                          type="button"
                          onClick={() => {
                            setIsProfileOpen(false);
                            onTabChange("settings");
                          }}
                          className={cn(
                            "flex w-full items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer group",
                            activeTab === "settings"
                              ? "bg-[#E31E24]/10 text-[#E31E24]"
                              : "hover:bg-black/[0.04] text-gray-700 hover:text-gray-900"
                          )}
                        >
                          <span className="flex items-center gap-2.5">
                            <UserCog className="h-4 w-4 text-gray-500 group-hover:text-gray-900 group-hover:scale-110 transition-transform" />
                            <span>Profile & Settings</span>
                          </span>
                          <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
                        </button>

                        {/* 3. My Garage */}
                        <button
                          type="button"
                          onClick={() => {
                            setIsProfileOpen(false);
                            onTabChange("garage");
                          }}
                          className={cn(
                            "flex w-full items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer group",
                            activeTab === "garage"
                              ? "bg-[#E31E24]/10 text-[#E31E24]"
                              : "hover:bg-black/[0.04] text-gray-700 hover:text-gray-900"
                          )}
                        >
                          <span className="flex items-center gap-2.5">
                            <Bike className="h-4 w-4 text-gray-500 group-hover:text-gray-900 group-hover:scale-110 transition-transform" />
                            <span>My Garage</span>
                          </span>
                          <span className="text-[10px] text-gray-400 font-medium">{garage.length} EV</span>
                        </button>
                      </div>

                      <div className="my-2 border-t border-black/[0.06]" />

                      <button
                        type="button"
                        onClick={handleSignOut}
                        disabled={isSigningOut}
                        className="flex w-full items-center gap-2.5 p-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer group"
                      >
                        <LogOut className="h-4 w-4 text-rose-600 group-hover:-translate-x-0.5 transition-transform" />
                        <span>{isSigningOut ? "Signing out..." : "Sign Out"}</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </header>

          {/* Main Dashboard Body */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 md:pb-8">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-black/50 backdrop-blur-xs">
          <div className="w-72 bg-white h-full flex flex-col p-5 shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="relative flex items-center justify-center pb-4 border-b border-gray-100">
              <Logo className="justify-center" imgClassName="h-10 sm:h-11 w-auto" />
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

              <button
                type="button"
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="flex w-full items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
              >
                <LogOut className="h-4 w-4 text-rose-500" />
                <span>{isSigningOut ? "Signing out..." : "Sign Out"}</span>
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

      {/* Apple VisionOS Floating Glass Dock with Central AI Assistant Mic */}
      <nav className="fixed inset-x-4 bottom-4 z-40 mx-auto flex max-w-md items-center justify-around rounded-full vision-dock px-3 py-1.5 md:hidden">
        {/* Tab 1: Overview */}
        <button
          onClick={() => onTabChange("overview")}
          className={cn(
            "flex flex-1 flex-col items-center gap-0.5 py-1 text-[10px] font-semibold transition active:scale-95",
            activeTab === "overview" ? "text-[#E31E24] font-bold" : "text-[#6B7280] hover:text-[#111111]"
          )}
        >
          <LayoutGrid className={cn("h-5 w-5", activeTab === "overview" && "stroke-[2.5]")} />
          <span>Overview</span>
        </button>

        {/* Tab 2: Garage */}
        <button
          onClick={() => onTabChange("garage")}
          className={cn(
            "flex flex-1 flex-col items-center gap-0.5 py-1 text-[10px] font-semibold transition active:scale-95",
            activeTab === "garage" ? "text-[#E31E24] font-bold" : "text-[#6B7280] hover:text-[#111111]"
          )}
        >
          <Bike className={cn("h-5 w-5", activeTab === "garage" && "stroke-[2.5]")} />
          <span>Garage</span>
        </button>

        {/* CENTER ELEVATED AI ASSISTANT MIC ORB */}
        <Link
          to="/assistant"
          aria-label="Voice AI Assistant"
          className="relative -mt-6 flex flex-col items-center group px-1"
        >
          <span className="vision-mic-orb relative grid h-13 w-13 place-items-center rounded-full text-white cursor-pointer active:scale-90 shadow-xl">
            <span className="vision-mic-pulse animate-mic-pulse" />
            <Mic className="h-6 w-6 relative z-10 drop-shadow-sm" />
          </span>
          <span className="mt-1 text-[10px] font-bold tracking-tight text-[#E31E24]">
            Ask AI
          </span>
        </Link>

        {/* Tab 3: Orders */}
        <button
          onClick={() => onTabChange("orders")}
          className={cn(
            "flex flex-1 flex-col items-center gap-0.5 py-1 text-[10px] font-semibold transition active:scale-95",
            activeTab === "orders" ? "text-[#E31E24] font-bold" : "text-[#6B7280] hover:text-[#111111]"
          )}
        >
          <Package className={cn("h-5 w-5", activeTab === "orders" && "stroke-[2.5]")} />
          <span>Orders</span>
        </button>

        {/* Tab 4: Track Delivery */}
        <button
          onClick={() => onTabChange("tracking")}
          className={cn(
            "flex flex-1 flex-col items-center gap-0.5 py-1 text-[10px] font-semibold transition active:scale-95",
            activeTab === "tracking" ? "text-[#E31E24] font-bold" : "text-[#6B7280] hover:text-[#111111]"
          )}
        >
          <Truck className={cn("h-5 w-5", activeTab === "tracking" && "stroke-[2.5]")} />
          <span>Tracking</span>
        </button>
      </nav>

      {/* Global VIN Search Modal */}
      <VinSearchModal
        isOpen={isVinSearchOpen}
        onClose={() => setIsVinSearchOpen(false)}
      />

      {/* Global Cart Slide-Over Drawer */}
      <CartDrawer />

      {/* Floating AI Assistant Copilot Chatbot */}
      <AiChatbotWidget />

      {/* Global Location Picker Modal */}
      <LocationPickerModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />
    </div>
  );
}
