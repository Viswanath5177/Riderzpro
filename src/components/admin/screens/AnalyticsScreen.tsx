import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Clock,
  MapPin,
  Calendar,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { GlassCard } from "../glass/GlassCard";
import { ChartCard, GlassTooltip } from "../glass/ChartCard";

const SLA_TREND = [
  { time: "09:00", avgMinutes: 32, deliveries: 45 },
  { time: "11:00", avgMinutes: 36, deliveries: 88 },
  { time: "13:00", avgMinutes: 44, deliveries: 120 },
  { time: "15:00", avgMinutes: 39, deliveries: 95 },
  { time: "17:00", avgMinutes: 48, deliveries: 140 },
  { time: "19:00", avgMinutes: 41, deliveries: 165 },
  { time: "21:00", avgMinutes: 35, deliveries: 80 },
];

const COHORT_DATA = [
  { cohort: "Jan 2026", m0: 100, m1: 72, m2: 58, m3: 49 },
  { cohort: "Feb 2026", m0: 100, m1: 76, m2: 63, m3: 55 },
  { cohort: "Mar 2026", m0: 100, m1: 81, m2: 69, m3: 0 },
  { cohort: "Apr 2026", m0: 100, m1: 85, m2: 0, m3: 0 },
];

export function AnalyticsScreen() {
  const [range, setRange] = useState<"7d" | "30d" | "90d">("30d");

  return (
    <div className="space-y-6">
      {/* Header with Date-Range Filter */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
            Analytics, Retention Cohorts & Delivery SLA
          </h1>
          <p className="text-sm text-[#4B5563] font-medium mt-1">
            Operational speed telemetry, customer lifetime cohorts and regional fulfillment benchmarks.
          </p>
        </div>

        <div className="flex rounded-2xl border border-[#E5E7EB] bg-gray-50/80 p-1 text-xs">
          {(["7d", "30d", "90d"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`rounded-xl px-3 py-1 font-bold transition cursor-pointer ${
                range === r ? "bg-[#E31E24] text-white shadow-xs" : "text-[#4B5563] hover:text-[#111111] hover:bg-gray-200/60"
              }`}
            >
              {r === "7d" ? "Last 7 Days" : r === "30d" ? "Last 30 Days" : "Last 90 Days"}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-5 shadow-2xs">
          <p className="text-xs font-bold text-[#6B7280] uppercase">On-Time Delivery SLA</p>
          <p className="font-display text-3xl font-extrabold text-emerald-700 mt-1 tabular-nums">96.8%</p>
          <p className="text-[11px] text-[#4B5563] font-medium mt-1">Under 45 minutes doorstep guarantee</p>
        </div>

        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-5 shadow-2xs">
          <p className="text-xs font-bold text-[#6B7280] uppercase">Repeat Purchase Rate</p>
          <p className="font-display text-3xl font-extrabold text-[#E31E24] mt-1 tabular-nums">48.2%</p>
          <p className="text-[11px] text-[#4B5563] font-medium mt-1">EV owners ordering additional spares in 60d</p>
        </div>

        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-5 shadow-2xs">
          <p className="text-xs font-bold text-[#6B7280] uppercase">Average Order Value (AOV)</p>
          <p className="font-display text-3xl font-extrabold text-sky-700 mt-1 tabular-nums">₹3,380</p>
          <p className="text-[11px] text-[#4B5563] font-medium mt-1">+14.2% driven by battery chargers</p>
        </div>
      </div>

      {/* Delivery SLA Velocity Chart */}
      <ChartCard
        title="Delivery SLA & Rush-Hour Peak Times"
        subtitle="Average minutes per dispatch vs delivery volume throughout the day"
        className="min-w-0 overflow-hidden"
      >
        <div className="h-64 w-full min-w-0 overflow-hidden">
          <ResponsiveContainer width="100%" height={256} minWidth={0} minHeight={0}>
            <LineChart data={SLA_TREND} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="time" stroke="#6B7280" fontSize={11} />
              <YAxis stroke="#6B7280" fontSize={11} unit="m" />
              <Tooltip content={<GlassTooltip suffix=" mins" />} />
              <Line
                type="monotone"
                dataKey="avgMinutes"
                name="Avg Time"
                stroke="#E31E24"
                strokeWidth={3}
                dot={{ r: 4, fill: "#E31E24" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Retention Cohort Heatmap */}
      <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4 mb-4">
          <div>
            <h3 className="font-bold text-sm text-[#111111]">Monthly Customer Retention Cohort Heatmap (%)</h3>
            <p className="text-xs text-[#4B5563] font-medium mt-0.5">
              Percentage of customers returning to purchase parts or book garage services.
            </p>
          </div>
          <span className="text-xs text-emerald-800 font-bold bg-emerald-50 border border-emerald-300 px-3 py-1 rounded-full">
            Industry Benchmark: Top 5%
          </span>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[#6B7280] uppercase font-bold border-b border-[#E5E7EB] bg-gray-50/70">
                <th className="p-3">Cohort Month</th>
                <th className="p-3 text-center">Month 0</th>
                <th className="p-3 text-center">Month 1</th>
                <th className="p-3 text-center">Month 2</th>
                <th className="p-3 text-center">Month 3</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6] font-mono">
              {COHORT_DATA.map((row) => (
                <tr key={row.cohort}>
                  <td className="p-3 font-bold text-[#111111] font-sans">{row.cohort}</td>
                  <td className="p-3 text-center">
                    <span className="rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 px-3 py-1 font-bold">100%</span>
                  </td>
                  <td className="p-3 text-center">
                    <span className="rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 px-3 py-1 font-bold">{row.m1}%</span>
                  </td>
                  <td className="p-3 text-center">
                    {row.m2 > 0 ? (
                      <span className="rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1 font-bold">{row.m2}%</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    {row.m3 > 0 ? (
                      <span className="rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1 font-bold">{row.m3}%</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
