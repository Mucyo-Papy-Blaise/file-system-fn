"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2,
  FileText,
  Folder,
  FolderOpen,
  Inbox,
  LayoutDashboard,
  LibraryBig,
  LogOut,
  Search,
  Tag,
  Users,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { useGetInbox } from "@/lib/hooks/useDocuments";
import { Role } from "@/types/enum";
import type { AuthUser } from "@/types/auth";
import { useAuth } from "@/lib/auth-context";

interface SidebarProps {
  isOpen: boolean;
  pathname: string;
  user: AuthUser | null;
  onClose: () => void;
}

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  roles?: Role[];
}

const navItems: NavItem[] = [
  { href: "/dashboard/search", label: "Search", icon: Search },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  {
    href: "/dashboard/departments",
    label: "Departments",
    icon: Building2,
    roles: [Role.SUPER_ADMIN],
  },
  { href: "/dashboard/folders", label: "Folders", icon: FolderOpen, roles: [Role.SUPER_ADMIN, Role.ADMIN] },
  { href: "/dashboard/my-folders", label: "My Folders", icon: Folder },
  { href: "/dashboard/categories", label: "Categories", icon: Tag, roles: [Role.SUPER_ADMIN, Role.ADMIN] },
  { href: "/dashboard/documents", label: "Documents", icon: FileText },
  { href: "/dashboard/collections", label: "Collections", icon: LibraryBig },
  { href: "/dashboard/inbox", label: "Inbox", icon: Inbox },
  {
    href: "/dashboard/members",
    label: "Members",
    icon: Users,
    roles: [Role.SUPER_ADMIN, Role.ADMIN],
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

export function Sidebar({ isOpen, pathname, user, onClose }: SidebarProps) {
  const router = useRouter();
  const { logout } = useAuth();

  const role = user?.role ?? Role.MEMBER;
  const { documents: inboxDocuments } = useGetInbox();
  const inboxCount = inboxDocuments.length;

  const visibleItems = navItems.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role)),
  );

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      router.replace("/login");
    } catch (error) {
      toast.error("Failed to logout");
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      <div
        className={[
          "fixed inset-0 z-40 bg-[rgba(15,23,42,0.18)] transition-opacity lg:hidden",
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        ].join(" ")}
        onClick={onClose}
      />

      <aside
        className={[
          "fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-default bg-surface text-foreground shadow-[0_18px_60px_-30px_rgba(15,23,42,0.3)] transition-transform duration-300 ease-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <div className="flex items-center justify-between border-b border-default px-6 py-5 lg:justify-start">
          <Link
            href="/dashboard"
            className="flex items-center gap-3"
            onClick={onClose}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-3xl bg-[var(--color-primary-subtle)] text-[var(--color-primary)] shadow-sm">
              <Folder className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                Workspace
              </p>
              <p className="text-lg font-semibold text-foreground">FileVault</p>
            </div>
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-secondary transition hover:bg-[var(--color-bg-secondary)] hover:text-foreground lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-2 px-5 py-6">
          {visibleItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={[
                  "flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary-subtle text-primary shadow-sm ring-1 ring-[var(--color-primary)]/15"
                    : "text-secondary hover:bg-[var(--color-bg-secondary)] hover:text-foreground",
                ].join(" ")}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
                {item.href === "/dashboard/inbox" && inboxCount > 0 ? (
                  <span className="ml-auto rounded-full bg-red-600 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
                    {inboxCount}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-default px-4 py-5">
          <div className="flex items-start gap-3 rounded-3xl bg-[var(--color-bg-secondary)] p-4 shadow-sm ring-1 ring-[var(--color-border)]/80">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-subtle)] text-sm font-semibold text-primary">
              {getInitials(user?.name)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                {user?.name ?? "Unknown User"}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <span className="rounded-full bg-[var(--color-primary-subtle)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
                  {role}
                </span>
              </div>
              <p className="mt-2 truncate text-xs text-muted">
                {user?.organizationName ?? "No organization"}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="mt-3 flex w-full items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium text-secondary transition-all duration-200 hover:bg-[var(--color-bg-secondary)] hover:text-foreground"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
