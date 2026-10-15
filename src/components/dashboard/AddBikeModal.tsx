import { useState } from "react";
import { X, ScanLine, Bike, Check } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { bikes, decodeVin, getBike } from "@/lib/data";

interface AddBikeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddBikeModal({ isOpen, onClose }: AddBikeModalProps) {
  const { addBike } = useStore();

  const [mode, setMode] = useState<"vin" | "manual">("vin");
  const [vin, setVin] = useState("");
  const [bikeId, setBikeId] = useState(bikes[0].id);
  const [year, setYear] = useState(bikes[0].years.at(-1)!);
  const [regNo, setRegNo] = useState("");
  const [nickname, setNickname] = useState("");

  if (!isOpen) return null;

  const sel = getBike(bikeId)!;

  const handleDecode = () => {
    const r = decodeVin(vin);
    if (!r.ok || !r.bike) {
      return toast.error(r.error || "Invalid VIN");
    }

    // 1. Save to backend database
    fetch("/api/garage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        vehicle_id: r.bike.id,
        make: r.bike.make,
        model: r.bike.model,
        year: r.year || 2024,
        vin: vin.toUpperCase(),
        vehicle_type: "bike",
        voltage: r.bike.voltage || 60,
        battery_kwh: r.bike.batteryKwh || 3.7,
      }),
    }).catch((err) => console.log("DB garage notice:", err));

    // 2. Save to store
    addBike({
      bikeId: r.bike.id,
      year: r.year,
      vin: vin.toUpperCase(),
      regNo: regNo || "KA 01 EQ 9000",
      nickname: nickname || `${r.bike.make} ${r.bike.model}`,
      odoKm: 5000,
      batteryHealth: 99,
      nextServiceDays: 60,
    });
    toast.success(`${r.bike.make} ${r.bike.model} (${r.year ?? "2024"}) added to your garage!`);
    onClose();
  };

  const handleManualAdd = () => {
    // 1. Save to backend database
    fetch("/api/garage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        vehicle_id: bikeId,
        make: sel.make,
        model: sel.model,
        year: year || 2024,
        vehicle_type: "bike",
        voltage: sel.voltage || 60,
        battery_kwh: sel.batteryKwh || 3.7,
      }),
    }).catch((err) => console.log("DB garage notice:", err));

    // 2. Save to store
    addBike({
      bikeId,
      year,
      regNo: regNo || "KA 01 EV 1234",
      nickname: nickname || `${sel.make} ${sel.model}`,
      odoKm: 8500,
      batteryHealth: 97,
      nextServiceDays: 45,
    });
    toast.success(`${sel.make} ${sel.model} added to your garage!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-gray-200 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-2xl bg-emerald-50 text-primary">
              <Bike className="h-5 w-5" />
            </span>
            <div>
              <p className="text-base font-bold text-gray-900 font-display">Add Electric Vehicle</p>
              <p className="text-xs text-gray-500">Ensure 100% verified battery, charger & brake rotor fitment.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="px-6 pt-4 flex gap-2">
          <button
            onClick={() => setMode("vin")}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition ${
              mode === "vin" ? "bg-primary text-white border-primary" : "border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Decode 17-Digit VIN
          </button>
          <button
            onClick={() => setMode("manual")}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition ${
              mode === "manual" ? "bg-primary text-white border-primary" : "border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Pick Manually by Model
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {mode === "vin" ? (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Vehicle Identification Number (VIN)
                </label>
                <div className="flex gap-2">
                  <input
                    value={vin}
                    onChange={(e) => setVin(e.target.value)}
                    maxLength={17}
                    placeholder="e.g. MD9A450XAN1234567"
                    className="flex-1 h-11 rounded-2xl border border-gray-300 px-3.5 font-mono text-sm uppercase tracking-wider outline-none focus:border-primary"
                  />
                  <button
                    onClick={handleDecode}
                    disabled={vin.length < 17}
                    className="px-4 h-11 rounded-2xl bg-primary text-white text-xs font-semibold shadow-xs disabled:opacity-40 hover:bg-emerald-600 transition"
                  >
                    Decode & Add
                  </button>
                </div>
                <p className="text-[11px] text-gray-500 mt-1">
                  {vin.length}/17 characters · Sample VINs:{" "}
                  <button
                    type="button"
                    onClick={() => setVin("MD9A450XAN1234567")}
                    className="text-primary underline font-mono"
                  >
                    Ather
                  </button>{" "}
                  or{" "}
                  <button
                    type="button"
                    onClick={() => setVin("P6R1S1PR2PN000001")}
                    className="text-primary underline font-mono"
                  >
                    Ola
                  </button>
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Registration Number (Optional)
                </label>
                <input
                  value={regNo}
                  onChange={(e) => setRegNo(e.target.value)}
                  placeholder="e.g. KA 01 EQ 8821"
                  className="w-full h-10 rounded-xl border border-gray-300 px-3.5 text-xs uppercase outline-none focus:border-primary"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Manufacturer & Model
                  </label>
                  <select
                    value={bikeId}
                    onChange={(e) => {
                      setBikeId(e.target.value);
                      setYear(getBike(e.target.value)!.years.at(-1)!);
                    }}
                    className="w-full h-11 rounded-2xl border border-gray-300 bg-white px-3 text-xs text-gray-900 outline-none focus:border-primary"
                  >
                    {bikes.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.make} {b.model}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Model Year
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(+e.target.value)}
                    className="w-full h-11 rounded-2xl border border-gray-300 bg-white px-3 text-xs text-gray-900 outline-none focus:border-primary"
                  >
                    {sel.years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Vehicle Plate Number
                </label>
                <input
                  value={regNo}
                  onChange={(e) => setRegNo(e.target.value)}
                  placeholder="e.g. KA 05 EV 4410"
                  className="w-full h-10 rounded-xl border border-gray-300 px-3.5 text-xs uppercase outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Custom Nickname (Optional)
                </label>
                <input
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="e.g. Daily Commuter"
                  className="w-full h-10 rounded-xl border border-gray-300 px-3.5 text-xs outline-none focus:border-primary"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          {mode === "manual" && (
            <button
              onClick={handleManualAdd}
              className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-semibold shadow-xs hover:bg-emerald-600 transition"
            >
              Add to Garage
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
