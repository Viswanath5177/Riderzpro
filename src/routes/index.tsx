import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  Battery,
  BatteryCharging,
  Cpu,
  Disc,
  Gauge,
  MapPin,
  Mic,
  PackageCheck,
  Search,
  ShieldCheck,
  Store,
  Truck,
  Wrench,
  Zap,
  Bike as BikeIcon,
  Star,
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
      {
        name: "description",
        content:
          "Enter your VIN or pick your EV, compare sellers, place one order across vendors and track your rider live.",
      },
      { property: "og:title", content: "Riderzpro — EV batteries & parts that fit your bike" },
      {
        property: "og:description",
        content: "Compare EV battery sellers, order once, track delivery live.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <SiteLayout transparent>
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
    <section className="relative isolate min-h-[100svh] overflow-hidden text-hero-ink">
      <img
        src={heroBike}
        alt="Electric motorbike with glowing battery at night"
        width={1920}
        height={1088}
        className="absolute inset-0 -z-20 h-full w-full object-cover object-[70%_center]"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[oklch(0.12_0.01_260)] via-[oklch(0.12_0.01_260/0.75)] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-background to-transparent" />
      {/* charge lines */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden opacity-70">
        {[22, 48, 71].map((top, i) => (
          <div
            key={top}
            className="absolute h-px w-full overflow-hidden"
            style={{ top: `${top}%` }}
          >
            <div className="charge-line h-px w-1/2" style={{ animationDelay: `${i * 1.1}s` }} />
          </div>
        ))}
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-24 pt-28 md:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:pt-36">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-[oklch(1_0_0/0.15)] bg-[oklch(1_0_0/0.06)] px-3 py-1.5 text-xs font-semibold backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary" />
              <span className="relative h-2 w-2 rounded-full bg-primary" />
            </span>
            128 riders delivering in Bengaluru now
          </span>
          <h1 className="mt-6 font-display text-[clamp(3.5rem,10vw,8.5rem)] leading-[0.85]">
            Power your ride.
            <br />
            <span className="bg-gradient-to-r from-primary to-[oklch(0.85_0.17_160)] bg-clip-text text-transparent">
              Parts that fit.
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-[oklch(0.98_0_0/0.75)]">
            Batteries, chargers and spares for every EV — matched to your VIN, compared across
            sellers, delivered in one order with a rider you can track live.
          </p>

          {/* Search card */}
          <div className="mt-8 max-w-xl rounded-3xl border border-[oklch(1_0_0/0.12)] bg-[oklch(0.15_0.01_260/0.65)] p-2 shadow-glow backdrop-blur-xl">
            <div className="flex gap-1 p-1">
              {(["bike", "vin"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 rounded-2xl px-4 py-2 text-sm font-semibold transition ${mode === m ? "bg-primary text-primary-foreground" : "text-[oklch(1_0_0/0.7)] hover:text-hero-ink"}`}
                >
                  {m === "bike" ? "Pick my bike" : "Enter VIN"}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-2 p-2 sm:flex-row">
              {mode === "bike" ? (
                <div className="flex flex-1 items-center gap-2 rounded-2xl bg-[oklch(1_0_0/0.08)] px-4">
                  <BikeIcon className="h-5 w-5 text-primary" />
                  <select
                    value={bikeId}
                    onChange={(e) => setBikeId(e.target.value)}
                    className="h-12 w-full bg-transparent text-hero-ink outline-none [&>option]:text-[oklch(0.2_0_0)]"
                  >
                    {bikes.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.make} {b.model} · {b.voltage}V
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="flex flex-1 items-center gap-2 rounded-2xl bg-[oklch(1_0_0/0.08)] px-4">
                  <Search className="h-5 w-5 text-primary" />
                  <input
                    value={vin}
                    onChange={(e) => setVin(e.target.value)}
                    maxLength={17}
                    placeholder="e.g. P6R1S1PR2PN000001"
                    className="h-12 w-full bg-transparent font-mono uppercase tracking-wider text-hero-ink outline-none placeholder:text-[oklch(1_0_0/0.4)]"
                  />
                </div>
              )}
              <button
                onClick={go}
                className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-6 font-semibold text-primary-foreground transition hover:opacity-90"
              >
                Find parts <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/assistant"
              className="flex items-center gap-2 rounded-full border border-[oklch(1_0_0/0.2)] px-5 py-3 text-sm font-semibold backdrop-blur transition hover:border-primary hover:text-primary"
            >
              <Mic className="h-4 w-4" /> Talk to AI assistant
            </Link>
            <Link
              to="/shop"
              className="flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-[oklch(1_0_0/0.8)] hover:text-primary"
            >
              Browse all parts <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Floating cards */}
        <div className="relative hidden h-[520px] lg:block">
          <div className="animate-float absolute right-0 top-4 w-72 rounded-3xl border border-[oklch(1_0_0/0.12)] bg-[oklch(0.15_0.01_260/0.7)] p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between text-xs text-[oklch(1_0_0/0.6)]">
              <span>Order #RZ48213</span>
              <span className="text-primary">● Live</span>
            </div>
            <p className="mt-2 font-display text-3xl">Arriving in 18 min</p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-[oklch(1_0_0/0.1)]">
              <div className="h-full w-2/3 rounded-full bg-primary" />
            </div>
            <div className="mt-4 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-primary font-bold text-primary-foreground">
                RK
              </span>
              <div className="text-sm">
                <p className="font-semibold">Ravi Kumar</p>
                <p className="text-[oklch(1_0_0/0.6)]">2 pickups · Ather Rizta</p>
              </div>
            </div>
          </div>
          <div
            className="animate-float absolute left-4 top-56 w-60 rounded-3xl border border-[oklch(1_0_0/0.12)] bg-[oklch(0.15_0.01_260/0.7)] p-5 backdrop-blur-xl"
            style={{ animationDelay: "1.5s" }}
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <ShieldCheck className="h-4 w-4" /> Fitment verified
            </div>
            <p className="mt-2 text-sm text-[oklch(1_0_0/0.75)]">
              VoltRide 60V 30Ah fits your <b className="text-hero-ink">Ola S1 Pro 2023</b>
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
                className="rounded-2xl border border-[oklch(1_0_0/0.12)] bg-[oklch(0.15_0.01_260/0.6)] px-4 py-3 backdrop-blur-xl"
              >
                <p className="font-display text-3xl text-primary">{v}</p>
                <p className="text-xs text-[oklch(1_0_0/0.65)]">{l}</p>
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
    <div className="border-y border-border bg-card/40">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-12 gap-y-4 px-4 py-6 font-display text-2xl text-muted-foreground md:justify-between">
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
            className={`group relative overflow-hidden rounded-3xl border border-border bg-card ${i === 0 ? "lg:row-span-2" : ""}`}
          >
            <img
              src={c.img}
              alt={c.name}
              loading="lazy"
              width={1024}
              height={1024}
              className={`w-full object-cover transition duration-700 group-hover:scale-105 ${i === 0 ? "aspect-square lg:aspect-auto lg:h-full" : "aspect-[4/3]"}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.1_0_0/0.85)] via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 text-hero-ink">
              <div>
                <c.Icon className="mb-2 h-6 w-6 text-primary" />
                <p className="font-display text-2xl leading-none md:text-3xl">{c.name}</p>
                <p className="text-xs opacity-70">{c.count}+ products</p>
              </div>
              <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground transition group-hover:rotate-[-45deg]">
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
    {
      Icon: Search,
      t: "Find",
      d: "Enter your VIN or pick your bike. We show only parts verified to fit.",
    },
    {
      Icon: Disc,
      t: "Compare",
      d: "See prices, stock and delivery time from every nearby seller side by side.",
    },
    {
      Icon: PackageCheck,
      t: "One order",
      d: "Mix items from many vendors. Delivery is priced per km — no surprises.",
    },
    {
      Icon: MapPin,
      t: "Track live",
      d: "Watch your rider on the map, then call or chat once they accept.",
    },
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
            className="relative rounded-3xl border border-border bg-card p-6 shadow-card"
          >
            <span className="font-display text-6xl text-primary/20">0{i + 1}</span>
            <s.Icon className="mt-2 h-7 w-7 text-primary" />
            <p className="mt-4 font-display text-3xl">{s.t}</p>
            <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
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
          className="mb-8 hidden items-center gap-1 text-sm font-semibold text-primary md:flex"
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
    {
      t: "Riders & owners",
      d: "Garage, VIN fitment, live tracking.",
      img: scooterImg,
      to: "/dashboard/customer",
      Icon: BikeIcon,
    },
    {
      t: "Workshops & mechanics",
      d: "Bulk orders and job cards per vehicle.",
      img: workshopImg,
      to: "/dashboard/workshop",
      Icon: Wrench,
    },
    {
      t: "Vendors & dealers",
      d: "Inventory, fitment tags and payouts.",
      img: battery3,
      to: "/dashboard/vendor",
      Icon: Store,
    },
    {
      t: "Delivery riders",
      d: "Accept jobs, multi-pickup routes, earnings.",
      img: riderImg,
      to: "/dashboard/rider",
      Icon: Truck,
    },
  ] as const;
  return (
    <section className="mx-auto max-w-7xl px-4 pt-28 md:px-6">
      <SectionTitle eyebrow="One platform, every role" title="Pick your dashboard" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {roles.map((r) => (
          <Link
            key={r.t}
            to={r.to}
            className="group overflow-hidden rounded-3xl border border-border bg-card shadow-card transition hover:border-primary/60"
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
              <p className="mt-3 text-lg font-bold">{r.t}</p>
              <p className="text-sm text-muted-foreground">{r.d}</p>
              <p className="mt-4 flex items-center gap-1 text-sm font-semibold text-primary">
                Open dashboard{" "}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
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
    {
      n: "Priya S.",
      r: "Ather 450X owner",
      q: "Entered my VIN and got three verified batteries in seconds. Rider showed up in 32 minutes.",
    },
    {
      n: "Manjunath Auto Works",
      r: "Workshop, Jayanagar",
      q: "We order from four vendors in one go now. Delivery charges are finally transparent.",
    },
    {
      n: "VoltHub",
      r: "Dealer, Indiranagar",
      q: "Orders come pre-matched to the customer's bike — almost zero returns this month.",
    },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 pt-28 md:px-6">
      <SectionTitle eyebrow="Loved on the road" title="Riders trust Riderzpro" />
      <div className="grid gap-4 md:grid-cols-3">
        {t.map((x) => (
          <figure key={x.n} className="rounded-3xl border border-border bg-card p-6 shadow-card">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-warning text-warning" />
              ))}
            </div>
            <blockquote className="mt-4 text-lg leading-relaxed">“{x.q}”</blockquote>
            <figcaption className="mt-6 text-sm">
              <b>{x.n}</b> <span className="text-muted-foreground">· {x.r}</span>
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
      <div className="relative overflow-hidden rounded-[2rem] bg-primary p-10 text-primary-foreground md:p-16">
        <Zap className="absolute -right-10 -top-10 h-72 w-72 opacity-10" fill="currentColor" />
        <p className="font-display text-5xl leading-none md:text-7xl">
          Install Riderzpro
          <br />
          on your phone.
        </p>
        <p className="mt-4 max-w-lg opacity-80">
          Open this site on your phone and tap “Add to Home Screen” — it works like a native app
          with live tracking and voice search.
        </p>
        <Link
          to="/shop"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary-foreground px-6 py-3 font-semibold text-primary"
        >
          Start shopping <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
