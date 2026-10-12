import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Headphones,
  Heart,
  ShoppingCart,
  Check,
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
          "Shop electric bikes, car and bike accessories, batteries, chargers, and automotive spare parts in one place with secure ordering and delivery tracking.",
      },
      { property: "og:title", content: "RiderzPro — Automotive Essentials" },
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

      {/* 2. Customer Trust Row */}
      <TrustRow />

      {/* 3. Featured Products Section */}
      <FeaturedProducts />

      {/* 4. Order Tracking Entry Point */}
      <OrderTrackingSection />
    </SiteLayout>
  );
}

{/* ─────────────────────────────────────────────────────────────
    1. HERO SECTION (Minimal, Structured, Black & White with Red Action)
   ───────────────────────────────────────────────────────────── */}
function Hero() {
  return (
    <section className="border-b border-[#E5E7EB] bg-white py-12 md:py-18">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Hero Text Content */}
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-[#E31E24]">
              AUTOMOTIVE ESSENTIALS
            </p>
            <h1 className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#111111] tracking-tight leading-[1.08] font-display">
              Everything your ride needs.
            </h1>
            <p className="mt-4 text-base sm:text-lg text-[#6B7280] leading-relaxed max-w-xl">
              Shop electric bikes, car and bike accessories, batteries, chargers, and spare parts in one place.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center rounded-lg bg-[#E31E24] px-6 py-3 text-sm font-semibold text-white shadow-xs transition hover:bg-red-700 active:scale-95"
              >
                Shop Products
              </Link>
              <Link
                to="/shop"
                search={{ cat: "Bike Accessories" } as any}
                className="inline-flex items-center justify-center rounded-lg border border-[#E5E7EB] bg-white px-6 py-3 text-sm font-semibold text-[#111111] shadow-2xs transition hover:bg-[#F7F7F8] active:scale-95"
              >
                Explore Accessories
              </Link>
            </div>
          </div>

          {/* Small Contained Visual on Plain White Surface */}
          <div className="hidden lg:flex justify-end">
            <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-3 shadow-xs">
              <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-[#F7F7F8]">
                <img
                  src={scooterImg}
                  alt="RiderzPro Electric Vehicle & Parts"
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
    2. CUSTOMER TRUST ROW (Monochrome, Concise, Verified)
   ───────────────────────────────────────────────────────────── */}
function TrustRow() {
  const benefits = [
    {
      title: "Secure Checkout",
      desc: "Encrypted payment gateways and verified transactions.",
      Icon: ShieldCheck,
    },
    {
      title: "Order Tracking",
      desc: "Status updates and courier tracking for every dispatch.",
      Icon: Truck,
    },
    {
      title: "Customer Support",
      desc: "Direct support for product questions and orders.",
      Icon: Headphones,
    },
  ];

  return (
    <section className="border-b border-[#E5E7EB] bg-[#F7F7F8] py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-3">
          {benefits.map((b) => (
            <div key={b.title} className="flex items-start gap-3.5">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-[#E5E7EB] bg-white text-[#111111] shadow-2xs">
                <b.Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#111111]">{b.title}</p>
                <p className="text-xs text-[#6B7280] mt-0.5 leading-snug">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

{/* ─────────────────────────────────────────────────────────────
    3. FEATURED PRODUCTS SECTION (Clean Grid, Actual Catalog Data)
   ───────────────────────────────────────────────────────────── */}
function FeaturedProducts() {
  // Curated diverse selection of actual products across core categories:
  // Electric Bikes, Car Accessories, Batteries, Helmets, Bike Accessories, Chargers, Spares
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
            <span>View all products</span>
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

  // Calculate actual discount relative to estimated base retail
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

        {/* Stock Availability */}
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
    4. ORDER TRACKING ENTRY POINT (Compact, Visually Secondary)
   ───────────────────────────────────────────────────────────── */}
function OrderTrackingSection() {
  return (
    <section className="bg-[#F7F7F8] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:p-8 shadow-2xs">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-[#111111]">
              Already ordered? Track your order.
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-[#6B7280]">
              Check your order status and delivery progress.
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
