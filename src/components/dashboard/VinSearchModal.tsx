import { useState, useMemo } from "react";
import { X, ScanLine, Bike, Check, ShoppingBag, ArrowRight, Sparkles, Heart } from "lucide-react";
import { toast } from "sonner";
import { bikes, decodeVin, getBike, inr, products, type Product } from "@/lib/data";
import { useStore } from "@/lib/store";

interface VinSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewInGarage?: (bikeId: string) => void;
}

export function VinSearchModal({ isOpen, onClose, onViewInGarage }: VinSearchModalProps) {
  const { addToCart, toggleSaved, isSaved, addBike, garage } = useStore();
  const [vin, setVin] = useState("P6R1S1PR2PN000001"); // Default to Ola S1 Pro sample VIN

  const decodedResult = useMemo(() => {
    if (!vin.trim()) return null;
    return decodeVin(vin);
  }, [vin]);

  const decodedBike = decodedResult?.ok && decodedResult.bike ? decodedResult.bike : null;

  const compatibleParts = useMemo(() => {
    if (!decodedBike) return [];
    return products.filter((p) => p.fits.includes(decodedBike.id));
  }, [decodedBike]);

  if (!isOpen) return null;

  const samples = [
    { label: "Ola S1 Pro", vin: "P6R1S1PR2PN000001" },
    { label: "Ather 450X", vin: "MD9A450XAN1234567" },
    { label: "TVS iQube", vin: "MD6IQUBESN1234567" },
    { label: "Revolt RV400", vin: "MCRV400XXN1234567" },
    { label: "Bajaj Chetak", vin: "MD2CHETAKN1234567" },
  ];

  const isBikeInGarage = decodedBike ? garage.some((g) => g.bikeId === decodedBike.id) : false;

  const handleAddBikeToGarage = () => {
    if (!decodedBike) return;
    addBike({
      bikeId: decodedBike.id,
      year: decodedResult?.year || 2024,
      vin: vin.toUpperCase(),
      regNo: "KA 01 EV 9900",
      nickname: `${decodedBike.make} ${decodedBike.model}`,
      odoKm: 5000,
      batteryHealth: 99,
      nextServiceDays: 60,
    });
    toast.success(`${decodedBike.make} ${decodedBike.model} added to your garage!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-xs pt-12 sm:pt-20 px-4 animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-white rounded-3xl border border-gray-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#F7F9FB]">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-2xl bg-primary text-white shadow-xs">
              <ScanLine className="h-5 w-5" />
            </span>
            <div>
              <p className="text-base font-bold text-gray-900 font-display">Search Compatible Items by VIN</p>
              <p className="text-xs text-gray-500">
                Enter your 17-digit chassis/VIN number to see only parts verified to fit your EV.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Input Bar & Samples */}
        <div className="p-6 border-b border-gray-100 space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                autoFocus
                type="text"
                value={vin}
                onChange={(e) => setVin(e.target.value.toUpperCase())}
                maxLength={17}
                placeholder="Enter 17-digit VIN (e.g. P6R1S1PR2PN000001)"
                className="w-full h-12 rounded-2xl border border-gray-300 bg-white px-4 font-mono text-sm tracking-wider uppercase text-gray-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
              />
              <span className="absolute right-4 top-3.5 text-xs text-gray-400 font-mono">
                {vin.length}/17
              </span>
            </div>
            {vin && (
              <button
                onClick={() => setVin("")}
                className="px-3 h-12 rounded-2xl border border-gray-200 text-gray-400 hover:text-gray-700 hover:bg-gray-50 text-xs font-semibold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Sample VINs */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-gray-500">
            <span className="font-semibold text-gray-700">Quick Test VINs:</span>
            {samples.map((s) => (
              <button
                key={s.label}
                type="button"
                onClick={() => setVin(s.vin)}
                className={`px-2.5 py-1 rounded-lg border text-xs transition ${
                  vin === s.vin
                    ? "bg-primary text-white border-primary font-bold"
                    : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Decoded Vehicle Banner */}
          {decodedBike && (
            <div className="mt-3 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-white shrink-0">
                  <Bike className="h-5 w-5" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-900 font-display">
                      {decodedBike.make} {decodedBike.model} ({decodedResult?.year || 2023})
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-200/80 text-emerald-900 text-[10px] font-bold">
                      {decodedBike.voltage}V DC Architecture
                    </span>
                  </div>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    Chassis verified · Found <b>{compatibleParts.length} verified compatible parts</b>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!isBikeInGarage ? (
                  <button
                    onClick={handleAddBikeToGarage}
                    className="px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-emerald-600 transition"
                  >
                    + Add to My Garage
                  </button>
                ) : (
                  <span className="px-2.5 py-1 rounded-xl bg-white border border-emerald-300 text-emerald-800 text-[11px] font-semibold flex items-center gap-1">
                    <Check className="h-3 w-3" /> In Your Garage
                  </span>
                )}
              </div>
            </div>
          )}

          {decodedResult && !decodedResult.ok && vin.length === 17 && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {decodedResult.error || "VIN not recognized. Please check your RC book or pick manually."}
            </div>
          )}
        </div>

        {/* Compatible Parts List */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {!decodedBike ? (
            <div className="py-12 text-center text-xs text-gray-500">
              <ScanLine className="h-10 w-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-gray-700">Enter a 17-digit VIN to view matching parts</p>
              <p className="text-gray-400 mt-0.5 max-w-sm mx-auto">
                Try clicking any of the test VIN buttons above for Ather, Ola, TVS, Revolt or Bajaj.
              </p>
            </div>
          ) : compatibleParts.length === 0 ? (
            <div className="py-12 text-center text-xs text-gray-500">
              <p className="text-sm font-bold text-gray-700">No compatible parts found for this specific VIN.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Compatible Spares & Accessories ({compatibleParts.length})
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {compatibleParts.map((p) => {
                  const offer = p.offers[0];
                  const saved = isSaved(p.id);

                  return (
                    <div
                      key={p.id}
                      className="p-3.5 rounded-2xl border border-gray-200 bg-white hover:border-primary/40 hover:shadow-sm transition flex gap-3.5 group"
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        className="h-20 w-20 rounded-xl object-cover bg-gray-100 border border-gray-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                              ✓ Fits {decodedBike.model}
                            </span>
                            <button
                              onClick={() => {
                                toggleSaved(p.id);
                                toast.success(saved ? "Removed from saved" : "Saved to wishlist");
                              }}
                              className="text-gray-400 hover:text-rose-500 transition"
                            >
                              <Heart className={`h-3.5 w-3.5 ${saved ? "fill-rose-500 text-rose-500" : ""}`} />
                            </button>
                          </div>
                          <p className="text-xs font-bold text-gray-900 group-hover:text-primary transition line-clamp-1 mt-1">
                            {p.name}
                          </p>
                          <p className="text-[11px] text-gray-500">
                            {p.category} · {p.brand} · {p.warrantyMonths}m warranty
                          </p>
                        </div>

                        <div className="pt-2 flex items-center justify-between">
                          <span className="text-sm font-extrabold text-gray-900">{inr(offer.price)}</span>
                          <button
                            onClick={() => {
                              addToCart(p.id, offer.vendorId);
                              toast.success(`${p.name} added to cart`);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-primary text-white text-xs font-semibold shadow-xs hover:bg-emerald-600 active:scale-95 transition"
                          >
                            + Add
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-xs">
          <span className="text-gray-500">
            {decodedBike ? (
              <>
                All shown parts are 100% verified for <b>{decodedBike.make} {decodedBike.model}</b>
              </>
            ) : (
              "RiderzPro 100% Fitment Verification Engine"
            )}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
