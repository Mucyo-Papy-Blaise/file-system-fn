"use client";

import { useState } from "react";
import { FolderPlus } from "lucide-react";
import { Modal } from "../ui/Modal";
import { toast } from "sonner";

interface NewFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string) => void;
  parentId: string;
}

export function NewFolderModal({
  isOpen,
  onClose,
  onConfirm,
}: NewFolderModalProps) {
  const [folderName, setFolderName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = () => {
    const trimmedName = folderName.trim();

    if (!trimmedName) {
      toast.error("Folder name cannot be empty");
      return;
    }

    if (trimmedName.length > 100) {
      toast.error("Folder name must be less than 100 characters");
      return;
    }

    setIsLoading(true);
    try {
      onConfirm(trimmedName);
      setFolderName("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleConfirm();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Folder"
      variant="side"
      overlayClassName="bg-black/60"
    >
      <div className="flex h-full flex-col">
        <div className="-mx-5 -mt-5 border-b border-black/10 px-5 pb-6 pt-2 sm:-mx-7 sm:px-8">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#0f6b7a]">
            New Folder
          </p>
          <div className="mt-3 flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-[#e7f4f6] text-[#0f6b7a]">
              <FolderPlus className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-[2rem] font-semibold leading-none text-[#111827]">
                Create Folder
              </h3>
              <p className="mt-3 max-w-lg text-sm leading-6 text-[#6b7280]">
                Add a clean, searchable folder for company files or your
                personal workspace.
              </p>
            </div>
          </div>
        </div>

        <div className="-mx-5 flex-1 overflow-y-auto px-5 sm:-mx-7 sm:px-8">
          <div className="border-b border-black/10 py-7">
            <label
              htmlFor="folder-name"
              className="mb-3 block text-xs font-medium uppercase tracking-[0.14em] text-[#6b7280]"
            >
              Folder Name
            </label>
            <input
              id="folder-name"
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter folder name"
              maxLength={100}
              autoFocus
              className="w-full border border-[#d1d5db] bg-white px-4 py-4 text-base text-[#111827] transition-colors placeholder:text-[#9ca3af] focus:border-[#0f6b7a] focus:outline-none focus:ring-0"
            />
            <div className="mt-3 flex items-center justify-between text-xs">
              <p className="text-[#6b7280]">
                Use a short title people can recognize instantly.
              </p>
              <p className="font-medium text-[#9ca3af]">{folderName.length}/100</p>
            </div>
          </div>

          <div className="border-b border-black/10 py-7">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#6b7280]">
              Tips
            </p>
            <div className="mt-4 space-y-3 text-sm leading-6 text-[#6b7280]">
              <p>Use names like `Finance 2026`, `HR Policies`, or `Client Contracts`.</p>
              <p>Avoid very generic names so documents stay easy to find later.</p>
            </div>
          </div>
        </div>

        <div className="-mx-5 mt-auto flex items-center justify-between border-t border-black/10 bg-white px-5 py-5 sm:-mx-7 sm:px-8">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-sm font-medium uppercase tracking-[0.08em] text-[#6b7280] transition-colors hover:text-[#111827] disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirm}
            disabled={isLoading || !folderName.trim()}
            className="bg-[#0f6b7a] px-6 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-[#0c5864] disabled:opacity-50"
          >
            {isLoading ? "Creating..." : "Create Folder"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
