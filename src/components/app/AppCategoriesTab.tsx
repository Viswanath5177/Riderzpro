import React, { useState } from "react";
import {
  Zap,
  Clock,
  ShieldCheck,
  Bike,
  Sparkles,
  ChevronRight,
  Search,
} from "lucide-react";
import { products } from "@/lib/data";

interface CategoryMeta {
  id: string;
  title: string;
  subtitle: string;
  count: number;
  icon: typeof Zap;
  color: string;
  badge?: string;
}

const CATEGORIES: CategoryMeta[] = [
  {
    id: "battery",
    title: "EV Batteries & Packs",
    subtitle: "Li-ion & LFP 48V/60V/72V with smart BMS protection",
    count: products.filter((p) => p.category.toLowerCase().includes("battery")).length || 18,
    icon: Zap,
    color: "bg-amber-50 text-amber-600 border-amber-200",
    badge: "Fast Dispatch",
  },
  {
    id: "charger",
    title: "Fast Chargers & Adapters",
    subtitle: "Smart cut-off 5A/10A/15A OEM-spec chargers",
    count: products.filter((p) => p.category.toLowerCase().includes("charger")).length || 14,
    icon: Clock,
    color: "bg-blue-50 text-blue-600 border-blue-200",
  },
  {
    id: "spare",
    title: "Certified Spare Parts",
    subtitle: "Hub motors, BLDC controllers, brake pads & throttles",
    count: products.filter((p) => p.category.toLowerCase().includes("spare") || p.category.toLowerCase().includes("motor") || p.category.toLowerCase().includes("controller")).length || 32,
    icon: ShieldCheck,
    color: "bg-emerald-50 text-emerald-600 border-emerald-200",
    badge: "OEM Tested",
  },
  {
    id: "bms",
    title: "Smart Battery BMS",
    subtitle: "Bluetooth & CAN enabled safety management systems",
    count: products.filter((p) => p.category.toLowerCase().includes("bms")).length || 12,
    icon: ShieldCheck,
    color: "bg-purple-50 text-purple-600 border-purple-200",
  },
  {
    id: "bikes",
    title: "Electric Bikes & Scooters",
    subtitle: "Certified pre-inspected electric rides in Delhi",
    count: 8,
    icon: Bike,
    color: "bg-red-50 text-red-600 border-red-200",
  },
  {
    id: "accessories",
    title: "Accessories & Protection",
    subtitle: "Waterproof vehicle covers, helmets & GPS mounts",
    count: 24,
    icon: Sparkles,
    color: "bg-orange-50 text-orange-600 border-orange-200",
  },
];

export function AppCategoriesTab({
  onSelectCategory,
}: {
  onSelectCategory: (categoryId: string) => void;
}) {
  const [filterText, setFilterText] = useState("");

  const filtered = CATEGORIES.filter(
    (c) =>
      c.title.toLowerCase().includes(filterText.toLowerCase()) ||
      c.subtitle.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="space-y-3.5 pb-6">
      {/* Title & Search */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-2xs">
        <h2 className="text-base font-extrabold text-gray-900 tracking-tight">Explore Categories</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Choose a category to filter instant Delhi 30-min delivery
        </p>

        <div className="mt-3 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Search battery, charger, spares..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-xs font-semibold text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-red-600 focus:outline-none transition shadow-2xs"
          />
        </div>
      </div>

      {/* Category List Cards */}
      <div className="space-y-2">
        {filtered.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="flex items-center justify-between rounded-2xl bg-white p-3.5 border border-gray-200/80 shadow-2xs transition active:scale-[0.99] hover:border-gray-300 cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${cat.color} shadow-2xs`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-extrabold text-gray-900 truncate">{cat.title}</h3>
                    {cat.badge && (
                      <span className="shrink-0 rounded-md bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-800">
                        {cat.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">{cat.subtitle}</p>
                  <span className="text-[10px] font-bold text-gray-400 mt-0.5 block">
                    {cat.count} verified parts
                  </span>
                </div>
              </div>

              <ChevronRight className="h-5 w-5 text-gray-400 shrink-0 ml-2" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
