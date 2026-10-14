import React, { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Bike as BikeIcon, Search, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { bikes, decodeVin } from "@/lib/data";
import { useStore } from "@/lib/store";

export function BikeFinder() {
  const navigate = useNavigate();
  const { addBike } = useStore();
  const [tab, setTab] = useState<"bike" | "vin">("bike");
  const [selectedBikeId, setSelectedBikeId] = useState(bikes[0].id);
  const [vinInput, setVinInput] = useState("");

  const handleFindParts = (e: React.FormEvent) => {
    e.preventDefault();

    if (tab === "vin") {
      if (!vinInput.trim()) {
        toast.error("Please enter a VIN number");
        return;
      }
      const res = decodeVin(vinInput.trim());
      if (!res.ok || !res.bike) {
        toast.error(res.error || "Invalid VIN number. Please verify.");
        return;
      }
      addBike({ bikeId: res.bike.id, year: res.year, vin: vinInput.toUpperCase() });
      toast.success(
        `Matched ${res.bike.make} ${res.bike.model}${res.year ? ` (${res.year})` : ""}`,
      );
      navigate({ to: "/shop" });
    } else {
      const selectedBike = bikes.find((b) => b.id === selectedBikeId) || bikes[0];
      addBike({ bikeId: selectedBike.id });
      toast.success(`Selected ${selectedBike.make} ${selectedBike.model}`);
      navigate({ to: "/shop" });
    }
  };

  const isHero3D = import.meta.env["VITE_HERO_3D"] !== "false";

  return (
    <div
      id="bike-finder"
      className={`rounded-2xl border border-[#ececec] ${
        isHero3D ? "bg-white/75 backdrop-blur-md" : "bg-white"
      } p-4 sm:p-5 shadow-xs transition hover:shadow-md`}
    >
      {/* Tabs */}
      <div className="flex rounded-xl bg-[#f7f7f8] p-1 mb-4">
        <button
          type="button"
          onClick={() => setTab("bike")}
          className={`flex-1 rounded-lg py-2 text-xs sm:text-sm font-semibold transition cursor-pointer ${
            tab === "bike"
              ? "bg-white text-[#111111] shadow-xs"
              : "text-[#6b7280] hover:text-[#111111]"
          }`}
        >
          Pick my bike
        </button>
        <button
          type="button"
          onClick={() => setTab("vin")}
          className={`flex-1 rounded-lg py-2 text-xs sm:text-sm font-semibold transition cursor-pointer ${
            tab === "vin"
              ? "bg-white text-[#111111] shadow-xs"
              : "text-[#6b7280] hover:text-[#111111]"
          }`}
        >
          Enter VIN
        </button>
      </div>

      {/* Input & Action Form */}
      <form onSubmit={handleFindParts} className="flex flex-col sm:flex-row gap-2.5">
        {tab === "bike" ? (
          <div className="relative flex-1 min-w-0">
            <div className="flex h-12 w-full items-center gap-2.5 rounded-xl border border-[#ececec] bg-[#f7f7f8] px-3.5 focus-within:border-[#e11d2a] focus-within:bg-white transition">
              <BikeIcon className="h-4 w-4 text-[#e11d2a] shrink-0" />
              <select
                value={selectedBikeId}
                onChange={(e) => setSelectedBikeId(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm font-semibold text-[#111111] outline-none cursor-pointer truncate"
              >
                {bikes.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.make} {b.model} · {b.voltage}V ({b.years[0]}–{b.years[b.years.length - 1]})
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          <div className="relative flex-1 min-w-0">
            <div className="flex h-12 w-full items-center gap-2.5 rounded-xl border border-[#ececec] bg-[#f7f7f8] px-3.5 focus-within:border-[#e11d2a] focus-within:bg-white transition">
              <Search className="h-4 w-4 text-[#e11d2a] shrink-0" />
              <input
                type="text"
                value={vinInput}
                onChange={(e) => setVinInput(e.target.value.toUpperCase())}
                maxLength={17}
                placeholder="Enter 17-digit VIN (e.g. P6R1S1...)"
                className="w-full bg-transparent text-xs sm:text-sm font-mono font-semibold text-[#111111] uppercase placeholder:font-sans placeholder:text-[#6b7280] outline-none"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          className="flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#e11d2a] hover:bg-[#c91823] px-6 text-xs sm:text-sm font-semibold text-white shadow-xs transition active:scale-95 cursor-pointer whitespace-nowrap"
        >
          <span>Find parts</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      {tab === "vin" && (
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[11px] text-[#6b7280]">
          <span className="font-medium">Quick sample VIN:</span>
          <button
            type="button"
            onClick={() => setVinInput("MD9A450XAN1234567")}
            className="rounded-md border border-[#ececec] bg-[#f7f7f8] px-2 py-0.5 font-mono text-[10px] font-semibold text-[#111111] hover:border-[#e11d2a] hover:text-[#e11d2a] transition cursor-pointer"
          >
            MD9A450XAN1234567 (Ather)
          </button>
          <button
            type="button"
            onClick={() => setVinInput("P6R1S1PR2PN000001")}
            className="rounded-md border border-[#ececec] bg-[#f7f7f8] px-2 py-0.5 font-mono text-[10px] font-semibold text-[#111111] hover:border-[#e11d2a] hover:text-[#e11d2a] transition cursor-pointer"
          >
            P6R1S1PR2PN000001 (Ola)
          </button>
        </div>
      )}
    </div>
  );
}
