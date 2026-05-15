"use client";

import { ChevronRight } from "lucide-react";

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
    <nav className="flex items-center gap-2 text-sm text-secondary">
      {path.map((item, index) => (
        <div key={item.id} className="flex items-center gap-2">
          {index > 0 && <ChevronRight className="w-4 h-4 text-secondary" />}
          <button
            onClick={() => onNavigate(item.id)}
            className={`transition-colors ${
              index === path.length - 1
                ? "text-secondary cursor-default"
                : "text-tertiary hover:text-secondary"
            }`}
            disabled={index === path.length - 1}
          >
            {item.name}
          </button>
        </div>
      ))}
    </nav>
  );
}
