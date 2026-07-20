'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { Upload, X, Image as ImageIcon, Film, CheckCircle, AlertCircle } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'

export function CreatePostPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [caption, setCaption] = useState('')
  const [uploadComplete, setUploadComplete] = useState(false)
  const [error, setError] = useState('')

  const selectFile = (file?: File) => {
    if (!file) return
    if (file.size > 100 * 1024 * 1024) {
      setError('حجم فایل نباید بیشتر از ۱۰۰ مگابایت باشد')
      return
    }
    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    setError('')
  }

  return (
    <main className="flex-1 max-w-3xl mx-auto py-8 px-4 pb-24 md:pb-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">ایجاد پست جدید</h1>
        <p className="text-muted-foreground mt-2">تصاویر و ویدیوهای خود را با دنیا به اشتراک بگذارید</p>
      </div>

      <div className="space-y-6">
        {!selectedFile ? (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              selectFile(e.dataTransfer.files[0])
            }}
            className="border-2 border-dashed border-border rounded-2xl p-12 text-center bg-card hover:border-primary/50 hover:bg-accent/50 transition-all cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center">
              <Upload className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">فایل را اینجا بکشید و رها کنید</h3>
            <p className="text-muted-foreground mb-6">یا کلیک کنید تا فایل را انتخاب کنید</p>
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                <span>JPG، PNG، GIF</span>
              </div>
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4" />
                <span>MP4، MOV</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">حداکثر حجم: ۱۰۰ مگابایت</p>
            <input ref={fileInputRef} type="file" accept="image/*,video/*" onChange={(e) => selectFile(e.target.files?.[0])} className="hidden" />
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="relative">
              {selectedFile.type.startsWith('image/') ? <img src={previewUrl} alt="Preview" className="w-full max-h-96 object-contain bg-muted" /> : <video src={previewUrl} controls className="w-full max-h-96 object-contain bg-muted" />}
              <button onClick={() => setSelectedFile(null)} className="absolute top-4 left-4 w-10 h-10 bg-black/70 hover:bg-black/90 text-white rounded-full flex items-center justify-center transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">نام فایل:</span>
                <span className="font-bold">{selectedFile.name}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">حجم:</span>
                <span className="font-bold">{(selectedFile.size / (1024 * 1024)).toFixed(2)} مگابایت</span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm">{error}</p>
          </motion.div>
        )}

        {selectedFile && (
          <div className="bg-card border border-border rounded-2xl p-6">
            <Textarea label="کپشن" placeholder="توضیحی برای پست خود بنویسید..." value={caption} onChange={(e) => setCaption(e.target.value)} charCount={caption.length} maxCharCount={500} rows={5} />
          </div>
        )}

        <AnimatePresence>
          {uploadComplete && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-600">
              <CheckCircle className="w-5 h-5" />
              <p className="text-sm font-bold">پست با موفقیت منتشر شد!</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-end gap-3">
          <Button variant="outline" onClick={() => router.push('/feed')}>
            انصراف
          </Button>
          <Button
            onClick={async () => {
              if (!selectedFile) return
              setError('سرویس ایجاد پست در حال حاضر در دسترس نیست.')
            }}
            disabled={!selectedFile || uploadComplete}
          >
            انتشار پست
          </Button>
        </div>
      </div>
    </main>
  )
}
