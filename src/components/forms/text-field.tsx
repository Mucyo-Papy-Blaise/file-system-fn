import type { TextFieldProps } from "@/types/forms";

export function TextField({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  required = false,
  autoComplete,
}: TextFieldProps) {
  const hasError = Boolean(error);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground" htmlFor={id}>
        {label} {required ? <span className="text-error">*</span> : null}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${id}-error` : undefined}
        className={`w-full rounded-md border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition ${
          hasError
            ? "border-[var(--color-error)] focus:ring-2 focus:ring-[var(--color-error)]/20"
            : "border-default focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-border-focus)]/20"
        }`}
      />
      {hasError ? (
        <p id={`${id}-error`} className="text-sm text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
