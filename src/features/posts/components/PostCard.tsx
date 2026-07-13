'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Heart, MessageCircle, Send, Bookmark, MoreVertical, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/cn';

interface PostProps {
  id: string;
  author: {
    avatar?: string;
    displayName: string;
    username: string;
  };
  image: string;
  caption?: string;
  likes: number;
  comments: number;
  timestamp: string;
  isLiked?: boolean;
  isSaved?: boolean;
  onLikeToggle?: (nextLiked: boolean) => Promise<unknown> | void;
  onSubmitComment?: (body: string) => Promise<unknown> | void;
}

export function Post({ id, author, image, caption, likes, comments, timestamp, isLiked = false, isSaved = false, onLikeToggle, onSubmitComment }: PostProps) {
  const [liked, setLiked] = useState(isLiked);
  const [saved, setSaved] = useState(isSaved);
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);
  const [likesCount, setLikesCount] = useState(likes);
  const [commentBody, setCommentBody] = useState('');

  const handleDoubleClick = () => {
    if (!liked) {
      setLiked(true);
      setLikesCount(likesCount + 1);
      setShowLikeAnimation(true);
      setTimeout(() => setShowLikeAnimation(false), 1000);
    }
  };

  const handleLike = async () => {
    const nextLiked = !liked;
    if (liked) {
      setLikesCount(likesCount - 1);
    } else {
      setLikesCount(likesCount + 1);
    }
    setLiked(nextLiked);
    try {
      await onLikeToggle?.(nextLiked);
    } catch {
      setLiked(!nextLiked);
      setLikesCount(likesCount);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="relative group"
    >
      <div className="absolute -inset-[1px] bg-gradient-to-br from-primary/20 via-accent/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>

      <div className="relative bg-gradient-to-br from-card/95 to-card/80 backdrop-blur-xl border border-border/50 rounded-3xl overflow-hidden shadow-xl shadow-primary/5 group-hover:shadow-2xl group-hover:shadow-primary/10 transition-all duration-500">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-l from-transparent via-primary/50 to-transparent"></div>

        <div className="p-4 md:p-5 flex items-center justify-between relative">
          <Link href={`/profile/${author.username}`} className="flex items-center gap-3">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-tr from-primary/30 to-accent/30 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Avatar src={author.avatar} alt={author.displayName} size="md" className="relative border-2 border-primary/20" />
              </div>
            </motion.div>
            <div>
              <h3 className="font-bold bg-gradient-to-l from-foreground to-foreground/80 bg-clip-text">{author.displayName}</h3>
              <p className="text-sm text-muted-foreground">@{author.username}</p>
            </div>
          </Link>
          <motion.button
            whileHover={{ rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 hover:bg-accent/50 rounded-xl transition-colors"
          >
            <MoreVertical className="w-5 h-5 text-muted-foreground" />
          </motion.button>
        </div>

        <Link href={`/posts/${id}`} className="relative block bg-gradient-to-br from-muted/50 to-muted group/image cursor-pointer" onDoubleClick={handleDoubleClick}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity"></div>
          <img src={image} alt="" className="w-full aspect-square object-cover" />

          <AnimatePresence>
            {showLikeAnimation && (
              <>
                <motion.div
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 1.3, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
                >
                  <Heart className="w-28 h-28 text-white fill-white drop-shadow-2xl" />
                </motion.div>
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, opacity: 1, x: 0, y: 0 }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [1, 1, 0],
                      x: Math.cos((i * Math.PI * 2) / 8) * 100,
                      y: Math.sin((i * Math.PI * 2) / 8) * 100,
                    }}
                    transition={{ duration: 0.8, delay: i * 0.05 }}
                    className="absolute top-1/2 left-1/2 pointer-events-none"
                  >
                    <Sparkles className="w-6 h-6 text-primary" />
                  </motion.div>
                ))}
              </>
            )}
          </AnimatePresence>
        </Link>

        <div className="p-4 md:p-5 space-y-3 md:space-y-4 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleLike}
                className="group/like relative"
              >
                <AnimatePresence>
                  {liked && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.5, 1] }}
                      exit={{ scale: 0 }}
                      className="absolute -inset-2 bg-red-500/20 rounded-full"
                    />
                  )}
                </AnimatePresence>
                <Heart
                  className={cn(
                    'w-7 h-7 transition-all duration-300 relative z-10',
                    liked ? 'text-red-500 fill-red-500 scale-110' : 'text-foreground group-hover/like:text-red-500 group-hover/like:scale-110'
                  )}
                />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="group/comment"
              >
                <MessageCircle className="w-7 h-7 text-foreground group-hover/comment:text-primary group-hover/comment:scale-110 transition-all" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.2, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
                className="group/send"
              >
                <Send className="w-7 h-7 text-foreground group-hover/send:text-primary group-hover/send:scale-110 transition-all" />
              </motion.button>
            </div>

            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSaved(!saved)}
              className="group/save relative"
            >
              <AnimatePresence>
                {saved && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.5, 1] }}
                    exit={{ scale: 0 }}
                    className="absolute -inset-2 bg-primary/20 rounded-full"
                  />
                )}
              </AnimatePresence>
              <Bookmark
                className={cn(
                  'w-7 h-7 transition-all duration-300 relative z-10',
                  saved ? 'text-primary fill-primary scale-110' : 'text-foreground group-hover/save:text-primary group-hover/save:scale-110'
                )}
              />
            </motion.button>
          </div>

          <motion.div layout>
            <motion.p
              key={likesCount}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="font-bold bg-gradient-to-l from-primary to-primary/60 bg-clip-text text-transparent inline-block"
            >
              {likesCount.toLocaleString('fa-IR')} پسند
            </motion.p>
            {caption && (
              <p className="text-sm mt-2 leading-relaxed">
                <span className="font-bold ml-2 bg-gradient-to-l from-foreground to-foreground/80 bg-clip-text text-transparent">{author.username}</span>
                <span className="text-foreground/90">{caption}</span>
              </p>
            )}
          </motion.div>

          {comments > 0 && (
            <Link href={`/posts/${id}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors hover:underline">
              مشاهده تمام {comments.toLocaleString('fa-IR')} نظر
            </Link>
          )}

          <p className="text-xs text-muted-foreground/80">{timestamp}</p>

          <div className="flex items-center gap-2 pt-3 border-t border-border/50">
            <input
              type="text"
              placeholder="افزودن نظر..."
              value={commentBody}
              onChange={(event) => setCommentBody(event.target.value)}
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground/70 focus:placeholder:text-muted-foreground transition-colors"
            />
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-primary/10"
              onClick={async () => {
                if (!commentBody.trim()) {
                  return
                }
                await onSubmitComment?.(commentBody)
                setCommentBody('')
              }}
            >
              ارسال
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
