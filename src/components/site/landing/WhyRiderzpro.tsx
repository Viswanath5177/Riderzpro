import React from "react";
import { ShieldCheck, Store, Truck, Award } from "lucide-react";

const benefits = [
  {
    title: "Fitment guaranteed",
    description: "Every part is cross-verified against OEM chassis dimensions and battery voltages.",
    icon: ShieldCheck,
  },
  {
    title: "Compare across sellers",
    description: "View pricing, inventory stock and dispatch speed from multiple certified local vendors.",
    icon: Store,
  },
  {
    title: "Fast tracked delivery",
    description: "Live real-time rider tracking with direct calling and instant dispatch notifications.",
    icon: Truck,
  },
  {
    title: "Genuine warranty",
    description: "Original brand warranties with easy warranty registration and digital service receipts.",
    icon: Award,
  },
];

export function WhyRiderzpro() {
  return (
    <section className="bg-white py-16 lg:py-24 border-b border-[#ececec]">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-[36px] font-bold tracking-tight text-[#111111]">
            Why Riderzpro
          </h2>
          <p className="text-base text-[#6b7280] mt-2">
            The reliable automotive platform built for EV riders, workshops and fleet owners
          </p>
        </div>

        {/* 4 Benefit Cards in a row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {benefits.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.title}
                className="rounded-2xl border border-[#ececec] bg-white p-5 sm:p-6 transition hover:shadow-xs"
              >
                <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-red-50 text-[#e11d2a] mb-4 sm:mb-5">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-[#111111]">
                  {b.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#6b7280] mt-1.5 sm:mt-2 leading-relaxed">
                  {b.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
