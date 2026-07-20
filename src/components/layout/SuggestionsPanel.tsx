'use client';

import { useState } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Flame, Users } from 'lucide-react';
import { motion } from 'motion/react';

export function SuggestionsPanel() {
  const [followedUsers, setFollowedUsers] = useState<number[]>([]);

  const suggestions = [
    { id: 1, avatar: 'https://images.unsplash.com/photo-1600603405959-6d623e92445c?w=100', displayName: 'رضا احمدی', username: 'reza.ahmadi', followers: '۲۵.۳ هزار' },
    { id: 2, avatar: 'https://images.unsplash.com/photo-1667053508464-eb11b394df83?w=100', displayName: 'سارا محمدی', username: 'sara.m', followers: '۱۸.۷ هزار' },
    { id: 3, avatar: 'https://images.unsplash.com/photo-1506863530036-1efeddceb993?w=100', displayName: 'علی کریمی', username: 'ali_karimi', followers: '۳۲.۱ هزار' },
  ];

  const trendingHashtags = [
    { tag: 'عکاسی', posts: '۱۲.۵ هزار', trend: '+۲۳%', color: 'from-violet-500 to-purple-500' },
    { tag: 'طبیعت', posts: '۸.۳ هزار', trend: '+۱۸%', color: 'from-green-500 to-emerald-500' },
    { tag: 'هنر', posts: '۶.۷ هزار', trend: '+۳۵%', color: 'from-pink-500 to-rose-500' },
    { tag: 'مسافرت', posts: '۵.۲ هزار', trend: '+۱۲%', color: 'from-blue-500 to-cyan-500' },
  ];

  const handleFollow = (userId: number) => {
    if (followedUsers.includes(userId)) {
      setFollowedUsers(followedUsers.filter(id => id !== userId));
    } else {
      setFollowedUsers([...followedUsers, userId]);
    }
  };

  return (
    <aside className="hidden lg:block h-screen sticky top-0 w-80 p-6 space-y-6 overflow-y-auto scrollbar-hide" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative group"
      >
        <div className="absolute -inset-[1px] bg-gradient-to-br from-primary/20 via-accent/10 to-primary/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur"></div>

        <div className="relative bg-gradient-to-br from-card/95 to-card/80 backdrop-blur-xl border border-border/50 rounded-3xl p-5 shadow-lg">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-l from-transparent via-primary/50 to-transparent"></div>

          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <Users className="w-4 h-4 text-primary" />
            </div>
            <h3 className="font-bold bg-gradient-to-l from-foreground to-foreground/80 bg-clip-text">پیشنهاد برای شما</h3>
          </div>

          <div className="space-y-4">
            {suggestions.map((user, index) => {
              const isFollowed = followedUsers.includes(user.id);
              return (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center justify-between group/user"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                      <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-tr from-primary/30 to-accent/30 rounded-full blur opacity-0 group-hover/user:opacity-100 transition-opacity"></div>
                        <Avatar src={user.avatar} alt={user.displayName} size="md" className="relative border-2 border-primary/10" />
                      </div>
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate">{user.displayName}</p>
                      <p className="text-xs text-muted-foreground truncate">@{user.username}</p>
                      <p className="text-xs text-muted-foreground/70">{user.followers}</p>
                    </div>
                  </div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant={isFollowed ? "outline" : "primary"}
                      size="sm"
                      onClick={() => handleFollow(user.id)}
                      className="relative overflow-hidden"
                    >
                      <span className="relative z-10">{isFollowed ? 'دنبال شده' : 'دنبال کنید'}</span>
                      {!isFollowed && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover/user:translate-x-[200%] transition-transform duration-1000"></div>
                      )}
                    </Button>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="relative group"
      >
        <div className="absolute -inset-[1px] bg-gradient-to-br from-accent/20 via-primary/10 to-accent/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur"></div>

        <div className="relative bg-gradient-to-br from-card/95 to-card/80 backdrop-blur-xl border border-border/50 rounded-3xl p-5 shadow-lg">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-l from-transparent via-accent/50 to-transparent"></div>

          <div className="flex items-center gap-2 mb-5">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center"
            >
              <Flame className="w-4 h-4 text-orange-500" />
            </motion.div>
            <h3 className="font-bold bg-gradient-to-l from-foreground to-foreground/80 bg-clip-text">هشتگ‌های داغ</h3>
          </div>

          <div className="space-y-3">
            {trendingHashtags.map((item, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ x: -5, scale: 1.02 }}
                className="w-full text-right hover:bg-accent/30 rounded-xl p-3 transition-all group/tag relative overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-l ${item.color} opacity-0 group-hover/tag:opacity-5 transition-opacity`}></div>

                <div className="relative flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-bold text-sm mb-1">
                      <span className={`bg-gradient-to-l ${item.color} bg-clip-text text-transparent`}>#{item.tag}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{item.posts} پست</p>
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="px-2 py-1 bg-green-500/10 text-green-600 text-xs rounded-full font-bold"
                  >
                    {item.trend}
                  </motion.div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-xs text-muted-foreground/60 space-y-2"
      >
        <div className="flex flex-wrap gap-2">
          <a href="#" className="hover:text-foreground hover:underline transition-colors">درباره</a>
          <span>•</span>
          <a href="#" className="hover:text-foreground hover:underline transition-colors">راهنما</a>
          <span>•</span>
          <a href="#" className="hover:text-foreground hover:underline transition-colors">قوانین</a>
          <span>•</span>
          <a href="#" className="hover:text-foreground hover:underline transition-colors">حریم خصوصی</a>
        </div>
        <p className="text-muted-foreground/40">© ۱۴۰۳ اینما - تمامی حقوق محفوظ است</p>
      </motion.div>
    </aside>
  );
}
