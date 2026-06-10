'use client';

import { useMemo } from 'react';
import { Trophy } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { WEEK_BUCKETS, getWeekFor } from '@/lib/weeks';
import { isLocked } from '@/lib/scoring';
import { TriSpotlight } from './TriSpotlight';
import { WeekAccordion } from './WeekAccordion';
import type { Match, Prediction } from '@/types';

interface MatchesListProps {
  matches: Match[];
  onShareMatch?: (match: Match) => void;
  onShareGroup?: (matches: Match[], label: string) => void;
}

const isDone = (m: Match, predictions: Record<string, Prediction>): boolean => {
  const p = predictions[m.id];
  return !!p && typeof p.home === 'number' && typeof p.away === 'number';
};

export function MatchesList({ matches, onShareMatch, onShareGroup }: MatchesListProps) {
  const filter      = useGameStore(s => s.currentFilter);
  const predictions = useGameStore(s => s.predictions);

  const playable    = useMemo(() => matches.filter(m => !m.isPlaceholder), [matches]);
  const hiddenCount = matches.length - playable.length;

  const triMatches  = useMemo(
    () => playable.filter(m => m.isTri).sort((a,b) => a.kickoff.localeCompare(b.kickoff)),
    [playable],
  );
  const triDone     = triMatches.filter(m => isDone(m, predictions)).length;

  const scope = useMemo(() => {
    if (filter === 'all')      return playable;
    if (filter === 'tri')      return [] as Match[];
    if (filter === 'pending')  return playable.filter(m => !isDone(m, predictions) && !isLocked(m));
    if (filter === 'done')     return playable.filter(m => isDone(m, predictions));
    if (filter === 'upcoming') return playable.filter(m => !isLocked(m));
    return playable;
  }, [filter, playable, predictions]);

  const byWeek = useMemo(() => {
    const map = new Map<number, Match[]>();
    WEEK_BUCKETS.forEach(w => map.set(w.id, []));
    scope.forEach(m => {
      const w = getWeekFor(m);
      map.get(w.id)!.push(m);
    });
    return map;
  }, [scope]);

  const showTriSpotlight = filter === 'tri' && triMatches.length > 0;
  const showHiddenNote   = hiddenCount > 0 && (filter === 'all' || filter === 'upcoming');

  return (
    <>
      {showTriSpotlight && (
        <TriSpotlight matches={triMatches} doneCount={triDone} onShareMatch={onShareMatch} />
      )}

      {WEEK_BUCKETS.map(bucket => {
        const ms = (byWeek.get(bucket.id) ?? []).sort((a,b) => a.kickoff.localeCompare(b.kickoff));
        const doneCount = ms.filter(m => isDone(m, predictions)).length;
        return (
          <WeekAccordion
            key={bucket.id}
            bucket={bucket}
            matches={ms}
            doneCount={doneCount}
            onShareMatch={onShareMatch}
            onShareGroup={onShareGroup}
          />
        );
      })}

      {showHiddenNote && (
        <div
          className="rounded-2xl p-7 text-center border-2 border-dashed"
          style={{ background: 'var(--color-bg-2)', borderColor: 'var(--color-border)' }}
        >
          <div className="mx-auto w-16 h-16 rounded-full bg-bio-500/15 flex items-center justify-center mb-3">
            <Trophy className="size-8 text-bio-300" strokeWidth={2.5} />
          </div>
          <p className="font-display font-bold text-bio-200 text-lg">
            {hiddenCount} partidos de eliminatorias por definir
          </p>
          <p className="text-base text-bio-200/65 mt-1.5">
            Aparecerán cuando se definan los clasificados de cada grupo
          </p>
        </div>
      )}
    </>
  );
}
