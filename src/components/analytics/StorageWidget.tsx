"use client";

import { HardDrive } from "lucide-react";
import { useGetStorage } from "@/lib/hooks/useAnalytics";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export function StorageWidget() {
  const { data, isLoading, isError } = useGetStorage();

  if (isLoading) {
    return (
      <DashboardCard title="Storage">
        <LoadingSkeleton height={80} rounded="1rem" />
      </DashboardCard>
    );
  }

  if (isError || !data) {
    return (
      <DashboardCard title="Storage">
        <p className="text-sm text-error">Failed to load storage.</p>
      </DashboardCard>
    );
  }

  const percent = Math.min(100, Math.round(data.percentage));

  return (
    <DashboardCard
      title="Storage"
      description="Organization file usage"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-primary-subtle)] text-primary">
          <HardDrive className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-2xl font-semibold text-foreground">
              {formatBytes(data.used)}
            </p>
            <span className="text-sm font-medium text-secondary">
              {percent}% used
            </span>
          </div>
          <p className="mt-1 text-xs text-secondary">
            of {formatBytes(data.total)} allocated
          </p>
          <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-[var(--color-bg-tertiary)]">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>
    </DashboardCard>
  );
}
