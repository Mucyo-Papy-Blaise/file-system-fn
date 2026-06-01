"use client";

import Link from "next/link";
import {
  FolderOpen,
  LayersIcon,
  Search,
  Upload,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useDashboard } from "@/lib/dashboard-context";
import { cn } from "@/lib/utils";

interface DashboardHeroProps {
  pendingTray?: number;
}

function formatRole(role?: string) {
  if (!role) return "Member";
  return role
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ");
}

export function DashboardHero({ pendingTray = 0 }: DashboardHeroProps) {
  const { user, isOwner, isBranchManager, isDeptManager } = useAuth();
  const { openUpload } = useDashboard();

  const foldersHref =
    isOwner || isBranchManager || isDeptManager
      ? "/dashboard/folders"
      : "/dashboard/my-folders";

  const quickLinks = [
    {
      label: "Upload",
      icon: Upload,
      onClick: openUpload,
      primary: true,
    },
    {
      label: "Search",
      icon: Search,
      href: "/dashboard/search",
    },
    {
      label: isOwner || isBranchManager || isDeptManager ? "Folders" : "My Folders",
      icon: FolderOpen,
      href: foldersHref,
    },
    ...(pendingTray > 0
      ? [
          {
            label: `Tray (${pendingTray})`,
            icon: LayersIcon,
            href: "/dashboard/unsorted",
            highlight: true,
          },
        ]
      : []),
  ] as const;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-default bg-surface shadow-sm">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[var(--color-primary-subtle)]/80 via-transparent to-transparent"
        aria-hidden
      />
      <div className="relative flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Overview
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Welcome back, {user?.name?.split(" ")[0] ?? "there"}
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-secondary">
            {isOwner
              ? "Monitor organization-wide documents, storage, and team activity from one place."
              : isBranchManager
                ? "Track branch documents, departments, and recent uploads."
                : isDeptManager
                  ? "See department activity and manage your team’s files."
                  : "Your personal workspace snapshot — documents, folders, and tray."}
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="rounded-full bg-[var(--color-primary-subtle)] px-3 py-1 text-xs font-semibold text-primary">
              {formatRole(user?.role)}
            </span>
            {user?.organizationName ? (
              <span className="rounded-full border border-default bg-[var(--color-bg-secondary)] px-3 py-1 text-xs font-medium text-secondary">
                {user.organizationName}
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 lg:justify-end">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            const className = cn(
              "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition",
              "primary" in link && link.primary
                ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover"
                : "highlight" in link && link.highlight
                  ? "border border-primary/30 bg-[var(--color-primary-subtle)] text-primary hover:bg-[var(--color-primary-subtle)]"
                  : "border border-default bg-[var(--color-bg-secondary)] text-foreground hover:bg-[var(--color-bg-tertiary)]",
            );

            if ("href" in link && link.href) {
              return (
                <Link key={link.label} href={link.href} className={className}>
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            }

            return (
              <button
                key={link.label}
                type="button"
                onClick={
                  "onClick" in link ? () => link.onClick?.() : undefined
                }
                className={className}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
