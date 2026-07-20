import { apiClient } from '@/lib/api-client'
import type { NotificationPage } from '@/types/notification'

interface CursorParams {
  cursor?: string
  limit?: number
}

export async function getNotifications(params: CursorParams = {}) {
  const { data } = await apiClient.get<BackendNotificationPage>('/notifications', { params })
  return {
    next_cursor: data.next_cursor || '',
    notifications: (data.notifications || []).map((notification) => ({
      ...notification,
      type: normalizeNotificationType(notification.type),
      created_at: normalizeTimestamp(notification.created_at),
    })),
  } satisfies NotificationPage
}

type BackendTimestamp = string | { seconds?: number | string; nanos?: number }

type BackendNotification = Omit<NotificationPage['notifications'][number], 'type' | 'created_at'> & {
  type: number | string
  created_at: BackendTimestamp
}

interface BackendNotificationPage {
  notifications?: BackendNotification[]
  next_cursor?: string
}

function normalizeNotificationType(type: number | string) {
  if (type === 1 || String(type).endsWith('LIKE')) return 'LIKE' as const
  if (type === 2 || String(type).endsWith('COMMENT')) return 'COMMENT' as const
  return 'FOLLOW' as const
}

function normalizeTimestamp(value: BackendTimestamp) {
  if (typeof value === 'string') return value
  const seconds = Number(value.seconds || 0)
  return new Date(seconds * 1000 + (value.nanos || 0) / 1_000_000).toISOString()
}

export async function markAsRead(notificationId: string) {
  const { data } = await apiClient.post<{ success: boolean }>(`/notifications/${notificationId}/read`)
  return data
}

export async function markAllRead() {
  const { data } = await apiClient.post<{ success: boolean }>('/notifications/read-all')
  return data
}
