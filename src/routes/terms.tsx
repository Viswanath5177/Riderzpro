import { createFileRoute } from "@tanstack/react-router";
import { FileText, RefreshCw, Truck, AlertCircle } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service & Refunds — Riderzpro" },
      {
        name: "description",
        content:
          "Terms of use, order policy, warranty on EV batteries and spare parts, returns and refunds.",
      },
      { property: "og:title", content: "Terms of Service & Refunds — Riderzpro" },
      { property: "og:description", content: "Riderzpro customer terms and refund policies." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-4xl px-4 py-12 md:px-6">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent text-accent-foreground">
            <FileText className="h-6 w-6" />
          </span>
          <div>
            <h1 className="font-display text-4xl md:text-6xl">Terms of Service & Refunds</h1>
            <p className="text-sm text-muted-foreground">Effective Date: October 12, 2026</p>
          </div>
        </div>

        <div className="mt-8 space-y-8 text-foreground/90 leading-relaxed text-sm md:text-base">
          <section className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-3">
            <h2 className="font-display text-2xl text-foreground">1. Marketplace Agreement</h2>
            <p>
              By accessing the Riderzpro mobile app or website, you agree to these terms. Riderzpro
              is a platform specializing in electric two-wheeler components, certified lithium-ion
              battery packs, motor controllers, and related motorcycle parts.
            </p>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-4">
            <h2 className="font-display text-2xl text-foreground flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-primary" /> 2. Return & Refund Policy
            </h2>
            <ul className="space-y-3 text-muted-foreground">
              <li>
                <strong className="text-foreground">7-Day Replacement Guarantee:</strong> If a
                delivered component has manufacturing defects or does not match fitment
                specifications, replacement can be initiated within 7 calendar days of delivery.
              </li>
              <li>
                <strong className="text-foreground">Refund Processing:</strong> Approved refunds are
                credited via original payment source (UPI/Card/NetBanking) within 5–7 business days.
              </li>
              <li>
                <strong className="text-foreground">Ineligible Items:</strong> Batteries showing
                physical impact, unauthorized terminal modifications, or tampered warranty seals are
                not eligible for return.
              </li>
            </ul>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-4">
            <h2 className="font-display text-2xl text-foreground flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" /> 3. Hazardous Material Shipping & Delivery
            </h2>
            <p>
              Lithium-ion EV batteries are shipped adhering to standard hazardous freight packaging
              and transport protocols. Deliveries are handled through licensed surface courier
              partners. Transit times may vary depending on state checkpoints and hazardous freight
              transit regulations.
            </p>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-3">
            <h2 className="font-display text-2xl text-foreground flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" /> 4. Fitment & Technical Safety
            </h2>
            <p>
              While Riderzpro VIN matching aids in recommending compatible parts, customers must
              ensure installation is performed by qualified technicians or certified EV workshops.
              Riderzpro is not liable for improper assembly or unauthorized electrical alterations.
            </p>
          </section>
        </div>
      </div>
    </SiteLayout>
  );
}
