import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Bike, Shield, Store, Truck, Wrench, ArrowLeft, Sparkles, type LucideIcon } from "lucide-react";
import { Logo } from "./bits";
import { cn } from "@/lib/utils";

export const ROLE_LINKS = [
  { to: "/dashboard/customer", label: "Customer", Icon: Bike },
  { to: "/dashboard/workshop", label: "Workshop", Icon: Wrench },
  { to: "/dashboard/vendor", label: "Vendor", Icon: Store },
  { to: "/dashboard/rider", label: "Rider", Icon: Truck },
  { to: "/dashboard/admin", label: "Admin", Icon: Shield },
] as const;

export type Section = { id: string; label: string; Icon: LucideIcon };

export function DashboardShell({
  title, subtitle, sections, active, onSelect, children, actions,
}: {
  title: string; subtitle: string; sections: Section[]; active: string; onSelect: (id: string) => void; children: ReactNode; actions?: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar p-4 md:flex">
        <Logo />
        <nav className="mt-8 space-y-1">
          {sections.map((s) => (
            <button key={s.id} onClick={() => onSelect(s.id)} className={cn("flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition", active === s.id ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>
              <s.Icon className="h-4 w-4" /> {s.label}
            </button>
          ))}
        </nav>
        <div className="mt-auto">
          <Link to="/assistant" className="mb-3 flex items-center gap-2.5 rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-xs font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground">
            <Sparkles className="h-4 w-4" />AI Assistant
          </Link>
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Switch dashboard</p>
          {ROLE_LINKS.map((r) => (
            <Link key={r.to} to={r.to} className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-muted-foreground hover:text-primary" activeProps={{ className: "!text-primary font-semibold" }}>
              <r.Icon className="h-4 w-4" />{r.label}
            </Link>
          ))}
          <Link to="/" className="mt-2 flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-primary"><ArrowLeft className="h-3 w-3" />Back to store</Link>
        </div>
      </aside>
      <div className="md:pl-64">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border px-4 py-3 glass md:px-8">
          <div className="md:hidden"><Logo /></div>
          <div className="hidden md:block">
            <h1 className="font-display text-3xl leading-none">{title}</h1>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {actions}
            <Link
              to="/assistant"
              className="group flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary backdrop-blur-xl shadow-xs transition-all hover:bg-primary hover:text-primary-foreground hover:shadow-glow active:scale-95"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary transition group-hover:rotate-12 group-hover:text-primary-foreground" />
              <span className="hidden sm:inline">AI Assistant</span>
              <span className="sm:hidden">AI</span>
            </Link>
          </div>
        </header>
        <div className="flex gap-2 overflow-x-auto border-b border-border px-4 py-2 md:hidden">
          {ROLE_LINKS.map((r) => (
            <Link key={r.to} to={r.to} className="whitespace-nowrap rounded-full border border-border px-3 py-1 text-xs" activeProps={{ className: "!border-primary !bg-primary !text-primary-foreground" }}>{r.label}</Link>
          ))}
        </div>
        <div className="px-4 pt-4 md:hidden">
          <h1 className="font-display text-4xl leading-none">{title}</h1>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <main className="p-4 md:p-8">{children}</main>
      </div>
      <nav className="fixed inset-x-3 bottom-3 z-50 flex justify-around rounded-2xl border border-border px-1 py-2 shadow-card glass md:hidden">
        {sections.slice(0, 5).map((s) => (
          <button key={s.id} onClick={() => onSelect(s.id)} className={cn("flex flex-1 flex-col items-center gap-0.5 text-[10px] font-medium", active === s.id ? "text-primary" : "text-muted-foreground")}>
            <s.Icon className="h-5 w-5" />{s.label}
          </button>
        ))}
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
