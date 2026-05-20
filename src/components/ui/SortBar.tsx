"use client";

import type { SortOption } from "@/types/document";

interface SortBarProps {
  sortBy: SortOption;
  onChange: (sort: SortOption) => void;
}

function getButtonClassName(isActive: boolean) {
  return [
    "rounded-xl px-3 py-2 text-sm font-medium transition",
    isActive
      ? "bg-primary text-primary-foreground"
      : "bg-[var(--color-bg-secondary)] text-secondary hover:bg-[var(--color-bg-secondary)]/80 hover:text-foreground",
  ].join(" ");
}

export function SortBar({ sortBy, onChange }: SortBarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-default bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        <span className="text-sm font-medium text-foreground">Sort by Name</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onChange("name_asc")}
            className={getButtonClassName(sortBy === "name_asc")}
          >
            A{"\u2192"}Z
          </button>
          <button
            type="button"
            onClick={() => onChange("name_desc")}
            className={getButtonClassName(sortBy === "name_desc")}
          >
            Z{"\u2192"}A
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        <span className="text-sm font-medium text-foreground">Sort by Date</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onChange("date_desc")}
            className={getButtonClassName(sortBy === "date_desc")}
          >
            Newest
          </button>
          <button
            type="button"
            onClick={() => onChange("date_asc")}
            className={getButtonClassName(sortBy === "date_asc")}
          >
            Oldest
          </button>
        </div>
      </div>
    </div>
  );
}
