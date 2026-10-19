import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { isMobileDevice } from "@/lib/native/app";
import { ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ROLE_LINKS } from "@/components/site/DashboardShell";

export const Route = createFileRoute("/dashboards")({
  head: () => ({ meta: [
    { title: "Dashboards — Riderzpro" },
    { name: "description", content: "Open the RiderzPro customer or admin dashboard." },
    { property: "og:title", content: "Dashboards — Riderzpro" },
    { property: "og:description", content: "RiderzPro customer and admin workspaces." },
  ] }),
  component: Dashboards,
});

const desc: Record<string, string> = {
  Customer: "Garage, live deliveries, orders and technician bookings.",
  Admin: "Manage RiderzPro products, orders, customers and operations.",
};

export function RolePicker() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {ROLE_LINKS.map((r) => (
        <Link
          key={r.to}
          to={r.to}
          className="group rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-[#111111]"
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
  const navigate = useNavigate();

  useEffect(() => {
    if (isMobileDevice()) {
      navigate({ to: "/app", replace: true });
    }
  }, [navigate]);

  if (typeof window !== "undefined" && isMobileDevice()) {
    return null;
  }

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
