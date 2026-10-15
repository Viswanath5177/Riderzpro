import { Link, useNavigate } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  Bike,
  Shield,
  ArrowLeft,
  LogOut,
  Sparkles,
  Menu,
  X,
  MoreHorizontal,
  Store,
  MessageSquare,
  Settings,
  ChevronUp,
  CheckCircle2,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "./bits";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/auth";
import { DashboardNotificationBell } from "@/components/common/DashboardNotificationBell";

export const ROLE_LINKS = [
  { to: "/dashboard/customer", label: "Customer", Icon: Bike },
  { to: "/dashboard/admin", label: "Admin", Icon: Shield },
] as const;
export type Section = { id: string; label: string; Icon: LucideIcon };

export function DashboardShell({
  title,
  subtitle,
  sections,
  active,
  onSelect,
  children,
  actions,
  userProfile,
}: {
  title: string;
  subtitle: string;
  sections: Section[];
  active: string;
  onSelect: (id: string) => void;
  children: ReactNode;
  actions?: ReactNode;
  userProfile?: { name?: string; email?: string; role?: string; avatar?: string; isVerified?: boolean; badge?: string };
}) {
  const navigate = useNavigate();
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  async function handleSignOut() {
    try {
      await signOut();
    } catch {}
    try {
      localStorage.removeItem("riderzpro_auth_user");
      localStorage.removeItem("riderzpro_auth_token");
      localStorage.removeItem("riderzpro_token");
      localStorage.removeItem("riderzpro_admin_session");
      localStorage.removeItem("riderzpro-v7");
      sessionStorage.clear();
    } catch {}
    window.location.href = "/";
  }

  const showMoreButton = sections.length > 5;
  const bottomBarSections = showMoreButton ? sections.slice(0, 4) : sections;

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar p-4 md:flex">
        <Logo />
        <nav className="mt-8 space-y-1 overflow-y-auto flex-1">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => onSelect(s.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition cursor-pointer",
                active === s.id ? "bg-sidebar-accent text-sidebar-accent-foreground font-bold" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <s.Icon className="h-4 w-4 shrink-0" />
              <span>{s.label}</span>
            </button>
          ))}
        </nav>
        <div className="mt-auto pt-3 border-t border-sidebar-border/60 space-y-2">
          <Link to="/" className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-primary transition">
            <ArrowLeft className="h-3.5 w-3.5" />Back to store
          </Link>

          {/* User Profile Footer Widget - Profile name left below with verified badge */}
          <div className="relative pt-2 border-t border-sidebar-border/40">
            <button
              type="button"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex w-full items-center gap-2.5 rounded-xl p-2 text-left hover:bg-muted/80 transition cursor-pointer"
            >
              <div className="relative shrink-0">
                <div className={cn(
                  "grid h-8 w-8 place-items-center rounded-lg font-bold text-xs shadow-xs",
                  userProfile?.isVerified ? "bg-emerald-600 text-white" : "bg-primary text-primary-foreground"
                )}>
                  {(userProfile?.name || title || "S").charAt(0).toUpperCase()}
                </div>
                {userProfile?.isVerified && (
                  <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 text-white ring-2 ring-sidebar" title="Verified Marketplace Seller">
                    <CheckCircle2 className="h-2.5 w-2.5 stroke-[3]" />
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-foreground truncate">{userProfile?.name || title}</p>
                {userProfile?.isVerified ? (
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 text-[10px] font-bold">
                      <CheckCircle2 className="h-2.5 w-2.5 text-emerald-600 dark:text-emerald-400" />
                      Verified Seller
                    </span>
                  </div>
                ) : (
                  <p className="text-[10px] text-muted-foreground truncate">{userProfile?.email || "Authorized Seller"}</p>
                )}
              </div>
              <ChevronUp className={cn("h-4 w-4 text-muted-foreground transition-transform shrink-0", showProfileMenu ? "rotate-180" : "")} />
            </button>

            {showProfileMenu && (
              <div className="absolute bottom-full left-0 right-0 mb-2 rounded-2xl border border-border bg-card p-1.5 shadow-xl animate-in fade-in slide-in-from-bottom-2 z-50">
                <button
                  onClick={() => {
                    onSelect("shop");
                    setShowProfileMenu(false);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted transition cursor-pointer"
                >
                  <Store className="h-4 w-4 text-primary" />
                  <span>My Shop</span>
                </button>
                <button
                  onClick={() => {
                    onSelect("reviews");
                    setShowProfileMenu(false);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted transition cursor-pointer"
                >
                  <MessageSquare className="h-4 w-4 text-amber-500" />
                  <span>Customer reviews</span>
                </button>
                <button
                  onClick={() => {
                    onSelect("settings");
                    setShowProfileMenu(false);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted transition cursor-pointer"
                >
                  <Settings className="h-4 w-4 text-primary" />
                  <span>Shop settings</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Slide-Over Drawer for All Sections */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setIsMobileDrawerOpen(false)}
          />
          <div className="relative z-10 w-4/5 max-w-xs bg-sidebar border-r border-sidebar-border p-4 flex flex-col h-full shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-sidebar-border">
              <Logo className="flex items-center" imgClassName="h-10 sm:h-11 w-auto" />
              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Dashboard Sections
            </p>
            <nav className="mt-2 space-y-1 overflow-y-auto flex-1">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    onSelect(s.id);
                    setIsMobileDrawerOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition cursor-pointer text-left",
                    active === s.id
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-bold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <s.Icon className="h-4 w-4 shrink-0" />
                  <span>{s.label}</span>
                </button>
              ))}
            </nav>
            <div className="mt-auto pt-3 border-t border-sidebar-border/60 space-y-2">
              <Link
                to="/"
                onClick={() => setIsMobileDrawerOpen(false)}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-primary transition"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to store</span>
              </Link>

              {/* Mobile Profile Footer */}
              <div className="relative pt-2 border-t border-sidebar-border/40">
                <button
                  type="button"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex w-full items-center gap-2.5 rounded-xl p-2 text-left hover:bg-muted/80 transition cursor-pointer"
                >
                  <div className="relative shrink-0">
                    <div className={cn(
                      "grid h-8 w-8 place-items-center rounded-lg font-bold text-xs shadow-xs",
                      userProfile?.isVerified ? "bg-emerald-600 text-white" : "bg-primary text-primary-foreground"
                    )}>
                      {(userProfile?.name || title || "S").charAt(0).toUpperCase()}
                    </div>
                    {userProfile?.isVerified && (
                      <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 text-white ring-2 ring-sidebar" title="Verified Marketplace Seller">
                        <CheckCircle2 className="h-2.5 w-2.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-foreground truncate">{userProfile?.name || title}</p>
                    {userProfile?.isVerified ? (
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 text-[10px] font-bold">
                          <CheckCircle2 className="h-2.5 w-2.5 text-emerald-600 dark:text-emerald-400" />
                          Verified Seller
                        </span>
                      </div>
                    ) : (
                      <p className="text-[10px] text-muted-foreground truncate">{userProfile?.email || "Authorized Seller"}</p>
                    )}
                  </div>
                  <ChevronUp className={cn("h-4 w-4 text-muted-foreground transition-transform shrink-0", showProfileMenu ? "rotate-180" : "")} />
                </button>

                {showProfileMenu && (
                  <div className="mt-1 rounded-2xl border border-border bg-card p-1.5 shadow-xl">
                    <button
                      onClick={() => {
                        onSelect("shop");
                        setShowProfileMenu(false);
                        setIsMobileDrawerOpen(false);
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted transition cursor-pointer"
                    >
                      <Store className="h-4 w-4 text-primary" />
                      <span>My Shop</span>
                    </button>
                    <button
                      onClick={() => {
                        onSelect("reviews");
                        setShowProfileMenu(false);
                        setIsMobileDrawerOpen(false);
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted transition cursor-pointer"
                    >
                      <MessageSquare className="h-4 w-4 text-amber-500" />
                      <span>Customer reviews</span>
                    </button>
                    <button
                      onClick={() => {
                        onSelect("settings");
                        setShowProfileMenu(false);
                        setIsMobileDrawerOpen(false);
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted transition cursor-pointer"
                    >
                      <Settings className="h-4 w-4 text-primary" />
                      <span>Shop settings</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="md:pl-64 min-w-0">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-2 border-b border-border px-3 sm:px-4 py-2.5 sm:py-3 bg-white md:px-8 shadow-2xs">
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
              className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-white text-foreground hover:bg-muted active:scale-95 transition cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {isMobileDrawerOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
            </button>
            <Logo className="flex items-center" imgClassName="h-10 sm:h-11 md:h-12 w-auto" />
          </div>
          <div className="hidden md:block min-w-0">
            <div className="flex items-center gap-2.5">
              <h1 className="font-display text-2xl lg:text-3xl leading-none truncate">{title}</h1>
              {userProfile?.isVerified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 px-2 py-0.5 text-xs font-bold shrink-0">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  Verified Seller
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">{subtitle}</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {actions}
            <DashboardNotificationBell role="seller" />
            <Link
              to="/assistant"
              className="group flex items-center gap-1 sm:gap-1.5 rounded-full border border-primary bg-red-50 px-2.5 sm:px-3.5 py-1.5 text-xs font-semibold text-primary shadow-2xs transition-all hover:bg-primary hover:text-white active:scale-95"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary transition group-hover:rotate-12 group-hover:text-primary-foreground" />
              <span className="hidden sm:inline">AI Assistant</span>
              <span className="sm:hidden text-[11px]">AI</span>
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex h-9 sm:h-10 items-center gap-1.5 rounded-xl border border-border px-2.5 sm:px-3 text-xs sm:text-sm font-medium hover:bg-muted cursor-pointer"
            >
              <LogOut className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </header>

        {/* Mobile Page Header Title */}
        <div className="px-4 pt-4 md:hidden">
          <h1 className="font-display text-xl sm:text-2xl font-extrabold leading-tight tracking-tight text-foreground">{title}</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
        </div>

        <main className="p-3 sm:p-4 md:p-8 min-w-0">{children}</main>
      </div>

      {/* Mobile Bottom Dock Navigation */}
      <nav className="fixed inset-x-2.5 bottom-2.5 z-40 flex justify-around rounded-2xl border border-border px-1 py-1.5 shadow-card bg-white/95 backdrop-blur-md md:hidden">
        {bottomBarSections.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelect(s.id)}
            className={cn(
              "flex flex-1 flex-col items-center gap-0.5 py-1 text-[9.5px] font-medium transition cursor-pointer",
              active === s.id ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <s.Icon className="h-4.5 w-4.5" />
            <span className="truncate max-w-[58px]">{s.label.split(" ")[0]}</span>
          </button>
        ))}
        {showMoreButton && (
          <button
            type="button"
            onClick={() => setIsMobileDrawerOpen(true)}
            className="flex flex-1 flex-col items-center gap-0.5 py-1 text-[9.5px] font-medium text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <MoreHorizontal className="h-4.5 w-4.5" />
            <span>More</span>
          </button>
        )}
      </nav>
    </div>
  );
}

export function Stat({ label, value, delta, Icon }: { label: string; value: string; delta?: string; Icon: LucideIcon }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent text-accent-foreground"><Icon className="h-4 w-4" /></span>
      </div>
      <p className="mt-3 font-display text-4xl leading-none">{value}</p>
      {delta && <p className="mt-1 text-xs font-semibold text-success">{delta}</p>}
    </div>
  );
}

export function Panel({ title, children, className, action }: { title: string; children: ReactNode; className?: string; action?: ReactNode }) {
  return (
    <section className={cn("rounded-3xl border border-border bg-card p-5 shadow-card", className)}>
      <div className="mb-4 flex items-center justify-between"><h2 className="font-display text-2xl">{title}</h2>{action}</div>
      {children}
    </section>
  );
}

export function StatusPill({ s }: { s: string }) {
  const tone = /deliver|approved|paid|active|done|online/i.test(s) ? "bg-success/15 text-success" : /pending|new|review|waiting/i.test(s) ? "bg-warning/20 text-warning" : /reject|cancel|low|dispute/i.test(s) ? "bg-destructive/15 text-destructive" : "bg-accent text-accent-foreground";
  return <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", tone)}>{s}</span>;
}
