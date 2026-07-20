import { apiClient } from '@/lib/api-client'
import type { LoginRequest, RegisterRequest, TokenPair } from '@/types/auth'

export async function register(payload: RegisterRequest) {
  const { data } = await apiClient.post<TokenPair>('/auth/register', payload)
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

export async function updateUsername(username: string) {
  const { data } = await apiClient.patch<{ username: string }>('/auth/me/username', { username })
  return data
}
