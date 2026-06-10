/**
 * Sonidos cortos generados con Web Audio API.
 * No requiere archivos de audio — todo se sintetiza en el browser.
 * Respeta una preferencia de mute en localStorage (`huevo-mute`).
 */

let _ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (_ctx) return _ctx;
  type WindowWithWebkit = Window & { webkitAudioContext?: typeof AudioContext };
  const w = window as WindowWithWebkit;
  const Ctx = window.AudioContext || w.webkitAudioContext;
  if (!Ctx) return null;
  _ctx = new Ctx();
  return _ctx;
}

function isMuted(): boolean {
  if (typeof localStorage === 'undefined') return false;
  return localStorage.getItem('huevo-mute') === '1';
}

export function setMuted(muted: boolean): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem('huevo-mute', muted ? '1' : '0');
}

export function getMuted(): boolean {
  return isMuted();
}

interface BlipOpts {
  freq:     number;
  duration: number;
  type?:    OscillatorType;
  volume?:  number;
  sweep?:   number; // target frequency for exponential ramp (slide)
}

function blip({ freq, duration, type = 'triangle', volume = 0.18, sweep }: BlipOpts) {
  if (isMuted()) return;
  const ctx = getCtx();
  if (!ctx) return;
  // Si el contexto está suspendido (autoplay policy), intentar resumirlo
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (sweep) osc.frequency.exponentialRampToValueAtTime(sweep, t + duration);
  gain.gain.setValueAtTime(volume, t);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + duration);
}

/** Click corto y suave para +/- de goles. */
export function soundTap(): void {
  blip({ freq: 520, duration: 0.07, type: 'triangle', volume: 0.14 });
}

/** Click más alto para quick-picks (1-0, 2-1, etc). */
export function soundPick(): void {
  blip({ freq: 720, duration: 0.09, type: 'triangle', volume: 0.18, sweep: 900 });
}

/** Pequeño "swoosh" descendente para borrar. */
export function soundClear(): void {
  blip({ freq: 480, duration: 0.10, type: 'sine', volume: 0.12, sweep: 220 });
}

/** Tono de éxito para cuando la jornada queda completa. */
export function soundComplete(): void {
  blip({ freq: 660,  duration: 0.10, type: 'triangle', volume: 0.18, sweep: 880 });
  setTimeout(() => blip({ freq: 880, duration: 0.16, type: 'triangle', volume: 0.20, sweep: 1320 }), 90);
}

/** Fanfare ascendente — para cuando se abre la cartilla / felicitación. */
export function soundCelebrate(): void {
  blip({ freq: 523, duration: 0.12, type: 'triangle', volume: 0.18 });                   // C5
  setTimeout(() => blip({ freq: 659, duration: 0.12, type: 'triangle', volume: 0.19 }), 100); // E5
  setTimeout(() => blip({ freq: 784, duration: 0.14, type: 'triangle', volume: 0.20 }), 200); // G5
  setTimeout(() => blip({ freq: 1047, duration: 0.26, type: 'triangle', volume: 0.22, sweep: 1175 }), 320); // C6 → D6
}

/** Toggle/abrir suave para acordeones y modales. */
export function soundToggle(): void {
  blip({ freq: 420, duration: 0.08, type: 'sine', volume: 0.12, sweep: 560 });
}

/** Cierre de modal — swoosh descendente corto. */
export function soundClose(): void {
  blip({ freq: 620, duration: 0.09, type: 'sine', volume: 0.12, sweep: 320 });
}
