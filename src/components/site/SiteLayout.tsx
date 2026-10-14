import { type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Home, ShoppingBag, Package, User, MapPin, Mail, Phone } from "lucide-react";
import { Header } from "./Header";
import { AIChatButton } from "./AIChatButton";
import { CartDrawer } from "@/components/common/CartDrawer";
import { useStore } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { Logo } from "@/components/site/bits";

export function SiteLayout({ children }: { children: ReactNode; transparent?: boolean }) {
  const { cart } = useStore();
  const { isAuthenticated } = useAuth();
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  return (
    <div className="min-h-screen bg-white text-[#111111] pb-[calc(4rem+env(safe-area-inset-bottom,0px))] md:pb-0 font-sans selection:bg-red-500 selection:text-white flex flex-col">
      <Header />
      <main className="flex-1 min-h-[calc(100vh-72px)]">{children}</main>
      <Footer />
      <AIChatButton />
      <MobileBottomBar count={cartCount} isAuthenticated={isAuthenticated} />
      <CartDrawer />
    </div>
  );
}

function MobileBottomBar({
  count,
  isAuthenticated,
}: {
  count: number;
  isAuthenticated: boolean;
}) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex h-[calc(3.5rem+env(safe-area-inset-bottom,0px))] pb-[env(safe-area-inset-bottom,0px)] items-center justify-around border-t border-[#ececec] bg-white/95 px-2 backdrop-blur-md md:hidden">
      <Link
        to="/"
        activeOptions={{ exact: true }}
        className="flex flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-semibold text-[#6b7280] transition hover:text-[#111111]"
        activeProps={{ className: "!text-[#e11d2a]" }}
      >
        <Home className="h-4.5 w-4.5" />
        <span>Home</span>
      </Link>

      <Link
        to="/shop"
        className="flex flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-semibold text-[#6b7280] transition hover:text-[#111111]"
        activeProps={{ className: "!text-[#e11d2a]" }}
      >
        <ShoppingBag className="h-4.5 w-4.5" />
        <span>Shop</span>
      </Link>

      <Link
        to={isAuthenticated ? "/orders" : "/login"}
        search={!isAuthenticated ? { redirect: "/orders" } : undefined}
        className="flex flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-semibold text-[#6b7280] transition hover:text-[#111111]"
        activeProps={{ className: "!text-[#e11d2a]" }}
      >
        <span className="relative">
          <Package className="h-4.5 w-4.5" />
          {count > 0 && (
            <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-[#e11d2a]" />
          )}
        </span>
        <span>Orders</span>
      </Link>

      <Link
        to={isAuthenticated ? "/dashboard/customer" : "/login"}
        search={!isAuthenticated ? { redirect: "/dashboard/customer" } : undefined}
        className="flex flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-semibold text-[#6b7280] transition hover:text-[#111111]"
        activeProps={{ className: "!text-[#e11d2a]" }}
      >
        <User className="h-4.5 w-4.5" />
        <span>Account</span>
      </Link>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[#E5E7EB] bg-[#F7F7F8] text-[#111111] mt-auto">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        {/* Brand & Summary */}
        <div className="md:col-span-1">
          <Logo imgClassName="h-10 sm:h-11 w-auto" />
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
