"use client";

import { FolderWorkspace } from "@/components/folders/FolderWorkspace";
import { useAuth } from "@/lib/auth-context";
import { mockDocuments, mockFolders } from "@/lib/mockData";

export default function MyFoldersPage() {
  const { user } = useAuth();

  return (
    <FolderWorkspace
      scope="personal"
      title="My Folders"
      description="Manage only the folders you created and the documents you uploaded."
      initialFolders={mockFolders}
      initialDocuments={mockDocuments}
      currentUserName={user?.name ?? "Current User"}
    />
  );
}
