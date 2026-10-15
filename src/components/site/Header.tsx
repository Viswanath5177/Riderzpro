import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  ChevronDown,
  X,
  Package,
  Bike,
  LogOut,
  LayoutDashboard,
  Heart,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { Logo } from "./bits";
import { MegaMenu } from "./MegaMenu";
import { MobileDrawer } from "./MobileDrawer";
import { useStore } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { getProduct } from "@/lib/data";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { cart, userProfile, savedProductIds, userLocation, setIsLocationModalOpen, signOut: storeSignOut } = useStore();
  const { user, isAuthenticated, signOut, openCustomerLoginModal } = useAuth();
  const navigate = useNavigate();

  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const cartCount = cart
    .filter((item) => Boolean(getProduct(item.productId)))
    .reduce((acc, item) => acc + item.qty, 0);

  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchExpanded]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({ to: "/shop", search: { q: searchQuery.trim() } as any });
      setIsSearchExpanded(false);
    }
  };

  const handleSignOut = async () => {
    toast.info("Signing out...", { duration: 1500 });
    try {
      storeSignOut();
      await signOut();
    } catch {}
    try {
      localStorage.removeItem("riderzpro_auth_user");
      localStorage.removeItem("riderzpro_auth_token");
      localStorage.removeItem("riderzpro_token");
      localStorage.removeItem("riderzpro_admin_session");
      localStorage.removeItem("riderzpro-v7");
      sessionStorage.clear();
    } catch {}
    window.location.href = "/";
  };

  const handleProtectedNav = (e: React.MouseEvent, path: "/garage" | "/orders", label: string) => {
    if (!isAuthenticated) {
      e.preventDefault();
      openCustomerLoginModal({ redirectTo: path });
      toast.info(`Please sign in to access ${label}.`);
    }
  };

  const activeName = user?.name || userProfile?.name || "Customer";
  const initials = activeName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <header className="sticky top-0 z-40 h-[72px] border-b border-[#ececec] bg-white/95 backdrop-blur-md transition-shadow">
        <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: Brand Logo & Location Selector */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <button
              onClick={() => setIsMobileDrawerOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-[#111111] hover:bg-[#f7f7f8] lg:hidden cursor-pointer"
              aria-label="Open mobile menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Logo className="flex items-center" imgClassName="h-11 sm:h-12 md:h-13.5 w-auto" />

            {/* Location Selector Pill */}
            <button
              type="button"
              onClick={() => setIsLocationModalOpen(true)}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#ececec] bg-white hover:bg-gray-50 text-xs font-semibold text-gray-800 transition cursor-pointer max-w-[190px] shadow-2xs group"
              title="Select delivery location"
            >
              <MapPin className="h-3.5 w-3.5 text-[#e11d2a] shrink-0 group-hover:scale-110 transition-transform" />
              <div className="text-left min-w-0 flex-1 truncate">
                <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider block leading-none">Deliver to</span>
                <span className="text-gray-900 font-bold truncate block text-xs mt-0.5">{userLocation?.name?.split(":")[0] || userLocation?.name || "Select location"}</span>
              </div>
              <ChevronDown className="h-3 w-3 text-gray-400 shrink-0" />
            </button>
          </div>

          {/* Center: 5 Nav Links Only (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1">
            {/* 1. Shop (with Mega-Menu Trigger) */}
            <div
              className="relative"
              onMouseEnter={() => setIsMegaMenuOpen(true)}
            >
              <button
                onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
                className={`flex items-center gap-1 px-3.5 py-2 text-sm font-semibold rounded-xl transition cursor-pointer ${
                  isMegaMenuOpen
                    ? "text-[#e11d2a] bg-red-50/50"
                    : "text-[#111111] hover:text-[#e11d2a] hover:bg-[#f7f7f8]"
                }`}
              >
                <span>Shop</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    isMegaMenuOpen ? "rotate-180 text-[#e11d2a]" : "text-[#6b7280]"
                  }`}
                />
              </button>
            </div>

            {/* 2. My Garage */}
            <Link
              to={isAuthenticated ? "/garage" : "/"}
              search={!isAuthenticated ? { openLogin: "customer", redirect: "/garage" } : undefined}
              onClick={(e) => handleProtectedNav(e, "/garage", "My Garage")}
              className="px-3.5 py-2 text-sm font-semibold text-[#111111] hover:text-[#e11d2a] hover:bg-[#f7f7f8] rounded-xl transition cursor-pointer"
              activeProps={{ className: "!text-[#e11d2a] !bg-red-50/50" }}
            >
              My Garage
            </Link>

            {/* 3. Orders */}
            <Link
              to={isAuthenticated ? "/orders" : "/"}
              search={!isAuthenticated ? { openLogin: "customer", redirect: "/orders" } : undefined}
              onClick={(e) => handleProtectedNav(e, "/orders", "your Orders")}
              className="px-3.5 py-2 text-sm font-semibold text-[#111111] hover:text-[#e11d2a] hover:bg-[#f7f7f8] rounded-xl transition cursor-pointer"
              activeProps={{ className: "!text-[#e11d2a] !bg-red-50/50" }}
            >
              Orders
            </Link>

            {/* 4. Offers */}
            <Link
              to="/offers"
              className="px-3.5 py-2 text-sm font-semibold text-[#111111] hover:text-[#e11d2a] hover:bg-[#f7f7f8] rounded-xl transition"
              activeProps={{ className: "!text-[#e11d2a] !bg-red-50/50" }}
            >
              Offers
            </Link>

            {/* 5. Help */}
            <Link
              to="/assistant"
              className="px-3.5 py-2 text-sm font-semibold text-[#111111] hover:text-[#e11d2a] hover:bg-[#f7f7f8] rounded-xl transition"
              activeProps={{ className: "!text-[#e11d2a] !bg-red-50/50" }}
            >
              Help
            </Link>
          </nav>

          {/* Right: Search, Cart, Sign in */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Icon / Expandable Overlay */}
            <div className="relative">
              {isSearchExpanded ? (
                <form
                  onSubmit={handleSearchSubmit}
                  className="flex items-center gap-1.5 animate-in fade-in zoom-in-95 duration-150"
                >
                  <div className="relative flex items-center">
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search parts, batteries..."
                      className="h-10 w-48 sm:w-64 rounded-xl border border-[#ececec] bg-[#f7f7f8] pl-9 pr-3 text-xs font-medium text-[#111111] placeholder:text-[#6b7280] focus:border-[#e11d2a] focus:bg-white focus:outline-none"
                    />
                    <Search className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-[#6b7280]" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsSearchExpanded(false)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-[#6b7280] hover:bg-[#f7f7f8] hover:text-[#111111] transition cursor-pointer"
                    aria-label="Close search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setIsSearchExpanded(true)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-[#111111] hover:bg-[#f7f7f8] transition cursor-pointer"
                  aria-label="Search"
                >
                  <Search className="h-4.5 w-4.5" />
                </button>
              )}
            </div>

            {/* Wishlist Icon with Count Badge */}
            <Link
              to="/dashboard/customer"
              search={{ tab: "saved" } as any}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl text-[#111111] hover:bg-[#f7f7f8] hover:text-[#e11d2a] transition cursor-pointer"
              aria-label="View Wishlist"
              title="View Wishlist"
            >
              <Heart className="h-4.5 w-4.5" />
              {savedProductIds.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-[#e11d2a] px-1 text-[10px] font-bold text-white leading-none shadow-xs">
                  {savedProductIds.length}
                </span>
              )}
            </Link>

            {/* Cart Icon with Count Badge */}
            <Link
              to="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl text-[#111111] hover:bg-[#f7f7f8] transition"
              aria-label="View Cart"
            >
              <ShoppingCart className="h-4.5 w-4.5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-[#e11d2a] px-1 text-[10px] font-bold text-white leading-none shadow-xs">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Sign in Button or User Profile Dropdown */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-xl border border-[#ececec] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#111111] hover:border-gray-300 transition cursor-pointer">
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-100 font-bold text-emerald-800 text-[10px]">
                      {initials}
                    </div>
                    <span className="hidden sm:inline max-w-[90px] truncate">
                      {activeName.split(" ")[0]}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 rounded-2xl p-1.5 shadow-xl border border-[#ececec] bg-white z-50"
                >
                  <div className="px-3 py-2 border-b border-[#ececec] mb-1">
                    <p className="text-xs font-bold text-[#111111] truncate">{activeName}</p>
                    <p className="text-[11px] text-[#6b7280] truncate">
                      {user?.email || user?.phone || userProfile?.email}
                    </p>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link
                      to={user?.role === "seller" || userProfile?.role === "seller" ? "/dashboard/vendor" : "/dashboard/customer"}
                      className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium cursor-pointer hover:bg-[#f7f7f8] text-[#111111]"
                    >
                      <LayoutDashboard className="h-4 w-4 text-emerald-600" />
                      <span>{user?.role === "seller" || userProfile?.role === "seller" ? "Vendor Dashboard" : "Customer Dashboard"}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/garage"
                      className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium cursor-pointer hover:bg-[#f7f7f8] text-[#111111]"
                    >
                      <Bike className="h-4 w-4 text-emerald-600" />
                      <span>My Garage</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/orders"
                      className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium cursor-pointer hover:bg-[#f7f7f8] text-[#111111]"
                    >
                      <Package className="h-4 w-4 text-[#e11d2a]" />
                      <span>My Orders</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-1 bg-[#ececec]" />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <button
                type="button"
                onClick={() => openCustomerLoginModal()}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#e11d2a] hover:bg-[#c91823] px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-xs transition active:scale-95 cursor-pointer"
              >
                <User className="h-3.5 w-3.5" />
                <span>Sign in</span>
              </button>
            )}
          </div>
        </div>

        {/* MegaMenu Dropdown */}
        <MegaMenu
          isOpen={isMegaMenuOpen}
          onClose={() => setIsMegaMenuOpen(false)}
        />
      </header>

      {/* Mobile Full-Screen Navigation Drawer */}
      <MobileDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        isAuthenticated={isAuthenticated}
        activeName={activeName}
        onSignOut={handleSignOut}
      />
    </>
  );
}
