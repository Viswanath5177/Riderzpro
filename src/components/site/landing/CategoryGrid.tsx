import React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Bike, Battery, Wrench, Shield, Car, HardHat } from "lucide-react";

interface CategoryCard {
  title: string;
  desc: string;
  cat: string;
  icon: React.ComponentType<{ className?: string }>;
}

const categories: CategoryCard[] = [
  {
    title: "Electric Bikes",
    desc: "Smart performance electric motorcycles & commuters",
    cat: "Electric Bikes",
    icon: Bike,
  },
  {
    title: "Batteries & Chargers",
    desc: "OEM replacement packs, BMS & portable fast chargers",
    cat: "Battery",
    icon: Battery,
  },
  {
    title: "Spare Parts",
    desc: "Disc rotors, ceramic pads, drive belts & hub motors",
    cat: "Spare Parts",
    icon: Wrench,
  },
  {
    title: "Bike Accessories",
    desc: "Waterproof covers, sirens, disc locks & phone mounts",
    cat: "Bike Accessories",
    icon: Shield,
  },
  {
    title: "Car Accessories",
    desc: "Dashcams, 150PSI tire inflators & Level-2 wallboxes",
    cat: "Car Accessories",
    icon: Car,
  },
  {
    title: "Riding Gear & Helmets",
    desc: "ECE 22.06 helmets, CE Level-2 armored jackets & gloves",
    cat: "Riding Gear & Helmets",
    icon: HardHat,
  },
];

export function CategoryGrid() {
  return (
    <section className="bg-[#f7f7f8] py-16 lg:py-24 border-b border-[#ececec]">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        {/* Section Header: H2 + View All */}
        <div className="flex items-center justify-between mb-8 lg:mb-12">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-[36px] font-bold tracking-tight text-[#111111]">
              Shop by category
            </h2>
            <p className="text-sm text-[#6b7280] mt-1">
              Select a department to explore compatible products
            </p>
          </div>
          <Link
            to="/shop"
            className="group inline-flex items-center gap-1 text-sm font-semibold text-[#e11d2a] hover:text-[#c91823] transition"
          >
            <span>View all</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 6 Equal Cards Grid (3x2 desktop, 2x3 mobile) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
          {categories.map((c) => {
            const Icon = c.icon;
            return (
              <Link
                key={c.title}
                to="/shop"
                search={{ cat: c.cat } as any}
                className="group relative flex flex-col justify-between rounded-2xl border border-[#ececec] bg-white p-4 sm:p-6 transition-all duration-200 hover:border-[#e11d2a] hover:shadow-md"
              >
                <div>
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-[#f7f7f8] text-[#111111] transition-colors group-hover:bg-red-50 group-hover:text-[#e11d2a] mb-3.5 sm:mb-5">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <h3 className="text-sm sm:text-lg font-bold text-[#111111] transition-colors group-hover:text-[#e11d2a]">
                    {c.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6b7280] mt-1 sm:mt-1.5 leading-relaxed line-clamp-2 sm:line-clamp-none">
                    {c.desc}
                  </p>
                </div>

                <div className="mt-4 sm:mt-6 flex items-center gap-1.5 text-xs font-semibold text-[#e11d2a] sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <span>Browse</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
