import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ShoppingCart, Check, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { products, bestOffer, inr, type Product } from "@/lib/data";
import { useStore } from "@/lib/store";

type ProductTab = "all" | "amplifiers" | "multimedia" | "interior" | "utilities";

export function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState<ProductTab>("all");
  const { addToCart, cart } = useStore();

  const getFilteredProducts = (): Product[] => {
    switch (activeTab) {
      case "all":
        return products;
      case "amplifiers":
        return products.filter((p) => p.category === "Amplifiers");
      case "multimedia":
        return products.filter(
          (p) =>
            p.department === "Multimedia" ||
            [
              "Amplifiers",
              "Speakers",
              "Subwoofers",
              "Displays & Head Units",
              "Cameras & Security",
              "Accessories",
            ].includes(p.category)
        );
      case "interior":
        return products.filter(
          (p) =>
            p.department === "Interior" ||
            ["Seat Covers", "Wiring & Installation"].includes(p.category)
        );
      case "utilities":
        return products.filter(
          (p) =>
            p.department === "Exterior" ||
            p.department === "Utilities" ||
            ["Exterior Accessories", "Tyre Care & Utilities"].includes(p.category)
        );
      default:
        return products;
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
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
                Real Live Catalog · 17 Genuine Products
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-[36px] font-bold tracking-tight text-[#111111]">
              Popular for your ride
            </h2>
            <p className="text-sm text-[#6b7280] mt-1">
              Top-rated components with verified compatibility & Noida warehouse dispatch
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex rounded-xl bg-white border border-[#ececec] p-1 self-start sm:self-auto overflow-x-auto max-w-full">
            {(
              [
                { id: "all", label: `All (${products.length})` },
                { id: "amplifiers", label: "Amplifiers" },
                { id: "multimedia", label: "Audio & Multimedia" },
                { id: "interior", label: "Interior & Comfort" },
                { id: "utilities", label: "Utilities & Care" },
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

        {/* Products Grid: 2 columns on mobile, 4 columns on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
          {currentProducts.map((p) => {
            const offer = bestOffer(p);
            const isInCart = cart.some((c) => c.productId === p.id);

            return (
              <div
                key={p.id}
                className="group flex flex-col justify-between rounded-2xl border border-[#ececec] bg-white p-3 sm:p-4 transition-all duration-200 hover:border-gray-300 hover:shadow-md"
              >
                <div>
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden rounded-xl bg-[#f7f7f8] mb-2.5 sm:mb-3.5">
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
                  <div className="mb-1.5 sm:mb-2">
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 border border-emerald-200/80 px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-semibold text-emerald-800 truncate max-w-full">
                      <ShieldCheck className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-emerald-600 shrink-0" />
                      <span className="truncate">Fits {p.fits.length ? `${p.fits.length} EVs` : "Universal"}</span>
                    </span>
                  </div>

                  {/* Product Name */}
                  <Link to="/product/$id" params={{ id: p.id }}>
                    <h3 className="text-xs sm:text-sm font-bold text-[#111111] line-clamp-2 hover:text-[#e11d2a] transition leading-snug">
                      {p.name}
                    </h3>
                  </Link>
                </div>

                {/* Price & Add to Cart */}
                <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-[#ececec] flex items-center justify-between gap-1.5">
                  <div className="min-w-0">
                    <span className="text-[10px] sm:text-xs text-[#6b7280] block">From</span>
                    <p className="text-xs sm:text-base font-extrabold text-[#111111] tabular-nums truncate">
                      {inr(offer.price)}
                    </p>
                  </div>

                  <button
                    onClick={() => handleAddToCart(p)}
                    className={`flex h-8 sm:h-9 items-center justify-center gap-1 sm:gap-1.5 rounded-xl px-2.5 sm:px-3.5 text-[11px] sm:text-xs font-semibold transition active:scale-95 cursor-pointer shrink-0 ${
                      isInCart
                        ? "bg-emerald-600 text-white"
                        : "bg-[#e11d2a] hover:bg-[#c91823] text-white shadow-xs"
                    }`}
                  >
                    {isInCart ? (
                      <>
                        <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        <span className="hidden xs:inline">Added</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        <span>Add</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Link to Full Catalog */}
        <div className="mt-10 text-center">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 rounded-xl bg-[#111111] hover:bg-black text-white px-6 py-3 text-xs sm:text-sm font-bold shadow-sm transition hover:shadow-md cursor-pointer"
          >
            <span>Explore All 17 Live Products in Store Catalog</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
