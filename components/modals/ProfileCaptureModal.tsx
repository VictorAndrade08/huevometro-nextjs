'use client';

import { useState, FormEvent } from 'react';
import { User, Instagram, Trophy, X } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useGameStore } from '@/store/gameStore';
import { tapHaptic } from '@/lib/haptic';
import { soundClose, soundPick } from '@/lib/sounds';

interface ProfileCaptureModalProps {
  open:        boolean;
  onClose:     () => void;
  onComplete:  () => void;
  picksCount:  number;
}

export function ProfileCaptureModal({ open, onClose, onComplete, picksCount }: ProfileCaptureModalProps) {
  const profile    = useGameStore(s => s.userProfile);
  const setProfile = useGameStore(s => s.setProfile);

  const [name, setName] = useState(profile.name ?? '');
  const [ig,   setIg]   = useState(profile.ig   ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 2) e.name = 'Ingresá tu nombre';
    if (!ig.trim() || ig.trim().replace(/^@/, '').length < 2) e.ig = 'Tu usuario de Instagram';
    return e;
  }

  function handleSubmit(ev: FormEvent) {
    ev.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    tapHaptic();
    soundPick();
    setProfile({
      name: name.trim(),
      ig:   ig.trim().replace(/^@/, ''),
    });
    onComplete();
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-5">
        <div className="flex justify-between items-start mb-1">
          <div>
            <div className="text-[10px] tracking-[0.18em] font-bold text-bio-300/70 uppercase">Antes de compartir</div>
            <h2 className="font-display text-2xl font-bold text-white leading-tight mt-0.5">Tus datos</h2>
          </div>
          <button
            onClick={() => { tapHaptic(); soundClose(); onClose(); }}
            aria-label="Cerrar"
            className="shrink-0 w-11 h-11 rounded-xl border-2 flex items-center justify-center text-bio-200 hover:text-white hover:bg-red-500 hover:border-red-500 active:scale-90 transition close-x-pulse"
            style={{ background: 'var(--color-bg-3)', borderColor: 'var(--color-border)' }}
          >
            <X className="size-5" strokeWidth={3} />
          </button>
        </div>
        <p className="text-xs text-bio-200/65 mt-1 leading-relaxed">
          {picksCount} pronóstico{picksCount === 1 ? '' : 's'} listo{picksCount === 1 ? '' : 's'} · Para ponerte en tu cartilla y contactarte si ganás.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <Field
            icon={<User className="size-4" />}
            label="Nombre"
            value={name}
            onChange={setName}
            placeholder="Tu nombre"
            required
            error={errors.name}
          />
          <Field
            icon={<Instagram className="size-4" />}
            label="Instagram"
            value={ig}
            onChange={setIg}
            placeholder="tuusuario"
            required
            error={errors.ig}
          />

          <div
            className="rounded-xl p-3 flex gap-2.5 mt-4 border"
            style={{ background: 'var(--color-bg-3)', borderColor: 'var(--color-border)' }}
          >
            <Trophy className="size-4 text-bio-300 shrink-0 mt-0.5" />
            <div className="text-[12px] text-bio-100 leading-relaxed">
              Subí tu cartilla a tu historia y etiquetá <strong className="text-bio-300">@biohuevos_ec</strong> para participar por el kit.
            </div>
          </div>

          <Button type="submit" size="md" block>
            Generar cartilla
          </Button>
        </form>
      </div>
    </Modal>
  );
}

interface FieldProps {
  icon:        React.ReactNode;
  label:       string;
  hint?:       string;
  type?:       string;
  value:       string;
  onChange:    (v: string) => void;
  placeholder: string;
  required?:   boolean;
  error?:      string;
}

function Field({ icon, label, hint, type = 'text', value, onChange, placeholder, required, error }: FieldProps) {
  return (
    <div>
      <label className="flex items-baseline justify-between text-[12px] font-display font-semibold text-bio-200 mb-1 px-1">
        <span>{label}{required && <span className="text-bio-400"> *</span>}</span>
        {hint && <span className="text-bio-200/40 font-normal text-[11px]">{hint}</span>}
      </label>
      <div
        className={`relative flex items-center rounded-xl border-2 transition ${
          error ? 'border-red-400/60 focus-within:border-red-400' : 'focus-within:border-bio-500'
        }`}
        style={{
          background: 'var(--color-bg-3)',
          borderColor: error ? undefined : 'var(--color-border)',
        }}
      >
        <span className="pl-3 text-bio-300 shrink-0">{icon}</span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="w-full px-2.5 py-3 bg-transparent outline-none text-sm text-white placeholder:text-bio-200/30"
        />
      </div>
      {error && <p className="text-[11px] text-red-400 mt-1 font-semibold px-1">{error}</p>}
    </div>
  );
}
