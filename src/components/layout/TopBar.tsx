"use client";

import { Bell, Menu } from "lucide-react";

interface TopBarProps {
  pageTitle: string;
  onMenuClick?: () => void;
}

export function TopBar({ pageTitle, onMenuClick }: TopBarProps) {
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

      <button
        type="button"
        className="rounded-xl p-2 text-secondary transition hover:bg-[var(--color-bg-secondary)] hover:text-foreground"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
      </button>
    </header>
  );
}
