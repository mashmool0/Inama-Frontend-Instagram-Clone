'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Clock, Hash, Search as SearchIcon, X } from 'lucide-react'

import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { useFollowMutation } from '@/features/profiles/hooks'
import { useSearchInfiniteQuery } from '../hooks'

export function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'users' | 'hashtags' | 'posts'>('users')
  const recentSearches = [
    { type: 'user', text: '@reza.photo' },
    { type: 'hashtag', text: '#عکاسی' },
    { type: 'user', text: '@sara.art' },
    { type: 'hashtag', text: '#طبیعت' },
  ]

  const queryType = useMemo(() => {
    if (activeTab === 'users') return 'USER' as const
    if (activeTab === 'hashtags') return 'HASHTAG' as const
    return 'TEXT' as const
  }, [activeTab])

  const searchQueryResult = useSearchInfiniteQuery(searchQuery, queryType)
  const results = searchQueryResult.data?.pages.flatMap((page) => page.users) ?? []
  const postResults = searchQueryResult.data?.pages.flatMap((page) => page.posts) ?? []

  return (
    <main className="flex-1 max-w-2xl mx-auto py-6 px-4 pb-24 md:pb-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">جستجو</h1>

        <div className="relative">
          <SearchIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="جستجوی کاربران، هشتگ‌ها و پست‌ها..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-14 pr-12 pl-4 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {!searchQuery && (
          <div className="mt-6 bg-card border border-border rounded-2xl p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-muted-foreground" />
              جستجوهای اخیر
            </h3>
            <div className="space-y-2">
              {recentSearches.map((search, index) => (
                <button key={index} className="w-full flex items-center justify-between p-3 hover:bg-accent rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    {search.type === 'hashtag' ? <Hash className="w-5 h-5 text-primary" /> : <Avatar size="sm" />}
                    <span>{search.text}</span>
                  </div>
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        )}

        {searchQuery && (
          <div className="mt-6">
            <div className="mb-6 rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
              سرویس جستجو در حال حاضر در دسترس نیست.
            </div>
            <div className="flex items-center gap-4 mb-6 border-b border-border">
              {[
                ['users', 'کاربران'],
                ['hashtags', 'هشتگ‌ها'],
                ['posts', 'پست‌ها'],
              ].map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as 'users' | 'hashtags' | 'posts')}
                  className={`pb-3 px-2 font-bold text-sm transition-colors border-b-2 ${
                    activeTab === key ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {activeTab === 'users' && (
              <div className="space-y-3">
                {results.map((user) => (
                  <UserSearchRow key={user.user_id} user={user} />
                ))}
              </div>
            )}

            {activeTab === 'hashtags' && (
              <div className="space-y-3">
                {searchQueryResult.data?.pages.flatMap((page) => page.posts).slice(0, 8).map((post, index) => {
                  const tag = post.caption.match(/#(\S+)/)?.[1] || searchQuery.replace('#', '')
                  return (
                    <button key={`${tag}-${index}`} className="w-full flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors text-right">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center">
                        <Hash className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-bold">#{tag}</p>
                        <p className="text-sm text-muted-foreground">{index + 1} نتیجه</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}

            {activeTab === 'posts' && (
              <div className="grid grid-cols-3 gap-1">
                {postResults.map((post) => (
                  <Link key={post.id} href={`/posts/${post.id}`} className="aspect-square bg-muted rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                    <img src={post.media_url} alt="" className="w-full h-full object-cover" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}

function UserSearchRow({ user }: { user: { user_id: string; username: string; avatar_url: string } }) {
  const followMutation = useFollowMutation(user.user_id)

  return (
    <div className="flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors">
      <div className="flex items-center gap-3">
        <Avatar size="md" src={user.avatar_url} />
        <div>
          <p className="font-bold">{user.username}</p>
          <p className="text-sm text-muted-foreground">@{user.username}</p>
        </div>
      </div>
      <Button variant="primary" size="sm" onClick={() => followMutation.mutate()}>
        دنبال کنید
      </Button>
    </div>
  )
}
