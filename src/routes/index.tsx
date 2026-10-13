import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Store,
  Star,
  MapPin,
  Clock,
  Search,
  Sparkles,
  Bike,
  Car,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductCard } from "@/components/site/bits";
import { bestOffer, inr, products, vendors, type Product } from "@/lib/data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RiderzPro — Multi-Vendor Automotive Parts & Electric Bikes" },
      {
        name: "description",
        content:
          "Discover automotive products from multiple vendors, compare prices and specifications, and choose the seller that works best for you.",
      },
      { property: "og:title", content: "RiderzPro — Automotive Marketplace" },
      {
        property: "og:description",
        content: "Find the right parts. Compare shops. Shop with confidence.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { activeBikeId } = useStore();

  // Curated lists based on real data
  const bestValueProducts = useMemo(() => {
    return [...products]
      .sort((a, b) => {
        const offA = bestOffer(a);
        const offB = bestOffer(b);
        const discA = a.mrp && offA.price ? (a.mrp - offA.price) / a.mrp : 0;
        const discB = b.mrp && offB.price ? (b.mrp - offB.price) / b.mrp : 0;
        return discB - discA;
      })
      .slice(0, 4);
  }, []);

  const featuredProducts = useMemo(() => {
    return products.slice(0, 8);
  }, []);

  const popularProducts = useMemo(() => {
    return products.slice(8, 16);
  }, []);

  const vehicleProducts = useMemo(() => {
    if (!activeBikeId) return [];
    return products.filter((p) => p.fits.includes("universal") || p.fits.includes(activeBikeId)).slice(0, 4);
  }, [activeBikeId]);

  return (
    <SiteLayout>
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Best-Value Offers Section */}
      <section className="py-12 bg-white border-b border-[#E5E7EB]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#E31E24]">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Maximum Value Deals</span>
              </div>
              <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-[#111111] font-display">
                Best-Value Offers
              </h2>
              <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
                Multi-vendor price comparison highlights the highest-value genuine automotive parts.
              </p>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E31E24] hover:underline"
            >
              <span>View All Offers</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestValueProducts.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </div>
      </section>

      {/* 3. Top-Rated Verified Vendors Section */}
      <section className="py-14 bg-[#F7F7F8] border-b border-[#E5E7EB]" id="local-shops">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#E31E24]">
                <Store className="h-3.5 w-3.5" />
                <span>Verified Independent Shops</span>
              </div>
              <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-[#111111] font-display">
                Top-Rated Marketplace Vendors
              </h2>
              <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
                Compare ratings, verified customer feedback, local dispatch speeds, and dealer policies.
              </p>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E31E24] hover:underline"
            >
              <span>Explore All Shops</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendors.map((v) => (
              <div
                key={v.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-2xs hover:shadow-md hover:border-gray-300 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-red-50 text-[#E31E24] border border-red-100 group-hover:scale-105 transition-transform">
                      <Store className="h-6 w-6" />
                    </div>
                    {v.isVerified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                        <ShieldCheck className="h-3 w-3" />
                        Verified Partner
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-base text-[#111111] group-hover:text-[#E31E24] transition">
                    {v.name}
                  </h3>

                  <div className="mt-1.5 flex items-center gap-3 text-xs text-[#6B7280]">
                    <span className="flex items-center gap-1 font-semibold text-amber-500">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {v.rating} ({v.reviewCount || 150}+)
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-gray-400" />
                      {v.area}
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-[#6B7280] line-clamp-2 leading-relaxed">
                    {v.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E5E7EB] flex items-center justify-between">
                  <span className="text-[11px] text-gray-500 truncate max-w-[170px]">
                    {v.deliveryCoverage}
                  </span>
                  <Link
                    to="/vendor/$id"
                    params={{ id: v.id }}
                    className="inline-flex items-center gap-1 rounded-xl bg-[#111111] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#E31E24] transition"
                  >
                    <span>Visit Shop</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Featured Products Catalog Section */}
      <section className="py-14 bg-white border-b border-[#E5E7EB]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#E31E24]">
                <span>Featured Catalog</span>
              </div>
              <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-[#111111] font-display">
                Featured Automotive Products
              </h2>
              <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
                Genuine electric bikes, high-capacity battery packs, fast wallboxes, and verified mechanical spares.
              </p>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E31E24] hover:underline"
            >
              <span>Browse Full Catalog</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Products Relevant to Vehicle (if selected) */}
      {vehicleProducts.length > 0 && (
        <section className="py-12 bg-[#F7F7F8] border-b border-[#E5E7EB]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#E31E24]">Tailored Fitment</span>
                <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-[#111111] font-display">
                  Compatible with Your Registered Vehicle
                </h2>
              </div>
              <Link to="/garage" className="text-xs font-bold text-[#E31E24] hover:underline">
                Manage Garage
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {vehicleProducts.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. Popular Products Section */}
      <section className="py-14 bg-white border-b border-[#E5E7EB]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#E31E24]">Customer Favorites</span>
              <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-[#111111] font-display">
                Popular Accessories & Spares
              </h2>
              <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
                Top rated riding helmets, armored jackets, digital tire inflators, and high-performance brake pads.
              </p>
            </div>
            <Link to="/shop" className="text-xs font-bold text-[#E31E24] hover:underline">
              See All Popular
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularProducts.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </div>
      </section>

      {/* 7. Trust & Marketplace Commitments */}
      <section className="py-14 bg-[#F7F7F8]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-2xs space-y-2">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-red-50 text-[#E31E24]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-sm text-[#111111]">Verified Sellers Only</h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                All vendors undergo strict business verification, GSTIN audit, and catalog accuracy vetting.
              </p>
            </div>

            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-2xs space-y-2">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-red-50 text-[#E31E24]">
                <Store className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-sm text-[#111111]">Transparent Comparison</h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Compare genuine seller prices, delivery fees, and warranties side-by-side without hidden costs.
              </p>
            </div>

            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-2xs space-y-2">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-red-50 text-[#E31E24]">
                <Truck className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-sm text-[#111111]">Hyperlocal Fast Delivery</h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Get express same-day dispatch from authorized local dealerships in your neighborhood.
              </p>
            </div>

            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-2xs space-y-2">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-red-50 text-[#E31E24]">
                <RotateCcw className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-sm text-[#111111]">7-Day Replacement</h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Hassle-free replacement for defective or misfitting parts backed by RiderzPro guarantee.
              </p>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

{/* ─────────────────────────────────────────────────────────────
    HERO SECTION (Step 3 Exact Requirements)
   ───────────────────────────────────────────────────────────── */}
function HeroSection() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({ to: "/shop", search: { q: searchQuery.trim() } as any });
    } else {
      navigate({ to: "/shop" });
    }
  };

  return (
    <div className="relative overflow-hidden bg-white border-b border-[#E5E7EB]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50/80 px-3.5 py-1 text-xs font-bold text-[#E31E24]">
            <span className="h-2 w-2 rounded-full bg-[#E31E24] animate-pulse" />
            <span>Multi-Vendor Automotive Marketplace</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#111111] leading-[1.1] tracking-tight">
            Find the right parts. Compare shops. Shop with confidence.
          </h1>

          <p className="text-base sm:text-lg text-[#6B7280] leading-relaxed max-w-2xl">
            Discover automotive products from multiple vendors, compare prices and specifications, and choose the seller that works best for you.
          </p>

          {/* Product Discovery Search Bar */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 max-w-xl pt-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search battery pack, fast charger, brake pads, helmets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-12 pr-4 rounded-xl border border-gray-300 text-sm text-[#111111] focus:border-[#E31E24] focus:outline-none shadow-2xs"
              />
            </div>
            <button
              type="submit"
              className="h-12 px-6 rounded-xl bg-[#E31E24] text-white font-bold text-sm hover:bg-red-700 transition shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Search</span>
            </button>
          </form>

          {/* Primary & Secondary Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to="/shop"
              className="rounded-xl bg-[#E31E24] px-6 py-3.5 text-sm font-bold text-white shadow-xs hover:bg-red-700 transition flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Products</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <a
              href="#local-shops"
              className="rounded-xl border border-gray-300 bg-white px-6 py-3.5 text-sm font-semibold text-[#111111] hover:bg-gray-50 transition flex items-center gap-2 cursor-pointer shadow-2xs"
            >
              <Store className="h-4 w-4 text-[#E31E24]" />
              <span>Find Local Shops</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
