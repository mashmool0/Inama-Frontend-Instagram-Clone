'use client'

import { Heart, MessageCircle, UserPlus } from 'lucide-react'

import { Avatar } from '@/components/ui/Avatar'
import { formatRelativeTimeFa } from '@/lib/format'
import { apiErrorMessage } from '@/lib/api-error'
import { useProfilesMap } from '@/features/profiles/hooks'
import { useMarkAllNotificationsReadMutation, useMarkNotificationReadMutation, useNotificationsInfiniteQuery } from '../hooks'

export function NotificationsPage() {
  const notificationsQuery = useNotificationsInfiniteQuery()
  const notifications = notificationsQuery.data?.pages.flatMap((page) => page.notifications) ?? []
  const actorIds = notifications.map((notification) => notification.actor_id)
  const { data: profilesMap } = useProfilesMap(actorIds)
  const markOneMutation = useMarkNotificationReadMutation()
  const markAllMutation = useMarkAllNotificationsReadMutation()

  const todayNotifications = notifications.slice(0, 3)
  const earlierNotifications = notifications.slice(3)

  const getIcon = (type: string) => {
    switch (type) {
      case 'LIKE':
        return <Heart className="w-5 h-5 text-red-500 fill-red-500" />
      case 'COMMENT':
        return <MessageCircle className="w-5 h-5 text-primary" />
      case 'FOLLOW':
        return <UserPlus className="w-5 h-5 text-green-500" />
      default:
        return null
    }
  }

  const renderRow = (notificationId: string) => {
    const notification = notifications.find((item) => item.id === notificationId)
    if (!notification) return null
    const actor = profilesMap[notification.actor_id]
    return (
      <button
        key={notification.id}
        onClick={() => markOneMutation.mutate(notification.id)}
        className={`w-full flex items-start gap-4 p-4 rounded-xl transition-colors text-right ${
          !notification.is_read ? 'bg-primary/5 border border-primary/20 hover:bg-primary/10' : 'bg-card border border-border hover:bg-accent'
        }`}
      >
        <div className="relative">
          <Avatar size="md" src={actor?.avatar_url} />
          <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-card rounded-full flex items-center justify-center border border-border">
            {getIcon(notification.type)}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm">
            <span className="font-bold">{actor?.username || 'کاربر اینما'}</span>{' '}
            <span className="text-muted-foreground">
              {notification.type === 'LIKE' && 'پست شما را پسندید'}
              {notification.type === 'COMMENT' && 'روی پست شما نظر گذاشت'}
              {notification.type === 'FOLLOW' && 'شما را دنبال کرد'}
            </span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">{formatRelativeTimeFa(notification.created_at)}</p>
        </div>
      </button>
    )
  }

  return (
    <main className="flex-1 max-w-2xl mx-auto py-6 px-4 pb-24 md:pb-6">
      <div className="mb-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">اعلان‌ها</h1>
          <button onClick={() => markAllMutation.mutate()} className="text-sm text-primary hover:underline">
            خواندن همه
          </button>
        </div>

        {(notificationsQuery.isError || markOneMutation.isError || markAllMutation.isError) && (
          <p role="alert" className="mb-4 text-sm text-red-500">
            {apiErrorMessage(notificationsQuery.error || markOneMutation.error || markAllMutation.error, 'عملیات اعلان‌ها انجام نشد.')}
          </p>
        )}

        {!notificationsQuery.isLoading && notifications.length === 0 && (
          <div className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">هنوز اعلانی ندارید.</div>
        )}

        <div className="space-y-6">
          <div>
            <h2 className="text-sm font-bold text-muted-foreground mb-3 px-2">امروز</h2>
            <div className="space-y-2">{todayNotifications.map((item) => renderRow(item.id))}</div>
          </div>

          <div>
            <h2 className="text-sm font-bold text-muted-foreground mb-3 px-2">قبل‌تر</h2>
            <div className="space-y-2">{earlierNotifications.map((item) => renderRow(item.id))}</div>
          </div>
        </div>
      </div>
    </main>
  )
}
