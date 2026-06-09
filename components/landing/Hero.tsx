'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCountdown } from '@/hooks/useCountdown';
import { TOURNAMENT_START } from '@/lib/constants';

export function Hero() {
  const { days, hours, mins, secs } = useCountdown(TOURNAMENT_START);

  return (
    <section
      id="top"
      className="relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, var(--color-bg-0) 0%, var(--color-bg-1) 60%, var(--color-bg-2) 100%)' }}
    >
      {/* Portada oficial */}
      <div className="relative w-full">
        <Image
          src="/portada.webp"
          alt="El Huevómetro Mundialista — Bio Huevos"
          width={1823}
          height={863}
          className="w-full h-auto block"
          priority
        />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, transparent 60%, var(--color-bg-0) 100%)' }} />
      </div>

      <main className="container mx-auto px-4 py-12 md:py-16 max-w-5xl flex flex-col items-center justify-center relative z-10 -mt-8 md:-mt-16">
        <div
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-base font-display font-bold mb-6 border-2"
          style={{ background: 'var(--color-bg-2)', borderColor: 'rgba(240,137,37,0.4)', color: 'var(--color-bio-300)' }}
        >
          <span className="live-dot" />
          <span>Campaña activa — Mundial 2026</span>
        </div>

        <div className="text-center mb-10 max-w-3xl">
          <h3 className="text-3xl md:text-5xl font-display font-bold italic text-bio-400 leading-tight">
            ¡Con los huevos en la cancha!
          </h3>
          <p className="text-lg md:text-2xl mt-4 italic font-display font-semibold text-bio-200">
            &ldquo;El que sabe de fútbol, sabe de huevos.&rdquo;
          </p>
          <p className="text-bio-200/85 text-lg md:text-xl mt-6 leading-relaxed">
            Pronosticá los partidos del Mundial, sumá puntos cada jornada y ganá kits reales de{' '}
            <span className="font-bold text-bio-300">BIOHUEVOS</span>.
          </p>
        </div>

        {/* Countdown */}
        <div
          className="rounded-3xl p-5 md:p-7 mb-10 border-2 shadow-2xl"
          style={{ background: 'var(--color-bg-2)', borderColor: 'var(--color-border)' }}
        >
          <p className="text-center text-sm uppercase tracking-widest text-bio-300 font-display font-bold mb-4">
            El primer partido en
          </p>
          <div className="flex items-center justify-center gap-2 md:gap-4">
            <TimeBox label="Días"  value={days}  />
            <span className="text-bio-400 text-3xl font-bold">:</span>
            <TimeBox label="Horas" value={hours} />
            <span className="text-bio-400 text-3xl font-bold">:</span>
            <TimeBox label="Min"   value={mins}  />
            <span className="text-bio-400 text-3xl font-bold">:</span>
            <TimeBox label="Seg"   value={secs}  highlight />
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <Link href="/dashboard" className="flex-1">
            <Button size="xl" block>¡JUGAR AHORA!</Button>
          </Link>
          <a
            href="#como-funciona"
            className="flex-1 inline-flex items-center justify-center gap-2 font-display font-bold text-lg py-5 rounded-2xl border-2 text-bio-200 hover:text-white hover:border-bio-400 transition"
            style={{ background: 'var(--color-bg-2)', borderColor: 'var(--color-border)' }}
          >
            ¿Cómo funciona?
            <ArrowDown className="size-5" />
          </a>
        </div>
        <p className="text-sm text-bio-200/55 mt-4 text-center font-medium">
          Sin registro · Sin descargas · Solo diversión
        </p>
      </main>
    </section>
  );
}

interface TimeBoxProps { label: string; value: number; highlight?: boolean; }

function TimeBox({ label, value, highlight }: TimeBoxProps) {
  return (
    <div
      className="text-center rounded-2xl px-4 py-3 md:px-6 md:py-4 min-w-[72px] md:min-w-[92px] border"
      style={{
        background: highlight ? 'rgba(240,137,37,0.15)' : 'var(--color-bg-3)',
        borderColor: highlight ? 'rgba(240,137,37,0.4)' : 'var(--color-border)',
      }}
    >
      <div className={`font-display text-4xl md:text-6xl font-bold tabular-nums ${highlight ? 'text-bio-300' : 'text-white'}`}>
        {String(value).padStart(2, '0')}
      </div>
      <div className="text-xs md:text-sm uppercase text-bio-200/60 font-bold tracking-widest mt-1">{label}</div>
    </div>
  );
}
