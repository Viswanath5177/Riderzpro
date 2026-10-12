import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Clock, MapPin, ShieldCheck, Star, Truck } from "lucide-react";
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
} from "@/lib/data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const p = getProduct(params.id);
    if (!p) throw notFound();
    return { name: p.name, description: p.description };
  },
  head: ({ loaderData }) =>
    loaderData
      ? {
          meta: [
            { title: `${loaderData.name} — Riderzpro` },
            { name: "description", content: loaderData.description },
            { property: "og:title", content: `${loaderData.name} — Riderzpro` },
            { property: "og:description", content: loaderData.description },
          ],
        }
      : { meta: [{ title: "Not found" }, { name: "robots", content: "noindex" }] },
  component: ProductPage,
});

function ProductPage() {
  const { id } = Route.useParams();
  const p = getProduct(id)!;
  const { activeBikeId, addToCart } = useStore();
  const fit = fitmentFor(p, activeBikeId);
  const bike = activeBikeId ? getBike(activeBikeId) : null;
  const offers = p.offers
    .map((o) => {
      const v = getVendor(o.vendorId);
      const km = Math.round(distanceKm(v, CUSTOMER_LOCATION) * 10) / 10;
      return { ...o, v, km, fee: deliveryFee(km), eta: etaMinutes(km, v.prepMins) };
    })
    .sort((a, b) => a.price + a.fee - (b.price + b.fee));

  const specs = [
    ["Voltage", p.voltage ? `${p.voltage} V` : "—"],
    ["Capacity", p.capacityAh ? `${p.capacityAh} Ah` : "—"],
    [
      "Energy",
      p.voltage && p.capacityAh ? `${((p.voltage * p.capacityAh) / 1000).toFixed(2)} kWh` : "—",
    ],
    ["Chemistry", p.chemistry ?? "—"],
    ["Est. range", p.rangeKm ? `${p.rangeKm} km` : "—"],
    ["Weight", `${p.weightKg} kg`],
    ["Warranty", `${p.warrantyMonths} months`],
    ["Brand", p.brand],
  ];

  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <Link to="/shop" className="text-sm text-muted-foreground hover:text-primary">
          ← Back to shop
        </Link>
        <div className="mt-4 grid gap-10 lg:grid-cols-2">
          <div className="overflow-hidden rounded-3xl border border-border bg-muted">
            <img
              src={p.image}
              alt={p.name}
              width={1024}
              height={1024}
              className="aspect-square w-full object-cover"
            />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
              {p.category} · {p.brand}
            </p>
            <h1 className="mt-2 font-display text-5xl leading-none md:text-6xl">{p.name}</h1>
            <p className="mt-4 text-muted-foreground">{p.description}</p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <FitmentBadge fit={fit} />
              <span className="text-sm text-muted-foreground">
                {bike ? (
                  `for ${bike.make} ${bike.model}`
                ) : (
                  <Link to="/garage" className="text-primary">
                    Add your bike to check fit
                  </Link>
                )}
              </span>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Fits: {p.fits.map((f) => bikes.find((b) => b.id === f)?.model).join(", ")}
            </p>

            <h2 className="mt-8 font-display text-3xl">Sellers near you</h2>
            <div className="mt-3 space-y-3">
              {offers.map((o, i) => (
                <div
                  key={o.vendorId}
                  className={`flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center ${i === 0 ? "border-primary bg-accent/30" : "border-border bg-card"}`}
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
                      <span className={o.stock > 0 ? "text-success" : "text-destructive"}>
                        {o.stock > 0 ? `${o.stock} in stock` : "Out of stock"}
                      </span>
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
                      className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-40"
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="mt-8 font-display text-3xl">Specifications</h2>
            <dl className="mt-3 grid grid-cols-2 overflow-hidden rounded-2xl border border-border">
              {specs.map(([k, v]) => (
                <div key={k} className="border-b border-border p-3 odd:border-r">
                  <dt className="text-xs text-muted-foreground">{k}</dt>
                  <dd className="font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" /> Genuine product · Seller-verified
              fitment · 7-day replacement
            </p>
          </div>
        </div>
        <h2 className="mt-20 font-display text-4xl">You may also need</h2>
        <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {products
            .filter((x) => x.id !== p.id && x.fits.some((f) => p.fits.includes(f)))
            .slice(0, 4)
            .map((x) => (
              <ProductCard key={x.id} p={x} />
            ))}
        </div>
      </div>
    </SiteLayout>
  );
}
