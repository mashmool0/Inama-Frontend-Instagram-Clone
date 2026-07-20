'use client'

import { useInfiniteQuery } from '@tanstack/react-query'

import { search, type SearchType } from './api'

export function useSearchInfiniteQuery(query: string, type: SearchType = 'ALL') {
  return useInfiniteQuery({
    queryKey: ['search', query, type],
    queryFn: ({ pageParam }: { pageParam?: string }) => search({ query, type, cursor: pageParam, limit: 20 }),
    initialPageParam: '',
    getNextPageParam: (lastPage) => lastPage.next_cursor || undefined,
    enabled: false,
  })
}
