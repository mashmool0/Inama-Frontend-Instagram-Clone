import { apiClient } from '@/lib/api-client'
import type { UserIdPage, UserProfile } from '@/types/user'

interface CursorParams {
  cursor?: string
  limit?: number
}

export async function getProfileById(userId: string) {
  const { data } = await apiClient.get<UserProfile>(`/users/${userId}`)
  return data
}

export async function getProfileByUsername(username: string) {
  const { data } = await apiClient.get<UserProfile>(`/users/username/${encodeURIComponent(username)}`)
  return data
}

export async function updateProfile(payload: Partial<Pick<UserProfile, 'bio' | 'avatar_url'>>) {
  const { data } = await apiClient.patch<UserProfile>('/users/me', payload)
  return data
}

export async function followUser(targetUserId: string) {
  const { data } = await apiClient.post<{ success: boolean }>(`/users/${targetUserId}/follow`)
  return data
}

export async function unfollowUser(targetUserId: string) {
  const { data } = await apiClient.delete<{ success: boolean }>(`/users/${targetUserId}/follow`)
  return data
}

export async function getFollowers(userId: string, params: CursorParams = {}) {
  const { data } = await apiClient.get<UserIdPage>(`/users/${userId}/followers`, { params })
  return data
}

export async function getFollowing(userId: string, params: CursorParams = {}) {
  const { data } = await apiClient.get<UserIdPage>(`/users/${userId}/following`, { params })
  return data
}
