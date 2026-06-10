'use client';

import { ChevronDown, Calendar, Share2, Lock, Dices } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGameStore } from '@/store/gameStore';
import { formatDayLabel, formatWeekRange, groupByDay } from '@/lib/weeks';
import { isLocked } from '@/lib/scoring';
import { tapHaptic } from '@/lib/haptic';
import { soundComplete, soundPick, soundToggle } from '@/lib/sounds';
import { MatchCard } from './MatchCard';
import type { Match, WeekBucket } from '@/types';

interface WeekAccordionProps {
  bucket:    WeekBucket;
  matches:   Match[];
  doneCount: number;
  onShareMatch?: (match: Match) => void;
  onShareGroup?: (matches: Match[], label: string) => void;
}

export function WeekAccordion({ bucket, matches, doneCount, onShareMatch, onShareGroup }: WeekAccordionProps) {
  const openWeeks    = useGameStore(s => s.openWeeks);
  const toggleWeek   = useGameStore(s => s.toggleWeek);
  const predictions  = useGameStore(s => s.predictions);
  const applyQuickPick = useGameStore(s => s.applyQuickPick);

  function fillRandom() {
    tapHaptic();
    soundComplete();
    matches.forEach(m => {
      if (isLocked(m)) return;
      const p = predictions[m.id];
      const has = !!p && typeof p.home === 'number' && typeof p.away === 'number';
      if (has) return;
      applyQuickPick(m.id, Math.floor(Math.random() * 4), Math.floor(Math.random() * 4));
    });
  }

  function handleToggle() {
    tapHaptic();
    soundToggle();
    toggleWeek(bucket.id);
  }

  function handleShareGroup() {
    tapHaptic();
    soundPick();
    onShareGroup?.(matches, label);
  }

  if (matches.length === 0) return null;

  const isOpen  = openWeeks.includes(bucket.id);
  const allDone = doneCount === matches.length && matches.length > 0;
  const days    = groupByDay(matches);
  const label   = `${bucket.title}: ${bucket.subtitle}`;
  const remaining = matches.length - doneCount;

  return (
    <div
      className="week-accordion rounded-2xl shadow-lg border overflow-hidden"
      style={{ background: 'var(--color-bg-2)', borderColor: 'var(--color-border)' }}
    >
      <button
        className="w-full flex items-center justify-between gap-3 p-5 hover:brightness-125 transition"
        onClick={handleToggle}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-4 text-left min-w-0">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-bio-500/15 shrink-0">
            <Calendar className="size-6 text-bio-300" strokeWidth={2.5} />
          </div>
          <div className="min-w-0">
            <div className="font-display text-lg md:text-xl text-white leading-tight tracking-tight truncate">
              {bucket.title}: <span className="text-bio-300">{bucket.subtitle}</span>
            </div>
            <div className="text-sm text-bio-200/65 font-medium mt-0.5">
              {formatWeekRange(bucket)} · {matches.length} partidos
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={cn(
            'text-sm font-display font-bold px-3 py-1.5 rounded-full tabular-nums',
            allDone
              ? 'bg-emerald-500/20 text-emerald-300'
              : doneCount > 0
                ? 'bg-bio-500/20 text-bio-300'
                : 'text-bio-200/50',
          )}
          style={!allDone && doneCount === 0 ? { background: 'var(--color-bg-3)' } : undefined}
          >
            {doneCount}/{matches.length}
          </span>
          <ChevronDown
            className={cn('text-bio-300 size-6 transition-transform', isOpen && 'rotate-180')}
          />
        </div>
      </button>

      {isOpen && (
        <div
          className="border-t"
          style={{ background: 'rgba(10,26,18,0.55)', borderColor: 'var(--color-border)' }}
        >
          {/* Bulk: llenar al azar lo faltante */}
          {remaining > 0 && (
            <div className="px-4 pt-4 flex items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={fillRandom}
                className="inline-flex items-center gap-2 px-4 h-11 rounded-xl border text-base font-display font-bold text-bio-200 hover:text-white hover:border-bio-400 transition"
                style={{ background: 'var(--color-bg-3)', borderColor: 'var(--color-border)' }}
              >
                <Dices className="size-5" strokeWidth={2.5} />
                Llenar al azar
              </button>
              <span className="text-sm text-bio-200/65">Después ajustá los que quieras</span>
            </div>
          )}

          {/* CTA cartilla — solo se habilita con la jornada completa */}
          {onShareGroup && (
            <div className="px-4 pt-4">
              <button
                type="button"
                disabled={!allDone}
                onClick={handleShareGroup}
                className={cn(
                  'w-full inline-flex items-center justify-center gap-2.5 h-14 rounded-2xl font-display font-bold text-lg transition border-2',
                  allDone
                    ? 'bg-gradient-to-br from-bio-400 to-bio-600 text-white border-bio-700 hover:brightness-110 active:scale-[0.98] share-cta-glow'
                    : 'cursor-not-allowed',
                )}
                style={
                  allDone
                    ? undefined
                    : {
                        background: 'var(--color-bg-3)',
                        borderColor: 'var(--color-border)',
                        color: 'rgba(255,224,181,0.55)',
                      }
                }
              >
                {allDone
                  ? <><Share2 className="size-6" strokeWidth={2.5} /> Compartir cartilla de la jornada</>
                  : <><Lock className="size-5" strokeWidth={2.5} /> Faltan {remaining} {remaining === 1 ? 'partido' : 'partidos'} para generar la cartilla</>
                }
              </button>
            </div>
          )}

          <div className="p-4 space-y-5">
            {days.map(([dayIso, dayMatches]) => (
              <div key={dayIso} className="day-group">
                <div
                  className="flex items-center gap-2.5 mb-3 py-2.5 px-4 rounded-xl border"
                  style={{ background: 'var(--color-bg-3)', borderColor: 'var(--color-border)' }}
                >
                  <Calendar className="size-5 text-bio-300" strokeWidth={2.5} />
                  <span className="font-display font-bold text-base md:text-lg text-bio-200 tracking-tight">
                    {formatDayLabel(dayIso)}
                  </span>
                  <span className="text-sm text-bio-200/55 font-medium">
                    · {dayMatches.length} {dayMatches.length === 1 ? 'partido' : 'partidos'}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {dayMatches.map(m => <MatchCard key={m.id} match={m} onShare={onShareMatch} />)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
