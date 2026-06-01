'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth-context';
import { useGetBranchBySlug, useInviteBranchManager } from '@/lib/hooks/useBranches';
import { InviteBranchManagerModal } from '@/components/branches/InviteBranchManagerModal';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';

export default function BranchDetailPage() {
  const router = useRouter();
  const params = useParams();
  const branchSlug = typeof params.slug === 'string' ? params.slug : '';
  const { user, isLoading, isOwner } = useAuth();
  const { branch, isLoading: isBranchLoading } = useGetBranchBySlug(branchSlug);
  const { mutate: inviteManager, isLoading: isInviting } = useInviteBranchManager();
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && user && !isOwner) {
      router.replace('/dashboard');
    }
  }, [isLoading, isOwner, router, user]);

  if (isLoading || !user || !isOwner) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton width={200} height={32} />
        <LoadingSkeleton height={200} rounded="1.5rem" />
      </div>
    );
  }

  const handleInvite = (data: { email: string }) => {
    inviteManager(
      { slug: branchSlug, data },
      {
        onSuccess: () => toast.success(`Invitation sent to ${data.email}`),
        onError: (error) => {
          toast.error(error instanceof Error ? error.message : 'Unable to send invitation.');
        },
      },
    );
  };

  const departments = branch?.departments ?? [];
  const members = branch?.users ?? [];

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/branches"
        className="inline-flex items-center gap-2 text-sm font-medium text-secondary transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Branches
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            {isBranchLoading ? 'Loading...' : branch?.name ?? 'Branch'}
          </h1>
          <p className="mt-1 text-sm text-secondary">
            Manager: {branch?.manager?.name ?? 'Not assigned'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsInviteOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
        >
          <UserPlus className="h-4 w-4" />
          Invite Branch Manager
        </button>
      </div>

      {isBranchLoading ? (
        <LoadingSkeleton height={240} rounded="1.5rem" />
      ) : (
        <>
          <section className="rounded-3xl border border-default bg-surface p-6">
            <h2 className="text-base font-semibold text-foreground">Departments</h2>
            {departments.length === 0 ? (
              <p className="mt-3 text-sm text-secondary">No departments in this branch yet.</p>
            ) : (
              <ul className="mt-4 space-y-2">
                {departments.map((dept) => (
                  <li
                    key={dept.id}
                    className="rounded-2xl border border-default px-4 py-3 text-sm text-foreground"
                  >
                    {dept.name}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-3xl border border-default bg-surface p-6">
            <h2 className="text-base font-semibold text-foreground">Members</h2>
            {members.length === 0 ? (
              <p className="mt-3 text-sm text-secondary">No members in this branch yet.</p>
            ) : (
              <ul className="mt-4 space-y-2">
                {members.map((member) => (
                  <li
                    key={member.id}
                    className="flex items-center justify-between rounded-2xl border border-default px-4 py-3 text-sm"
                  >
                    <span className="font-medium text-foreground">{member.name}</span>
                    <span className="text-secondary">{member.email}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}

      <InviteBranchManagerModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        onConfirm={handleInvite}
        isSubmitting={isInviting}
      />
    </div>
  );
}
