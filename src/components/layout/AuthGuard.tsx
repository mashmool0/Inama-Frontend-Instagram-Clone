'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { useAuthStore } from '@/features/auth/store'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const token = useAuthStore((state) => state.accessToken)
  const hasHydrated = useAuthStore((state) => state.hasHydrated)

  useEffect(() => {
    if (hasHydrated && !token) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`)
    }
  }, [hasHydrated, pathname, router, token])

  if (!hasHydrated || !token) {
    return null
  }

  return <>{children}</>
}
