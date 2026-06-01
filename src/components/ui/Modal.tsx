"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  variant?: "center" | "side";
  overlayClassName?: string;
  disableClose?: boolean;
  disableOverlayClick?: boolean;
  hideHeader?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  variant = "center",
  overlayClassName,
  disableClose = false,
  disableOverlayClick = false,
  hideHeader = false,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen || !mounted) {
    return null;
  }

  const isSideVariant = variant === "side";
  const hasHeader = !hideHeader && (Boolean(title) || !disableClose);

  const handleOverlayClick = () => {
    if (!disableOverlayClick && !disableClose) {
      onClose();
    }
  };

  const content = isSideVariant ? (
    <div className="fixed inset-0 z-[100] flex items-stretch justify-end">
      <button
        type="button"
        aria-label="Close modal backdrop"
        className={[
          "absolute inset-0 bg-black/55",
          overlayClassName ?? "",
        ].join(" ")}
        onClick={handleOverlayClick}
      />

      <div
        className="relative z-[71] flex h-full w-full max-w-[720px] flex-col overflow-hidden border-l border-default bg-surface shadow-[var(--shadow-xl)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        onClick={(event) => event.stopPropagation()}
      >
        {hideHeader && !disableClose ? (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 z-[72] rounded-xl p-2 text-secondary transition hover:bg-[var(--color-bg-secondary)] hover:text-foreground"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        ) : null}

        {hasHeader ? (
          <div className="flex shrink-0 items-center justify-between gap-3 border-b border-default px-5 py-3 sm:px-7">
            {title ? (
              <h2
                id="modal-title"
                className="text-lg font-semibold leading-tight text-foreground"
              >
                {title}
              </h2>
            ) : (
              <div />
            )}
            {!disableClose ? (
              <button
                type="button"
                onClick={onClose}
                className="-mr-1 shrink-0 rounded-lg p-1.5 text-secondary transition hover:bg-[var(--color-bg-secondary)] hover:text-foreground"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            ) : null}
          </div>
        ) : null}

        <div className="flex-1 overflow-y-auto px-5 py-4 sm:px-7 sm:pb-6">
          {children}
        </div>
      </div>
    </div>
  ) : (
    <div
      className={[
        "fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6",
        "bg-black/30 backdrop-blur-[1px]",
        overlayClassName ?? "",
      ].join(" ")}
      onClick={handleOverlayClick}
      role="presentation"
    >
      <div
        className="relative mx-auto max-h-[calc(100dvh-2rem)] w-[min(100%,32rem)] shrink-0 overflow-hidden rounded-lg border border-default bg-surface shadow-[var(--shadow-xl)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        onClick={(event) => event.stopPropagation()}
      >
          {hasHeader ? (
            <div className="flex items-center justify-between gap-3 border-b border-default px-5 py-3">
              {title ? (
                <h2
                  id="modal-title"
                  className="text-lg font-semibold leading-tight text-foreground"
                >
                  {title}
                </h2>
              ) : (
                <div />
              )}
              {!disableClose ? (
                <button
                  type="button"
                  onClick={onClose}
                  className="-mr-1 shrink-0 rounded-lg p-1.5 text-secondary transition hover:bg-[var(--color-bg-secondary)] hover:text-foreground"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
              ) : null}
            </div>
          ) : null}

        <div className="max-h-[calc(100dvh-8rem)] overflow-y-auto px-5 py-4">
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
