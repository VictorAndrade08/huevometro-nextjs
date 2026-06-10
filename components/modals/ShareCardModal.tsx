'use client';

import { useRef, useState, useEffect } from 'react';
import { Download, Share2, User, Pencil, X } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useGameStore } from '@/store/gameStore';
import { flagUrl } from '@/lib/teams';
import { soundCelebrate, soundClose, soundPick, soundTap } from '@/lib/sounds';
import { tapHaptic } from '@/lib/haptic';
import type { Match } from '@/types';

interface ShareCardModalProps {
  open:     boolean;
  onClose:  () => void;
  matches:  Match[] | null;
  title:    string;
  onShared: (msg: string, type?: 'ok' | 'warn') => void;
}

/**
 * Cartilla de toda una jornada — una sola imagen para subir a historias.
 * Lista de partidos con bandera + marcador pronosticado + firma del usuario.
 */
export function ShareCardModal({ open, onClose, matches, title, onShared }: ShareCardModalProps) {
  const cardRef       = useRef<HTMLDivElement>(null);
  const userProfile   = useGameStore(s => s.userProfile);
  const predictions   = useGameStore(s => s.predictions);
  const setProfile    = useGameStore(s => s.setProfile);
  const incrementShared = useGameStore(s => s.incrementShared);

  const [editing, setEditing]   = useState(false);
  const [draftName, setDraftName] = useState(userProfile.name || '');
  const [draftIg,   setDraftIg]   = useState(userProfile.ig   || '');

  useEffect(() => {
    if (open) {
      setDraftName(userProfile.name || '');
      setDraftIg(userProfile.ig || '');
      setEditing(false);
      // Fanfare de felicitaciones al abrir la cartilla
      soundCelebrate();
    }
  }, [open, userProfile.name, userProfile.ig]);

  function saveEdit() {
    tapHaptic();
    soundPick();
    setProfile({
      name: draftName.trim(),
      ig:   draftIg.trim().replace(/^@/, ''),
    });
    setEditing(false);
  }

  if (!matches || matches.length === 0) return null;

  function buildFilename() {
    const slugify = (s: string) => s.toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const safeName = slugify(userProfile.name || 'huevometro');
    const slug     = slugify(title);
    return `huevometro-${safeName}-${slug}.png`;
  }

  // Renderiza a EXACTAMENTE 1080×1920 (Instagram Stories) sin importar
  // el tamaño en el que se vea la preview. Calculamos `scale` a partir
  // del width real del preview para que el canvas resultante tenga 1080px de ancho.
  async function renderCanvas() {
    const html2canvas = (await import('html2canvas')).default;
    if (!cardRef.current) return null;
    const previewWidth = cardRef.current.getBoundingClientRect().width;
    if (!previewWidth) return null;
    const targetScale = 1080 / previewWidth;
    return html2canvas(cardRef.current, {
      backgroundColor: null,
      scale: targetScale,
      useCORS: true,
      logging: false,
    });
  }

  async function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
    return new Promise(resolve => canvas.toBlob(b => resolve(b), 'image/png', 0.95));
  }

  // Botón principal — usa Web Share API si está disponible y soporta archivos
  async function handleNativeShare() {
    if (!matches) return;
    tapHaptic();
    soundPick();
    try {
      const canvas = await renderCanvas();
      if (!canvas) throw new Error('canvas null');
      const blob = await canvasToBlob(canvas);
      if (!blob) throw new Error('blob null');

      const file = new File([blob], buildFilename(), { type: 'image/png' });
      const text = `Mi cartilla del Huevómetro: ${title} · @biohuevos_ec`;

      const canShareFile = typeof navigator !== 'undefined' &&
        !!navigator.canShare && navigator.canShare({ files: [file] });

      if (canShareFile && navigator.share) {
        try {
          await navigator.share({ files: [file], text, title: 'Mi cartilla del Huevómetro' });
          incrementShared();
          onShared('¡Listo! Recordá etiquetar @biohuevos_ec');
          return;
        } catch (err) {
          if (err instanceof Error && err.name === 'AbortError') return;
          // si falla por otro motivo caemos al fallback
        }
      }

      // Fallback: descarga la imagen
      const link = document.createElement('a');
      link.download = file.name;
      link.href = URL.createObjectURL(blob);
      link.click();
      setTimeout(() => URL.revokeObjectURL(link.href), 1000);
      incrementShared();
      onShared('Imagen descargada — subila a tu historia y etiquetá @biohuevos_ec');
    } catch (e) {
      console.error(e);
      onShared('No se pudo generar la imagen', 'warn');
    }
  }

  // Botón secundario — siempre descarga
  async function handleDownload() {
    tapHaptic();
    soundTap();
    try {
      const canvas = await renderCanvas();
      if (!canvas) throw new Error('canvas null');
      const link = document.createElement('a');
      link.download = buildFilename();
      link.href = canvas.toDataURL('image/png');
      link.click();
      incrementShared();
      onShared('Imagen descargada');
    } catch (e) {
      console.error(e);
      onShared('No se pudo generar la imagen', 'warn');
    }
  }

  // SIEMPRE Instagram Stories 9:16 (1080×1920 al exportar).
  // Las medidas internas se calculan para que TODO entre — grid con minmax(0,1fr)
  // garantiza que las filas se compriman antes de desbordar.
  const rowCount = matches.length;
  const aspectRatio = '9 / 16';
  // Factor de escala interna basado en la cantidad de partidos (sin ir por debajo
  // de mínimos legibles). Calibrado para 1080×1920.
  const factor      = Math.max(0.55, Math.min(1.25, 1.40 - rowCount * 0.07));
  const teamFont    = Math.max(9,  Math.round(13 * factor));
  const scoreFont   = Math.max(15, Math.round(26 * factor));
  const flagW       = Math.max(20, Math.round(34 * factor));
  const flagH       = Math.max(15, Math.round(24 * factor));
  const rowPadV     = Math.max(4,  Math.round(9  * factor));
  const rowPadH     = Math.max(6,  Math.round(10 * factor));
  const rowGap      = Math.max(3,  Math.round(7  * factor));
  const horizPad    = Math.max(10, Math.round(16 * factor));
  const scorePadH   = Math.max(8,  Math.round(13 * factor));
  const scorePadV   = Math.max(4,  Math.round(6  * factor));
  const scoreMinW   = Math.max(40, Math.round(60 * factor));
  const teamGap     = Math.max(2,  Math.round(4  * factor));
  const cellGap     = Math.max(4,  Math.round(8  * factor));

  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-4">
        <div className="flex justify-between items-center mb-3 px-1">
          <h3 className="font-display text-lg font-bold text-white">Tu cartilla</h3>
          <button
            onClick={() => { tapHaptic(); soundClose(); onClose(); }}
            aria-label="Cerrar"
            className="shrink-0 w-11 h-11 rounded-xl border-2 flex items-center justify-center text-bio-200 hover:text-white hover:bg-red-500 hover:border-red-500 active:scale-90 transition close-x-pulse"
            style={{ background: 'var(--color-bg-3)', borderColor: 'var(--color-border)' }}
          >
            <X className="size-5" strokeWidth={3} />
          </button>
        </div>

        {/* Firma editable */}
        <div className="mb-3 rounded-xl border p-3" style={{ background: 'var(--color-bg-3)', borderColor: 'var(--color-border)' }}>
          {!editing ? (
            <div className="flex items-center gap-2">
              <User className="size-4 text-bio-300 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-display font-semibold text-bio-300 uppercase tracking-wider">Firma de la cartilla</div>
                <div className="font-semibold text-sm text-white truncate">
                  {userProfile.name || 'Sin nombre'}
                  {userProfile.ig && <span className="text-bio-300 font-medium"> · @{userProfile.ig.replace(/^@/,'')}</span>}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-bio-200 text-xs font-display font-semibold transition hover:brightness-125"
                style={{ background: 'var(--color-bg-2)', borderColor: 'var(--color-border)' }}
              >
                <Pencil className="size-3" /> Editar
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div>
                <label className="text-[10px] font-display font-semibold text-bio-300 uppercase tracking-wider">Nombre</label>
                <input
                  type="text"
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  placeholder="Tu nombre"
                  className="w-full mt-1 px-3 py-2 rounded-lg border outline-none text-sm text-white"
                  style={{ background: 'var(--color-bg-2)', borderColor: 'var(--color-border)' }}
                  autoFocus
                />
              </div>
              <div>
                <label className="text-[10px] font-display font-semibold text-bio-300 uppercase tracking-wider">Instagram</label>
                <input
                  type="text"
                  value={draftIg}
                  onChange={(e) => setDraftIg(e.target.value)}
                  placeholder="tuusuario"
                  className="w-full mt-1 px-3 py-2 rounded-lg border outline-none text-sm text-white"
                  style={{ background: 'var(--color-bg-2)', borderColor: 'var(--color-border)' }}
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => { setDraftName(userProfile.name || ''); setDraftIg(userProfile.ig || ''); setEditing(false); }}
                  className="flex-1 px-3 py-2 rounded-lg border text-bio-200 text-xs font-display font-semibold hover:brightness-125 transition"
                  style={{ background: 'var(--color-bg-2)', borderColor: 'var(--color-border)' }}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={saveEdit}
                  className="flex-1 px-3 py-2 rounded-lg bg-bio-500 text-white text-xs font-display font-semibold hover:bg-bio-600 transition"
                >
                  Guardar firma
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Cartilla — formato vertical historia (4:5) */}
        <div
          ref={cardRef}
          style={{
            width: '100%',
            aspectRatio,
            background: '#FBF7EE',
            borderRadius: 20,
            position: 'relative',
            overflow: 'hidden',
            border: '2px solid #F08925',
            fontFamily: 'var(--font-sans)',
            color: '#2A1F12',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* HEADER */}
          <div style={{
            background: 'linear-gradient(90deg, #F08925 0%, #A85912 100%)',
            color: '#fff',
            padding: '12px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            letterSpacing: '0.04em',
            fontSize: 13,
          }}>
            <span>EL HUEVÓMETRO</span>
            <span style={{ opacity: 0.85 }}>MUNDIAL 2026</span>
          </div>

          {/* Título de la jornada */}
          <div style={{ textAlign: 'center', padding: '10px 16px 4px', flexShrink: 0 }}>
            <div style={{
              display: 'inline-block',
              background: '#FFFFFF',
              border: '1.5px solid #FFC684',
              color: '#A85912',
              padding: '3px 12px',
              borderRadius: 999,
              fontSize: 9,
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              letterSpacing: '0.14em',
            }}>
              MI CARTILLA
            </div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: title.length > 30 ? 16 : 20,
              fontWeight: 700,
              color: '#2A1F12',
              letterSpacing: '-0.01em',
              margin: '5px 0 0',
              lineHeight: 1.1,
            }}>
              {title}
            </h2>
          </div>

          {/* Lista de partidos — grid de filas iguales que NUNCA se desbordan */}
          <div style={{
            flex: 1,
            minHeight: 0,
            padding: `${rowGap * 2}px ${horizPad}px`,
            display: 'grid',
            gridTemplateRows: `repeat(${matches.length}, minmax(0, 1fr))`,
            gap: rowGap,
            overflow: 'hidden',
          }}>
            {matches.map(m => {
              const p = predictions[m.id];
              const h = typeof p?.home === 'number' ? p.home : 0;
              const a = typeof p?.away === 'number' ? p.away : 0;
              return (
                <div
                  key={m.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto 1fr',
                    alignItems: 'center',
                    gap: cellGap,
                    background: '#fff',
                    border: '1.5px solid #FFE0B5',
                    borderRadius: 14,
                    padding: `${rowPadV}px ${rowPadH}px`,
                    minHeight: 0,
                    overflow: 'hidden',
                  }}
                >
                  {/* Local — flag arriba, nombre abajo */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: teamGap, minWidth: 0, minHeight: 0 }}>
                    {flagUrl(m.homeFlag, 80) && (
                      <img
                        src={flagUrl(m.homeFlag, 80)}
                        alt={m.homeTeam}
                        crossOrigin="anonymous"
                        style={{ width: flagW, height: flagH, objectFit: 'cover', borderRadius: 3, flexShrink: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }}
                      />
                    )}
                    <span style={{
                      width: '100%',
                      fontSize: teamFont,
                      fontWeight: 700,
                      color: '#2A1F12',
                      textTransform: 'uppercase',
                      letterSpacing: '0.01em',
                      textAlign: 'center',
                      lineHeight: 1.1,
                      wordBreak: 'break-word',
                      overflow: 'hidden',
                    }}>
                      {m.homeTeam}
                    </span>
                  </div>
                  {/* Score — centro */}
                  <div style={{
                    flexShrink: 0,
                    fontFamily: 'var(--font-display)',
                    fontSize: scoreFont,
                    fontWeight: 700,
                    color: '#A85912',
                    background: '#FFF3E2',
                    borderRadius: 12,
                    padding: `${scorePadV}px ${scorePadH}px`,
                    minWidth: scoreMinW,
                    textAlign: 'center',
                    lineHeight: 1,
                    border: '1.5px solid #FFC684',
                  }}>
                    {h}–{a}
                  </div>
                  {/* Visitante — flag arriba, nombre abajo */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: teamGap, minWidth: 0, minHeight: 0 }}>
                    {flagUrl(m.awayFlag, 80) && (
                      <img
                        src={flagUrl(m.awayFlag, 80)}
                        alt={m.awayTeam}
                        crossOrigin="anonymous"
                        style={{ width: flagW, height: flagH, objectFit: 'cover', borderRadius: 3, flexShrink: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }}
                      />
                    )}
                    <span style={{
                      width: '100%',
                      fontSize: teamFont,
                      fontWeight: 700,
                      color: '#2A1F12',
                      textTransform: 'uppercase',
                      letterSpacing: '0.01em',
                      textAlign: 'center',
                      lineHeight: 1.1,
                      wordBreak: 'break-word',
                      overflow: 'hidden',
                    }}>
                      {m.awayTeam}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Firma */}
          <div style={{
            margin: '0 18px',
            padding: '8px 0 4px',
            borderTop: '1.5px dashed #FFC684',
            textAlign: 'center',
            flexShrink: 0,
          }}>
            <div style={{ fontSize: 8, fontFamily: 'var(--font-display)', fontWeight: 600, color: '#A85912', letterSpacing: '0.16em', marginBottom: 1 }}>
              FIRMADO POR
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, color: '#2A1F12', lineHeight: 1.1 }}>
              {(userProfile.name || 'Tu nombre').toUpperCase()}
            </div>
            {userProfile.ig && (
              <div style={{ fontSize: 10, fontWeight: 600, color: '#A85912', marginTop: 1 }}>
                @{userProfile.ig.replace(/^@/, '')}
              </div>
            )}
          </div>

          {/* CTA strip */}
          <div style={{
            background: '#2A1F12',
            color: '#fff',
            padding: '8px 20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'baseline',
            gap: 6,
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            letterSpacing: '0.08em',
            fontSize: 10,
            flexShrink: 0,
          }}>
            <span>ETIQUETÁ</span>
            <span style={{ color: '#FFB458' }}>@biohuevos_ec</span>
            <span>Y GANÁ</span>
          </div>
        </div>

        {/* Acciones */}
        <div className="mt-4 space-y-2">
          <Button onClick={handleDownload} size="lg" block>
            <Download className="size-5" /> Descargar imagen
          </Button>
          <button
            type="button"
            onClick={handleNativeShare}
            className="w-full flex items-center justify-center gap-2 h-11 rounded-2xl border-2 text-bio-200 hover:text-white hover:border-bio-400 transition font-display font-semibold text-sm"
            style={{ background: 'var(--color-bg-3)', borderColor: 'var(--color-border)' }}
          >
            <Share2 className="size-4" /> Compartir cartilla
          </button>
          <p className="text-xs text-bio-200/65 text-center mt-2 leading-relaxed">
            Subila a tu historia y etiquetá <strong className="text-bio-300">@biohuevos_ec</strong> para participar.
          </p>
        </div>
      </div>
    </Modal>
  );
}

