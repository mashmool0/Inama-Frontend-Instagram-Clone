import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from './store'

function tokenFor(subject: string) {
  return `header.${btoa(JSON.stringify({ sub: subject }))}.signature`
}

describe('auth store', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.getState().clearSession()
  })

  it('derives the user id and stores both tokens', () => {
    useAuthStore.getState().setSession({
      access_token: tokenFor('user-id'),
      refresh_token: 'refresh-token',
      expires_in: 900,
    })

    expect(useAuthStore.getState()).toMatchObject({
      userId: 'user-id',
      refreshToken: 'refresh-token',
    })
  })

  it('updates the locally displayed username without changing identity', () => {
    useAuthStore.getState().setProfile({
      id: 'user-id',
      username: 'before',
      bio: '',
      avatar_url: '',
      follower_count: 0,
      following_count: 0,
      created_at: new Date(0).toISOString(),
    })

    useAuthStore.getState().setUsername('after')
    expect(useAuthStore.getState().profile?.username).toBe('after')
    expect(useAuthStore.getState().userId).toBe('user-id')
  })
})
