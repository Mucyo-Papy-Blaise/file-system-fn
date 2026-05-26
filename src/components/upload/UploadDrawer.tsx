"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { DropZone } from "./DropZone";
import { ProcessingState } from "./ProcessingState";
import { ConfirmDocumentForm } from "./ConfirmDocumentForm";
import { BulkUploadDrawer } from "./BulkUploadDrawer";
import { useProcessDocument, useCreateDocument } from "@/lib/hooks/useDocuments";
import { useDashboard } from "@/lib/dashboard-context";
import { uploadApi } from "@/api/upload.api";
import pdfjsLib from "@/lib/pdfjs-setup";
import type { ProcessDocumentResult } from "@/types/document";
import type { ConfirmDocumentFormData } from "@/types/schema/document.schema";

type UploadState = "IDLE" | "PROCESSING" | "CONFIRM" | "SUCCESS";
type UploadMode = "single" | "multiple";

interface UploadDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  folderId?: string | null;
}

export function UploadDrawer({ isOpen, onClose, folderId: propFolderId }: UploadDrawerProps) {
  const [mode, setMode] = useState<UploadMode>("single");
  const [state, setState] = useState<UploadState>("IDLE");
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [aiResult, setAiResult] = useState<ProcessDocumentResult | null>(null);
  const [showBulkUpload, setShowBulkUpload] = useState(false);

  const processDocument = useProcessDocument();
  const createDocument = useCreateDocument();
  const { uploadFolderId } = useDashboard();
  const effectiveFolderId = propFolderId ?? uploadFolderId;

  const convertPdfToImage = async (pdfFile: File): Promise<File> => {
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    // Get the first page (you can extend this to process multiple pages)
    const page = await pdf.getPage(1);
    const scale = 2;
    const viewport = page.getViewport({ scale });

    // Create canvas
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Failed to get canvas context");
    }

    // Render page to canvas
    await page.render({
      canvas,
      viewport,
    }).promise;

    // Convert canvas to blob
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Failed to convert canvas to blob"));
            return;
          }
          const imageFile = new File([blob], `${pdfFile.name}.png`, {
            type: "image/png",
          });
          resolve(imageFile);
        },
        "image/png",
        0.95
      );
    });
  };

  const handleProcessFile = async (file: File) => {
    setState("PROCESSING");
    setCurrentStep(1);

    try {
      // Step 1: Convert file to image if needed
      let imageFile = file;
      if (file.type === "application/pdf") {
        imageFile = await convertPdfToImage(file);
      }

      // Step 2: OCR with Tesseract
      const { createWorker } = await import("tesseract.js");
      const worker = await createWorker("eng");

      const { data } = await worker.recognize(imageFile);
      const text = data.text;
      setExtractedText(text);

      await worker.terminate();

      // Step 3: AI Processing
      setCurrentStep(2);

      const result = await processDocument.mutateAsync(text);
      setAiResult(result);

      setState("CONFIRM");
    } catch (error) {
      console.error("Processing error:", error);
      toast.error("Failed to process document. Please try again.");
      setState("IDLE");
      setSelectedFile(null);
    }
  };

  const handleFileSelected = useCallback((file: File | null) => {
    if (!file) {
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    if (state === "IDLE") {
      handleProcessFile(file);
    }
  }, [state]);


  const handleConfirmDocument = async (data: ConfirmDocumentFormData) => {
    if (!selectedFile || !extractedText) {
      toast.error("Missing document data");
      return;
    }

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", selectedFile);

      const uploadResult = await uploadApi.uploadFile(uploadFormData);
      const fileUrl = uploadResult.url;

      await createDocument.mutateAsync({
        fileUrl,
        fileName: selectedFile.name,
        extractedText,
        // folderId supplied from context/prop
        folderId: effectiveFolderId ?? undefined,
        title: data.title,
        summary: data.summary,
        categoryId: data.categoryId?.trim() ? data.categoryId : undefined,
        category:
          !data.categoryId?.trim() && (data as any).categoryName?.trim()
            ? (data as any).categoryName.trim()
            : undefined,
        documentOwner: (data as any).documentOwner,
        author: (data as any).author,
        documentType: (data as any).documentType,
        concerning: (data as any).concerning,
        purpose: (data as any).purpose,
        documentDate: (data as any).documentDate,
      });

      toast.success("Document uploaded successfully");
      setState("SUCCESS");

      setTimeout(() => {
        onClose();
        setState("IDLE");
        setSelectedFile(null);
        setExtractedText("");
        setAiResult(null);
      }, 1500);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload document");
      setState("CONFIRM");
    }
  };

  const selectedFileUrl = useMemo(
    () => (selectedFile ? URL.createObjectURL(selectedFile) : null),
    [selectedFile],
  );

  useEffect(() => {
    return () => {
      if (selectedFileUrl) {
        URL.revokeObjectURL(selectedFileUrl);
      }
    };
  }, [selectedFileUrl]);

  const handleCancel = () => {
    setState("IDLE");
    setSelectedFile(null);
    setExtractedText("");
    setAiResult(null);
  };

  const handleChangeFile = () => {
    setState("IDLE");
    setSelectedFile(null);
    setExtractedText("");
    setAiResult(null);
  };

  const handleModeChange = (newMode: UploadMode) => {
    setMode(newMode);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black bg-opacity-50" />

      {/* Drawer */}
      <div className="fixed right-0 top-0 z-50 h-screen w-full max-w-3xl overflow-y-auto bg-surface shadow-xl">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-default bg-surface px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {mode === "multiple" ? "Bulk Upload Files" : "Upload Document"}
            </h2>
            <div className="mt-2 flex items-center gap-2 rounded-2xl bg-[var(--color-bg-secondary)] p-1">
              <button
                type="button"
                onClick={() => handleModeChange("single")}
                className={`rounded px-3 py-1 text-sm font-semibold transition ${
                  mode === "single"
                    ? "bg-primary text-primary-foreground"
                    : "text-secondary hover:bg-[var(--color-bg-tertiary)]"
                }`}
              >
                Single File
              </button>
              <button
                type="button"
                onClick={() => handleModeChange("multiple")}
                className={`rounded px-3 py-1 text-sm font-semibold transition ${
                  mode === "multiple"
                    ? "bg-primary text-primary-foreground"
                    : "text-secondary hover:bg-[var(--color-bg-tertiary)]"
                }`}
              >
                Multiple Files
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-2 hover:bg-[var(--color-bg-secondary)]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 p-6">
          {mode === "multiple" ? (
            <BulkUploadDrawer embedded onClose={() => { handleModeChange("single"); onClose(); }} />
          ) : null}

          {state === "IDLE" && (
            mode === "single" ? (
            <div className="space-y-4">
              <p className="text-sm text-secondary">
                Upload a PDF or image file. We&apos;ll extract the text and help you categorize it.
              </p>
              <DropZone onFileSelected={handleFileSelected} selectedFile={selectedFile} />
              {selectedFile && (
                <button
                  type="button"
                  onClick={() => handleProcessFile(selectedFile)}
                  className="w-full rounded bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
                >
                  Process Document
                </button>
              )}
            </div>
            ) : null
          )}

          {state === "PROCESSING" && (
            mode === "single" ? (
            <div>
              <p className="mb-6 text-sm text-secondary">
                Please wait while we process your document...
              </p>
              <ProcessingState
                currentStep={currentStep}
                isComplete={state !== "PROCESSING" || currentStep > 2}
              />
            </div>
            ) : null
          )}

          {state === "CONFIRM" && aiResult && (
            mode === "single" ? (
            <div className="space-y-6">
              <div className="rounded border border-default bg-surface p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">Selected file</p>
                    <p className="truncate text-sm text-secondary">{selectedFile?.name}</p>
                    <p className="text-xs text-secondary">
                      {selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : "No file selected"}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {selectedFileUrl ? (
                      <a
                        href={selectedFileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex rounded border border-default bg-surface px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-[var(--color-bg-secondary)]"
                      >
                        Preview
                      </a>
                    ) : null}
                    <button
                      type="button"
                      onClick={handleChangeFile}
                      className="inline-flex rounded border border-default bg-surface px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-[var(--color-bg-secondary)]"
                    >
                      Change file
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <p className="mb-6 text-sm text-secondary">
                  Please review and edit the extracted information below:
                </p>
                <ConfirmDocumentForm
                  defaultValues={aiResult}
                  defaultFolderId={effectiveFolderId}
                  onConfirm={handleConfirmDocument}
                  onCancel={handleCancel}
                  isLoading={createDocument.isLoading}
                />
              </div>
            </div>
            ) : null
          )}

          {state === "SUCCESS" && (
            mode === "single" ? (
            <div className="space-y-4 py-8 text-center">
              <div className="mx-auto h-12 w-12 rounded bg-green-100 flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground">Upload Complete</h3>
              <p className="text-sm text-secondary">
                Your document has been successfully uploaded and categorized.
              </p>
            </div>
            ) : null
          )}
        </div>
      </div>
    </>
  );
}
