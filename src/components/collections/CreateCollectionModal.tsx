"use client";

import { useMemo, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { AppSelect } from "@/components/ui/AppSelect";
import { useAuth } from "@/lib/auth-context";
import { useCreateCollection } from "@/lib/hooks/useCollections";
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

interface CreateCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  isShared?: boolean;
}

export function CreateCollectionModal({
  isOpen,
  onClose,
  isShared = false,
}: CreateCollectionModalProps) {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const createCollection = useCreateCollection();

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
      toast.error("Collection name cannot be empty");
      return;
    }

    if (
      isShared &&
      user?.role === Role.OWNER &&
      level === SharedLevel.DEPARTMENT &&
      (!branchId || branchId === ALL_SCOPE_VALUE)
    ) {
      toast.error("Select a branch for department-level access.");
      return;
    }

    try {
      await createCollection.mutate(
        {
          name: trimmedName,
          description: description.trim() || undefined,
          ...(isShared
            ? {
                isShared: true,
                level,
                branchId: toScopeApiValue(branchId),
                departmentId: toScopeApiValue(departmentId),
              }
            : { isShared: false }),
        },
        {
          onSuccess: () => {
            toast.success("Collection created successfully");
            handleClose();
          },
          onError: () => {
            toast.error("Failed to create collection");
          },
        },
      );
    } catch (error) {
      toast.error("Failed to create collection");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isShared ? "New Shared Collection" : "Create Collection"}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground">
            Collection name <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-default bg-[var(--color-bg-secondary)] px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
            placeholder="Enter collection name"
            disabled={createCollection.isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground">
            Description <span className="text-xs text-secondary">(optional)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-default bg-[var(--color-bg-secondary)] px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
            placeholder="Enter collection description"
            rows={3}
            disabled={createCollection.isLoading}
          />
        </div>

        {isShared ? (
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
              disabled={createCollection.isLoading}
              options={availableLevels.map((option) => ({
                value: option,
                label: sharedLevelLabels[option],
              }))}
            />
          </div>
        ) : null}

        {isShared ? (
          <SharedScopeFields
            userRole={user?.role}
            level={level}
            branchId={branchId}
            departmentId={departmentId}
            onBranchChange={setBranchId}
            onDepartmentChange={setDepartmentId}
            disabled={createCollection.isLoading}
          />
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleClose}
            disabled={createCollection.isLoading}
            className="rounded border border-default bg-background px-4 py-3 text-sm font-semibold text-secondary transition hover:bg-[var(--color-bg-secondary)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void handleConfirm()}
            disabled={!name.trim() || createCollection.isLoading}
            className="rounded bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {createCollection.isLoading
              ? "Creating..."
              : isShared
                ? "Create Shared Collection"
                : "Create Collection"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
