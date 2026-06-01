"use client";

import { useMemo, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { AppSelect } from "@/components/ui/AppSelect";
import { useAuth } from "@/lib/auth-context";
import { useCreateSharedSpace } from "@/lib/hooks/useSharedSpaces";
import {
  getCreatableSharedLevels,
  sharedLevelLabels,
} from "@/lib/shared-level-utils";
import { SharedScopeFields } from "@/components/shared/SharedScopeFields";
import {
  ALL_SCOPE_VALUE,
  toScopeApiValue,
} from "@/lib/shared-scope-utils";
import { Role } from "@/types/enum";
import { SharedLevel } from "@/types/shared-space";
import { toast } from "sonner";

interface CreateSharedSpaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateSharedSpaceModal({
  isOpen,
  onClose,
}: CreateSharedSpaceModalProps) {
  const { user } = useAuth();
  const createSharedSpace = useCreateSharedSpace();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const availableLevels = useMemo(
    () => getCreatableSharedLevels(user?.role ?? ""),
    [user?.role],
  );

  const [level, setLevel] = useState<SharedLevel>(
    availableLevels[0] ?? SharedLevel.DEPARTMENT,
  );
  const [branchId, setBranchId] = useState(ALL_SCOPE_VALUE);
  const [departmentId, setDepartmentId] = useState(ALL_SCOPE_VALUE);

  const handleClose = () => {
    setName("");
    setDescription("");
    setLevel(availableLevels[0] ?? SharedLevel.DEPARTMENT);
    setBranchId(ALL_SCOPE_VALUE);
    setDepartmentId(ALL_SCOPE_VALUE);
    onClose();
  };

  const handleConfirm = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      toast.error("Name cannot be empty");
      return;
    }

    if (
      user?.role === Role.OWNER &&
      level === SharedLevel.DEPARTMENT &&
      (!branchId || branchId === ALL_SCOPE_VALUE)
    ) {
      toast.error("Select a branch for department-level access.");
      return;
    }

    try {
      await createSharedSpace.mutateAsync({
        name: trimmedName,
        description: description.trim() || undefined,
        level,
        branchId: toScopeApiValue(branchId),
        departmentId: toScopeApiValue(departmentId),
      });
      toast.success("Shared space created successfully");
      handleClose();
    } catch {
      toast.error("Failed to create shared space");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="New Shared Space">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground">
            Name <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter shared space name"
            className="mt-2 w-full rounded-2xl border border-default bg-[var(--color-bg-secondary)] px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
            disabled={createSharedSpace.isLoading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground">
            Description <span className="text-xs text-secondary">(optional)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe this shared space"
            rows={3}
            className="mt-2 w-full rounded-2xl border border-default bg-[var(--color-bg-secondary)] px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
            disabled={createSharedSpace.isLoading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground">
            Level <span className="text-red-600">*</span>
          </label>
          <AppSelect
            className="mt-2"
            value={level}
            onValueChange={(value) => {
              setLevel(value as SharedLevel);
              setBranchId(ALL_SCOPE_VALUE);
              setDepartmentId(ALL_SCOPE_VALUE);
            }}
            placeholder="Select level"
            disabled={createSharedSpace.isLoading}
            options={availableLevels.map((option) => ({
              value: option,
              label:
                option === SharedLevel.ORGANIZATION
                  ? "Organization Wide"
                  : option === SharedLevel.BRANCH
                    ? "Branch Level"
                    : "Department Level",
            }))}
          />
        </div>
        <SharedScopeFields
          userRole={user?.role}
          level={level}
          branchId={branchId}
          departmentId={departmentId}
          onBranchChange={setBranchId}
          onDepartmentChange={setDepartmentId}
          disabled={createSharedSpace.isLoading}
        />
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleClose}
            disabled={createSharedSpace.isLoading}
            className="rounded border border-default bg-background px-4 py-3 text-sm font-semibold text-secondary transition hover:bg-[var(--color-bg-secondary)] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void handleConfirm()}
            disabled={!name.trim() || createSharedSpace.isLoading}
            className="rounded bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover disabled:opacity-50"
          >
            {createSharedSpace.isLoading ? "Creating..." : "Create Space"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
