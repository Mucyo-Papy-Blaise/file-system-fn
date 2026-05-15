import type { FileUploadFieldProps } from "@/types/forms";

export function FileUploadField({
  id,
  label,
  file,
  onChange,
  error,
  required = false,
}: FileUploadFieldProps) {
  const hasError = Boolean(error);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground" htmlFor={id}>
        {label} {required ? <span className="text-error">*</span> : null}
      </label>

      <label
        htmlFor={id}
        className={`flex cursor-pointer items-center justify-between rounded-md border bg-background px-3 py-2.5 transition ${
          hasError ? "border-[var(--color-error)]" : "border-default hover:border-[var(--color-border-focus)]"
        }`}
      >
        <span className={`truncate text-sm ${file ? "text-foreground" : "text-muted"}`}>
          {file ? file.name : "Choose logo image (PNG, JPG, SVG)"}
        </span>
        <span className="rounded-md bg-primary-subtle px-2.5 py-1 text-xs font-medium text-primary">
          Upload
        </span>
      </label>

      <input
        id={id}
        name={id}
        type="file"
        accept="image/png,image/jpeg,image/svg+xml"
        className="sr-only"
        onChange={(event) => onChange(event.target.files?.[0] ?? null)}
      />

      {hasError ? <p className="text-sm text-error">{error}</p> : null}
    </div>
  );
}
