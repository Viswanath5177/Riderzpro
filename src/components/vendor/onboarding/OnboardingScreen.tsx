import React, { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useVendorAuth } from "@/lib/vendorAuth";
import { useVendorStore } from "@/lib/vendor/vendorStore";
import { OnboardingLayout } from "./OnboardingLayout";
import { Step1Account } from "./Step1Account";
import { Step2Tax } from "./Step2Tax";
import { Step3Store } from "./Step3Store";
import { Step4Shipping } from "./Step4Shipping";
import { Step5Bank } from "./Step5Bank";
import { Step6DocumentsReview } from "./Step6DocumentsReview";

export function OnboardingScreen() {
  const { vendor, currentVendor } = useVendorAuth();
  const activeVendor = vendor || currentVendor;
  const { updateOnboardingStep, submitOnboarding } = useVendorStore();
  const navigate = useNavigate();

  // If vendor has saved step, resume at saved step
  const [currentStep, setCurrentStep] = useState(activeVendor?.onboarding?.currentStep || 2);
  const completedSteps = activeVendor?.onboarding?.completedSteps || [1];

  if (!activeVendor) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F6F8] p-4 text-center">
        <div className="max-w-md rounded-2xl bg-white p-6 shadow-sm border border-gray-200 space-y-3">
          <h2 className="text-base font-bold text-gray-900">Session Required</h2>
          <p className="text-xs text-gray-500">Please sign in or complete registration to continue onboarding.</p>
          <a
            href="/vendor/auth"
            className="inline-block rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-xs"
          >
            Go to Vendor Sign In
          </a>
        </div>
      </div>
    );
  }

  const handleStepSaveAndNext = (stepNum: number, stepData: any) => {
    updateOnboardingStep(activeVendor.id, stepNum, stepData);
    setCurrentStep(Math.min(6, stepNum + 1));
  };

  const handleSubmitAll = () => {
    submitOnboarding(activeVendor.id);
    navigate({ to: "/vendor/pending" });
  };

  return (
    <OnboardingLayout
      currentStep={currentStep}
      completedSteps={completedSteps}
      onSelectStep={(step) => setCurrentStep(step)}
    >
      {currentStep === 1 && (
        <Step1Account vendor={activeVendor} onNext={() => setCurrentStep(2)} />
      )}

      {currentStep === 2 && (
        <Step2Tax
          vendor={activeVendor}
          onBack={() => setCurrentStep(1)}
          onSaveAndNext={(data) => handleStepSaveAndNext(2, data)}
        />
      )}

      {currentStep === 3 && (
        <Step3Store
          vendor={activeVendor}
          onBack={() => setCurrentStep(2)}
          onSaveAndNext={(data) => handleStepSaveAndNext(3, data)}
        />
      )}

      {currentStep === 4 && (
        <Step4Shipping
          vendor={activeVendor}
          onBack={() => setCurrentStep(3)}
          onSaveAndNext={(data) => handleStepSaveAndNext(4, data)}
        />
      )}

      {currentStep === 5 && (
        <Step5Bank
          vendor={activeVendor}
          onBack={() => setCurrentStep(4)}
          onSaveAndNext={(data) => handleStepSaveAndNext(5, data)}
        />
      )}

      {currentStep === 6 && (
        <Step6DocumentsReview
          vendor={activeVendor}
          onBack={() => setCurrentStep(5)}
          onEditStep={(step) => setCurrentStep(step)}
          onSubmitApplication={handleSubmitAll}
        />
      )}
    </OnboardingLayout>
  );
}
