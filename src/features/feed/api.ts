import { apiClient } from '@/lib/api-client'
import type { PostPage } from '@/types/post'

interface PageParams {
  cursor?: string
  limit?: number
}

export async function getFeed(params: PageParams = {}) {
  const { data } = await apiClient.get<PostPage>('/feed', { params })
  return data
}

export async function getExplore(params: PageParams = {}) {
  const { data } = await apiClient.get<PostPage>('/explore', { params })
  return data
}
