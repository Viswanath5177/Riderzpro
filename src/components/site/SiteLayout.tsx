import { Link, useNavigate } from "@tanstack/react-router";
import {
  Home,
  Mic,
  Package,
  ShoppingBag,
  ShoppingCart,
  User,
  Sparkles,
  Bike,
  LogOut,
} from "lucide-react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { Logo } from "./bits";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { to: "/shop", label: "Shop", requiresAuth: false },
  { to: "/garage", label: "My Garage", requiresAuth: true },
  { to: "/orders", label: "Orders", requiresAuth: true },
] as const;

export function SiteLayout({ children }: { children: ReactNode; transparent?: boolean }) {
  const { cart } = useStore();
  const { user, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();
  const count = cart.reduce((s, c) => s + c.qty, 0);

  const handleNavClick = (e: React.MouseEvent, item: (typeof navItems)[number]) => {
    if (item.requiresAuth && !isAuthenticated) {
      e.preventDefault();
      navigate({ to: "/auth", search: { redirect: item.to } });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully", {
      description: "You have been signed out from Riderzpro.",
    });
    navigate({ to: "/" });
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "CU";

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-2xl shadow-xs">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 md:gap-6 md:px-6">
          <Logo />
          <nav className="ml-4 hidden items-center gap-1 md:flex lg:ml-6">
            {navItems.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={(e) => handleNavClick(e, n)}
                className="rounded-full px-3.5 py-1.5 text-sm font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
                activeProps={{ className: "!text-primary !bg-primary/10 font-semibold" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2 sm:gap-2.5">
            {/* AI Assistant button */}
            <Link
              to="/assistant"
              id="navbar-ai-assistant-btn"
              className="group flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary backdrop-blur-xl shadow-xs transition-all hover:bg-primary hover:text-primary-foreground hover:shadow-glow active:scale-95"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary transition group-hover:rotate-12 group-hover:text-primary-foreground" />
              <span>AI Assistant</span>
            </Link>

            {/* Cart Button */}
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

            {/* Signed In vs Signed Out Navbar CTA */}
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    id="navbar-user-menu-btn"
                    className="flex items-center gap-2 rounded-full p-1 pl-1.5 pr-2.5 text-xs font-semibold border border-border/80 bg-card/80 hover:bg-card hover:border-primary/50 transition shadow-xs active:scale-95 cursor-pointer"
                  >
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-primary-foreground font-bold text-xs shadow-xs">
                      {initials}
                    </span>
                    <span className="hidden sm:inline font-semibold text-foreground max-w-[110px] truncate">
                      {user.name.split(" ")[0]}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 rounded-2xl p-1.5 shadow-xl border border-border bg-card/95 backdrop-blur-xl z-50"
                >
                  <div className="px-3 py-2 border-b border-border/70 mb-1">
                    <p className="text-xs font-bold text-foreground truncate">{user.name}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{user.email || user.phone}</p>
                    <span className="mt-1.5 inline-block text-[10px] font-semibold text-primary bg-primary/10 rounded-full px-2 py-0.5">
                      Customer
                    </span>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/dashboard/customer"
                      className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium cursor-pointer hover:bg-muted"
                    >
                      <User className="h-4 w-4 text-primary" />
                      <span>Profile & Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/garage"
                      className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium cursor-pointer hover:bg-muted"
                    >
                      <Bike className="h-4 w-4 text-primary" />
                      <span>My Garage</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/orders"
                      className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium cursor-pointer hover:bg-muted"
                    >
                      <Package className="h-4 w-4 text-primary" />
                      <span>My Orders</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-1 bg-border/60" />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                to="/auth"
                id="navbar-signin-btn"
                className="hidden rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] transition hover:brightness-105 active:scale-95 sm:inline-flex"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </header>
      <main>{children}</main>
      <Footer />
      <MobileTabBar count={count} isAuthenticated={isAuthenticated} />
    </div>
  );
}

function MobileTabBar({ count, isAuthenticated }: { count: number; isAuthenticated: boolean }) {
  const navigate = useNavigate();

  const tabs = [
    { to: "/", label: "Home", Icon: Home, requiresAuth: false },
    { to: "/shop", label: "Shop", Icon: ShoppingBag, requiresAuth: false },
    { to: "/assistant", label: "Ask AI", Icon: Mic, center: true, requiresAuth: false },
    { to: "/orders", label: "Orders", Icon: Package, requiresAuth: true },
    {
      to: isAuthenticated ? "/dashboard/customer" : "/auth",
      search: !isAuthenticated ? { redirect: "/dashboard/customer" } : undefined,
      label: "Me",
      Icon: User,
      requiresAuth: false,
    },
  ] as const;

  const handleClick = (e: React.MouseEvent, tab: (typeof tabs)[number]) => {
    if (tab.requiresAuth && !isAuthenticated) {
      e.preventDefault();
      navigate({ to: "/auth", search: { redirect: tab.to } });
    }
  };

  return (
    <nav className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-md items-center justify-around rounded-full border border-white/20 dark:border-white/10 bg-card/80 px-2 py-2 shadow-2xl backdrop-blur-2xl md:hidden">
      {tabs.map((t) => (
        <Link
          key={t.label}
          to={t.to}
          search={"search" in t ? (t.search as any) : undefined}
          onClick={(e) => handleClick(e, t)}
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
            <li>
              <Link to="/shop" className="hover:text-primary transition-colors">
                Batteries & parts
              </Link>
            </li>
            <li>
              <Link to="/garage" className="hover:text-primary transition-colors">
                VIN lookup
              </Link>
            </li>
            <li>
              <Link to="/assistant" className="hover:text-primary transition-colors">
                Voice assistant
              </Link>
            </li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="mb-3 font-semibold text-foreground">Customer Service</p>
          <ul className="space-y-2.5 text-muted-foreground">
            <li>
              <Link to="/orders" className="hover:text-primary transition-colors">
                Order tracking
              </Link>
            </li>
            <li>
              <Link to="/garage" className="hover:text-primary transition-colors">
                My Garage fitment
              </Link>
            </li>
            <li>
              <Link to="/dashboard/customer" className="hover:text-primary transition-colors">
                Customer dashboard
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <p className="border-t border-border/70 py-6 text-center text-xs text-muted-foreground">
        © 2026 Riderzpro · Designed for India's EV riders
      </p>
    </footer>
  );
}
