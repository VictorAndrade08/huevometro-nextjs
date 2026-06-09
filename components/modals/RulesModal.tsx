'use client';

import { Link2, Pencil, Share2, Trophy, Target, Zap, Lock, Gift } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface RulesModalProps {
  open:    boolean;
  onClose: () => void;
}

const STEPS = [
  { n: 1, Icon: Link2,  title: 'Ingresa al link',          body: 'Entra al Huevómetro de BIOHUEVOS, sin registros largos.' },
  { n: 2, Icon: Pencil, title: 'Pronosticá toda la jornada', body: 'Llená el marcador de TODOS los partidos de la semana.' },
  { n: 3, Icon: Share2, title: 'Subí a tu historia',        body: 'Etiquetá @biohuevos_ec — esa es tu firma para concursar.' },
  { n: 4, Icon: Trophy, title: 'El más cerca, gana',         body: 'Quien apunte más cerca de los resultados reales se lleva los puntos.' },
];

export function RulesModal({ open, onClose }: RulesModalProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-5">
        <div className="flex justify-between items-start mb-1">
          <div>
            <div className="text-[10px] tracking-[0.18em] font-bold text-bio-300/70 uppercase">Reglas del juego</div>
            <h2 className="font-display text-2xl text-white leading-tight mt-0.5">Así de fácil</h2>
          </div>
          <button
            onClick={onClose}
            className="text-ink/40 hover:text-ink text-2xl leading-none"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>
        <p className="text-xs text-bio-200/55 mt-1 leading-relaxed">
          El que sabe de fútbol, sabe de huevos. Concursá por cajas de BIOHUEVOS para tres meses.
        </p>

        {/* 4 pasos */}
        <ol className="mt-5 space-y-2.5">
          {STEPS.map(({ n, Icon, title, body }) => (
            <li
              key={n}
              className="flex items-start gap-3 rounded-2xl p-3 border"
              style={{ background: 'var(--color-bg-3)', borderColor: 'var(--color-border)' }}
            >
              <div className="shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-bio-400 to-bio-600 text-white font-display font-bold text-sm flex items-center justify-center shadow-md shadow-bio-900/40 tabular-nums">
                0{n}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <Icon className="size-4 text-bio-300 shrink-0" strokeWidth={2.5} />
                  <h3 className="font-display text-base text-white leading-tight">{title}</h3>
                </div>
                <p className="text-xs text-bio-200/65 mt-1 leading-relaxed">{body}</p>
              </div>
            </li>
          ))}
        </ol>

        {/* Scoring "más cerca" */}
        <section
          className="mt-5 rounded-2xl p-4 border"
          style={{ background: 'var(--color-bg-3)', borderColor: 'var(--color-border)' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Target className="size-4 text-bio-300" strokeWidth={2.5} />
            <h3 className="font-display text-base text-white">Cómo se reparten los puntos</h3>
          </div>
          <ul className="space-y-2 text-sm">
            <RuleRow label="Marcador exacto"         value="3 pts" tone="best" />
            <RuleRow label="Ganador + diferencia ±1" value="2 pts" tone="ok" />
            <RuleRow label="Solo ganador correcto"   value="1 pt"  tone="ok" />
            <RuleRow label="Falló todo"              value="0 pts" tone="bad" />
          </ul>
          <div className="mt-3 pt-3 border-t flex items-center gap-2 text-xs text-bio-200/70"
               style={{ borderColor: 'var(--color-border)' }}>
            <Zap className="size-3.5 text-bio-300" strokeWidth={2.5} />
            <span>Partidos de la Tri valen <strong className="text-bio-200">×2</strong>.</span>
          </div>
          <div className="mt-1.5 flex items-center gap-2 text-xs text-bio-200/70">
            <Trophy className="size-3.5 text-bio-300" strokeWidth={2.5} />
            <span>Gana la jornada quien <strong className="text-bio-200">más se acerque</strong> al resultado real.</span>
          </div>
        </section>

        {/* Cierre + premios condensados */}
        <section
          className="mt-3 rounded-2xl p-4 border grid grid-cols-2 gap-3"
          style={{ background: 'var(--color-bg-3)', borderColor: 'var(--color-border)' }}
        >
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Lock className="size-3.5 text-bio-300" strokeWidth={2.5} />
              <h4 className="font-display text-sm text-white">Cierre</h4>
            </div>
            <p className="text-[11px] text-bio-200/65 leading-relaxed">
              La cartilla se cierra <strong className="text-bio-200">20 min antes</strong> del primer partido de la jornada.
            </p>
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Gift className="size-3.5 text-bio-300" strokeWidth={2.5} />
              <h4 className="font-display text-sm text-white">Premios</h4>
            </div>
            <p className="text-[11px] text-bio-200/65 leading-relaxed">
              Cajas de BIOHUEVOS para tres meses al líder, premios semanales y sorteos.
            </p>
          </div>
        </section>

        <p className="text-[11px] text-bio-200/45 text-center mt-4 leading-relaxed">
          Detalles oficiales y ganadores en <strong className="text-bio-300">@biohuevos_ec</strong>
        </p>

        <div className="mt-4">
          <Button onClick={onClose} size="md" block>
            Entendido, jugar
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function RuleRow({ label, value, tone }: { label: string; value: string; tone: 'best' | 'ok' | 'bad' }) {
  const valueColor =
    tone === 'best' ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
    : tone === 'ok' ? 'bg-bio-500/15 text-bio-200 border-bio-500/30'
    : 'bg-red-500/10 text-red-300/80 border-red-500/20';
  return (
    <li className="flex items-center justify-between gap-3">
      <span className="text-bio-200/85">{label}</span>
      <span className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-display font-semibold tabular-nums border ${valueColor}`}>
        {value}
      </span>
    </li>
  );
}
