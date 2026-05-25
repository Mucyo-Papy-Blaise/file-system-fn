"use client";

import type { ReactNode } from "react";
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
  if (!isOpen) return null;

  const isSideVariant = variant === "side";
  const hasHeader = !hideHeader && (Boolean(title) || !disableClose);

  return (
    <div
      className={[
        "fixed inset-0 z-[70] flex",
        isSideVariant ? "items-stretch justify-end" : "items-start justify-center px-4 pb-4 pt-0",
      ].join(" ")}
    >
      <button
        type="button"
        aria-label="Close modal backdrop"
        className={[
          "absolute inset-0",
          isSideVariant ? "bg-black/55" : "bg-black/30",
          overlayClassName ?? (isSideVariant ? "" : "backdrop-blur-[1px]"),
        ].join(" ")}
        onClick={disableOverlayClick ? undefined : onClose}
      />

        <div
          className={[
            "relative z-[71] bg-surface shadow-[var(--shadow-xl)]",
            isSideVariant
              ? "flex h-screen w-full max-w-[720px] flex-col self-stretch overflow-hidden border-l border-black/10"
              : "w-full max-w-lg rounded border border-default p-6",
          ].join(" ")}
        >
        {hideHeader && !disableClose && isSideVariant ? (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 z-[72] rounded-xl p-2 text-secondary transition hover:bg-[var(--color-bg-secondary)] hover:text-foreground sm:right-7"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        ) : null}

        {hasHeader ? (
          <div className={isSideVariant ? "mb-5 flex items-start justify-between gap-4 pt-0" : "mb-5 flex items-start justify-between gap-4"}>
            {title ? <h2 className="text-xl font-semibold text-foreground">{title}</h2> : <div />}
            {!disableClose ? (
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl p-2 text-secondary transition hover:bg-[var(--color-bg-secondary)] hover:text-foreground"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            ) : null}
          </div>
        ) : null}

        <div className={isSideVariant ? "flex-1 overflow-y-auto px-5 pb-5 pt-0 sm:px-7 sm:pb-7" : undefined}>
          {children}
        </div>
      </div>
    </div>
  );
}
