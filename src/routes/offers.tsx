import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Tag, Copy, Check, ArrowRight, ShieldCheck, Truck, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/SiteLayout";
import { products, bestOffer, inr } from "@/lib/data";

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

const coupons = [
  {
    code: "VOLT500",
    discount: "Flat ₹500 OFF",
    desc: "Valid on all 48V, 60V and 72V lithium battery packs above ₹10,000",
    category: "Battery",
  },
  {
    code: "FREESHIP",
    discount: "Free Delivery",
    desc: "Free 3-hour doorstep delivery on all orders above ₹999 across Bengaluru",
    category: "All",
  },
  {
    code: "GEAR10",
    discount: "10% OFF",
    desc: "Save 10% on certified helmets, armored jackets, gloves and alarms",
    category: "Riding Gear & Helmets",
  },
  {
    code: "SPARE200",
    discount: "Flat ₹200 OFF",
    desc: "Applicable on ceramic disc brake pads, wave rotors and Kevlar drive belts",
    category: "Spare Parts",
  },
];

function OffersPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon code ${code} copied to clipboard!`);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const discountedProducts = products.slice(0, 4);

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
              Apply these coupons during checkout to save on batteries, chargers, and parts.
            </p>
          </div>

          {/* Coupons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {coupons.map((c) => {
              const isCopied = copiedCode === c.code;
              return (
                <div
                  key={c.code}
                  className="flex flex-col justify-between rounded-2xl border border-[#ececec] bg-white p-5 shadow-xs transition hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#e11d2a]">
                        {c.discount}
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
                      {c.desc}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-[#ececec]">
                    <Link
                      to="/shop"
                      search={{ cat: c.category !== "All" ? c.category : undefined } as any}
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
        </div>
      </div>

      {/* Featured Deals on Products */}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {discountedProducts.map((p) => {
              const offer = bestOffer(p);
              return (
                <div
                  key={p.id}
                  className="rounded-2xl border border-[#ececec] bg-white p-4 shadow-xs hover:shadow-md transition"
                >
                  <Link to="/product/$id" params={{ id: p.id }}>
                    <div className="aspect-square rounded-xl bg-[#f7f7f8] overflow-hidden mb-3">
                      <img
                        src={p.image}
                        alt={p.name}
                        width={400}
                        height={400}
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800 mb-1">
                      <ShieldCheck className="h-3 w-3 text-emerald-600" />
                      <span>Verified Fit</span>
                    </span>
                    <h3 className="text-sm font-bold text-[#111111] line-clamp-2 hover:text-[#e11d2a] transition">
                      {p.name}
                    </h3>
                    <p className="text-base font-extrabold text-[#111111] mt-2">
                      {inr(offer.price)}
                    </p>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
