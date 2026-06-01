"use client";

import { useMemo, useState } from "react";
import { Search, Filter, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useGetCollections, useDeleteCollection } from "@/lib/hooks/useCollections";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { CollectionCard } from "@/components/collections/CollectionCard";
import { CreateCollectionModal } from "@/components/collections/CreateCollectionModal";
import { EditCollectionModal } from "@/components/collections/EditCollectionModal";
import { DeleteConfirmationModal } from "@/components/ui/DeleteConfirmationModal";
import { AppSelect } from "@/components/ui/AppSelect";
import { toast } from "sonner";
import type { Collection } from "@/types/collection";
import { Role } from "@/types/enum";

export default function CollectionsPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { collections, isLoading } = useGetCollections();
  const deleteCollection = useDeleteCollection();

  const [filters, setFilters] = useState({
    search: "",
    ownerId: "",
    page: 1,
    limit: 10,
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [deletingCollection, setDeletingCollection] = useState<Collection | null>(null);

  const canViewAll =
    user?.role === Role.OWNER || user?.role === Role.BRANCH_MANAGER;
  const userCollections = canViewAll
    ? collections
    : collections.filter((c) => c.createdBy.id === user?.id);

  const ownerOptions = useMemo(() => {
    const seenOwners = new Set<string>();
    return userCollections.reduce<{ id: string; name: string }[]>((owners, collection) => {
      const owner = collection.createdBy;
      if (!seenOwners.has(owner.id)) {
        seenOwners.add(owner.id);
        owners.push({ id: owner.id, name: owner.name });
      }
      return owners;
    }, []);
  }, [userCollections]);

  const filteredCollections = useMemo(() => {
    const searchTerm = filters.search.trim().toLowerCase();
    return userCollections.filter((collection) => {
      const matchesSearch =
        !searchTerm ||
        collection.name.toLowerCase().includes(searchTerm) ||
        collection.description?.toLowerCase().includes(searchTerm) ||
        collection.createdBy.name.toLowerCase().includes(searchTerm);

      const matchesOwner = !filters.ownerId || collection.createdBy.id === filters.ownerId;
      return matchesSearch && matchesOwner;
    });
  }, [userCollections, filters.search, filters.ownerId]);

  const totalPages = Math.max(1, Math.ceil(filteredCollections.length / filters.limit));
  const currentPage = Math.min(filters.page, totalPages);
  const paginatedCollections = useMemo(
    () =>
      filteredCollections.slice(
        (currentPage - 1) * filters.limit,
        currentPage * filters.limit,
      ),
    [filteredCollections, currentPage, filters.limit],
  );

  const handleSearch = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      search: value,
      page: 1,
    }));
  };

  const handleOwnerFilter = (ownerId: string | undefined) => {
    setFilters((prev) => ({
      ...prev,
      ownerId: ownerId ?? "",
      page: 1,
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));
  };

  const handlePageSizeChange = (limit: number) => {
    setFilters((prev) => ({
      ...prev,
      limit,
      page: 1,
    }));
  };

  if (isAuthLoading || !user) {
    return (
      <div className="space-y-6">
        <div className="space-y-3">
          <LoadingSkeleton width={260} height={32} />
          <LoadingSkeleton width="50%" height={16} />
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="space-y-4 rounded-3xl border border-default bg-surface p-6"
            >
              <LoadingSkeleton width="60%" height={20} />
              <LoadingSkeleton width="100%" height={14} />
              <LoadingSkeleton width="100%" height={14} />
              <LoadingSkeleton width="65%" height={14} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const handleDeleteConfirm = async () => {
    if (!deletingCollection) return;

    try {
      await deleteCollection.mutateAsync(deletingCollection.slug);
      setDeletingCollection(null);
    } catch (error) {
      toast.error("Failed to delete collection");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Collections</h1>
          <p className="mt-1 text-sm text-secondary">
            Organize and group related documents together
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 rounded bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
        >
          <Plus className="h-4 w-4" />
          New Collection
        </button>
      </div>

      <section className="space-y-4 rounded border border-default bg-surface p-5 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-[1.5fr_1fr] xl:grid-cols-[1.5fr_1fr_1fr]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
            <input
              type="text"
              placeholder="Search collections..."
              value={filters.search}
              onChange={(event) => handleSearch(event.target.value)}
              className="w-full rounded border border-default bg-[var(--color-bg-secondary)] py-2 pl-10 pr-4 text-foreground placeholder-secondary focus:border-primary focus:outline-none"
            />
          </div>

          {canViewAll ? (
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-secondary" />
              <AppSelect
                className="flex-1"
                value={filters.ownerId}
                onValueChange={(value) => handleOwnerFilter(value || undefined)}
                placeholder="All owners"
                triggerClassName="rounded-xl"
                options={[
                  { value: "", label: "All owners" },
                  ...ownerOptions.map((owner) => ({
                    value: owner.id,
                    label: owner.name,
                  })),
                ]}
              />
            </div>
          ) : null}

          <div className="flex flex-col gap-2 text-sm text-secondary sm:flex-row sm:items-center sm:justify-end">
            <span>Page size</span>
            <AppSelect
              value={String(filters.limit)}
              onValueChange={(value) => handlePageSizeChange(Number(value))}
              placeholder="Page size"
              triggerClassName="rounded-xl min-w-[5rem]"
              options={[10, 20, 50].map((option) => ({
                value: String(option),
                label: String(option),
              }))}
            />
          </div>
        </div>

        <div className="rounded border border-default bg-[var(--color-bg-secondary)] p-4 text-sm text-foreground">
          {isLoading
            ? "Loading collections..."
            : `Showing ${paginatedCollections.length} of ${filteredCollections.length} collections`}
        </div>

        <div className="divide-y divide-default">
          {isLoading ? (
            <div className="grid gap-4 lg:grid-cols-3">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="space-y-4 rounded border border-default bg-surface p-6"
                >
                  <LoadingSkeleton width="60%" height={20} />
                  <LoadingSkeleton width="100%" height={14} />
                  <LoadingSkeleton width="100%" height={14} />
                  <LoadingSkeleton width="65%" height={14} />
                </div>
              ))}
            </div>
          ) : filteredCollections.length === 0 ? (
            <EmptyState
              title="No collections found"
              description={
                userCollections.length === 0
                  ? "No collections yet. Create one to group related documents together."
                  : "No collections match your filters."
              }
              actionLabel={userCollections.length === 0 ? "Create Collection" : "Clear filters"}
              onAction={() => {
                if (userCollections.length === 0) {
                  setIsCreateModalOpen(true);
                } else {
                  setFilters((prev) => ({
                    ...prev,
                    search: "",
                    ownerId: "",
                    page: 1,
                  }));
                }
              }}
            />
          ) : (
            <div className="overflow-x-auto rounded border border-default bg-surface">
              <div className="grid gap-4 border-b border-default px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-secondary md:grid-cols-[2.5fr_1fr_1fr_1fr_auto]">
                <span>Name</span>
                <span>Owner</span>
                <span>Created</span>
                <span>Documents</span>
                <span className="text-right">Actions</span>
              </div>
              {paginatedCollections.map((collection) => (
                <CollectionCard
                  key={collection.id}
                  collection={collection}
                  currentUser={user}
                  onEdit={setEditingCollection}
                  onDelete={setDeletingCollection}
                />
              ))}
            </div>
          )}
        </div>

        {totalPages > 1 && !isLoading && (
          <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-secondary">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage <= 1}
                className="inline-flex items-center gap-2 rounded border border-default bg-surface px-4 py-2 text-sm text-foreground transition hover:bg-[var(--color-bg-secondary)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              <button
                type="button"
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage >= totalPages}
                className="inline-flex items-center gap-2 rounded border border-default bg-surface px-4 py-2 text-sm text-foreground transition hover:bg-[var(--color-bg-secondary)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </section>

      <CreateCollectionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
      <EditCollectionModal
        isOpen={Boolean(editingCollection)}
        onClose={() => setEditingCollection(null)}
        collection={editingCollection}
      />
      <DeleteConfirmationModal
        isOpen={Boolean(deletingCollection)}
        onClose={() => setDeletingCollection(null)}
        onConfirm={handleDeleteConfirm}
        title="Move to trash?"
        description="This collection will be moved to trash for 30 days. You can restore it from Trash before it is permanently deleted."
        itemNameToConfirm={deletingCollection?.name ?? ""}
        isLoading={deleteCollection.isLoading}
      />
    </div>
  );
}
