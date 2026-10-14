import React, { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { ShoppingCart, Check, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { products as staticProducts, bestOffer, inr, type Product } from "@/lib/data";
import { useStore } from "@/lib/store";

type ProductTab = "batteries" | "chargers" | "spares" | "accessories";

export function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState<ProductTab>("batteries");
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const { addToCart, cart, activeBikeId } = useStore();

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          const mapped: Product[] = data.data.map((p: any) => ({
            id: p.id,
            name: p.name,
            brand: p.brand || "Vendor Certified",
            category: (p.category_name || p.category || "Spare Parts") as any,
            image: p.image_url || "/src/assets/parts.jpg",
            desc: p.description || "",
            fits: Array.isArray(p.compatible_vehicles) ? p.compatible_vehicles : ["Universal EV"],
            rating: Number(p.rating) || 4.8,
            reviewsCount: Number(p.reviews_count) || 12,
            offers: [
              {
                vendorId: p.seller_id || "v_01",
                price: Number(p.price) || 999,
                mrp: Number(p.mrp) || Math.round(Number(p.price || 999) * 1.2),
                deliveryDays: 2,
                deliveryFee: 0,
                stock: Number(p.stock ?? 10),
                warrantyMonths: 12,
                isRecommended: true,
              },
            ],
          }));
          setDbProducts(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const allAvailableProducts = dbProducts.length > 0 ? dbProducts : staticProducts;

  const getFilteredProducts = (): Product[] => {
    switch (activeTab) {
      case "batteries":
        return allAvailableProducts.filter((p) => p.category.toLowerCase().includes("batter")).slice(0, 8);
      case "chargers":
        return allAvailableProducts.filter((p) => p.category.toLowerCase().includes("charg")).slice(0, 8);
      case "spares":
        return allAvailableProducts
          .filter((p) =>
            ["spare parts", "brakes", "motor", "controller", "bms", "brakes"].some((c) => p.category.toLowerCase().includes(c))
          )
          .slice(0, 8);
      case "accessories":
        return allAvailableProducts
          .filter((p) =>
            ["accessories", "riding", "gear", "helmets"].some((c) => p.category.toLowerCase().includes(c))
          )
          .slice(0, 8);
      default:
        return allAvailableProducts.slice(0, 8);
    }
  };

  const currentProducts = getFilteredProducts();

  const handleAddToCart = (p: Product) => {
    const offer = bestOffer(p);
    if (offer.stock === 0) {
      toast.error("This product is currently out of stock.");
      return;
    }
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

        {/* Products Grid: 2 columns on mobile, 4 columns on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
          {currentProducts.map((p) => {
            const offer = bestOffer(p);
            const isInCart = cart.some((c) => c.productId === p.id);
            const isOutOfStock = offer.stock === 0;
            const isLowStock = offer.stock <= 5 && offer.stock > 0;

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

                    {/* Stock Badges */}
                    {isLowStock ? (
                      <span className="absolute top-2 right-2 rounded-md bg-amber-500 text-white text-[9.5px] font-bold px-1.5 py-0.5 shadow-xs">
                        Hurry! Limited stock
                      </span>
                    ) : isOutOfStock ? (
                      <span className="absolute top-2 right-2 rounded-md bg-gray-900 text-white text-[9.5px] font-bold px-1.5 py-0.5 shadow-xs">
                        Out of Stock
                      </span>
                    ) : null}
                  </div>

                  {/* Compatible-with chip */}
                  <div className="mb-1.5 sm:mb-2">
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 border border-emerald-200/80 px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-semibold text-emerald-800 truncate max-w-full">
                      <ShieldCheck className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-emerald-600 shrink-0" />
                      <span className="truncate">Fits {p.fits?.length ? `${p.fits.length} EVs` : "Universal"}</span>
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
                    disabled={isOutOfStock}
                    className={`flex h-8 sm:h-9 items-center justify-center gap-1 sm:gap-1.5 rounded-xl px-2.5 sm:px-3.5 text-[11px] sm:text-xs font-semibold transition active:scale-95 shrink-0 ${
                      isOutOfStock
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                        : isInCart
                        ? "bg-emerald-600 text-white cursor-pointer"
                        : "bg-[#e11d2a] hover:bg-[#c91823] text-white shadow-xs cursor-pointer"
                    }`}
                  >
                    {isOutOfStock ? (
                      <span>Sold Out</span>
                    ) : isInCart ? (
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
      </div>
    </section>
  );
}
