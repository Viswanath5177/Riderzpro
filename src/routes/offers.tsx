import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Tag, Copy, Check, ArrowRight, ShieldCheck, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/SiteLayout";
import { inr } from "@/lib/data";

export const Route = createFileRoute("/offers")({
  head: () => ({
    meta: [
      { title: "Offers & Discount Coupons — Riderzpro" },
      {
        name: "description",
        content: "Save on EV batteries, chargers, spare parts and accessories with verified discount coupons.",
      },
    ],
  }),
  component: OffersPage,
});

interface CouponItem {
  id: string;
  code: string;
  description?: string;
  discount_type?: "percentage" | "fixed";
  discount_value?: number;
  minimum_order_value?: number;
  maximum_discount?: number;
  category?: string;
}

interface ProductItem {
  id: string;
  name: string;
  price: number;
  mrp?: number;
  image_url?: string;
  category?: string;
  category_name?: string;
  stock?: number;
}

function OffersPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [coupons, setCoupons] = useState<CouponItem[]>([]);
  const [isLoadingCoupons, setIsLoadingCoupons] = useState(true);
  const [discountedProducts, setDiscountedProducts] = useState<ProductItem[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  useEffect(() => {
    fetch("/api/coupons")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.coupons)) {
          setCoupons(data.coupons);
        }
      })
      .catch((err) => console.warn("Failed to fetch coupons:", err))
      .finally(() => setIsLoadingCoupons(false));

    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setDiscountedProducts(data.data.slice(0, 4));
        }
      })
      .catch((err) => console.warn("Failed to fetch products:", err))
      .finally(() => setIsLoadingProducts(false));
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon code ${code} copied to clipboard!`);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <SiteLayout>
      <div className="bg-[#f7f7f8] py-12 lg:py-16 border-b border-[#ececec]">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 border border-red-100 px-3 py-1 text-xs font-bold text-[#e11d2a] mb-3">
              <Tag className="h-3.5 w-3.5" />
              <span>Verified Coupons</span>
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111111]">
              Deals, Promos & Vouchers
            </h1>
            <p className="text-base text-[#6b7280] mt-2">
              Apply active coupons during checkout to save on batteries, chargers, and parts.
            </p>
          </div>

          {/* Coupons Grid / Empty State */}
          {isLoadingCoupons ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-44 rounded-2xl border border-[#ececec] bg-white animate-pulse" />
              ))}
            </div>
          ) : coupons.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#d1d5db] bg-white p-8 sm:p-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-[#e11d2a] mb-4">
                <Tag className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold text-[#111111] mb-1">
                No Active Promotional Vouchers
              </h3>
              <p className="text-sm text-[#6b7280] max-w-md mx-auto mb-6">
                There are currently no active public promotional vouchers. Check back soon for seasonal discounts from authorized EV vendors!
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-xl bg-[#e11d2a] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#c91823] transition"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Explore Store Catalog</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {coupons.map((c) => {
                const isCopied = copiedCode === c.code;
                const discountLabel =
                  c.discount_type === "percentage"
                    ? `${c.discount_value}% OFF`
                    : c.discount_value
                    ? `Flat ₹${c.discount_value} OFF`
                    : "Special Discount";

                return (
                  <div
                    key={c.id || c.code}
                    className="flex flex-col justify-between rounded-2xl border border-[#ececec] bg-white p-5 shadow-xs transition hover:shadow-md"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#e11d2a]">
                          {discountLabel}
                        </span>
                        <Tag className="h-4 w-4 text-[#e11d2a]" />
                      </div>
                      <div className="flex items-center justify-between rounded-xl bg-[#f7f7f8] border border-[#ececec] p-2 mb-3">
                        <span className="font-mono text-sm font-extrabold text-[#111111]">
                          {c.code}
                        </span>
                        <button
                          onClick={() => handleCopy(c.code)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-white border border-[#ececec] text-[#111111] hover:text-[#e11d2a] transition cursor-pointer"
                          title="Copy Coupon"
                        >
                          {isCopied ? (
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-[#6b7280] leading-relaxed">
                        {c.description || (c.minimum_order_value ? `Valid on orders above ₹${c.minimum_order_value}` : "Marketplace promotional voucher")}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-[#ececec]">
                      <Link
                        to="/shop"
                        search={{ cat: c.category && c.category !== "All" ? c.category : undefined } as any}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#e11d2a] hover:text-[#c91823] transition"
                      >
                        <span>Shop eligible items</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Featured Deals on Real Hardware */}
      <div className="bg-white py-16">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-[#111111]">
                Special Discounted Hardware
              </h2>
              <p className="text-sm text-[#6b7280] mt-1">
                Hand-picked high performance EV packs and equipment on sale
              </p>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#e11d2a] hover:text-[#c91823]"
            >
              <span>Explore all</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {isLoadingProducts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-64 rounded-2xl border border-[#ececec] bg-white animate-pulse" />
              ))}
            </div>
          ) : discountedProducts.length === 0 ? (
            <div className="py-12 text-center text-sm text-[#6b7280]">
              No products found in the catalog.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {discountedProducts.map((p) => {
                const imgUrl = p.image_url || "/src/assets/parts.jpg";
                const price = Number(p.price) || 0;
                const mrp = Number(p.mrp) || Math.round(price * 1.15);
                const hasDiscount = mrp > price;
                const discountPct = hasDiscount ? Math.round(((mrp - price) / mrp) * 100) : 0;

                return (
                  <div
                    key={p.id}
                    className="rounded-2xl border border-[#ececec] bg-white p-4 shadow-xs hover:shadow-md transition"
                  >
                    <Link to="/product/$id" params={{ id: p.id }}>
                      <div className="aspect-square rounded-xl bg-[#f7f7f8] overflow-hidden mb-3 relative">
                        <img
                          src={imgUrl}
                          alt={p.name}
                          width={400}
                          height={400}
                          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                        {hasDiscount && discountPct > 0 && (
                          <span className="absolute top-2 left-2 rounded-md bg-[#e11d2a] px-2 py-0.5 text-[11px] font-extrabold text-white">
                            {discountPct}% OFF
                          </span>
                        )}
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800 mb-1">
                        <ShieldCheck className="h-3 w-3 text-emerald-600" />
                        <span>Verified Fit</span>
                      </span>
                      <h3 className="text-sm font-bold text-[#111111] line-clamp-2 hover:text-[#e11d2a] transition">
                        {p.name}
                      </h3>
                      <div className="flex items-baseline gap-2 mt-2">
                        <p className="text-base font-extrabold text-[#111111]">
                          {inr(price)}
                        </p>
                        {hasDiscount && (
                          <p className="text-xs text-[#9ca3af] line-through">
                            {inr(mrp)}
                          </p>
                        )}
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}
