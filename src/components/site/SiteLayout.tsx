import { Link } from "@tanstack/react-router";
import { Home, Mic, Package, ShoppingBag, ShoppingCart, User, LayoutDashboard, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { useStore } from "@/lib/store";
import { Logo } from "./bits";

const nav = [
  { to: "/shop", label: "Shop" },
  { to: "/assistant", label: "AI Assistant" },
  { to: "/garage", label: "My Garage" },
  { to: "/orders", label: "Orders" },
  { to: "/dashboards", label: "Dashboards" },
] as const;

export function SiteLayout({ children }: { children: ReactNode; transparent?: boolean }) {
  const { cart } = useStore();
  const count = cart.reduce((s, c) => s + c.qty, 0);
  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-2xl shadow-xs">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 md:gap-6 md:px-6">
          <Logo />
          <nav className="ml-4 hidden items-center gap-1 md:flex lg:ml-6">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="rounded-full px-3.5 py-1.5 text-sm font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
                activeProps={{ className: "!text-primary !bg-primary/10 font-semibold" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2 sm:gap-2.5">
            {/* AI Assistant button in navbar for both Windows/Desktop and Mobile */}
            <Link
              to="/assistant"
              id="navbar-ai-assistant-btn"
              className="group flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary backdrop-blur-xl shadow-xs transition-all hover:bg-primary hover:text-primary-foreground hover:shadow-glow active:scale-95"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary transition group-hover:rotate-12 group-hover:text-primary-foreground" />
              <span>AI Assistant</span>
            </Link>

            <Link
              to="/cart"
              id="navbar-cart-btn"
              aria-label="Cart"
              className="relative grid h-9 w-9 place-items-center rounded-full border border-border/80 bg-card/80 backdrop-blur-xl transition hover:border-primary/50 hover:bg-card hover:text-primary active:scale-95 sm:h-10 sm:w-10"
            >
              <ShoppingCart className="h-4 w-4" />
              {count > 0 && (
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground shadow-sm">
                  {count}
                </span>
              )}
            </Link>
            <Link
              to="/login"
              className="hidden rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] transition hover:brightness-105 active:scale-95 sm:inline-flex"
            >
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
    <nav className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-md items-center justify-around rounded-full border border-white/20 dark:border-white/10 bg-card/80 px-2 py-2 shadow-2xl backdrop-blur-2xl md:hidden">
      {tabs.map((t) => (
        <Link
          key={t.to}
          to={t.to}
          activeOptions={{ exact: t.to === "/" }}
          className="flex flex-1 flex-col items-center gap-0.5 text-[10px] font-semibold text-muted-foreground transition hover:text-foreground"
          activeProps={{ className: "!text-primary" }}
        >
          {"center" in t ? (
            <span className="-mt-6 grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground shadow-glow shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] active:scale-95 transition">
              <t.Icon className="h-5 w-5" />
            </span>
          ) : (
            <span className="relative">
              <t.Icon className="h-5 w-5" />
              {t.to === "/orders" && count > 0 && (
                <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
              )}
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
    <footer className="mt-28 border-t border-border/70 bg-card/30 backdrop-blur-xl">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-4 md:px-6">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-muted-foreground leading-relaxed">
            The marketplace for EV batteries and parts that actually fit. Compare sellers, order once, track every rider live.
          </p>
        </div>
        <div className="text-sm">
          <p className="mb-3 font-semibold text-foreground">Marketplace</p>
          <ul className="space-y-2.5 text-muted-foreground">
            <li><Link to="/shop" className="hover:text-primary transition-colors">Batteries & parts</Link></li>
            <li><Link to="/garage" className="hover:text-primary transition-colors">VIN lookup</Link></li>
            <li><Link to="/assistant" className="hover:text-primary transition-colors">Voice assistant</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="mb-3 font-semibold text-foreground">Partners</p>
          <ul className="space-y-2.5 text-muted-foreground">
            <li><Link to="/dashboard/vendor" className="hover:text-primary transition-colors">Sell on Riderzpro</Link></li>
            <li><Link to="/dashboard/rider" className="hover:text-primary transition-colors">Ride with us</Link></li>
            <li><Link to="/dashboard/workshop" className="hover:text-primary transition-colors">For workshops</Link></li>
          </ul>
        </div>
      </div>
      <p className="border-t border-border/70 py-6 text-center text-xs text-muted-foreground">© 2026 Riderzpro · Designed for India's EV riders</p>
    </footer>
  );
}

export { LayoutDashboard };
