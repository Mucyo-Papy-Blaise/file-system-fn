"use client";

import { FolderWorkspace } from "@/components/folders/FolderWorkspace";
import { useAuth } from "@/lib/auth-context";
import { mockDocuments, mockFolders } from "@/lib/mockData";

export default function FoldersPage() {
  const { user } = useAuth();

  return (
    <FolderWorkspace
      scope="company"
      title="Folders"
      description="Browse every folder and document uploaded across the company."
      initialFolders={mockFolders}
      initialDocuments={mockDocuments}
      currentUserName={user?.name ?? "Current User"}
    />
  );
}
