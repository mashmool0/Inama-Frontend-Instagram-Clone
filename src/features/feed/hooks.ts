'use client'

import { useInfiniteQuery } from '@tanstack/react-query'

import { getExplore, getFeed } from './api'

const limit = 20

export function useFeedInfiniteQuery() {
  return useInfiniteQuery({
    queryKey: ['feed'],
    queryFn: ({ pageParam }: { pageParam?: string }) => getFeed({ cursor: pageParam, limit }),
    initialPageParam: '',
    getNextPageParam: (lastPage) => lastPage.next_cursor || undefined,
    enabled: false,
  })
}

export function useExploreInfiniteQuery() {
  return useInfiniteQuery({
    queryKey: ['explore'],
    queryFn: ({ pageParam }: { pageParam?: string }) => getExplore({ cursor: pageParam, limit }),
    initialPageParam: '',
    getNextPageParam: (lastPage) => lastPage.next_cursor || undefined,
    enabled: false,
  })
}
