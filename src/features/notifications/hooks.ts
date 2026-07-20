'use client'

import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { getNotifications, markAllRead, markAsRead } from './api'

export function useNotificationsInfiniteQuery() {
  return useInfiniteQuery({
    queryKey: ['notifications'],
    queryFn: ({ pageParam }: { pageParam?: string }) => getNotifications({ cursor: pageParam, limit: 20 }),
    initialPageParam: '',
    getNextPageParam: (lastPage) => lastPage.next_cursor || undefined,
  })
}

export function useMarkNotificationReadMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (notificationId: string) => markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

export function useMarkAllNotificationsReadMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: markAllRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}
