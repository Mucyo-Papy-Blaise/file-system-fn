"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { notificationApi } from "@/api/notification.api";
import { useAuth } from "@/lib/auth-context";
import { useSocket } from "@/lib/socket-context";
import type { Notification } from "@/types/notification";
import { NotificationType } from "@/types/notification";
import {
  notificationFromSharePayload,
} from "@/lib/share-notification-utils";

interface NotificationContextValue {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(
  undefined,
);

function normalizeSocketNotification(payload: unknown): Notification | null {
  if (!payload || typeof payload !== "object") return null;
  const record = payload as Record<string, unknown>;
  if (
    typeof record.id !== "string" ||
    typeof record.title !== "string" ||
    typeof record.message !== "string"
  ) {
    return null;
  }

  return {
    id: record.id,
    title: record.title,
    message: record.message,
    isRead: Boolean(record.isRead),
    link: typeof record.link === "string" ? record.link : null,
    createdAt:
      typeof record.createdAt === "string"
        ? record.createdAt
        : record.createdAt instanceof Date
          ? record.createdAt.toISOString()
          : new Date().toISOString(),
    type:
      (record.type as NotificationType) ?? NotificationType.DOCUMENT_SHARED,
  };
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const { on, off, isConnected } = useSocket();
  const queryClient = useQueryClient();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const refreshNotifications = useCallback(async () => {
    try {
      const result = await notificationApi.getNotifications();
      setNotifications(result.notifications);
      setUnreadCount(result.unreadCount);
      await queryClient.invalidateQueries({ queryKey: ["notifications"] });
      await queryClient.invalidateQueries({ queryKey: ["notifications", "unread"] });
    } catch (error) {
      console.error("Failed to load notifications:", error);
    }
  }, [queryClient]);

  useEffect(() => {
    if (!isAuthenticated) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    void refreshNotifications();
  }, [isAuthenticated, refreshNotifications]);

  useEffect(() => {
    if (isAuthenticated && isConnected) {
      void refreshNotifications();
    }
  }, [isAuthenticated, isConnected, refreshNotifications]);

  const markAsRead = useCallback(
    async (id: string) => {
      if (id.startsWith("share-")) {
        setNotifications((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, isRead: true } : item,
          ),
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
        return;
      }

      await notificationApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, isRead: true } : item,
        ),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      await queryClient.invalidateQueries({ queryKey: ["notifications"] });
      await queryClient.invalidateQueries({ queryKey: ["notifications", "unread"] });
    },
    [queryClient],
  );

  const markAllAsRead = useCallback(async () => {
    await notificationApi.markAllAsRead();
    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
    setUnreadCount(0);
    await queryClient.invalidateQueries({ queryKey: ["notifications"] });
    await queryClient.invalidateQueries({ queryKey: ["notifications", "unread"] });
  }, [queryClient]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const handleNotificationNew = (payload: unknown) => {
      const notification = normalizeSocketNotification(payload);
      if (!notification) {
        void refreshNotifications();
        return;
      }

      setNotifications((prev) => {
        if (prev.some((item) => item.id === notification.id)) return prev;
        return [notification, ...prev];
      });
      setUnreadCount((prev) => prev + 1);
      toast.info(notification.title);
      void queryClient.invalidateQueries({ queryKey: ["notifications"] });
      void queryClient.invalidateQueries({ queryKey: ["notifications", "unread"] });
    };

    const handleShareNew = (payload: unknown) => {
      const fallback = notificationFromSharePayload(payload);
      const record =
        payload && typeof payload === "object"
          ? (payload as { sharedBy?: { name?: string } })
          : null;
      const name = record?.sharedBy?.name ?? "Someone";
      toast.info(`${name} shared a document with you`);

      if (fallback && !fallback.isRead) {
        setNotifications((prev) => {
          if (prev.some((item) => item.id === fallback.id)) return prev;
          return [fallback, ...prev];
        });
        setUnreadCount((prev) => prev + 1);
      }

      void refreshNotifications();
      void queryClient.invalidateQueries({ queryKey: ["inbox"] });
      void queryClient.invalidateQueries({ queryKey: ["notifications"] });
      void queryClient.invalidateQueries({ queryKey: ["notifications", "unread"] });
    };

    const handleShareReply = (payload: unknown) => {
      const record =
        payload && typeof payload === "object"
          ? (payload as {
              replies?: Array<{ user?: { name?: string } }>;
            })
          : null;
      const lastReply = record?.replies?.[record.replies.length - 1];
      const name = lastReply?.user?.name ?? "Someone";
      toast.info(`${name} replied to your share`);
      void refreshNotifications();
      void queryClient.invalidateQueries({ queryKey: ["inbox"] });
      void queryClient.invalidateQueries({ queryKey: ["sent"] });
    };

    const handleInboxReady = () => {
      toast.success("Your documents are ready to review");
      void queryClient.invalidateQueries({ queryKey: ["tray"] });
    };

    const handleTrayUpdated = () => {
      void queryClient.invalidateQueries({ queryKey: ["tray"] });
    };

    const handleTrayProcessing = (payload: unknown) => {
      const count =
        payload && typeof payload === "object" && "count" in payload
          ? Number((payload as { count?: number }).count)
          : 0;
      if (count > 0) {
        toast.info(
          `${count} document${count === 1 ? "" : "s"} queued — track progress in Tray`,
        );
      }
      void queryClient.invalidateQueries({ queryKey: ["tray"] });
    };

    on("notification:new", handleNotificationNew);
    on("share:new", handleShareNew);
    on("share:reply", handleShareReply);
    on("inbox:ready", handleInboxReady);
    on("tray:updated", handleTrayUpdated);
    on("tray:processing", handleTrayProcessing);

    return () => {
      off("notification:new", handleNotificationNew);
      off("share:new", handleShareNew);
      off("share:reply", handleShareReply);
      off("inbox:ready", handleInboxReady);
      off("tray:updated", handleTrayUpdated);
      off("tray:processing", handleTrayProcessing);
    };
  }, [
    isAuthenticated,
    on,
    off,
    queryClient,
    refreshNotifications,
  ]);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      refreshNotifications,
    }),
    [notifications, unreadCount, markAsRead, markAllAsRead, refreshNotifications],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotificationContext must be used within NotificationProvider");
  }
  return context;
}
