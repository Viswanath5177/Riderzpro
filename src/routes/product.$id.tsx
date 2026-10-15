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
  ShoppingCart,
  Plus,
  Minus,
} from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/SiteLayout";
import { FitmentBadge } from "@/components/site/bits";
import {
  bikes,
  fitmentFor,
  getBike,
  addProductReview,
  inr,
  type Product,
  mapDbProductToProduct,
  type ProductReview,
} from "@/lib/data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/product/$id")({
  head: () => ({
    meta: [
      { title: "Compare Sellers & Specifications — RiderzPro" },
      { name: "description", content: "View product specifications, seller price and stock, and customer feedback." },
    ],
  }),
  component: ProductPage,
});

type OfferSortOption = "value" | "price_asc" | "rating_desc" | "delivery_fast";

type ApiCatalogProduct = Product & {
  sellerName?: string | null;
  storeName?: string | null;
  sellerCity?: string | null;
  shipsFrom?: string | null;
  sellerRating?: number | null;
  sellerReviewCount?: number | null;
  sellerLat?: number | null;
  sellerLng?: number | null;
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
  const seller = row.store_name || row.seller_name || "Qbit Pro";
  const city = row.seller_city || "Sector 63, Noida";
  const ships = row.ships_from || "Noida";

  return {
    ...mapped,
    image,
    category: row.category || row.category_name || mapped.category,
    brand: row.brand || "Brand not provided",
    sellerName: seller,
    storeName: seller,
    sellerCity: city,
    shipsFrom: ships,
    sellerRating: row.seller_rating == null ? 4.8 : Number(row.seller_rating),
    sellerReviewCount: row.seller_review_count == null ? 142 : Number(row.seller_review_count),
    sellerLat: row.seller_lat == null ? 28.628 : Number(row.seller_lat),
    sellerLng: row.seller_lng == null ? 77.378 : Number(row.seller_lng),
    gstRate: row.gst_rate ?? 18,
    hsnCode: row.hsn_code ?? null,
    warrantyMonths: row.warranty_months == null ? 0 : Number(row.warranty_months),
    weightKg: row.weight_kg == null ? 0 : Number(row.weight_kg),
    fits: Array.isArray(row.compatible_vehicles) ? row.compatible_vehicles : [],
    mrp: row.mrp == null ? undefined : Number(row.mrp),
    offers: row.price != null
      ? [{ vendorId: String(row.seller_id || "usr_seller_qbit"), price: Number(row.price), stock: Number(row.stock) || 0 }]
      : (row.seller_id && row.price != null
          ? [{ vendorId: String(row.seller_id), price: Number(row.price), stock: Number(row.stock) || 0 }]
          : []),
  };
}

function ProductPage() {
  const { id } = Route.useParams();
  const [imageFailed, setImageFailed] = useState(false);
  const { activeBikeId, addToCart, cart } = useStore();

  const [product, setProduct] = useState<ApiCatalogProduct | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Delhi Pincode & Delivery Estimator
  const [pincode, setPincode] = useState("110001");
  const [pincodeInput, setPincodeInput] = useState("110001");
  const [isChangingPincode, setIsChangingPincode] = useState(false);
  const [pincodeError, setPincodeError] = useState("");
  const [qty, setQty] = useState(1);

  // Offers Sorting & View
  const [offerSort, setOfferSort] = useState<OfferSortOption>("value");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  // Product Reviews
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState("");
  const [newComment, setNewComment] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [newVehicle, setNewVehicle] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    setProduct(null);
    setLoading(true);
    setError(false);
    fetch(`/api/products/${encodeURIComponent(id)}`, { signal: controller.signal })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok || !result.success || !result.data) throw new Error("Product not found");
        setProduct(productFromApi(result.data));
      })
      .catch(() => {
        if (!controller.signal.aborted) setError(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [id]);

  useEffect(() => {
    if (!product) {
      setSimilarProducts([]);
      return;
    }
    const controller = new AbortController();
    const params = new URLSearchParams({ status: "approved", category: product.category });
    fetch(`/api/products?${params.toString()}`, { signal: controller.signal })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok || !result.success || !Array.isArray(result.data)) return;
        setSimilarProducts(result.data
          .filter((row: any) => row.id !== product.id)
          .slice(0, 3)
          .map(productFromApi));
      })
      .catch(() => {
        if (!controller.signal.aborted) setSimilarProducts([]);
      });
    return () => controller.abort();
  }, [product]);

  const p = product;
  const fit = p ? fitmentFor(p, activeBikeId) : "unknown";
  const bike = activeBikeId ? getBike(activeBikeId) : null;
  const hasValidImage = Boolean(p && p.image && p.image.trim() !== "" && !imageFailed);

  // Delivery calculation for entered pincode (Default: Delhi 110001)
  const deliveryInfo = useMemo(() => {
    const cleanPin = pincode.trim();
    const isDelhi = cleanPin.startsWith("110");
    const isNcr = cleanPin.startsWith("201") || cleanPin.startsWith("122") || cleanPin.startsWith("121");
    if (isDelhi) {
      return {
        location: `Delhi (${cleanPin})`,
        eta: "Tomorrow, by 12:00 PM",
        badge: "Express Same-Day / Next-Day",
        speed: "Direct Dispatch from Sector 63, Noida",
        charge: "FREE Delivery",
        route: "Sector 63 Noida → Delhi Doorstep",
      };
    } else if (isNcr) {
      return {
        location: `Delhi NCR (${cleanPin})`,
        eta: "Today / Tomorrow",
        badge: "Local Express",
        speed: "Dispatched from Noida Hub",
        charge: "FREE Delivery",
        route: "Sector 63 Noida → Delhi NCR",
      };
    } else {
      return {
        location: `India (${cleanPin})`,
        eta: "2–4 Business Days",
        badge: "Standard Courier",
        speed: "Standard Surface Delivery",
        charge: "₹49 Standard",
        route: "Noida Hub → Destination Pin",
      };
    }
  }, [pincode]);

  const handlePincodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = pincodeInput.trim();
    if (!/^\d{6}$/.test(val)) {
      setPincodeError("Please enter a valid 6-digit Indian PIN code");
      return;
    }
    setPincodeError("");
    setPincode(val);
    setIsChangingPincode(false);
    toast.success(`Delivery estimate updated for ${val}`);
  };

  // Process and sort offers
  const enrichedOffers = useMemo(() => {
    if (!p) return [];
    const sourceOffers = p.offers && p.offers.length > 0
      ? p.offers
      : (p.price != null ? [{ vendorId: "usr_seller_qbit", price: Number(p.price), stock: Number(p.stock) || 0 }] : []);

    return sourceOffers
      .map((offer) => ({
        ...offer,
        mrp: p.mrp || undefined,
        v: {
          name: p.storeName || p.sellerName || "Qbit Pro",
          area: p.sellerCity || "Sector 63, Noida",
          shipsFrom: p.shipsFrom || "Noida",
          rating: p.sellerRating ?? 4.8,
          reviewCount: p.sellerReviewCount ?? 142,
          verificationBadge: "Verified Seller · Noida Hub",
        },
        km: 24,
        fee: offer.shippingCharge ?? 0,
        eta: 180,
        deliveryDays: `Tomorrow to ${deliveryInfo.location}`,
        totalCost: offer.price + (offer.shippingCharge ?? 0),
      }))
      .sort((a, b) => {
        if (offerSort === "price_asc") return a.price - b.price;
        if (offerSort === "rating_desc") return (b.v.rating ?? -Infinity) - (a.v.rating ?? -Infinity);
        return a.totalCost - b.totalCost;
      });
  }, [p, offerSort, deliveryInfo]);

  const primaryOffer = enrichedOffers[0] || null;
  const currentStock = primaryOffer ? primaryOffer.stock : (p ? p.stock || 0 : 0);
  const isOutOfStock = currentStock <= 0;

  const inCartItem = primaryOffer
    ? cart.find((c) => c.productId === p?.id && c.vendorId === primaryOffer.vendorId)
    : cart.find((c) => c.productId === p?.id);
  const inCartQty = inCartItem ? inCartItem.qty : 0;
  const remainingStock = Math.max(0, currentStock - inCartQty);
  const isMaxInCart = inCartQty >= currentStock && currentStock > 0;

  const handleAddToCart = (vendorId?: string, requestedQty = qty) => {
    if (!p) return;
    const targetVendor = vendorId || primaryOffer?.vendorId || "usr_seller_qbit";
    const targetOffer = enrichedOffers.find((o) => o.vendorId === targetVendor) || primaryOffer;
    const stockLimit = targetOffer ? targetOffer.stock : (p.stock || 0);

    if (stockLimit <= 0) {
      toast.error("This product is currently out of stock");
      return;
    }

    const existingInCart = cart.find((c) => c.productId === p.id && c.vendorId === targetVendor)?.qty || 0;
    if (existingInCart + requestedQty > stockLimit) {
      toast.error(`Cannot add more than ${stockLimit} units`, {
        description: `You already have ${existingInCart} in your cart. Only ${stockLimit - existingInCart} more available.`,
      });
      return;
    }

    addToCart(p.id, targetVendor, requestedQty);
    toast.success("Added to cart", {
      description: `${requestedQty}x ${p.name} from ${targetOffer?.v.name || "Qbit Pro"}`,
    });
  };

  // Similar compatible products for technical comparison
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
      fitmentVehicle: newVehicle.trim() || (bike ? `${bike.make} ${bike.model}` : "Vehicle not specified"),
      isVerifiedPurchase: false,
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
    ["Total Weight", p.weightKg ? `${p.weightKg} kg` : "Not provided"],
    ["Base Manufacturer Warranty", p.warrantyMonths ? `${p.warrantyMonths} Months` : "Not provided"],
    ["Part SKU / Model", p.sku || `SKU-${p.id}`],
    ["GST", p.gstRate == null ? "Not provided" : `${p.gstRate}%`],
    ["HSN", p.hsnCode || "Not provided"],
  ];

  const avgProductRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "—";

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
            <div className="aspect-square overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white p-4 shadow-2xs flex items-center justify-center">
              {hasValidImage ? (
                <img
                  src={p.image}
                  alt={p.name}
                  width={1024}
                  height={1024}
                  onError={() => setImageFailed(true)}
                  className="aspect-square w-full object-contain rounded-2xl"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-center p-6 bg-gradient-to-b from-[#FAFAFA] to-[#F1F3F5] rounded-2xl">
                  <div className="grid h-20 w-20 place-items-center rounded-3xl bg-white border border-[#E5E7EB] text-4xl shadow-sm">
                    🧰
                  </div>
                  <div>
                    <p className="text-lg font-bold text-[#111111]">Product image not available</p>
                    <p className="mt-1 text-xs text-[#6B7280]">Genuine catalog item · {p.brand}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between text-xs text-[#6B7280] px-2">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-[#E31E24]" />
                Catalog product details
              </span>
              <span className="flex items-center gap-1.5">
                <RotateCcw className="h-4 w-4 text-[#E31E24]" />
                Seller return terms shown when available
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
              {reviews.length > 0 && <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="text-xs font-bold text-amber-900">{avgProductRating}</span>
              </div>}
              <a href="#reviews-section" className="text-xs text-[#6B7280] hover:text-[#E31E24] underline">
                {reviews.length} Customer Reviews
              </a>
              <span className="text-xs text-[#6B7280]">·</span>
              <span className="text-xs font-semibold text-emerald-700">
                {enrichedOffers.length ? `Available from ${enrichedOffers.length} seller offer${enrichedOffers.length > 1 ? "s" : ""}` : "No seller offers available"}
              </span>
            </div>

            <p className="mt-4 text-sm text-[#6B7280] leading-relaxed whitespace-pre-line">
              {p.description}
            </p>

            {/* Vehicle Compatibility Banner */}
            <div className="mt-6 rounded-2xl border border-[#E5E7EB] bg-[#F7F7F8] p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                  Vehicle Compatibility
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

            {/* Primary Purchasing & Seller / Delivery Card */}
            <div className="mt-6 rounded-2xl bg-gradient-to-br from-white to-gray-50/90 border border-gray-200/90 p-5 shadow-xs space-y-4">
              {/* Pricing Row */}
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#111111]">
                    {primaryOffer ? inr(primaryOffer.price) : "Price on Request"}
                  </span>
                  {primaryOffer?.mrp && primaryOffer.mrp > primaryOffer.price && (
                    <>
                      <span className="text-sm sm:text-base text-gray-400 line-through">
                        {inr(primaryOffer.mrp)}
                      </span>
                      <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-xs font-bold">
                        {Math.round(((primaryOffer.mrp - primaryOffer.price) / primaryOffer.mrp) * 100)}% OFF
                      </span>
                    </>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Inclusive of all taxes · 18% GST included {p.hsnCode ? `(HSN: ${p.hsnCode})` : ""}
                </p>
              </div>

              {/* Seller & Origin Badge */}
              <div className="pt-3 border-t border-gray-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-gray-800">
                  <Store className="h-4 w-4 text-[#E31E24]" />
                  <span>
                    Sold by <strong className="text-gray-900 font-bold">{p.storeName || p.sellerName || "Qbit Pro"}</strong>
                  </span>
                  <span className="text-gray-300">·</span>
                  <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold text-[11px] border border-emerald-200">
                    <CheckCircle2 className="h-3 w-3" /> Ships from Noida
                  </span>
                </div>
                <span className="text-[11px] text-gray-500 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-gray-400" />
                  Dispatch: Sector 63, Noida (UP)
                </span>
              </div>

              {/* Delhi Delivery Estimator Widget */}
              <div className="rounded-xl bg-white p-3.5 border border-gray-200/90 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-gray-800">
                    <Truck className="h-4 w-4 text-[#E31E24]" />
                    <span>Delivery to:</span>
                    <span className="font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded text-xs">
                      {deliveryInfo.location}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsChangingPincode(!isChangingPincode)}
                    className="text-xs font-bold text-[#E31E24] hover:underline cursor-pointer"
                  >
                    {isChangingPincode ? "Cancel" : "Change PIN"}
                  </button>
                </div>

                {isChangingPincode && (
                  <form onSubmit={handlePincodeSubmit} className="pt-1 flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      value={pincodeInput}
                      onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, ""))}
                      placeholder="Enter 6-digit Delhi PIN"
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:border-[#E31E24]"
                    />
                    <button
                      type="submit"
                      className="rounded-lg bg-[#E31E24] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-red-700 cursor-pointer"
                    >
                      Check
                    </button>
                  </form>
                )}
                {pincodeError && <p className="text-[11px] text-red-600">{pincodeError}</p>}

                <div className="flex items-center justify-between text-xs pt-1 border-t border-gray-100">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-[#E31E24]" />
                    <span className="font-bold text-gray-900">{deliveryInfo.eta}</span>
                  </div>
                  <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] border border-emerald-100">
                    {deliveryInfo.charge}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500">
                  ⚡ {deliveryInfo.speed} · {deliveryInfo.route}
                </p>
              </div>

              {/* Stock Status & Quantity & Add to Cart */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2 text-xs">
                  {isOutOfStock ? (
                    <span className="inline-flex items-center gap-1.5 text-red-600 font-bold bg-red-50 px-2.5 py-1 rounded-lg border border-red-200">
                      <AlertCircle className="h-3.5 w-3.5" /> Out of Stock
                    </span>
                  ) : remainingStock < 5 ? (
                    <span className="inline-flex items-center gap-1 text-amber-800 font-bold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 text-xs">
                      <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                      Hurry, only {remainingStock} left in stock!
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 text-xs">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      In Stock ({remainingStock} units available)
                    </span>
                  )}

                  {inCartQty > 0 && (
                    <span className="text-[11px] text-gray-600 font-semibold bg-gray-100 px-2 py-0.5 rounded">
                      {inCartQty} in your cart
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {!isOutOfStock && (
                    <div className="flex items-center rounded-xl border border-gray-300 bg-white shadow-2xs">
                      <button
                        type="button"
                        disabled={qty <= 1}
                        onClick={() => setQty((q) => Math.max(1, q - 1))}
                        className="px-3 py-2.5 text-gray-600 hover:text-black disabled:opacity-30 cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="px-2 text-xs font-extrabold text-gray-900 min-w-6 text-center">
                        {qty}
                      </span>
                      <button
                        type="button"
                        disabled={qty >= remainingStock}
                        onClick={() => setQty((q) => Math.min(remainingStock, q + 1))}
                        className="px-3 py-2.5 text-gray-600 hover:text-black disabled:opacity-30 cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}

                  <button
                    type="button"
                    disabled={isOutOfStock || isMaxInCart}
                    onClick={() => handleAddToCart(primaryOffer?.vendorId, qty)}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#E31E24] py-3 px-5 text-sm font-extrabold text-white shadow-md hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {isOutOfStock
                      ? "Out of Stock"
                      : isMaxInCart
                        ? "Max Stock in Cart"
                        : `Add to Cart • ${inr((primaryOffer?.price || 0) * qty)}`}
                  </button>
                </div>
              </div>
            </div>

            {/* Key Quick Specs */}
            <div className="mt-6 grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-[#E5E7EB] bg-white p-3">
                <span className="text-[#6B7280] block text-[11px]">Warranty</span>
                <span className="font-bold text-[#111111]">{p.warrantyMonths ? `${p.warrantyMonths} Months Manufacturer` : "Not provided"}</span>
              </div>
              <div className="rounded-xl border border-[#E5E7EB] bg-white p-3">
                <span className="text-[#6B7280] block text-[11px]">Estimated Weight</span>
                <span className="font-bold text-[#111111]">{p.weightKg ? `${p.weightKg} kg` : "Not provided"}</span>
              </div>
            </div>
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
                Seller price and stock information currently available for this product.
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
                const isLowStock = o.stock > 0 && o.stock < 5;

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
                          {o.v.rating != null && <span className="flex items-center gap-1 font-semibold text-amber-500"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />{o.v.rating}{o.v.reviewCount != null ? ` (${o.v.reviewCount})` : ""}</span>}
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {o.v.area}
                          </span>
                        </div>
                        {o.v.verificationBadge && <p className="text-[11px] text-gray-500">{o.v.verificationBadge}</p>}
                      </div>

                      {/* Specs & Fulfillment Comparison Metrics */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 text-xs lg:border-x lg:border-[#E5E7EB] lg:px-6">
                        <div>
                          <span className="text-[11px] text-[#6B7280] block">Estimated Delivery</span>
                          <span className="font-bold text-[#111111] flex items-center gap-1 mt-0.5">
                            <Clock className="h-3.5 w-3.5 text-[#E31E24]" />
                            {o.eta == null ? "Not provided" : `~${o.eta} mins`}
                          </span>
                          <span className="text-[10px] text-gray-500">{o.deliveryDays || "Delivery estimate unavailable"}</span>
                        </div>

                        <div>
                          <span className="text-[11px] text-[#6B7280] block">Shipping Fee</span>
                          <span className="font-bold text-[#111111] mt-0.5 block">{o.fee == null ? "Not provided" : inr(o.fee)}</span>
                        </div>

                        <div>
                          <span className="text-[11px] text-[#6B7280] block">Warranty & Return</span>
                          <span className="font-bold text-[#111111] mt-0.5 block">
                            {o.warrantyTerms || (p.warrantyMonths ? `${p.warrantyMonths} Mos Warranty` : "Not provided")}
                          </span>
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
                          {o.fee != null && <span className="text-[11px] text-gray-500 block">Total including listed shipping: <strong>{inr(o.totalCost)}</strong></span>}
                          {isLowStock ? (
                            <span className="text-[10px] text-amber-700 font-bold flex items-center gap-1">
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                              Hurry only {o.stock} left in stock
                            </span>
                          ) : (
                            <span className="text-[10px] text-emerald-600 font-semibold">In Stock ({o.stock} available)</span>
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
                          {(() => {
                            const thisInCart = cart.find((c) => c.productId === p.id && c.vendorId === o.vendorId)?.qty || 0;
                            const isThisMax = thisInCart >= o.stock && o.stock > 0;
                            const isThisOut = o.stock <= 0;
                            return (
                              <button
                                disabled={isThisOut || isThisMax}
                                onClick={() => handleAddToCart(o.vendorId, 1)}
                                className="flex-1 sm:flex-initial text-center rounded-xl bg-[#E31E24] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                              >
                                {isThisOut ? "Out of Stock" : isThisMax ? "Max in Cart" : "Select & Add"}
                              </button>
                            );
                          })()}
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
                          {o.v.rating != null && <span className="text-amber-600 font-semibold flex items-center gap-0.5">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            {o.v.rating}{o.v.reviewCount != null ? ` (${o.v.reviewCount})` : ""}
                          </span>}
                          <span>{o.v.area}</span>
                        </div>
                      </td>

                      <td className="py-4 px-3 font-extrabold text-[#111111] text-sm">
                        {inr(o.price)}
                      </td>

                      <td className="py-4 px-3 text-[#6B7280]">
                        {o.fee == null ? "Not provided" : inr(o.fee)}
                      </td>

                      <td className="py-4 px-3 font-bold text-[#E31E24]">
                        {o.fee == null ? "Not provided" : inr(o.totalCost)}
                      </td>

                      <td className="py-4 px-3 text-[#6B7280]">
                        <span className="font-semibold text-[#111111] block">{o.eta == null ? "Not provided" : `~${o.eta} mins`}</span>
                        <span className="text-[10px]">{o.deliveryDays || "Delivery estimate unavailable"}</span>
                      </td>

                      <td className="py-4 px-3 text-[#6B7280]">
                        {o.warrantyTerms || (p.warrantyMonths ? `${p.warrantyMonths} Mos` : "Not provided")}
                      </td>

                      <td className="py-4 px-3">
                        <span className={o.stock >= 5 ? "text-emerald-700 font-semibold" : o.stock > 0 ? "text-amber-700 font-bold" : "text-red-600 font-bold"}>
                          {o.stock > 0 ? `${o.stock} units` : "Out of stock"}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-right">
                        {(() => {
                          const thisInCart = cart.find((c) => c.productId === p.id && c.vendorId === o.vendorId)?.qty || 0;
                          const isThisMax = thisInCart >= o.stock && o.stock > 0;
                          const isThisOut = o.stock <= 0;
                          return (
                            <button
                              disabled={isThisOut || isThisMax}
                              onClick={() => handleAddToCart(o.vendorId, 1)}
                              className="rounded-lg bg-[#E31E24] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                            >
                              {isThisOut ? "Out of Stock" : isThisMax ? "Max in Cart" : "Add to Cart"}
                            </button>
                          );
                        })()}
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
            Product specifications available in the catalog record.
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
              <p className="text-xs text-[#6B7280] mt-0.5">Customer feedback submitted for this catalog product.</p>
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
              <h3 className="text-sm font-bold text-[#111111]">Write a Product Review</h3>
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
                Submit Product Review
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
                <Link key={prod.id} to="/product/$id" params={{ id: prod.id }} className="rounded-xl border border-[#E5E7EB] bg-white p-4 hover:shadow-md">
                  {prod.image && <img src={prod.image} alt={prod.name} loading="lazy" className="mb-3 aspect-square w-full object-contain" />}
                  <p className="text-xs font-bold text-[#E31E24]">{prod.brand}</p>
                  <p className="mt-1 font-bold text-[#111111]">{prod.name}</p>
                  <p className="mt-2 text-xs text-[#6B7280]">{prod.offers.length ? inr(prod.offers[0].price) : "Price unavailable"}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </SiteLayout>
  );
}
