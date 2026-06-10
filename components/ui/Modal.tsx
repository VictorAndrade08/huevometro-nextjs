'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { soundClose } from '@/lib/sounds';
import { tapHaptic } from '@/lib/haptic';

interface ModalProps {
  open:     boolean;
  onClose:  () => void;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ open, onClose, children, className }: ModalProps) {
  const close = React.useCallback(() => {
    tapHaptic();
    soundClose();
    onClose();
  }, [onClose]);

  React.useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onEsc);
      document.body.style.overflow = '';
    };
  }, [open, close]);

  if (!open) return null;

  return (
    <div
      className="modal-overlay show"
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
      role="dialog"
      aria-modal="true"
    >
      <div className={cn('modal-box', className)}>
        {children}
      </div>
    </div>
  );
}

interface ModalHeaderProps {
  title:     string;
  subtitle?: string;
  onClose:   () => void;
}

export function ModalHeader({ title, subtitle, onClose }: ModalHeaderProps) {
  return (
    <div className="flex justify-between items-start p-6 pb-2">
      <div>
        <h3 className="font-display text-2xl uppercase font-bold text-ink">{title}</h3>
        {subtitle ? <p className="text-xs text-ink/60 mt-1">{subtitle}</p> : null}
      </div>
      <button
        onClick={onClose}
        aria-label="Cerrar"
        className="text-ink/40 hover:text-ink p-1 -mr-1"
      >
        <X className="size-6" />
      </button>
    </div>
  );
}
