import React from "react";
import {
  BarChart3,
  TrendingUp,
  Package,
  IndianRupee,
  CheckCircle2,
  Bike,
  MapPin,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import { inr } from "@/lib/data";
import { Vendor } from "@/lib/vendor/types";
import { useSellerOrders } from "../sellerOrdersApi";
import { useSellerInventory } from "../sellerInventoryApi";

interface AnalyticsSectionProps {
  vendor: Vendor;
}

const CITY_COLORS = ["#E31E24", "#2563EB", "#16A34A", "#D97706", "#9333EA", "#06B6D4"];

export function AnalyticsSection({ vendor }: AnalyticsSectionProps) {
  const { orders, loading: ordersLoading, refetch: refetchOrders } = useSellerOrders();
  const { products, loading: inventoryLoading } = useSellerInventory();

  // Real computed metrics from loaded orders
  const totalOrders = orders.length;
  const deliveredOrders = orders.filter((o) => o.status === "DELIVERED");
  const totalSales = orders
    .filter((o) => o.status !== "REJECTED" && o.status !== "CANCELLED")
    .reduce((sum, o) => sum + (o.amount || 0), 0);
  const avgOrderValue = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;

  // Real city sales computed from orders
  const citySalesMap: Record<string, number> = {};
  orders.forEach((o) => {
    if (o.status !== "REJECTED" && o.status !== "CANCELLED") {
      const city = o.deliveryCity || "Hyperlocal";
      citySalesMap[city] = (citySalesMap[city] || 0) + (o.amount || 0);
    }
  });

  const citySalesData = Object.entries(citySalesMap).map(([city, sales], index) => ({
    city,
    sales,
    color: CITY_COLORS[index % CITY_COLORS.length],
  }));

  // Real top selling products computed from loaded orders
  const productQtyMap: Record<string, number> = {};
  orders.forEach((o) => {
    o.items?.forEach((item) => {
      productQtyMap[item.name] = (productQtyMap[item.name] || 0) + (item.qty || 1);
    });
  });

  const topProducts = Object.entries(productQtyMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, qty]) => ({ name, qty }));

  const isLoading = ordersLoading || inventoryLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-black text-xl text-gray-900">
            Store Analytics & Sales Performance
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Real sales performance derived from verified customer orders and live store inventory.
          </p>
        </div>

        <button
          onClick={() => refetchOrders()}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 shadow-2xs transition cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
          <span>Refresh Analytics</span>
        </button>
      </div>

      {/* Real Computed KPI Strip (No invented percentages or mock funnel) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>Total Orders</span>
            <Package className="h-4 w-4 text-blue-600" />
          </div>
          {ordersLoading ? (
            <div className="h-8 w-16 bg-gray-100 rounded-lg animate-pulse mt-2" />
          ) : (
            <p className="font-display text-2xl font-black text-gray-900 mt-2">{totalOrders}</p>
          )}
          <p className="text-[11px] text-gray-400 mt-1">Store order volume</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>Delivered Orders</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          {ordersLoading ? (
            <div className="h-8 w-16 bg-gray-100 rounded-lg animate-pulse mt-2" />
          ) : (
            <p className="font-display text-2xl font-black text-emerald-600 mt-2">
              {deliveredOrders.length}
            </p>
          )}
          <p className="text-[11px] text-gray-400 mt-1">Successfully fulfilled</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>Gross Sales</span>
            <IndianRupee className="h-4 w-4 text-[#E31E24]" />
          </div>
          {ordersLoading ? (
            <div className="h-8 w-24 bg-gray-100 rounded-lg animate-pulse mt-2" />
          ) : (
            <p className="font-display text-2xl font-black text-gray-900 mt-2 truncate">
              {inr(totalSales)}
            </p>
          )}
          <p className="text-[11px] text-gray-400 mt-1">Active & fulfilled orders</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>Avg Order Value</span>
            <TrendingUp className="h-4 w-4 text-amber-600" />
          </div>
          {ordersLoading ? (
            <div className="h-8 w-20 bg-gray-100 rounded-lg animate-pulse mt-2" />
          ) : (
            <p className="font-display text-2xl font-black text-gray-900 mt-2">
              {inr(avgOrderValue)}
            </p>
          )}
          <p className="text-[11px] text-gray-400 mt-1">Revenue per order</p>
        </div>
      </div>

      {/* Real Orders Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real City-wise Sales Distribution */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-bold text-base text-gray-900 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-600" />
                Hyperlocal & Regional Sales
              </h3>
              <p className="text-xs text-gray-500">Sales volume across customer delivery cities</p>
            </div>
          </div>

          {citySalesData.length > 0 ? (
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={citySalesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis dataKey="city" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#9CA3AF" }}
                    axisLine={false}
                    tickFormatter={(v) => `₹${v / 1000}k`}
                  />
                  <Tooltip
                    formatter={(val: any) => [`₹${Number(val).toLocaleString("en-IN")}`, "Sales"]}
                    contentStyle={{ borderRadius: "16px", border: "1px solid #E5E7EB" }}
                  />
                  <Bar dataKey="sales" radius={[8, 8, 0, 0]}>
                    {citySalesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-48 flex flex-col items-center justify-center text-center text-gray-400 text-xs">
              <MapPin className="h-8 w-8 text-gray-300 mb-2" />
              <p className="font-semibold text-gray-600">No geographical sales recorded yet</p>
              <p className="text-gray-400 mt-0.5">City distribution will populate as orders arrive.</p>
            </div>
          )}
        </div>

        {/* Real Top Selling Products from live orders */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-bold text-base text-gray-900 flex items-center gap-2">
                <Package className="h-4 w-4 text-[#E31E24]" />
                Top Ordered Products
              </h3>
              <p className="text-xs text-gray-500">Products with highest dispatch volume</p>
            </div>
          </div>

          {topProducts.length > 0 ? (
            <div className="space-y-3 pt-2">
              {topProducts.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-gray-900 truncate max-w-[260px]">{item.name}</span>
                    <span className="text-gray-500 font-mono">
                      {item.qty} {item.qty === 1 ? "unit" : "units"}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-red-500 to-[#E31E24] h-full rounded-full"
                      style={{
                        width: `${Math.min(100, Math.round((item.qty / (topProducts[0]?.qty || 1)) * 100))}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-48 flex flex-col items-center justify-center text-center text-gray-400 text-xs">
              <Package className="h-8 w-8 text-gray-300 mb-2" />
              <p className="font-semibold text-gray-600">No product orders recorded yet</p>
              <p className="text-gray-400 mt-0.5">Top-selling items will rank here based on orders.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
