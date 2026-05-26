"use client";

import React from "react";
import { useGetStorage } from "@/lib/hooks/useAnalytics";

export function StorageWidget() {
  const { data, isLoading, isError } = useGetStorage();

  if (isLoading) {
    return <div className="p-4 bg-card border rounded-md">Loading...</div>;
  }

  if (isError || !data) {
    return <div className="p-4 bg-card border rounded-md text-sm text-red-600">Failed to load storage.</div>;
  }

  const percent = Math.round(data.percentage);

  return (
    <div className="p-4 bg-card border rounded-md">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-secondary">Storage</div>
          <div className="text-lg font-semibold">{(data.used / (1024 * 1024)).toFixed(1)} MB</div>
        </div>
        <div className="text-right">
          <div className="text-sm">{percent}% used</div>
        </div>
      </div>
      <div className="w-full bg-muted h-2 rounded-full mt-3 overflow-hidden">
        <div className="bg-primary h-2" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
