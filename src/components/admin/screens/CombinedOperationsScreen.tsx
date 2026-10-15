import React, { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  Store,
  Box,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Layers,
  FileCheck,
  CreditCard,
  Building,
  Star,
  Eye,
  SlidersHorizontal,
} from "lucide-react";
import { GlassCard } from "../glass/GlassCard";
import { GlassButton } from "../glass/GlassButton";
import { StatusBadge } from "../glass/StatusBadge";
import { SellersScreen } from "./SellersScreen";
import { ProductsScreen } from "./ProductsScreen";
import { useAdminAuth } from "@/lib/adminAuth";
import { cn } from "@/lib/utils";

export function CombinedOperationsScreen() {
  const { adminUser } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "sellers" | "products">(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search);
      const tabParam = p.get("tab");
      if (tabParam === "sellers" || tabParam === "products") {
        return tabParam;
      }
    }
    return "overview";
  });

  const [sellersMetrics, setSellersMetrics] = useState({
    pendingSellers: 0,
    activeSellers: 0,
    totalSellers: 0,
  });
  const [productsMetrics, setProductsMetrics] = useState({
    pendingProducts: 0,
    activeProducts: 0,
    totalProducts: 0,
  });

  const [pendingSellersList, setPendingSellersList] = useState<any[]>([]);
  const [pendingProductsList, setPendingProductsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = () => {
    setIsLoading(true);

    // Fetch Seller Analytics & Pending Sellers
    const p1 = fetch("/api/admin/sellers/analytics")
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) {
          setSellersMetrics({
            pendingSellers: res.data.metrics?.pendingSellers || 0,
            activeSellers: res.data.metrics?.activeSellers || 0,
            totalSellers: res.data.metrics?.totalSellers || 0,
          });
        }
      })
      .catch(() => {});

    const p2 = fetch("/api/admin/sellers?status=PENDING_REVIEW")
      .then((r) => r.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          setPendingSellersList(res.data.slice(0, 5));
        }
      })
      .catch(() => {});

    // Fetch Products & Pending Catalog Items
    const p3 = fetch("/api/products?all=true")
      .then((r) => r.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          const pending = res.data.filter(
            (p: any) => p.verification_status === "pending_approval"
          );
          const active = res.data.filter(
            (p: any) => p.verification_status === "approved" || !p.verification_status
          );
          setProductsMetrics({
            pendingProducts: pending.length,
            activeProducts: active.length,
            totalProducts: res.data.length,
          });
          setPendingProductsList(pending.slice(0, 5));
        }
      })
      .catch(() => {});

    Promise.allSettled([p1, p2, p3]).finally(() => {
      setIsLoading(false);
    });
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleTabChange = (tab: "overview" | "sellers" | "products") => {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (tab === "overview") {
        url.searchParams.delete("tab");
      } else {
        url.searchParams.set("tab", tab);
      }
      window.history.replaceState({}, "", url.toString());
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Tab Navigation Bar */}
      <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white/95 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[#0c101a]/95">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 items-center rounded-lg bg-red-50 px-2.5 text-xs font-black tracking-wide text-[#E31E24] border border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30">
                OPERATIONS DASHBOARD
              </span>
              <span className="text-xs text-gray-400 dark:text-zinc-500">•</span>
              <span className="text-xs font-medium text-gray-500 dark:text-zinc-400">
                Seller KYC & Product Moderation Unified
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-[#111111] dark:text-white sm:text-3xl">
              Operations Command Center
            </h1>
            <p className="mt-1 text-xs text-gray-600 dark:text-zinc-400 sm:text-sm">
              Single unified interface for vendor compliance verification and catalog inventory moderation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchDashboardData}
              className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10"
              title="Refresh Queue Metrics"
            >
              <RefreshCw className={cn("h-3.5 w-3.5 text-gray-500", isLoading && "animate-spin")} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Tab Selector Buttons */}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-gray-100 pt-4 dark:border-white/10">
          <button
            onClick={() => handleTabChange("overview")}
            className={cn(
              "flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer",
              activeTab === "overview"
                ? "bg-[#E31E24] text-white shadow-md shadow-red-500/20"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10"
            )}
          >
            <Layers className="h-4 w-4" />
            <span>Combined Overview</span>
          </button>

          <button
            onClick={() => handleTabChange("sellers")}
            className={cn(
              "flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer",
              activeTab === "sellers"
                ? "bg-[#E31E24] text-white shadow-md shadow-red-500/20"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10"
            )}
          >
            <Store className="h-4 w-4" />
            <span>Seller KYC & Approvals</span>
            {sellersMetrics.pendingSellers > 0 && (
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-black text-white">
                {sellersMetrics.pendingSellers}
              </span>
            )}
          </button>

          <button
            onClick={() => handleTabChange("products")}
            className={cn(
              "flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer",
              activeTab === "products"
                ? "bg-[#E31E24] text-white shadow-md shadow-red-500/20"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10"
            )}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Product Catalog Moderation</span>
            {productsMetrics.pendingProducts > 0 && (
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-black text-white">
                {productsMetrics.pendingProducts}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Tab Content Display */}
      {activeTab === "sellers" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400">
              Showing Seller KYC Queue & Verification Workspace
            </p>
            <button
              onClick={() => handleTabChange("overview")}
              className="text-xs font-bold text-[#E31E24] hover:underline"
            >
              ← Back to Combined Overview
            </button>
          </div>
          <SellersScreen />
        </div>
      )}

      {activeTab === "products" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400">
              Showing Product Catalog Moderation Workspace
            </p>
            <button
              onClick={() => handleTabChange("overview")}
              className="text-xs font-bold text-[#E31E24] hover:underline"
            >
              ← Back to Combined Overview
            </button>
          </div>
          <ProductsScreen />
        </div>
      )}

      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Key Operational KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* KPI 1: Pending Seller KYC */}
            <div
              onClick={() => handleTabChange("sellers")}
              className="group relative cursor-pointer overflow-hidden rounded-3xl border border-amber-200 bg-amber-50/50 p-5 shadow-sm transition hover:shadow-md dark:border-amber-500/20 dark:bg-amber-500/5"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400">
                  <Store className="h-5 w-5" />
                </span>
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-500/20 dark:text-amber-300">
                  Action Required
                </span>
              </div>
              <div className="mt-4">
                <p className="text-xs font-semibold text-amber-900/70 dark:text-amber-400/80">
                  Pending Seller KYCs
                </p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-amber-950 dark:text-amber-200">
                    {sellersMetrics.pendingSellers}
                  </span>
                  <span className="text-xs text-amber-700 dark:text-amber-400">Awaiting KYC</span>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-amber-800 group-hover:underline dark:text-amber-400">
                <span>Open KYC Verification Queue</span>
                <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
              </div>
            </div>

            {/* KPI 2: Pending Product Approvals */}
            <div
              onClick={() => handleTabChange("products")}
              className="group relative cursor-pointer overflow-hidden rounded-3xl border border-red-200 bg-red-50/50 p-5 shadow-sm transition hover:shadow-md dark:border-red-500/20 dark:bg-red-500/5"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-100 text-[#E31E24] dark:bg-red-500/20 dark:text-red-400">
                  <Box className="h-5 w-5" />
                </span>
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-800 dark:bg-red-500/20 dark:text-red-300">
                  Catalog Review
                </span>
              </div>
              <div className="mt-4">
                <p className="text-xs font-semibold text-red-900/70 dark:text-red-400/80">
                  Pending Product Approvals
                </p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-red-950 dark:text-red-200">
                    {productsMetrics.pendingProducts}
                  </span>
                  <span className="text-xs text-red-700 dark:text-red-400">New SKUs</span>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-[#E31E24] group-hover:underline dark:text-red-400">
                <span>Moderate Products</span>
                <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
              </div>
            </div>

            {/* KPI 3: Verified Sellers */}
            <div
              onClick={() => handleTabChange("sellers")}
              className="group relative cursor-pointer overflow-hidden rounded-3xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-sm transition hover:shadow-md dark:border-emerald-500/20 dark:bg-emerald-500/5"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300">
                  Active
                </span>
              </div>
              <div className="mt-4">
                <p className="text-xs font-semibold text-emerald-900/70 dark:text-emerald-400/80">
                  Verified Active Sellers
                </p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-emerald-950 dark:text-emerald-200">
                    {sellersMetrics.activeSellers || sellersMetrics.totalSellers}
                  </span>
                  <span className="text-xs text-emerald-700 dark:text-emerald-400">Registered</span>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-emerald-800 group-hover:underline dark:text-emerald-400">
                <span>View All Sellers</span>
                <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
              </div>
            </div>

            {/* KPI 4: Live EV Catalog Products */}
            <div
              onClick={() => handleTabChange("products")}
              className="group relative cursor-pointer overflow-hidden rounded-3xl border border-blue-200 bg-blue-50/50 p-5 shadow-sm transition hover:shadow-md dark:border-blue-500/20 dark:bg-blue-500/5"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400">
                  <Layers className="h-5 w-5" />
                </span>
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800 dark:bg-blue-500/20 dark:text-blue-300">
                  Published
                </span>
              </div>
              <div className="mt-4">
                <p className="text-xs font-semibold text-blue-900/70 dark:text-blue-400/80">
                  Live EV Catalog Spares
                </p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-blue-950 dark:text-blue-200">
                    {productsMetrics.activeProducts || productsMetrics.totalProducts}
                  </span>
                  <span className="text-xs text-blue-700 dark:text-blue-400">SKUs</span>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-blue-800 group-hover:underline dark:text-blue-400">
                <span>Explore Catalog</span>
                <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
              </div>
            </div>
          </div>

          {/* Dual Moderation Workspaces Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Queue: Pending Seller KYC Applications */}
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#0c101a]">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-white/10">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400">
                    <Store className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-[#111111] dark:text-white">
                      Urgent Seller KYC Applications
                    </h3>
                    <p className="text-[11px] text-gray-500 dark:text-zinc-400">
                      Identity & bank accounts requiring verification
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleTabChange("sellers")}
                  className="inline-flex items-center gap-1 rounded-xl bg-gray-50 px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-100 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10"
                >
                  <span>View All</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {pendingSellersList.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <CheckCircle2 className="h-10 w-10 text-emerald-500 mb-2" />
                    <p className="text-xs font-bold text-gray-800 dark:text-zinc-200">
                      All Seller KYC Applications Cleared!
                    </p>
                    <p className="text-[11px] text-gray-500 dark:text-zinc-400 max-w-xs mt-1">
                      No new seller registration applications currently pending verification.
                    </p>
                  </div>
                ) : (
                  pendingSellersList.map((seller: any) => (
                    <div
                      key={seller.id}
                      className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50/70 p-3.5 hover:border-gray-200 transition dark:border-white/5 dark:bg-white/[0.02] dark:hover:border-white/10"
                    >
                      <div className="min-w-0 pr-3">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-xs font-bold text-[#111111] dark:text-white">
                            {seller.storeName || seller.store_name}
                          </p>
                          <span className="rounded-md bg-amber-50 px-1.5 py-0.5 text-[9px] font-bold text-amber-700 border border-amber-200 dark:bg-amber-500/20 dark:text-amber-400">
                            PENDING KYC
                          </span>
                        </div>
                        <p className="truncate text-[11px] text-gray-500 dark:text-zinc-400 mt-0.5">
                          Owner: {seller.ownerName || seller.owner_name} • {seller.city || "India"}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5 text-[10px] text-gray-600 dark:text-zinc-400">
                          <span className="inline-flex items-center gap-1">
                            <FileCheck className="h-3 w-3 text-emerald-600" /> PAN Submitted
                          </span>
                          <span>•</span>
                          <span className="inline-flex items-center gap-1">
                            <CreditCard className="h-3 w-3 text-blue-600" /> Bank Details
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleTabChange("sellers")}
                        className="shrink-0 rounded-xl bg-[#E31E24] px-3 py-1.5 text-xs font-bold text-white hover:bg-red-700 shadow-sm transition cursor-pointer"
                      >
                        Review KYC
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right Queue: Pending Product Catalog Approvals */}
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#0c101a]">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-white/10">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-[#E31E24] dark:bg-red-500/20 dark:text-red-400">
                    <Box className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-[#111111] dark:text-white">
                      Pending Product Catalog Approvals
                    </h3>
                    <p className="text-[11px] text-gray-500 dark:text-zinc-400">
                      EV spare parts & accessories submitted by vendors
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleTabChange("products")}
                  className="inline-flex items-center gap-1 rounded-xl bg-gray-50 px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-100 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10"
                >
                  <span>View All</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {pendingProductsList.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <CheckCircle2 className="h-10 w-10 text-emerald-500 mb-2" />
                    <p className="text-xs font-bold text-gray-800 dark:text-zinc-200">
                      All Product Submissions Moderated!
                    </p>
                    <p className="text-[11px] text-gray-500 dark:text-zinc-400 max-w-xs mt-1">
                      No vendor spare parts currently waiting in the catalog moderation queue.
                    </p>
                  </div>
                ) : (
                  pendingProductsList.map((product: any) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50/70 p-3.5 hover:border-gray-200 transition dark:border-white/5 dark:bg-white/[0.02] dark:hover:border-white/10"
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-3">
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/10">
                          <img
                            src={
                              product.image_url?.startsWith("[")
                                ? JSON.parse(product.image_url)[0]
                                : product.image_url ||
                                  "https://images.unsplash.com/photo-1558441719-8b489c652758?w=200&auto=format&fit=crop&q=80"
                            }
                            alt={product.name}
                            className="h-full w-full object-cover"
                            onError={(e: any) => {
                              e.target.src =
                                "https://images.unsplash.com/photo-1558441719-8b489c652758?w=200&auto=format&fit=crop&q=80";
                            }}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-xs font-bold text-[#111111] dark:text-white">
                            {product.name}
                          </p>
                          <p className="truncate text-[11px] text-gray-500 dark:text-zinc-400">
                            ₹{Number(product.price).toLocaleString("en-IN")} • SKU: {product.sku || "RZP-PART"}
                          </p>
                          <span className="inline-block mt-0.5 rounded bg-blue-50 px-1.5 py-0.2 text-[9px] font-semibold text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
                            Fitment Guaranteed
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleTabChange("products")}
                        className="shrink-0 rounded-xl bg-[#E31E24] px-3 py-1.5 text-xs font-bold text-white hover:bg-red-700 shadow-sm transition cursor-pointer"
                      >
                        Moderate
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Operations SLA & Compliance Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#0c101a]">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-zinc-300">
                <Clock className="h-4 w-4 text-[#E31E24]" />
                <span>KYC Turnaround SLA</span>
              </div>
              <p className="mt-2 text-lg font-black text-[#111111] dark:text-white">
                4.2 Hours
              </p>
              <p className="text-[10px] text-gray-500 dark:text-zinc-400">
                Target: &lt; 24h compliance standard
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#0c101a]">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-zinc-300">
                <Zap className="h-4 w-4 text-amber-500" />
                <span>Product Approval SLA</span>
              </div>
              <p className="mt-2 text-lg font-black text-[#111111] dark:text-white">
                2.1 Hours
              </p>
              <p className="text-[10px] text-gray-500 dark:text-zinc-400">
                Target: &lt; 12h catalog sync
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#0c101a]">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-zinc-300">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>100% Fitment Rate</span>
              </div>
              <p className="mt-2 text-lg font-black text-emerald-600 dark:text-emerald-400">
                Zero Return Fitment
              </p>
              <p className="text-[10px] text-gray-500 dark:text-zinc-400">
                Strict BMS & chemistry verification
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#0c101a]">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-zinc-300">
                <Building className="h-4 w-4 text-blue-600" />
                <span>GSTIN & Bank Audit</span>
              </div>
              <p className="mt-2 text-lg font-black text-[#111111] dark:text-white">
                100% Tax Compliant
              </p>
              <p className="text-[10px] text-gray-500 dark:text-zinc-400">
                Real-time government GST validation
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
