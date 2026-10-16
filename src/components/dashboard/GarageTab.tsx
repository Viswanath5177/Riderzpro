import { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "@tanstack/react-router";
import {
  Bike,
  Plus,
  ShoppingBag,
  Wrench,
  Shield,
  ScanLine,
  Search,
  Check,
  Zap,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import scooterImg from "@/assets/scooter.jpg";
import { useStore } from "@/lib/store";
import { getBike, bikes, products as fallbackProducts, inr, type Product } from "@/lib/data";
import { VinSearchModal } from "./VinSearchModal";
import { cn } from "@/lib/utils";

interface GarageTabProps {
  onOpenAddBikeModal: () => void;
  onOpenBookingModal: () => void;
}

export function GarageTab({ onOpenAddBikeModal, onOpenBookingModal }: GarageTabProps) {
  const {
    garage,
    activeBikeId,
    setActiveBikeId,
    removeBike,
    addToCart,
    toggleSaved,
    isSaved,
  } = useStore();

  const [selectedBikeId, setSelectedBikeId] = useState<string | null>(activeBikeId || garage[0]?.bikeId || null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [partsSearch, setPartsSearch] = useState<string>("");
  const [isVinModalOpen, setIsVinModalOpen] = useState(false);
  const [dbProducts, setDbProducts] = useState<Product[]>([]);

  const partsSectionRef = useRef<HTMLDivElement>(null);

  // Active or selected vehicle
  const activeBike = garage.find((b) => b.bikeId === selectedBikeId) || garage[0];
  const activeBikeMeta = activeBike ? getBike(activeBike.bikeId) : null;

  // Fetch verified products from DB
  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          const mapped: Product[] = res.data.map((row: any) => {
            let primaryImg = "/src/assets/battery-1.jpg";
            if (row.image_url) {
              try {
                if (row.image_url.startsWith("[")) {
                  primaryImg = JSON.parse(row.image_url)[0] || primaryImg;
                } else {
                  primaryImg = row.image_url;
                }
              } catch {
                primaryImg = row.image_url;
              }
            }
            let fitsArr: string[] = ["universal"];
            if (row.compatible_vehicles) {
              fitsArr = Array.isArray(row.compatible_vehicles) 
                ? row.compatible_vehicles 
                : [row.compatible_vehicles];
            }
            return {
              id: row.id,
              name: row.name,
              brand: row.brand || "Riderz Armor",
              category: (row.category_name as any) || "Car Accessories",
              image: primaryImg,
              warrantyMonths: row.warranty?.includes("year") ? 12 : 6,
              weightKg: Number(row.weight_kg) || 4.5,
              fits: fitsArr,
              description: row.description || "",
              offers: [{ vendorId: "v1", price: Number(row.price), stock: Number(row.stock) }],
              variantModel: row.variant_model,
              discountPercent: row.discount_percent,
            };
          });
          setDbProducts(mapped);
        } else {
          setDbProducts(fallbackProducts);
        }
      })
      .catch(() => setDbProducts(fallbackProducts));
  }, []);

  // Filter parts compatible with the registered bike
  const compatibleProducts = useMemo(() => {
    let items = dbProducts;
    if (activeBike) {
      items = items.filter((p) => p.fits.includes("universal") || p.fits.includes(activeBike.bikeId));
    }

    if (selectedCategory !== "All") {
      items = items.filter((p) => {
        if (selectedCategory === "BMS Boards") return p.category === "BMS" || p.name.includes("BMS");
        if (selectedCategory === "Motors & Controllers") return p.category === "Motor" || p.category === "Controller" || p.name.includes("Motor");
        if (selectedCategory === "Battery") return p.category === "Battery" || p.name.includes("Battery");
        if (selectedCategory === "Charger") return p.category === "Charger" || p.name.includes("Charger");
        if (selectedCategory === "Brakes") return p.category === "Brakes" || p.name.includes("Brake");
        return p.category === selectedCategory;
      });
    }

    if (partsSearch.trim()) {
      const q = partsSearch.toLowerCase();
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      );
    }

    return items;
  }, [activeBike, selectedCategory, partsSearch, dbProducts]);

  const categories = [
    "All",
    "Battery",
    "Charger",
    "BMS Boards",
    "Motors & Controllers",
    "Brakes",
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* ─────────────────────────────────────────────────────────────
          1. TOP HEADER & ACTION BUTTONS (Matches Screenshot 4)
         ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] font-display">
            My Registered EV Garage
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage your registered electric two-wheelers and browse guaranteed compatible OEM parts, batteries, and chargers right here.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
          {/* Green Outline: Search by VIN */}
          <button
            onClick={() => setIsVinModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition shadow-2xs cursor-pointer active:scale-95"
          >
            <ScanLine className="h-4 w-4" />
            <span>Search by VIN</span>
          </button>

          {/* Solid Red: Add New EV */}
          <button
            onClick={onOpenAddBikeModal}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#E31E24] hover:bg-red-700 text-white text-xs font-bold shadow-xs transition cursor-pointer active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Add New EV</span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. REGISTERED ELECTRIC VEHICLES (Count + Empty Card or List)
         ───────────────────────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-[#111111] font-display">
            Registered Electric Vehicles ({garage.length})
          </h2>
          <span className="text-xs text-gray-400 font-medium">
            Click any bike to view its compatible spares below
          </span>
        </div>

        {garage.length === 0 ? (
          /* Empty State matching Screenshot 4 */
          <div className="w-full max-w-sm rounded-3xl border border-gray-200/80 bg-white p-8 sm:p-10 text-center flex flex-col items-center justify-center space-y-3.5 shadow-2xs">
            {/* Light Green Plus Icon */}
            <div className="grid h-12 w-12 place-items-center rounded-full bg-emerald-50 text-emerald-600 mb-1">
              <Plus className="h-6 w-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-sm sm:text-base font-bold text-[#111111]">
                Add Your Electric Vehicle
              </h3>
              <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
                Enter VIN or select your model to unlock verified batteries, chargers, and spare parts.
              </p>
            </div>

            {/* Solid Red Button: + Decode VIN or Add */}
            <button
              onClick={onOpenAddBikeModal}
              className="px-5 py-2.5 rounded-xl bg-[#E31E24] hover:bg-red-700 text-white text-xs font-bold shadow-xs transition cursor-pointer active:scale-95"
            >
              + Decode VIN or Add
            </button>
          </div>
        ) : (
          /* Active Vehicles List */
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {garage.map((g) => {
              const b = getBike(g.bikeId) || bikes[0];
              const isPrimary = activeBikeId === g.bikeId;
              const isSelected = selectedBikeId === g.bikeId;

              return (
                <div
                  key={g.bikeId}
                  className={cn(
                    "rounded-3xl border bg-white overflow-hidden shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between",
                    isSelected
                      ? "border-[#E31E24] ring-2 ring-red-100"
                      : "border-gray-200"
                  )}
                >
                  <div className="relative aspect-[16/10] bg-gray-100">
                    <img src={scooterImg} alt={b.model} className="h-full w-full object-cover" />
                    <div className="absolute top-3 left-3 flex gap-2">
                      {isPrimary && (
                        <span className="px-2.5 py-1 rounded-full bg-[#E31E24] text-white text-[10px] font-bold shadow-xs">
                          Primary EV
                        </span>
                      )}
                      <span className="px-2.5 py-1 rounded-full bg-black/60 text-white text-[10px] font-semibold">
                        {b.voltage}V Architecture
                      </span>
                    </div>

                    {isSelected && (
                      <div className="absolute bottom-3 left-3">
                        <span className="px-2.5 py-0.5 rounded-md bg-white text-[#E31E24] text-[10px] font-bold shadow-2xs border border-red-200 flex items-center gap-1">
                          <Check className="h-3 w-3 text-[#E31E24]" /> Viewing Spares
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-extrabold text-gray-900 font-display">
                          {b.make} {b.model}
                        </h3>
                        <span className="font-mono text-xs font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md">
                          {g.regNo || "KA 01 EQ 8821"}
                        </span>
                      </div>

                      <p className="text-xs text-gray-500 mt-1">
                        {g.year ?? "2024"} Model · System Voltage: {b.voltage}V DC
                      </p>
                      {g.vin && (
                        <p className="text-[11px] font-mono text-gray-400 mt-0.5">
                          VIN: {g.vin}
                        </p>
                      )}

                      {/* Telemetry info */}
                      <div className="mt-4 grid grid-cols-2 gap-2 pt-3 border-t border-gray-100 text-xs">
                        <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                            Odometer
                          </span>
                          <span className="text-sm font-bold text-gray-900">
                            {g.odoKm?.toLocaleString("en-IN") ?? 5200} km
                          </span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
                          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                            Battery SOH
                          </span>
                          <span className="text-sm font-bold text-emerald-800">
                            {g.batteryHealth ?? 98}% Optimal
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-gray-100">
                      <button
                        onClick={() => {
                          setSelectedBikeId(g.bikeId);
                          setActiveBikeId(g.bikeId);
                          toast.success(`${b.make} ${b.model} selected`);
                        }}
                        className={cn(
                          "w-full py-2 rounded-xl text-xs font-bold transition",
                          isSelected
                            ? "bg-[#E31E24] text-white"
                            : "bg-red-50 text-[#E31E24] border border-red-200 hover:bg-[#E31E24] hover:text-white"
                        )}
                      >
                        View Compatible Spares
                      </button>

                      <div className="flex items-center justify-between pt-1">
                        <button
                          onClick={onOpenBookingModal}
                          className="text-xs text-gray-700 hover:text-[#E31E24] font-medium"
                        >
                          Book Service
                        </button>
                        <button
                          onClick={() => {
                            removeBike(g.bikeId);
                            // Also call DELETE /api/garage
                            fetch(`/api/garage/${g.bikeId}`, { method: "DELETE" }).catch(() => {});
                            toast.info(`${b.make} ${b.model} removed from garage`);
                          }}
                          className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 font-medium"
                        >
                          <Trash2 className="h-3 w-3" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. COMPATIBLE SPARES & PARTS (Pills & Search Filter)
         ───────────────────────────────────────────────────────────── */}
      <div ref={partsSectionRef} className="pt-6 border-t border-gray-200/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-xl bg-red-50 text-[#E31E24]">
                <ShoppingBag className="h-4 w-4" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-[#111111] font-display">
                Compatible Spares &amp; Parts
              </h2>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {garage.length === 0
                ? "Register a vehicle in your garage above to view custom-fit compatible spare parts."
                : `Showing guaranteed compatible OEM components for ${activeBikeMeta ? `${activeBikeMeta.make} ${activeBikeMeta.model}` : "your vehicle"}.`}
            </p>
          </div>
        </div>

        {/* Categories Pills & Search Input Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-4 py-2 rounded-full text-xs font-bold transition shadow-2xs cursor-pointer",
                    isSelected
                      ? "bg-[#E31E24] text-white shadow-xs"
                      : "bg-white border border-gray-200 text-gray-700 hover:border-red-200 hover:bg-gray-50"
                  )}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div className="relative w-full md:w-64">
            <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={partsSearch}
              onChange={(e) => setPartsSearch(e.target.value)}
              placeholder="Filter garage spares..."
              className="w-full bg-white border border-gray-200 hover:border-gray-300 rounded-xl pl-9 pr-3.5 py-2 text-xs text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#E31E24] shadow-2xs"
            />
          </div>
        </div>

        {/* Spares Grid */}
        {compatibleProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-2">
            {compatibleProducts.slice(0, 8).map((product) => {
              const offer = product.offers?.[0] || { price: 2499 };
              return (
                <div
                  key={product.id}
                  className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-2xs hover:shadow-md transition p-3.5 flex flex-col justify-between"
                >
                  <div className="relative aspect-square bg-[#F7F9FB] rounded-xl flex items-center justify-center p-3 overflow-hidden">
                    <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain" />
                  </div>
                  <div className="pt-3 space-y-2">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{product.brand}</p>
                    <h3 className="text-xs font-bold text-gray-900 line-clamp-1">{product.name}</h3>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-sm font-extrabold text-gray-900">{inr(offer.price)}</span>
                      <button
                        onClick={() => {
                          addToCart(product.id, offer.vendorId, 1);
                          toast.success(`${product.name} added to cart`);
                        }}
                        className="p-1.5 rounded-lg bg-red-50 hover:bg-[#E31E24] text-[#E31E24] hover:text-white transition cursor-pointer"
                        title="Add to cart"
                      >
                        <ShoppingBag className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Global VIN Search Modal */}
      <VinSearchModal
        isOpen={isVinModalOpen}
        onClose={() => setIsVinModalOpen(false)}
      />
    </div>
  );
}
