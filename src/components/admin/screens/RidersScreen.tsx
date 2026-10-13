import React, { useState } from "react";
import {
  Bike,
  MapPin,
  Battery,
  Star,
  CheckCircle2,
  Ban,
  Phone,
  FileCheck,
  Zap,
  TrendingUp,
} from "lucide-react";
import { GlassCard } from "../glass/GlassCard";
import { GlassButton } from "../glass/GlassButton";
import { DataTable, Column } from "../glass/DataTable";
import { StatusBadge } from "../glass/StatusBadge";
import { GlassDrawer } from "../glass/GlassDrawer";
import { useAdminStore } from "@/mocks/admin/adminStore";
import { AdminRider } from "@/mocks/admin/types";

export function RidersScreen() {
  const { riders, toggleRiderStatus } = useAdminStore();
  const [selectedRider, setSelectedRider] = useState<AdminRider | null>(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [activeMapView, setActiveMapView] = useState(false);

  const filterTabs = [
    { label: "All Fleet", value: "ALL", count: riders.length },
    { label: "Delivering", value: "Delivering", count: riders.filter((r) => r.status === "Delivering").length },
    { label: "Online (Idle)", value: "Online", count: riders.filter((r) => r.status === "Online").length },
    { label: "Offline", value: "Offline", count: riders.filter((r) => r.status === "Offline").length },
  ];

  const columns: Column<AdminRider>[] = [
    {
      key: "name",
      header: "Rider",
      sortable: true,
      render: (r) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#E31E24] to-orange-500 font-bold text-white text-xs shadow-xs">
            {r.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-[#111111] text-sm">{r.name}</p>
            <p className="text-xs text-[#4B5563] font-medium">{r.phone}</p>
          </div>
        </div>
      ),
    },
    {
      key: "zone",
      header: "Assigned Zone",
      sortable: true,
      render: (r) => (
        <div>
          <p className="font-bold text-[#111111] text-xs">{r.zone}</p>
          <p className="text-[10px] text-[#6B7280] font-medium">{r.city}</p>
        </div>
      ),
    },
    {
      key: "vehicle",
      header: "Registered EV",
      render: (r) => (
        <div className="flex items-center gap-1.5">
          <Bike className="h-3.5 w-3.5 text-[#E31E24]" />
          <span className="text-[#111111] text-xs font-semibold">{r.vehicle}</span>
        </div>
      ),
    },
    {
      key: "batteryPct",
      header: "Battery SoC",
      sortable: true,
      render: (r) => (
        <div className="flex items-center gap-1.5 font-bold tabular-nums">
          <Battery className={`h-4 w-4 ${r.batteryPct > 50 ? "text-emerald-600" : "text-amber-600"}`} />
          <span className={r.batteryPct > 50 ? "text-emerald-700" : "text-amber-700"}>{r.batteryPct}%</span>
        </div>
      ),
    },
    {
      key: "todayEarnings",
      header: "Today Earnings",
      sortable: true,
      render: (r) => (
        <span className="font-bold text-[#111111] tabular-nums text-xs">₹{r.todayEarnings.toLocaleString("en-IN")}</span>
      ),
    },
    {
      key: "rating",
      header: "Rating",
      sortable: true,
      render: (r) => (
        <span className="font-bold text-[#B45309] flex items-center gap-0.5 text-xs">
          <Star className="h-3.5 w-3.5 fill-[#F59E0B] text-[#F59E0B]" />
          <span>{r.rating}</span>
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (r) => <StatusBadge status={r.status} size="sm" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
            Delivery Fleet Operations & Live GPS
          </h1>
          <p className="text-sm text-[#4B5563] font-medium mt-1">
            Real-time electric two-wheeler courier telemetry, battery monitoring and doorstep dispatch assignments.
          </p>
        </div>

        <GlassButton
          variant={activeMapView ? "primary" : "secondary"}
          size="sm"
          onClick={() => setActiveMapView(!activeMapView)}
        >
          <MapPin className="h-3.5 w-3.5" />
          <span>{activeMapView ? "Hide Live Radar" : "Show Bengaluru Radar"}</span>
        </GlassButton>
      </div>

      {/* Live Bengaluru Radar Visualizer if toggled */}
      {activeMapView && (
        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between mb-3 border-b border-[#E5E7EB] pb-2">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <h3 className="font-bold text-sm text-[#111111]">Live Bengaluru GPS Coordinates Radar</h3>
            </div>
            <span className="text-xs text-[#6B7280] font-mono font-bold">142 connected nodes</span>
          </div>

          <div className="relative h-64 w-full rounded-2xl bg-gray-900 border border-gray-700 overflow-hidden flex items-center justify-center">
            {/* Radar circles */}
            <div className="absolute h-52 w-52 rounded-full border border-red-500/30" />
            <div className="absolute h-32 w-32 rounded-full border border-red-500/40" />
            <div className="absolute h-14 w-14 rounded-full border border-red-500/50" />

            {/* Rider pins */}
            {riders.map((r, i) => {
              const offsets = [
                { top: "18%", left: "22%" },
                { top: "28%", left: "55%" },
                { top: "68%", left: "30%" },
                { top: "75%", left: "68%" },
                { top: "45%", left: "80%" },
                { top: "52%", left: "15%" },
                { top: "82%", left: "45%" },
                { top: "35%", left: "38%" },
              ];
              const pos = offsets[i % offsets.length];

              return (
                <div
                  key={r.id}
                  onClick={() => setSelectedRider(r)}
                  className="absolute cursor-pointer group"
                  style={{ top: pos.top, left: pos.left }}
                >
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E31E24] text-white shadow-md animate-pulse">
                    <Bike className="h-3 w-3" />
                  </div>
                  <span className="hidden group-hover:inline-block absolute left-6 -top-2 rounded-lg bg-white border border-gray-200 px-2.5 py-1 text-[11px] font-bold text-[#111111] shadow-lg whitespace-nowrap z-20">
                    {r.name} · {r.batteryPct}% SoC
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Table */}
      <DataTable
        data={riders}
        columns={columns}
        searchPlaceholder="Search rider name, phone, zone or vehicle..."
        searchKey={(r) => `${r.name} ${r.phone} ${r.zone} ${r.vehicle} ${r.city}`}
        filterTabs={filterTabs}
        currentFilter={statusFilter}
        onFilterChange={setStatusFilter}
        filterPredicate={(r, filter) => r.status === filter}
        onRowClick={(rider) => setSelectedRider(rider)}
        keyExtractor={(r) => r.id}
        exportFileName="riderzpro_riders"
      />

      {/* Rider Detail Drawer */}
      <GlassDrawer
        isOpen={Boolean(selectedRider)}
        onClose={() => setSelectedRider(null)}
        width="lg"
        title={selectedRider?.name}
        description={selectedRider ? `Assigned to ${selectedRider.zone} · ${selectedRider.city}` : undefined}
      >
        {selectedRider && (
          <div className="space-y-6 text-xs text-[#111111]">
            {/* Rider Status and Actions */}
            <div className="rounded-2xl bg-gray-50 p-4 border border-[#E5E7EB] flex items-center justify-between">
              <div>
                <p className="font-bold text-base text-[#111111]">{selectedRider.name}</p>
                <p className="text-[#4B5563] font-mono mt-0.5 font-medium">{selectedRider.phone}</p>
                <p className="text-[#6B7280] font-medium">{selectedRider.vehicle}</p>
              </div>

              <div className="flex items-center gap-2">
                <StatusBadge status={selectedRider.status} size="md" />
                <GlassButton
                  variant={selectedRider.status === "Offline" ? "primary" : "destructive"}
                  size="sm"
                  onClick={() => {
                    const nextStatus = selectedRider.status === "Offline" ? "Online" : "Offline";
                    toggleRiderStatus(selectedRider.id, nextStatus);
                    setSelectedRider({ ...selectedRider, status: nextStatus });
                  }}
                >
                  {selectedRider.status === "Offline" ? "Set Active" : "Suspend Shift"}
                </GlassButton>
              </div>
            </div>

            {/* Shift Metrics */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl border border-[#E5E7EB] bg-gray-50/70 p-3">
                <p className="text-[10px] text-[#6B7280] font-bold uppercase">Today Payout</p>
                <p className="font-display text-base font-bold text-emerald-700 mt-1">
                  ₹{selectedRider.todayEarnings.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="rounded-2xl border border-[#E5E7EB] bg-gray-50/70 p-3">
                <p className="text-[10px] text-[#6B7280] font-bold uppercase">Deliveries</p>
                <p className="font-display text-base font-bold text-[#111111] mt-1">
                  {selectedRider.completedDeliveries} Trips
                </p>
              </div>
              <div className="rounded-2xl border border-[#E5E7EB] bg-gray-50/70 p-3">
                <p className="text-[10px] text-[#6B7280] font-bold uppercase">EV Battery</p>
                <p className="font-display text-base font-bold text-[#B45309] mt-1">
                  {selectedRider.batteryPct}%
                </p>
              </div>
            </div>

            {/* Document Verification Box */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4 space-y-2.5 shadow-2xs">
              <h4 className="font-bold text-[#111111] mb-2 flex items-center gap-1.5 text-sm">
                <FileCheck className="h-4 w-4 text-emerald-600" />
                <span>Verified Compliance Documents</span>
              </h4>
              <div className="flex justify-between py-1.5 border-b border-[#F3F4F6]">
                <span className="text-[#4B5563] font-medium">Driving Licence (Commercial):</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Verified
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#F3F4F6]">
                <span className="text-[#4B5563] font-medium">EV Vehicle Registration Certificate (RC):</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Verified
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-[#4B5563] font-medium">Police Background Verification:</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Passed
                </span>
              </div>
            </div>
          </div>
        )}
      </GlassDrawer>
    </div>
  );
}
