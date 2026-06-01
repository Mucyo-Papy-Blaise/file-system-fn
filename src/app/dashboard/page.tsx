"use client";

import { useAuth } from "@/lib/auth-context";
import { useGetStats } from "@/lib/hooks/useAnalytics";
import { DashboardHero } from "@/components/dashboard/DashboardHero";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { StatsGrid } from "@/components/analytics/StatsGrid";
import { DocumentsOverTimeChart } from "@/components/analytics/DocumentsOverTimeChart";
import { DocumentsByCategoryChart } from "@/components/analytics/DocumentsByCategoryChart";
import { DocumentsByBranchChart } from "@/components/analytics/DocumentsByBranchChart";
import { MemberActivityChart } from "@/components/analytics/MemberActivityChart";
import { StorageWidget } from "@/components/analytics/StorageWidget";
import { RecentFoldersGrid } from "@/components/analytics/RecentFoldersGrid";
import { RecentDocumentsWidget } from "@/components/analytics/RecentDocumentsWidget";

export default function DashboardOverviewPage() {
  const { isOwner, isBranchManager, isDeptManager } = useAuth();
  const { stats } = useGetStats();

  const showMemberActivity = isOwner || isBranchManager || isDeptManager;
  const showBranchChart = isOwner;

  return (
    <div className="mx-auto max-w-[1600px] space-y-8 pb-4">
      <DashboardHero pendingTray={stats?.pendingInbox ?? 0} />

      <DashboardSection
        title="Key metrics"
        description="Counts scoped to your role and organization."
      >
        <StatsGrid />
      </DashboardSection>

      <DashboardSection
        title="Insights"
        description="Trends and breakdowns across your workspace."
      >
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <div className="space-y-6 xl:col-span-8">
            <DocumentsOverTimeChart />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <DocumentsByCategoryChart />
              {showBranchChart ? <DocumentsByBranchChart /> : null}
            </div>
          </div>

          <aside className="space-y-6 xl:col-span-4">
            <StorageWidget />
            {showMemberActivity ? <MemberActivityChart /> : null}
          </aside>
        </div>
      </DashboardSection>

      <DashboardSection
        title="Recent activity"
        description="Latest folders and documents."
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <RecentDocumentsWidget />
          <RecentFoldersGrid />
        </div>
      </DashboardSection>
    </div>
  );
}
