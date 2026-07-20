'use client'

import { QueryClientProvider, useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'

import { queryClient } from '@/lib/query-client'
import { useAuthStore } from '@/features/auth/store'
import { getProfileById } from '@/features/profiles/api'

export function AppProviders({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useAuthStore.persist.rehydrate()
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
  })

  useEffect(() => {
    if (profileQuery.data) {
      setProfile(profileQuery.data)
    }
  }, [profileQuery.data, setProfile])

  return null
}
