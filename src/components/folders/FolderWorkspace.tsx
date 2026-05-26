"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FolderPlus,
  FolderSearch,
  Plus,
  Upload as UploadIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Breadcrumb } from "@/components/folders/Breadcrumb";
import { DocumentCard } from "@/components/folders/DocumentCard";
import { FolderCard } from "@/components/folders/FolderCard";
import { DocumentDetails } from "@/components/documents/DocumentDetails";
import { DocumentPreview } from "@/components/ui/DocumentPreview";
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
  onlyMine?: boolean;
}

const NEW_FOLDER_ID = "pending-new-folder";

function getFileType(fileName: string) {
  const extension = fileName.split(".").pop()?.toLowerCase() ?? "";

  switch (extension) {
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "webp":
      return `image/${extension === "jpg" ? "jpeg" : extension}`;
    case "pdf":
      return "application/pdf";
    case "xls":
    case "xlsx":
    case "csv":
      return "application/vnd.ms-excel";
    default:
      return "application/octet-stream";
  }
}

export function FolderWorkspace({
  title,
  description,
  currentUser,
  onlyMine = false,
}: FolderWorkspaceProps) {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [pendingFolderId, setPendingFolderId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("date_desc");
  const { openUpload, setUploadFolderId } = useDashboard();

  const {
    folders: rootFolders,
    isLoading: isRootLoading,
    isError: isRootError,
  } = useGetRootFolders({ mine: onlyMine });
  const {
    folderContents,
    isLoading: isContentsLoading,
    isError: isContentsError,
  } = useGetFolderContents(currentFolderId, { mine: onlyMine });

  const { mutate: createFolder } = useCreateFolder();
  const { mutate: updateFolder } = useUpdateFolder();
  const { mutate: deleteFolder } = useDeleteFolder();
  const { mutate: updateDocument } = useUpdateDocument();
  const { mutate: deleteDocument } = useDeleteDocument();

  const isLoading = currentFolderId ? isContentsLoading : isRootLoading;
  const isError = currentFolderId ? isContentsError : isRootError;
  const isAdmin = currentUser.role === Role.ADMIN;
  const showDepartmentColumn = currentUser.role === Role.SUPER_ADMIN;
  const isInFolder = currentFolderId !== null;
  const showActions = onlyMine;

  const breadcrumbPath = useMemo(() => {
    const rootItem = { id: "root", name: title };

    if (!currentFolderId) {
      return [rootItem];
    }

    return [rootItem, ...(folderContents?.breadcrumb ?? [])];
  }, [currentFolderId, folderContents?.breadcrumb, title]);

  const currentFolderName =
    breadcrumbPath[breadcrumbPath.length - 1]?.name ?? title;
  const folders = useMemo(
    () => currentFolderId ? (folderContents?.children ?? []) : rootFolders,
    [currentFolderId, folderContents?.children, rootFolders],
  );
  const documents = useMemo(
    () => (currentFolderId ? (folderContents?.documents ?? []) : []),
    [currentFolderId, folderContents?.documents],
  );

  const placeholderFolder = useMemo(
    () =>
      pendingFolderId
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
        : null,
    [pendingFolderId, currentFolderId, currentUser.organizationId, currentUser.id, currentUser.name],
  );

  const visibleFolders = useMemo(
    () => (placeholderFolder ? [placeholderFolder, ...folders] : folders),
    [placeholderFolder, folders],
  );
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
        new Date(left.createdAt).getTime() -
        new Date(right.createdAt).getTime(),
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
            error instanceof Error
              ? error.message
              : "Unable to rename document.",
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

  const [selectedDocument, setSelectedDocument] = useState<{
    id?: string | null;
    fileName?: string | null;
    fileUrl?: string | null;
    title?: string | null;
    category?: string | { id: string; name: string } | null;
    folder?: string | { id: string; name: string } | null;
    uploadedBy?: string | { id: string; name: string } | null;
    createdAt?: string | null;
  } | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<{
    fileName?: string | null;
    fileUrl?: string | null;
  } | null>(null);

  const handleViewDocument = (documentId: string) => {
    const document = documents.find((item) => item.id === documentId);

    if (!document?.fileUrl) {
      toast.error("This document cannot be opened right now.");
      return;
    }

    setIsDetailsOpen(false);
    setPreviewDocument(document);
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

    setIsDetailsOpen(false);
    setPreviewDocument(selectedDocument);
  };

  const handleDownloadSelectedDocument = () => {
    if (!selectedDocument?.fileUrl) {
      toast.error("This document cannot be downloaded right now.");
      return;
    }

    const link = window.document.createElement("a");
    link.href = selectedDocument.fileUrl;
    link.download = selectedDocument.fileName ?? 'document.pdf';
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.click();
  };

  const itemCountLabel = `${visibleFolders.length + documents.length} ${
    visibleFolders.length + documents.length === 1 ? "item" : "items"
  }`;

  const tableGridColumns = showDepartmentColumn
    ? "grid-cols-[minmax(320px,1.8fr)_160px_160px_180px_minmax(140px,1fr)_132px]"
    : "grid-cols-[minmax(320px,1.8fr)_160px_160px_minmax(140px,1fr)_132px]";

  return (
    <div className="space-y-5">
      <header className="space-y-1">
        <h1 className="text-3xl font-semibold text-foreground">{title}</h1>
        <p className="max-w-3xl text-sm text-secondary">{description}</p>
      </header>

      <section className="border border-default bg-surface">
        <div className=" bg-[linear-gradient(180deg,rgba(248,250,252,0.98)_0%,rgba(255,255,255,0.98)_100%)] px-5 py-2">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            {showActions ? (
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => handleUploadDocument()}
                  className="inline-flex items-center justify-center gap-2 rounded border border-default bg-surface px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-[var(--color-bg-secondary)]"
                >
                  <UploadIcon className="h-4 w-4" />
                  Upload file
                </button>
                <button
                  type="button"
                  onClick={handleStartNewFolder}
                  className="inline-flex items-center rounded justify-center gap-2 bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary-hover"
                >
                  <Plus className="h-4 w-4" />
                  New folder
                </button>
              </div>
            ) : null}
          </div>
        </div>

        <div className="border-b border-default bg-[var(--color-bg-secondary)] px-5 py-3">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0 overflow-hidden border border-default bg-surface px-3 py-2">
              <Breadcrumb
                path={breadcrumbPath}
                onNavigate={handleNavigateToFolder}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-secondary">
              <span className="border border-default bg-surface px-3 py-1.5">
                {itemCountLabel}
              </span>
              <span className="border border-default bg-surface px-3 py-1.5">
                {isInFolder
                  ? "Destination ready for uploads"
                  : "Top-level workspace"}
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

              <div
                className={`grid ${tableGridColumns} gap-4 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-secondary`}
              >
                <span>Name</span>
                <span>Date modified</span>
                <span>Type</span>
                {showDepartmentColumn ? <span>Department</span> : null}
                <span>Details</span>
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
                  onUpload={showActions ? handleUploadDocument : undefined}
                  isOwner={isAdmin || folder.createdBy?.id === currentUser.id}
                  startInRenameMode={folder.id === pendingFolderId}
                  showDepartmentColumn={showDepartmentColumn}
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
                  showDepartmentColumn={showDepartmentColumn}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="p-6">
            {showActions ? (
              <EmptyState
                title={
                  isInFolder ? "This folder is empty" : "No folders or files yet"
                }
                description={
                  isInFolder
                    ? "Create a subfolder or upload documents directly here."
                    : "Start with a folder, then users can drop files into the right place."
                }
                actionLabel={isInFolder ? "Upload Files" : "Create Folder"}
                actionIcon={isInFolder ? UploadIcon : FolderPlus}
                onAction={
                  isInFolder ? () => handleUploadDocument() : handleStartNewFolder
                }
              />
            ) : (
              <div className="rounded-2xl border border-dashed border-default bg-[var(--color-bg-secondary)] p-12 text-center text-sm text-secondary">
                <h2 className="text-lg font-semibold text-foreground">No folders or files</h2>
                <p className="mt-2">There are no folders or files to display.</p>
              </div>
            )}
          </div>
        )}
      </section>

      <DocumentDetails
        key={selectedDocument?.id ?? 'no-document'}
        document={selectedDocument}
        isOpen={isDetailsOpen}
        onClose={handleCloseDocumentDetails}
        onOpen={handleOpenSelectedDocument}
        onDownload={handleDownloadSelectedDocument}
      />

      <DocumentPreview
        isOpen={Boolean(previewDocument?.fileUrl)}
        onClose={() => setPreviewDocument(null)}
        fileUrl={previewDocument?.fileUrl ?? ""}
        fileName={previewDocument?.fileName ?? ""}
        fileType={previewDocument?.fileName ? getFileType(previewDocument.fileName) : "application/octet-stream"}
      />
    </div>
  );
}
