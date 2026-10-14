import { type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Home, ShoppingBag, Package, User } from "lucide-react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { AIChatButton } from "./AIChatButton";
import { CartDrawer } from "@/components/common/CartDrawer";
import { useStore } from "@/lib/store";
import { useAuth } from "@/lib/auth";

export function SiteLayout({ children }: { children: ReactNode; transparent?: boolean }) {
  const { cart } = useStore();
  const { isAuthenticated } = useAuth();
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  return (
    <div className="min-h-screen bg-white text-[#111111] pb-16 md:pb-0 font-sans selection:bg-red-500 selection:text-white flex flex-col">
      <Header />
      <main className="flex-1 min-h-[calc(100vh-72px)]">{children}</main>
      <Footer />
      <AIChatButton />
      <MobileBottomBar count={cartCount} isAuthenticated={isAuthenticated} />
      <CartDrawer />
    </div>
  );
}

function MobileBottomBar({
  count,
  isAuthenticated,
}: {
  count: number;
  isAuthenticated: boolean;
}) {
  const navigate = useNavigate();

  const tabs = [
    { to: "/", label: "Home", Icon: Home, requiresAuth: false },
    { to: "/shop", label: "Shop", Icon: ShoppingBag, requiresAuth: false },
    { to: "/orders", label: "Orders", Icon: Package, requiresAuth: true },
    {
      to: isAuthenticated ? "/dashboard/customer" : "/auth",
      search: !isAuthenticated ? { redirect: "/dashboard/customer" } : undefined,
      label: "Account",
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
    <nav className="fixed inset-x-0 bottom-0 z-30 flex h-14 items-center justify-around border-t border-[#ececec] bg-white/95 px-2 backdrop-blur-md md:hidden">
      {tabs.map((t) => (
        <Link
          key={t.label}
          to={t.to}
          search={"search" in t ? (t.search as any) : undefined}
          onClick={(e) => handleClick(e, t)}
          activeOptions={{ exact: t.to === "/" }}
          className="flex flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-semibold text-[#6b7280] transition hover:text-[#111111]"
          activeProps={{ className: "!text-[#e11d2a]" }}
        >
          <span className="relative">
            <t.Icon className="h-4.5 w-4.5" />
            {t.to === "/orders" && count > 0 && (
              <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-[#e11d2a]" />
            )}
          </span>
          <span>{t.label}</span>
        </Link>
      ))}
    </nav>
  );
}
