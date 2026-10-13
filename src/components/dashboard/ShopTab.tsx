import { useMemo, useState, useEffect } from "react";
import {
  Bike,
  Car,
  Search,
  SlidersHorizontal,
  ShieldCheck,
  Check,
  X,
  Sparkles,
  Zap,
  Loader2,
  Tag,
  Layers,
  RotateCcw,
} from "lucide-react";
import { ProductCard } from "@/components/site/bits";
import { bestOffer, bikes, getBike, mapDbProductToProduct, type Product, type Category } from "@/lib/data";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function ShopTab() {
  const { activeBikeId, setActiveBikeId } = useStore();

  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters State
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("All");
  const [selectedBrand, setSelectedBrand] = useState<string>("All");
  const [selectedVehicleType, setSelectedVehicleType] = useState<string>("All");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("All");
  const [selectedStock, setSelectedStock] = useState<string>("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("all");
  const [volt, setVolt] = useState<number | null>(null);
  const [onlyFit, setOnlyFit] = useState(false);
  const [sort, setSort] = useState("relevance");

  // Fetch products from PostgreSQL database
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

  // Multi-dimensional Filtering
  const filteredProducts = useMemo(() => {
    let list = dbProducts.filter((p) => {
      // 1. Category Filter
      const matchesCat =
        cat === "All" ||
        p.category.toLowerCase().includes(cat.toLowerCase()) ||
        cat.toLowerCase().includes(p.category.toLowerCase());

      // 2. Brand Filter
      const matchesBrand =
        selectedBrand === "All" ||
        p.brand?.toLowerCase() === selectedBrand.toLowerCase();

      // 3. Vehicle Type Filter
      const pVType = (p.vehicleType || "").toLowerCase();
      const matchesVehicleType =
        selectedVehicleType === "All" ||
        (selectedVehicleType === "bike" && (pVType === "bike" || pVType === "two-wheeler" || p.category.toLowerCase().includes("bike"))) ||
        (selectedVehicleType === "car" && (pVType === "car" || pVType === "four-wheeler" || p.category.toLowerCase().includes("car"))) ||
        (selectedVehicleType === "universal" && (pVType === "universal" || pVType === "both" || pVType === "" || p.fits.includes("universal")));

      // 4. Department Filter
      const matchesDepartment =
        selectedDepartment === "All" ||
        p.department?.toLowerCase() === selectedDepartment.toLowerCase();

      // 5. Stock Status Filter
      const offer = bestOffer(p);
      const stock = offer.stock ?? p.offers?.[0]?.stock ?? 0;
      const matchesStock =
        selectedStock === "all" ||
        (selectedStock === "in_stock" && stock >= 5) ||
        (selectedStock === "low_stock" && stock < 5);

      // 6. Price Range Filter
      const price = offer.price;
      const matchesPrice =
        selectedPriceRange === "all" ||
        (selectedPriceRange === "under_1k" && price < 1000) ||
        (selectedPriceRange === "1k_5k" && price >= 1000 && price <= 5000) ||
        (selectedPriceRange === "5k_15k" && price > 5000 && price <= 15000) ||
        (selectedPriceRange === "above_15k" && price > 15000);

      // 7. Voltage Filter
      const matchesVolt = !volt || p.voltage === volt;

      // 8. Vehicle Fitment Filter
      const matchesFit =
        !onlyFit ||
        !activeBikeId ||
        p.fits.includes("universal") ||
        p.fits.includes(activeBikeId);

      // 9. Search Query Filter
      const queryLower = q.toLowerCase().trim();
      const matchesQuery =
        !queryLower ||
        `${p.name} ${p.brand} ${p.category} ${p.description} ${p.department || ""} ${p.vehicleType || ""}`
          .toLowerCase()
          .includes(queryLower);

      return (
        matchesCat &&
        matchesBrand &&
        matchesVehicleType &&
        matchesDepartment &&
        matchesStock &&
        matchesPrice &&
        matchesVolt &&
        matchesFit &&
        matchesQuery
      );
    });

    if (sort === "low") {
      list = [...list].sort((a, b) => bestOffer(a).price - bestOffer(b).price);
    } else if (sort === "high") {
      list = [...list].sort((a, b) => bestOffer(b).price - bestOffer(a).price);
    }
    return list;
  }, [
    dbProducts,
    q,
    cat,
    selectedBrand,
    selectedVehicleType,
    selectedDepartment,
    selectedStock,
    selectedPriceRange,
    volt,
    onlyFit,
    activeBikeId,
    sort,
  ]);

  // Dynamic Filter Options
  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    dbProducts.forEach((p) => {
      if (p.category && p.category !== "All") set.add(p.category);
    });
    return ["All", ...Array.from(set).sort()];
  }, [dbProducts]);

  const availableBrands = useMemo(() => {
    const set = new Set<string>();
    dbProducts.forEach((p) => {
      if (p.brand && p.brand.trim() && p.brand !== "Riderzpro Certified") set.add(p.brand.trim());
    });
    return ["All", "Riderzpro Certified", ...Array.from(set).sort()];
  }, [dbProducts]);

  const availableDepartments = useMemo(() => {
    const set = new Set<string>();
    dbProducts.forEach((p) => {
      if (p.department && p.department.trim()) set.add(p.department.trim());
    });
    return ["All", ...Array.from(set).sort()];
  }, [dbProducts]);

  const isAnyFilterActive =
    q !== "" ||
    cat !== "All" ||
    selectedBrand !== "All" ||
    selectedVehicleType !== "All" ||
    selectedDepartment !== "All" ||
    selectedStock !== "all" ||
    selectedPriceRange !== "all" ||
    volt !== null ||
    onlyFit;

  const clearAllFilters = () => {
    setQ("");
    setCat("All");
    setSelectedBrand("All");
    setSelectedVehicleType("All");
    setSelectedDepartment("All");
    setSelectedStock("all");
    setSelectedPriceRange("all");
    setVolt(null);
    setOnlyFit(false);
    setSort("relevance");
  };

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
          SECTION B: SEARCH, CATEGORY PILLS & EXTENDED FILTERS
         ───────────────────────────────────────────────────────────── */}
      <div className="bg-white border border-[#E5E7EB] shadow-2xs rounded-2xl p-4 space-y-4">
        {/* Row 1: Search & Sort */}
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
          {/* Live Search Input */}
          <div className="relative flex flex-1 items-center bg-[#F5F6F8] rounded-full border border-[#E5E7EB] px-4 py-2 focus-within:bg-white focus-within:border-gray-400 focus-within:ring-2 focus-within:ring-[#E31E24]/20 shadow-2xs">
            <Search className="h-4 w-4 text-[#6B7280] shrink-0 mr-2.5" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by part name, brand, vehicle type, department, voltage..."
              className="w-full bg-transparent text-xs text-[#111111] placeholder:text-[#6B7280] focus:outline-none"
            />
            {q && (
              <button
                onClick={() => setQ("")}
                className="text-gray-400 hover:text-gray-700 p-1 cursor-pointer"
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

        {/* Row 2: Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {availableCategories.map((c) => {
            const isActive = cat === c;
            return (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={cn(
                  "whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition active:scale-95 cursor-pointer",
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

        {/* Row 3: Extended Filters Toolbar (Brand, Vehicle Type, Department, Price, Stock) */}
        <div className="flex flex-wrap items-center gap-2.5 pt-3 border-t border-[#E5E7EB] text-xs">
          {/* Brand Filter */}
          <div className="flex items-center gap-1.5 bg-white border border-[#E5E7EB] rounded-full px-3 py-1.5 shadow-2xs hover:border-gray-400 transition">
            <Tag className="h-3.5 w-3.5 text-[#E31E24]" />
            <span className="text-[11px] font-semibold text-[#6B7280]">Brand:</span>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="bg-transparent font-bold text-[#111111] outline-none cursor-pointer pr-1"
            >
              {availableBrands.map((b) => (
                <option key={b} value={b}>
                  {b === "All" ? "All Brands" : b}
                </option>
              ))}
            </select>
          </div>

          {/* Vehicle Type Filter */}
          <div className="flex items-center gap-1.5 bg-white border border-[#E5E7EB] rounded-full px-3 py-1.5 shadow-2xs hover:border-gray-400 transition">
            <Car className="h-3.5 w-3.5 text-[#E31E24]" />
            <span className="text-[11px] font-semibold text-[#6B7280]">Vehicle Type:</span>
            <select
              value={selectedVehicleType}
              onChange={(e) => setSelectedVehicleType(e.target.value)}
              className="bg-transparent font-bold text-[#111111] outline-none cursor-pointer pr-1"
            >
              <option value="All">All Types</option>
              <option value="bike">🛵 2-Wheeler (Bikes/EVs)</option>
              <option value="car">🚗 4-Wheeler (Cars)</option>
              <option value="universal">⚡ Universal Fitment</option>
            </select>
          </div>

          {/* Department Filter */}
          {availableDepartments.length > 1 && (
            <div className="flex items-center gap-1.5 bg-white border border-[#E5E7EB] rounded-full px-3 py-1.5 shadow-2xs hover:border-gray-400 transition">
              <Layers className="h-3.5 w-3.5 text-[#E31E24]" />
              <span className="text-[11px] font-semibold text-[#6B7280]">Department:</span>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="bg-transparent font-bold text-[#111111] outline-none cursor-pointer pr-1"
              >
                {availableDepartments.map((d) => (
                  <option key={d} value={d}>
                    {d === "All" ? "All Departments" : d}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Stock / Availability Filter */}
          <div className="flex items-center gap-1.5 bg-white border border-[#E5E7EB] rounded-full px-3 py-1.5 shadow-2xs hover:border-gray-400 transition">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[11px] font-semibold text-[#6B7280]">Stock:</span>
            <select
              value={selectedStock}
              onChange={(e) => setSelectedStock(e.target.value)}
              className="bg-transparent font-bold text-[#111111] outline-none cursor-pointer pr-1"
            >
              <option value="all">All Availability</option>
              <option value="in_stock">In Stock (5+ units)</option>
              <option value="low_stock">⚠️ Hurry Limited Stock (&lt; 5)</option>
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="flex items-center gap-1.5 bg-white border border-[#E5E7EB] rounded-full px-3 py-1.5 shadow-2xs hover:border-gray-400 transition">
            <span className="font-bold text-[#E31E24] text-[11px]">₹</span>
            <span className="text-[11px] font-semibold text-[#6B7280]">Price:</span>
            <select
              value={selectedPriceRange}
              onChange={(e) => setSelectedPriceRange(e.target.value)}
              className="bg-transparent font-bold text-[#111111] outline-none cursor-pointer pr-1"
            >
              <option value="all">Any Price</option>
              <option value="under_1k">Under ₹1,000</option>
              <option value="1k_5k">₹1,000 - ₹5,000</option>
              <option value="5k_15k">₹5,000 - ₹15,000</option>
              <option value="above_15k">Above ₹15,000</option>
            </select>
          </div>

          {/* Voltage Selector */}
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-[11px] font-semibold text-[#6B7280] hidden sm:inline">Voltage:</span>
            {[48, 60, 72].map((v) => (
              <button
                key={v}
                onClick={() => setVolt(volt === v ? null : v)}
                className={cn(
                  "rounded-full px-2.5 py-1 text-[11px] font-bold transition active:scale-95 shadow-2xs cursor-pointer",
                  volt === v
                    ? "bg-[#E31E24] text-white"
                    : "bg-white border border-[#E5E7EB] text-[#111111] hover:border-[#111111]"
                )}
              >
                {v}V
              </button>
            ))}
          </div>

          {/* Active Bike Fitment Checkbox */}
          {activeBike && (
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-xs text-[#111111] bg-white border border-[#E5E7EB] px-3 py-1 rounded-full shadow-2xs ml-auto sm:ml-0">
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

        {/* Row 4: Active Filter Chips & Reset All */}
        {isAnyFilterActive && (
          <div className="flex flex-wrap items-center gap-2 pt-2.5 border-t border-[#E5E7EB] text-xs">
            <span className="text-[11px] font-bold text-[#6B7280]">Active Filters:</span>

            {cat !== "All" && (
              <span className="inline-flex items-center gap-1 bg-red-50 text-[#E31E24] font-semibold text-[11px] px-2.5 py-0.5 rounded-full border border-red-200">
                Category: {cat}
                <button onClick={() => setCat("All")} className="hover:text-red-800 cursor-pointer">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {selectedBrand !== "All" && (
              <span className="inline-flex items-center gap-1 bg-red-50 text-[#E31E24] font-semibold text-[11px] px-2.5 py-0.5 rounded-full border border-red-200">
                Brand: {selectedBrand}
                <button onClick={() => setSelectedBrand("All")} className="hover:text-red-800 cursor-pointer">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {selectedVehicleType !== "All" && (
              <span className="inline-flex items-center gap-1 bg-red-50 text-[#E31E24] font-semibold text-[11px] px-2.5 py-0.5 rounded-full border border-red-200">
                Vehicle: {selectedVehicleType === "bike" ? "2-Wheeler" : selectedVehicleType === "car" ? "4-Wheeler" : "Universal"}
                <button onClick={() => setSelectedVehicleType("All")} className="hover:text-red-800 cursor-pointer">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {selectedDepartment !== "All" && (
              <span className="inline-flex items-center gap-1 bg-red-50 text-[#E31E24] font-semibold text-[11px] px-2.5 py-0.5 rounded-full border border-red-200">
                Dept: {selectedDepartment}
                <button onClick={() => setSelectedDepartment("All")} className="hover:text-red-800 cursor-pointer">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {selectedStock !== "all" && (
              <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 font-semibold text-[11px] px-2.5 py-0.5 rounded-full border border-amber-200">
                Stock: {selectedStock === "in_stock" ? "In Stock (5+)" : "Limited Stock (< 5)"}
                <button onClick={() => setSelectedStock("all")} className="hover:text-amber-900 cursor-pointer">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {selectedPriceRange !== "all" && (
              <span className="inline-flex items-center gap-1 bg-red-50 text-[#E31E24] font-semibold text-[11px] px-2.5 py-0.5 rounded-full border border-red-200">
                Price: {selectedPriceRange === "under_1k" ? "< ₹1,000" : selectedPriceRange === "1k_5k" ? "₹1,000 - ₹5,000" : selectedPriceRange === "5k_15k" ? "₹5,000 - ₹15,000" : "> ₹15,000"}
                <button onClick={() => setSelectedPriceRange("all")} className="hover:text-red-800 cursor-pointer">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {volt && (
              <span className="inline-flex items-center gap-1 bg-red-50 text-[#E31E24] font-semibold text-[11px] px-2.5 py-0.5 rounded-full border border-red-200">
                Voltage: {volt}V
                <button onClick={() => setVolt(null)} className="hover:text-red-800 cursor-pointer">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            <button
              onClick={clearAllFilters}
              className="ml-auto inline-flex items-center gap-1 text-[11px] font-bold text-[#E31E24] hover:underline cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
              Reset All
            </button>
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          SECTION C: PRODUCTS GRID
         ───────────────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">
            Showing {filteredProducts.length} items
          </p>
          {isAnyFilterActive && (
            <button
              onClick={clearAllFilters}
              className="text-xs font-semibold text-[#E31E24] hover:underline cursor-pointer"
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
              No products match your current filter combination. Try selecting different brands, vehicle types, or clearing filters.
            </p>
            <button
              onClick={clearAllFilters}
              className="rounded-full bg-[#E31E24] px-5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-red-700 cursor-pointer"
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
