import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  SlidersHorizontal,
  Search,
  Bike,
  Check,
  X,
  ShieldCheck,
  Tag,
  Car,
  RotateCcw,
  Store,
  Star,
  Shield,
  IndianRupee,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductCard } from "@/components/site/bits";
import {
  bestOffer,
  bikes,
  getBike,
  mapDbProductToProduct,
  products,
  vendors,
  getVendor,
  getProductReviews,
  type Product,
  type Category,
} from "@/lib/data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Automotive Store & Spares — RiderzPro" },
      { name: "description", content: "Electric bikes, car & bike accessories, batteries, fast chargers, and verified spare parts." },
      { property: "og:title", content: "Automotive Store & Spares — RiderzPro" },
      { property: "og:description", content: "Compare automotive parts and accessories from authorized suppliers." },
    ],
  }),
  component: Shop,
});

const CATS: (Category | "All")[] = [
  "All",
  "Electric Bikes",
  "Car Accessories",
  "Bike Accessories",
  "Riding Gear & Helmets",
  "Spare Parts",
  "Battery",
  "Charger",
  "BMS",
  "Motor",
  "Controller",
  "Brakes",
];

function Shop() {
  const { activeBikeId, setActiveBikeId } = useStore();

  // Initialize with canonical seed catalog so user never sees blank page
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [activeSellers, setActiveSellers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [q, setQ] = useState(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search);
      return p.get("q") || "";
    }
    return "";
  });

  const [cat, setCat] = useState<(typeof CATS)[number]>(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search);
      const c = p.get("cat");
      if (c && CATS.includes(c as any)) return c as any;
    }
    return "All";
  });

  const [volt, setVolt] = useState<number | null>(null);
  const [onlyFit, setOnlyFit] = useState(false);
  const [sort, setSort] = useState("relevance");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [selectedVehicleType, setSelectedVehicleType] = useState("All");
  const [selectedStock, setSelectedStock] = useState("all");
  const [selectedVendorId, setSelectedVendorId] = useState("All");
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [minRating, setMinRating] = useState<number | "">("");
  const [warrantyFilter, setWarrantyFilter] = useState("All");

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/products")
      .then((r) => r.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          setDbProducts(res.data.map((row: any) => mapDbProductToProduct(row)));
        } else {
          setDbProducts([]);
        }
      })
      .catch((err) => {
        console.log("Shop fetch error:", err);
        setDbProducts([]);
      })
      .finally(() => setIsLoading(false));

    fetch("/api/sellers")
      .then((r) => r.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          setActiveSellers(res.data);
        } else {
          setActiveSellers([]);
        }
      })
      .catch((err) => {
        console.log("Shop sellers fetch error:", err);
        setActiveSellers([]);
      });
  }, []);

  const availableBrands = useMemo(() => {
    const set = new Set<string>();
    dbProducts.forEach((p) => {
      if (p.brand && p.brand.trim() && p.brand !== "Riderzpro Certified") set.add(p.brand.trim());
    });
    return ["All", "Riderzpro Certified", ...Array.from(set).sort()];
  }, [dbProducts]);

  useEffect(() => {
    const handleUrl = () => {
      if (typeof window !== "undefined") {
        const p = new URLSearchParams(window.location.search);
        const urlQ = p.get("q");
        const urlCat = p.get("cat");
        if (urlQ !== null) setQ(urlQ);
        if (urlCat !== null && CATS.includes(urlCat as any)) setCat(urlCat as any);
      }
    };
    handleUrl();
    window.addEventListener("popstate", handleUrl);
    return () => window.removeEventListener("popstate", handleUrl);
  }, []);

  const list = useMemo(() => {
    let l = dbProducts.filter((p) => {
      const matchesCat =
        cat === "All" ||
        p.category.toLowerCase().includes(cat.toLowerCase()) ||
        cat.toLowerCase().includes(p.category.toLowerCase());
      const matchesBrand =
        selectedBrand === "All" ||
        p.brand?.toLowerCase() === selectedBrand.toLowerCase();
      const pVType = (p.vehicleType || "").toLowerCase();
      const matchesVehicleType =
        selectedVehicleType === "All" ||
        (selectedVehicleType === "bike" && (pVType === "bike" || pVType === "two-wheeler" || p.category.toLowerCase().includes("bike"))) ||
        (selectedVehicleType === "car" && (pVType === "car" || pVType === "four-wheeler" || p.category.toLowerCase().includes("car"))) ||
        (selectedVehicleType === "universal" && (pVType === "universal" || pVType === "both" || !pVType));

      const offer = selectedVendorId !== "All"
        ? p.offers.find((o) => o.vendorId === selectedVendorId) || bestOffer(p)
        : bestOffer(p);

      const matchesVendor =
        selectedVendorId === "All" || p.offers.some((o) => o.vendorId === selectedVendorId);

      const stock = offer.stock ?? p.offers?.[0]?.stock ?? 0;
      const matchesStock =
        selectedStock === "all" ||
        (selectedStock === "in_stock" && stock >= 5) ||
        (selectedStock === "low_stock" && stock < 5);

      const price = offer.price;
      const matchesMinPrice = minPrice === "" || price >= Number(minPrice);
      const matchesMaxPrice = maxPrice === "" || price <= Number(maxPrice);

      const revs = getProductReviews(p.id);
      const avgRating = revs.length > 0 ? revs.reduce((s, r) => s + r.rating, 0) / revs.length : 4.8;
      const matchesRating = minRating === "" || avgRating >= Number(minRating);

      const matchesWarranty =
        warrantyFilter === "All" ||
        (warrantyFilter === "12" && p.warrantyMonths >= 12) ||
        (warrantyFilter === "24" && p.warrantyMonths >= 24) ||
        (warrantyFilter === "36" && p.warrantyMonths >= 36);

      const matchesVolt = !volt || p.voltage === volt;
      const matchesFit =
        !onlyFit || !activeBikeId || p.fits.includes("universal") || p.fits.includes(activeBikeId);

      const vendorNames = p.offers.map((o) => getVendor(o.vendorId).name).join(" ");
      const matchesQuery =
        q === "" ||
        `${p.name} ${p.brand} ${p.category} ${p.description} ${p.sku || ""} ${vendorNames}`.toLowerCase().includes(q.toLowerCase());

      return (
        matchesCat &&
        matchesBrand &&
        matchesVehicleType &&
        matchesVendor &&
        matchesStock &&
        matchesMinPrice &&
        matchesMaxPrice &&
        matchesRating &&
        matchesWarranty &&
        matchesVolt &&
        matchesFit &&
        matchesQuery
      );
    });

    if (sort === "low") l = [...l].sort((a, b) => bestOffer(a).price - bestOffer(b).price);
    if (sort === "high") l = [...l].sort((a, b) => bestOffer(b).price - bestOffer(a).price);
    if (sort === "rating") {
      l = [...l].sort((a, b) => {
        const ra = getProductReviews(a.id);
        const rb = getProductReviews(b.id);
        const scoreA = ra.length ? ra.reduce((s, r) => s + r.rating, 0) / ra.length : 4.8;
        const scoreB = rb.length ? rb.reduce((s, r) => s + r.rating, 0) / rb.length : 4.8;
        return scoreB - scoreA;
      });
    }
    if (sort === "value") {
      l = [...l].sort((a, b) => {
        const offA = bestOffer(a);
        const offB = bestOffer(b);
        const savA = (offA.mrp || offA.price * 1.15) - offA.price;
        const savB = (offB.mrp || offB.price * 1.15) - offB.price;
        return savB - savA;
      });
    }

    return l;
  }, [dbProducts, q, cat, selectedBrand, selectedVehicleType, selectedVendorId, selectedStock, minPrice, maxPrice, minRating, warrantyFilter, volt, onlyFit, activeBikeId, sort]);

  const bike = activeBikeId ? getBike(activeBikeId) : null;

  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Header Breadcrumbs & Title */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#E31E24]">
              <span>Official Catalog</span>
              <span>·</span>
              <span className="text-[#6B7280]">Automotive Retail</span>
            </div>
            <h1 className="mt-1 font-display text-3xl font-extrabold text-[#111111] sm:text-4xl">
              {cat === "All" ? "All Products & Spares" : cat}
            </h1>
            <p className="mt-1 text-sm text-[#6B7280]">
              Browse high-grade electric bikes, genuine spares, accessories, and certified fast chargers.
            </p>
          </div>

          {/* Active vehicle filter pill */}
          <div className="flex items-center gap-2.5 rounded-xl border border-[#E5E7EB] bg-white px-3.5 py-2 shadow-2xs">
            <Bike className="h-4 w-4 text-[#E31E24]" />
            <span className="text-xs text-[#6B7280]">Vehicle Fitment:</span>
            <select
              value={activeBikeId ?? ""}
              onChange={(e) => setActiveBikeId(e.target.value || null)}
              className="bg-transparent text-xs font-semibold text-[#111111] outline-none cursor-pointer"
            >
              <option value="">Any Vehicle (Show all)</option>
              {bikes.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.make} {b.model} ({b.voltage}V)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="mt-6 border border-[#E5E7EB] bg-white px-4 py-3.5 rounded-xl shadow-2xs">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            {/* Live Search */}
            <div className="relative flex flex-1 items-center">
              <Search className="absolute left-3.5 h-4 w-4 text-[#6B7280]" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search across all automotive items..."
                className="h-10 w-full rounded-lg border border-[#E5E7EB] bg-[#F5F6F8] pl-10 pr-8 text-sm text-[#111111] placeholder:text-[#6B7280] focus:border-[#E31E24] focus:bg-white focus:outline-none"
              />
              {q && (
                <button
                  onClick={() => setQ("")}
                  className="absolute right-3 text-gray-400 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Department Category Pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
              {CATS.map((c) => {
                const isActive = cat === c;
                return (
                  <button
                    key={c}
                    onClick={() => setCat(c)}
                    className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                      isActive
                        ? "bg-[#E31E24] text-white font-semibold shadow-2xs"
                        : "border border-[#E5E7EB] bg-white text-[#6B7280] hover:border-gray-300 hover:text-[#111111]"
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sub Filters: Vendor, Brand, Vehicle Type, Stock, Price Range, Warranty, Rating, Voltage, Fitment, Sorting */}
          <div className="mt-3 flex flex-wrap items-center gap-2 pt-3 border-t border-gray-100 text-xs">
            {/* Vendor / Shop Filter */}
            <div className="flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-white px-2.5 py-1 text-xs">
              <Store className="h-3.5 w-3.5 text-[#E31E24]" />
              <span className="text-[#6B7280]">Shop:</span>
              <select
                value={selectedVendorId}
                onChange={(e) => setSelectedVendorId(e.target.value)}
                className="bg-transparent font-semibold text-[#111111] outline-none cursor-pointer"
              >
                <option value="All">All Sellers & Shops</option>
                {activeSellers.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.area})
                  </option>
                ))}
              </select>
            </div>

            {/* Brand Filter */}
            <div className="flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-white px-2.5 py-1 text-xs">
              <Tag className="h-3.5 w-3.5 text-[#E31E24]" />
              <span className="text-[#6B7280]">Brand:</span>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="bg-transparent font-semibold text-[#111111] outline-none cursor-pointer"
              >
                {availableBrands.map((b) => (
                  <option key={b} value={b}>
                    {b === "All" ? "All Brands" : b}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div className="flex items-center gap-1 rounded-lg border border-[#E5E7EB] bg-white px-2.5 py-1 text-xs">
              <IndianRupee className="h-3.5 w-3.5 text-[#E31E24]" />
              <span className="text-[#6B7280]">Price:</span>
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : "")}
                className="w-14 rounded border border-gray-200 px-1 py-0.5 text-center text-xs font-semibold outline-none"
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : "")}
                className="w-16 rounded border border-gray-200 px-1 py-0.5 text-center text-xs font-semibold outline-none"
              />
            </div>

            {/* Customer Rating Filter */}
            <div className="flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-white px-2.5 py-1 text-xs">
              <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
              <span className="text-[#6B7280]">Rating:</span>
              <select
                value={minRating}
                onChange={(e) => setMinRating(e.target.value ? Number(e.target.value) : "")}
                className="bg-transparent font-semibold text-[#111111] outline-none cursor-pointer"
              >
                <option value="">Any Rating</option>
                <option value="4.0">4.0★ & above</option>
                <option value="4.5">4.5★ & above</option>
                <option value="4.8">4.8★ & above</option>
              </select>
            </div>

            {/* Warranty Filter */}
            <div className="flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-white px-2.5 py-1 text-xs">
              <Shield className="h-3.5 w-3.5 text-[#E31E24]" />
              <span className="text-[#6B7280]">Warranty:</span>
              <select
                value={warrantyFilter}
                onChange={(e) => setWarrantyFilter(e.target.value)}
                className="bg-transparent font-semibold text-[#111111] outline-none cursor-pointer"
              >
                <option value="All">Any Warranty</option>
                <option value="12">1+ Year Warranty</option>
                <option value="24">2+ Years Warranty</option>
                <option value="36">3+ Years Warranty</option>
              </select>
            </div>

            {/* Vehicle Type Filter */}
            <div className="flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-white px-2.5 py-1 text-xs">
              <Car className="h-3.5 w-3.5 text-[#E31E24]" />
              <span className="text-[#6B7280]">Vehicle:</span>
              <select
                value={selectedVehicleType}
                onChange={(e) => setSelectedVehicleType(e.target.value)}
                className="bg-transparent font-semibold text-[#111111] outline-none cursor-pointer"
              >
                <option value="All">All Types</option>
                <option value="bike">🛵 2-Wheeler (Bikes/EVs)</option>
                <option value="car">🚗 4-Wheeler (Cars)</option>
                <option value="universal">⚡ Universal Fitment</option>
              </select>
            </div>

            {/* Stock Availability */}
            <div className="flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-white px-2.5 py-1 text-xs">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[#6B7280]">Stock:</span>
              <select
                value={selectedStock}
                onChange={(e) => setSelectedStock(e.target.value)}
                className="bg-transparent font-semibold text-[#111111] outline-none cursor-pointer"
              >
                <option value="all">All Availability</option>
                <option value="in_stock">In Stock (5+ units)</option>
                <option value="low_stock">⚠️ Limited Stock (&lt; 5)</option>
              </select>
            </div>

            {/* Voltage */}
            <div className="flex items-center gap-1.5">
              <SlidersHorizontal className="h-3.5 w-3.5 text-[#6B7280]" />
              <span className="text-[#6B7280]">Voltage:</span>
              {[48, 60, 72].map((v) => (
                <button
                  key={v}
                  onClick={() => setVolt(volt === v ? null : v)}
                  className={`rounded-md border px-2 py-1 font-semibold leading-none cursor-pointer ${
                    volt === v
                      ? "border-[#E31E24] bg-red-50 text-[#E31E24]"
                      : "border-[#E5E7EB] bg-white text-[#6B7280] hover:text-[#111111]"
                  }`}
                >
                  {v}V
                </button>
              ))}
            </div>

            {bike && (
              <label className="ml-2 flex items-center gap-1.5 cursor-pointer font-medium text-[#111111]">
                <input
                  type="checkbox"
                  checked={onlyFit}
                  onChange={(e) => setOnlyFit(e.target.checked)}
                  className="rounded border-gray-300 accent-[#E31E24]"
                />
                <span>Fit for {bike.make} {bike.model}</span>
              </label>
            )}

            <div className="ml-auto flex items-center gap-2">
              <span className="text-[#6B7280]">Sort by:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-md border border-[#E5E7EB] bg-white px-2.5 py-1 text-xs font-semibold text-[#111111] outline-none cursor-pointer"
              >
                <option value="relevance">Relevance</option>
                <option value="low">Price: Low → High</option>
                <option value="high">Price: High → Low</option>
                <option value="rating">Highest Rated ★</option>
                <option value="value">Best Value (Max Savings)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count & Clear Button */}
        <div className="mt-5 flex items-center justify-between text-xs text-[#6B7280]">
          <p>Showing <span className="font-semibold text-[#111111]">{list.length}</span> products</p>
          {(cat !== "All" ||
            q ||
            volt !== null ||
            onlyFit ||
            selectedBrand !== "All" ||
            selectedVehicleType !== "All" ||
            selectedStock !== "all" ||
            selectedVendorId !== "All" ||
            minPrice !== "" ||
            maxPrice !== "" ||
            minRating !== "" ||
            warrantyFilter !== "All") && (
            <button
              onClick={() => {
                setCat("All");
                setQ("");
                setVolt(null);
                setOnlyFit(false);
                setSelectedBrand("All");
                setSelectedVehicleType("All");
                setSelectedStock("all");
                setSelectedVendorId("All");
                setMinPrice("");
                setMaxPrice("");
                setMinRating("");
                setWarrantyFilter("All");
              }}
              className="inline-flex items-center gap-1 font-semibold text-[#E31E24] hover:underline cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
              Reset all filters
            </button>
          )}
        </div>

        {/* Product Cards Grid */}
        {isLoading ? (
          <div className="mt-8 rounded-2xl border border-dashed border-[#E5E7EB] bg-white p-12 text-center">
            <p className="font-display text-lg font-bold text-[#111111]">Loading catalog from database...</p>
          </div>
        ) : list.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-[#E5E7EB] bg-white p-12 text-center">
            <p className="font-display text-xl font-bold text-[#111111]">
              {dbProducts.length === 0 ? "No verified products available yet" : "No matching products found"}
            </p>
            <p className="mt-2 text-sm text-[#6B7280]">
              {dbProducts.length === 0
                ? "Stores and products will appear once authorized vendors register and their products are approved by admin."
                : "Try clearing filters or search query to explore the full inventory."}
            </p>
            {dbProducts.length > 0 && (
              <button
                onClick={() => {
                  setCat("All");
                  setQ("");
                  setVolt(null);
                  setOnlyFit(false);
                }}
                className="mt-4 rounded-lg bg-[#E31E24] px-4 py-2 text-xs font-semibold text-white hover:bg-red-700"
              >
                View All Products
              </button>
            )}
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {list.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
