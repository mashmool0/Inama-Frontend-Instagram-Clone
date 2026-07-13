import { apiClient } from '@/lib/api-client'
import type { CommentPage, CommentRecord, PostRecord } from '@/types/post'

interface CursorParams {
  cursor?: string
  limit?: number
}

export async function createPost(payload: { caption: string; media_url: string }) {
  const { data } = await apiClient.post<PostRecord>('/posts', payload)
  return data
}

export async function getPost(postId: string) {
  const { data } = await apiClient.get<PostRecord>(`/posts/${postId}`)
  return data
}

export async function deletePost(postId: string) {
  const { data } = await apiClient.delete<{ success: boolean }>(`/posts/${postId}`)
  return data
}

export async function likePost(postId: string) {
  const { data } = await apiClient.post<{ like_count: number }>(`/posts/${postId}/like`)
  return data
}

export async function unlikePost(postId: string) {
  const { data } = await apiClient.delete<{ like_count: number }>(`/posts/${postId}/like`)
  return data
}

export async function addComment(postId: string, body: string) {
  const { data } = await apiClient.post<CommentRecord>(`/posts/${postId}/comments`, { body })
  return data
}

export async function getComments(postId: string, params: CursorParams = {}) {
  const { data } = await apiClient.get<CommentPage>(`/posts/${postId}/comments`, { params })
  return data
}
