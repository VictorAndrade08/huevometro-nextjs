'use client';

import { CHIPS } from '@/lib/chips';
import { useGameStore } from '@/store/gameStore';

interface ChipsPanelProps {
  onUseChip: (chipId: string) => void;
}

export function ChipsPanel({ onUseChip }: ChipsPanelProps) {
  const chipsUsed = useGameStore(s => s.userStats.chipsUsed);
  const remaining = CHIPS.length - chipsUsed.length;

  return (
    <div className="bg-white border border-bio-100 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-display text-lg uppercase font-bold text-ink leading-none">🎮 Trucos del Huevo</h3>
          <p className="text-xs text-ink/60 mt-1">Activá un truco para potenciar tus puntos — solo 1 uso por torneo</p>
        </div>
        <span className="text-xs font-bold text-bio-700 bg-bio-50 px-2.5 py-1 rounded-full">
          {remaining}/{CHIPS.length}
        </span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {CHIPS.map(chip => {
          const used = chipsUsed.includes(chip.id);
          return (
            <button
              key={chip.id}
              type="button"
              disabled={used}
              onClick={() => onUseChip(chip.id)}
              title={chip.desc}
              className={`chip-card ${used ? 'used' : ''}`}
            >
              <div className="text-3xl mb-1">{chip.emoji}</div>
              <div className="font-bold text-xs text-ink">{chip.name}</div>
              <div className="text-[10px] text-ink/50 mt-1 leading-tight">
                {chip.desc.split('—')[0]!.split('(')[0]!.trim().split('.')[0]}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
