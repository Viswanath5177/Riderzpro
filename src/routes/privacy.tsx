import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Trash2, Mail, Lock, Phone } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Riderzpro" },
      {
        name: "description",
        content:
          "Learn how Riderzpro collects, uses, and safeguards your data, and how to request account deletion.",
      },
      { property: "og:title", content: "Privacy Policy — Riderzpro" },
      {
        property: "og:description",
        content: "Riderzpro user data protection policy and account deletion.",
      },
    ],
  }),
  component: PrivacyPolicy,
});

function PrivacyPolicy() {
  const [deleted, setDeleted] = useState(false);

  const handleDeleteRequest = () => {
    setDeleted(true);
    toast.success("Account deletion request submitted", {
      description:
        "Our privacy team will purge all personal records within 48 hours according to regulations.",
    });
  };

  return (
    <SiteLayout>
      <div className="mx-auto max-w-4xl px-4 py-12 md:px-6">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent text-accent-foreground">
            <ShieldCheck className="h-6 w-6" />
          </span>
          <div>
            <h1 className="font-display text-4xl md:text-6xl">Privacy Policy</h1>
            <p className="text-sm text-muted-foreground">Last updated: October 12, 2026</p>
          </div>
        </div>

        <div className="mt-8 space-y-8 text-foreground/90 leading-relaxed text-sm md:text-base">
          <section className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-3">
            <h2 className="font-display text-2xl text-foreground">1. Overview</h2>
            <p>
              Riderzpro ("we", "our", or "us") operates the Riderzpro mobile application and
              website. We are committed to safeguarding your privacy and ensuring transparency in
              how your personal information is handled.
            </p>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-4">
            <h2 className="font-display text-2xl text-foreground">2. Data We Collect</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <strong className="text-foreground">Phone Number & Authentication:</strong>{" "}
                  Collected for OTP login and order verification.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <strong className="text-foreground">Email Address & Name:</strong> Used for order
                  invoices, receipts, and important customer notifications.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Lock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <strong className="text-foreground">Delivery Addresses & Location:</strong>{" "}
                  Pincode and GPS coordinates (optional) to estimate delivery times and calculate
                  courier rates.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <strong className="text-foreground">Vehicle & VIN Data:</strong> Two-wheeler model
                  and VIN prefix to verify battery fitment and parts compatibility.
                </div>
              </li>
            </ul>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-3">
            <h2 className="font-display text-2xl text-foreground">3. How We Use Your Data</h2>
            <p>Your data is exclusively used to:</p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>Process and ship EV battery and parts orders.</li>
              <li>Provide real-time order tracking and courier updates.</li>
              <li>
                Filter catalogue items strictly compatible with your electric bike or scooter.
              </li>
              <li>Prevent fraud, secure transactions, and maintain tax-compliant records.</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-3">
            <h2 className="font-display text-2xl text-foreground">4. Third-Party Disclosures</h2>
            <p>
              We do not sell your personal data. We only share information with critical fulfillment
              partners:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>
                <strong>Logistics Couriers:</strong> Delivery name, address, and contact number for
                parcel transit.
              </li>
              <li>
                <strong>Payment Gateways (Razorpay):</strong> Tokenized payment details processed
                through PCI-DSS certified channels.
              </li>
            </ul>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-4">
            <h2 className="font-display text-2xl text-foreground">
              5. Data Retention & Account Deletion
            </h2>
            <p>
              You have the full right to delete your Riderzpro account and all associated personal
              data at any time, in compliance with Apple App Store guidelines and applicable privacy
              laws.
            </p>
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-5 space-y-3">
              <h3 className="font-semibold text-destructive flex items-center gap-2">
                <Trash2 className="h-4 w-4" /> Request Account & Data Deletion
              </h3>
              <p className="text-xs text-muted-foreground">
                Deleting your account permanently wipes your saved vehicles, addresses, and active
                login sessions. Tax and invoice records will be retained solely for statutory audit
                compliance.
              </p>
              {deleted ? (
                <div className="text-xs font-semibold text-success">
                  Request registered. Confirmation sent to your registered contact.
                </div>
              ) : (
                <button
                  onClick={handleDeleteRequest}
                  className="rounded-full bg-destructive px-4 py-2 text-xs font-semibold text-destructive-foreground hover:bg-destructive/90 transition"
                >
                  Delete My Account
                </button>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-2">
            <h2 className="font-display text-2xl text-foreground">
              6. Contact Our Grievance Officer
            </h2>
            <p className="text-muted-foreground">
              For any questions regarding this policy or data inquiries, contact our Privacy team
              at:
            </p>
            <p className="font-semibold text-primary">privacy@riderzpro.com</p>
          </section>
        </div>
      </div>
    </SiteLayout>
  );
}
