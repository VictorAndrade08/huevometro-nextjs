'use client';

import { useGameStore } from '@/store/gameStore';
import { getEggLevel } from '@/lib/scoring';
import { EGG_LEVELS } from '@/lib/scoring';

export function StatsHeader() {
  const stats   = useGameStore(s => s.userStats);
  const isGuest = useGameStore(s => s.isGuest);

  const level = getEggLevel(stats.points);
  const nextLevel = EGG_LEVELS[EGG_LEVELS.indexOf(level) + 1];
  const ptsToNext = nextLevel ? Math.max(0, nextLevel.min - stats.points) : 0;
  const progress = nextLevel
    ? Math.min(100, (stats.points / nextLevel.min) * 100)
    : 100;

  const msg = stats.points === 0
    ? 'Pronostica tu primer partido para subir de nivel'
    : !nextLevel
      ? '¡Eres el huevo más sabio del Mundial! 🥇'
      : `${ptsToNext} pts para pasar a ${nextLevel.name}`;

  return (
    <div className="bg-white border border-bio-100 rounded-2xl p-3 md:p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-4xl">{level.emoji}</span>
          <div className="min-w-0">
            <p className="font-bold text-sm md:text-base text-ink truncate">
              {isGuest ? '¡Hola, Invitado!' : '¡Hola, Jugador!'}
            </p>
            <p className="text-xs text-ink/60 truncate">
              <span className="font-bold text-bio-700">{level.name}</span> · {msg}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Stat value={stats.points} label="PTS" />
          <Stat value={`${stats.streak || 0}🔥`} label="Racha" hideOnMobile />
          <Stat value={stats.exact}  label="Exactos" hideOnMobile />
        </div>
      </div>
      <div className="w-full bg-bio-50 rounded-full h-1.5 overflow-hidden mt-2">
        <div
          className="h-full bg-gradient-to-r from-bio-400 to-bio-600 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function Stat({ value, label, hideOnMobile }: { value: number | string; label: string; hideOnMobile?: boolean }) {
  return (
    <div className={`text-center ${hideOnMobile ? 'hidden sm:block' : ''}`}>
      <div className="text-2xl font-display font-bold text-bio-600 leading-none">{value}</div>
      <div className="text-[9px] uppercase text-ink/50 font-bold">{label}</div>
    </div>
  );
}
