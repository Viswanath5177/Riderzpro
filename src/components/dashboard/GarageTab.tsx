import { useState, useMemo, useRef } from "react";
import { Link } from "@tanstack/react-router";
import {
  Bike,
  Check,
  Trash2,
  Plus,
  ShoppingBag,
  Wrench,
  Shield,
  Battery,
  Gauge,
  ScanLine,
  Search,
  Heart,
  CheckCircle,
  Zap,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import scooterImg from "@/assets/scooter.jpg";
import { useStore } from "@/lib/store";
import { getBike, bikes, products, inr, type Product, type Category } from "@/lib/data";
import { VinSearchModal } from "./VinSearchModal";

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

  const [selectedBikeId, setSelectedBikeId] = useState<string>(activeBikeId || garage[0]?.bikeId || "ola-s1pro");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [partsSearch, setPartsSearch] = useState<string>("");
  const [isVinModalOpen, setIsVinModalOpen] = useState(false);

  const partsSectionRef = useRef<HTMLDivElement>(null);

  // Active or selected vehicle
  const activeBike = garage.find((b) => b.bikeId === selectedBikeId) || garage[0];
  const activeBikeMeta = activeBike ? getBike(activeBike.bikeId) : null;

  // Filter parts compatible with the chosen bike
  const compatibleProducts = useMemo(() => {
    if (!activeBike) return [];
    let items = products.filter((p) => p.fits.includes(activeBike.bikeId));

    if (selectedCategory !== "All") {
      items = items.filter((p) => {
        if (selectedCategory === "BMS Boards") return p.category === "BMS";
        if (selectedCategory === "Motors & Controllers") return p.category === "Motor" || p.category === "Controller";
        return p.category === selectedCategory;
      });
    }

    if (partsSearch.trim()) {
      const q = partsSearch.toLowerCase();
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.chemistry && p.chemistry.toLowerCase().includes(q))
      );
    }

    return items;
  }, [activeBike, selectedCategory, partsSearch]);

  const categories = [
    "All",
    "Battery",
    "Charger",
    "BMS Boards",
    "Motors & Controllers",
    "Brakes",
  ];

  const handleSelectBikeToShop = (bikeId: string) => {
    setSelectedBikeId(bikeId);
    partsSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-display">
            My Registered EV Garage
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage your registered electric two-wheelers and browse guaranteed compatible OEM parts, batteries, and chargers right here.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => setIsVinModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl border border-emerald-300 bg-emerald-50 text-emerald-800 text-xs font-semibold hover:bg-primary hover:text-white hover:border-primary transition shadow-2xs"
          >
            <ScanLine className="h-4 w-4" />
            <span>Search by VIN</span>
          </button>

          <button
            onClick={onOpenAddBikeModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-primary text-white text-xs font-semibold shadow-xs hover:bg-emerald-600 transition"
          >
            <Plus className="h-4 w-4" />
            <span>Add New EV</span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 1: REGISTERED BIKES CARDS
         ───────────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 font-display">
            Registered Electric Vehicles ({garage.length})
          </h2>
          <span className="text-xs text-gray-500">
            Click any bike to view its compatible spares below
          </span>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {garage.map((g) => {
            const b = getBike(g.bikeId)!;
            const isPrimary = activeBikeId === g.bikeId;
            const isSelected = selectedBikeId === g.bikeId;
            const bikePartsCount = products.filter((p) => p.fits.includes(g.bikeId)).length;

            return (
              <div
                key={g.bikeId}
                className={`rounded-3xl border bg-white overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between ${
                  isSelected
                    ? "border-primary ring-2 ring-primary/30"
                    : isPrimary
                    ? "border-emerald-200"
                    : "border-gray-200"
                }`}
              >
                <div className="relative aspect-[16/10] bg-gray-100">
                  <img src={scooterImg} alt={b.model} className="h-full w-full object-cover" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    {isPrimary && (
                      <span className="px-2.5 py-1 rounded-full bg-primary text-white text-[10px] font-bold shadow-xs">
                        Primary EV
                      </span>
                    )}
                    <span className="px-2.5 py-1 rounded-full bg-black/60 text-white text-[10px] font-semibold">
                      {b.voltage}V Architecture
                    </span>
                  </div>

                  {isSelected && (
                    <div className="absolute bottom-3 left-3">
                      <span className="px-2.5 py-0.5 rounded-md bg-white text-emerald-800 text-[10px] font-bold shadow-2xs border border-emerald-300 flex items-center gap-1">
                        <Check className="h-3 w-3 text-primary" /> Currently Viewing Spares
                      </span>
                    </div>
                  )}
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
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                          Odometer
                        </span>
                        <span className="text-sm font-bold text-gray-900">
                          {g.odoKm?.toLocaleString("en-IN") ?? 12450} km
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
                        <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                          Battery SOH
                        </span>
                        <span className="text-sm font-bold text-emerald-800">
                          {g.batteryHealth ?? 96}% Optimal
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-gray-100">
                    {/* View Compatible Spares inside Garage */}
                    <button
                      onClick={() => handleSelectBikeToShop(g.bikeId)}
                      className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl text-xs font-semibold shadow-xs transition active:scale-95 ${
                        isSelected
                          ? "bg-primary text-white hover:bg-emerald-600"
                          : "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-primary hover:text-white"
                      }`}
                    >
                      <ShoppingBag className="h-4 w-4" />
                      <span>View Compatible Spares ({bikePartsCount} items)</span>
                    </button>

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
                          setSelectedBikeId(g.bikeId);
                          toast.success(`${b.make} ${b.model} set as primary active vehicle`);
                        }}
                        disabled={isPrimary}
                        className={`py-1.5 rounded-xl text-xs font-semibold transition ${
                          isPrimary
                            ? "bg-gray-100 text-gray-400 cursor-default"
                            : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {isPrimary ? "Primary Bike" : "Set Primary"}
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
            className="rounded-3xl border-2 border-dashed border-[#E5E7EB] hover:border-primary bg-white p-8 flex flex-col items-center justify-center text-center cursor-pointer min-h-[360px] hover:bg-red-50/20 transition-all shadow-2xs"
          >
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-primary mb-3">
              <Plus className="h-6 w-6" />
            </span>
            <p className="text-base font-bold text-gray-900 font-display">Add Another EV</p>
            <p className="text-xs text-gray-500 mt-1 max-w-xs">
              Enter VIN or select your model to unlock verified batteries, chargers, and spare parts.
            </p>
            <button className="mt-4 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold shadow-xs">
              + Decode VIN or Add
            </button>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 2: COMPATIBLE ITEMS & SPARES DIRECTLY IN GARAGE
         ───────────────────────────────────────────────────────────── */}
      <section ref={partsSectionRef} className="pt-6 border-t border-gray-200 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary/10 text-primary">
                <ShoppingBag className="h-4 w-4" />
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 font-display">
                Compatible Spares & Parts for {activeBikeMeta ? `${activeBikeMeta.make} ${activeBikeMeta.model}` : "Your Bike"}
              </h2>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Guaranteed 100% fitment for your {activeBikeMeta ? `${activeBikeMeta.voltage}V system` : "vehicle"}. Zero guesswork — verified against chassis and connector pinouts.
            </p>
          </div>

          {/* Multiple bike switcher tabs if >1 bike */}
          {garage.length > 1 && (
            <div className="flex items-center gap-2 p-1 rounded-2xl bg-gray-100 border border-gray-200 self-start md:self-auto">
              {garage.map((g) => {
                const b = getBike(g.bikeId)!;
                const isCur = selectedBikeId === g.bikeId;
                return (
                  <button
                    key={g.bikeId}
                    onClick={() => setSelectedBikeId(g.bikeId)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                      isCur
                        ? "bg-white text-gray-900 shadow-2xs font-bold"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    {b.make} {b.model}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Filter and Search Bar within Garage */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-gray-200 shadow-2xs">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  selectedCategory === cat
                    ? "bg-primary text-white shadow-2xs font-bold"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search input in garage */}
          <div className="relative min-w-[240px]">
            <Search className="h-4 w-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={partsSearch}
              onChange={(e) => setPartsSearch(e.target.value)}
              placeholder="Filter garage spares..."
              className="w-full h-10 rounded-2xl border border-gray-200 bg-gray-50 pl-9 pr-3 text-xs text-gray-900 outline-none focus:bg-white focus:border-primary transition"
            />
            {partsSearch && (
              <button
                onClick={() => setPartsSearch("")}
                className="absolute right-3 top-2.5 text-xs text-gray-400 hover:text-gray-700"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Parts Grid */}
        {compatibleProducts.length === 0 ? (
          <div className="p-12 rounded-3xl border border-dashed border-gray-300 bg-white text-center">
            <ShoppingBag className="h-10 w-10 text-gray-300 mx-auto mb-2" />
            <p className="text-base font-bold text-gray-800 font-display">No Parts Found</p>
            <p className="text-xs text-gray-500 mt-0.5">
              No parts matched &ldquo;{partsSearch || selectedCategory}&rdquo; for {activeBikeMeta?.make} {activeBikeMeta?.model}.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setPartsSearch("");
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {compatibleProducts.map((p) => {
              const offer = p.offers[0];
              const saved = isSaved(p.id);

              return (
                <div
                  key={p.id}
                  className="group rounded-3xl border border-gray-200 bg-white overflow-hidden shadow-2xs hover:shadow-lg hover:border-primary/40 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full bg-white border border-[#E5E7EB] text-gray-800 text-[10px] font-bold shadow-2xs">
                        {p.category}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        toggleSaved(p.id);
                        toast.success(saved ? "Removed from saved" : "Saved to wishlist");
                      }}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white border border-[#E5E7EB] text-gray-600 hover:text-rose-500 shadow-2xs transition"
                      title={saved ? "Remove from wishlist" : "Save item"}
                    >
                      <Heart className={`h-4 w-4 ${saved ? "fill-rose-500 text-rose-500" : ""}`} />
                    </button>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        ✓ Fits {activeBikeMeta?.model}
                      </span>

                      <Link
                        to="/product/$id"
                        params={{ id: p.id }}
                        className="block text-sm font-bold text-gray-900 group-hover:text-primary transition mt-1.5 line-clamp-1"
                      >
                        {p.name}
                      </Link>

                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                        {p.description}
                      </p>

                      {/* Specs */}
                      <div className="mt-2.5 flex flex-wrap gap-1 text-[11px] text-gray-500 font-medium">
                        <span className="bg-gray-100 px-2 py-0.5 rounded-md">
                          Brand: {p.brand}
                        </span>
                        {p.voltage && (
                          <span className="bg-gray-100 px-2 py-0.5 rounded-md font-semibold text-emerald-800">
                            {p.voltage}V
                          </span>
                        )}
                        {p.capacityAh && (
                          <span className="bg-gray-100 px-2 py-0.5 rounded-md">
                            {p.capacityAh}Ah
                          </span>
                        )}
                        <span className="bg-gray-100 px-2 py-0.5 rounded-md">
                          {p.warrantyMonths}m Warranty
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        <p className="text-base font-extrabold text-gray-900">{inr(offer.price)}</p>
                        <span className="text-[10px] text-emerald-600 font-semibold">
                          In stock · Express dispatch
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          addToCart(p.id, offer.vendorId);
                          toast.success(`${p.name} added to cart`);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-primary text-white text-xs font-semibold shadow-xs hover:bg-emerald-600 active:scale-95 transition flex items-center gap-1.5"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Global Vin Search Modal triggerable from Garage */}
      <VinSearchModal
        isOpen={isVinModalOpen}
        onClose={() => setIsVinModalOpen(false)}
      />
    </div>
  );
}
