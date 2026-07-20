'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Settings, Grid, Bookmark, Tag } from 'lucide-react'

import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/features/auth/store'
import { apiErrorMessage } from '@/lib/api-error'
import { formatCompactFa } from '@/lib/format'
import { useFollowMutation, useProfileByUsernameQuery, useUnfollowMutation } from '../hooks'

export function ProfilePage() {
  const router = useRouter()
  const params = useParams<{ username: string }>()
  const currentProfile = useAuthStore((state) => state.profile)
  const requestedUsername = params.username === 'me' ? currentProfile?.username : params.username
  const profileQuery = useProfileByUsernameQuery(requestedUsername)
  const profile = profileQuery.data || (requestedUsername === currentProfile?.username ? currentProfile : undefined)
  const isOwnProfile = profile?.id === currentProfile?.id
  const [activeTab, setActiveTab] = useState<'posts' | 'saved' | 'tagged'>('posts')
  const [isFollowing, setIsFollowing] = useState(false)
  const followMutation = useFollowMutation(profile?.id || '')
  const unfollowMutation = useUnfollowMutation(profile?.id || '')

  const tabs = [
    { id: 'posts', label: 'پست‌ها', icon: Grid },
    { id: 'saved', label: 'ذخیره شده', icon: Bookmark },
    { id: 'tagged', label: 'تگ شده', icon: Tag },
  ]

  return (
    <main className="flex-1 max-w-4xl mx-auto py-8 px-4 pb-24 md:pb-8">
      <div className="mb-8">
        <div className="relative h-48 bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 rounded-2xl mb-6"></div>

        <div className="flex items-start justify-between px-6 -mt-16">
          <div className="flex items-end gap-6">
            <Avatar src={profile?.avatar_url} size="xl" className="border-4 border-card shadow-xl" />
            <div className="mb-2">
              <h1 className="text-2xl font-bold">{profile?.username || 'کاربر اینما'}</h1>
              <p className="text-muted-foreground">@{profile?.username || 'unknown'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-16">
            {isOwnProfile ? (
              <>
                <Button onClick={() => router.push('/profile/edit')}>ویرایش پروفایل</Button>
                <Button variant="outline" size="md" className="px-3" onClick={() => router.push('/settings')}>
                  <Settings className="w-5 h-5" />
                </Button>
              </>
            ) : (
              !isFollowing ? (
                <Button onClick={() => (profile ? followMutation.mutate(undefined, { onSuccess: () => setIsFollowing(true) }) : undefined)}>دنبال کنید</Button>
              ) : (
                <Button variant="outline" onClick={() => (profile ? unfollowMutation.mutate(undefined, { onSuccess: () => setIsFollowing(false) }) : undefined)}>
                  لغو دنبال‌کردن
                </Button>
              )
            )}
          </div>
        </div>

        <div className="px-6 mt-6">
          {profileQuery.isError && <p role="alert" className="mb-4 text-sm text-red-500">{apiErrorMessage(profileQuery.error, 'بارگذاری پروفایل انجام نشد.')}</p>}
          {(followMutation.isError || unfollowMutation.isError) && (
            <p role="alert" className="mb-4 text-sm text-red-500">{apiErrorMessage(followMutation.error || unfollowMutation.error, 'تغییر وضعیت دنبال‌کردن انجام نشد.')}</p>
          )}
          <p className="text-foreground mb-4 leading-relaxed">{profile?.bio || 'بیوگرافی ثبت نشده است.'}</p>

          <div className="flex items-center gap-8">
            <div className="text-center">
              <span className="block text-xl font-bold">{formatCompactFa(0)}</span>
              <span className="text-sm text-muted-foreground">پست</span>
            </div>
            <button className="text-center hover:opacity-80 transition-opacity">
              <span className="block text-xl font-bold">{formatCompactFa(profile?.follower_count || 0)}</span>
              <span className="text-sm text-muted-foreground">دنبال‌کننده</span>
            </button>
            <button className="text-center hover:opacity-80 transition-opacity">
              <span className="block text-xl font-bold">{formatCompactFa(profile?.following_count || 0)}</span>
              <span className="text-sm text-muted-foreground">دنبال شده</span>
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="flex items-center justify-center gap-12 px-6">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'posts' | 'saved' | 'tagged')}
                className={`flex items-center gap-2 py-4 border-t-2 transition-colors ${
                  activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-bold text-sm">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-6">
        {activeTab === 'posts' && (
          <div className="text-center py-12 text-muted-foreground">سرویس پست‌ها در حال حاضر در دسترس نیست.</div>
        )}
        {activeTab === 'saved' && (
          <div className="text-center py-12">
            <Bookmark className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">هنوز پستی ذخیره نکرده‌اید</p>
          </div>
        )}
        {activeTab === 'tagged' && (
          <div className="text-center py-12">
            <Tag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">هنوز در پستی تگ نشده‌اید</p>
          </div>
        )}
      </div>
    </main>
  )
}
