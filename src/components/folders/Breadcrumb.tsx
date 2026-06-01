"use client";

import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  id: string;
  name: string;
}

interface BreadcrumbProps {
  path: BreadcrumbItem[];
  onNavigate: (folderId: string) => void;
}

export function Breadcrumb({ path, onNavigate }: BreadcrumbProps) {
  return (
    <nav
      className="flex min-w-0 flex-wrap items-center gap-1 text-sm"
      aria-label="Folder path"
    >
      {path.map((item, index) => {
        const isLast = index === path.length - 1;

        return (
          <div key={item.id} className="flex min-w-0 items-center gap-1">
            {index > 0 ? (
              <ChevronRight className="h-4 w-4 shrink-0 text-secondary" />
            ) : null}
            <button
              type="button"
              onClick={() => onNavigate(item.id)}
              disabled={isLast}
              className={[
                "inline-flex max-w-[200px] items-center gap-1.5 truncate rounded-lg px-2 py-1 transition",
                isLast
                  ? "cursor-default font-medium text-foreground"
                  : "text-secondary hover:bg-[var(--color-bg-secondary)] hover:text-foreground",
              ].join(" ")}
            >
              {index === 0 ? <Home className="h-3.5 w-3.5 shrink-0" /> : null}
              <span className="truncate">{item.name}</span>
            </button>
          </div>
        );
      })}
    </nav>
  );
}
