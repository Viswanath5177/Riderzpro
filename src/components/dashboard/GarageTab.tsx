import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Bike, Check, Trash2, Plus, ShoppingBag, Wrench, Shield, Battery, Gauge } from "lucide-react";
import { toast } from "sonner";
import scooterImg from "@/assets/scooter.jpg";
import { useStore } from "@/lib/store";
import { getBike, bikes } from "@/lib/data";

interface GarageTabProps {
  onOpenAddBikeModal: () => void;
  onOpenBookingModal: () => void;
}

export function GarageTab({ onOpenAddBikeModal, onOpenBookingModal }: GarageTabProps) {
  const { garage, activeBikeId, setActiveBikeId, removeBike } = useStore();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 font-display">My Registered EV Garage</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage your electric vehicles. The active vehicle drives compatible part fitments, range estimates, and service recommendations.
          </p>
        </div>
        <button
          onClick={onOpenAddBikeModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-primary text-white text-xs font-semibold shadow-xs hover:bg-emerald-600 transition self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add New EV</span>
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {garage.map((g) => {
          const b = getBike(g.bikeId)!;
          const isActive = activeBikeId === g.bikeId;

          return (
            <div
              key={g.bikeId}
              className={`rounded-3xl border bg-white overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between ${
                isActive ? "border-primary ring-1 ring-primary/30" : "border-gray-200"
              }`}
            >
              <div className="relative aspect-[16/10] bg-gray-100">
                <img src={scooterImg} alt={b.model} className="h-full w-full object-cover" />
                <div className="absolute top-3 left-3 flex gap-2">
                  {isActive && (
                    <span className="px-2.5 py-1 rounded-full bg-primary text-white text-[10px] font-bold shadow-xs">
                      Primary EV
                    </span>
                  )}
                  <span className="px-2.5 py-1 rounded-full bg-black/60 text-white text-[10px] font-semibold">
                    {b.voltage}V Battery Architecture
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-extrabold text-gray-900 font-display">
                      {b.make} {b.model}
                    </h3>
                    <span className="font-mono text-xs font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md">
                      {g.regNo || "KA 01 EQ 8821"}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 mt-1">
                    {g.year ?? "2023"} Model · System Voltage: {b.voltage}V DC · WMI: {b.wmi}
                  </p>
                  {g.vin && (
                    <p className="text-[11px] font-mono text-gray-400 mt-0.5">
                      VIN: {g.vin}
                    </p>
                  )}

                  {/* Telemetry Grid */}
                  <div className="mt-4 grid grid-cols-2 gap-2 pt-3 border-t border-gray-100 text-xs">
                    <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Odometer</span>
                      <span className="text-sm font-bold text-gray-900">{g.odoKm?.toLocaleString("en-IN") ?? 12450} km</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
                      <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Battery SOH</span>
                      <span className="text-sm font-bold text-emerald-800">{g.batteryHealth ?? 96}% Optimal</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <Link
                    to="/shop"
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-primary text-white text-xs font-semibold shadow-xs hover:bg-emerald-600 transition"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    <span>Shop Compatible OEM Parts</span>
                  </Link>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={onOpenBookingModal}
                      className="py-1.5 rounded-xl border border-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-50 transition"
                    >
                      Book Service
                    </button>

                    <button
                      onClick={() => {
                        setActiveBikeId(g.bikeId);
                        toast.success(`${b.make} ${b.model} set as primary active vehicle`);
                      }}
                      disabled={isActive}
                      className={`py-1.5 rounded-xl text-xs font-semibold transition ${
                        isActive
                          ? "bg-gray-100 text-gray-400 cursor-default"
                          : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {isActive ? "Active Bike" : "Set Primary"}
                    </button>
                  </div>

                  {garage.length > 1 && (
                    <button
                      onClick={() => {
                        removeBike(g.bikeId);
                        toast.info(`${b.make} ${b.model} removed from garage`);
                      }}
                      className="w-full text-center text-[11px] font-medium text-rose-500 hover:text-rose-700 py-1 transition"
                    >
                      Remove from Garage
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Add Bike trigger */}
        <div
          onClick={onOpenAddBikeModal}
          className="rounded-3xl border-2 border-dashed border-gray-300 hover:border-primary bg-white/50 p-8 flex flex-col items-center justify-center text-center cursor-pointer min-h-[360px] hover:bg-emerald-50/20 transition-all"
        >
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-primary mb-3">
            <Plus className="h-6 w-6" />
          </span>
          <p className="text-base font-bold text-gray-900 font-display">Add Another EV</p>
          <p className="text-xs text-gray-500 mt-1 max-w-xs">
            Enter VIN or select your make & model to verify battery, charger, controller, and brake pad compatibility.
          </p>
          <button className="mt-4 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold shadow-xs">
            + Decode VIN / Add
          </button>
        </div>
      </div>
    </div>
  );
}
