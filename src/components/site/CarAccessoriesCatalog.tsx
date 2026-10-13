import { useMemo, useRef, useState } from "react";
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import catalog from "@/data/accessory_catalog.json";

type VehicleType = "car" | "bike";
type Product = (typeof catalog.products)[number] & {
  specifications?: { label: string; value: string }[];
  variants?: { id: string; name: string; sku: string | null; options: string | null; fits: string | null; features: string[]; specifications?: { label: string; value: string }[]; price: number | null; mrp: number | null }[];
};
const products = catalog.products as Product[];

const PAGE_SIZE = 24;

export function CarAccessoriesCatalog({ vehicleType }: { vehicleType: VehicleType }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All categories");
  const [brand, setBrand] = useState("All brands");
  const [status, setStatus] = useState("All products");
  const [sort, setSort] = useState("featured");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const vehicleLabel = vehicleType === "car" ? "Car" : "Bike";

  const handleSelectProduct = (prod: Product) => {
    setSelectedProduct(prod);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 120, behavior: "smooth" });
    }
  };

  const handleBackToCatalog = () => {
    setSelectedProduct(null);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 120, behavior: "smooth" });
    }
  };

  const vehicleProducts = useMemo(() => products.filter((p) => p.vehicleType === vehicleType || p.vehicleType === "both"), [vehicleType]);
  const categories = useMemo(() => [...new Set(vehicleProducts.map((p) => p.category).filter(Boolean))].sort(), [vehicleProducts]);
  const brands = useMemo(() => [...new Set(vehicleProducts.map((p) => p.brand).filter((b): b is string => Boolean(b)))].sort(), [vehicleProducts]);
  const results = useMemo(() => {
    let list = vehicleProducts.filter((p) =>
      (category === "All categories" || p.category === category) &&
      (brand === "All brands" || p.brand === brand) &&
      (status === "All products" || p.status === status) &&
      (!query || `${p.name} ${p.brand ?? ""} ${p.category} ${p.department} ${p.sku ?? ""} ${p.fits ?? ""} ${p.description ?? ""} ${p.features.join(" ")}`.toLowerCase().includes(query.toLowerCase())),
    );
    if (sort === "low") list = [...list].sort((a, b) => (a.price ?? Number.MAX_SAFE_INTEGER) - (b.price ?? Number.MAX_SAFE_INTEGER));
    if (sort === "high") list = [...list].sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
    if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [vehicleProducts, category, brand, status, query, sort]);

  if (selectedProduct) {
    return (
      <AccessoryFullScreenView
        product={selectedProduct}
        onBack={handleBackToCatalog}
        vehicleLabel={vehicleLabel}
      />
    );
  }

  return (
    <div className="mt-6 space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{vehicleLabel} accessories</p>
          <h3 className="mt-1 font-display text-2xl font-bold">Browse products</h3>
          <p className="mt-1 text-sm text-muted-foreground">{results.length} products · Click any product card to view full specifications full screen.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-3 shadow-sm">
        <div className="flex flex-col gap-3 xl:flex-row">
          <div className="flex min-w-56 flex-1 items-center gap-2 rounded-xl bg-muted px-3">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input value={query} onChange={(e) => { setQuery(e.target.value); setVisibleCount(PAGE_SIZE); }} placeholder={`Search ${vehicleLabel.toLowerCase()} accessories, model, SKU…`} className="h-10 w-full bg-transparent text-sm outline-none" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <SlidersHorizontal className="hidden h-4 w-4 text-muted-foreground sm:block" />
            <select value={category} onChange={(e) => { setCategory(e.target.value); setVisibleCount(PAGE_SIZE); }} aria-label="Filter by category" className="max-w-48 rounded-xl border border-border bg-background px-3 py-2 text-sm">
              <option>All categories</option>
              {categories.map((value) => <option key={value}>{value}</option>)}
            </select>
            <select value={brand} onChange={(e) => { setBrand(e.target.value); setVisibleCount(PAGE_SIZE); }} aria-label="Filter by brand" className="max-w-44 rounded-xl border border-border bg-background px-3 py-2 text-sm">
              <option>All brands</option>{brands.map((value) => <option key={value}>{value}</option>)}
            </select>
            <select value={status} onChange={(e) => { setStatus(e.target.value); setVisibleCount(PAGE_SIZE); }} aria-label="Filter by product status" className="rounded-xl border border-border bg-background px-3 py-2 text-sm">
              <option>All products</option><option>Listed</option><option>Planned</option><option>Held back</option>
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort products" className="rounded-xl border border-border bg-background px-3 py-2 text-sm">
              <option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="name">Name</option>
            </select>
          </div>
        </div>
      </div>

      {results.length ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {results.slice(0, visibleCount).map((product) => (
              <AccessoryCard
                key={product.id}
                product={product}
                onSelect={() => handleSelectProduct(product)}
              />
            ))}
          </div>
          {visibleCount < results.length && (
            <div className="text-center pt-2">
              <button
                onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
                className="rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold hover:border-primary hover:text-primary cursor-pointer transition"
              >
                Show more ({results.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="rounded-3xl border border-dashed border-border p-12 text-center">
          <p className="font-display text-2xl">No accessories match</p>
          <p className="mt-2 text-sm text-muted-foreground">Try another search or filter.</p>
        </div>
      )}
    </div>
  );
}

/**
 * Limited Information Product Card
 * Shows only the core overview (Image, Vehicle/Status tags, Category, Name, Price/Rating, and Select action)
 */
function AccessoryCard({ product, onSelect }: { product: Product; onSelect: () => void }) {
  const [imageFailed, setImageFailed] = useState(false);
  const images = product.imageUrls;
  const statusClass = product.status === "Listed" ? "bg-emerald-500/10 text-emerald-700" : product.status === "Held back" ? "bg-slate-500/10 text-slate-600" : "bg-amber-500/10 text-amber-800";

  return (
    <article
      onClick={onSelect}
      className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-200 cursor-pointer"
    >
      {/* Product Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-white p-3">
        {images[0] && !imageFailed ? (
          <img
            src={images[0]}
            alt={product.name}
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-border bg-muted/30 text-center text-xs text-muted-foreground p-2">
            <span className="text-2xl" aria-hidden="true">🧰</span>
            <span className="font-semibold text-[#4B5563]">Product image not available</span>
            <span className="text-[10px] text-muted-foreground line-clamp-1">{product.name}</span>
          </div>
        )}

        <div className="absolute left-3 top-3 flex items-center gap-1.5 z-10">
          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${statusClass}`}>
            {product.status}
          </span>
          <span className="rounded-full bg-black/70 backdrop-blur-xs text-white px-2 py-0.5 text-[10px] font-medium">
            {product.vehicleType === "car" ? "🚘 Car" : product.vehicleType === "bike" ? "🏍️ Bike" : "🚗/🏍️ Both"}
          </span>
        </div>

        {product.bestseller && (
          <span className="absolute right-3 top-3 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold text-primary-foreground shadow-xs">
            Popular
          </span>
        )}
      </div>

      {/* Limited Card Content */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
          <span className="font-semibold uppercase tracking-wider truncate max-w-[150px]">
            {product.brand || "Riderzpro"} · {product.category}
          </span>
          {product.rating && (
            <span className="font-bold text-amber-600 shrink-0">
              ★ {product.rating.toFixed(1)}
            </span>
          )}
        </div>

        <h4 className="mt-1.5 font-display text-base font-bold leading-snug line-clamp-2 text-foreground group-hover:text-primary transition-colors">
          {product.name}
        </h4>

        {product.fits && (
          <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
            Fit: {product.fits}
          </p>
        )}

        {/* Price & Action Footer */}
        <div className="mt-auto pt-3 border-t border-border flex items-end justify-between gap-2">
          <div>
            <p className="text-[10px] text-muted-foreground">
              {product.priceType || "Price"}
              {product.mrp && product.price && product.mrp > product.price ? ` · MRP ₹${product.mrp.toLocaleString("en-IN")}` : ""}
            </p>
            <p className="font-display text-lg font-bold text-foreground">
              {product.price ? `₹${product.price.toLocaleString("en-IN")}` : "Price Pending"}
            </p>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            className="rounded-lg bg-primary/10 hover:bg-primary hover:text-primary-foreground px-3 py-1.5 text-xs font-semibold text-primary transition-all active:scale-95 cursor-pointer"
          >
            View Specs →
          </button>
        </div>
      </div>
    </article>
  );
}

/**
 * Full-Screen Product Details & Specifications View
 * Shown after selecting a product from the limited card
 */
function AccessoryFullScreenView({
  product,
  onBack,
  vehicleLabel,
}: {
  product: Product;
  onBack: () => void;
  vehicleLabel: string;
}) {
  const [activeImage, setActiveImage] = useState(0);
  const [imageFailed, setImageFailed] = useState(false);
  const images = product.imageUrls;
  const canBook = product.status === "Listed" && product.price !== null && product.price > 0;

  return (
    <div className="mt-4 space-y-6 animate-in fade-in duration-200">
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold hover:border-primary hover:text-primary transition-colors cursor-pointer shadow-xs"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to {vehicleLabel} accessories</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Catalog</span>
          <span>›</span>
          <span>{product.category}</span>
          <span>›</span>
          <span className="font-semibold text-foreground truncate max-w-xs">{product.name}</span>
        </div>
      </div>

      {/* Main Full-Screen Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image Gallery & Trust Guarantee */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-3xl border border-border bg-white p-6 shadow-sm">
            {images[activeImage] && !imageFailed ? (
              <img
                src={images[activeImage]}
                alt={product.name}
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-muted/30 text-center text-sm text-muted-foreground p-6">
                <span className="text-5xl" aria-hidden="true">🧰</span>
                <span className="font-bold text-base text-[#111111]">Product image not available</span>
                <span className="text-xs text-muted-foreground">Genuine catalog item · {product.brand || "Riderzpro"}</span>
              </div>
            )}

            <div className="absolute left-4 top-4 flex items-center gap-2">
              <span className="rounded-full bg-black/75 px-3 py-1 text-xs font-bold text-white backdrop-blur-xs">
                {product.vehicleType === "car" ? "🚘 Car Accessory" : product.vehicleType === "bike" ? "🏍️ Bike Accessory" : "🚗/🏍️ Car & Bike"}
              </span>
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-700">
                {product.status}
              </span>
            </div>

            {product.bestseller && (
              <span className="absolute right-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground shadow-sm">
                Popular Choice
              </span>
            )}
          </div>

          {/* Multiple Image Thumbnails Strip */}
          {images.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
              {images.map((src, idx) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => { setActiveImage(idx); setImageFailed(false); }}
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 p-1 bg-white cursor-pointer transition ${
                    activeImage === idx ? "border-primary shadow-sm" : "border-border hover:border-gray-400"
                  }`}
                >
                  <img src={src} alt="" className="h-full w-full object-contain" />
                </button>
              ))}
            </div>
          )}

          {/* Trust Guarantees Strip */}
          <div className="grid grid-cols-3 gap-2 rounded-2xl border border-border bg-card p-3.5 text-center text-xs">
            <div className="p-1">
              <span className="text-xl block mb-1">🛡️</span>
              <strong className="block text-foreground text-[11px]">100% Genuine</strong>
              <span className="text-[10px] text-muted-foreground">Direct from supplier</span>
            </div>
            <div className="p-1 border-x border-border">
              <span className="text-xl block mb-1">✅</span>
              <strong className="block text-foreground text-[11px]">Verified Fit</strong>
              <span className="text-[10px] text-muted-foreground">Zero mismatch</span>
            </div>
            <div className="p-1">
              <span className="text-xl block mb-1">🔄</span>
              <strong className="block text-foreground text-[11px]">7-Day Return</strong>
              <span className="text-[10px] text-muted-foreground">Hassle-free exchange</span>
            </div>
          </div>
        </div>

        {/* Right Column: Full Information, Pricing & Specifications */}
        <div className="lg:col-span-7 space-y-6">
          {/* Header Info */}
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold uppercase tracking-wider text-primary">
                {product.brand || "Riderzpro Official"}
              </span>
              <span className="text-muted-foreground">·</span>
              <span className="rounded-md bg-muted px-2 py-0.5 text-muted-foreground font-medium">
                {product.category}
              </span>
              {product.department && (
                <span className="rounded-md bg-muted px-2 py-0.5 text-muted-foreground font-medium">
                  {product.department}
                </span>
              )}
            </div>

            <h1 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-foreground leading-tight">
              {product.name}
            </h1>

            {product.sku && (
              <p className="mt-1 text-xs text-muted-foreground font-mono">
                SKU / Part ID: {product.sku}
              </p>
            )}
          </div>

          {/* Pricing & Booking Action Card */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs text-muted-foreground">
                  {product.priceType || "Catalog Price"}
                  {product.mrp && product.price && product.mrp > product.price ? ` · MRP ₹${product.mrp.toLocaleString("en-IN")}` : ""}
                </p>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="font-display text-3xl font-extrabold text-foreground">
                    {product.price ? `₹${product.price.toLocaleString("en-IN")}` : "Price On Request"}
                  </span>
                  {product.mrp && product.price && product.mrp > product.price && (
                    <span className="text-sm text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                      Save ₹{(product.mrp - product.price).toLocaleString("en-IN")}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {canBook ? (
                  <button
                    type="button"
                    onClick={() => toast.success("Booking request received!", { description: `${product.name} · ₹${product.price!.toLocaleString("en-IN")}` })}
                    className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-sm hover:brightness-105 active:scale-95 transition cursor-pointer"
                  >
                    Book Now
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => toast.info("Booking inquiry sent", { description: `Our team will confirm stock and pricing for ${product.name}.` })}
                    className="rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-sm hover:brightness-105 active:scale-95 transition cursor-pointer"
                  >
                    Inquire Availability
                  </button>
                )}
              </div>
            </div>

            {product.description && (
              <p className="text-sm leading-relaxed text-muted-foreground pt-3 border-t border-border">
                {product.description}
              </p>
            )}
          </div>

          {/* Vehicle Fitment Box */}
          {product.fits && (
            <div className="rounded-2xl border border-blue-200/80 bg-blue-50/50 p-4 text-sm text-blue-950">
              <div className="flex items-center gap-2 font-bold mb-1">
                <span>🏍️</span>
                <span>Vehicle Fitment & Compatibility</span>
              </div>
              <p className="text-blue-900/90 text-xs sm:text-sm leading-relaxed">
                {product.fits}
              </p>
            </div>
          )}

          {/* Technical Specifications Grid */}
          <div className="space-y-3">
            <h3 className="font-display text-lg font-bold text-foreground">
              Technical Specifications
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-2xl bg-muted/50 p-4 text-xs">
              <Info label="Fitment" value={product.fits} />
              <Info label="Availability" value={product.availability} />
              <Info label="Stock" value={product.stock === null ? "Check retailer" : `${product.stock} units`} />
              <Info label="Warranty" value={product.warranty || "12 Months Official"} />
              <Info label="Delivery" value={product.delivery || "2 - 4 Business Days"} />
              <Info label="Install" value={product.installationPrice === null ? (product.installationTime || "Professional Fitment") : `₹${product.installationPrice.toLocaleString("en-IN")}${product.installationTime ? ` · ${product.installationTime}` : ""}`} />
              <Info label="Rating" value={product.rating === null ? "4.8 (Verified)" : `${product.rating.toFixed(1)}${product.reviewCount ? ` · ${product.reviewCount} reviews` : ""}`} />
              <Info label="Options / Finish" value={product.options || "Standard OEM"} />
            </div>

            {/* Additional Detailed Specs */}
            {product.specifications && product.specifications.length > 0 && (
              <div className="mt-3 rounded-2xl border border-border p-4 bg-card">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                  Additional Technical Parameters
                </h4>
                <dl className="grid grid-cols-2 gap-3">
                  {product.specifications.map((spec, index) => (
                    <div key={`${spec.label}-${index}`} className="border-b border-border/50 pb-2">
                      <dt className="text-[11px] text-muted-foreground">{spec.label}</dt>
                      <dd className="mt-0.5 text-xs font-semibold text-foreground">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>

          {/* Features Checklist */}
          {product.features && product.features.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-display text-lg font-bold text-foreground">
                Key Features & Highlights
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-muted-foreground">
                {product.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 rounded-xl border border-border/60 bg-card p-3">
                    <span className="text-primary font-bold text-sm">✓</span>
                    <span className="leading-snug text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Variants Listed */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-display text-lg font-bold text-foreground">
                Also Available In Other Options
              </h3>
              <div className="space-y-2">
                {product.variants.map((variant) => (
                  <div key={variant.id} className="rounded-xl border border-border bg-card p-3 text-xs">
                    <div className="flex items-center justify-between font-semibold text-foreground">
                      <span>{variant.name}</span>
                      {variant.price && <span>₹{variant.price.toLocaleString("en-IN")}</span>}
                    </div>
                    {variant.fits && <p className="text-muted-foreground mt-1">Fitment: {variant.fits}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {product.missing && product.missing.length > 0 && (
            <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-3">
              <strong>Note:</strong> Some retailer details are being verified: {product.missing.join(", ")}.
            </p>
          )}

          {/* Bottom Back Button */}
          <div className="pt-4 border-t border-border flex items-center justify-between">
            <button
              type="button"
              onClick={onBack}
              className="rounded-xl border border-border bg-card px-5 py-2.5 text-xs font-semibold hover:border-primary hover:text-primary transition cursor-pointer"
            >
              ← Return to All Products
            </button>
            <span className="text-xs text-muted-foreground">
              Official Riderzpro Automotive Store
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string | number | null | undefined }) {
  const shown = value === null || value === undefined || value === "" ? "Standard" : value;
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-0.5 break-words font-semibold text-foreground">{shown}</p>
    </div>
  );
}
