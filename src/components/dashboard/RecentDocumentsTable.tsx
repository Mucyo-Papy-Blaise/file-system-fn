import { Download, Eye, Trash } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import type { MockDocument } from "@/lib/mockData";

interface RecentDocumentsTableProps {
  documents: MockDocument[];
  loading?: boolean;
}

function LoadingRows() {
  return Array.from({ length: 4 }).map((_, index) => (
    <tr key={index} className="border-t border-default">
      <td className="px-5 py-4"><LoadingSkeleton height={16} width="75%" /></td>
      <td className="px-5 py-4"><LoadingSkeleton height={24} width={90} rounded="9999px" /></td>
      <td className="px-5 py-4"><LoadingSkeleton height={16} width="70%" /></td>
      <td className="px-5 py-4"><LoadingSkeleton height={16} width="65%" /></td>
      <td className="px-5 py-4"><LoadingSkeleton height={16} width="55%" /></td>
      <td className="px-5 py-4"><LoadingSkeleton height={16} width={84} /></td>
    </tr>
  ));
}

export function RecentDocumentsTable({
  documents,
  loading = false,
}: RecentDocumentsTableProps) {
  return (
    <section className="overflow-hidden rounded-3xl bg-surface shadow-sm">
      <div className="border-b border-default px-5 py-4">
        <h2 className="text-lg font-semibold text-foreground">Recent Documents</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--color-bg-secondary)] text-secondary">
            <tr>
              <th className="px-5 py-4 font-medium">File Name</th>
              <th className="px-5 py-4 font-medium">Category</th>
              <th className="px-5 py-4 font-medium">Folder</th>
              <th className="px-5 py-4 font-medium">Uploaded By</th>
              <th className="px-5 py-4 font-medium">Date</th>
              <th className="px-5 py-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <LoadingRows />
            ) : (
              documents.map((document) => (
                <tr key={document.id} className="border-t border-default">
                  <td className="px-5 py-4 text-foreground">{document.fileName}</td>
                  <td className="px-5 py-4">
                    <Badge label={document.category} variant="category" />
                  </td>
                  <td className="px-5 py-4 text-secondary">{document.folder}</td>
                  <td className="px-5 py-4 text-secondary">{document.uploadedBy}</td>
                  <td className="px-5 py-4 text-secondary">{document.date}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="rounded-lg p-2 text-secondary transition hover:bg-[var(--color-bg-secondary)] hover:text-foreground"
                        aria-label={`View ${document.fileName}`}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="rounded-lg p-2 text-secondary transition hover:bg-[var(--color-bg-secondary)] hover:text-foreground"
                        aria-label={`Download ${document.fileName}`}
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="rounded-lg p-2 text-secondary transition hover:bg-[var(--color-bg-secondary)] hover:text-error"
                        aria-label={`Delete ${document.fileName}`}
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
