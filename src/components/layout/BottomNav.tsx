'use client';

import { useMemo } from 'react';
import { Home, Compass, PlusSquare, Bell, User } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/cn';
import { useAuthStore } from '@/features/auth/store';

export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const profile = useAuthStore((state) => state.profile);
  const profilePath = useMemo(() => `/profile/${profile?.username || 'me'}`, [profile?.username]);

  const menuItems = [
    { icon: Home, label: 'خانه', path: '/feed' },
    { icon: Compass, label: 'اکسپلور', path: '/explore' },
    { icon: PlusSquare, label: 'ایجاد', path: '/create' },
    { icon: Bell, label: 'اعلان‌ها', path: '/notifications' },
    { icon: User, label: 'پروفایل', path: profilePath },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50" dir="rtl">
      <div className="flex items-center justify-around px-2 py-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.path.startsWith('/profile') ? pathname.startsWith('/profile') : pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={cn(
                'flex flex-col items-center justify-center gap-1 py-2 px-4 rounded-xl transition-all',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <Icon className={cn('w-6 h-6', isActive && 'fill-primary/20')} />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
