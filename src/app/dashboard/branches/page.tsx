'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth-context';
import {
  useCreateBranch,
  useDeleteBranch,
  useGetBranches,
  useInviteBranchManager,
  useUpdateBranch,
} from '@/lib/hooks/useBranches';
import { BranchCard } from '@/components/branches/BranchCard';
import { CreateBranchModal } from '@/components/branches/CreateBranchModal';
import { EditBranchModal } from '@/components/branches/EditBranchModal';
import { InviteBranchManagerModal } from '@/components/branches/InviteBranchManagerModal';
import { DeleteConfirmationModal } from '@/components/ui/DeleteConfirmationModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import type { Branch } from '@/types/branch';

export default function DashboardBranchesPage() {
  const router = useRouter();
  const { user, isLoading, isOwner } = useAuth();
  const { branches, isLoading: isBranchesLoading, isError } = useGetBranches();
  const { mutate: createBranch, isLoading: isCreating } = useCreateBranch();
  const { mutate: updateBranch, isLoading: isUpdating } = useUpdateBranch();
  const { mutate: deleteBranch, isLoading: isDeleting } = useDeleteBranch();
  const { mutate: inviteManager, isLoading: isInviting } = useInviteBranchManager();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  useEffect(() => {
    if (!isLoading && user && !isOwner) {
      router.replace('/dashboard');
    }
  }, [isLoading, isOwner, router, user]);

  if (isLoading || !user || !isOwner) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton width={200} height={32} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, index) => (
            <LoadingSkeleton key={index} height={160} rounded="1.5rem" />
          ))}
        </div>
      </div>
    );
  }

  const handleCreate = (name: string) => {
    createBranch(
      { name },
      {
        onSuccess: () => toast.success('Branch created successfully'),
        onError: (error) => {
          toast.error(error instanceof Error ? error.message : 'Unable to create branch.');
        },
      },
    );
  };

  const handleUpdate = (name: string) => {
    if (!selectedBranch) return;
    updateBranch(
      { slug: selectedBranch.slug, data: { name } },
      {
        onSuccess: () => toast.success('Branch updated successfully'),
        onError: (error) => {
          toast.error(error instanceof Error ? error.message : 'Unable to update branch.');
        },
      },
    );
  };

  const handleDelete = () => {
    if (!selectedBranch) return;
    deleteBranch(selectedBranch.slug, {
      onSuccess: () => toast.success('Branch deleted successfully'),
      onError: (error) => {
        toast.error(error instanceof Error ? error.message : 'Unable to delete branch.');
      },
    });
    setIsDeleteOpen(false);
  };

  const handleInvite = (data: { email: string }) => {
    if (!selectedBranch) return;
    inviteManager(
      { slug: selectedBranch.slug, data },
      {
        onSuccess: () => toast.success(`Invitation sent to ${data.email}`),
        onError: (error) => {
          toast.error(error instanceof Error ? error.message : 'Unable to send invitation.');
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Branches</h1>
          <p className="mt-1 max-w-2xl text-sm text-secondary">
            Organize your organization into branches and assign branch managers.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
        >
          <Plus className="h-4 w-4" />
          New Branch
        </button>
      </div>

      {isError ? (
        <EmptyState
          title="Unable to load branches"
          description="There was a problem fetching branches. Refresh to try again."
          actionLabel="Retry"
          onAction={() => router.refresh()}
        />
      ) : isBranchesLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, index) => (
            <LoadingSkeleton key={index} height={160} rounded="1.5rem" />
          ))}
        </div>
      ) : branches.length === 0 ? (
        <EmptyState
          title="No branches yet"
          description="Create one to organize your organization."
          actionLabel="New Branch"
          onAction={() => setIsCreateOpen(true)}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {branches.map((branch) => (
            <BranchCard
              key={branch.id}
              branch={branch}
              currentUser={user}
              onEdit={() => {
                setSelectedBranch(branch);
                setIsEditOpen(true);
              }}
              onInviteManager={() => {
                setSelectedBranch(branch);
                setIsInviteOpen(true);
              }}
              onDelete={() => {
                setSelectedBranch(branch);
                setIsDeleteOpen(true);
              }}
            />
          ))}
        </div>
      )}

      <CreateBranchModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onConfirm={handleCreate}
        isSubmitting={isCreating}
      />
      <EditBranchModal
        isOpen={isEditOpen}
        branchName={selectedBranch?.name ?? ''}
        onClose={() => setIsEditOpen(false)}
        onConfirm={handleUpdate}
        isSubmitting={isUpdating}
      />
      <InviteBranchManagerModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        onConfirm={handleInvite}
        isSubmitting={isInviting}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Branch"
        description="Deleting a branch removes it from your organization. Departments must be removed first."
        itemNameToConfirm={selectedBranch?.name ?? ''}
        isLoading={isDeleting}
      />
    </div>
  );
}
