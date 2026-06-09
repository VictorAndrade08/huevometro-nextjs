'use client';

import { useCallback, useState } from 'react';

interface ToastState {
  message: string;
  type: 'ok' | 'warn';
  visible: boolean;
}

export function useToast() {
  const [toast, setToast] = useState<ToastState>({ message: '', type: 'ok', visible: false });

  const showToast = useCallback((message: string, type: 'ok' | 'warn' = 'ok') => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 2800);
  }, []);

  return { toast, showToast };
}
