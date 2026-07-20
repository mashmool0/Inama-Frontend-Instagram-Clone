import { Suspense } from 'react'

import { VerifyOtpPage } from '@/features/auth/components/VerifyOtpPage'

export default function Page() {
  return (
    <Suspense>
      <VerifyOtpPage />
    </Suspense>
  )
}
