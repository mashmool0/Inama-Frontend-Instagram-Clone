'use client'

import { QueryClientProvider, useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'

import { queryClient } from '@/lib/query-client'
import { useAuthStore } from '@/features/auth/store'
import { getProfileById } from '@/features/profiles/api'

export function AppProviders({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    void Promise.resolve(useAuthStore.persist.rehydrate()).finally(() => {
      useAuthStore.getState().setHasHydrated(true)
    })
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <AuthBootstrapper />
      {children}
    </QueryClientProvider>
  )
}

function AuthBootstrapper() {
  const userId = useAuthStore((state) => state.userId)
  const setProfile = useAuthStore((state) => state.setProfile)
  const profileQuery = useQuery({
    queryKey: ['auth', 'current-profile', userId],
    queryFn: () => getProfileById(userId!),
    enabled: Boolean(userId),
    retry: 8,
    retryDelay: 250,
  })

  useEffect(() => {
    if (profileQuery.data) {
      setProfile(profileQuery.data)
    }
  }, [profileQuery.data, setProfile])

  return null
}
