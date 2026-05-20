"use client";

import { useEffect, useMemo, useState } from "react";
import { FolderPlus, FolderSearch, Plus, Upload as UploadIcon } from "lucide-react";
import { toast } from "sonner";
import { Breadcrumb } from "@/components/folders/Breadcrumb";
import { DocumentCard } from "@/components/folders/DocumentCard";
import { FolderCard } from "@/components/folders/FolderCard";
import { DocumentDetails } from "@/components/documents/DocumentDetails";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { SortBar } from "@/components/ui/SortBar";
import { useDashboard } from "@/lib/dashboard-context";
import { useDeleteDocument, useUpdateDocument } from "@/lib/hooks/useDocuments";
import {
  useCreateFolder,
  useDeleteFolder,
  useGetFolderContents,
  useGetRootFolders,
  useUpdateFolder,
} from "@/lib/hooks/useFolders";
import type { AuthUser } from "@/types/auth";
import type { SortOption } from "@/types/document";
import { Role } from "@/types/enum";

interface FolderWorkspaceProps {
  title: string;
  description: string;
  currentUser: AuthUser;
}

const NEW_FOLDER_ID = "pending-new-folder";

export function FolderWorkspace({
  title,
  description,
  currentUser,
}: FolderWorkspaceProps) {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [pendingFolderId, setPendingFolderId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("date_desc");
  const { openUpload, setUploadFolderId } = useDashboard();

  const {
    folders: rootFolders,
    isLoading: isRootLoading,
    isError: isRootError,
  } = useGetRootFolders();
  const {
    folderContents,
    isLoading: isContentsLoading,
    isError: isContentsError,
  } = useGetFolderContents(currentFolderId);

  const { mutate: createFolder } = useCreateFolder();
  const { mutate: updateFolder } = useUpdateFolder();
  const { mutate: deleteFolder } = useDeleteFolder();
  const { mutate: updateDocument } = useUpdateDocument();
  const { mutate: deleteDocument } = useDeleteDocument();

  const isLoading = currentFolderId ? isContentsLoading : isRootLoading;
  const isError = currentFolderId ? isContentsError : isRootError;
  const isAdmin = currentUser.role === Role.ADMIN;
  const isInFolder = currentFolderId !== null;

  const breadcrumbPath = useMemo(() => {
    const rootItem = { id: "root", name: title };

    if (!currentFolderId) {
      return [rootItem];
    }

    return [rootItem, ...(folderContents?.breadcrumb ?? [])];
  }, [currentFolderId, folderContents?.breadcrumb, title]);

  const currentFolderName = breadcrumbPath[breadcrumbPath.length - 1]?.name ?? title;
  const folders = currentFolderId ? folderContents?.children ?? [] : rootFolders;
  const documents = currentFolderId ? folderContents?.documents ?? [] : [];

  const placeholderFolder = pendingFolderId
    ? {
        id: NEW_FOLDER_ID,
        name: "New Folder",
        slug: "new-folder",
        parentId: currentFolderId,
        organizationId: currentUser.organizationId,
        itemCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: { id: currentUser.id, name: currentUser.name },
      }
    : null;

  const visibleFolders = placeholderFolder ? [placeholderFolder, ...folders] : folders;
  const sortedFolders = useMemo(() => {
    const items = [...visibleFolders];

    if (sortBy === "name_asc" || sortBy === "name_desc") {
      items.sort((left, right) => left.name.localeCompare(right.name));
      if (sortBy === "name_desc") {
        items.reverse();
      }
      return items;
    }

    items.sort(
      (left, right) =>
        new Date(left.createdAt ?? left.updatedAt).getTime() -
        new Date(right.createdAt ?? right.updatedAt).getTime(),
    );

    if (sortBy === "date_desc") {
      items.reverse();
    }

    return items;
  }, [sortBy, visibleFolders]);
  const sortedDocuments = useMemo(() => {
    const items = [...documents];

    if (sortBy === "name_asc" || sortBy === "name_desc") {
      items.sort((left, right) => left.fileName.localeCompare(right.fileName));
      if (sortBy === "name_desc") {
        items.reverse();
      }
      return items;
    }

    items.sort(
      (left, right) =>
        new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime(),
    );

    if (sortBy === "date_desc") {
      items.reverse();
    }

    return items;
  }, [documents, sortBy]);
  const hasContent = visibleFolders.length > 0 || documents.length > 0;

  useEffect(() => {
    setUploadFolderId(currentFolderId);
  }, [currentFolderId, setUploadFolderId]);

  const handleUploadDocument = (folderId?: string | null) => {
    openUpload(folderId ?? currentFolderId);
  };

  const handleNavigateToFolder = (folderId: string) => {
    setCurrentFolderId(folderId === "root" ? null : folderId);
  };

  const handleOpenFolder = (folderId: string) => {
    if (folderId === pendingFolderId) {
      return;
    }

    setCurrentFolderId(folderId);
  };

  const handleStartNewFolder = () => {
    if (pendingFolderId) {
      return;
    }

    setPendingFolderId(NEW_FOLDER_ID);
  };

  const handleCreateFolder = (name: string) => {
    createFolder(
      { name, parentId: currentFolderId },
      {
        onSuccess: () => {
          toast.success("Folder created successfully");
          setPendingFolderId(null);
        },
        onError: (error) => {
          toast.error(
            error instanceof Error ? error.message : "Unable to create folder.",
          );
        },
      },
    );
  };

  const handleRenameFolder = (folderId: string, newName: string) => {
    if (folderId === pendingFolderId) {
      return;
    }

    updateFolder(
      { id: folderId, data: { name: newName } },
      {
        onSuccess: () => toast.success("Folder renamed successfully"),
        onError: (error) => {
          toast.error(
            error instanceof Error ? error.message : "Unable to rename folder.",
          );
        },
      },
    );
  };

  const handleRenameComplete = (folderId: string, finalName: string) => {
    if (folderId === pendingFolderId) {
      handleCreateFolder(finalName);
    }
  };

  const handleDeleteFolder = (folderId: string) => {
    deleteFolder(folderId, {
      onSuccess: () => {
        toast.success("Folder deleted successfully");
        if (currentFolderId === folderId) {
          setCurrentFolderId(null);
        }
      },
      onError: (error) => {
        toast.error(
          error instanceof Error ? error.message : "Unable to delete folder.",
        );
      },
    });
  };

  const handleRenameDocument = (documentId: string, newName: string) => {
    updateDocument(
      { id: documentId, data: { title: newName } },
      {
        onSuccess: () => toast.success("Document renamed successfully"),
        onError: (error) => {
          toast.error(
            error instanceof Error ? error.message : "Unable to rename document.",
          );
        },
      },
    );
  };

  const handleDeleteDocument = (documentId: string) => {
    deleteDocument(documentId, {
      onSuccess: () => toast.success("Document deleted successfully"),
      onError: (error) => {
        toast.error(
          error instanceof Error ? error.message : "Unable to delete document.",
        );
      },
    });
  };

  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleViewDocument = (documentId: string) => {
    const document = documents.find((item) => item.id === documentId);

    if (!document?.fileUrl) {
      toast.error("This document cannot be opened right now.");
      return;
    }

    window.open(document.fileUrl, "_blank", "noopener,noreferrer");
  };

  const handleDownloadDocument = (documentId: string) => {
    const document = documents.find((item) => item.id === documentId);

    if (!document?.fileUrl) {
      toast.error("This document cannot be downloaded right now.");
      return;
    }

    const link = window.document.createElement("a");
    link.href = document.fileUrl;
    link.download = document.fileName;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.click();
  };

  const handleOpenDocumentDetails = (documentId: string) => {
    const document = documents.find((item) => item.id === documentId);

    if (!document) {
      toast.error("Document details are not available.");
      return;
    }

    const documentWithFolder = {
      ...document,
      folder:
        document.folder ||
        (currentFolderId
          ? { id: currentFolderId, name: currentFolderName }
          : undefined),
    };

    setSelectedDocument(documentWithFolder);
    setIsDetailsOpen(true);
  };

  const handleCloseDocumentDetails = () => {
    setIsDetailsOpen(false);
  };

  const handleOpenSelectedDocument = () => {
    if (!selectedDocument?.fileUrl) {
      return;
    }

    window.open(selectedDocument.fileUrl, "_blank", "noopener,noreferrer");
  };

  const handleDownloadSelectedDocument = () => {
    if (!selectedDocument?.fileUrl) {
      toast.error("This document cannot be downloaded right now.");
      return;
    }

    const link = window.document.createElement("a");
    link.href = selectedDocument.fileUrl;
    link.download = selectedDocument.fileName;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.click();
  };

  const itemCountLabel = `${visibleFolders.length + documents.length} ${
    visibleFolders.length + documents.length === 1 ? "item" : "items"
  }`;

  return (
    <div className="space-y-5">
      <header className="space-y-1">
        <h1 className="text-3xl font-semibold text-foreground">{title}</h1>
        <p className="max-w-3xl text-sm text-secondary">{description}</p>
      </header>

      <section className="border border-default bg-surface">
        <div className="border-b border-default bg-[linear-gradient(180deg,rgba(248,250,252,0.98)_0%,rgba(255,255,255,0.98)_100%)] px-5 py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-default bg-[var(--color-bg-secondary)] px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-secondary">
                <FolderSearch className="h-3.5 w-3.5" />
                File Explorer
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-semibold text-foreground">{currentFolderName}</h2>
                <p className="text-sm text-secondary">
                  {isInFolder
                    ? "Manage files inside this folder with inline rename and quick actions."
                    : "Browse company folders in a desktop-style details view."}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => handleUploadDocument()}
                className="inline-flex items-center justify-center gap-2 border border-default bg-surface px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-[var(--color-bg-secondary)]"
              >
                <UploadIcon className="h-4 w-4" />
                Upload file
              </button>
              <button
                type="button"
                onClick={handleStartNewFolder}
                className="inline-flex items-center justify-center gap-2 bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary-hover"
              >
                <Plus className="h-4 w-4" />
                New folder
              </button>
            </div>
          </div>
        </div>

        <div className="border-b border-default bg-[var(--color-bg-secondary)] px-5 py-3">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0 overflow-hidden border border-default bg-surface px-3 py-2">
              <Breadcrumb path={breadcrumbPath} onNavigate={handleNavigateToFolder} />
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-secondary">
              <span className="border border-default bg-surface px-3 py-1.5">
                {itemCountLabel}
              </span>
              <span className="border border-default bg-surface px-3 py-1.5">
                {isInFolder ? "Destination ready for uploads" : "Top-level workspace"}
              </span>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <LoadingSkeleton key={index} height={64} rounded="1rem" />
            ))}
          </div>
        ) : isError ? (
          <div className="p-6">
            <EmptyState
              title="Unable to load folders"
              description="Please refresh the page or try again later."
              actionLabel="Reload"
              onAction={() => window.location.reload()}
            />
          </div>
        ) : hasContent ? (
          <div className="overflow-x-auto overflow-y-visible">
            <div className="min-w-[1080px]">
              <div className="px-4 py-4">
                <SortBar sortBy={sortBy} onChange={setSortBy} />
              </div>

              <div className="grid grid-cols-[minmax(320px,1.8fr)_180px_180px_160px_184px] gap-4 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-secondary">
                <span>Name</span>
                <span>Date modified</span>
                <span>Type</span>
                <span>{documents.length > 0 ? "Category" : "Items"}</span>
                <span className="text-right">Actions</span>
              </div>

              {sortedFolders.map((folder) => (
                <FolderCard
                  key={folder.id}
                  folder={folder}
                  onOpen={handleOpenFolder}
                  onRename={handleRenameFolder}
                  onRenameComplete={handleRenameComplete}
                  onDelete={handleDeleteFolder}
                  onUpload={handleUploadDocument}
                  isOwner={isAdmin || folder.createdBy?.id === currentUser.id}
                  startInRenameMode={folder.id === pendingFolderId}
                />
              ))}

              {sortedDocuments.map((document) => (
                <DocumentCard
                  key={document.id}
                  document={{
                    ...document,
                    category:
                      typeof document.category === "string"
                        ? document.category
                        : document.category?.name,
                  }}
                  onDelete={handleDeleteDocument}
                  onView={handleViewDocument}
                  onDetails={handleOpenDocumentDetails}
                  onDownload={handleDownloadDocument}
                  onRename={handleRenameDocument}
                  isOwner={isAdmin || document.uploadedBy === currentUser.name}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="p-6">
            <EmptyState
              title={isInFolder ? "This folder is empty" : "No folders or files yet"}
              description={
                isInFolder
                  ? "Create a subfolder or upload documents directly here."
                  : "Start with a folder, then users can drop files into the right place."
              }
              actionLabel={isInFolder ? "Upload Files" : "Create Folder"}
              actionIcon={isInFolder ? UploadIcon : FolderPlus}
              onAction={isInFolder ? () => handleUploadDocument() : handleStartNewFolder}
            />
          </div>
        )}
      </section>

      <DocumentDetails
        document={selectedDocument}
        isOpen={isDetailsOpen}
        onClose={handleCloseDocumentDetails}
        onOpen={handleOpenSelectedDocument}
        onDownload={handleDownloadSelectedDocument}
      />
    </div>
  );
}
