'use client';

import { ChevronDown, Info, Gift, Trophy, Calendar, Zap } from 'lucide-react';
import { tapHaptic } from '@/lib/haptic';
import { soundTap, soundToggle } from '@/lib/sounds';

const PRIZES = [
  { Icon: Trophy,   title: 'Gran Premio',        desc: 'Para el campeón del torneo' },
  { Icon: Calendar, title: 'Premios semanales',  desc: 'Para el líder de cada jornada' },
  { Icon: Zap,      title: 'Sorteos al azar',    desc: 'Durante todo el Mundial' },
] as const;

interface InfoDrawerProps {
  onOpenRules: () => void;
}

export function InfoDrawer({ onOpenRules }: InfoDrawerProps) {
  return (
    <details
      className="group rounded-2xl shadow-sm overflow-hidden mt-6 border"
      style={{ background: 'var(--color-bg-2)', borderColor: 'var(--color-border)' }}
    >
      <summary
        className="flex items-center justify-between p-5 cursor-pointer hover:brightness-110 transition list-none"
        onClick={() => { tapHaptic(); soundToggle(); }}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-bio-500/15 flex items-center justify-center">
            <Info className="size-6 text-bio-300" strokeWidth={2.5} />
          </div>
          <div>
            <p className="font-display font-bold text-xl text-white leading-tight">Cómo jugar y premios</p>
            <p className="text-sm text-bio-200/70 mt-0.5">Sin registro · Subí tu cartilla a la historia</p>
          </div>
        </div>
        <ChevronDown className="text-bio-300 size-7 transition group-open:rotate-180" />
      </summary>

      <div className="border-t p-5 space-y-5" style={{ borderColor: 'var(--color-border)' }}>
        {/* Premios */}
        <div
          className="rounded-2xl p-5 border"
          style={{ background: 'var(--color-bg-3)', borderColor: 'var(--color-border)' }}
        >
          <div className="flex items-center gap-2.5 mb-4">
            <Gift className="size-6 text-bio-300" strokeWidth={2.5} />
            <h3 className="font-display text-2xl font-bold text-white leading-none tracking-tight">Premios</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {PRIZES.map(p => {
              const Icon = p.Icon;
              return (
                <div
                  key={p.title}
                  className="rounded-xl p-4 text-center border"
                  style={{ background: 'var(--color-bg-2)', borderColor: 'var(--color-border)' }}
                >
                  <div className="w-14 h-14 mx-auto rounded-full bg-bio-500/15 flex items-center justify-center mb-2.5">
                    <Icon className="size-7 text-bio-300" strokeWidth={2.5} />
                  </div>
                  <div className="font-display font-bold text-base text-white">{p.title}</div>
                  <div className="text-sm text-bio-200/65 mt-1 leading-snug">{p.desc}</div>
                </div>
              );
            })}
          </div>
          <p className="text-sm text-bio-200/65 text-center mt-4 leading-relaxed">
            Detalles oficiales en <strong className="text-bio-300">@biohuevos_ec</strong>.
            Te contactamos por correo o WhatsApp si ganás.
          </p>
        </div>

        <button
          onClick={() => { tapHaptic(); soundTap(); onOpenRules(); }}
          className="w-full rounded-2xl p-4 text-base font-display font-bold text-white transition border-2 hover:brightness-125"
          style={{ background: 'var(--color-bg-3)', borderColor: 'var(--color-border)' }}
        >
          Ver reglas completas
        </button>
      </div>
    </details>
  );
}
