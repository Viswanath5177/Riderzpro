import { useMemo, useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
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
  MapPin,
  Navigation,
  Star,
  Store,
  Clock,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { ProductCard } from "@/components/site/bits";
import {
  bestOffer,
  bikes,
  getBike,
  getVendor,
  vendors,
  distanceKm,
  etaMinutes,
  products as fallbackProducts,
  mapDbProductToProduct,
  type Product,
  type Category,
  type Vendor,
} from "@/lib/data";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function ShopTab() {
  const {
    activeBikeId,
    setActiveBikeId,
    userLocation,
    setIsLocationModalOpen,
  } = useStore();

  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [dbVendors, setDbVendors] = useState<Vendor[]>([]);
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

  // Zomato-style Hyperlocal Filters
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);
  const [onlyNearby, setOnlyNearby] = useState(false);
  const [onlyFastDelivery, setOnlyFastDelivery] = useState(false);

  // Fetch products from PostgreSQL database (with fallback to fallbackProducts)
  useEffect(() => {
    setIsLoading(true);
    fetch("/api/products")
      .then((r) => r.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          const mapped: Product[] = res.data.map((row: any) => mapDbProductToProduct(row));
          setDbProducts(mapped);
        } else {
          setDbProducts([]);
        }
      })
      .catch((err) => {
        console.error("ShopTab fetch error:", err);
        setDbProducts([]);
      })
      .finally(() => {
        setIsLoading(false);
      });

    fetch("/api/sellers")
      .then((r) => r.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          setDbVendors(res.data);
        } else {
          setDbVendors([]);
        }
      })
      .catch((err) => {
        console.error("ShopTab sellers fetch error:", err);
        setDbVendors([]);
      });
  }, []);

  // Compute Nearby Stores with live distance and delivery ETA (Zomato-style)
  const nearbyVendors = useMemo(() => {
    return dbVendors
      .map((v) => {
        const dist = userLocation ? Math.round(distanceKm(v, userLocation) * 10) / 10 : 0;
        const eta = etaMinutes(dist, v.prepMins);
        const inStockCount = dbProducts.filter((p) =>
          p.offers?.some((o) => o.vendorId === v.id && (o.stock ?? 1) > 0)
        ).length;
        return {
          ...v,
          distanceKm: dist,
          etaMinutes: eta,
          inStockCount,
        };
      })
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [userLocation, dbProducts, dbVendors]);

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

      // 10. Selected Store / Vendor Filter
      const matchesVendor = !selectedVendorId || p.offers?.some((o) => o.vendorId === selectedVendorId);

      // 11. Hyperlocal Proximity Filter (< 5 km)
      let matchesNearby = true;
      if (onlyNearby && userLocation) {
        matchesNearby = p.offers?.some((o) => {
          const v = getVendor(o.vendorId);
          return distanceKm(v, userLocation) <= 5.0;
        }) ?? false;
      }

      // 12. Fast Delivery Filter (< 30 mins)
      let matchesFastDelivery = true;
      if (onlyFastDelivery && userLocation) {
        matchesFastDelivery = p.offers?.some((o) => {
          const v = getVendor(o.vendorId);
          const dist = distanceKm(v, userLocation);
          return etaMinutes(dist, v.prepMins) <= 30;
        }) ?? false;
      }

      return (
        matchesCat &&
        matchesBrand &&
        matchesVehicleType &&
        matchesDepartment &&
        matchesStock &&
        matchesPrice &&
        matchesVolt &&
        matchesFit &&
        matchesQuery &&
        matchesVendor &&
        matchesNearby &&
        matchesFastDelivery
      );
    });

    // Sorting
    if (sort === "low") {
      list = [...list].sort((a, b) => bestOffer(a).price - bestOffer(b).price);
    } else if (sort === "high") {
      list = [...list].sort((a, b) => bestOffer(b).price - bestOffer(a).price);
    } else if (sort === "distance" && userLocation) {
      list = [...list].sort((a, b) => {
        const distA = Math.min(...(a.offers?.map((o) => distanceKm(getVendor(o.vendorId), userLocation)) || [999]));
        const distB = Math.min(...(b.offers?.map((o) => distanceKm(getVendor(o.vendorId), userLocation)) || [999]));
        return distA - distB;
      });
    } else if (sort === "eta" && userLocation) {
      list = [...list].sort((a, b) => {
        const etaA = Math.min(...(a.offers?.map((o) => {
          const v = getVendor(o.vendorId);
          return etaMinutes(distanceKm(v, userLocation), v.prepMins);
        }) || [999]));
        const etaB = Math.min(...(b.offers?.map((o) => {
          const v = getVendor(o.vendorId);
          return etaMinutes(distanceKm(v, userLocation), v.prepMins);
        }) || [999]));
        return etaA - etaB;
      });
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
    selectedVendorId,
    onlyNearby,
    onlyFastDelivery,
    sort,
    userLocation,
  ]);

  // Dynamic Filter Options
  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    dbProducts.forEach((p) => {
      if (p.category && (p.category as string) !== "All") set.add(p.category);
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
    onlyFit ||
    selectedVendorId !== null ||
    onlyNearby ||
    onlyFastDelivery;

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
    setSelectedVendorId(null);
    setOnlyNearby(false);
    setOnlyFastDelivery(false);
    setSort("relevance");
  };

  const activeBike = activeBikeId ? getBike(activeBikeId) : null;
  const activeSelectedVendor = selectedVendorId ? getVendor(selectedVendorId) : null;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* ─────────────────────────────────────────────────────────────
          SECTION 1: ZOMATO-STYLE LOCATION & DELIVERY BANNER
         ───────────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-rose-50/90 via-white to-red-50/50 border border-red-100 rounded-3xl p-5 sm:p-7 text-[#111111] shadow-2xs relative overflow-hidden">
        {/* Background decorative glow */}
        <div className="absolute right-0 top-0 -mt-12 -mr-12 w-64 h-64 rounded-full bg-red-100/50 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 -mb-12 w-48 h-48 rounded-full bg-rose-100/40 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 bg-red-100/80 text-[#E31E24] px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border border-red-200/70">
                <Zap className="h-3 w-3 fill-[#E31E24] text-[#E31E24]" />
                Hyperlocal Auto Delivery
              </span>
              <span className="text-gray-300 text-xs hidden sm:inline">·</span>
              <span className="text-[#6B7280] text-xs font-semibold hidden sm:inline">
                Instant Courier Dispatch
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1">
              <span className="text-sm sm:text-base font-bold text-[#111111]">
                Delivering parts & bikes to:
              </span>

              {/* Interactive Location Selector Button (Zomato-Style) */}
              <button
                onClick={() => setIsLocationModalOpen(true)}
                className="inline-flex items-center gap-2 bg-white text-[#111111] px-4 py-2 rounded-2xl font-extrabold text-sm sm:text-base shadow-xs border border-gray-200 hover:border-red-300 hover:bg-gray-50 active:scale-95 transition-all cursor-pointer group"
              >
                <MapPin className="h-4.5 w-4.5 text-[#E31E24] group-hover:scale-110 transition-transform" />
                <span>{userLocation?.name || "Indiranagar"}</span>
                <span className="text-xs text-gray-500 font-semibold hidden sm:inline">
                  ({userLocation?.city || "Bengaluru"})
                </span>
                <span className="text-xs font-bold text-[#E31E24] underline ml-1">Change</span>
              </button>
            </div>

            <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed pt-0.5">
              Showing verified local auto vendors, EV battery hubs, and spare parts available for delivery in{" "}
              <strong className="text-[#111111] underline font-extrabold">15–45 minutes</strong> to your doorstep.
            </p>
          </div>

          {/* Quick Location Badge & GPS Detect Button */}
          <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-2.5 shrink-0 bg-white/90 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-red-100 shadow-2xs">
            <div className="text-left lg:text-right">
              <p className="text-[10.5px] uppercase tracking-wider text-[#6B7280] font-bold">Local Hubs in Reach</p>
              <p className="text-sm font-extrabold text-[#111111] flex items-center lg:justify-end gap-1.5 mt-0.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                {nearbyVendors.length} Verified Stores Active
              </p>
            </div>
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="text-xs font-bold bg-white hover:bg-red-50 active:scale-95 text-[#E31E24] px-3.5 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 border border-red-200 shadow-2xs"
            >
              <Navigation className="h-3.5 w-3.5 text-[#E31E24]" />
              <span>Detect Current GPS</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 2: NEARBY AUTO STORES & WORKSHOPS (ZOMATO STYLE)
         ───────────────────────────────────────────────────────────── */}
      <div className="bg-white border border-[#E5E7EB] shadow-2xs rounded-3xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-extrabold text-[#111111] font-display flex items-center gap-2">
                <span>Stores Delivering to</span>
                <span className="text-[#E31E24]">{userLocation?.name || "Your Area"}</span>
              </h3>
              <span className="text-xs font-bold text-gray-700 bg-gray-100 px-2.5 py-0.5 rounded-full">
                {nearbyVendors.length} nearby
              </span>
            </div>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Order directly from verified local shops for rapid delivery, instant fitment guarantee, and local warranty support.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {selectedVendorId && (
              <button
                onClick={() => setSelectedVendorId(null)}
                className="text-xs font-bold text-[#E31E24] hover:underline flex items-center gap-1 cursor-pointer bg-red-50 px-3 py-1.5 rounded-full border border-red-200"
              >
                <X className="h-3.5 w-3.5" />
                Show All Stores
              </button>
            )}
          </div>
        </div>

        {/* Store Cards Grid (Zomato-style Nearby Vendors) */}
        {nearbyVendors.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 p-8 text-center">
            <Store className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-gray-700">No verified stores registered yet</p>
            <p className="text-xs text-gray-500 mt-1">
              Authorized vendors will appear here once their onboarding application is approved by the admin.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {nearbyVendors.map((vendor) => {
            const isSelected = selectedVendorId === vendor.id;
            return (
              <div
                key={vendor.id}
                className={cn(
                  "relative flex flex-col p-4 rounded-2xl border transition-all duration-200 bg-white shadow-2xs hover:shadow-md",
                  isSelected
                    ? "border-[#E31E24] ring-2 ring-[#E31E24]/20 bg-red-50/15"
                    : "border-[#E5E7EB] hover:border-gray-300"
                )}
              >
                {/* Header Row: Name & Rating */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-extrabold text-sm text-[#111111] truncate">
                        {vendor.name}
                      </h4>
                      {vendor.isVerified && (
                        <span title="Verified Dealer" className="inline-flex shrink-0">
                          <ShieldCheck className="h-4 w-4 text-emerald-600" />
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#6B7280] truncate mt-0.5">
                      {vendor.area} · {vendor.deliveryCoverage?.split("(")[0]?.trim()}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200/60 px-2 py-0.5 rounded-lg text-xs font-extrabold shrink-0">
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                    <span>{vendor.rating}</span>
                  </div>
                </div>

                {/* Metrics Row: Distance & ETA Badges (Zomato style) */}
                <div className="flex items-center gap-2 mt-3 text-xs">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 font-bold px-2.5 py-1 rounded-lg text-[11px]",
                      vendor.distanceKm <= 3
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : "bg-blue-50 text-blue-800 border border-blue-200"
                    )}
                  >
                    <MapPin className="h-3.5 w-3.5" />
                    {vendor.distanceKm} km away
                  </span>

                  <span className="inline-flex items-center gap-1 font-bold bg-gray-100 text-gray-800 px-2.5 py-1 rounded-lg text-[11px]">
                    <Zap className="h-3.5 w-3.5 text-amber-600 fill-amber-600" />
                    ⚡ {vendor.etaMinutes} mins
                  </span>

                  <span className="text-[11px] text-gray-500 ml-auto hidden sm:inline font-medium">
                    {vendor.inStockCount} items
                  </span>
                </div>

                {/* Description */}
                <p className="text-[11px] text-[#6B7280] line-clamp-2 mt-2 leading-relaxed">
                  {vendor.description}
                </p>

                {/* Actions */}
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedVendorId(isSelected ? null : vendor.id)}
                    className={cn(
                      "flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer text-center",
                      isSelected
                        ? "bg-[#E31E24] text-white shadow-xs"
                        : "bg-gray-100 text-gray-900 hover:bg-[#E31E24] hover:text-white"
                    )}
                  >
                    {isSelected ? "✓ Filtered to Store" : "Browse Parts"}
                  </button>

                  <Link
                    to="/vendor/$id"
                    params={{ id: vendor.id }}
                    className="py-1.5 px-3 rounded-xl text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition shrink-0"
                  >
                    Store Info →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
        )}

        {/* Active Store Filter Notification Bar */}
        {activeSelectedVendor && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#E31E24] animate-ping shrink-0" />
              <span className="font-semibold text-red-900">
                Showing parts supplied by <strong>{activeSelectedVendor.name}</strong> (
                {nearbyVendors.find((v) => v.id === selectedVendorId)?.distanceKm} km away)
              </span>
            </div>
            <button
              onClick={() => setSelectedVendorId(null)}
              className="font-bold text-[#E31E24] hover:underline cursor-pointer ml-auto"
            >
              Show All Stores
            </button>
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 3: VEHICLE FITMENT BANNER
         ───────────────────────────────────────────────────────────── */}
      <div className="bg-white border border-[#E5E7EB] shadow-2xs rounded-3xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E31E24]">
            <Zap className="h-3.5 w-3.5 fill-[#E31E24]" />
            <span>Official Store Catalog</span>
            <span>·</span>
            <span className="text-[#6B7280]">100% Genuine Components</span>
          </div>
          <h2 className="mt-1.5 text-xl sm:text-2xl font-extrabold text-[#111111] font-display">
            Shop Electric Bikes, Spares & Accessories
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[#6B7280] max-w-2xl leading-relaxed">
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
          SECTION 4: SEARCH, CATEGORY PILLS & EXTENDED FILTERS
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

          {/* Sort Selector with Distance & Fastest Delivery */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-medium text-[#6B7280] hidden sm:inline">Sort by:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-full bg-white border border-[#E5E7EB] px-3 py-2 text-xs font-semibold text-[#111111] outline-none cursor-pointer shadow-2xs hover:border-gray-400"
            >
              <option value="relevance">Featured & Relevant</option>
              <option value="distance">📍 Distance: Nearest Store First</option>
              <option value="eta">⚡ Fastest Delivery (&lt; 30m)</option>
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

        {/* Row 3: Extended Filters Toolbar (Brand, Vehicle Type, Near Me, Express, Price, Stock) */}
        <div className="flex flex-wrap items-center gap-2.5 pt-3 border-t border-[#E5E7EB] text-xs">
          {/* Near Me (< 5 km) Quick Filter Button */}
          <button
            onClick={() => setOnlyNearby(!onlyNearby)}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition active:scale-95 shadow-2xs cursor-pointer",
              onlyNearby
                ? "bg-emerald-600 text-white"
                : "bg-white border border-[#E5E7EB] text-gray-800 hover:border-emerald-600"
            )}
          >
            <MapPin className="h-3.5 w-3.5" />
            <span>Near Me (&lt; 5 km)</span>
          </button>

          {/* Express Delivery (< 30m) Quick Filter Button */}
          <button
            onClick={() => setOnlyFastDelivery(!onlyFastDelivery)}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition active:scale-95 shadow-2xs cursor-pointer",
              onlyFastDelivery
                ? "bg-[#E31E24] text-white"
                : "bg-white border border-[#E5E7EB] text-gray-800 hover:border-[#E31E24]"
            )}
          >
            <Zap className="h-3.5 w-3.5" />
            <span>⚡ Express (&lt; 30m)</span>
          </button>

          {/* Store / Vendor Filter Dropdown */}
          <div className="flex items-center gap-1.5 bg-white border border-[#E5E7EB] rounded-full px-3 py-1.5 shadow-2xs hover:border-gray-400 transition">
            <Store className="h-3.5 w-3.5 text-[#E31E24]" />
            <span className="text-[11px] font-semibold text-[#6B7280]">Store:</span>
            <select
              value={selectedVendorId ?? "all"}
              onChange={(e) => setSelectedVendorId(e.target.value === "all" ? null : e.target.value)}
              className="bg-transparent font-bold text-[#111111] outline-none cursor-pointer pr-1"
            >
              <option value="all">All Nearby Stores</option>
              {nearbyVendors.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.distanceKm} km)
                </option>
              ))}
            </select>
          </div>

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

            {selectedVendorId && (
              <span className="inline-flex items-center gap-1 bg-red-50 text-[#E31E24] font-semibold text-[11px] px-2.5 py-0.5 rounded-full border border-red-200">
                Store: {getVendor(selectedVendorId).name}
                <button onClick={() => setSelectedVendorId(null)} className="hover:text-red-800 cursor-pointer">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {onlyNearby && (
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 font-semibold text-[11px] px-2.5 py-0.5 rounded-full border border-emerald-200">
                Near Me (&lt; 5 km)
                <button onClick={() => setOnlyNearby(false)} className="hover:text-emerald-950 cursor-pointer">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {onlyFastDelivery && (
              <span className="inline-flex items-center gap-1 bg-red-50 text-[#E31E24] font-semibold text-[11px] px-2.5 py-0.5 rounded-full border border-red-200">
                ⚡ Express (&lt; 30m)
                <button onClick={() => setOnlyFastDelivery(false)} className="hover:text-red-800 cursor-pointer">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

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
          SECTION 5: PRODUCTS GRID WITH LOCAL STORE DELIVERY TAGS
         ───────────────────────────────────────────────────────────── */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <p className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">
              Showing {filteredProducts.length} items available in{" "}
              <span className="text-[#111111] font-extrabold">{userLocation?.name || "your area"}</span>
            </p>
          </div>
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
            <p className="text-base font-bold text-[#111111]">{dbProducts.length === 0 ? "No verified products available yet" : "No matching products found"}</p>
            <p className="text-xs text-[#6B7280] max-w-md mx-auto">
              No products match your current filters or selected location ({userLocation?.name}). Try expanding the distance radius or clearing filters.
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
