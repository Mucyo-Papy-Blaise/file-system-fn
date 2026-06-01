"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  FolderOpen,
  Layers2,
  Library,
  MessageSquare,
  Share2,
} from "lucide-react";
import { useNotificationContext } from "@/lib/notification-context";
import { useGetInbox } from "@/lib/hooks/useSharing";
import { formatTimeAgo } from "@/lib/format-time";
import { notificationFromDocumentShare } from "@/lib/share-notification-utils";
import { NotificationType } from "@/types/notification";
import type { Notification } from "@/types/notification";

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
    case NotificationType.INVITATION_RECEIVED:
    default:
      return { icon: Bell, className: "text-secondary" };
  }
}

function truncateMessage(message: string, max = 80) {
  if (message.length <= max) return message;
  return `${message.slice(0, max).trim()}…`;
}

export function NotificationBell() {
  const router = useRouter();
  const { notifications, unreadCount, markAsRead, markAllAsRead, refreshNotifications } =
    useNotificationContext();
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const { shares: inboxShares } = useGetInbox();

  const inboxUnreadNotifications = useMemo(
    () =>
      inboxShares
        .filter((share) => !share.isRead)
        .map((share) => notificationFromDocumentShare(share)),
    [inboxShares],
  );

  const displayNotifications = useMemo(() => {
    if (notifications.length > 0) {
      return notifications.slice(0, 10);
    }
    return inboxUnreadNotifications.slice(0, 10);
  }, [notifications, inboxUnreadNotifications]);

  const badgeCount = Math.max(unreadCount, inboxUnreadNotifications.length);

  useEffect(() => {
    if (isOpen) {
      void refreshNotifications();
    }
  }, [isOpen, refreshNotifications]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }
    if (notification.link) {
      router.push(notification.link);
    }
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative rounded-xl p-2 text-secondary transition hover:bg-[var(--color-bg-secondary)] hover:text-foreground"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {badgeCount > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {badgeCount > 99 ? "99+" : badgeCount}
          </span>
        ) : null}
      </button>

      {isOpen ? (
        <div className="absolute right-0 z-50 mt-2 w-[min(100vw-2rem,22rem)] overflow-hidden rounded-2xl border border-default bg-surface shadow-lg">
          <div className="flex items-center justify-between border-b border-default px-4 py-3">
            <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
            {badgeCount > 0 ? (
              <button
                type="button"
                onClick={() => void markAllAsRead()}
                className="text-xs font-medium text-primary hover:underline"
              >
                Mark all read
              </button>
            ) : null}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {displayNotifications.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-secondary">
                No notifications yet
              </p>
            ) : (
              displayNotifications.map((notification) => {
                const { icon: Icon, className } = getNotificationIcon(
                  notification.type,
                );

                return (
                  <button
                    key={notification.id}
                    type="button"
                    onClick={() => void handleNotificationClick(notification)}
                    className="flex w-full items-start gap-3 border-b border-default px-4 py-3 text-left transition hover:bg-[var(--color-bg-secondary)]"
                  >
                    <div
                      className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--color-bg-secondary)] ${className}`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className={[
                          "truncate text-sm text-foreground",
                          !notification.isRead ? "font-semibold" : "font-medium",
                        ].join(" ")}
                      >
                        {notification.title}
                      </p>
                      <p className="mt-0.5 line-clamp-2 text-xs text-secondary">
                        {truncateMessage(notification.message)}
                      </p>
                      <p className="mt-1 text-[10px] text-secondary">
                        {formatTimeAgo(notification.createdAt)}
                      </p>
                    </div>
                    {!notification.isRead ? (
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    ) : null}
                  </button>
                );
              })
            )}
          </div>

          <div className="border-t border-default px-4 py-3">
            <Link
              href="/dashboard/notifications"
              onClick={() => setIsOpen(false)}
              className="text-xs font-semibold text-primary hover:underline"
            >
              View all notifications
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
