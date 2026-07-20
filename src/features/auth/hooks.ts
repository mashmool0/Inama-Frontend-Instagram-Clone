'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

import { login, register, updateUsername } from './api'
import { useAuthStore } from './store'
import type { LoginRequest, RegisterRequest } from '@/types/auth'
import { getProfileById } from '@/features/profiles/api'
import { decodeJwtSubject } from '@/lib/format'

async function loadSynchronizedProfile(accessToken: string) {
  const userId = decodeJwtSubject(accessToken)
  if (!userId) {
    throw new Error('شناسه کاربر در توکن معتبر نیست.')
  }

  let lastError: unknown
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      return await getProfileById(userId)
    } catch (error) {
      lastError = error
      if (axios.isAxiosError(error) && ![404, 503].includes(error.response?.status ?? 0)) {
        throw error
      }
      await new Promise((resolve) => setTimeout(resolve, 250))
    }
  }
  throw lastError
}

export function useRegisterMutation() {
  const setSession = useAuthStore((state) => state.setSession)
  const setProfile = useAuthStore((state) => state.setProfile)

  return useMutation({
    mutationFn: async (payload: RegisterRequest) => {
      const tokens = await register(payload)
      setSession(tokens)
      const profile = await loadSynchronizedProfile(tokens.access_token)
      setProfile(profile)
      return { tokens, profile }
    },
  })
}

export function useLoginMutation() {
  const setSession = useAuthStore((state) => state.setSession)
  const setProfile = useAuthStore((state) => state.setProfile)

  return useMutation({
    mutationFn: async (payload: LoginRequest) => {
      const tokens = await login(payload)
      setSession(tokens)
      const profile = await loadSynchronizedProfile(tokens.access_token)
      setProfile(profile)
      return { tokens, profile }
    },
  })
}

export function useUpdateUsernameMutation() {
  const setUsername = useAuthStore((state) => state.setUsername)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateUsername,
    onSuccess: ({ username }) => {
      setUsername(username)
      queryClient.invalidateQueries({ queryKey: ['profiles'] })
    },
  })
}
