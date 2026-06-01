"use client";

import { Suspense } from "react";
import { FolderWorkspace } from "@/components/folders/FolderWorkspace";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { useAuth } from "@/lib/auth-context";

export default function FoldersPage() {
  const { user, isLoading } = useAuth();

  if (isLoading || !user) {
    return (
      <div className="space-y-6">
        <div className="space-y-3">
          <LoadingSkeleton width={260} height={32} />
          <LoadingSkeleton width="50%" height={16} />
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {[...Array(3)].map((index) => (
            <div
              key={index}
              className="space-y-4 rounded-3xl border border-default bg-surface p-6"
            >
              <LoadingSkeleton width="60%" height={20} />
              <LoadingSkeleton width="100%" height={14} />
              <LoadingSkeleton width="100%" height={14} />
              <LoadingSkeleton width="65%" height={14} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<LoadingSkeleton height={320} rounded="1.5rem" />}>
      <FolderWorkspace
        title="Folders"
        description="Browse company folders and documents. View and download only — uploads and edits happen in My Folders."
        currentUser={user}
        readOnly
      />
    </Suspense>
  );
}
