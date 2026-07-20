'use client'

import { useMemo } from 'react'
import { motion } from 'motion/react'
import { Plus } from 'lucide-react'

import { SuggestionsPanel } from '@/components/layout/SuggestionsPanel'
import { Spinner } from '@/components/ui/Spinner'
import { Avatar } from '@/components/ui/Avatar'
import { formatRelativeTimeFa } from '@/lib/format'
import { useFeedInfiniteQuery } from '../hooks'
import { useProfilesMap } from '@/features/profiles/hooks'
import { Post } from '@/features/posts/components/PostCard'
import { useAddCommentMutation, useLikePostMutation } from '@/features/posts/hooks'

export function FeedPage() {
  const feedQuery = useFeedInfiniteQuery()
  const posts = useMemo(() => feedQuery.data?.pages.flatMap((page) => page.posts) ?? [], [feedQuery.data])
  const authorIds = useMemo(() => posts.map((post) => post.author_id), [posts])
  const { data: profilesMap, isLoading: profilesLoading } = useProfilesMap(authorIds)

  const stories = [
    { id: 1, username: 'story1', hasNew: true },
    { id: 2, username: 'story2', hasNew: true },
    { id: 3, username: 'story3', hasNew: false },
    { id: 4, username: 'story4', hasNew: true },
    { id: 5, username: 'story5', hasNew: false },
    { id: 6, username: 'story6', hasNew: true },
  ]

  if (feedQuery.isLoading || profilesLoading) {
    return (
      <main className="flex-1 max-w-2xl mx-auto py-6 px-4 pb-24 md:pb-6">
        <div className="mb-8 flex gap-3 overflow-hidden animate-pulse">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2 flex-shrink-0">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-muted rounded-full"></div>
              <div className="w-10 h-2.5 bg-muted rounded"></div>
            </div>
          ))}
        </div>
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl overflow-hidden animate-pulse">
              <div className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-muted rounded-full"></div>
                <div className="flex-1">
                  <div className="w-32 h-4 bg-muted rounded mb-2"></div>
                  <div className="w-20 h-3 bg-muted rounded"></div>
                </div>
              </div>
              <div className="w-full aspect-square bg-muted"></div>
            </div>
          ))}
        </div>
      </main>
    )
  }

  return (
    <>
      <main className="flex-1 w-full max-w-2xl mx-auto py-4 md:py-6 px-3 md:px-4 pb-24 md:pb-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 md:mb-8">
          <div className="relative flex gap-3 md:gap-4 overflow-x-auto pb-2 scrollbar-hide px-1">
            <motion.div whileHover={{ y: -5 }} whileTap={{ scale: 0.95 }} className="flex flex-col items-center gap-2 flex-shrink-0">
              <div className="relative group cursor-pointer">
                <motion.div whileHover={{ scale: 1.1 }} className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-tr from-primary via-accent to-primary/60 rounded-full blur-md opacity-60 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-muted/50 to-muted/30 backdrop-blur-sm flex items-center justify-center">
                    <Avatar size="md" className="w-12 h-12 md:w-14 md:h-14" />
                  </div>
                  <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.3 }} className="absolute -bottom-0.5 -left-0.5 w-5 h-5 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-lg shadow-primary/50 border-2 border-background">
                    <Plus className="w-3 h-3 text-white" />
                  </motion.div>
                </motion.div>
              </div>
              <span className="text-xs font-medium bg-gradient-to-l from-primary to-accent bg-clip-text text-transparent">استوری شما</span>
            </motion.div>

            {stories.map((story, index) => (
              <motion.div key={story.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.05 }} whileHover={{ y: -5 }} whileTap={{ scale: 0.95 }} className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer group">
                <div className="relative">
                  {story.hasNew && (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }} className="absolute -inset-1 bg-gradient-to-tr from-primary via-accent to-primary rounded-full blur-sm opacity-60 group-hover:opacity-100 transition-opacity"></motion.div>
                  )}
                  <motion.div whileHover={{ scale: 1.1 }} className={`relative w-14 h-14 md:w-16 md:h-16 rounded-full p-[2.5px] ${story.hasNew ? 'bg-gradient-to-tr from-primary via-accent to-primary' : 'bg-gradient-to-tr from-muted/50 to-muted/30'}`}>
                    <div className="w-full h-full rounded-full bg-background p-[1.5px]">
                      <Avatar size="md" className="w-full h-full" />
                    </div>
                  </motion.div>
                </div>
                <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors max-w-[60px] truncate">{story.username}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="mb-6 rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
          سرویس فید در حال حاضر در دسترس نیست.
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="space-y-6 md:space-y-8">
          {posts.map((post, index) => (
            <motion.div key={post.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * index }}>
              <HydratedFeedPost
                id={post.id}
                authorId={post.author_id}
                profilesMap={profilesMap}
                image={post.media_url}
                caption={post.caption}
                likes={post.like_count}
                comments={post.comment_count}
                timestamp={formatRelativeTimeFa(post.created_at)}
              />
            </motion.div>
          ))}
        </motion.div>

        {feedQuery.hasNextPage && (
          <div className="mt-8 flex justify-center">
            <button onClick={() => feedQuery.fetchNextPage()} className="rounded-xl border border-border bg-card px-4 py-2 text-sm hover:bg-accent transition-colors">
              {feedQuery.isFetchingNextPage ? <Spinner /> : 'بارگذاری بیشتر'}
            </button>
          </div>
        )}
      </main>

      <SuggestionsPanel />
    </>
  )
}

function HydratedFeedPost({
  id,
  authorId,
  profilesMap,
  image,
  caption,
  likes,
  comments,
  timestamp,
}: {
  id: string
  authorId: string
  profilesMap: Record<string, { avatar_url: string; username: string }>
  image: string
  caption: string
  likes: number
  comments: number
  timestamp: string
}) {
  const likeMutation = useLikePostMutation(id)
  const commentMutation = useAddCommentMutation(id)
  const profile = profilesMap[authorId]

  return (
    <Post
      id={id}
      author={{
        avatar: profile?.avatar_url,
        displayName: profile?.username || 'کاربر اینما',
        username: profile?.username || 'unknown',
      }}
      image={image}
      caption={caption}
      likes={likes}
      comments={comments}
      timestamp={timestamp}
      onLikeToggle={(liked) => likeMutation.mutateAsync(liked)}
      onSubmitComment={(body) => commentMutation.mutateAsync(body)}
    />
  )
}
