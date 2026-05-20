"use client";

import { useState, type ReactNode } from "react";
import { ExternalLink, Eye, FileImage, FileSpreadsheet, FileText, MoreHorizontal, Download } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DocumentPreview } from "@/components/ui/DocumentPreview";
import type { Document } from "@/types/document";

interface DashboardDocumentRowProps {
  document: Document;
  onDetails: (document: Document) => void;
  onOpen: (document: Document) => void;
  onDownload: (document: Document) => void;
  extraAction?: ReactNode;
}

function getFileMeta(fileName: string) {
  const extension = fileName.split(".").pop()?.toLowerCase() ?? "";

  switch (extension) {
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "webp":
      return { 
        icon: <FileImage className="h-4 w-4 text-sky-600" />, 
        label: "Image",
        mimeType: `image/${extension === "jpg" ? "jpeg" : extension}`,
      };
    case "xls":
    case "xlsx":
    case "csv":
      return { 
        icon: <FileSpreadsheet className="h-4 w-4 text-emerald-600" />, 
        label: "Spreadsheet",
        mimeType: "application/vnd.ms-excel",
      };
    case "pdf":
      return { 
        icon: <FileText className="h-4 w-4 text-red-600" />, 
        label: "PDF",
        mimeType: "application/pdf",
      };
    default:
      return { 
        icon: <FileText className="h-4 w-4 text-slate-600" />, 
        label: extension ? extension.toUpperCase() : "File",
        mimeType: "application/octet-stream",
      };
  }
}

function getOwnerName(document: Document) {
  if (document.documentOwner?.trim()) {
    return document.documentOwner;
  }

  const uploadedBy = document.uploadedBy;
  return typeof uploadedBy === "string"
    ? uploadedBy
    : uploadedBy?.name ?? "Unknown";
}

export function DashboardDocumentRow({ document, onDetails, onOpen, onDownload, extraAction }: DashboardDocumentRowProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  const fileMeta = getFileMeta(document.fileName);
  const ownerName = getOwnerName(document);
  const formattedDate = new Date(document.updatedAt || document.createdAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      <div className="grid items-center gap-4 border-b border-default px-4 py-4 text-sm text-foreground md:grid-cols-[2.5fr_1fr_1fr_1fr_auto]">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--color-bg-secondary)]">
            {fileMeta.icon}
          </div>
          <div className="min-w-0">
            <button
              type="button"
              onClick={() => onDetails(document)}
              className="w-full truncate text-left text-sm font-semibold text-foreground transition hover:text-primary"
            >
              {document.title || document.fileName}
            </button>
            <p className="mt-1 truncate text-xs text-secondary">
              {document.folder?.name ?? "No folder"}
            </p>
          </div>
        </div>

        <div className="truncate text-secondary">{ownerName}</div>
        <div className="truncate text-secondary">{formattedDate}</div>
        <div className="flex items-center gap-2 truncate text-secondary">
          <span className="inline-flex rounded-full bg-[var(--color-bg-secondary)] px-2 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-secondary">
            {document.category?.name ?? "Uncategorized"}
          </span>
        </div>
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => onOpen(document)}
            className="rounded-full border border-default bg-surface px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-[var(--color-bg-secondary)]"
          >
            Open
          </button>
          {extraAction ?? (
            <DropdownMenu>
              <DropdownMenuTrigger
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-default bg-surface text-secondary transition hover:bg-[var(--color-bg-secondary)]"
                ariaLabel={`Document actions for ${document.title || document.fileName}`}
              >
                <MoreHorizontal className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[180px]">
                <DropdownMenuItem 
                  onClick={() => setIsPreviewOpen(true)} 
                  className="flex items-center gap-2 text-foreground"
                >
                  <Eye className="h-4 w-4" />
                  Preview
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDetails(document)} className="flex items-center gap-2 text-foreground">
                  <Eye className="h-4 w-4" />
                  Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onOpen(document)} className="flex items-center gap-2 text-foreground">
                  <ExternalLink className="h-4 w-4" />
                  Open
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDownload(document)} className="flex items-center gap-2 text-foreground">
                  <Download className="h-4 w-4" />
                  Download
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      <DocumentPreview
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        fileUrl={document.fileUrl}
        fileName={document.fileName}
        fileType={fileMeta.mimeType}
      />
    </>
  );
}
