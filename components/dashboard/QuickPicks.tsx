'use client';

import { cn } from '@/lib/utils';

const PICKS_FULL  = ['1-0', '2-1', '1-1', '0-0', '1-2'] as const;
const PICKS_DENSE = ['1-0', '2-1', '1-1', '0-0'] as const;

interface QuickPicksProps {
  matchId:    string;
  onPick:     (home: number, away: number) => void;
  disabled?:  boolean;
  selected?:  string | null;
  dense?:     boolean;
}

export function QuickPicks({ matchId, onPick, disabled, selected, dense = false }: QuickPicksProps) {
  const picks = dense ? PICKS_DENSE : PICKS_FULL;

  function handlePick(pick: string) {
    if (pick === 'random') {
      onPick(Math.floor(Math.random() * 4), Math.floor(Math.random() * 4));
      return;
    }
    const parts = pick.split('-').map(Number) as [number, number];
    onPick(parts[0], parts[1]);
  }

  return (
    <div className={cn('flex items-center', dense ? 'gap-1' : 'gap-1.5')}>
      {picks.map(pick => (
        <button
          key={pick}
          type="button"
          data-match-id={matchId}
          className={cn('quick-pick flex-1 min-w-0', selected === pick && 'selected')}
          disabled={disabled}
          onClick={() => handlePick(pick)}
        >
          {pick.replace('-', '–')}
        </button>
      ))}
      {!dense && (
        <button
          type="button"
          className="quick-pick quick-pick-random shrink-0"
          disabled={disabled}
          onClick={() => handlePick('random')}
          aria-label="Marcador aleatorio"
          title="Marcador aleatorio"
        >
          ?
        </button>
      )}
    </div>
  );
}
