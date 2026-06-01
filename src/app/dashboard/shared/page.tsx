"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Library, Plus } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useGetCollections } from "@/lib/hooks/useCollections";
import { useGetSharedSpaces, useDeleteSharedSpace } from "@/lib/hooks/useSharedSpaces";
import { SharedSpaceCard } from "@/components/shared/SharedSpaceCard";
import { CreateSharedSpaceModal } from "@/components/shared/CreateSharedSpaceModal";
import { EditSharedSpaceModal } from "@/components/shared/EditSharedSpaceModal";
import { CreateCollectionModal } from "@/components/collections/CreateCollectionModal";
import { SharedLevelBadge } from "@/components/shared/SharedLevelBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { DeleteConfirmationModal } from "@/components/ui/DeleteConfirmationModal";
import { SharedLevel } from "@/types/shared-space";
import { Role } from "@/types/enum";
import type { SharedSpace } from "@/types/shared-space";
import { toast } from "sonner";

type TabId = "spaces" | "collections";
type LevelFilter = "ALL" | SharedLevel;

export default function SharedDashboardPage() {
  const { user } = useAuth();
  const { sharedSpaces, isLoading: isSpacesLoading } = useGetSharedSpaces();
  const { sharedCollections, isLoading: isCollectionsLoading } =
    useGetCollections();
  const deleteSharedSpace = useDeleteSharedSpace();

  const [activeTab, setActiveTab] = useState<TabId>("spaces");
  const [levelFilter, setLevelFilter] = useState<LevelFilter>("ALL");
  const [isCreateSpaceOpen, setIsCreateSpaceOpen] = useState(false);
  const [isCreateCollectionOpen, setIsCreateCollectionOpen] = useState(false);
  const [editingSpace, setEditingSpace] = useState<SharedSpace | null>(null);
  const [deletingSpace, setDeletingSpace] = useState<SharedSpace | null>(null);

  const isMember = user?.role === Role.MEMBER;

  const filteredSpaces = useMemo(() => {
    if (levelFilter === "ALL") return sharedSpaces;
    return sharedSpaces.filter((space) => space.level === levelFilter);
  }, [sharedSpaces, levelFilter]);

  const handleDeleteSpace = async () => {
    if (!deletingSpace) return;

    try {
      await deleteSharedSpace.mutateAsync(deletingSpace.id);
      toast.success("Shared space deleted successfully");
      setDeletingSpace(null);
    } catch {
      toast.error("Failed to delete shared space");
    }
  };

  const levelPills: { id: LevelFilter; label: string }[] = [
    { id: "ALL", label: "All" },
    { id: SharedLevel.ORGANIZATION, label: "Organization" },
    { id: SharedLevel.BRANCH, label: "Branch" },
    { id: SharedLevel.DEPARTMENT, label: "Department" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex rounded-2xl border border-default bg-[var(--color-bg-secondary)] p-1">
          <button
            type="button"
            onClick={() => setActiveTab("spaces")}
            className={[
              "rounded-xl px-4 py-2 text-sm font-semibold transition",
              activeTab === "spaces"
                ? "bg-surface text-foreground shadow-sm"
                : "text-secondary hover:text-foreground",
            ].join(" ")}
          >
            Shared Spaces
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("collections")}
            className={[
              "rounded-xl px-4 py-2 text-sm font-semibold transition",
              activeTab === "collections"
                ? "bg-surface text-foreground shadow-sm"
                : "text-secondary hover:text-foreground",
            ].join(" ")}
          >
            Shared Collections
          </button>
        </div>

        {!isMember ? (
          <button
            type="button"
            onClick={() =>
              activeTab === "spaces"
                ? setIsCreateSpaceOpen(true)
                : setIsCreateCollectionOpen(true)
            }
            className="inline-flex items-center justify-center gap-2 rounded bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
          >
            <Plus className="h-4 w-4" />
            {activeTab === "spaces"
              ? "New Shared Space"
              : "New Shared Collection"}
          </button>
        ) : null}
      </div>

      {activeTab === "spaces" ? (
        <>
          <div className="flex flex-wrap gap-2">
            {levelPills.map((pill) => (
              <button
                key={pill.id}
                type="button"
                onClick={() => setLevelFilter(pill.id)}
                className={[
                  "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                  levelFilter === pill.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-default bg-surface text-secondary hover:border-primary/40",
                ].join(" ")}
              >
                {pill.label}
              </button>
            ))}
          </div>

          {isSpacesLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, index) => (
                <LoadingSkeleton key={index} height={160} rounded="1rem" />
              ))}
            </div>
          ) : filteredSpaces.length === 0 ? (
            isMember ? (
              <div className="rounded-3xl border border-dashed border-default bg-surface px-6 py-12 text-center">
                <p className="text-lg font-semibold text-foreground">
                  No shared spaces yet.
                </p>
                <p className="mt-2 text-sm text-secondary">
                  Shared spaces created by your team will appear here.
                </p>
              </div>
            ) : (
              <EmptyState
                title="No shared spaces yet."
                description="Create a shared space to collaborate on documents at your level."
                actionLabel="New Shared Space"
                onAction={() => setIsCreateSpaceOpen(true)}
              />
            )
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredSpaces.map((space) => (
                <SharedSpaceCard
                  key={space.id}
                  sharedSpace={space}
                  currentUser={user}
                  onEdit={setEditingSpace}
                  onDelete={setDeletingSpace}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          {isCollectionsLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, index) => (
                <LoadingSkeleton key={index} height={160} rounded="1rem" />
              ))}
            </div>
          ) : sharedCollections.length === 0 ? (
            isMember ? (
              <div className="rounded-3xl border border-dashed border-default bg-surface px-6 py-12 text-center">
                <p className="text-lg font-semibold text-foreground">
                  No shared collections yet.
                </p>
                <p className="mt-2 text-sm text-secondary">
                  Shared collections created by your team will appear here.
                </p>
              </div>
            ) : (
              <EmptyState
                title="No shared collections yet."
                description="Create a shared collection visible to your team at the selected level."
                actionLabel="New Shared Collection"
                onAction={() => setIsCreateCollectionOpen(true)}
              />
            )
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sharedCollections.map((collection) => (
                <Link
                  key={collection.id}
                  href={`/dashboard/collections/${collection.slug}`}
                  className="rounded-2xl border border-default bg-surface p-5 shadow-sm transition hover:border-primary/40"
                >
                  <div className="flex items-start gap-3">
                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--color-bg-secondary)] text-primary">
                      <Library className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-base font-semibold text-foreground">
                        {collection.name}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-sm text-secondary">
                        {collection.description ?? "No description"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {collection.level ? (
                      <SharedLevelBadge level={collection.level} />
                    ) : null}
                    <span className="text-xs text-secondary">
                      {collection.documentCount}{" "}
                      {collection.documentCount === 1 ? "document" : "documents"}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-secondary">
                    {collection.createdBy.name}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </>
      )}

      <CreateSharedSpaceModal
        isOpen={isCreateSpaceOpen}
        onClose={() => setIsCreateSpaceOpen(false)}
      />
      <CreateCollectionModal
        isOpen={isCreateCollectionOpen}
        onClose={() => setIsCreateCollectionOpen(false)}
        isShared
      />
      <EditSharedSpaceModal
        isOpen={Boolean(editingSpace)}
        onClose={() => setEditingSpace(null)}
        sharedSpace={editingSpace}
      />
      <DeleteConfirmationModal
        isOpen={Boolean(deletingSpace)}
        onClose={() => setDeletingSpace(null)}
        onConfirm={() => void handleDeleteSpace()}
        title="Delete Shared Space"
        description="This removes the shared space and all document references. Files on Cloudinary are not deleted."
        itemNameToConfirm={deletingSpace?.name ?? ""}
        isLoading={deleteSharedSpace.isLoading}
      />
    </div>
  );
}
