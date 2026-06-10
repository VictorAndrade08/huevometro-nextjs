'use client';

import { useMemo } from 'react';
import { Lock, Clock, Check, AlertTriangle, Minus, Plus, X, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatMatchDate, isClosingSoon, isLocked, timeUntilKickoff } from '@/lib/scoring';
import { tapHaptic } from '@/lib/haptic';
import { soundTap, soundPick, soundClear } from '@/lib/sounds';
import { useGameStore } from '@/store/gameStore';
import { useNow } from '@/hooks/useNow';
import { Flag } from '@/components/ui/Flag';
import { QuickPicks } from './QuickPicks';
import type { Match } from '@/types';

interface MatchCardProps {
  match: Match;
  dense?: boolean;
  onShare?: (match: Match) => void;
}

export function MatchCard({ match, dense = false, onShare }: MatchCardProps) {
  const prediction       = useGameStore(s => s.predictions[match.id]);
  const changePrediction = useGameStore(s => s.changePrediction);
  const applyQuickPick   = useGameStore(s => s.applyQuickPick);
  const clearPrediction  = useGameStore(s => s.clearPrediction);

  const home = prediction?.home ?? 0;
  const away = prediction?.away ?? 0;
  const hasPrediction = typeof prediction?.home === 'number' && typeof prediction?.away === 'number';

  const now          = useNow();
  const locked       = useMemo(() => isLocked(match),       [match, now]);
  const closingSoon  = useMemo(() => isClosingSoon(match),  [match, now]);
  const countdown    = useMemo(() => timeUntilKickoff(match.kickoff), [match, now]);

  const cardClasses = cn(
    'match-card rounded-2xl shadow-lg overflow-hidden border flex flex-col',
    dense ? 'min-h-[260px]' : 'min-h-[300px]',
    match.isTri && 'ring-1 ring-bio-400/40',
    hasPrediction && 'ring-2 ring-emerald-500/30',
    locked && 'opacity-70',
    closingSoon && !locked && 'ring-2 ring-red-500/40',
  );

  const cardStyle: React.CSSProperties = {
    background: match.isTri
      ? 'linear-gradient(160deg, rgba(240,137,37,0.16) 0%, var(--color-bg-2) 60%)'
      : 'var(--color-bg-2)',
    borderColor: 'var(--color-border)',
  };

  const metaClasses = cn(
    'flex items-center justify-between gap-2 px-3 py-2.5 text-sm md:text-base font-display font-bold border-b',
    closingSoon && !locked ? 'text-red-300' : 'text-bio-200/75',
  );

  const metaStyle: React.CSSProperties = {
    background: closingSoon && !locked ? 'rgba(239,68,68,0.08)' : 'rgba(255,224,181,0.03)',
    borderColor: 'var(--color-border)',
  };

  const flagSize = dense ? 16 : 22;

  function handleChange(team: 'home' | 'away', delta: 1 | -1) {
    tapHaptic();
    soundTap();
    changePrediction(match.id, team, delta);
  }

  function handleQuickPick(h: number, a: number) {
    tapHaptic();
    soundPick();
    applyQuickPick(match.id, h, a);
  }

  function handleClear() {
    tapHaptic();
    soundClear();
    clearPrediction(match.id);
  }

  return (
    <div
      className={cardClasses}
      data-match-id={match.id}
      data-pending={!hasPrediction && !locked ? 'true' : 'false'}
      style={cardStyle}
    >
      {/* Meta row */}
      <div className={metaClasses} style={metaStyle}>
        <span className="flex items-center gap-1.5 min-w-0 truncate">
          {match.isTri && <Flag code="ec" size={11} alt="EC" />}
          <span className="truncate">{formatMatchDate(match.kickoff)} · {match.stage}</span>
        </span>
        <span className="flex items-center gap-2 shrink-0 text-sm md:text-base">
          {match.isTri && (
            <span className="bg-bio-500 text-white px-2 py-1 rounded-md text-xs md:text-sm font-display font-bold tracking-wide">
              ×2
            </span>
          )}
          {locked ? (
            <span className="bg-red-500/15 text-red-300 px-2 py-1 rounded-md flex items-center gap-1.5 font-display font-bold">
              <Lock className="size-4" /> Cerrado
            </span>
          ) : closingSoon ? (
            <span className="bg-red-500 text-white px-2 py-1 rounded-md flex items-center gap-1.5 font-display font-bold animate-pulse">
              <AlertTriangle className="size-4" /> {countdown}
            </span>
          ) : hasPrediction ? (
            <span className="text-emerald-400 flex items-center gap-1.5 font-display font-bold">
              <Check className="size-4" strokeWidth={3} /> Listo
            </span>
          ) : countdown ? (
            <span className="text-bio-200/60 flex items-center gap-1.5 font-display font-semibold">
              <Clock className="size-4" /> {countdown}
            </span>
          ) : null}
        </span>
      </div>

      <div className={cn('flex-1 flex flex-col', dense ? 'p-3 gap-2.5' : 'p-4 gap-3')}>
        {/* HOME row */}
        <div className={cn('grid grid-cols-[auto_1fr_auto] items-center', dense ? 'gap-2.5' : 'gap-3')}>
          <Flag code={match.homeFlag} alt={match.homeTeam} size={flagSize} />
          <span className={cn('font-display text-white leading-tight break-words', dense ? 'text-sm' : 'text-base')}>
            {match.homeTeam}
          </span>
          <TeamCounter
            value={home}
            hasPrediction={hasPrediction}
            disabled={locked}
            dense={dense}
            onPlus ={() => handleChange('home', +1)}
            onMinus={() => handleChange('home', -1)}
            label={match.homeTeam}
          />
        </div>

        <div className="h-px" style={{ background: 'var(--color-border)' }} />

        {/* AWAY row */}
        <div className={cn('grid grid-cols-[auto_1fr_auto] items-center', dense ? 'gap-2' : 'gap-2.5')}>
          <Flag code={match.awayFlag} alt={match.awayTeam} size={flagSize} />
          <span className={cn('font-display text-white leading-tight break-words', dense ? 'text-[13px]' : 'text-sm')}>
            {match.awayTeam}
          </span>
          <TeamCounter
            value={away}
            hasPrediction={hasPrediction}
            disabled={locked}
            dense={dense}
            onPlus ={() => handleChange('away', +1)}
            onMinus={() => handleChange('away', -1)}
            label={match.awayTeam}
          />
        </div>

        {/* Hint según estado del pronóstico */}
        {!locked && (
          hasPrediction ? (
            <div className="text-base text-emerald-300 text-center -mt-0.5 font-display font-bold flex items-center justify-center gap-2">
              <Check className="size-5" strokeWidth={3} />
              Marcador listo
            </div>
          ) : (
            <div className="text-base text-bio-200/65 text-center -mt-0.5 font-display font-semibold">
              Sin pronóstico — elegí un marcador
            </div>
          )
        )}

        {/* Quick picks + borrar */}
        <div className="flex items-center gap-1.5 border-t pt-2 mt-0.5"
             style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex-1 min-w-0">
            <QuickPicks
              matchId={match.id}
              disabled={locked}
              dense={dense}
              onPick={handleQuickPick}
            />
          </div>
          {hasPrediction && !locked && (
            <button
              type="button"
              onClick={handleClear}
              title="Borrar marcador"
              aria-label="Borrar marcador"
              className="shrink-0 w-12 h-12 rounded-xl border-2 text-bio-200/70 hover:text-red-400 hover:border-red-400/40 transition flex items-center justify-center"
              style={{
                background: 'var(--color-bg-3)',
                borderColor: 'var(--color-border)',
              }}
            >
              <X className="size-5" strokeWidth={2.5} />
            </button>
          )}
        </div>

        {/* CTA Compartir — solo para partidos de La Tri */}
        {onShare && match.isTri && (
          <button
            type="button"
            disabled={!hasPrediction || locked}
            onClick={() => onShare(match)}
            className={cn(
              'inline-flex items-center justify-center gap-2 h-12 rounded-2xl font-display font-bold text-base transition border-2',
              hasPrediction && !locked
                ? 'bg-gradient-to-br from-bio-400 to-bio-600 text-white border-bio-700 hover:brightness-110 active:scale-[0.98] share-cta-glow'
                : 'cursor-not-allowed',
            )}
            style={
              hasPrediction && !locked
                ? undefined
                : {
                    background: 'var(--color-bg-3)',
                    borderColor: 'var(--color-border)',
                    color: 'rgba(255,224,181,0.45)',
                  }
            }
          >
            <Share2 className="size-5" strokeWidth={3} />
            Compartir este partido
          </button>
        )}
      </div>
    </div>
  );
}

interface TeamCounterProps {
  value: number;
  hasPrediction: boolean;
  onPlus: () => void;
  onMinus: () => void;
  disabled?: boolean;
  dense?: boolean;
  label: string;
}

function TeamCounter({ value, hasPrediction, onPlus, onMinus, disabled, dense, label }: TeamCounterProps) {
  const btn = cn(
    'rounded-full border-2 font-display font-semibold flex items-center justify-center transition active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed shadow-md shadow-bio-900/30',
    'border-bio-400/60 text-bio-200 hover:bg-bio-500 hover:text-white hover:border-bio-500',
    // Touch targets ≥ 48px (Apple HIG / Material 48dp)
    dense ? 'size-12' : 'size-14',
  );
  return (
    <div className={cn('flex items-center shrink-0', dense ? 'gap-2' : 'gap-2.5')}>
      <button
        type="button"
        className={btn}
        onClick={onMinus}
        disabled={disabled}
        aria-label={`Restar gol ${label}`}
      >
        <Minus className={dense ? 'size-5' : 'size-6'} strokeWidth={3} />
      </button>
      <span
        className={cn(
          'font-display font-bold tabular-nums leading-none text-center',
          dense ? 'min-w-7 text-2xl' : 'min-w-8 text-3xl',
          hasPrediction ? 'text-bio-100' : 'text-bio-200/35',
        )}
        aria-live="polite"
      >
        {hasPrediction ? value : '–'}
      </span>
      <button
        type="button"
        className={btn}
        onClick={onPlus}
        disabled={disabled}
        aria-label={`Sumar gol ${label}`}
      >
        <Plus className={dense ? 'size-5' : 'size-6'} strokeWidth={3} />
      </button>
      <EggGoals count={value} dense={dense} dim={!hasPrediction} align="start" />
    </div>
  );
}

function EggGoals({
  count, dense, dim = false, align = 'end',
}: {
  count: number; dense?: boolean; dim?: boolean; align?: 'start' | 'end';
}) {
  const eggW = dense ? 13 : 16;
  const eggH = Math.round(eggW * 1.28);
  const showDigit = count > 4;
  const justify = align === 'start' ? 'justify-start' : 'justify-end';
  // Ancho fijo = espacio para 4 huevos + gaps. Evita que los +/- se muevan
  // cuando el contador sube/baja.
  const fixedW: React.CSSProperties = {
    width: dense ? 70 : 82,
  };

  if (dim || count === 0) {
    return (
      <div
        className={cn('flex items-center', justify)}
        style={fixedW}
        aria-label={dim ? 'Sin pronóstico' : '0 goles'}
      >
        <span className="egg-pip egg-pip-empty" style={{ width: eggW, height: eggH }} />
      </div>
    );
  }

  if (showDigit) {
    return (
      <div
        className={cn('flex items-center gap-1', justify)}
        style={fixedW}
        aria-label={`${count} goles`}
      >
        <span className="egg-pip" style={{ width: eggW, height: eggH }} />
        <span className="font-display font-semibold text-bio-200 tabular-nums leading-none text-sm">×{count}</span>
      </div>
    );
  }

  return (
    <div
      className={cn('flex items-center gap-0.5', justify)}
      style={fixedW}
      aria-label={`${count} goles`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="egg-pip" style={{ width: eggW, height: eggH }} />
      ))}
    </div>
  );
}
