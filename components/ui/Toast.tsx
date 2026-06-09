'use client';

import { cn } from '@/lib/utils';

interface ToastProps {
  message:  string;
  type?:    'ok' | 'warn';
  visible:  boolean;
}

export function Toast({ message, type = 'ok', visible }: ToastProps) {
  return (
    <div
      className={cn('toast', visible && 'show')}
      style={{ background: type === 'warn' ? '#D08F33' : '#16A34A' }}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
}
