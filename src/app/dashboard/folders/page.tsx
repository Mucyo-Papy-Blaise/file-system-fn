import { Suspense } from "react";
import { FolderPageShell } from "@/components/folders/FolderPageShell";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ folder?: string }>;
};

export default async function FoldersPage({ searchParams }: PageProps) {
  const { folder } = await searchParams;

  return (
    <Suspense fallback={<LoadingSkeleton height={320} rounded="1.5rem" />}>
      <FolderPageShell
        title="Folders"
        description="Browse company folders and documents. View and download only — uploads and edits happen in My Folders."
        initialFolderSlug={folder ?? null}
        readOnly
      />
    </Suspense>
  );
}
