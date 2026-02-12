export interface NotificationSender {
  id: string;
  username: string | null;
  avatar_url: string | null;
}

export type NotificationType =
  | 'like'
  | 'comment'
  | 'follow'
  | 'system'
  | string; // fallback for any server-defined type

export interface NotificationItem {
  id: string;
  type: NotificationType;
  message: string;
  entity_id: string | null;
  is_read: boolean;
  created_at: string; // ISO timestamp returned by Supabase
  sender: NotificationSender | null;
}

export type GetNotificationsResponse = NotificationItem[];
