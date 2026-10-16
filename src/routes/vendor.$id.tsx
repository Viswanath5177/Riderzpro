import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { isMobileDevice } from "@/lib/native/app";
import {
  Store,
  MapPin,
  Clock,
  ShieldCheck,
  Star,
  Truck,
  Phone,
  Mail,
  RotateCcw,
  Search,
  SlidersHorizontal,
  PackageCheck,
  Award,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductCard } from "@/components/site/bits";
import {
  getVendor,
  getVendorOffers,
  getVendorReviews,
  addVendorReview,
  inr,
  CUSTOMER_LOCATION,
  distanceKm,
  deliveryFee,
  etaMinutes,
  type Product,
  type VendorOffer,
  type VendorReview,
} from "@/lib/data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/vendor/$id")({
  head: () => ({
    meta: [
      { title: "Authorized Seller Shop Profile — RiderzPro" },
      { name: "description", content: "Explore verified automotive products, genuine spare parts, and customer reviews from this seller." },
    ],
  }),
  component: VendorShopPage,
});

export function VendorShopPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (isMobileDevice()) {
      navigate({ to: "/app", replace: true });
    }
  }, [navigate]);

  if (typeof window !== "undefined" && isMobileDevice()) {
    return null;
  }

  const { id } = Route.useParams();
  const vendor = getVendor(id);
  const { addToCart } = useStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"relevance" | "price_asc" | "price_desc" | "rating">("relevance");
  const [activeTab, setActiveTab] = useState<"products" | "reviews" | "about">("products");

  // Reviews state
  const [reviews, setReviews] = useState<VendorReview[]>(() => getVendorReviews(vendor.id));
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [newUserName, setNewUserName] = useState("");

  const vendorOffers = useMemo(() => getVendorOffers(vendor.id), [vendor.id]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    vendorOffers.forEach(({ product }) => {
      if (product.category) set.add(product.category);
    });
    return ["All", ...Array.from(set)];
  }, [vendorOffers]);

  const filteredOffers = useMemo(() => {
    let list = vendorOffers.filter(({ product }) => {
      const matchesCat = selectedCategory === "All" || product.category === selectedCategory;
      const matchesQuery =
        searchQuery === "" ||
        `${product.name} ${product.brand} ${product.category} ${product.description}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      return matchesCat && matchesQuery;
    });

    if (sortBy === "price_asc") {
      list = [...list].sort((a, b) => a.offer.price - b.offer.price);
    } else if (sortBy === "price_desc") {
      list = [...list].sort((a, b) => b.offer.price - a.offer.price);
    }
    return list;
  }, [vendorOffers, selectedCategory, searchQuery, sortBy]);

  const dist = Math.round(distanceKm(vendor, CUSTOMER_LOCATION) * 10) / 10;
  const shippingCharge = deliveryFee(dist);
  const eta = etaMinutes(dist, vendor.prepMins);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !newUserName.trim()) {
      toast.error("Please enter your name and review comment.");
      return;
    }
    const created = addVendorReview({
      vendorId: vendor.id,
      userId: `usr-${Date.now()}`,
      userName: newUserName.trim(),
      rating: newRating,
      packagingRating: 5,
      deliveryRating: 5,
      communicationRating: 5,
      comment: newComment.trim(),
      isVerifiedPurchase: true,
    });
    setReviews([created, ...reviews]);
    setNewComment("");
    setNewUserName("");
    setIsWritingReview(false);
    toast.success("Thank you! Your seller review has been published.");
  };

  return (
    <SiteLayout>
      {/* 1. Shop Header Banner & Identity */}
      <div className="bg-gradient-to-b from-gray-900 to-[#111111] text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start gap-3.5 sm:gap-4">
              <div className="grid h-14 w-14 sm:h-20 sm:w-20 place-items-center rounded-2xl bg-white/10 text-white border border-white/20 shadow-md backdrop-blur-md shrink-0">
                <Store className="h-7 w-7 sm:h-10 sm:w-10 text-[#E31E24]" />
              </div>
              <div className="space-y-1.5 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight font-display">{vendor.name}</h1>
                  {vendor.isVerified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-400 border border-emerald-500/30">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>{vendor.verificationBadge || "Verified Partner"}</span>
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">{vendor.description}</p>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-gray-400 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-[#E31E24]" />
                    {vendor.area} · {dist} km from you
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-gray-400" />
                    {vendor.businessHours || "Mon-Sat: 09:00 AM - 08:30 PM"}
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-amber-400">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    {vendor.rating} ({vendor.reviewCount || 150}+ ratings)
                  </span>
                </div>
              </div>
            </div>

            {/* Hyperlocal Serviceability Card */}
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur-md sm:min-w-[260px] space-y-2 text-xs">
              <div className="flex items-center justify-between text-gray-300">
                <span>Express Delivery:</span>
                <span className="font-bold text-white">~{eta} mins</span>
              </div>
              <div className="flex items-center justify-between text-gray-300">
                <span>Shipping Fee:</span>
                <span className="font-bold text-emerald-400">{inr(shippingCharge)}</span>
              </div>
              <div className="flex items-center justify-between text-gray-300">
                <span>Coverage:</span>
                <span className="text-right text-gray-400 truncate max-w-[150px]">{vendor.deliveryCoverage}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Navigation Tabs (Products / Reviews / About) */}
      <div className="border-b border-[#E5E7EB] bg-white sticky top-16 z-20 shadow-2xs">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 flex items-center justify-between">
          <nav className="flex space-x-4 sm:space-x-8 text-xs sm:text-sm font-semibold overflow-x-auto scrollbar-none whitespace-nowrap">
            <button
              onClick={() => setActiveTab("products")}
              className={`py-3.5 sm:py-4 border-b-2 transition cursor-pointer flex items-center gap-1.5 sm:gap-2 shrink-0 ${
                activeTab === "products"
                  ? "border-[#E31E24] text-[#E31E24]"
                  : "border-transparent text-[#6B7280] hover:text-[#111111]"
              }`}
            >
              <span>Products & Spares</span>
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] sm:text-xs text-gray-700 font-bold">
                {vendorOffers.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`py-3.5 sm:py-4 border-b-2 transition cursor-pointer flex items-center gap-1.5 sm:gap-2 shrink-0 ${
                activeTab === "reviews"
                  ? "border-[#E31E24] text-[#E31E24]"
                  : "border-transparent text-[#6B7280] hover:text-[#111111]"
              }`}
            >
              <span>Customer Reviews</span>
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] sm:text-xs text-gray-700 font-bold">
                {reviews.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("about")}
              className={`py-3.5 sm:py-4 border-b-2 transition cursor-pointer shrink-0 ${
                activeTab === "about"
                  ? "border-[#E31E24] text-[#E31E24]"
                  : "border-transparent text-[#6B7280] hover:text-[#111111]"
              }`}
            >
              Shop Policies & Verification
            </button>
          </nav>
        </div>
      </div>

      {/* 3. Tab Contents */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Tab 1: Products */}
        {activeTab === "products" && (
          <div className="space-y-6">
            {/* Filter and Search Bar */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-2xs">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search ${vendor.name}'s products...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 rounded-xl border border-gray-200 text-xs text-[#111111] focus:border-[#E31E24] focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
                  <span>Category:</span>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-xs font-semibold text-[#111111] focus:outline-none cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
                  <span>Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-xs font-semibold text-[#111111] focus:outline-none cursor-pointer"
                  >
                    <option value="relevance">Featured & Relevant</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Product Offer Grid */}
            {filteredOffers.length === 0 ? (
              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-12 text-center text-[#6B7280]">
                <Store className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                <p className="font-semibold text-sm text-[#111111]">No products found matching your filters</p>
                <p className="text-xs text-gray-500 mt-1">Try resetting the category filter or searching for another term.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
                {filteredOffers.map(({ product, offer }) => (
                  <div
                    key={product.id}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-3 sm:p-4 shadow-2xs hover:shadow-md transition-all"
                  >
                    <div>
                      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-50 border border-gray-100 mb-2.5 sm:mb-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          loading="lazy"
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-2 left-2 rounded-md bg-white/95 px-2 py-0.5 text-[9.5px] sm:text-[10px] font-bold uppercase text-[#111111] shadow-2xs">
                          {product.category}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <p className="text-[10px] sm:text-[11px] font-bold uppercase text-[#6B7280]">{product.brand}</p>
                        <Link to="/product/$id" params={{ id: product.id }} className="block">
                          <h3 className="font-bold text-xs sm:text-sm text-[#111111] leading-tight line-clamp-2 hover:text-[#E31E24] transition">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="text-[10.5px] sm:text-[11px] text-[#6B7280] line-clamp-1">{product.description}</p>
                      </div>
                    </div>

                    <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-[#E5E7EB] flex items-center justify-between gap-1.5">
                      <div className="min-w-0">
                        <div className="flex items-baseline gap-1 sm:gap-1.5 flex-wrap">
                          <span className="text-sm sm:text-base font-extrabold text-[#111111]">{inr(offer.price)}</span>
                          {offer.mrp && offer.mrp > offer.price && (
                            <span className="text-[10px] sm:text-[11px] text-gray-400 line-through">{inr(offer.mrp)}</span>
                          )}
                        </div>
                        <span className="text-[9.5px] sm:text-[10px] text-emerald-600 font-semibold block truncate">
                          {offer.stock > 0 ? `In Stock (${offer.stock})` : "Out of stock"}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          addToCart(product.id, vendor.id);
                          toast.success("Added to cart", { description: `${product.name} from ${vendor.name}` });
                        }}
                        disabled={offer.stock === 0}
                        className="rounded-xl bg-[#E31E24] px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold text-white shadow-xs hover:bg-red-700 disabled:opacity-40 transition cursor-pointer shrink-0"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Vendor Reviews */}
        {activeTab === "reviews" && (
          <div className="space-y-8 max-w-4xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-2xs">
              <div>
                <h2 className="text-xl font-extrabold text-[#111111] font-display">Seller Ratings & Experience</h2>
                <p className="text-xs text-[#6B7280] mt-1">
                  Verified customer ratings reflecting packaging quality, delivery speed, and customer service.
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex items-center text-amber-500">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="h-5 w-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-lg font-bold text-[#111111]">{vendor.rating} out of 5</span>
                  <span className="text-xs text-[#6B7280]">({reviews.length} written reviews)</span>
                </div>
              </div>

              <button
                onClick={() => setIsWritingReview(!isWritingReview)}
                className="rounded-xl bg-[#E31E24] px-5 py-2.5 text-xs font-bold text-white hover:bg-red-700 transition cursor-pointer shrink-0"
              >
                {isWritingReview ? "Cancel Review" : "Write a Seller Review"}
              </button>
            </div>

            {/* Review Form Modal/Drawer */}
            {isWritingReview && (
              <form onSubmit={handleReviewSubmit} className="rounded-2xl border border-red-200 bg-red-50/40 p-6 space-y-4">
                <h3 className="text-sm font-bold text-[#111111]">Review your experience with {vendor.name}</h3>
                <div className="grid gap-3 sm:grid-cols-2 text-xs">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Your Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Arjun Sharma"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      className="w-full h-9 rounded-lg border border-gray-300 bg-white px-3 text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Rating</label>
                    <select
                      value={newRating}
                      onChange={(e) => setNewRating(Number(e.target.value))}
                      className="w-full h-9 rounded-lg border border-gray-300 bg-white px-3 text-xs font-semibold cursor-pointer"
                    >
                      <option value={5}>5 Stars - Excellent Experience</option>
                      <option value={4}>4 Stars - Very Good</option>
                      <option value={3}>3 Stars - Average</option>
                      <option value={2}>2 Stars - Poor</option>
                      <option value={1}>1 Star - Unsatisfactory</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Your Comments & Feedback</label>
                  <textarea
                    rows={3}
                    placeholder="Describe packaging, shipping speed, and seller responsiveness..."
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
                  Submit Verified Seller Review
                </button>
              </form>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r.id} className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#111111]">{r.userName}</span>
                      {r.isVerifiedPurchase && (
                        <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                          <ShieldCheck className="h-3 w-3" />
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-[#6B7280]">{r.date}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-3.5 w-3.5 ${
                          star <= r.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-xs text-[#111111] leading-relaxed">{r.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: About Shop & Policies */}
        {activeTab === "about" && (
          <div className="max-w-4xl space-y-6">
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-2xs space-y-4">
              <h2 className="text-lg font-bold text-[#111111]">Business Information & Verification</h2>
              <dl className="grid gap-4 sm:grid-cols-2 text-xs">
                <div className="border-b sm:border-b-0 pb-3 sm:pb-0">
                  <dt className="text-[#6B7280] font-medium">Business Registered Name</dt>
                  <dd className="font-bold text-[#111111] mt-0.5">{vendor.name}</dd>
                </div>
                <div className="border-b sm:border-b-0 pb-3 sm:pb-0">
                  <dt className="text-[#6B7280] font-medium">GSTIN Tax Registration</dt>
                  <dd className="font-mono font-bold text-[#111111] mt-0.5">{vendor.gstin || "29AABCV1234F1Z5"}</dd>
                </div>
                <div>
                  <dt className="text-[#6B7280] font-medium">Official Contact Phone</dt>
                  <dd className="font-bold text-[#111111] mt-0.5 flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5 text-[#E31E24]" />
                    {vendor.phone || "+91 80 4122 8900"}
                  </dd>
                </div>
                <div>
                  <dt className="text-[#6B7280] font-medium">Support Email</dt>
                  <dd className="font-bold text-[#111111] mt-0.5 flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5 text-[#E31E24]" />
                    {vendor.email || "support@volthub.in"}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-[#6B7280] font-medium">Physical Store Address</dt>
                  <dd className="font-medium text-[#111111] mt-0.5">{vendor.address || "100ft Road, Bengaluru, Karnataka"}</dd>
                </div>
              </dl>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-2xs space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold text-[#111111]">
                  <Truck className="h-4 w-4 text-[#E31E24]" />
                  <span>Shipping & Fulfillment Policy</span>
                </div>
                <p className="text-xs text-[#6B7280] leading-relaxed">
                  {vendor.shippingPolicy || "Orders dispatched within 1-2 hours. Multi-vendor deliveries are dispatched independently with courier tracking."}
                </p>
              </div>

              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-2xs space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold text-[#111111]">
                  <RotateCcw className="h-4 w-4 text-[#E31E24]" />
                  <span>Returns & Replacement Guarantee</span>
                </div>
                <p className="text-xs text-[#6B7280] leading-relaxed">
                  {vendor.returnPolicy || "7-day replacement warranty for manufacturing defects. Pre-dispatch fitment validation supported."}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
