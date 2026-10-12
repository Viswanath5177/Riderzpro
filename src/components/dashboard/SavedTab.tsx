import { Link } from "@tanstack/react-router";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { getBike, inr, products } from "@/lib/data";

export function SavedTab() {
  const { savedProductIds, toggleSaved, addToCart, garage, activeBikeId } = useStore();

  const activeBike = garage.find((b) => b.bikeId === activeBikeId) || garage[0];
  const activeBikeMeta = activeBike ? getBike(activeBike.bikeId) : null;

  const savedProducts = products.filter((p) => savedProductIds.includes(p.id));

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 font-display">Saved Parts & Wishlist</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Components, fast chargers, and accessories saved for future maintenance and bike upgrades.
          </p>
        </div>
        <Link
          to="/shop"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-primary text-white text-xs font-semibold shadow-xs hover:bg-emerald-600 transition self-start sm:self-auto"
        >
          <ShoppingBag className="h-4 w-4" />
          <span>Shop More Parts</span>
        </Link>
      </div>

      {savedProducts.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <Heart className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="text-base font-bold text-gray-800 font-display">Your Wishlist is Empty</p>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            Browse compatible EV batteries, replacement chargers, and brake pads, and tap the heart icon to save items here.
          </p>
          <Link
            to="/shop"
            className="mt-5 inline-block px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold shadow-xs hover:bg-emerald-600 transition"
          >
            Explore Compatible Parts
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {savedProducts.map((p) => {
            const offer = p.offers[0];
            const isFit = activeBike ? p.fits.includes(activeBike.bikeId) : false;

            return (
              <div
                key={p.id}
                className="rounded-3xl border border-gray-200 bg-white overflow-hidden shadow-2xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div className="relative aspect-[4/3] bg-gray-100">
                  <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full bg-white/90 text-gray-800 text-[10px] font-bold shadow-2xs">
                      {p.category}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      toggleSaved(p.id);
                      toast.info(`${p.name} removed from saved`);
                    }}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-rose-500 hover:bg-rose-50 shadow-2xs transition"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    {isFit && activeBikeMeta && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-bold">
                        ✓ Verified for {activeBikeMeta.make} {activeBikeMeta.model}
                      </span>
                    )}
                    <Link
                      to="/product/$id"
                      params={{ id: p.id }}
                      className="block text-base font-bold text-gray-900 hover:text-primary transition mt-1.5"
                    >
                      {p.name}
                    </Link>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{p.description}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      Brand: {p.brand} · Warranty: {p.warrantyMonths} months
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="text-lg font-extrabold text-gray-900">{inr(offer.price)}</p>
                      <span className="text-[10px] text-emerald-600 font-semibold">In stock at {offer.stock} units</span>
                    </div>

                    <button
                      onClick={() => {
                        addToCart(p.id, offer.vendorId);
                        toast.success(`${p.name} added to cart`);
                      }}
                      className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold shadow-xs hover:bg-emerald-600 active:scale-95 transition flex items-center gap-1.5"
                    >
                      <ShoppingBag className="h-3.5 w-3.5" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
