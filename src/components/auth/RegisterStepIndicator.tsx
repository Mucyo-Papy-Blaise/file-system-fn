interface RegisterStepIndicatorProps {
  currentStep: 1 | 2;
}

const steps = [
  { id: 1, label: "Organization" },
  { id: 2, label: "Admin Account" },
] as const;

export function RegisterStepIndicator({
  currentStep,
}: RegisterStepIndicatorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        {steps.map((step) => {
          const isActive = step.id === currentStep;
          const isComplete = step.id < currentStep;

          return (
            <div key={step.id} className="flex min-w-0 items-center gap-3">
              <div
                className={[
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[10px] font-semibold transition-colors",
                  isActive || isComplete
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-default bg-background text-muted",
                ].join(" ")}
              >
                {step.id}
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                  Step {step.id}
                </p>
                <p
                  className={[
                    "text-[12px] font-medium",
                    isActive || isComplete ? "text-foreground" : "text-muted",
                  ].join(" ")}
                >
                  {step.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="h-1 rounded-full bg-[var(--color-bg-tertiary)]">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: currentStep === 1 ? "50%" : "100%" }}
        />
      </div>
    </div>
  );
}
