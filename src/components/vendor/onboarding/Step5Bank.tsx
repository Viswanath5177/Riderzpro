import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreditCard,
  Building,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  FileCheck,
  ShieldCheck,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import type { Vendor } from "@/lib/vendor/types";
import { vendorBankSchema } from "@/lib/vendor/validators";
import { ifscAdapter, type IfscLookupResult } from "@/lib/vendor/adapters/ifsc";
import { bankAdapter, type BankVerificationResult } from "@/lib/vendor/adapters/bank";

interface Step5BankProps {
  vendor: Vendor;
  onBack: () => void;
  onSaveAndNext: (data: any) => void;
}

export function Step5Bank({ vendor, onBack, onSaveAndNext }: Step5BankProps) {
  const defaultBank = vendor.onboarding.bank;

  const [ifscLoading, setIfscLoading] = useState(false);
  const [bankInfo, setBankInfo] = useState<IfscLookupResult | null>(
    defaultBank?.bankName
      ? {
          ifsc: defaultBank.ifsc,
          bankName: defaultBank.bankName,
          branch: defaultBank.branchName,
          city: "Bengaluru",
          state: "Karnataka",
        }
      : null
  );

  const [verifyingPenny, setVerifyingPenny] = useState(false);
  const [pennyResult, setPennyResult] = useState<BankVerificationResult | null>(
    defaultBank?.pennyDropVerified
      ? {
          verified: true,
          registeredName: defaultBank.pennyDropName || defaultBank.accountHolderName,
          nameMatchScore: 98,
          referenceId: "NPCI_VERIFIED",
        }
      : null
  );

  const [chequeFilePreview, setChequeFilePreview] = useState<string | undefined>(
    defaultBank?.chequeDocUrl || "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&auto=format&fit=crop&q=80"
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(vendorBankSchema),
    defaultValues: {
      accountHolderName: defaultBank?.accountHolderName || vendor.businessName || "VoltHub Energy Systems Pvt Ltd",
      accountNumber: defaultBank?.accountNumber || "50200049281726",
      confirmAccountNumber: defaultBank?.accountNumber || "50200049281726",
      ifsc: defaultBank?.ifsc || "HDFC0000038",
      accountType: defaultBank?.accountType || "Current",
      upiId: defaultBank?.upiId || "",
    },
  });

  const ifscValue = watch("ifsc");
  const accountHolderVal = watch("accountHolderName");
  const accountNumVal = watch("accountNumber");

  const handleIfscBlur = async (code: string) => {
    if (code && code.trim().length === 11) {
      setIfscLoading(true);
      try {
        const res = await ifscAdapter.lookup(code);
        setBankInfo(res);
        toast.success(`Bank identified: ${res.bankName} (${res.branch})`);
      } catch (e: any) {
        setBankInfo(null);
        toast.error("Invalid IFSC code");
      } finally {
        setIfscLoading(false);
      }
    }
  };

  const handleTriggerPennyDrop = async () => {
    if (!accountNumVal || !ifscValue || !accountHolderVal) {
      toast.error("Please enter account number, IFSC and holder name before verifying");
      return;
    }

    setVerifyingPenny(true);
    try {
      const res = await bankAdapter.verify(accountNumVal, ifscValue, accountHolderVal);
      setPennyResult(res);
      if (res.verified) {
        toast.success(`Penny drop verified! Bank account holder confirmed as: ${res.registeredName}`);
      } else {
        toast.error(res.error || "Penny drop verification failed");
      }
    } catch {
      toast.error("Verification connection error");
    } finally {
      setVerifyingPenny(false);
    }
  };

  const onSubmit = (formData: any) => {
    if (!pennyResult?.verified) {
      toast.error("Please run penny drop verification to validate your bank account before continuing");
      return;
    }

    const masked =
      formData.accountNumber.length > 4
        ? "X".repeat(formData.accountNumber.length - 4) + formData.accountNumber.slice(-4)
        : formData.accountNumber;

    onSaveAndNext({
      bank: {
        ...formData,
        maskedAccountNumber: masked,
        bankName: bankInfo?.bankName || "Commercial Bank",
        branchName: bankInfo?.branch || "Main Branch",
        pennyDropVerified: pennyResult.verified,
        pennyDropName: pennyResult.registeredName,
        chequeDocUrl: chequeFilePreview,
      },
    });
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-card">
      <div className="mb-6">
        <span className="text-xs font-bold text-primary tracking-wider uppercase">Step 5 of 6</span>
        <h2 className="font-display text-2xl font-extrabold text-foreground mt-1">
          Bank Account & Payout Settlements
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Direct bank transfer for your sales payouts. Verified with instant Penny Drop verification.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Account Holder Name */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            Bank Account Holder Name (Must match Business / PAN)
          </label>
          <input
            type="text"
            {...register("accountHolderName")}
            placeholder="e.g. VoltHub Energy Systems Pvt Ltd"
            className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary"
          />
          {errors.accountHolderName && (
            <p className="mt-1 text-xs text-destructive">{errors.accountHolderName.message as string}</p>
          )}
        </div>

        {/* Account Number & Confirm Account Number */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Bank Account Number
            </label>
            <input
              type="password"
              {...register("accountNumber")}
              placeholder="Enter account number"
              className="w-full font-mono rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary"
            />
            {errors.accountNumber && (
              <p className="mt-1 text-xs text-destructive">{errors.accountNumber.message as string}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Confirm Account Number
            </label>
            <input
              type="text"
              {...register("confirmAccountNumber")}
              placeholder="Re-enter to confirm"
              className="w-full font-mono rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary"
            />
            {errors.confirmAccountNumber && (
              <p className="mt-1 text-xs text-destructive">{errors.confirmAccountNumber.message as string}</p>
            )}
          </div>
        </div>

        {/* IFSC Code & Branch Lookup */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                IFSC Code (11-Character)
              </label>
              <button
                type="button"
                onClick={() => {
                  setValue("ifsc", "HDFC0000038");
                  handleIfscBlur("HDFC0000038");
                }}
                className="text-xs text-primary font-bold hover:underline"
              >
                Sample (HDFC0000038)
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                maxLength={11}
                {...register("ifsc")}
                onBlur={(e) => handleIfscBlur(e.target.value)}
                placeholder="HDFC0000038"
                className="w-full font-mono uppercase font-bold rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary"
              />
              {ifscLoading && (
                <Loader2 className="absolute right-3.5 top-3 h-4 w-4 animate-spin text-primary" />
              )}
            </div>
            {errors.ifsc && (
              <p className="mt-1 text-xs text-destructive">{errors.ifsc.message as string}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Account Type
            </label>
            <select
              {...register("accountType")}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none cursor-pointer"
            >
              <option value="Current">Current Account (Recommended for Business)</option>
              <option value="Savings">Savings Account</option>
            </select>
          </div>
        </div>

        {/* Bank & Branch Result Card */}
        {bankInfo && (
          <div className="rounded-xl border border-border bg-muted/40 p-3.5 flex items-center justify-between text-xs animate-in fade-in">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-primary shrink-0" />
              <div>
                <p className="font-bold text-foreground">{bankInfo.bankName}</p>
                <p className="text-muted-foreground text-[11px] mt-0.5">
                  Branch: {bankInfo.branch} · {bankInfo.city}, {bankInfo.state}
                </p>
              </div>
            </div>
            <span className="rounded-md bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">
              IFSC Valid
            </span>
          </div>
        )}

        {/* Penny Drop Verification Module */}
        <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span className="text-xs font-bold text-foreground">
                Penny Drop Bank Account Verification
              </span>
            </div>
            {pennyResult?.verified ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5">
                <CheckCircle2 className="h-3 w-3" />
                Verified
              </span>
            ) : (
              <button
                type="button"
                onClick={handleTriggerPennyDrop}
                disabled={verifyingPenny}
                className="rounded-xl bg-foreground text-background px-3.5 py-1.5 text-xs font-bold hover:opacity-90 flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                {verifyingPenny ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Verifying with NPCI...</span>
                  </>
                ) : (
                  <span>Verify with ₹1 Penny Drop</span>
                )}
              </button>
            )}
          </div>

          <p className="text-[11px] text-muted-foreground leading-relaxed">
            We deposit a reversible ₹1 penny amount via IMPS to verify the exact registered account title with your bank.
          </p>

          {pennyResult?.verified && (
            <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 p-2.5 text-xs text-emerald-800 dark:text-emerald-300">
              <p className="font-semibold">Registered Holder Name on Bank Record:</p>
              <p className="font-mono font-bold mt-0.5">{pennyResult.registeredName}</p>
            </div>
          )}
        </div>

        {/* Settlement Cycle Info Card */}
        <div className="rounded-xl border border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 p-4 text-xs space-y-1 text-blue-950 dark:text-blue-300">
          <p className="font-bold flex items-center gap-1.5">
            <CreditCard className="h-4 w-4 text-blue-600" />
            Payout Settlement Cycle: T+7 Days
          </p>
          <p className="text-[11px] leading-relaxed text-blue-800 dark:text-blue-400">
            Payouts for delivered orders are credited automatically to this verified bank account on a rolling T+7 schedule. Platform commission (10–12%) and applicable TCS/TDS are deducted automatically.
          </p>
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
            <span>Continue to Documents & Review</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
