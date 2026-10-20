import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Clock,
  MapPin,
  ShieldCheck,
  Star,
  Truck,
  Loader2,
  Store,
  RotateCcw,
  Sparkles,
  ThumbsUp,
  Tag,
  ChevronRight,
  ExternalLink,
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  X,
  Check,
  Wrench,
  AlertCircle,
  Share2,
  CheckCircle2,
  Info,
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
  getVendor,
  inr,
  mapDbProductToProduct,
  registerDynamicProduct,
  type Product,
} from "@/lib/data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/product/$id")({
  head: () => ({
    meta: [
      { title: "Product Details & Multi-Vendor Comparison — RiderzPro" },
      {
        name: "description",
        content:
          "Verified automotive specifications, genuine dealer offers, real-time GST pricing, and customer ratings on RiderzPro.",
      },
    ],
  }),
  component: ProductPage,
});

type OfferSortOption = "value" | "price_asc" | "rating_desc" | "delivery_fast";

interface DbSeller {
  id: string;
  store_name: string;
  owner_name: string;
  city?: string;
  rating?: number | string;
  review_count?: number;
  status?: string;
  business_address?: string;
}

interface DbOffer {
  id: string;
  vendorId: string;
  sellerName: string;
  storeName: string;
  ownerName: string;
  city: string;
  rating: number;
  reviewCount: number;
  price: number;
  mrp: number;
  stock: number;
  warrantyTerms: string;
  shippingCharge: number;
  deliveryDays: string;
  dispatchHours: number;
}

interface DbReview {
  id: string;
  productId: string;
  userId?: string;
  userName: string;
  userCity?: string;
  rating: number;
  title: string;
  comment: string;
  fitmentVehicle?: string;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  date: string;
  createdAt?: string;
}

interface RatingDistribution {
  count: number;
  percentage: number;
}

interface DbProductResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  mrp?: number;
  stock: number;
  image_url?: string;
  brand?: string;
  sku?: string;
  category_name?: string;
  category_id?: string;
  department?: string;
  material?: string;
  fitment_type?: string;
  fitment_size?: string;
  compatible_vehicles?: string[];
  color_options?: string[];
  key_features?: string;
  warranty?: string;
  weight_kg?: number;
  gst_percent?: number | string;
  installation_price?: number | string;
  installation_time?: string;
  delivery_time?: string;
  availability?: string;
  seller?: DbSeller | null;
  offers: DbOffer[];
  reviews: DbReview[];
  stats: {
    average_rating: number;
    review_count: number;
    rating_distribution: Record<number, RatingDistribution>;
  };
  similar_products: any[];
}

function ProductPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { activeBikeId, addToCart, isSaved, toggleSaved, userLocation } = useStore();

  const [dbData, setDbData] = useState<DbProductResponse | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Offers Sorting & View
  const [offerSort, setOfferSort] = useState<OfferSortOption>("value");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);

  // Product Reviews & Form State
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [votedHelpful, setVotedHelpful] = useState<Record<string, boolean>>({});
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState("");
  const [newComment, setNewComment] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [newUserCity, setNewUserCity] = useState("Bengaluru");
  const [newVehicle, setNewVehicle] = useState("");

  // Coupons & Cart State
  const [applicableCoupons, setApplicableCoupons] = useState<any[]>([]);
  const [selectedCouponModal, setSelectedCouponModal] = useState<any | null>(null);
  const [buyQty, setBuyQty] = useState(1);

  // Fetch complete product data from database API
  useEffect(() => {
    let isCancelled = false;
    setLoading(true);
    setError(false);

    fetch(`/api/products/${encodeURIComponent(id)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Product fetch failed");
        return res.json();
      })
      .then((res) => {
        if (isCancelled) return;
        if (res.success && res.data) {
          const raw = res.data as DbProductResponse;
          setDbData(raw);

          // Map and register into dynamic catalog for universal cart and checkout awareness
          const mapped = mapDbProductToProduct(raw);
          setProduct(mapped);
          registerDynamicProduct(mapped);

          // Default selected offer to lowest priced or first offer
          if (raw.offers && raw.offers.length > 0) {
            setSelectedOfferId(raw.offers[0].id);
          }
        } else {
          setError(true);
        }
      })
      .catch((err) => {
        console.error("Error loading product detail:", err);
        if (!isCancelled) setError(true);
      })
      .finally(() => {
        if (!isCancelled) setLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [id]);

  // Fetch real applicable store coupons
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
  const activeBike = activeBikeId ? getBike(activeBikeId) : null;

  // Process & dynamically sort seller offers from database
  const enrichedOffers = useMemo(() => {
    if (!dbData || !dbData.offers) return [];

    const list = dbData.offers.map((o) => {
      // Calculate realistic distance and fee based on customer location
      const vendorRef = getVendor(o.vendorId);
      const userCoords =
        userLocation?.lat && userLocation?.lng
          ? { lat: userLocation.lat, lng: userLocation.lng }
          : userLocation?.latitude && userLocation?.longitude
          ? { lat: Number(userLocation.latitude), lng: Number(userLocation.longitude) }
          : CUSTOMER_LOCATION;
      const km = Math.round(distanceKm(vendorRef, userCoords) * 10) / 10;
      const fee = o.shippingCharge ?? deliveryFee(km);
      const totalCost = o.price + fee;
      const eta = etaMinutes(km, o.dispatchHours ? Math.round(o.dispatchHours * 2.5) : 15);

      return {
        ...o,
        km,
        fee,
        eta,
        totalCost,
        storeName: o.storeName || o.sellerName || "Authorized Dealer",
        rating: Number(o.rating) || 0,
        reviewCount: Number(o.reviewCount) || 0,
      };
    });

    if (offerSort === "value") {
      list.sort((a, b) => a.totalCost - b.totalCost);
    } else if (offerSort === "price_asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (offerSort === "rating_desc") {
      list.sort((a, b) => b.rating - a.rating);
    } else if (offerSort === "delivery_fast") {
      list.sort((a, b) => a.dispatchHours - b.dispatchHours);
    }

    return list;
  }, [dbData, offerSort, userLocation]);

  // Selected Offer (or top sorted offer)
  const activeOffer = useMemo(() => {
    if (enrichedOffers.length === 0) return null;
    if (selectedOfferId) {
      const match = enrichedOffers.find((o) => o.id === selectedOfferId);
      if (match) return match;
    }
    return enrichedOffers[0];
  }, [enrichedOffers, selectedOfferId]);

  // Real Similar Products from database
  const similarProducts = useMemo(() => {
    if (!dbData || !dbData.similar_products) return [];
    return dbData.similar_products.map((row) => mapDbProductToProduct(row));
  }, [dbData]);

  // Handle Review Submission to PostgreSQL API
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !newUserName.trim() || !newTitle.trim()) {
      toast.error("Please enter your name, review headline, and detailed review feedback.");
      return;
    }

    setIsSubmittingReview(true);
    try {
      const res = await fetch(`/api/products/${encodeURIComponent(id)}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: newRating,
          title: newTitle.trim(),
          comment: newComment.trim(),
          userName: newUserName.trim(),
          userCity: newUserCity.trim() || "Bengaluru",
          fitmentVehicle: newVehicle.trim() || (activeBike ? `${activeBike.make} ${activeBike.model}` : "Verified EV"),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Thank you! Your verified product review has been submitted and published.");

        // Update local review list and recalculated stats
        if (dbData) {
          const updatedReviews = [data.review, ...dbData.reviews];
          const newTotal = updatedReviews.length;
          const newAvg = Number(data.stats?.average_rating) ||
            Math.round((updatedReviews.reduce((sum, r) => sum + r.rating, 0) / newTotal) * 10) / 10;

          // Recompute distribution
          const dist: Record<number, RatingDistribution> = {
            5: { count: 0, percentage: 0 },
            4: { count: 0, percentage: 0 },
            3: { count: 0, percentage: 0 },
            2: { count: 0, percentage: 0 },
            1: { count: 0, percentage: 0 },
          };
          for (const rev of updatedReviews) {
            const rounded = Math.min(5, Math.max(1, Math.round(rev.rating)));
            if (dist[rounded]) dist[rounded].count++;
          }
          for (let i = 1; i <= 5; i++) {
            dist[i].percentage = Math.round((dist[i].count / newTotal) * 100);
          }

          setDbData({
            ...dbData,
            reviews: updatedReviews,
            stats: {
              average_rating: newAvg,
              review_count: newTotal,
              rating_distribution: dist,
            },
          });
        }

        setNewTitle("");
        setNewComment("");
        setNewUserName("");
        setNewVehicle("");
        setIsWritingReview(false);
      } else {
        toast.error(data.error || "Failed to submit review. Please try again.");
      }
    } catch (err) {
      console.error("Failed to post review:", err);
      toast.error("Network error while submitting review.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Upvote helpful review in PostgreSQL
  const handleHelpfulClick = async (reviewId: string) => {
    if (votedHelpful[reviewId]) {
      toast.info("You have already voted this review as helpful.");
      return;
    }

    try {
      const res = await fetch(`/api/products/${encodeURIComponent(id)}/reviews/${reviewId}/helpful`, {
        method: "POST",
      });
      if (res.ok) {
        setVotedHelpful((prev) => ({ ...prev, [reviewId]: true }));
        if (dbData) {
          const updated = dbData.reviews.map((r) =>
            r.id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r
          );
          setDbData({ ...dbData, reviews: updated });
        }
        toast.success("Thank you for your feedback!");
      }
    } catch {
      toast.error("Could not register helpful vote.");
    }
  };

  if (loading) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-7xl px-4 py-28 text-center">
          <Loader2 className="h-10 w-10 animate-spin text-[#E31E24] mx-auto mb-4" />
          <h2 className="text-base font-bold text-gray-900">Loading Genuine Product Details...</h2>
          <p className="text-xs text-gray-500 mt-1">
            Fetching verified database specifications, seller comparison offers, and live inventory.
          </p>
        </div>
      </SiteLayout>
    );
  }

  if (error || !dbData || !p) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-7xl px-4 py-24 text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-red-50 flex items-center justify-center text-[#E31E24] mb-4">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Product Not Found</h1>
          <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
            The product SKU or ID <strong className="font-mono text-gray-800">{id}</strong> does not exist in the active
            verified catalog.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              to="/shop"
              className="rounded-xl bg-[#E31E24] px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-red-700 transition cursor-pointer"
            >
              Browse Spare Parts Catalog
            </Link>
          </div>
        </div>
      </SiteLayout>
    );
  }

  // Statutory GST calculation: Consumer retail prices are inclusive of GST
  const gstRate = Number(dbData.gst_percent) || 18;
  const currentPrice = activeOffer ? activeOffer.price : Number(dbData.price) || 0;
  const currentMrp = activeOffer?.mrp || Number(dbData.mrp) || Math.round(currentPrice * 1.15);
  const discountPercent =
    currentMrp > currentPrice ? Math.round(((currentMrp - currentPrice) / currentMrp) * 100) : 0;
  const basePrice = Math.round(currentPrice / (1 + gstRate / 100));
  const gstAmount = currentPrice - basePrice;

  // Genuine dynamic specifications derived from PostgreSQL product record
  const specs = [
    ["Brand", dbData.brand || "Riderzpro Certified"],
    ["SKU / Model", dbData.sku || dbData.id],
    ["Category / Department", dbData.department || dbData.category_name || "EV Spare Parts"],
    ["Material / Construction", dbData.material || "Aviation-Grade Engineered Alloy"],
    ["Fitment Type", dbData.fitment_type ? dbData.fitment_type.toUpperCase() : "VEHICLE SPECIFIC"],
    ["Fitment Size / Standard", dbData.fitment_size || "Standard OEM Direct Fit"],
    ["Base Manufacturer Warranty", dbData.warranty || "12 Months Full Replacement"],
    ["Total Net Weight", dbData.weight_kg ? `${dbData.weight_kg} kg` : "Standard Part Weight"],
    ["Statutory GST Rate", `${gstRate}% Statutory Tax Included`],
    ["Doorstep Installation", dbData.installation_price ? `${inr(Number(dbData.installation_price))} (${dbData.installation_time || "Doorstep Fitting"})` : "Self / Workshop Fitment"],
    ["Stock Status", (activeOffer ? activeOffer.stock : dbData.stock) > 0 ? "In Stock" : "Out of Stock"],
  ];

  const totalReviewsCount = dbData.stats?.review_count ?? dbData.reviews?.length ?? 0;
  const averageRatingNum = dbData.stats?.average_rating ?? 0;
  const distribution = dbData.stats?.rating_distribution || {
    5: { count: 0, percentage: 0 },
    4: { count: 0, percentage: 0 },
    3: { count: 0, percentage: 0 },
    2: { count: 0, percentage: 0 },
    1: { count: 0, percentage: 0 },
  };

  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#6B7280] mb-6 flex-wrap">
          <Link to="/" className="hover:text-[#111111] transition">Home</Link>
          <ChevronRight className="h-3 w-3 text-gray-400" />
          <Link to="/shop" className="hover:text-[#111111] transition">Catalog</Link>
          <ChevronRight className="h-3 w-3 text-gray-400" />
          <Link
            to="/shop"
            search={{ cat: dbData.category_name || "All" } as any}
            className="hover:text-[#111111] transition"
          >
            {dbData.category_name || "Auto Parts"}
          </Link>
          <ChevronRight className="h-3 w-3 text-gray-400" />
          <span className="text-[#111111] font-bold truncate max-w-[200px] sm:max-w-md">
            {dbData.name}
          </span>
        </nav>

        {/* ─────────────────────────────────────────────────────────────
            MAIN PRODUCT HERO SECTION: MEDIA GALLERY + ORDER DESK
           ───────────────────────────────────────────────────────────── */}
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Media Column */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-2xs group">
              <button
                type="button"
                onClick={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const ok = await toggleSaved(p.id, p);
                  if (ok) {
                    toast.success(saved ? "Removed from wishlist" : "Saved to your RiderzPro wishlist");
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
                src={dbData.image_url || "/src/assets/parts.jpg"}
                alt={dbData.name}
                width={800}
                height={800}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/src/assets/parts.jpg";
                }}
                className="aspect-square w-full object-contain rounded-2xl transition duration-500 group-hover:scale-[1.02]"
              />
            </div>

            {/* Quality & Fulfillment Badges */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs text-[#6B7280] pt-1">
              <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-gray-50 border border-gray-100">
                <ShieldCheck className="h-4 w-4 text-[#E31E24]" />
                <span className="font-semibold text-[11px] text-[#111111]">100% Genuine</span>
                <span className="text-[10px] text-gray-500">Verified OEM</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-gray-50 border border-gray-100">
                <RotateCcw className="h-4 w-4 text-[#E31E24]" />
                <span className="font-semibold text-[11px] text-[#111111]">7-Day Return</span>
                <span className="text-[10px] text-gray-500">Fitment Guarantee</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-gray-50 border border-gray-100">
                <Truck className="h-4 w-4 text-[#E31E24]" />
                <span className="font-semibold text-[11px] text-[#111111]">Express Courier</span>
                <span className="text-[10px] text-gray-500">Tracked Doorstep</span>
              </div>
            </div>
          </div>

          {/* Details & Action Column */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Category, Brand, & SKU */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="rounded-full bg-red-50 text-[#E31E24] px-3 py-1 text-xs font-bold uppercase tracking-wider border border-red-100">
                  {dbData.category_name || dbData.department || "Auto Parts"}
                </span>
                <span className="text-xs font-semibold text-[#6B7280]">·</span>
                <span className="text-xs font-bold text-gray-800">{dbData.brand || "Riderzpro Certified"}</span>
                {dbData.sku && (
                  <>
                    <span className="text-xs font-semibold text-[#6B7280]">·</span>
                    <span className="text-[11px] font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      SKU: {dbData.sku}
                    </span>
                  </>
                )}
              </div>

              {/* Product Headline */}
              <h1 className="mt-2.5 font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#111111] leading-tight">
                {dbData.name}
              </h1>

              {/* Ratings Summary (Calculated from actual PostgreSQL reviews) */}
              <div className="mt-3.5 flex items-center gap-3 flex-wrap">
                {totalReviewsCount > 0 ? (
                  <div className="flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-extrabold text-amber-950">
                      {averageRatingNum.toFixed(1)}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 bg-gray-100 px-2.5 py-1 rounded-lg border border-gray-200">
                    <span className="text-xs font-semibold text-gray-600">New Item</span>
                  </div>
                )}

                <a
                  href="#reviews-section"
                  className="text-xs text-[#6B7280] hover:text-[#E31E24] underline transition font-medium"
                >
                  {totalReviewsCount > 0
                    ? `${totalReviewsCount} Customer Review${totalReviewsCount > 1 ? "s" : ""}`
                    : "No reviews yet — be the first to review"}
                </a>

                <span className="text-xs text-[#6B7280]">·</span>

                <a
                  href="#compare-sellers"
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 underline"
                >
                  {enrichedOffers.length > 0
                    ? `Compare ${enrichedOffers.length} seller offer${enrichedOffers.length > 1 ? "s" : ""}`
                    : "Official direct listing"}
                </a>
              </div>

              {/* Price, MRP, & Statutory GST Breakdown */}
              <div className="mt-5 pt-4 border-t border-[#E5E7EB]">
                <div className="flex items-baseline gap-3 flex-wrap">
                  {discountPercent > 0 && (
                    <span className="text-sm font-extrabold text-emerald-600 flex items-center bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      ↓ {discountPercent}% OFF
                    </span>
                  )}
                  {currentMrp > currentPrice && (
                    <span className="text-base text-gray-400 line-through font-medium">
                      {inr(currentMrp)}
                    </span>
                  )}
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#111111]">
                    {inr(currentPrice)}
                  </span>
                </div>

                {/* Statutory GST Breakdown Card */}
                <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50/70 p-3 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 flex items-center gap-1">
                      <Info className="h-3.5 w-3.5 text-gray-400" />
                      Base Price (Excl. Tax):
                    </span>
                    <span className="font-semibold text-gray-800">{inr(basePrice)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">
                      Applicable GST ({gstRate}% IGST/CGST):
                    </span>
                    <span className="font-semibold text-gray-800">+{inr(gstAmount)}</span>
                  </div>
                  <div className="pt-1 border-t border-gray-200 flex items-center justify-between text-[11px] text-gray-500 font-medium">
                    <span>Tax Invoice Generated on Dispatch</span>
                    <span className="text-emerald-700 font-bold">Inclusive of all statutory taxes</span>
                  </div>
                </div>

                {/* Available Coupons Strip */}
                {applicableCoupons.length > 0 && (
                  <div className="mt-4 rounded-xl border border-red-200 bg-red-50/50 p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-[#E31E24]">
                        <Tag className="h-3.5 w-3.5" />
                        <span>Special Vendor Promotions Available</span>
                      </div>
                      <span className="text-[11px] font-semibold text-gray-500">
                        {applicableCoupons.length} offer{applicableCoupons.length > 1 ? "s" : ""}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 text-xs">
                      <div className="truncate">
                        <span className="font-mono font-bold text-gray-900 bg-white px-1.5 py-0.5 rounded border border-red-200 mr-2">
                          {applicableCoupons[0].code}
                        </span>
                        <span className="text-gray-700">
                          {applicableCoupons[0].discount_type === "percentage"
                            ? `${applicableCoupons[0].discount_value}% OFF`
                            : `₹${applicableCoupons[0].discount_value} OFF`}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedCouponModal(applicableCoupons[0])}
                        className="text-xs font-bold text-[#E31E24] hover:underline cursor-pointer shrink-0"
                      >
                        View terms
                      </button>
                    </div>
                  </div>
                )}

                {/* Quick Add To Cart / Purchase Action Desk */}
                <div className="mt-5 space-y-3">
                  {/* Stock Status Notification */}
                  <div className="flex items-center justify-between text-xs">
                    {activeOffer && activeOffer.stock > 0 ? (
                      activeOffer.stock <= 5 ? (
                        <span className="text-amber-700 font-bold flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
                          Hurry! Only {activeOffer.stock} left in dealer stock
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                          In Stock ({activeOffer.stock} units ready for dispatch)
                        </span>
                      )
                    ) : (
                      <span className="text-rose-600 font-bold flex items-center gap-1">
                        <AlertCircle className="h-3.5 w-3.5" />
                        Currently Out of Stock
                      </span>
                    )}

                    {activeOffer && (
                      <span className="text-gray-500 text-[11px]">
                        Sold by: <strong className="text-gray-800">{activeOffer.storeName}</strong>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-[#E5E7EB] rounded-xl bg-gray-50 p-1">
                      <button
                        type="button"
                        disabled={buyQty <= 1}
                        onClick={() => setBuyQty((q) => Math.max(1, q - 1))}
                        className="h-8 w-8 grid place-items-center rounded-lg hover:bg-gray-200 text-gray-700 disabled:opacity-40 transition cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-gray-900">{buyQty}</span>
                      <button
                        type="button"
                        disabled={Boolean(activeOffer && buyQty >= activeOffer.stock)}
                        onClick={() => setBuyQty((q) => q + 1)}
                        className="h-8 w-8 grid place-items-center rounded-lg hover:bg-gray-200 text-gray-700 disabled:opacity-40 transition cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      disabled={Boolean(activeOffer && activeOffer.stock === 0)}
                      onClick={() => {
                        if (activeOffer) {
                          addToCart(p.id, activeOffer.vendorId, buyQty);
                          toast.success(`Added ${buyQty} unit(s) to cart!`, {
                            description: `${dbData.name} from ${activeOffer.storeName} (${inr(activeOffer.price)})`,
                          });
                        }
                      }}
                      className="flex-1 h-11 rounded-xl bg-[#E31E24] hover:bg-red-700 text-white text-xs font-bold shadow-xs disabled:opacity-40 transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span>+ Add to Cart</span>
                    </button>

                    <button
                      type="button"
                      disabled={Boolean(activeOffer && activeOffer.stock === 0)}
                      onClick={() => {
                        if (activeOffer) {
                          addToCart(p.id, activeOffer.vendorId, buyQty);
                          navigate({ to: "/cart" });
                        }
                      }}
                      className="h-11 px-6 rounded-xl border border-gray-900 bg-gray-900 hover:bg-black text-white text-xs font-bold disabled:opacity-40 transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Buy Now</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Description */}
              <div className="mt-6 pt-4 border-t border-[#E5E7EB]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-2">Description</h3>
                <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed whitespace-pre-line">
                  {dbData.description}
                </p>
              </div>

              {/* Vehicle Compatibility Banner */}
              <div className="mt-6 rounded-2xl border border-[#E5E7EB] bg-[#F7F7F8] p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                    Vehicle Fitment Verification
                  </span>
                  <FitmentBadge fit={fit} />
                </div>
                <div className="text-xs text-[#6B7280]">
                  {activeBike ? (
                    <span>
                      Checking against your Garage vehicle:{" "}
                      <strong className="text-[#111111]">{activeBike.make} {activeBike.model}</strong>
                    </span>
                  ) : (
                    <span>
                      Select your two-wheeler or EV in your{" "}
                      <Link to="/garage" className="text-[#E31E24] font-bold underline">
                        Garage
                      </Link>{" "}
                      to verify compatibility automatically.
                    </span>
                  )}
                </div>
                {dbData.compatible_vehicles && dbData.compatible_vehicles.length > 0 && (
                  <p className="text-[11px] text-gray-500 pt-1.5 border-t border-gray-200">
                    Verified Fitment Models:{" "}
                    <strong className="text-gray-800">{dbData.compatible_vehicles.join(", ")}</strong>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            COMPARE SELLERS & MULTI-VENDOR OFFERS SECTION
           ───────────────────────────────────────────────────────────── */}
        <section className="mt-16 pt-10 border-t border-[#E5E7EB]" id="compare-sellers">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E31E24]">
                <Store className="h-4 w-4" />
                <span>Multi-Vendor Fulfillment</span>
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

              {/* View Switcher: Cards vs Table */}
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
              Currently no active seller offers listed for this item.
            </div>
          ) : viewMode === "cards" ? (
            /* Cards View */
            <div className="space-y-4">
              {enrichedOffers.map((o, index) => {
                const isBestValue = index === 0 && offerSort === "value";
                const isSelected = activeOffer?.id === o.id;
                const isLowStock = o.stock > 0 && o.stock <= 5;
                const isOutOfStock = o.stock === 0;

                return (
                  <div
                    key={o.id}
                    onClick={() => setSelectedOfferId(o.id)}
                    className={`relative rounded-2xl border p-4 sm:p-5 transition-all cursor-pointer ${
                      isSelected
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
                            onClick={(e) => e.stopPropagation()}
                            className="font-bold text-base text-[#111111] hover:text-[#E31E24] transition flex items-center gap-1.5"
                          >
                            <span>{o.storeName}</span>
                            <ExternalLink className="h-3.5 w-3.5 text-gray-400" />
                          </Link>
                          {isSelected && (
                            <span className="rounded bg-red-100 text-[#E31E24] text-[10px] font-bold px-1.5 py-0.5">
                              Active Selection
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-[#6B7280]">
                          <span className="flex items-center gap-1 font-semibold text-amber-600">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            {o.rating.toFixed(1)} ({o.reviewCount} reviews)
                          </span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {o.city} ({o.km} km)
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500">Official Authorized Marketplace Seller</p>
                      </div>

                      {/* Fulfillment & Warranty Metrics */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 text-xs lg:border-x lg:border-[#E5E7EB] lg:px-6">
                        <div>
                          <span className="text-[11px] text-[#6B7280] block">Estimated Delivery</span>
                          <span className="font-bold text-[#111111] flex items-center gap-1 mt-0.5">
                            <Clock className="h-3.5 w-3.5 text-[#E31E24]" />
                            {o.deliveryDays || "~1-2 days"}
                          </span>
                          <span className="text-[10px] text-gray-500">Dispatches in {o.dispatchHours}h</span>
                        </div>

                        <div>
                          <span className="text-[11px] text-[#6B7280] block">Shipping Fee</span>
                          <span className="font-bold text-[#111111] mt-0.5 block">
                            {o.fee === 0 ? "FREE" : inr(o.fee)}
                          </span>
                          <span className="text-[10px] text-gray-500">Standard Insured Courier</span>
                        </div>

                        <div>
                          <span className="text-[11px] text-[#6B7280] block">Warranty & Return</span>
                          <span className="font-bold text-[#111111] mt-0.5 block">
                            {o.warrantyTerms || "1 Year Manufacturer"}
                          </span>
                          <span className="text-[10px] text-emerald-600 font-semibold">7-Day Replacement</span>
                        </div>
                      </div>

                      {/* Price & Add to Cart Column */}
                      <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-gray-100">
                        <div className="text-left lg:text-right">
                          <div className="flex items-baseline gap-2">
                            <span className="text-xl sm:text-2xl font-extrabold text-[#111111]">
                              {inr(o.price)}
                            </span>
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
                              Hurry! Only {o.stock} left
                            </span>
                          ) : isOutOfStock ? (
                            <span className="text-[10px] text-rose-600 font-bold">Out of Stock</span>
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
                            onClick={(e) => e.stopPropagation()}
                            className="flex-1 sm:flex-initial text-center rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                          >
                            View Shop
                          </Link>
                          <button
                            type="button"
                            disabled={o.stock === 0}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedOfferId(o.id);
                              addToCart(p.id, o.vendorId, buyQty);
                              toast.success("Offer selected & added to cart", {
                                description: `${dbData.name} from ${o.storeName} (${inr(o.price)})`,
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
                    <tr
                      key={o.id}
                      onClick={() => setSelectedOfferId(o.id)}
                      className={`hover:bg-gray-50/60 transition-colors cursor-pointer ${
                        activeOffer?.id === o.id ? "bg-red-50/20" : ""
                      }`}
                    >
                      <td className="py-4 px-4">
                        <Link
                          to="/vendor/$id"
                          params={{ id: o.vendorId }}
                          onClick={(e) => e.stopPropagation()}
                          className="font-bold text-[#111111] hover:text-[#E31E24]"
                        >
                          {o.storeName}
                        </Link>
                        <div className="flex items-center gap-2 mt-0.5 text-gray-500 text-[11px]">
                          <span className="text-amber-600 font-semibold flex items-center gap-0.5">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            {o.rating.toFixed(1)}
                          </span>
                          <span>·</span>
                          <span>{o.city}</span>
                        </div>
                      </td>

                      <td className="py-4 px-3 font-extrabold text-[#111111] text-sm">
                        {inr(o.price)}
                      </td>

                      <td className="py-4 px-3 text-[#6B7280]">
                        {o.fee === 0 ? "FREE" : inr(o.fee)} ({o.km} km)
                      </td>

                      <td className="py-4 px-3 font-bold text-[#E31E24]">
                        {inr(o.totalCost)}
                      </td>

                      <td className="py-4 px-3 text-[#6B7280]">
                        <span className="font-semibold text-[#111111] block">
                          {o.deliveryDays || "~1-2 days"}
                        </span>
                        <span className="text-[10px]">Within {o.dispatchHours}h</span>
                      </td>

                      <td className="py-4 px-3 text-[#6B7280]">
                        {o.warrantyTerms}
                      </td>

                      <td className="py-4 px-3">
                        {o.stock <= 5 && o.stock > 0 ? (
                          <span className="text-amber-700 font-bold">Only {o.stock} left</span>
                        ) : o.stock === 0 ? (
                          <span className="text-rose-700 font-bold">Out of Stock</span>
                        ) : (
                          <span className="text-emerald-700 font-semibold">In Stock ({o.stock})</span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-right">
                        <button
                          type="button"
                          disabled={o.stock === 0}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOfferId(o.id);
                            addToCart(p.id, o.vendorId, buyQty);
                            toast.success("Added to cart", {
                              description: `${dbData.name} from ${o.storeName}`,
                            });
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
            DYNAMIC TECHNICAL SPECIFICATIONS SECTION
           ───────────────────────────────────────────────────────────── */}
        <section className="mt-16 pt-10 border-t border-[#E5E7EB]" id="specifications">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E31E24] mb-1">
            <Wrench className="h-4 w-4" />
            <span>Engineering Blueprint</span>
          </div>
          <h2 className="font-display text-2xl font-extrabold text-[#111111]">
            Technical Specifications
          </h2>
          <p className="text-xs text-[#6B7280] mt-1">
            Authoritative manufacturer specifications verified for automotive fitment and electrical safety.
          </p>

          <dl className="mt-5 grid grid-cols-1 sm:grid-cols-2 overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-2xs">
            {specs.map(([k, v]) => (
              <div key={k} className="border-b border-[#E5E7EB] p-4 odd:border-r">
                <dt className="text-xs font-medium text-[#6B7280]">{k}</dt>
                <dd className="font-bold text-xs text-[#111111] mt-0.5">{v}</dd>
              </div>
            ))}
          </dl>

          {/* Key Features Bullet List (if provided) */}
          {dbData.key_features && (
            <div className="mt-6 rounded-2xl border border-[#E5E7EB] bg-[#F7F7F8] p-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111] mb-2.5">
                Key Performance Highlights
              </h3>
              <div className="text-xs text-[#6B7280] whitespace-pre-line leading-relaxed space-y-1">
                {dbData.key_features}
              </div>
            </div>
          )}
        </section>

        {/* ─────────────────────────────────────────────────────────────
            CUSTOMER RATINGS & REVIEWS WITH GENUINE RATING DISTRIBUTION
           ───────────────────────────────────────────────────────────── */}
        <section className="mt-16 pt-10 border-t border-[#E5E7EB]" id="reviews-section">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E31E24]">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span>Verified Customer Feedback</span>
              </div>
              <h2 className="mt-1 font-display text-2xl sm:text-3xl font-extrabold text-[#111111]">
                Customer Ratings & Reviews
              </h2>
              <p className="text-xs text-[#6B7280] mt-0.5">
                Real feedback from verified purchasers evaluating fitment accuracy, performance, and build quality.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsWritingReview(!isWritingReview)}
              className="rounded-xl bg-[#E31E24] px-5 py-2.5 text-xs font-bold text-white hover:bg-red-700 transition cursor-pointer shrink-0"
            >
              {isWritingReview ? "Cancel Review" : "Write a Product Review"}
            </button>
          </div>

          {/* Ratings Overview Card (Calculated from PostgreSQL) */}
          <div className="mb-8 rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-2xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Overall Score */}
              <div className="text-center md:border-r border-gray-100 md:pr-6">
                <div className="text-5xl font-extrabold text-[#111111]">
                  {totalReviewsCount > 0 ? averageRatingNum.toFixed(1) : "—"}
                </div>
                <div className="flex items-center justify-center gap-1 my-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= Math.round(averageRatingNum)
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500 font-medium">
                  Based on {totalReviewsCount} verified rating{totalReviewsCount === 1 ? "" : "s"}
                </p>
              </div>

              {/* Rating Distribution Breakdown Bars (5★ to 1★) */}
              <div className="md:col-span-2 space-y-2">
                {[5, 4, 3, 2, 1].map((star) => {
                  const item = distribution[star] || { count: 0, percentage: 0 };
                  return (
                    <div key={star} className="flex items-center gap-3 text-xs">
                      <div className="w-12 flex items-center gap-1 font-semibold text-gray-700 shrink-0">
                        <span>{star}</span>
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      </div>
                      <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full transition-all duration-500"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <div className="w-20 text-right text-[11px] text-gray-500 shrink-0">
                        {item.count} ({item.percentage}%)
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Interactive Review Submission Form */}
          {isWritingReview && (
            <form
              onSubmit={handleReviewSubmit}
              className="mb-8 rounded-2xl border border-red-200 bg-red-50/40 p-6 space-y-4"
            >
              <h3 className="text-sm font-bold text-[#111111]">Write a Verified Product Review</h3>
              <div className="grid gap-4 sm:grid-cols-3 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Vikram Shenoy"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="w-full h-9 rounded-lg border border-gray-300 bg-white px-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#E31E24]"
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
                    className="w-full h-9 rounded-lg border border-gray-300 bg-white px-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#E31E24]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Rating</label>
                  <select
                    value={newRating}
                    onChange={(e) => setNewRating(Number(e.target.value))}
                    className="w-full h-9 rounded-lg border border-gray-300 bg-white px-3 text-xs font-semibold cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#E31E24]"
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
                  className="w-full h-9 rounded-lg border border-gray-300 bg-white px-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#E31E24]"
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
                  className="w-full rounded-lg border border-gray-300 bg-white p-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#E31E24]"
                  required
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="rounded-xl bg-[#E31E24] px-5 py-2.5 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-50 transition cursor-pointer flex items-center gap-2"
                >
                  {isSubmittingReview && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>Submit Verified Product Review</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsWritingReview(false)}
                  className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {dbData.reviews.length === 0 ? (
              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-8 text-center text-xs text-[#6B7280]">
                No customer reviews yet for this product. Be the first verified buyer to share your experience!
              </div>
            ) : (
              dbData.reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-2xs space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
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
                      {rev.userCity && (
                        <span className="text-[10px] text-gray-400">· {rev.userCity}</span>
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

                  <div className="flex items-center gap-3 pt-2 text-[11px]">
                    <button
                      type="button"
                      onClick={() => handleHelpfulClick(rev.id)}
                      className={`flex items-center gap-1 transition cursor-pointer ${
                        votedHelpful[rev.id]
                          ? "text-[#E31E24] font-bold"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <ThumbsUp className={`h-3 w-3 ${votedHelpful[rev.id] ? "fill-current" : ""}`} />
                      <span>
                        Helpful ({rev.helpfulCount})
                      </span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            SIMILAR PRODUCTS FROM DATABASE
           ───────────────────────────────────────────────────────────── */}
        {similarProducts.length > 0 && (
          <section className="mt-16 pt-10 border-t border-[#E5E7EB]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#111111]">
                  Similar Spares & Upgrades
                </h2>
                <p className="text-xs text-[#6B7280] mt-0.5">
                  Verified compatible products in the same automotive category.
                </p>
              </div>
              <Link
                to="/shop"
                search={{ cat: dbData.category_name } as any}
                className="text-xs font-bold text-[#E31E24] hover:underline"
              >
                View all →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProducts.map((prod) => (
                <ProductCard key={prod.id} p={prod} />
              ))}
            </div>
          </section>
        )}

        {/* ─────────────────────────────────────────────────────────────
            COUPON DETAILS & TERMS MODAL
           ───────────────────────────────────────────────────────────── */}
        {selectedCouponModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg rounded-2xl bg-white border border-[#E5E7EB] shadow-2xl p-6 space-y-4 my-8">
              <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
                <div className="flex items-center gap-2">
                  <Tag className="h-5 w-5 text-[#E31E24]" />
                  <h3 className="text-base font-bold font-display text-[#111111]">
                    Offer Details & Eligibility Terms
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCouponModal(null)}
                  className="rounded-lg p-1 text-gray-400 hover:text-gray-700 transition cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                {/* Promo Banner */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-red-50 border border-red-200">
                  <div>
                    <span className="font-mono text-sm font-extrabold text-[#E31E24] tracking-wider">
                      {selectedCouponModal.code}
                    </span>
                    <p className="text-xs font-bold text-gray-900 mt-0.5">
                      {selectedCouponModal.discount_type === "percentage"
                        ? `${selectedCouponModal.discount_value}% Discount`
                        : `₹${selectedCouponModal.discount_value} Flat Off`}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(selectedCouponModal.code);
                      toast.success(`Coupon code ${selectedCouponModal.code} copied!`);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#E31E24] hover:bg-red-700 text-white font-bold text-xs transition shadow-2xs cursor-pointer"
                  >
                    Copy Code
                  </button>
                </div>

                {/* Offer Attributes Table */}
                <div className="divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white overflow-hidden">
                  <div className="flex justify-between p-3">
                    <span className="text-gray-500 font-medium">Authorized Dealer</span>
                    <span className="font-bold text-gray-900">
                      {selectedCouponModal.store_name || "Verified Authorized Seller"}
                    </span>
                  </div>
                  <div className="flex justify-between p-3">
                    <span className="text-gray-500 font-medium">Discount Type & Value</span>
                    <span className="font-bold text-emerald-700">
                      {selectedCouponModal.discount_type === "percentage"
                        ? `${selectedCouponModal.discount_value}% Percentage Discount`
                        : `₹${selectedCouponModal.discount_value} Flat Cash Discount`}
                    </span>
                  </div>
                  <div className="flex justify-between p-3">
                    <span className="text-gray-500 font-medium">Minimum Purchase Amount</span>
                    <span className="font-bold text-gray-900">
                      {selectedCouponModal.minimum_order_value > 0
                        ? inr(selectedCouponModal.minimum_order_value)
                        : "No minimum requirement"}
                    </span>
                  </div>
                  {selectedCouponModal.maximum_discount > 0 && selectedCouponModal.discount_type === "percentage" && (
                    <div className="flex justify-between p-3">
                      <span className="text-gray-500 font-medium">Maximum Discount Cap</span>
                      <span className="font-bold text-gray-900">
                        {inr(selectedCouponModal.maximum_discount)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between p-3">
                    <span className="text-gray-500 font-medium">Validity Period</span>
                    <span className="font-bold text-gray-900">
                      {selectedCouponModal.starts_at ? new Date(selectedCouponModal.starts_at).toLocaleDateString() : "Active"} —{" "}
                      {selectedCouponModal.expires_at ? new Date(selectedCouponModal.expires_at).toLocaleDateString() : "Ongoing"}
                    </span>
                  </div>
                  <div className="flex justify-between p-3">
                    <span className="text-gray-500 font-medium">Eligible Products</span>
                    <span className="font-bold text-gray-900 truncate max-w-[220px]">
                      {dbData.name}
                    </span>
                  </div>
                </div>

                {/* Terms and Application Note */}
                <div className="space-y-1.5 text-[11px] text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <p className="font-bold text-gray-700">How to Avail this Offer:</p>
                  <p>• Add this verified product to your shopping cart.</p>
                  <p>• This promotional discount is automatically calculated and applied at checkout.</p>
                  <p>• Offer valid only for authenticated customers with verified delivery addresses.</p>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedCouponModal(null)}
                    className="px-5 py-2 rounded-xl bg-[#E31E24] hover:bg-red-700 text-white font-bold transition shadow-xs cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
