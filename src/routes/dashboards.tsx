import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ROLE_LINKS } from "@/components/site/DashboardShell";

export const Route = createFileRoute("/dashboards")({
  head: () => ({ meta: [
    { title: "Dashboards — Riderzpro" },
    { name: "description", content: "Open the customer, workshop, vendor, rider or admin dashboard." },
    { property: "og:title", content: "Dashboards — Riderzpro" },
    { property: "og:description", content: "One platform for every role in EV parts." },
  ] }),
  component: Dashboards,
});

const desc: Record<string, string> = {
  Customer: "Garage, live deliveries, orders and technician bookings.",
  Vendor: "Revenue, incoming orders, inventory and payouts.",
  Rider: "Nearby jobs, multi-pickup routes and earnings.",
};

export function RolePicker() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {ROLE_LINKS.map((r) => (
        <Link
          key={r.to}
          to={r.to}
          className="group rounded-3xl border border-border/80 bg-card/85 p-6 shadow-card backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:border-primary/50"
        >
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary shadow-xs transition group-hover:bg-primary group-hover:text-primary-foreground">
            <r.Icon className="h-6 w-6" />
          </span>
          <p className="mt-4 font-display text-2xl font-bold tracking-tight text-foreground">{r.label}</p>
          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{desc[r.label]}</p>
          <p className="mt-4 flex items-center gap-1 text-sm font-semibold text-primary">
            Open <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </p>
        </Link>
      ))}
    </div>
  );
}

function Dashboards() {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Workspaces</p>
        <h1 className="mb-8 font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">Choose a dashboard</h1>
        <RolePicker />
      </div>
    </SiteLayout>
  );
}
