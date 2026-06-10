'use client';

import { useEffect, useRef, useState } from 'react';
import { Music, Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { tapHaptic } from '@/lib/haptic';
import { soundTap, soundToggle } from '@/lib/sounds';

interface Track {
  title:  string;
  artist: string;
  src:    string;
}

/**
 * Playlist del Huevómetro — solo desktop.
 * Soltá tus MP3 en /public/music/ con estos nombres y aparecen acá.
 * Si el archivo no existe, el track simplemente no se reproduce.
 */
const TRACKS: Track[] = [
  { title: 'Cumbia Mundialista', artist: 'Bio Huevos FM', src: '/music/track-1.mp3' },
  { title: 'La Tri en el Aire',  artist: 'Bio Huevos FM', src: '/music/track-2.mp3' },
  { title: 'Goles y Plumas',     artist: 'Bio Huevos FM', src: '/music/track-3.mp3' },
];

const STORAGE_KEY = 'huevo-music-state';

interface PersistedState {
  volume?:  number;
  trackIdx?: number;
  open?:    boolean;
}

function loadState(): PersistedState {
  if (typeof localStorage === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveState(state: PersistedState) {
  if (typeof localStorage === 'undefined') return;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
}

export function MusicPlayer() {
  const audioRef       = useRef<HTMLAudioElement>(null);
  const [mounted, setMounted] = useState(false);
  const [open, setOpen]       = useState(false);
  const [playing, setPlaying] = useState(false);
  const [trackIdx, setTrackIdx] = useState(0);
  const [volume, setVolume]   = useState(0.4);
  const [muted, setMuted]     = useState(false);
  const [failed, setFailed]   = useState(false);

  // Hidratar estado persistido (solo cliente, evita hydration mismatch)
  useEffect(() => {
    const s = loadState();
    if (typeof s.volume   === 'number') setVolume(s.volume);
    if (typeof s.trackIdx === 'number' && s.trackIdx < TRACKS.length) setTrackIdx(s.trackIdx);
    if (typeof s.open     === 'boolean') setOpen(s.open);
    setMounted(true);
  }, []);

  // Persistir
  useEffect(() => {
    if (!mounted) return;
    saveState({ volume, trackIdx, open });
  }, [mounted, volume, trackIdx, open]);

  // Volumen efectivo
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = muted ? 0 : volume;
  }, [volume, muted]);

  const track = TRACKS[trackIdx];

  function togglePlay() {
    tapHaptic();
    soundTap();
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      a.play().then(() => setPlaying(true)).catch(() => { setFailed(true); setPlaying(false); });
    } else {
      a.pause();
      setPlaying(false);
    }
  }

  function next() {
    tapHaptic();
    soundTap();
    setTrackIdx((i) => (i + 1) % TRACKS.length);
    setFailed(false);
  }

  function prev() {
    tapHaptic();
    soundTap();
    setTrackIdx((i) => (i - 1 + TRACKS.length) % TRACKS.length);
    setFailed(false);
  }

  function toggleMute() {
    tapHaptic();
    soundTap();
    setMuted((m) => !m);
  }

  function togglePanel() {
    tapHaptic();
    soundToggle();
    setOpen((o) => !o);
  }

  // Auto-play del nuevo track si ya estaba reproduciendo
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.play().catch(() => { setFailed(true); setPlaying(false); });
    }
  }, [trackIdx, playing]);

  if (!mounted || !track) return null;

  return (
    <div
      className="hidden md:flex fixed bottom-6 left-6 z-40 flex-col items-stretch"
      style={{ maxWidth: 320 }}
    >
      <audio
        ref={audioRef}
        src={track.src}
        loop={false}
        onEnded={next}
        onError={() => { setFailed(true); setPlaying(false); }}
        preload="none"
      />

      {/* Panel expandido */}
      {open && (
        <div
          className="rounded-2xl shadow-2xl border-2 p-3 mb-2 backdrop-blur"
          style={{
            background: 'rgba(10, 26, 18, 0.92)',
            borderColor: 'rgba(240,137,37,0.45)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.55), 0 0 0 1px rgba(240,137,37,0.15)',
          }}
        >
          {/* Encabezado */}
          <div className="flex items-center justify-between mb-2.5 px-1">
            <div className="flex items-center gap-2">
              <div className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center',
                playing && !failed && 'animate-pulse',
              )} style={{ background: 'rgba(240,137,37,0.18)' }}>
                <Music className="size-4 text-bio-300" strokeWidth={2.5} />
              </div>
              <div className="text-[10px] font-display font-bold text-bio-300/80 uppercase tracking-widest">
                Huevo FM
              </div>
            </div>
            <button
              onClick={togglePanel}
              aria-label="Cerrar reproductor"
              className="w-7 h-7 rounded-lg flex items-center justify-center text-bio-200/70 hover:text-white hover:bg-white/5 transition"
            >
              <ChevronDown className="size-4" strokeWidth={2.5} />
            </button>
          </div>

          {/* Track info */}
          <div className="px-1 mb-3 min-h-[42px]">
            <div className="font-display font-bold text-sm text-white truncate leading-tight">
              {track.title}
            </div>
            <div className="text-xs text-bio-200/65 truncate mt-0.5">
              {track.artist}
              {failed && <span className="text-red-400 ml-1">· archivo no encontrado</span>}
            </div>
          </div>

          {/* Transport */}
          <div className="flex items-center justify-between gap-1.5 mb-2.5">
            <button
              onClick={prev}
              aria-label="Anterior"
              className="w-10 h-10 rounded-xl flex items-center justify-center text-bio-200 hover:text-white hover:bg-white/5 transition"
            >
              <SkipBack className="size-4" strokeWidth={2.5} />
            </button>
            <button
              onClick={togglePlay}
              aria-label={playing ? 'Pausar' : 'Reproducir'}
              disabled={failed}
              className={cn(
                'flex-1 h-11 rounded-xl flex items-center justify-center gap-2 font-display font-bold text-sm transition border-2',
                playing
                  ? 'bg-gradient-to-br from-bio-400 to-bio-600 text-white border-bio-700'
                  : 'text-bio-200 hover:text-white',
                failed && 'opacity-40 cursor-not-allowed',
              )}
              style={playing ? undefined : {
                background: 'var(--color-bg-3)',
                borderColor: 'var(--color-border)',
              }}
            >
              {playing
                ? <><Pause className="size-4" strokeWidth={3} /> Pausar</>
                : <><Play className="size-4" strokeWidth={3} /> Play</>
              }
            </button>
            <button
              onClick={next}
              aria-label="Siguiente"
              className="w-10 h-10 rounded-xl flex items-center justify-center text-bio-200 hover:text-white hover:bg-white/5 transition"
            >
              <SkipForward className="size-4" strokeWidth={2.5} />
            </button>
          </div>

          {/* Volumen */}
          <div className="flex items-center gap-2 px-1">
            <button
              onClick={toggleMute}
              aria-label={muted ? 'Activar audio' : 'Silenciar'}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-bio-200 hover:text-white transition"
            >
              {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={muted ? 0 : volume}
              onChange={(e) => { setVolume(parseFloat(e.target.value)); setMuted(false); }}
              aria-label="Volumen"
              className="flex-1 accent-bio-400 h-1"
            />
          </div>

          {/* Playlist resumen */}
          <div className="mt-3 pt-2.5 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <div className="flex items-center justify-between text-[10px] font-display font-semibold text-bio-300/70 uppercase tracking-widest px-1 mb-1.5">
              <span>Playlist</span>
              <span>{trackIdx + 1}/{TRACKS.length}</span>
            </div>
            <div className="space-y-0.5">
              {TRACKS.map((t, i) => (
                <button
                  key={t.src}
                  onClick={() => { tapHaptic(); soundTap(); setTrackIdx(i); setFailed(false); }}
                  className={cn(
                    'w-full text-left px-2 py-1.5 rounded-lg text-xs font-display font-semibold transition flex items-center gap-2',
                    i === trackIdx
                      ? 'text-bio-300 bg-bio-500/10'
                      : 'text-bio-200/65 hover:text-white hover:bg-white/5',
                  )}
                >
                  <span className="tabular-nums opacity-50 text-[10px]">{String(i + 1).padStart(2, '0')}</span>
                  <span className="truncate">{t.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Pill / botón flotante */}
      <button
        onClick={togglePanel}
        aria-label={open ? 'Ocultar reproductor' : 'Mostrar reproductor'}
        className={cn(
          'self-start inline-flex items-center gap-2.5 h-12 px-4 rounded-full shadow-xl border-2 font-display font-bold text-sm transition',
          playing
            ? 'bg-gradient-to-br from-bio-400 to-bio-600 text-white border-bio-700'
            : 'text-bio-200 hover:text-white',
        )}
        style={playing ? undefined : {
          background: 'rgba(10, 26, 18, 0.92)',
          borderColor: 'rgba(240,137,37,0.45)',
        }}
      >
        <Music className={cn('size-4', playing && 'animate-pulse')} strokeWidth={2.5} />
        <span className="max-w-[140px] truncate">
          {playing ? track.title : 'Huevo FM'}
        </span>
        {open
          ? <ChevronDown className="size-4 opacity-70" strokeWidth={2.5} />
          : <ChevronUp   className="size-4 opacity-70" strokeWidth={2.5} />
        }
      </button>
    </div>
  );
}
