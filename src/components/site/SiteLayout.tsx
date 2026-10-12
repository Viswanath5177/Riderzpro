import { Link } from "@tanstack/react-router";
import { Home, Mic, Package, ShoppingBag, ShoppingCart, User, LayoutDashboard } from "lucide-react";
import type { ReactNode } from "react";
import { useStore } from "@/lib/store";
import { Logo, ThemeToggle } from "./bits";

const nav = [
  { to: "/shop", label: "Shop" },
  { to: "/assistant", label: "AI Assistant" },
  { to: "/garage", label: "My Garage" },
  { to: "/orders", label: "Orders" },
  { to: "/dashboards", label: "Dashboards" },
] as const;

export function SiteLayout({ children, transparent }: { children: ReactNode; transparent?: boolean }) {
  const { cart } = useStore();
  const count = cart.reduce((s, c) => s + c.qty, 0);
  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <header
        className={
          transparent
            ? "absolute inset-x-0 top-0 z-40"
            : "sticky top-0 z-40 border-b border-border glass"
        }
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 md:px-6">
          <Logo className={transparent ? "text-hero-ink" : ""} />
          <nav className="ml-6 hidden items-center gap-1 md:flex">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className={`rounded-full px-4 py-2 text-sm font-medium transition hover:text-primary ${transparent ? "text-hero-ink/80" : "text-muted-foreground"}`}
                activeProps={{ className: "!text-primary" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <Link to="/cart" className="relative grid h-10 w-10 place-items-center rounded-full border border-border bg-card/60 transition hover:border-primary hover:text-primary">
              <ShoppingCart className="h-4 w-4" />
              {count > 0 && (
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">{count}</span>
              )}
            </Link>
            <Link to="/login" className="hidden rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground md:inline-flex">
              Sign in
            </Link>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <Footer />
      <MobileTabBar count={count} />
    </div>
  );
}

function MobileTabBar({ count }: { count: number }) {
  const tabs = [
    { to: "/", label: "Home", Icon: Home },
    { to: "/shop", label: "Shop", Icon: ShoppingBag },
    { to: "/assistant", label: "Ask AI", Icon: Mic, center: true },
    { to: "/orders", label: "Orders", Icon: Package },
    { to: "/dashboards", label: "Me", Icon: User },
  ] as const;
  return (
    <nav className="fixed inset-x-3 bottom-3 z-50 flex items-center justify-around rounded-2xl border border-border px-2 py-2 shadow-card glass md:hidden">
      {tabs.map((t) => (
        <Link
          key={t.to}
          to={t.to}
          activeOptions={{ exact: t.to === "/" }}
          className="flex flex-1 flex-col items-center gap-0.5 text-[10px] font-medium text-muted-foreground"
          activeProps={{ className: "!text-primary" }}
        >
          {"center" in t ? (
            <span className="-mt-7 grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground shadow-glow">
              <t.Icon className="h-5 w-5" />
            </span>
          ) : (
            <span className="relative">
              <t.Icon className="h-5 w-5" />
              {t.to === "/orders" && count > 0 && <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-primary" />}
            </span>
          )}
          {t.label}
        </Link>
      ))}
    </nav>
  );
}

function Footer() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4 md:px-6">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            The marketplace for EV batteries and parts that actually fit. Compare sellers, order once, track every rider live.
          </p>
        </div>
        <div className="text-sm">
          <p className="mb-3 font-semibold">Marketplace</p>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link to="/shop" className="hover:text-primary">Batteries & parts</Link></li>
            <li><Link to="/garage" className="hover:text-primary">VIN lookup</Link></li>
            <li><Link to="/assistant" className="hover:text-primary">Voice assistant</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="mb-3 font-semibold">Partners</p>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link to="/dashboard/vendor" className="hover:text-primary">Sell on Riderzpro</Link></li>
            <li><Link to="/dashboard/rider" className="hover:text-primary">Ride with us</Link></li>
            <li><Link to="/dashboard/workshop" className="hover:text-primary">For workshops</Link></li>
          </ul>
        </div>
      </div>
      <p className="border-t border-border py-6 text-center text-xs text-muted-foreground">© 2026 Riderzpro · Made for India's EV riders</p>
    </footer>
  );
}

export { LayoutDashboard };
