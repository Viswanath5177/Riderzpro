import React from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  Building,
  Store,
  MapPin,
  ArrowRight,
  RefreshCw,
  LogOut,
  AlertCircle,
  FileCheck,
  Ban,
  ShieldAlert,
} from "lucide-react";
import { Logo } from "@/components/site/bits";
import { useVendorAuth } from "@/lib/vendorAuth";
import { useVendorStore } from "@/lib/vendor/vendorStore";

export function VendorPendingPage() {
  const { vendor, signOutVendor } = useVendorAuth();
  const { updateOnboardingStep } = useVendorStore();
  const navigate = useNavigate();

  if (!vendor) return null;

  const status = vendor.status;
  const isApproved = status === "approved";
  const isChangesRequested = status === "changes_requested";
  const isRejected = status === "rejected";
  const isSuspended = status === "suspended";
  const isUnderReview = status === "submitted" || status === "under_review";

  const handleFixAndResubmit = () => {
    // Determine the first flagged step or default to Step 2
    let targetStep = 2;
    if (vendor.changesRequestedSections?.includes("tax")) targetStep = 2;
    else if (vendor.changesRequestedSections?.includes("store")) targetStep = 3;
    else if (vendor.changesRequestedSections?.includes("shipping")) targetStep = 4;
    else if (vendor.changesRequestedSections?.includes("bank")) targetStep = 5;
    else if (vendor.changesRequestedSections?.includes("documents")) targetStep = 6;

    updateOnboardingStep(vendor.id, targetStep - 1, { currentStep: targetStep });
    navigate({ to: "/vendor/onboarding" });
  };

  return (
    <div className="min-h-screen bg-[#F5F6F8] flex flex-col font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-border shadow-2xs">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo imgClassName="h-8" />
            <span className="text-xs font-bold text-muted-foreground border-l border-border pl-3 hidden sm:inline">
              Merchant Verification Status
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold">
            <button
              onClick={signOutVendor}
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 mx-auto w-full max-w-3xl p-4 sm:p-6 md:p-8 space-y-6">
        {/* Status Hero Card */}
        <div className="rounded-3xl border border-border bg-white p-6 sm:p-8 shadow-card text-center space-y-4">
          {/* Status Icon */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl">
            {isApproved && (
              <div className="h-16 w-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10" />
              </div>
            )}
            {isUnderReview && (
              <div className="h-16 w-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center animate-pulse">
                <Clock className="h-10 w-10" />
              </div>
            )}
            {isChangesRequested && (
              <div className="h-16 w-16 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
                <AlertCircle className="h-10 w-10" />
              </div>
            )}
            {isRejected && (
              <div className="h-16 w-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
                <XCircle className="h-10 w-10" />
              </div>
            )}
            {isSuspended && (
              <div className="h-16 w-16 rounded-2xl bg-zinc-900 text-white flex items-center justify-center">
                <Ban className="h-10 w-10" />
              </div>
            )}
          </div>

          <div>
            <h1 className="font-display text-3xl font-black text-foreground">
              {isApproved && "Merchant Account Approved!"}
              {isUnderReview && "Application Under Verification"}
              {isChangesRequested && "Action Required: Changes Requested"}
              {isRejected && "Application Not Approved"}
              {isSuspended && "Merchant Account Suspended"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              {isApproved &&
                "Your seller account and KYC documents have been fully approved. You can now access your dashboard and publish products to the marketplace."}
              {isUnderReview &&
                "Our compliance team is verifying your GSTIN, banking credentials, and representative identity. Expected turnaround is usually 24 to 48 hours."}
              {isChangesRequested &&
                "The compliance reviewer requested modifications to your submitted details. Please fix the flagged sections and resubmit."}
              {isRejected &&
                "Your application did not meet RiderzPro merchant compliance standards. See reasons below."}
              {isSuspended &&
                "Your seller account has been paused by platform administration. Reach out to support."}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            {isApproved && (
              <Link
                to="/vendor/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 font-bold text-white shadow-glow hover:brightness-105 transition"
              >
                <span>Go to Vendor Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}

            {isChangesRequested && (
              <button
                type="button"
                onClick={handleFixAndResubmit}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 font-bold text-white shadow-glow hover:brightness-105 transition cursor-pointer"
              >
                <span>Fix Flagged Sections & Resubmit</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}

            {isUnderReview && (
              <div className="inline-flex items-center gap-2 rounded-xl bg-muted px-4 py-2 text-xs font-semibold text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Verification SLA: ~24 Hours</span>
              </div>
            )}
          </div>
        </div>

        {/* Product Catalogue Locked Callout */}
        {!isApproved && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 sm:p-5 flex items-start gap-3.5 shadow-2xs">
            <div className="h-9 w-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xs sm:text-sm font-bold text-amber-950">
                Product Catalogue & Operations Locked Until Approval
              </h3>
              <p className="text-xs text-amber-800 leading-relaxed">
                Adding, updating, duplicating, or deleting products, modifying inventory stock levels,
                and accepting customer orders will automatically unlock once the platform admin
                approves your KYC credentials.
              </p>
            </div>
          </div>
        )}

        {/* Changes Requested / Rejection Notes Box */}
        {(isChangesRequested || isRejected) && (
          <div className="rounded-2xl border border-orange-200 bg-orange-50/70 dark:bg-orange-950/20 p-5 space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-orange-900 dark:text-orange-200">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <span>Reviewer Feedback & Required Corrections</span>
            </div>
            {vendor.changesRequestedSections && (
              <div className="flex items-center gap-2 text-xs text-orange-800 dark:text-orange-300">
                <span className="font-semibold">Flagged Sections:</span>
                <div className="flex gap-1.5">
                  {vendor.changesRequestedSections.map((sec) => (
                    <span
                      key={sec}
                      className="rounded-md bg-orange-200/80 dark:bg-orange-900/40 px-2 py-0.5 font-mono text-[11px] font-bold uppercase text-orange-950 dark:text-orange-100"
                    >
                      {sec}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <p className="text-xs text-orange-900 dark:text-orange-200 leading-relaxed font-medium bg-white/60 dark:bg-black/20 p-3 rounded-xl border border-orange-200/60">
              "{vendor.changesRequestedNotes || vendor.rejectionReason || "Please re-upload clear copies of required documents."}"
            </p>
          </div>
        )}

        {/* Verification Timeline Card */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-4">
          <h2 className="font-display text-lg font-bold text-foreground">
            Application Verification Timeline
          </h2>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
            {vendor.auditTimeline?.map((evt, idx) => (
              <div key={evt.id || idx} className="relative">
                <div className="absolute -left-6 top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-primary shadow-xs" />
                <div className="text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground">{evt.action}</span>
                    <span className="text-[11px] text-muted-foreground font-mono">
                      {new Date(evt.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <p className="text-muted-foreground mt-0.5">
                    By {evt.actor} ({evt.actorRole})
                  </p>
                  {evt.notes && (
                    <p className="mt-1 text-[11px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/20 p-2 rounded-lg">
                      {evt.notes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submitted Information Snapshot */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-4">
          <h2 className="font-display text-lg font-bold text-foreground">
            Submitted Profile Snapshot
          </h2>

          <div className="grid sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl border border-border bg-muted/20">
              <span className="text-muted-foreground font-medium">Store Display Name</span>
              <p className="font-bold text-foreground mt-0.5">{vendor.storeName}</p>
            </div>
            <div className="p-3.5 rounded-xl border border-border bg-muted/20">
              <span className="text-muted-foreground font-medium">GST Identification</span>
              <p className="font-bold text-foreground mt-0.5 font-mono">
                {vendor.onboarding.tax.gstExempt ? "Exempt Seller" : vendor.onboarding.tax.gstin}
              </p>
            </div>
            <div className="p-3.5 rounded-xl border border-border bg-muted/20">
              <span className="text-muted-foreground font-medium">Pickup Hub Location</span>
              <p className="font-bold text-foreground mt-0.5">
                {vendor.onboarding.shipping.pickupAddress?.city} (PIN:{" "}
                {vendor.onboarding.shipping.pickupAddress?.pincode})
              </p>
            </div>
            <div className="p-3.5 rounded-xl border border-border bg-muted/20">
              <span className="text-muted-foreground font-medium">Settlement Bank</span>
              <p className="font-bold text-foreground mt-0.5 font-mono">
                {vendor.onboarding.bank.maskedAccountNumber || "Masked A/C"} (
                {vendor.onboarding.bank.bankName})
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
