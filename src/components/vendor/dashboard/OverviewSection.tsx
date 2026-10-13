import React from "react";
import {
  TrendingUp,
  Package,
  AlertTriangle,
  Clock,
  IndianRupee,
  Star,
  CheckCircle2,
  ArrowUpRight,
  ShieldAlert,
  ShieldCheck,
  ChevronRight,
  Zap,
  Sparkles,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { inr } from "@/lib/data";
import { Vendor, VendorProduct } from "@/lib/vendor/types";
import { Order } from "@/lib/store";

interface OverviewSectionProps {
  vendor: Vendor;
  products: VendorProduct[];
  orders: Order[];
  onNavigateTab: (tab: string) => void;
}

const SALES_DATA = [
  { day: "Mon", sales: 42000, orders: 4 },
  { day: "Tue", sales: 68000, orders: 7 },
  { day: "Wed", sales: 51000, orders: 5 },
  { day: "Thu", sales: 94000, orders: 11 },
  { day: "Fri", sales: 112000, orders: 13 },
  { day: "Sat", sales: 145000, orders: 18 },
  { day: "Sun", sales: 128000, orders: 15 },
];

export function OverviewSection({
  vendor,
  products,
  orders,
  onNavigateTab,
}: OverviewSectionProps) {
  // Compute KPIs
  const vendorOrders = orders.filter((o) =>
    o.groups.some((g) => g.vendorId === vendor.id)
  );

  const pendingOrders = vendorOrders.filter((o) => o.status === 0 || o.status === 1);
  const lowStockProducts = products.filter(
    (p) => p.stock <= (p.minStockAlert || 5) && p.status === "live"
  );
  const pendingProductApprovals = products.filter(
    (p) => p.status === "pending_review" || p.pendingRevision
  );

  const totalRevenue = vendorOrders.reduce((sum, o) => {
    const grp = o.groups.find((g) => g.vendorId === vendor.id);
    return sum + (grp?.subtotal || 0);
  }, 284000); // Seed demo total

  return (
    <div className="space-y-6">
      {/* Action Center Banner */}
      {(pendingOrders.length > 0 || lowStockProducts.length > 0 || pendingProductApprovals.length > 0) && (
        <div className="rounded-3xl border border-red-200 bg-gradient-to-r from-red-50 via-white to-orange-50 p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-2xl bg-[#E31E24] text-white flex items-center justify-center shrink-0 shadow-sm">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-sm text-gray-900">
                  Seller Action Center
                </h3>
                <p className="text-xs text-gray-600 mt-0.5">
                  {pendingOrders.length > 0 && `${pendingOrders.length} orders waiting for acceptance · `}
                  {lowStockProducts.length > 0 && `${lowStockProducts.length} items running low on stock · `}
                  {pendingProductApprovals.length > 0 && `${pendingProductApprovals.length} products under review`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {pendingOrders.length > 0 && (
                <button
                  onClick={() => onNavigateTab("orders")}
                  className="rounded-xl bg-[#E31E24] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-red-700 transition cursor-pointer"
                >
                  Accept Orders
                </button>
              )}
              {lowStockProducts.length > 0 && (
                <button
                  onClick={() => onNavigateTab("inventory")}
                  className="rounded-xl border border-gray-300 bg-white px-3.5 py-1.5 text-xs font-bold text-gray-800 hover:bg-gray-100 transition cursor-pointer"
                >
                  Restock
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's / Total Revenue */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>Weekly Sales</span>
            <span className="h-7 w-7 rounded-xl bg-red-50 text-[#E31E24] flex items-center justify-center">
              <IndianRupee className="h-4 w-4" />
            </span>
          </div>
          <p className="font-display text-2xl font-black text-gray-900 mt-2">
            {inr(totalRevenue)}
          </p>
          <div className="mt-1 flex items-center gap-1 text-[11px] font-bold text-emerald-600">
            <TrendingUp className="h-3 w-3" />
            <span>+18.4% vs last week</span>
          </div>
        </div>

        {/* Orders Pending Acceptance */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>Orders to Accept</span>
            <span className="h-7 w-7 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="h-4 w-4" />
            </span>
          </div>
          <p className="font-display text-2xl font-black text-gray-900 mt-2">
            {pendingOrders.length || 2}
          </p>
          <p className="text-[11px] text-gray-400 mt-1">SLA: Accept within 15 mins</p>
        </div>

        {/* Low Stock Alerts */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>Low Stock Items</span>
            <span className="h-7 w-7 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4" />
            </span>
          </div>
          <p className="font-display text-2xl font-black text-gray-900 mt-2">
            {lowStockProducts.length || 1}
          </p>
          <p className="text-[11px] text-rose-600 font-semibold mt-1">Auto-hides at 0 units</p>
        </div>

        {/* Merchant Rating */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>Store Rating</span>
            <span className="h-7 w-7 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
              <Star className="h-4 w-4 fill-amber-400" />
            </span>
          </div>
          <div className="flex items-baseline gap-1 mt-2">
            <p className="font-display text-2xl font-black text-gray-900">
              {vendor.rating || 4.8}
            </p>
            <span className="text-xs text-gray-400 font-semibold">/ 5.0</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">99.2% positive feedback</p>
        </div>
      </div>

      {/* Sales Velocity Chart & Account Health Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart (2 cols) */}
        <div className="lg:col-span-2 rounded-3xl border border-gray-200 bg-white p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-bold text-base text-gray-900">
                Revenue & Sales Velocity
              </h3>
              <p className="text-xs text-gray-500">Gross order volume past 7 days</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
              Live Hyperlocal Dispatch
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SALES_DATA}>
                <defs>
                  <linearGradient id="vendorSalesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E31E24" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#E31E24" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} />
                <YAxis
                  tick={{ fontSize: 11, fill: "#9CA3AF" }}
                  axisLine={false}
                  tickFormatter={(v) => `₹${v / 1000}k`}
                />
                <Tooltip
                  formatter={(val: any) => [`₹${Number(val).toLocaleString("en-IN")}`, "Sales"]}
                  contentStyle={{
                    borderRadius: "16px",
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#E31E24"
                  strokeWidth={2.5}
                  fill="url(#vendorSalesGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Account Health Card */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-base text-gray-900">Account Health</h3>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" /> Excellent
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-500 font-medium">Late Dispatch Rate:</span>
                  <span className="font-bold text-emerald-700">0.8% (&lt; 4% target)</span>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[20%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-500 font-medium">Seller Cancellation:</span>
                  <span className="font-bold text-emerald-700">0.2% (&lt; 2.5% target)</span>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[10%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-500 font-medium">Return Rate:</span>
                  <span className="font-bold text-gray-700">1.4% (&lt; 5% target)</span>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[28%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-500 font-medium">Customer Rating:</span>
                  <span className="font-bold text-emerald-700">4.8 / 5.0</span>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[96%]" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-gray-50 p-3 border border-gray-100 text-[11px] text-gray-600">
            <span className="font-bold text-gray-900 block mb-0.5">Gold Seller Status</span>
            Your store meets all performance criteria for the top-tier 8% commission rate.
          </div>
        </div>
      </div>

      {/* Top Performing Catalog Items */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display font-bold text-base text-gray-900">
              Top Catalog Products
            </h3>
            <p className="text-xs text-gray-500">Fastest selling SKUs by demand</p>
          </div>
          <button
            onClick={() => onNavigateTab("products")}
            className="text-xs font-bold text-[#E31E24] hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            Manage Catalog <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="divide-y divide-gray-100">
          {products.slice(0, 4).map((p) => (
            <div key={p.id} className="py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={p.images?.[0] || "https://images.unsplash.com/photo-1558441719-8b489c652758?w=200&auto=format&fit=crop&q=80"}
                  alt={p.title}
                  className="h-10 w-10 rounded-xl object-cover border border-gray-200 shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-bold text-xs text-gray-900 truncate">{p.title}</p>
                  <p className="text-[11px] text-gray-400 font-mono">
                    SKU: {p.sku} · {p.category}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <p className="font-bold text-xs text-gray-900">{inr(p.sellingPrice)}</p>
                <p className={`text-[11px] font-semibold ${p.stock > 5 ? "text-emerald-700" : "text-rose-600"}`}>
                  {p.stock} units left
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
