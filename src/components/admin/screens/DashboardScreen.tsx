import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  IndianRupee,
  Package,
  Bike,
  Store,
  Clock,
  Star,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Zap,
  MapPin,
  TrendingUp,
  RefreshCw,
  Eye,
  Radio,
  Sliders,
  CheckCircle2,
  Activity,
  Layers,
  Sparkles,
  Search,
  ExternalLink,
  ChevronRight,
  Truck,
  Bike as BikeIcon,
  Tag,
  Wrench,
  Fuel,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { GlassCard } from "../glass/GlassCard";
import { GlassButton } from "../glass/GlassButton";
import { GlassDrawer } from "../glass/GlassDrawer";
import { StatusBadge } from "../glass/StatusBadge";
import { useAdminStore } from "@/mocks/admin/adminStore";
import { AdminOrder } from "@/mocks/admin/types";
import { toast } from "sonner";
import { SHOW_ADMIN_SELLERS } from "../mockFlags";

// 7-day revenue trend data
const REVENUE_DATA_7D = [
  { date: "08 Apr", revenue: 540000, orders: 182 },
  { date: "09 Apr", revenue: 620000, orders: 204 },
  { date: "10 Apr", revenue: 590000, orders: 195 },
  { date: "11 Apr", revenue: 710000, orders: 238 },
  { date: "12 Apr", revenue: 840000, orders: 280 },
  { date: "13 Apr", revenue: 790000, orders: 265 },
  { date: "14 Apr", revenue: 734500, orders: 244 },
];

const REVENUE_DATA_30D = [
  { date: "Week 1", revenue: 2840000, orders: 940 },
  { date: "Week 2", revenue: 3120000, orders: 1040 },
  { date: "Week 3", revenue: 3890000, orders: 1280 },
  { date: "Week 4", revenue: 4824500, orders: 1428 },
];

// Department demand breakdown
const CATEGORY_SHARE = [
  { name: "Electric Batteries", value: 42, color: "#E31E24" },
  { name: "Smart Chargers", value: 24, color: "#EA580C" },
  { name: "Brakes & Discs", value: 16, color: "#0284C7" },
  { name: "Bike Accessories", value: 12, color: "#7C3AED" },
  { name: "Riding Gear", value: 6, color: "#16A34A" },
];

// City volume and delivery velocity
const CITY_PERFORMANCE = [
  { city: "Bengaluru", orders: 620, revenue: 21.4, sla: "18m", color: "#E31E24" },
  { city: "Hyderabad", orders: 340, revenue: 11.8, sla: "26m", color: "#EA580C" },
  { city: "Chennai", orders: 240, revenue: 8.2, sla: "31m", color: "#0284C7" },
  { city: "Pune", orders: 180, revenue: 6.1, sla: "35m", color: "#7C3AED" },
  { city: "Mumbai", orders: 150, revenue: 5.2, sla: "38m", color: "#16A34A" },
];

export function DashboardScreen() {
  const { orders, products, riders, bikes } = useAdminStore();
  const [selectedCity, setSelectedCity] = useState<string>("Bengaluru");
  const [timeRange, setTimeRange] = useState<"7d" | "30d">("7d");
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  // Quick bike diagnostic selector state (matching landing page selector)
  const [selectedBikeId, setSelectedBikeId] = useState(bikes[0]?.id || "ather-450x");

  const revenueData = timeRange === "7d" ? REVENUE_DATA_7D : REVENUE_DATA_30D;

  const filteredOrders =
    selectedCity === "All"
      ? orders
      : orders.filter((o) => o.customerCity.toLowerCase() === selectedCity.toLowerCase());

  const recentOrders = filteredOrders.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* ─────────────────────────────────────────────────────────────
          1. HERO BANNER — STYLED IDENTICALLY TO RIDERZPRO LANDING PAGE
         ───────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white p-6 sm:p-8 shadow-xs">
        {/* Subtle red ambient light refraction */}
        <div className="pointer-events-none absolute -top-24 left-1/4 h-80 w-80 rounded-full bg-[#E31E24]/[0.05] blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-10 h-80 w-80 rounded-full bg-amber-500/[0.04] blur-3xl" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 items-center">
          {/* Left Column: Headline and Diagnostic Search */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3.5 py-1 text-xs font-semibold text-[#111111]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#E31E24]" />
                  <span className="relative h-2 w-2 rounded-full bg-[#E31E24]" />
                </span>
                128 riders delivering in Bengaluru now
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                100% Fitment Guaranteed
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.1] text-[#111111]">
              Power your fleet. <br />
              <span className="bg-gradient-to-r from-[#E31E24] via-emerald-600 to-emerald-700 bg-clip-text text-transparent">
                Parts that fit.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[#6B7280] max-w-xl leading-relaxed">
              Operations command center for EV batteries, smart chargers and verified replacement spares — matched to VIN, synchronized across sellers, delivered live.
            </p>

            {/* Quick Diagnostic Bar (Mirrors the Landing Page Hero Card) */}
            <div className="pt-2 max-w-xl">
              <div className="rounded-2xl border border-[#E5E7EB] bg-gray-50/80 p-2 sm:p-2.5 flex flex-col sm:flex-row gap-2">
                <div className="flex flex-1 items-center gap-2.5 rounded-xl border border-[#E5E7EB] bg-white px-3 py-2">
                  <BikeIcon className="h-4 w-4 text-[#E31E24]" />
                  <select
                    value={selectedBikeId}
                    onChange={(e) => setSelectedBikeId(e.target.value)}
                    className="w-full bg-transparent text-xs font-semibold text-[#111111] outline-none"
                  >
                    {bikes.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.brand} {b.model} · {b.voltage}V Diagnostic
                      </option>
                    ))}
                  </select>
                </div>

                <Link to="/admin/fitment">
                  <button className="flex h-10 w-full sm:w-auto items-center justify-center gap-1.5 rounded-xl bg-[#E31E24] hover:bg-[#CC181E] px-4 text-xs font-semibold text-white shadow-xs transition active:scale-95 cursor-pointer whitespace-nowrap">
                    <span>Fitment Matrix</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Exact Replica of Landing Page Floating Cards */}
          <div className="relative space-y-4">
            {/* 1. Live Order Card (#RZ48213 - Arriving in 18 min) */}
            <div className="rounded-3xl border border-[#E5E7EB] bg-white p-5 shadow-sm transition hover:shadow-md">
              <div className="flex items-center justify-between text-xs text-[#6B7280] font-medium">
                <span>Order #RZ48213</span>
                <span className="flex items-center gap-1.5 text-[#E31E24] font-semibold">
                  <span className="h-2 w-2 rounded-full bg-[#E31E24] animate-pulse" /> Live
                </span>
              </div>
              <p className="mt-1.5 font-display text-2xl font-bold tracking-tight text-[#111111]">
                Arriving in 18 min
              </p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
                <div className="h-full w-2/3 rounded-full bg-[#E31E24]" />
              </div>
              <div className="mt-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-[#E31E24] font-bold text-white text-xs shadow-xs">
                    RK
                  </span>
                  <div className="text-xs">
                    <p className="font-semibold text-[#111111]">Ravi Kumar</p>
                    <p className="text-[11px] text-[#6B7280]">2 pickups · Ather Rizta · 92% Battery</p>
                  </div>
                </div>
                <span className="rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold">
                  On Route
                </span>
              </div>
            </div>

            {/* 2. Fitment Verified Card */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-[#E31E24]">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#E31E24]">
                    <span>Fitment verified</span>
                    <span className="text-gray-300">·</span>
                    <span className="text-[#6B7280] font-normal">Chassis Validated</span>
                  </div>
                  <p className="text-xs text-[#111111] mt-0.5 font-medium">
                    VoltRide 60V 30Ah fits your <b>Ola S1 Pro 2023</b>
                  </p>
                </div>
              </div>
              <Link to="/admin/products" className="text-xs font-semibold text-[#E31E24] hover:underline">
                View SKU →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. KEY METRICS STAT CARDS (EXACT STYLE OF LANDING PAGE STAT PILLS)
         ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {[
          { label: "Total GMV (Apr)", value: "₹48.2L", trend: "+18.4%", positive: true },
          { label: "Orders Fulfilled", value: "1,428", trend: "+12.1%", positive: true },
          { label: "Active Riders", value: "142", trend: "118 on road", positive: true },
          { label: "Verified Sellers", value: "68", trend: "+4 this month", positive: true },
          { label: "Avg Delivery", value: "18m", trend: "-4m faster SLA", positive: true },
          { label: "Customer Rating", value: "4.82★", trend: "9.4k reviews", positive: true },
        ].map((stat, idx) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-2xs hover:shadow-xs transition"
          >
            <p className="font-display text-2xl font-bold tracking-tight text-[#E31E24] tabular-nums">
              {stat.value}
            </p>
            <p className="mt-0.5 text-xs text-[#6B7280] font-medium">{stat.label}</p>
            <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
              <span className="text-emerald-700 font-semibold">{stat.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. REVENUE TRENDS & CATEGORY BREAKDOWN
         ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Velocity Area Chart */}
        <div className="lg:col-span-2 rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-xs space-y-4 min-w-0 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#111111]">
                  Revenue & Order Velocity
                </h3>
                <span className="rounded-full bg-red-50 text-[#E31E24] border border-red-200 px-2 py-0.5 text-[10px] font-bold">
                  ₹ Lakhs
                </span>
              </div>
              <p className="text-xs text-[#6B7280] mt-0.5">
                Gross merchandise value across verified spare vendors
              </p>
            </div>

            <div className="flex items-center gap-1 rounded-xl border border-gray-200 bg-gray-50 p-1">
              <button
                onClick={() => setTimeRange("7d")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  timeRange === "7d"
                    ? "bg-[#E31E24] text-white shadow-2xs"
                    : "text-[#6B7280] hover:text-[#111111]"
                }`}
              >
                7 Days
              </button>
              <button
                onClick={() => setTimeRange("30d")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  timeRange === "30d"
                    ? "bg-[#E31E24] text-white shadow-2xs"
                    : "text-[#6B7280] hover:text-[#111111]"
                }`}
              >
                30 Days
              </button>
            </div>
          </div>

          <div className="h-64 w-full min-w-0 overflow-hidden">
            <ResponsiveContainer width="100%" height={256} minWidth={0} minHeight={0}>
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                  tickFormatter={(val) => `₹${val / 100000}L`}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const val = payload[0].value as number;
                      return (
                        <div className="rounded-xl border border-red-200 bg-white p-3 shadow-lg text-xs">
                          <p className="font-semibold text-gray-500">{label}</p>
                          <p className="font-bold text-[#E31E24] text-sm mt-0.5">
                            ₹{val.toLocaleString("en-IN")}
                          </p>
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
          </div>
        </div>

        {/* Category Share Donut */}
        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-xs space-y-4 min-w-0 overflow-hidden">
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-base font-bold text-[#111111]">Shop Departments</h3>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Category contribution to total dispatch volume
            </p>
          </div>

          <div className="h-44 w-full min-w-0 overflow-hidden">
            <ResponsiveContainer width="100%" height={176} minWidth={0} minHeight={0}>
              <PieChart>
                <Pie
                  data={CATEGORY_SHARE}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {CATEGORY_SHARE.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-xl border border-gray-200 bg-white p-2 shadow-md text-xs">
                          <p className="font-bold text-[#111111]">{data.name}</p>
                          <p className="text-[#E31E24] font-semibold">{data.value}% of orders</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 border-t border-gray-100 pt-3 text-xs">
            {CATEGORY_SHARE.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-[#4B5563]">{cat.name}</span>
                </div>
                <span className="font-bold text-[#111111]">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. CITY FULFILLMENT HUBS & LIVE BENGALURU MAP
         ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Operational Cities Performance */}
        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-xs space-y-4 min-w-0 overflow-hidden">
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-base font-bold text-[#111111]">Operational Hubs</h3>
            <p className="text-xs text-[#6B7280] mt-0.5">
              5 metro corridors with express 3-hour doorstep delivery
            </p>
          </div>

          <div className="space-y-3 pt-1">
            {CITY_PERFORMANCE.map((city) => (
              <div
                key={city.city}
                onClick={() => setSelectedCity(city.city)}
                className={`p-3 rounded-2xl border transition cursor-pointer ${
                  selectedCity === city.city
                    ? "border-[#E31E24] bg-red-50/40"
                    : "border-gray-100 bg-gray-50/60 hover:border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#E31E24]" />
                    <span className="text-[#111111]">{city.city}</span>
                    <span className="text-[#6B7280] font-normal">({city.orders} orders)</span>
                  </div>
                  <span className="text-[#E31E24] font-bold">₹{city.revenue}L</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] text-[#6B7280]">
                  <span>Avg Doorstep SLA</span>
                  <span className="font-bold text-emerald-700">{city.sla} SLA</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Bengaluru Fleet Radar Card */}
        <div className="lg:col-span-2 rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-xs space-y-4 min-w-0 overflow-hidden">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
                <h3 className="text-base font-bold text-[#111111]">
                  Live Bengaluru EV Radar
                </h3>
              </div>
              <p className="text-xs text-[#6B7280] mt-0.5">
                142 riders connected across Whitefield, Indiranagar, HSR, Koramangala & Bellandur
              </p>
            </div>

            <Link to="/admin/riders">
              <button className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-[#111111] hover:bg-gray-100 transition cursor-pointer">
                <span>View All Fleet</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </Link>
          </div>

          {/* Clean Light Tactical Map Canvas */}
          <div className="relative h-68 w-full rounded-2xl border border-gray-200 bg-[#F9FAFB] overflow-hidden flex items-center justify-center select-none">
            {/* Soft grid background */}
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "linear-gradient(to right, #E5E7EB 1px, transparent 1px), linear-gradient(to bottom, #E5E7EB 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />

            {/* Radar circles */}
            <div className="absolute h-56 w-56 rounded-full border border-red-200/60" />
            <div className="absolute h-36 w-36 rounded-full border border-red-300/60" />
            <div className="absolute h-18 w-18 rounded-full border border-red-400/60" />

            {/* Center Indiranagar Transit Hub */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="h-8 w-8 rounded-full bg-[#E31E24] text-white flex items-center justify-center shadow-md ring-4 ring-red-100">
                <Store className="h-4 w-4" />
              </div>
              <span className="mt-1 rounded-md bg-white border border-gray-200 px-2 py-0.5 text-[10px] font-bold text-[#111111] shadow-2xs">
                Indiranagar HQ Hub
              </span>
            </div>

            {/* Live Delivery Riders Plotted */}
            {riders.slice(0, 6).map((rider, i) => {
              const offsets = [
                { top: "25%", left: "28%" },
                { top: "68%", left: "72%" },
                { top: "35%", left: "75%" },
                { top: "72%", left: "25%" },
                { top: "22%", left: "64%" },
                { top: "54%", left: "20%" },
              ];
              const pos = offsets[i % offsets.length];

              return (
                <div
                  key={rider.id}
                  className="absolute z-20 group cursor-pointer"
                  style={{ top: pos.top, left: pos.left }}
                  onClick={() =>
                    toast.info(`Rider: ${rider.name}`, {
                      description: `Bike: ${rider.vehicle} · Battery: ${rider.batteryPct}% · Status: ${rider.status}`,
                    })
                  }
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm transition-transform hover:scale-125">
                    <BikeIcon className="h-3.5 w-3.5" />
                  </div>
                  <div className="hidden group-hover:block absolute bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-gray-200 bg-white px-2 py-1 text-[10px] font-semibold text-[#111111] shadow-md z-30">
                    {rider.name} ({rider.batteryPct}%)
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          5. LIVE ORDERS STREAM & OPERATIONS ACTIONS
         ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders Table */}
        <div className="lg:col-span-2 rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-xs space-y-4 min-w-0 overflow-hidden">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#E31E24] animate-pulse" />
              <h3 className="text-base font-bold text-[#111111]">
                Live Orders Stream
              </h3>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs font-semibold text-[#E31E24] hover:underline flex items-center gap-1"
            >
              <span>View all {orders.length} orders</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[#6B7280] font-semibold border-b border-gray-100">
                  <th className="pb-3">Order #</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">City</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/80 transition">
                    <td className="py-3 font-mono font-bold text-[#111111]">
                      {order.orderNumber}
                    </td>
                    <td className="py-3 font-semibold text-[#111111]">
                      {order.customerName}
                    </td>
                    <td className="py-3 text-[#6B7280]">{order.customerCity}</td>
                    <td className="py-3 font-bold text-[#111111] tabular-nums">
                      ₹{order.totalAmount.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3">
                      <StatusBadge status={order.status} size="sm" />
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="rounded-lg bg-gray-100 hover:bg-red-50 hover:text-[#E31E24] px-2.5 py-1 text-[11px] font-semibold text-[#111111] transition cursor-pointer inline-flex items-center gap-1"
                      >
                        <Eye className="h-3 w-3" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Priority Action Center */}
        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-xs space-y-4 min-w-0 overflow-hidden">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <h3 className="text-base font-bold text-[#111111]">Priority Actions</h3>
            </div>
            <span className="rounded-full bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 text-[10px] font-bold">
              Action Required
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {/* Low Inventory Alert */}
            <div className="rounded-2xl border border-red-200 bg-red-50/50 p-3.5 space-y-2">
              <div className="flex items-center justify-between font-bold text-[#E31E24]">
                <span className="flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Low Inventory Warning
                </span>
                <span className="font-mono text-[11px]">8 SKUs</span>
              </div>
              <p className="text-[#6B7280] text-[11px] leading-relaxed">
                VoltRide 60V NMC battery packs are below the safe buffer threshold in Bengaluru.
              </p>
              <Link to="/admin/products">
                <button className="w-full mt-1 rounded-xl bg-[#E31E24] hover:bg-[#CC181E] text-white font-semibold py-1.5 text-[11px] transition cursor-pointer">
                  Initiate Restock →
                </button>
              </Link>
            </div>

            {/* KYC Approvals (Only rendered if SHOW_ADMIN_SELLERS is enabled) */}
            {SHOW_ADMIN_SELLERS && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-3.5 space-y-2">
                <div className="flex items-center justify-between font-bold text-amber-800">
                  <span className="flex items-center gap-1.5">
                    <Store className="h-3.5 w-3.5" />
                    Seller KYC Verification
                  </span>
                  <span className="font-mono text-[11px]">2 Pending</span>
                </div>
                <p className="text-[#6B7280] text-[11px] leading-relaxed">
                  Telangana Smart Telematics & NeoRide EV spares await verification.
                </p>
                <Link to="/admin/sellers">
                  <button className="w-full mt-1 rounded-xl border border-amber-300 bg-white hover:bg-amber-100 text-amber-900 font-semibold py-1.5 text-[11px] transition cursor-pointer">
                    Review Seller Applications →
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          6. ORDER INSPECTION SLIDE-OVER DRAWER
         ───────────────────────────────────────────────────────────── */}
      {selectedOrder && (
        <GlassDrawer
          isOpen={Boolean(selectedOrder)}
          onClose={() => setSelectedOrder(null)}
          title={`Order #${selectedOrder.orderNumber}`}
          description={`Customer: ${selectedOrder.customerName} · ${selectedOrder.customerCity}`}
        >
          <div className="space-y-4 text-xs">
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#6B7280]">Status</span>
                <p className="text-sm font-bold text-[#111111]">{selectedOrder.status}</p>
              </div>
              <StatusBadge status={selectedOrder.status} />
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-4 space-y-1.5">
              <h4 className="font-bold text-[#111111]">Delivery Address</h4>
              <p className="text-[#4B5563]">{selectedOrder.shippingAddress}</p>
              <p className="text-[#6B7280]">Phone: {selectedOrder.customerPhone}</p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-4 space-y-2">
              <h4 className="font-bold text-[#111111]">Line Items</h4>
              {selectedOrder.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-1 border-b border-gray-100 last:border-none">
                  <div>
                    <p className="font-medium text-[#111111]">{item.productName}</p>
                    <p className="text-[11px] text-[#6B7280]">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-mono font-bold text-[#111111]">
                    ₹{item.unitPrice.toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-red-100 bg-red-50/50 p-4 flex items-center justify-between text-sm">
              <span className="font-bold text-[#111111]">Total Amount</span>
              <span className="font-mono font-extrabold text-[#E31E24] text-base">
                ₹{selectedOrder.totalAmount.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </GlassDrawer>
      )}
    </div>
  );
}
