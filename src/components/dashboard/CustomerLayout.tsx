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
  ArrowLeft,
  Sparkles,
  Mic,
  ChevronLeft,
  ChevronRight,
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
  ShoppingCart,
} from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/site/bits";
import { useStore } from "@/lib/store";
import { inr, products, type Product } from "@/lib/data";
import { cn } from "@/lib/utils";
import { VinSearchModal } from "./VinSearchModal";

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
    cart,
    signOut,
  } = useStore();
  const navigate = useNavigate();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isVinSearchOpen, setIsVinSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const cartCount = cart.reduce((s, c) => s + c.qty, 0);
  const liveOrder = orders.find((o) => o.status < 5);
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

  const navItems = [
    {
      id: "overview" as CustomerTab,
      label: "Overview",
      Icon: LayoutGrid,
    },
    {
      id: "shop" as CustomerTab,
      label: "Shop Bikes & Parts",
      Icon: ShoppingBag,
    },
    {
      id: "orders" as CustomerTab,
      label: "My Orders",
      Icon: Package,
      badge: orders.length > 0 ? `${orders.length}` : undefined,
    },
    {
      id: "tracking" as CustomerTab,
      label: "Track Delivery",
      Icon: Truck,
      badge: liveOrder ? "Live" : undefined,
      badgeColor: "bg-[#E31E24] text-white",
    },
    {
      id: "garage" as CustomerTab,
      label: "My Garage",
      Icon: Bike,
      badge: `${garage.length}`,
    },
    {
      id: "service" as CustomerTab,
      label: "Service & Maintenance",
      Icon: Wrench,
      badge: upcomingServicesCount > 0 ? `${upcomingServicesCount} Due` : undefined,
      badgeColor: "bg-blue-600 text-white",
    },
    {
      id: "invoices" as CustomerTab,
      label: "Payments & Invoices",
      Icon: Receipt,
    },
    {
      id: "settings" as CustomerTab,
      label: "Profile & Addresses",
      Icon: UserCog,
    },
    {
      id: "support" as CustomerTab,
      label: "Help & Support",
      Icon: LifeBuoy,
    },
  ];

  const handleNavClick = (tabId: CustomerTab) => {
    onTabChange(tabId);
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
      <div className="flex flex-1 min-h-screen bg-[#F5F6F8] relative overflow-hidden">
        {/* Desktop Left Sidebar */}
        <aside
          className={cn(
            "hidden md:flex flex-col bg-white border-r border-[#E5E7EB] shadow-xs transition-all duration-300 z-30 shrink-0 select-none",
            isCollapsed ? "w-20" : "w-64"
          )}
        >
          {/* Logo & Header */}
          <div className="relative h-18 flex items-center justify-center px-4 border-b border-[#E5E7EB]">
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
                "hidden lg:grid h-7 w-7 place-items-center rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition absolute top-1/2 -translate-y-1/2",
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
                  onClick={() => handleNavClick(item.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition group relative",
                    isActive
                      ? "bg-red-50 text-[#E31E24] font-bold border-l-4 border-[#E31E24] pl-2.5"
                      : "text-[#6B7280] hover:bg-gray-100 hover:text-[#111111]",
                    isCollapsed && "justify-center px-0"
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  <item.Icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition",
                      isActive ? "text-[#E31E24]" : "text-[#6B7280] group-hover:text-[#111111]"
                    )}
                  />
                  {!isCollapsed && (
                    <span className="flex-1 text-left flex items-center justify-between">
                      <span>{item.label}</span>
                      {item.badge && (
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-bold tracking-tight",
                            isActive
                              ? "bg-red-100 text-[#E31E24]"
                              : item.badgeColor || "bg-gray-100 text-gray-700"
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

          {/* Sidebar Footer */}
          <div className="p-3 border-t border-[#E5E7EB]/80 space-y-1">
            <Link
              to="/"
              className={cn(
                "flex items-center gap-2.5 rounded-2xl px-3 py-2.5 text-xs font-semibold text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition",
                isCollapsed && "justify-center px-0"
              )}
              title={isCollapsed ? "Back to store" : undefined}
            >
              <ArrowLeft className="h-4 w-4 shrink-0" />
              {!isCollapsed && <span>Back to store</span>}
            </Link>
          </div>
        </aside>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Header (Static - does not move up and down on scroll) */}
          <header className="h-18 bg-white border-b border-[#E5E7EB] px-4 md:px-8 flex items-center justify-between gap-4 shadow-xs z-20">
            {/* Left: Mobile hamburger & breadcrumbs */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 rounded-xl text-gray-700 hover:bg-gray-100 active:scale-95 transition"
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="hidden sm:block min-w-0">
                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                  <span>Customer Portal</span>
                  <span>/</span>
                  <span className="text-gray-900 font-semibold truncate">{getBreadcrumbTitle()}</span>
                </div>
                <h1 className="text-base font-bold text-gray-900 leading-tight">
                  Welcome back{userProfile?.name?.trim() ? `, ${userProfile.name.trim().split(" ")[0]}` : ""}
                </h1>
              </div>
            </div>

            {/* Center: Command Search Bar */}
            <div className="flex-1 max-w-md hidden md:block">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="w-full flex items-center justify-between px-4 py-2 rounded-full bg-[#F5F6F8] hover:bg-white text-sm text-gray-700 transition shadow-2xs group border border-[#E5E7EB] hover:border-gray-400"
              >
                <span className="flex items-center gap-2.5">
                  <Search className="h-4 w-4 text-gray-500 group-hover:text-primary transition" />
                  <span className="text-xs text-gray-600 font-medium">Search EV batteries, chargers, fitments...</span>
                </span>
                <kbd className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono text-gray-600 bg-white border border-[#E5E7EB] rounded-full shadow-2xs">
                  ⌘K
                </kbd>
              </button>
            </div>

            {/* Right: Actions, Search by VIN, AI Voice, Cart, Avatar */}
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              {/* Search by VIN Button in Navbar */}
              <button
                onClick={() => setIsVinSearchOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#E5E7EB] bg-white hover:border-[#E31E24] hover:text-[#E31E24] text-xs font-semibold text-[#111111] transition active:scale-95 shadow-2xs"
                title="Search items based on 17-digit VIN number"
              >
                <ScanLine className="h-3.5 w-3.5 text-primary" />
                <span className="hidden sm:inline">Search by VIN</span>
                <span className="sm:hidden font-mono text-[11px]">VIN</span>
              </button>

              {/* Mobile Search trigger */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="md:hidden p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition"
                aria-label="Search products"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* AI Assistant Button with Voice Mic */}
              <Link
                to="/assistant"
                className="group flex items-center gap-1.5 rounded-full border border-[#E5E7EB] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#111111] hover:border-[#E31E24] hover:text-[#E31E24] transition shadow-2xs active:scale-95"
              >
                <Mic className="h-3.5 w-3.5 text-primary transition group-hover:scale-110" />
                <span className="hidden sm:inline">AI Voice</span>
                <span className="sm:hidden font-bold">Ask AI</span>
              </Link>

              {/* Shopping Cart button on top right -> opens Orders & Delivery Tracking */}
              <button
                onClick={() => onTabChange("orders")}
                id="dashboard-header-cart-btn"
                aria-label="Shopping Cart and Orders"
                className={cn(
                  "relative flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition shadow-2xs active:scale-95 cursor-pointer",
                  activeTab === "orders"
                    ? "border-[#E31E24] bg-red-50 text-[#E31E24]"
                    : "border-[#E5E7EB] bg-white text-[#111111] hover:border-[#E31E24] hover:text-[#E31E24]"
                )}
                title="View Orders & Delivery Tracking"
              >
                <ShoppingCart className="h-3.5 w-3.5 text-[#E31E24]" />
                <span className="hidden sm:inline">Cart</span>
                {(orders.length > 0 || cartCount > 0) && (
                  <span className="grid h-4.5 min-w-4.5 place-items-center rounded-full bg-[#E31E24] px-1 text-[10px] font-bold text-white leading-none">
                    {orders.length || cartCount}
                  </span>
                )}
              </button>

              {/* Profile Avatar & Account Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 transition"
                  aria-label="Account menu"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-white font-bold text-xs shadow-xs">
                    {userProfile?.name?.trim()
                      ? userProfile.name
                          .trim()
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                      : "CP"}
                  </span>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-3xl bg-white border border-gray-200 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-2.5 border-b border-gray-100">
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {userProfile?.name?.trim() || "Customer Account"}
                      </p>
                      {userProfile?.email?.trim() && (
                        <p className="text-xs text-gray-500 truncate">{userProfile.email}</p>
                      )}
                      {(userProfile?.points || 0) > 0 && (
                        <div className="mt-2 flex items-center justify-between text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                          <span>ProPoints Loyalty</span>
                          <span className="font-bold">{userProfile.points} pts</span>
                        </div>
                      )}
                    </div>
                    <div className="py-1 space-y-0.5">
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          onTabChange("garage");
                        }}
                        className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition"
                      >
                        <Bike className="h-4 w-4 text-gray-400" />
                        <span>Manage My Garage</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          onTabChange("orders");
                        }}
                        className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition"
                      >
                        <Package className="h-4 w-4 text-gray-400" />
                        <span>My Orders</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          onTabChange("settings");
                        }}
                        className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition"
                      >
                        <UserCog className="h-4 w-4 text-gray-400" />
                        <span>Profile & Delivery Addresses</span>
                      </button>
                    </div>
                    <div className="pt-1 border-t border-gray-100">
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          signOut();
                          toast.info("Signed out successfully");
                          navigate({ to: "/" });
                        }}
                        className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition"
                      >
                        <LogOut className="h-4 w-4 text-rose-400" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </div>
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
                    onClick={() => handleNavClick(item.id)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition",
                      isActive
                        ? "bg-red-50 text-[#E31E24] font-semibold border-l-3 border-[#E31E24] pl-2.5"
                        : "text-[#6B7280] hover:bg-gray-50 hover:text-[#111111]"
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <item.Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-[#E31E24]" : "text-[#6B7280]")} />
                      <span>{item.label}</span>
                    </span>
                    {item.badge && (
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-bold",
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
            <div className="pt-4 border-t border-gray-100">
              <Link
                to="/"
                className="flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-primary transition"
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
    </div>
  );
}
