"use client";

import { Upload, FileText, X } from "lucide-react";
import Image from "next/image";

interface DropZoneProps {
  onFileSelected: (file: File) => void;
  selectedFile?: File | null;
}

export function DropZone({ onFileSelected, selectedFile }: DropZoneProps) {
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (isValidFile(file)) {
        onFileSelected(file);
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (isValidFile(file)) {
        onFileSelected(file);
      }
    }
  };

  const isValidFile = (file: File): boolean => {
    const validTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    return validTypes.includes(file.type);
  };

  const getFilePreview = () => {
    if (!selectedFile) return null;

    const isPdf = selectedFile.type === "application/pdf";
    const isImage = selectedFile.type.startsWith("image/");

    if (isPdf) {
      return (
        <div className="flex items-center gap-2">
          <FileText className="h-8 w-8 text-red-600" />
          <div>
            <p className="text-sm font-medium text-foreground">
              {selectedFile.name}
            </p>
            <p className="text-xs text-secondary">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </div>
      );
    }

    if (isImage) {
      return (
        <div className="space-y-2">
          <div className="relative h-40 w-40">
            <Image
              src={URL.createObjectURL(selectedFile)}
              alt="preview"
              fill
              className="rounded-lg object-cover"
            />
          </div>
          <p className="text-sm font-medium text-foreground">
            {selectedFile.name}
          </p>
        </div>
      );
    }
  };

  return (
    <div className="space-y-4">
      {selectedFile ? (
        <div className="rounded-3xl border border-default bg-surface p-6">
          <div className="flex items-center justify-between">
            <div>{getFilePreview()}</div>
            <button
              type="button"
              onClick={() => onFileSelected(null as any)}
              className="rounded-full p-2 hover:bg-[var(--color-bg-secondary)]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <label
            htmlFor="file-input"
            className="mt-4 inline-flex cursor-pointer rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
          >
            Replace File
          </label>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="rounded-3xl border-2 border-dashed border-default bg-[var(--color-bg-secondary)] p-8 text-center transition hover:border-primary hover:bg-[var(--color-bg-tertiary)]"
        >
          <Upload className="mx-auto h-12 w-12 text-secondary" />
          <p className="mt-4 text-sm text-foreground">Drag & drop or click to browse</p>
          <p className="mt-1 text-xs text-secondary">
            Accepts PDF and image files
          </p>
          <label
            htmlFor="file-input"
            className="mt-4 inline-flex cursor-pointer rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
          >
            Choose File
          </label>
        </div>
      )}

      <input
        id="file-input"
        type="file"
        accept=".pdf,image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  );
}
