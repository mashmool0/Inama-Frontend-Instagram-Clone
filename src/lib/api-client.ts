'use client'

import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

import { useAuthStore } from '@/features/auth/store'

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
let refreshRequest: Promise<string> | null = null

interface RetryableRequest extends InternalAxiosRequestConfig {
  _retry?: boolean
}

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const axiosError = error as AxiosError
    const request = axiosError.config as RetryableRequest | undefined
    const authState = useAuthStore.getState()
    const isPublicAuthCall = ['/auth/register', '/auth/login', '/auth/refresh'].some((path) => request?.url?.includes(path))

    if (axiosError.response?.status === 401 && request && !request._retry && !isPublicAuthCall && authState.refreshToken) {
      request._retry = true
      refreshRequest ??= axios
        .post(`${baseURL}/auth/refresh`, { refresh_token: authState.refreshToken })
        .then((response) => {
          authState.setSession(response.data)
          return response.data.access_token as string
        })
        .finally(() => {
          refreshRequest = null
        })

      try {
        const accessToken = await refreshRequest
        request.headers.Authorization = `Bearer ${accessToken}`
        return apiClient(request)
      } catch {
        clearSessionAndRedirect()
      }
    } else if (axiosError.response?.status === 401 && !isPublicAuthCall) {
      clearSessionAndRedirect()
    }
    return Promise.reject(error)
  },
)

function clearSessionAndRedirect() {
  useAuthStore.getState().clearSession()
  if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
    window.location.assign('/login')
  }
}
