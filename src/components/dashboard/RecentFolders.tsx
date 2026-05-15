import Link from "next/link";
import { Folder } from "lucide-react";
import type { MockFolder } from "@/lib/mockData";

interface RecentFoldersProps {
  folders: MockFolder[];
}

export function RecentFolders({ folders }: RecentFoldersProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Recent Folders</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {folders.map((folder) => (
          <Link
            key={folder.id}
            href={`/folders/${folder.id}`}
            className="rounded-3xl bg-surface p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-subtle text-primary">
              <Folder className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-foreground">
              {folder.name}
            </h3>
            <p className="mt-1 text-sm text-secondary">
              {folder.itemCount} items
            </p>
            <p className="mt-4 text-xs uppercase tracking-[0.14em] text-muted">
              Created by
            </p>
            <p className="mt-1 text-sm text-secondary">{folder.createdBy}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
