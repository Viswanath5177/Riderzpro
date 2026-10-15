import { Link, useNavigate } from "@tanstack/react-router";
import {
  ShoppingCart,
  User,
  LayoutDashboard,
  Search,
  Menu,
  X,
  Car,
  LogOut,
  Lock,
  ChevronDown,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { getCurrentRole, signOut as endServerSession, useAuth } from "@/lib/auth";
import { getProduct } from "@/lib/data";
import { Logo } from "./bits";

export interface NavCategory {
  label: string;
  to: string;
  search?: string;
  isOffers?: boolean;
}

export const STORE_CATEGORIES: NavCategory[] = [
  { label: "Home", to: "/" },
  { label: "Car Accessories", to: "/shop", search: "Car Accessories" },
  { label: "Bike Accessories", to: "/shop", search: "Bike Accessories" },
  { label: "Electric Bikes", to: "/shop", search: "Electric Bikes" },
  { label: "Riding Gear & Helmets", to: "/shop", search: "Riding Gear & Helmets" },
  { label: "Spare Parts", to: "/shop", search: "Spare Parts" },
  { label: "Batteries & Chargers", to: "/shop", search: "Battery" },
  { label: "Offers", to: "/dashboard/customer", isOffers: true },
];

/**
 * Navbar Container Component
 * Static header container with search, category navigation, authentication and shopping cart.
 * Contains no hardcoded or mock default details.
 */
export function Navbar() {
  const { cart, userProfile, isLoggedIn, signOut, signIn, setRole, role } = useStore();
  const navigate = useNavigate();
  const { user, openCustomerLoginModal } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  useEffect(() => {
    let active = true;
    getCurrentRole().then((role) => {
      if (!active) return;
      if (role) { setRole(role as any); signIn(); }
      else signOut();
    }).catch(() => { if (active) signOut(); });
    return () => { active = false; };
  }, [setRole, signIn, signOut]);

  const cartCount = cart
    .filter((c) => Boolean(getProduct(c.productId)))
    .reduce((s, c) => s + c.qty, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({ to: "/shop", search: { q: searchQuery.trim() } as any });
    } else {
      navigate({ to: "/shop" });
    }
  };

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      openCustomerLoginModal({ redirectTo: "/dashboard/customer?tab=orders" });
    } else {
      navigate({ to: "/dashboard/customer", search: { tab: "orders" } as any });
    }
  };

  const handleCarClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      openCustomerLoginModal({ redirectTo: "/dashboard/customer?tab=garage" });
    } else {
      navigate({ to: "/dashboard/customer", search: { tab: "garage" } as any });
    }
  };

  const handleSignOut = async () => {
    await endServerSession();
    signOut();
    setIsAccountMenuOpen(false);
    toast.info("You have signed out successfully");
    navigate({ to: "/" });
  };

  const displayName = userProfile?.name?.trim()
    ? userProfile.name.trim().split(" ")[0]
    : "Account";

  return (
    <header className="static w-full bg-white border-b border-[#E5E7EB] z-30 select-none">
      {/* ─────────────────────────────────────────────────────────────
          ROW 1: Main Bar (Logo, Search, Car, Cart, Auth / Profile)
         ───────────────────────────────────────────────────────────── */}
      <div className="mx-auto flex h-18 sm:h-20 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        {/* Mobile menu hamburger toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-xl text-gray-700 bg-white/70 hover:bg-white border border-black/[0.06] shadow-2xs active:scale-95 transition lg:hidden"
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* RiderzPro Official Logo */}
        <div className="shrink-0 flex items-center py-1">
          <Logo imgClassName="h-12 sm:h-13 md:h-14 w-auto" />
        </div>

        {/* Product Search Bar (Desktop / Tablet) */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden sm:flex flex-1 max-w-xl mx-3 items-center relative"
        >
          <div className="relative w-full flex items-center rounded-full border border-black/[0.08] hover:border-black/[0.15] bg-white/70 hover:bg-white/90 backdrop-blur-md shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.9),0_2px_8px_rgba(0,0,0,0.03)] transition-all focus-within:border-[#E31E24] focus-within:ring-2 focus-within:ring-[#E31E24]/20 focus-within:bg-white">
            <Search className="ml-4 h-4 w-4 text-[#6B7280] shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search car & bike accessories, electric bikes, batteries, spare parts..."
              className="w-full bg-transparent py-2.5 pl-2.5 pr-24 text-xs sm:text-sm text-[#111111] placeholder:text-[#6B7280] focus:outline-none"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-[#E31E24] px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700 active:scale-95 shadow-xs cursor-pointer"
            >
              Search
            </button>
          </div>
        </form>

        {/* Right Controls: My Car, Cart & Sign In / Account */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* My Car / Vehicle (Requires login) */}
          <button
            onClick={handleCarClick}
            id="navbar-car-btn"
            aria-label="My Car and Vehicle Garage"
            className="relative flex items-center gap-1.5 rounded-full border border-black/[0.08] hover:border-black/[0.15] bg-white/70 hover:bg-white active:bg-white/95 backdrop-blur-md px-3.5 py-2 text-xs font-semibold text-[#111111] transition shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_2px_8px_rgba(0,0,0,0.03)] hover:text-[#E31E24] active:scale-95 cursor-pointer"
            title={isLoggedIn ? "Open Registered Vehicle Garage" : "Sign In to Access Your Car"}
          >
            <Car className="h-4 w-4 text-[#E31E24]" />
            <span className="hidden sm:inline">My Car</span>
            {!isLoggedIn && <Lock className="h-3 w-3 text-gray-400 ml-0.5" />}
          </button>

          {/* Cart Button (Requires login to open) */}
          <button
            onClick={handleCartClick}
            id="navbar-cart-btn"
            aria-label="Shopping Cart"
            className="relative flex items-center gap-1.5 rounded-full border border-black/[0.08] hover:border-black/[0.15] bg-white/70 hover:bg-white active:bg-white/95 backdrop-blur-md px-3.5 py-2 text-xs font-semibold text-[#111111] transition shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_2px_8px_rgba(0,0,0,0.03)] hover:text-[#E31E24] active:scale-95 cursor-pointer"
          >
            <ShoppingCart className="h-4 w-4 text-gray-700" />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="grid h-4.5 min-w-4.5 place-items-center rounded-full bg-[#E31E24] px-1 text-[10px] font-bold text-white leading-none shadow-xs">
                {cartCount}
              </span>
            )}
          </button>

          {/* Authentication: Sign In button OR Account Dropdown */}
          {!isLoggedIn ? (
            <button
              type="button"
              onClick={() => openCustomerLoginModal()}
              id="navbar-signin-btn"
              className="inline-flex items-center justify-center rounded-full bg-[#E31E24] px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-red-700 active:scale-95 cursor-pointer"
            >
              Sign In
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                className="flex items-center gap-2 rounded-full border border-black/[0.08] hover:border-black/[0.15] bg-white/70 hover:bg-white active:bg-white/95 backdrop-blur-md px-3.5 py-2 text-xs font-semibold text-[#111111] transition shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_2px_8px_rgba(0,0,0,0.03)] hover:text-[#E31E24] active:scale-95 cursor-pointer"
              >
                <User className="h-4 w-4 text-[#6B7280]" />
                <span className="hidden sm:inline">{displayName}</span>
                <ChevronDown className="h-3 w-3 text-gray-400" />
              </button>

              {isAccountMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-[#E5E7EB] shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="text-xs font-bold text-[#111111] truncate">
                      {userProfile?.name?.trim() || "Signed In User"}
                    </p>
                    {userProfile?.email?.trim() && (
                      <p className="text-[11px] text-gray-500 truncate">{userProfile.email}</p>
                    )}
                  </div>
                  <div className="py-1 space-y-0.5">
                    <Link
                      to={user?.role === "seller" || role === "seller" || userProfile?.role === "seller" ? "/dashboard/vendor" : "/dashboard/customer"}
                      onClick={() => setIsAccountMenuOpen(false)}
                      className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition"
                    >
                      <LayoutDashboard className="h-3.5 w-3.5 text-gray-500" />
                      <span>{user?.role === "seller" || role === "seller" || userProfile?.role === "seller" ? "Vendor Dashboard" : "Customer Dashboard"}</span>
                    </Link>
                    <button
                      onClick={(e) => {
                        setIsAccountMenuOpen(false);
                        handleCarClick(e);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition text-left"
                    >
                      <Car className="h-3.5 w-3.5 text-gray-500" />
                      <span>My Garage & Vehicle</span>
                    </button>
                    <Link
                      to="/dashboard/customer"
                      search={{ tab: "orders" } as any}
                      onClick={() => setIsAccountMenuOpen(false)}
                      className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition"
                    >
                      <ShoppingCart className="h-3.5 w-3.5 text-gray-500" />
                      <span>My Orders</span>
                    </Link>
                  </div>
                  <div className="pt-1 border-t border-gray-100">
                    <button
            onClick={() => void handleSignOut()}
                      className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <LogOut className="h-3.5 w-3.5 text-red-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Search Input (Visible only on small viewports) */}
      <div className="sm:hidden px-4 pb-3">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products & spares..."
            className="h-9 w-full rounded-lg border border-[#E5E7EB] bg-white pl-9 pr-20 text-xs text-[#111111] placeholder:text-[#6B7280] focus:border-[#E31E24] focus:outline-none"
          />
          <Search className="absolute left-3 h-3.5 w-3.5 text-[#6B7280]" />
          <button
            type="submit"
            className="absolute right-1 top-1/2 -translate-y-1/2 rounded bg-[#E31E24] px-2.5 py-1 text-[11px] font-semibold text-white"
          >
            Search
          </button>
        </form>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          ROW 2: Category Navigation Row (Static, Solid)
         ───────────────────────────────────────────────────────────── */}
      <div className="hidden lg:block border-t border-[#E5E7EB] bg-white">
        <div className="mx-auto flex h-10 max-w-7xl items-center px-4 sm:px-6">
          <nav className="flex items-center gap-7 text-xs">
            {STORE_CATEGORIES.map((cat) => (
              <Link
                key={cat.label}
                to={cat.to}
                search={cat.search ? ({ cat: cat.search } as any) : undefined}
                className="font-medium text-[#6B7280] hover:text-[#111111] transition-colors py-2 border-b-2 border-transparent"
                activeProps={{ className: "!text-[#E31E24] !font-semibold !border-[#E31E24]" }}
                activeOptions={{ exact: cat.to === "/" }}
              >
                {cat.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          MOBILE DRAWER NAVIGATION (Responsive Mobile Overlay)
         ───────────────────────────────────────────────────────────── */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-4/5 max-w-xs bg-white p-5 flex flex-col h-full shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
              <Logo imgClassName="h-9 sm:h-10 w-auto" />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-md text-gray-500 hover:text-gray-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="mt-4 text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
              Categories
            </p>
            <div className="mt-2 space-y-1 overflow-y-auto flex-1">
              {STORE_CATEGORIES.map((cat) => (
                <Link
                  key={cat.label}
                  to={cat.to}
                  search={cat.search ? ({ cat: cat.search } as any) : undefined}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 text-xs font-medium text-[#111111] hover:bg-red-50 hover:text-[#E31E24] transition"
                  activeProps={{ className: "!bg-red-50 !text-[#E31E24] !font-bold" }}
                  activeOptions={{ exact: cat.to === "/" }}
                >
                  {cat.label}
                </Link>
              ))}
            </div>

            <div className="pt-4 border-t border-[#E5E7EB] space-y-2.5">
              <button
                onClick={(e) => {
                  setIsMobileMenuOpen(false);
                  handleCarClick(e);
                }}
                className="flex items-center gap-2 text-xs font-semibold text-[#111111] hover:text-[#E31E24] w-full text-left"
              >
                <Car className="h-4 w-4 text-[#E31E24]" /> My Car & Garage
                {!isLoggedIn && <Lock className="h-3 w-3 text-gray-400 ml-1" />}
              </button>
              <button
                onClick={(e) => {
                  setIsMobileMenuOpen(false);
                  handleCartClick(e);
                }}
                className="flex items-center gap-2 text-xs font-semibold text-[#111111] hover:text-[#E31E24] w-full text-left"
              >
                <ShoppingCart className="h-4 w-4" /> View Cart ({cartCount})
              </button>
              {isLoggedIn && (
                <Link
                  to="/dashboard/customer"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-xs font-semibold text-[#111111] hover:text-[#E31E24]"
                >
                  <User className="h-4 w-4" /> Customer Dashboard
                </Link>
              )}
              {!isLoggedIn ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openCustomerLoginModal();
                  }}
                  className="flex items-center justify-center rounded-lg bg-[#E31E24] py-2.5 text-xs font-semibold text-white shadow-2xs mt-2 w-full cursor-pointer"
                >
                  Sign In to Account
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleSignOut();
                  }}
                  className="flex items-center gap-2 text-xs font-semibold text-red-600 hover:text-red-700 w-full text-left pt-2 border-t border-gray-100"
                >
                  <LogOut className="h-4 w-4 text-red-500" /> Sign Out
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
