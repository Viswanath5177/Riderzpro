import { useMemo, useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  Bike,
  Search,
  SlidersHorizontal,
  Heart,
  ChevronDown,
  ShoppingBag,
  Zap,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import {
  bestOffer,
  bikes,
  products as fallbackProducts,
  mapDbProductToProduct,
  inr,
  type Product,
} from "@/lib/data";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function ShopTab() {
  const {
    activeBikeId,
    setActiveBikeId,
    addToCart,
    toggleSaved,
    isSaved,
  } = useStore();

  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedSort, setSelectedSort] = useState<string>("featured");
  const [selectedVoltage, setSelectedVoltage] = useState<number | null>(null);

  // Fetch products strictly from database
  useEffect(() => {
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
      .catch(() => {
        setDbProducts([]);
      });
  }, []);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      All: dbProducts.length,
      "Electric Bikes": 0,
      "EV Batteries": 0,
      "Car Accessories": 0,
      "Bike Accessories": 0,
    };
    for (const p of dbProducts) {
      const cat = (p.category as string) || "";
      const name = p.name.toLowerCase();
      if (
        cat === "Electric Bikes" ||
        cat === "Vehicle" ||
        name.includes("electric") ||
        name.includes("scooter") ||
        name.includes("bike")
      ) {
        counts["Electric Bikes"]++;
      } else if (
        cat === "Battery" ||
        name.includes("battery") ||
        name.includes("volt")
      ) {
        counts["EV Batteries"]++;
      } else if (
        cat === "Car Accessories" ||
        (p.vehicleType && (p.vehicleType === "car" || p.vehicleType === "four-wheeler"))
      ) {
        counts["Car Accessories"]++;
      } else if (
        cat === "Bike Accessories" ||
        cat === "Brakes" ||
        cat === "Charger" ||
        cat === "Accessory" ||
        cat === "Accessories"
      ) {
        counts["Bike Accessories"]++;
      }
    }
    return counts;
  }, [dbProducts]);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    let list = dbProducts;

    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          (p.voltage && `${p.voltage}v`.includes(q))
      );
    }

    // 2. Category Filter
    if (selectedCategory !== "All") {
      if (selectedCategory === "Electric Bikes") {
        list = list.filter(
          (p) =>
            (p.category as string) === "Electric Bikes" ||
            (p.category as string) === "Vehicle" ||
            p.name.toLowerCase().includes("electric") ||
            p.name.toLowerCase().includes("scooter") ||
            p.name.toLowerCase().includes("bike")
        );
      } else if (selectedCategory === "EV Batteries") {
        list = list.filter(
          (p) =>
            (p.category as string) === "Battery" ||
            p.name.toLowerCase().includes("battery") ||
            p.name.toLowerCase().includes("volt")
        );
      } else if (selectedCategory === "Car Accessories") {
        list = list.filter(
          (p) =>
            (p.category as string) === "Car Accessories" ||
            (p.vehicleType && (p.vehicleType === "car" || p.vehicleType === "four-wheeler"))
        );
      } else if (selectedCategory === "Bike Accessories") {
        list = list.filter(
          (p) =>
            (p.category as string) === "Bike Accessories" ||
            (p.category as string) === "Brakes" ||
            (p.category as string) === "Charger" ||
            (p.category as string) === "Accessory" ||
            (p.category as string) === "Accessories"
        );
      } else {
        list = list.filter(
          (p) => (p.category as string)?.toLowerCase() === selectedCategory.toLowerCase()
        );
      }
    }

    // 3. Voltage Filter
    if (selectedVoltage !== null) {
      list = list.filter((p) => p.voltage === selectedVoltage || p.name.includes(`${selectedVoltage}V`));
    }

    // 4. Vehicle Fitment Filter
    if (selectedVehicle !== "all") {
      list = list.filter(
        (p) =>
          p.fits.includes("universal") ||
          p.fits.includes(selectedVehicle)
      );
    }

    // 5. Sorting
    if (selectedSort === "price-low") {
      list = [...list].sort((a, b) => bestOffer(a).price - bestOffer(b).price);
    } else if (selectedSort === "price-high") {
      list = [...list].sort((a, b) => bestOffer(b).price - bestOffer(a).price);
    } else if (selectedSort === "rating") {
      list = [...list].sort((a, b) => (b.warrantyMonths || 12) - (a.warrantyMonths || 12));
    }

    return list;
  }, [dbProducts, searchQuery, selectedCategory, selectedVoltage, selectedVehicle, selectedSort]);

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const offer = bestOffer(product);
    addToCart(product.id, offer.vendorId, 1);
    toast.success(`${product.name} added to cart!`);
  };

  const getVoltageTag = (p: Product) => {
    if (p.voltage) return `${p.voltage}V`;
    if (p.name.includes("72V")) return "72V";
    if (p.name.includes("60V")) return "60V";
    if (p.name.includes("48V")) return "48V";
    if (p.name.includes("52V")) return "52V";
    return "60V";
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* ─────────────────────────────────────────────────────────────
          1. TOP CATALOG HERO BANNER
         ───────────────────────────────────────────────────────────── */}
      <div className="rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-7 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-[#E31E24] text-xs font-extrabold uppercase tracking-wide flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 fill-[#E31E24]" />
                OFFICIAL STORE CATALOG · 100% GENUINE COMPONENTS
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] font-display">
              Shop Electric Bikes, Spares &amp; Accessories
            </h1>

            <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
              Order certified high-voltage lithium battery packs, smart fast chargers, precision brake rotors, and riding gear with guaranteed vehicle compatibility.
            </p>
          </div>

          {/* Vehicle Fitment Dropdown */}
          <div className="flex flex-col items-start lg:items-end gap-1.5 shrink-0">
            <span className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
              <Bike className="h-3.5 w-3.5 text-[#E31E24]" />
              Vehicle fitment
            </span>
            <div className="relative">
              <select
                value={selectedVehicle}
                onChange={(e) => setSelectedVehicle(e.target.value)}
                className="appearance-none bg-white border border-gray-200 hover:border-gray-300 rounded-xl px-4 py-2 pr-9 text-xs font-bold text-gray-800 shadow-2xs outline-none focus:border-[#E31E24] cursor-pointer"
              >
                <option value="all">All vehicles</option>
                {bikes.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.make} {b.model} ({b.voltage}V)
                  </option>
                ))}
              </select>
              <ChevronDown className="h-3.5 w-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. UNIFIED FILTER BAR (Search, Category dropdown, Sort dropdown)
         ───────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-gray-200 bg-white p-2.5 sm:p-3 flex flex-col md:flex-row items-center gap-3 shadow-2xs">
        {/* Search Input */}
        <div className="flex-1 w-full flex items-center gap-2.5 px-3 py-1 bg-gray-50/70 rounded-xl border border-transparent focus-within:border-gray-200 focus-within:bg-white transition">
          <Search className="h-4 w-4 text-gray-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by part name, brand (Motul, Brembo, Ather), voltage, or specification..."
            className="w-full bg-transparent text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 outline-none"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
          {/* Category Dropdown */}
          <div className="relative flex-1 md:flex-none">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-200 hover:border-gray-300 rounded-xl px-3.5 py-2.5 pr-8 text-xs font-semibold text-gray-800 shadow-2xs outline-none focus:border-[#E31E24] cursor-pointer"
            >
              <option value="All">Category: All categories ({categoryCounts["All"]})</option>
              <option value="Electric Bikes">Electric Bikes ({categoryCounts["Electric Bikes"]})</option>
              <option value="EV Batteries">EV Batteries ({categoryCounts["EV Batteries"]})</option>
              <option value="Car Accessories">Car Accessories ({categoryCounts["Car Accessories"]})</option>
              <option value="Bike Accessories">Bike Accessories ({categoryCounts["Bike Accessories"]})</option>
            </select>
            <ChevronDown className="h-3.5 w-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Sort By Dropdown */}
          <div className="relative flex-1 md:flex-none">
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-200 hover:border-gray-300 rounded-xl px-3.5 py-2.5 pr-8 text-xs font-semibold text-gray-800 shadow-2xs outline-none focus:border-[#E31E24] cursor-pointer"
            >
              <option value="featured">Sort by: Featured &amp; Relevant</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated &amp; Verified</option>
            </select>
            <ChevronDown className="h-3.5 w-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. CATEGORY PILLS ROW
         ───────────────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: "All", label: "All", count: categoryCounts["All"] },
            { id: "Electric Bikes", label: "Electric Bikes", count: categoryCounts["Electric Bikes"] },
            { id: "EV Batteries", label: "EV Batteries", count: categoryCounts["EV Batteries"] },
            { id: "Car Accessories", label: "Car Accessories", count: categoryCounts["Car Accessories"] },
            { id: "Bike Accessories", label: "Bike Accessories", count: categoryCounts["Bike Accessories"] },
          ].map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-bold transition shadow-2xs cursor-pointer",
                  isSelected
                    ? "bg-[#E31E24] text-white shadow-xs"
                    : "bg-white border border-gray-200 text-gray-700 hover:border-red-200 hover:bg-gray-50"
                )}
              >
                {cat.label} ({cat.count})
              </button>
            );
          })}
        </div>

        {/* Voltage Filter Row */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-gray-500 font-medium">
          <div className="flex items-center gap-1.5 mr-1 text-gray-600 font-semibold">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Voltage:</span>
          </div>

          {[48, 52, 60, 72].map((v) => {
            const isSelected = selectedVoltage === v;
            return (
              <button
                key={v}
                onClick={() => setSelectedVoltage(isSelected ? null : v)}
                className={cn(
                  "px-3 py-1 rounded-lg text-xs font-bold border transition cursor-pointer",
                  isSelected
                    ? "bg-red-50 border-[#E31E24] text-[#E31E24]"
                    : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                )}
              >
                {v}V
              </button>
            );
          })}

          {selectedVoltage !== null && (
            <button
              onClick={() => setSelectedVoltage(null)}
              className="text-[11px] text-[#E31E24] underline hover:text-red-700 ml-1 font-semibold cursor-pointer"
            >
              Clear voltage
            </button>
          )}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. COUNTER LINE
         ───────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between text-xs font-bold tracking-wider uppercase text-gray-400">
        <span>SHOWING {filteredProducts.length} OF {dbProducts.length} ITEMS</span>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          5. PRODUCT CARDS GRID OR EMPTY STATE
         ───────────────────────────────────────────────────────────── */}
      {filteredProducts.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-12 text-center space-y-3">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400">
            <ShoppingBag className="h-6 w-6 text-gray-300" />
          </div>
          <h3 className="text-base font-bold text-[#111111]">
            {dbProducts.length === 0 ? "No products in marketplace catalog" : "No products match your filter"}
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
            {dbProducts.length === 0
              ? "Products added by authorized vendors will appear here once approved by platform admin."
              : "Try adjusting or clearing your category, voltage, or search filters to see other products."}
          </p>
          {(selectedCategory !== "All" || searchQuery || selectedVoltage !== null || selectedVehicle !== "all") && (
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
                setSelectedVoltage(null);
                setSelectedVehicle("all");
              }}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700 transition cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.slice(0, 40).map((product) => {
            const offer = bestOffer(product);
            const saved = isSaved(product.id);
            const voltBadge = getVoltageTag(product);

            return (
              <div
                key={product.id}
                className="group rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                {/* Product Image Box */}
                <div className="relative aspect-square bg-[#F7F9FB] flex items-center justify-center p-4 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* 12% OFF Badge (Top Left) */}
                  <div className="absolute top-3 left-3 bg-[#E31E24] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-sm uppercase tracking-wider shadow-2xs">
                    {product.discountPercent ? `${product.discountPercent}% OFF` : "12% OFF"}
                  </div>

                  {/* Wishlist Button (Top Right) */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleSaved(product.id);
                      toast.success(saved ? "Removed from wishlist" : "Saved to wishlist");
                    }}
                    className="absolute top-3 right-3 grid h-8 w-8 place-items-center rounded-full bg-white/90 hover:bg-white text-gray-400 hover:text-[#E31E24] border border-black/[0.06] shadow-2xs transition active:scale-90 cursor-pointer"
                    title="Save item"
                  >
                    <Heart
                      className={cn(
                        "h-4 w-4 transition-colors",
                        saved ? "fill-[#E31E24] text-[#E31E24]" : ""
                      )}
                    />
                  </button>

                  {/* Voltage Tag (Bottom Right) */}
                  <div className="absolute bottom-3 right-3 bg-black/80 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md backdrop-blur-xs">
                    {voltBadge}
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                      {product.brand || "RiderzPro Certified"}
                    </p>
                    <Link
                      to="/product/$id"
                      params={{ id: product.id }}
                      className="text-sm font-bold text-[#111111] hover:text-[#E31E24] transition-colors line-clamp-2 mt-0.5"
                    >
                      {product.name}
                    </Link>
                  </div>

                  <div className="pt-2 border-t border-gray-50 flex items-center justify-between">
                    <div>
                      <span className="text-base font-extrabold text-[#111111]">
                        {inr(offer.price)}
                      </span>
                      <span className="text-[11px] text-gray-400 line-through ml-1.5">
                        {inr(Math.round(offer.price * 1.14))}
                      </span>
                    </div>

                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      className="p-2 rounded-xl bg-gray-50 hover:bg-[#E31E24] text-gray-700 hover:text-white transition active:scale-95 shadow-2xs cursor-pointer"
                      title="Add to cart"
                    >
                      <ShoppingBag className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
