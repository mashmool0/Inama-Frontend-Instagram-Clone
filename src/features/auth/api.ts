import { apiClient } from '@/lib/api-client'
import type { LoginRequest, RegisterRequest, TokenPair, VerifyOtpRequest } from '@/types/auth'

export async function register(payload: RegisterRequest) {
  const { data } = await apiClient.post<{ otp_sent: boolean }>('/auth/register', payload)
  return data
}

export async function verifyOtp(payload: VerifyOtpRequest) {
  const { data } = await apiClient.post<TokenPair>('/auth/verify-otp', payload)
  return data
}

export async function login(payload: LoginRequest) {
  const { data } = await apiClient.post<TokenPair>('/auth/login', payload)
  return data
}

export async function refreshToken(refresh_token: string) {
  const { data } = await apiClient.post<TokenPair>('/auth/refresh', { refresh_token })
  return data
}

export async function requestPasswordReset(email: string) {
  const { data } = await apiClient.post<{ email_sent: boolean }>('/auth/password-reset/request', { email })
  return data
}

export async function resetPassword(reset_token: string, new_password: string) {
  const { data } = await apiClient.post<{ success: boolean }>('/auth/password-reset/confirm', {
    reset_token,
    new_password,
  })
  return data
}
