import { AlertTriangle } from "lucide-react";

export function NoSetupBanner() {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-amber-900 shadow-sm">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
        <AlertTriangle className="h-5 w-5" />
      </div>
      <p className="text-sm leading-6">
        Your organization has no categories yet. Please contact your Admin to
        set up categories before uploading documents.
      </p>
    </div>
  );
}
