"use client";

import { useEffect, useRef, useState } from "react";
import { Download, X, ZoomIn, ZoomOut } from "lucide-react";

interface DocumentPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string;
  fileName: string;
  fileType: string;
}

export function DocumentPreview({
  isOpen,
  onClose,
  fileUrl,
  fileName,
  fileType,
}: DocumentPreviewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);
  const [previewFailed, setPreviewFailed] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const isPdf = fileType === "application/pdf";
  const isImage = ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(fileType);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.click();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        ref={overlayRef}
        onClick={handleOverlayClick}
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90vw] h-[90vh] flex flex-col bg-surface rounded-lg shadow-xl animate-in fade-in zoom-in-95 duration-200">
        {/* Top Bar */}
        <div className="flex items-center justify-between border-b border-default px-6 py-4">
          <div className="flex-1 truncate">
            <p className="text-sm font-medium text-foreground truncate">{fileName}</p>
          </div>

          <div className="flex items-center gap-3 ml-4">
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 active:bg-blue-800"
              aria-label="Download document"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Download</span>
            </button>

            <button
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-lg p-2 text-secondary transition hover:bg-[var(--color-bg-secondary)] hover:text-foreground"
              aria-label="Close preview"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto flex items-center justify-center p-4 bg-[var(--color-bg-secondary)]">
          {isPdf ? (
            <div className="w-full h-full flex flex-col bg-surface rounded-lg overflow-hidden">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-white" />
                    <p className="text-sm text-foreground">Loading PDF...</p>
                  </div>
                </div>
              )}

              {previewFailed ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
                  <p className="text-center text-foreground max-w-md">
                    Preview not available. Click Download to view this file.
                  </p>
                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                </div>
              ) : (
                <iframe
                  ref={iframeRef}
                  src={fileUrl}
                  className="w-full h-full"
                  title={fileName}
                  onLoad={() => setIsLoading(false)}
                  onError={() => {
                    setIsLoading(false);
                    setPreviewFailed(true);
                  }}
                />
              )}
            </div>
          ) : isImage ? (
            <div className="flex flex-col items-center justify-center gap-4">
              <div
                className={`relative bg-surface rounded-lg overflow-hidden transition-transform duration-200 ${
                  isZoomed ? "scale-[2]" : "scale-100"
                }`}
                style={isZoomed ? { maxHeight: "70vh", maxWidth: "80vw" } : {}}
              >
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
                  </div>
                )}
                <img
                  src={fileUrl}
                  alt={fileName}
                  className="max-h-[70vh] max-w-[80vw] object-contain"
                  onLoad={() => setIsLoading(false)}
                  onError={() => {
                    setIsLoading(false);
                    setPreviewFailed(true);
                  }}
                />
              </div>

              {!previewFailed && (
                <button
                  onClick={() => setIsZoomed(!isZoomed)}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
                  aria-label={isZoomed ? "Zoom out" : "Zoom in"}
                >
                  {isZoomed ? (
                    <>
                      <ZoomOut className="h-4 w-4" />
                      Zoom Out
                    </>
                  ) : (
                    <>
                      <ZoomIn className="h-4 w-4" />
                      Zoom In
                    </>
                  )}
                </button>
              )}

              {previewFailed && (
                <div className="flex flex-col items-center gap-4">
                  <p className="text-center text-foreground max-w-md">
                    Preview not available. Click Download to view this file.
                  </p>
                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <p className="text-center text-foreground max-w-md">
                Preview not available for this file type. Click Download to view this file.
              </p>
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <Download className="h-4 w-4" />
                Download
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
