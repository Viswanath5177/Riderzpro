import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Heart, ShoppingBag, Trash2, ArrowRight, RefreshCw, AlertCircle, Loader2, Sparkles, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { getBike, inr } from "@/lib/data";

export function SavedTab() {
  const {
    wishlistItems,
    isLoadingWishlist,
    wishlistError,
    fetchWishlist,
    toggleSaved,
    addToCart,
    garage,
    activeBikeId,
  } = useStore();

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const activeBike = garage.find((b) => b.bikeId === activeBikeId) || garage[0];
  const activeBikeMeta = activeBike ? getBike(activeBike.bikeId) : null;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-gray-900 font-display">Saved Parts & Wishlist</h1>
            {!isLoadingWishlist && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 text-[#E31E24] border border-red-100">
                {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Components, fast chargers, and accessories saved for future maintenance and bike upgrades.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => fetchWishlist()}
            disabled={isLoadingWishlist}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl border border-gray-200 bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-xs font-semibold shadow-2xs transition cursor-pointer"
            title="Refresh wishlist"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoadingWishlist ? "animate-spin text-[#E31E24]" : ""}`} />
            <span>Sync</span>
          </button>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#E31E24] hover:bg-red-700 text-white text-xs font-semibold shadow-xs transition"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Shop More Parts</span>
          </Link>
        </div>
      </div>

      {/* STATE 1: LOADING */}
      {isLoadingWishlist && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((idx) => (
            <div
              key={idx}
              className="rounded-3xl border border-gray-100 bg-white p-4 shadow-2xs space-y-4 animate-pulse"
            >
              <div className="aspect-[4/3] rounded-2xl bg-gray-100 w-full" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-100 rounded-md w-3/4" />
                <div className="h-3 bg-gray-50 rounded-md w-1/2" />
              </div>
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <div className="h-5 bg-gray-100 rounded-md w-20" />
                <div className="h-8 bg-gray-100 rounded-xl w-24" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* STATE 2: ERROR WITH RETRY */}
      {!isLoadingWishlist && wishlistError && (
        <div className="rounded-3xl border border-red-200 bg-red-50/50 p-8 text-center space-y-3">
          <div className="h-10 w-10 rounded-full bg-red-100 text-[#E31E24] flex items-center justify-center mx-auto">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-base font-bold text-gray-900">Failed to load your wishlist</p>
            <p className="text-xs text-gray-500 mt-1">{wishlistError}</p>
          </div>
          <button
            type="button"
            onClick={() => fetchWishlist()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E31E24] text-white text-xs font-semibold hover:bg-red-700 transition cursor-pointer shadow-xs"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Retry Connection</span>
          </button>
        </div>
      )}

      {/* STATE 3: EMPTY WISHLIST */}
      {!isLoadingWishlist && !wishlistError && wishlistItems.length === 0 && (
        <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <div className="h-14 w-14 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center mx-auto mb-3.5">
            <Heart className="h-7 w-7 text-gray-300" />
          </div>
          <p className="text-base font-bold text-gray-800 font-display">Your Wishlist is Empty</p>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            Browse compatible EV batteries, replacement chargers, and brake pads, and tap the heart icon to save items here.
          </p>
          <Link
            to="/shop"
            className="mt-5 inline-block px-5 py-2.5 rounded-xl bg-[#E31E24] hover:bg-red-700 text-white text-xs font-semibold shadow-xs transition"
          >
            Explore Compatible Parts
          </Link>
        </div>
      )}

      {/* STATE 4: POPULATED WISHLIST GRID */}
      {!isLoadingWishlist && !wishlistError && wishlistItems.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {wishlistItems.map((p) => {
            const prodId = p.product_id || p.id;
            const stock = typeof p.stock === "number" ? p.stock : 10;
            const isOutOfStock = stock === 0;
            const isLowStock = stock > 0 && stock <= 5;
            const discountPct = p.discount_percent || 0;
            const imgUrl = p.image_url || p.image || "/src/assets/parts.jpg";

            // Verify fitment with active bike
            let isFit = false;
            if (activeBike && p.compatible_vehicles) {
              const comp = Array.isArray(p.compatible_vehicles)
                ? p.compatible_vehicles
                : typeof p.compatible_vehicles === "string"
                ? [p.compatible_vehicles]
                : [];
              isFit = comp.includes(activeBike.bikeId) || p.fitment_type === "universal";
            }

            return (
              <div
                key={p.item_id || prodId}
                className="rounded-3xl border border-gray-200 bg-white overflow-hidden shadow-2xs hover:shadow-md transition flex flex-col justify-between group"
              >
                {/* Image Section */}
                <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
                  <Link to="/product/$id" params={{ id: prodId }} className="block h-full w-full">
                    <img
                      src={imgUrl}
                      alt={p.name}
                      loading="lazy"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/src/assets/parts.jpg";
                      }}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </Link>

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
                    {p.category && (
                      <span className="px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs border border-gray-200 text-gray-800 text-[10px] font-bold shadow-2xs">
                        {p.category}
                      </span>
                    )}
                    {discountPct > 0 && (
                      <span className="px-2 py-0.5 rounded-md bg-[#E31E24] text-white text-[10px] font-bold shadow-xs">
                        {discountPct}% OFF
                      </span>
                    )}
                    {isLowStock && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-600 text-white text-[10px] font-bold shadow-2xs">
                        Hurry limited Stock
                      </span>
                    )}
                    {isOutOfStock && (
                      <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-bold shadow-2xs">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  {/* Remove from Wishlist Heart/Trash Button */}
                  <button
                    type="button"
                    onClick={async (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const ok = await toggleSaved(prodId);
                      if (ok) {
                        toast.info(`${p.name} removed from wishlist`);
                      }
                    }}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/95 backdrop-blur-xs border border-gray-200 text-rose-500 hover:bg-rose-50 shadow-2xs transition hover:scale-110 cursor-pointer"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Content Section */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    {isFit && activeBikeMeta && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-bold mb-1.5">
                        <CheckCircle className="h-3 w-3" />
                        Verified for {activeBikeMeta.make} {activeBikeMeta.model}
                      </span>
                    )}
                    <Link
                      to="/product/$id"
                      params={{ id: prodId }}
                      className="block text-base font-bold text-gray-900 hover:text-[#E31E24] transition line-clamp-1"
                    >
                      {p.name}
                    </Link>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                      {p.description || "Authentic certified automotive component for electric vehicles."}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mt-2.5">
                      {p.brand && <span>Brand: <strong className="text-gray-600 font-semibold">{p.brand}</strong></span>}
                      {p.warranty_months ? (
                        <span>· Warranty: <strong className="text-gray-600 font-semibold">{p.warranty_months} mo</strong></span>
                      ) : null}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="text-lg font-extrabold text-gray-900">{inr(p.price || 0)}</p>
                      {isLowStock ? (
                        <span className="text-[10px] text-amber-700 font-bold flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                          Hurry limited Stock ({stock} left)
                        </span>
                      ) : isOutOfStock ? (
                        <span className="text-[10px] text-rose-600 font-bold">Currently unavailable</span>
                      ) : (
                        <span className="text-[10px] text-emerald-600 font-semibold">In stock ({stock} units)</span>
                      )}
                    </div>

                    <button
                      type="button"
                      disabled={isOutOfStock}
                      onClick={() => {
                        addToCart(prodId, p.seller_id || "v_01");
                        toast.success(`${p.name} added to cart`);
                      }}
                      className="px-4 py-2 rounded-xl bg-[#E31E24] hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold shadow-xs active:scale-95 transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <ShoppingBag className="h-3.5 w-3.5" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>

                {/* Low Stock Warning Banner */}
                {isLowStock && (
                  <div className="bg-amber-50 border-t border-amber-200/90 px-4 py-1.5 flex items-center justify-between text-[11px] font-bold text-amber-800">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping shrink-0" />
                      <span>Hurry limited Stock</span>
                    </span>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-200/70 px-1.5 py-0.5 rounded">
                      Only {stock} left
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
