import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Clock, MapPin, ShieldCheck, Star, Truck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/SiteLayout";
import { FitmentBadge, ProductCard } from "@/components/site/bits";
import {
  CUSTOMER_LOCATION,
  bikes,
  deliveryFee,
  distanceKm,
  etaMinutes,
  fitmentFor,
  getBike,
  getProduct,
  getVendor,
  inr,
  products,
  mapDbProductToProduct,
  type Product,
} from "@/lib/data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/product/$id")({
  component: ProductPage,
});

function ProductPage() {
  const { id } = Route.useParams();
  const { activeBikeId, addToCart } = useStore();

  const [product, setProduct] = useState<Product | null>(() => {
    return getProduct(id) || null;
  });
  const [loading, setLoading] = useState(!product);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!product) {
      setLoading(true);
      fetch(`/api/products/${id}`)
        .then((res) => res.json())
        .then((res) => {
          if (res.success && res.data) {
            setProduct(mapDbProductToProduct(res.data));
          } else {
            setError(true);
          }
        })
        .catch(() => {
          setError(true);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, product]);

  if (loading) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-7xl px-4 py-24 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#E31E24] mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-700">Loading product details from database...</p>
        </div>
      </SiteLayout>
    );
  }

  if (error || !product) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-7xl px-4 py-24 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
          <p className="text-sm text-gray-500 mb-6">The product you are looking for does not exist or has been removed.</p>
          <Link
            to="/dashboard/customer"
            search={{ tab: "shop" }}
            className="rounded-full bg-[#E31E24] px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-red-700 transition"
          >
            Back to Customer Shop
          </Link>
        </div>
      </SiteLayout>
    );
  }

  const p = product;
  const fit = fitmentFor(p, activeBikeId);
  const bike = activeBikeId ? getBike(activeBikeId) : null;
  const offers = (p.offers || [])
    .map((o) => {
      const v = getVendor(o.vendorId);
      const km = Math.round(distanceKm(v, CUSTOMER_LOCATION) * 10) / 10;
      return { ...o, v, km, fee: deliveryFee(km), eta: etaMinutes(km, v.prepMins) };
    })
    .sort((a, b) => a.price + a.fee - (b.price + b.fee));

  const specs = [
    ["Voltage", p.voltage ? `${p.voltage} V` : "—"],
    ["Capacity", p.capacityAh ? `${p.capacityAh} Ah` : "—"],
    ["Energy", p.voltage && p.capacityAh ? `${((p.voltage * p.capacityAh) / 1000).toFixed(2)} kWh` : "—"],
    ["Chemistry", p.chemistry ?? "—"],
    ["Est. range", p.rangeKm ? `${p.rangeKm} km` : "—"],
    ["Weight", `${p.weightKg} kg`],
    ["Warranty", `${p.warrantyMonths} months`],
    ["Brand", p.brand],
  ];

  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <Link to="/dashboard/customer" search={{ tab: "shop" }} className="text-sm text-muted-foreground hover:text-primary">
          ← Back to shop
        </Link>
        <div className="mt-4 grid gap-10 lg:grid-cols-2">
          <div className="overflow-hidden rounded-3xl border border-border bg-muted">
            <img
              src={p.image}
              alt={p.name}
              width={1024}
              height={1024}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "/src/assets/parts.jpg";
              }}
              className="aspect-square w-full object-cover"
            />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">{p.category} · {p.brand}</p>
            <h1 className="mt-2 font-display text-4xl sm:text-5xl leading-tight text-[#111111]">{p.name}</h1>
            <p className="mt-4 text-muted-foreground leading-relaxed whitespace-pre-line">{p.description}</p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <FitmentBadge fit={fit} />
              <span className="text-sm text-muted-foreground">
                {bike ? `for ${bike.make} ${bike.model}` : <Link to="/garage" className="text-primary font-semibold">Add your bike to check fit</Link>}
              </span>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Fits: {p.fits.map((f) => bikes.find((b) => b.id === f)?.model || f).join(", ")}
            </p>

            <h2 className="mt-8 font-display text-2xl font-bold text-[#111111]">Sellers & Availability</h2>
            <div className="mt-3 space-y-3">
              {offers.length === 0 ? (
                <div className="rounded-2xl border p-4 text-xs text-gray-500">Currently out of stock</div>
              ) : (
                offers.map((o, i) => (
                  <div
                    key={o.vendorId}
                    className={`flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center ${
                      i === 0 ? "border-[#E31E24] bg-red-50/60 shadow-2xs" : "border-[#E5E7EB] bg-white shadow-2xs"
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{o.v.name}</p>
                        {i === 0 && (
                          <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase text-primary-foreground">
                            Best value
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-warning text-warning" />
                          {o.v.rating}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {o.km} km
                        </span>
                        <span className="flex items-center gap-1">
                          <Truck className="h-3 w-3" />
                          {inr(o.fee)} delivery
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />~{o.eta} min
                        </span>
                        {o.stock > 0 && o.stock < 5 ? (
                          <span className="text-amber-700 font-bold flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                            Hurry limited Stock ({o.stock} left)
                          </span>
                        ) : (
                          <span className={o.stock >= 5 ? "text-emerald-700 font-semibold" : "text-destructive"}>
                            {o.stock >= 5 ? `${o.stock} in stock` : "Out of stock"}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-2xl font-bold">{inr(o.price)}</p>
                      <button
                        disabled={o.stock === 0}
                        onClick={() => {
                          addToCart(p.id, o.vendorId);
                          toast.success("Added to cart", { description: o.v.name });
                        }}
                        className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-40 hover:bg-red-700 transition"
                      >
                        Add to cart
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <h2 className="mt-8 font-display text-2xl font-bold text-[#111111]">Specifications</h2>
            <dl className="mt-3 grid grid-cols-2 overflow-hidden rounded-2xl border border-border">
              {specs.map(([k, v]) => (
                <div key={k} className="border-b border-border p-3 odd:border-r">
                  <dt className="text-xs text-muted-foreground">{k}</dt>
                  <dd className="font-semibold text-sm">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" /> Genuine product · Seller-verified fitment · 7-day replacement
            </p>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
