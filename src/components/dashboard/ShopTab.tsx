import { useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  Bike,
  ScanLine,
  ChevronDown,
  Check,
} from "lucide-react";
import { ProductCard } from "@/components/site/bits";
import { bestOffer, bikes, getBike, products } from "@/lib/data";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { VinSearchModal } from "./VinSearchModal";

const SHOP_CATEGORIES = [
  "All",
  "Electric Bikes",
  "EV Batteries",
  "Car Accessories",
  "Bike Accessories",
] as const;

const PAGE_SIZE = 40;

function matchesShopCategory(
  product: (typeof products)[number],
  category: (typeof SHOP_CATEGORIES)[number]
) {
  if (category === "All") return true;
  if (category === "Electric Bikes") return product.category === "Electric Bikes";
  if (category === "EV Batteries")
    return product.category === "Battery" || product.category === "EV Batteries";
  if (category === "Car Accessories")
    return (
      product.isAccessoryProduct &&
      (product.vehicleType === "car" || product.vehicleType === "both")
    );
  return (
    product.isAccessoryProduct &&
    (product.vehicleType === "bike" || product.vehicleType === "both")
  );
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

  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [isVinModalOpen, setIsVinModalOpen] = useState(false);

  const accessoryVehicleType =
    cat === "Car Accessories" ? "car" : cat === "Bike Accessories" ? "bike" : null;

  const categoryProducts = useMemo(
    () => products.filter((p) => matchesShopCategory(p, cat)),
    [cat]
  );

  const categoryOptions = useMemo(
    () =>
      [...new Set(categoryProducts.map((p) => p.category))]
        .sort((a, b) => a.localeCompare(b))
        .map((category) => ({
          category,
          count: categoryProducts.filter((p) => p.category === category).length,
        })),
    [categoryProducts]
  );

  const subcategoryProducts = useMemo(
    () =>
      categoryProducts.filter(
        (p) =>
          subcat === "All" ||
          p.category.toLowerCase() === subcat.toLowerCase() ||
          (p.subcategory && p.subcategory.toLowerCase() === subcat.toLowerCase()) ||
          (Array.isArray(p.subcategories) &&
            p.subcategories.some((s) => s.toLowerCase() === subcat.toLowerCase()))
      ),
    [categoryProducts, subcat]
  );

  const accessoryBrands = useMemo(() => {
    if (!accessoryVehicleType) return [];
    return [...new Set(subcategoryProducts.map((p) => p.brand).filter(Boolean))]
      .sort((a, b) => a.localeCompare(b))
      .map((name) => ({
        name,
        count: subcategoryProducts.filter((p) => p.brand === name).length,
      }));
  }, [accessoryVehicleType, subcategoryProducts]);

  const availableVoltages = [48, 52, 60, 72];

  const filteredProducts = useMemo(() => {
    let list = products.filter((p) => {
      const matchesCat = matchesShopCategory(p, cat);

      const matchesSubcat =
        subcat === "All" ||
        p.category.toLowerCase() === subcat.toLowerCase() ||
        (p.subcategory && p.subcategory.toLowerCase() === subcat.toLowerCase()) ||
        (Array.isArray(p.subcategories) &&
          p.subcategories.some((s) => s.toLowerCase() === subcat.toLowerCase()));

      const matchesVolt = volt === null || p.voltage === volt;
      const matchesFit =
        !onlyFit ||
        Boolean(activeBikeId && p.fits.length > 0 && p.fits.includes(activeBikeId));
      const matchesBrand =
        !accessoryVehicleType || brand === "All brands" || p.brand === brand;
      const queryLower = q.toLowerCase().trim();
      const matchesQuery =
        !queryLower ||
        `${p.name} ${p.brand} ${p.category} ${p.subcategory || ""} ${p.description}`
          .toLowerCase()
          .includes(queryLower);

      return (
        matchesCat &&
        matchesSubcat &&
        matchesVolt &&
        matchesFit &&
        matchesBrand &&
        matchesQuery
      );
    });

    if (sort === "low") {
      list = [...list].sort((a, b) => bestOffer(a).price - bestOffer(b).price);
    } else if (sort === "high") {
      list = [...list].sort((a, b) => bestOffer(b).price - bestOffer(a).price);
    }
    return list;
  }, [q, cat, brand, accessoryVehicleType, subcat, volt, onlyFit, activeBikeId, sort]);

  const activeBike = activeBikeId ? getBike(activeBikeId) : null;

  // Count active filters (excluding default category All)
  const activeFilterCount =
    (subcat !== "All" ? 1 : 0) +
    (volt !== null ? 1 : 0) +
    (onlyFit ? 1 : 0) +
    (brand !== "All brands" ? 1 : 0) +
    (sort !== "relevance" ? 1 : 0);

  const resetFilters = () => {
    setCat("All");
    setBrand("All brands");
    setSubcat("All");
    setVolt(null);
    setOnlyFit(false);
    setSort("relevance");
    setQ("");
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <div className="space-y-3.5 sm:space-y-4 animate-in fade-in duration-200">
      {/* Page Title: "Shop" at 24/700 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight font-display">
          Shop
        </h1>
        {/* Muted Result line on phone */}
        <p className="text-xs text-gray-500 font-medium">
          {Math.min(visibleCount, filteredProducts.length)} of {filteredProducts.length}
        </p>
      </div>

      {/* Row 1: compact "Your bike" pill with bike icon and name, plus small VIN button */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 min-w-0">
          <select
            value={activeBikeId ?? ""}
            onChange={(event) => {
              const bikeId = event.target.value || null;
              setActiveBikeId(bikeId);
              setOnlyFit(Boolean(bikeId));
              setVisibleCount(PAGE_SIZE);
            }}
            aria-label="Your bike"
            className="w-full appearance-none rounded-full border border-[#E5E7EB] bg-white pl-9 pr-8 py-2 text-xs font-semibold text-gray-900 outline-none shadow-2xs hover:border-gray-400 focus:border-[#E31E24] truncate cursor-pointer"
          >
            <option value="">Your bike: All</option>
            {bikes.map((bike) => (
              <option key={bike.id} value={bike.id}>
                {bike.make} {bike.model}
              </option>
            ))}
          </select>
          <Bike className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#E31E24] pointer-events-none" />
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
        </div>

        <button
          type="button"
          onClick={() => setIsVinModalOpen(true)}
          className="h-9 w-9 min-w-9 min-h-9 rounded-full border border-[#E5E7EB] bg-white grid place-items-center text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 transition-colors shadow-2xs cursor-pointer shrink-0"
          aria-label="Lookup by VIN"
          title="Lookup by VIN"
        >
          <ScanLine className="h-4 w-4 text-emerald-600" />
        </button>
      </div>

      {/* Row 2: search field (48px) and "Filters" button with active count badge */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setVisibleCount(PAGE_SIZE);
            }}
            placeholder="Search parts or brands"
            className="w-full h-12 rounded-full border border-[#E5E7EB] bg-white pl-10 pr-9 text-xs text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#E31E24] shadow-2xs"
          />
          {q && (
            <button
              type="button"
              onClick={() => {
                setQ("");
                setVisibleCount(PAGE_SIZE);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-1 cursor-pointer"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsFilterSheetOpen(true)}
          className="h-12 px-4 rounded-full border border-[#E5E7EB] bg-white hover:bg-gray-50 text-xs font-semibold text-gray-800 flex items-center gap-2 shadow-2xs cursor-pointer shrink-0"
          aria-label="Open filters"
        >
          <SlidersHorizontal className="h-4 w-4 text-gray-600" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="h-5 min-w-5 px-1.5 rounded-full bg-[#E31E24] text-[10px] font-bold text-white grid place-items-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Row 3: category chips in horizontal scroll row, snap scrolling, right-edge fade */}
      <div className="relative -mx-4 px-4 overflow-hidden">
        <div className="flex items-center gap-2 overflow-x-auto snap-x scrollbar-none pb-1">
          {SHOP_CATEGORIES.map((c) => {
            const isActive = cat === c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setCat(c);
                  setBrand("All brands");
                  setSubcat("All");
                  setVolt(null);
                  setOnlyFit(false);
                  setVisibleCount(PAGE_SIZE);
                }}
                className={cn(
                  "snap-start shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition active:scale-95 cursor-pointer",
                  isActive
                    ? "bg-[#E31E24] text-white shadow-xs"
                    : "bg-white border border-[#E5E7EB] text-gray-800 hover:border-gray-400 shadow-2xs"
                )}
              >
                {c}
              </button>
            );
          })}
        </div>
        <div className="pointer-events-none absolute right-0 inset-y-0 w-8 bg-gradient-to-l from-[#F5F6F8] to-transparent" />
      </div>

      {/* Active Filter Removable Chips (under row, only when active) */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          {subcat !== "All" && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-gray-300 text-xs text-gray-800">
              <span>{subcat}</span>
              <button
                type="button"
                onClick={() => setSubcat("All")}
                className="hover:text-red-600 cursor-pointer"
                aria-label="Remove category filter"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {volt !== null && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-gray-300 text-xs text-gray-800">
              <span>{volt}V</span>
              <button
                type="button"
                onClick={() => setVolt(null)}
                className="hover:text-red-600 cursor-pointer"
                aria-label="Remove voltage filter"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {onlyFit && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-gray-300 text-xs text-gray-800">
              <span>Fits my bike</span>
              <button
                type="button"
                onClick={() => setOnlyFit(false)}
                className="hover:text-red-600 cursor-pointer"
                aria-label="Remove fit filter"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {brand !== "All brands" && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-gray-300 text-xs text-gray-800">
              <span>{brand}</span>
              <button
                type="button"
                onClick={() => setBrand("All brands")}
                className="hover:text-red-600 cursor-pointer"
                aria-label="Remove brand filter"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {sort !== "relevance" && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-gray-300 text-xs text-gray-800">
              <span>Sort: {sort === "low" ? "Low-High" : "High-Low"}</span>
              <button
                type="button"
                onClick={() => setSort("relevance")}
                className="hover:text-red-600 cursor-pointer"
                aria-label="Remove sort filter"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={resetFilters}
            className="text-xs text-[#E31E24] hover:underline font-semibold ml-1 cursor-pointer"
          >
            Reset
          </button>
        </div>
      )}

      {/* Product Grid: 2 columns from 360px width, equal card heights */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white border border-[#E5E7EB] shadow-2xs rounded-2xl p-8 text-center space-y-2">
          <p className="text-sm font-bold text-gray-900">No parts found</p>
          <p className="text-xs text-gray-500">Try adjusting your filters.</p>
          <button
            type="button"
            onClick={resetFilters}
            className="rounded-full bg-[#E31E24] px-4 py-1.5 text-xs font-semibold text-white cursor-pointer"
          >
            Reset
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4">
            {filteredProducts.slice(0, visibleCount).map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>

          {visibleCount < filteredProducts.length && (
            <div className="pt-2 flex justify-center">
              <button
                type="button"
                onClick={() =>
                  setVisibleCount((prev) =>
                    Math.min(prev + PAGE_SIZE, filteredProducts.length)
                  )
                }
                className="rounded-full border border-[#E5E7EB] bg-white px-5 py-2 text-xs font-bold text-gray-900 shadow-2xs hover:bg-gray-50 cursor-pointer transition active:scale-95"
              >
                Load more
              </button>
            </div>
          )}
        </>
      )}

      {/* Filters Bottom Sheet: max 85% height, grab handle, Category, Sort, Voltage, Fits my bike, Apply/Reset */}
      {isFilterSheetOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col justify-end">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsFilterSheetOpen(false)}
          />

          <div className="relative z-10 w-full max-w-lg mx-auto max-h-[85dvh] bg-white rounded-t-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
            {/* Grab handle */}
            <div className="pt-2.5 pb-1 flex justify-center shrink-0">
              <div className="w-10 h-1.5 rounded-full bg-gray-300" />
            </div>

            {/* Header */}
            <div className="px-4 py-2.5 border-b border-[#E5E7EB] flex items-center justify-between shrink-0">
              <h3 className="text-sm font-bold text-gray-900">Filters</h3>
              <button
                type="button"
                onClick={() => setIsFilterSheetOpen(false)}
                className="h-8 w-8 rounded-full grid place-items-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 cursor-pointer"
                aria-label="Close filters"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable Filter Options */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              {/* 1. Category */}
              <div>
                <p className="font-bold text-gray-900 mb-2">Category</p>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSubcat("All")}
                    className={cn(
                      "px-3 py-1.5 rounded-full font-semibold border transition cursor-pointer",
                      subcat === "All"
                        ? "bg-[#E31E24] text-white border-[#E31E24]"
                        : "bg-white text-gray-800 border-gray-200 hover:border-gray-400"
                    )}
                  >
                    All
                  </button>
                  {categoryOptions.map(({ category }) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setSubcat(category)}
                      className={cn(
                        "px-3 py-1.5 rounded-full font-semibold border transition cursor-pointer",
                        subcat === category
                          ? "bg-[#E31E24] text-white border-[#E31E24]"
                          : "bg-white text-gray-800 border-gray-200 hover:border-gray-400"
                      )}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Sort */}
              <div>
                <p className="font-bold text-gray-900 mb-2">Sort</p>
                <div className="grid grid-cols-1 gap-1.5">
                  {[
                    { id: "relevance", label: "Featured & Relevant" },
                    { id: "low", label: "Price: Low to High" },
                    { id: "high", label: "Price: High to Low" },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSort(s.id)}
                      className={cn(
                        "flex items-center justify-between p-2.5 rounded-xl border text-left font-semibold transition cursor-pointer",
                        sort === s.id
                          ? "border-[#E31E24] bg-red-50/50 text-[#E31E24]"
                          : "border-gray-200 bg-white text-gray-800 hover:border-gray-300"
                      )}
                    >
                      <span>{s.label}</span>
                      {sort === s.id && <Check className="h-4 w-4 text-[#E31E24]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Voltage: 48V, 52V, 60V, 72V as chips */}
              <div>
                <p className="font-bold text-gray-900 mb-2">Voltage</p>
                <div className="flex gap-2">
                  {availableVoltages.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setVolt(volt === v ? null : v)}
                      className={cn(
                        "flex-1 py-2 rounded-xl border font-semibold text-center transition cursor-pointer",
                        volt === v
                          ? "bg-[#E31E24] text-white border-[#E31E24]"
                          : "bg-white text-gray-800 border-gray-200 hover:border-gray-400"
                      )}
                    >
                      {v}V
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. "Fits my bike" Toggle */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900">Fits my bike</p>
                  <p className="text-[11px] text-gray-500">
                    {activeBike ? `Only parts for ${activeBike.model}` : "Filter by saved bike"}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={onlyFit}
                  onChange={(e) => setOnlyFit(e.target.checked)}
                  className="h-5 w-5 rounded border-gray-300 accent-[#E31E24] cursor-pointer"
                />
              </div>

              {/* Brand filter if accessories */}
              {accessoryBrands.length > 0 && (
                <div>
                  <p className="font-bold text-gray-900 mb-2">Brand</p>
                  <select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white p-2.5 text-xs font-semibold text-gray-900 outline-none"
                  >
                    <option value="All brands">All brands</option>
                    {accessoryBrands.map(({ name, count }) => (
                      <option key={name} value={name}>
                        {name} ({count})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Bottom Actions: Apply and Reset */}
            <div className="p-3 border-t border-[#E5E7EB] bg-white flex gap-2 shrink-0">
              <button
                type="button"
                onClick={resetFilters}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setIsFilterSheetOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#E31E24] hover:bg-red-700 text-xs font-bold text-white shadow-xs cursor-pointer"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global VIN Search Modal */}
      <VinSearchModal
        isOpen={isVinModalOpen}
        onClose={() => setIsVinModalOpen(false)}
      />
    </div>
  );
}
