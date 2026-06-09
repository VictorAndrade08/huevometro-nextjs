'use client';

import { ChevronDown, Trophy, Target, Users } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { ACHIEVEMENTS } from '@/lib/achievements';
import { StatsHeader } from './StatsHeader';
import { PepeMascot } from './PepeMascot';
import { ChipsPanel } from './ChipsPanel';
import { LeagueBanner } from './LeagueBanner';

interface ProfileDrawerProps {
  onUseChip: (chipId: string) => void;
  onOpenLeague: () => void;
}

export function ProfileDrawer({ onUseChip, onOpenLeague }: ProfileDrawerProps) {
  const achievementsCount = useGameStore(s => s.userStats.achievements.length);
  const stats             = useGameStore(s => s.userStats);
  const accuracy = stats.predicted
    ? Math.round(((stats.exact + stats.winner) / stats.predicted) * 100)
    : 0;

  return (
    <details className="group bg-white border border-bio-100 rounded-2xl shadow-sm overflow-hidden mt-6">
      <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-bio-50/40 transition list-none">
        <div className="flex items-center gap-3">
          <span className="text-2xl">👤</span>
          <div>
            <p className="font-bold text-sm text-ink">Mi cuenta y juego</p>
            <p className="text-xs text-ink/50">Stats, trucos, ranking y logros</p>
          </div>
        </div>
        <ChevronDown className="text-bio-500 size-5 transition group-open:rotate-180" />
      </summary>

      <div className="border-t border-bio-50 p-4 space-y-4 bg-bio-50/20">
        <StatsHeader />
        <PepeMascot />
        <ChipsPanel onUseChip={onUseChip} />
        <LeagueBanner />

        {/* Stats personales */}
        <div className="bg-white border border-bio-100 rounded-2xl p-4 shadow-sm">
          <div className="grid grid-cols-4 gap-2 pt-3">
            <Metric value={`${accuracy}%`}    label="Aciertos" />
            <Metric value={stats.exact}       label="Exactos" />
            <Metric value={`${stats.streak}🔥`} label="Racha" />
            <Metric value={stats.predicted}   label="Total" />
          </div>
        </div>

        {/* Logros */}
        <div className="bg-white border border-bio-100 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="font-bold text-xs text-ink uppercase tracking-wider flex items-center gap-1">
              <Trophy className="size-4" /> Logros
            </p>
            <span className="text-xs font-bold text-bio-600 bg-bio-50 px-2 py-0.5 rounded-full">
              {achievementsCount}/{ACHIEVEMENTS.length}
            </span>
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {ACHIEVEMENTS.map(a => {
              const unlocked = stats.achievements.includes(a.id);
              return (
                <div
                  key={a.id}
                  title={a.desc}
                  className={`text-center p-3 rounded-xl ${
                    unlocked
                      ? 'bg-gradient-to-br from-bio-100 to-bio-50 border-2 border-bio-300'
                      : 'bg-bio-50/50 border border-bio-100 opacity-50 grayscale'
                  }`}
                >
                  <div className="text-3xl mb-1">{a.icon}</div>
                  <div className="text-[10px] font-bold text-ink leading-tight">{a.title}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tie-breaker */}
        <details className="group bg-white border border-bio-100 rounded-2xl p-3 shadow-sm">
          <summary className="flex items-center justify-between cursor-pointer list-none">
            <div>
              <p className="font-bold text-xs text-ink uppercase tracking-wider flex items-center gap-1">
                <Target className="size-4" /> Tie-breaker
              </p>
              <p className="text-[10px] text-ink/50">Desempata en el ranking final</p>
            </div>
            <ChevronDown className="text-bio-500 size-4 transition group-open:rotate-180" />
          </summary>
          <div className="mt-3 space-y-2">
            <TBInput label="Goleador del Mundial" placeholder="Ej. Mbappé, Vinicius..." />
            <TBInput label="Total de goles del Mundial" type="number" placeholder="Ej. 175" />
            <TBInput label="Campeón" placeholder="Ej. Argentina, Brasil, España..." />
          </div>
        </details>

        {/* Liga privada */}
        <button
          onClick={onOpenLeague}
          className="w-full bg-gradient-to-r from-bio-500 to-bio-600 text-white rounded-xl p-3 flex items-center gap-3 hover:opacity-90 transition shadow"
        >
          <Users className="size-6" />
          <div className="flex-1 text-left">
            <p className="font-bold text-sm">Crear liga privada</p>
            <p className="text-xs text-white/80">Invita a panas y compite</p>
          </div>
          <span className="bg-white text-bio-700 font-bold text-xs px-3 py-1.5 rounded-lg">Crear</span>
        </button>
      </div>
    </details>
  );
}

function Metric({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-xs text-ink/50 uppercase font-bold">{label}</div>
      <div className="text-xl font-display font-bold text-bio-600">{value}</div>
    </div>
  );
}

function TBInput({ label, type = 'text', placeholder }: { label: string; type?: string; placeholder: string }) {
  return (
    <div>
      <label className="text-[10px] font-bold text-ink uppercase">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full mt-1 px-3 py-2 rounded-lg border border-bio-100 focus:border-bio-500 outline-none text-sm"
      />
    </div>
  );
}
