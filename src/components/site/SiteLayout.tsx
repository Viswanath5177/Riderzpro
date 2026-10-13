import { Link, useNavigate } from "@tanstack/react-router";
import {
  ShoppingCart,
  User,
  LayoutDashboard,
  Search,
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { useStore } from "@/lib/store";
import { Logo } from "./bits";
import { CartDrawer } from "@/components/common/CartDrawer";
import { AiChatbotWidget } from "@/components/common/AiChatbotWidget";

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
  const { cart, userProfile, setIsCartOpen } = useStore();
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

  return (
    <div className="min-h-screen bg-white text-[#111111] font-sans flex flex-col antialiased">
      {/* ─────────────────────────────────────────────────────────────
          COMPACT PROFESSIONAL TWO-ROW HEADER (STATIC)
         ───────────────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-[#E5E7EB]">
        {/* ROW 1: Logo, Search Bar, Cart, Account */}
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg text-gray-700 hover:bg-[#F7F7F8] active:scale-95 transition lg:hidden"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Official RiderzPro Logo */}
          <div className="shrink-0">
            <Logo imgClassName="h-8 md:h-9" />
          </div>

          {/* Product Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden sm:flex flex-1 max-w-xl mx-4 items-center relative"
          >
            <div className="relative w-full flex items-center rounded-lg border border-[#E5E7EB] bg-white transition-all focus-within:border-[#E31E24] focus-within:ring-1 focus-within:ring-[#E31E24]">
              <Search className="ml-3.5 h-4 w-4 text-[#6B7280] shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search electric bikes, accessories, batteries, spare parts..."
                className="w-full bg-transparent py-2 pl-2.5 pr-22 text-xs sm:text-sm text-[#111111] placeholder:text-[#6B7280] focus:outline-none"
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 rounded-md bg-[#E31E24] px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700 active:scale-95"
              >
                Search
              </button>
            </div>
          </form>

          {/* Right: Cart & Account Controls */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Cart Icon with Item Count - Opens Slide-over Cart Drawer */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              id="navbar-cart-btn"
              aria-label="Shopping Cart"
              className="relative flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-3.5 py-2 text-xs font-semibold text-[#111111] transition hover:border-[#E31E24] hover:text-[#E31E24] active:scale-95 cursor-pointer"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="grid h-4.5 min-w-4.5 place-items-center rounded-full bg-[#E31E24] px-1 text-[10px] font-bold text-white leading-none">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Customer Account / Profile Menu */}
            <Link
              to="/dashboard/customer"
              aria-label="Customer Account"
              className="flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-[#F7F7F8] px-3.5 py-2 text-xs font-semibold text-[#111111] transition hover:border-[#E31E24] hover:text-[#E31E24] active:scale-95"
            >
              <User className="h-4 w-4 text-[#6B7280]" />
              <span className="hidden sm:inline">{userProfile.name ? userProfile.name.split(" ")[0] : "Account"}</span>
            </Link>
          </div>
        </div>

        {/* Mobile Search Bar below header row */}
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

        {/* Navigation row */}
        <div className="hidden lg:block border-t border-[#E5E7EB] bg-white">
          <div className="mx-auto flex h-10 max-w-7xl items-center px-4 sm:px-6">
            <nav className="flex items-center gap-7 text-xs">
              {storeCategories.map((cat) => (
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
      </header>

      {/* MOBILE DRAWER NAVIGATION */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-4/5 max-w-xs bg-white p-5 flex flex-col h-full shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
              <Logo imgClassName="h-7" />
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
              {storeCategories.map((cat) => (
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

            <div className="pt-4 border-t border-[#E5E7EB] space-y-2">
              <Link
                to="/dashboard/customer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 text-xs font-semibold text-[#111111] hover:text-[#E31E24]"
              >
                <User className="h-4 w-4" /> Customer Dashboard
              </Link>
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsCartOpen(true);
                }}
                className="flex items-center gap-2 text-xs font-semibold text-[#111111] hover:text-[#E31E24] w-full text-left cursor-pointer"
              >
                <ShoppingCart className="h-4 w-4" /> View Cart ({cartCount})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* FOOTER */}
      <Footer />

      {/* Slide-over Cart Drawer & Floating AI Assistant Chatbot */}
      <CartDrawer />
      <AiChatbotWidget />
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[#E5E7EB] bg-[#F7F7F8] text-[#111111] mt-auto">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        {/* Brand & Summary */}
        <div className="md:col-span-1">
          <Logo imgClassName="h-8" />
          <p className="mt-3 text-xs text-[#6B7280] leading-relaxed">
            RiderzPro is an automotive e-commerce platform offering electric bikes, accessories, batteries, chargers, and verified spare parts.
          </p>
          <div className="mt-4 space-y-1.5 text-xs text-[#6B7280]">
            <p className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-[#111111]" /> MG Road, Bengaluru, Karnataka, India
            </p>
            <p className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-[#111111]" /> support@riderzpro.com
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 text-[#111111]" /> +91 80 4567 8900
            </p>
          </div>
        </div>

        {/* Product Links */}
        <div className="text-xs">
          <p className="font-bold text-[#111111] uppercase tracking-wider mb-3">Products</p>
          <ul className="space-y-2 text-[#6B7280]">
            <li><Link to="/shop" search={{ cat: "Electric Bikes" } as any} className="hover:text-[#E31E24] transition">Electric Bikes</Link></li>
            <li><Link to="/shop" search={{ cat: "Car Accessories" } as any} className="hover:text-[#E31E24] transition">Car Accessories</Link></li>
            <li><Link to="/shop" search={{ cat: "Bike Accessories" } as any} className="hover:text-[#E31E24] transition">Bike Accessories</Link></li>
            <li><Link to="/shop" search={{ cat: "Riding Gear & Helmets" } as any} className="hover:text-[#E31E24] transition">Riding Gear & Helmets</Link></li>
            <li><Link to="/shop" search={{ cat: "Spare Parts" } as any} className="hover:text-[#E31E24] transition">Spare Parts</Link></li>
            <li><Link to="/shop" search={{ cat: "Battery" } as any} className="hover:text-[#E31E24] transition">Batteries & Chargers</Link></li>
          </ul>
        </div>

        {/* Customer Support & Orders */}
        <div className="text-xs">
          <p className="font-bold text-[#111111] uppercase tracking-wider mb-3">Customer Support</p>
          <ul className="space-y-2 text-[#6B7280]">
            <li><Link to="/dashboard/customer" search={{ tab: "orders" } as any} className="hover:text-[#E31E24] transition">Track Your Order</Link></li>
            <li><Link to="/dashboard/customer" className="hover:text-[#E31E24] transition">Customer Dashboard</Link></li>
            <li><Link to="/dashboard/customer" search={{ tab: "help" } as any} className="hover:text-[#E31E24] transition">Help & Support</Link></li>
            <li><Link to="/login" className="hover:text-[#E31E24] transition">Account Login</Link></li>
            <li><Link to="/cart" className="hover:text-[#E31E24] transition">View Shopping Cart</Link></li>
          </ul>
        </div>

        {/* Policies & Legal */}
        <div className="text-xs">
          <p className="font-bold text-[#111111] uppercase tracking-wider mb-3">Policies & Legal</p>
          <ul className="space-y-2 text-[#6B7280]">
            <li><span className="text-[#6B7280]">Shipping Policy: Tracked courier delivery across India</span></li>
            <li><span className="text-[#6B7280]">Returns Policy: Verified returns within 7 days for eligible items</span></li>
            <li><span className="text-[#6B7280]">Privacy Policy: Compliant customer data protection</span></li>
            <li><span className="text-[#6B7280]">Terms & Conditions: Standard automotive e-commerce terms</span></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[#E5E7EB] bg-white py-4 text-center text-xs text-[#6B7280]">
        © {new Date().getFullYear()} RiderzPro Automotive E-Commerce. All rights reserved.
      </div>
    </footer>
  );
}

export { LayoutDashboard };
