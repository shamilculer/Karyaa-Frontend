"use client";

import { useVendorFormStore } from '@/store/vendorFormStore';
import { useEffect } from 'react';

// Import all step components
import Step01_BasicInfo from './steps/Step01_BasicInfo';
import Step02_BusinessInfo from './steps/Step02_BusinessInfo';
import Step03_Review from './steps/Step3_Review';

const STEPS = [
  { component: Step01_BasicInfo, title: "Basic Account Information" },
  { component: Step02_BusinessInfo, title: "Business Details & Verification" },
  { component: Step03_Review, title: "Review & Submit" },
];


export default function VendorMultiStepForm() {
  // Use the merged store
  const { formData, currentStepIndex } = useVendorFormStore();

  useEffect(() => {
    const scrollContainer = document.getElementById("vendor-register-scroll-container");
    if (scrollContainer) {
      scrollContainer.scrollTop = 0;
    }
  }, [currentStepIndex]);

  const currentStep = STEPS[currentStepIndex];
  const isLastStep = currentStepIndex === STEPS.length - 1;
  const isFirstStep = currentStepIndex === 0;

  if (currentStepIndex >= STEPS.length) {
    return <div className="text-center p-12 text-lg font-semibold text-green-700">Processing Submission...</div>;
  }

  const CurrentStepComponent = currentStep.component;

  return (
    <div>

      {/* Progress Bar & Title */}
      <div className="mb-8">
        <div className="h-1 bg-indigo-100 rounded-full mt-2">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${((currentStepIndex + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* The component is rendered here. */}
      <CurrentStepComponent
        // Pass necessary props
        currentStepIndex={currentStepIndex}
        isLastStep={isLastStep}
      />

    </div>
  );
}