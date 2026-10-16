import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Zap,
  Clock,
  ShieldCheck,
  Bike,
  Sparkles,
  ChevronRight,
  ArrowRight,
  Search,
} from "lucide-react";
import { ALL_PRODUCT_CATEGORIES, products } from "@/lib/data";

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
    id: "EV Batteries",
    title: "EV Batteries & Packs",
    subtitle: "Li-ion & LFP 48V/60V/72V with BMS protection",
    count: products.filter((p) => (p.category as string) === "EV Batteries").length || 18,
    icon: Zap,
    color: "from-amber-500/20 to-amber-600/5 text-amber-400 border-amber-500/30",
    badge: "High Demand",
  },
  {
    id: "Fast Chargers",
    title: "Fast Chargers & Adapters",
    subtitle: "Smart cut-off 5A/10A/15A OEM-spec chargers",
    count: 14,
    icon: Clock,
    color: "from-blue-500/20 to-blue-600/5 text-blue-400 border-blue-500/30",
  },
  {
    id: "Spare Parts",
    title: "Certified Spare Parts",
    subtitle: "Hub motors, BLDC controllers, discs & throttles",
    count: 32,
    icon: ShieldCheck,
    color: "from-emerald-500/20 to-emerald-600/5 text-emerald-400 border-emerald-500/30",
    badge: "Tested",
  },
  {
    id: "Electric Bikes",
    title: "Electric Bikes & Scooters",
    subtitle: "New & certified pre-inspected electric rides",
    count: products.filter((p) => p.category === "Electric Bikes").length || 8,
    icon: Bike,
    color: "from-red-500/20 to-red-600/5 text-red-400 border-red-500/30",
  },
  {
    id: "Accessories",
    title: "Accessories & Protection",
    subtitle: "Waterproof covers, helmets, GPS mounts & locks",
    count: 24,
    icon: Sparkles,
    color: "from-purple-500/20 to-purple-600/5 text-purple-400 border-purple-500/30",
  },
];

export function AppCategoriesTab({
  onSelectCategory,
}: {
  onSelectCategory?: (category: string) => void;
}) {
  const [filterText, setFilterText] = useState("");

  const filtered = CATEGORIES.filter(
    (c) =>
      c.title.toLowerCase().includes(filterText.toLowerCase()) ||
      c.subtitle.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="space-y-4 pb-6">
      {/* Search Header */}
      <div>
        <h2 className="text-lg font-bold text-white">Browse Categories</h2>
        <p className="text-xs text-zinc-400">
          Find vehicle-compatible parts and certified components
        </p>

        <div className="mt-3 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Search categories, parts, battery types..."
            className="w-full rounded-xl bg-zinc-900 border border-zinc-800 py-2 pl-9 pr-3 text-xs text-zinc-200 placeholder:text-zinc-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
          />
        </div>
      </div>

      {/* Category Cards */}
      <div className="space-y-2.5">
        {filtered.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.id}
              to="/shop"
              search={{ q: cat.id }}
              className={`flex items-center justify-between rounded-xl bg-gradient-to-r ${cat.color} p-3.5 border transition active:scale-[0.99] hover:border-zinc-600`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-900/90 border border-zinc-700/60 shadow-md">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-zinc-100">{cat.title}</h3>
                    {cat.badge && (
                      <span className="rounded bg-red-500/20 px-1.5 py-0.5 text-[9px] font-bold text-red-400">
                        {cat.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 line-clamp-1">{cat.subtitle}</p>
                  <span className="mt-0.5 text-[10px] font-medium text-zinc-500">
                    {cat.count} products available
                  </span>
                </div>
              </div>

              <ChevronRight className="h-5 w-5 text-zinc-500" />
            </Link>
          );
        })}
      </div>

      {/* Direct link to Full Shop */}
      <div className="mt-4 rounded-xl bg-zinc-900/60 border border-zinc-800 p-4 text-center">
        <h4 className="text-xs font-bold text-zinc-200">Looking for a specific part?</h4>
        <p className="mt-1 text-[11px] text-zinc-400">
          Search the entire catalog across verified suppliers in Delhi/NCR
        </p>
        <Link
          to="/shop"
          className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-red-600/30"
        >
          <span>Open Full Catalog</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
