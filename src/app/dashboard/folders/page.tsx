"use client";

import { FolderWorkspace } from "@/components/folders/FolderWorkspace";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { useAuth } from "@/lib/auth-context";

export default function FoldersPage() {
  const { user, isLoading } = useAuth();

  if (isLoading || !user) {
    return (
      <div className="space-y-6 p-6">
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
    <FolderWorkspace
      title="Folders"
      description="Browse every folder and document uploaded across the company."
      currentUser={user}
      onlyMine={false}
    />
  );
}
