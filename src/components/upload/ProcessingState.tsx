"use client";

import { CheckCircle, Loader } from "lucide-react";

interface ProcessingStateProps {
  currentStep: 1 | 2;
  isComplete: boolean;
}

export function ProcessingState({ currentStep, isComplete }: ProcessingStateProps) {
  const steps = [
    { number: 1, text: "Reading document with OCR..." },
    { number: 2, text: "Extracting information with AI..." },
  ];

  return (
    <div className="space-y-6 py-8">
      {steps.map((step) => {
        const isActive = step.number === currentStep;
        const isDone = step.number < currentStep || (step.number === currentStep && isComplete);

        return (
          <div key={step.number} className="flex items-center gap-4">
            <div className="relative h-8 w-8 flex-shrink-0">
              {isDone ? (
                <CheckCircle className="h-8 w-8 text-green-600" />
              ) : isActive ? (
                <div className="relative h-8 w-8">
                  <Loader className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="h-8 w-8 rounded-full border-2 border-default" />
              )}
            </div>
            <p
              className={`text-sm font-medium ${
                isActive || isDone ? "text-foreground" : "text-secondary"
              }`}
            >
              {step.text}
            </p>
          </div>
        );
      })}
    </div>
  );
}
