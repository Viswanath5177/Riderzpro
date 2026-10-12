import { useMemo, useState, useEffect } from "react";
import {
  Bike,
  Search,
  SlidersHorizontal,
  ShieldCheck,
  Check,
  X,
  Sparkles,
  Zap,
  Loader2,
} from "lucide-react";
import { ProductCard } from "@/components/site/bits";
import { bestOffer, bikes, getBike, mapDbProductToProduct, type Product, type Category } from "@/lib/data";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const SHOP_CATEGORIES = [
  "All",
  "Vehicle Accessories & Mounts",
  "Smart Chargers & Converters",
  "EV Batteries (Lithium & LFP)",
  "Battery Management Systems (BMS)",
  "Braking & Safety Parts",
  "Spare Parts & OEM Components",
  "Electric Scooters & Bikes",
  "Car Accessories",
  "Bike Accessories",
];

export function ShopTab() {
  const { activeBikeId, setActiveBikeId, garage } = useStore();

  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("All");
  const [volt, setVolt] = useState<number | null>(null);
  const [onlyFit, setOnlyFit] = useState(false);
  const [sort, setSort] = useState("relevance");

  // Fetch only products published to PostgreSQL database
  useEffect(() => {
    setIsLoading(true);
    fetch("/api/products")
      .then((r) => r.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          const mapped: Product[] = res.data.map((row: any) => mapDbProductToProduct(row));
          setDbProducts(mapped);
        }
      })
      .catch((err) => {
        console.error("ShopTab fetch error:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const filteredProducts = useMemo(() => {
    let list = dbProducts.filter((p) => {
      const matchesCat =
        cat === "All" ||
        p.category.toLowerCase().includes(cat.toLowerCase()) ||
        cat.toLowerCase().includes(p.category.toLowerCase());
      const matchesVolt = !volt || p.voltage === volt;
      const matchesFit =
        !onlyFit ||
        !activeBikeId ||
        p.fits.includes("universal") ||
        p.fits.includes(activeBikeId);
      const queryLower = q.toLowerCase().trim();
      const matchesQuery =
        !queryLower ||
        `${p.name} ${p.brand} ${p.category} ${p.description}`
          .toLowerCase()
          .includes(queryLower);

      return matchesCat && matchesVolt && matchesFit && matchesQuery;
    });

    if (sort === "low") {
      list = [...list].sort((a, b) => bestOffer(a).price - bestOffer(b).price);
    } else if (sort === "high") {
      list = [...list].sort((a, b) => bestOffer(b).price - bestOffer(a).price);
    }
    return list;
  }, [dbProducts, q, cat, volt, onlyFit, activeBikeId, sort]);

  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    dbProducts.forEach((p) => {
      if (p.category && (p.category as string) !== "All") set.add(p.category);
    });
    return ["All", ...Array.from(set).sort()];
  }, [dbProducts]);

  const activeBike = activeBikeId ? getBike(activeBikeId) : null;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* ─────────────────────────────────────────────────────────────
          SECTION A: HEADER BANNER WITH VEHICLE FITMENT
         ───────────────────────────────────────────────────────────── */}
      <div className="bg-white border border-[#E5E7EB] shadow-2xs rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E31E24]">
            <Zap className="h-3.5 w-3.5 fill-[#E31E24]" />
            <span>Official Store Catalog</span>
            <span>·</span>
            <span className="text-[#6B7280]">100% Genuine Components</span>
          </div>
          <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#111111] font-display">
            Shop Electric Bikes, Spares & Accessories
          </h2>
          <p className="mt-1 text-sm text-[#6B7280] max-w-2xl leading-relaxed">
            Order certified high-voltage lithium battery packs, smart fast chargers, precision brake rotors,
            and riding gear with guaranteed vehicle compatibility.
          </p>
        </div>

        {/* Vehicle Fitment Switcher */}
        <div className="bg-white border border-[#E5E7EB] shadow-2xs rounded-2xl p-4 flex flex-col gap-2 shrink-0 md:min-w-[280px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280] flex items-center gap-1.5">
              <Bike className="h-4 w-4 text-[#E31E24]" />
              Vehicle Fitment
            </span>
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              <ShieldCheck className="h-3.5 w-3.5" />
              Verified
            </span>
          </div>
          <select
            value={activeBikeId ?? ""}
            onChange={(e) => setActiveBikeId(e.target.value || null)}
            className="w-full rounded-xl bg-white border border-[#E5E7EB] p-2 text-xs font-semibold text-[#111111] shadow-2xs outline-none cursor-pointer focus:ring-2 focus:ring-[#E31E24]/20"
          >
            <option value="">Any Vehicle (Show all)</option>
            {bikes.map((b) => (
              <option key={b.id} value={b.id}>
                {b.make} {b.model} ({b.voltage}V)
              </option>
            ))}
          </select>
          {activeBike && (
            <p className="text-[11px] text-[#6B7280]">
              Filtering for <span className="font-semibold text-[#111111]">{activeBike.make} {activeBike.model}</span>
            </p>
          )}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          SECTION B: SEARCH, CATEGORY PILLS & FILTERS
         ───────────────────────────────────────────────────────────── */}
      <div className="bg-white border border-[#E5E7EB] shadow-2xs rounded-2xl p-4 space-y-4">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
          {/* Live Search Input */}
          <div className="relative flex flex-1 items-center bg-[#F5F6F8] rounded-full border border-[#E5E7EB] px-4 py-2 focus-within:bg-white focus-within:border-gray-400 focus-within:ring-2 focus-within:ring-[#E31E24]/20 shadow-2xs">
            <Search className="h-4 w-4 text-[#6B7280] shrink-0 mr-2.5" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by part name, brand (Motul, Brembo, Ather), voltage, or specification..."
              className="w-full bg-transparent text-xs text-[#111111] placeholder:text-[#6B7280] focus:outline-none"
            />
            {q && (
              <button
                onClick={() => setQ("")}
                className="text-gray-400 hover:text-gray-700 p-1"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-medium text-[#6B7280] hidden sm:inline">Sort by:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-full bg-white border border-[#E5E7EB] px-3 py-2 text-xs font-semibold text-[#111111] outline-none cursor-pointer shadow-2xs hover:border-gray-400"
            >
              <option value="relevance">Featured & Relevant</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {availableCategories.map((c) => {
            const isActive = cat === c;
            return (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={cn(
                  "whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition active:scale-95",
                  isActive
                    ? "bg-[#E31E24] text-white shadow-xs"
                    : "bg-white border border-[#E5E7EB] text-[#111111] hover:border-[#111111] hover:bg-gray-50 shadow-2xs"
                )}
              >
                {c}
              </button>
            );
          })}
        </div>

        {/* Secondary Filter Badges */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-[#E5E7EB] text-xs">
          <div className="flex items-center gap-1.5 text-[#6B7280] font-medium">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Voltage:</span>
          </div>
          {[48, 60, 72].map((v) => (
            <button
              key={v}
              onClick={() => setVolt(volt === v ? null : v)}
              className={cn(
                "rounded-full px-3 py-1 font-semibold transition active:scale-95 shadow-2xs",
                volt === v
                  ? "bg-[#E31E24] text-white"
                  : "bg-white border border-[#E5E7EB] text-[#111111] hover:border-[#111111]"
              )}
            >
              {v}V
            </button>
          ))}

          {activeBike && (
            <label className="ml-auto flex items-center gap-2 cursor-pointer font-semibold text-xs text-[#111111] bg-white border border-[#E5E7EB] px-3 py-1 rounded-full shadow-2xs">
              <input
                type="checkbox"
                checked={onlyFit}
                onChange={(e) => setOnlyFit(e.target.checked)}
                className="rounded border-gray-300 accent-[#E31E24]"
              />
              <span>Fit for {activeBike.make} {activeBike.model} only</span>
            </label>
          )}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          SECTION C: PRODUCTS GRID
         ───────────────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">
            Showing {filteredProducts.length} items
          </p>
          {(cat !== "All" || volt !== null || onlyFit || q) && (
            <button
              onClick={() => {
                setCat("All");
                setVolt(null);
                setOnlyFit(false);
                setQ("");
              }}
              className="text-xs font-semibold text-[#E31E24] hover:underline"
            >
              Reset all filters
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="bg-white border border-[#E5E7EB] shadow-2xs rounded-3xl p-16 text-center space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-[#E31E24] mx-auto" />
            <p className="text-sm font-semibold text-[#111111]">Loading published products from database...</p>
            <p className="text-xs text-[#6B7280]">Connecting to PostgreSQL table riderzpro.products</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white border border-[#E5E7EB] shadow-2xs rounded-3xl p-12 text-center space-y-3">
            <p className="text-base font-bold text-[#111111]">No products found</p>
            <p className="text-xs text-[#6B7280] max-w-md mx-auto">
              No products match your current filter combination.
            </p>
            <button
              onClick={() => {
                setCat("All");
                setVolt(null);
                setOnlyFit(false);
                setQ("");
              }}
              className="rounded-full bg-[#E31E24] px-5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-red-700"
            >
              Show All Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
