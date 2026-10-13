import React from "react";
import { Link } from "@tanstack/react-router";
import { Check, ArrowLeft, Shield, Store, LogOut } from "lucide-react";
import { Logo } from "@/components/site/bits";
import { useVendorAuth } from "@/lib/vendorAuth";

export interface OnboardingStepMeta {
  number: number;
  title: string;
  shortTitle: string;
}

export const ONBOARDING_STEPS: OnboardingStepMeta[] = [
  { number: 1, title: "Seller account creation", shortTitle: "Account" },
  { number: 2, title: "Verify tax details", shortTitle: "Tax & GST" },
  { number: 3, title: "Store name & profile", shortTitle: "Store" },
  { number: 4, title: "Shipping & pickup", shortTitle: "Pickup & Prep" },
  { number: 5, title: "Bank details", shortTitle: "Bank & Payouts" },
  { number: 6, title: "Documents & Review", shortTitle: "Documents" },
];

interface OnboardingLayoutProps {
  currentStep: number;
  completedSteps: number[];
  onSelectStep: (step: number) => void;
  children: React.ReactNode;
}

export function OnboardingLayout({
  currentStep,
  completedSteps,
  onSelectStep,
  children,
}: OnboardingLayoutProps) {
  const { vendor, signOutVendor } = useVendorAuth();
  const currentMeta = ONBOARDING_STEPS.find((s) => s.number === currentStep) || ONBOARDING_STEPS[1];
  const progressPct = Math.round(((currentStep - 1) / (ONBOARDING_STEPS.length - 1)) * 100);

  return (
    <div className="min-h-screen bg-[#F5F6F8] flex flex-col font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-border shadow-2xs">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo imgClassName="h-8" />
            <span className="hidden sm:inline-block text-xs font-bold text-muted-foreground border-l border-border pl-3">
              Seller Onboarding
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="hidden md:flex items-center gap-1.5 text-muted-foreground">
              <Shield className="h-3.5 w-3.5 text-emerald-600" />
              <span>Draft Autosaved</span>
            </span>
            <button
              onClick={signOutVendor}
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Save & Sign Out</span>
            </button>
          </div>
        </div>

        {/* Desktop Horizontal Stepper with Top Progress Bar */}
        <div className="hidden md:block mx-auto max-w-6xl px-4 sm:px-6 pt-2 pb-4">
          {/* Progress track */}
          <div className="relative mb-3">
            <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            {ONBOARDING_STEPS.map((s) => {
              const isDone = completedSteps.includes(s.number);
              const isCurrent = s.number === currentStep;
              const isClickable = isDone || s.number <= currentStep;

              return (
                <button
                  key={s.number}
                  type="button"
                  disabled={!isClickable}
                  onClick={() => isClickable && onSelectStep(s.number)}
                  className={`flex items-center gap-2 text-left group transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  {/* Step Indicator Circle */}
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition ${
                      isDone
                        ? "bg-emerald-600 text-white"
                        : isCurrent
                        ? "bg-primary text-white ring-4 ring-primary/20"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {isDone ? <Check className="h-3.5 w-3.5" /> : s.number}
                  </div>
                  <div className="text-left">
                    <p
                      className={`text-xs font-bold leading-tight ${
                        isCurrent
                          ? "text-primary"
                          : isDone
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {s.shortTitle}
                    </p>
                    <p className="text-[10px] text-muted-foreground hidden lg:block">
                      {isDone ? "Completed" : isCurrent ? "In progress" : "Pending"}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile Stepper (Collapsed to Single Row) */}
        <div className="md:hidden border-t border-border/60 bg-white px-4 py-2.5">
          <div className="flex items-center justify-between text-xs font-bold mb-1.5">
            <span className="text-primary">
              Step {currentStep} of {ONBOARDING_STEPS.length}
            </span>
            <span className="text-foreground">{currentMeta.title}</span>
          </div>
          <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${(currentStep / ONBOARDING_STEPS.length) * 100}%` }}
            />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 mx-auto w-full max-w-4xl p-4 sm:p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}
