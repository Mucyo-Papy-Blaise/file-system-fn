"use client";

import Link from "next/link";
import { Building } from "lucide-react";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";

export interface DepartmentLinkItem {
  id: string;
  name: string;
  slug: string;
}

interface DepartmentLinkListProps {
  departments: DepartmentLinkItem[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export function DepartmentLinkList({
  departments,
  isLoading = false,
  emptyMessage = "No departments yet.",
}: DepartmentLinkListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-2">
        {[...Array(3)].map((_, index) => (
          <LoadingSkeleton key={index} width={140} height={36} rounded="0.5rem" />
        ))}
      </div>
    );
  }

  if (departments.length === 0) {
    return (
      <p className="text-sm text-secondary">{emptyMessage}</p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {departments.map((dept) => (
        <Link
          key={dept.id}
          href={`/dashboard/departments/${dept.slug}`}
          className="inline-flex max-w-full items-center gap-2 rounded-lg border border-default bg-surface px-3 py-2 text-sm font-medium text-foreground transition hover:border-primary/30 hover:bg-[var(--color-bg-secondary)]"
        >
          <Building className="h-4 w-4 shrink-0 text-primary" />
          <span className="truncate">{dept.name}</span>
        </Link>
      ))}
    </div>
  );
}
