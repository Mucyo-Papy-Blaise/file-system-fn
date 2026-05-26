"use client";

import React from "react";
import { useGetStats } from "@/lib/hooks/useAnalytics";

export function StatsGrid() {
  const { stats, isLoading, isError } = useGetStats();

  if (isLoading) {
    return <div className="grid grid-cols-2 gap-4">Loading...</div>;
  }

  if (isError || !stats) {
    return <div className="text-sm text-red-600">Failed to load stats.</div>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div className="p-4 bg-card border rounded-md">
        <div className="text-sm text-secondary">Documents</div>
        <div className="text-2xl font-semibold">{stats.totalDocuments}</div>
      </div>

      <div className="p-4 bg-card border rounded-md">
        <div className="text-sm text-secondary">Folders</div>
        <div className="text-2xl font-semibold">{stats.totalFolders}</div>
      </div>

      <div className="p-4 bg-card border rounded-md">
        <div className="text-sm text-secondary">Collections</div>
        <div className="text-2xl font-semibold">{stats.totalCollections}</div>
      </div>

      <div className="p-4 bg-card border rounded-md">
        <div className="text-sm text-secondary">Inbox</div>
        <div className="text-2xl font-semibold">{stats.pendingInbox}</div>
      </div>
    </div>
  );
}
