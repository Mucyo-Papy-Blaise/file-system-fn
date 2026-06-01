"use client";

import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import { useGetRecentDocuments } from "@/lib/hooks/useAnalytics";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { Badge } from "@/components/ui/Badge";

export function RecentDocumentsWidget() {
  const { data, isLoading, isError } = useGetRecentDocuments();

  return (
    <DashboardCard
      title="Recent documents"
      description="Latest uploads in your scope"
      action={
        <Link
          href="/dashboard/documents"
          className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition hover:text-primary-hover"
        >
          View all
          <ArrowRight className="h-4 w-4" />
        </Link>
      }
    >
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <LoadingSkeleton key={index} height={52} rounded="1rem" />
          ))}
        </div>
      ) : isError || !data ? (
        <p className="text-sm text-error">Failed to load documents.</p>
      ) : data.length === 0 ? (
        <p className="rounded-xl border border-dashed border-default bg-[var(--color-bg-secondary)]/60 px-4 py-8 text-center text-sm text-secondary">
          No documents yet. Upload your first file to get started.
        </p>
      ) : (
        <ul className="divide-y divide-default">
          {data.map((doc) => (
            <li key={doc.id}>
              <div className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-bg-secondary)] text-primary">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {doc.title?.trim() || doc.fileName}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-secondary">
                    {doc.uploadedBy} ·{" "}
                    {new Date(doc.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                {doc.category ? (
                  <Badge label={doc.category} variant="category" />
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </DashboardCard>
  );
}
