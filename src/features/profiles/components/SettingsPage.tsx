'use client'

import { useState } from 'react'
import { Bell, ChevronLeft, Lock, LogOut, Shield } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/features/auth/store'

export function SettingsPage() {
  const clearSession = useAuthStore((state) => state.clearSession)
  const [notifications, setNotifications] = useState({
    likes: true,
    comments: true,
    follows: true,
    messages: true,
  })
  const [privacy, setPrivacy] = useState({
    privateAccount: false,
    showActivity: true,
    allowTags: true,
  })

  const settingsSections = [
    {
      title: 'حساب کاربری',
      icon: Shield,
      items: [
        { label: 'اطلاعات حساب', description: 'نام، نام کاربری، ایمیل' },
        { label: 'تغییر رمز عبور', description: 'رمز عبور خود را تغییر دهید' },
        { label: 'احراز هویت دو مرحله‌ای', description: 'افزایش امنیت حساب' },
      ],
    },
    {
      title: 'حریم خصوصی',
      icon: Lock,
      items: [
        { label: 'حساب خصوصی', description: 'فقط دنبال‌کنندگان شما پست‌هایتان را می‌بینند', toggle: true, value: privacy.privateAccount, onChange: (val: boolean) => setPrivacy({ ...privacy, privateAccount: val }) },
        { label: 'نمایش فعالیت', description: 'نمایش زمان آخرین بازدید', toggle: true, value: privacy.showActivity, onChange: (val: boolean) => setPrivacy({ ...privacy, showActivity: val }) },
        { label: 'اجازه تگ کردن', description: 'دیگران می‌توانند شما را تگ کنند', toggle: true, value: privacy.allowTags, onChange: (val: boolean) => setPrivacy({ ...privacy, allowTags: val }) },
      ],
    },
    {
      title: 'اعلان‌ها',
      icon: Bell,
      items: [
        { label: 'پسند پست‌ها', toggle: true, value: notifications.likes, onChange: (val: boolean) => setNotifications({ ...notifications, likes: val }) },
        { label: 'نظرات', toggle: true, value: notifications.comments, onChange: (val: boolean) => setNotifications({ ...notifications, comments: val }) },
        { label: 'دنبال‌کنندگان جدید', toggle: true, value: notifications.follows, onChange: (val: boolean) => setNotifications({ ...notifications, follows: val }) },
        { label: 'پیام‌ها', toggle: true, value: notifications.messages, onChange: (val: boolean) => setNotifications({ ...notifications, messages: val }) },
      ],
    },
  ]

  return (
    <main className="flex-1 max-w-2xl mx-auto py-8 px-4 pb-24 md:pb-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">تنظیمات</h1>
        <p className="text-muted-foreground">مدیریت حساب کاربری و ترجیحات</p>
      </div>

      <div className="space-y-6">
        {settingsSections.map((section, sectionIndex) => {
          const Icon = section.icon
          return (
            <div key={sectionIndex} className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-bold">{section.title}</h2>
                </div>
              </div>

              <div className="divide-y divide-border">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="p-5 hover:bg-accent/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold mb-1">{item.label}</h3>
                        {'description' in item && item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
                      </div>

                      {'toggle' in item && item.toggle ? (
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked={item.value} onChange={(e) => item.onChange?.(e.target.checked)} className="sr-only peer" />
                          <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      ) : (
                        <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                          <ChevronLeft className="w-5 h-5 text-muted-foreground" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        <div className="bg-card border border-border rounded-2xl p-5">
          <Button variant="destructive" className="w-full" size="lg" onClick={clearSession}>
            <LogOut className="w-5 h-5 ml-2" />
            خروج از حساب
          </Button>
        </div>
      </div>
    </main>
  )
}
