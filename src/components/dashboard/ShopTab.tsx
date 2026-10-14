import { useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  Zap,
  Bike,
} from "lucide-react";
import { ProductCard } from "@/components/site/bits";
import { bestOffer, bikes, getBike, products } from "@/lib/data";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const SHOP_CATEGORIES = [
  "All",
  "Electric Bikes",
  "EV Batteries",
  "Car Accessories",
  "Bike Accessories",
] as const;

const PAGE_SIZE = 40;
function matchesShopCategory(product: (typeof products)[number], category: (typeof SHOP_CATEGORIES)[number]) {
  if (category === "All") return true;
  if (category === "Electric Bikes") return product.category === "Electric Bikes";
  if (category === "EV Batteries") return product.category === "Battery" || product.category === "EV Batteries";
  if (category === "Car Accessories") return product.isAccessoryProduct && (product.vehicleType === "car" || product.vehicleType === "both");
  return product.isAccessoryProduct && (product.vehicleType === "bike" || product.vehicleType === "both");
}

export function ShopTab() {
  const { activeBikeId, setActiveBikeId } = useStore();

  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof SHOP_CATEGORIES)[number]>("All");
  const [brand, setBrand] = useState("All brands");
  const [subcat, setSubcat] = useState<string>("All");
  const [volt, setVolt] = useState<number | null>(null);
  const [onlyFit, setOnlyFit] = useState(false);
  const [sort, setSort] = useState("relevance");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const accessoryVehicleType = cat === "Car Accessories" ? "car" : cat === "Bike Accessories" ? "bike" : null;
  const categoryProducts = useMemo(() => products.filter((p) => matchesShopCategory(p, cat)), [cat]);
  const categoryOptions = useMemo(() => [...new Set(categoryProducts.map((p) => p.category))]
    .sort((a, b) => a.localeCompare(b))
    .map((category) => ({ category, count: categoryProducts.filter((p) => p.category === category).length })), [categoryProducts]);
  const subcategoryProducts = useMemo(() => categoryProducts.filter((p) =>
    subcat === "All" ||
    p.category.toLowerCase() === subcat.toLowerCase() ||
    (p.subcategory && p.subcategory.toLowerCase() === subcat.toLowerCase()) ||
    (Array.isArray(p.subcategories) && p.subcategories.some((s) => s.toLowerCase() === subcat.toLowerCase()))
  ), [categoryProducts, subcat]);
  const accessoryBrands = useMemo(() => {
    if (!accessoryVehicleType) return [];
    return [...new Set(subcategoryProducts.map((p) => p.brand).filter(Boolean))]
      .sort((a, b) => a.localeCompare(b))
      .map((name) => ({ name, count: subcategoryProducts.filter((p) => p.brand === name).length }));
  }, [accessoryVehicleType, subcategoryProducts]);
  const availableVoltages = useMemo(() => [...new Set(categoryProducts.map((p) => p.voltage).filter((voltage): voltage is number => typeof voltage === "number"))].sort((a, b) => a - b), [categoryProducts]);
  const categoryCounts = useMemo(() => Object.fromEntries(SHOP_CATEGORIES.map((category) => [
    category,
    products.filter((p) => matchesShopCategory(p, category)).length,
  ])), []);

  const filteredProducts = useMemo(() => {
    let list = products.filter((p) => {
      const matchesCat = matchesShopCategory(p, cat);

      const matchesSubcat =
        subcat === "All" ||
        p.category.toLowerCase() === subcat.toLowerCase() ||
        (p.subcategory && p.subcategory.toLowerCase() === subcat.toLowerCase()) ||
        (Array.isArray(p.subcategories) && p.subcategories.some((s) => s.toLowerCase() === subcat.toLowerCase()));

      const matchesVolt = volt === null || p.voltage === volt;
      const matchesFit = !onlyFit || Boolean(activeBikeId && p.fits.length > 0 && p.fits.includes(activeBikeId));
      const matchesBrand = !accessoryVehicleType || brand === "All brands" || p.brand === brand;
      const queryLower = q.toLowerCase().trim();
      const matchesQuery =
        !queryLower ||
        `${p.name} ${p.brand} ${p.category} ${p.subcategory || ""} ${p.description}`
          .toLowerCase()
          .includes(queryLower);

      return matchesCat && matchesSubcat && matchesVolt && matchesFit && matchesBrand && matchesQuery;
    });

    if (sort === "low") {
      list = [...list].sort((a, b) => bestOffer(a).price - bestOffer(b).price);
    } else if (sort === "high") {
      list = [...list].sort((a, b) => bestOffer(b).price - bestOffer(a).price);
    }
    return list;
  }, [q, cat, brand, accessoryVehicleType, subcat, volt, onlyFit, activeBikeId, sort]);

  const activeBike = activeBikeId ? getBike(activeBikeId) : null;
  const showVoltageFilter = availableVoltages.length > 0;
  const showFitFilter = Boolean(activeBike && cat !== "Car Accessories");
  const hasActiveFilters = cat !== "All" || brand !== "All brands" || subcat !== "All" || volt !== null || onlyFit || Boolean(q);

  const resetFilters = () => {
    setCat("All");
    setBrand("All brands");
    setSubcat("All");
    setVolt(null);
    setOnlyFit(false);
    setQ("");
    setVisibleCount(PAGE_SIZE);
  };

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
        <label className="flex shrink-0 flex-col gap-2 text-xs font-semibold text-[#6B7280] md:min-w-64">
          <span className="flex items-center gap-2"><Bike className="h-4 w-4 text-[#E31E24]" /> Vehicle fitment</span>
          <select
            value={activeBikeId ?? ""}
            onChange={(event) => {
              const bikeId = event.target.value || null;
              setActiveBikeId(bikeId);
              setOnlyFit(Boolean(bikeId));
              setVisibleCount(PAGE_SIZE);
            }}
            aria-label="Choose a vehicle to show compatible products"
            className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3.5 py-2.5 text-sm font-semibold text-[#111111] outline-none shadow-2xs hover:border-gray-400 focus:border-[#E31E24]"
          >
            <option value="">All vehicles</option>
            {bikes.map((bike) => (
              <option key={bike.id} value={bike.id}>{bike.make} {bike.model}</option>
            ))}
          </select>
        </label>
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
              onChange={(e) => {
                setQ(e.target.value);
                setVisibleCount(PAGE_SIZE);
              }}
              placeholder="Search by part name, brand (Motul, Brembo, Ather), voltage, or specification..."
              className="w-full bg-transparent text-xs text-[#111111] placeholder:text-[#6B7280] focus:outline-none"
            />
            {q && (
              <button
                onClick={() => {
                  setQ("");
                  setVisibleCount(PAGE_SIZE);
                }}
                className="text-gray-400 hover:text-gray-700 p-1"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Product Category Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold text-[#6B7280]">Category:</span>
            <select
              value={subcat}
              onChange={(e) => {
                setSubcat(e.target.value);
                setBrand("All brands");
                setVisibleCount(PAGE_SIZE);
              }}
              aria-label="Filter by product category"
              className="rounded-full bg-white border border-[#E5E7EB] px-3.5 py-2 text-xs font-semibold text-[#111111] outline-none cursor-pointer shadow-2xs hover:border-gray-400 max-w-[200px]"
            >
              <option value="All">All categories ({categoryProducts.length})</option>
              {categoryOptions.map(({ category, count }) => (
                <option key={category} value={category}>
                  {category} ({count})
                </option>
              ))}
            </select>
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
          {SHOP_CATEGORIES.map((c) => {
            const isActive = cat === c;
            return (
              <button
                key={c}
                onClick={() => {
                  setCat(c);
                  setBrand("All brands");
                  setSubcat("All");
                  setVolt(null);
                  setOnlyFit(false);
                  setVisibleCount(PAGE_SIZE);
                }}
                className={cn(
                  "whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition active:scale-95",
                  isActive
                    ? "bg-[#E31E24] text-white shadow-xs"
                    : "bg-white border border-[#E5E7EB] text-[#111111] hover:border-[#111111] hover:bg-gray-50 shadow-2xs"
                )}
              >
                {c} ({categoryCounts[c]})
              </button>
            );
          })}
        </div>

        {/* Secondary Filter Badges */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-[#E5E7EB] text-xs">
          {accessoryVehicleType && (
            <label className="flex items-center gap-2 text-[#6B7280] font-semibold">
              <span>Brand:</span>
              <select
                value={brand}
                onChange={(e) => {
                  setBrand(e.target.value);
                  setVisibleCount(PAGE_SIZE);
                }}
                aria-label={`Filter ${accessoryVehicleType} accessories by brand`}
                className="rounded-full border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-semibold text-[#111111] outline-none shadow-2xs hover:border-gray-400"
              >
                <option value="All brands">All brands</option>
                {accessoryBrands.map(({ name, count }) => (
                  <option key={name} value={name}>{name} ({count})</option>
                ))}
              </select>
            </label>
          )}
          {showVoltageFilter && (
            <>
              <div className="flex items-center gap-1.5 text-[#6B7280] font-medium">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span>Voltage:</span>
              </div>
              {availableVoltages.map((v) => (
                <button
                  key={v}
                  onClick={() => {
                    setVolt(volt === v ? null : v);
                    setVisibleCount(PAGE_SIZE);
                  }}
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
            </>
          )}

          {showFitFilter && activeBike && (
            <label className="ml-auto flex items-center gap-2 cursor-pointer font-semibold text-xs text-[#111111] bg-white border border-[#E5E7EB] px-3 py-1 rounded-full shadow-2xs">
              <input
                type="checkbox"
                checked={onlyFit}
                onChange={(e) => {
                  setOnlyFit(e.target.checked);
                  setVisibleCount(PAGE_SIZE);
                }}
                className="rounded border-gray-300 accent-[#E31E24]"
              />
              <span>Fit for {activeBike.make} {activeBike.model} only</span>
            </label>
          )}
        </div>
      </div>

      {/* Products grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">
            Showing {Math.min(visibleCount, filteredProducts.length)} of {filteredProducts.length} items
            {subcat !== "All" && (
              <span> in <strong className="text-[#E31E24]">{subcat}</strong></span>
            )}
          </p>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-xs font-semibold text-[#E31E24] hover:underline"
            >
              Reset all filters
            </button>
          )}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-white border border-[#E5E7EB] shadow-2xs rounded-3xl p-12 text-center space-y-3">
            <p className="text-base font-bold text-[#111111]">No products found</p>
            <p className="text-xs text-[#6B7280] max-w-md mx-auto">
              No parts match your current filters. Clear them to browse the full catalog.
            </p>
            <button
              onClick={resetFilters}
              className="rounded-full bg-[#E31E24] px-5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-red-700"
            >
              Show All Products
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.slice(0, visibleCount).map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>

            {visibleCount < filteredProducts.length && (
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filteredProducts.length))}
                  className="rounded-xl border border-[#E5E7EB] bg-white px-6 py-2.5 text-xs font-bold text-[#111111] shadow-2xs hover:border-[#111111] hover:bg-gray-50 cursor-pointer transition"
                >
                  Load More Products ({filteredProducts.length - visibleCount} remaining)
                </button>
                <button
                  onClick={() => setVisibleCount(filteredProducts.length)}
                  className="rounded-xl bg-[#E31E24] px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-red-700 cursor-pointer transition"
                >
                  Show All {filteredProducts.length} Items
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
