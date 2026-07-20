import { apiClient } from '@/lib/api-client'
import type { PostRecord } from '@/types/post'
import type { UserResult } from '@/types/user'

export type SearchType = 'ALL' | 'USER' | 'HASHTAG' | 'TEXT'

export interface SearchResponse {
  users: UserResult[]
  posts: PostRecord[]
  next_cursor: string
}

interface SearchParams {
  query: string
  type?: SearchType
  limit?: number
  cursor?: string
}

export async function search(params: SearchParams) {
  const { data } = await apiClient.get<SearchResponse>('/search', { params })
  return data
}
