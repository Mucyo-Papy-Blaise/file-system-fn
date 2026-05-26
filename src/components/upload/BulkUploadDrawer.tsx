"use client";

import { useCallback, useMemo, useState } from "react";
import { Upload, FileText, X, Check, AlertCircle, Loader } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { Modal } from "@/components/ui/Modal";
import { useBulkUpload } from "@/lib/hooks/useDocuments";
import type { BulkUploadFile } from "@/types/document";

const MAX_FILES = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

interface BulkUploadDrawerProps {
  isOpen?: boolean;
  onClose?: () => void;
  embedded?: boolean;
}

export function BulkUploadDrawer({
  isOpen = true,
  onClose = () => undefined,
  embedded = false,
}: BulkUploadDrawerProps) {
  const [files, setFiles] = useState<BulkUploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [allComplete, setAllComplete] = useState(false);
  const bulkUpload = useBulkUpload();

  const isValidFile = (file: File): boolean => {
    const validTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    return validTypes.includes(file.type) && file.size <= MAX_FILE_SIZE;
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.currentTarget.files ? Array.from(e.currentTarget.files) : [];
    addFiles(selectedFiles);
    e.currentTarget.value = "";
  };

  const addFiles = (newFiles: File[]) => {
    // Check total count
    if (files.length + newFiles.length > MAX_FILES) {
      toast.error("Maximum 5 files allowed at once");
      return;
    }

    const invalidFiles = newFiles.filter((f) => !isValidFile(f));
    if (invalidFiles.length > 0) {
      invalidFiles.forEach((f) => {
        if (f.size > MAX_FILE_SIZE) {
          toast.error(`File ${f.name} exceeds 10MB limit`);
        }
      });
      return;
    }

    const bulkUploadFiles: BulkUploadFile[] = newFiles.map((file) => ({
      file,
      fileName: file.name,
      preview: URL.createObjectURL(file),
      size: file.size,
      status: "pending",
    }));

    setFiles((prev) => [...prev, ...bulkUploadFiles]);
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleRenameFile = (index: number, newName: string) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      newFiles[index].fileName = newName;
      return newFiles;
    });
  };

  const handleUploadAll = async () => {
    if (files.length === 0) return;
    setIsUploading(true);
    const rawFiles: File[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        setFiles((prev) => {
          const newFiles = [...prev];
          newFiles[i].status = "uploading";
          return newFiles;
        });

        try {
          rawFiles.push(files[i].file);

          setFiles((prev) => {
            const newFiles = [...prev];
            newFiles[i].status = "done";
            return newFiles;
          });
        } catch (error) {
          setFiles((prev) => {
            const newFiles = [...prev];
            newFiles[i].status = "error";
            newFiles[i].error = "Upload failed";
            return newFiles;
          });
        }
      }

      // Send raw files to backend bulk endpoint
      const { saved, failed } = await bulkUpload.mutateAsync({ files: rawFiles });

      setAllComplete(true);
      onClose();
      toast.success(`${saved.length} files uploaded! AI is processing them. Check your Inbox when ready.`);
      if (failed && failed.length > 0) {
        toast.error(`${failed.length} files failed to upload: ${failed.join(', ')}`);
      }
    } catch (error) {
      toast.error('Failed to save files to database');
      console.error('Bulk upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDone = () => {
    // Clean up preview URLs
    files.forEach((file) => URL.revokeObjectURL(file.preview));
    setFiles([]);
    setAllComplete(false);
    onClose();
  };

  const canClose = !isUploading;
  const showUploadStep = files.length > 0 && !isUploading && !allComplete;
  const showProgressStep = isUploading || allComplete;

  const content = (
    <>
      <div className="space-y-6">
        {/* Subtitle */}
        <p className="text-sm text-secondary">
          Upload up to 5 files at once (max 10MB each)
        </p>

        {/* File Selection Step */}
        {!showProgressStep && (
          <div className="space-y-6">
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="rounded border-2 border-dashed border-default bg-[var(--color-bg-secondary)] p-8 text-center transition hover:border-primary hover:bg-[var(--color-bg-tertiary)]"
            >
              <Upload className="mx-auto h-12 w-12 text-secondary" />
              <p className="mt-4 text-sm text-foreground">Drag & drop or click to browse</p>
              <p className="mt-1 text-xs text-secondary">
                Accepts PDF and image files (max 5 files, 10MB each)
              </p>
              <label
                htmlFor="bulk-file-input"
                className="mt-4 inline-flex cursor-pointer rounded bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
              >
                Choose Files
              </label>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">
                  {files.length} file{files.length !== 1 ? "s" : ""} selected
                </p>
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 rounded border border-default bg-[var(--color-bg-secondary)] p-3"
                  >
                    {file.file.type === "application/pdf" ? (
                      <FileText className="h-5 w-5 flex-shrink-0 text-red-600" />
                    ) : (
                      <div className="relative h-10 w-10 flex-shrink-0 rounded overflow-hidden">
                        <Image
                          src={file.preview}
                          alt={file.fileName}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <input
                        type="text"
                        value={file.fileName}
                        onChange={(e) => handleRenameFile(index, e.target.value)}
                        className="w-full rounded border border-default bg-surface px-2 py-1 text-xs text-foreground placeholder-secondary focus:border-primary focus:outline-none"
                      />
                      <p className="mt-1 text-xs text-secondary">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      className="rounded p-1 hover:bg-[var(--color-bg-tertiary)]"
                    >
                      <X className="h-4 w-4 text-secondary" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Button */}
            {files.length > 0 && (
              <button
                type="button"
                onClick={handleUploadAll}
                disabled={isUploading}
                className="w-full rounded bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover disabled:opacity-50"
              >
                Upload All
              </button>
            )}
          </div>
        )}

        {/* Upload Progress Step */}
        {showProgressStep && (
          <div className="space-y-4">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded border border-default bg-[var(--color-bg-secondary)] p-3"
              >
                {file.status === "pending" && (
                  <div className="h-5 w-5 rounded-full bg-gray-400 flex-shrink-0" />
                )}
                {file.status === "uploading" && (
                  <Loader className="h-5 w-5 flex-shrink-0 text-blue-600 animate-spin" />
                )}
                {file.status === "done" && (
                  <Check className="h-5 w-5 flex-shrink-0 text-green-600" />
                )}
                {file.status === "error" && (
                  <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
                )}

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {file.fileName}
                  </p>
                  {file.error && (
                    <p className="text-xs text-red-600">{file.error}</p>
                  )}
                </div>
              </div>
            ))}

            {allComplete && (
              <button
                type="button"
                onClick={handleDone}
                className="w-full rounded bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
              >
                Done
              </button>
            )}
          </div>
        )}
      </div>

      <input
        id="bulk-file-input"
        type="file"
        multiple
        accept=".pdf,image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />
    </>
  );

  if (embedded) {
    return content;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Bulk Upload Files"
      variant="side"
      disableClose={!canClose}
      disableOverlayClick={!canClose}
    >
      {content}
    </Modal>
  );
}
