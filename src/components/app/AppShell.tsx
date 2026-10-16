import React, { useState } from "react";
import {
  Home,
  LayoutGrid,
  Package,
  User,
  ShoppingBag,
  MapPin,
  ChevronDown,
  ArrowRight,
  Sparkles,
  Search,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { Logo } from "@/components/site/bits";
import { CartDrawer } from "@/components/common/CartDrawer";
import { inr, products, bestOffer } from "@/lib/data";
import { AppHomeTab } from "./AppHomeTab";
import { AppCategoriesTab } from "./AppCategoriesTab";
import { AppOrdersTab } from "./AppOrdersTab";
import { AppAccountTab } from "./AppAccountTab";
import { MobileOtpModal } from "./MobileOtpModal";

export type AppTab = "home" | "categories" | "orders" | "account";

export function AppShell({ initialTab = "home" }: { initialTab?: AppTab }) {
  const [activeTab, setActiveTab] = useState<AppTab>(initialTab);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { cart, activeBikeId, setIsCartOpen, orders, userProfile } = useStore();
  const { isAuthenticated, user } = useAuth();

  const cartCount = cart.reduce((s, c) => s + c.qty, 0);
  const cartTotal = cart.reduce((total, c) => {
    const prod = products.find((p) => p.id === c.productId);
    if (!prod) return total;
    const offer = prod.offers.find((o) => o.vendorId === c.vendorId) || bestOffer(prod);
    return total + (offer?.price || 0) * c.qty;
  }, 0);

  const activeOrdersCount = orders ? orders.filter((o) => o.status < 5).length : 0;
  const displayName = userProfile?.name && userProfile.name !== "Guest Rider"
    ? userProfile.name
    : user?.name || null;

  return (
    <div className="flex min-h-screen flex-col bg-[#F4F6F8] text-gray-900 font-sans selection:bg-red-600 selection:text-white">
      {/* 1. Blinkit-Style Clean Light Top Bar */}
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/98 backdrop-blur-md px-3.5 pt-[calc(0.5rem+env(safe-area-inset-top,0px))] pb-2.5 shadow-2xs">
        {/* Row 1: Delivery pill, Address, and Auth Button */}
        <div className="flex items-center justify-between gap-2">
          {/* Left: 30-min express badge & Address */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-black uppercase tracking-tight text-gray-950 shadow-2xs">
              <span>⚡ 30 MINS</span>
            </span>
            <div className="flex items-center gap-1 text-xs text-gray-600 truncate cursor-pointer hover:text-gray-900">
              <MapPin className="h-3.5 w-3.5 text-red-600 shrink-0" />
              <span className="font-bold text-gray-900 truncate">
                {userProfile?.city || "Delhi, NCR"}
              </span>
              <ChevronDown className="h-3 w-3 text-gray-400 shrink-0" />
            </div>
          </div>

          {/* Right: User / Auth button */}
          <div className="flex items-center gap-2 shrink-0">
            {isAuthenticated || displayName ? (
              <button
                onClick={() => setActiveTab("account")}
                className="flex items-center gap-1.5 rounded-full bg-gray-100 hover:bg-gray-200 pl-2 pr-2.5 py-1 text-xs font-bold text-gray-800 transition"
              >
                <div className="h-4.5 w-4.5 rounded-full bg-red-600 text-white text-[10px] grid place-items-center font-bold">
                  {(displayName || "U").charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[70px] truncate">{displayName?.split(" ")[0]}</span>
              </button>
            ) : (
              <button
                onClick={() => setIsOtpModalOpen(true)}
                className="rounded-full bg-red-600 hover:bg-red-700 px-3 py-1 text-xs font-extrabold text-white shadow-2xs transition active:scale-95"
              >
                Login
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Prominent Search Box */}
        <div className="mt-2.5 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search 'Ather 450X battery', 'fast charger'..."
            className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-xs font-medium text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-red-600 focus:outline-none transition shadow-2xs"
          />
        </div>
      </header>

      {/* 2. Main Tab Body */}
      <main className="flex-1 px-3 pt-3 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] max-w-lg mx-auto w-full">
        {activeTab === "home" && (
          <AppHomeTab
            searchQuery={searchQuery}
            onSelectCategory={() => setActiveTab("categories")}
            onOpenOrders={() => setActiveTab("orders")}
            onTriggerLogin={() => setIsOtpModalOpen(true)}
          />
        )}
        {activeTab === "categories" && (
          <AppCategoriesTab
            onSelectCategory={() => setActiveTab("home")}
          />
        )}
        {activeTab === "orders" && (
          <AppOrdersTab onTriggerLogin={() => setIsOtpModalOpen(true)} />
        )}
        {activeTab === "account" && (
          <AppAccountTab
            onOpenOrders={() => setActiveTab("orders")}
            onTriggerLogin={() => setIsOtpModalOpen(true)}
          />
        )}
      </main>

      {/* 3. Blinkit-Style Floating Cart Bar (appears when items in cart) */}
      {cartCount > 0 && (
        <aside
          aria-label="Active shopping cart"
          className="fixed inset-x-0 bottom-[calc(3.85rem+env(safe-area-inset-bottom,0px))] z-40 px-3 max-w-lg mx-auto pointer-events-none"
        >
          <div
            onClick={() => setIsCartOpen(true)}
            className="pointer-events-auto flex items-center justify-between rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 shadow-xl transition active:scale-[0.98] cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-white/20 grid place-items-center">
                <ShoppingBag className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-wide">
                  {cartCount} {cartCount === 1 ? "item" : "items"} added
                </p>
                <p className="text-sm font-extrabold font-mono leading-tight">
                  {inr(cartTotal)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-black tracking-tight bg-white/20 px-3 py-1.5 rounded-xl">
              <span>View Cart</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </aside>
      )}

      {/* 4. Blinkit-Style Clean Bottom Tab Bar (Home · Categories · Orders · Account) */}
      <nav
        aria-label="Mobile Navigation"
        className="fixed inset-x-0 bottom-0 z-40 flex h-[calc(3.75rem+env(safe-area-inset-bottom,0px))] pb-[env(safe-area-inset-bottom,0px)] items-center justify-around border-t border-gray-200 bg-white/98 px-2 backdrop-blur-md"
      >
        {/* Tab 1: Home */}
        <button
          onClick={() => setActiveTab("home")}
          className={`flex flex-1 flex-col items-center justify-center gap-0.5 py-1 transition ${
            activeTab === "home" ? "text-red-600 font-bold" : "text-gray-500 hover:text-gray-800"
          }`}
        >
          <Home className="h-5 w-5" />
          <span className="text-[10px] tracking-tight">Home</span>
        </button>

        {/* Tab 2: Categories */}
        <button
          onClick={() => setActiveTab("categories")}
          className={`flex flex-1 flex-col items-center justify-center gap-0.5 py-1 transition ${
            activeTab === "categories" ? "text-red-600 font-bold" : "text-gray-500 hover:text-gray-800"
          }`}
        >
          <LayoutGrid className="h-5 w-5" />
          <span className="text-[10px] tracking-tight">Categories</span>
        </button>

        {/* Tab 3: Orders */}
        <button
          onClick={() => setActiveTab("orders")}
          className={`relative flex flex-1 flex-col items-center justify-center gap-0.5 py-1 transition ${
            activeTab === "orders" ? "text-red-600 font-bold" : "text-gray-500 hover:text-gray-800"
          }`}
        >
          <div className="relative">
            <Package className="h-5 w-5" />
            {activeOrdersCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-2 w-2 rounded-full bg-red-600 ring-2 ring-white" />
            )}
          </div>
          <span className="text-[10px] tracking-tight">Orders</span>
        </button>

        {/* Tab 4: Account */}
        <button
          onClick={() => setActiveTab("account")}
          className={`flex flex-1 flex-col items-center justify-center gap-0.5 py-1 transition ${
            activeTab === "account" ? "text-red-600 font-bold" : "text-gray-500 hover:text-gray-800"
          }`}
        >
          <User className="h-5 w-5" />
          <span className="text-[10px] tracking-tight">Account</span>
        </button>
      </nav>

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Customer Mobile OTP Login Modal */}
      <MobileOtpModal
        isOpen={isOtpModalOpen}
        onClose={() => setIsOtpModalOpen(false)}
        onSuccess={() => setIsCartOpen(true)}
      />
    </div>
  );
}
