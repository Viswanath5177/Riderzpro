import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Moon, Sun, Zap, CheckCircle2, XCircle, HelpCircle, Star, Heart, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { bestOffer, fitmentFor, getVendor, inr, type Fitment, type Product } from "@/lib/data";
import { cn } from "@/lib/utils";

import logoImg from "@/assets/riderzpro-logo.png";

export function Logo({ className, imgClassName }: { className?: string; imgClassName?: string }) {
  return (
    <Link to="/" className={cn("group inline-flex items-center", className)}>
      <img
        src={logoImg}
        alt="RiderzPro - Car & Bike Accessories"
        className={cn("h-8 md:h-9.5 w-auto object-contain transition-transform group-hover:scale-[1.02]", imgClassName)}
      />
    </Link>
  );
}

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useStore();
  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={cn(
        "grid h-10 w-10 place-items-center rounded-full border border-[#E5E7EB] bg-white text-[#111111] shadow-2xs transition-all hover:border-[#111111] active:scale-95",
        className,
      )}
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

const fitMeta: Record<Fitment, { label: string; cls: string; Icon: typeof CheckCircle2 }> = {
  compatible: {
    label: "Verified Fit",
    cls: "bg-emerald-50 text-emerald-800 border-emerald-200",
    Icon: CheckCircle2,
  },
  incompatible: {
    label: "Doesn't fit",
    cls: "bg-rose-50 text-rose-700 border-rose-200",
    Icon: XCircle,
  },
  unknown: {
    label: "Fitment unverified",
    cls: "bg-gray-100 text-gray-700 border-gray-200",
    Icon: HelpCircle,
  },
};

export function FitmentBadge({ fit, className }: { fit: Fitment; className?: string }) {
  const m = fitMeta[fit];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-semibold shadow-2xs",
        m.cls,
        className,
      )}
    >
      <m.Icon className="h-3 w-3 shrink-0" /> {m.label}
    </span>
  );
}

export function ProductCard({ p }: { p: Product }) {
  const { activeBikeId, addToCart, toggleSaved, isSaved } = useStore();
  const [imageFailed, setImageFailed] = useState(false);
  const offer = bestOffer(p);
  const fit = fitmentFor(p, activeBikeId);
  const mrp = Math.round((offer.price * 1.14) / 100) * 100;
  const discountPct = Math.round(((mrp - offer.price) / mrp) * 100);
  const saved = isSaved(p.id);
  const vendor = getVendor(offer.vendorId);
  const hasImage = Boolean(p.image && p.image.trim() !== "" && !imageFailed);
  const batterySummary = p.batterySpec || [
    p.batteryCapacityKwh ? `${p.batteryCapacityKwh} kWh` : "",
    p.voltage && p.capacityAh ? `${p.voltage} V · ${p.capacityAh} Ah` : "",
    p.chemistry || "",
  ].filter(Boolean).join(" · ");

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-2xs transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-gray-300">
      {/* Product Image Area */}
      <div className="relative block aspect-square overflow-hidden bg-[#F5F6F8]">
        {hasImage ? (
          <Link to="/product/$id" params={{ id: p.id }} className="block h-full w-full">
            <img
              src={p.image}
              alt={p.name}
              loading="lazy"
              width={600}
              height={600}
              onError={() => setImageFailed(true)}
              className="h-full w-full object-contain p-2 transition duration-500 group-hover:scale-105"
            />
          </Link>
        ) : (
          <Link
            to="/product/$id"
            params={{ id: p.id }}
            className="flex h-full w-full flex-col items-center justify-center p-3 text-center bg-gradient-to-b from-[#FAFAFA] to-[#F1F3F5] transition group-hover:bg-[#E5E7EB]"
          >
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white border border-[#E5E7EB] text-2xl shadow-2xs">
              🧰
            </div>
            <span className="mt-2 text-xs font-semibold text-[#4B5563] leading-snug">
              Product image not available
            </span>
            <span className="mt-0.5 text-[10px] text-[#9CA3AF]">Verified Genuine Spares</span>
          </Link>
        )}
        {/* Top Badges */}
        <div className="absolute left-2.5 top-2.5 flex flex-col gap-1 items-start z-10 pointer-events-none">
          {discountPct > 0 && (
            <span className="rounded-md bg-[#E31E24] px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
              {discountPct}% OFF
            </span>
          )}
          {activeBikeId && (
            <FitmentBadge fit={fit} className="bg-white border border-[#E5E7EB] text-gray-800 shadow-2xs text-[10px]" />
          )}
        </div>

        {/* Save Item Heart Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSaved(p.id);
            toast.success(saved ? "Removed from saved items" : "Added to saved items");
          }}
          aria-label={saved ? "Remove from saved items" : "Save item"}
          className={cn(
            "absolute right-2.5 top-2.5 z-10 grid h-8 w-8 place-items-center rounded-full bg-white border border-[#E5E7EB] shadow-2xs transition hover:scale-110",
            saved ? "text-[#E31E24]" : "text-gray-500 hover:text-[#E31E24]"
          )}
        >
          <Heart className={cn("h-4 w-4", saved && "fill-current")} />
        </button>

        {/* Voltage or Specs Tag */}
        {p.voltage && (
          <span className="absolute right-2.5 bottom-2.5 rounded-md bg-[#111111] px-2 py-0.5 text-[10px] font-bold text-white shadow-2xs">
            {p.voltage}V
          </span>
        )}
      </div>

      {/* Card Content Area */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between text-[11px] text-[#6B7280]">
          <span className="font-semibold uppercase tracking-wider truncate max-w-[140px]">
            {p.category} · {p.brand}
          </span>
          <span className="flex items-center gap-1 font-semibold text-gray-700 shrink-0">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            {vendor.rating}
          </span>
        </div>

        <Link
          to="/product/$id"
          params={{ id: p.id }}
          className="mt-1 line-clamp-2 font-semibold text-sm leading-snug text-[#111111] transition-colors hover:text-[#E31E24]"
        >
          {p.name}
        </Link>

        {batterySummary && (
          <p className="mt-2 text-[10px] leading-snug text-[#6B7280]">
            <span className="font-semibold text-[#111111]">Battery:</span> {batterySummary}
          </p>
        )}

        <div className="mt-2 flex items-center gap-1.5 text-[11px]">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span className="text-emerald-700 font-medium">In Stock</span>
          <span className="text-gray-400">·</span>
          {p.warrantyMonths > 0 && <span className="text-[#6B7280]">{p.warrantyMonths}m Warranty</span>}
        </div>

        {/* Price and Add to Cart Area */}
        <div className="mt-auto pt-3 border-t border-gray-100 flex items-end justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-lg font-extrabold text-[#111111]">{inr(offer.price)}</span>
              <span className="text-xs text-gray-400 line-through">{inr(mrp)}</span>
            </div>
            <p className="text-[10px] text-[#6B7280]">From {vendor.name}</p>
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(p.id, offer.vendorId);
              toast.success(`Added ${p.name} to cart`);
            }}
            className="flex items-center gap-1.5 rounded-lg bg-[#E31E24] px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700 active:scale-95 shadow-2xs"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
}) {
  return (
    <div className="mb-10">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
      <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {sub && (
        <p className="mt-3 max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed">
          {sub}
        </p>
      )}
    </div>
  );
}
