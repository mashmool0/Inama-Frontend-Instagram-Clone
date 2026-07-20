'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { ImageIcon, Mail, Lock, User, Eye, EyeOff, Sparkles, Check } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { apiErrorMessage } from '@/lib/api-error'
import { useRegisterMutation } from '../hooks'

export function RegisterPage() {
  const router = useRouter()
  const registerMutation = useRegisterMutation()
  const [showPassword, setShowPassword] = useState(false)
  const [validationError, setValidationError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  })

  const benefits = [
    'اشتراک‌گذاری نامحدود تصاویر و ویدیو',
    'دسترسی به محتوای ترند و اکسپلور',
    'ارتباط با کریتورهای محبوب',
    'فضای ذخیره‌سازی ابری رایگان',
  ]

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center p-4" dir="rtl">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-background"></div>
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-bl from-accent/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-accent/40 rounded-full"
          style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
          animate={{ y: [0, -20, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 2 + Math.random(), repeat: Infinity, delay: Math.random() * 3 }}
        />
      ))}

      <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: 'spring', duration: 0.8 }} className="w-full max-w-5xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="hidden lg:block">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-2xl"></div>
              <div className="relative bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-xl border border-border/50 rounded-3xl p-8">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-l from-transparent via-primary/50 to-transparent"></div>
                <Sparkles className="w-12 h-12 text-primary mb-6" />
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-l from-foreground to-foreground/80 bg-clip-text">به خانواده اینما بپیوندید</h2>
                <p className="text-muted-foreground mb-8 leading-relaxed">با عضویت در اینما، به بزرگترین پلتفرم اشتراک‌گذاری تصویر فارسی‌زبان دسترسی پیدا کنید</p>

                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + index * 0.1 }} className="flex items-start gap-3 group">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-foreground/80 group-hover:text-foreground transition-colors">{benefit}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="w-full">
            <div className="text-center mb-8 lg:hidden">
              <div className="inline-flex items-center gap-3 mb-6 group">
                <motion.div whileHover={{ rotate: 360, scale: 1.1 }} transition={{ duration: 0.6 }} className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative w-16 h-16 bg-gradient-to-br from-primary via-primary/80 to-accent rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/50">
                    <ImageIcon className="w-9 h-9 text-white" />
                  </div>
                </motion.div>
                <span className="text-4xl font-bold bg-gradient-to-l from-primary via-primary/80 to-accent bg-clip-text text-transparent">اینما</span>
              </div>
              <h1 className="text-3xl font-bold mb-2">عضویت در اینما</h1>
              <p className="text-muted-foreground">حساب کاربری جدید بسازید</p>
            </div>

            <div className="relative group">
              <div className="absolute -inset-[1px] bg-gradient-to-br from-primary/30 via-accent/20 to-primary/30 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur"></div>
              <div className="relative bg-card/80 backdrop-blur-xl border border-border/50 rounded-3xl shadow-2xl shadow-primary/10 p-6 md:p-8">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-l from-transparent via-accent/50 to-transparent"></div>
                <div className="hidden lg:block text-center mb-6">
                  <h1 className="text-2xl font-bold mb-2">عضویت در اینما</h1>
                  <p className="text-sm text-muted-foreground">حساب کاربری جدید بسازید</p>
                </div>

                <form
                  onSubmit={async (event) => {
                    event.preventDefault()
                    setValidationError('')
                    if (formData.password !== formData.confirmPassword) {
                      setValidationError('رمز عبور و تکرار آن یکسان نیستند.')
                      return
                    }
                    const result = await registerMutation.mutateAsync({
                      email: formData.email,
                      username: formData.username,
                      password: formData.password,
                    })
                    router.push(`/profile/${encodeURIComponent(result.profile.username)}`)
                  }}
                  className="space-y-4"
                >
                  <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="relative group/input">
                    <Input value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} type="email" placeholder="ایمیل" className="pr-12 bg-input-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50" required />
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-hover/input:text-primary transition-colors" />
                  </motion.div>

                  <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="relative group/input">
                    <Input value={formData.username} onChange={(event) => setFormData({ ...formData, username: event.target.value })} type="text" placeholder="نام کاربری" className="pr-12 bg-input-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50" required />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-hover/input:text-primary transition-colors font-bold">@</span>
                  </motion.div>

                  <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.6 }} className="relative group/input">
                    <Input value={formData.password} onChange={(event) => setFormData({ ...formData, password: event.target.value })} type={showPassword ? 'text' : 'password'} placeholder="رمز عبور" className="pr-12 bg-input-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50" required />
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-hover/input:text-primary transition-colors" />
                  </motion.div>

                  <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.7 }} className="relative group/input">
                    <Input value={formData.confirmPassword} onChange={(event) => setFormData({ ...formData, confirmPassword: event.target.value })} type={showPassword ? 'text' : 'password'} placeholder="تکرار رمز عبور" className="pr-12 bg-input-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50" required />
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-hover/input:text-primary transition-colors" />
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </motion.button>
                  </motion.div>

                  {(validationError || registerMutation.isError) && (
                    <p role="alert" className="text-sm text-red-500">
                      {validationError || apiErrorMessage(registerMutation.error, 'ثبت نام انجام نشد. اطلاعات را بررسی کنید.')}
                    </p>
                  )}

                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-xs text-muted-foreground leading-relaxed bg-muted/30 p-3 rounded-xl">
                    با ثبت نام، <span className="text-primary cursor-pointer hover:underline">شرایط استفاده</span> و <span className="text-primary cursor-pointer hover:underline">حریم خصوصی</span> را می‌پذیرید.
                  </motion.div>

                  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.9 }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button type="submit" disabled={registerMutation.isPending} className="w-full relative overflow-hidden group/btn shadow-lg shadow-accent/30" size="lg">
                      <span className="relative z-10">{registerMutation.isPending ? 'در حال ثبت نام...' : 'ثبت نام'}</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-1000"></div>
                    </Button>
                  </motion.div>
                </form>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-6 text-center">
                  <span className="text-muted-foreground text-sm">قبلاً ثبت نام کرده‌اید؟ </span>
                  <button onClick={() => router.push('/login')} className="text-primary hover:underline text-sm font-medium">
                    وارد شوید
                  </button>
                </motion.div>
              </div>
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} className="mt-6 text-center">
              <button onClick={() => router.push('/')} className="text-muted-foreground hover:text-foreground text-sm transition-colors inline-flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                بازگشت به صفحه اصلی
              </button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
