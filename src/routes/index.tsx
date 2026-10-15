import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { isNativePlatform } from "@/lib/native/app";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Hero } from "@/components/site/landing/Hero";
import { CategoryGrid } from "@/components/site/landing/CategoryGrid";
import { HowItWorks } from "@/components/site/landing/HowItWorks";
import { FeaturedProducts } from "@/components/site/landing/FeaturedProducts";
import { WhyRiderzpro } from "@/components/site/landing/WhyRiderzpro";
import { OffersBanner } from "@/components/site/landing/OffersBanner";
import { FinalCTA } from "@/components/site/landing/FinalCTA";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Riderzpro — EV batteries & parts that fit your bike" },
      {
        name: "description",
        content:
          "Batteries, chargers and spares matched to your vehicle, delivered by riders you can track.",
      },
      { property: "og:title", content: "Riderzpro — EV batteries & parts that fit your bike" },
      {
        property: "og:description",
        content:
          "Batteries, chargers and spares matched to your vehicle, delivered by riders you can track.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (isNativePlatform()) {
      navigate({ to: "/app", replace: true });
    }
  }, [navigate]);

  if (typeof window !== "undefined" && isNativePlatform()) {
    return null;
  }

  return (
    <SiteLayout>
      {/* A. Hero: 2 clean columns, H1 with single red word, Bike Finder, Trust row, Single image */}
      <Hero />

      {/* B. Shop by Category: 6 equal cards, systematic 3x2 grid */}
      <CategoryGrid />

      {/* C. How It Works: 3 steps, horizontal, numbered */}
      <HowItWorks />

      {/* D. Featured Products: Popular for your ride, tab filter, 4 cards per row */}
      <FeaturedProducts />

      {/* E. Why Riderzpro: 4 benefit cards + slim stats strip */}
      <WhyRiderzpro />

      {/* F. Current Offers: Slim banner row with 3 promo cards */}
      <OffersBanner />

      {/* G. Final CTA: Single red band with Pick my bike button */}
      <FinalCTA />
    </SiteLayout>
  );
}
