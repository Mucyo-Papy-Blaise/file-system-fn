"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Bell, LibraryBig, Menu, Search, Upload } from "lucide-react";
import { useDebounce } from "use-debounce";
import { useSearchCollections } from "@/lib/hooks/useSearch";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";

interface TopBarProps {
  pageTitle: string;
  onMenuClick?: () => void;
  onUploadClick?: () => void;
}

export function TopBar({ pageTitle, onMenuClick, onUploadClick }: TopBarProps) {
  const [query, setQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [debouncedQuery] = useDebounce(query, 300);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const { collections, isLoading } = useSearchCollections(debouncedQuery);

  useEffect(() => {
    setIsDropdownOpen(debouncedQuery.length >= 2);
  }, [debouncedQuery]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <header className="flex h-16 items-center justify-between border-b border-default bg-surface px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-xl p-2 text-secondary transition hover:bg-[var(--color-bg-secondary)] hover:text-foreground lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <h1 className="text-lg font-semibold text-foreground sm:text-xl">
          {pageTitle}
        </h1>
      </div>

      <div className="relative flex-1 px-4 sm:px-6">
        <div ref={wrapperRef} className="relative mx-auto max-w-lg">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
          <input
            type="text"
            placeholder="Search collections..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full rounded-3xl border border-default bg-[var(--color-bg-secondary)] py-2 pl-11 pr-4 text-sm text-foreground placeholder-secondary focus:border-primary focus:outline-none"
            aria-label="Search collections"
          />

          {isDropdownOpen && (
            <div className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-3xl border border-default bg-surface shadow-lg">
              {isLoading ? (
                <div className="space-y-2 p-4">
                  {[...Array(3)].map((_, index) => (
                    <LoadingSkeleton key={index} height={52} rounded="1rem" />
                  ))}
                </div>
              ) : collections.length === 0 ? (
                <div className="px-4 py-3 text-sm text-secondary">
                  No collections found
                </div>
              ) : (
                <div className="divide-y divide-default">
                  {collections.slice(0, 5).map((collection) => (
                    <Link
                      key={collection.id}
                      href={`/dashboard/collections/${collection.id}`}
                      className="flex items-center gap-3 px-4 py-3 transition hover:bg-[var(--color-bg-secondary)]"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-3xl bg-[var(--color-bg-secondary)] text-secondary">
                        <LibraryBig className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {collection.name}
                        </p>
                        <p className="truncate text-xs text-secondary">
                          {collection.description ?? "No description"}
                        </p>
                      </div>
                      <span className="rounded-full bg-[var(--color-bg-secondary)] px-3 py-1 text-xs font-semibold text-secondary">
                        {collection.documentCount} docs
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onUploadClick}
          className="flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
          aria-label="Upload document"
        >
          <Upload className="h-4 w-4" />
          <span className="hidden sm:inline">Upload</span>
        </button>

        <button
          type="button"
          className="rounded-xl p-2 text-secondary transition hover:bg-[var(--color-bg-secondary)] hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
