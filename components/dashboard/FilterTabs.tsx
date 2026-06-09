'use client';

import { Goal, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGameStore } from '@/store/gameStore';
import type { FilterType } from '@/types';

const FILTERS: Array<{ id: FilterType; label: string; Icon: React.ComponentType<{ className?: string; strokeWidth?: number }> }> = [
  { id: 'tri', label: 'La Tri', Icon: Star },
  { id: 'all', label: 'Todos',  Icon: Goal },
];

interface FilterTabsProps {
  totalPlayable: number;
  totalPredicted: number;
}

export function FilterTabs({ totalPlayable, totalPredicted }: FilterTabsProps) {
  const currentFilter = useGameStore(s => s.currentFilter);
  const setFilter     = useGameStore(s => s.setFilter);

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1 flex-1 -mx-1 px-1">
        {FILTERS.map(f => {
          const active = currentFilter === f.id;
          const Icon = f.Icon;
          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                'shrink-0 inline-flex items-center gap-2 px-5 h-12 rounded-full font-display font-bold text-base transition border',
                active
                  ? 'bg-gradient-to-r from-bio-400 to-bio-600 text-white shadow-lg shadow-bio-900/40 border-transparent'
                  : 'text-bio-200/80 hover:text-white',
              )}
              style={
                active
                  ? undefined
                  : { background: 'var(--color-bg-2)', borderColor: 'var(--color-border)' }
              }
            >
              <Icon className="size-5" strokeWidth={2.5} />
              <span>{f.label}</span>
            </button>
          );
        })}
      </div>
      <div className="text-right shrink-0 hidden sm:block">
        <div className="font-display text-3xl md:text-4xl font-bold text-bio-300 leading-none tabular-nums">
          {totalPredicted}<span className="text-bio-700">/</span>{totalPlayable}
        </div>
        <div className="text-[11px] uppercase text-bio-200/50 font-bold tracking-widest mt-1">listos</div>
      </div>
    </div>
  );
}
