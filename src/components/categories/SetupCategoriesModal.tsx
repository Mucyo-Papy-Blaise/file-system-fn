"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Modal } from "@/components/ui/Modal";
import { useBulkCreateCategories } from "@/lib/hooks/useCategories";
import { ApiError } from "@/api/api-client";

const PRESET_CATEGORIES = [
  "Invoice",
  "Contract",
  "Report",
  "HR",
  "Legal",
  "Receipt",
  "Agreement",
  "Permit",
  "Certificate",
  "Other",
];

interface SetupCategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  disableClose?: boolean;
}

function normalizeName(value: string) {
  return value.trim().toLowerCase();
}

function getDuplicateNameFromError(error: unknown): string | null {
  if (!(error instanceof ApiError)) {
    return null;
  }

  const rawMessage =
    typeof error.message === "string"
      ? error.message
      : error.message;

  const match = /["'`]?([^"'`]+?)["'`]? already exists/i.exec(rawMessage);
  return match?.[1] ?? null;
}

export function SetupCategoriesModal({
  isOpen,
  onClose,
  onSuccess,
  disableClose = false,
}: SetupCategoriesModalProps) {
  const { mutate: bulkCreateCategories, isLoading: isSaving } =
    useBulkCreateCategories();
  const [categoryInput, setCategoryInput] = useState("");
  const [selectedPresets, setSelectedPresets] = useState<string[]>([]);
  const [customCategories, setCustomCategories] = useState<string[]>([]);

  const allSelectedCategories = useMemo(
    () => [...selectedPresets, ...customCategories],
    [customCategories, selectedPresets],
  );

  const normalizedCategoryNames = useMemo(
    () => new Set(allSelectedCategories.map(normalizeName)),
    [allSelectedCategories],
  );

  const handleTogglePreset = (categoryName: string) => {
    setSelectedPresets((current) =>
      current.includes(categoryName)
        ? current.filter((item) => item !== categoryName)
        : [...current, categoryName],
    );
  };

  const handleAddCustomCategory = () => {
    const trimmedCategory = categoryInput.trim();
    if (!trimmedCategory) {
      toast.error("Enter a category name first.");
      return;
    }

    if (normalizedCategoryNames.has(normalizeName(trimmedCategory))) {
      toast.error("That category already exists.");
      return;
    }

    setCustomCategories((current) => [...current, trimmedCategory]);
    setCategoryInput("");
    toast.success(`Category "${trimmedCategory}" added.`);
  };

  const handleRemoveCustomCategory = (categoryName: string) => {
    setCustomCategories((current) =>
      current.filter((item) => item !== categoryName),
    );
    toast.success(`Category "${categoryName}" removed.`);
  };

  const handleSave = async () => {
    if (allSelectedCategories.length === 0) {
      toast.error("Select or add at least one category to continue.");
      return;
    }

    bulkCreateCategories(allSelectedCategories, {
      onSuccess: () => {
        toast.success("Workspace categories saved successfully.");
        onSuccess();
      },
      onError: (error) => {
        const duplicateName = getDuplicateNameFromError(error);
        if (duplicateName) {
          toast.error(`Category "${duplicateName}" already exists.`);
          return;
        }

        const message =
          error instanceof Error ? error.message : "Unable to save categories.";
        toast.error(message);
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Set up your document categories"
      disableClose={disableClose}
      disableOverlayClick={disableClose}
    >
      <div className="space-y-6">
        <p className="text-sm text-secondary">
          Select preset categories or add custom ones. All selected categories
          will be saved together.
        </p>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PRESET_CATEGORIES.map((preset) => {
            const isSelected = selectedPresets.includes(preset);
            return (
              <button
                key={preset}
                type="button"
                onClick={() => handleTogglePreset(preset)}
                className={[
                  "rounded border px-4 py-3 text-left text-sm transition",
                  isSelected
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
                ].join(" ")}
              >
                {preset}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={categoryInput}
            onChange={(event) => setCategoryInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleAddCustomCategory();
              }
            }}
            placeholder="Add custom category"
            className="h-12 flex-1 rounded border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/10"
          />
          <button
            type="button"
            onClick={handleAddCustomCategory}
            className="inline-flex h-12 items-center justify-center rounded bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary/80"
          >
            Add
          </button>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5">
          <p className="text-sm font-medium text-slate-700">
            Selected categories
          </p>
          {allSelectedCategories.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-3">
              {allSelectedCategories.map((category) => (
                <div
                  key={category}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 ring-1 ring-slate-200"
                >
                  <span className="text-sm text-slate-700">{category}</span>
                  {customCategories.includes(category) ? (
                    <button
                      type="button"
                      onClick={() => handleRemoveCustomCategory(category)}
                      className="flex h-6 w-6 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                      aria-label={`Remove ${category}`}
                    >
                      ×
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-500">
              No categories selected yet.
            </p>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex h-12 items-center justify-center rounded bg-primary px-6 text-sm font-semibold text-white transition hover:bg-primary/80 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save categories"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
