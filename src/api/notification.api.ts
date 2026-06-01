import { apiClient } from "@/api/api-client";
import type { ApiSuccessEnvelope } from "@/types/http";
import type { Notification } from "@/types/notification";
import { NotificationType } from "@/types/notification";

type NotificationApiRecord = {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  link?: string | null;
  createdAt: string;
  type: NotificationType;
};

function normalizeNotification(notification: NotificationApiRecord): Notification {
  return {
    id: notification.id,
    title: notification.title,
    message: notification.message,
    isRead: notification.isRead,
    link: notification.link ?? null,
    createdAt: notification.createdAt,
    type: notification.type,
  };
}

type NotificationsListApiResponse = {
  notifications: NotificationApiRecord[];
  unreadCount: number;
};

export const notificationApi = {
  async getNotifications(): Promise<{
    notifications: Notification[];
    unreadCount: number;
  }> {
    const response = await apiClient.get<
      ApiSuccessEnvelope<NotificationsListApiResponse>
    >("/notifications");

    const payload = response.data;
    const records = Array.isArray(payload?.notifications)
      ? payload.notifications
      : [];
    const notifications = records.map(normalizeNotification);
    const unreadCount =
      typeof payload?.unreadCount === "number"
        ? payload.unreadCount
        : notifications.filter((item) => !item.isRead).length;

    return { notifications, unreadCount };
  },

  async getUnreadCount(): Promise<number> {
    const response = await apiClient.get<ApiSuccessEnvelope<number>>(
      "/notifications/unread-count",
    );

    return response.data;
  },

  async markAsRead(id: string): Promise<Notification> {
    const response = await apiClient.patch<ApiSuccessEnvelope<NotificationApiRecord>>(
      `/notifications/${encodeURIComponent(id)}/read`,
    );

    return normalizeNotification(response.data);
  },

  async markAllAsRead(): Promise<{ count: number }> {
    const response = await apiClient.patch<ApiSuccessEnvelope<{ count: number }>>(
      "/notifications/read-all",
    );

    return response.data;
  },
};
