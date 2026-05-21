"use client";

import type { Department } from "@/types/department";
import { useGetDepartmentById } from "@/lib/hooks/useDepartments";
import { Role } from "@/types/enum";

interface DepartmentRowProps {
  department: Department;
  onEdit: () => void;
  onInviteAdmin: () => void;
  onDelete: () => void;
  isBusy?: boolean;
}

export function DepartmentRow({
  department,
  onEdit,
  onInviteAdmin,
  onDelete,
  isBusy = false,
}: DepartmentRowProps) {
  const createdAt = new Date(department.createdAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <tr className="border-t border-default text-sm text-foreground">
      <td className="px-4 py-4 align-top">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{department.name}</p>
          <p className="mt-1 truncate text-xs text-secondary">Slug: {department.slug}</p>
        </div>
      </td>
      <td className="px-4 py-4 align-top text-secondary">{department.memberCount}</td>
      <td className="px-4 py-4 align-top text-secondary">{department.folderCount}</td>
      <td className="px-4 py-4 align-top text-secondary">{createdAt}</td>
      <td className="px-4 py-4 align-top text-right">
        <div className="flex flex-wrap items-center justify-end gap-2">
          <button
            type="button"
            onClick={onEdit}
            disabled={isBusy}
            className="rounded-full border border-default bg-surface px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-[var(--color-bg-secondary)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Edit
          </button>
          {/* fetch department details to determine if an admin already exists */}
          <DepartmentAdminAction
            departmentId={department.id}
            onInvite={onInviteAdmin}
            isBusy={isBusy}
          />
          <button
            type="button"
            onClick={onDelete}
            disabled={isBusy}
            className="rounded-full border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

function DepartmentAdminAction({
  departmentId,
  onInvite,
  isBusy,
}: {
  departmentId: string;
  onInvite: () => void;
  isBusy?: boolean;
}) {
  const { department: deptDetail, isLoading } = useGetDepartmentById(departmentId);

  const admin = deptDetail?.users?.data?.find((u: any) => u.role === Role.ADMIN);

  if (isLoading) {
    return (
      <button
        type="button"
        disabled
        className="rounded-full border border-default bg-surface px-3 py-2 text-xs font-semibold text-secondary"
      >
        Loading...
      </button>
    );
  }

  if (admin) {
    return (
      <button
        type="button"
        disabled
        className="rounded-full border border-default bg-surface px-3 py-2 text-xs font-semibold text-foreground/80"
        title={`Admin: ${admin.name ?? admin.email}`}
      >
        Admin: {admin.name ?? admin.email}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onInvite}
      disabled={isBusy}
      className="rounded-full border border-default bg-surface px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-[var(--color-bg-secondary)] disabled:cursor-not-allowed disabled:opacity-50"
    >
      Invite Admin
    </button>
  );
}
