import React from "react";
import { Link } from "@tanstack/react-router";
import {
  Bike,
  Battery,
  Wrench,
  Shield,
  Car,
  HardHat,
  ArrowRight,
} from "lucide-react";

interface CategoryItem {
  title: string;
  desc: string;
  cat: string;
  icon: React.ComponentType<{ className?: string }>;
}

const categories: CategoryItem[] = [
  {
    title: "Electric Bikes",
    desc: "Smart performance electric motorcycles & scooters",
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
    desc: "OEM disc brakes, Kevlar drive belts & hub motors",
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

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MegaMenu({ isOpen, onClose }: MegaMenuProps) {
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop overlay to dismiss when clicking outside */}
      <div
        className="fixed inset-0 top-[72px] z-40 bg-black/10 backdrop-blur-[1px] animate-in fade-in duration-150"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className="absolute left-0 right-0 top-[72px] z-50 border-b border-[#ececec] bg-white shadow-xl animate-in fade-in slide-in-from-top-2 duration-200"
        onMouseLeave={onClose}
      >
        <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between pb-4 border-b border-[#ececec] mb-6">
            <div>
              <h3 className="text-base font-bold text-[#111111]">Shop by Category</h3>
              <p className="text-xs text-[#6b7280] mt-0.5">Explore 100% verified automotive parts and accessories</p>
            </div>
            <Link
              to="/shop"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#e11d2a] hover:text-[#c91823] transition"
            >
              <span>View all products</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.title}
                  to="/shop"
                  search={{ cat: item.cat } as any}
                  onClick={onClose}
                  className="group flex items-start gap-3.5 rounded-xl border border-[#ececec] bg-white p-3.5 transition hover:border-[#e11d2a] hover:shadow-xs"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#f7f7f8] text-[#111111] transition group-hover:bg-red-50 group-hover:text-[#e11d2a]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-[#111111] group-hover:text-[#e11d2a] transition">
                        {item.title}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 text-[#e11d2a] transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                    </div>
                    <p className="text-xs text-[#6b7280] mt-0.5 line-clamp-1">
                      {item.desc}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
