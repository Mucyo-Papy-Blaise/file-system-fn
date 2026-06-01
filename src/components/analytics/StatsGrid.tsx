"use client";

import {
  Building2,
  FileText,
  Folder,
  GitBranch,
  Inbox,
  Layers,
  Tag,
  Users,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useGetStats } from "@/lib/hooks/useAnalytics";
import { useGetBranches } from "@/lib/hooks/useBranches";
import { StatsCard } from "@/components/ui/StatsCard";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";

type StatItem = {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
};

function StatsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-default bg-surface p-5 shadow-sm"
        >
          <LoadingSkeleton height={14} width="55%" />
          <div className="mt-4">
            <LoadingSkeleton height={32} width="40%" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function StatsGrid() {
  const { isOwner, isBranchManager, isDeptManager, isMember } = useAuth();
  const { stats, isLoading, isError } = useGetStats();
  const { branches } = useGetBranches();

  if (isLoading) {
    return <StatsSkeleton />;
  }

  if (isError || !stats) {
    return (
      <div className="rounded-2xl border border-dashed border-default bg-surface px-5 py-8 text-center text-sm text-error">
        Failed to load overview stats.
      </div>
    );
  }

  let items: StatItem[] = [];

  if (isOwner) {
    items = [
      {
        title: "Documents",
        value: stats.totalDocuments,
        icon: <FileText className="h-5 w-5" />,
        color: "var(--color-primary)",
      },
      {
        title: "Folders",
        value: stats.totalFolders,
        icon: <Folder className="h-5 w-5" />,
        color: "var(--color-info)",
      },
      {
        title: "Members",
        value: stats.totalMembers ?? 0,
        icon: <Users className="h-5 w-5" />,
        color: "var(--color-success)",
      },
      {
        title: "Branches",
        value: branches.length,
        icon: <GitBranch className="h-5 w-5" />,
        color: "var(--color-warning)",
      },
      {
        title: "Departments",
        value: stats.totalDepartments ?? 0,
        icon: <Building2 className="h-5 w-5" />,
        color: "var(--color-info)",
      },
      {
        title: "Categories",
        value: stats.totalCategories ?? 0,
        icon: <Tag className="h-5 w-5" />,
        color: "var(--color-primary-light)",
      },
      {
        title: "Collections",
        value: stats.totalCollections,
        icon: <Layers className="h-5 w-5" />,
        color: "var(--color-primary)",
      },
      {
        title: "Tray",
        value: stats.pendingInbox,
        icon: <Inbox className="h-5 w-5" />,
        color: stats.pendingInbox > 0 ? "var(--color-warning)" : "var(--color-text-muted)",
      },
    ];
  } else if (isBranchManager) {
    items = [
      {
        title: "Branch documents",
        value: stats.totalDocuments,
        icon: <FileText className="h-5 w-5" />,
        color: "var(--color-primary)",
      },
      {
        title: "Branch folders",
        value: stats.totalFolders,
        icon: <Folder className="h-5 w-5" />,
        color: "var(--color-info)",
      },
      {
        title: "Members",
        value: stats.totalMembers ?? 0,
        icon: <Users className="h-5 w-5" />,
        color: "var(--color-success)",
      },
      {
        title: "Departments",
        value: stats.totalDepartments ?? 0,
        icon: <Building2 className="h-5 w-5" />,
        color: "var(--color-warning)",
      },
      {
        title: "Tray",
        value: stats.pendingInbox,
        icon: <Inbox className="h-5 w-5" />,
        color: stats.pendingInbox > 0 ? "var(--color-warning)" : "var(--color-text-muted)",
      },
    ];
  } else if (isDeptManager) {
    items = [
      {
        title: "Dept documents",
        value: stats.totalDocuments,
        icon: <FileText className="h-5 w-5" />,
        color: "var(--color-primary)",
      },
      {
        title: "Dept folders",
        value: stats.totalFolders,
        icon: <Folder className="h-5 w-5" />,
        color: "var(--color-info)",
      },
      {
        title: "Members",
        value: stats.totalMembers ?? 0,
        icon: <Users className="h-5 w-5" />,
        color: "var(--color-success)",
      },
      {
        title: "Tray",
        value: stats.pendingInbox,
        icon: <Inbox className="h-5 w-5" />,
        color: stats.pendingInbox > 0 ? "var(--color-warning)" : "var(--color-text-muted)",
      },
    ];
  } else if (isMember) {
    items = [
      {
        title: "My documents",
        value: stats.totalDocuments,
        icon: <FileText className="h-5 w-5" />,
        color: "var(--color-primary)",
      },
      {
        title: "My folders",
        value: stats.totalFolders,
        icon: <Folder className="h-5 w-5" />,
        color: "var(--color-info)",
      },
      {
        title: "Collections",
        value: stats.totalCollections,
        icon: <Layers className="h-5 w-5" />,
        color: "var(--color-success)",
      },
      {
        title: "Tray",
        value: stats.pendingInbox,
        icon: <Inbox className="h-5 w-5" />,
        color: stats.pendingInbox > 0 ? "var(--color-warning)" : "var(--color-text-muted)",
      },
    ];
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((stat) => (
        <StatsCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
        />
      ))}
    </div>
  );
}
