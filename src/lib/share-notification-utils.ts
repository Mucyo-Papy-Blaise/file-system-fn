import type { Notification } from "@/types/notification";
import { NotificationType } from "@/types/notification";
import type { DocumentShare } from "@/types/sharing";

function parseCreatedAt(value: unknown): string {
  if (typeof value === "string") return value;
  if (value instanceof Date) return value.toISOString();
  return new Date().toISOString();
}

export function notificationFromSharePayload(payload: unknown): Notification | null {
  if (!payload || typeof payload !== "object") return null;
  const share = payload as {
    id?: string;
    message?: string | null;
    isRead?: boolean;
    createdAt?: unknown;
    sharedBy?: { name?: string };
    document?: { title?: string; fileName?: string };
    collection?: { name?: string };
  };

  const senderName = share.sharedBy?.name ?? "Someone";
  const hasDocument = Boolean(share.document);
  const itemLabel = hasDocument
    ? share.document?.title || share.document?.fileName || "document"
    : share.collection?.name || "collection";

  return {
    id: `share-${share.id ?? Date.now()}`,
    title: `${senderName} shared a ${hasDocument ? "document" : "collection"} with you`,
    message:
      share.message?.trim() ||
      `${senderName} shared "${itemLabel}" with you.`,
    isRead: Boolean(share.isRead),
    link: "/dashboard/inbox",
    createdAt: parseCreatedAt(share.createdAt),
    type: hasDocument
      ? NotificationType.DOCUMENT_SHARED
      : NotificationType.COLLECTION_SHARED,
  };
}

export function notificationFromDocumentShare(share: DocumentShare): Notification {
  return (
    notificationFromSharePayload(share) ?? {
      id: `share-${share.id}`,
      title: "New shared item",
      message: "You have a new share in your inbox.",
      isRead: share.isRead,
      link: "/dashboard/inbox",
      createdAt: share.createdAt,
      type: NotificationType.DOCUMENT_SHARED,
    }
  );
}
