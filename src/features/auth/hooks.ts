'use client'

import { useMutation } from '@tanstack/react-query'

import { login, register, requestPasswordReset, resetPassword, verifyOtp } from './api'
import { useAuthStore } from './store'
import type { LoginRequest, RegisterRequest, VerifyOtpRequest } from '@/types/auth'
import { updateProfile } from '@/features/profiles/api'

export function useRegisterMutation() {
  return useMutation({
    mutationFn: (payload: RegisterRequest) => register(payload),
  })
}

export function useVerifyOtpMutation() {
  const setSession = useAuthStore((state) => state.setSession)

  return useMutation({
    mutationFn: (payload: VerifyOtpRequest) => verifyOtp(payload),
    onSuccess: (tokens) => {
      setSession(tokens)
    },
  })
}

export function useLoginMutation() {
  const setSession = useAuthStore((state) => state.setSession)

  return useMutation({
    mutationFn: (payload: LoginRequest) => login(payload),
    onSuccess: (tokens) => {
      setSession(tokens)
    },
  })
}

export function useRequestPasswordResetMutation() {
  return useMutation({
    mutationFn: (email: string) => requestPasswordReset(email),
  })
}

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) => resetPassword(token, password),
  })
}

export function useSetUsernameMutation() {
  const setProfile = useAuthStore((state) => state.setProfile)

  return useMutation({
    mutationFn: (username: string) => updateProfile({ username }),
    onSuccess: (profile) => {
      setProfile(profile)
    },
  })
}
