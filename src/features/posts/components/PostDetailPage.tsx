'use client'

import { useParams, useRouter } from 'next/navigation'
import { ArrowRight, Heart, MessageCircle, Send, Bookmark, MoreVertical } from 'lucide-react'

import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import { formatRelativeTimeFa } from '@/lib/format'
import { useProfilesMap } from '@/features/profiles/hooks'
import { useAddCommentMutation, useCommentsInfiniteQuery, useLikePostMutation, usePostQuery } from '../hooks'

export function PostDetailPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const postQuery = usePostQuery(params.id)
  const commentsQuery = useCommentsInfiniteQuery(params.id)
  const comments = commentsQuery.data?.pages.flatMap((page) => page.comments) ?? []
  const authorIds = [postQuery.data?.author_id, ...comments.map((comment) => comment.author_id)].filter(Boolean) as string[]
  const { data: profilesMap } = useProfilesMap(authorIds)
  const likeMutation = useLikePostMutation(params.id)
  const commentMutation = useAddCommentMutation(params.id)

  if (!postQuery.data) {
    return <main className="flex-1 max-w-5xl mx-auto py-6 px-4 pb-24 md:pb-6" />
  }

  const post = postQuery.data
  const author = profilesMap[post.author_id]

  return (
    <main className="flex-1 max-w-5xl mx-auto py-6 px-4 pb-24 md:pb-6">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowRight className="w-5 h-5" />
        <span>بازگشت</span>
      </button>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-muted rounded-2xl overflow-hidden h-fit">
          <img src={post.media_url} alt="" className="w-full aspect-square object-cover" />
        </div>

        <div className="bg-card border border-border rounded-2xl flex flex-col h-[600px]">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar src={author?.avatar_url} alt={author?.username} size="md" />
              <div>
                <h3 className="font-bold">{author?.username || 'کاربر اینما'}</h3>
                <p className="text-sm text-muted-foreground">@{author?.username || 'unknown'}</p>
              </div>
            </div>
            <button className="p-2 hover:bg-accent rounded-lg transition-colors">
              <MoreVertical className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <div className="pb-4 border-b border-border">
              <div className="flex items-start gap-3">
                <Avatar src={author?.avatar_url} size="md" />
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-bold ml-2">{author?.username || 'unknown'}</span>
                    {post.caption}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">{formatRelativeTimeFa(post.created_at)}</p>
                </div>
              </div>
            </div>

            {comments.map((comment) => {
              const commentAuthor = profilesMap[comment.author_id]
              return (
                <div key={comment.id} className="flex items-start gap-3">
                  <Avatar size="sm" src={commentAuthor?.avatar_url} />
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-bold ml-2">{commentAuthor?.username || 'unknown'}</span>
                      {comment.body}
                    </p>
                    <div className="flex items-center gap-4 mt-1">
                      <p className="text-xs text-muted-foreground">{formatRelativeTimeFa(comment.created_at)}</p>
                    </div>
                  </div>
                  <button className="p-1">
                    <Heart className="w-4 h-4 text-muted-foreground hover:text-red-500 transition-colors" />
                  </button>
                </div>
              )
            })}
          </div>

          <div className="border-t border-border p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={() => likeMutation.mutate(true)} className="group">
                  <Heart className={cn('w-6 h-6 transition-all duration-200', 'text-foreground group-hover:text-red-500')} />
                </button>
                <button className="group">
                  <MessageCircle className="w-6 h-6 text-foreground group-hover:text-primary transition-colors" />
                </button>
                <button className="group">
                  <Send className="w-6 h-6 text-foreground group-hover:text-primary transition-colors" />
                </button>
              </div>
              <button className="group">
                <Bookmark className="w-6 h-6 transition-all duration-200 text-foreground group-hover:text-primary" />
              </button>
            </div>

            <p className="font-bold">{post.like_count.toLocaleString('fa-IR')} پسند</p>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="افزودن نظر..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const target = e.currentTarget
                    if (!target.value.trim()) return
                    commentMutation.mutate(target.value)
                    target.value = ''
                  }
                }}
                className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const input = document.activeElement as HTMLInputElement | null
                  if (input?.value?.trim()) {
                    commentMutation.mutate(input.value)
                    input.value = ''
                  }
                }}
              >
                ارسال
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
