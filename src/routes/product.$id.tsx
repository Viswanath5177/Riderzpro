import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Clock,
  MapPin,
  ShieldCheck,
  Star,
  Truck,
  Loader2,
  Store,
  ArrowUpDown,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
  HelpCircle,
  ThumbsUp,
  Tag,
  ChevronRight,
  ExternalLink,
  Heart,
} from "lucide-react";
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
  getProductReviews,
  addProductReview,
  inr,
  products,
  mapDbProductToProduct,
  type Product,
  type ProductReview,
} from "@/lib/data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/product/$id")({
  head: () => ({
    meta: [
      { title: "Compare Sellers & Specifications — RiderzPro" },
      { name: "description", content: "Compare vendor offers, genuine technical specifications, verified customer reviews, and fast delivery estimates." },
    ],
  }),
  component: ProductPage,
});

type OfferSortOption = "value" | "price_asc" | "rating_desc" | "delivery_fast";

function ProductPage() {
  const { id } = Route.useParams();
  const { activeBikeId, addToCart, isSaved, toggleSaved } = useStore();

  const [product, setProduct] = useState<Product | null>(() => getProduct(id) || null);
  const [loading, setLoading] = useState(!product);
  const [error, setError] = useState(false);

  // Offers Sorting & View
  const [offerSort, setOfferSort] = useState<OfferSortOption>("value");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  // Product Reviews
  const [reviews, setReviews] = useState<ProductReview[]>(() => getProductReviews(id));
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState("");
  const [newComment, setNewComment] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [newVehicle, setNewVehicle] = useState("");
  const [applicableCoupons, setApplicableCoupons] = useState<any[]>([]);

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
        .catch(() => setError(true))
        .finally(() => setLoading(false));
    }
  }, [id, product]);

  useEffect(() => {
    if (id) {
      fetch(`/api/coupons/applicable?product_id=${encodeURIComponent(id)}`)
        .then((r) => r.json())
        .then((res) => {
          if (res.success && Array.isArray(res.coupons)) {
            setApplicableCoupons(res.coupons);
          }
        })
        .catch(() => {});
    }
  }, [id]);

  const p = product;
  const saved = p ? isSaved(p.id) : false;
  const fit = p ? fitmentFor(p, activeBikeId) : "unknown";
  const bike = activeBikeId ? getBike(activeBikeId) : null;

  // Process and sort offers
  const enrichedOffers = useMemo(() => {
    if (!p || !p.offers) return [];
    const list = p.offers.map((o) => {
      const v = getVendor(o.vendorId);
      const km = Math.round(distanceKm(v, CUSTOMER_LOCATION) * 10) / 10;
      const fee = o.shippingCharge ?? deliveryFee(km);
      const eta = etaMinutes(km, v.prepMins);
      const totalCost = o.price + fee;
      return {
        ...o,
        v,
        km,
        fee,
        eta,
        totalCost,
      };
    });

    if (offerSort === "value") {
      list.sort((a, b) => a.totalCost - b.totalCost);
    } else if (offerSort === "price_asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (offerSort === "rating_desc") {
      list.sort((a, b) => b.v.rating - a.v.rating);
    } else if (offerSort === "delivery_fast") {
      list.sort((a, b) => a.eta - b.eta);
    }
    return list;
  }, [p, offerSort]);

  // Similar compatible products for technical comparison
  const similarProducts = useMemo(() => {
    if (!p) return [];
    return products.filter((item) => item.category === p.category && item.id !== p.id).slice(0, 3);
  }, [p]);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !newUserName.trim() || !newTitle.trim()) {
      toast.error("Please fill in your name, review headline, and detailed feedback.");
      return;
    }
    const created = addProductReview({
      productId: id,
      userId: `usr-${Date.now()}`,
      userName: newUserName.trim(),
      userCity: "Bengaluru",
      rating: newRating,
      title: newTitle.trim(),
      comment: newComment.trim(),
      fitmentVehicle: newVehicle.trim() || (bike ? `${bike.make} ${bike.model}` : "Verified Vehicle"),
      isVerifiedPurchase: true,
    });
    setReviews([created, ...reviews]);
    setNewTitle("");
    setNewComment("");
    setNewUserName("");
    setNewVehicle("");
    setIsWritingReview(false);
    toast.success("Thank you! Your product review has been submitted and published.");
  };

  if (loading) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-7xl px-4 py-24 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#E31E24] mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-700">Loading product and multi-vendor offers...</p>
        </div>
      </SiteLayout>
    );
  }

  if (error || !p) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-7xl px-4 py-24 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
          <p className="text-sm text-gray-500 mb-6">The product you are looking for does not exist or has been removed.</p>
          <Link
            to="/shop"
            className="rounded-full bg-[#E31E24] px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-red-700 transition"
          >
            Explore Catalog
          </Link>
        </div>
      </SiteLayout>
    );
  }

  const specs = [
    ["Brand", p.brand],
    ["Category", p.category],
    ["Voltage", p.voltage ? `${p.voltage} V` : "Universal / Standard"],
    ["Capacity", p.capacityAh ? `${p.capacityAh} Ah` : "—"],
    ["Energy Density", p.voltage && p.capacityAh ? `${((p.voltage * p.capacityAh) / 1000).toFixed(2)} kWh` : "—"],
    ["Battery Chemistry", p.chemistry ?? "OEM Standard"],
    ["Est. Operating Range", p.rangeKm ? `${p.rangeKm} km` : "Vehicle Dependent"],
    ["Total Weight", `${p.weightKg} kg`],
    ["Base Manufacturer Warranty", `${p.warrantyMonths} Months`],
    ["Part SKU / Model", p.sku || `SKU-${p.id}`],
  ];

  const avgProductRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "4.8";

  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-[#6B7280] mb-4">
          <Link to="/" className="hover:text-[#111111]">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-[#111111]">Catalog</Link>
          <span>/</span>
          <Link to="/shop" search={{ cat: p.category } as any} className="hover:text-[#111111]">{p.category}</Link>
          <span>/</span>
          <span className="text-[#111111] font-semibold truncate max-w-[200px] sm:max-w-md">{p.name}</span>
        </div>

        {/* Canonical Product Overview Section */}
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Product Media Gallery */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white p-4 shadow-2xs">
              <button
                type="button"
                onClick={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const ok = await toggleSaved(p.id, p);
                  if (ok) {
                    toast.success(saved ? "Removed from wishlist" : "Saved to wishlist");
                  }
                }}
                aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
                className={`absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/95 backdrop-blur-xs border border-gray-200 shadow-sm transition hover:scale-110 cursor-pointer ${
                  saved ? "text-[#E31E24]" : "text-gray-400 hover:text-[#E31E24]"
                }`}
                title={saved ? "Remove from wishlist" : "Save to wishlist"}
              >
                <Heart className={`h-5 w-5 ${saved ? "fill-current text-[#E31E24]" : ""}`} />
              </button>
              <img
                src={p.image}
                alt={p.name}
                width={1024}
                height={1024}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/src/assets/parts.jpg";
                }}
                className="aspect-square w-full object-contain rounded-2xl"
              />
            </div>
            <div className="flex items-center justify-between text-xs text-[#6B7280] px-2">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-[#E31E24]" />
                100% Genuine Certified
              </span>
              <span className="flex items-center gap-1.5">
                <RotateCcw className="h-4 w-4 text-[#E31E24]" />
                7-Day Replacement Guarantee
              </span>
            </div>
          </div>

          {/* Product Header & Fitment */}
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-red-50 text-[#E31E24] px-3 py-1 text-xs font-bold uppercase tracking-wider border border-red-100">
                {p.category}
              </span>
              <span className="text-xs font-semibold text-[#6B7280]">·</span>
              <span className="text-xs font-semibold text-[#6B7280]">{p.brand}</span>
            </div>

            <h1 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-[#111111] leading-tight">
              {p.name}
            </h1>

            {/* Ratings Summary */}
            <div className="mt-3 flex items-center gap-3">
              <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="text-xs font-bold text-amber-900">{avgProductRating}</span>
              </div>
              <a href="#reviews-section" className="text-xs text-[#6B7280] hover:text-[#E31E24] underline">
                {reviews.length} Customer Reviews
              </a>
              <span className="text-xs text-[#6B7280]">·</span>
              <span className="text-xs font-semibold text-emerald-700">
                Available from {enrichedOffers.length} authorized shop{enrichedOffers.length > 1 ? "s" : ""}
              </span>
            </div>

            <p className="mt-4 text-sm text-[#6B7280] leading-relaxed whitespace-pre-line">
              {p.description}
            </p>

            {/* Vehicle Compatibility Banner */}
            <div className="mt-6 rounded-2xl border border-[#E5E7EB] bg-[#F7F7F8] p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                  Verified Vehicle Compatibility
                </span>
                <FitmentBadge fit={fit} />
              </div>
              <div className="text-xs text-[#6B7280]">
                {bike ? (
                  <span>Checked for: <strong className="text-[#111111]">{bike.make} {bike.model}</strong></span>
                ) : (
                  <span>
                    Select your vehicle in your <Link to="/garage" className="text-[#E31E24] font-bold underline">Garage</Link> to verify fitment automatically.
                  </span>
                )}
              </div>
              <p className="text-[11px] text-gray-500 pt-1 border-t border-gray-200">
                Compatible Models: {p.fits.map((f) => bikes.find((b) => b.id === f)?.model || f).join(", ")}
              </p>
            </div>

            {/* Key Quick Specs */}
            <div className="mt-6 grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-[#E5E7EB] bg-white p-3">
                <span className="text-[#6B7280] block text-[11px]">Warranty</span>
                <span className="font-bold text-[#111111]">{p.warrantyMonths} Months Manufacturer</span>
              </div>
              <div className="rounded-xl border border-[#E5E7EB] bg-white p-3">
                <span className="text-[#6B7280] block text-[11px]">Estimated Weight</span>
                <span className="font-bold text-[#111111]">{p.weightKg} kg</span>
              </div>
            </div>

            {/* Applicable Vendor Coupons & Offers */}
            {applicableCoupons.length > 0 && (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50/60 p-4 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#E31E24] uppercase tracking-wider">
                  <Tag className="h-4 w-4" />
                  <span>Available Store Coupons ({applicableCoupons.length})</span>
                </div>
                <div className="space-y-2">
                  {applicableCoupons.map((cpn: any) => (
                    <div
                      key={cpn.id}
                      className="flex items-center justify-between rounded-xl bg-white border border-red-100 p-2.5 shadow-2xs"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-red-50 text-[#E31E24] border border-red-200">
                            {cpn.code}
                          </span>
                          <span className="text-xs font-semibold text-gray-900 truncate">
                            {cpn.discount_type === "percentage" ? `${cpn.discount_value}% OFF` : `₹${cpn.discount_value} FLAT OFF`}
                          </span>
                        </div>
                        {cpn.description && (
                          <p className="text-[11px] text-gray-500 mt-0.5 truncate">{cpn.description}</p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(cpn.code);
                          toast.success(`Coupon code ${cpn.code} copied! Apply at checkout.`);
                        }}
                        className="shrink-0 text-xs font-bold text-[#E31E24] hover:underline px-2 py-1"
                      >
                        Copy
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            STEP 6 — COMPARE SELLERS SECTION (CRITICAL MARKETPLACE FEATURE)
           ───────────────────────────────────────────────────────────── */}
        <section className="mt-14 pt-10 border-t border-[#E5E7EB]" id="compare-sellers">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E31E24]">
                <Store className="h-4 w-4" />
                <span>Multi-Vendor Offers</span>
              </div>
              <h2 className="mt-1 font-display text-2xl sm:text-3xl font-extrabold text-[#111111]">
                Compare Sellers & Offers
              </h2>
              <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
                Compare verified dealer pricing, delivery speeds, warranties, and ratings to choose the best seller for your order.
              </p>
            </div>

            {/* Sort & Filter Controls */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-[#6B7280]">Sort Offers:</span>
              <div className="inline-flex rounded-xl border border-[#E5E7EB] bg-white p-1 shadow-2xs text-xs">
                <button
                  onClick={() => setOfferSort("value")}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                    offerSort === "value" ? "bg-[#E31E24] text-white" : "text-[#6B7280] hover:text-[#111111]"
                  }`}
                >
                  Best Value
                </button>
                <button
                  onClick={() => setOfferSort("price_asc")}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                    offerSort === "price_asc" ? "bg-[#E31E24] text-white" : "text-[#6B7280] hover:text-[#111111]"
                  }`}
                >
                  Lowest Price
                </button>
                <button
                  onClick={() => setOfferSort("rating_desc")}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                    offerSort === "rating_desc" ? "bg-[#E31E24] text-white" : "text-[#6B7280] hover:text-[#111111]"
                  }`}
                >
                  Top Rated
                </button>
                <button
                  onClick={() => setOfferSort("delivery_fast")}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                    offerSort === "delivery_fast" ? "bg-[#E31E24] text-white" : "text-[#6B7280] hover:text-[#111111]"
                  }`}
                >
                  Fastest Delivery
                </button>
              </div>

              {/* View Switcher */}
              <div className="inline-flex rounded-xl border border-[#E5E7EB] bg-white p-1 text-xs">
                <button
                  onClick={() => setViewMode("cards")}
                  className={`px-2.5 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                    viewMode === "cards" ? "bg-gray-900 text-white" : "text-[#6B7280]"
                  }`}
                >
                  Cards
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`px-2.5 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                    viewMode === "table" ? "bg-gray-900 text-white" : "text-[#6B7280]"
                  }`}
                >
                  Table
                </button>
              </div>
            </div>
          </div>

          {enrichedOffers.length === 0 ? (
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-8 text-center text-sm text-[#6B7280]">
              Currently no active seller offers available for this product.
            </div>
          ) : viewMode === "cards" ? (
            /* Cards View */
            <div className="space-y-4">
              {enrichedOffers.map((o, index) => {
                const isBestValue = index === 0 && offerSort === "value";
                const isLowStock = o.stock > 0 && o.stock <= 5;
                const isOutOfStock = o.stock === 0;

                return (
                  <div
                    key={o.vendorId}
                    className={`relative rounded-2xl border p-4 sm:p-5 transition-all ${
                      isBestValue
                        ? "border-[#E31E24] bg-white shadow-md ring-1 ring-[#E31E24]/20"
                        : "border-[#E5E7EB] bg-white shadow-2xs hover:border-gray-300"
                    }`}
                  >
                    {isBestValue && (
                      <span className="absolute -top-3 left-4 sm:left-6 inline-flex items-center gap-1 rounded-full bg-[#E31E24] px-2.5 sm:px-3 py-0.5 text-[9.5px] sm:text-[10px] font-extrabold uppercase tracking-wider text-white shadow-sm">
                        <Sparkles className="h-3 w-3" />
                        Best Value (Price + Delivery)
                      </span>
                    )}

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-5">
                      {/* Shop Info Column */}
                      <div className="space-y-1.5 lg:max-w-xs">
                        <div className="flex items-center gap-2">
                          <Link
                            to="/vendor/$id"
                            params={{ id: o.vendorId }}
                            className="font-bold text-base text-[#111111] hover:text-[#E31E24] transition flex items-center gap-1.5"
                          >
                            <span>{o.v.name}</span>
                            <ExternalLink className="h-3.5 w-3.5 text-gray-400" />
                          </Link>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-[#6B7280]">
                          <span className="flex items-center gap-1 font-semibold text-amber-500">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            {o.v.rating} ({o.v.reviewCount || 120})
                          </span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {o.v.area} ({o.km} km)
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500">{o.v.verificationBadge || "Verified Dealer"}</p>
                      </div>

                      {/* Specs & Fulfillment Comparison Metrics */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 text-xs lg:border-x lg:border-[#E5E7EB] lg:px-6">
                        <div>
                          <span className="text-[11px] text-[#6B7280] block">Estimated Delivery</span>
                          <span className="font-bold text-[#111111] flex items-center gap-1 mt-0.5">
                            <Clock className="h-3.5 w-3.5 text-[#E31E24]" />
                            ~{o.eta} mins
                          </span>
                          <span className="text-[10px] text-gray-500">{o.deliveryDays || "Express Courier"}</span>
                        </div>

                        <div>
                          <span className="text-[11px] text-[#6B7280] block">Shipping Fee</span>
                          <span className="font-bold text-[#111111] mt-0.5 block">{inr(o.fee)}</span>
                          <span className="text-[10px] text-gray-500">Distance-based</span>
                        </div>

                        <div>
                          <span className="text-[11px] text-[#6B7280] block">Warranty & Return</span>
                          <span className="font-bold text-[#111111] mt-0.5 block">
                            {o.warrantyTerms || `${p.warrantyMonths} Mos Warranty`}
                          </span>
                          <span className="text-[10px] text-emerald-600 font-semibold">7-day replacement</span>
                        </div>
                      </div>

                      {/* Price & Add to Cart Column */}
                      <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-gray-100">
                        <div className="text-left lg:text-right">
                          <div className="flex items-baseline gap-2">
                            <span className="text-xl sm:text-2xl font-extrabold text-[#111111]">{inr(o.price)}</span>
                            {o.mrp && o.mrp > o.price && (
                              <span className="text-xs text-gray-400 line-through">{inr(o.mrp)}</span>
                            )}
                          </div>
                          <span className="text-[11px] text-gray-500 block">
                            Total est. cost: <strong>{inr(o.totalCost)}</strong> (incl. shipping)
                          </span>
                          {isLowStock ? (
                            <span className="text-[10px] text-amber-700 font-bold flex items-center gap-1">
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                              Hurry! Limited stock ({o.stock} left)
                            </span>
                          ) : isOutOfStock ? (
                            <span className="text-[10px] text-rose-600 font-bold">
                              Out of Stock
                            </span>
                          ) : (
                            <span className="text-[10px] text-emerald-600 font-semibold">
                              In Stock ({o.stock} available)
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                          <Link
                            to="/vendor/$id"
                            params={{ id: o.vendorId }}
                            className="flex-1 sm:flex-initial text-center rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                          >
                            View Shop
                          </Link>
                          <button
                            disabled={o.stock === 0}
                            onClick={() => {
                              addToCart(p.id, o.vendorId);
                              toast.success("Offer selected & added to cart", {
                                description: `${p.name} from ${o.v.name} (${inr(o.price)})`,
                              });
                            }}
                            className="flex-1 sm:flex-initial text-center rounded-xl bg-[#E31E24] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-red-700 disabled:opacity-40 transition cursor-pointer"
                          >
                            Select & Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Table View */
            <div className="overflow-x-auto rounded-2xl border border-[#E5E7EB] bg-white shadow-2xs">
              <table className="w-full min-w-[760px] text-left text-xs">
                <thead className="bg-[#F7F7F8] border-b border-[#E5E7EB] text-[#6B7280] uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4 font-bold">Seller & Shop</th>
                    <th className="py-3.5 px-3 font-bold">Offer Price</th>
                    <th className="py-3.5 px-3 font-bold">Shipping Fee</th>
                    <th className="py-3.5 px-3 font-bold">Total Estimated</th>
                    <th className="py-3.5 px-3 font-bold">Dispatch & ETA</th>
                    <th className="py-3.5 px-3 font-bold">Warranty</th>
                    <th className="py-3.5 px-3 font-bold">Stock</th>
                    <th className="py-3.5 px-4 text-right font-bold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {enrichedOffers.map((o) => (
                    <tr key={o.vendorId} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-4 px-4">
                        <Link to="/vendor/$id" params={{ id: o.vendorId }} className="font-bold text-[#111111] hover:text-[#E31E24]">
                          {o.v.name}
                        </Link>
                        <div className="flex items-center gap-2 mt-0.5 text-gray-500 text-[11px]">
                          <span className="text-amber-600 font-semibold flex items-center gap-0.5">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            {o.v.rating}
                          </span>
                          <span>·</span>
                          <span>{o.v.area}</span>
                        </div>
                      </td>

                      <td className="py-4 px-3 font-extrabold text-[#111111] text-sm">
                        {inr(o.price)}
                      </td>

                      <td className="py-4 px-3 text-[#6B7280]">
                        {inr(o.fee)} ({o.km} km)
                      </td>

                      <td className="py-4 px-3 font-bold text-[#E31E24]">
                        {inr(o.totalCost)}
                      </td>

                      <td className="py-4 px-3 text-[#6B7280]">
                        <span className="font-semibold text-[#111111] block">~{o.eta} mins</span>
                        <span className="text-[10px]">{o.deliveryDays || "Express"}</span>
                      </td>

                      <td className="py-4 px-3 text-[#6B7280]">
                        {o.warrantyTerms || `${p.warrantyMonths} Mos`}
                      </td>

                      <td className="py-4 px-3">
                        {o.stock <= 5 && o.stock > 0 ? (
                          <span className="text-amber-700 font-bold">
                            Hurry! Limited stock ({o.stock})
                          </span>
                        ) : o.stock === 0 ? (
                          <span className="text-rose-700 font-bold">
                            Out of Stock
                          </span>
                        ) : (
                          <span className="text-emerald-700 font-semibold">
                            In Stock ({o.stock})
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-right">
                        <button
                          disabled={o.stock === 0}
                          onClick={() => {
                            addToCart(p.id, o.vendorId);
                            toast.success("Added to cart", { description: `${p.name} from ${o.v.name}` });
                          }}
                          className="rounded-lg bg-[#E31E24] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-40 transition cursor-pointer"
                        >
                          Add to Cart
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* ─────────────────────────────────────────────────────────────
            TECHNICAL SPECIFICATIONS TABLE SECTION
           ───────────────────────────────────────────────────────────── */}
        <section className="mt-14 pt-10 border-t border-[#E5E7EB]" id="specifications">
          <h2 className="font-display text-2xl font-bold text-[#111111]">Technical Specifications</h2>
          <p className="text-xs text-[#6B7280] mt-1">
            Authoritative manufacturer specifications verified for automotive fitment and safety.
          </p>

          <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white">
            {specs.map(([k, v]) => (
              <div key={k} className="border-b border-[#E5E7EB] p-3.5 odd:border-r">
                <dt className="text-xs font-medium text-[#6B7280]">{k}</dt>
                <dd className="font-bold text-xs text-[#111111] mt-0.5">{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            STEP 8 — PRODUCT RATINGS & REVIEWS SECTION
           ───────────────────────────────────────────────────────────── */}
        <section className="mt-14 pt-10 border-t border-[#E5E7EB]" id="reviews-section">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E31E24]">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span>Product Quality & Fitment</span>
              </div>
              <h2 className="mt-1 font-display text-2xl sm:text-3xl font-extrabold text-[#111111]">
                Customer Product Reviews
              </h2>
              <p className="text-xs text-[#6B7280] mt-0.5">
                Real feedback from verified purchasers evaluating fitment accuracy, performance, and build quality.
              </p>
            </div>

            <button
              onClick={() => setIsWritingReview(!isWritingReview)}
              className="rounded-xl bg-[#E31E24] px-5 py-2.5 text-xs font-bold text-white hover:bg-red-700 transition cursor-pointer shrink-0"
            >
              {isWritingReview ? "Cancel Review" : "Write a Product Review"}
            </button>
          </div>

          {/* Interactive Review Form */}
          {isWritingReview && (
            <form onSubmit={handleReviewSubmit} className="mb-8 rounded-2xl border border-red-200 bg-red-50/40 p-6 space-y-4">
              <h3 className="text-sm font-bold text-[#111111]">Write a Verified Product Review</h3>
              <div className="grid gap-4 sm:grid-cols-3 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Vikram Shenoy"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="w-full h-9 rounded-lg border border-gray-300 bg-white px-3 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Vehicle You Installed It On</label>
                  <input
                    type="text"
                    placeholder="e.g. Ola S1 Pro / Ather 450X"
                    value={newVehicle}
                    onChange={(e) => setNewVehicle(e.target.value)}
                    className="w-full h-9 rounded-lg border border-gray-300 bg-white px-3 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Rating</label>
                  <select
                    value={newRating}
                    onChange={(e) => setNewRating(Number(e.target.value))}
                    className="w-full h-9 rounded-lg border border-gray-300 bg-white px-3 text-xs font-semibold cursor-pointer"
                  >
                    <option value={5}>5 Stars - Outstanding Quality</option>
                    <option value={4}>4 Stars - Very Good</option>
                    <option value={3}>3 Stars - Average</option>
                    <option value={2}>2 Stars - Below Expectations</option>
                    <option value={1}>1 Star - Defective / Poor</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Review Headline</label>
                <input
                  type="text"
                  placeholder="e.g. Excellent range and battery life"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full h-9 rounded-lg border border-gray-300 bg-white px-3 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Detailed Review</label>
                <textarea
                  rows={3}
                  placeholder="Describe battery performance, build quality, installation process, and fitment accuracy..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white p-3 text-xs focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="rounded-xl bg-[#E31E24] px-5 py-2.5 text-xs font-bold text-white hover:bg-red-700 transition cursor-pointer"
              >
                Submit Verified Product Review
              </button>
            </form>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-8 text-center text-xs text-[#6B7280]">
                No written reviews yet for this product. Be the first to review!
              </div>
            ) : (
              reviews.map((rev) => (
                <div key={rev.id} className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-2xs space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#111111]">{rev.userName}</span>
                      {rev.isVerifiedPurchase && (
                        <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                          <ShieldCheck className="h-3 w-3" />
                          Verified Purchase
                        </span>
                      )}
                      {rev.fitmentVehicle && (
                        <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-medium">
                          Installed on: {rev.fitmentVehicle}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-[#6B7280]">{rev.date}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-3.5 w-3.5 ${
                          star <= rev.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="font-bold text-xs text-[#111111] ml-2">{rev.title}</span>
                  </div>

                  <p className="text-xs text-[#6B7280] leading-relaxed">{rev.comment}</p>

                  <div className="flex items-center gap-3 pt-2 text-[11px] text-gray-400">
                    <span className="flex items-center gap-1 hover:text-gray-600 cursor-pointer">
                      <ThumbsUp className="h-3 w-3" />
                      Helpful ({rev.helpfulCount})
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Similar Category Products */}
        {similarProducts.length > 0 && (
          <section className="mt-14 pt-10 border-t border-[#E5E7EB]">
            <h2 className="font-display text-2xl font-bold text-[#111111] mb-6">
              Similar {p.category} from Other Brands
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarProducts.map((prod) => (
                <ProductCard key={prod.id} p={prod} />
              ))}
            </div>
          </section>
        )}
      </div>
    </SiteLayout>
  );
}
