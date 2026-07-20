import { AuthGuard } from '@/components/layout/AuthGuard'
import { BottomNav } from '@/components/layout/BottomNav'
import { Navbar } from '@/components/layout/Navbar'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-background" dir="rtl">
        <Navbar className="w-64 flex-shrink-0" />
        <div className="flex-1">{children}</div>
        <BottomNav />
      </div>
    </AuthGuard>
  )
}
