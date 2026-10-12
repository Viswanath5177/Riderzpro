import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight, Battery, BatteryCharging, Cpu, Disc, Gauge, MapPin, Mic, PackageCheck, Search,
  ShieldCheck, Store, Truck, Wrench, Zap, Bike as BikeIcon, Star,
} from "lucide-react";
import { toast } from "sonner";
import heroBike from "@/assets/hero-bike.jpg";
import workshopImg from "@/assets/workshop.jpg";
import riderImg from "@/assets/rider.jpg";
import scooterImg from "@/assets/scooter.jpg";
import battery1 from "@/assets/battery-1.jpg";
import chargerImg from "@/assets/charger.jpg";
import partsImg from "@/assets/parts.jpg";
import battery3 from "@/assets/battery-3.jpg";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductCard, SectionTitle } from "@/components/site/bits";
import { bikes, decodeVin, products } from "@/lib/data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Riderzpro — EV batteries & parts that fit your bike" },
      { name: "description", content: "Enter your VIN or pick your EV, compare sellers, place one order across vendors and track your rider live." },
      { property: "og:title", content: "Riderzpro — EV batteries & parts that fit your bike" },
      { property: "og:description", content: "Compare EV battery sellers, order once, track delivery live." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <SiteLayout>
      <Hero />
      <BrandStrip />
      <Categories />
      <HowItWorks />
      <Featured />
      <Roles />
      <Testimonials />
      <AppCta />
    </SiteLayout>
  );
}

function Hero() {
  const nav = useNavigate();
  const { addBike } = useStore();
  const [mode, setMode] = useState<"bike" | "vin">("bike");
  const [vin, setVin] = useState("");
  const [bikeId, setBikeId] = useState(bikes[0].id);

  const go = () => {
    if (mode === "vin") {
      const r = decodeVin(vin);
      if (!r.ok || !r.bike) return toast.error(r.error);
      addBike({ bikeId: r.bike.id, year: r.year, vin: vin.toUpperCase() });
      toast.success(`Found ${r.bike.make} ${r.bike.model}${r.year ? ` (${r.year})` : ""}`);
    } else addBike({ bikeId });
    nav({ to: "/shop" });
  };

  return (
    <section className="relative isolate min-h-[92svh] overflow-hidden bg-background text-foreground">
      <img
        src={heroBike}
        alt="Electric motorbike"
        width={1920}
        height={1088}
        className="absolute inset-0 -z-20 h-full w-full object-cover object-[75%_center] opacity-15 filter contrast-125"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background via-background/90 to-background/50" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-36 bg-gradient-to-t from-background to-transparent" />

      {/* ambient light refractions */}
      <div className="pointer-events-none absolute -top-24 left-1/4 -z-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 right-10 -z-10 h-96 w-96 rounded-full bg-[oklch(0.65_0.15_220/8%)] blur-3xl" />

      {/* charge lines */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden opacity-30">
        {[22, 48, 71].map((top, i) => (
          <div key={top} className="absolute h-px w-full overflow-hidden" style={{ top: `${top}%` }}>
            <div className="charge-line h-px w-1/2" style={{ animationDelay: `${i * 1.1}s` }} />
          </div>
        ))}
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-20 pt-16 md:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:pt-24">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/80 px-3.5 py-1.5 text-xs font-semibold text-foreground backdrop-blur-xl shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary" />
              <span className="relative h-2 w-2 rounded-full bg-primary" />
            </span>
            128 riders delivering in Bengaluru now
          </span>
          <h1 className="mt-6 font-display text-5xl font-extrabold tracking-tight sm:text-7xl lg:text-[5.5rem] leading-[1.05] text-foreground">
            Power your ride.<br />
            <span className="bg-gradient-to-r from-primary via-[oklch(0.55_0.19_145)] to-[oklch(0.50_0.18_160)] bg-clip-text text-transparent">
              Parts that fit.
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed font-normal">
            Batteries, chargers and spares for every EV — matched to your VIN, compared across sellers, delivered in one order with a rider you can track live.
          </p>

          {/* Search card */}
          <div className="mt-8 max-w-xl rounded-3xl border border-border/80 bg-card/85 p-3 shadow-2xl backdrop-blur-2xl">
            <div className="flex gap-1.5 p-1">
              {(["bike", "vin"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                    mode === m
                      ? "bg-primary text-primary-foreground shadow-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  {m === "bike" ? "Pick my bike" : "Enter VIN"}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-2 p-2 sm:flex-row">
              {mode === "bike" ? (
                <div className="flex flex-1 items-center gap-2.5 rounded-2xl border border-border/80 bg-background/80 px-4 backdrop-blur-md">
                  <BikeIcon className="h-5 w-5 text-primary" />
                  <select
                    value={bikeId}
                    onChange={(e) => setBikeId(e.target.value)}
                    className="h-12 w-full bg-transparent text-foreground outline-none [&>option]:text-foreground [&>option]:bg-card"
                  >
                    {bikes.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.make} {b.model} · {b.voltage}V
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="flex flex-1 items-center gap-2.5 rounded-2xl border border-border/80 bg-background/80 px-4 backdrop-blur-md">
                  <Search className="h-5 w-5 text-primary" />
                  <input
                    value={vin}
                    onChange={(e) => setVin(e.target.value)}
                    maxLength={17}
                    placeholder="e.g. P6R1S1PR2PN000001"
                    className="h-12 w-full bg-transparent font-mono uppercase tracking-wider text-foreground outline-none placeholder:text-muted-foreground/60"
                  />
                </div>
              )}
              <button
                onClick={go}
                className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-6 font-semibold text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] transition-all hover:brightness-105 active:scale-95"
              >
                Find parts <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/assistant"
              className="flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-5 py-2.5 text-sm font-semibold text-primary backdrop-blur-xl transition hover:bg-primary hover:text-primary-foreground hover:shadow-glow"
            >
              <Mic className="h-4 w-4" /> Talk to AI assistant
            </Link>
            <Link
              to="/shop"
              className="flex items-center gap-2 rounded-full border border-border/80 bg-card/80 px-5 py-2.5 text-sm font-semibold text-foreground backdrop-blur-xl transition hover:border-primary/50"
            >
              Browse all parts <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Floating cards */}
        <div className="relative hidden h-[520px] lg:block">
          <div className="animate-float absolute right-0 top-4 w-76 rounded-3xl border border-border/80 bg-card/90 p-5 shadow-2xl backdrop-blur-2xl">
            <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
              <span>Order #RZ48213</span>
              <span className="flex items-center gap-1.5 text-primary font-semibold">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" /> Live
              </span>
            </div>
            <p className="mt-2 font-display text-2xl font-bold tracking-tight text-foreground">Arriving in 18 min</p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-2/3 rounded-full bg-primary" />
            </div>
            <div className="mt-4 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-primary font-bold text-primary-foreground shadow-sm">
                RK
              </span>
              <div className="text-sm">
                <p className="font-semibold text-foreground">Ravi Kumar</p>
                <p className="text-xs text-muted-foreground">2 pickups · Ather Rizta</p>
              </div>
            </div>
          </div>
          <div
            className="animate-float absolute left-4 top-56 w-64 rounded-3xl border border-border/80 bg-card/90 p-5 shadow-2xl backdrop-blur-2xl"
            style={{ animationDelay: "1.5s" }}
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <ShieldCheck className="h-4 w-4" /> Fitment verified
            </div>
            <p className="mt-2 text-sm text-foreground/80 leading-snug">
              VoltRide 60V 30Ah fits your <b className="text-foreground">Ola S1 Pro 2023</b>
            </p>
          </div>
          <div className="absolute bottom-6 right-6 grid grid-cols-2 gap-3">
            {[
              ["6+", "Verified sellers"],
              ["1.2k", "Parts listed"],
              ["38m", "Avg delivery"],
              ["4.8★", "Rider rating"],
            ].map(([v, l]) => (
              <div
                key={l}
                className="rounded-2xl border border-border/80 bg-card/90 px-4 py-3 shadow-md backdrop-blur-xl"
              >
                <p className="font-display text-2xl font-bold tracking-tight text-primary">{v}</p>
                <p className="text-xs text-muted-foreground">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function BrandStrip() {
  return (
    <div className="border-y border-border/70 bg-card/40 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-12 gap-y-4 px-4 py-6 font-display text-lg font-semibold tracking-wide text-muted-foreground md:justify-between">
        {["Ather", "Ola Electric", "TVS iQube", "Bajaj Chetak", "Revolt", "Hero Vida"].map((b) => (
          <span key={b} className="opacity-70 transition hover:text-primary hover:opacity-100">
            {b}
          </span>
        ))}
      </div>
    </div>
  );
}

function Categories() {
  const cats = [
    { name: "Batteries", img: battery1, Icon: Battery, count: 6 },
    { name: "Chargers", img: chargerImg, Icon: BatteryCharging, count: 2 },
    { name: "Motors & Controllers", img: partsImg, Icon: Cpu, count: 2 },
    { name: "Performance packs", img: battery3, Icon: Gauge, count: 2 },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 pt-24 md:px-6">
      <SectionTitle eyebrow="Shop by category" title="Everything your EV runs on" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cats.map((c, i) => (
          <Link
            key={c.name}
            to="/shop"
            className={`group relative overflow-hidden rounded-3xl border border-border/80 bg-card/70 backdrop-blur-xl shadow-card transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:border-primary/40 ${
              i === 0 ? "lg:row-span-2" : ""
            }`}
          >
            <img
              src={c.img}
              alt={c.name}
              loading="lazy"
              width={1024}
              height={1024}
              className={`w-full object-cover transition duration-700 group-hover:scale-105 ${
                i === 0 ? "aspect-square lg:aspect-auto lg:h-full" : "aspect-[4/3]"
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 text-white">
              <div>
                <c.Icon className="mb-2 h-6 w-6 text-primary" />
                <p className="font-display text-xl font-bold leading-tight md:text-2xl">{c.name}</p>
                <p className="text-xs text-white/70">{c.count}+ products</p>
              </div>
              <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground shadow-sm transition group-hover:rotate-[-45deg]">
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { Icon: Search, t: "Find", d: "Enter your VIN or pick your bike. We show only parts verified to fit." },
    { Icon: Disc, t: "Compare", d: "See prices, stock and delivery time from every nearby seller side by side." },
    { Icon: PackageCheck, t: "One order", d: "Mix items from many vendors. Delivery is priced per km — no surprises." },
    { Icon: MapPin, t: "Track live", d: "Watch your rider on the map, then call or chat once they accept." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 pt-28 md:px-6">
      <SectionTitle
        eyebrow="How it works"
        title="From VIN to doorstep"
        sub="Built for riders, workshops and dealers who are tired of guessing which battery fits."
      />
      <div className="grid gap-4 md:grid-cols-4">
        {steps.map((s, i) => (
          <div
            key={s.t}
            className="relative rounded-3xl border border-border/80 bg-card/75 p-6 shadow-card backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:border-primary/40"
          >
            <span className="font-display text-4xl font-extrabold text-primary/30">0{i + 1}</span>
            <s.Icon className="mt-3 h-7 w-7 text-primary" />
            <p className="mt-4 font-display text-xl font-bold tracking-tight">{s.t}</p>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Featured() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-28 md:px-6">
      <div className="flex items-end justify-between">
        <SectionTitle eyebrow="Trending now" title="Top batteries this week" />
        <Link
          to="/shop"
          className="mb-10 hidden items-center gap-1.5 text-sm font-semibold text-primary transition hover:underline md:flex"
        >
          View all <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {products
          .filter((p) => p.category === "Battery")
          .slice(0, 4)
          .map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
      </div>
    </section>
  );
}

function Roles() {
  const roles = [
    { t: "Riders & owners", d: "Garage, VIN fitment, live tracking.", img: scooterImg, to: "/dashboard/customer", Icon: BikeIcon },
    { t: "Workshops & mechanics", d: "Bulk orders and job cards per vehicle.", img: workshopImg, to: "/dashboard/workshop", Icon: Wrench },
    { t: "Vendors & dealers", d: "Inventory, fitment tags and payouts.", img: battery3, to: "/dashboard/vendor", Icon: Store },
    { t: "Delivery riders", d: "Accept jobs, multi-pickup routes, earnings.", img: riderImg, to: "/dashboard/rider", Icon: Truck },
  ] as const;
  return (
    <section className="mx-auto max-w-7xl px-4 pt-28 md:px-6">
      <SectionTitle eyebrow="One platform, every role" title="Pick your dashboard" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {roles.map((r) => (
          <Link
            key={r.t}
            to={r.to}
            className="group overflow-hidden rounded-3xl border border-border/80 bg-card/75 backdrop-blur-xl shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:border-primary/50"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={r.img}
                alt={r.t}
                loading="lazy"
                width={1280}
                height={896}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
            </div>
            <div className="p-5">
              <r.Icon className="h-5 w-5 text-primary" />
              <p className="mt-3 text-base font-bold tracking-tight">{r.t}</p>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{r.d}</p>
              <p className="mt-4 flex items-center gap-1 text-xs font-semibold text-primary">
                Open dashboard <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  const t = [
    { n: "Priya S.", r: "Ather 450X owner", q: "Entered my VIN and got three verified batteries in seconds. Rider showed up in 32 minutes." },
    { n: "Manjunath Auto Works", r: "Workshop, Jayanagar", q: "We order from four vendors in one go now. Delivery charges are finally transparent." },
    { n: "VoltHub", r: "Dealer, Indiranagar", q: "Orders come pre-matched to the customer's bike — almost zero returns this month." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 pt-28 md:px-6">
      <SectionTitle eyebrow="Loved on the road" title="Riders trust Riderzpro" />
      <div className="grid gap-4 md:grid-cols-3">
        {t.map((x) => (
          <figure
            key={x.n}
            className="rounded-3xl border border-border/80 bg-card/75 p-6 backdrop-blur-xl shadow-card"
          >
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-warning text-warning" />
              ))}
            </div>
            <blockquote className="mt-4 text-base leading-relaxed text-foreground/90">“{x.q}”</blockquote>
            <figcaption className="mt-6 text-sm">
              <b className="font-semibold">{x.n}</b> <span className="text-muted-foreground">· {x.r}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function AppCta() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-28 md:px-6">
      <div className="relative overflow-hidden rounded-[2.5rem] border border-white/20 bg-gradient-to-br from-primary via-[oklch(0.68_0.20_145)] to-[oklch(0.58_0.19_150)] p-10 text-primary-foreground shadow-2xl backdrop-blur-2xl md:p-16">
        <Zap className="absolute -right-10 -top-10 h-72 w-72 opacity-10" fill="currentColor" />
        <p className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl leading-[1.08]">
          Install Riderzpro<br />on your phone.
        </p>
        <p className="mt-4 max-w-lg text-primary-foreground/90 leading-relaxed font-normal">
          Open this site on your phone and tap “Add to Home Screen” — it works like a native app with live tracking and voice search.
        </p>
        <Link
          to="/shop"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-foreground shadow-lg transition hover:bg-white/90 active:scale-95"
        >
          Start shopping <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
