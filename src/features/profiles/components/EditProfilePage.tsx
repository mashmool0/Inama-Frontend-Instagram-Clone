'use client'

import { useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Camera } from 'lucide-react'

import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { useAuthStore } from '@/features/auth/store'
import { useUpdateUsernameMutation } from '@/features/auth/hooks'
import { apiErrorMessage } from '@/lib/api-error'
import { useUpdateProfileMutation } from '../hooks'

export function EditProfilePage() {
  const router = useRouter()
  const profile = useAuthStore((state) => state.profile)
  const profileMutation = useUpdateProfileMutation()
  const usernameMutation = useUpdateUsernameMutation()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [avatarPreview, setAvatarPreview] = useState(profile?.avatar_url || '')
  const [avatarDataUrl, setAvatarDataUrl] = useState(profile?.avatar_url || '')
  const [formData, setFormData] = useState({
    displayName: profile?.username || '',
    username: profile?.username || '',
    bio: profile?.bio || '',
    email: '',
    phone: '',
  })

  const canSave = useMemo(() => formData.username.trim().length > 0, [formData.username])

  return (
    <main className="flex-1 max-w-2xl mx-auto py-8 px-4 pb-24 md:pb-8">
      <div className="bg-card border border-border rounded-2xl p-8">
        <h1 className="text-2xl font-bold mb-8">ویرایش پروفایل</h1>

        <form
          onSubmit={async (event) => {
            event.preventDefault()
            await profileMutation.mutateAsync({
              bio: formData.bio,
              avatar_url: avatarDataUrl,
            })
            if (formData.username !== profile?.username) {
              await usernameMutation.mutateAsync(formData.username)
            }
            router.push(`/profile/${formData.username}`)
          }}
          className="space-y-6"
        >
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar size="xl" src={avatarPreview} />
              <button
                type="button"
                className="absolute bottom-0 left-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors shadow-lg"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="w-5 h-5" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0]
                  if (!file) return
                  const preview = URL.createObjectURL(file)
                  setAvatarPreview(preview)
                  const reader = new FileReader()
                  reader.onload = () => setAvatarDataUrl(String(reader.result || ''))
                  reader.readAsDataURL(file)
                }}
              />
            </div>
            <div>
              <h3 className="font-bold mb-1">تصویر پروفایل</h3>
              <p className="text-sm text-muted-foreground mb-3">فرمت‌های مجاز: JPG، PNG - حداکثر ۵ مگابایت</p>
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                  آپلود تصویر
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setAvatarPreview('')
                    setAvatarDataUrl('')
                  }}
                >
                  حذف
                </Button>
              </div>
            </div>
          </div>

          <div className="h-px bg-border"></div>

          <Input label="نام نمایشی" value={formData.displayName} onChange={(e) => setFormData({ ...formData, displayName: e.target.value })} placeholder="نام و نام خانوادگی" />

          <div>
            <label className="block mb-2 text-sm">نام کاربری</label>
            <div className="relative">
              <Input value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} className="pr-8" placeholder="username" />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">نام کاربری فقط می‌تواند شامل حروف انگلیسی، اعداد و خط تیره باشد</p>
          </div>

          <Textarea
            label="بیوگرافی"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="درباره خود بنویسید..."
            charCount={formData.bio.length}
            maxCharCount={150}
            rows={4}
          />

          <div className="h-px bg-border"></div>

          <Input label="ایمیل" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="example@email.com" />
          <Input label="شماره تماس" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="۰۹۱۲۳۴۵۶۷۸۹" />

          {(profileMutation.isError || usernameMutation.isError) && (
            <p role="alert" className="text-sm text-red-500">
              {apiErrorMessage(profileMutation.error || usernameMutation.error, 'ذخیره تغییرات انجام نشد.')}
            </p>
          )}

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              انصراف
            </Button>
            <Button type="submit" disabled={!canSave || profileMutation.isPending || usernameMutation.isPending}>
              {profileMutation.isPending || usernameMutation.isPending ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
            </Button>
          </div>
        </form>
      </div>
    </main>
  )
}
