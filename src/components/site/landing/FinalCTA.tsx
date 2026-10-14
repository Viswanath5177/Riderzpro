import React from "react";
import { ArrowUp } from "lucide-react";

export function FinalCTA() {
  const scrollToBikeFinder = () => {
    const el = document.getElementById("bike-finder");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <section className="bg-white py-12 lg:py-24">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-[#e11d2a] p-6 sm:p-14 text-center text-white shadow-sm">
          <div className="max-w-2xl mx-auto space-y-3 sm:space-y-4">
            <h2 className="text-2xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight leading-tight">
              Find parts that fit your bike
            </h2>
            <p className="text-sm sm:text-lg text-white/90 font-normal leading-relaxed">
              Select your vehicle or enter your VIN to unlock verified batteries, chargers and replacement spares.
            </p>
            <div className="pt-3 sm:pt-4">
              <button
                onClick={scrollToBikeFinder}
                className="inline-flex w-full sm:w-auto justify-center items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-[#111111] hover:bg-gray-100 transition active:scale-95 shadow-xs cursor-pointer"
              >
                <span>Pick my bike</span>
                <ArrowUp className="h-4 w-4 text-[#e11d2a]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
