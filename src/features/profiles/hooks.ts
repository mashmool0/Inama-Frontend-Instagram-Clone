'use client'

import { useInfiniteQuery, useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query'

import { followUser, getFollowers, getFollowing, getProfileById, getProfileByUsername, unfollowUser, updateProfile } from './api'
import { useAuthStore } from '@/features/auth/store'

export function useProfileByIdQuery(userId?: string) {
  return useQuery({
    queryKey: ['profiles', 'id', userId],
    queryFn: () => getProfileById(userId!),
    enabled: Boolean(userId),
  })
}

export function useProfileByUsernameQuery(username?: string) {
  return useQuery({
    queryKey: ['profiles', 'username', username],
    queryFn: () => getProfileByUsername(username!),
    enabled: Boolean(username),
    retry: 30,
    retryDelay: 250,
  })
}

export function useProfilesMap(userIds: string[]) {
  const uniqueUserIds = [...new Set(userIds.filter(Boolean))]
  const results = useQueries({
    queries: uniqueUserIds.map((userId) => ({
      queryKey: ['profiles', 'id', userId],
      queryFn: () => getProfileById(userId),
      staleTime: 60_000,
    })),
  })

  const data = Object.fromEntries(
    results
      .map((result) => result.data)
      .filter(Boolean)
      .map((profile) => [profile!.id, profile!]),
  )

  return {
    data,
    isLoading: results.some((result) => result.isLoading),
  }
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient()
  const setProfile = useAuthStore((state) => state.setProfile)

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (profile) => {
      setProfile(profile)
      queryClient.invalidateQueries({ queryKey: ['profiles'] })
    },
  })
}

export function useFollowMutation(targetUserId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => followUser(targetUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] })
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

export function useUnfollowMutation(targetUserId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => unfollowUser(targetUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] })
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

export function useFollowersInfiniteQuery(userId?: string) {
  return useInfiniteQuery({
    queryKey: ['profiles', userId, 'followers'],
    queryFn: ({ pageParam }: { pageParam?: string }) => getFollowers(userId!, { cursor: pageParam, limit: 20 }),
    initialPageParam: '',
    getNextPageParam: (lastPage) => lastPage.next_cursor || undefined,
    enabled: Boolean(userId),
  })
}

export function useFollowingInfiniteQuery(userId?: string) {
  return useInfiniteQuery({
    queryKey: ['profiles', userId, 'following'],
    queryFn: ({ pageParam }: { pageParam?: string }) => getFollowing(userId!, { cursor: pageParam, limit: 20 }),
    initialPageParam: '',
    getNextPageParam: (lastPage) => lastPage.next_cursor || undefined,
    enabled: Boolean(userId),
  })
}
