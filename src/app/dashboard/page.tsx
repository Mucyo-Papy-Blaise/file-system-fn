"use client";

import { useAuth } from "@/lib/auth-context";
import { StatsGrid } from "@/components/analytics/StatsGrid";
import { DocumentsOverTimeChart } from "@/components/analytics/DocumentsOverTimeChart";
import { DocumentsByCategoryChart } from "@/components/analytics/DocumentsByCategoryChart";
import { DocumentsByDepartmentChart } from "@/components/analytics/DocumentsByDepartmentChart";
import { MemberActivityChart } from "@/components/analytics/MemberActivityChart";
import { StorageWidget } from "@/components/analytics/StorageWidget";
import { RecentFoldersGrid } from "@/components/analytics/RecentFoldersGrid";
import { RecentDocumentsWidget } from "@/components/analytics/RecentDocumentsWidget";

export default function DashboardOverviewPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h2 className="text-2xl font-semibold text-foreground">Welcome back, {user?.name ?? "User"}</h2>
        <p className="text-sm text-secondary">Here is a quick snapshot of your workspace activity.</p>
      </header>

      <StatsGrid />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <DocumentsOverTimeChart />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DocumentsByCategoryChart />
            <DocumentsByDepartmentChart />
          </div>
        </div>

        <div className="space-y-4">
          <MemberActivityChart />
          <StorageWidget />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RecentDocumentsWidget />
        <RecentFoldersGrid />
      </div>
    </div>
  );
}
