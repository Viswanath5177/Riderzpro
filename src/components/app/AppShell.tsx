import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Home,
  LayoutGrid,
  Package,
  User,
  ShoppingBag,
  Bike,
  MapPin,
  Check,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { Logo } from "@/components/site/bits";
import { CartDrawer } from "@/components/common/CartDrawer";
import { AppHomeTab } from "./AppHomeTab";
import { AppCategoriesTab } from "./AppCategoriesTab";
import { AppOrdersTab } from "./AppOrdersTab";
import { AppAccountTab } from "./AppAccountTab";

export type AppTab = "home" | "categories" | "orders" | "account";

export function AppShell({ initialTab = "home" }: { initialTab?: AppTab }) {
  const [activeTab, setActiveTab] = useState<AppTab>(initialTab);
  const { cart, activeBikeId, openCart, orders } = useStore() as any;

  const cartCount = ((cart || []) as any[]).reduce((s: number, c: any) => s + (c?.qty || 0), 0);
  const activeOrdersCount = orders ? ((orders || []) as any[]).filter((o: any) => o.status < 5).length : 0;

  return (
    <div className="flex min-h-screen flex-col bg-[#0e1013] text-zinc-100 font-sans selection:bg-red-600 selection:text-white">
      {/* 1. Light Native Top Bar (No website header, no large menus) */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-zinc-800/90 bg-[#14161a]/95 px-3.5 py-2.5 backdrop-blur-md pt-[calc(0.6rem+env(safe-area-inset-top,0px))]">
        <div className="flex items-center gap-2">
          <Logo imgClassName="h-7 w-auto" />
          <span className="rounded bg-red-600/20 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-red-500 border border-red-500/30">
            APP
          </span>
        </div>

        {/* Right Side: Delhi Delivery Pill & Cart Icon */}
        <div className="flex items-center gap-2">
          <div className="hidden xs:flex items-center gap-1 rounded-full bg-zinc-800/80 px-2 py-1 text-[10px] font-semibold text-zinc-300 border border-zinc-700/60">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Delhi 30m</span>
          </div>

          <button
            onClick={openCart}
            aria-label="Open Shopping Cart"
            className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 text-zinc-200 border border-zinc-700 transition active:scale-90 hover:bg-zinc-700"
          >
            <ShoppingBag className="h-4 w-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white shadow-sm shadow-red-600/50">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* 2. Main Tab Body */}
      <main className="flex-1 px-3.5 pt-3 pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))] max-w-md mx-auto w-full">
        {activeTab === "home" && (
          <AppHomeTab
            onSelectCategory={(cat) => setActiveTab("categories")}
            onOpenOrders={() => setActiveTab("orders")}
          />
        )}
        {activeTab === "categories" && (
          <AppCategoriesTab
            onSelectCategory={(cat) => setActiveTab("categories")}
          />
        )}
        {activeTab === "orders" && <AppOrdersTab />}
        {activeTab === "account" && (
          <AppAccountTab onOpenOrders={() => setActiveTab("orders")} />
        )}
      </main>

      {/* 3. Native Bottom Tab Bar (Home · Categories · Orders · Account) */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="fixed inset-x-0 bottom-0 z-40 flex h-[calc(3.75rem+env(safe-area-inset-bottom,0px))] pb-[env(safe-area-inset-bottom,0px)] items-center justify-around border-t border-zinc-800/80 bg-[#14161a]/95 px-2 backdrop-blur-lg"
      >
        {/* Tab 1: Home */}
        <button
          onClick={() => setActiveTab("home")}
          className={`flex flex-1 flex-col items-center justify-center gap-1 py-1 transition ${
            activeTab === "home" ? "text-red-500" : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Home className="h-5 w-5" />
          <span className="text-[10px] font-bold tracking-tight">Home</span>
        </button>

        {/* Tab 2: Categories */}
        <button
          onClick={() => setActiveTab("categories")}
          className={`flex flex-1 flex-col items-center justify-center gap-1 py-1 transition ${
            activeTab === "categories" ? "text-red-500" : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <LayoutGrid className="h-5 w-5" />
          <span className="text-[10px] font-bold tracking-tight">Categories</span>
        </button>

        {/* Tab 3: Orders */}
        <button
          onClick={() => setActiveTab("orders")}
          className={`relative flex flex-1 flex-col items-center justify-center gap-1 py-1 transition ${
            activeTab === "orders" ? "text-red-500" : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <div className="relative">
            <Package className="h-5 w-5" />
            {activeOrdersCount > 0 && (
              <span className="absolute -top-1 -right-1.5 flex h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-[#14161a]" />
            )}
          </div>
          <span className="text-[10px] font-bold tracking-tight">Orders</span>
        </button>

        {/* Tab 4: Account */}
        <button
          onClick={() => setActiveTab("account")}
          className={`flex flex-1 flex-col items-center justify-center gap-1 py-1 transition ${
            activeTab === "account" ? "text-red-500" : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <User className="h-5 w-5" />
          <span className="text-[10px] font-bold tracking-tight">Account</span>
        </button>
      </nav>

      {/* Cart Drawer is preserved for in-app checkout */}
      <CartDrawer />
    </div>
  );
}
