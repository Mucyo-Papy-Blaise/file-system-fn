"use client";

import Link from "next/link";
import { ArrowRight, Folder } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useGetRecentFolders } from "@/lib/hooks/useAnalytics";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";

export function RecentFoldersGrid() {
  const { isOwner, isBranchManager, isDeptManager } = useAuth();
  const { data, isLoading, isError } = useGetRecentFolders();

  const foldersHref =
    isOwner || isBranchManager || isDeptManager
      ? "/dashboard/folders"
      : "/dashboard/my-folders";

  return (
    <DashboardCard
      title="Recent folders"
      description="Newly created folders"
      action={
        <Link
          href={foldersHref}
          className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition hover:text-primary-hover"
        >
          View all
          <ArrowRight className="h-4 w-4" />
        </Link>
      }
    >
      {isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <LoadingSkeleton key={index} height={88} rounded="1rem" />
          ))}
        </div>
      ) : isError || !data ? (
        <p className="text-sm text-error">Failed to load folders.</p>
      ) : data.length === 0 ? (
        <p className="rounded-xl border border-dashed border-default bg-[var(--color-bg-secondary)]/60 px-4 py-8 text-center text-sm text-secondary">
          No folders yet. Create one from My Folders.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {data.map((folder) => (
            <Link
              key={folder.id}
              href={foldersHref}
              className="group flex gap-3 rounded-xl border border-default bg-[var(--color-bg-secondary)]/50 p-4 transition hover:border-primary/30 hover:bg-[var(--color-primary-subtle)]/30"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface text-primary shadow-sm transition group-hover:bg-primary group-hover:text-primary-foreground">
                <Folder className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">
                  {folder.name}
                </p>
                <p className="mt-1 text-xs text-secondary">
                  {folder.documentCount}{" "}
                  {folder.documentCount === 1 ? "document" : "documents"}
                </p>
                <p className="mt-2 text-xs text-muted">
                  {folder.createdBy} ·{" "}
                  {new Date(folder.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </DashboardCard>
  );
}
