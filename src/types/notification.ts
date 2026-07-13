export type NotificationType = 'LIKE' | 'COMMENT' | 'FOLLOW'

export interface NotificationRecord {
  id: string
  type: NotificationType
  actor_id: string
  post_id: string
  is_read: boolean
  created_at: string
}

export interface NotificationPage {
  notifications: NotificationRecord[]
  next_cursor: string
}
