'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { TokenPair } from '@/types/auth'
import type { UserProfile } from '@/types/user'
import { decodeJwtSubject } from '@/lib/format'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  userId: string | null
  profile: UserProfile | null
  setSession: (tokens: TokenPair) => void
  setProfile: (profile: UserProfile | null) => void
  clearSession: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      userId: null,
      profile: null,
      setSession: (tokens) =>
        set({
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          userId: decodeJwtSubject(tokens.access_token),
        }),
      setProfile: (profile) =>
        set((state) => ({
          ...state,
          profile,
          userId: profile?.id ?? state.userId,
        })),
      clearSession: () =>
        set({
          accessToken: null,
          refreshToken: null,
          userId: null,
          profile: null,
        }),
    }),
    {
      name: 'inama-auth',
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        userId: state.userId,
        profile: state.profile,
      }),
    },
  ),
)
