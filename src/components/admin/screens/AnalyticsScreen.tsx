import React, { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  Award,
  Store,
  DollarSign,
  Package,
  RefreshCw,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  MapPin,
  ExternalLink,
  Users,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { GlassCard } from "../glass/GlassCard";
import { GlassButton } from "../glass/GlassButton";
import { GlassTooltip } from "../glass/ChartCard";

export interface SellerAnalyticsItem {
  id: string;
  store_name: string;
  owner_name: string;
  email: string;
  phone: string;
  city: string;
  state?: string;
  status: "APPROVED" | "PENDING_REVIEW" | "REJECTED" | "MORE_INFORMATION_REQUIRED";
  created_at: string;
  total_orders: number;
  total_revenue: number;
  weekly_revenue: number;
  weekly_orders: number;
}

export interface AnalyticsData {
  sellers: SellerAnalyticsItem[];
  weeklyTopSeller: SellerAnalyticsItem | null;
  metrics: {
    totalSellers: number;
    approvedSellers: number;
    pendingSellers: number;
    weeklyTotalRevenue: number;
    allTimeTotalRevenue: number;
    totalWeeklyOrders: number;
  };
}

export function AnalyticsScreen() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [range, setRange] = useState<"7d" | "30d" | "all">("7d");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "APPROVED" | "PENDING_REVIEW">("ALL");

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/sellers/analytics");
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
      } else {
        toast.error("Failed to load live seller analytics from database");
      }
    } catch (err: any) {
      console.error("Error fetching seller analytics:", err);
      toast.error("Failed to connect to analytics service");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const sellers = data?.sellers || [];
  const metrics = data?.metrics || {
    totalSellers: 0,
    approvedSellers: 0,
    pendingSellers: 0,
    weeklyTotalRevenue: 0,
    allTimeTotalRevenue: 0,
    totalWeeklyOrders: 0,
  };
  const topSeller = data?.weeklyTopSeller || (sellers.length > 0 ? sellers[0] : null);

  const filteredSellers = sellers.filter((s) => {
    const matchesSearch =
      s.store_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.owner_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.city?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Chart data: Top sellers by weekly revenue
  const chartData = sellers.slice(0, 7).map((s) => ({
    name: s.store_name?.length > 14 ? s.store_name.slice(0, 14) + "..." : s.store_name,
    weeklyRevenue: Number(s.weekly_revenue || 0),
    totalRevenue: Number(s.total_revenue || 0),
    orders: Number(s.weekly_orders || 0),
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
              Seller Directory & Revenue Analytics
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live DB Synced
            </span>
          </div>
          <p className="text-sm text-[#4B5563] font-medium mt-1">
            Real-time PostgreSQL tracking of weekly top sellers, GMV revenue distribution, and vendor compliance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <GlassButton
            onClick={loadAnalytics}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs font-semibold py-2 px-3"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </GlassButton>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Weekly Top Seller Card */}
        <div className="rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50/80 via-white to-amber-50/30 p-5 shadow-xs relative overflow-hidden">
          <div className="absolute -right-3 -top-3 h-20 w-20 rounded-full bg-amber-400/10 blur-xl pointer-events-none" />
          <div className="flex items-center justify-between text-xs font-bold text-amber-800 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Award className="h-4 w-4 text-amber-600" />
              Weekly Top Seller
            </span>
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] text-amber-900 border border-amber-300">
              #1 Ranked
            </span>
          </div>
          {topSeller ? (
            <div className="mt-3">
              <p className="font-display text-lg font-extrabold text-[#111111] truncate" title={topSeller.store_name}>
                {topSeller.store_name}
              </p>
              <div className="flex items-center gap-2 text-xs text-[#4B5563] mt-0.5 font-medium">
                <span className="truncate">{topSeller.owner_name}</span>
                {topSeller.city && (
                  <span className="inline-flex items-center gap-0.5 text-[11px] text-gray-500">
                    • {topSeller.city}
                  </span>
                )}
              </div>
              <div className="mt-2.5 flex items-baseline gap-2">
                <span className="text-2xl font-black text-[#111111]">
                  ₹{Number(topSeller.weekly_revenue || 0).toLocaleString("en-IN")}
                </span>
                <span className="text-xs text-[#6B7280] font-bold">this week</span>
              </div>
            </div>
          ) : (
            <p className="mt-3 text-sm text-[#6B7280]">No active vendor records in DB</p>
          )}
        </div>

        {/* Weekly Revenue Card */}
        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-bold text-[#6B7280] uppercase tracking-wider">
            <span>Weekly Revenue (GMV)</span>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="font-display text-3xl font-extrabold text-emerald-700 mt-2.5 tabular-nums">
            ₹{Number(metrics.weeklyTotalRevenue || 0).toLocaleString("en-IN")}
          </p>
          <p className="text-[11px] text-[#6B7280] font-medium mt-1">
            {metrics.totalWeeklyOrders} total orders processed this week
          </p>
        </div>

        {/* Total Registered Sellers Card */}
        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-bold text-[#6B7280] uppercase tracking-wider">
            <span>Registered Stores</span>
            <Store className="h-4 w-4 text-sky-600" />
          </div>
          <p className="font-display text-3xl font-extrabold text-[#111111] mt-2.5 tabular-nums">
            {metrics.totalSellers}
          </p>
          <div className="flex items-center gap-2 mt-1 text-[11px]">
            <span className="text-emerald-700 font-bold">{metrics.approvedSellers} Approved</span>
            <span className="text-gray-300">•</span>
            <span className="text-amber-700 font-bold">{metrics.pendingSellers} Pending KYC</span>
          </div>
        </div>

        {/* Marketplace All-Time Revenue */}
        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-bold text-[#6B7280] uppercase tracking-wider">
            <span>All-Time GMV</span>
            <TrendingUp className="h-4 w-4 text-[#E31E24]" />
          </div>
          <p className="font-display text-3xl font-extrabold text-[#E31E24] mt-2.5 tabular-nums">
            ₹{Number(metrics.allTimeTotalRevenue || 0).toLocaleString("en-IN")}
          </p>
          <p className="text-[11px] text-[#6B7280] font-medium mt-1">
            Estimated 10% Platform Commission: ₹
            {Math.round(Number(metrics.allTimeTotalRevenue || 0) * 0.1).toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* Revenue Distribution Chart */}
      {chartData.length > 0 && (
        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-[#E5E7EB]">
            <div>
              <h3 className="font-bold text-base text-[#111111]">Seller Revenue Comparison</h3>
              <p className="text-xs text-[#6B7280] font-medium mt-0.5">
                Weekly vs All-time gross merchandise volume by store
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 font-bold text-emerald-700">
                <span className="h-3 w-3 rounded-md bg-emerald-500" /> Weekly Revenue
              </span>
              <span className="flex items-center gap-1.5 font-bold text-gray-500">
                <span className="h-3 w-3 rounded-md bg-gray-300" /> Total Revenue
              </span>
            </div>
          </div>

          <div className="h-64 w-full min-w-0">
            <ResponsiveContainer width="100%" height={256}>
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="name" stroke="#6B7280" fontSize={11} />
                <YAxis stroke="#6B7280" fontSize={11} unit="₹" />
                <Tooltip content={<GlassTooltip prefix="₹" />} />
                <Bar dataKey="weeklyRevenue" name="Weekly Revenue" fill="#10B981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="totalRevenue" name="Total Revenue" fill="#D1D5DB" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Sellers List Table */}
      <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 mb-4 border-b border-[#E5E7EB]">
          <div>
            <h3 className="font-bold text-base text-[#111111]">Sellers Performance Directory</h3>
            <p className="text-xs text-[#6B7280] font-medium mt-0.5">
              Ranked list of verified vendors and stores registered in PostgreSQL
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search store, owner or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 w-52 sm:w-64 rounded-2xl border border-[#E5E7EB] bg-gray-50/70 pl-8 pr-3 text-xs font-medium text-[#111111] placeholder-gray-400 focus:border-[#E31E24] focus:bg-white focus:outline-none"
              />
            </div>

            {/* Filter */}
            <div className="flex rounded-2xl border border-[#E5E7EB] bg-gray-50 p-1 text-xs font-bold">
              {(["ALL", "APPROVED", "PENDING_REVIEW"] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`rounded-xl px-2.5 py-1 text-[11px] transition cursor-pointer ${
                    statusFilter === st
                      ? "bg-white text-[#111111] shadow-2xs"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {st === "ALL" ? "All" : st === "APPROVED" ? "Approved" : "Pending KYC"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-gray-50/70 text-[10px] font-extrabold uppercase text-[#6B7280]">
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Store Name & Owner</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">KYC Status</th>
                <th className="py-3 px-4 text-right">Weekly Orders</th>
                <th className="py-3 px-4 text-right">Weekly Revenue</th>
                <th className="py-3 px-4 text-right">Total Revenue</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6]">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-[#6B7280]">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin text-[#E31E24]" />
                      <span>Loading seller analytics from PostgreSQL...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredSellers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#6B7280]">
                    <Store className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p className="font-bold text-sm text-[#111111]">No seller records found</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {searchQuery
                        ? "No sellers matched your search criteria."
                        : "Vendors will appear here as soon as they submit applications via /vendor/signup."}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredSellers.map((s, idx) => {
                  const isTop = idx === 0 && Number(s.weekly_revenue || 0) >= 0;
                  return (
                    <tr key={s.id} className="hover:bg-gray-50/50 transition">
                      <td className="py-3.5 px-4 font-mono font-bold">
                        {isTop ? (
                          <span className="inline-flex items-center gap-1 text-amber-700 font-extrabold bg-amber-100 border border-amber-300 rounded-md px-1.5 py-0.5 text-[10px]">
                            🏆 #1
                          </span>
                        ) : (
                          <span className="text-gray-400">#{idx + 1}</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gray-100 font-bold text-xs text-[#111111]">
                            {s.store_name?.charAt(0) || "S"}
                          </div>
                          <div>
                            <p className="font-bold text-[#111111]">{s.store_name}</p>
                            <p className="text-[11px] text-[#6B7280]">{s.owner_name} • {s.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-gray-600 font-medium">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-gray-400" />
                          {s.city || "India"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {s.status === "APPROVED" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="h-3 w-3" /> Approved
                          </span>
                        ) : s.status === "PENDING_REVIEW" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
                            <Clock className="h-3 w-3" /> Pending KYC
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-[10px] font-bold text-red-700 border border-red-200">
                            <XCircle className="h-3 w-3" /> Rejected
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-[#111111]">
                        {s.weekly_orders || 0}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-extrabold text-emerald-700">
                        ₹{Number(s.weekly_revenue || 0).toLocaleString("en-IN")}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-[#111111]">
                        ₹{Number(s.total_revenue || 0).toLocaleString("en-IN")}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <Link
                          to="/admin/sellers"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#E31E24] hover:underline"
                        >
                          Review KYC
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
