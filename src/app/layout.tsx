import './globals.css'

import type { Metadata } from 'next'

import { AppProviders } from './providers'

export const metadata: Metadata = {
  title: 'Inama',
  description: 'Inama frontend',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
