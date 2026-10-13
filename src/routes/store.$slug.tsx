import { useState, useMemo } from "react";
import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  Star,
  MapPin,
  Clock,
  Truck,
  CheckCircle2,
  Package,
  Layers,
  Sparkles,
  ArrowLeft,
  Store,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductCard } from "@/components/site/bits";
import { getCatalogueVendor, getCatalogueProducts, useCatalogue } from "@/lib/catalogue";
import { Category } from "@/lib/data";

export const Route = createFileRoute("/store/$slug")({
  loader: ({ params }) => {
    const vendor = getCatalogueVendor(params.slug);
    if (!vendor) throw notFound();
    return { vendor };
  },
  head: ({ loaderData }) =>
    loaderData
      ? {
          meta: [
            { title: `${loaderData.vendor.name} — RiderzPro Verified Store` },
            {
              name: "description",
              content: `Official storefront of ${loaderData.vendor.name} on RiderzPro. Authentic EV bike batteries, spares, and gear.`,
            },
          ],
        }
      : { meta: [{ title: "Store Not Found" }] },
  component: VendorStorefrontPage,
});

function VendorStorefrontPage() {
  const { slug } = Route.useParams();
  const { products: allLiveProducts, vendors } = useCatalogue();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const vendor = useMemo(() => {
    return vendors.find((v) => v.storeSlug === slug || v.id === slug) || getCatalogueVendor(slug);
  }, [vendors, slug]);

  if (!vendor) {
    throw notFound();
  }

  // Filter products sold by this vendor
  const vendorProducts = useMemo(() => {
    return allLiveProducts.filter((p) =>
      p.offers.some((o) => o.vendorId === vendor.id) || p.vendorStoreId === vendor.id
    );
  }, [allLiveProducts, vendor.id]);

  // Available categories for this vendor
  const categories = useMemo(() => {
    const cats = new Set<string>();
    vendorProducts.forEach((p) => cats.add(p.category));
    return ["All", ...Array.from(cats)];
  }, [vendorProducts]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "All") return vendorProducts;
    return vendorProducts.filter((p) => p.category === selectedCategory);
  }, [vendorProducts, selectedCategory]);

  return (
    <SiteLayout>
      <div className="min-h-screen bg-[#F5F6F8] pb-16">
        {/* Banner Section */}
        <div className="relative h-48 md:h-64 w-full overflow-hidden bg-gradient-to-r from-zinc-900 via-neutral-900 to-red-950">
          {vendor.bannerUrl ? (
            <img
              src={vendor.bannerUrl}
              alt={vendor.name}
              className="h-full w-full object-cover opacity-60"
            />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(227,30,36,0.25),transparent_70%)]" />
          )}

          {/* Breadcrumb back */}
          <div className="absolute top-4 left-4 z-10">
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 text-white/90 backdrop-blur-md text-xs font-semibold hover:bg-black/60 transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Catalog
            </Link>
          </div>
        </div>

        {/* Store Header Card */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 -mt-16 relative z-20">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start sm:items-center gap-4">
                {/* Logo / Avatar */}
                <div className="h-20 w-20 shrink-0 rounded-2xl border-2 border-white bg-red-50 shadow-md overflow-hidden flex items-center justify-center">
                  {vendor.logoUrl ? (
                    <img
                      src={vendor.logoUrl}
                      alt={vendor.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Store className="h-10 w-10 text-[#E31E24]" />
                  )}
                </div>

                {/* Vendor details */}
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="font-display text-2xl md:text-3xl font-extrabold text-[#111111]">
                      {vendor.name}
                    </h1>
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700 border border-blue-200">
                      <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
                      Verified Merchant
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                    <span className="flex items-center gap-1 text-gray-700 font-semibold">
                      <MapPin className="h-3.5 w-3.5 text-gray-400" />
                      {vendor.area}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1 font-bold text-gray-900">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {vendor.rating} Rating
                    </span>
                    <span>·</span>
                    <span className="text-emerald-700 font-semibold">
                      {vendorProducts.length} Active Listings
                    </span>
                  </p>

                  {vendor.tagline && (
                    <p className="text-xs text-gray-600 mt-2 italic font-medium">
                      "{vendor.tagline}"
                    </p>
                  )}
                </div>
              </div>

              {/* Fulfilment Highlights */}
              <div className="flex items-center gap-3 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                <div className="bg-red-50/60 rounded-2xl p-3 border border-red-100 text-center min-w-[100px]">
                  <Clock className="h-4 w-4 text-[#E31E24] mx-auto mb-1" />
                  <p className="text-[10px] text-gray-500 font-medium">Handling</p>
                  <p className="text-xs font-bold text-gray-900">~{vendor.prepMins} Mins</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100 text-center min-w-[100px]">
                  <Truck className="h-4 w-4 text-gray-700 mx-auto mb-1" />
                  <p className="text-[10px] text-gray-500 font-medium">Delivery</p>
                  <p className="text-xs font-bold text-gray-900">Hyperlocal</p>
                </div>
                <div className="bg-emerald-50/60 rounded-2xl p-3 border border-emerald-100 text-center min-w-[100px]">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 mx-auto mb-1" />
                  <p className="text-[10px] text-gray-500 font-medium">Parts</p>
                  <p className="text-xs font-bold text-emerald-800">100% Genuine</p>
                </div>
              </div>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="mt-8 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="font-display text-xl font-bold text-[#111111]">
                Catalog & Spares ({filteredProducts.length})
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Authentic automotive parts supplied and backed by {vendor.name}.
              </p>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCategory(c)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                    selectedCategory === c
                      ? "bg-[#E31E24] text-white shadow-xs"
                      : "bg-white text-gray-600 hover:text-black border border-gray-200"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
          ) : (
            <div className="mt-12 rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-gray-900">No products found</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                No active listings found under "{selectedCategory}". Try choosing another category tab above.
              </p>
            </div>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}
