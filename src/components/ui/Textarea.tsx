'use client';

import { TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/cn';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  charCount?: number;
  maxCharCount?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, charCount, maxCharCount, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm text-foreground">{label}</label>
            {maxCharCount && (
              <span className={cn('text-sm', charCount && charCount > maxCharCount ? 'text-destructive' : 'text-muted-foreground')}>
                {charCount || 0} / {maxCharCount}
              </span>
            )}
          </div>
        )}
        <textarea
          ref={ref}
          className={cn(
            'w-full min-h-24 p-4 bg-input-background border border-border rounded-xl',
            'text-foreground placeholder:text-muted-foreground resize-y',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-destructive focus:ring-destructive',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-destructive">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
