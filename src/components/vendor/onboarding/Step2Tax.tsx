import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Building,
  ArrowRight,
  ArrowLeft,
  Loader2,
  FileText,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";
import type { Vendor } from "@/lib/vendor/types";
import { vendorTaxSchema } from "@/lib/vendor/validators";
import { gstAdapter, type GstLookupResult } from "@/lib/vendor/adapters/gst";
import { derivePanFromGstin } from "@/lib/vendor/validators";

interface Step2TaxProps {
  vendor: Vendor;
  onBack: () => void;
  onSaveAndNext: (data: any) => void;
}

export function Step2Tax({ vendor, onBack, onSaveAndNext }: Step2TaxProps) {
  const defaultTax = vendor.onboarding.tax;
  const [gstExempt, setGstExempt] = useState(defaultTax?.gstExempt || false);
  const [gstLookupLoading, setGstLookupLoading] = useState(false);
  const [gstData, setGstData] = useState<GstLookupResult | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(vendorTaxSchema),
    defaultValues: {
      gstExempt: defaultTax?.gstExempt || false,
      gstin: defaultTax?.gstin || "27AAPFU0939F1ZV",
      legalName: defaultTax?.legalName || vendor.businessName,
      tradeName: defaultTax?.tradeName || "",
      pan: defaultTax?.pan || "AAPFU0939F",
      panHolderName: defaultTax?.panHolderName || defaultTax?.legalName || "",
      chargesIgst: defaultTax?.chargesIgst ?? true,
      registeredAddress: defaultTax?.registeredAddress || "",
      sameAsGstAddress: defaultTax?.sameAsGstAddress ?? true,
      govtIdType: defaultTax?.govtIdType || "Driving Licence",
      govtIdLast4: defaultTax?.govtIdLast4 || "4192",
    },
  });

  const gstinValue = watch("gstin");
  const legalNameValue = watch("legalName");
  const panHolderNameValue = watch("panHolderName");

  // Lookup GST automatically when 15 characters are entered
  useEffect(() => {
    if (gstinValue && gstinValue.length === 15 && !gstExempt) {
      handleLookupGst(gstinValue);
    }
  }, [gstinValue, gstExempt]);

  const handleLookupGst = async (gstinToLookup: string) => {
    setGstLookupLoading(true);
    try {
      const res = await gstAdapter.lookup(gstinToLookup);
      setGstData(res);
      setValue("legalName", res.legalName);
      setValue("tradeName", res.tradeName);
      setValue("pan", res.pan);
      if (!watch("panHolderName")) {
        setValue("panHolderName", res.legalName);
      }
      if (watch("sameAsGstAddress")) {
        setValue("registeredAddress", res.address);
      }
      toast.success("GSTIN verified successfully from tax registry!");
    } catch (e: any) {
      setGstData(null);
      toast.error(e.message || "Failed to verify GSTIN");
    } finally {
      setGstLookupLoading(false);
    }
  };

  const onSubmit = (formData: any) => {
    if (!gstExempt && gstData && gstData.status !== "Active") {
      toast.error("GST status is not Active. You cannot proceed with a cancelled GSTIN.");
      return;
    }

    onSaveAndNext({
      tax: {
        ...formData,
        gstExempt,
        status: gstData?.status || (gstExempt ? "Active" : undefined),
        registrationDate: gstData?.registrationDate,
        taxpayerType: gstData?.taxpayerType,
      },
    });
  };

  const nameMismatch =
    panHolderNameValue &&
    legalNameValue &&
    !legalNameValue.toLowerCase().includes(panHolderNameValue.toLowerCase().split(" ")[0]);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-card">
      <div className="mb-6">
        <span className="text-xs font-bold text-primary tracking-wider uppercase">Step 2 of 6</span>
        <h2 className="font-display text-2xl font-extrabold text-foreground mt-1">
          Verify Tax Details (GST & PAN)
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter your 15-digit GSTIN to auto-fetch your legal entity details and derive your PAN.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Escape Hatch: I don't have GSTIN */}
        <div className="rounded-xl border border-border bg-muted/30 p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="gst-exempt-toggle"
              checked={gstExempt}
              onChange={(e) => {
                const checked = e.target.checked;
                setGstExempt(checked);
                setValue("gstExempt", checked);
              }}
              className="h-4 w-4 rounded border-border text-primary accent-primary cursor-pointer"
            />
            <label htmlFor="gst-exempt-toggle" className="text-xs font-semibold text-foreground cursor-pointer">
              I don't have a GSTIN (Individual / Exempt Seller)
            </label>
          </div>
          <span className="text-[11px] text-muted-foreground hidden sm:inline">
            Subject to category restrictions
          </span>
        </div>

        {!gstExempt ? (
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  GSTIN (15-Character Tax Identification Number)
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setValue("gstin", "27AAPFU0939F1ZV");
                    handleLookupGst("27AAPFU0939F1ZV");
                  }}
                  className="text-xs text-primary font-bold hover:underline"
                >
                  Use Valid Sample (27AAPFU0939F1ZV)
                </button>
              </div>

              <div className="relative">
                <input
                  type="text"
                  maxLength={15}
                  {...register("gstin")}
                  placeholder="27AAPFU0939F1ZV"
                  className={`w-full font-mono uppercase font-bold tracking-wider rounded-xl border bg-background px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 ${
                    errors.gstin ? "border-destructive" : "border-border focus:border-primary"
                  }`}
                />
                {gstLookupLoading && (
                  <Loader2 className="absolute right-3.5 top-3 h-4 w-4 animate-spin text-primary" />
                )}
                {gstData && !gstLookupLoading && (
                  <CheckCircle2 className="absolute right-3.5 top-3 h-4 w-4 text-emerald-600" />
                )}
              </div>
              {errors.gstin && (
                <p className="mt-1 text-xs font-medium text-destructive">{errors.gstin.message as string}</p>
              )}
            </div>

            {/* GST Live Result Card */}
            {gstData && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20 p-4 space-y-2 text-xs animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    GST Active Verified Entity
                  </span>
                  <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-extrabold uppercase">
                    {gstData.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-muted-foreground pt-1">
                  <div>
                    <span className="font-semibold text-foreground">Legal Name:</span> {gstData.legalName}
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">Trade Name:</span> {gstData.tradeName}
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">State:</span> {gstData.state}
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">Registration Date:</span> {gstData.registrationDate}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/20 p-3.5 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">GST Exemption Notice:</p>
              <p className="mt-0.5 text-amber-800 dark:text-amber-300">
                You are onboarding as a GST-exempt seller. Your application will be flagged for closer review by RiderzPro Admin, and products requiring statutory GST invoices (e.g. high-capacity Li-ion packs) will be gated.
              </p>
            </div>
          </div>
        )}

        {/* Legal Name */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            Business Legal Entity Name
          </label>
          <input
            type="text"
            {...register("legalName")}
            placeholder="Official legal name registered with tax department"
            className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary"
          />
          {errors.legalName && (
            <p className="mt-1 text-xs text-destructive">{errors.legalName.message as string}</p>
          )}
        </div>

        {/* PAN Details */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Permanent Account Number (PAN)
            </label>
            <input
              type="text"
              maxLength={10}
              readOnly={!gstExempt}
              {...register("pan")}
              placeholder="ABCDE1234F"
              className={`w-full font-mono uppercase font-bold rounded-xl border bg-background px-3.5 py-2.5 text-sm outline-none ${
                !gstExempt ? "bg-muted cursor-not-allowed border-border" : "border-border focus:border-primary"
              }`}
            />
            <p className="text-[10px] text-muted-foreground mt-1">
              {!gstExempt ? "Auto-derived from chars 3 to 12 of your GSTIN" : "Enter 10-char PAN"}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              PAN Card Holder Name
            </label>
            <input
              type="text"
              {...register("panHolderName")}
              placeholder="Name on physical PAN card"
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary"
            />
            {nameMismatch && (
              <p className="text-[10px] text-amber-600 mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Note: PAN holder name differs from legal name. This will be verified.
              </p>
            )}
          </div>
        </div>

        {/* Registered Address */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            Registered Business Address
          </label>
          <textarea
            rows={2}
            {...register("registeredAddress")}
            placeholder="Complete address registered on GST Certificate"
            className="w-full rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary"
          />
          {errors.registeredAddress && (
            <p className="mt-1 text-xs text-destructive">{errors.registeredAddress.message as string}</p>
          )}
        </div>

        {/* Identity Verification (Aadhaar-free: Govt ID + last 4 only) */}
        <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span>Identity Proof (Aadhaar-Free Secure Identification)</span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            For privacy security, RiderzPro never stores Aadhaar numbers. Select a government ID and enter the last 4 characters only.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1">ID Type</label>
              <select
                {...register("govtIdType")}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none"
              >
                <option value="Driving Licence">Driving Licence</option>
                <option value="Voter ID">Voter ID Card</option>
                <option value="Passport">Passport</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                Last 4 Digits / Chars
              </label>
              <input
                type="text"
                maxLength={4}
                {...register("govtIdLast4")}
                placeholder="4192"
                className="w-full font-mono text-center font-bold rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none"
              />
              {errors.govtIdLast4 && (
                <p className="mt-1 text-xs text-destructive">{errors.govtIdLast4.message as string}</p>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-primary-foreground shadow-glow hover:brightness-105 transition"
          >
            <span>Continue to Store Profile</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
