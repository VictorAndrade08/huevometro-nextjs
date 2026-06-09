'use client';

import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getEggDisplay } from '@/lib/scoring';

interface EggCounterProps {
  value:     number;
  onIncrement: () => void;
  onDecrement: () => void;
  disabled?: boolean;
  ariaLabelMinus?: string;
  ariaLabelPlus?:  string;
}

/**
 * Counter touch-friendly de huevos: [- ] [🥚🥚] [+] + número grande.
 * Botones de 52px (44–56px en mobile via CSS responsive).
 */
export function EggCounter({
  value, onIncrement, onDecrement, disabled,
  ariaLabelMinus = 'Restar gol', ariaLabelPlus = 'Sumar gol',
}: EggCounterProps) {
  return (
    <div className="bg-bio-50/60 rounded-2xl p-3 flex items-center justify-around">
      <button
        type="button"
        className="egg-btn-circle"
        onClick={onDecrement}
        disabled={disabled}
        aria-label={ariaLabelMinus}
      >
        <Minus className="size-6" strokeWidth={3} />
      </button>
      <div className="egg-display-box">{getEggDisplay(value)}</div>
      <button
        type="button"
        className="egg-btn-circle"
        onClick={onIncrement}
        disabled={disabled}
        aria-label={ariaLabelPlus}
      >
        <Plus className="size-6" strokeWidth={3} />
      </button>
    </div>
  );
}

interface EggNumProps { value: number; className?: string; }
export function EggNum({ value, className }: EggNumProps) {
  return <div className={cn('egg-num-box', className)}>{value}</div>;
}
