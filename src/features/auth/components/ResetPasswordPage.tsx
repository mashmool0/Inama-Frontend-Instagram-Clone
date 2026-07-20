'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { useSearchParams } from 'next/navigation'
import { ImageIcon, Lock, Mail, Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useRequestPasswordResetMutation, useResetPasswordMutation } from '../hooks'

export function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const requestMutation = useRequestPasswordResetMutation()
  const resetMutation = useResetPasswordMutation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const resetToken = searchParams.get('token')

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center p-4" dir="rtl">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-background"></div>
      <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: 'spring', duration: 0.8 }} className="w-full max-w-md relative z-10">
        <div className="relative bg-card/80 backdrop-blur-xl border border-border/50 rounded-3xl shadow-2xl shadow-primary/10 p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-6 group">
              <div className="relative w-16 h-16 bg-gradient-to-br from-primary via-primary/80 to-accent rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/50">
                <ImageIcon className="w-9 h-9 text-white" />
              </div>
              <span className="text-4xl font-bold bg-gradient-to-l from-primary via-primary/80 to-accent bg-clip-text text-transparent">اینما</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">بازیابی رمز عبور</h1>
            <p className="text-muted-foreground">{resetToken ? 'رمز عبور جدید خود را وارد کنید' : 'آدرس ایمیل خود را وارد کنید'}</p>
          </div>

          {!resetToken ? (
            <form
              className="space-y-5"
              onSubmit={async (event) => {
                event.preventDefault()
                await requestMutation.mutateAsync(email)
              }}
            >
              <div className="relative">
                <Input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="آدرس ایمیل" className="pr-12" required />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              </div>
              <Button type="submit" size="lg" className="w-full">
                {requestMutation.isPending ? 'در حال ارسال...' : 'ارسال لینک بازیابی'}
              </Button>
            </form>
          ) : (
            <form
              className="space-y-5"
              onSubmit={async (event) => {
                event.preventDefault()
                await resetMutation.mutateAsync({ token: resetToken, password })
              }}
            >
              <div className="relative">
                <Input value={password} onChange={(event) => setPassword(event.target.value)} placeholder="رمز عبور جدید" type="password" className="pr-12" required />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              </div>
              <Button type="submit" size="lg" className="w-full">
                {resetMutation.isPending ? 'در حال ذخیره...' : 'ذخیره رمز عبور'}
              </Button>
            </form>
          )}

          <div className="mt-6 text-center text-muted-foreground text-sm inline-flex w-full items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            پس از موفقیت به صفحه ورود بازگردید
          </div>
        </div>
      </motion.div>
    </div>
  )
}
