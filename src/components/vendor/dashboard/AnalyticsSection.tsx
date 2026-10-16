import React from "react";
import {
  BarChart3,
  TrendingUp,
  Eye,
  ShoppingCart,
  CheckCircle2,
  Bike,
  MapPin,
  Sparkles,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { inr } from "@/lib/data";
import { Vendor } from "@/lib/vendor/types";

interface AnalyticsSectionProps {
  vendor: Vendor;
}

const BIKE_FITMENT_HITS = [
  { bike: "Ola S1 Pro", hits: 342, pct: "38%" },
  { bike: "Ather 450X", hits: 278, pct: "31%" },
  { bike: "Revolt RV400", hits: 142, pct: "16%" },
  { bike: "TVS iQube", hits: 88, pct: "10%" },
  { bike: "Bajaj Chetak", hits: 45, pct: "5%" },
];

const CITY_SALES = [
  { city: "Bengaluru", sales: 184000, color: "#E31E24" },
  { city: "Hyderabad", sales: 46000, color: "#2563EB" },
  { city: "Pune", sales: 32000, color: "#16A34A" },
  { city: "Chennai", sales: 22000, color: "#D97706" },
];

export function AnalyticsSection({ vendor }: AnalyticsSectionProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-display font-black text-xl text-gray-900">
          Store Analytics & Fitment Insights
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Track customer conversion funnel, bike compatibility search impressions, and geographical demand.
        </p>
      </div>

      {/* Conversion Funnel Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>Listing Page Views</span>
            <Eye className="h-4 w-4 text-blue-600" />
          </div>
          <p className="font-display text-2xl font-black text-gray-900 mt-2">14,820</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">+24% vs last month</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>Add-to-Cart Events</span>
            <ShoppingCart className="h-4 w-4 text-amber-600" />
          </div>
          <p className="font-display text-2xl font-black text-gray-900 mt-2">1,240</p>
          <p className="text-[11px] text-gray-500 mt-1">8.4% add-to-cart rate</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>Checkout Orders</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="font-display text-2xl font-black text-gray-900 mt-2">498</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">40.1% cart conversion</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span>Overall Conversion</span>
            <TrendingUp className="h-4 w-4 text-[#E31E24]" />
          </div>
          <p className="font-display text-2xl font-black text-gray-900 mt-2">3.36%</p>
          <p className="text-[11px] text-gray-400 mt-1">Marketplace benchmark: 2.8%</p>
        </div>
      </div>

      {/* Fitment Search Hits & City Sales Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fitment Search Hits by Bike Model */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-bold text-base text-gray-900 flex items-center gap-2">
                <Bike className="h-4 w-4 text-[#E31E24]" />
                Customer Fitment Searches
              </h3>
              <p className="text-xs text-gray-500">
                EV bike models customers are searching for that matched your inventory
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {BIKE_FITMENT_HITS.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-900">{item.bike}</span>
                  <span className="text-gray-500 font-mono">
                    {item.hits} searches ({item.pct})
                  </span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-red-500 to-[#E31E24] h-full rounded-full"
                    style={{ width: item.pct }}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-gray-400 mt-5 italic">
            Tip: Listing more 60V accessories increases your exposure to Ola S1 Pro and Ather owners.
          </p>
        </div>

        {/* City-wise Sales Distribution */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-bold text-base text-gray-900 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-600" />
                Hyperlocal & Regional Sales
              </h3>
              <p className="text-xs text-gray-500">Sales volume across serviceable cities</p>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CITY_SALES}>
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
                  {CITY_SALES.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
