import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
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
  const vehicleLabel = vehicleType === "car" ? "Car" : "Bike";

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

  return (
    <div className="mt-6 space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{vehicleLabel} accessories</p>
          <h3 className="mt-1 font-display text-2xl font-bold">Browse products</h3>
          <p className="mt-1 text-sm text-muted-foreground">{results.length} products · Product readiness and missing details are shown on each card.</p>
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
            <select value={category} onChange={(e) => { setCategory(e.target.value); setVisibleCount(PAGE_SIZE); }} aria-label="Filter by category" className="max-w-56 rounded-xl border border-border bg-background px-3 py-2 text-sm">
              <option>All categories</option>{categories.map((value) => <option key={value}>{value}</option>)}
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
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {results.slice(0, visibleCount).map((product) => <AccessoryCard key={product.id} product={product} />)}
          </div>
          {visibleCount < results.length && <div className="text-center"><button onClick={() => setVisibleCount((n) => n + PAGE_SIZE)} className="rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold hover:border-primary hover:text-primary">Show more ({results.length - visibleCount} remaining)</button></div>}
        </>
      ) : (
        <div className="rounded-3xl border border-dashed border-border p-12 text-center">
          <p className="font-display text-2xl">No accessories match</p><p className="mt-2 text-sm text-muted-foreground">Try another search or filter.</p>
        </div>
      )}
    </div>
  );
}

function AccessoryCard({ product }: { product: Product }) {
  const [activeImage, setActiveImage] = useState(0);
  const [imageFailed, setImageFailed] = useState(false);
  const images = product.imageUrls;
  const canBook = product.status === "Listed" && product.price !== null && product.price > 0;
  const statusClass = product.status === "Listed" ? "bg-emerald-500/10 text-emerald-700" : product.status === "Held back" ? "bg-slate-500/10 text-slate-600" : "bg-amber-500/10 text-amber-800";

  return (
    <article className="flex min-w-0 flex-col overflow-hidden rounded-3xl border border-border/80 bg-card shadow-card">
      <div className="relative aspect-[16/10] overflow-hidden bg-white p-3">
        {images[activeImage] && !imageFailed ? (
          <img src={images[activeImage]} alt={product.name} loading="lazy" onError={() => setImageFailed(true)} className="h-full w-full object-contain" />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-muted/30 text-center text-sm text-muted-foreground">
            <span className="text-3xl" aria-hidden="true">▧</span>
            <span>{images.length ? "Product image unavailable" : "No product image provided"}</span>
          </div>
        )}
        <span className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}>{product.status}</span>
        {product.bestseller && <span className="absolute right-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">Popular</span>}
      </div>
      {images.length > 1 && <div className="flex gap-2 overflow-x-auto px-4 pt-3">{images.slice(0, 6).map((src, index) => <button key={src} onClick={() => { setActiveImage(index); setImageFailed(false); }} aria-label={`Show image ${index + 1}`} className={`h-12 w-14 shrink-0 overflow-hidden rounded-lg border p-1 ${activeImage === index ? "border-primary" : "border-border"}`}><img src={src} alt="" loading="lazy" className="h-full w-full object-contain" /></button>)}</div>}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div><p className="text-xs font-semibold uppercase tracking-wide text-primary">{product.department || product.category}</p><h4 className="mt-1 font-display text-xl font-bold leading-snug">{product.name}</h4></div>
          {product.brand && <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium">{product.brand}</span>}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">{product.category} · {product.sku ? `SKU ${product.sku}` : product.id}</p>
        {product.description && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{product.description}</p>}
        {product.features.length > 0 && <ul className="mt-3 space-y-1 text-sm text-muted-foreground">{product.features.slice(0, 4).map((feature) => <li key={feature} className="flex gap-2"><span className="text-primary">•</span>{feature}</li>)}</ul>}
        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 rounded-2xl bg-muted/50 p-3 text-sm">
          <Info label="Fitment" value={product.fits} />
          <Info label="Availability" value={product.availability} />
          <Info label="Stock" value={product.stock === null ? null : `${product.stock} units`} />
          <Info label="Warranty" value={product.warranty} />
          <Info label="Delivery" value={product.delivery} />
          <Info label="Install" value={product.installationPrice === null ? product.installationTime : `₹${product.installationPrice.toLocaleString("en-IN")}${product.installationTime ? ` · ${product.installationTime}` : ""}`} />
          <Info label="Rating" value={product.rating === null ? null : `${product.rating.toFixed(1)}${product.reviewCount ? ` · ${product.reviewCount} reviews` : ""}`} />
          <Info label="Options" value={product.options} />
        </div>
        {product.specifications?.length ? <details className="mt-3 rounded-xl border border-border px-3 py-2"><summary className="cursor-pointer text-sm font-semibold">More specifications</summary><dl className="mt-3 grid grid-cols-2 gap-3">{product.specifications.map((spec, index) => <div key={`${spec.label}-${index}`}><dt className="text-xs text-muted-foreground">{spec.label}</dt><dd className="mt-0.5 text-sm">{spec.value}</dd></div>)}</dl></details> : null}
        {product.variants?.map((variant) => <details key={variant.id} className="mt-3 rounded-xl border border-border px-3 py-2"><summary className="cursor-pointer text-sm font-semibold">Also listed as: {variant.name}</summary><div className="mt-2 space-y-1 text-xs text-muted-foreground">{variant.sku && <p>SKU: {variant.sku}</p>}{variant.fits && <p>Fitment: {variant.fits}</p>}{variant.features?.map((feature) => <p key={feature}>• {feature}</p>)}{variant.specifications?.map((spec, i) => <p key={`${spec.label}-${i}`}>{spec.label}: {spec.value}</p>)}</div></details>)}
        {product.missing.length > 0 && <p className="mt-3 text-xs text-amber-800">Details to confirm: {product.missing.join(", ")}</p>}
        <div className="mt-auto flex items-end justify-between gap-3 border-t border-border pt-4 mt-4">
          <div><p className="text-[11px] text-muted-foreground">{product.priceType || "Price"}{product.mrp ? ` · MRP ₹${product.mrp.toLocaleString("en-IN")}` : ""}</p><p className="font-display text-2xl font-bold">{product.price ? `₹${product.price.toLocaleString("en-IN")}` : "Price pending"}</p></div>
          {canBook ? <button type="button" onClick={() => toast.success("Booking request received", { description: `${product.name} · ₹${product.price!.toLocaleString("en-IN")}` })} className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:brightness-105">Book now</button> : <span className="max-w-32 text-right text-xs text-muted-foreground">Booking opens when product details are confirmed</span>}
        </div>
      </div>
    </article>
  );
}

function Info({ label, value }: { label: string; value: string | number | null | undefined }) {
  const shown = value === null || value === undefined || value === "" ? "Not provided" : value;
  return <div className="min-w-0"><p className="text-[11px] font-medium uppercase text-muted-foreground">{label}</p><p className="mt-0.5 break-words font-medium">{shown}</p></div>;
}
