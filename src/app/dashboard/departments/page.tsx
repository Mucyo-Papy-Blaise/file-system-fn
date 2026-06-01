"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import {
  useCreateDepartment,
  useDeleteDepartment,
  useGetDepartments,
  useInviteDeptManager,
  useUpdateDepartment,
} from "@/lib/hooks/useDepartments";
import { AddDepartmentModal } from "@/components/departments/AddDepartmentModal";
import { EditDepartmentModal } from "@/components/departments/EditDepartmentModal";
import { InviteAdminModal } from "@/components/departments/InviteAdminModal";
import { DepartmentRow } from "@/components/departments/DepartmentRow";
import { DeleteConfirmationModal } from "@/components/ui/DeleteConfirmationModal";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { Role } from "@/types/enum";
import type { Department } from "@/types/department";

export default function DashboardDepartmentsPage() {
  const router = useRouter();
  const { user, isLoading, isOwner, isBranchManager } = useAuth();
  const { departments, isLoading: isDepartmentsLoading, isError } = useGetDepartments();
  const { mutate: createDepartment, isLoading: isCreatingDepartment } = useCreateDepartment();
  const { mutate: updateDepartment, isLoading: isUpdatingDepartment } = useUpdateDepartment();
  const { mutate: deleteDepartment, isLoading: isDeletingDepartment } = useDeleteDepartment();
  const { mutate: inviteDeptManager, isLoading: isInvitingAdmin } =
    useInviteDeptManager();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);

  const isBusy =
    isCreatingDepartment || isUpdatingDepartment || isDeletingDepartment || isInvitingAdmin;

  useEffect(() => {
    if (!isLoading && user && !isOwner && !isBranchManager) {
      router.replace("/dashboard");
    }
  }, [isBranchManager, isLoading, isOwner, router, user]);

  const handleAddDepartment = (name: string) => {
    createDepartment({ name }, {
      onSuccess: () => {
        toast.success("Department created successfully");
      },
      onError: (error) => {
        const message = error instanceof Error ? error.message : "Unable to create department.";
        toast.error(message);
      },
    });
  };

  const handleEditDepartment = (name: string) => {
    if (!selectedDepartment) return;

    updateDepartment(
      { slug: selectedDepartment.slug, data: { name } },
      {
        onSuccess: () => {
          toast.success("Department updated successfully");
        },
        onError: (error) => {
          const message = error instanceof Error ? error.message : "Unable to update department.";
          toast.error(message);
        },
      },
    );
  };

  const handleDeleteDepartment = async () => {
    if (!selectedDepartment) return;

    deleteDepartment(selectedDepartment.slug, {
      onSuccess: () => {
        toast.success("Department deleted successfully");
      },
      onError: (error) => {
        const message = error instanceof Error ? error.message : "Unable to delete department.";
        toast.error(message);
      },
    });
    setIsDeleteModalOpen(false);
  };

  const handleInviteDeptManager = (data: { email: string }) => {
    if (!selectedDepartment) return;

    inviteDeptManager(
      { slug: selectedDepartment.slug, data },
      {
        onSuccess: () => {
          toast.success("Department manager invitation sent successfully");
        },
        onError: (error) => {
          const message =
            error instanceof Error
              ? error.message
              : "Unable to send department manager invite.";
          toast.error(message);
        },
      },
    );
  };

  const openEdit = (department: Department) => {
    setSelectedDepartment(department);
    setIsEditModalOpen(true);
  };

  const openInvite = (department: Department) => {
    setSelectedDepartment(department);
    setIsInviteModalOpen(true);
  };

  const openDelete = (department: Department) => {
    setSelectedDepartment(department);
    setIsDeleteModalOpen(true);
  };

  if (isLoading || !user) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-3">
            <LoadingSkeleton width={280} height={32} />
            <LoadingSkeleton width="60%" height={18} />
          </div>
          <LoadingSkeleton width={140} height={44} rounded="1.5rem" />
        </div>
        <div className="rounded border border-default bg-surface p-6">
          {[...Array(4)].map((index) => (
            <div key={index} className="grid gap-4 md:grid-cols-[2.5fr_1fr_1fr_1fr_auto] py-4">
              <LoadingSkeleton width="100%" height={20} />
              <LoadingSkeleton width="100%" height={20} />
              <LoadingSkeleton width="100%" height={20} />
              <LoadingSkeleton width="100%" height={20} />
              <LoadingSkeleton width={32} height={32} rounded="9999px" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Departments</h1>
            <p className="mt-1 max-w-2xl text-sm text-secondary">
              We were unable to load departments. Please try again.
            </p>
          </div>
        </div>
        <EmptyState
          title="Unable to load departments"
          description="There was a problem fetching the department list. Refresh to try again."
          actionLabel="Retry"
          onAction={() => router.refresh()}
        />
      </div>
    );
  }

  if (!departments.length && !isDepartmentsLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Departments</h1>
            <p className="mt-1 max-w-2xl text-sm text-secondary">
              Create and manage departments for the organization.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
          >
            <Plus className="h-4 w-4" />
            Add Department
          </button>
        </div>
        <EmptyState
          title="No departments yet"
          description="Create your first department and manage users by department.
          "
          actionLabel="Create a Department"
          onAction={() => setIsAddModalOpen(true)}
        />

        <AddDepartmentModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onConfirm={handleAddDepartment}
          isSubmitting={isCreatingDepartment}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Departments</h1>
          <p className="mt-1 max-w-2xl text-sm text-secondary">
            Manage departments, assign administrators, and keep teams organized.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
        >
          <Plus className="h-4 w-4" />
          New Department
        </button>
      </div>

      <div className="overflow-hidden rounded-3xl border border-default bg-surface text-sm text-foreground">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--color-bg-secondary)] text-secondary">
            <tr className="text-xs font-semibold uppercase tracking-[0.14em]">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Members</th>
              <th className="px-4 py-3">Folders</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isDepartmentsLoading
              ? [...Array(4)].map((_, index) => (
                  <tr key={index} className="border-t border-default">
                    <td className="px-4 py-4">
                      <LoadingSkeleton width="80%" height={20} />
                    </td>
                    <td className="px-4 py-4">
                      <LoadingSkeleton width={40} height={20} />
                    </td>
                    <td className="px-4 py-4">
                      <LoadingSkeleton width={40} height={20} />
                    </td>
                    <td className="px-4 py-4">
                      <LoadingSkeleton width={120} height={20} />
                    </td>
                    <td className="px-4 py-4 text-right">
                      <LoadingSkeleton width={120} height={32} />
                    </td>
                  </tr>
                ))
              : departments.map((department) => (
                  <DepartmentRow
                    key={department.id}
                    department={department}
                    onEdit={() => openEdit(department)}
                    onInviteAdmin={() => openInvite(department)}
                    onDelete={() => openDelete(department)}
                    isBusy={isBusy}
                  />
                ))}
          </tbody>
        </table>
      </div>

      <AddDepartmentModal
        key="add-department-modal"
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onConfirm={handleAddDepartment}
        isSubmitting={isCreatingDepartment}
      />
      <EditDepartmentModal
        key={`edit-${selectedDepartment?.id ?? "none"}-${isEditModalOpen}`}
        isOpen={isEditModalOpen}
        departmentName={selectedDepartment?.name ?? ""}
        onClose={() => setIsEditModalOpen(false)}
        onConfirm={handleEditDepartment}
        isSubmitting={isUpdatingDepartment}
      />
      <InviteAdminModal
        key={`invite-${selectedDepartment?.id ?? "none"}-${isInviteModalOpen}`}
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onConfirm={handleInviteDeptManager}
        isSubmitting={isInvitingAdmin}
      />
      <DeleteConfirmationModal
        key={`delete-${selectedDepartment?.id ?? "none"}-${isDeleteModalOpen}`}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteDepartment}
        title="Delete Department"
        description="Deleting a department will remove it from the organization and revoke related admin assignments."
        itemNameToConfirm={selectedDepartment?.name ?? ""}
        isLoading={isDeletingDepartment}
      />
    </div>
  );
}
