import React from "react";
import { Link } from "@tanstack/react-router";
import { ShieldCheck, ArrowRight, Truck, Sparkles } from "lucide-react";

const promos = [
  {
    tag: "VERIFIED FITMENT",
    title: "100% Fitment Guarantee",
    description: "Every hardware item is validated against OEM EV dimensions and harness specs.",
    cta: "Explore compatible parts",
    link: "/shop",
    search: {},
    icon: ShieldCheck,
  },
  {
    tag: "EXPRESS DISPATCH",
    title: "Free delivery above ₹999",
    description: "Doorstep delivery across Bengaluru with safe high-voltage certified packaging.",
    cta: "Shop now",
    link: "/shop",
    search: {},
    icon: Truck,
  },
  {
    tag: "AUTHORIZED SELLERS",
    title: "Certified EV Vendors",
    description: "Purchase directly from vetted battery manufacturers and authorized component hubs.",
    cta: "Browse catalog",
    link: "/shop",
    search: {},
    icon: Sparkles,
  },
];

export function OffersBanner() {
  return (
    <section className="bg-[#f7f7f8] py-16 lg:py-20 border-b border-[#ececec]">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8 lg:mb-12">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-[36px] font-bold tracking-tight text-[#111111]">
              Current offers
            </h2>
            <p className="text-sm text-[#6b7280] mt-1">
              Active promotional discounts and dispatch vouchers
            </p>
          </div>
          <Link
            to="/offers"
            className="group inline-flex items-center gap-1 text-sm font-semibold text-[#e11d2a] hover:text-[#c91823] transition"
          >
            <span>View all offers</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 3 Promo Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {promos.map((promo) => {
            const Icon = promo.icon;
            return (
              <div
                key={promo.title}
                className="flex flex-col justify-between rounded-2xl border border-[#ececec] bg-white p-6 transition-all duration-200 hover:border-gray-300 hover:shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="rounded-md bg-red-50 border border-red-100 px-2.5 py-1 text-[10px] font-bold tracking-wider text-[#e11d2a]">
                      {promo.tag}
                    </span>
                    <Icon className="h-4 w-4 text-[#e11d2a]" />
                  </div>

                  <h3 className="text-lg font-bold text-[#111111]">
                    {promo.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6b7280] mt-2 leading-relaxed">
                    {promo.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#ececec]">
                  <Link
                    to={promo.link}
                    search={promo.search as any}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#e11d2a] hover:text-[#c91823] transition"
                  >
                    <span>{promo.cta}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
