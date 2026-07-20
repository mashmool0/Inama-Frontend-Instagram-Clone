'use client'

import { motion } from 'motion/react'

import { Spinner } from '@/components/ui/Spinner'
import { useExploreInfiniteQuery } from '../hooks'

export function ExplorePage() {
  const exploreQuery = useExploreInfiniteQuery()
  const posts = exploreQuery.data?.pages.flatMap((page) => page.posts) ?? []

  return (
    <main className="flex-1 max-w-6xl mx-auto py-6 px-4 pb-24 md:pb-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">اکسپلور</h1>
        <p className="text-muted-foreground">جدیدترین محتواهای عمومی را کشف کنید</p>
      </div>

      {exploreQuery.isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="columns-2 md:columns-3 xl:columns-4 gap-4 space-y-4">
          {posts.map((post, index) => (
            <motion.a
              key={post.id}
              href={`/posts/${post.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className="relative group/post mb-4 block break-inside-avoid overflow-hidden rounded-3xl bg-card border border-border hover:border-primary/40 transition-colors"
            >
              <img src={post.media_url} alt="" className="w-full transition-transform duration-500 group-hover/post:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/post:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover/post:opacity-100 transition-opacity text-white">
                <p className="text-sm line-clamp-2">{post.caption || 'پست بدون کپشن'}</p>
              </div>
            </motion.a>
          ))}
        </motion.div>
      )}

      {exploreQuery.hasNextPage && (
        <div className="mt-8 flex justify-center">
          <button onClick={() => exploreQuery.fetchNextPage()} className="rounded-xl border border-border bg-card px-4 py-2 text-sm hover:bg-accent transition-colors">
            {exploreQuery.isFetchingNextPage ? <Spinner /> : 'نمایش بیشتر'}
          </button>
        </div>
      )}
    </main>
  )
}
