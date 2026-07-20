import { apiClient } from '@/lib/api-client'
import type { NotificationPage } from '@/types/notification'

interface CursorParams {
  cursor?: string
  limit?: number
}

export async function getNotifications(params: CursorParams = {}) {
  const { data } = await apiClient.get<NotificationPage>('/notifications', { params })
  return data
}

export async function markAsRead(notificationId: string) {
  const { data } = await apiClient.post<{ success: boolean }>(`/notifications/${notificationId}/read`)
  return data
}

export async function markAllRead() {
  const { data } = await apiClient.post<{ success: boolean }>('/notifications/read-all')
  return data
}
