import { Link, useNavigate } from "@tanstack/react-router";
import {
  Home,
  Mic,
  Package,
  ShoppingBag,
  ShoppingCart,
  User,
  Sparkles,
  Search,
  ShieldCheck,
  Menu,
  X,
  PhoneCall,
  Tag,
  Wrench,
  Bike,
  LogOut,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { Logo } from "./bits";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface NavCategory {
  label: string;
  to: string;
  search?: string;
  isOffers?: boolean;
}

const storeCategories: NavCategory[] = [
  { label: "Home", to: "/" },
  { label: "Electric Bikes", to: "/shop", search: "Electric Bikes" },
  { label: "Car Accessories", to: "/shop", search: "Car Accessories" },
  { label: "Bike Accessories", to: "/shop", search: "Bike Accessories" },
  { label: "Spare Parts", to: "/shop", search: "Spare Parts" },
  { label: "Batteries & Chargers", to: "/shop", search: "Battery" },
  { label: "Offers", to: "/dashboard/customer", isOffers: true },
];

export function SiteLayout({ children }: { children: ReactNode; transparent?: boolean }) {
  const { cart, userProfile } = useStore();
  const { user, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({ to: "/shop", search: { q: searchQuery.trim() } as any });
    } else {
      navigate({ to: "/shop" });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully", {
      description: "You have been signed out from Riderzpro.",
    });
    navigate({ to: "/" });
  };

  const activeName = user?.name || userProfile?.name || "Customer";
  const initials = activeName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#F5F6F8] text-[#111111] pb-20 md:pb-0 font-sans">
      {/* ─────────────────────────────────────────────────────────────
          1. TOP UTILITY & ANNOUNCEMENT BAR
         ───────────────────────────────────────────────────────────── */}
      <div className="border-b border-[#E5E7EB] bg-white text-xs text-[#6B7280]">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium text-[#111111]">
              <span className="inline-block h-2 w-2 rounded-full bg-[#E31E24]" />
              Official RiderzPro Store
            </span>
            <span className="hidden sm:inline text-gray-300">|</span>
            <span className="hidden sm:inline">
              Genuine EV Batteries, Car & Bike Accessories, Chargers & Spares
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-1.5 hover:text-[#111111]">
              <PhoneCall className="h-3 w-3 text-[#E31E24]" />
              <span>Support: +91 98765 43210</span>
            </div>
            <span className="hidden md:inline text-gray-300">|</span>
            <Link
              to={isAuthenticated ? "/dashboard/customer" : "/auth"}
              search={!isAuthenticated ? { redirect: "/dashboard/customer" } : undefined}
              className="hover:text-[#E31E24] transition font-medium"
            >
              Track Order
            </Link>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. MAIN BRAND HEADER WITH LOGO, PROMINENT SEARCH & ACTIONS
         ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-[#E5E7EB] bg-white shadow-2xs">
        <div className="mx-auto flex h-18 max-w-7xl items-center gap-4 px-4 sm:px-6">
          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 rounded-lg text-gray-700 hover:bg-gray-100 lg:hidden cursor-pointer"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Official RiderzPro Logo Asset */}
          <div className="shrink-0 py-2">
            <Logo imgClassName="h-9 md:h-11" />
          </div>

          {/* Prominent Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden sm:flex flex-1 max-w-xl mx-auto items-center relative"
          >
            <div className="relative w-full flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search electric bikes, car accessories, 60V batteries, chargers, brake discs..."
                className="h-10.5 w-full rounded-lg border border-[#E5E7EB] bg-[#F5F6F8] pl-10 pr-24 text-sm text-[#111111] placeholder:text-[#6B7280] focus:border-[#E31E24] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#E31E24] transition"
              />
              <Search className="absolute left-3.5 h-4 w-4 text-[#6B7280]" />
              <button
                type="submit"
                className="absolute right-1 h-8.5 rounded-md bg-[#E31E24] px-3.5 text-xs font-semibold text-white transition hover:bg-red-700 cursor-pointer"
              >
                Search
              </button>
            </div>
          </form>

          {/* Right Header Controls */}
          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            {/* AI Assistant Button */}
            <Link
              to="/assistant"
              id="navbar-ai-assistant-btn"
              className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50/60 px-3 py-2 text-xs font-semibold text-[#E31E24] transition hover:bg-red-100 hover:border-red-300"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#E31E24]" />
              <span className="hidden sm:inline">AI Assistant</span>
            </Link>

            {/* Cart Button */}
            <Link
              to="/cart"
              id="navbar-cart-btn"
              aria-label="Cart"
              className="relative flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-xs font-semibold text-[#111111] transition hover:border-[#E31E24] hover:text-[#E31E24]"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="grid h-4.5 min-w-4.5 place-items-center rounded-full bg-[#E31E24] px-1 text-[10px] font-bold text-white leading-none">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Account Menu / Sign In CTA */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    id="navbar-user-menu-btn"
                    className="flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-xs font-semibold text-[#111111] transition hover:border-[#E31E24] cursor-pointer"
                  >
                    <div className="grid h-6 w-6 place-items-center rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                      {initials}
                    </div>
                    <span className="hidden md:inline max-w-[100px] truncate">
                      {activeName.split(" ")[0]}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 rounded-2xl p-1.5 shadow-xl border border-gray-200 bg-white z-50"
                >
                  <div className="px-3 py-2 border-b border-gray-100 mb-1">
                    <p className="text-xs font-bold text-gray-900 truncate">{activeName}</p>
                    <p className="text-[11px] text-gray-500 truncate">{user?.email || user?.phone || userProfile?.email}</p>
                    <span className="mt-1.5 inline-block text-[10px] font-semibold text-emerald-700 bg-emerald-50 rounded-full px-2 py-0.5">
                      Customer Portal
                    </span>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/dashboard/customer"
                      className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium cursor-pointer hover:bg-gray-50 text-gray-700"
                    >
                      <User className="h-4 w-4 text-emerald-600" />
                      <span>Profile & Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/garage"
                      className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium cursor-pointer hover:bg-gray-50 text-gray-700"
                    >
                      <Bike className="h-4 w-4 text-emerald-600" />
                      <span>My Garage</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/orders"
                      className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium cursor-pointer hover:bg-gray-50 text-gray-700"
                    >
                      <Package className="h-4 w-4 text-emerald-600" />
                      <span>My Orders</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-1 bg-gray-100" />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium text-rose-600 focus:text-rose-600 focus:bg-rose-50 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                to="/auth"
                id="navbar-signin-btn"
                className="flex items-center gap-2 rounded-lg bg-[#E31E24] px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-red-700 active:scale-95"
              >
                <User className="h-3.5 w-3.5" />
                <span>Sign in</span>
              </Link>
            )}
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            3. SECONDARY CATEGORY NAVIGATION BAR (AUTOMOTIVE DEPARTMENTS)
           ───────────────────────────────────────────────────────────── */}
        <div className="hidden lg:block border-t border-[#E5E7EB] bg-white">
          <div className="mx-auto flex h-10.5 max-w-7xl items-center justify-between px-6">
            <nav className="flex items-center gap-1">
              {storeCategories.map((cat) => (
                <Link
                  key={cat.label}
                  to={cat.to}
                  search={cat.search ? ({ cat: cat.search } as any) : undefined}
                  className="rounded-md px-3 py-1.5 text-xs font-medium text-[#6B7280] transition hover:bg-red-50 hover:text-[#E31E24]"
                  activeProps={{ className: "!text-[#E31E24] !bg-red-50 !font-semibold" }}
                  activeOptions={{ exact: cat.to === "/" }}
                >
                  {cat.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-4 text-xs font-medium text-[#6B7280]">
              <Link
                to={isAuthenticated ? "/garage" : "/auth"}
                search={!isAuthenticated ? { redirect: "/garage" } : undefined}
                className="flex items-center gap-1.5 hover:text-[#E31E24] transition"
              >
                <Bike className="h-3.5 w-3.5 text-[#E31E24]" />
                <span>My Registered Garage</span>
              </Link>
              <span className="text-gray-300">|</span>
              <Link
                to="/shop"
                search={{ fitment: "verified" } as any}
                className="flex items-center gap-1.5 hover:text-[#E31E24] transition text-emerald-700 font-semibold"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>100% Fitment Guaranteed</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          MOBILE CATEGORY DRAWER
         ───────────────────────────────────────────────────────────── */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 lg:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <div
            className="h-full w-72 bg-white p-5 shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <Logo imgClassName="h-8" />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-md text-gray-500 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="mt-4 space-y-1 flex-1 overflow-y-auto">
              <p className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Departments
              </p>
              {storeCategories.map((c) => (
                <Link
                  key={c.label}
                  to={c.to}
                  search={c.search ? ({ cat: c.search } as any) : undefined}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-[#E31E24]"
                >
                  <span>{c.label}</span>
                  {c.isOffers && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E31E24] text-white">
                      HOT
                    </span>
                  )}
                </Link>
              ))}

              <div className="pt-4 border-t border-gray-100 mt-4">
                <p className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Customer
                </p>
                <Link
                  to="/garage"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#E31E24]"
                >
                  <Bike className="h-4 w-4 text-emerald-600" />
                  <span>My Garage</span>
                </Link>
                <Link
                  to="/orders"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#E31E24]"
                >
                  <Package className="h-4 w-4 text-[#E31E24]" />
                  <span>Track Orders</span>
                </Link>
                <Link
                  to="/dashboard/customer"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#E31E24]"
                >
                  <User className="h-4 w-4 text-[#E31E24]" />
                  <span>Account Dashboard</span>
                </Link>
              </div>
            </nav>

            <div className="pt-4 border-t border-gray-100 text-xs text-gray-500">
              <p className="font-semibold text-gray-800">Support Hotline</p>
              <p className="mt-0.5">+91 98765 43210</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content View */}
      <main>{children}</main>

      {/* Footer */}
      <Footer />

      {/* Mobile Tab Bar */}
      <MobileTabBar count={cartCount} isAuthenticated={isAuthenticated} />
    </div>
  );
}

function MobileTabBar({ count, isAuthenticated }: { count: number; isAuthenticated: boolean }) {
  const navigate = useNavigate();

  const tabs = [
    { to: "/", label: "Home", Icon: Home, requiresAuth: false },
    { to: "/shop", label: "Shop", Icon: ShoppingBag, requiresAuth: false },
    { to: "/assistant", label: "Ask AI", Icon: Mic, center: true, requiresAuth: false },
    { to: "/orders", label: "Orders", Icon: Package, requiresAuth: true },
    {
      to: isAuthenticated ? "/dashboard/customer" : "/auth",
      search: !isAuthenticated ? { redirect: "/dashboard/customer" } : undefined,
      label: "Me",
      Icon: User,
      requiresAuth: false,
    },
  ] as const;

  const handleClick = (e: React.MouseEvent, tab: (typeof tabs)[number]) => {
    if (tab.requiresAuth && !isAuthenticated) {
      e.preventDefault();
      navigate({ to: "/auth", search: { redirect: tab.to } });
    }
  };

  return (
    <nav className="fixed inset-x-3 bottom-3 z-40 mx-auto flex max-w-md items-center justify-around rounded-2xl border border-gray-200 bg-white/95 px-2 py-2 shadow-xl backdrop-blur-md md:hidden">
      {tabs.map((t) => (
        <Link
          key={t.label}
          to={t.to}
          search={"search" in t ? (t.search as any) : undefined}
          onClick={(e) => handleClick(e, t)}
          activeOptions={{ exact: t.to === "/" }}
          className="flex flex-1 flex-col items-center gap-0.5 text-[10px] font-semibold text-[#6B7280] transition hover:text-[#111111]"
          activeProps={{ className: "!text-[#E31E24]" }}
        >
          {"center" in t ? (
            <span className="-mt-5 grid h-11 w-11 place-items-center rounded-full bg-[#E31E24] text-white shadow-md active:scale-95 transition">
              <t.Icon className="h-5 w-5" />
            </span>
          ) : (
            <span className="relative">
              <t.Icon className="h-5 w-5" />
              {t.to === "/cart" && count > 0 && (
                <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-[#E31E24] ring-2 ring-white" />
              )}
            </span>
          )}
          {t.label}
        </Link>
      ))}
    </nav>
  );
}

function Footer() {
  return (
    <footer className="mt-20 border-t border-[#E5E7EB] bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo imgClassName="h-10" />
          <p className="mt-3 max-w-md text-sm text-[#6B7280] leading-relaxed">
            RiderzPro is India's leading automotive marketplace for electric bikes, car and bike accessories, batteries, chargers, and verified replacement spare parts. Built with precision for riders and fleet operators.
          </p>
          <div className="mt-4 flex items-center gap-4 text-xs font-semibold text-gray-700">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Verified OEM Compatible
            </span>
            <span className="flex items-center gap-1">
              <Package className="h-4 w-4 text-[#E31E24]" />
              Express 3-Hour Delivery
            </span>
          </div>
        </div>

        <div className="text-sm">
          <p className="font-semibold text-[#111111] mb-3">Shop Departments</p>
          <ul className="space-y-2 text-[#6B7280]">
            <li>
              <Link to="/shop" className="hover:text-[#E31E24] transition">
                Electric Bikes
              </Link>
            </li>
            <li>
              <Link to="/shop" className="hover:text-[#E31E24] transition">
                Car Accessories
              </Link>
            </li>
            <li>
              <Link to="/shop" className="hover:text-[#E31E24] transition">
                Bike Accessories
              </Link>
            </li>
            <li>
              <Link to="/shop" className="hover:text-[#E31E24] transition">
                Spare Parts & Brakes
              </Link>
            </li>
            <li>
              <Link to="/shop" className="hover:text-[#E31E24] transition">
                Batteries & Chargers
              </Link>
            </li>
          </ul>
        </div>

        <div className="text-sm">
          <p className="font-semibold text-[#111111] mb-3">Customer Support</p>
          <ul className="space-y-2 text-[#6B7280]">
            <li>
              <Link to="/dashboard/customer" className="hover:text-[#E31E24] transition">
                Customer Dashboard
              </Link>
            </li>
            <li>
              <Link to="/orders" className="hover:text-[#E31E24] transition">
                Order Tracking
              </Link>
            </li>
            <li>
              <Link to="/garage" className="hover:text-[#E31E24] transition">
                My Garage VIN Match
              </Link>
            </li>
            <li>
              <Link to="/assistant" className="hover:text-[#E31E24] transition">
                AI Automotive Assistant
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[#E5E7EB] bg-[#F5F6F8] py-4 text-center text-xs text-[#6B7280]">
        © 2026 RiderzPro Car & Bike Accessories. All rights reserved.
      </div>
    </footer>
  );
}
