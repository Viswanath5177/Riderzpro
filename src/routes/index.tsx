import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Headphones,
  FileCheck,
  Heart,
  ShoppingCart,
  ShoppingBag,
  PackageCheck,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import scooterImg from "@/assets/scooter.jpg";
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
          "Discover electric bikes, car and bike accessories, batteries, chargers, and spare parts in one convenient place.",
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
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Featured Products Section */}
      <FeaturedProducts />

      {/* 3. Application Features Section */}
      <AppFeatures />

      {/* 4. Product Discovery Section */}
      <ProductDiscovery />

      {/* 5. Order Tracking Section */}
      <OrderTrackingSection />

      {/* 6. Trust and Service Section */}
      <TrustServiceSection />
    </SiteLayout>
  );
}

{/* ─────────────────────────────────────────────────────────────
    1. HERO SECTION (Minimal, White Background, Precise Alignment)
   ───────────────────────────────────────────────────────────── */}
function Hero() {
  return (
    <section className="border-b border-[#E5E7EB] bg-white py-12 md:py-18">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Hero Text Content */}
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-[#E31E24]">
              YOUR AUTOMOTIVE MARKETPLACE
            </p>
            <h1 className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#111111] tracking-tight leading-[1.08] font-display">
              Everything your ride needs.
            </h1>
            <p className="mt-4 text-base sm:text-lg text-[#6B7280] leading-relaxed max-w-xl">
              Discover electric bikes, car and bike accessories, batteries, chargers, and spare parts in one convenient place.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center rounded-lg bg-[#E31E24] px-6 py-3 text-sm font-semibold text-white shadow-xs transition hover:bg-red-700 active:scale-95"
              >
                Explore Products
              </Link>
              <Link
                to="/dashboard/customer"
                search={{ tab: "orders" } as any}
                className="inline-flex items-center justify-center rounded-lg border border-[#E5E7EB] bg-white px-6 py-3 text-sm font-semibold text-[#111111] shadow-2xs transition hover:bg-[#F7F7F8] active:scale-95"
              >
                Track My Order
              </Link>
            </div>
          </div>

          {/* Small Contained Visual on Plain White Surface */}
          <div className="hidden lg:flex justify-end">
            <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-3 shadow-xs">
              <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-[#F7F7F8]">
                <img
                  src={scooterImg}
                  alt="RiderzPro Automotive Marketplace"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="mt-3 px-1 flex items-center justify-between text-xs">
                <span className="font-semibold text-[#111111]">Verified Automotive Spares & EVs</span>
                <span className="text-[#6B7280]">Direct from authorized suppliers</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

{/* ─────────────────────────────────────────────────────────────
    2. FEATURED PRODUCTS (Clean 4-Col Grid, Actual Catalog Data)
   ───────────────────────────────────────────────────────────── */}
function FeaturedProducts() {
  // Diverse selection representing core categories
  const featuredIds = ["p13", "p16", "p1", "p24", "p21", "p7", "p22", "p17"];
  const featuredList = featuredIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));

  return (
    <section className="bg-white py-14 sm:py-18 border-b border-[#E5E7EB]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between pb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111] font-display">
              Featured Products
            </h2>
            <p className="mt-1 text-sm text-[#6B7280]">
              Explore products for your next ride.
            </p>
          </div>
          <Link
            to="/shop"
            className="mt-3 sm:mt-0 inline-flex items-center gap-1.5 text-xs font-semibold text-[#E31E24] hover:underline"
          >
            <span>View All Products</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* 4-Column Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredList.map((p) => (
            <LandingProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

function LandingProductCard({ product }: { product: Product }) {
  const { addToCart, toggleSaved, isSaved } = useStore();
  const offer = bestOffer(product);
  const saved = isSaved(product.id);

  // Genuine discount calculated against standard base retail
  const mrp = Math.round((offer.price * 1.15) / 100) * 100;
  const discountPct = Math.round(((mrp - offer.price) / mrp) * 100);

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-2xs transition-all duration-200 hover:border-gray-300 hover:shadow-xs">
      {/* Product Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F7F7F8]">
        <Link to="/product/$id" params={{ id: product.id }} className="block h-full w-full">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-102"
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
          className="absolute right-2.5 top-2.5 grid h-7 w-7 place-items-center rounded-full bg-white text-gray-400 shadow-2xs transition hover:text-[#E31E24]"
        >
          <Heart className={`h-3.5 w-3.5 ${saved ? "fill-[#E31E24] text-[#E31E24]" : ""}`} />
        </button>
      </div>

      {/* Content Area */}
      <div className="flex flex-1 flex-col p-4">
        {/* Category & Brand */}
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">
          {product.category} · {product.brand}
        </p>

        {/* Product Name Link */}
        <Link
          to="/product/$id"
          params={{ id: product.id }}
          className="mt-1 line-clamp-2 text-sm font-semibold text-[#111111] hover:text-[#E31E24] transition leading-snug"
        >
          {product.name}
        </Link>

        <div className="mt-2 flex items-center gap-1.5 text-[11px]">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span className="font-medium text-emerald-700">{offer.stock > 0 ? "In Stock" : "Available to Order"}</span>
          <span className="text-gray-300">·</span>
          <span className="text-[#6B7280]">{product.warrantyMonths}m Warranty</span>
        </div>

        {/* Price & Add to Cart Action */}
        <div className="mt-auto pt-4 border-t border-[#E5E7EB]">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-base font-bold text-[#111111]">
              {inr(offer.price)}
            </span>
            {mrp > offer.price && <span className="text-xs text-[#6B7280] line-through">{inr(mrp)}</span>}
          </div>

          <button
            onClick={() => {
              addToCart(product.id, offer.vendorId);
              toast.success(`Added ${product.name} to cart`);
            }}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#E31E24] py-2 text-xs font-semibold text-white transition hover:bg-red-700 active:scale-95"
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
    3. APPLICATION FEATURES SECTION (4 Informative Clean Feature Cards)
   ───────────────────────────────────────────────────────────── */}
function AppFeatures() {
  const features = [
    {
      title: "Easy Online Shopping",
      desc: "Browse automotive products, compare available options, and place orders through a simple online checkout.",
      Icon: ShoppingBag,
    },
    {
      title: "Product Availability",
      desc: "Check available stock and product details before placing an order.",
      Icon: PackageCheck,
    },
    {
      title: "Order and Delivery Tracking",
      desc: "View order progress, shipment status, tracking events, and estimated delivery information when available.",
      Icon: Truck,
    },
    {
      title: "Account and Order Management",
      desc: "Access your order history, saved products, account details, and delivery information in one place.",
      Icon: UserRound,
    },
  ];

  return (
    <section className="bg-[#F7F7F8] py-14 sm:py-18 border-b border-[#E5E7EB]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111] font-display">
            Everything you need, in one place.
          </h2>
          <p className="mt-2 text-sm text-[#6B7280] leading-relaxed">
            Shop with confidence and manage your purchases from one convenient platform.
          </p>
        </div>

        {/* 4 Feature Cards Grid */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feat) => (
            <div
              key={feat.title}
              className="flex flex-col rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-2xs"
            >
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-red-50 text-[#E31E24]">
                <feat.Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-bold text-[#111111]">
                {feat.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#6B7280]">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

{/* ─────────────────────────────────────────────────────────────
    4. PRODUCT DISCOVERY SECTION (Compact Text Navigation Links)
   ───────────────────────────────────────────────────────────── */}
function ProductDiscovery() {
  const categories = [
    { label: "Electric Bikes", to: "/shop", search: "Electric Bikes" },
    { label: "Car Accessories", to: "/shop", search: "Car Accessories" },
    { label: "Bike Accessories", to: "/shop", search: "Bike Accessories" },
    { label: "Riding Gear", to: "/shop", search: "Riding Gear & Helmets" },
    { label: "Spare Parts", to: "/shop", search: "Spare Parts" },
    { label: "Batteries & Chargers", to: "/shop", search: "Battery" },
  ];

  return (
    <section className="bg-white py-12 border-b border-[#E5E7EB]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#111111] font-display">
              Explore automotive essentials.
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[#6B7280]">
              Quickly navigate our verified catalog by department.
            </p>
          </div>

          {/* Compact restrained text links */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((c) => (
              <Link
                key={c.label}
                to={c.to}
                search={{ cat: c.search } as any}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-[#F7F7F8] px-3.5 py-2 text-xs font-semibold text-[#111111] transition hover:border-[#E31E24] hover:text-[#E31E24] hover:bg-white"
              >
                <span>{c.label}</span>
                <ArrowRight className="h-3 w-3 text-[#6B7280]" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

{/* ─────────────────────────────────────────────────────────────
    5. ORDER TRACKING SECTION (Compact Call to Action)
   ───────────────────────────────────────────────────────────── */}
function OrderTrackingSection() {
  return (
    <section className="bg-[#F7F7F8] py-12 border-b border-[#E5E7EB]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-[#E5E7EB] bg-white p-6 sm:p-8 shadow-2xs">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-[#111111]">
              Your order, within reach.
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-[#6B7280]">
              Check your order status and follow shipment progress from your account.
            </p>
          </div>
          <div className="shrink-0">
            <Link
              to="/dashboard/customer"
              search={{ tab: "orders" } as any}
              className="inline-flex items-center gap-2 rounded-lg bg-[#111111] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#E31E24] active:scale-95"
            >
              <span>View My Orders</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

{/* ─────────────────────────────────────────────────────────────
    6. TRUST AND SERVICE SECTION (Compact Monochrome Row)
   ───────────────────────────────────────────────────────────── */}
function TrustServiceSection() {
  const items = [
    { title: "Secure Checkout", desc: "Verified payment gateways & protection", Icon: ShieldCheck },
    { title: "Order Tracking", desc: "Courier telemetry & milestone updates", Icon: Truck },
    { title: "Customer Support", desc: "Direct automotive helpdesk support", Icon: Headphones },
    { title: "Clear Product Information", desc: "Detailed specifications & fitment notes", Icon: FileCheck },
  ];

  return (
    <section className="bg-white py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => (
            <div key={it.title} className="flex items-center gap-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-[#E5E7EB] bg-[#F7F7F8] text-[#111111]">
                <it.Icon className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#111111]">{it.title}</p>
                <p className="text-[11px] text-[#6B7280]">{it.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
