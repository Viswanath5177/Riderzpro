import React, { useState } from "react";
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Eye,
  ArrowRight,
  ArrowLeft,
  Check,
  ShieldCheck,
  Building,
  Store,
  MapPin,
  CreditCard,
  Edit2,
} from "lucide-react";
import { toast } from "sonner";
import type { Vendor } from "@/lib/vendor/types";

interface Step6DocumentsReviewProps {
  vendor: Vendor;
  onBack: () => void;
  onEditStep: (stepNumber: number) => void;
  onSubmitApplication: () => void;
}

export function Step6DocumentsReview({
  vendor,
  onBack,
  onEditStep,
  onSubmitApplication,
}: Step6DocumentsReviewProps) {
  const [agreementChecked, setAgreementChecked] = useState(true);
  const [signatureName, setSignatureName] = useState(
    vendor.onboarding.account.fullName || vendor.businessName || "Vikram Rathore"
  );

  // Document mock previews
  const [panDoc, setPanDoc] = useState(
    vendor.onboarding.documents?.panDocUrl ||
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80"
  );
  const [gstDoc, setGstDoc] = useState(
    vendor.onboarding.documents?.gstDocUrl ||
      "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&auto=format&fit=crop&q=80"
  );
  const [chequeDoc, setChequeDoc] = useState(
    vendor.onboarding.documents?.chequeDocUrl ||
      "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&auto=format&fit=crop&q=80"
  );

  const [tradeLicenseDoc, setTradeLicenseDoc] = useState(
    vendor.onboarding.documents?.tradeLicenseDocUrl || ""
  );

  const [activePreviewUrl, setActivePreviewUrl] = useState<string | null>(null);

  const handleUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size exceeds 5 MB limit");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => setter(reader.result as string);
      reader.readAsDataURL(file);
      toast.success("Document uploaded successfully");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreementChecked) {
      toast.error("You must accept the digital merchant agreement before submitting");
      return;
    }
    if (!signatureName.trim()) {
      toast.error("Please type your legal signature name");
      return;
    }
    onSubmitApplication();
  };

  const ob = vendor.onboarding;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-card space-y-6">
      <div className="pb-4 border-b border-border">
        <span className="text-xs font-bold text-primary tracking-wider uppercase">Step 6 of 6</span>
        <h2 className="font-display text-2xl font-extrabold text-foreground mt-1">
          KYC Documents & Final Review
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload required statutory certificates, review your information, and digitally sign to submit.
        </p>
      </div>

      {/* SECTION 1: Document Uploads */}
      <div className="space-y-4">
        <h3 className="font-display text-base font-bold text-foreground">
          1. Required Verification Documents (PDF / JPG / PNG, Max 5 MB)
        </h3>

        <div className="grid sm:grid-cols-3 gap-3">
          {/* PAN Card */}
          <div className="p-3.5 rounded-xl border border-border bg-muted/20 flex flex-col justify-between">
            <div>
              <p className="text-xs font-bold text-foreground">PAN Card</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Physical PAN of entity</p>
            </div>
            <div className="pt-3 flex items-center justify-between">
              {panDoc ? (
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Ready
                  </span>
                  <button
                    type="button"
                    onClick={() => setActivePreviewUrl(panDoc)}
                    className="text-gray-500 hover:text-foreground"
                    title="Preview"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <span className="text-[11px] text-amber-600">Pending</span>
              )}
              <label className="cursor-pointer">
                <span className="text-[11px] text-primary font-bold hover:underline">Replace</span>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => handleUpload(e, setPanDoc)}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* GST Certificate */}
          <div className="p-3.5 rounded-xl border border-border bg-muted/20 flex flex-col justify-between">
            <div>
              <p className="text-xs font-bold text-foreground">GST Certificate (REG-06)</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">3-page GST registration</p>
            </div>
            <div className="pt-3 flex items-center justify-between">
              {gstDoc ? (
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Ready
                  </span>
                  <button
                    type="button"
                    onClick={() => setActivePreviewUrl(gstDoc)}
                    className="text-gray-500 hover:text-foreground"
                    title="Preview"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <span className="text-[11px] text-amber-600">Pending</span>
              )}
              <label className="cursor-pointer">
                <span className="text-[11px] text-primary font-bold hover:underline">Replace</span>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => handleUpload(e, setGstDoc)}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Cancelled Cheque */}
          <div className="p-3.5 rounded-xl border border-border bg-muted/20 flex flex-col justify-between">
            <div>
              <p className="text-xs font-bold text-foreground">Cancelled Cheque</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">With printed name & IFSC</p>
            </div>
            <div className="pt-3 flex items-center justify-between">
              {chequeDoc ? (
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Ready
                  </span>
                  <button
                    type="button"
                    onClick={() => setActivePreviewUrl(chequeDoc)}
                    className="text-gray-500 hover:text-foreground"
                    title="Preview"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <span className="text-[11px] text-amber-600">Pending</span>
              )}
              <label className="cursor-pointer">
                <span className="text-[11px] text-primary font-bold hover:underline">Replace</span>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => handleUpload(e, setChequeDoc)}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Summary of All Steps with Edit Links */}
      <div className="space-y-4 pt-2">
        <h3 className="font-display text-base font-bold text-foreground">
          2. Application Review Summary
        </h3>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Step 1 Review Card */}
          <div className="p-4 rounded-xl border border-border bg-muted/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  Account Representative
                </span>
                <button
                  type="button"
                  onClick={() => onEditStep(1)}
                  className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
                >
                  <Edit2 className="h-3 w-3" /> Edit
                </button>
              </div>
              <div className="mt-2 text-xs space-y-1 text-muted-foreground">
                <p>
                  <span className="font-semibold text-foreground">Name:</span> {ob.account.fullName}
                </p>
                <p>
                  <span className="font-semibold text-foreground">Mobile:</span> +91 {ob.account.mobile}
                </p>
                <p>
                  <span className="font-semibold text-foreground">Email:</span> {ob.account.email}
                </p>
              </div>
            </div>
          </div>

          {/* Step 2 Review Card */}
          <div className="p-4 rounded-xl border border-border bg-muted/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  Tax & Legal Identity
                </span>
                <button
                  type="button"
                  onClick={() => onEditStep(2)}
                  className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
                >
                  <Edit2 className="h-3 w-3" /> Edit
                </button>
              </div>
              <div className="mt-2 text-xs space-y-1 text-muted-foreground">
                <p>
                  <span className="font-semibold text-foreground">GSTIN:</span>{" "}
                  {ob.tax.gstExempt ? "Exempt Seller" : ob.tax.gstin}
                </p>
                <p>
                  <span className="font-semibold text-foreground">Entity:</span> {ob.tax.legalName}
                </p>
                <p>
                  <span className="font-semibold text-foreground">PAN:</span> {ob.tax.pan}
                </p>
              </div>
            </div>
          </div>

          {/* Step 3 Review Card */}
          <div className="p-4 rounded-xl border border-border bg-muted/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  Store & Catalog
                </span>
                <button
                  type="button"
                  onClick={() => onEditStep(3)}
                  className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
                >
                  <Edit2 className="h-3 w-3" /> Edit
                </button>
              </div>
              <div className="mt-2 text-xs space-y-1 text-muted-foreground">
                <p>
                  <span className="font-semibold text-foreground">Store Name:</span> {ob.store.storeName}
                </p>
                <p>
                  <span className="font-semibold text-foreground">Slug:</span> /store/{ob.store.slug}
                </p>
                <p>
                  <span className="font-semibold text-foreground">Categories:</span>{" "}
                  {ob.store.categories?.slice(0, 3).join(", ")}
                </p>
              </div>
            </div>
          </div>

          {/* Step 4 Review Card */}
          <div className="p-4 rounded-xl border border-border bg-muted/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  Pickup & Settlements
                </span>
                <button
                  type="button"
                  onClick={() => onEditStep(4)}
                  className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
                >
                  <Edit2 className="h-3 w-3" /> Edit
                </button>
              </div>
              <div className="mt-2 text-xs space-y-1 text-muted-foreground">
                <p>
                  <span className="font-semibold text-foreground">Hub:</span> {ob.shipping.pickupAddress?.city}{" "}
                  ({ob.shipping.pickupAddress?.pincode})
                </p>
                <p>
                  <span className="font-semibold text-foreground">Prep:</span> {ob.shipping.handlingTimeMins} mins
                </p>
                <p>
                  <span className="font-semibold text-foreground">Bank A/C:</span>{" "}
                  {ob.bank.maskedAccountNumber || "Masked A/C"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: Digital Seller Agreement */}
      <form onSubmit={handleSubmit} className="pt-4 border-t border-border space-y-4">
        <h3 className="font-display text-base font-bold text-foreground">
          3. Digital Agreement & Declaration
        </h3>

        <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-3">
          <label className="flex items-start gap-2.5 text-xs text-muted-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={agreementChecked}
              onChange={(e) => setAgreementChecked(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-border text-primary accent-primary shrink-0"
            />
            <span className="leading-relaxed">
              I solemnly affirm and declare that the tax registrations, banking details, and statutory documentation provided are genuine, unaltered, and belonging to the named business entity. I agree to RiderzPro's{" "}
              <span className="text-foreground font-semibold underline">Platform Terms of Service</span>,{" "}
              <span className="text-foreground font-semibold underline">Hazardous EV Parts Fulfillment Policy</span>, and{" "}
              <span className="text-foreground font-semibold underline">Settlement SLA</span>.
            </span>
          </label>

          <div className="grid sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                Authorized Signatory Name (Typed Signature)
              </label>
              <input
                type="text"
                required
                value={signatureName}
                onChange={(e) => setSignatureName(e.target.value)}
                placeholder="Type your full legal name"
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-bold outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                Digital Signing Timestamp
              </label>
              <div className="rounded-xl border border-border bg-muted px-3 py-2 text-xs font-mono text-muted-foreground">
                {new Date().toLocaleString("en-IN")}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4">
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
            className="flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 font-bold text-primary-foreground shadow-glow hover:brightness-105 transition"
          >
            <span>Submit Application for Verification</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>

      {/* Inline Zoom Preview Modal */}
      {activePreviewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative max-w-xl w-full bg-white rounded-2xl p-4 overflow-hidden">
            <div className="flex justify-between items-center pb-2 border-b border-border mb-3">
              <span className="text-xs font-bold">Document Preview</span>
              <button
                type="button"
                onClick={() => setActivePreviewUrl(null)}
                className="text-xs font-bold text-primary hover:underline"
              >
                Close ✕
              </button>
            </div>
            <img
              src={activePreviewUrl}
              alt="KYC Document"
              className="w-full max-h-[60vh] object-contain rounded-xl bg-gray-50"
            />
          </div>
        </div>
      )}
    </div>
  );
}
