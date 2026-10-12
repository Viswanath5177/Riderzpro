import { Link, useNavigate } from "@tanstack/react-router";
import {
  Home,
  Mic,
  Package,
  ShoppingBag,
  ShoppingCart,
  User,
  LayoutDashboard,
  Sparkles,
  Search,
  ShieldCheck,
  ChevronDown,
  Menu,
  X,
  Lock,
  Tag,
  Wrench,
  Bike,
  Compass,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { useStore } from "@/lib/store";
import { Logo } from "./bits";
import { inr } from "@/lib/data";

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
  { label: "Riding Gear & Helmets", to: "/shop", search: "Riding Gear & Helmets" },
  { label: "Spare Parts", to: "/shop", search: "Spare Parts" },
  { label: "Batteries & Chargers", to: "/shop", search: "Battery" },
  { label: "Offers", to: "/dashboard/customer", isOffers: true },
];

export function SiteLayout({ children }: { children: ReactNode; transparent?: boolean }) {
  const { cart, userProfile } = useStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({ to: "/shop", search: { q: searchQuery.trim() } as any });
    } else {
      navigate({ to: "/shop" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F3F4F6] via-[#F8F9FB] to-[#EEF2F6] text-[#111111] pb-24 md:pb-0 font-sans relative overflow-x-hidden">
      {/* VisionOS Ambient Spatial Glow Orbs */}
      <div className="pointer-events-none fixed -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-red-400/8 blur-[140px] z-0" />
      <div className="pointer-events-none fixed top-1/3 -right-40 h-[450px] w-[450px] rounded-full bg-blue-400/8 blur-[140px] z-0" />

      {/* ─────────────────────────────────────────────────────────────
          MAIN BRAND HEADER WITH APPLE VISIONOS FROSTED GLASS
         ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-white/70 bg-white/75 backdrop-blur-2xl shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
        <div className="mx-auto flex h-18 max-w-7xl items-center gap-4 px-4 sm:px-6">
          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl text-gray-700 hover:bg-white/80 active:scale-95 transition lg:hidden"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Official RiderzPro Logo Asset */}
          <div className="shrink-0 py-2">
            <Logo imgClassName="h-9 md:h-11" />
          </div>

          {/* Prominent Search Bar with VisionOS Glass */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden sm:flex flex-1 max-w-xl mx-auto items-center relative"
          >
            <div className="relative w-full flex items-center vision-glass-subtle rounded-full border border-white/80 transition-all focus-within:bg-white/95 focus-within:border-white focus-within:ring-2 focus-within:ring-[#E31E24]/20 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]">
              <Search className="ml-4 h-4 w-4 text-[#6B7280] shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search electric bikes, car accessories, 60V batteries, chargers, brake discs..."
                className="w-full bg-transparent py-2.5 pl-3 pr-24 text-xs text-[#111111] placeholder:text-[#6B7280] focus:outline-none"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-[#E31E24] px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-red-700 active:scale-95"
              >
                Search
              </button>
            </div>
          </form>

          {/* Right Header Controls */}
          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            {/* AI Voice Assistant Pill */}
            <Link
              to="/assistant"
              id="navbar-ai-assistant-btn"
              className="vision-pill flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold text-[#E31E24] transition hover:bg-red-500 hover:text-white hover:border-red-500 hover:shadow-[0_4px_16px_rgba(227,30,36,0.35)] active:scale-95 group"
            >
              <Mic className="h-3.5 w-3.5 text-[#E31E24] group-hover:text-white transition" />
              <span className="hidden sm:inline">AI Voice</span>
            </Link>

            {/* Cart Button */}
            <Link
              to="/cart"
              id="navbar-cart-btn"
              aria-label="Cart"
              className="vision-pill relative flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-semibold text-[#111111] transition hover:border-[#E31E24] hover:text-[#E31E24] active:scale-95"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="grid h-4.5 min-w-4.5 place-items-center rounded-full bg-[#E31E24] px-1 text-[10px] font-bold text-white leading-none">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Account Menu */}
            <div className="relative">
              <Link
                to="/dashboard/customer"
                className="vision-pill flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold text-[#111111] transition hover:border-[#E31E24] active:scale-95"
              >
                <div className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-tr from-gray-200 to-white text-[#111111] font-bold text-[11px] shadow-2xs">
                  AS
                </div>
                <span className="hidden md:inline">{userProfile.name.split(" ")[0]}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            3. SECONDARY CATEGORY NAVIGATION BAR (FROSTED GLASS)
           ───────────────────────────────────────────────────────────── */}
        <div className="hidden lg:block border-t border-white/50 bg-white/60 backdrop-blur-xl">
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
                to="/dashboard/customer"
                className="flex items-center gap-1.5 hover:text-[#E31E24] transition"
              >
                <Bike className="h-3.5 w-3.5 text-[#E31E24]" />
                <span>My Registered Garage</span>
              </Link>
              <span className="text-gray-300">|</span>
              <span className="flex items-center gap-1 text-emerald-700">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>100% Fitment Guarantee</span>
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          4. MOBILE DRAWER NAVIGATION
         ───────────────────────────────────────────────────────────── */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-4/5 max-w-sm bg-white p-5 flex flex-col h-full shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <Logo imgClassName="h-8" />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-md text-gray-500 hover:text-gray-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="mt-4">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search auto spares & batteries..."
                  className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm focus:bg-white focus:border-[#E31E24] focus:outline-none"
                />
                <Search className="absolute left-3 h-4 w-4 text-gray-400" />
              </div>
            </form>

            {/* Categories list */}
            <p className="mt-5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Categories
            </p>
            <div className="mt-2 space-y-1 overflow-y-auto flex-1">
              {storeCategories.map((cat) => (
                <Link
                  key={cat.label}
                  to={cat.to}
                  search={cat.search ? ({ cat: cat.search } as any) : undefined}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-[#E31E24]"
                >
                  <span>{cat.label}</span>
                </Link>
              ))}

              <div className="pt-4 mt-4 border-t border-gray-100 space-y-1">
                <Link
                  to="/dashboard/customer"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                >
                  <User className="h-4 w-4 text-[#E31E24]" />
                  <span>Customer Dashboard</span>
                </Link>
                <Link
                  to="/dashboard/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold text-[#E31E24] hover:bg-red-50"
                >
                  <Lock className="h-4 w-4 text-[#E31E24]" />
                  <span>Admin Console</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content View */}
      <main>{children}</main>

      {/* Footer */}
      <Footer />

      {/* Mobile Tab Bar */}
      <MobileTabBar count={cartCount} />
    </div>
  );
}

function MobileTabBar({ count }: { count: number }) {
  const tabs = [
    { to: "/", label: "Home", Icon: Home },
    { to: "/shop", label: "Shop", Icon: ShoppingBag },
    { to: "/assistant", label: "Ask AI", Icon: Mic, center: true },
    { to: "/dashboard/customer", label: "Garage", Icon: Bike },
    { to: "/dashboard/customer", label: "Account", Icon: User },
  ] as const;

  return (
    <nav className="fixed inset-x-4 bottom-4 z-40 mx-auto flex max-w-md items-center justify-around rounded-full vision-dock px-3 py-1.5 md:hidden">
      {tabs.map((t) => (
        <Link
          key={t.label}
          to={t.to}
          activeOptions={{ exact: t.to === "/" }}
          className="flex flex-1 flex-col items-center gap-0.5 text-[10px] font-semibold text-[#6B7280] transition hover:text-[#111111]"
          activeProps={{ className: "!text-[#E31E24]" }}
        >
          {"center" in t ? (
            <div className="relative -mt-6 flex flex-col items-center group">
              <span className="vision-mic-orb relative grid h-13 w-13 place-items-center rounded-full text-white cursor-pointer active:scale-90">
                <span className="vision-mic-pulse animate-mic-pulse" />
                <Mic className="h-6 w-6 relative z-10 drop-shadow-sm" />
              </span>
              <span className="mt-1 text-[10px] font-bold tracking-tight text-[#E31E24]">
                Ask AI
              </span>
            </div>
          ) : (
            <span className="relative flex flex-col items-center py-1">
              <t.Icon className="h-5 w-5" />
              <span>{t.label}</span>
            </span>
          )}
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
            <li><Link to="/shop" className="hover:text-[#E31E24] transition">Electric Bikes</Link></li>
            <li><Link to="/shop" className="hover:text-[#E31E24] transition">Car Accessories</Link></li>
            <li><Link to="/shop" className="hover:text-[#E31E24] transition">Bike Accessories</Link></li>
            <li><Link to="/shop" className="hover:text-[#E31E24] transition">Spare Parts & Brakes</Link></li>
            <li><Link to="/shop" className="hover:text-[#E31E24] transition">Batteries & Chargers</Link></li>
          </ul>
        </div>

        <div className="text-sm">
          <p className="font-semibold text-[#111111] mb-3">Portals & Support</p>
          <ul className="space-y-2 text-[#6B7280]">
            <li><Link to="/dashboard/customer" className="hover:text-[#E31E24] transition">Customer Dashboard</Link></li>
            <li><Link to="/dashboard/admin" className="hover:text-[#E31E24] transition">Admin Operations Console</Link></li>
            <li><Link to="/assistant" className="hover:text-[#E31E24] transition">AI Automotive Assistant</Link></li>
            <li><Link to="/login" className="hover:text-[#E31E24] transition">Account Sign In</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[#E5E7EB] bg-[#F5F6F8] py-4 text-center text-xs text-[#6B7280]">
        © 2026 RiderzPro Car & Bike Accessories. All rights reserved.
      </div>
    </footer>
  );
}

export { LayoutDashboard };
