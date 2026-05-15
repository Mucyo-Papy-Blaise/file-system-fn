"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Breadcrumb } from "@/components/folders/Breadcrumb";
import { DocumentCard } from "@/components/folders/DocumentCard";
import { FolderCard } from "@/components/folders/FolderCard";
import { EmptyState } from "@/components/ui/EmptyState";
import type { MockDocument, MockFolder } from "@/lib/mockData";
import { usePathname } from "next/navigation";

const COMPANY_ROOT_ID = "f-root";
const PERSONAL_ROOT_ID = "my-folders-root";

interface BreadcrumbItem {
  id: string;
  name: string;
}

interface FolderWorkspaceProps {
  scope: "company" | "personal";
  title: string;
  description: string;
  initialFolders: MockFolder[];
  initialDocuments: MockDocument[];
  currentUserName: string;
}

export function FolderWorkspace({
  scope,
  title,
  description,
  initialFolders,
  initialDocuments,
  currentUserName,
}: FolderWorkspaceProps) {
  const pathname = usePathname();
  const rootId = scope === "company" ? COMPANY_ROOT_ID : PERSONAL_ROOT_ID;
  const [currentFolderId, setCurrentFolderId] = useState<string>(rootId);
  const [folders, setFolders] = useState<MockFolder[]>(initialFolders);
  const [documents, setDocuments] = useState<MockDocument[]>(initialDocuments);
  const [pendingFolderId, setPendingFolderId] = useState<string | null>(null);

  const isFoldersRootPage = pathname === "/dashboard/folders";

  const ownedFolders = useMemo(
    () => folders.filter((folder) => folder.createdBy === currentUserName),
    [currentUserName, folders],
  );
  const ownedDocuments = useMemo(
    () =>
      documents.filter((document) => document.uploadedBy === currentUserName),
    [currentUserName, documents],
  );
  const ownedFolderIds = useMemo(
    () => new Set(ownedFolders.map((folder) => folder.id)),
    [ownedFolders],
  );

  const breadcrumbPath = useMemo(() => {
    if (scope === "company") {
      const path: BreadcrumbItem[] = [];
      let activeId: string | null = currentFolderId;

      while (activeId) {
        const folder = folders.find((item) => item.id === activeId);
        if (!folder) break;

        path.unshift({ id: folder.id, name: folder.name });
        activeId = folder.parentId;
      }

      return path;
    }

    if (currentFolderId === PERSONAL_ROOT_ID) {
      return [{ id: PERSONAL_ROOT_ID, name: "My Folders" }];
    }

    const path: BreadcrumbItem[] = [];
    let activeId: string | null = currentFolderId;

    while (activeId && ownedFolderIds.has(activeId)) {
      const folder = folders.find((item) => item.id === activeId);
      if (!folder) break;

      path.unshift({ id: folder.id, name: folder.name });
      activeId =
        folder.parentId && ownedFolderIds.has(folder.parentId)
          ? folder.parentId
          : null;
    }

    return [{ id: PERSONAL_ROOT_ID, name: "My Folders" }, ...path];
  }, [currentFolderId, folders, ownedFolderIds, scope]);

  const folderContents = useMemo(() => {
    if (scope === "company") {
      return {
        folders: folders.filter(
          (folder) => folder.parentId === currentFolderId,
        ),
        documents: documents.filter(
          (document) => document.folderId === currentFolderId,
        ),
      };
    }

    if (currentFolderId === PERSONAL_ROOT_ID) {
      return {
        folders: ownedFolders.filter(
          (folder) => !folder.parentId || !ownedFolderIds.has(folder.parentId),
        ),
        documents: ownedDocuments.filter(
          (document) =>
            !document.folderId || !ownedFolderIds.has(document.folderId),
        ),
      };
    }

    return {
      folders: ownedFolders.filter(
        (folder) => folder.parentId === currentFolderId,
      ),
      documents: ownedDocuments.filter(
        (document) => document.folderId === currentFolderId,
      ),
    };
  }, [
    currentFolderId,
    documents,
    folders,
    ownedDocuments,
    ownedFolderIds,
    ownedFolders,
    scope,
  ]);

  const handleNavigateToFolder = (folderId: string) => {
    setCurrentFolderId(folderId);
  };

  const getTargetParentId = () =>
    scope === "personal" && currentFolderId === PERSONAL_ROOT_ID
      ? COMPANY_ROOT_ID
      : currentFolderId;

  const getNextNewFolderName = () => {
    const visibleFolderNames = new Set(
      folderContents.folders.map((folder) => folder.name.toLowerCase()),
    );

    if (!visibleFolderNames.has("new folder")) {
      return "New Folder";
    }

    let copyNumber = 1;
    while (visibleFolderNames.has(`new folder (${copyNumber})`)) {
      copyNumber += 1;
    }

    return `New Folder (${copyNumber})`;
  };

  const handleStartNewFolder = () => {
    if (pendingFolderId) {
      return;
    }

    const newFolderId = `f-${Date.now()}`;
    const newFolder: MockFolder = {
      id: newFolderId,
      name: getNextNewFolderName(),
      parentId: getTargetParentId(),
      itemCount: 0,
      createdBy: currentUserName,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setFolders((currentFolders) => [...currentFolders, newFolder]);
    setPendingFolderId(newFolderId);
  };

  const handleRenameFolder = (folderId: string, newName: string) => {
    const folder = folders.find((item) => item.id === folderId);
    if (!folder || folder.createdBy !== currentUserName) {
      toast.error("You can only rename your own folders");
      return;
    }

    setFolders((currentFolders) =>
      currentFolders.map((item) =>
        item.id === folderId ? { ...item, name: newName } : item,
      ),
    );

    if (folderId === pendingFolderId) {
      return;
    }

    toast.success("Folder renamed successfully");
  };

  const handleRenameComplete = (folderId: string, finalName: string) => {
    if (folderId !== pendingFolderId) {
      return;
    }

    setPendingFolderId(null);
    toast.success(`Folder "${finalName}" created successfully`);
  };

  const handleDeleteFolder = (folderId: string) => {
    const folderToDelete = folders.find((folder) => folder.id === folderId);
    if (!folderToDelete || folderToDelete.createdBy !== currentUserName) {
      toast.error("You can only delete your own folders");
      return;
    }

    const isEmptyFolder =
      folders.filter((folder) => folder.parentId === folderId).length === 0 &&
      documents.filter((document) => document.folderId === folderId).length ===
        0;

    if (!isEmptyFolder) {
      toast.error("Can only delete empty folders");
      return;
    }

    setFolders((currentFolders) =>
      currentFolders.filter((folder) => folder.id !== folderId),
    );

    if (folderId === pendingFolderId) {
      setPendingFolderId(null);
    }

    toast.success(`Folder "${folderToDelete.name}" deleted successfully`);
  };

  const handleDeleteDocument = (documentId: string) => {
    const documentToDelete = documents.find(
      (document) => document.id === documentId,
    );
    if (!documentToDelete || documentToDelete.uploadedBy !== currentUserName) {
      toast.error("You can only delete your own documents");
      return;
    }

    setDocuments((currentDocuments) =>
      currentDocuments.filter((document) => document.id !== documentId),
    );
    toast.success(
      `Document "${documentToDelete.fileName}" deleted successfully`,
    );
  };

  const hasContent =
    folderContents.folders.length > 0 || folderContents.documents.length > 0;

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
        <p className="text-sm text-secondary">{description}</p>
      </header>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <Breadcrumb
            path={breadcrumbPath}
            onNavigate={handleNavigateToFolder}
          />
        </div>

        <div className="flex gap-2">
          {!isFoldersRootPage && (
            <>
              <button
                onClick={handleStartNewFolder}
                className="inline-flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-opacity-90"
              >
                <Plus className="h-4 w-4" />
                New Folder
              </button>
            </>
          )}
        </div>
      </div>

      {hasContent ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {folderContents.folders.map((folder) => (
            <FolderCard
              key={folder.id}
              folder={folder}
              onOpen={handleNavigateToFolder}
              onRename={handleRenameFolder}
              onRenameComplete={handleRenameComplete}
              onDelete={handleDeleteFolder}
              isOwner={folder.createdBy === currentUserName}
              startInRenameMode={folder.id === pendingFolderId}
            />
          ))}

          {folderContents.documents.map((document) => (
            <DocumentCard
              key={document.id}
              document={document}
              onDelete={handleDeleteDocument}
              isOwner={document.uploadedBy === currentUserName}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title={`No ${scope === "company" ? "folders or documents" : "personal folders or documents"}`}
          description={
            currentFolderId === rootId
              ? scope === "company"
                ? "This company workspace has no folders or documents yet."
                : "Your personal workspace is empty. Create a folder or upload a document you own."
              : "This folder is empty. Create a new folder or upload documents."
          }
          actionLabel="Create Folder"
          onAction={handleStartNewFolder}
        />
      )}
    </div>
  );
}
