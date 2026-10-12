import { Link } from "@tanstack/react-router";
import { Moon, Sun, Zap, CheckCircle2, XCircle, HelpCircle, Star } from "lucide-react";
import { useStore } from "@/lib/store";
import { bestOffer, fitmentFor, getVendor, inr, type Fitment, type Product } from "@/lib/data";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn("group flex items-center gap-2.5", className)}>
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-glow transition group-hover:scale-105">
        <Zap className="h-5 w-5" fill="currentColor" />
      </span>
      <span className="font-display text-xl font-extrabold tracking-tight">
        RIDERZ<span className="text-primary">PRO</span>
      </span>
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
        "grid h-10 w-10 place-items-center rounded-full border border-border/80 bg-card/60 backdrop-blur-xl text-foreground transition-all hover:bg-card hover:border-primary/50 hover:text-primary active:scale-95",
        className,
      )}
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

const fitMeta: Record<Fitment, { label: string; cls: string; Icon: typeof CheckCircle2 }> = {
  compatible: {
    label: "Fits your bike",
    cls: "bg-success/15 text-success border-success/30 backdrop-blur-md",
    Icon: CheckCircle2,
  },
  incompatible: {
    label: "Doesn't fit",
    cls: "bg-destructive/15 text-destructive border-destructive/30 backdrop-blur-md",
    Icon: XCircle,
  },
  unknown: {
    label: "Fitment unknown",
    cls: "bg-muted/70 text-muted-foreground border-border/70 backdrop-blur-md",
    Icon: HelpCircle,
  },
};

export function FitmentBadge({ fit, className }: { fit: Fitment; className?: string }) {
  const m = fitMeta[fit];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur-xl shadow-sm",
        m.cls,
        className,
      )}
    >
      <m.Icon className="h-3.5 w-3.5" /> {m.label}
    </span>
  );
}

export function ProductCard({ p }: { p: Product }) {
  const { activeBikeId, addToCart } = useStore();
  const offer = bestOffer(p);
  const fit = fitmentFor(p, activeBikeId);
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-border/80 bg-card/75 backdrop-blur-2xl shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:border-primary/40">
      <Link to="/product/$id" params={{ id: p.id }} className="relative block aspect-square overflow-hidden bg-muted/40">
        <img
          src={p.image}
          alt={p.name}
          loading="lazy"
          width={1024}
          height={1024}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3">
          <FitmentBadge fit={fit} className="glass border-white/20 dark:border-white/10" />
        </div>
        {p.voltage && (
          <span className="absolute right-3 top-3 rounded-full border border-white/20 bg-background/80 px-2.5 py-1 font-display text-xs font-bold leading-none text-foreground backdrop-blur-md">
            {p.voltage}V
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-medium uppercase tracking-wider">
            {p.category} · {p.brand}
          </span>
          <span className="flex items-center gap-1 font-semibold">
            <Star className="h-3 w-3 fill-warning text-warning" />
            {getVendor(offer.vendorId).rating}
          </span>
        </div>
        <Link
          to="/product/$id"
          params={{ id: p.id }}
          className="line-clamp-2 font-semibold text-base leading-snug tracking-tight transition-colors hover:text-primary"
        >
          {p.name}
        </Link>
        {p.capacityAh && (
          <p className="text-xs text-muted-foreground">
            {p.capacityAh}Ah · {p.chemistry} · ~{p.rangeKm} km range
          </p>
        )}
        <div className="mt-auto flex items-end justify-between pt-3">
          <div>
            <p className="text-[11px] text-muted-foreground">{p.offers.length} sellers from</p>
            <p className="font-display text-xl font-bold tracking-tight">{inr(offer.price)}</p>
          </div>
          <button
            onClick={() => addToCart(p.id, offer.vendorId)}
            className="rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] transition-all hover:brightness-105 active:scale-95"
          >
            Add
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
