import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Headphones,
  FileCheck,
  Heart,
  ShoppingCart,
  Car,
  Bike,
  Zap,
  BatteryCharging,
  Wrench,
  ScanLine,
  SlidersHorizontal,
  Lock,
  Search,
  CheckCircle2,
  Package,
  Sparkles,
  ChevronRight,
  Star,
  MapPin,
  Clock,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import scooterImg from "@/assets/scooter.jpg";
import heroBikeImg from "@/assets/hero-bike.jpg";
import partsImg from "@/assets/parts.jpg";
import workshopImg from "@/assets/workshop.jpg";
import { SiteLayout } from "@/components/site/SiteLayout";
import { bestOffer, inr, products, type Product } from "@/lib/data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RiderzPro — Quality Automotive Essentials, Parts & Electric Bikes" },
      {
        name: "description",
        content:
          "Discover electric bikes, car accessories, bike accessories, batteries, chargers, and verified spare parts with guaranteed vehicle compatibility.",
      },
      { property: "og:title", content: "RiderzPro — Your Automotive Marketplace" },
      {
        property: "og:description",
        content: "Everything your ride needs: electric bikes, accessories, batteries, and spare parts.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <SiteLayout>
      {/* 1. Hero Section with Interactive Search */}
      <HeroSection />

      {/* 2. Quick Category Navigation Grid (Car, Bike Accessories, EVs, Spares) */}
      <DepartmentGridSection />

      {/* 3. Application Features & Platform Capabilities */}
      <ApplicationFeaturesSection />

      {/* 4. Curated Featured Products Catalog */}
      <FeaturedProductsSection />

      {/* 5. Doorstep Technician & Diagnostics Feature Banner */}
      <DoorstepServiceBanner />

      {/* 6. Account & Garage Status CTA (Login Guarded) */}
      <GarageAccessSection />

      {/* 7. Trust, Guarantees & Support */}
      <TrustAndSupportSection />
    </SiteLayout>
  );
}

{/* ─────────────────────────────────────────────────────────────
    1. HERO SECTION (Clean White Surface, High Contrast, Search)
   ───────────────────────────────────────────────────────────── */}
function HeroSection() {
  const navigate = useNavigate();
  const { isLoggedIn } = useStore();
  const [heroSearch, setHeroSearch] = useState("");

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate({ to: "/shop", search: { q: heroSearch.trim() } as any });
    } else {
      navigate({ to: "/shop" });
    }
  };

  const handleVehicleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.info("Please sign in to access your registered vehicle & garage");
      navigate({ to: "/login", search: { redirect: "/dashboard/customer?tab=garage" } as any });
    } else {
      navigate({ to: "/dashboard/customer", search: { tab: "garage" } as any });
    }
  };

  return (
    <section className="border-b border-[#E5E7EB] bg-white py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Left Column: Hero Text, Search & CTAs */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-bold text-[#E31E24]">
              <Zap className="h-3.5 w-3.5 fill-[#E31E24]" />
              <span>OFFICIAL AUTOMOTIVE STORE & SPARES</span>
            </div>

            <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#111111] tracking-tight leading-[1.12] font-display">
              Quality Automotive Essentials, Parts & Electric Bikes.
            </h1>

            <p className="mt-4 text-base sm:text-lg text-[#6B7280] leading-relaxed max-w-xl">
              Discover electric bikes, car accessories, bike accessories, batteries, chargers, and verified spare parts in one clean, professional marketplace.
            </p>

            {/* Embedded Live Search Box */}
            <form onSubmit={handleHeroSearch} className="mt-6 max-w-xl">
              <div className="relative flex items-center rounded-xl border-2 border-[#E5E7EB] bg-white p-1.5 shadow-2xs transition-all focus-within:border-[#E31E24] focus-within:ring-2 focus-within:ring-[#E31E24]/20">
                <Search className="ml-3 h-5 w-5 text-[#6B7280] shrink-0" />
                <input
                  type="text"
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  placeholder="Search car accessories, helmets, batteries, Brembo brakes..."
                  className="w-full bg-transparent px-3 py-2 text-sm text-[#111111] placeholder:text-[#6B7280] focus:outline-none"
                />
                <button
                  type="submit"
                  className="shrink-0 rounded-lg bg-[#E31E24] px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs transition hover:bg-red-700 active:scale-95"
                >
                  Search
                </button>
              </div>

              {/* Quick trending tags */}
              <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs text-[#6B7280]">
                <span className="font-semibold text-[#111111]">Popular:</span>
                {[
                  { label: "Car Accessories", q: "Car Accessories" },
                  { label: "Bike Accessories", q: "Bike Accessories" },
                  { label: "Electric Bikes", q: "Electric Bikes" },
                  { label: "Fast Chargers", q: "Charger" },
                  { label: "Brembo Rotors", q: "Brembo" },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => navigate({ to: "/shop", search: { q: item.q } as any })}
                    className="rounded-md border border-[#E5E7EB] bg-[#F7F7F8] px-2 py-0.5 text-[11px] font-medium text-[#111111] hover:border-[#E31E24] hover:text-[#E31E24] transition"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </form>

            {/* Hero Quick Navigation Actions */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center rounded-lg bg-[#E31E24] px-6 py-3 text-sm font-semibold text-white shadow-xs transition hover:bg-red-700 active:scale-95"
              >
                <span>Explore Store Catalog</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <button
                onClick={handleVehicleClick}
                className="inline-flex items-center justify-center rounded-lg border border-[#E5E7EB] bg-white px-5 py-3 text-sm font-semibold text-[#111111] shadow-2xs transition hover:bg-[#F7F7F8] hover:border-gray-400 active:scale-95"
              >
                <Car className="mr-2 h-4 w-4 text-[#E31E24]" />
                <span>My Car & Garage</span>
                {!isLoggedIn && <Lock className="ml-1.5 h-3.5 w-3.5 text-gray-400" />}
              </button>
            </div>
          </div>

          {/* Right Column: Visual Showcase Card */}
          <div className="hidden lg:flex justify-end">
            <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-3 shadow-xs">
              <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-[#F7F7F8] relative">
                <img
                  src={scooterImg}
                  alt="RiderzPro Electric Vehicle & Automotive Marketplace"
                  className="h-full w-full object-cover"
                />
                <span className="absolute top-3 left-3 rounded-md bg-[#111111] px-2.5 py-1 text-[11px] font-bold text-white shadow-xs">
                  100% Genuine Spares
                </span>
              </div>
              <div className="mt-3 px-1 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-[#111111]">
                  <span>Verified Automotive Spares & EVs</span>
                  <span className="text-[#E31E24]">Authorized Suppliers</span>
                </div>
                <p className="text-[11px] text-[#6B7280]">
                  Every part is tested for voltage compatibility, fitment precision, and manufacturer warranty.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

{/* ─────────────────────────────────────────────────────────────
    2. DEPARTMENT NAVIGATION GRID (Car Accessories, Bike Accessories, etc.)
   ───────────────────────────────────────────────────────────── */}
function DepartmentGridSection() {
  const { isLoggedIn } = useStore();
  const navigate = useNavigate();

  const handleCarClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.info("Please sign in to access your registered vehicle & garage");
      navigate({ to: "/login", search: { redirect: "/dashboard/customer?tab=garage" } as any });
    } else {
      navigate({ to: "/dashboard/customer", search: { tab: "garage" } as any });
    }
  };

  const departments = [
    {
      title: "Car Accessories",
      desc: "Floor mats, ambient lighting, 4K dashcams, seat covers, mobile mounts & wireless chargers.",
      to: "/shop",
      search: "Car Accessories",
      Icon: Car,
      tag: "Car Essentials",
    },
    {
      title: "Bike Accessories",
      desc: "Riding jackets, ISI/DOT helmets, gloves, crash guards, saddlebags & phone holders.",
      to: "/shop",
      search: "Bike Accessories",
      Icon: Bike,
      tag: "Riding Gear",
    },
    {
      title: "Electric Bikes",
      desc: "High-grade certified electric bikes and scooters from authorized manufacturers.",
      to: "/shop",
      search: "Electric Bikes",
      Icon: Zap,
      tag: "Clean Mobility",
    },
    {
      title: "Batteries & Chargers",
      desc: "48V, 60V & 72V Lithium-ion packs, smart Bluetooth BMS, and certified rapid chargers.",
      to: "/shop",
      search: "Battery",
      Icon: BatteryCharging,
      tag: "High-Voltage Power",
    },
    {
      title: "Automotive Spare Parts",
      desc: "Precision brake rotors, disc pads, hub motors, controllers, suspension & bearings.",
      to: "/shop",
      search: "Spare Parts",
      Icon: Wrench,
      tag: "OEM & Aftermarket",
    },
    {
      title: "My Car / Garage",
      desc: "Digital vehicle log, State-of-Health (SOH) battery telemetry, and service booking.",
      to: "/dashboard/customer",
      isCustomClick: true,
      Icon: Car,
      tag: isLoggedIn ? "Active Garage" : "Login Required",
      requiresAuth: true,
    },
  ];

  return (
    <section className="bg-[#F7F7F8] py-12 md:py-16 border-b border-[#E5E7EB]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between pb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#E31E24]">
              CATALOG DEPARTMENTS
            </p>
            <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-[#111111] font-display">
              Shop by Vehicle Category
            </h2>
          </div>
          <Link
            to="/shop"
            className="mt-2 sm:mt-0 text-xs font-semibold text-[#E31E24] hover:underline flex items-center gap-1"
          >
            <span>View All Products</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {departments.map((dep) => {
            const isCar = dep.isCustomClick;
            return (
              <div
                key={dep.title}
                onClick={(e) => {
                  if (isCar) {
                    handleCarClick(e);
                  } else {
                    navigate({ to: dep.to as any, search: { cat: dep.search } as any });
                  }
                }}
                className="group flex flex-col justify-between rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-2xs hover:border-[#111111] hover:shadow-xs transition-all cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="grid h-10 w-10 place-items-center rounded-lg bg-red-50 text-[#E31E24] group-hover:bg-[#E31E24] group-hover:text-white transition">
                      <dep.Icon className="h-5 w-5" />
                    </span>
                    <span className="rounded-md border border-[#E5E7EB] bg-[#F7F7F8] px-2 py-0.5 text-[10px] font-bold text-[#6B7280] group-hover:text-[#111111]">
                      {dep.tag}
                    </span>
                  </div>

                  <h3 className="mt-4 text-base font-bold text-[#111111] group-hover:text-[#E31E24] transition flex items-center gap-1.5">
                    <span>{dep.title}</span>
                    {dep.requiresAuth && !isLoggedIn && (
                      <Lock className="h-3.5 w-3.5 text-gray-400" />
                    )}
                  </h3>

                  <p className="mt-1.5 text-xs text-[#6B7280] leading-relaxed">
                    {dep.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#E5E7EB] flex items-center justify-between text-xs font-semibold text-[#111111] group-hover:text-[#E31E24]">
                  <span>{isCar && !isLoggedIn ? "Sign In to Access" : "Browse Department"}</span>
                  <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

{/* ─────────────────────────────────────────────────────────────
    3. APPLICATION FEATURES SECTION (Dedicated Explaining Features)
   ───────────────────────────────────────────────────────────── */}
function ApplicationFeaturesSection() {
  const features = [
    {
      title: "Precision Fitment & 17-Digit VIN Lookup",
      desc: "Decode your vehicle identification number (VIN) or pick your exact car or bike model. Components are mathematically filtered to fit your specific chassis and voltage architecture.",
      Icon: ScanLine,
      tag: "Zero Guesswork",
    },
    {
      title: "Multi-Vendor Genuine Marketplace",
      desc: "Source direct from certified automotive distributors and OEM suppliers. Compare live supplier ratings, warranty coverage (up to 48 months), and stock in your city.",
      Icon: Package,
      tag: "Authorized Supply",
    },
    {
      title: "Live GPS Courier & Telemetry Tracking",
      desc: "Synchronized tracking with third-party logistics partners (Bluedart, Delhivery) and local express dispatch. Watch real-time route progress, checkpoint scans, and verified OTP delivery.",
      Icon: Truck,
      tag: "Real-time Telemetry",
    },
    {
      title: "Digital Vehicle Garage & Health Monitoring",
      desc: "Register your vehicles to track battery State-of-Health (SOH), log odometer readings, inspect active spares, and receive automated maintenance schedule reminders.",
      Icon: Car,
      tag: "Ownership Hub",
    },
    {
      title: "Certified Doorstep Technician Service",
      desc: "Book verified EV mechanics for 24-point battery diagnostics, brake calibration, and electrical health checkups right at your doorstep.",
      Icon: Wrench,
      tag: "Home Service",
    },
    {
      title: "GST Tax Invoices & Order Management",
      desc: "Download official GST tax receipts, track multi-supplier dispatches, manage digital warranties, and request straightforward 7-day replacements.",
      Icon: FileCheck,
      tag: "Full Transparency",
    },
  ];

  return (
    <section className="bg-white py-14 md:py-20 border-b border-[#E5E7EB]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-wider text-[#E31E24]">
            BUILT FOR MODERN VEHICLE OWNERS
          </p>
          <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#111111] font-display tracking-tight">
            Application Features & Capabilities
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#6B7280] leading-relaxed">
            RiderzPro connects automotive part discovery, compatibility verification, doorstep technician booking, and live shipment telemetry into one seamless experience.
          </p>
        </div>

        {/* 6 Clean Feature Cards */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feat) => (
            <div
              key={feat.title}
              className="flex flex-col justify-between rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-2xs hover:border-gray-400 transition"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="grid h-11 w-11 place-items-center rounded-lg bg-red-50 text-[#E31E24]">
                    <feat.Icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-md bg-[#F7F7F8] border border-[#E5E7EB] px-2.5 py-0.5 text-[10px] font-bold text-[#6B7280]">
                    {feat.tag}
                  </span>
                </div>
                <h3 className="mt-4 text-base font-bold text-[#111111]">
                  {feat.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#6B7280]">
                  {feat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

{/* ─────────────────────────────────────────────────────────────
    4. CURATED FEATURED PRODUCTS SECTION
   ───────────────────────────────────────────────────────────── */}
function FeaturedProductsSection() {
  const [activeTab, setActiveTab] = useState<string>("All");

  // Selected catalog items representing diverse inventory
  const featuredIds = ["p13", "p16", "p1", "p24", "p21", "p7", "p22", "p17"];
  const allFeatured = featuredIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));

  const filteredList = allFeatured.filter((p) => {
    if (activeTab === "All") return true;
    if (activeTab === "Car Accessories") return p.category === "Car Accessories";
    if (activeTab === "Bike Accessories") return p.category === "Bike Accessories";
    if (activeTab === "Electric Bikes") return p.category === "Electric Bikes";
    if (activeTab === "Spares & Batteries")
      return ["Spare Parts", "Battery", "Charger", "Brakes"].includes(p.category);
    return true;
  });

  return (
    <section className="bg-white py-14 sm:py-18 border-b border-[#E5E7EB]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between pb-6 gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#E31E24]">
              GENUINE CATALOG
            </p>
            <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-[#111111] font-display">
              Featured Products & Accessories
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[#6B7280]">
              Discover tested components with verified vehicle compatibility and warranty.
            </p>
          </div>

          {/* Interactive filter tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {["All", "Car Accessories", "Bike Accessories", "Electric Bikes", "Spares & Batteries"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
                  activeTab === tab
                    ? "bg-[#E31E24] text-white shadow-2xs"
                    : "border border-[#E5E7EB] bg-white text-[#6B7280] hover:text-[#111111] hover:border-gray-400"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* 4-Column Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredList.map((p) => (
            <ProductCardItem key={p.id} product={p} />
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/shop"
            className="inline-flex items-center justify-center rounded-lg border border-[#E5E7EB] bg-[#F7F7F8] px-6 py-2.5 text-xs font-semibold text-[#111111] hover:border-[#E31E24] hover:text-[#E31E24] hover:bg-white transition"
          >
            <span>Explore All 27 Products in Catalog</span>
            <ArrowRight className="ml-2 h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ProductCardItem({ product }: { product: Product }) {
  const { addToCart, toggleSaved, isSaved } = useStore();
  const offer = bestOffer(product);
  const saved = isSaved(product.id);

  const mrp = Math.round((offer.price * 1.15) / 100) * 100;
  const discountPct = Math.round(((mrp - offer.price) / mrp) * 100);

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-2xs transition hover:border-gray-400 hover:shadow-xs">
      {/* Product Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F7F7F8]">
        <Link to="/product/$id" params={{ id: product.id }} className="block h-full w-full">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-102"
          />
        </Link>

        {/* Discount Badge */}
        {discountPct > 0 && (
          <span className="absolute left-2.5 top-2.5 rounded bg-[#E31E24] px-2 py-0.5 text-[10px] font-bold text-white shadow-2xs">
            {discountPct}% OFF
          </span>
        )}

        {/* Save Item Action */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSaved(product.id);
            toast.success(saved ? "Removed from saved items" : "Added to saved items");
          }}
          aria-label={saved ? "Remove from saved items" : "Save item"}
          className="absolute right-2.5 top-2.5 grid h-7 w-7 place-items-center rounded-full bg-white text-gray-400 border border-[#E5E7EB] shadow-2xs transition hover:text-[#E31E24]"
        >
          <Heart className={`h-3.5 w-3.5 ${saved ? "fill-[#E31E24] text-[#E31E24]" : ""}`} />
        </button>
      </div>

      {/* Content Area */}
      <div className="flex flex-1 flex-col p-4">
        {/* Category & Brand */}
        <div className="flex items-center justify-between text-[11px] text-[#6B7280]">
          <span className="font-semibold uppercase tracking-wider truncate">
            {product.category} · {product.brand}
          </span>
          <span className="flex items-center gap-1 font-semibold text-gray-700 shrink-0">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            4.8
          </span>
        </div>

        {/* Product Name Link */}
        <Link
          to="/product/$id"
          params={{ id: product.id }}
          className="mt-1 line-clamp-2 text-sm font-semibold text-[#111111] hover:text-[#E31E24] transition leading-snug"
        >
          {product.name}
        </Link>

        {/* Stock & Warranty */}
        <div className="mt-2 flex items-center gap-1.5 text-[11px]">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span className="font-medium text-emerald-700">
            {offer.stock > 0 ? "In Stock" : "Available to Order"}
          </span>
          <span className="text-gray-300">·</span>
          <span className="text-[#6B7280]">{product.warrantyMonths}m Warranty</span>
        </div>

        {/* Price & Add to Cart Action */}
        <div className="mt-auto pt-4 border-t border-[#E5E7EB]">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-base font-bold text-[#111111]">
              {inr(offer.price)}
            </span>
            {mrp > offer.price && (
              <span className="text-xs text-[#6B7280] line-through">
                {inr(mrp)}
              </span>
            )}
          </div>

          <button
            onClick={() => {
              addToCart(product.id, offer.vendorId);
              toast.success(`Added ${product.name} to cart`);
            }}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#E31E24] py-2 text-xs font-semibold text-white transition hover:bg-red-700 active:scale-95 shadow-2xs"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}

{/* ─────────────────────────────────────────────────────────────
    5. DOORSTEP TECHNICIAN SERVICE BANNER
   ───────────────────────────────────────────────────────────── */}
function DoorstepServiceBanner() {
  const { isLoggedIn } = useStore();
  const navigate = useNavigate();

  const handleBookService = () => {
    if (!isLoggedIn) {
      toast.info("Please sign in to schedule doorstep technician service");
      navigate({ to: "/login", search: { redirect: "/dashboard/customer?tab=service" } as any });
    } else {
      navigate({ to: "/dashboard/customer", search: { tab: "service" } as any });
    }
  };

  return (
    <section className="bg-[#F7F7F8] py-12 border-b border-[#E5E7EB]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:p-8 shadow-2xs grid gap-6 lg:grid-cols-[1.2fr_0.8fr] items-center">
          <div>
            <span className="rounded-full bg-red-50 border border-red-200 px-3 py-1 text-xs font-bold text-[#E31E24]">
              DOORSTEP AUTOMOTIVE SERVICE
            </span>
            <h3 className="mt-3 text-2xl font-extrabold text-[#111111] font-display">
              Book a Certified EV Technician at Your Doorstep
            </h3>
            <p className="mt-2 text-sm text-[#6B7280] leading-relaxed max-w-xl">
              From 24-point battery health diagnostic scans to brake adjustments and emergency electrical troubleshooting, our certified technicians come directly to your home.
            </p>
            <div className="mt-4 flex flex-wrap gap-4 text-xs font-semibold text-[#111111]">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                24-Point BMS Test
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                State-of-Health Diagnostic
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Zero Travel Required
              </span>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={handleBookService}
                className="inline-flex items-center rounded-lg bg-[#E31E24] px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-red-700 transition"
              >
                <span>Schedule Technician</span>
                <ArrowRight className="ml-2 h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="hidden lg:block overflow-hidden rounded-xl border border-[#E5E7EB] bg-gray-50 aspect-[16/10]">
            <img
              src={workshopImg}
              alt="Certified Doorstep EV Technician Diagnostic"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

{/* ─────────────────────────────────────────────────────────────
    6. ACCOUNT & GARAGE ACCESS SECTION (Login Guarded)
   ───────────────────────────────────────────────────────────── */}
function GarageAccessSection() {
  const { isLoggedIn, userProfile } = useStore();
  const navigate = useNavigate();

  return (
    <section className="bg-white py-12 md:py-16 border-b border-[#E5E7EB]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="rounded-2xl border border-[#E5E7EB] bg-[#F7F7F8] p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-red-50 text-[#E31E24]">
                <Car className="h-5 w-5" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                {isLoggedIn ? "CONNECTED VEHICLE PORTAL" : "LOGIN TO ACCESS GARAGE"}
              </span>
            </div>

            <h3 className="mt-3 text-2xl sm:text-3xl font-extrabold text-[#111111] font-display">
              {isLoggedIn
                ? `Welcome back, ${userProfile.name.split(" ")[0]}!`
                : "Own a Car or Electric Two-Wheeler?"}
            </h3>

            <p className="mt-2 text-sm text-[#6B7280] leading-relaxed">
              {isLoggedIn
                ? "Your digital garage has active vehicle records. Check battery state-of-health, view live dispatches, and access order tax receipts."
                : "Sign in to unlock your Digital Garage, access live order dispatches, save compatible spare parts, and manage vehicle health telemetry."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            {isLoggedIn ? (
              <>
                <Link
                  to="/dashboard/customer"
                  search={{ tab: "garage" } as any}
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-[#E31E24] px-6 py-3 text-xs font-semibold text-white shadow-xs hover:bg-red-700 transition"
                >
                  <Car className="mr-2 h-4 w-4" />
                  <span>Open My Garage</span>
                </Link>
                <Link
                  to="/dashboard/customer"
                  search={{ tab: "orders" } as any}
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg border border-[#E5E7EB] bg-white px-5 py-3 text-xs font-semibold text-[#111111] hover:bg-gray-100 transition shadow-2xs"
                >
                  <span>View Orders & Tracking</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-[#E31E24] px-6 py-3 text-xs font-semibold text-white shadow-xs hover:bg-red-700 transition"
                >
                  <span>Sign In to Your Account</span>
                  <ArrowRight className="ml-2 h-3.5 w-3.5" />
                </Link>
                <Link
                  to="/shop"
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg border border-[#E5E7EB] bg-white px-5 py-3 text-xs font-semibold text-[#111111] hover:bg-gray-100 transition shadow-2xs"
                >
                  <span>Browse Store Catalog</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

{/* ─────────────────────────────────────────────────────────────
    7. TRUST AND SERVICE HIGHLIGHTS
   ───────────────────────────────────────────────────────────── */}
function TrustAndSupportSection() {
  const items = [
    {
      title: "100% Genuine Components",
      desc: "Direct supply from verified automotive distributors and OEMs.",
      Icon: ShieldCheck,
    },
    {
      title: "Real-time Courier Telemetry",
      desc: "Live GPS updates & express milestone checkpoints.",
      Icon: Truck,
    },
    {
      title: "7-Day Replacement Guarantee",
      desc: "Hassle-free replacement for fitment discrepancies.",
      Icon: FileCheck,
    },
    {
      title: "Automotive Technical Support",
      desc: "Direct phone and chat assistance for vehicle spares.",
      Icon: Headphones,
    },
  ];

  return (
    <section className="bg-white py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => (
            <div key={it.title} className="flex items-center gap-3.5">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-[#E5E7EB] bg-[#F7F7F8] text-[#111111]">
                <it.Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#111111]">{it.title}</p>
                <p className="text-[11px] text-[#6B7280] leading-snug">{it.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
