"use client";

import { FolderWorkspace } from "@/components/folders/FolderWorkspace";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { useAuth } from "@/lib/auth-context";
import type { AuthUser } from "@/types/auth";

interface FolderPageShellProps {
  title: string;
  description: string;
  initialFolderSlug?: string | null;
  onlyMine?: boolean;
  readOnly?: boolean;
}

function FolderPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <LoadingSkeleton width={260} height={32} />
        <LoadingSkeleton width="50%" height={16} />
      </div>
      <div className="overflow-hidden rounded-2xl border border-default bg-surface">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="mx-4 my-3">
            <LoadingSkeleton height={64} rounded="1rem" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function FolderPageShell({
  title,
  description,
  initialFolderSlug = null,
  onlyMine = false,
  readOnly = false,
}: FolderPageShellProps) {
  const { user, isLoading } = useAuth();

  if (isLoading || !user) {
    return <FolderPageSkeleton />;
  }

  return (
    <FolderWorkspace
      title={title}
      description={description}
      currentUser={user as AuthUser}
      initialFolderSlug={initialFolderSlug}
      onlyMine={onlyMine}
      readOnly={readOnly}
    />
  );
}
