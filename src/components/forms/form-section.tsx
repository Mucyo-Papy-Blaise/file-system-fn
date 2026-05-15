import type { FormSectionProps } from "@/types/forms";

export function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <section className="space-y-4 rounded-xl border border-default bg-surface p-5">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        {description ? <p className="text-sm text-secondary">{description}</p> : null}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
