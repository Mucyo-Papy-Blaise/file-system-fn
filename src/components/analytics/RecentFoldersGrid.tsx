"use client";

import React from "react";
import { useGetRecentFolders } from "@/lib/hooks/useAnalytics";

export function RecentFoldersGrid() {
  const { data, isLoading, isError } = useGetRecentFolders();

  if (isLoading) {
    return <div>Loading folders...</div>;
  }

  if (isError || !data) {
    return <div className="text-sm text-red-600">Failed to load folders.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {data.map((f) => (
        <div key={f.id} className="p-3 bg-card border rounded-md">
          <div className="font-medium">{f.name}</div>
          <div className="text-sm text-secondary">{f.documentCount} documents</div>
          <div className="text-xs text-secondary mt-2">{new Date(f.createdAt).toLocaleDateString()}</div>
        </div>
      ))}
    </div>
  );
}
