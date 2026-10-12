import { Link } from "@tanstack/react-router";
import { Moon, Sun, Zap, CheckCircle2, XCircle, HelpCircle, Star } from "lucide-react";
import { useStore } from "@/lib/store";
import { bestOffer, fitmentFor, getVendor, inr, type Fitment, type Product } from "@/lib/data";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn("flex items-center gap-2", className)}>
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-glow">
        <Zap className="h-5 w-5" fill="currentColor" />
      </span>
      <span className="font-display text-2xl leading-none tracking-wide">
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
        "grid h-10 w-10 place-items-center rounded-full border border-border bg-card/60 text-foreground transition hover:border-primary hover:text-primary",
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
    cls: "bg-success/15 text-success border-success/30",
    Icon: CheckCircle2,
  },
  incompatible: {
    label: "Doesn't fit",
    cls: "bg-destructive/15 text-destructive border-destructive/30",
    Icon: XCircle,
  },
  unknown: {
    label: "Fitment unknown",
    cls: "bg-muted text-muted-foreground border-border",
    Icon: HelpCircle,
  },
};

export function FitmentBadge({ fit, className }: { fit: Fitment; className?: string }) {
  const m = fitMeta[fit];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold",
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
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition hover:-translate-y-1 hover:border-primary/50">
      <Link
        to="/product/$id"
        params={{ id: p.id }}
        className="relative block aspect-square overflow-hidden bg-muted"
      >
        <img
          src={p.image}
          alt={p.name}
          loading="lazy"
          width={1024}
          height={1024}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3">
          <FitmentBadge fit={fit} className="glass" />
        </div>
        {p.voltage && (
          <span className="absolute right-3 top-3 rounded-lg bg-foreground/85 px-2 py-1 font-display text-lg leading-none text-background">
            {p.voltage}V
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="uppercase tracking-wider">
            {p.category} · {p.brand}
          </span>
          <span className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-warning text-warning" />
            {getVendor(offer.vendorId).rating}
          </span>
        </div>
        <Link
          to="/product/$id"
          params={{ id: p.id }}
          className="line-clamp-2 font-semibold leading-snug hover:text-primary"
        >
          {p.name}
        </Link>
        {p.capacityAh && (
          <p className="text-xs text-muted-foreground">
            {p.capacityAh}Ah · {p.chemistry} · ~{p.rangeKm} km range
          </p>
        )}
        <div className="mt-auto flex items-end justify-between pt-2">
          <div>
            <p className="text-xs text-muted-foreground">{p.offers.length} sellers from</p>
            <p className="text-xl font-bold">{inr(offer.price)}</p>
          </div>
          <button
            onClick={() => addToCart(p.id, offer.vendorId)}
            className="rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
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
    <div className="mb-8">
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-primary">{eyebrow}</p>
      <h2 className="font-display text-4xl leading-none md:text-6xl">{title}</h2>
      {sub && <p className="mt-3 max-w-2xl text-muted-foreground">{sub}</p>}
    </div>
  );
}
