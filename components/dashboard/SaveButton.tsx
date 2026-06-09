'use client';

import { useMemo } from 'react';
import { BookOpen, Share2 } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';

interface SaveButtonProps {
  onSave:      () => void;
  onOpenRules: () => void;
}

export function SaveButton({ onSave, onOpenRules }: SaveButtonProps) {
  const predictions = useGameStore(s => s.predictions);
  const count = useMemo(
    () => Object.values(predictions).filter(p => typeof p.home === 'number' && typeof p.away === 'number').length,
    [predictions],
  );
  const ready = count > 0;

  return (
    <div className="fixed bottom-4 right-4 z-30 flex items-center gap-2">
      <button
        onClick={onOpenRules}
        className="font-display font-semibold text-sm px-4 py-3 rounded-full transition-all flex items-center gap-1.5 border"
        style={{
          background: 'var(--color-bg-2)',
          borderColor: 'var(--color-border)',
          color: 'var(--color-ink)',
        }}
        title="Ver reglas oficiales"
      >
        <BookOpen className="size-4" />
        <span className="hidden sm:inline">Reglas</span>
      </button>
      <button
        onClick={onSave}
        disabled={!ready}
        className="font-display font-semibold text-sm px-5 py-3 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: ready
            ? 'linear-gradient(180deg, #FB9230 0%, #F08925 100%)'
            : 'var(--color-bg-3)',
        }}
      >
        <Share2 className="size-4" strokeWidth={3} />
        Compartir cartilla
        <span className="bg-white/25 text-[11px] font-bold px-2 py-0.5 rounded-full tabular-nums">{count}</span>
      </button>
    </div>
  );
}
