import { Link } from "@tanstack/react-router";
import { Moon, Sun, Zap, CheckCircle2, XCircle, HelpCircle, Star, Heart, ShoppingCart, MapPin } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { bestOffer, fitmentFor, getVendor, inr, distanceKm, etaMinutes, type Fitment, type Product } from "@/lib/data";
import { cn } from "@/lib/utils";

import logoImg from "@/assets/riderzpro-logo.png";

export function Logo({ className, imgClassName }: { className?: string; imgClassName?: string }) {
  return (
    <Link to="/" className={cn("group inline-flex items-center", className)}>
      <img
        src={logoImg}
        alt="RiderzPro - Car & Bike Accessories"
        style={{ maxHeight: 52, width: "auto" }}
        className={cn("h-10 md:h-12 w-auto object-contain transition-transform group-hover:scale-[1.03]", imgClassName)}
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
    label: "Universal Fit",
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
  const { activeBikeId, addToCart, toggleSaved, isSaved, inventoryStock, userLocation } = useStore();
  const offer = bestOffer(p);
  const fit = fitmentFor(p, activeBikeId);
  const offerPrice = offer?.price || 0;
  const mrp = p.mrp || (offerPrice > 0 ? Math.round((offerPrice * 1.14) / 100) * 100 : 0);
  const discountPct = p.discountPercent || (mrp > offerPrice && offerPrice > 0 ? Math.round(((mrp - offerPrice) / mrp) * 100) : 0);
  const saved = isSaved(p.id);

  const vendor = getVendor(offer.vendorId);
  const vendorDist = userLocation ? Math.round(distanceKm(vendor, userLocation) * 10) / 10 : null;
  const deliveryEta = vendorDist !== null ? etaMinutes(vendorDist, vendor.prepMins) : null;

  const currentStock = inventoryStock?.[p.id] ?? offer?.stock ?? p.offers?.[0]?.stock ?? 0;
  const isLowStock = currentStock < 5;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-2xs transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-gray-300">
      {/* Product Image Area */}
      <div className="relative block aspect-square overflow-hidden bg-[#F5F6F8]">
        <Link to="/product/$id" params={{ id: p.id }} className="block h-full w-full">
          <img
            src={p.image}
            alt={p.name}
            loading="lazy"
            width={600}
            height={600}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "/src/assets/parts.jpg";
            }}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </Link>
        {/* Top Badges */}
        <div className="absolute left-2.5 top-2.5 flex flex-col gap-1 items-start z-10 pointer-events-none">
          {discountPct > 0 && (
            <span className="rounded-md bg-[#E31E24] px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
              {discountPct}% OFF
            </span>
          )}
          {vendorDist !== null && vendorDist <= 4 && (
            <span className="rounded-md bg-emerald-600 text-white px-2 py-0.5 text-[10px] font-bold shadow-xs flex items-center gap-1">
              <Zap className="h-2.5 w-2.5 fill-white text-white" />
              ⚡ {deliveryEta}m
            </span>
          )}
          {isLowStock && (
            <span className="rounded-md bg-amber-600 text-white px-2 py-0.5 text-[10px] font-bold shadow-xs">
              Hurry limited Stock
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
      <div className="flex flex-1 flex-col p-2.5 sm:p-4">
        <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-[#6B7280]">
          <span className="font-semibold uppercase tracking-wider truncate max-w-[95px] sm:max-w-[140px]">
            {p.category} · {p.brand}
          </span>
          <span className="flex items-center gap-1 font-semibold text-gray-700 shrink-0">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            {getVendor(offer.vendorId).rating}
          </span>
        </div>

        <Link
          to="/product/$id"
          params={{ id: p.id }}
          className="mt-1 line-clamp-2 font-semibold text-xs sm:text-sm leading-snug text-[#111111] transition-colors hover:text-[#E31E24]"
        >
          {p.name}
        </Link>

        {/* Availability status */}
        <div className="mt-1.5 flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-[11px] truncate">
          {isLowStock ? (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
              <span className="text-amber-700 font-bold truncate">Hurry limited Stock</span>
              {currentStock > 0 && (
                <span className="text-amber-600 font-semibold shrink-0">({currentStock})</span>
              )}
            </>
          ) : (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-emerald-700 font-medium">In Stock</span>
            </>
          )}
          <span className="text-gray-400">·</span>
          <span className="text-[#6B7280] truncate">{p.warrantyMonths}m Warranty</span>
        </div>

        {/* Price and Add to Cart Area */}
        <div className="mt-auto pt-2.5 sm:pt-3 border-t border-gray-100 flex items-end justify-between gap-1.5 sm:gap-2">
          <div className="min-w-0">
            {offerPrice > 0 ? (
              <div className="flex items-baseline gap-1 sm:gap-1.5 flex-wrap">
                <span className="font-display text-sm sm:text-base md:text-lg font-extrabold text-[#111111]">
                  {inr(offerPrice)}
                </span>
                {mrp > offerPrice && (
                  <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                    {inr(mrp)}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-[10px] sm:text-xs font-bold text-gray-700 bg-gray-100 px-1.5 sm:px-2 py-0.5 rounded">
                Price on Req.
              </span>
            )}
            <div className="flex items-center gap-1 text-[9.5px] sm:text-[10px] text-[#6B7280] truncate max-w-[125px] sm:max-w-[150px] mt-0.5">
              <span className="truncate">{vendor.name}</span>
              {vendorDist !== null && (
                <span className="shrink-0 text-emerald-700 font-bold bg-emerald-50 px-1 py-0.2 rounded text-[9px] flex items-center gap-0.5">
                  <MapPin className="h-2.5 w-2.5 text-emerald-600" />
                  {vendorDist}km
                </span>
              )}
            </div>
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(p.id, offer.vendorId);
              toast.success(`Added ${p.name} to cart`);
            }}
            aria-label={`Add ${p.name} to cart`}
            className="flex items-center gap-1 sm:gap-1.5 rounded-lg bg-[#E31E24] px-2 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold text-white transition hover:bg-red-700 active:scale-95 shadow-2xs cursor-pointer shrink-0"
          >
            <ShoppingCart className="h-3 sm:h-3.5 w-3 sm:w-3.5" />
            <span>Add</span>
          </button>
        </div>

        {/* Low Stock Indicator Below Card */}
        {isLowStock && (
          <div className="mt-2.5 sm:mt-3 -mx-2.5 -mb-2.5 sm:-mx-4 sm:-mb-4 bg-amber-50 border-t border-amber-200/90 px-2.5 sm:px-3.5 py-1 sm:py-1.5 flex items-center justify-between text-[10px] sm:text-[11px] font-bold text-amber-800">
            <span className="flex items-center gap-1 sm:gap-1.5 truncate">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping shrink-0" />
              <span className="tracking-tight truncate">Limited Stock</span>
            </span>
            {currentStock > 0 && (
              <span className="text-[9.5px] sm:text-[10px] font-bold text-amber-700 bg-amber-200/70 px-1.5 py-0.5 rounded shrink-0">
                {currentStock} left
              </span>
            )}
          </div>
        )}
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
