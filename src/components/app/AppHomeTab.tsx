import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Search,
  Zap,
  Bike,
  ShieldCheck,
  Clock,
  ArrowRight,
  Plus,
  Check,
  Star,
  MapPin,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { products, bikes, getBike } from "@/lib/data";
import { toast } from "sonner";

export function AppHomeTab({
  onSelectCategory,
  onOpenOrders,
}: {
  onSelectCategory: (category: string) => void;
  onOpenOrders: () => void;
}) {
  const { cart, addToCart, activeBikeId, setActiveBikeId, orders } = useStore();
  const [searchQuery, setSearchQuery] = useState("");

  const activeBike = activeBikeId ? getBike(activeBikeId) : null;
  const recentOrder = orders && orders.length > 0 ? orders[0] : null;

  // Filter products by bike fitment if selected, and limit to featured mobile items
  const featured = products
    .filter((p) => {
      if (!activeBikeId) return true;
      return !p.compatibleBikeIds || p.compatibleBikeIds.includes(activeBikeId);
    })
    .slice(0, 8);

  const handleAddToCart = (e: React.MouseEvent, product: (typeof products)[0]) => {
    e.stopPropagation();
    addToCart(product, 1);
    toast.success(`Added ${product.name} to cart`, {
      description: "Ready for Delhi express 30-min dispatch",
      duration: 2000,
    });
  };

  return (
    <div className="space-y-4 pb-6">
      {/* 1. Quick Vehicle Fitment Pill */}
      <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-red-600/10 via-zinc-900 to-zinc-900 p-3 border border-red-500/20">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-600 text-white shadow-md shadow-red-600/30">
            <Bike className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              Selected Vehicle
            </div>
            <div className="text-sm font-bold text-white">
              {activeBike ? `${activeBike.brand} ${activeBike.model}` : "All Vehicles (Universal)"}
            </div>
          </div>
        </div>
        <select
          value={activeBikeId || ""}
          onChange={(e) => setActiveBikeId(e.target.value || null)}
          className="rounded-lg bg-zinc-800/90 px-2.5 py-1.5 text-xs font-semibold text-zinc-200 border border-zinc-700 focus:outline-none focus:ring-1 focus:ring-red-500"
        >
          <option value="">Switch Bike</option>
          {bikes.map((b) => (
            <option key={b.id} value={b.id}>
              {b.brand} {b.model}
            </option>
          ))}
        </select>
      </div>

      {/* 2. Active Order Tracker Strip (if any) */}
      {recentOrder && (
        <div
          onClick={onOpenOrders}
          className="flex cursor-pointer items-center justify-between rounded-xl bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-zinc-900 p-3 border border-emerald-500/30 shadow-sm"
        >
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 animate-pulse">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
                <span>ACTIVE ORDER</span>
                <span className="text-zinc-500">•</span>
                <span className="text-zinc-300">{recentOrder.id}</span>
              </div>
              <div className="text-xs text-zinc-300">
                Status: <span className="font-semibold text-emerald-300 uppercase">{recentOrder.status}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
            <span>Track</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </div>
      )}

      {/* 3. Mobile Express Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1c22] via-[#14161a] to-[#0c0d0f] p-4 border border-zinc-800 shadow-lg">
        <div className="flex items-center gap-2 text-xs font-bold text-red-500">
          <Zap className="h-4 w-4 fill-red-500" />
          <span>DELHI / NCR EXPRESS DISPATCH</span>
        </div>
        <h2 className="mt-1 text-lg font-black tracking-tight text-white">
          Certified EV Batteries & Spares
        </h2>
        <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
          Guaranteed OEM fitment with on-demand rider installation in Delhi.
        </p>

        <div className="mt-3 flex items-center gap-3 text-[11px] text-zinc-400">
          <div className="flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>3-Yr Warranty</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-amber-400" />
            <span>30-Min Fitment</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-blue-400" />
            <span>Live GPS</span>
          </div>
        </div>
      </div>

      {/* 4. Quick Category Pills */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Quick Categories
          </h3>
          <button
            onClick={() => onSelectCategory("all")}
            className="text-xs font-semibold text-red-400 hover:text-red-300"
          >
            See All
          </button>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[
            { id: "batteries", label: "Batteries", icon: Zap, color: "text-amber-400" },
            { id: "chargers", label: "Chargers", icon: Clock, color: "text-blue-400" },
            { id: "spares", label: "Spares", icon: ShieldCheck, color: "text-emerald-400" },
            { id: "bikes", label: "E-Bikes", icon: Bike, color: "text-red-400" },
          ].map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className="flex flex-col items-center justify-center rounded-xl bg-zinc-900/80 p-2.5 border border-zinc-800 transition active:scale-95 hover:border-zinc-700"
              >
                <div className={`mb-1 flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 ${cat.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-[11px] font-semibold text-zinc-300">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Compatible Featured Products */}
      <div>
        <div className="mb-2.5 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Recommended For You</h3>
            <p className="text-[11px] text-zinc-400">
              {activeBike ? `Verified fit for ${activeBike.model}` : "Top selling EV components"}
            </p>
          </div>
          <Link
            to="/shop"
            className="flex items-center gap-1 text-xs font-semibold text-red-500"
          >
            <span>View Catalog</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {featured.map((p) => {
            const inCart = cart.some((c) => c.product.id === p.id);
            return (
              <div
                key={p.id}
                className="group flex flex-col justify-between overflow-hidden rounded-xl bg-zinc-900/90 border border-zinc-800 p-2.5 transition active:scale-[0.98]"
              >
                <div>
                  <div className="relative mb-2 aspect-square overflow-hidden rounded-lg bg-zinc-800">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-full w-full object-cover transition group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-1.5 left-1.5 rounded bg-zinc-900/80 px-1.5 py-0.5 text-[9px] font-bold text-red-400 backdrop-blur">
                      ₹{p.price.toLocaleString("en-IN")}
                    </div>
                  </div>

                  <h4 className="line-clamp-2 text-xs font-semibold text-zinc-100 leading-snug">
                    {p.name}
                  </h4>
                  <div className="mt-1 flex items-center gap-1 text-[10px] text-zinc-400">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span>4.8</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-medium">In Stock</span>
                  </div>
                </div>

                <button
                  onClick={(e) => handleAddToCart(e, p)}
                  className={`mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-bold transition ${
                    inCart
                      ? "bg-emerald-600 text-white"
                      : "bg-red-600 text-white active:bg-red-700 shadow-sm shadow-red-600/30"
                  }`}
                >
                  {inCart ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>In Cart</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
