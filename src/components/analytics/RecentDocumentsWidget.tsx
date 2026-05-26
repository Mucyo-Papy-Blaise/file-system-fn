"use client";

import React from "react";
import { useGetRecentDocuments } from "@/lib/hooks/useAnalytics";

export function RecentDocumentsWidget() {
  const { data, isLoading, isError } = useGetRecentDocuments();

  if (isLoading) {
    return <div>Loading documents...</div>;
  }

  if (isError || !data) {
    return <div className="text-sm text-red-600">Failed to load documents.</div>;
  }

  return (
    <div className="p-4 bg-card border rounded-md">
      <h3 className="text-sm text-secondary mb-2">Recent Documents</h3>
      <ul className="space-y-2">
        {data.map((d) => (
          <li key={d.id} className="flex items-center justify-between">
            <div>
              <div className="font-medium">{d.fileName}</div>
              <div className="text-xs text-secondary">{d.category ?? "Uncategorized"} • {new Date(d.createdAt).toLocaleDateString()}</div>
            </div>
            <div className="text-sm text-secondary">{d.uploadedBy}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
