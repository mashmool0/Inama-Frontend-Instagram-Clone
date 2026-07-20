'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Settings, Grid, Bookmark, Tag } from 'lucide-react'

import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/features/auth/store'
import { useExploreInfiniteQuery } from '@/features/feed/hooks'
import { formatCompactFa } from '@/lib/format'
import { useFollowMutation, useProfileByUsernameQuery, useUnfollowMutation } from '../hooks'

export function ProfilePage() {
  const router = useRouter()
  const params = useParams<{ username: string }>()
  const currentProfile = useAuthStore((state) => state.profile)
  const requestedUsername = params.username === 'me' ? currentProfile?.username : params.username
  const profileQuery = useProfileByUsernameQuery(requestedUsername)
  const profile = profileQuery.data || currentProfile
  const isOwnProfile = profile?.id === currentProfile?.id
  const [activeTab, setActiveTab] = useState<'posts' | 'saved' | 'tagged'>('posts')
  const exploreQuery = useExploreInfiniteQuery()
  const authoredPosts = useMemo(() => {
    const allExplorePosts = exploreQuery.data?.pages.flatMap((page) => page.posts) ?? []
    return allExplorePosts.filter((post) => post.author_id === profile?.id).slice(0, 12)
  }, [exploreQuery.data, profile?.id])
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
              <Button onClick={() => (profile ? followMutation.mutate() : undefined)}>دنبال کنید</Button>
            )}
            {!isOwnProfile && (
              <Button variant="outline" onClick={() => (profile ? unfollowMutation.mutate() : undefined)}>
                لغو دنبال‌کردن
              </Button>
            )}
          </div>
        </div>

        <div className="px-6 mt-6">
          <p className="text-foreground mb-4 leading-relaxed">{profile?.bio || 'بیوگرافی ثبت نشده است.'}</p>

          <div className="flex items-center gap-8">
            <div className="text-center">
              <span className="block text-xl font-bold">{formatCompactFa(authoredPosts.length)}</span>
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
          <div className="grid grid-cols-3 gap-1">
            {authoredPosts.map((post) => (
              <Link key={post.id} href={`/posts/${post.id}`} className="aspect-square bg-muted rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                <img src={post.media_url} alt="" className="w-full h-full object-cover" />
              </Link>
            ))}
          </div>
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
