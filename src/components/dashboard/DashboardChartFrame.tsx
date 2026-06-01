"use client";

import type { ReactNode } from "react";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";

interface DashboardChartFrameProps {
  isLoading: boolean;
  isError: boolean;
  height?: number;
  children: ReactNode;
  emptyMessage?: string;
  isEmpty?: boolean;
}

export function DashboardChartFrame({
  isLoading,
  isError,
  height = 220,
  children,
  emptyMessage = "No data yet",
  isEmpty = false,
}: DashboardChartFrameProps) {
  if (isLoading) {
    return (
      <div className="space-y-3" style={{ minHeight: height }}>
        <LoadingSkeleton height={height - 24} rounded="1rem" />
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="flex items-center justify-center rounded-xl border border-dashed border-default bg-[var(--color-bg-secondary)]/60 px-4 text-sm text-error"
        style={{ minHeight: height }}
      >
        Failed to load chart data.
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div
        className="flex items-center justify-center rounded-xl border border-dashed border-default bg-[var(--color-bg-secondary)]/60 px-4 text-sm text-secondary"
        style={{ minHeight: height }}
      >
        {emptyMessage}
      </div>
    );
  }

  return <>{children}</>;
}
