"use client";

import Link from "next/link";
import {
  Building2,
  ChevronLeft,
  FileText,
  Folder,
  FolderOpen,
  GitBranch,
  LayersIcon,
  LayoutDashboard,
  LibraryBig,
  Share2,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Tag,
  Users,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useGetInbox } from "@/lib/hooks/useDocuments";
import type { Document } from "@/types/document";
import { Role } from "@/types/enum";
import type { AuthUser } from "@/types/auth";
import Image from "next/image";

interface SidebarProps {
  isOpen: boolean;
  pathname: string;
  user: AuthUser | null;
  onClose: () => void;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  roles: Role[];
}

const navItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    roles: [Role.OWNER, Role.BRANCH_MANAGER, Role.DEPT_MANAGER, Role.MEMBER],
  },
  {
    href: "/dashboard/search",
    label: "Search",
    icon: Search,
    roles: [Role.OWNER, Role.BRANCH_MANAGER, Role.DEPT_MANAGER, Role.MEMBER],
  },
  {
    href: "/dashboard/branches",
    label: "Branches",
    icon: GitBranch,
    roles: [Role.OWNER],
  },
  {
    href: "/dashboard/departments",
    label: "Departments",
    icon: Building2,
    roles: [Role.OWNER, Role.BRANCH_MANAGER],
  },
  {
    href: "/dashboard/folders",
    label: "Folders",
    icon: FolderOpen,
    roles: [Role.OWNER, Role.BRANCH_MANAGER, Role.DEPT_MANAGER],
  },
  {
    href: "/dashboard/my-folders",
    label: "My Folders",
    icon: Folder,
    roles: [Role.OWNER, Role.BRANCH_MANAGER,Role.DEPT_MANAGER, Role.MEMBER],
  },
  {
    href: "/dashboard/categories",
    label: "Categories",
    icon: Tag,
    roles: [Role.OWNER, Role.BRANCH_MANAGER],
  },
  {
    href: "/dashboard/documents",
    label: "Documents",
    icon: FileText,
    roles: [Role.OWNER, Role.BRANCH_MANAGER, Role.DEPT_MANAGER, Role.MEMBER],
  },
  {
    href: "/dashboard/collections",
    label: "Collections",
    icon: LibraryBig,
    roles: [Role.OWNER, Role.BRANCH_MANAGER, Role.DEPT_MANAGER, Role.MEMBER],
  },
  {
    href: "/dashboard/shared",
    label: "Shared",
    icon: Share2,
    roles: [Role.OWNER, Role.BRANCH_MANAGER, Role.DEPT_MANAGER, Role.MEMBER],
  },
  {
    href: "/dashboard/members",
    label: "Members",
    icon: Users,
    roles: [Role.OWNER, Role.BRANCH_MANAGER, Role.DEPT_MANAGER],
  },
  {
    href: "/dashboard/unsorted",
    label: "Tray",
    icon: LayersIcon,
    roles: [Role.OWNER, Role.BRANCH_MANAGER, Role.DEPT_MANAGER, Role.MEMBER],
  },
];

function getInitials(name?: string | null) {
  if (!name) return "U";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function Sidebar({
  isOpen,
  pathname,
  user,
  onClose,
  collapsed,
  onCollapsedChange,
}: SidebarProps) {

  const role = user?.role ?? Role.MEMBER;
  const { documents: inboxDocuments } = useGetInbox();
  const safeInboxDocuments: Document[] = Array.isArray(inboxDocuments)
    ? inboxDocuments
    : [];
  const processingCount = safeInboxDocuments.filter(
    (d) => d.processingStatus === "processing",
  ).length;
  const readyCount = safeInboxDocuments.filter(
    (d) => d.processingStatus === "ready",
  ).length;
  const inboxCount = processingCount + readyCount;

  const visibleItems = navItems.filter(
    (item) => user && item.roles.includes(user.role),
  );

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={[
          "fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] transition-opacity lg:hidden",
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        ].join(" ")}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={[
          "fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-default bg-surface text-foreground transition-all duration-300 ease-out lg:translate-x-0",
          // Width: collapsed = icon-only rail, expanded = full
          collapsed ? "w-[68px]" : "w-72",
          // Mobile slide in/out
          isOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        {/* Header: logo + collapse toggle */}
        <div
          className={[
            "flex h-16 shrink-0 items-center border-b border-default px-4",
            collapsed ? "justify-center" : "justify-between",
          ].join(" ")}
        >
          {/* Logo — hide when collapsed */}
          {!collapsed && (
            <Link
              href="/dashboard"
              className="flex items-center"
              onClick={onClose}
            >
              <Image
                src="/file-vault-2.png"
                alt="Logo"
                width={140}
                height={44}
                className="h-12 w-auto"
              />
            </Link>
          )}

          {/* Collapse toggle (desktop) */}
          <button
            type="button"
            onClick={() => onCollapsedChange(!collapsed)}
            className="hidden lg:flex items-center justify-center rounded-md p-1.5 text-secondary transition-colors hover:bg-[var(--color-bg-secondary)] hover:text-foreground"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </button>

          {/* Close button (mobile only) */}
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center rounded-md p-1.5 text-secondary transition-colors hover:bg-[var(--color-bg-secondary)] hover:text-foreground lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2.5 py-3 space-y-0.5">
          {visibleItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" &&
                pathname.startsWith(`${item.href}/`));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                title={collapsed ? item.label : undefined}
                className={[
                  "group relative flex items-center rounded-md text-sm transition-all duration-150",
                  collapsed
                    ? "justify-center px-0 py-2.5"
                    : "gap-3 px-3 py-2.5",
                  isActive
                    ? "bg-primary-subtle/60 text-primary font-medium"
                    : "text-secondary hover:bg-[var(--color-bg-secondary)] hover:text-foreground",
                ].join(" ")}
              >
                {/* Left accent bar */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-primary" />
                )}

                <Icon
                  className={[
                    "h-[18px] w-[18px] shrink-0 transition-colors",
                    isActive
                      ? "text-primary"
                      : "text-muted group-hover:text-secondary",
                  ].join(" ")}
                />

                {/* Label + badge — hidden when collapsed */}
                {!collapsed && (
                  <>
                    <span className="flex-1 truncate">{item.label}</span>

                    {item.href === "/dashboard/unsorted" && inboxCount > 0 && (
                      <span
                        className={[
                          "rounded-full px-2 py-0.5 text-[10px] font-semibold tabular-nums",
                          processingCount > 0
                            ? "bg-amber-100 text-amber-700"
                            : "bg-blue-100 text-blue-700",
                        ].join(" ")}
                      >
                        {inboxCount}
                      </span>
                    )}
                  </>
                )}

                {/* Collapsed: badge dot only */}
                {collapsed &&
                  item.href === "/dashboard/unsorted" &&
                  inboxCount > 0 && (
                    <span
                      className={[
                        "absolute right-1.5 top-1.5 h-2 w-2 rounded-full",
                        processingCount > 0 ? "bg-amber-400" : "bg-blue-500",
                      ].join(" ")}
                    />
                  )}
              </Link>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="border-t border-default px-2.5 py-3">
          <div
            className={[
              "flex items-center rounded-lg px-2 py-2.5 transition-colors hover:bg-[var(--color-bg-secondary)] cursor-default",
              collapsed ? "justify-center" : "gap-3",
            ].join(" ")}
          >
            {/* Avatar */}
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-subtle text-xs font-semibold text-primary">
              {getInitials(user?.name)}
            </div>

            {/* Name + org — hidden when collapsed */}
            {!collapsed && (
              <>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground leading-tight">
                    {user?.name ?? "Unknown User"}
                  </p>
                  <p className="truncate text-xs text-muted leading-tight mt-0.5">
                    {user?.organizationName ?? "No organization"}
                  </p>
                </div>
                <span className="shrink-0 rounded-md bg-primary-subtle px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                  {role}
                </span>
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
