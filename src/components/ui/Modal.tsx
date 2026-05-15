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
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  variant = "center",
  overlayClassName,
}: ModalProps) {
  if (!isOpen) return null;

  const isSideVariant = variant === "side";

  return (
    <div
      className={[
        "fixed inset-0 z-50 flex",
        isSideVariant ? "items-stretch justify-end" : "items-center justify-center p-4",
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
        onClick={onClose}
      />

      <div
        className={[
          "relative z-10 bg-surface shadow-[var(--shadow-xl)]",
          isSideVariant
            ? "flex h-full w-full max-w-[720px] flex-col border-l border-black/10 px-5 pb-5 pt-0 sm:px-7 sm:pb-7 sm:pt-0"
            : "w-full max-w-lg rounded-3xl border border-default p-6",
        ].join(" ")}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <h2 className="text-xl font-semibold text-foreground">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-secondary transition hover:bg-[var(--color-bg-secondary)] hover:text-foreground"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className={isSideVariant ? "flex-1 overflow-y-auto" : undefined}>
          {children}
        </div>
      </div>
    </div>
  );
}
