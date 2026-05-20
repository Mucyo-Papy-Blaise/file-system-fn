"use client";

import { useMemo, useState } from "react";
import { CheckCircle, RefreshCcw } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { InboxDocumentCard } from "@/components/documents/InboxDocumentCard";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { SortBar } from "@/components/ui/SortBar";
import { useGetInbox } from "@/lib/hooks/useDocuments";
import type { SortOption } from "@/types/document";

export default function DashboardInboxPage() {
  const { documents, isLoading } = useGetInbox();
  const [sortBy, setSortBy] = useState<SortOption>("date_desc");
  const sortedDocuments = useMemo(() => {
    const items = [...documents];

    if (sortBy === "name_asc" || sortBy === "name_desc") {
      items.sort((left, right) => left.fileName.localeCompare(right.fileName));
      if (sortBy === "name_desc") {
        items.reverse();
      }
      return items;
    }

    items.sort(
      (left, right) =>
        new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime(),
    );

    if (sortBy === "date_desc") {
      items.reverse();
    }

    return items;
  }, [documents, sortBy]);

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Inbox</h1>
          <p className="mt-1 text-sm text-secondary">
            Uncategorized files waiting to be organized.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="rounded-3xl bg-surface px-4 py-3 text-sm text-foreground shadow-sm">
            <p className="text-xs uppercase tracking-[0.18em] text-secondary">Inbox count</p>
            <p className="mt-1 text-lg font-semibold text-foreground">{documents.length}</p>
          </div>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 rounded-2xl border border-default bg-background px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-[var(--color-bg-secondary)]"
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      <SortBar sortBy={sortBy} onChange={setSortBy} />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="space-y-4">
              <LoadingSkeleton height={180} rounded="1.5rem" />
            </div>
          ))}
        </div>
      ) : documents.length === 0 ? (
        <EmptyState
          title="Inbox is empty"
          description="Your inbox is empty. All files are organized!"
          actionLabel="View documents"
          onAction={() => window.location.assign("/dashboard/documents")}
          actionIcon={CheckCircle}
        />
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {sortedDocuments.map((document) => (
            <InboxDocumentCard key={document.id} document={document} />
          ))}
        </div>
      )}
    </div>
  );
}
