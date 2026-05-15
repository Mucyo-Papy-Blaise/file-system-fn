"use client";

import { NoSetupBanner } from "@/components/dashboard/NoSetupBanner";
import { RecentDocumentsTable } from "@/components/dashboard/RecentDocumentsTable";
import { RecentFolders } from "@/components/dashboard/RecentFolders";
import { StatsRow } from "@/components/dashboard/StatsRow";
import { useAuth } from "@/lib/auth-context";
import { useOrganizationSetup } from "@/lib/hooks/useOrganizationSetup";
import { mockDocuments, mockFolders } from "@/lib/mockData";

export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const { isSetupComplete } = useOrganizationSetup();
  const categories = isSetupComplete ? ["Configured"] : [];

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h2 className="text-2xl font-semibold text-foreground">
          Welcome back, {user?.name ?? "User"}
        </h2>
        <p className="text-sm text-secondary">
          Here is a quick snapshot of your workspace activity.
        </p>
      </header>

      {user?.role === "MEMBER" && categories.length === 0 ? <NoSetupBanner /> : null}

      <StatsRow />

      <RecentDocumentsTable documents={mockDocuments} loading={false} />

      <RecentFolders folders={mockFolders} />
    </div>
  );
}
