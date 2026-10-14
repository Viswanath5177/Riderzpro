import { type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Home, ShoppingBag, Package, User } from "lucide-react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { AIChatButton } from "./AIChatButton";
import { CartDrawer } from "@/components/common/CartDrawer";
import { LocationPickerModal } from "@/components/common/LocationPickerModal";
import { useStore } from "@/lib/store";
import { useAuth } from "@/lib/auth";

export function SiteLayout({ children }: { children: ReactNode; transparent?: boolean }) {
  const { cart, isLocationModalOpen, setIsLocationModalOpen } = useStore();
  const { isAuthenticated } = useAuth();
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  return (
    <div className="min-h-screen bg-white text-[#111111] pb-16 md:pb-0 font-sans selection:bg-red-500 selection:text-white flex flex-col">
      {/* 1. Header */}
      <Header />

      {/* 2. Main Content View */}
      <main className="flex-1 min-h-[calc(100vh-72px)]">{children}</main>

      {/* 3. Footer */}
      <Footer />

      {/* 4. Floating AI Chat Button */}
      <AIChatButton />

      {/* 5. Mobile Tab Bar */}
      <MobileBottomBar count={cartCount} isAuthenticated={isAuthenticated} />

      {/* 6. Slide-over Cart Drawer */}
      <CartDrawer />

      {/* 7. Location Picker Modal */}
      <LocationPickerModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />
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
    <nav className="fixed inset-x-0 bottom-0 z-30 flex h-14 items-center justify-around border-t border-[#ececec] bg-white/95 px-2 backdrop-blur-md md:hidden">
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
        to={isAuthenticated ? "/orders" : "/"}
        search={!isAuthenticated ? { openLogin: "customer", redirect: "/orders" } : undefined}
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
        to={isAuthenticated ? "/dashboard/customer" : "/"}
        search={!isAuthenticated ? { openLogin: "customer", redirect: "/dashboard/customer" } : undefined}
        className="flex flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-semibold text-[#6b7280] transition hover:text-[#111111]"
        activeProps={{ className: "!text-[#e11d2a]" }}
      >
        <User className="h-4.5 w-4.5" />
        <span>Account</span>
      </Link>
    </nav>
  );
}
