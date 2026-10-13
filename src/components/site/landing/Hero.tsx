import React from "react";
import { ShieldCheck, MapPin, Store } from "lucide-react";
import heroBike from "@/assets/hero-bike.jpg";
import { BikeFinder } from "./BikeFinder";

export function Hero() {
  return (
    <section className="bg-white py-12 lg:py-20 border-b border-[#ececec]">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Left Column: Heading, Subtext, Bike Finder, Trust Row */}
          <div className="space-y-6">
            {/* Eyebrow Chip: Static, clean neutral */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#ececec] bg-[#f7f7f8] px-3.5 py-1 text-xs font-semibold text-[#111111]">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Serving Bengaluru</span>
            </div>

            {/* H1: Solid near-black with single red highlighted word */}
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] lg:leading-[1.1] font-extrabold tracking-tight text-[#111111]">
              Power your ride. Parts that <span className="text-[#e11d2a]">fit.</span>
            </h1>

            {/* One-line subtext */}
            <p className="text-base sm:text-lg text-[#6b7280] font-normal leading-relaxed">
              Batteries, chargers and spares matched to your vehicle, delivered by riders you can track.
            </p>

            {/* Bike Finder Card */}
            <div className="pt-2">
              <BikeFinder />
            </div>

            {/* Trust Row: 3 items with icons */}
            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs sm:text-sm font-semibold text-[#4b5563]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#e11d2a] shrink-0" />
                <span>100% fitment guaranteed</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#e11d2a] shrink-0" />
                <span>Live rider tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <Store className="h-4 w-4 text-[#e11d2a] shrink-0" />
                <span>Verified sellers</span>
              </div>
            </div>
          </div>

          {/* Right Column: ONE clean product/rider image */}
          <div className="relative">
            <div className="overflow-hidden rounded-2xl border border-[#ececec] bg-[#f7f7f8] shadow-sm">
              <img
                src={heroBike}
                alt="Electric motorcycle maintenance and compatible EV battery pack"
                width={800}
                height={600}
                className="h-full w-full object-cover object-center max-h-[460px] transition-transform duration-500 hover:scale-[1.02]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
