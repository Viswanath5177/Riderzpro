import { createFileRoute, useLocation } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SlidersHorizontal, Search, Bike, Check, X, ShieldCheck } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductCard } from "@/components/site/bits";
import { bestOffer, bikes, getBike, type Category } from "@/lib/data";
import { useCatalogue } from "@/lib/catalogue";
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
  const location = useLocation();
  const { activeBikeId, setActiveBikeId } = useStore();
  const { products: catalogueProducts } = useCatalogue();

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

  useEffect(() => {
    const p = new URLSearchParams(location.search as any);
    const urlQ = p.get("q");
    const urlCat = p.get("cat");
    if (urlQ !== null) setQ(urlQ);
    else setQ("");

    if (urlCat && CATS.includes(urlCat as any)) {
      setCat(urlCat as any);
    } else if (!urlCat) {
      setCat("All");
    }
  }, [location.search]);

  const list = useMemo(() => {
    let l = catalogueProducts.filter(
      (p) =>
        (cat === "All" || p.category === cat) &&
        (!volt || p.voltage === volt) &&
        (!onlyFit || !activeBikeId || p.fits.includes(activeBikeId)) &&
        (q === "" || `${p.name} ${p.brand} ${p.category} ${p.description}`.toLowerCase().includes(q.toLowerCase())),
    );
    if (sort === "low") l = [...l].sort((a, b) => bestOffer(a).price - bestOffer(b).price);
    if (sort === "high") l = [...l].sort((a, b) => bestOffer(b).price - bestOffer(a).price);
    return l;
  }, [catalogueProducts, q, cat, volt, onlyFit, activeBikeId, sort]);

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

          {/* Sub Filters: Voltage, Fitment, Sorting */}
          <div className="mt-3 flex flex-wrap items-center gap-2 pt-3 border-t border-gray-100 text-xs">
            <SlidersHorizontal className="h-3.5 w-3.5 text-[#6B7280]" />
            <span className="text-[#6B7280] font-medium">Voltage:</span>
            {[48, 60, 72].map((v) => (
              <button
                key={v}
                onClick={() => setVolt(volt === v ? null : v)}
                className={`rounded-md border px-2.5 py-1 font-semibold leading-none ${
                  volt === v
                    ? "border-[#E31E24] bg-red-50 text-[#E31E24]"
                    : "border-[#E5E7EB] bg-white text-[#6B7280] hover:text-[#111111]"
                }`}
              >
                {v}V
              </button>
            ))}

            {bike && (
              <label className="ml-3 flex items-center gap-1.5 cursor-pointer font-medium text-[#111111]">
                <input
                  type="checkbox"
                  checked={onlyFit}
                  onChange={(e) => setOnlyFit(e.target.checked)}
                  className="rounded border-gray-300 accent-[#E31E24]"
                />
                <span>Only compatible with {bike.make} {bike.model}</span>
              </label>
            )}

            <div className="ml-auto flex items-center gap-2">
              <span className="text-[#6B7280]">Sort by:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-md border border-[#E5E7EB] bg-white px-2.5 py-1 text-xs font-medium text-[#111111] outline-none"
              >
                <option value="relevance">Relevance</option>
                <option value="low">Price: Low → High</option>
                <option value="high">Price: High → Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-5 flex items-center justify-between text-xs text-[#6B7280]">
          <p>Showing <span className="font-semibold text-[#111111]">{list.length}</span> products</p>
          {(cat !== "All" || q || volt !== null || onlyFit) && (
            <button
              onClick={() => {
                setCat("All");
                setQ("");
                setVolt(null);
                setOnlyFit(false);
              }}
              className="font-medium text-[#E31E24] hover:underline"
            >
              Reset all filters
            </button>
          )}
        </div>

        {/* Product Cards Grid */}
        {list.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-[#E5E7EB] bg-white p-12 text-center">
            <p className="font-display text-xl font-bold text-[#111111]">No matching products found</p>
            <p className="mt-2 text-sm text-[#6B7280]">
              Try clearing filters or search query to explore the full inventory.
            </p>
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
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {list.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
