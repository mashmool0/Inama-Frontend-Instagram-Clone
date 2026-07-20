import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useAuthStore } from '@/features/auth/store'
import { apiClient } from './api-client'

function tokenFor(subject: string, marker: string) {
  return `header.${btoa(JSON.stringify({ sub: subject, marker }))}.signature`
}

describe('api client token refresh', () => {
  const originalAdapter = apiClient.defaults.adapter

  beforeEach(() => {
    useAuthStore.getState().clearSession()
  })

  afterEach(() => {
    apiClient.defaults.adapter = originalAdapter
    vi.restoreAllMocks()
  })

  it('refreshes once and retries the failed protected request', async () => {
    const oldToken = tokenFor('user-id', 'old')
    const newToken = tokenFor('user-id', 'new')
    useAuthStore.getState().setSession({ access_token: oldToken, refresh_token: 'refresh', expires_in: 1 })
    vi.spyOn(axios, 'post').mockResolvedValue({
      data: { access_token: newToken, refresh_token: 'rotated', expires_in: 900 },
    })

    let attempts = 0
    apiClient.defaults.adapter = async (config: InternalAxiosRequestConfig) => {
      attempts += 1
      if (attempts === 1) {
        throw new AxiosError('expired', 'ERR_BAD_REQUEST', config, undefined, {
          data: { error: 'invalid token' },
          status: 401,
          statusText: 'Unauthorized',
          headers: {},
          config,
        })
      }
      return {
        data: { success: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      } as AxiosResponse
    }

    await expect(apiClient.get('/notifications')).resolves.toMatchObject({ status: 200 })
    expect(attempts).toBe(2)
    expect(axios.post).toHaveBeenCalledWith('http://localhost:8080/auth/refresh', { refresh_token: 'refresh' })
    expect(useAuthStore.getState().refreshToken).toBe('rotated')
  })
})
