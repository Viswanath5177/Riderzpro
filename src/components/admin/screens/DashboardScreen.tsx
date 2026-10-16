import React, { useState, useEffect, useTransition } from "react";
import { Link } from "@tanstack/react-router";
import {
  IndianRupee,
  Users,
  Store,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Eye,
  CheckCircle2,
  ShieldAlert,
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
  Package,
  Layers,
  Sparkles,
  ExternalLink,
  Plus,
  Lock,
  Unlock,
  Building,
  UserCheck,
  UserX,
  Clock,
  RotateCcw,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AnalyticsData {
  summaryCards: {
    totalCustomers: number;
    totalAdmins: number;
    totalVendors: number;
    pendingVendors: number;
    approvedVendors: number;
    frozenVendors: number;
    totalProducts: number;
    pendingProducts: number;
    approvedProducts: number;
    totalOrders: number;
    completedOrders: number;
    pendingOrders: number;
    cancelledOrders: number;
    grossSales: number;
    refunds: number;
    netRevenue: number;
  };
  selectedVendor: any | null;
  vendors: any[];
  revenueTrend: { date: string; revenue: number; orders: number }[];
  bestSellingProducts: {
    id: string;
    name: string;
    price: number;
    sellerId: string;
    storeName: string;
    unitsSold: number;
    totalSales: number;
  }[];
  recentOrders: {
    id: string;
    orderNumber: string;
    customerId: string;
    customerName: string;
    customerEmail: string;
    sellerId: string;
    storeName: string;
    status: string;
    paymentStatus: string;
    paymentMethod: string;
    totalAmount: number;
    refundAmount: number;
    deliveryAddress: string;
    createdAt: string;
  }[];
  categoryShare: { name: string; value: number; color: string }[];
  recentActivity: any[];
  meta: {
    isFiltered: boolean;
    vendorId: string | null;
    timeRange: string;
    timestamp: string;
  };
}

export function DashboardScreen() {
  const [selectedVendorId, setSelectedVendorId] = useState<string>("all");
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "all">("30d");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminsList, setAdminsList] = useState<any[]>([]);
  const [isProvisioningAdmin, setIsProvisioningAdmin] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminName, setNewAdminName] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");

  const [isFreezeModalOpen, setIsFreezeModalOpen] = useState(false);
  const [vendorToFreeze, setVendorToFreeze] = useState<any>(null);
  const [freezeReason, setFreezeReason] = useState("");
  const [freezeActionType, setFreezeActionType] = useState<"freeze" | "unfreeze">("freeze");

  const fetchAnalytics = async (vendorId = selectedVendorId, range = timeRange) => {
    try {
      setIsRefreshing(true);
      setError(null);
      const res = await fetch(
        `/api/superadmin/analytics?vendor_id=${encodeURIComponent(vendorId)}&time_range=${encodeURIComponent(range)}`,
        { credentials: "include" }
      );
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to load platform analytics from database.");
      }
      setData(json.data);
    } catch (err: any) {
      console.error("[DashboardScreen fetch error]:", err);
      setError(err?.message || "Failed to fetch analytics");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(selectedVendorId, timeRange);
  }, [selectedVendorId, timeRange]);

  const handleVendorChange = (newVendorId: string) => {
    setSelectedVendorId(newVendorId);
  };

  const handleOpenAdminModal = async () => {
    setIsAdminModalOpen(true);
    try {
      const res = await fetch("/api/superadmin/admins", { credentials: "include" });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setAdminsList(json.data);
      }
    } catch (err) {
      console.error("Failed to fetch admins list:", err);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail || !newAdminName || !newAdminPassword) {
      toast.error("Please fill in all fields.");
      return;
    }
    setIsProvisioningAdmin(true);
    try {
      const res = await fetch("/api/superadmin/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: newAdminEmail.trim().toLowerCase(),
          fullName: newAdminName.trim(),
          password: newAdminPassword,
          role: "ADMIN",
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to provision admin");
      }
      toast.success(json.message || "Unified Admin provisioned successfully.");
      setNewAdminEmail("");
      setNewAdminName("");
      setNewAdminPassword("");
      handleOpenAdminModal();
      fetchAnalytics();
    } catch (err: any) {
      toast.error(err.message || "Error provisioning admin.");
    } finally {
      setIsProvisioningAdmin(false);
    }
  };

  const handleToggleAdminStatus = async (adminId: string) => {
    try {
      const res = await fetch(`/api/superadmin/admins/${adminId}/toggle`, {
        method: "PUT",
        credentials: "include",
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to toggle status");
      toast.success(json.message);
      handleOpenAdminModal();
      fetchAnalytics();
    } catch (err: any) {
      toast.error(err.message || "Error updating admin status.");
    }
  };

  const handleExecuteFreezeAction = async () => {
    if (!freezeReason.trim()) {
      toast.error("A detailed reason is mandatory for account status modifications.");
      return;
    }
    try {
      const targetId = vendorToFreeze?.id;
      const res = await fetch(`/api/superadmin/vendors/${targetId}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          action: freezeActionType,
          reason: freezeReason.trim(),
        }),
      });
      // Fallback route check
      let json = await res.json();
      if (!res.ok || !json.success) {
        // Try specific subaction endpoint
        const res2 = await fetch(`/api/superadmin/vendors/${targetId}/${freezeActionType}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ reason: freezeReason.trim() }),
        });
        json = await res2.json();
        if (!res2.ok || !json.success) {
          throw new Error(json.error || "Failed to execute vendor account action.");
        }
      }

      toast.success(json.message || `Vendor account ${freezeActionType} action recorded.`);
      setIsFreezeModalOpen(false);
      setFreezeReason("");
      fetchAnalytics();
    } catch (err: any) {
      toast.error(err?.message || "Failed to update vendor account.");
    }
  };

  const summary = data?.summaryCards || {
    totalCustomers: 0,
    totalAdmins: 0,
    totalVendors: 0,
    pendingVendors: 0,
    approvedVendors: 0,
    frozenVendors: 0,
    totalProducts: 0,
    pendingProducts: 0,
    approvedProducts: 0,
    totalOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    cancelledOrders: 0,
    grossSales: 0,
    refunds: 0,
    netRevenue: 0,
  };

  return (
    <div className="space-y-6">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER CONTROLS BAR: VENDOR DROPDOWN & TIME FILTER
         ───────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#E31E24] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-xs shadow-red-500/20">
                <ShieldAlert className="h-3.5 w-3.5" /> SUPER ADMIN OVERSIGHT
              </span>
              <span className="rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold">
                Live Database Connected
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#111111] tracking-tight">
              Marketplace Analytics & Operational Governance
            </h1>
            <p className="text-xs sm:text-sm text-[#6B7280]">
              Audited live database records across customers, verified vendors, product catalog, and completed sales.
            </p>
          </div>

          {/* Controls: Vendor Selector + Date Filter + Refresh + Manage Admins */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Vendor Filter Dropdown */}
            <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50/80 px-3 py-2">
              <Store className="h-4 w-4 text-[#E31E24] shrink-0" />
              <select
                aria-label="Filter analytics by vendor"
                value={selectedVendorId}
                onChange={(e) => handleVendorChange(e.target.value)}
                className="bg-transparent text-xs font-bold text-[#111111] outline-none cursor-pointer max-w-[200px] truncate"
              >
                <option value="all">★ All Vendors (Platform-wide)</option>
                {(data?.vendors || []).map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.store_name} ({v.city || "India"}) — {v.account_status || v.status}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range Selector */}
            <div className="flex items-center gap-1 rounded-2xl border border-gray-200 bg-gray-50/80 p-1">
              {(["7d", "30d", "90d", "all"] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-bold transition",
                    timeRange === range
                      ? "bg-[#E31E24] text-white shadow-xs"
                      : "text-gray-600 hover:text-black"
                  )}
                >
                  {range === "all" ? "All Time" : range.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Refresh Button */}
            <button
              onClick={() => fetchAnalytics()}
              disabled={isRefreshing}
              aria-label="Refresh database analytics"
              className="flex h-9 w-9 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-100 transition shadow-2xs cursor-pointer disabled:opacity-50"
              title="Refresh Live Data"
            >
              <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin text-[#E31E24]")} />
            </button>

            {/* Manage Admins Button */}
            <button
              onClick={handleOpenAdminModal}
              className="inline-flex items-center gap-1.5 rounded-2xl bg-[#111827] hover:bg-black px-4 py-2 text-xs font-bold text-white transition shadow-xs cursor-pointer"
            >
              <Users className="h-3.5 w-3.5 text-red-400" />
              <span>Admin Accounts</span>
            </button>
          </div>
        </div>

        {/* Selected Vendor Inspection Banner (if filtering by a vendor) */}
        {data?.selectedVendor && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50/60 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white border border-red-200 flex items-center justify-center text-[#E31E24] font-black text-sm shadow-xs">
                {data.selectedVendor.storeName.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-[#111111]">
                    {data.selectedVendor.storeName}
                  </h3>
                  <span
                    className={cn(
                      "rounded-md px-2 py-0.5 text-[10px] font-extrabold uppercase",
                      data.selectedVendor.accountStatus === "FROZEN"
                        ? "bg-red-600 text-white"
                        : "bg-emerald-600 text-white"
                    )}
                  >
                    {data.selectedVendor.accountStatus}
                  </span>
                  <span className="rounded-md bg-gray-200/80 px-2 py-0.5 text-[10px] font-semibold text-gray-700">
                    ID: {data.selectedVendor.id}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-0.5">
                  Owner: {data.selectedVendor.ownerName} · {data.selectedVendor.city},{" "}
                  {data.selectedVendor.state} · Email: {data.selectedVendor.email}
                  {data.selectedVendor.freezeReason && (
                    <span className="block text-red-700 font-semibold mt-0.5">
                      Freeze Reason: {data.selectedVendor.freezeReason}
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {data.selectedVendor.accountStatus === "FROZEN" ? (
                <button
                  onClick={() => {
                    setVendorToFreeze(data.selectedVendor);
                    setFreezeActionType("unfreeze");
                    setIsFreezeModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white transition shadow-xs cursor-pointer"
                >
                  <Unlock className="h-3.5 w-3.5" />
                  <span>Unfreeze Vendor</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setVendorToFreeze(data.selectedVendor);
                    setFreezeActionType("freeze");
                    setIsFreezeModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 px-3 py-1.5 text-xs font-bold text-white transition shadow-xs cursor-pointer"
                >
                  <Lock className="h-3.5 w-3.5" />
                  <span>Freeze Account</span>
                </button>
              )}

              <button
                onClick={() => setSelectedVendorId("all")}
                className="inline-flex items-center gap-1 rounded-xl bg-white border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                <span>Reset to All</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. ALL 12 SUMMARY CARDS (QUERY-DRIVEN, CLICKABLE TO FILTERED RECORDS)
         ───────────────────────────────────────────────────────────── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Platform-Wide Audit Summary Cards (Live Database)
          </h2>
          <span className="text-[11px] text-gray-400">
            Click any metric to drill down into corresponding records
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
          {/* 1. Total Customers */}
          <Link
            to="/admin/customers"
            className="group rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-2xs hover:border-red-300 hover:shadow-xs transition"
          >
            <div className="flex items-center justify-between text-gray-500 text-xs font-medium">
              <span>Customers</span>
              <Users className="h-3.5 w-3.5 text-gray-400 group-hover:text-[#E31E24]" />
            </div>
            <p className="mt-1 font-display text-2xl font-bold tracking-tight text-[#111111] tabular-nums">
              {summary.totalCustomers.toLocaleString()}
            </p>
            <p className="mt-1 text-[11px] text-emerald-600 font-semibold">Registered active</p>
          </Link>

          {/* 2. Total Admins */}
          <button
            onClick={handleOpenAdminModal}
            className="text-left group rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-2xs hover:border-red-300 hover:shadow-xs transition cursor-pointer"
          >
            <div className="flex items-center justify-between text-gray-500 text-xs font-medium">
              <span>Admins</span>
              <ShieldAlert className="h-3.5 w-3.5 text-gray-400 group-hover:text-[#E31E24]" />
            </div>
            <p className="mt-1 font-display text-2xl font-bold tracking-tight text-[#111111] tabular-nums">
              {summary.totalAdmins}
            </p>
            <p className="mt-1 text-[11px] text-purple-600 font-semibold">Governing accounts</p>
          </button>

          {/* 3. Total Vendors */}
          <Link
            to="/admin/sellers"
            className="group rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-2xs hover:border-red-300 hover:shadow-xs transition"
          >
            <div className="flex items-center justify-between text-gray-500 text-xs font-medium">
              <span>Vendors</span>
              <Store className="h-3.5 w-3.5 text-gray-400 group-hover:text-[#E31E24]" />
            </div>
            <p className="mt-1 font-display text-2xl font-bold tracking-tight text-[#111111] tabular-nums">
              {summary.totalVendors}
            </p>
            <p className="mt-1 text-[11px] text-gray-500 font-medium">All store profiles</p>
          </Link>

          {/* 4. Pending Vendor Approvals */}
          <Link
            to="/admin/sellers"
            search={{ status: "PENDING_REVIEW" }}
            className="group rounded-2xl border border-amber-200 bg-amber-50/50 p-4 shadow-2xs hover:border-amber-400 hover:shadow-xs transition"
          >
            <div className="flex items-center justify-between text-amber-800 text-xs font-semibold">
              <span>Pending Vendors</span>
              <Clock className="h-3.5 w-3.5 text-amber-600" />
            </div>
            <p className="mt-1 font-display text-2xl font-bold tracking-tight text-amber-900 tabular-nums">
              {summary.pendingVendors}
            </p>
            <p className="mt-1 text-[11px] text-amber-700 font-medium">Awaiting KYC verification</p>
          </Link>

          {/* 5. Approved Vendors */}
          <Link
            to="/admin/sellers"
            search={{ status: "APPROVED" }}
            className="group rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-2xs hover:border-emerald-300 hover:shadow-xs transition"
          >
            <div className="flex items-center justify-between text-gray-500 text-xs font-medium">
              <span>Approved Vendors</span>
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            </div>
            <p className="mt-1 font-display text-2xl font-bold tracking-tight text-emerald-700 tabular-nums">
              {summary.approvedVendors}
            </p>
            <p className="mt-1 text-[11px] text-emerald-600 font-medium">Verified active partners</p>
          </Link>

          {/* 6. Frozen Vendors */}
          <Link
            to="/admin/sellers"
            search={{ status: "FROZEN" }}
            className={cn(
              "group rounded-2xl border p-4 shadow-2xs transition",
              summary.frozenVendors > 0
                ? "border-red-300 bg-red-50/40 text-red-900"
                : "border-[#E5E7EB] bg-white text-gray-900"
            )}
          >
            <div className="flex items-center justify-between text-xs font-medium text-gray-500">
              <span>Frozen Vendors</span>
              <Lock className="h-3.5 w-3.5 text-red-600" />
            </div>
            <p className="mt-1 font-display text-2xl font-bold tracking-tight tabular-nums text-red-600">
              {summary.frozenVendors}
            </p>
            <p className="mt-1 text-[11px] text-red-500 font-medium">Compliance locked</p>
          </Link>

          {/* 7. Total Products */}
          <Link
            to="/admin/products"
            className="group rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-2xs hover:border-red-300 hover:shadow-xs transition"
          >
            <div className="flex items-center justify-between text-gray-500 text-xs font-medium">
              <span>Total Products</span>
              <Package className="h-3.5 w-3.5 text-gray-400 group-hover:text-[#E31E24]" />
            </div>
            <p className="mt-1 font-display text-2xl font-bold tracking-tight text-[#111111] tabular-nums">
              {summary.totalProducts.toLocaleString()}
            </p>
            <p className="mt-1 text-[11px] text-gray-500 font-medium">Catalog parts</p>
          </Link>

          {/* 8. Pending Product Approvals */}
          <Link
            to="/admin/products"
            search={{ status: "pending_approval" }}
            className="group rounded-2xl border border-amber-200 bg-amber-50/50 p-4 shadow-2xs hover:border-amber-400 hover:shadow-xs transition"
          >
            <div className="flex items-center justify-between text-amber-800 text-xs font-semibold">
              <span>Pending Products</span>
              <Clock className="h-3.5 w-3.5 text-amber-600" />
            </div>
            <p className="mt-1 font-display text-2xl font-bold tracking-tight text-amber-900 tabular-nums">
              {summary.pendingProducts}
            </p>
            <p className="mt-1 text-[11px] text-amber-700 font-medium">Catalog certification queue</p>
          </Link>

          {/* 9. Approved Products */}
          <Link
            to="/admin/products"
            search={{ status: "approved" }}
            className="group rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-2xs hover:border-emerald-300 hover:shadow-xs transition"
          >
            <div className="flex items-center justify-between text-gray-500 text-xs font-medium">
              <span>Approved Products</span>
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            </div>
            <p className="mt-1 font-display text-2xl font-bold tracking-tight text-emerald-700 tabular-nums">
              {summary.approvedProducts}
            </p>
            <p className="mt-1 text-[11px] text-emerald-600 font-medium">Storefront eligible</p>
          </Link>

          {/* 10. Total Orders */}
          <Link
            to="/admin/orders"
            className="group rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-2xs hover:border-red-300 hover:shadow-xs transition"
          >
            <div className="flex items-center justify-between text-gray-500 text-xs font-medium">
              <span>Total Orders</span>
              <Layers className="h-3.5 w-3.5 text-gray-400 group-hover:text-[#E31E24]" />
            </div>
            <p className="mt-1 font-display text-2xl font-bold tracking-tight text-[#111111] tabular-nums">
              {summary.totalOrders}
            </p>
            <p className="mt-1 text-[11px] text-gray-500 font-medium">
              {summary.pendingOrders} in fulfillment
            </p>
          </Link>

          {/* 11. Completed Orders */}
          <Link
            to="/admin/orders"
            search={{ status: "completed" }}
            className="group rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-2xs hover:border-emerald-300 hover:shadow-xs transition"
          >
            <div className="flex items-center justify-between text-gray-500 text-xs font-medium">
              <span>Completed Orders</span>
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            </div>
            <p className="mt-1 font-display text-2xl font-bold tracking-tight text-emerald-700 tabular-nums">
              {summary.completedOrders}
            </p>
            <p className="mt-1 text-[11px] text-emerald-600 font-medium">Successfully delivered</p>
          </Link>

          {/* 12. Total Realized Net Revenue */}
          <div className="group rounded-2xl border-2 border-red-200 bg-red-50/70 p-4 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold text-[#E31E24]">
              <span>Realized Net Revenue</span>
              <IndianRupee className="h-3.5 w-3.5" />
            </div>
            <p className="mt-1 font-display text-2xl font-black tracking-tight text-[#E31E24] tabular-nums">
              ₹{summary.netRevenue.toLocaleString("en-IN")}
            </p>
            <div className="mt-1 flex items-center justify-between text-[10px] text-gray-600">
              <span>Gross: ₹{summary.grossSales.toLocaleString()}</span>
              {summary.refunds > 0 && <span className="text-red-700 font-semibold">-₹{summary.refunds.toLocaleString()}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. REVENUE TREND CHART & CATEGORY DEMAND BREAKDOWN
         ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Velocity Area Chart */}
        <div className="lg:col-span-2 rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-xs space-y-4 min-w-0 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#111111]">
                  Verified Revenue & Order Flow
                </h3>
                <span className="rounded-full bg-red-50 text-[#E31E24] border border-red-200 px-2 py-0.5 text-[10px] font-bold">
                  {selectedVendorId === "all" ? "Platform-wide" : "Vendor Filtered"}
                </span>
              </div>
              <p className="text-xs text-[#6B7280] mt-0.5">
                Authentic collected revenue minus recorded refunds over time.
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs text-gray-500">Selected Range Net</p>
              <p className="text-base font-black text-[#E31E24]">
                ₹{summary.netRevenue.toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          <div className="h-64 w-full min-w-0 overflow-hidden">
            {data?.revenueTrend && data.revenueTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height={256} minWidth={0} minHeight={0}>
                <AreaChart
                  data={data.revenueTrend}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="riderzproRedGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#E31E24" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#E31E24" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                  <XAxis dataKey="date" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="#9CA3AF"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const val = payload[0].value as number;
                        const ordersCount = payload[0].payload?.orders || 0;
                        return (
                          <div className="rounded-xl border border-red-200 bg-white p-3 shadow-lg text-xs">
                            <p className="font-semibold text-gray-500">{label}</p>
                            <p className="mt-1 font-bold text-[#E31E24]">
                              Revenue: ₹{val.toLocaleString()}
                            </p>
                            <p className="text-gray-600">Orders: {ordersCount}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#E31E24"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#riderzproRedGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400">
                <Layers className="h-8 w-8 text-gray-300 mb-2" />
                <p className="text-xs font-semibold text-gray-600">No transactions recorded for this period.</p>
                <p className="text-[11px] text-gray-400">Transactions will render live as orders are placed.</p>
              </div>
            )}
          </div>
        </div>

        {/* Category Share Distribution */}
        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-xs space-y-4">
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-base font-bold text-[#111111]">Category Distribution</h3>
            <p className="text-xs text-[#6B7280] mt-0.5">Catalog breakdown by EV spare department</p>
          </div>

          {data?.categoryShare && data.categoryShare.length > 0 ? (
            <div className="space-y-4">
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height={176}>
                  <PieChart>
                    <Pie
                      data={data.categoryShare}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={3}
                    >
                      {data.categoryShare.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any, name: any) => [`${value} parts`, name]}
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid #E5E7EB",
                        fontSize: "12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2 pt-2 border-t border-gray-100">
                {data.categoryShare.slice(0, 4).map((cat) => (
                  <div key={cat.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="text-[#111111] font-medium truncate max-w-[150px]">{cat.name}</span>
                    </div>
                    <span className="font-bold text-[#6B7280] tabular-nums">{cat.value} parts</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-xs text-gray-400">
              No categories mapped
            </div>
          )}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. BEST SELLING PRODUCTS & RECENT ORDERS TABLES
         ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Best Selling Products */}
        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-[#111111]">Best-Selling EV Spares</h3>
              <p className="text-xs text-[#6B7280]">Top performing components by realized revenue</p>
            </div>
            <Link to="/admin/products" className="text-xs font-bold text-[#E31E24] hover:underline">
              View Catalog →
            </Link>
          </div>

          <div className="overflow-x-auto">
            {data?.bestSellingProducts && data.bestSellingProducts.length > 0 ? (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 font-semibold">
                    <th className="pb-2">Product Name</th>
                    <th className="pb-2">Vendor</th>
                    <th className="pb-2 text-right">Price</th>
                    <th className="pb-2 text-right">Units</th>
                    <th className="pb-2 text-right">Total Sales</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.bestSellingProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/80 transition">
                      <td className="py-2.5 pr-2">
                        <p className="font-bold text-[#111111] truncate max-w-[180px]">{p.name}</p>
                        <p className="text-[10px] text-gray-400">SKU: {p.id}</p>
                      </td>
                      <td className="py-2.5 text-gray-600 truncate max-w-[120px]">{p.storeName}</td>
                      <td className="py-2.5 text-right font-medium text-gray-700">₹{p.price.toLocaleString()}</td>
                      <td className="py-2.5 text-right font-bold text-[#111111]">{p.unitsSold}</td>
                      <td className="py-2.5 text-right font-black text-[#E31E24]">₹{p.totalSales.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-8 text-center text-xs text-gray-400">
                No product sales recorded yet.
              </div>
            )}
          </div>
        </div>

        {/* Recent Orders and Real Transactions */}
        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-[#111111]">Recent Orders & Dispatches</h3>
              <p className="text-xs text-[#6B7280]">Live verified customer purchases</p>
            </div>
            <Link to="/admin/orders" className="text-xs font-bold text-[#E31E24] hover:underline">
              All Orders →
            </Link>
          </div>

          <div className="overflow-x-auto">
            {data?.recentOrders && data.recentOrders.length > 0 ? (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 font-semibold">
                    <th className="pb-2">Order #</th>
                    <th className="pb-2">Customer</th>
                    <th className="pb-2">Vendor</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.recentOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-gray-50/80 transition">
                      <td className="py-2.5 pr-2">
                        <p className="font-bold text-[#111111]">{o.orderNumber}</p>
                        <p className="text-[10px] text-gray-400">{o.createdAt?.substring(0, 10)}</p>
                      </td>
                      <td className="py-2.5 text-gray-700 truncate max-w-[120px]">{o.customerName}</td>
                      <td className="py-2.5 text-gray-600 truncate max-w-[110px]">{o.storeName}</td>
                      <td className="py-2.5">
                        <span
                          className={cn(
                            "rounded-md px-2 py-0.5 text-[10px] font-bold",
                            o.status === "completed" || o.status === "delivered"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : o.status === "refunded"
                              ? "bg-purple-50 text-purple-700 border border-purple-200"
                              : o.status === "cancelled"
                              ? "bg-red-50 text-red-700 border border-red-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          )}
                        >
                          {o.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-2.5 text-right font-black text-[#111111]">₹{o.totalAmount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-8 text-center text-xs text-gray-400">
                No orders placed in this period.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          5. ADMIN MANAGEMENT MODAL
         ───────────────────────────────────────────────────────────── */}
      {isAdminModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-red-50 text-[#E31E24] flex items-center justify-center font-bold">
                  <ShieldAlert className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Administrator Accounts & Roles</h3>
                  <p className="text-xs text-gray-500">Super Admin governance & Unified Admin management</p>
                </div>
              </div>
              <button
                onClick={() => setIsAdminModalOpen(false)}
                className="h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Existing Admins List */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Registered Administrative Accounts ({adminsList.length})
              </h4>
              <div className="max-h-56 overflow-y-auto space-y-2 border border-gray-100 rounded-2xl p-2 bg-gray-50/50">
                {adminsList.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-white border border-gray-200/80 shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-gray-900">{a.full_name}</span>
                        <span
                          className={cn(
                            "rounded-md px-1.5 py-0.5 text-[9px] font-black uppercase",
                            a.role === "SUPER_ADMIN"
                              ? "bg-red-100 text-[#E31E24] border border-red-200"
                              : "bg-blue-100 text-blue-800 border border-blue-200"
                          )}
                        >
                          {a.role === "SUPER_ADMIN" ? "Super Admin" : "Unified Admin"}
                        </span>
                        {!a.is_active && (
                          <span className="rounded-md bg-gray-200 text-gray-600 px-1.5 py-0.5 text-[9px] font-bold">
                            Deactivated
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{a.email}</p>
                    </div>

                    {a.role !== "SUPER_ADMIN" && (
                      <button
                        onClick={() => handleToggleAdminStatus(a.id)}
                        className={cn(
                          "px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer",
                          a.is_active
                            ? "bg-red-50 text-red-700 hover:bg-red-100"
                            : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        )}
                      >
                        {a.is_active ? "Deactivate" : "Activate"}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Provision New Unified Admin Form */}
            <form onSubmit={handleCreateAdmin} className="border-t border-gray-100 pt-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Provision New Unified Admin
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                  className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs outline-none focus:border-[#E31E24]"
                  required
                />
                <input
                  type="email"
                  placeholder="admin.name@riderzpro.com"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs outline-none focus:border-[#E31E24]"
                  required
                />
                <input
                  type="password"
                  placeholder="Secure Password"
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs outline-none focus:border-[#E31E24]"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdminModalOpen(false)}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isProvisioningAdmin}
                  className="rounded-xl bg-[#E31E24] hover:bg-[#CC181E] px-4 py-2 text-xs font-bold text-white shadow-xs transition disabled:opacity-50 cursor-pointer"
                >
                  {isProvisioningAdmin ? "Provisioning..." : "Create Unified Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          6. FREEZE / UNFREEZE VENDOR MODAL
         ───────────────────────────────────────────────────────────── */}
      {isFreezeModalOpen && vendorToFreeze && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-amber-600">
              <AlertTriangle className="h-5 w-5" />
              <h3 className="text-base font-bold text-gray-900">
                {freezeActionType === "freeze" ? "Freeze Vendor Account" : "Unfreeze Vendor Account"}
              </h3>
            </div>

            <p className="text-xs text-gray-600">
              You are about to {freezeActionType}{" "}
              <span className="font-bold text-gray-900">{vendorToFreeze.storeName || vendorToFreeze.store_name}</span>.
              {freezeActionType === "freeze"
                ? " This will immediately block product uploads, catalog additions, and storefront sales."
                : " This will restore normal selling and product publishing privileges."}
            </p>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">
                Mandatory Reason / Compliance Note <span className="text-red-500">*</span>
              </label>
              <textarea
                value={freezeReason}
                onChange={(e) => setFreezeReason(e.target.value)}
                placeholder="Specify the reason for this action (e.g., GSTIN verification failed, document updated and verified)..."
                rows={3}
                className="w-full rounded-xl border border-gray-200 p-2.5 text-xs outline-none focus:border-[#E31E24]"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsFreezeModalOpen(false)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteFreezeAction}
                className={cn(
                  "rounded-xl px-4 py-2 text-xs font-bold text-white shadow-xs transition cursor-pointer",
                  freezeActionType === "freeze" ? "bg-amber-600 hover:bg-amber-700" : "bg-emerald-600 hover:bg-emerald-700"
                )}
              >
                Confirm {freezeActionType === "freeze" ? "Freeze" : "Unfreeze"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
