import { useState, useMemo } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
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
import { inr, products, type Product } from "@/lib/data";
import { cn } from "@/lib/utils";
import { VinSearchModal } from "./VinSearchModal";
import { CartDrawer } from "@/components/common/CartDrawer";
import { AiChatbotWidget } from "@/components/common/AiChatbotWidget";

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
    signOut,
  } = useStore();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isVinSearchOpen, setIsVinSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const userInitials = userProfile.name
    ? userProfile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "AS";

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

  const navigate = useNavigate();
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
        {/* Desktop Left Sidebar (Static Container Pinned to Viewport) */}
        <aside
          className={cn(
            "hidden md:flex flex-col bg-white/80 backdrop-blur-xl backdrop-saturate-150 border-r border-black/[0.06] shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-all duration-300 z-30 shrink-0 select-none sticky top-0 h-screen",
            isCollapsed ? "w-20" : "w-64"
          )}
        >
          {/* Logo & Header */}
          <div className="relative h-18 flex items-center justify-center px-4 border-b border-black/[0.06]">
            {!isCollapsed ? (
              <div className="flex items-center justify-center">
                <Logo className="justify-center" imgClassName="h-9 w-auto" />
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary text-white font-bold text-lg shadow-sm">
                  R
                </span>
              </div>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              className={cn(
                "hidden lg:grid h-7 w-7 place-items-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-black/[0.05] transition absolute top-1/2 -translate-y-1/2",
                isCollapsed ? "right-1.5" : "right-3"
              )}
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
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
                  <p className="text-[11px] text-gray-500 truncate flex items-center gap-1 mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
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

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Header (Apple Glassmorphic Theme) */}
          <header className="sticky top-0 z-20 h-18 bg-white/75 backdrop-blur-xl backdrop-saturate-150 border-b border-black/[0.06] px-4 md:px-8 flex items-center justify-between gap-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] transition-all">
            {/* Left: Mobile hamburger & breadcrumbs */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 rounded-xl text-gray-700 hover:bg-black/[0.05] active:scale-95 transition"
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="hidden sm:block min-w-0">
                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                  <span>Customer Portal</span>
                  <span>/</span>
                  <span className="text-gray-800 font-semibold truncate">{getBreadcrumbTitle()}</span>
                </div>
                <h1 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                  Welcome back, {userProfile.name.split(" ")[0]}
                </h1>
              </div>
            </div>

            {/* Center: Command Search Bar (Spotlight Glass) */}
            <div className="flex-1 max-w-md hidden md:block">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="w-full flex items-center justify-between px-4 py-2 rounded-full bg-black/[0.03] hover:bg-black/[0.06] active:scale-[0.99] text-sm text-gray-700 transition-all duration-200 shadow-2xs group border border-black/[0.06] hover:border-black/[0.12]"
              >
                <span className="flex items-center gap-2.5">
                  <Search className="h-4 w-4 text-gray-400 group-hover:text-[#E31E24] transition-colors" />
                  <span className="text-xs text-gray-500 font-normal">Search EV batteries, chargers, fitments...</span>
                </span>
                <kbd className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono text-gray-500 bg-white/80 border border-black/[0.08] rounded-md shadow-2xs">
                  ⌘K
                </kbd>
              </button>
            </div>

            {/* Right: Actions, Search by VIN, Notifications, Cart, Avatar */}
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              {/* Search by VIN Button */}
              <button
                onClick={() => setIsVinSearchOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/[0.08] hover:bg-emerald-500/[0.16] hover:border-emerald-500/40 text-xs font-semibold text-emerald-800 transition-all duration-200 active:scale-95 shadow-2xs"
                title="Search items based on 17-digit VIN number"
              >
                <ScanLine className="h-3.5 w-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Search by VIN</span>
                <span className="sm:hidden font-mono text-[11px]">VIN</span>
              </button>

              {/* Mobile Search trigger */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="md:hidden p-2 rounded-xl text-gray-700 hover:bg-black/[0.05] transition"
                aria-label="Search products"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Notifications Button on Top Right with Badge & Popover */}
              <div className="relative">
                <button
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className="relative p-2.5 rounded-full bg-black/[0.03] hover:bg-black/[0.07] text-gray-700 active:scale-90 transition-all duration-200"
                  aria-label="Notifications"
                  title="Notifications"
                >
                  <Bell className="h-4.5 w-4.5 text-gray-700" />
                  {unreadNotifsCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 grid h-4.5 min-w-4.5 px-1 place-items-center rounded-full bg-[#E31E24] text-[9.5px] font-bold text-white shadow-xs ring-2 ring-white">
                      {unreadNotifsCount}
                    </span>
                  )}
                </button>

                {isNotifOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl bg-white/90 backdrop-blur-2xl border border-black/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.12)] p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                      <div>
                        <p className="text-sm font-bold text-gray-900">Notifications</p>
                        <p className="text-xs text-gray-500">{unreadNotifsCount} unread alerts</p>
                      </div>
                      {unreadNotifsCount > 0 && (
                        <button
                          onClick={markAllNotificationsRead}
                          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                        >
                          <CheckCheck className="h-3.5 w-3.5" /> Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-gray-50 py-1">
                      {notifications.length === 0 ? (
                        <p className="py-6 text-center text-xs text-gray-500">No notifications yet.</p>
                      ) : (
                        notifications.slice(0, 5).map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => markNotificationRead(notif.id)}
                            className={cn(
                              "py-3 px-2 rounded-xl cursor-pointer transition flex items-start gap-3",
                              notif.read ? "opacity-75 hover:bg-gray-50" : "bg-emerald-50/50 hover:bg-emerald-50"
                            )}
                          >
                            <span
                              className={cn(
                                "h-2 w-2 rounded-full mt-1.5 shrink-0",
                                notif.read ? "bg-gray-300" : "bg-primary"
                              )}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-gray-900">{notif.title}</p>
                              <p className="text-xs text-gray-600 line-clamp-2 mt-0.5">{notif.message}</p>
                              <span className="text-[10px] text-gray-400 mt-1 inline-block">{notif.time}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="pt-2 border-t border-gray-100 text-center">
                      <button
                        onClick={() => {
                          setIsNotifOpen(false);
                          onTabChange("notifications");
                        }}
                        className="text-xs font-semibold text-primary hover:underline"
                      >
                        View all notifications →
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Cart Button to Open Cart Drawer */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 rounded-full bg-black/[0.03] hover:bg-black/[0.07] text-gray-700 active:scale-90 transition-all duration-200 cursor-pointer"
                aria-label="Shopping Cart"
                title="Open Shopping Cart"
              >
                <ShoppingCart className="h-4.5 w-4.5 text-gray-700" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 grid h-4.5 min-w-4.5 px-1 place-items-center rounded-full bg-[#E31E24] text-[9.5px] font-bold text-white shadow-xs ring-2 ring-white">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Profile Button on Right Top (Apple Glassmorphism with My Orders & Sign Out) */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="relative flex items-center gap-2 p-1 pl-1 pr-2 sm:pr-2.5 rounded-full bg-black/[0.03] hover:bg-black/[0.07] border border-black/[0.06] hover:border-black/[0.12] active:scale-95 transition-all duration-200 cursor-pointer shadow-2xs group"
                  aria-label="Profile and account menu"
                  title="Profile & Account Menu"
                >
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-tr from-[#E31E24] to-rose-500 text-white font-extrabold text-xs shadow-xs ring-1 ring-white">
                    {userInitials}
                  </span>
                  <span className="hidden sm:inline-block text-xs font-semibold text-gray-800 group-hover:text-gray-950 max-w-[85px] truncate">
                    {userProfile.name.split(" ")[0]}
                  </span>
                  <ChevronDown className={cn("h-3.5 w-3.5 text-gray-400 group-hover:text-gray-700 transition-transform duration-200", isProfileOpen && "rotate-180")} />
                </button>

                {isProfileOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsProfileOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-72 rounded-3xl bg-white/95 backdrop-blur-2xl border border-black/[0.08] shadow-[0_20px_60px_rgba(0,0,0,0.14)] p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                      {/* User Header Preview */}
                      <div className="p-3 rounded-2xl bg-black/[0.02] border border-black/[0.04] mb-2 flex items-center gap-3">
                        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-tr from-[#E31E24] to-rose-500 text-white font-extrabold text-sm shadow-xs ring-2 ring-white shrink-0">
                          {userInitials}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-gray-950 truncate">{userProfile.name}</p>
                          <p className="text-[11px] text-gray-500 truncate">{userProfile.email}</p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            <span className="text-[10px] font-semibold text-emerald-700">Gold Tier · {userProfile.points || 450} pts</span>
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

                      {/* 4. SIGN OUT (Requested) */}
                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileOpen(false);
                          signOut();
                          toast.success("Signed out successfully. See you soon!");
                          navigate({ to: "/" });
                        }}
                        className="flex w-full items-center gap-2.5 p-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer group"
                      >
                        <LogOut className="h-4 w-4 text-rose-600 group-hover:-translate-x-0.5 transition-transform" />
                        <span>Sign Out</span>
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
              <Logo className="justify-center" imgClassName="h-8.5 w-auto" />
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
    </div>
  );
}
