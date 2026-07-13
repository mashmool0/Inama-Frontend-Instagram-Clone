'use client';

import { useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Compass, PlusSquare, Search, Bell, User, Settings, ImageIcon } from 'lucide-react';
import { cn } from '@/lib/cn';
import { motion } from 'motion/react';
import { useAuthStore } from '@/features/auth/store';

interface NavbarProps {
  className?: string;
}

export function Navbar({ className }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const profile = useAuthStore((state) => state.profile);
  const profilePath = useMemo(() => `/profile/${profile?.username || 'me'}`, [profile?.username]);

  const menuItems = [
    { icon: Home, label: 'خانه', path: '/feed' },
    { icon: Search, label: 'جستجو', path: '/search' },
    { icon: Compass, label: 'اکسپلور', path: '/explore' },
    { icon: Bell, label: 'اعلان‌ها', path: '/notifications' },
    { icon: PlusSquare, label: 'ایجاد پست', path: '/create' },
    { icon: User, label: 'پروفایل', path: profilePath },
    { icon: Settings, label: 'تنظیمات', path: '/settings' },
  ];

  return (
    <aside className={cn('hidden md:block h-screen sticky top-0 bg-gradient-to-b from-sidebar/95 to-sidebar/80 backdrop-blur-xl border-l border-sidebar-border/50', className)} dir="rtl">
      <div className="p-6 h-full flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-10 group cursor-pointer"
          onClick={() => router.push('/feed')}
        >
          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative w-12 h-12 bg-gradient-to-br from-primary via-primary/80 to-accent rounded-xl flex items-center justify-center shadow-xl">
              <ImageIcon className="w-7 h-7 text-white" />
            </div>
          </motion.div>
          <span className="text-2xl font-bold bg-gradient-to-l from-primary via-primary/80 to-accent bg-clip-text text-transparent">
            اینما
          </span>
        </motion.div>

        <nav className="space-y-2 flex-1">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = item.path.startsWith('/profile')
              ? pathname.startsWith('/profile')
              : pathname === item.path;
            return (
              <motion.button
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => router.push(item.path)}
                whileHover={{ scale: 1.03, x: -5 }}
                whileTap={{ scale: 0.97 }}
                className={cn(
                  'w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 relative group/item',
                  isActive
                    ? 'bg-gradient-to-l from-primary to-primary/80 text-white shadow-lg shadow-primary/30'
                    : 'hover:bg-sidebar-accent/50 text-sidebar-foreground'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute inset-0 bg-gradient-to-l from-primary to-accent rounded-xl"
                    transition={{ type: 'spring', duration: 0.6 }}
                  />
                )}
                <Icon className={cn('w-6 h-6 relative z-10', isActive && 'drop-shadow-lg')} />
                <span className="text-base relative z-10 font-medium">{item.label}</span>

                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-full"
                  />
                )}
              </motion.button>
            );
          })}
        </nav>

      </div>
    </aside>
  );
}
