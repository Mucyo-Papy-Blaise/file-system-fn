import { Suspense } from "react";
import { FolderPageShell } from "@/components/folders/FolderPageShell";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ folder?: string }>;
};

export default async function MyFoldersPage({ searchParams }: PageProps) {
  const { folder } = await searchParams;

  return (
    <Suspense fallback={<LoadingSkeleton height={320} rounded="1.5rem" />}>
      <FolderPageShell
        title="My Folders"
        description="Create folders, upload files, and manage the content you own."
        initialFolderSlug={folder ?? null}
        onlyMine
      />
    </Suspense>
  );
}
