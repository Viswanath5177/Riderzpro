import React from "react";
import { CheckCircle2, ShieldCheck, ArrowRight, UserCheck, Phone, Mail, Building } from "lucide-react";
import type { Vendor } from "@/lib/vendor/types";

interface Step1AccountProps {
  vendor: Vendor;
  onNext: () => void;
}

export function Step1Account({ vendor, onNext }: Step1AccountProps) {
  const account = vendor.onboarding.account;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-card">
      <div className="flex items-center justify-between pb-6 border-b border-border">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Verified & Done
          </span>
          <h2 className="font-display text-2xl font-extrabold text-foreground mt-2">
            Seller Account Details
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Your representative credentials created during signup.
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 py-6">
        <div className="p-4 rounded-xl border border-border bg-muted/40">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Representative Name
          </p>
          <p className="text-base font-bold text-foreground mt-1">{account.fullName || vendor.businessName}</p>
        </div>

        <div className="p-4 rounded-xl border border-border bg-muted/40">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Business Constitution
          </p>
          <p className="text-base font-bold text-foreground mt-1">{account.businessType}</p>
        </div>

        <div className="p-4 rounded-xl border border-border bg-muted/40">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Verified Mobile Number
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-base font-bold text-foreground">+91 {account.mobile || vendor.phone}</span>
            <span className="rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5">
              OTP Verified
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-border bg-muted/40">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Verified Store Email
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-base font-bold text-foreground truncate">{account.email || vendor.email}</span>
            <span className="rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5">
              OTP Verified
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end pt-4 border-t border-border">
        <button
          type="button"
          onClick={onNext}
          className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-primary-foreground shadow-glow hover:brightness-105 transition"
        >
          <span>Continue to Tax Details</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
