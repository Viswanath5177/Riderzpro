import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SlidersHorizontal, Search, Check, X, ChevronLeft, ChevronRight, Package } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { bestOffer, bikes, getBike, inr, mapDbProductToProduct, type Product } from "@/lib/data";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

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

const CATS = [
  "All",
  "Electric Bikes",
  "EV Batteries",
  "Car Accessories",
  "Bike Accessories",
] as const;

const PAGE_SIZE = 40;

type ApiCatalogProduct = Product & {
  sellerName?: string | null;
  storeName?: string | null;
  gstRate?: number | null;
  hsnCode?: string | null;
};

function productFromApi(row: any): ApiCatalogProduct {
  const mapped = mapDbProductToProduct(row);
  let image = typeof row.image_url === "string" ? row.image_url : "";
  try {
    if (image.startsWith("[")) image = JSON.parse(image)[0] || "";
  } catch {
    image = "";
  }
  return {
    ...mapped,
    image,
    category: row.category || row.category_name || mapped.category,
    brand: row.brand || "Brand not provided",
    fits: Array.isArray(row.compatible_vehicles) ? row.compatible_vehicles : [],
    offers: row.seller_id && row.price != null
      ? [{ vendorId: String(row.seller_id), price: Number(row.price), stock: Number(row.stock) || 0 }]
      : [],
    sellerName: row.seller_name || null,
    storeName: row.store_name || null,
    gstRate: row.gst_rate ?? null,
    hsnCode: row.hsn_code ?? null,
  };
}

function CatalogProductCard({ product }: { product: ApiCatalogProduct }) {
  const offer = bestOffer(product);
  const image = product.image.trim();
  const seller = product.storeName || product.sellerName;

  return (
    <article className="relative overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-2xs transition hover:-translate-y-1 hover:shadow-md">
      <Link to="/product/$id" params={{ id: product.id }} className="block">
        <div className="relative aspect-square bg-[#F5F6F8] p-3">
          {image ? (
            <img src={image} alt={product.name} loading="lazy" className={`h-full w-full object-contain ${offer.stock <= 0 ? "opacity-60 grayscale" : ""}`} />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-xs text-gray-500">
              <Package className="h-8 w-8 text-gray-300" />
              Product image unavailable
            </div>
          )}
          {offer.stock <= 0 && (
            <span className="absolute top-3 right-3 rounded-md bg-red-600 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-white shadow-sm">
              Out of Stock
            </span>
          )}
        </div>
        <div className="p-3">
          <p className="truncate text-[10px] font-bold uppercase tracking-wide text-[#E31E24]">{product.category} · {product.brand}</p>
          <h2 className="mt-1 line-clamp-2 min-h-10 text-sm font-bold text-[#111111]">{product.name}</h2>
          <p className="mt-2 truncate text-[11px] text-[#6B7280]">Sold by {seller || "Seller details pending"}</p>
          <p className="mt-2 text-base font-extrabold text-[#111111]">{product.offers.length ? inr(offer.price) : "Price unavailable"}</p>
          <p className="mt-1 text-[11px] text-[#6B7280]">
            {offer.stock > 0 ? (
              <span className="text-emerald-700 font-semibold">{offer.stock} in stock</span>
            ) : (
              <span className="text-red-600 font-bold">Out of stock</span>
            )}
            {product.gstRate != null ? ` · GST ${product.gstRate}%` : " · GST details pending"}
          </p>
        </div>
      </Link>
    </article>
  );
}

function Shop() {
  const { activeBikeId } = useStore();
  const [catalogueProducts, setCatalogueProducts] = useState<ApiCatalogProduct[]>([]);
  const [catalogueState, setCatalogueState] = useState<"loading" | "ready" | "error">("loading");

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
      if (c && (CATS as readonly string[]).includes(c)) return c as any;
    }
    return "All";
  });

  const [subcat, setSubcat] = useState<string>("All");
  const [volt, setVolt] = useState<number | null>(null);
  const [onlyFit, setOnlyFit] = useState(false);
  const [sort, setSort] = useState("relevance");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setCatalogueState("loading");
      const params = new URLSearchParams({ status: "approved" });
      const serverCategory = subcat !== "All"
        ? subcat
        : cat === "EV Batteries"
          ? "Battery"
          : cat !== "All"
            ? cat
            : "";
      if (serverCategory) params.set("category", serverCategory);
      if (q.trim()) params.set("q", q.trim());
      if (onlyFit && activeBikeId) params.set("fit_vehicle", activeBikeId);

      try {
        const response = await fetch(`/api/products?${params.toString()}`, { signal: controller.signal });
        if (!response.ok) throw new Error(`Catalog request failed (${response.status})`);
        const result = await response.json();
        if (!result.success || !Array.isArray(result.data)) throw new Error("Catalog response was invalid");
        setCatalogueProducts(result.data.map(productFromApi));
        setCatalogueState("ready");
      } catch (error) {
        if (!controller.signal.aborted) setCatalogueState("error");
      }
    }, q.trim() ? 250 : 0);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [cat, subcat, q, onlyFit, activeBikeId]);

  useEffect(() => {
    const handleUrl = () => {
      if (typeof window !== "undefined") {
        const p = new URLSearchParams(window.location.search);
        const urlQ = p.get("q");
        const urlCat = p.get("cat");
        if (urlQ !== null) setQ(urlQ);
        if (urlCat !== null && (CATS as readonly string[]).includes(urlCat)) setCat(urlCat as any);
      }
    };
    handleUrl();
    window.addEventListener("popstate", handleUrl);
    return () => window.removeEventListener("popstate", handleUrl);
  }, []);

  const list = useMemo(() => {
    let l = catalogueProducts.filter((p) => {
      const matchesCat =
        cat === "All" ||
        (cat === "Electric Bikes" && p.category === "Electric Bikes") ||
        (cat === "EV Batteries" && (p.category === "Battery" || (p.category as string) === "EV Batteries")) ||
        (cat === "Car Accessories" && (p.vehicleType === "car" || p.vehicleType === "both" || p.category === "Car Accessories")) ||
        (cat === "Bike Accessories" && (p.vehicleType === "bike" || p.vehicleType === "both" || p.category === "Bike Accessories")) ||
        p.category === cat;

      const matchesSubcat =
        subcat === "All" ||
        p.category.toLowerCase() === subcat.toLowerCase() ||
        (p.subcategory && p.subcategory.toLowerCase() === subcat.toLowerCase()) ||
        (Array.isArray(p.subcategories) && p.subcategories.some((s) => s.toLowerCase() === subcat.toLowerCase()));

      const matchesVolt = !volt || p.voltage === volt;
      const matchesFit = !onlyFit || !activeBikeId || p.fits.includes(activeBikeId);
      const matchesQ =
        q === "" ||
        `${p.name} ${p.brand} ${p.category} ${p.subcategory || ""} ${p.description}`
          .toLowerCase()
          .includes(q.toLowerCase());
      return matchesCat && matchesSubcat && matchesVolt && matchesFit && matchesQ;
    });
    if (sort === "low") l = [...l].sort((a, b) => (a.offers[0]?.price ?? Infinity) - (b.offers[0]?.price ?? Infinity));
    if (sort === "high") l = [...l].sort((a, b) => (b.offers[0]?.price ?? -Infinity) - (a.offers[0]?.price ?? -Infinity));
    return l;
  }, [catalogueProducts, cat, subcat, volt, onlyFit, activeBikeId, sort]);

  const categories = useMemo(
    () => Array.from(new Set(catalogueProducts.map((product) => product.category))).sort(),
    [catalogueProducts],
  );

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
              Browse electric bikes, spares, accessories, and fast chargers listed in the catalog.
            </p>
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

            {/* Product Category Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#6B7280] hidden sm:inline whitespace-nowrap">Category:</span>
              <select
                value={subcat}
                onChange={(e) => {
                  setSubcat(e.target.value);
                  setVisibleCount(PAGE_SIZE);
                }}
                aria-label="Filter by product category"
                className="h-10 rounded-lg border border-[#E5E7EB] bg-white px-3 text-xs font-semibold text-[#111111] outline-none cursor-pointer hover:border-gray-400 max-w-[200px]"
              >
                <option value="All">All Categories ({categories.length})</option>
                {categories.map((sc) => (
                  <option key={sc} value={sc}>{sc}</option>
                ))}
              </select>
            </div>

            {/* Department Category Pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
              {CATS.map((c) => {
                const isActive = cat === c;
                return (
                  <button
                    key={c}
                    onClick={() => {
                      setCat(c);
                      setVisibleCount(PAGE_SIZE);
                    }}
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
                onClick={() => {
                  setVolt(volt === v ? null : v);
                  setVisibleCount(PAGE_SIZE);
                }}
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
                  onChange={(e) => {
                    setOnlyFit(e.target.checked);
                    setVisibleCount(PAGE_SIZE);
                  }}
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
          <p>
            Showing <span className="font-semibold text-[#111111]">{Math.min(visibleCount, list.length)}</span> of <span className="font-semibold text-[#111111]">{list.length}</span> products
            {subcat !== "All" && (
              <span> in <strong className="text-[#E31E24]">{subcat}</strong></span>
            )}
          </p>
          {(cat !== "All" || subcat !== "All" || q || volt !== null || onlyFit) && (
            <button
              onClick={() => {
                setCat("All");
                setSubcat("All");
                setQ("");
                setVolt(null);
                setOnlyFit(false);
                setVisibleCount(PAGE_SIZE);
              }}
              className="font-medium text-[#E31E24] hover:underline"
            >
              Reset all filters
            </button>
          )}
        </div>

        {/* Product Cards Grid */}
        {catalogueState === "loading" ? (
          <div className="mt-8 rounded-2xl border border-[#E5E7EB] bg-white p-12 text-center text-sm text-[#6B7280]">Loading products from the catalog…</div>
        ) : catalogueState === "error" ? (
          <div className="mt-8 rounded-2xl border border-dashed border-[#E5E7EB] bg-white p-12 text-center">
            <p className="font-display text-xl font-bold text-[#111111]">Catalog unavailable</p>
            <p className="mt-2 text-sm text-[#6B7280]">We couldn’t load products from the catalog API. Please try again shortly.</p>
          </div>
        ) : list.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-[#E5E7EB] bg-white p-12 text-center">
            <p className="font-display text-xl font-bold text-[#111111]">No matching products found</p>
            <p className="mt-2 text-sm text-[#6B7280]">
              Try clearing filters or search query to explore the full inventory.
            </p>
            <button
              onClick={() => {
                setCat("All");
                setSubcat("All");
                setQ("");
                setVolt(null);
                setOnlyFit(false);
                setVisibleCount(PAGE_SIZE);
              }}
              className="mt-4 rounded-lg bg-[#E31E24] px-4 py-2 text-xs font-semibold text-white hover:bg-red-700"
            >
              View All Products
            </button>
          </div>
        ) : (
          <>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {list.slice(0, visibleCount).map((p) => (
                <CatalogProductCard key={p.id} product={p} />
              ))}
            </div>

            {visibleCount < list.length && (
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, list.length))}
                  className="rounded-xl border border-[#E5E7EB] bg-white px-6 py-2.5 text-xs font-bold text-[#111111] shadow-2xs hover:border-[#111111] hover:bg-gray-50 cursor-pointer transition"
                >
                  Load More Products ({list.length - visibleCount} remaining)
                </button>
                <button
                  onClick={() => setVisibleCount(list.length)}
                  className="rounded-xl bg-[#E31E24] px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-red-700 cursor-pointer transition"
                >
                  Show All {list.length} Items
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </SiteLayout>
  );
}
