"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  FolderOpen,
  Layers2,
  Library,
  MessageSquare,
  Share2,
} from "lucide-react";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { useNotificationContext } from "@/lib/notification-context";
import { useGetNotifications } from "@/lib/hooks/useNotifications";
import { formatTimeAgo } from "@/lib/format-time";
import { NotificationType } from "@/types/notification";
import type { Notification } from "@/types/notification";

const PAGE_SIZE = 15;

type FilterKey = "all" | "unread" | NotificationType;

function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case NotificationType.DOCUMENT_SHARED:
      return { icon: Share2, className: "text-blue-600" };
    case NotificationType.COLLECTION_SHARED:
      return { icon: Library, className: "text-purple-600" };
    case NotificationType.SHARED_SPACE_UPDATED:
      return { icon: FolderOpen, className: "text-emerald-600" };
    case NotificationType.BULK_UPLOAD_READY:
      return { icon: Layers2, className: "text-amber-600" };
    case NotificationType.REPLY_RECEIVED:
      return { icon: MessageSquare, className: "text-teal-600" };
    default:
      return { icon: Bell, className: "text-secondary" };
  }
}

const typeFilters: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: NotificationType.DOCUMENT_SHARED, label: "Documents" },
  { key: NotificationType.COLLECTION_SHARED, label: "Collections" },
  { key: NotificationType.SHARED_SPACE_UPDATED, label: "Shared spaces" },
  { key: NotificationType.BULK_UPLOAD_READY, label: "Uploads" },
  { key: NotificationType.REPLY_RECEIVED, label: "Replies" },
];

export default function DashboardNotificationsPage() {
  const router = useRouter();
  const { markAsRead, markAllAsRead } = useNotificationContext();
  const { notifications, isLoading } = useGetNotifications();
  const [filter, setFilter] = useState<FilterKey>("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (filter === "all") return notifications;
    if (filter === "unread") return notifications.filter((item) => !item.isRead);
    return notifications.filter((item) => item.type === filter);
  }, [notifications, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const handleClick = async (notification: Notification) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }
    if (notification.link) {
      router.push(notification.link);
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {typeFilters.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => {
                setFilter(item.key);
                setPage(1);
              }}
              className={[
                "rounded-full px-3 py-1.5 text-xs font-semibold transition",
                filter === item.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-[var(--color-bg-secondary)] text-secondary hover:text-foreground",
              ].join(" ")}
            >
              {item.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => void markAllAsRead()}
          className="rounded-xl border border-default px-4 py-2 text-sm font-medium text-foreground transition hover:bg-[var(--color-bg-secondary)]"
        >
          Mark all as read
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, index) => (
            <div key={index}>
              <LoadingSkeleton height={88} rounded="1rem" />
            </div>
          ))}
        </div>
      ) : paginated.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-default bg-surface px-6 py-12 text-center">
          <h3 className="text-xl font-semibold text-foreground">
            You are all caught up!
          </h3>
          <p className="mt-2 max-w-md text-sm text-secondary">
            New alerts about shares, uploads, and team activity will show up here.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {paginated.map((notification) => {
            const { icon: Icon, className } = getNotificationIcon(
              notification.type,
            );

            return (
              <button
                key={notification.id}
                type="button"
                onClick={() => void handleClick(notification)}
                className="flex w-full items-start gap-4 rounded-2xl border border-default bg-surface p-4 text-left transition hover:border-primary/30 hover:bg-[var(--color-bg-secondary)]/40"
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-bg-secondary)] ${className}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className={[
                      "text-sm text-foreground",
                      !notification.isRead ? "font-semibold" : "font-medium",
                    ].join(" ")}
                  >
                    {notification.title}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-secondary">
                    {notification.message}
                  </p>
                  <p className="mt-2 text-xs text-secondary">
                    {formatTimeAgo(notification.createdAt)}
                  </p>
                </div>
                {!notification.isRead ? (
                  <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
                ) : null}
              </button>
            );
          })}
        </div>
      )}

      {totalPages > 1 && !isLoading ? (
        <div className="flex items-center justify-between border-t border-default pt-4">
          <p className="text-sm text-secondary">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              className="rounded-lg border border-default px-3 py-1.5 text-sm disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              className="rounded-lg border border-default px-3 py-1.5 text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
