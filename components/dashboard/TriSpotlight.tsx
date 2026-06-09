'use client';

import { Dices } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Flag } from '@/components/ui/Flag';
import { useGameStore } from '@/store/gameStore';
import { isLocked } from '@/lib/scoring';
import { MatchCard } from './MatchCard';
import type { Match } from '@/types';

interface TriSpotlightProps {
  matches:   Match[];
  doneCount: number;
  onShareMatch?: (match: Match) => void;
}

export function TriSpotlight({ matches, doneCount, onShareMatch }: TriSpotlightProps) {
  const predictions    = useGameStore(s => s.predictions);
  const applyQuickPick = useGameStore(s => s.applyQuickPick);

  if (matches.length === 0) return null;
  const allDone   = doneCount === matches.length;
  const remaining = matches.length - doneCount;

  function fillRandom() {
    matches.forEach(m => {
      if (isLocked(m)) return;
      const p = predictions[m.id];
      const has = !!p && typeof p.home === 'number' && typeof p.away === 'number';
      if (has) return;
      applyQuickPick(m.id, Math.floor(Math.random() * 4), Math.floor(Math.random() * 4));
    });
  }

  return (
    <div className="rounded-2xl shadow-xl p-1 mb-3" style={{ background: 'linear-gradient(135deg, #F08925 0%, #A85912 100%)' }}>
      <div className="rounded-xl p-3 sm:p-4" style={{ background: 'var(--color-bg-2)' }}>
        <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Flag code="ec" alt="Ecuador" size={28} className="shrink-0 shadow-md" />
            <div className="min-w-0">
              <h3 className="font-display text-base sm:text-lg md:text-xl font-bold text-white leading-tight tracking-tight">
                Los partidos de La Tri
              </h3>
              <p className="text-[11px] sm:text-xs text-bio-200/70 mt-0.5">
                Cada acierto vale <strong className="text-bio-300">×2</strong> · Pronosticá acá primero
              </p>
            </div>
          </div>
          <Badge tone={allDone ? 'success' : 'bio'} className="font-display font-semibold shrink-0">
            {doneCount}/{matches.length}
          </Badge>
        </div>

        {remaining > 0 && (
          <div className="mb-3 flex items-center gap-2">
            <button
              type="button"
              onClick={fillRandom}
              className="inline-flex items-center gap-1.5 px-3 h-9 rounded-lg border text-xs font-display font-semibold text-bio-200 hover:text-white hover:border-bio-400 transition"
              style={{ background: 'var(--color-bg-3)', borderColor: 'var(--color-border)' }}
            >
              <Dices className="size-3.5" strokeWidth={2.5} />
              Llenar al azar
            </button>
            <span className="text-[11px] text-bio-200/55">Después ajustá los que quieras</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matches.map(m => <MatchCard key={m.id} match={m} onShare={onShareMatch} />)}
        </div>
      </div>
    </div>
  );
}
