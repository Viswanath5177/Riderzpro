import React, { useState } from "react";
import {
  Zap,
  Bike,
  ShieldCheck,
  Clock,
  ArrowRight,
  Plus,
  Minus,
  Check,
  Star,
  MapPin,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { products, bikes, getBike, bestOffer, inr, type Product } from "@/lib/data";
import { toast } from "sonner";

export function AppHomeTab({
  searchQuery = "",
  onSelectCategory,
  onOpenOrders,
  onTriggerLogin,
}: {
  searchQuery?: string;
  onSelectCategory: (category: string) => void;
  onOpenOrders: () => void;
  onTriggerLogin: () => void;
}) {
  const { cart, addToCart, setQty, activeBikeId, setActiveBikeId, orders } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const activeBike = activeBikeId ? getBike(activeBikeId) : null;
  const recentOrder = orders && orders.length > 0 ? orders[0] : null;

  // Filter products by bike fitment, category, and live search
  const filteredProducts = products.filter((p) => {
    // 1. Vehicle Fitment check
    if (activeBikeId && p.fits && p.fits.length > 0 && !p.fits.includes(activeBikeId)) {
      return false;
    }
    // 2. Category Filter check
    if (selectedCategory !== "all") {
      const matchCat = p.category.toLowerCase().includes(selectedCategory.toLowerCase());
      if (!matchCat) return false;
    }
    // 3. Search Query check
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchCat = p.category.toLowerCase().includes(q);
      const matchBrand = (p.brand || "").toLowerCase().includes(q);
      if (!matchName && !matchCat && !matchBrand) return false;
    }
    return true;
  });

  const handleAdd = (product: Product) => {
    const offer = bestOffer(product);
    addToCart(product.id, offer.vendorId, 1);
    toast.success(`Added ${product.name} to cart`, {
      description: "Ready for Delhi express 30-min dispatch",
      duration: 2000,
    });
  };

  const handleIncrement = (product: Product, currentQty: number) => {
    const offer = bestOffer(product);
    setQty(product.id, offer.vendorId, currentQty + 1);
  };

  const handleDecrement = (product: Product, currentQty: number) => {
    const offer = bestOffer(product);
    setQty(product.id, offer.vendorId, Math.max(0, currentQty - 1));
  };

  return (
    <div className="space-y-3.5 pb-6">
      {/* 1. Blinkit-Style Clean Vehicle Fitment Selector Card */}
      <div className="flex items-center justify-between rounded-2xl bg-white p-3 border border-gray-200/80 shadow-2xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 border border-red-100">
            <Bike className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              YOUR EV VEHICLE
            </div>
            <div className="text-xs font-extrabold text-gray-900 truncate">
              {activeBike ? `${activeBike.make} ${activeBike.model}` : "All Compatible Rides"}
            </div>
          </div>
        </div>

        <select
          value={activeBikeId || ""}
          onChange={(e) => setActiveBikeId(e.target.value || null)}
          className="rounded-xl bg-gray-50 hover:bg-gray-100 px-2.5 py-1.5 text-xs font-bold text-gray-800 border border-gray-200 focus:outline-none focus:border-red-600 transition shrink-0"
        >
          <option value="">Switch Ride</option>
          {bikes.map((b) => (
            <option key={b.id} value={b.id}>
              {b.make} {b.model}
            </option>
          ))}
        </select>
      </div>

      {/* 2. Active Order Live Pill (if any) */}
      {recentOrder && (
        <div
          onClick={onOpenOrders}
          className="flex cursor-pointer items-center justify-between rounded-2xl bg-emerald-50 p-3 border border-emerald-200/90 shadow-2xs transition active:scale-[0.99]"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-2xs">
              <Zap className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-emerald-800">
                <span>ORDER IN PROGRESS</span>
                <span className="text-emerald-400">•</span>
                <span className="truncate">{recentOrder.id}</span>
              </div>
              <div className="text-[11px] text-emerald-700">
                Arriving in <span className="font-bold">25 mins</span> to Delhi
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-emerald-800 bg-white/80 px-2.5 py-1 rounded-xl shrink-0">
            <span>Track</span>
            <ArrowRight className="h-3 w-3" />
          </div>
        </div>
      )}

      {/* 3. Blinkit Express Category Pills Rail */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: "all", label: "⚡ All Parts" },
          { id: "battery", label: "🔋 Batteries" },
          { id: "charger", label: "🔌 Fast Chargers" },
          { id: "bms", label: "🛡️ Smart BMS" },
          { id: "spare", label: "🛠️ Spares & Motors" },
        ].map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-extrabold transition active:scale-95 ${
                isActive
                  ? "bg-red-600 text-white shadow-xs"
                  : "bg-white text-gray-700 border border-gray-200/90 hover:bg-gray-50"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* 4. Product Catalog Grid (Blinkit Card Design) */}
      <div>
        <div className="mb-2.5 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-extrabold text-gray-900 tracking-tight">
              {activeBike ? `Certified for ${activeBike.model}` : "EV Essentials (Delhi Express)"}
            </h2>
            <p className="text-[11px] text-gray-500">
              {filteredProducts.length} verified products ready for 30m dispatch
            </p>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
            <p className="text-xs font-bold text-gray-700">No parts found matching your filter</p>
            <p className="text-[11px] text-gray-400 mt-1">Try switching vehicle or category</p>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setActiveBikeId(null);
              }}
              className="mt-3 rounded-xl bg-red-600 px-4 py-1.5 text-xs font-bold text-white shadow-2xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5">
            {filteredProducts.slice(0, 16).map((p) => {
              const offer = bestOffer(p);
              const cartItem = cart.find((c) => c.productId === p.id);
              const inCart = Boolean(cartItem && cartItem.qty > 0);
              const qty = cartItem ? cartItem.qty : 0;

              return (
                <div
                  key={p.id}
                  className="group flex flex-col justify-between overflow-hidden rounded-2xl bg-white border border-gray-200/90 p-2.5 transition shadow-2xs hover:shadow-md"
                >
                  <div>
                    {/* Image Container with 30m tag */}
                    <div className="relative mb-2 aspect-square overflow-hidden rounded-xl bg-gray-50 border border-gray-100">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="h-full w-full object-cover transition group-hover:scale-105"
                        loading="lazy"
                      />
                      {/* Blinkit Delivery Tag */}
                      <div className="absolute top-1.5 left-1.5 rounded-md bg-amber-400 px-1.5 py-0.5 text-[9px] font-black uppercase text-gray-950 shadow-2xs">
                        ⏱ 30 MINS
                      </div>
                    </div>

                    {/* Fitment badge */}
                    <div className="mb-1">
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700">
                        <Check className="h-2.5 w-2.5 text-emerald-600 stroke-[3]" />
                        <span className="truncate">
                          {activeBike ? `Fits ${activeBike.model}` : p.fits?.length ? `Fits ${p.fits.length} EVs` : "Universal"}
                        </span>
                      </span>
                    </div>

                    {/* Product Name */}
                    <h3 className="line-clamp-2 text-xs font-bold text-gray-900 leading-snug">
                      {p.name}
                    </h3>
                  </div>

                  {/* Price & Blinkit ADD Button */}
                  <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between gap-1">
                    <div>
                      <p className="text-xs font-extrabold text-gray-900 font-mono">
                        {inr(offer.price)}
                      </p>
                      {p.mrp && p.mrp > offer.price && (
                        <p className="text-[10px] text-gray-400 line-through">
                          {inr(p.mrp)}
                        </p>
                      )}
                    </div>

                    {/* Blinkit Stepper or ADD Button */}
                    {inCart ? (
                      <div className="flex items-center rounded-xl bg-emerald-600 text-white font-extrabold text-xs shadow-2xs overflow-hidden">
                        <button
                          onClick={() => handleDecrement(p, qty)}
                          className="px-2 py-1.5 hover:bg-emerald-700 transition active:scale-95"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3 stroke-[3]" />
                        </button>
                        <span className="w-4 text-center text-xs font-bold">{qty}</span>
                        <button
                          onClick={() => handleIncrement(p, qty)}
                          className="px-2 py-1.5 hover:bg-emerald-700 transition active:scale-95"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3 stroke-[3]" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAdd(p)}
                        className="rounded-xl border-2 border-red-600 bg-red-50 hover:bg-red-100 px-3 py-1 text-xs font-extrabold text-red-600 transition active:scale-95 shadow-2xs"
                      >
                        ADD
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
