"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, LibraryBig, Menu, Search } from "lucide-react";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";
import { useAuth } from "@/lib/auth-context";
import { useSearchCollections } from "@/lib/hooks/useSearch";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TopBarProps {
  pageTitle: string;
  onMenuClick?: () => void;
  onUploadClick?: () => void;
}

function getInitials(name?: string | null) {
  if (!name) return "U";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function TopBar({ pageTitle, onMenuClick, onUploadClick }: TopBarProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 300);
  const isSearchDropdownOpen = debouncedQuery.length >= 2;
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const { user, logout } = useAuth();
  const { collections, isLoading } = useSearchCollections(debouncedQuery);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      router.replace("/login");
    } catch (error) {
      toast.error("Failed to logout");
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(event.target as Node)) {
        setQuery("");
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setQuery("");
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

          {isSearchDropdownOpen && (
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
                      href={`/dashboard/collections/${collection.slug}`}
                      className="flex items-center gap-3 px-4 py-3 transition hover:bg-[var(--color-bg-secondary)]"
                      onClick={() => setQuery("")}
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
        <NotificationBell />

        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            ariaLabel="Account menu"
            className="rounded-3xl border border-default bg-[var(--color-bg-secondary)] px-3 py-2 text-sm font-medium text-foreground transition hover:bg-[var(--color-bg-tertiary)]"
          >
            <button type="button" className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-subtle)] text-sm font-semibold text-primary">
                {getInitials(user?.name)}
              </span>
              <span className="hidden min-w-0 truncate sm:inline">
                {user?.name ?? "Account"}
              </span>
              <ChevronDown className="h-4 w-4 text-secondary" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="min-w-[220px]">
            <div className="space-y-2 px-4 py-4">
              <p className="truncate text-sm font-semibold text-foreground">
                {user?.name ?? "Guest User"}
              </p>
              <p className="truncate text-xs text-secondary">{user?.email ?? "No email"}</p>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[var(--color-primary-subtle)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
                  {user?.role ?? "Guest"}
                </span>
                <span className="truncate text-xs text-secondary">
                  {user?.organizationName ?? "No organization"}
                </span>
              </div>
            </div>
            <div className="border-t border-default" />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
