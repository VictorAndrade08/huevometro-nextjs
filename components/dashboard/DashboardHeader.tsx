'use client';

import Link from 'next/link';
import { Trophy } from 'lucide-react';

interface DashboardHeaderProps {
  onOpenRanking?: () => void;
}

export function DashboardHeader({ }: DashboardHeaderProps = {}) {

  return (
    <header
      className="sticky top-0 z-40 border-b backdrop-blur-md"
      style={{
        background: 'rgba(14,10,6,0.85)',
        borderColor: 'var(--color-border)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Brand — click vuelve al home */}
        <Link
          href="/"
          aria-label="Volver al inicio"
          className="min-w-0 rounded-2xl -m-1 p-1 hover:bg-white/5 transition active:scale-95"
        >
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold leading-none tracking-tight text-white">
            El Huevómetro
          </h1>
          <p className="text-sm sm:text-base text-bio-300/80 font-medium mt-1 hidden sm:block">
            Mundial 2026 · Con los huevos en la cancha
          </p>
        </Link>

        {/* Ranking — próximamente */}
        <div className="flex items-center gap-2">
          <div
            title="Ranking disponible pronto"
            aria-label="Ranking — Próximamente"
            className="flex items-center gap-3 rounded-full pl-3 pr-5 py-2.5 border-2 opacity-90 cursor-not-allowed"
            style={{
              background: 'var(--color-bg-2)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="bg-gradient-to-br from-bio-400 to-bio-600 rounded-full w-12 h-12 flex items-center justify-center shadow-lg shadow-bio-900/50">
              <Trophy className="size-6 text-white" strokeWidth={3} />
            </div>
            <div className="leading-tight text-left">
              <div className="font-display font-bold text-sm uppercase tracking-widest text-bio-300">
                Ranking
              </div>
              <div className="text-base font-display font-semibold text-bio-200/85 mt-0.5">
                Próximamente
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
