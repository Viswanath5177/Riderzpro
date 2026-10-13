import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ShoppingCart, Check, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { products, bestOffer, inr, type Product } from "@/lib/data";
import { useStore } from "@/lib/store";

type ProductTab = "batteries" | "chargers" | "spares" | "accessories";

export function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState<ProductTab>("batteries");
  const { addToCart, cart, activeBikeId } = useStore();

  const getFilteredProducts = (): Product[] => {
    switch (activeTab) {
      case "batteries":
        return products.filter((p) => p.category === "Battery").slice(0, 8);
      case "chargers":
        return products.filter((p) => p.category === "Charger").slice(0, 8);
      case "spares":
        return products
          .filter((p) =>
            ["Spare Parts", "Brakes", "Motor", "Controller", "BMS"].includes(p.category)
          )
          .slice(0, 8);
      case "accessories":
        return products
          .filter((p) =>
            ["Bike Accessories", "Car Accessories", "Riding Gear & Helmets"].includes(
              p.category
            )
          )
          .slice(0, 8);
      default:
        return products.slice(0, 8);
    }
  };

  const currentProducts = getFilteredProducts();

  const handleAddToCart = (p: Product) => {
    const offer = bestOffer(p);
    addToCart(p.id, offer.vendorId);
    toast.success("Added to cart", {
      description: `${p.name} added to your shopping bag.`,
    });
  };

  return (
    <section className="bg-[#f7f7f8] py-16 lg:py-24 border-b border-[#ececec]">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        {/* Section Header: H2 + Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 lg:mb-12">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-[36px] font-bold tracking-tight text-[#111111]">
              Popular for your ride
            </h2>
            <p className="text-sm text-[#6b7280] mt-1">
              Top-rated components with verified compatibility
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex rounded-xl bg-white border border-[#ececec] p-1 self-start sm:self-auto overflow-x-auto max-w-full">
            {(
              [
                { id: "batteries", label: "Batteries" },
                { id: "chargers", label: "Chargers" },
                { id: "spares", label: "Spares" },
                { id: "accessories", label: "Accessories" },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                  activeTab === t.id
                    ? "bg-[#e11d2a] text-white shadow-xs"
                    : "text-[#6b7280] hover:text-[#111111]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Cards per row, horizontal scroll on mobile, max 8 products */}
        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-5 overflow-x-auto pb-4 sm:pb-0 snap-x">
          {currentProducts.map((p) => {
            const offer = bestOffer(p);
            const isInCart = cart.some((c) => c.productId === p.id);

            return (
              <div
                key={p.id}
                className="group flex flex-col justify-between rounded-2xl border border-[#ececec] bg-white p-4 transition-all duration-200 hover:border-gray-300 hover:shadow-md min-w-[260px] sm:min-w-0 snap-start shrink-0 sm:shrink"
              >
                <div>
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden rounded-xl bg-[#f7f7f8] mb-3.5">
                    <Link to="/product/$id" params={{ id: p.id }}>
                      <img
                        src={p.image}
                        alt={p.name}
                        loading="lazy"
                        width={400}
                        height={400}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </Link>
                  </div>

                  {/* Compatible-with chip */}
                  <div className="mb-2">
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                      <ShieldCheck className="h-3 w-3 text-emerald-600" />
                      <span>Fits {p.fits.length ? `${p.fits.length} EV Models` : "Universal"}</span>
                    </span>
                  </div>

                  {/* Product Name */}
                  <Link to="/product/$id" params={{ id: p.id }}>
                    <h3 className="text-sm font-bold text-[#111111] line-clamp-2 hover:text-[#e11d2a] transition">
                      {p.name}
                    </h3>
                  </Link>
                </div>

                {/* Price & Add to Cart */}
                <div className="mt-4 pt-3 border-t border-[#ececec] flex items-center justify-between">
                  <div>
                    <span className="text-xs text-[#6b7280]">From</span>
                    <p className="text-base font-extrabold text-[#111111] tabular-nums">
                      {inr(offer.price)}
                    </p>
                  </div>

                  <button
                    onClick={() => handleAddToCart(p)}
                    className={`flex h-9 items-center justify-center gap-1.5 rounded-xl px-3.5 text-xs font-semibold transition active:scale-95 cursor-pointer ${
                      isInCart
                        ? "bg-emerald-600 text-white"
                        : "bg-[#e11d2a] hover:bg-[#c91823] text-white shadow-xs"
                    }`}
                  >
                    {isInCart ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-3.5 w-3.5" />
                        <span>Add</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
