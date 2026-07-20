import { beforeEach, describe, expect, it, vi } from 'vitest'

import { apiClient } from '@/lib/api-client'
import { login, register, updateUsername } from '@/features/auth/api'
import { getNotifications, markAllRead, markAsRead } from '@/features/notifications/api'
import { followUser, getProfileById, getProfileByUsername, unfollowUser, updateProfile } from '@/features/profiles/api'

vi.mock('@/lib/api-client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))

const mockedClient = vi.mocked(apiClient)

describe('gateway API contracts', () => {
  beforeEach(() => {
    vi.mocked(mockedClient.get).mockResolvedValue({ data: {} })
    vi.mocked(mockedClient.post).mockResolvedValue({ data: {} })
    vi.mocked(mockedClient.patch).mockResolvedValue({ data: {} })
    vi.mocked(mockedClient.delete).mockResolvedValue({ data: {} })
  })

  it('uses implemented Auth routes and payloads', async () => {
    await register({ email: 'a@x.com', username: 'alice', password: 'pw' })
    await login({ identifier: 'alice', password: 'pw' })
    await updateUsername('renamed')

    expect(mockedClient.post).toHaveBeenCalledWith('/auth/register', { email: 'a@x.com', username: 'alice', password: 'pw' })
    expect(mockedClient.post).toHaveBeenCalledWith('/auth/login', { identifier: 'alice', password: 'pw' })
    expect(mockedClient.patch).toHaveBeenCalledWith('/auth/me/username', { username: 'renamed' })
  })

  it('uses /users routes for profiles and follow relationships', async () => {
    await getProfileById('user-id')
    await getProfileByUsername('alice name')
    await updateProfile({ bio: 'hello', avatar_url: 'avatar' })
    await followUser('target')
    await unfollowUser('target')

    expect(mockedClient.get).toHaveBeenCalledWith('/users/user-id')
    expect(mockedClient.get).toHaveBeenCalledWith('/users/username/alice%20name')
    expect(mockedClient.patch).toHaveBeenCalledWith('/users/me', { bio: 'hello', avatar_url: 'avatar' })
    expect(mockedClient.post).toHaveBeenCalledWith('/users/target/follow')
    expect(mockedClient.delete).toHaveBeenCalledWith('/users/target/follow')
  })

  it('normalizes Gateway protobuf notification JSON', async () => {
    vi.mocked(mockedClient.get).mockResolvedValueOnce({
      data: {
        notifications: [
          { id: 'n1', type: 3, actor_id: 'actor', post_id: '', is_read: false, created_at: { seconds: 1, nanos: 0 } },
        ],
        next_cursor: 'next',
      },
    })

    const page = await getNotifications({ limit: 20 })
    await markAsRead('n1')
    await markAllRead()

    expect(page.notifications[0]).toMatchObject({ type: 'FOLLOW', created_at: new Date(1000).toISOString() })
    expect(mockedClient.post).toHaveBeenCalledWith('/notifications/n1/read')
    expect(mockedClient.post).toHaveBeenCalledWith('/notifications/read-all')
  })
})
