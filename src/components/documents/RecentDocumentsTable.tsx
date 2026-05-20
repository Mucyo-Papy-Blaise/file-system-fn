"use client";

import Link from "next/link";
import { useGetDocuments } from "@/lib/hooks/useDocuments";
import { DocumentCard } from "./DocumentCard";

export function RecentDocumentsTable() {
  const { documents, isLoading } = useGetDocuments({ limit: 5, page: 1 });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-2xl bg-[var(--color-bg-secondary)]"
          />
        ))}
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-default bg-[var(--color-bg-secondary)] p-8 text-center">
        <p className="text-sm text-secondary">No documents uploaded yet</p>
        <Link href="/documents">
          <button className="mt-2 text-sm text-primary hover:underline">
            Go to Documents
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {documents.map((doc) => (
        <DocumentCard key={doc.id} document={doc} />
      ))}
      {documents.length > 0 && (
        <Link href="/documents">
          <button className="w-full rounded-2xl border border-default bg-surface px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-[var(--color-bg-secondary)]">
            View All Documents
          </button>
        </Link>
      )}
    </div>
  );
}
