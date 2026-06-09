'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

const STEPS = [
  {
    badge: 'BIENVENIDO',
    title: 'EL HUEVÓMETRO',
    subtitle: 'MUNDIALISTA 2026',
    body: 'Pronosticá los marcadores de cada partido del Mundial y ganá premios cada semana.',
  },
  {
    badge: 'PASO 1',
    title: 'ELEGÍ TU MARCADOR',
    body: 'Usá los <strong>+</strong> y <strong>−</strong> para definir cuántos goles hace cada selección. O tocá un marcador rápido (1–0, 2–1, etc.) para llenarlo de un tap.',
  },
  {
    badge: 'PASO 2',
    title: 'CÓMO SE GANAN PUNTOS',
    body: '<strong>3 pts</strong> si acertás el marcador exacto.<br/><strong>1 pt</strong> si solo acertás el ganador.<br/>En los partidos de <strong>La Tri</strong> los puntos cuentan <strong>×2</strong>.',
  },
  {
    badge: 'PASO 3',
    title: 'COMPARTÍ Y PARTICIPÁ',
    body: 'Después de elegir tu marcador, tocá <strong>"Compartir cartilla"</strong>, dejá tus datos, descargá la imagen y subila a tu historia etiquetando <strong>@biohuevos_ec</strong>.',
  },
  {
    badge: 'PREMIOS',
    title: 'GANÁ CADA SEMANA',
    body: '<strong>Gran Premio</strong> para el campeón del torneo.<br/><strong>Premios semanales</strong> al líder de cada jornada.<br/><strong>Sorteos al azar</strong> durante el Mundial.<br/><br/>Detalles oficiales en <strong>@biohuevos_ec</strong>.',
  },
];

interface OnboardingModalProps {
  open:    boolean;
  onClose: () => void;
}

export function OnboardingModal({ open, onClose }: OnboardingModalProps) {
  const [step, setStep] = useState(0);

  function next() {
    if (step < STEPS.length - 1) setStep(s => s + 1);
    else close();
  }

  function back() {
    if (step > 0) setStep(s => s - 1);
  }

  function close() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('huevo-onboarded', '1');
    }
    setStep(0);
    onClose();
  }

  const current = STEPS[step]!;
  const isLast  = step === STEPS.length - 1;
  const isFirst = step === 0;

  return (
    <Modal open={open} onClose={close}>
      <div className="overflow-hidden">
        {/* Header con logo */}
        <div className="bg-gradient-to-br from-bio-500 to-bio-700 px-6 pt-6 pb-5 text-center text-white relative">
          <button
            onClick={close}
            className="absolute top-3 right-3 text-white/70 hover:text-white text-xl leading-none w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/15 transition"
            aria-label="Cerrar"
          >×</button>
          <Image
            src="https://www.bioalimentar.com/assets/images/icons/bioHuevos.webp"
            alt="BIOHUEVOS"
            width={56}
            height={70}
            className="object-contain mx-auto drop-shadow-md"
            style={{ filter: 'brightness(0) invert(1)' }}
            unoptimized
          />
          <div className="mt-2 text-[10px] font-extrabold tracking-[0.2em] text-white/80">
            {current.badge}
          </div>
        </div>

        {/* Contenido */}
        <div className="px-6 py-6 text-center">
          <h3 className="font-display text-2xl sm:text-3xl uppercase font-bold text-ink leading-tight">
            {current.title}
          </h3>
          {current.subtitle && (
            <div className="font-display text-sm uppercase font-bold text-bio-600 tracking-[0.18em] mt-1">
              {current.subtitle}
            </div>
          )}
          <p
            className="text-ink/70 leading-relaxed mt-4 text-sm sm:text-[15px]"
            dangerouslySetInnerHTML={{ __html: current.body }}
          />

          {/* Dots indicador */}
          <div className="flex justify-center gap-1.5 mt-6">
            {STEPS.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === step ? 'w-6 bg-bio-500' : 'w-1.5 bg-bio-100'
                }`}
              />
            ))}
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-2 mt-5">
            {isFirst ? (
              <button
                onClick={close}
                className="flex-1 text-ink/40 hover:text-ink text-sm font-semibold py-2"
              >
                Saltar
              </button>
            ) : (
              <Button onClick={back} variant="ghost" size="sm" className="flex-1">
                ← Atrás
              </Button>
            )}
            <Button onClick={next} size="sm" className="flex-1">
              {isLast ? 'Empezar' : 'Siguiente →'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
