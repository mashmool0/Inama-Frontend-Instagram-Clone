'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { ImageIcon, Video, Heart, Users, TrendingUp, Sparkles, Zap } from 'lucide-react'

import { Button } from '@/components/ui/Button'

export function LandingPage() {
  const router = useRouter()
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)

  const features = [
    { icon: ImageIcon, title: 'اشتراک‌گذاری تصاویر', description: 'عکس‌های خود را با دنیا به اشتراک بگذارید', color: 'from-violet-500 to-purple-500' },
    { icon: Video, title: 'ویدیوهای زنده', description: 'لحظات ویژه را در قالب ویدیو ثبت کنید', color: 'from-blue-500 to-cyan-500' },
    { icon: Heart, title: 'تعامل اجتماعی', description: 'با دوستان و کریتورها ارتباط برقرار کنید', color: 'from-pink-500 to-rose-500' },
    { icon: TrendingUp, title: 'کشف محتوا', description: 'ترندها و محتوای جذاب را کشف کنید', color: 'from-amber-500 to-orange-500' },
  ]

  return (
    <div className="min-h-screen bg-background relative overflow-hidden" dir="rtl">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-background"></div>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-accent/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl"></div>

      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-primary/30 rounded-full"
          style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
          animate={{ y: [0, -30, 0], opacity: [0, 1, 0], scale: [0, 1, 0] }}
          transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 5 }}
        />
      ))}

      <div className="container mx-auto px-4 py-6 md:py-8 relative z-10">
        <nav className="flex items-center justify-between mb-12 md:mb-16">
          <motion.div initial={{ opacity: 0, x: 20, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ type: 'spring', duration: 0.8 }} className="flex items-center gap-3 group">
            <motion.div whileHover={{ rotate: 360, scale: 1.1 }} transition={{ duration: 0.6 }} className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative w-14 h-14 bg-gradient-to-br from-primary via-primary/80 to-accent rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/50">
                <ImageIcon className="w-8 h-8 text-white" />
              </div>
            </motion.div>
            <span className="text-4xl font-bold bg-gradient-to-l from-primary via-primary/80 to-accent bg-clip-text text-transparent">اینما</span>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => router.push('/login')} className="hover:bg-primary/10">
              ورود
            </Button>
            <Button onClick={() => router.push('/register')} className="shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40">
              ثبت نام
            </Button>
          </motion.div>
        </nav>

        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-center mb-16 md:mb-20">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: 'spring' }} className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium bg-gradient-to-l from-primary to-accent bg-clip-text text-transparent">پلتفرم پریمیوم اشتراک تصویر</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
              <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="block bg-gradient-to-l from-primary via-primary/90 to-accent bg-clip-text text-transparent">
                دنیای تصویر را
              </motion.span>
              <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="block bg-gradient-to-l from-accent via-primary/90 to-primary bg-clip-text text-transparent">
                با اینما کشف کنید
              </motion.span>
            </h1>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              پلتفرم اشتراک‌گذاری تصاویر و ویدیوها برای خلق، کشف و اشتراک لحظات ویژه زندگی
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" onClick={() => router.push('/register')} className="relative group shadow-2xl shadow-primary/30 overflow-hidden px-8">
                  <span className="relative z-10 flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    شروع کنید
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] animate-gradient"></div>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" variant="outline" onClick={() => router.push('/explore')} className="border-primary/30 hover:bg-primary/10 hover:border-primary/50">
                  کشف محتوا
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 md:mb-20">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 + index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  onMouseEnter={() => setHoveredFeature(index)}
                  onMouseLeave={() => setHoveredFeature(null)}
                  className="relative group cursor-pointer"
                >
                  <div className={`absolute -inset-[1px] bg-gradient-to-br ${feature.color} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur`}></div>
                  <div className="relative bg-card/80 backdrop-blur-xl border border-border/50 rounded-3xl p-6 text-center group-hover:border-transparent transition-all duration-500 h-full">
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-l from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <motion.div animate={{ rotate: hoveredFeature === index ? [0, -10, 10, -10, 0] : 0 }} transition={{ duration: 0.5 }} className="relative mb-4">
                      <div className={`absolute -inset-2 bg-gradient-to-br ${feature.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity`}></div>
                      <div className={`relative w-16 h-16 mx-auto bg-gradient-to-br ${hoveredFeature === index ? feature.color : 'from-secondary to-accent'} rounded-2xl flex items-center justify-center transition-all duration-300 shadow-xl`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                    </motion.div>
                    <h3 className="text-lg font-bold mb-2 bg-gradient-to-l from-foreground to-foreground/80 bg-clip-text">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }} className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { icon: Users, count: '+۱۰۰ هزار', label: 'کاربر فعال', gradient: 'from-violet-500 to-purple-500' },
              { icon: ImageIcon, count: '+۵ میلیون', label: 'پست اشتراک‌گذاری شده', gradient: 'from-blue-500 to-cyan-500' },
              { icon: Heart, count: '+۵۰ میلیون', label: 'تعامل روزانه', gradient: 'from-pink-500 to-rose-500' },
            ].map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div key={index} whileHover={{ y: -5, scale: 1.02 }} className="relative group">
                  <div className={`absolute -inset-[1px] bg-gradient-to-br ${stat.gradient} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur`}></div>
                  <div className="relative bg-card/60 backdrop-blur-2xl border border-border/50 rounded-3xl p-8 group-hover:border-transparent transition-all">
                    <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
                      <Icon className={`w-12 h-12 mx-auto mb-4 bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent`} />
                    </motion.div>
                    <motion.div initial={{ scale: 1 }} whileHover={{ scale: 1.1 }} className={`text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-l ${stat.gradient} bg-clip-text text-transparent`}>
                      {stat.count}
                    </motion.div>
                    <p className="text-muted-foreground">{stat.label}</p>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
