'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'motion/react'
import { ImageIcon, ShieldCheck, Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { getPendingRegistration } from '@/lib/session'
import { useVerifyOtpMutation } from '../hooks'

export function VerifyOtpPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const verifyMutation = useVerifyOtpMutation()
  const pendingRegistration = getPendingRegistration()
  const [code, setCode] = useState('')
  const phone = searchParams.get('phone') || pendingRegistration?.phone || ''

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
            <h1 className="text-3xl font-bold mb-2">تأیید کد</h1>
            <p className="text-muted-foreground">کد ارسال شده به {phone || 'شماره شما'} را وارد کنید</p>
          </div>

          <form
            className="space-y-5"
            onSubmit={async (event) => {
              event.preventDefault()
              await verifyMutation.mutateAsync({ phone, code })
              router.push('/set-username')
            }}
          >
            <div className="relative">
              <Input value={code} onChange={(event) => setCode(event.target.value)} placeholder="کد تأیید" className="text-center text-lg tracking-[0.4em]" required />
              <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            </div>
            <Button type="submit" size="lg" className="w-full">
              {verifyMutation.isPending ? 'در حال تأیید...' : 'تأیید و ادامه'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button onClick={() => router.push('/register')} className="text-muted-foreground hover:text-foreground text-sm transition-colors inline-flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              بازگشت به ثبت نام
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
