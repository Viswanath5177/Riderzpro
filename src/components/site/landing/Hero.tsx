import React from "react";
import { ShieldCheck, MapPin, Store } from "lucide-react";
import { BikeFinder } from "./BikeFinder";
import { HeroScrubPanel } from "../../hero-scrub/HeroScrubPanel";

export function Hero() {
  const isVideoEnabled = import.meta.env["VITE_HERO_VIDEO"] !== "false";

  if (!isVideoEnabled) {
    // ─── Rollback / Baseline Mode (VITE_HERO_VIDEO="false") ───
    return (
      <section
        className="relative overflow-hidden border-b border-[#ececec] bg-[#f5f5f7]"
        style={{ minHeight: "480px" }}
      >
        <div
          className="absolute inset-0 z-0 pointer-events-none select-none"
          aria-hidden="true"
          role="presentation"
        >
          <img
            src="/images/hero-scooter.jpg"
            alt=""
            className="w-full h-full object-cover object-center opacity-90"
            loading="eager"
            decoding="async"
          />
        </div>

        <div className="relative z-10 mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-28">
          <div className="mx-auto max-w-xl text-left space-y-5 sm:space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#ececec] bg-white/80 backdrop-blur-sm px-3.5 py-1 text-xs font-semibold text-[#111111]">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Serving India</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-[56px] lg:leading-[1.1] font-extrabold tracking-tight text-[#111111]">
              Power your ride.{" "}
              <span className="block">
                Parts that <span className="text-[#e11d2a]">fit.</span>
              </span>
            </h1>

            <p className="text-sm sm:text-lg text-[#4b5563] font-normal leading-relaxed max-w-md">
              Batteries, chargers and spares matched to your vehicle, delivered by riders you can
              track.
            </p>

            <div className="pt-1 max-w-lg text-left w-full">
              <BikeFinder />
            </div>

            <div className="flex flex-wrap items-center gap-3.5 sm:gap-6 pt-1 text-xs sm:text-sm font-semibold text-[#4b5563]">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <ShieldCheck className="h-4 w-4 text-[#e11d2a] shrink-0" />
                <span>100% fitment guaranteed</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <MapPin className="h-4 w-4 text-[#e11d2a] shrink-0" />
                <span>Live rider tracking</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Store className="h-4 w-4 text-[#e11d2a] shrink-0" />
                <span>Verified sellers</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ─── Video Scrub Panel Mode (Default: VITE_HERO_VIDEO="true") ───
  return (
    <section className="relative overflow-hidden bg-white pt-10 sm:pt-14 lg:pt-16 pb-16 sm:pb-24 lg:pb-32">
      {/* ─── Hero Content Column (Centred at x=49%) ─── */}
      <div className="relative z-10 mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Eyebrow chip */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#ececec] bg-white px-3.5 py-1 text-xs font-semibold text-[#111111] shadow-2xs mb-4 sm:mb-5">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Serving India</span>
        </div>

        {/* H1 */}
        <h1 className="text-3xl sm:text-5xl lg:text-[54px] lg:leading-[1.1] font-extrabold tracking-tight text-[#111111] max-w-3xl mb-3 sm:mb-4">
          Power your ride.{" "}
          <span className="block">
            Parts that <span className="text-[#e11d2a]">fit.</span>
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-lg text-[#4b5563] font-normal leading-relaxed max-w-md sm:max-w-lg mb-6 sm:mb-8">
          Batteries, chargers and spares matched to your vehicle, delivered by riders you can track.
        </p>

        {/* Selector Card (z-10, opaque white, straddles panel top) */}
        <div className="relative z-10 w-full max-w-lg sm:max-w-xl text-left">
          <BikeFinder />
        </div>
      </div>

      {/* ─── Scroll-Scrubbed Scooter Video Panel (z-0, -mt-7 = card bottom minus 28px) ─── */}
      <div className="relative z-0 -mt-7 w-full flex justify-center">
        <HeroScrubPanel>
          {/* Trust Row inside dark top strip */}
          <div
            className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm font-semibold"
            style={{ color: "rgba(255, 255, 255, 0.88)" }}
          >
            <div className="flex items-center gap-1.5 sm:gap-2">
              <ShieldCheck className="h-4 w-4 text-[#e11d2a] shrink-0" />
              <span>100% fitment guaranteed</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <MapPin className="h-4 w-4 text-[#e11d2a] shrink-0" />
              <span>Live rider tracking</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Store className="h-4 w-4 text-[#e11d2a] shrink-0" />
              <span>Verified sellers</span>
            </div>
          </div>
        </HeroScrubPanel>
      </div>
    </section>
  );
}

export default Hero;
