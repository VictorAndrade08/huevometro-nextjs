'use client';

import { useMemo } from 'react';
import { Star, Calendar, ChevronRight } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { useGameStore } from '@/store/gameStore';
import { WEEK_BUCKETS, getWeekFor, formatWeekRange } from '@/lib/weeks';
import { tapHaptic } from '@/lib/haptic';
import { soundPick } from '@/lib/sounds';
import type { Match } from '@/types';

interface CartillaOption {
  key:      string;
  title:    string;
  subtitle: string;
  matches:  Match[];
  done:     number;
  total:    number;
  isTri?:   boolean;
}

interface CartillaPickerModalProps {
  open:    boolean;
  onClose: () => void;
  matches: Match[];
  onPick:  (matches: Match[], label: string) => void;
}

export function CartillaPickerModal({ open, onClose, matches, onPick }: CartillaPickerModalProps) {
  const predictions = useGameStore(s => s.predictions);

  const options: CartillaOption[] = useMemo(() => {
    const isDone = (m: Match) => {
      const p = predictions[m.id];
      return !!p && typeof p.home === 'number' && typeof p.away === 'number';
    };

    const list: CartillaOption[] = [];

    // 1) La Tri — todos los partidos de Ecuador
    const tri = matches.filter(m => m.isTri);
    if (tri.length > 0) {
      const triDone = tri.filter(isDone);
      list.push({
        key:      'tri',
        title:    'Los partidos de La Tri',
        subtitle: `${tri.length} partidos · ×2 por acierto`,
        matches:  triDone,
        done:     triDone.length,
        total:    tri.length,
        isTri:    true,
      });
    }

    // 2) Una entrada por jornada con al menos 1 pronóstico
    WEEK_BUCKETS.forEach(bucket => {
      const inBucket = matches.filter(m => getWeekFor(m).id === bucket.id);
      if (inBucket.length === 0) return;
      const doneList = inBucket.filter(isDone);
      if (doneList.length === 0) return;
      list.push({
        key:      `w-${bucket.id}`,
        title:    `${bucket.title}: ${bucket.subtitle}`,
        subtitle: `${formatWeekRange(bucket)} · ${doneList.length}/${inBucket.length} listos`,
        matches:  doneList,
        done:     doneList.length,
        total:    inBucket.length,
      });
    });

    return list;
  }, [matches, predictions]);

  function choose(opt: CartillaOption) {
    if (opt.matches.length === 0) return;
    tapHaptic();
    soundPick();
    onPick(opt.matches, opt.title);
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-5">
        <div className="flex items-start justify-between mb-1">
          <div>
            <div className="text-[10px] tracking-[0.18em] font-bold text-bio-300/70 uppercase">Compartir</div>
            <h2 className="font-display text-2xl font-bold text-white leading-tight mt-0.5">¿Qué cartilla querés exportar?</h2>
          </div>
          <button
            onClick={onClose}
            className="text-ink/40 hover:text-ink text-2xl leading-none"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>
        <p className="text-xs text-bio-200/65 mt-1 leading-relaxed">
          Elegí qué pronósticos querés ver en tu imagen.
        </p>

        <div className="mt-4 space-y-2">
          {options.length === 0 && (
            <div
              className="rounded-xl p-4 text-center text-sm text-bio-200/55 border"
              style={{ background: 'var(--color-bg-3)', borderColor: 'var(--color-border)' }}
            >
              Todavía no tenés pronósticos. Pronosticá al menos un partido.
            </div>
          )}

          {options.map(opt => {
            const Icon = opt.isTri ? Star : Calendar;
            const disabled = opt.matches.length === 0;
            return (
              <button
                key={opt.key}
                onClick={() => choose(opt)}
                disabled={disabled}
                className="w-full text-left rounded-xl p-3 flex items-center gap-3 border transition disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-125"
                style={{
                  background: opt.isTri
                    ? 'linear-gradient(135deg, rgba(240,137,37,0.18) 0%, var(--color-bg-3) 100%)'
                    : 'var(--color-bg-3)',
                  borderColor: opt.isTri ? 'rgba(240,137,37,0.35)' : 'var(--color-border)',
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: opt.isTri ? 'rgba(240,137,37,0.25)' : 'var(--color-bg-2)' }}
                >
                  <Icon className="size-5 text-bio-300" strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-display font-semibold text-sm text-white leading-tight truncate">
                    {opt.title}
                  </div>
                  <div className="text-[11px] text-bio-200/60 mt-0.5 truncate">
                    {opt.subtitle}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span
                    className="text-[11px] font-display font-semibold tabular-nums px-2 py-0.5 rounded-full"
                    style={{ background: 'var(--color-bg-2)', color: 'var(--color-bio-300)' }}
                  >
                    {opt.done}/{opt.total}
                  </span>
                  <ChevronRight className="size-4 text-bio-300/70" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}
