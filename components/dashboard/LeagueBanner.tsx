'use client';

import { useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { LEAGUES, LEAGUE_MOCK_PLAYERS, getLeagueFor } from '@/lib/leagues';
import { cn } from '@/lib/utils';

export function LeagueBanner() {
  const myPts = useGameStore(s => s.userStats.points);
  const league = getLeagueFor(myPts);

  const { myPos, all } = useMemo(() => {
    const all = [...LEAGUE_MOCK_PLAYERS, { name: 'TÚ', city: 'Ecuador', pts: myPts, me: true }]
      .sort((a, b) => b.pts - a.pts);
    return { myPos: all.findIndex(p => p.me) + 1, all };
  }, [myPts]);

  const next = LEAGUES.find(l => l.minPts > myPts);
  const progressInLeague = next
    ? Math.min(100, ((myPts - league.minPts) / (next.minPts - league.minPts)) * 100)
    : 100;

  const promotionMsg = useMemo(() => {
    const top10Pts = all[9]?.pts ?? 0;
    const ptsToTop10 = Math.max(0, top10Pts + 1 - myPts);
    if (myPos <= 10) return `🔝 ¡Estás en zona de ascenso a ${next ? next.name : league.name}!`;
    if (myPos > 25)  return `⚠️ Estás en zona de descenso. ${ptsToTop10} pts para subir al top 10.`;
    return `🎯 ${ptsToTop10} pts para entrar al top 10 (zona de ascenso)`;
  }, [myPos, myPts, next, league, all]);

  // Top 5 + tu posición ± 1
  const visibleIdx = useMemo(() => {
    const set = new Set<number>([0, 1, 2, 3, 4]);
    set.add(Math.max(0, myPos - 2));
    set.add(myPos - 1);
    set.add(Math.min(all.length - 1, myPos));
    return [...set].sort((a, b) => a - b);
  }, [myPos, all.length]);

  // Timer hasta domingo 23:59
  const timer = useMemo(() => {
    const now = new Date();
    const sunday = new Date(now);
    sunday.setDate(now.getDate() + ((7 - now.getDay()) % 7));
    sunday.setHours(23, 59, 59, 0);
    const diff = sunday.getTime() - now.getTime();
    const days = Math.floor(diff / 86_400_000);
    const hours = Math.floor((diff % 86_400_000) / 3_600_000);
    return `Termina en ${days}d ${hours}h`;
  }, []);

  return (
    <div className="league-banner">
      <div className="flex items-start gap-3 relative">
        <div className="league-icon">{league.emoji}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <p className="text-[10px] uppercase tracking-widest font-bold text-yellow-700">Liga semanal</p>
            <span className="text-[10px] text-ink/60">{timer}</span>
          </div>
          <h3 className="font-display text-xl md:text-2xl uppercase font-bold text-ink leading-none mt-1">
            {league.name}
          </h3>
          <p className="text-xs text-ink/70 mt-1.5">
            Posición <span className="font-extrabold text-bio-700">#{myPos}</span> de 30 ·{' '}
            <span className="font-bold">{myPts} pts</span> esta semana
          </p>
          <div className="league-bar mt-2.5">
            <div className="league-bar-fill" style={{ width: `${progressInLeague}%` }} />
          </div>
          <p className="text-[11px] text-ink/60 mt-1.5" dangerouslySetInnerHTML={{ __html: promotionMsg }} />
        </div>
      </div>
      <details className="group mt-3">
        <summary className="text-xs font-bold text-bio-700 cursor-pointer flex items-center gap-1 list-none">
          Ver tabla de la liga <ChevronDown className="size-4 transition group-open:rotate-180" />
        </summary>
        <div className="space-y-1 mt-3">
          {visibleIdx.map((i, j) => {
            const prev = visibleIdx[j - 1];
            const showSeparator = prev !== undefined && i > prev + 1;
            const p = all[i];
            if (!p) return null;
            const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`;
            return (
              <div key={i}>
                {showSeparator && <div className="text-center text-ink/30 text-xs py-1">···</div>}
                <div className={cn('leaderboard-row', p.me && 'me')}>
                  <div className="text-center font-bold">{medal}</div>
                  <div className="truncate">
                    <strong>{p.me ? '⭐ TÚ' : p.name}</strong>
                    <span className="text-ink/50 text-[10px] ml-1">{p.city}</span>
                  </div>
                  <div className="font-bold text-bio-700">{p.pts} pts</div>
                </div>
              </div>
            );
          })}
        </div>
      </details>
    </div>
  );
}
