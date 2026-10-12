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
  ArrowLeft,
  Sparkles,
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
} from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/site/bits";
import { useStore } from "@/lib/store";
import { bikes, getBike, inr, products, type Product } from "@/lib/data";
import { cn } from "@/lib/utils";

export type CustomerTab =
  | "overview"
  | "garage"
  | "orders"
  | "saved"
  | "service"
  | "offers"
  | "invoices"
  | "notifications"
  | "settings"
  | "support";

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
    activeBikeId,
    setActiveBikeId,
    orders,
    savedProductIds,
    serviceBookings,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    cart,
  } = useStore();
  const { user: authUser, signOut } = useAuth();
  const navigate = useNavigate();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const activeBike = garage.find((b) => b.bikeId === activeBikeId) || garage[0];
  const activeBikeMeta = activeBike ? getBike(activeBike.bikeId) : null;

  const activeOrdersCount = orders.filter((o) => o.status < 5).length;
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

  const navItems = [
    {
      id: "overview" as CustomerTab,
      label: "Overview",
      Icon: LayoutGrid,
    },
    {
      id: "garage" as CustomerTab,
      label: "My Garage",
      Icon: Bike,
      badge: `${garage.length}`,
    },
    {
      id: "shop-link",
      label: "Shop Parts",
      Icon: ShoppingBag,
      isExternal: true,
      href: "/shop",
    },
    {
      id: "orders" as CustomerTab,
      label: "Orders & Tracking",
      Icon: Package,
      badge: activeOrdersCount > 0 ? `${activeOrdersCount} Live` : undefined,
      badgeColor: "bg-primary text-white",
    },
    {
      id: "saved" as CustomerTab,
      label: "Saved Items",
      Icon: Heart,
      badge: savedProductIds.length > 0 ? `${savedProductIds.length}` : undefined,
    },
    {
      id: "service" as CustomerTab,
      label: "Service & Maintenance",
      Icon: Wrench,
      badge: upcomingServicesCount > 0 ? `${upcomingServicesCount} Due` : undefined,
      badgeColor: "bg-emerald-600 text-white",
    },
    {
      id: "offers" as CustomerTab,
      label: "Offers & Rewards",
      Icon: Tag,
      badge: "2 New",
      badgeColor: "bg-amber-500 text-white",
    },
    {
      id: "invoices" as CustomerTab,
      label: "Payments & Invoices",
      Icon: Receipt,
    },
    {
      id: "notifications" as CustomerTab,
      label: "Notifications",
      Icon: Bell,
      badge: unreadNotifsCount > 0 ? `${unreadNotifsCount}` : undefined,
      badgeColor: "bg-rose-500 text-white",
    },
    {
      id: "settings" as CustomerTab,
      label: "Profile & Settings",
      Icon: UserCog,
    },
    {
      id: "support" as CustomerTab,
      label: "Help & Support",
      Icon: LifeBuoy,
    },
  ];

  const handleNavClick = (item: (typeof navItems)[number]) => {
    if (item.isExternal) return;
    onTabChange(item.id as CustomerTab);
    setIsMobileMenuOpen(false);
  };

  const getBreadcrumbTitle = () => {
    switch (activeTab) {
      case "overview":
        return "Dashboard Overview";
      case "garage":
        return "My Registered EV Garage";
      case "orders":
        return "Order History & Live Tracking";
      case "saved":
        return "Saved Parts & Wishlist";
      case "service":
        return "Service, Maintenance & Reminders";
      case "offers":
        return "Exclusive Offers & ProPoints";
      case "invoices":
        return "Payments, Tax Invoices & Receipts";
      case "notifications":
        return "Notifications & Alerts";
      case "settings":
        return "Account & Vehicle Preferences";
      case "support":
        return "24/7 Roadside & Helpline Support";
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

      {/* Main Container */}
      <div className="flex flex-1 min-h-screen">
        {/* Desktop Left Sidebar */}
        <aside
          className={cn(
            "hidden md:flex flex-col bg-white border-r border-[#E5E7EB] transition-all duration-300 z-30 shrink-0 select-none",
            isCollapsed ? "w-20" : "w-64"
          )}
        >
          {/* Logo & Header */}
          <div className="h-18 flex items-center justify-between px-5 border-b border-[#E5E7EB]/80">
            {!isCollapsed ? (
              <div className="flex items-center gap-2.5">
                <Logo />
              </div>
            ) : (
              <div className="mx-auto">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary text-white font-bold text-lg shadow-sm">
                  R
                </span>
              </div>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="hidden lg:grid h-7 w-7 place-items-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          </div>

          {/* Active Bike Pill in Sidebar */}
          {!isCollapsed && activeBikeMeta && (
            <div className="mx-4 mt-4 p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary/10 text-primary shrink-0">
                  <Bike className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-900 truncate">
                    {activeBikeMeta.make} {activeBikeMeta.model}
                  </p>
                  <p className="text-[11px] text-emerald-700 font-medium">Primary EV</p>
                </div>
              </div>
              <button
                onClick={() => onTabChange("garage")}
                className="text-[11px] font-semibold text-primary hover:underline shrink-0"
              >
                Switch
              </button>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              if (item.isExternal) {
                return (
                  <Link
                    key={item.id}
                    to={item.href!}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition text-gray-600 hover:bg-gray-100 hover:text-gray-900 group",
                      isCollapsed && "justify-center px-0"
                    )}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <item.Icon className="h-4 w-4 text-gray-500 group-hover:text-primary transition shrink-0" />
                    {!isCollapsed && (
                      <span className="flex-1 flex items-center justify-between">
                        <span>{item.label}</span>
                        <ExternalLink className="h-3 w-3 text-gray-400" />
                      </span>
                    )}
                  </Link>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition group relative",
                    isActive
                      ? "bg-primary text-white shadow-sm font-semibold"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                    isCollapsed && "justify-center px-0"
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  <item.Icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition",
                      isActive ? "text-white" : "text-gray-500 group-hover:text-gray-900"
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
                              ? "bg-white/20 text-white"
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
          {/* Top Header */}
          <header className="sticky top-0 z-20 h-18 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] px-4 md:px-8 flex items-center justify-between gap-4">
            {/* Left: Mobile hamburger & breadcrumbs */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100"
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
                  Welcome back, {userProfile.name.split(" ")[0]}
                </h1>
              </div>
            </div>

            {/* Center: Command Search Bar */}
            <div className="flex-1 max-w-md hidden md:block">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="w-full flex items-center justify-between px-3.5 py-2 rounded-2xl border border-gray-200 bg-[#F7F9FB] hover:bg-white hover:border-primary/40 text-sm text-gray-500 transition shadow-2xs group"
              >
                <span className="flex items-center gap-2.5">
                  <Search className="h-4 w-4 text-gray-400 group-hover:text-primary transition" />
                  <span className="text-xs text-gray-500 font-medium">Search EV batteries, chargers, fitments...</span>
                </span>
                <kbd className="hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono text-gray-400 bg-white border border-gray-200 rounded-md">
                  ⌘K
                </kbd>
              </button>
            </div>

            {/* Right: Actions, AI Assistant, Notifications, Avatar */}
            <div className="flex items-center gap-2.5 shrink-0">
              {/* Mobile Search trigger */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="md:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100"
                aria-label="Search products"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* AI Assistant Button */}
              <Link
                to="/assistant"
                className="group flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary backdrop-blur-xl shadow-2xs transition-all hover:bg-primary hover:text-white hover:shadow-glow active:scale-95"
              >
                <Sparkles className="h-3.5 w-3.5 text-primary transition group-hover:rotate-12 group-hover:text-white" />
                <span className="hidden sm:inline">AI Assistant</span>
                <span className="sm:hidden">AI</span>
              </Link>

              {/* Notifications Bell with Popover */}
              <div className="relative">
                <button
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className="relative p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  {unreadNotifsCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 grid h-4 w-4 place-items-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-2 ring-white">
                      {unreadNotifsCount}
                    </span>
                  )}
                </button>

                {isNotifOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl bg-white border border-gray-200 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
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

              {/* Profile Avatar & Account Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 transition cursor-pointer"
                  aria-label="Account menu"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-white font-bold text-xs shadow-xs">
                    {(authUser?.name || userProfile.name)
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </span>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-3xl bg-white border border-gray-200 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-2.5 border-b border-gray-100">
                      <p className="text-sm font-bold text-gray-900 truncate">{authUser?.name || userProfile.name}</p>
                      <p className="text-xs text-gray-500 truncate">{authUser?.email || userProfile.email}</p>
                      <div className="mt-2 flex items-center justify-between text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                        <span>ProPoints Loyalty</span>
                        <span className="font-bold">{userProfile.points} pts</span>
                      </div>
                    </div>
                    <div className="py-1 space-y-0.5">
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          onTabChange("garage");
                        }}
                        className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition cursor-pointer"
                      >
                        <Bike className="h-4 w-4 text-gray-400" />
                        <span>Manage My Garage</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          onTabChange("orders");
                        }}
                        className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition cursor-pointer"
                      >
                        <Package className="h-4 w-4 text-gray-400" />
                        <span>My Orders</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          onTabChange("settings");
                        }}
                        className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition cursor-pointer"
                      >
                        <UserCog className="h-4 w-4 text-gray-400" />
                        <span>Profile & Settings</span>
                      </button>
                    </div>
                    <div className="pt-1 border-t border-gray-100">
                      <button
                        onClick={async () => {
                          setIsProfileOpen(false);
                          await signOut();
                          toast.success("Signed out successfully", {
                            description: "You have been logged out of your customer account.",
                          });
                          navigate({ to: "/" });
                        }}
                        className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
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
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <Logo />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-4 space-y-1">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                if (item.isExternal) {
                  return (
                    <Link
                      key={item.id}
                      to={item.href!}
                      className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
                    >
                      <span className="flex items-center gap-3">
                        <item.Icon className="h-4 w-4 text-gray-400" />
                        <span>{item.label}</span>
                      </span>
                      <ExternalLink className="h-3 w-3 text-gray-400" />
                    </Link>
                  );
                }
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition",
                      isActive
                        ? "bg-primary text-white font-semibold"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <item.Icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </span>
                    {item.badge && (
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-bold",
                          isActive ? "bg-white/20 text-white" : item.badgeColor || "bg-gray-100 text-gray-700"
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

      {/* Mobile Compact Bottom Navigation */}
      <nav className="fixed inset-x-3 bottom-3 z-40 flex justify-around rounded-3xl border border-gray-200/90 bg-white/95 backdrop-blur-xl px-2 py-2 shadow-xl md:hidden">
        {[
          { id: "overview" as CustomerTab, label: "Overview", Icon: LayoutGrid },
          { id: "garage" as CustomerTab, label: "Garage", Icon: Bike },
          { id: "orders" as CustomerTab, label: "Orders", Icon: Package },
          { id: "service" as CustomerTab, label: "Service", Icon: Wrench },
        ].map((s) => (
          <button
            key={s.id}
            onClick={() => onTabChange(s.id)}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 py-1 text-[11px] font-semibold transition",
              activeTab === s.id ? "text-primary" : "text-gray-500 hover:text-gray-900"
            )}
          >
            <s.Icon className={cn("h-5 w-5", activeTab === s.id && "stroke-[2.5]")} />
            <span>{s.label}</span>
          </button>
        ))}
        <Link
          to="/assistant"
          className="flex flex-1 flex-col items-center gap-1 py-1 text-[11px] font-semibold text-primary"
        >
          <Sparkles className="h-5 w-5" />
          <span>AI Volt</span>
        </Link>
      </nav>
    </div>
  );
}
