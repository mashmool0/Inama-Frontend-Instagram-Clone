'use client'

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { addComment, createPost, getComments, getPost, likePost, unlikePost } from './api'

export function usePostQuery(postId: string) {
  return useQuery({
    queryKey: ['posts', postId],
    queryFn: () => getPost(postId),
    enabled: Boolean(postId),
  })
}

export function useCommentsInfiniteQuery(postId: string) {
  return useInfiniteQuery({
    queryKey: ['posts', postId, 'comments'],
    queryFn: ({ pageParam }: { pageParam?: string }) => getComments(postId, { cursor: pageParam, limit: 20 }),
    initialPageParam: '',
    getNextPageParam: (lastPage) => lastPage.next_cursor || undefined,
    enabled: Boolean(postId),
  })
}

export function useCreatePostMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] })
      queryClient.invalidateQueries({ queryKey: ['explore'] })
    },
  })
}

export function useLikePostMutation(postId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (liked: boolean) => (liked ? likePost(postId) : unlikePost(postId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', postId] })
      queryClient.invalidateQueries({ queryKey: ['feed'] })
      queryClient.invalidateQueries({ queryKey: ['explore'] })
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

export function useAddCommentMutation(postId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: string) => addComment(postId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', postId, 'comments'] })
      queryClient.invalidateQueries({ queryKey: ['posts', postId] })
    },
  })
}
